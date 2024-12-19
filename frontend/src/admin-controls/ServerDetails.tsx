import { useState } from "react";
import { useAquaSenseContext } from "../Context";

export default function ServerDetails() {
  const { conn } = useAquaSenseContext();
  const [copied, setCopied] = useState<boolean>(false);

  function renderStatus(code: number) {
    switch (code) {
      case 1:
        return (
          <div className="text-info">
            <i className="bi bi-arrow-clockwise" /> Awaiting Connection
          </div>
        );
      case 2:
        return (
          <div className="text-success">
            <i className="bi bi-reception-4" /> Connected
          </div>
        );
      default:
        return (
          <div className="text-danger">
            <i className="bi bi-bootstrap-reboot" /> System Booting
          </div>
        );
    }
  }

  // function to handle copy click
  const handleCopyClick = () => {
    if (copied) return;

    navigator.clipboard
      .writeText(
        `
      STA_SSID: ${conn.ssid}; 
      STA_PASS: ${conn.password}; 
      STA_HOST: ${conn.ip_address}; 
      STA_PORT: ${conn.port};
      AP_SSID: ;
      AP_PASS: ;
      PKT_Head: ;
      PKT_Tail: ;
        `
      )
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  };

  return (
    <div className="d-flex flex-column bg-white shadow rounded p-4 h-25">
      <div className="d-flex flex-row justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <h5 style={{ fontSize: "18px" }} className="mb-0 me-2">
            Server Details
          </h5>
          <button
            className="btn btn-link text-muted p-0"
            onClick={handleCopyClick}
            disabled={copied}
          >
            <i className="bi bi-clipboard" style={{ fontSize: "12px" }} />
          </button>
        </div>
        {renderStatus(conn.server_conn)}
      </div>
      <div className="mt-3" style={{ overflowY: "auto" }}>
        <table className="w-100">
          <tbody>
            <tr>
              <td className="col-6">IP Address:</td>
              <td className="col-6">{conn.ip_address}</td>
            </tr>
            <tr>
              <td className="col-6">Port:</td>
              <td className="col-6">{conn.port}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
