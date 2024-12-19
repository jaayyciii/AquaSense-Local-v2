import { useState } from "react";
import initial from "../assets/initial.png";
import portconfiguration from "../assets/portconfiguration.png";
import sensordetails from "../assets/sensordetails.png";
import actuation from "../assets/actuation.png";
import exporthistory from "../assets/exporthistory.png";

export default function GetStarted() {
  const [page, setPage] = useState<number>(1);
  const totalPages = 4;

  return (
    <div>
      <h4 className="text-primary-emphasis mb-2" id="gettingstarted">
        <i className="bi bi-rocket-takeoff me-2" style={{ fontSize: "24px" }} />
        Getting Started
      </h4>
      <p className="fw-light my-3" style={{ fontSize: "16px" }}>
        AquaSense Local Application makes setup easy! First, you'll need to
        configure the active ports and display them. Once that's done, you can
        start analyzing trends and gathering insights to optimize your tanks.
        Let’s get started!
      </p>
      <p className="fw-medium my-3" style={{ fontSize: "14px" }}>
        Prerequisites:
      </p>
      <ol style={{ fontSize: "14px" }}>
        <li className="mb-1">
          The device must be connected in the same network with the local
          server.
        </li>
        <li className="mb-1">
          The local application must be ran from the same computer as the local
          server and its respective database.
        </li>
        <li className="mb-1">
          At least one port must be connected to a calibrated sensor to start
          ADC formula assignment, configuration, and control functions. For
          actuation, ensure that the water pump is properly connected to its
          designated socket.
        </li>
      </ol>
      <p className="fw-medium my-3" style={{ fontSize: "14px" }}>
        In this article:
      </p>
      <ol style={{ fontSize: "14px" }}>
        <li className="mb-1">
          <a href="#cdap" onClick={() => setPage(2)}>
            Assign Formula, Configure, and Display Active Ports
          </a>
        </li>
        <li className="mb-1">
          <a href="#usdp" onClick={() => setPage(3)}>
            Understand Sensor Details Panel
          </a>
        </li>
        <li>
          <a href="#hted" onClick={() => setPage(4)}>
            How to Export Data{" "}
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
            Assign Formula, Configure, and Display Active Ports
          </h5>
          <ol style={{ fontSize: "14px" }}>
            <li className="mb-2">
              To begin, plug the calibrated sensor into the monitoring device
              and note the channel it is connected to. If the sensor isn't
              calibrated yet, please proceed to{" "}
              <a href="#sensorcalibration" onClick={() => setPage(1)}>
                sensor calibration
              </a>
              .
            </li>
            <li className="mb-2">
              From your left navigation bar, go to the
              <span className="fw-medium text-primary">
                {" "}
                <i className="bi bi-plugin" /> Calibration Page
              </span>{" "}
              and look for{" "}
              <span className="fw-medium text-primary">
                Port Channel Formulas
              </span>{" "}
              tile.
            </li>
            <li>
              Click the{" "}
              <span className="fw-medium text-primary"> Edit Assignments</span>{" "}
              button and assign an appropriate analog-to-digital (ADC) formula
              for the port channel your sensor is connected to.
            </li>
            <div className="d-flex justify-content-center">
              <img
                src={initial}
                alt="initial"
                className="w-100 mb-4"
                style={{ maxWidth: "700px" }}
              />
            </div>
            <li className="mb-2">
              To start displaying port readings, return to the{" "}
              <span className="fw-medium text-primary">
                <i className="bi bi-grid" /> Home Page
              </span>{" "}
              and click the{" "}
              <span className="fw-medium text-primary">
                Gear Icon <i className="bi bi-gear" />
              </span>{" "}
              located in the upper-right corner to configure active ports.
            </li>
            <div className="d-flex justify-content-center">
              <img
                src={portconfiguration}
                alt="portconfiguration"
                className="w-100 mb-4"
                style={{ maxWidth: "500px" }}
              />
            </div>
            <li className="mb-2">
              Select the active port channel from the list, given that you know
              which channel your sensor is connected to.
            </li>
            <li className="mb-2">
              After selecting a port, define the sensor type and the appropriate
              unit of measurement.
            </li>
            <li className="mb-2">
              For threshold configuration, select the appropriate mode from the
              selection below:
              <ul className="my-2 text-muted">
                <li className="mb-2">
                  Double Bounded - The safe zone has both upper and lower
                  boundaries.
                </li>
                <li className="mb-2">
                  Upper Bounded - The safe zone has only an upper boundary.
                </li>
                <li className="mb-2">
                  Lower Bounded - The safe zone has only a lower boundary.
                </li>
                <li className="mb-2">
                  Non-Bounded - No boundaries are defined for the safe zone.
                </li>
              </ul>
            </li>
            <li className="mb-2">
              Once a mode is selected, set the threshold boundary value/s,
              ensuring it does not exceed the sensor's defined range.
            </li>
            <li className="mb-2">
              After reviewing your configuration, click{" "}
              <span className="fw-medium text-primary"> Proceed </span> to
              confirm your changes. Then, click{" "}
              <span className="fw-medium text-primary"> Save Changes </span> to
              apply the settings. The configured port should now be displayed on
              your <span className="fw-medium text-primary">Home Page</span>.
            </li>
          </ol>
        </>
      )}
      {page === 3 && (
        <>
          <h5 className="mt-3" id="usdp">
            Understanding Sensor Details Panel
          </h5>
          <p style={{ fontSize: "14px" }}>
            To get to{" "}
            <span className="fw-medium text-primary">
              Sensor Details Panel{" "}
            </span>
            , click on the sensor card you wish to view from the displayed
            sensors on your{" "}
            <span className="fw-medium text-primary">Home Page</span>.
          </p>
          <div className="d-flex justify-content-center">
            <img
              src={sensordetails}
              alt="sensordetails"
              className="w-100 mb-4"
              style={{ maxWidth: "700px" }}
            />
          </div>
          <ul style={{ fontSize: "14px" }}>
            <li className="mb-1">
              <span className="fw-medium">Panel Controls</span> - Located in the
              upper-right corner, you will find icons that perform the following
              control actions:
            </li>
            <ul>
              <li className="mb-2">
                <span className="fw-medium text-primary">
                  Delete Port <i className="bi bi-trash3" />
                </span>{" "}
                - permanently deletes the selected port from your Home Page and
                stops its display.
              </li>
              <li className="mb-2">
                <span className="fw-medium text-primary">
                  Configure Port <i className="bi bi-gear" />
                </span>{" "}
                - allows you to reconfigure the port settings as needed. You may
                also adjust the sensor range, but keep in mind that this may
                limit the data readings— this action is strictly available only
                for displayed and configured ports.
              </li>
              <li className="mb-2">
                <span className="fw-medium text-primary">
                  Trigger Water Change <i className="bi bi-moisture me-2" />
                </span>
                - allows you to manually initiate or terminate a water change.
                By system default, the process automatically ends after 5
                minutes when unattended.
              </li>
              <img
                src={actuation}
                alt="actuation"
                className="w-100 mb-2"
                style={{ maxWidth: "400px" }}
              />
            </ul>
            <li className="mb-1">
              <span className="fw-medium">Sensor Reading</span> - Located at the
              upper-left, this card shows a gauge for better visualization,
              helping you assess the current value relative to critical ranges.
            </li>
            <li className="mb-1">
              <span className="fw-medium">Data Trend Tracker</span> - Located at
              the the upper-middle, this chart displays 24-hour data with a
              30-minute refresh rate, providing insights into trends over the
              said period.
            </li>
            <li className="mb-1">
              <span className="fw-medium">Real-Time Value</span> - Located at
              the the upper-right, this bar shows the current real-time reading
              from the sensor.
            </li>
            <li className="mb-1">
              <span className="fw-medium">Predicted Value</span> - Located just
              below the Real-Time Value, this bar calculates and predicts the
              sensor value for the next 30-minute interval.
            </li>
            <li>
              <span className="fw-medium">Data History</span> - Located at the
              bottom, this section provides a record of 30-minute interval
              values with corresponding timestamp and status for the entire
              lifespan of the port settings, capped at 3 months. Additionally, a
              button in the upper-right corner allows you to{" "}
              <a href="#hted" onClick={() => setPage(4)}>
                export the recorded history
              </a>
              .
            </li>
          </ul>
        </>
      )}
      {page === 4 && (
        <>
          <h5 className="mt-3" id="hted">
            How to Export Data
          </h5>
          <div className="d-flex justify-content-center">
            <img
              src={exporthistory}
              alt="exporthistory"
              className="w-100 mb-4"
              style={{ maxWidth: "350px" }}
            />
          </div>
          <ol style={{ fontSize: "14px" }}>
            <li className="mb-1">
              Go to the{" "}
              <span className="fw-medium text-primary">
                Sensor Details Panel{" "}
              </span>
              of the port whose data you want to export.
            </li>
            <li className="mb-1">
              Scroll to the{" "}
              <span className="fw-medium text-primary">Data History</span>{" "}
              section. Click the{" "}
              <span className="fw-medium text-primary">
                Export History <i className="bi bi-file-earmark-arrow-down" />
              </span>{" "}
              button at the upper-right corner of the card.
            </li>
            <li className="mb-1">
              (Optional) Enter a custom file name if you want to label your
              export.
            </li>
            <li className="mb-1">
              Select the time range for the data export. You can select
              predefined options, e.g., last 24 hours, 7 days, 4 weeks, 3
              months. Or, select a custom date range based on your needs.
              Remember, current history is capped at 3 months. Any data recorded
              beyond this limit can only be exported on-site through the local
              application.
            </li>
            <li className="mb-1">Select the file format for your export:</li>
            <ul className="text-muted">
              <li className="mb-1">
                CSV (Comma-separated Values): Best for Microsoft Excel or Google
                Sheets.
              </li>
              <li className="mb-1">
                JSON (JavaScript Object Notation): Ideal for advanced data
                handling or statistical analysis.
              </li>
            </ul>
            <li className="mb-1">
              After selecting your options, click{" "}
              <span className="fw-medium text-primary">Download</span>. Your
              file should start downloading automatically.
            </li>
          </ol>
        </>
      )}
    </div>
  );
}
