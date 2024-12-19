import { useState } from "react";
type ConnectionType = {
  setSelectedCOMPort: React.Dispatch<React.SetStateAction<string>>;
  setSelectedChannel: React.Dispatch<React.SetStateAction<string>>;
  selectedCOMPort: string;
  selectedChannel: string;
};

export default function Connection({
  setSelectedCOMPort,
  setSelectedChannel,
  selectedCOMPort,
  selectedChannel,
}: ConnectionType) {
  const [comPorts, setCOMPorts] = useState<string[]>([]);
  const [channels, setChannels] = useState<string[]>([]);
  const [comPortError, setCOMPortError] = useState<string>("");
  const [channelError, setChannelError] = useState<string>("");

  function getChannel(channel: number) {
    switch (channel) {
      case 0:
        return "CH0 (Micro-USB)";
      case 1:
        return "CH1 (Pin Headers)";
    }
  }

  async function detectCOMPort(e: React.FormEvent) {
    e.preventDefault();
    setSelectedCOMPort("");
    setCOMPorts([]);
    setCOMPortError("");
    try {
      const response = await fetch(`http://localhost:8000/detect-serial-auto/`);

      const snapshot = await response.json();
      if (!response.ok) {
        setCOMPortError(snapshot.detail);
        return;
      }

      setSelectedCOMPort(snapshot.selected_auto);
      setCOMPorts(snapshot.detected_list);
    } catch (error) {
      console.error(error);
    }
  }

  async function detectChannel(e: React.FormEvent) {
    e.preventDefault();
    setSelectedChannel("");
    setChannels([]);
    setChannelError("");
    try {
      const response = await fetch(
        `http://localhost:8000/detect-sensor-auto/?com_port=${selectedCOMPort}`
      );

      const snapshot = await response.json();
      if (!response.ok) {
        setChannelError(snapshot.detail);
        return;
      }
      if (snapshot.detected_list === null) {
        setChannelError(
          "No sensor detected. Please ensure the sensor is properly connected and try again."
        );
        return;
      }

      setSelectedChannel(snapshot.detected_list[0]);
      setChannels(snapshot.detected_list);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      {/* Form for Serial Port */}
      <form className="mb-2" onSubmit={detectCOMPort}>
        <div className="d-flex">
          <div className="input-group flex-grow-1">
            <span className="input-group-text bg-primary text-white">
              Serial Port
            </span>
            <select
              className="form-control"
              value={selectedCOMPort}
              onChange={(e) => setSelectedCOMPort(e.target.value)}
            >
              <option value="">Select COM Port</option>
              {comPorts.map((comPort) => {
                return (
                  <option value={comPort} key={comPort}>
                    {comPort}
                  </option>
                );
              })}
            </select>
          </div>
          <button type="submit" className="btn btn-outline-primary ms-2">
            Detect
          </button>
        </div>
        {comPortError !== "" && (
          <div
            className="form-text text-danger m-0"
            style={{ fontSize: "13px" }}
          >
            <i className="bi bi-exclamation-circle-fill" />
            <span className="my-2"> {comPortError}</span>
          </div>
        )}
      </form>

      {/* Form for Sensor Channel */}
      <form onSubmit={detectChannel}>
        <div className="d-flex">
          <div className="input-group flex-grow-1">
            <span className="input-group-text bg-primary text-white">
              Sensor Channel
            </span>
            <select
              className="form-control"
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              disabled={selectedCOMPort == ""}
            >
              <option value="">Select Channel</option>
              {channels.map((channel) => {
                return (
                  <option value={channel} key={channel}>
                    {getChannel(Number(channel))}
                  </option>
                );
              })}
            </select>
          </div>
          <button
            type="submit"
            className="btn btn-outline-primary ms-2"
            disabled={selectedCOMPort == ""}
          >
            Detect
          </button>
        </div>
        {channelError !== "" && (
          <div
            className="form-text text-danger m-0"
            style={{ fontSize: "13px" }}
          >
            <i className="bi bi-exclamation-circle-fill" />
            <span className="my-2"> {channelError}</span>
          </div>
        )}
      </form>
    </>
  );
}
