import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AquaSenseProvider } from "./Context";
import HomeRouter from "./home/HomeRouter";

export default function MainRouter() {
  return (
    <Router>
      <AquaSenseProvider>
        <Routes>
          <Route path="*" element={<HomeRouter />} />
        </Routes>
      </AquaSenseProvider>
    </Router>
  );
}
