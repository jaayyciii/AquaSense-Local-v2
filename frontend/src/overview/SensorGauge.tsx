import { useEffect, useState, useMemo } from "react";
import GaugeChart from "react-gauge-chart";

// typescript data types
type ChartType = {
  chartRange: [number, number];
  chartThreshold: [number, number];
};

// component props
type SensorGaugeProps = {
  currentValue: number;
  range: [number, number];
  threshold: [number, number];
};

export default function SensorGauge({
  currentValue,
  range,
  threshold,
}: SensorGaugeProps) {
  // current value
  const [value, setValue] = useState<number>(0);
  // port configurations
  const [chart, setChart] = useState<ChartType>({
    chartRange: [0, 100],
    chartThreshold: [30, 60],
  });

  // the following useEffects are used to check whether the values are finite, and not NaN
  useEffect(() => {
    const chartRange: [number, number] = range.every(Number.isFinite)
      ? range
      : [0, 100];
    let chartThreshold: [number, number] = threshold.every(Number.isFinite)
      ? [...threshold]
      : [30, 60];

    if (chartThreshold[0] < chartRange[0]) {
      chartThreshold[0] = chartRange[0];
    }
    if (chartThreshold[1] > chartRange[1]) {
      chartThreshold[1] = chartRange[1];
    }

    setChart({
      chartRange: chartRange,
      chartThreshold: chartThreshold,
    });
  }, [range, threshold]);
  useEffect(() => {
    setValue(Number.isFinite(currentValue) ? currentValue : 0);
  }, [currentValue]);

  // calculates the positions in the chart accordingly
  const { chartRange, chartThreshold } = chart;
  const lowerCrit = useMemo(
    () => (chartThreshold[0] - chartRange[0]) / (chartRange[1] - chartRange[0]),
    [chartThreshold, chartRange]
  );
  const safe = useMemo(
    () =>
      (chartThreshold[1] - chartThreshold[0]) / (chartRange[1] - chartRange[0]),
    [chartThreshold]
  );
  const higherCrit = useMemo(
    () => (chartRange[1] - chartThreshold[1]) / (chartRange[1] - chartRange[0]),
    [chartThreshold, chartRange]
  );
  const needle = useMemo(
    () => value / (chartRange[1] - chartRange[0]),
    [value]
  );

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ width: "100%", height: "100%" }}
    >
      {/* Utilized react-gauge-chart for Chart rendering */}
      <GaugeChart
        id="gauge-chart"
        marginInPercent={0.02}
        percent={needle}
        arcPadding={0.01}
        arcWidth={0.2}
        arcsLength={[lowerCrit, safe, higherCrit]}
        colors={["#ffc107", "#198754", "#dc3545"]}
        needleColor="black"
        needleBaseColor="black"
        hideText={true}
        animateDuration={800}
      />
    </div>
  );
}
