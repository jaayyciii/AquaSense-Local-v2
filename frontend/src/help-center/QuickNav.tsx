export default function QuickNav() {
  return (
    <div className="row mt-3">
      <div className="col-4 col-md-3">
        <a
          className="d-flex align-items-center justify-content-center btn btn-primary shadow rounded h-100 p-4"
          href="#gettingstarted"
          style={{ height: "150px" }}
        >
          <div className="text-center text-white">
            <div
              className="d-flex align-items-center justify-content-center border border-2 rounded mx-auto"
              style={{ width: "35px", height: "35px" }}
            >
              <i
                className="bi bi-rocket-takeoff"
                style={{ fontSize: "18px" }}
              />
            </div>
            <h6 className="mt-2 mb-1">Getting Started</h6>
            <p className="d-none d-md-flex m-0" style={{ fontSize: "11px" }}>
              Your guide to kickstart your experience with AquaSense Local App.
            </p>
          </div>
        </a>
      </div>
      <div className="col-4 col-md-3">
        <a
          className="d-flex align-items-center justify-content-center btn btn-primary shadow rounded h-100 p-4"
          href="#sensorcalibration"
          style={{ height: "150px" }}
        >
          <div className="text-center text-white">
            <div
              className="d-flex align-items-center justify-content-center border border-2 rounded mx-auto"
              style={{ width: "35px", height: "35px" }}
            >
              <i className="bi bi-plugin" style={{ fontSize: "18px" }} />
            </div>
            <h6 className="mt-2 mb-1">Sensor Calibration</h6>
            <p className="d-none d-md-flex m-0" style={{ fontSize: "11px" }}>
              Learn how to calibrate your analog sensors for accurate data
              conversion!
            </p>
          </div>
        </a>
      </div>
      <div className="col-4 col-md-3">
        <a
          className="d-flex align-items-center justify-content-center btn btn-primary shadow rounded h-100 p-4"
          href="#faqs"
          style={{ height: "150px" }}
        >
          <div className="text-center text-white">
            <div
              className="d-flex align-items-center justify-content-center border border-2 rounded mx-auto"
              style={{ width: "35px", height: "35px" }}
            >
              <i
                className="bi bi-question-circle"
                style={{ fontSize: "18px" }}
              />
            </div>
            <h6 className="mt-2 mb-1">FAQs</h6>
            <p className="d-none d-md-flex m-0" style={{ fontSize: "11px" }}>
              Common questions and answers to help you navigate AquaSense.
            </p>
          </div>
        </a>
      </div>
      <div className="col-4 col-md-3">
        <a
          className="d-flex align-items-center justify-content-center btn btn-primary shadow rounded h-100 p-4"
          href="#cu"
          style={{ height: "150px" }}
        >
          <div className="text-center text-white">
            <div
              className="d-flex align-items-center justify-content-center border border-2 rounded mx-auto"
              style={{ width: "35px", height: "35px" }}
            >
              <i className="bi bi-envelope" style={{ fontSize: "18px" }} />
            </div>
            <h6 className="mt-2 mb-1">Contact Us</h6>
            <p className="d-none d-md-flex m-0" style={{ fontSize: "11px" }}>
              Reach out for support or inquiries about AquaSense Local App.
            </p>
          </div>
        </a>
      </div>
    </div>
  );
}
