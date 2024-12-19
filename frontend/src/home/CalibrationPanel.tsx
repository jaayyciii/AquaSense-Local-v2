import { useOutletContext } from "react-router-dom";
import Calibration from "../sensor-calibration/Calibration";
import Formulas from "../sensor-calibration/Formulas";
import PortFormulas from "../sensor-calibration/PortFormulas";
import { ContextType } from "./HomeLayout";

export default function CalibrationPanel() {
  const { setPrompt } = useOutletContext<ContextType>();

  return (
    <div
      className="d-flex flex-column flex-grow-1 pb-4 px-4"
      style={{ width: "400px" }}
    >
      <div className="d-flex justify-content-between mt-4">
        <h4>Sensor Calibration</h4>
      </div>
      <div className="d-flex flex-grow-1 flex-row gap-3 mt-3 w-100">
        <div className="d-flex flex-grow-1" style={{ minWidth: "600px" }}>
          <Calibration setPrompt={setPrompt} />
        </div>
        <div className="d-flex flex-column gap-3" style={{ minWidth: "400px" }}>
          <PortFormulas setPrompt={setPrompt} />
          <Formulas />
        </div>
      </div>
    </div>
  );
}
