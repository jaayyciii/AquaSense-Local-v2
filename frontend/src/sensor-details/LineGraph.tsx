import { useEffect, useMemo, useRef } from "react";
import { Chart, ChartConfiguration, registerables } from "chart.js";
import { HistoryType } from "../Context";
Chart.register(...registerables);

// component props
type LineGraphProps = {
  history: HistoryType[];
  predict: number | null;
};

export default function LineGraph({ history, predict }: LineGraphProps) {
  // canvas and chart reference
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart<"line"> | null>(null);

  // sets the recent data timestamps (as label) and values as data for the line graph
  const data = useMemo(() => {
    const labels = history.slice(0, 48).map((entry) =>
      entry?.time
        ? entry.time.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })
        : "null"
    );
    const values = history.slice(0, 48).map((entry) => entry?.value ?? 0);

    const newLabels = [...labels.reverse()];
    const newValues = [...values.reverse()];

    if (predict !== null) {
      newLabels.push("Predicted at 30 minutes");
      newValues.push(predict);
    }

    // returns the complete details to be utilized by the line graph
    // sets the predicted value as the latest data with E.+30m label
    return {
      labels: newLabels,
      datasets: [
        {
          label: "Value",
          data: newValues,
          backgroundColor: [
            ...values.map((value) => (value === 0 ? "gray" : "white")),
            "royalblue",
          ],
          borderColor: "royalblue",
          borderWidth: 1,
          pointRadius: 5,
          segment: {
            borderDash: (ctx: any) =>
              ctx.p0DataIndex === history.length - 1 &&
              ctx.p1DataIndex === history.length
                ? [5, 5]
                : undefined,
          },
        },
      ],
    };
  }, [history, predict]);

  // sets the chart configuration
  useEffect(() => {
    const config: ChartConfiguration<"line"> = {
      type: "line",
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        elements: {
          line: {
            tension: 0.3,
          },
        },
        scales: {
          x: {
            display: false,
          },
        },
      },
    };

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        chartRef.current = new Chart(ctx, config);
      }
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data]);

  return (
    <div className="d-flex flex-column bg-white shadow rounded p-4 h-100 w-100">
      <h5 style={{ fontSize: "18px" }}>Data Trend Tracker</h5>
      <div
        className="d-flex justify-content-center align-items-center mt-3"
        style={{ maxHeight: "280px", height: "100%" }}
      >
        <canvas ref={canvasRef} id="myChart" />
      </div>
    </div>
  );
}
