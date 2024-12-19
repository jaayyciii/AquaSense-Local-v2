import { useState } from "react";
import UnguidedOC from "./UnguidedOC";
import { CalibrationType } from "./Calibration";

type DataPointType = {
  x: number;
  y: number;
};

export default function Unguided({
  selectedCOMPort,
  selectedChannel,
  setPrompt,
  disable,
}: CalibrationType) {
  const [dataPoints, setDataPoints] = useState<DataPointType[]>([
    { x: 0, y: 0 },
  ]);
  const [generatedFormula, setGeneratedFormula] = useState<string>("");
  const [generatedAccuracy, setGeneratedAccuracy] = useState<string>("");
  const [formulaLabel, setFormulaLabel] = useState<string>("");

  function addDataPoint() {
    setDataPoints((prevDataPoints) => [...prevDataPoints, { x: 0, y: 0 }]);
  }

  function deleteDataPoint(index: number) {
    const updatedDataPoints = dataPoints.filter((_, i) => i !== index);
    setDataPoints(updatedDataPoints);
  }

  async function fetchMvData() {
    try {
      const response = await fetch(
        `http://localhost:8000/request-data/?com_port=${selectedCOMPort}&channel=${selectedChannel}`
      );

      const snapshot = await response.json();
      if (!response.ok) {
        setPrompt(snapshot.detail);
        return 0;
      }
      return snapshot.data;
    } catch (e) {
      console.error(e);
    }
  }

  async function postFormula() {
    try {
      const response = await fetch("http://localhost:8000/formula-data/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formula_number: Math.floor(Math.random() * (500 - 0 + 1)) + 0,
          name: formulaLabel,
          formula: generatedFormula,
        }),
      });
      const snapshot = await response.json();
      if (!response.ok) {
        setPrompt(snapshot.detail);
        return;
      }
      setPrompt(
        "Your ADC Formula has been saved successfully. You can verify it in 'Manage Formulas'."
      );
    } catch (e) {
      console.error(e);
    }
  }

  async function calibrate() {
    try {
      const response = await fetch("http://localhost:8000/calib-unguided/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          x: dataPoints.map((point) => point.y),
          y: dataPoints.map((point) => point.x),
        }),
      });
      const snapshot = await response.json();
      if (!response.ok) {
        setPrompt(snapshot.detail);
      }
      setGeneratedFormula(snapshot.formula);
      setGeneratedAccuracy(snapshot.accuracy);
    } catch (e) {
      console.error(e);
      setPrompt(
        "Oops! Something went wrong. We couldn't save your ADC formula. Please try again, or check your connection."
      );
    }
  }

  return (
    <>
      <UnguidedOC />
      <div
        className="h-100 w-100 px-3 border border-top-0"
        style={{ maxHeight: "540px", overflowY: "auto" }}
      >
        <div className="my-3">
          <div className="d-flex justify-content-between align-items-center">
            <label htmlFor="formulaInput" className="form-label">
              <span className="text-primary fw-bold">Step 1:</span> Data
              Collection
            </label>
          </div>
          {dataPoints.map((dataPoint, index) => (
            <div className="d-flex mb-2" key={index}>
              <div className="input-group flex-grow-1">
                <span className="input-group-text">Unit:</span>
                <input
                  type="number"
                  className="form-control"
                  value={dataPoint.x}
                  placeholder="Actual Value"
                  onChange={(e) => {
                    const updatedDataPoints = [...dataPoints];
                    updatedDataPoints[index] = {
                      ...updatedDataPoints[index],
                      x: isNaN(parseFloat(e.target.value))
                        ? 0
                        : parseFloat(e.target.value),
                    };
                    setDataPoints(updatedDataPoints);
                  }}
                  disabled={disable}
                />
                <span className="input-group-text">ADC:</span>
                <input
                  type="text"
                  className="form-control"
                  value={dataPoint.y}
                  placeholder="ADC Value"
                  disabled={disable}
                  readOnly
                />
              </div>
              <button
                className="btn btn-primary ms-2"
                onClick={async () => {
                  const mv = await fetchMvData();
                  const updatedDataPoints = [...dataPoints];
                  updatedDataPoints[index] = {
                    ...updatedDataPoints[index],
                    y: mv,
                  };
                  setDataPoints(updatedDataPoints);
                }}
                disabled={disable}
              >
                Measure
              </button>
              <button
                className="btn btn-outline-primary ms-2"
                onClick={() => deleteDataPoint(index)}
                disabled={disable}
              >
                <i className="bi bi-trash3" />
              </button>
            </div>
          ))}
        </div>
        <div className="d-flex align-items-center justify-content-center my-3">
          <button
            className="btn btn-outline-primary w-75"
            onClick={() => addDataPoint()}
            disabled={disable}
          >
            Add Data Point
          </button>
        </div>
        <div className="border border-1 border-opacity-10 my-2" />
        <div className="d-flex flex-column my-2">
          <label htmlFor="formulaInput" className="form-label mb-3">
            <span className="text-primary fw-bold">Step 2:</span> Generate
            Formula
          </label>
          <div className="w-100 d-flex justify-content-center">
            <button
              className="btn btn-outline-primary w-75"
              onClick={() => {
                calibrate();
              }}
              disabled={disable || dataPoints.length === 0}
            >
              Start Calibration
            </button>
          </div>
        </div>
        <div className="border border-1 border-opacity-10 my-2" />
        <label htmlFor="formulaInput" className="form-label mb-3">
          <span className="text-primary fw-bold">Step 3:</span> Verify and Save
          Formula
        </label>
        <div className="input-group">
          <span className="input-group-text">Formula Label</span>
          <input
            className="form-control"
            value={formulaLabel}
            placeholder="e.g., pH Level, Dissolved Oxygen, Temperature"
            onChange={(e) => setFormulaLabel(e.target.value)}
            disabled={disable || generatedFormula == ""}
          />
        </div>
        <div
          className="form-text text-info mt-0 my-2"
          style={{ fontSize: "13px" }}
        >
          <i className="bi bi-info-circle" /> Give your formula a unique label
          to help you easily distinguish it later.
        </div>
        <div className="alert alert-light">
          <small className="fw-medium">Generated Formula:</small>
          <p className="text-center">
            <code>{generatedFormula}</code>
          </p>
          <small className="fw-medium">Accuracy:</small>
          <p className="text-center">
            <code>{generatedAccuracy}</code>
          </p>
        </div>
        <div className="w-100 d-flex justify-content-center mb-3">
          <button
            className="btn btn-primary w-75"
            onClick={() => postFormula()}
            disabled={disable || generatedFormula == "" || formulaLabel == ""}
          >
            Save ADC Formula
          </button>
        </div>
      </div>
    </>
  );
}
