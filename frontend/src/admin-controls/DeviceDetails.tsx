import { useAquaSenseContext } from "../Context";

export default function DeviceDetails() {
  const { conn, portConfigurations, actuationStatus } = useAquaSenseContext();

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

  return (
    <div className="d-flex flex-column bg-white shadow rounded p-4 h-75">
      <div className="d-flex flex-row justify-content-between align-items-center mb-3">
        <h5 className="mb-0" style={{ fontSize: "18px" }}>
          Device Details
        </h5>
        {renderStatus(conn.device_conn)}
      </div>
      <div style={{ overflowY: "auto" }}>
        <table className="table table-hover bg-white m-0">
          <thead className="table position-sticky top-0">
            <tr>
              <th className="fw-medium fs-6">Component</th>
              <th className="fw-medium fs-6">Status</th>
            </tr>
          </thead>
          <tbody className="table-group-divider" style={{ fontSize: "14px" }}>
            {portConfigurations.map((port) => (
              <tr key={port.port}>
                <td>Port Channel {port.port}</td>
                <td>{port.active ? "Detected" : "Undetected"}</td>
              </tr>
            ))}
            <tr>
              <td>Actuation</td>
              <td>{actuationStatus.actuate ? "Active" : "Inactive"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
