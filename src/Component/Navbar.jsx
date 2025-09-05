import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Menu, X } from "lucide-react";
import logo from "../assets/logo.png";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

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

    checkToken();
    const interval = setInterval(checkToken, 60000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { name: "Home", to: "/" },
    { name: "Security", to: "/security" },
    { name: "Investment", to: "/investment" },
    { name: "Review", to: "/review" },
  ];

  return (
    <nav className="w-full bg-gray-900 fixed top-0 left-0 z-50 shadow-md backdrop-blur">
      <div className="max-w-screen-xl mx-auto px-6 py-2 flex items-center justify-between text-amber-100">
        {/* Logo */}
        <div
          className={`flex items-center space-x-4 transform transition-all duration-500
            ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
            }`}
        >
          <img
            src={logo}
            alt="Logo"
            className="h-10 w-10 object-contain rounded-2xl"
          />
          <span className="text-lg font-bold">Your Bank</span>
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-4">
          {navLinks.map((link, idx) => (
            <li
              key={link.name}
              className={`transition-all duration-500 ease-out
                ${
                  mounted
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-2"
                }
                ${mounted ? `delay-[${idx * 60}ms]` : ""}`}
            >
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

        {/* Desktop Auth Buttons */}
        <div
          className={`hidden md:flex space-x-2 transition-all duration-500
            ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
            } delay-[240ms]`}
        >
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

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-white"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu (animated with Tailwind) */}
      <div
        className={`md:hidden bg-gray-800 text-amber-100 px-6 overflow-hidden origin-top
          transition-all duration-300 ease-out
          ${
            menuOpen
              ? "max-h-[480px] opacity-100 scale-y-100 py-4"
              : "max-h-0 opacity-0 scale-y-95 py-0"
          }`}
      >
        <div className="space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.to}
              className="block py-2 text-lg hover:bg-white/20 rounded-md px-2"
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        <div className="pt-4 space-y-2">
          {isLoggedIn ? (
            <NavLink to="/dashboard" onClick={() => setMenuOpen(false)}>
              <button className="w-full px-4 py-2 rounded-md border border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black transition duration-200">
                Get Started
              </button>
            </NavLink>
          ) : (
            <>
              <NavLink to="/login" onClick={() => setMenuOpen(false)}>
                <button className="w-full px-4 py-2 rounded-md border border-white text-white hover:bg-white/30 transition duration-200">
                  Login
                </button>
              </NavLink>
              <NavLink to="/signup" onClick={() => setMenuOpen(false)}>
                <button className="w-full px-4 py-2 rounded-md border border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black transition duration-200">
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
