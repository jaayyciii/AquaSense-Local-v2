import { useEffect, useState } from "react";
import Guided from "./Guided";
import Unguided from "./Unguided";
import Connection from "./Connection";
import { ContextType } from "../home/HomeLayout";

export type CalibrationType = {
  selectedCOMPort: string;
  selectedChannel: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  disable: boolean;
};

export default function Calibration({ setPrompt }: ContextType) {
  const [activeTab, setActiveTab] = useState<"guided" | "unguided">("guided");
  const [selectedCOMPort, setSelectedCOMPort] = useState<string>("");
  const [selectedChannel, setSelectedChannel] = useState<string>("");
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    setIsReady(false);
    if (selectedCOMPort !== "" && selectedChannel !== "") {
      setIsReady(true);
    }
  }, [selectedCOMPort, selectedChannel]);

  return (
    <div className="d-flex flex-column shadow rounded p-4 w-100 h-100">
      <div className="d-flex flex-row justify-content-between align-items-center mb-3">
        <h5 className="mb-0" style={{ fontSize: "18px" }}>
          Calibration Module
        </h5>
        {isReady ? (
          <div className="text-success">
            <i className="bi bi-check-circle" /> Calibration Ready
          </div>
        ) : (
          <div className="text-danger">
            <i className="bi bi-x-circle" /> Needs Set-Up
          </div>
        )}
      </div>
      <div className="px-3 mb-4">
        <Connection
          setSelectedCOMPort={setSelectedCOMPort}
          setSelectedChannel={setSelectedChannel}
          selectedCOMPort={selectedCOMPort}
          selectedChannel={selectedChannel}
        />
      </div>
      <ul className="nav nav-tabs" style={{ fontSize: "14px" }}>
        <li className="nav-item">
          <button
            className={`nav-link fw-semibold ${
              activeTab === "guided" ? "active" : ""
            }`}
            onClick={() => setActiveTab("guided")}
          >
            Guided Calibration
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link fw-semibold ${
              activeTab === "unguided" ? "active" : ""
            }`}
            onClick={() => setActiveTab("unguided")}
          >
            Unguided Calibration
          </button>
        </li>
        <li className="nav-item ms-auto d-flex align-items-center">
          <a
            className="nav-link fw-semibold outline-0 shadow-none"
            data-bs-toggle="offcanvas"
            data-bs-target="#guide"
          >
            <i className="bi bi-question-circle" style={{ fontSize: "14px" }} />
          </a>
        </li>
      </ul>
      {activeTab === "guided" ? (
        <Guided
          selectedCOMPort={selectedCOMPort}
          selectedChannel={selectedChannel}
          setPrompt={setPrompt}
          disable={!isReady}
        />
      ) : (
        <Unguided
          selectedCOMPort={selectedCOMPort}
          selectedChannel={selectedChannel}
          setPrompt={setPrompt}
          disable={!isReady}
        />
      )}
    </div>
  );
}
