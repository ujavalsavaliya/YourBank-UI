import React from "react";
import { Link, useLocation } from "react-router-dom";

function Footer() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path) =>
    currentPath === path ? "text-white font-bold underline" : "hover:text-white";

  return (
    <footer className="bg-gray-900 text-white py-10 mt-10  rounded-tr-4xl rounded-bl-4xl shadow-2xl">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">

        {/* Column 1 with top-left and bottom-right rounded corners */}
        <div className="bg-gray-800 p-4 mt-4 rounded-tl-xl rounded-br-xl">
          <h3 className="text-lg font-semibold mb-3 text-amber-100">Your Bank</h3>
          <p className="text-gray-400">
            Empowering your finances with secure, innovative, and customer-first banking solutions.
          </p>
          <p className="mt-2 text-gray-400">
            Trusted by 10,000+ customers across the globe.
          </p>
        </div>

        {/* Column 2 */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-amber-100 mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/" className={isActive("/")}>Home</Link></li>
            <li><Link to="/security" className={isActive("/security")}>Security</Link></li>
            <li><Link to="/investment" className={isActive("/investment")}>Investment</Link></li>
            <li><Link to="/review" className={isActive("/review")}>Review</Link></li>
            <li><Link to="/signup" className={isActive("/signup")}>Sign up</Link></li>
            <li><Link to="/login" className={isActive("/login")}>Login</Link></li>
          </ul>
        </div>

        {/* Column 3 with top-right and bottom-left rounded corners */}
        <div className="bg-gray-800 p-4 mt-4 rounded-tr-xl rounded-bl-xl">
          <h3 className="text-lg font-semibold mb-3 text-amber-100">Contact Us</h3>
          <p className="text-gray-400">support@yourbank.com</p>
          <p className="text-gray-400">+1 (800) 123-4567</p>
          <p className="text-gray-400 mt-2">123 Finance Avenue, New York, USA</p>
        </div>

        {/* Column 4 */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-3 text-amber-100">Banking Hours</h3>
          <p className="text-gray-400">Mon - Fri: 9 AM - 6 PM</p>
          <p className="text-gray-400">Saturday: 10 AM - 2 PM</p>
          <p className="text-gray-400">Sunday: Closed</p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 my-6 mx-6"></div>

      {/* Owners */}
      <div className="text-center text-gray-400 text-sm">
        © 2025 Your Bank. All rights reserved. <br />
        Made by <span className="text-amber-100">Ujaval Savaliya</span>,{" "}
        <span className="text-amber-100">Khushal Rathod</span>, and{" "}
        <span className="text-amber-100">Tirth Golakiya</span>
      </div>
    </footer>
  );
}

export default Footer;
