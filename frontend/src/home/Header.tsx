import { useEffect } from "react";
import logo from "../assets/logo.png";
import { useAquaSenseContext } from "../Context";
import { ContextType } from "./HomeLayout";

export default function Header({ setPrompt }: ContextType) {
  const { isServerAlive } = useAquaSenseContext();

  useEffect(() => {
    if (!isServerAlive) {
      setPrompt(
        "Server Disconnected: Unable to retrieve data at this time. Please check if the server is running or refresh the page to try again."
      );
    }
  }, [isServerAlive]);

  return (
    <div
      className="fixed-top bg-white shadow"
      style={{ height: "55px", width: "100%" }}
    >
      <div className="d-flex justify-content-between align-items-center px-4 h-100 w-100">
        <div className="d-flex align-items-center">
          <img
            src={logo}
            alt="logo"
            className="me-3"
            style={{ width: "30px" }}
          />
          <span className="fw-bold" style={{ fontSize: "19px" }}>
            AquaSense Local Application
          </span>
        </div>
        <div className="d-flex align-items-center border border-2 rounded-pill py-2 px-3">
          {isServerAlive ? (
            <h6 className="mb-0 d-flex align-items-center">
              <span
                className="rounded-circle bg-danger"
                style={{ width: "0.6em", height: "0.6em" }}
              />
              <span className="ms-2" style={{ fontSize: "14px" }}>
                Server Connected
              </span>
            </h6>
          ) : (
            <h6 className="mb-0 d-flex align-items-center ">
              <span
                className="spinner-grow spinner-grow-sm text-danger"
                style={{ width: "0.5em", height: "0.5em" }}
              />
              <span className="ms-2" style={{ fontSize: "14px" }}>
                Server Disconnected
              </span>
            </h6>
          )}
        </div>
      </div>
    </div>
  );
}
