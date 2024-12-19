import { useOutletContext } from "react-router-dom";
import AccessControl from "../admin-controls/AccessControl";
import DeviceDetails from "../admin-controls/DeviceDetails";
import ServerDetails from "../admin-controls/ServerDetails";
import { ContextType } from "./HomeLayout";

export default function AdminControlsPanel() {
  const { setPrompt } = useOutletContext<ContextType>();

  return (
    <div
      className="d-flex flex-column flex-grow-1 pb-4 px-4 "
      style={{ width: "400px" }}
    >
      <div className="d-flex justify-content-between mt-4">
        <h4>Administrative Controls</h4>
      </div>
      <div className="d-flex flex-grow-1 flex-row gap-3 mt-3 w-100">
        <div className="d-flex flex-column gap-3" style={{ minWidth: "400px" }}>
          <ServerDetails />
          <DeviceDetails />
        </div>
        <div className="d-flex flex-grow-1" style={{ minWidth: "600px" }}>
          <AccessControl setPrompt={setPrompt} />
        </div>
      </div>
    </div>
  );
}
