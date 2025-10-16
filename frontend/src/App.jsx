import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LogIn from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import ResidentPage from "./components/ResidentEnrollment";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/resident/:id" element={<ResidentPage />} />
      </Routes>
    </Router>
  );
};

export default App;
