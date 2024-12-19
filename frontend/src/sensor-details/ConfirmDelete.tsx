import { useNavigate } from "react-router-dom";
import type { DeleteProps } from "./DeleteButton";
import { useAquaSenseContext } from "../Context";

export default function ConfirmDelete({ portIndex, setPrompt }: DeleteProps) {
  const navigate = useNavigate();
  const {
    isFetching,
    portConfigurations,
    actuationStatus,
    putPortConfiguration,
  } = useAquaSenseContext();

  // handles confirm delete button, this sets the display to false at firebase
  async function confirmDelete() {
    if (isFetching) return;

    try {
      await putPortConfiguration(portIndex, {
        port_number: portConfigurations[portIndex].port,
        name: portConfigurations[portIndex].define,
        unit: portConfigurations[portIndex].unit,
        active: portConfigurations[portIndex].active,
        display: false,
        range_min: portConfigurations[portIndex].range[0],
        range_max: portConfigurations[portIndex].range[1],
        thresh_min: -340282346638528859811704183484516925440.0,
        thresh_max: 340282346638528859811704183484516925440.0,
        time: portConfigurations[portIndex].timestamp,
        formula_number: portConfigurations[portIndex].formula_number,
      });
      setPrompt(
        `${portConfigurations[portIndex].define} has been successfully deleted and should no longer being displayed.`
      );
      navigate("/");
    } catch (error) {
      console.error(error);
      setPrompt(
        `An error encountered while deleting ${portConfigurations[portIndex].define}. Please check connection and try again`
      );
    }
  }

  return (
    <div
      className="modal fade"
      id="deletePort"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5">Confirm Action</h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            />
          </div>
          <div className="modal-body">
            Are you sure you want to delete this port channel? Consider
            exporting your history first to avoid losing important information.
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#dataExport"
            >
              <i
                className="bi bi-file-earmark-arrow-down me-2"
                style={{ fontSize: "18px" }}
              />
              Export History
            </button>
            <button
              type="button"
              className="btn btn-outline-danger"
              data-bs-dismiss="modal"
              onClick={confirmDelete}
              disabled={isFetching || actuationStatus.actuate}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
