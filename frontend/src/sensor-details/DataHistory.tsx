import { HistoryType, PortConfigurationType } from "../Context";
import ExportButton from "./ExportButton";

// component props
export type DataHistoryProps = {
  portConfiguration: PortConfigurationType;
  history: HistoryType[];
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
};

export default function DataHistory({
  portConfiguration,
  history,
  setPrompt,
}: DataHistoryProps) {
  return (
    <div className="d-flex flex-column bg-white shadow rounded p-4 h-100 w-100">
      <div className="d-flex justify-content-between align-items-start mb-1">
        <h5 className="mt-1" style={{ fontSize: "18px" }}>
          Data History
        </h5>
        <ExportButton
          portConfiguration={portConfiguration}
          history={history}
          setPrompt={setPrompt}
        />
      </div>
      <div style={{ maxHeight: "460px", overflowY: "auto" }}>
        <table className="table table-hover my-2 bg-white">
          <thead className="position-sticky top-0">
            <tr>
              <th className="fw-medium fs-6 col-6">Timestamp</th>
              <th className="fw-medium fs-6 col-3">Value</th>
              <th className="fw-medium fs-6 col-3">Status</th>
            </tr>
          </thead>
          <tbody className="table-group-divider" style={{ fontSize: "14px" }}>
            {history.length > 0 ? (
              history.map((record) => (
                <tr key={record.time.toISOString()}>
                  <td className="col-6">
                    {new Date(record.time).toLocaleString("en-US", {
                      dateStyle: "long",
                      timeStyle: "medium",
                    })}
                  </td>
                  <td className="col-3 ps-2">{record.value}</td>
                  <td className="col-3">
                    <span
                      className={`badge ${
                        portConfiguration.threshold[0] > record.value
                          ? "bg-warning"
                          : portConfiguration.threshold[1] < record.value
                          ? "bg-danger"
                          : "bg-success"
                      }`}
                    >
                      {portConfiguration.threshold[0] > record.value
                        ? "Too Low"
                        : portConfiguration.threshold[1] < record.value
                        ? "Too High"
                        : "Normal"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-3 text-center text-muted">
                  No History Recorded
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
