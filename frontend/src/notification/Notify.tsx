import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Toast } from "bootstrap";
import notification from "../assets/notification.mp3";
import { NotificationsType, useAquaSenseContext } from "../Context";

// component props
type NotifyProps = {
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  prompt: string;
};

export default function Notify({ setPrompt, prompt }: NotifyProps) {
  const navigate = useNavigate();
  const { notifications, putNotification } = useAquaSenseContext();
  const audio = new Audio(notification);

  function getMessage(type: number, port: number) {
    switch (type) {
      case 1:
        return `Channel ${port} has been activated by the local server. Please assign an ADC Formula and proceed with sensor configuration.`;
      case 2:
        return `Channel ${port} suddenly became inactive while on display. Please check for connection issues`;
      case 3:
        return `Channel ${port}'s current reading has exceeded the upper threshold. Automated actuation has been triggered.`;
      case 4:
        return `Channel ${port}'s current reading has exceeded the lower threshold. Automated actuation has been triggered.`;
      case 5:
        return `The predicted value of Channel ${port} in the next 30 minutes is expected to exceed the threshold. Would you like to initiate actuation now?`;
      default:
        return "Error: Unrecognized notification. Please ignore this message.";
    }
  }

  // display notifications toasts
  useEffect(() => {
    const notificationToasts = document.querySelectorAll(".toast");
    notificationToasts.forEach((notificationToast) => {
      const toastInstance = Toast.getOrCreateInstance(notificationToast);
      toastInstance.show();
      audio.play();
    });
  }, [notifications]);

  // handle prompt toast with timeout
  useEffect(() => {
    if (prompt) {
      const promptToast = document.getElementById("prompt");
      if (promptToast) {
        const promptInstance = Toast.getOrCreateInstance(promptToast);
        promptInstance.show();

        const timeout = setTimeout(() => {
          setPrompt("");
        }, 3000);

        return () => clearTimeout(timeout);
      }
    }
  }, [prompt, setPrompt]);

  // if the notifications have been handled, it will set viewed to true
  async function handleNotification(notification: NotificationsType) {
    try {
      await putNotification(notification.id, {
        id: notification.id,
        port_number: notification.port,
        type: notification.type,
        viewed: true,
        time: notification.timestamp,
      });
      navigate(`port-details?index=${notification.port}`);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="toast-container position-fixed bottom-0 end-0 p-3 mb-5 mb-md-0">
      {/* Notification Toasts */}
      {notifications.map(
        (notification) =>
          !notification.viewed && (
            <div
              key={notification.id}
              id="notification"
              className="toast mb-3"
              role="alert"
              data-bs-autohide="false"
            >
              <div className="toast-header d-flex justify-content-between">
                <div className="d-flex align-items-center">
                  <i className="bi bi-exclamation-circle-fill text-primary" />
                  <strong className="text-black ms-2">Notification</strong>
                </div>
                <div className="d-flex align-items-center">
                  <small className="text-body-secondary">
                    {new Date(notification.timestamp).toLocaleString()}
                  </small>
                </div>
              </div>
              <div className="toast-body">
                {getMessage(notification.type, notification.port)}
              </div>
              <div className="d-flex justify-content-end m-1 p-1 gap-1 border-top">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  data-bs-dismiss="toast"
                >
                  Ignore
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  data-bs-dismiss="toast"
                  onClick={() => handleNotification(notification)}
                >
                  Handle
                </button>
              </div>
            </div>
          )
      )}
      {/* Instantaneous Prompt Toasts */}
      {prompt && (
        <div id="prompt" className="toast mb-3" role="alert">
          <div className="toast-header d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <i className="bi bi-exclamation-circle-fill text-primary" />
              <strong className="text-black ms-2">Notification</strong>
            </div>
            <div className="d-flex align-items-center">
              <small className="text-body-secondary">just now</small>
            </div>
          </div>
          <div className="toast-body">{prompt}</div>
          <div className="d-flex justify-content-end m-1 p-1 gap-1 border-top">
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              data-bs-dismiss="toast"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
