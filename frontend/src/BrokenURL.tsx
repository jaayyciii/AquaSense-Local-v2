import logowhite from "./assets/logowhite.png";

export default function BrokenURL() {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center bg-primary"
      style={{ height: "100vh" }}
    >
      <div className="d-flex align-items-center mb-4">
        <img
          src={logowhite}
          alt="logo"
          className="me-3"
          style={{ width: "20px" }}
        />
        <span className="text-white fw-bold fs-6">AquaSense Visuals</span>
      </div>
      <h5 className="text-white text-center fw-bold mb-1">
        Hey there, Farmer! It looks like you've wandered off the path.
      </h5>
      <p className="text-white text-center mb-4" style={{ fontSize: "14px" }}>
        <strong>Error 404.</strong> The requested URL was not found on this
        server.
      </p>
      <a
        href="/"
        className="btn btn-sm btn-light fw-medium text-primary-emphasis px-2"
        style={{ fontSize: "12px" }}
      >
        Return Home
      </a>
    </div>
  );
}
