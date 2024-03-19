import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ManualUpload from "./pages/ManualUpload";
import EndOfDay from "./pages/EndOfDay";
import AnomalyReports from "./pages/AnomalyReports";
import Notification from "./pages/Notification";
import ViewAll from "./components/ViewAll";
import Profile from "./pages/Profile";
import Component from "./components/Component";
import Home from "./components/Home";
import ViewAllReport from "./components/ViewAllReport";
import ViewReportDetail from "./components/ViewReportDetail";
import ViewFileDetails from "./components/ViewFileDetails";

export default function App() {
  return (
 <Router>
  <Routes>
    {/* <Route path="/" element={<Home />} /> */}
    <Route path="/" element={<Dashboard />} />
    <Route path="/manual-uploads" element={<ManualUpload />} />
    <Route path="/end-of-day" element={<EndOfDay />} />
    <Route path="/anomaly-reports" element={<AnomalyReports />} />
    <Route path="/notifications" element={<Notification />} />
    <Route path="/view-reports" element={<ViewAllReport />} />
    <Route path="/view-reports-detail" element={<ViewReportDetail />} />
    <Route path="/view-file-details" element={<ViewFileDetails />} />
    <Route path="/view-all" element={<Component />} />
    <Route path="/profile" element={<Profile />} />

  </Routes>
 </Router>

  )
}
