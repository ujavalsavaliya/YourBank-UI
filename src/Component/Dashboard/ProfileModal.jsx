import React from "react";
import { useNavigate } from "react-router-dom";
import copy from "./assets/copy.png";
import { useState } from "react";

export default function ProfileModal({
  profileData,
  handleClose,
  animateClose,
}) {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text || "");
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1500); // hide after 1.5s
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 transition-opacity duration-300">
      {showPopup && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-400 text-black px-4 py-2 rounded-lg shadow-md animate-slideDown">
          Copied to clipboard!
        </div>
      )}
      <div
        className={`bg-white rounded-lg shadow-xl border border-gray-300 p-6 w-96 relative ${
          animateClose ? "animate-scaleOut" : "animate-scaleIn"
        }`}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Profile
        </h2>

        <div className="space-y-3 text-gray-700">
          {/* Username */}
          <div className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 shadow-sm flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Username</p>
              <p className="text-gray-800 font-medium">
                {profileData?.username}
              </p>
            </div>
            <button
              onClick={() => handleCopy(profileData?.username)}
              className="p-1 hover:bg-gray-200 rounded-full transition"
              title="Copy Username"
            >
              <img src={copy} alt="Copy" className="h-4 w-4 mr-0.5" />
            </button>
          </div>

          {/* Email */}
          <div className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 shadow-sm flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-gray-800 font-medium">{profileData?.email}</p>
            </div>
            <button
              onClick={() => handleCopy(profileData?.email)}
              className="p-1 hover:bg-gray-200 rounded-full transition"
              title="Copy Email"
            >
              <img src={copy} alt="Copy" className="h-4 w-4 mr-0.5" />
            </button>
          </div>

          {/* Account No */}
          <div className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 shadow-sm flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Account No</p>
              <p className="text-gray-800 font-medium">{profileData?.accno}</p>
            </div>
            <button
              onClick={() => handleCopy(profileData?.accno)}
              className="p-1 hover:bg-gray-200 rounded-full transition"
              title="Copy Account No"
            >
              <img src={copy} alt="Copy" className="h-4 w-4 mr-0.5" />
            </button>
          </div>
        </div>

        <div className="pb-6 mt-5">
          <button
            onClick={handleLogout}
            className="w-full mx-auto block py-2 bg-red-100 text-red-600 rounded-xl shadow-md font-semibold hover:bg-red-200 transition"
          >
            Logout
          </button>
          <button
            onClick={handleClose}
            className="mt-5 w-full py-2 rounded-xl bg-gray-200 text-black 
          hover:bg-gray-400 transition-colors duration-300 shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
