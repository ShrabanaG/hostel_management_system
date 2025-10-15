import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LogIn from "./components/Login";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LogIn />} />
      </Routes>
    </Router>
  );
};

export default App;
