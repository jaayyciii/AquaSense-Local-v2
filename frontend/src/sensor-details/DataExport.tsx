import { useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { HistoryType } from "../Context";
import { DataHistoryProps } from "./DataHistory";

// typescript data types
type DownloadType = {
  fileName: string;
  startTime: Date;
  endTime: Date;
  extension: string;
};

export default function DataExport({
  portConfiguration,
  history,
  setPrompt,
}: DataHistoryProps) {
  // sets a boolean value to render date customization
  const [custom, isCustom] = useState<boolean>(false);
  // updates the start time and end time
  const [predefinedRange, setPredefinedRange] = useState<number>(1);
  // use state that holds download details
  const [download, setDownload] = useState<DownloadType>({
    fileName: "",
    startTime: new Date(new Date().setDate(new Date().getDate() - 1)),
    endTime: new Date(),
    extension: "csv",
  });

  // sets the limit up to 3 months for the start time date selection
  const minimumDate = () => {
    const portTimestamp = dayjs(portConfiguration.timestamp);

    return portTimestamp.isAfter(dayjs().subtract(3, "month"))
      ? portTimestamp
      : dayjs().subtract(3, "month");
  };

  // converts data to a comma-separate value file and allows for download
  function downloadCSV(exportHistory: HistoryType[]) {
    if (!history) return;

    const type = ["Sensor Type", portConfiguration.define];
    const timestamp = [
      "Configuration Timestamp",
      portConfiguration.timestamp.toISOString(),
    ];
    const range = [
      "Sensor Range",
      portConfiguration.range[0],
      portConfiguration.range[1],
    ];
    const threshold = [
      "Sensor Threshold",
      portConfiguration.threshold[0],
      portConfiguration.threshold[1],
    ];
    const configCSV = [type, timestamp, range, threshold].join("\n");
    const headers = ["Timestamp (UTC)", "Data", "Unit"];
    const rows = exportHistory
      .map((record) => [
        record.time.toISOString(),
        record.value,
        portConfiguration.unit,
      ])
      .join("\n");
    const historyCSV = [headers, rows].join("\n");
    const csvContent = [configCSV, historyCSV].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `AquaSense${
      download.fileName ? "-" + download.fileName : ""
    }.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // converts data to a JSON file and allows for download
  function downloadJSON(exportHistory: HistoryType[]) {
    if (!history) return;

    const dataToExport = {
      sensorType: portConfiguration.define,
      configurationTimestamp: portConfiguration.timestamp.toISOString(),
      sensorRange: [portConfiguration.range[0], portConfiguration.range[1]],
      sensorThreshold: [
        portConfiguration.threshold[0],
        portConfiguration.threshold[1],
      ],
      history: exportHistory.map((record) => ({
        timestamp: record.time.toISOString(),
        data: record.value,
        unit: portConfiguration.unit,
      })),
    };

    const jsonString = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `AquaSense${
      download.fileName ? "-" + download.fileName : ""
    }.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // handles download function; filters and downloads at specified file type
  function handleDownload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const exportHistory = history.filter(
      (record) => record.time >= download.startTime
    );

    if (download.extension === "csv") {
      downloadCSV(exportHistory);
    } else {
      downloadJSON(exportHistory);
    }

    setPredefinedRange(1);
    setDownload({
      fileName: "",
      startTime: new Date(new Date().setDate(new Date().getDate() - 1)),
      endTime: new Date(),
      extension: "csv",
    });
    setPrompt(
      "Your download will start shortly. If it doesn't, please try again or check your browser's download folder."
    );
  }

  // converts user selection to predefined range for download details
  useEffect(() => {
    let startTime = new Date(download.endTime);
    isCustom(false);

    switch (predefinedRange) {
      case 1:
        startTime.setHours(download.endTime.getHours() - 24);
        break;
      case 2:
        startTime.setDate(download.endTime.getDate() - 7);
        break;
      case 3:
        startTime.setDate(download.endTime.getDate() - 28);
        break;
      case 4:
        startTime.setMonth(download.endTime.getMonth() - 3);
        break;
      case 5:
        isCustom(true);
        break;
      default:
        // handle invalid input
        break;
    }

    setDownload((prev) => ({
      ...prev,
      startTime: startTime,
    }));
  }, [predefinedRange]);

  // sets the user custom date range for download details
  function setCustomRange(customStartTime: Dayjs, customEndTime: Dayjs) {
    setDownload({
      ...download,
      startTime: customStartTime.toDate(),
      endTime: customEndTime.toDate(),
    });
  }

  return (
    <div
      className="modal fade"
      id="dataExport"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      data-bs-focus="false"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5">Export History</h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            />
          </div>
          <form onSubmit={handleDownload}>
            <div className="modal-body d-flex flex-column">
              <div className="input-group">
                <input
                  className="form-control"
                  id="type"
                  value={download.fileName}
                  placeholder="Enter a custom file name"
                  onChange={(e) =>
                    setDownload({
                      ...download,
                      fileName: e.target.value,
                    })
                  }
                />
                <span className="input-group-text">File Name</span>
              </div>
              <div
                className="form-text text-info mt-0 mb-3"
                style={{ fontSize: "13px" }}
              >
                <i className="bi bi-info-circle" />
                <span className="my-2">
                  {" "}
                  Customized file name is optional.{" "}
                </span>
              </div>
              <div>
                <label htmlFor="timeDurationSelect" className="form-label">
                  Select Time Range:
                </label>
                <select
                  id="timeDurationSelect"
                  value={predefinedRange}
                  className="form-select"
                  onChange={(e) => setPredefinedRange(Number(e.target.value))}
                >
                  <option value={1}>Last 24 hours</option>
                  <option value={2}>Last 7 days</option>
                  <option value={3}>Last 4 weeks</option>
                  <option value={4}>Last 3 months</option>
                  <option value={5}>Custom Range</option>
                </select>
              </div>
              {custom && (
                <>
                  {" "}
                  <div className="d-flex align-content-between gap-3 mt-2">
                    <div className="d-flex flex-column w-50">
                      <small className="form-label text-muted">
                        Start Time
                      </small>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          value={dayjs(download.startTime)}
                          onChange={(input) =>
                            setCustomRange(
                              dayjs(input),
                              dayjs(download.endTime)
                            )
                          }
                          minDate={minimumDate()}
                          maxDate={dayjs(download.endTime)}
                        />
                      </LocalizationProvider>
                    </div>
                    <div className="d-flex flex-column w-50">
                      <small className="form-label text-muted">End Time</small>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          value={dayjs(download.endTime)}
                          onChange={(input) =>
                            setCustomRange(
                              dayjs(download.startTime),
                              dayjs(input)
                            )
                          }
                          minDate={dayjs(download.startTime)}
                          maxDate={dayjs()}
                        />
                      </LocalizationProvider>
                    </div>
                  </div>
                  <div
                    className="form-text text-info"
                    style={{ fontSize: "13px" }}
                  >
                    <i className="bi bi-info-circle" />
                    <span className="my-2">
                      {" "}
                      Data history records only last for 3 months due to cloud
                      storage constaints.{" "}
                    </span>
                  </div>
                </>
              )}
              <div className="mt-3">
                <label htmlFor="fileTypeSelect" className="form-label">
                  Select File Type:
                </label>
                <select
                  id="fileTypeSelect"
                  className="form-select"
                  value={download.extension}
                  onChange={(e) =>
                    setDownload((prev) => ({
                      ...prev,
                      extension: e.target.value,
                    }))
                  }
                >
                  <option value="csv">.CSV (Comma-separated Values)</option>
                  <option value="json">
                    .JSON (JavaScript Object Notation)
                  </option>
                </select>
              </div>
              <div
                className="form-text text-info mt-0 mb-3"
                style={{ fontSize: "13px" }}
              >
                <i className="bi bi-info-circle" />
                <span className="my-2">
                  {" "}
                  Choose CSV for Excel/Sheets and JSON for advanced data
                  handling.{" "}
                </span>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                data-bs-dismiss="modal"
              >
                Download
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
