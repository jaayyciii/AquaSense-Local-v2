import { useAquaSenseContext } from "../Context";
import { ContextType } from "../home/HomeLayout";
import ConfirmActuate from "./ConfirmActuate";

export default function ActuateButton({ setPrompt }: ContextType) {
  const { isFetching, actuationStatus } = useAquaSenseContext();

  return (
    <>
      {/* Confirm Actuation Modal */}
      <ConfirmActuate setPrompt={setPrompt} />
      {/* Actuate Button */}
      <div className="btn-group w-100">
        <button
          type="button"
          className={`btn btn-sm d-flex align-items-center px-2 ${
            actuationStatus.actuate ? "btn-primary" : "btn-outline-primary"
          }`}
          data-bs-toggle="modal"
          data-bs-target="#actuate"
          style={{ height: "35px" }}
          disabled={
            isFetching ||
            actuationStatus.command === "T" ||
            actuationStatus.command === "F" ||
            !actuationStatus.control
          }
        >
          <i className="bi bi-moisture me-2" style={{ fontSize: "18px" }} />
          {actuationStatus.command === "T" || actuationStatus.command === "F"
            ? "Processing Request"
            : !actuationStatus.actuate
            ? "Trigger Water Change"
            : "Terminate Water Change"}
        </button>
        {actuationStatus.actuate && (
          <button
            type="button"
            className="btn btn-sm btn-primary d-flex align-items-center"
            data-bs-toggle="modal"
            data-bs-target="#actuate"
            style={{ maxWidth: "30px", height: "35px" }}
            disabled={
              isFetching ||
              actuationStatus.command === "T" ||
              actuationStatus.command === "F" ||
              !actuationStatus.control
            }
          >
            <div
              className="spinner-grow spinner-border-sm"
              style={{ height: "12px", width: "12px" }}
            />
          </button>
        )}
      </div>
    </>
  );
}
