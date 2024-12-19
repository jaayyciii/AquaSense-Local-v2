import { useState } from "react";
import module from "../assets/module.png";
import calibration from "../assets/calibration.png";

export default function Calibration() {
  const [page, setPage] = useState<number>(1);
  const totalPages = 3;

  return (
    <div className="w-100">
      <h4 className="text-primary-emphasis mb-2" id="sensorcalibration">
        <i className="bi bi-plugin me-2" style={{ fontSize: "24px" }} />
        Sensor Calibration
      </h4>
      <p className="fw-light my-3" style={{ fontSize: "16px" }}>
        Need help setting up your sensors? Follow this guide to connect,
        configure, and calibrate sensors effectively using the Calibration
        Module.
      </p>
      <p className="fw-medium my-3" style={{ fontSize: "14px" }}>
        Prerequisites:
      </p>
      <ol style={{ fontSize: "14px" }}>
        <li className="mb-1">
          The calibration module must be prepared and ready for use.
        </li>
        <li className="mb-1">At least one sensor ready for calibration.</li>
      </ol>
      <p className="fw-medium my-3" style={{ fontSize: "14px" }}>
        In this article:
      </p>
      <ol style={{ fontSize: "14px" }}>
        <li className="mb-1">
          <a href="#htc" onClick={() => setPage(2)}>
            How to Connect the Module
          </a>
        </li>
        <li className="mb-1">
          <a href="#uocm" onClick={() => setPage(3)}>
            Use of Calibration Module
          </a>
        </li>
      </ol>
      <nav>
        <ul className="pagination justify-content-center m-0">
          <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              &laquo;
            </button>
          </li>
          {[...Array(totalPages)].map((_, index) => (
            <li
              key={index}
              className={`page-item ${page === index + 1 ? "active" : ""}`}
            >
              <button className="page-link" onClick={() => setPage(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              &raquo;
            </button>
          </li>
        </ul>
      </nav>
      {page === 1 && <></>}
      {page === 2 && (
        <>
          <h5 className="my-3" id="cdap">
            How to Connect the Module
          </h5>
          <div className="d-flex justify-content-center">
            <img
              src={module}
              alt="module"
              className="w-100 mb-4"
              style={{ maxWidth: "700px" }}
            />
          </div>
          <ol style={{ fontSize: "14px" }}>
            <li className="mb-2">
              Connect the micro-USB end of the cable to the calibration module
              and the USB end to your computer.
            </li>
            <li className="mb-2">
              Plug your sensor into Channel 0 (micro-USB).{" "}
              <strong>
                Do not use Channel 1 unless you're an advanced user familiar
                with pin headers.
              </strong>{" "}
              <br />
              <br />
              <span className="text-muted">
                * If you are experienced with pin headers, connect VCC to the
                5V/3.3V pin, GND to the ground (GND) pin, then connect your
                analog signal to the data (D) pin. Finally, pull down the EN
                (enable) pin to enable sensor detection.{" "}
                <strong>Warning:</strong> Improper connections to pin headers
                could damage your sensor or module.
              </span>
            </li>
            <div className="d-flex justify-content-center">
              <img
                src={calibration}
                alt="calibration"
                className="w-100 mb-4"
                style={{ maxWidth: "400px" }}
              />
            </div>
            <li className="mb-2">
              In the left navigation bar, go to{" "}
              <span className="fw-medium text-primary">
                <i className="bi bi-plugin" /> Calibration
              </span>
              , then find the{" "}
              <span className="fw-medium text-primary">Calibration Module</span>{" "}
              tile.
            </li>
            <li className="mb-2">
              Click <span className="fw-medium text-primary">Detect</span> on
              the Serial Port. The COM Port should appear from the selection if
              the calibration module is properly connected. If not, unplug and
              reconnect to try again.
            </li>
            <li className="mb-2">
              {" "}
              To complete the setup, click{" "}
              <span className="fw-medium text-primary">Detect</span> on the
              Sensor Channel. The port/s should appear from the selection based
              on the channel your sensor/s are connected to. If not, unplug and
              reconnect to try again.
            </li>
            <li>
              In the upper-right corner of the tile, a{" "}
              <span className="text-success">
                <i className="bi bi-check-circle" /> Calibration Ready
              </span>{" "}
              prompt should appear. If so, you’re now ready to begin with sensor
              calibration.
            </li>
          </ol>
        </>
      )}
      {page === 3 && (
        <>
          <h5 className="my-3" id="cdap">
            Use of Calibration Module
          </h5>
          <div className="d-flex justify-content-center"></div>
          <ol style={{ fontSize: "14px" }}>
            <li className="mb-2">
              Once calibration is ready, select one of the following tabs:
              <ul className="my-2 text-muted">
                <li>
                  Guided Calibration - for sensors with a specified ADC formula
                </li>
                <li>
                  Unguided Calibration - for sensors without a specified ADC
                  formula
                </li>
              </ul>
            </li>
            <li className="mb-2">
              For guidance, click the{" "}
              <i className="bi bi-question-circle text-primary" /> icon on the
              rightmost side of the tabs. This will show instructions for using
              custom, one-point, two-point, and predefined formulas for guided
              calibration, as well as for unguided calibration.
            </li>
            <li className="mb-2">
              After calibration, save the ADC formula for later use. To verify
              it, go to{" "}
              <span className="fw-medium text-primary">Manage Formulas</span> in
              the bottom tile on the right side of the panel.
            </li>
            <li className="mb-2">
              Once saved, you may connect your sensor to the monitoring device.
              Take note of the channel to which it is connected.
            </li>
            <li className="mb-2">
              To start using the calibrated sensor, proceed to{" "}
              <a href="#gettingstarted" onClick={() => setPage(1)}>
                Getting Started
              </a>{" "}
              (Article 1).
            </li>
          </ol>
        </>
      )}
    </div>
  );
}
