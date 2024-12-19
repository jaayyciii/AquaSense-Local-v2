import SensorGauge from "./SensorGauge.tsx";
import { PortConfigurationType } from "../Context.tsx";

// component props
type SensorTileProps = {
  portConfiguration: PortConfigurationType;
  currentValue: number;
};

export default function SensorTile({
  portConfiguration,
  currentValue,
}: SensorTileProps) {
  return (
    <div className="d-flex flex-column justify-content-between bg-white shadow rounded p-4 w-100 h-100">
      <div className="lh-1">
        <h5 style={{ fontSize: "18px" }}>{portConfiguration.define}</h5>
        <h6
          className={`card-subtitle fw-light ${
            portConfiguration.active
              ? "text-success"
              : "badge text-bg-danger text-wrap"
          }`}
          style={{ fontSize: "11px" }}
        >
          Channel {portConfiguration.port}:{" "}
          <span>
            {portConfiguration.active ? (
              <>
                Active <i className="bi bi-wifi" />
              </>
            ) : (
              <>
                Inactive <i className="bi bi-wifi-off" />
              </>
            )}
          </span>
        </h6>
      </div>
      <div className="align-self-center my-5" style={{ maxWidth: "280px" }}>
        <SensorGauge
          currentValue={currentValue}
          range={portConfiguration.range}
          threshold={portConfiguration.threshold}
        />
      </div>
      <div className="d-flex justify-content-center align-items-end">
        <h5 className="mx-2 my-0">
          {currentValue.toFixed(2)} {portConfiguration.unit}
        </h5>
        <span
          className={`badge ${
            portConfiguration.threshold[0] > currentValue
              ? "bg-warning"
              : portConfiguration.threshold[1] < currentValue
              ? "bg-danger"
              : "bg-success"
          }`}
          style={{ fontSize: "12px" }}
        >
          {portConfiguration.threshold[0] > currentValue
            ? "Too Low"
            : portConfiguration.threshold[1] < currentValue
            ? "Too High"
            : "Normal"}
        </span>
        <br />
      </div>
    </div>
  );
}
