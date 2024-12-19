import { Outlet } from "react-router-dom";
import { useState } from "react";
import Notifications from "../notification/Notifications";
import Notify from "../notification/Notify";
import NavPanel from "./NavPanel";
import Header from "./Header";

export type ContextType = {
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
};

export default function HomeLayout() {
  // sets the instantaneous prompt/ notification for UX
  const [prompt, setPrompt] = useState<string>("");

  return (
    <>
      {/* Notifications */}
      <Notify setPrompt={setPrompt} prompt={prompt} />
      <Notifications />

      {/* Home Layout */}
      <NavPanel />
      <Header setPrompt={setPrompt} />
      {/* React Router Outlet */}
      <div
        className="d-flex flex-column bg-body-primary"
        style={{ minHeight: "100vh", height: "100%", width: "100%" }}
      >
        <div style={{ minHeight: "55px" }} />
        <div className="d-flex flex-row flex-grow-1">
          <div style={{ minWidth: "260px" }} />
          <Outlet context={{ setPrompt }} />
        </div>
      </div>
    </>
  );
}
