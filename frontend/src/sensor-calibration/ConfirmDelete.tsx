import { FormulaType, useAquaSenseContext } from "../Context";

export default function ConfirmDelete({ formula }: { formula: FormulaType }) {
  const { isFetching, deleteFormula } = useAquaSenseContext();

  async function handleDelete() {
    if (isFetching) return;

    try {
      await deleteFormula(formula.formula_number);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="modal fade" id="deleteFormula">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              Confirm Action
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            />
          </div>
          <div className="modal-body">
            Are you sure you want to delete this ADC formula?
            <div
              className="alert alert-light my-2"
              role="alert"
              style={{ fontSize: "14px" }}
            >
              <span className="fw-medium">Label</span>: [
              {formula.formula_number}] {formula.name} <br />
              <span className="fw-medium">Formula</span>: {formula.formula}
            </div>
            Please ensure that this formula is not currently assigned to any
            port channel before proceeding.
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-outline-danger"
              data-bs-dismiss="modal"
              onClick={handleDelete}
              disabled={isFetching}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
