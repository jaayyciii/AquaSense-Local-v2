import { useRef, useState } from "react";
import { Modal } from "bootstrap";
import { PortConfigurationType } from "../Context";
import { useAquaSenseContext } from "../Context";
import { SDConfigurationProps } from "./SDConfigurationButton";

export default function SDPortConfiguration({
  portIndex,
  setPrompt,
}: SDConfigurationProps) {
  const { isFetching, portConfigurations, putPortConfiguration } =
    useAquaSenseContext();

  // modal reference
  const modalRef = useRef<HTMLDivElement>(null);
  // port configuration variables
  const [newConfiguration, setNewConfiguration] =
    useState<PortConfigurationType>(portConfigurations[portIndex]);
  // sets the actuation mode: lower, upper, double, non-bounded
  const [actuationMode, setActuationMode] = useState<number>(1);
  // user input errors
  const [defineError, setDefineError] = useState<string>("");
  const [unitError, setUnitError] = useState<string>("");
  const [rangeError, setRangeError] = useState<string>("");
  const [actuationError, setActuationError] = useState<string>("");
  // proceeds to confirmation page when user inputs have no errors
  const [inputVerified, setInputVerified] = useState<boolean>(false);

  // handles modal dismissal
  function dismissModal() {
    if (modalRef.current) {
      const modalInstance = Modal.getInstance(modalRef.current);
      if (modalInstance) {
        const backdrop = document.querySelector(".modal-backdrop");
        if (backdrop) {
          backdrop.remove();
          modalInstance.hide();
        }
      }
    }
    setNewConfiguration(portConfigurations[portIndex]);
    setActuationMode(0);
    setDefineError("");
    setUnitError("");
    setRangeError("");
    setActuationError("");
    setInputVerified(false);
  }

  // updates the threshold values according to the actuation mode
  function updateActuationValues() {
    const maxThreshold = 340282346638528859811704183484516925440.0;
    const minThreshold = -340282346638528859811704183484516925440.0;

    let thresholds: [number, number];
    switch (actuationMode) {
      case 2:
        thresholds = [newConfiguration.threshold[0], maxThreshold];
        break;
      case 3:
        thresholds = [minThreshold, newConfiguration.threshold[1]];
        break;
      case 4:
        thresholds = [minThreshold, maxThreshold];
        break;
      default:
        return;
    }

    setNewConfiguration({
      ...newConfiguration,
      threshold: thresholds,
    });
  }

  // checks whether the user inputs are valid, if so, it proceeds to confirmation page
  function verifyInput() {
    setDefineError("");
    setUnitError("");
    setActuationError("");

    if (newConfiguration.define === "") {
      setDefineError("Please specify the sensor type for this channel");
      return;
    }

    if (newConfiguration.unit === "") {
      setUnitError("Please enter the SI unit for the sensor readings");
      return;
    }

    if (newConfiguration.range[0] >= newConfiguration.range[1]) {
      setRangeError("The minimum range value cannot exceed the maximum range.");
      return;
    }

    if (actuationMode === 0) {
      setActuationError("Please select the mode of actuation for your sensor.");
      return;
    }

    updateActuationValues();

    if (
      (actuationMode === 2 &&
        newConfiguration.threshold[0] < newConfiguration.range[0]) ||
      newConfiguration.threshold[0] > newConfiguration.range[1] ||
      (actuationMode === 3 &&
        newConfiguration.threshold[1] > newConfiguration.range[1]) ||
      newConfiguration.threshold[1] < newConfiguration.range[0] ||
      (actuationMode !== 4 &&
        actuationMode !== 2 &&
        actuationMode !== 3 &&
        (newConfiguration.threshold[0] < newConfiguration.range[0] ||
          newConfiguration.threshold[1] > newConfiguration.range[1]))
    ) {
      setActuationError(
        `Threshold values must be within the sensor's range: ${newConfiguration.range[0]} - ${newConfiguration.range[1]}.`
      );
      return;
    }

    if (newConfiguration.threshold[0] > newConfiguration.threshold[1]) {
      setActuationError(
        "The minimum threshold value cannot exceed the maximum threshold."
      );
      return;
    }

    setTimeout(() => {
      setInputVerified(true);
    }, 0);
  }

  // handles port configuration submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isFetching) return;
    if (!inputVerified) return;

    try {
      await putPortConfiguration(newConfiguration.port, {
        port_number: portConfigurations[newConfiguration.port].port,
        name: newConfiguration.define,
        unit: newConfiguration.unit,
        active: portConfigurations[newConfiguration.port].active,
        display: portConfigurations[newConfiguration.port].display,
        range_min: newConfiguration.range[0],
        range_max: newConfiguration.range[1],
        thresh_min: newConfiguration.threshold[0],
        thresh_max: newConfiguration.threshold[1],
        time: portConfigurations[newConfiguration.port].timestamp,
        formula_number:
          portConfigurations[newConfiguration.port].formula_number,
      });
      setPrompt(
        `Channel ${
          portConfigurations[newConfiguration.port].port
        } Sensor has been successfully configured for ${
          newConfiguration.define
        }. Please check to verify the changes.`
      );
    } catch (error) {
      console.error(error);
      setPrompt(
        `Oops! Something went wrong. ${newConfiguration.define} configuration was unsuccessful. Please try again or check your connection`
      );
    } finally {
      dismissModal();
    }
  }

  return (
    <div
      className="modal fade"
      id="DOPortConfiguration"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      ref={modalRef}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5">Port Channel Configuration</h1>
            <button
              type="button"
              className="btn-close"
              onClick={dismissModal}
            />
          </div>
          <form onSubmit={handleSubmit}>
            {!inputVerified ? (
              <>
                <div className="modal-body">
                  {/* Port Assignment */}
                  <select className="form-select" value={portIndex} disabled>
                    <option>Channel {portIndex}</option>
                  </select>
                  {/* Sensor Type  */}
                  <div className="input-group mt-3">
                    <input
                      className="form-control"
                      value={newConfiguration.define}
                      placeholder="e.g., Dissolved Oxygen, Salinity, Light"
                      onChange={(e) =>
                        setNewConfiguration({
                          ...newConfiguration,
                          define: e.target.value,
                        })
                      }
                    />
                    <span className="input-group-text">Sensor Type</span>
                  </div>
                  {defineError !== "" && (
                    <div
                      className="form-text text-danger m-0"
                      style={{ fontSize: "13px" }}
                    >
                      <i className="bi bi-exclamation-circle-fill" />
                      <span className="my-2">{defineError}</span>
                    </div>
                  )}
                  {/* Sensor SI Unit */}
                  <div className="input-group mt-3">
                    <input
                      className="form-control"
                      value={newConfiguration.unit}
                      placeholder="e.g., mg/L, PSU, g/L , Lux (lx)"
                      onChange={(e) =>
                        setNewConfiguration({
                          ...newConfiguration,
                          unit: e.target.value,
                        })
                      }
                    />
                    <span className="input-group-text">Measurement Unit</span>
                  </div>
                  {unitError !== "" && (
                    <div
                      className="form-text text-danger m-0"
                      style={{ fontSize: "13px" }}
                    >
                      <i className="bi bi-exclamation-circle-fill" />
                      <span className="my-2">{unitError}</span>
                    </div>
                  )}
                  {/* Sensor Range */}
                  <h6 className="fw-normal mt-3"> Sensor Range </h6>
                  <div className="input-group flex-grow-1 ">
                    <input
                      type="number"
                      value={newConfiguration.range[0]}
                      className="form-control"
                      onChange={(e) =>
                        setNewConfiguration({
                          ...newConfiguration,
                          range: [
                            isNaN(parseFloat(e.target.value))
                              ? 0
                              : parseFloat(e.target.value),
                            newConfiguration.range[1],
                          ],
                        })
                      }
                    />
                    <span className="input-group-text">-</span>
                    <input
                      type="number"
                      value={newConfiguration.range[1]}
                      className="form-control"
                      onChange={(e) =>
                        setNewConfiguration({
                          ...newConfiguration,
                          range: [
                            newConfiguration.range[0],
                            isNaN(parseFloat(e.target.value))
                              ? 0
                              : parseFloat(e.target.value),
                          ],
                        })
                      }
                    />
                  </div>
                  {rangeError === "" ? (
                    <div
                      className="form-text text-info m-0"
                      style={{ fontSize: "13px" }}
                    >
                      <i className="bi bi-info-circle" />
                      <span className="my-2">
                        {" "}
                        Define an ideal range based on your sensor type to set
                        the visualization limits effectively.
                      </span>
                    </div>
                  ) : (
                    <div
                      className="form-text text-danger m-0"
                      style={{ fontSize: "13px" }}
                    >
                      <i className="bi bi-exclamation-circle-fill" />
                      <span className="my-2"> {rangeError}</span>
                    </div>
                  )}
                  {/* Actuation */}
                  <div className="mt-3">
                    <h6 className="fw-normal"> Sensor Actuation </h6>
                    <div className="d-flex gap-3">
                      <select
                        className="form-select w-25"
                        value={actuationMode}
                        onChange={(e) =>
                          setActuationMode(parseInt(e.target.value))
                        }
                      >
                        <option value="0">Select Mode</option>
                        <option value="1">Double Bounded</option>
                        <option value="2">Lower Bounded</option>
                        <option value="3">Upper Bounded</option>
                        <option value="4">Non-Bounded</option>
                      </select>
                      <div className="input-group flex-grow-1">
                        <input
                          type="number"
                          value={
                            actuationMode == 0 ||
                            actuationMode == 3 ||
                            actuationMode == 4
                              ? "-"
                              : newConfiguration.threshold[0]
                          }
                          className="form-control"
                          onChange={(e) =>
                            setNewConfiguration({
                              ...newConfiguration,
                              threshold: [
                                isNaN(parseFloat(e.target.value))
                                  ? 0
                                  : parseFloat(e.target.value),
                                newConfiguration.threshold[1],
                              ],
                            })
                          }
                          disabled={
                            actuationMode == 0 ||
                            actuationMode == 3 ||
                            actuationMode == 4
                          }
                        />
                        <span className="input-group-text">-</span>
                        <input
                          type="number"
                          value={
                            actuationMode == 0 ||
                            actuationMode == 2 ||
                            actuationMode == 4
                              ? "-"
                              : newConfiguration.threshold[1]
                          }
                          className="form-control"
                          onChange={(e) =>
                            setNewConfiguration({
                              ...newConfiguration,
                              threshold: [
                                newConfiguration.threshold[0],
                                isNaN(parseFloat(e.target.value))
                                  ? 0
                                  : parseFloat(e.target.value),
                              ],
                            })
                          }
                          disabled={
                            actuationMode == 0 ||
                            actuationMode == 2 ||
                            actuationMode == 4
                          }
                        />
                      </div>
                    </div>
                    {actuationError === "" ? (
                      newConfiguration.port !== -1 && (
                        <div
                          className="form-text text-info m-0"
                          style={{ fontSize: "13px" }}
                        >
                          <i className="bi bi-info-circle" />
                          <span className="my-2">
                            {" "}
                            Please select values within the sensor's range{" "}
                            {newConfiguration.range[0]} -{" "}
                            {newConfiguration.range[1]}
                          </span>
                        </div>
                      )
                    ) : (
                      <div
                        className="form-text text-danger m-0"
                        style={{ fontSize: "13px" }}
                      >
                        <i className="bi bi-exclamation-circle-fill" />
                        <span className="my-2"> {actuationError}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={dismissModal}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={verifyInput}
                    disabled={isFetching}
                  >
                    Proceed
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="modal-body d-flex flex-column">
                  <p>
                    You are about to apply the following changes to the port
                    channel. Please review the details below and confirm your
                    changes.
                  </p>
                  <div>
                    <ul className="list-unstyled">
                      <li>
                        <strong>Port:</strong> Channel {newConfiguration.port}
                      </li>
                      <li>
                        <strong>Sensor Type:</strong> {newConfiguration.define}
                      </li>
                      <li>
                        <strong>Sensor Range:</strong>{" "}
                        {newConfiguration.range[0]} -{" "}
                        {newConfiguration.range[1]}
                      </li>
                      <li>
                        <strong>Safe Range:</strong>{" "}
                        {newConfiguration.threshold[0]} -{" "}
                        {newConfiguration.threshold[1]}
                      </li>
                      <li>
                        <strong>SI Unit:</strong> {newConfiguration.unit}
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setInputVerified(false)}
                  >
                    Return
                  </button>
                  <button
                    type="submit"
                    className="btn btn-outline-primary"
                    disabled={isFetching}
                  >
                    Save Changes
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
