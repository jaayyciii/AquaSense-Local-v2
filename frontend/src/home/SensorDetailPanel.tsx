import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import DeleteButton from "../sensor-details/DeleteButton";
import ActuateButton from "../sensor-details/ActuateButton";
import SDConfigurationButton from "../sensor-details/SDConfigurationButton";
import Gauge from "../sensor-details/Gauge";
import LineGraph from "../sensor-details/LineGraph";
import Numerics from "../sensor-details/Numerics";
import DataHistory from "../sensor-details/DataHistory";
import loadingtile from "../assets/loadingtile.gif";
import { HistoryType, useAquaSenseContext } from "../Context";
import { ContextType } from "./HomeLayout";

export default function SensorDetailPanel() {
  const navigate = useNavigate();
  const { setPrompt } = useOutletContext<ContextType>();
  const {
    isFetching,
    portConfigurations,
    currentValues,
    getHistory,
    notifications,
    postNotification,
  } = useAquaSenseContext();

  // gets the index value from the URL Search
  const location = useLocation();
  const URLQuery = new URLSearchParams(location.search);
  const portIndex = parseInt(URLQuery.get("index") ?? "8", 10);
  // returns to home when portIndex is invalid or not being displayed
  useEffect(() => {
    if (
      portIndex < 0 ||
      7 < portIndex ||
      !portConfigurations[portIndex].display ||
      portConfigurations[portIndex].formula_number == 0
    ) {
      navigate("/");
    }
  }, [portIndex]);
  // history state
  const [history, setHistory] = useState<HistoryType[]>([]);
  // holds the predicted value
  const [predict, setPredict] = useState<number | null>(null);
  // number of data points to be used by the lagrange function
  const datapoints = 2;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const portHistory = await getHistory(portIndex);
        setHistory(portHistory);
      } catch (error) {
        console.error(error);
      }
    };

    fetchHistory();
  }, [portIndex]);

  // sets the notification at firebase in the event of predicted value exceeding the threshold
  useEffect(() => {
    if (history.length === 0) return;
    if (predict !== null && !isNaN(predict)) {
      if (
        portConfigurations[portIndex].threshold[0] <= predict &&
        predict <= portConfigurations[portIndex].threshold[1]
      )
        return;

      const now = new Date();
      const past30mins = new Date(now.getTime() - 1800000);
      if (
        notifications.some(
          (notification) =>
            notification.type === 5 &&
            new Date(notification.timestamp) >= past30mins &&
            new Date(notification.timestamp) <= now
        )
      )
        return;

      try {
        const num = Math.floor(Math.random() * 100);
        postNotification({
          id: num,
          port_number: portIndex,
          type: 5,
          viewed: false,
          time: new Date().toISOString(),
        });
      } catch (error) {
        console.error(error);
      }
    }
  }, [portIndex, portConfigurations[portIndex].threshold, predict]);

  return (
    <>
      {/* Sensor Details Panel */}
      <div
        className="d-flex flex-column flex-grow-1 pb-3 px-4"
        style={{ width: "400px" }}
      >
        <div className="d-flex justify-content-between mt-4">
          <h4>{portConfigurations[portIndex].define} Details</h4>
          <div className="d-flex flex-wrap justify-content-end gap-2">
            <DeleteButton portIndex={portIndex} setPrompt={setPrompt} />
            <SDConfigurationButton
              portIndex={portIndex}
              setPrompt={setPrompt}
            />
            <div className="d-none d-md-flex">
              <ActuateButton setPrompt={setPrompt} />
            </div>
          </div>
        </div>
        {isFetching ? (
          <LoadingState />
        ) : (
          <div className="d-flex flex-column flex-grow-1 mt-3 px-2 px-md-0">
            <div
              className="row mb-4"
              style={{ height: "auto", minHeight: "340px" }}
            >
              <div className="col-12 col-lg-3 mb-3 mb-lg-0">
                <Gauge
                  currentValue={currentValues.values[portIndex]}
                  range={portConfigurations[portIndex].range}
                  threshold={portConfigurations[portIndex].threshold}
                  unit={portConfigurations[portIndex].unit}
                />
              </div>
              <div className="col-12 col-lg-6 mb-3 mb-lg-0">
                <LineGraph history={history} predict={predict} />
              </div>
              <div className="col-12 col-lg-3">
                <Numerics
                  current={currentValues.values[portIndex]}
                  unit={portConfigurations[portIndex].unit}
                  history={history}
                  datapoints={datapoints}
                  predict={predict}
                  setPredict={setPredict}
                />
              </div>
            </div>
            <div>
              <DataHistory
                portConfiguration={portConfigurations[portIndex]}
                history={history}
                setPrompt={setPrompt}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// renders this when data are still being retrieved
const LoadingState = () => (
  <div className="d-flex flex-column flex-grow-1 mt-3 px-2 px-md-0">
    <div className="row mb-4">
      <div className="col-12 col-lg-3 mb-3 mb-lg-0">
        <img
          src={loadingtile}
          className="rounded w-100"
          style={{ objectFit: "cover", height: "340px" }}
        />
      </div>
      <div className="col-12 col-lg-6 mb-3 mb-lg-0">
        <img
          src={loadingtile}
          className="rounded w-100"
          style={{ objectFit: "cover", height: "340px" }}
        />
      </div>
      <div className="col-12 col-lg-3 mb-3 mb-lg-0">
        <img
          src={loadingtile}
          className="rounded w-100 mb-3"
          style={{ objectFit: "cover", height: "155px" }}
        />
        <img
          src={loadingtile}
          className="rounded w-100 mt-3"
          style={{ objectFit: "cover", height: "155px" }}
        />
      </div>
    </div>
    <div className="row">
      <div className="col-12">
        <img
          src={loadingtile}
          className="rounded w-100"
          style={{ objectFit: "cover", height: "550px" }}
        />
      </div>
    </div>
  </div>
);
