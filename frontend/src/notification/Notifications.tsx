import { useNavigate } from "react-router-dom";
import { NotificationsType, useAquaSenseContext } from "../Context.tsx";

export default function Notification() {
  const navigate = useNavigate();
  const { notifications, putNotification, deleteNotification } =
    useAquaSenseContext();

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

  async function handleDelete(id: number) {
    try {
      await deleteNotification(id);
    } catch (error) {
      console.error(error);
    }
  }

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
    <div className="modal fade" id="notifications">
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="notificationsModal">
              Notifications
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            />
          </div>
          <div className="modal-body d-flex flex-column gap-3 mb-2">
            {notifications.length > 0 ? (
              notifications.map((notification: NotificationsType) => (
                <div
                  key={notification.id}
                  className={`d-flex flex-column rounded align-items-center list-group-item p-2 ${
                    notification.viewed ? "bg-light" : "bg-body-secondary"
                  }`}
                >
                  <div>
                    <h6 className="fw-medium mb-1" style={{ fontSize: "14px" }}>
                      {getMessage(notification.type, notification.port)}
                    </h6>
                  </div>
                  <div className="d-flex w-100 justify-content-between">
                    <div className="d-flex align-items-center">
                      {!notification.viewed ? (
                        <span
                          className="rounded-circle me-1"
                          style={{
                            backgroundColor: "red",
                            height: "7px",
                            width: "7px",
                          }}
                        />
                      ) : null}
                      <small
                        className="text-muted"
                        style={{ fontSize: "12px" }}
                      >
                        {notification.timestamp.toLocaleString()}
                      </small>
                    </div>
                    <div>
                      <button
                        className="btn btn-sm btn-danger me-1 py-0"
                        data-bs-dismiss="modal"
                        onClick={() => handleDelete(notification.id)}
                      >
                        Delete
                      </button>
                      <button
                        className="btn btn-sm btn-primary py-0"
                        data-bs-dismiss="modal"
                        onClick={() => handleNotification(notification)}
                      >
                        Handle
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted">No new notifications</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
