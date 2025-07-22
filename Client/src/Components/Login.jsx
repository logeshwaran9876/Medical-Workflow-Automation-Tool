import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FiMail,
  FiLock,
  FiLogIn,
  FiUserPlus,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom"; // <-- This is key for redirection
const Input = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  icon,
  placeholder,
  className = "",
  ...props
}) => (
  <div className={`relative mb-4 ${className}`}>
    {label && (
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
    )}
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${
          icon ? "pl-10" : ""
        }`}
        {...props}
      />
    </div>
  </div>
);

// Button Component
const Button = ({
  children,
  onClick,
  type = "button",
  loading = false,
  variant = "primary",
  className = "",
  ...props
}) => {
  const baseStyle =
    "flex items-center justify-center px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500";
  const variants = {
    primary: "bg-teal-600 text-white hover:bg-teal-700 shadow-md",
    secondary: "bg-white text-teal-600 border border-teal-600 hover:bg-teal-50",
    link: "text-teal-600 hover:text-teal-700 hover:underline px-0 py-0 focus:ring-0",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      type={type}
      disabled={loading}
      className={`${baseStyle} ${variants[variant]} ${
        loading ? "opacity-70 cursor-not-allowed" : ""
      } ${className}`}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin h-5 w-5 text-white mr-3"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : null}
      {children}
    </motion.button>
  );
};

// --- Main Login Page Component ---

const API_BASE_URL = "http://localhost:5000/api"; // Your backend API base URL

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      toast.error("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      // Replace with your actual login endpoint and payload
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      // Assuming your backend returns a token or user data on successful login
      const { token, user,redirectUrl} = response.data;

      // Store token (e.g., in localStorage or a state management solution)
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));
     
      toast.success(`Welcome back, ${user.name || user.email}!`);

      console.log("Login successful:", user);

      navigate(redirectUrl);
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-100 p-4 font-inter">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md backdrop-filter backdrop-blur-lg bg-opacity-90 border border-gray-100"
      >
        <div className="text-center mb-8">
          {/* Placeholder for a logo or icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            }}
            className="w-16 h-16 mx-auto bg-teal-500 rounded-full flex items-center justify-center mb-4 shadow-lg"
          >
            <FiLogIn className="text-white text-3xl" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back!
          </h1>
          <p className="text-gray-500">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <Input
            id="email"
            label="Email Address"
            type="email"
            placeholder="your@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<FiMail className="text-gray-400" />}
            required
          />
          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<FiLock className="text-gray-400" />}
            required
          />

          <div className="flex justify-between items-center text-sm">
            {/* You can add a "Remember Me" checkbox here if needed */}
            <a href="#" className="text-teal-600 hover:underline">
              Forgot password?
            </a>
          </div>

          <Button type="submit" loading={loading} className="w-full">
            Log In
          </Button>

          <div className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{" "}
            <a href="#" className="text-teal-600 hover:underline">
              Sign Up
            </a>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
