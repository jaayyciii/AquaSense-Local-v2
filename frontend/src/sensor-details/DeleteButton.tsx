import { useAquaSenseContext } from "../Context";
import ConfirmDelete from "./ConfirmDelete";

// component props
export type DeleteProps = {
  portIndex: number;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
};

export default function DeleteButton({ portIndex, setPrompt }: DeleteProps) {
  const { isFetching, actuationStatus } = useAquaSenseContext();

  return (
    <>
      {/* Confirm Delete Modal */}
      <ConfirmDelete portIndex={portIndex} setPrompt={setPrompt} />
      {/* Delete Button */}
      <button
        type="button"
        className="btn btn-sm btn-outline-primary d-flex justify-content-center align-items-center px-2"
        data-bs-toggle="modal"
        data-bs-target="#deletePort"
        style={{ height: "35px" }}
        disabled={isFetching || actuationStatus.actuate}
      >
        <i className="bi bi-trash3" style={{ fontSize: "16px" }} />
      </button>
    </>
  );
}
