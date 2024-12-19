import { Link } from "react-router-dom";
import { useMemo } from "react";
import SensorTile from "./SensorTile";
import nodisplay from "../assets/nodisplay.png";
import loadingtile from "../assets/loadingtile.gif";
import { useAquaSenseContext } from "../Context";

export default function SensorList() {
  const { isFetching, portConfigurations, currentValues } =
    useAquaSenseContext();

  // returns true when there are no ports displayed; otherwise, false
  const noPortsDisplayed: boolean = useMemo(() => {
    return portConfigurations.filter((port) => port.display).length === 0;
  }, [portConfigurations]);

  return (
    <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-4 w-100">
      {isFetching ? (
        <LoadingState />
      ) : noPortsDisplayed ? (
        <NoPortsDisplayed />
      ) : (
        portConfigurations?.map(
          (port) =>
            port.display && (
              <Link
                key={port.port}
                to={`port-details?index=${port.port}`}
                role="button"
                className="btn p-0 w-100"
                style={{ width: "auto", maxWidth: "320px", maxHeight: "340px" }}
              >
                <SensorTile
                  portConfiguration={portConfigurations[port.port]}
                  currentValue={currentValues.values[port.port]}
                />
              </Link>
            )
        )
      )}
    </div>
  );
}

const LoadingState = () => (
  <>
    <div>
      <img
        src={loadingtile}
        className="rounded"
        style={{ width: "auto", maxWidth: "320px", minHeight: "340px" }}
      />
    </div>
    <div>
      <img
        src={loadingtile}
        className="rounded"
        style={{ width: "auto", maxWidth: "320px", minHeight: "340px" }}
      />
    </div>
  </>
);

const NoPortsDisplayed = () => (
  <div className="d-flex flex-column justify-content-center align-items-center rounded h-100 w-100 p-3">
    <img src={nodisplay} style={{ maxWidth: "150px", height: "auto" }} />
    <h2 className="text-primary text-center mt-2"> No Ports Displayed </h2>
    <p className="text-center fw-medium" style={{ fontSize: "14px" }}>
      Our virtual fish tank is empty. Time to configure some ports!
    </p>
  </div>
);
