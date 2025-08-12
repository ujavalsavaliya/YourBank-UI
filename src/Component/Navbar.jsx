import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import logo from "../assets/logo.png";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decoded.exp && decoded.exp > currentTime) {
            setIsLoggedIn(true);
          } else {
            localStorage.removeItem("token");
            setIsLoggedIn(false);
          }
        } catch (err) {
          console.error("Invalid JWT:", err.message);
          localStorage.removeItem("token");
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    checkToken(); // Run immediately
    const interval = setInterval(checkToken, 1000 * 60); // Every 1 min

    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="w-full bg-gray-900 fixed top-0 left-0 z-50 shadow-md backdrop-blur">
      <div className="max-w-screen-xl mx-auto px-6 py-2 flex items-center justify-between text-amber-100">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <img
            src={logo}
            alt="Logo"
            className="h-10 w-10 object-contain rounded-2xl"
          />
          <span className="text-lg font-bold">Your Bank</span>
        </div>

        {/* Nav Links */}
        <ul className="flex space-x-4">
          {[
            { name: "Home", to: "/" },
            { name: "Security", to: "/security" },
            { name: "Investment", to: "/investment" },
            { name: "Review", to: "/review" },
          ].map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-1 rounded-md transition duration-200 cursor-pointer
                  ${
                    isActive
                      ? "bg-white/30 text-white"
                      : "text-amber-100 hover:bg-white/20 hover:text-white"
                  }`
                }
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Auth Buttons */}
        <div className="flex space-x-2">
          {isLoggedIn ? (
            <NavLink to="/dashboard">
              <button className="px-4 py-1 rounded-md border border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black transition duration-200">
                Get Started
              </button>
            </NavLink>
          ) : (
            <>
              <NavLink to="/login">
                <button className="px-4 py-1 rounded-md border border-white text-white hover:bg-white/30 transition duration-200">
                  Login
                </button>
              </NavLink>
              <NavLink to="/signup">
                <button className="px-4 py-1 rounded-md border border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black transition duration-200">
                  Sign Up
                </button>
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
