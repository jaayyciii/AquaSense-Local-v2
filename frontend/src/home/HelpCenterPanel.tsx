import QuickNav from "../help-center/QuickNav";
import GetStarted from "../help-center/GetStarted";
import FAQ from "../help-center/FAQ";
import ContactUs from "../help-center/ContactUs";
import { useOutletContext } from "react-router-dom";
import { ContextType } from "./HomeLayout";
import Calibration from "../help-center/Calibration";

export default function HelpCenterPanel() {
  const { setPrompt } = useOutletContext<ContextType>();

  return (
    <div
      className="d-flex flex-column flex-grow-1 pb-4 px-4"
      style={{ width: "400px" }}
    >
      <div className="d-flex justify-content-between mt-4">
        <h4>Help Center</h4>
      </div>
      <QuickNav />
      <div className="d-flex flex-grow-1 bg-white shadow rounded mt-3 p-4">
        <GetStarted />
      </div>
      <div className="d-flex flex-grow-1 bg-white shadow rounded mt-3 p-4">
        <Calibration />
      </div>
      <div className="d-flex flex-grow-1 bg-white shadow rounded mt-3 p-4">
        <FAQ />
      </div>
      <div className="d-flex flex-grow-1 bg-white shadow rounded mt-3 p-4">
        <ContactUs setPrompt={setPrompt} />
      </div>
    </div>
  );
}
