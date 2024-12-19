import { useState } from "react";
import { FormulaType, useAquaSenseContext } from "../Context";
import ConfirmDelete from "./ConfirmDelete";

export default function Formulas() {
  const { isFetching, portConfigurations, formulas } = useAquaSenseContext();
  const [formula, setFormula] = useState<FormulaType>({
    formula_number: 0,
    name: "-",
    formula: "-",
  });

  return (
    <>
      <ConfirmDelete formula={formula} />
      <div className="d-flex flex-column bg-white shadow rounded p-4 h-75">
        <div className="d-flex flex-row justify-content-between align-items-center mb-3">
          <h5 className="mb-0" style={{ fontSize: "18px" }}>
            Manage Formulas
          </h5>
        </div>
        <div style={{ height: "250px", overflowY: "auto" }}>
          <table className="table table-hover bg-white m-0">
            <thead className="table position-sticky top-0">
              <tr>
                <th className="fw-medium fs-6 col-3">Label</th>
                <th className="fw-medium fs-6 col-8">Formula</th>
                <th className="fw-medium fs-6 col-1" />
              </tr>
            </thead>
            <tbody className="table-group-divider" style={{ fontSize: "14px" }}>
              {!isFetching && formulas.length > 0 ? (
                formulas.map(
                  (formula: FormulaType) =>
                    formula.formula_number !== 0 && (
                      <tr key={formula.formula_number}>
                        <td>{formula.name}</td>
                        <td>{formula.formula}</td>
                        <td>
                          <button
                            className={`btn border-0 bi ${
                              !portConfigurations.some(
                                (port) =>
                                  port.formula_number === formula.formula_number
                              ) && "bi-trash"
                            }`}
                            style={{ fontSize: "14px" }}
                            data-bs-toggle="modal"
                            data-bs-target="#deleteFormula"
                            onClick={() => setFormula(formula)}
                            disabled={portConfigurations.some(
                              (port) =>
                                port.formula_number === formula.formula_number
                            )}
                          />
                        </td>
                      </tr>
                    )
                )
              ) : (
                <tr>
                  <td colSpan={3} className="py-3 text-center text-muted">
                    No ADC Formula Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
