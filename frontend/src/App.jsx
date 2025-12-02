import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LogIn from "./components/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ResidentPage from "./components/ResidentEnrollment";
import AdminLayout from "./components/admin/AdminLayout";
import RoomLayout from "./components/admin/RoomLayout";
import FinanceDashboard from "./components/admin/FinanceDashboard";
import ResidentsTable from "./components/admin/ResidentsTable";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="rooms" element={<RoomLayout />} />
          <Route path="residents" element={<ResidentsTable />} />
          <Route path="finance" element={<FinanceDashboard />} />
        </Route>
        <Route path="/resident/:id" element={<ResidentPage />} />
      </Routes>
    </Router>
  );
};

export default App;
