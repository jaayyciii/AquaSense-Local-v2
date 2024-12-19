import { useCallback, useEffect } from "react";
import { HistoryType } from "../Context";

// component props
type NumericsProps = {
  current: number;
  unit: string;
  history: HistoryType[];
  datapoints: number;
  predict: number | null;
  setPredict: React.Dispatch<React.SetStateAction<number | null>>;
};

export default function Numerics({
  current,
  unit,
  history,
  datapoints,
  predict,
  setPredict,
}: NumericsProps) {
  // calculates the extrapolated value in the next 30 minutes using Lagrange
  const lagrangeInterpolation = useCallback(
    (x: number, xValues: number[], yValues: number[]): number => {
      const n = xValues.length;
      let result = 0;

      for (let i = 0; i < n; i++) {
        let term = yValues[i];
        for (let j = 0; j < n; j++) {
          if (i !== j) {
            term *= (x - xValues[j]) / (xValues[i] - xValues[j]);
          }
        }
        result += term;
      }
      return result;
    },
    []
  );

  // gets the latest <ExtrapolationDataPoints> (as xy) values as data for extrapolation
  useEffect(() => {
    const dataset = history.slice(0, datapoints);
    if (dataset.length < datapoints) return () => setPredict(null);

    const xValues = dataset.map(({ time }) => time!.getTime());
    const yValues = dataset.map(({ value }) => value!);
    const nextThirtyMinutes = dataset[0].time!.getTime() + 1800000;
    setPredict(lagrangeInterpolation(nextThirtyMinutes, xValues, yValues));
  }, [history, lagrangeInterpolation]);

  return (
    <div className="d-flex flex-column gap-3 gap-md-4 h-100 w-100">
      {/* Current Real-time Value */}
      <div className="bg-primary shadow rounded p-4 h-100">
        <h5 className="text-white" style={{ fontSize: "18px" }}>
          Real-time Value
        </h5>
        <h2 className="my-2 text-white">
          {current.toFixed(2)} {unit}
        </h2>
      </div>
      {/* Predicted Value in the next 30 minutes */}
      <div className="bg-primary shadow rounded p-4 h-100">
        <h5 className="text-white" style={{ fontSize: "18px" }}>
          Predicted Value (+30 minutes)
        </h5>
        <h2 className="my-2 text-white">
          {predict == null ? "-" : predict.toFixed(2)}{" "}
          {predict == null ? "" : unit}
        </h2>
      </div>
    </div>
  );
}
