import { createContext, useContext, useState, useEffect, useRef } from "react";

export type PortConfigurationType = {
  port: number;
  define: string;
  active: boolean;
  display: boolean;
  range: [number, number];
  threshold: [number, number];
  timestamp: Date;
  unit: string;
  formula_number: number;
};

export type CurrentValuesType = {
  timestamp: Date;
  values: [number, number, number, number, number, number, number, number];
};

export type ActuationType = {
  actuate: boolean;
  control: boolean;
  command: string;
};

export type HistoryType = {
  time: Date;
  value: number;
};

export type NotificationsType = {
  id: number;
  port: number;
  type: number;
  viewed: boolean;
  timestamp: Date;
};

export type FormulaType = {
  formula_number: number;
  name: string;
  formula: string;
};

export type ConnType = {
  server_conn: number;
  device_conn: number;
  ip_address: string;
  port: string;
  ssid: string;
  password: string;
};

interface AquaSenseContextProps {
  isServerAlive: boolean;
  isFetching: boolean;
  portConfigurations: PortConfigurationType[];
  setPortConfigurations: (set: PortConfigurationType[]) => void;
  putPortConfiguration: (port: number, content: any) => Promise<void>;
  postFirebaseTimestamp: (port: number, timestamp: string) => Promise<void>;
  currentValues: CurrentValuesType;
  setCurrentValues: (set: CurrentValuesType) => void;
  actuationStatus: ActuationType;
  setActuationStatus: (set: ActuationType) => void;
  putActuationStatus: (content: any) => Promise<void>;
  getHistory: (port: number) => Promise<HistoryType[]>;
  notifications: NotificationsType[];
  putNotification: (id: number, content: any) => Promise<void>;
  postNotification: (content: any) => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
  formulas: FormulaType[];
  deleteFormula: (id: number) => Promise<void>;
  conn: ConnType;
}

const AquaSenseContext = createContext<AquaSenseContextProps | undefined>(
  undefined
);

export function useAquaSenseContext() {
  const context = useContext(AquaSenseContext);
  if (!context) {
    throw new Error(
      "useAquaSenseContext must be used within AquaSenseProvider"
    );
  }
  return context;
}

