import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import handshake from "../assets/handshake.png";
import eyeOpen from "../assets/eye-open.png";
import eyeClosed from "../assets/eye-closed.png";
import "../index.css"; // Poppins font globally imported

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error on change
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Minimum 6 characters required";

    if (formData.confirmPassword !== formData.password)
      newErrors.confirmPassword = "Passwords do not match";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const errorText = await response.text();
      if (response.ok) {
        navigate("/login");
      } else {
        if (errorText === "Email already exists") {
          setErrors({ email: "Email already exists" });
        } else if (errorText === "Username already exists") {
          setErrors({ username: "Username already exists" });
        } else {
          alert("Unknown error: " + errorText);
        }
      }
    } catch (error) {
      alert("Server error: " + error.message);
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
        <form
          className="w-full max-w-[260px] text-center"
          onSubmit={handleSubmit}
          noValidate
        >
          <h2 className="text-xl font-semibold text-left text-gray-800 mb-4">
            Sign up
          </h2>

          {/* Username */}
          <div className="mb-3 text-left">
            <label className="block text-gray-700 text-xs mb-1">Username</label>
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

          {/* Email */}
          <div className="mb-3 text-left">
            <label className="block text-gray-700 text-xs mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-3 text-left">
            <label className="block text-gray-700 text-xs mb-1">Password</label>
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

          {/* Confirm Password */}
          <div className="mb-3 text-left">
            <label className="block text-gray-700 text-xs mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                } rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm`}
              />
              <img
                src={showConfirmPassword ? eyeOpen : eyeClosed}
                alt="Toggle visibility"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 w-4 h-4 cursor-pointer opacity-70 hover:opacity-100"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gray-300 text-gray-700 py-2 mt-3 rounded-full text-sm hover:bg-gray-400 transition-colors"
          >
            Sign up
          </button>

          <p className="mt-4 text-xs text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
