export default function UnguidedOC() {
  return (
    <div
      className="offcanvas offcanvas-end bg-subtle"
      data-bs-scroll="true"
      data-bs-backdrop="false"
      id="guide"
    >
      <div className="offcanvas-header">
        <h5 className="text-primary offcanvas-title">Unguided Calibration</h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
        />
      </div>
      <div className="offcanvas-body">
        <div className="mb-5">
          <h6 className="fw-bold">I. Unguided Calibration</h6>
          <p className="fw-light">
            Unguided calibration generates a formula based on your data points.
            For five or fewer points, it uses{" "}
            <strong>Lagrange interpolation</strong>. For more than five points,
            it applies <strong>multiple regression methods</strong> (i.e.,
            linear, polynomial, logarithmic, exponential, and non-linear) and
            selects the best fit using R-squared, ensuring precise calibration
            regardless of the dataset size.
          </p>
          <p className="fw-medium">Instructions:</p>
          <ol>
            <li className="mb-3">
              Start by adding your data points. Click the{" "}
              <span className="fw-medium text-primary">Add Data Point</span>{" "}
              button to input as many data points as needed.
            </li>
            <li className="mb-3">
              For each data point, enter the actual unit of measure, then click{" "}
              <span className="fw-medium text-primary">Measure</span> to get the
              corresponding analog value.
            </li>
            <li className="mb-3">
              Once done, click{" "}
              <span className="fw-medium text-primary">Start Calibration</span>
            </li>
            <li className="mb-3">
              After calibration, verify the generated formula. Then, click{" "}
              <span className="fw-medium text-primary">Save ADC Formula</span>{" "}
              to store it in your formula list.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
