import { useAquaSenseContext } from "../Context";
import SDPortConfiguration from "./SDPortConfiguration";

export type SDConfigurationProps = {
  portIndex: number;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
};

export default function SDConfigurationButton({
  portIndex,
  setPrompt,
}: SDConfigurationProps) {
  const { isFetching } = useAquaSenseContext();

  return (
    <>
      {/* Port Configuration Modal */}
      <SDPortConfiguration portIndex={portIndex} setPrompt={setPrompt} />
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
