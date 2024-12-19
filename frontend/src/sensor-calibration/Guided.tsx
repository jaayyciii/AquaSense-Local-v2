import { useEffect, useState } from "react";
import GuidedOC from "./GuidedOC";
import { CalibrationType } from "./Calibration";
import { useAquaSenseContext } from "../Context";

type VariableDataType = {
  name: string;
  value: number;
};

type ChannelDataType = {
  name: string;
  value: number;
  isCustom: boolean;
};

type PredefinedFormulaType = {
  type: string;
  name: string;
  formula: string;
};

export default function Guided({
  selectedCOMPort,
  selectedChannel,
  setPrompt,
  disable,
}: CalibrationType) {
  const { portConfigurations } = useAquaSenseContext();
  const [selectedFormula, setSelectedFormula] = useState<string>("");
  const [selectedFormulaType, setSelectedFormulaType] =
    useState<string>("Custom");
  const [predefinedFormulas, setPredefinedFormulas] = useState<
    PredefinedFormulaType[]
  >([]);
  const [generatedFormula, setGeneratedFormula] = useState<string>("");
  const [formulaLabel, setFormulaLabel] = useState<string>("");
  const [customVariables, setCustomVariables] = useState<VariableDataType[]>(
    []
  );
  const [customChannels, setCustomChannels] = useState<ChannelDataType[]>([]);
  const [onePointData, setOnePointData] = useState<{
    value: number;
    adc: number;
  }>({
    value: 0,
    adc: 0,
  });
  const [twoPointData, setTwoPointData] = useState<
    {
      value: number;
      adc: number;
    }[]
  >([
    { value: 0, adc: 0 },
    { value: 0, adc: 0 },
  ]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const getPredefinedFormulas = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/predefined-formulas/`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }
        const data = await response.json();
        setPredefinedFormulas(
          data.map((formula: any) => {
            return {
              type: "Custom",
              name: formula.name,
              formula: formula.formula,
              isCustom: false,
            };
          })
        );
      } catch (error) {
        console.error(error);
      }
    };

    getPredefinedFormulas();
  }, []);

  useEffect(() => {
    setError("");
    setGeneratedFormula("");
    if (selectedFormulaType == "Custom") {
      setCustomVariables([]);
      setCustomChannels([]);
      setSelectedFormula("");
    } else if (selectedFormulaType == "One Point") {
      setOnePointData({ value: 0, adc: 0 });
      setSelectedFormula("");
    } else if (selectedFormulaType == "Two Point") {
      setTwoPointData([
        { value: 0, adc: 0 },
        { value: 0, adc: 0 },
      ]);
      setSelectedFormula("Two Point");
    } else {
      setCustomVariables([]);
      setCustomChannels([]);
      const matchedFormula = predefinedFormulas.find(
        (formula) => formula.formula === selectedFormulaType
      );
      setSelectedFormula(matchedFormula?.formula || "");
    }
  }, [selectedFormulaType]);

  async function extractVariablesAndChannels() {
    setError("");
    setGeneratedFormula("");
    setCustomVariables([]);
    setCustomChannels([]);
    try {
      const encodedFormula = encodeURIComponent(selectedFormula);
      const var_response = await fetch(
        `http://localhost:8000/extract-variables/?formula=${encodedFormula}`
      );

      const var_snapshot = await var_response.json();
      if (!var_response.ok) {
        setError(var_snapshot.detail);
        return;
      }

      setCustomVariables(
        var_snapshot.variable_list.map((variable: string) => ({
          name: variable,
          value: 0,
        }))
      );

      const ch_response = await fetch(
        `http://localhost:8000/extract-channels/?formula=${encodedFormula}`
      );
      const ch_snapshot = await ch_response.json();
      if (!ch_response.ok) {
        setError(ch_snapshot.detail);
        return;
      }

      setCustomChannels(
        ch_snapshot.channel_list.map((channel: string) => ({
          name: channel,
          value: 0,
        }))
      );
    } catch (e) {
      console.error(e);
    }
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

  async function convertChannels() {
    let updatedFormula = selectedFormula;

    customChannels.forEach((channel) => {
      const regex = new RegExp(channel.name, "g");
      updatedFormula = channel.isCustom
        ? updatedFormula.replace(regex, `${channel.value}`)
        : updatedFormula.replace(regex, `CH${channel.value}`);
    });

    return updatedFormula;
  }

  async function calibrate() {
    setGeneratedFormula("");
    let formula = selectedFormula;

    if (customChannels.length !== 0) {
      formula = await convertChannels();
    }

    const encodedFormula = encodeURIComponent(formula);
    if (selectedFormulaType == "One Point") {
      try {
        const response = await fetch(
          `http://localhost:8000/calib-guided-onepoint/?formula=${encodedFormula}&adc=${onePointData.adc}&val=${onePointData.value}`,
          {
            method: "POST",
          }
        );
        const snapshot = await response.json();
        if (!response.ok) {
          setPrompt(snapshot.detail);
          setError(snapshot.detail);
          return;
        }

        setGeneratedFormula(snapshot.formula);
      } catch (e) {
        console.error(e);
      }
    } else if (selectedFormulaType == "Two Point") {
      try {
        const response = await fetch(
          `http://localhost:8000/calib-guided-twopoint?adc1=${twoPointData[0].adc}&adc2=${twoPointData[0].value}&val1=${twoPointData[1].adc}&val2=${twoPointData[1].value}`,
          {
            method: "POST",
          }
        );
        const snapshot = await response.json();
        if (!response.ok) {
          setPrompt(snapshot.detail);
          setError(snapshot.detail);
          return;
        }

        setGeneratedFormula(snapshot.formula);
      } catch (e) {
        console.error(e);
      }
    } else {
      try {
        const response = await fetch(
          "http://localhost:8000/calib-guided-custom/",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              formula: formula,
              names: customVariables.map((variable) => variable.name),
              values: customVariables.map((variable) => variable.value),
            }),
          }
        );
        const snapshot = await response.json();
        if (!response.ok) {
          setPrompt(snapshot.detail);
          setError(snapshot.detail);
          return;
        }

        setGeneratedFormula(snapshot.formula);
      } catch (e) {
        console.error(e);
      }
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
      setPrompt(
        "Oops! Something went wrong. We couldn't save your ADC formula. Please try again, or check your connection."
      );
    }
  }

  return (
    <>
      <GuidedOC />
      <div
        className="h-100 w-100 px-3 border border-top-0"
        style={{ maxHeight: "540px", overflowY: "auto" }}
      >
        <div className="my-3">
          <label htmlFor="formulaInput" className="form-label">
            <span className="text-primary fw-bold">Step 1:</span> Sensor ADC
            Formula
          </label>
          <div className="d-flex">
            <textarea
              id="formulaInput"
              className="form-control w-75"
              value={selectedFormula}
              onChange={(e) => setSelectedFormula(e.target.value)}
              disabled={disable}
              readOnly={
                !(
                  selectedFormulaType == "Custom" ||
                  selectedFormulaType == "One Point"
                )
              }
            />
            <select
              className="form-select ms-2 w-25"
              value={selectedFormulaType}
              onChange={(e) => setSelectedFormulaType(e.target.value)}
              disabled={disable}
              style={{ width: "150px", height: "38px" }}
            >
              <option value="Custom">Custom</option>
              <option value="One Point">One Point</option>
              <option value="Two Point">Two Point</option>
              {predefinedFormulas.map((formula, index) => (
                <option key={index} value={formula.formula}>
                  {formula.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-text text-info m-0" style={{ fontSize: "13px" }}>
            <span className="my-2">
              {error === "" ? (
                <div>
                  <i className="bi bi-info-circle" /> Select a preset ADC
                  formula or enter a custom one for your sensor.
                </div>
              ) : (
                <div
                  className="form-text text-danger m-0"
                  style={{ fontSize: "13px" }}
                >
                  <i className="bi bi-exclamation-circle-fill" />
                  <span className="my-2"> {error}</span>
                </div>
              )}
            </span>
          </div>
        </div>
        <div className="border border-1 border-opacity-10 my-2" />
        <div className="mb-3">
          <label htmlFor="formulaInput" className="form-label">
            <span className="text-primary fw-bold">Step 2:</span> Data
            Collection
          </label>
          {selectedFormulaType === "One Point" ? (
            <div className="d-flex mb-2">
              <div className="input-group flex-grow-1">
                <span className="input-group-text">Unit:</span>
                <input
                  type="number"
                  value={onePointData.value}
                  className="form-control"
                  placeholder="Actual Value"
                  onChange={(e) =>
                    setOnePointData({
                      ...onePointData,
                      value: isNaN(parseFloat(e.target.value))
                        ? 0
                        : parseFloat(e.target.value),
                    })
                  }
                  disabled={disable}
                />
                <span className="input-group-text">ADC:</span>
                <input
                  type="number"
                  value={onePointData.adc}
                  className="form-control"
                  placeholder="ADC Value"
                  disabled={disable}
                  readOnly
                />
              </div>
              <button
                className="btn btn-primary ms-2"
                onClick={async () => {
                  const mv = await fetchMvData();
                  setOnePointData({
                    ...onePointData,
                    adc: mv,
                  });
                }}
                disabled={disable}
              >
                Measure
              </button>
            </div>
          ) : selectedFormulaType === "Two Point" ? (
            <>
              <div className="d-flex mb-2">
                <div className="input-group flex-grow-1">
                  <span className="input-group-text">Unit:</span>
                  <input
                    type="number"
                    value={twoPointData[0].value}
                    className="form-control"
                    placeholder="Actual Value"
                    onChange={(e) =>
                      setTwoPointData((prevData) =>
                        prevData.map((data, index) =>
                          index === 0
                            ? {
                                ...data,
                                value: isNaN(parseFloat(e.target.value))
                                  ? 0
                                  : parseFloat(e.target.value),
                              }
                            : data
                        )
                      )
                    }
                    disabled={disable}
                  />
                  <span className="input-group-text">ADC:</span>
                  <input
                    type="number"
                    value={twoPointData[0].adc}
                    className="form-control"
                    placeholder="ADC Value"
                    disabled={disable}
                    readOnly
                  />
                </div>
                <button
                  className="btn btn-primary ms-2"
                  onClick={async () => {
                    const mv = await fetchMvData();
                    setTwoPointData((prevData) =>
                      prevData.map((data, index) =>
                        index === 0 ? { ...data, adc: mv } : data
                      )
                    );
                  }}
                  disabled={disable}
                >
                  Measure
                </button>
              </div>
              <div className="d-flex mb-2">
                <div className="input-group flex-grow-1">
                  <span className="input-group-text">Unit:</span>
                  <input
                    type="number"
                    value={twoPointData[1].value}
                    className="form-control"
                    placeholder="Actual Value"
                    onChange={(e) =>
                      setTwoPointData((prevData) =>
                        prevData.map((data, index) =>
                          index === 1
                            ? {
                                ...data,
                                value: isNaN(parseFloat(e.target.value))
                                  ? 0
                                  : parseFloat(e.target.value),
                              }
                            : data
                        )
                      )
                    }
                    disabled={disable}
                  />
                  <span className="input-group-text">ADC:</span>
                  <input
                    type="number"
                    value={twoPointData[1].adc}
                    className="form-control"
                    placeholder="ADC Value"
                    disabled={disable}
                    readOnly
                  />
                </div>
                <button
                  className="btn btn-primary ms-2"
                  onClick={async () => {
                    const mv = await fetchMvData();
                    setTwoPointData((prevData) =>
                      prevData.map((data, index) =>
                        index === 1 ? { ...data, adc: mv } : data
                      )
                    );
                  }}
                  disabled={disable}
                >
                  Measure
                </button>
              </div>
            </>
          ) : (
            <>
              {customVariables.map((variable, index) => {
                return (
                  <div className="d-flex mb-2" key={variable.name}>
                    <div className="input-group flex-grow-1">
                      <span className="input-group-text">{variable.name}</span>
                      <input
                        type="number"
                        value={variable.value}
                        className="form-control"
                        onChange={(e) =>
                          setCustomVariables((prevVariables) =>
                            prevVariables.map((v, i) =>
                              i === index
                                ? {
                                    ...v,
                                    value: isNaN(parseFloat(e.target.value))
                                      ? 0
                                      : parseFloat(e.target.value),
                                  }
                                : v
                            )
                          )
                        }
                        disabled={disable}
                      />
                    </div>
                    <button
                      className="btn btn-primary ms-2"
                      onClick={async () => {
                        const mv = await fetchMvData();
                        setCustomVariables(
                          customVariables.map((v, i) =>
                            i === index ? { ...v, value: mv } : v
                          )
                        );
                      }}
                      disabled={disable}
                    >
                      Measure
                    </button>
                  </div>
                );
              })}
              {customChannels.map((channel, index) => (
                <div className="d-flex mb-2" key={`${channel.name}-${index}`}>
                  <div className="input-group flex-grow-1">
                    <span className="input-group-text">
                      {channel.name}{" "}
                      {channel.isCustom ? "(Constant)" : "(Channel)"}
                    </span>
                    {channel.isCustom ? (
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Enter custom value"
                        value={channel.value}
                        onChange={(e) =>
                          setCustomChannels(
                            customChannels.map((c, i) =>
                              i === index
                                ? {
                                    ...c,
                                    value: isNaN(parseFloat(e.target.value))
                                      ? 0
                                      : parseFloat(e.target.value),
                                  }
                                : c
                            )
                          )
                        }
                        disabled={disable}
                      />
                    ) : (
                      <select
                        className="form-control"
                        value={channel.value}
                        onChange={(e) =>
                          setCustomChannels(
                            customChannels.map((c, i) =>
                              i === index
                                ? {
                                    ...c,
                                    value: Number(e.target.value),
                                  }
                                : c
                            )
                          )
                        }
                        disabled={disable}
                      >
                        {portConfigurations.map((port) => (
                          <option value={port.port} key={port.port}>
                            Channel {port.port}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <button
                    className="btn btn-primary ms-2"
                    onClick={() => {
                      setCustomChannels(
                        customChannels.map((c, i) =>
                          i === index
                            ? {
                                ...c,
                                value: 0,
                                isCustom: !c.isCustom,
                              }
                            : c
                        )
                      );
                    }}
                    disabled={disable}
                    style={{ width: "100px" }}
                  >
                    Switch
                  </button>
                </div>
              ))}

              <div className="d-flex align-items-end justify-content-center">
                <button
                  className="btn btn-outline-primary w-75"
                  onClick={() => extractVariablesAndChannels()}
                  disabled={disable}
                >
                  Extract Variables and Channels
                </button>
              </div>
            </>
          )}
        </div>
        <div className="border border-1 border-opacity-10 my-2" />
        <div className="d-flex flex-column my-2">
          <label htmlFor="formulaInput" className="form-label mb-3">
            <span className="text-primary fw-bold">Step 3:</span> Generate
            Formula
          </label>
          <div className="w-100 d-flex justify-content-center">
            <button
              className="btn btn-outline-primary w-75"
              onClick={() => {
                calibrate();
              }}
              disabled={disable || selectedFormula == ""}
            >
              Start Calibration
            </button>
          </div>
        </div>
        <div className="border border-1 border-opacity-10 my-2" />
        <label htmlFor="formulaInput" className="form-label mb-3">
          <span className="text-primary fw-bold">Step 4:</span> Verify and Save
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
        <div className="alert alert-light text-center">
          <code>{generatedFormula}</code>
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
