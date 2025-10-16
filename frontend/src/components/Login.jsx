import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { PiBuildingOfficeFill } from "react-icons/pi";
import { MdOutlineMail } from "react-icons/md";
import { FaEye, FaLock, FaRegUser } from "react-icons/fa";

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [existingUser, setExistingUser] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] =
    useState(false);
  const navigate = useNavigate();

  const base_url = import.meta.env.VITE_BASE_URL;

  const handleLogIn = async () => {
    if (!existingUser.email || !existingUser.password || !existingUser.role) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      const res = await axios.post(`${base_url}/api/auth/login`, existingUser);
      if (res.status === 200) {
        toast.success(`Welcome ${res.data.user.name}`);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        if (res.data.user.role === "admin") {
          localStorage.setItem("token", res.data.token);
          navigate("/admin/dashboard");
        } else if (res.data.user.role === "resident") {
          localStorage.setItem("resident_token", res.data.token);
          navigate(`/resident/${res.data.user.id}`);
        }
      }

      console.log(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      console.error(error.response?.data?.message || error.message);
    }
  };

  const handleRegister = async () => {
    try {
      if (newUser.password !== newUser.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      const res = await axios.post(`${base_url}/api/auth/register`, newUser);
      toast.success("Registered successfully! Please log in.");
      setIsRegister(false);
      setNewUser({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
      });
      console.log(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      console.error(error.response?.data?.message || error.message);
    }
  };

  const loginUserContent = () => (
    <div className="space-y-5">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-bold text-gray-700 mb-2"
        >
          Email Address*
        </label>
        <div className="relative">
          <MdOutlineMail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            id="email"
            name="email"
            type="email"
            value={existingUser.email}
            onChange={(e) =>
              setExistingUser({ ...existingUser, email: e.target.value })
            }
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
            placeholder="Enter your email"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-bold text-gray-700 mb-2"
        >
          Your Password*
        </label>
        <div className="relative">
          {(() => {
            const Icon = showLoginPassword ? FaEye : FaLock;
            return (
              <Icon
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer"
                onClick={() => setShowLoginPassword((prev) => !prev)}
              />
            );
          })()}
          <input
            id="password"
            name="password"
            type={showLoginPassword ? "text" : "password"}
            value={existingUser.password}
            onChange={(e) =>
              setExistingUser({ ...existingUser, password: e.target.value })
            }
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
            placeholder="Enter your password"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="role"
          className="block text-sm font-bold text-gray-700 mb-2"
        >
          Choose your role*
        </label>
        <div className="relative">
          <FaRegUser className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            name="role"
            value={existingUser.role}
            onChange={(e) =>
              setExistingUser({ ...existingUser, role: e.target.value })
            }
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
          >
            <option value="">Select a role</option>
            <option value="admin">Admin</option>
            <option value="resident">Resident</option>
          </select>
        </div>
      </div>
    </div>
  );

  const registerUserContent = () => (
    <div className="space-y-5">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-bold text-gray-700 mb-2"
        >
          Full Name*
        </label>
        <div className="relative">
          <FaRegUser className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            id="name"
            name="name"
            type="text"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
            placeholder="Enter your full name"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-bold text-gray-700 mb-2"
        >
          Email Address*
        </label>
        <div className="relative">
          <MdOutlineMail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            id="email"
            name="email"
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
            placeholder="Enter your email"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-bold text-gray-700 mb-2"
        >
          Password*
        </label>
        <div className="relative">
          {(() => {
            const Icon = showRegisterPassword ? FaEye : FaLock;
            return (
              <Icon
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer"
                onClick={() => setShowRegisterPassword((prev) => !prev)}
              />
            );
          })()}
          <input
            id="password"
            name="password"
            type={showRegisterPassword ? "text" : "password"}
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
            placeholder="Enter your password"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-bold text-gray-700 mb-2"
        >
          Confirm Password*
        </label>
        <div className="relative">
          {(() => {
            const Icon = showRegisterConfirmPassword ? FaEye : FaLock;
            return (
              <Icon
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer"
                onClick={() => setShowRegisterConfirmPassword((prev) => !prev)}
              />
            );
          })()}
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showRegisterConfirmPassword ? "text" : "password"}
            value={newUser.confirmPassword}
            onChange={(e) =>
              setNewUser({ ...newUser, confirmPassword: e.target.value })
            }
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
            placeholder="Confirm your password"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="role"
          className="block text-sm font-bold text-gray-700 mb-2"
        >
          Choose your role*
        </label>
        <div className="relative">
          <FaRegUser className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            name="role"
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
          >
            <option value="">Select a role</option>
            <option value="admin">Admin</option>
            <option value="resident">Resident</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4 shadow-lg">
            <PiBuildingOfficeFill className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hostel Management
          </h1>
          <p className="text-gray-600">
            {isRegister ? "Create an account" : "Sign in to your account"}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {isRegister ? registerUserContent() : loginUserContent()}

          <button
            onClick={isRegister ? handleRegister : handleLogIn}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 mt-4"
          >
            {isRegister ? "Register" : "Sign In"}
          </button>

          <p className="text-sm text-center mt-3">
            {isRegister
              ? "Already have an account? "
              : "Don't have an account? "}
            <span
              className="text-indigo-600 font-semibold cursor-pointer"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? "Sign In" : "Register here"}
            </span>
          </p>
        </div>
      </div>

      {/* Toast container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </div>
  );
};

export default Login;
