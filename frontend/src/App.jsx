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
import CityRoomsPage from "./components/admin/CityRoomPage";
import RoomDetailsPage from "./components/admin/RoomDetailsPage";
import AdminMaintenanceTable from "./components/admin/MaintenanceTable";
import MyBookings from "./components/resident/MyBookings";

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
          <Route path="maintenance" element={<AdminMaintenanceTable />} />
          <Route path="rooms/:city" element={<CityRoomsPage />} />
          <Route path="rooms/details/:roomId" element={<RoomDetailsPage />} />
        </Route>
        <Route path="/resident/:id" element={<ResidentPage />} />
        <Route path="/resident/:id/bookings" element={<MyBookings />} />
      </Routes>
    </Router>
  );
};

export default App;
