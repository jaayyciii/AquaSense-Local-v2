import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import MainRouter from "./MainRouter";

createRoot(document.getElementById("root")!).render(<MainRouter />);
