import { useAquaSenseContext } from "../Context";
import { ContextType } from "../home/HomeLayout";
import DOPortConfiguration from "./DOPortConfiguration";

export default function DOConfigurationButton({ setPrompt }: ContextType) {
  const { isFetching } = useAquaSenseContext();

  return (
    <>
      {/* Port Configuration Modal */}
      <DOPortConfiguration setPrompt={setPrompt} />
      {/* Port Configuration Button */}
      <button
        className="btn btn-sm btn-outline-primary d-flex justify-content-center align-items-center px-2"
        data-bs-toggle="modal"
        data-bs-target="#DOPortConfiguration"
        style={{ height: "35px" }}
        disabled={isFetching}
      >
        <i className="bi bi-gear" style={{ fontSize: "16px" }} />
      </button>
    </>
  );
}
