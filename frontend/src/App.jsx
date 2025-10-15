import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LogIn from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";

const App = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route
          path="/admin/dashboard"
          element={
            user?.role === "admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        {/* <Route
          path="/resident/:id"
          element={
            user?.role === "resident" ? (
              <ResidentDashboard />
            ) : (
              <Navigate to="/" replace />
            )
          }
        /> */}
      </Routes>
    </Router>
  );
};

export default App;
