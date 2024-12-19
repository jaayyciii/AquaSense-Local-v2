const { app, BrowserWindow } = require("electron");
const { spawn, execSync } = require("child_process");
const path = require("path");
const httpServer = require("http-server");
const http = require("http");

if (!app.requestSingleInstanceLock()) {
  app.quit();
  return;
}

let mainWindow;
let backendProcess;
let server;
let healthCheckRetries = 0;
let healthCheckSuccessCount = 0;
const maxHealthCheckRetries = 100;
const requiredSuccessesBeforeLaunch = 3;

// Create the main application window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    icon: path.join(__dirname, "assets/logo.ico"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  const url = "http://localhost:8080";
  mainWindow.loadURL(url);

  mainWindow.webContents.once("did-fail-load", () => {
    mainWindow.reload();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
    terminateApp();
  });
}

// Start the backend service
function startBackend() {
  try {
    const processName = "aquasense_api";
    const command =
      process.platform === "win32"
        ? `taskkill /IM ${processName}.exe /F`
        : process.platform === "darwin" || process.platform === "linux"
        ? `pkill -f ${processName}`
        : null;

    if (command) {
      execSync(command);
    }
  } catch {
    // No duplicate backend processes to kill
  }

  const backendPath =
    process.platform === "win32"
      ? path.join(process.resourcesPath, "aquasense_api.exe")
      : path.join(process.resourcesPath, "aquasense_api");

  backendProcess = spawn(backendPath, [], { stdio: "pipe" });

  backendProcess.on("error", () => terminateApp());
  backendProcess.on("close", () => terminateApp());
}

// Start the HTTP server for the frontend
function startHttpServer() {
  const serverInstance = httpServer.createServer({
    root: path.join(__dirname, "../frontend/dist"),
  });

  serverInstance.listen(8080, (err) => {
    if (err && err.code === "EADDRINUSE") {
      console.error("Port 8080 in use.");
      terminateApp();
    } else {
      server = serverInstance;
      checkBackendHealth();
    }
  });
}

// Check if the backend is running
function checkBackendHealth() {
  http
    .get("http://localhost:8000/health", (res) => {
      if (res.statusCode === 200) {
        healthCheckSuccessCount++;
        if (healthCheckSuccessCount >= requiredSuccessesBeforeLaunch) {
          createWindow();
        } else {
          retryHealthCheck();
        }
      } else {
        retryHealthCheck();
      }
    })
    .on("error", () => retryHealthCheck());
}

// Retry health check with exponential backoff
let healthCheckTimeout;
function retryHealthCheck() {
  healthCheckRetries++;
  const delay = Math.min(Math.pow(2, healthCheckRetries) * 100, 1000);
  if (healthCheckRetries < maxHealthCheckRetries) {
    healthCheckTimeout = setTimeout(checkBackendHealth, delay);
  } else {
    console.error("Backend health check failed.");
    terminateApp();
  }
}

// Clean up resources and exit
function terminateApp() {
  if (healthCheckTimeout) clearTimeout(healthCheckTimeout);
  if (backendProcess && !backendProcess.killed) {
    try {
      backendProcess.kill("SIGTERM");
      setTimeout(() => {
        if (!backendProcess.killed) backendProcess.kill("SIGKILL");
      }, 1000);
    } catch {
      // Ignore errors while killing
    }
  }
  if (server) server.close();
  app.quit();
}

app.whenReady().then(() => {
  startBackend();
  startHttpServer();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  terminateApp();
  if (process.platform !== "darwin") app.quit();
});
