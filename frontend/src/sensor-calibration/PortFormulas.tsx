import { useEffect, useState } from "react";
import { PortConfigurationType, useAquaSenseContext } from "../Context";
import { ContextType } from "../home/HomeLayout";

export default function PortFormulas({ setPrompt }: ContextType) {
  const {
    isFetching,
    portConfigurations,
    putPortConfiguration,
    postFirebaseTimestamp,
    formulas,
  } = useAquaSenseContext();
  const [editPortFormula, setEditPortFormula] =
    useState<PortConfigurationType[]>(portConfigurations);
  const [isEditAllowed, setIsEditAllowed] = useState<boolean>(false);

  useEffect(() => {
    if (isFetching) return;

    const updatePortFormulas = async () => {
      const updates = portConfigurations
        .map((port) => {
          const formula = formulas.find(
            (f) => f.formula_number === port.formula_number
          );
          if (formula === undefined) {
            return {
              port_number: port.port,
              name: port.define,
              unit: port.unit,
              active: port.active,
              display: false,
              range_min: port.range[0],
              range_max: port.range[1],
              thresh_min: port.threshold[0],
              thresh_max: port.threshold[1],
              time: new Date(),
              formula_number: 0,
            };
          }
          return null;
        })
        .filter((port) => port !== null);

      if (updates.length === 0) return;

      try {
        await Promise.all(
          updates.map((update) =>
            putPortConfiguration(update.port_number, update)
          )
        );
      } catch (error) {
        console.error(error);
      }
    };

    if (portConfigurations && formulas) {
      updatePortFormulas();
    }
  }, [portConfigurations, formulas]);

  async function handleSave() {
    if (isFetching) return;
    const timestamp = new Date();
    const encodedTimestamp = encodeURIComponent(
      timestamp.toLocaleString("en-US", { hour12: true }).replace(/\//g, "-")
    );

    const updates = editPortFormula
      .map((port) => {
        if (
          port.formula_number !== portConfigurations[port.port].formula_number
        ) {
          return {
            port_number: portConfigurations[port.port].port,
            name: portConfigurations[port.port].define,
            unit: portConfigurations[port.port].unit,
            active: portConfigurations[port.port].active,
            display: false,
            range_min: portConfigurations[port.port].range[0],
            range_max: portConfigurations[port.port].range[1],
            thresh_min: portConfigurations[port.port].threshold[0],
            thresh_max: portConfigurations[port.port].threshold[1],
            time: timestamp,
            formula_number: editPortFormula[port.port].formula_number,
          };
        }
        return null;
      })
      .filter((port) => port !== null);

    if (updates.length === 0) {
      setIsEditAllowed(false);
      return;
    }

    try {
      await Promise.all(
        updates.map((update) => {
          putPortConfiguration(update.port_number, update);
          postFirebaseTimestamp(update.port_number, encodedTimestamp);
        })
      );
      setPrompt(
        `Port channel formula assignment has been successful for port/s ${updates.map(
          (p) => p.port_number
        )}. Please check to verify the changes.`
      );
    } catch (error) {
      console.error(error);
      setPrompt(
        "Oops! Something went wrong. Port channel formula assignment was unsuccessful. Please try again or check your connection"
      );
    }
  }

  function handleCancel() {
    setEditPortFormula(portConfigurations);
    setIsEditAllowed(false);
  }

  return (
    <div className="d-flex flex-column bg-primary shadow rounded p-4 h-75">
      <div className="d-flex flex-row justify-content-between align-items-center mb-3">
        <h5 className="text-white mb-0" style={{ fontSize: "18px" }}>
          Port Channel Formulas
        </h5>
        <div className="d-flex gap-2">
          {!isEditAllowed ? (
            <button
              type="button"
              className="btn btn-sm btn-outline-light d-flex align-items-center px-2"
              style={{ height: "30px" }}
              onClick={() => setIsEditAllowed(true)}
              disabled={isFetching}
            >
              <i className="bi bi-tools" style={{ fontSize: "18px" }} />
              <span className="ms-2 d-none d-md-flex">Edit Assignments</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-sm btn-light d-flex align-items-center px-2"
                style={{ height: "30px" }}
                onClick={handleCancel}
              >
                <span className="d-none d-md-flex">Cancel</span>
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-light d-flex align-items-center px-2"
                style={{ height: "30px" }}
                onClick={handleSave}
              >
                <span className="d-none d-md-flex">Save Actions</span>
              </button>
            </>
          )}
        </div>
      </div>
      <div style={{ overflowY: "auto" }}>
        <table className="table table-hover bg-white m-0">
          <tbody
            className="text-white table-group-divider"
            style={{ fontSize: "14px" }}
          >
            {editPortFormula.map((port, index) => (
              <tr key={port.port}>
                <td className="bg-primary text-white">
                  Port Channel {port.port} :
                </td>
                <td className="bg-primary text-white">
                  {!isEditAllowed ? (
                    formulas.find(
                      (formula) =>
                        formula.formula_number === port.formula_number
                    )?.name
                  ) : (
                    <select
                      className="form-select"
                      style={{ fontSize: "12px" }}
                      value={port.formula_number}
                      onChange={(e) => {
                        const updatedPortFormula = [...editPortFormula];
                        updatedPortFormula[index] = {
                          ...port,
                          formula_number: parseInt(e.target.value, 10),
                        };
                        setEditPortFormula(updatedPortFormula);
                      }}
                      disabled={port.display}
                    >
                      {formulas.map((formula) => (
                        <option
                          key={formula.formula_number}
                          value={formula.formula_number}
                        >
                          {formula.name}
                        </option>
                      ))}
                    </select>
                  )}
                </td>
                <td className="bg-primary text-white col-1">
                  {port.active && port.formula_number == 0 && (
                    <i className="bi bi-exclamation-circle" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