export function AquaSenseProvider({ children }: React.PropsWithChildren<{}>) {
  const [portConfigurations, setPortConfigurations] = useState<
    PortConfigurationType[]
  >([
    {
      port: 0,
      define: "",
      unit: "",
      active: false,
      display: false,
      range: [0, 0],
      threshold: [0, 0],
      timestamp: new Date(),
      formula_number: 0,
    },
    {
      port: 1,
      define: "",
      unit: "",
      active: false,
      display: false,
      range: [0, 0],
      threshold: [0, 0],
      timestamp: new Date(),
      formula_number: 0,
    },
    {
      port: 2,
      define: "",
      unit: "",
      active: false,
      display: false,
      range: [0, 0],
      threshold: [0, 0],
      timestamp: new Date(),
      formula_number: 0,
    },
    {
      port: 3,
      define: "",
      unit: "",
      active: false,
      display: false,
      range: [0, 0],
      threshold: [0, 0],
      timestamp: new Date(),
      formula_number: 0,
    },
    {
      port: 4,
      define: "",
      unit: "",
      active: false,
      display: false,
      range: [0, 0],
      threshold: [0, 0],
      timestamp: new Date(),
      formula_number: 0,
    },
    {
      port: 5,
      define: "",
      unit: "",
      active: false,
      display: false,
      range: [0, 0],
      threshold: [0, 0],
      timestamp: new Date(),
      formula_number: 0,
    },
    {
      port: 6,
      define: "",
      unit: "",
      active: false,
      display: false,
      range: [0, 0],
      threshold: [0, 0],
      timestamp: new Date(),
      formula_number: 0,
    },
    {
      port: 7,
      define: "",
      unit: "",
      active: false,
      display: false,
      range: [0, 0],
      threshold: [0, 0],
      timestamp: new Date(),
      formula_number: 0,
    },
  ]);
  const [currentValues, setCurrentValues] = useState<CurrentValuesType>({
    timestamp: new Date(),
    values: [0, 0, 0, 0, 0, 0, 0, 0],
  });
  const [actuationStatus, setActuationStatus] = useState<ActuationType>({
    actuate: false,
    control: false,
    command: "C",
  });
  const [notifications, setNotifications] = useState<NotificationsType[]>([]);
  const [formulas, setFormulas] = useState<FormulaType[]>([]);
  const [conn, setConn] = useState<ConnType>({
    server_conn: 0,
    device_conn: 0,
    ip_address: "",
    port: "",
    ssid: "",
    password: "",
  });
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [isServerAlive, setIsServerAlive] = useState<boolean>(true);
  const lastHeartbeatRef = useRef(Date.now());

  // retrieves the existing port configurations
  async function getPortConfigurations() {
    try {
      const response = await fetch(`http://localhost:8000/configuration-data/`);
      if (!response.ok) {
        throw new Error("Failed to fetch port configurations");
      }
      const snapshot = await response.json();
      setPortConfigurations(
        portConfigurations.map((config) => {
          const snapshotData = snapshot.find(
            (snapshotData: any) => snapshotData.port_number === config.port
          );
          return {
            ...config,
            define: snapshotData.name,
            unit: snapshotData.unit,
            active: snapshotData.active,
            display: snapshotData.display,
            range: [
              Number(snapshotData.range_min),
              Number(snapshotData.range_max),
            ],
            threshold: [
              Number(snapshotData.thresh_min),
              Number(snapshotData.thresh_max),
            ],
            timestamp: new Date(snapshotData.time),
            formula_number: snapshotData.formula_number,
          };
        })
      );
    } catch (error) {
      console.error(error);
    }
  }

  // retrieves the realtime values
  async function getCurrentValues() {
    try {
      const response = await fetch(`http://localhost:8000/current-values/`);
      if (!response.ok) {
        throw new Error("Failed to fetch current values");
      }
      const data = await response.json();
      setCurrentValues({
        timestamp: new Date(data.time),
        values: [
          data.port0,
          data.port1,
          data.port2,
          data.port3,
          data.port4,
          data.port5,
          data.port6,
          data.port7,
        ],
      });
    } catch (error) {
      console.error(error);
    }
  }

  // retrieves the actuation status
  async function getActuationStatus() {
    try {
      const response = await fetch(`http://localhost:8000/actuation-data/`);
      if (!response.ok) {
        throw new Error("Failed to fetch actuation status");
      }
      const data = await response.json();
      setActuationStatus({
        actuate: data.actuate,
        control: data.control,
        command: data.command,
      });
    } catch (error) {
      console.error(error);
    }
  }

  // retrieves the history of an active port
  async function getHistory(port: number) {
    try {
      const response = await fetch(`http://localhost:8000/history/${port}/`);
      if (!response.ok) {
        throw new Error("Failed to fetch history");
      }
      const data: HistoryType[] = await response.json();
      return data.map((record: any) => ({
        time: new Date(record.time),
        value: record.value,
      }));
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  // retrieves all written notifications
  async function getNotifications() {
    try {
      const response = await fetch(`http://localhost:8000/notification-data/`);
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      const data = await response.json();
      setNotifications(
        data.map((item: any) => {
          return {
            id: item.id,
            port: item.port_number,
            type: item.type,
            viewed: item.viewed,
            timestamp: new Date(item.time),
          };
        })
      );
    } catch (error) {
      console.error(error);
    }
  }

  // retrieves all written formulas
  async function getFormulas() {
    try {
      const response = await fetch(`http://localhost:8000/formula-data/`);
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      const data = await response.json();
      setFormulas(
        data.map((item: any) => {
          return {
            formula_number: item.formula_number,
            name: item.name,
            formula: item.formula,
          };
        })
      );
    } catch (error) {
      console.error(error);
    }
  }

  // retrieves server connection status
  async function getConn() {
    try {
      const response = await fetch(`http://localhost:8000/server-data/`);
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      const data = await response.json();
      setConn({
        server_conn: data.server_conn,
        device_conn: data.device_conn,
        ip_address: data.ip_address,
        port: data.port,
        ssid: data.ssid,
        password: data.password,
      });
    } catch (error) {
      console.error(error);
    }
  }

  // initialize
  useEffect(() => {
    const initializeData = async () => {
      setIsFetching(true);
      try {
        await Promise.all([
          getPortConfigurations(),
          getCurrentValues(),
          getActuationStatus(),
          getNotifications(),
          getFormulas(),
          getConn(),
        ]);
        setIsFetching(false);
      } catch (error) {
        console.error("Error initializing data:", error);
      }
    };

    initializeData();
  }, []);

  // modifies the configuration of the specified port channel
  async function putPortConfiguration(port: number, content: any) {
    try {
      const response = await fetch(
        `http://localhost:8000/configuration-data/${port}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(content),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to put configuration");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // sends trigger/ terminate commands to the server
  async function putActuationStatus(content: any) {
    try {
      const response = await fetch(`http://localhost:8000/actuate-data/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(content),
      });

      if (!response.ok) {
        throw new Error("Failed to put actuation status");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // modifies the notification status
  async function putNotification(id: number, content: any) {
    try {
      const response = await fetch(
        `http://localhost:8000/notification-data/${id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(content),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to put notification status");
      }
      setNotifications([]);
      getNotifications();
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // updates the firebase timestamp for reference
  async function postFirebaseTimestamp(port: number, timestamp: string) {
    try {
      const response = await fetch(
        `http://localhost:8000/set-timestamp/${port}/?timestamp=${timestamp}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to post firebase timestamp");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function postNotification(content: any) {
    try {
      const response = await fetch(`http://localhost:8000/notification-data/`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(content),
      });
      if (!response.ok) {
        throw new Error("Failed to post notification status");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // deletes a particular notification
  async function deleteNotification(id: number) {
    try {
      const response = await fetch(
        `http://localhost:8000/notification-data/${id}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }
      setNotifications([]);
      getNotifications();
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // deletes an adc formula
  async function deleteFormula(id: number) {
    try {
      const response = await fetch(
        `http://localhost:8000/formula-data/${id}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete formula");
      }
      setFormulas([]);
      getFormulas();
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // websocket for port configuration updates
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws-config-data/");
    ws.onmessage = (e) => {
      const snapshot = JSON.parse(e.data);
      if (snapshot && !snapshot.heartbeat) {
        setPortConfigurations([
          {
            port: 0,
            define: "",
            unit: "",
            active: false,
            display: false,
            range: [0, 0],
            threshold: [0, 0],
            timestamp: new Date(),
            formula_number: 0,
          },
          {
            port: 1,
            define: "",
            unit: "",
            active: false,
            display: false,
            range: [0, 0],
            threshold: [0, 0],
            timestamp: new Date(),
            formula_number: 0,
          },
          {
            port: 2,
            define: "",
            unit: "",
            active: false,
            display: false,
            range: [0, 0],
            threshold: [0, 0],
            timestamp: new Date(),
            formula_number: 0,
          },
          {
            port: 3,
            define: "",
            unit: "",
            active: false,
            display: false,
            range: [0, 0],
            threshold: [0, 0],
            timestamp: new Date(),
            formula_number: 0,
          },
          {
            port: 4,
            define: "",
            unit: "",
            active: false,
            display: false,
            range: [0, 0],
            threshold: [0, 0],
            timestamp: new Date(),
            formula_number: 0,
          },
          {
            port: 5,
            define: "",
            unit: "",
            active: false,
            display: false,
            range: [0, 0],
            threshold: [0, 0],
            timestamp: new Date(),
            formula_number: 0,
          },
          {
            port: 6,
            define: "",
            unit: "",
            active: false,
            display: false,
            range: [0, 0],
            threshold: [0, 0],
            timestamp: new Date(),
            formula_number: 0,
          },
          {
            port: 7,
            define: "",
            unit: "",
            active: false,
            display: false,
            range: [0, 0],
            threshold: [0, 0],
            timestamp: new Date(),
            formula_number: 0,
          },
        ]);
        getPortConfigurations();
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  // websocket for current sensor reading
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws-current-value/");
    ws.onmessage = (e) => {
      const snapshot = JSON.parse(e.data);
      if (snapshot && !snapshot.heartbeat) {
        setCurrentValues({
          timestamp: new Date(snapshot.time),
          values: [
            snapshot.port0,
            snapshot.port1,
            snapshot.port2,
            snapshot.port3,
            snapshot.port4,
            snapshot.port5,
            snapshot.port6,
            snapshot.port7,
          ],
        });
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  // websocket for actuation status
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws-actuation-data/");
    ws.onmessage = (e) => {
      const snapshot = JSON.parse(e.data);
      if (snapshot && !snapshot.heartbeat) {
        setActuationStatus({
          actuate: snapshot.actuate,
          control: snapshot.control,
          command: snapshot.command,
        });
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  // websocket for notifications/ alerts
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws-notifications/");
    ws.onmessage = (e) => {
      const snapshot = JSON.parse(e.data);
      if (snapshot && !snapshot.heartbeat) {
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          {
            id: snapshot.id,
            port: snapshot.port_number,
            type: snapshot.type,
            viewed: snapshot.viewed,
            timestamp: new Date(snapshot.time),
          },
        ]);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  // websocket for formula data updates
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws-formula-data/");
    ws.onmessage = (e) => {
      const snapshot = JSON.parse(e.data);
      if (snapshot && !snapshot.heartbeat) {
        setFormulas((prevFormulas) => [
          ...prevFormulas,
          {
            formula_number: snapshot.formula_number,
            name: snapshot.name,
            formula: snapshot.formula,
          },
        ]);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  // websocket for server connection status updates
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws-server-data/");
    ws.onmessage = (e) => {
      const snapshot = JSON.parse(e.data);
      if (snapshot && !snapshot.heartbeat) {
        setConn({
          server_conn: snapshot.server_conn,
          device_conn: snapshot.device_conn,
          ip_address: snapshot.ip_address,
          port: snapshot.port,
          ssid: snapshot.ssid,
          password: snapshot.password,
        });
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  // websocket for server heartbeat
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws-heartbeat/");
    ws.onmessage = (e) => {
      const snapshot = JSON.parse(e.data);
      if (!!snapshot.heartbeat) {
        setIsServerAlive(true);
        lastHeartbeatRef.current = Date.now();
      }
    };

    ws.onclose = () => {
      setIsServerAlive(false);
    };

    const checkHeartbeat = setInterval(() => {
      if (Date.now() - lastHeartbeatRef.current > 10000) {
        setIsServerAlive(false);
      }
    }, 5000);

    return () => {
      clearInterval(checkHeartbeat);
      ws.close();
    };
  }, []);

  const value = {
    isServerAlive,
    isFetching,
    portConfigurations,
    setPortConfigurations,
    putPortConfiguration,
    postFirebaseTimestamp,
    currentValues,
    setCurrentValues,
    actuationStatus,
    setActuationStatus,
    putActuationStatus,
    getHistory,
    notifications,
    putNotification,
    postNotification,
    deleteNotification,
    formulas,
    deleteFormula,
    conn,
  };

  return (
    <AquaSenseContext.Provider value={value}>
      {!isFetching && children}
    </AquaSenseContext.Provider>
  );
}
