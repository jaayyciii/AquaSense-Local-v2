import { useAquaSenseContext } from "../Context";
import { ContextType } from "../home/HomeLayout";

export default function ConfirmActuate({ setPrompt }: ContextType) {
  const {
    isFetching,
    actuationStatus,
    setActuationStatus,
    putActuationStatus,
  } = useAquaSenseContext();

  // handles the actuate button. toggles the actuate status from true-false, vice-versa
  async function confirmActuate() {
    if (isFetching || !actuationStatus.control) return;

    try {
      await putActuationStatus({
        actuate: actuationStatus.actuate,
        control: actuationStatus.control,
        command: actuationStatus.actuate ? "F" : "T",
      });
      setActuationStatus({
        ...actuationStatus,
        command: actuationStatus.actuate ? "F" : "T",
      });
      setPrompt(
        !actuationStatus.actuate
          ? "The trigger water change command has been sent to the server. Please wait a moment for processing, and ensure the reservoir has enough water for dilution."
          : "The terminate water change command has been sent to the server. Please wait a moment for processing."
      );
    } catch (e) {
      console.error(e);
      setPrompt(
        "An error encountered while controlling the device's actuation. Please check connection and try again"
      );
    }
  }

  return (
    <div
      className="modal fade"
      id="actuate"
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
            Are you sure you want to{" "}
            {actuationStatus.actuate ? "terminate" : "trigger"} the water
            change?
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
              className="btn btn-outline-primary"
              data-bs-dismiss="modal"
              onClick={confirmActuate}
              disabled={isFetching || !actuationStatus.control}
            >
              {!actuationStatus.actuate
                ? "Trigger Water Change"
                : "Terminate Water Change"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
