import { Route, Routes } from "react-router-dom";
import BrokenURL from "../BrokenURL";
import HomeLayout from "./HomeLayout";
import DeviceOverviewPanel from "./DeviceOverviewPanel";
import SensorDetailPanel from "./SensorDetailPanel";
import HelpCenterPanel from "./HelpCenterPanel";
import AdminControlsPanel from "./AdminControlsPanel";
import CalibrationPanel from "./CalibrationPanel";
import LocationPanel from "./LocationPanel";

export default function HomeRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomeLayout />}>
        <Route index element={<DeviceOverviewPanel />} />
        <Route path="port-details" element={<SensorDetailPanel />} />.
        <Route path="location" element={<LocationPanel />} />
        <Route path="sensor-calibration" element={<CalibrationPanel />} />
        <Route path="admin-controls" element={<AdminControlsPanel />} />
        <Route path="help-center" element={<HelpCenterPanel />} />
      </Route>
      {/* ERROR 404 CATCH */}
      <Route path="*" element={<BrokenURL />} />
    </Routes>
  );
}
