import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "./assets/logo.png";
import Withdraw from "./assets/cash-withdrawal.png";
import home from "./assets/home.png";
import Deposit from "./assets/deposit.png";
import Transfer from "./assets/invoice.png";
import Transaction from "./assets/money.png";
import robot from "./assets/robot.png"

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", to: "/dashboard", icon: home },
    { name: "Deposit", to: "/deposit", icon: Deposit },
    { name: "Withdraw", to: "/withdraw", icon: Withdraw },
    { name: "Transfer", to: "/transfer", icon: Transfer },
    { name: "Transaction", to: "/transaction", icon: Transaction },
    { name: "Chatbot", to: "/chatbot", icon: robot },
  ];

  return (
    <aside className="h-screen w-60 fixed top-0 left-0 z-50 bg-white/30 backdrop-blur-md shadow-md border-r border-gray-200 flex flex-col justify-between">
      {/* Top section: logo + links */}
      <div>
        {/* Logo and Bank Name */}
        <div className="flex items-center gap-2 py-6 justify-center mb-4 border-b border-gray-300">
          <img
            src={logo}
            alt="Logo"
            className="h-12 w-12 object-contain rounded-2xl"
          />
          <span className="text-xl font-bold ml-[5px]">Your Bank</span>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col w-full px-6 space-y-4 text-sm font-semibold">
          {navItems.map((link) => (
            <NavLink
              key={link.name}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-5 px-4 py-2 rounded-md transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? "bg-gray-300 text-black font-bold"
                    : "text-black hover:bg-gray-200"
                }`
              }
            >
              <img src={link.icon} alt={link.name} className="h-5 w-5" />
              {link.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom section: Logout button */}
      <div className="pb-6">
        <button
          onClick={handleLogout}
          className="w-32 mx-auto block px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-semibold hover:bg-red-200 transition"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
