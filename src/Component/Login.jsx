import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import handshake from "../assets/handshake.png";
import eyeOpen from "../assets/eye-open.png";
import eyeClosed from "../assets/eye-closed.png";
import "../index.css";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [otp, setOtp] = useState("");
  const [isOtpRequired, setIsOtpRequired] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Add this near other states
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Loader state for OTP
  const navigate = useNavigate();
  const ResedOtp = async () => {
    if (cooldown > 0) return; // Prevent clicking while timer active

    try {
      await fetch(`http://localhost:8080/resend/${formData.username}`, {
        method: "GET",
      });
      startCooldown(); // Start 2-minute cooldown after success
    } catch (error) {
      setErrors({ general: "Server error: " + error.message });
    }
  };

  const startCooldown = () => {
    setCooldown(120); // 120 seconds = 2 minutes
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true); // Start loader
    await new Promise((resolve) => setTimeout(resolve, 5000)); // 5-sec delay

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoginLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.text();
      if (response.ok) {
        if (data.includes("OTP")) {
          setIsOtpRequired(true);
          alert("OTP sent to your registered email/phone.");
        } else {
          const token = data.replace("Token : ", "").trim();
          if (token.startsWith("ey")) {
            localStorage.setItem("token", token);
            alert("Login successful!");
            navigate("/dashboard");
          } else {
            setErrors({
              general: "Login failed: Invalid token format from server.",
            });
          }
        }
      } else {
        setErrors({ general: "Invalid username or password" });
      }
    } catch (error) {
      setErrors({ general: "Server error: " + error.message });
    } finally {
      setLoginLoading(false); // Stop loader
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true); // Show loader
    try {
      const response = await fetch(
        `http://localhost:8080/verifyOtp/${formData.username}/${otp}`,
        { method: "POST" }
      );
      const data = await response.text();
      if (response.ok) {
        localStorage.setItem("token", data.replace("Token : ", "").trim());
        alert("OTP verified successfully!");
        navigate("/dashboard");
      } else {
        setErrors({ general: "OTP verification failed" });
      }
    } catch (error) {
      setErrors({ general: "Server error: " + error.message });
    } finally {
      setLoading(false); // Hide loader
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[76vh] font-poppins overflow-hidden max-w-[640px] mx-auto mt-25 text-[15px]">
      {/* Left Side (Handshake Image) */}
      <div className="relative w-[47.5%] hidden md:block">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${handshake})` }}
        ></div>
        <div className="absolute inset-0 bg-opacity-40"></div>
        <div className="relative z-10 text-amber-100 flex pt-10 flex-col items-center justify-start h-full px-4">
          <div className="flex items-center mb-7 gap-2">
            <img
              src={logo}
              alt="Bank Logo"
              className="h-12 w-12 object-contain rounded-2xl mr-2 bg-white p-1"
            />
            <h2 className="text-2xl font-bold whitespace-nowrap">YourBank</h2>
          </div>
        </div>
      </div>

      {/* Right Side (Form) */}
      <div className="w-full md:w-[52.5%] flex items-center justify-center px-4 py-6 bg-white">
        {!isOtpRequired ? (
          <form
            className="w-full max-w-[260px] text-center"
            onSubmit={handleLogin}
            noValidate
          >
            <h2 className="text-xl font-semibold text-left text-gray-800 mb-4">
              Login
            </h2>

            {errors.general && (
              <p className="text-red-500 text-xs text-left mb-2">
                {errors.general}
              </p>
            )}

            {/* Username */}
            <div className="mb-3 text-left">
              <label className="block text-gray-700 text-xs mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.username ? "border-red-500" : "border-gray-300"
                } rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm`}
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
              )}
            </div>

            {/* Password */}
            <div className="mb-3 text-left">
              <label className="block text-gray-700 text-xs mb-1">
                Your password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm`}
                />
                <img
                  src={showPassword ? eyeOpen : eyeClosed}
                  alt="Toggle visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 w-4 h-4 cursor-pointer opacity-70 hover:opacity-100"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-right mb-3">
              <a
                href="#"
                className="text-xs text-gray-600 hover:text-blue-500 hover:underline transition"
              >
                Forget your password
              </a>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-gray-300 text-gray-700 py-2 rounded-full text-sm hover:bg-gray-400 transition flex items-center justify-center"
            >
              {loginLoading ? (
                <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Login"
              )}
            </button>

            <p className="mt-4 text-xs text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        ) : (
          <div className="w-full max-w-[260px] text-center">
            <h2 className="text-xl font-semibold text-left text-gray-800 mb-4">
              Enter OTP
            </h2>
            {errors.general && (
              <p className="text-red-500 text-xs text-left mb-2">
                {errors.general}
              </p>
            )}
            <div className="mb-3 text-left">
              <label className="block text-gray-700 text-xs mb-1">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className={`w-full px-3 py-2 border ${
                  errors.otp ? "border-red-500" : "border-gray-300"
                } rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm`}
                placeholder="Enter OTP"
              />
              <button
                onClick={ResedOtp}
                disabled={cooldown > 0}
                className="text-blue-500 text-xs mt-2 hover:underline disabled:opacity-50"
              >
                {cooldown > 0 ? `Retry in ${cooldown}s` : "Resend OTP"}
              </button>

              {errors.otp && (
                <p className="text-red-500 text-xs mt-1">{errors.otp}</p>
              )}
            </div>

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-gray-300 text-gray-700 py-2 rounded-full text-sm hover:bg-gray-400 transition flex items-center justify-center"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Verify OTP"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
