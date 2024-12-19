export default function FAQ() {
  return (
    <div className="w-100">
      <h4 className="text-primary-emphasis mb-2" id="faqs">
        <i
          className="bi bi-question-circle me-2"
          style={{ fontSize: "24px" }}
        />
        Frequently Asked Questions
      </h4>
      <p className="fw-light my-3" style={{ fontSize: "16px" }}>
        Got questions about AquaSense Visuals? Check out the FAQs below for
        quick answers on setup, troubleshooting, and managing your system.
      </p>
      <div className="d-flex justify-content-center my-3 w-100">
        <div
          className="accordion w-100"
          id="faqsaccordion"
          style={{ maxWidth: "800px" }}
        >
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed fw-medium"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faqs1"
              >
                What should I do if the sensor port values are not updating?
              </button>
            </h2>
            <div
              id="faqs1"
              className="accordion-collapse collapse"
              data-bs-parent="#faqsaccordion"
            >
              <div className="accordion-body" style={{ fontSize: "14px" }}>
                <h6>Troubleshooting Steps</h6>
                <ul>
                  <li className="mb-1">
                    Ensure you have a stable internet connection. If not, find a
                    reliable connection and try again.
                  </li>
                  <li className="mb-1">
                    On your{" "}
                    <span className="fw-medium text-primary">Home Page</span>,
                    check if the sensor ports are active. You can find this
                    information on each sensor tile, just below the defined
                    sensor type. If any of the ports are inactive, consider
                    inspecting the device on-site.
                  </li>
                </ul>
                <h6>On-site Inspection</h6>
                <ol>
                  <li className="mb-1">
                    Check if the local server is running. If it is, but the
                    issue persists, try restarting the server.
                  </li>
                  <li className="mb-1">
                    Ensure the device is powered on and properly plugged into an
                    outlet. Confirm that there are no power outages in the
                    location.
                  </li>
                  <li className="mb-1">
                    Verify that the sensor is securely plugged into the port. If
                    it still doesn't work, try unplugging and plugging it back
                    in, or move the sensor to another port.
                  </li>
                  <li className="mb-1">
                    Inspect the sensor for damage. If necessary, perform a
                    sensor calibration to confirm it’s functioning correctly.
                  </li>
                </ol>
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed fw-medium"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faqs2"
              >
                Why isn't the water change button working, and how can I fix it?
              </button>
            </h2>
            <div
              id="faqs2"
              className="accordion-collapse collapse"
              data-bs-parent="#faqsaccordion"
            >
              <div className="accordion-body" style={{ fontSize: "14px" }}>
                If the water change button is unclickable, it could be because
                the local server is overriding the system's actuation control.
                This usually happens when a sensor reading exceeds the defined
                threshold, triggering the system's automatic actuation. Control
                will be returned to you once the actuation process is complete.
                <br />
                <br />
                If this is not the case, try refreshing the website and ensure
                you have a stable internet connection.
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed fw-medium"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faqs3"
              >
                Who is allowed to configure and manage the AquaSense Visuals
                platform?
              </button>
            </h2>
            <div
              id="faqs3"
              className="accordion-collapse collapse"
              data-bs-parent="#faqsaccordion"
            >
              <div className="accordion-body" style={{ fontSize: "14px" }}>
                Port configurations and other system controls are available only
                to administrators. Guest users can view and export data but
                cannot make changes, to prevent unauthorized system control.
                <br />
                <br />
                If you're unsure of your role, you can check your profile by
                clicking the user icon next to your username in the top-right
                corner of the window.
                <br />
                <br />
                <h6>How to become an administrator?</h6>
                Role assignments can only be managed on-site through the local
                application.
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed fw-medium"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faqs4"
              >
                I've already connected the sensor, so why can't I configure it
                yet?
              </button>
            </h2>
            <div
              id="faqs4"
              className="accordion-collapse collapse"
              data-bs-parent="#faqsaccordion"
            >
              <div className="accordion-body" style={{ fontSize: "14px" }}>
                Ensure the sensor is properly connected to the device. A
                notification should appear upon connection, or you can check the
                status through the local application.
                <br />
                <br />
                If the connection is detected but the issue persists, the admin
                may not have assigned an ADC Formula for this channel,
                preventing conversion of sensor readings to actual units.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
