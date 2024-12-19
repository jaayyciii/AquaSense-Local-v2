import { useNavigate } from "react-router-dom";
import { useAquaSenseContext } from "../Context";

export default function NavPanel() {
  const navigate = useNavigate();
  const { notifications } = useAquaSenseContext();
  return (
    <div
      className="d-flex flex-column fixed-top bg-primary shadow text-white pb-3 px-4"
      style={{ height: "100%", width: "260px" }}
    >
      <div style={{ height: "55px" }} />
      <div className="d-flex flex-column flex-grow-1 justify-content-between mt-4">
        <div>
          {/* Upper Buttons */}
          <button
            className="btn btn-primary d-flex align-items-center fw-medium px-2 py-1 w-100"
            style={{ fontSize: "1.1em" }}
            onClick={() => navigate("/")}
          >
            <i className="bi bi-grid me-3" style={{ fontSize: "20px" }} />
            Home
          </button>
          <button
            className="btn btn-primary d-flex align-items-center fw-medium px-2 py-1 w-100"
            style={{ fontSize: "1.1em" }}
            onClick={() => navigate("/location")}
          >
            <i className="bi bi-compass me-3" style={{ fontSize: "20px" }} />
            Location
          </button>
          <button
            className="btn btn-primary d-flex align-items-center fw-medium position-relative px-2 py-1 w-100"
            style={{ fontSize: "1.1em" }}
            data-bs-toggle="modal"
            data-bs-target="#notifications"
          >
            <i className="bi bi-bell me-3" style={{ fontSize: "20px" }} />
            Notifications
            {notifications.filter((notification) => !notification.viewed)
              .length > 0 && (
              <span
                className="badge text-bg-secondary"
                style={{
                  fontSize: "0.75em",
                  marginLeft: "35px",
                  padding: "0.2em 0.4em",
                }}
              >
                {
                  notifications.filter((notification) => !notification.viewed)
                    .length
                }
              </span>
            )}
          </button>
          <button
            className="btn btn-primary d-flex align-items-center fw-medium px-2 py-1 w-100"
            style={{ fontSize: "1.1em" }}
            onClick={() => navigate("/sensor-calibration")}
          >
            <i className="bi bi-plugin me-3" style={{ fontSize: "20px" }} />
            Calibration
          </button>
          <button
            className="btn btn-primary d-flex align-items-center fw-medium px-2 py-1 w-100"
            style={{ fontSize: "1.1em" }}
            onClick={() => navigate("/admin-controls")}
          >
            <i className="bi bi-archive me-3" style={{ fontSize: "20px" }} />
            Admin Controls
          </button>
        </div>
        <div>
          {/* Lower Buttons */}
          <div>
            <button
              className="btn btn-primary d-flex align-items-center fw-medium
           px-2 py-1 w-100"
              style={{ fontSize: "1.1em" }}
              onClick={() => navigate("/help-center")}
            >
              <i
                className="bi bi-question-circle me-3"
                style={{ fontSize: "20px" }}
              />
              Help Center
            </button>
          </div>
          <div
            className="d-flex flex-column justify-content-between small text-light w-100 mt-3"
            style={{ fontSize: "11px" }}
          >
            <div>
              <a href="#" className="text-light text-decoration-none me-2">
                Terms & Conditions
              </a>
              <a href="#" className="text-light text-decoration-none">
                About
              </a>
            </div>
            <div>AquaSense © 2024. All rights reserved.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
