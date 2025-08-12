import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {jwtDecode} from "jwt-decode";

export default function WithdrawModal({
  withdrawType,
  setWithdrawType,
  withdrawAmount,
  setWithdrawAmount,
  withdrawPassword,
  setWithdrawPassword,
  showWithdrawPassword,
  setShowWithdrawPassword,
  handleClose,
  animateClose,
}) {
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      const decoded = jwtDecode(token);
      const username = decoded.sub || decoded.username;

      const response = await fetch("http://localhost:8080/account/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username,
          password: withdrawPassword,
          amount: parseFloat(withdrawAmount),
          withdrawType,
        }),
      });

      console.log({ username, withdrawType, withdrawAmount, withdrawPassword });

      if (!response.ok) {
        let errorMessage = "Withdraw failed";
        try {
          const errData = await response.json();
          errorMessage = errData.message || errorMessage;
        } catch (_) {
          // If server didn't return JSON
        }
        throw new Error(errorMessage);
      }

      alert("Withdraw successful!");
      handleClose();
      window.location.reload();
    } catch (err) {
      setError(err.message);
      console.error("Withdraw error:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 transition-opacity duration-300">
      <div
        className={`bg-white rounded-lg shadow-xl border border-gray-300 p-6 w-96 relative ${
          animateClose ? "animate-scaleOut" : "animate-scaleIn"
        }`}
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Withdraw Money
        </h2>

        {/* Withdraw Type */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Withdraw Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            {["UPI", "Net Banking", "Debit Card", "Credit Card"].map((type) => (
              <label
                key={type}
                className={`flex items-center px-4 py-2 border rounded-lg cursor-pointer transition-all ${
                  withdrawType === type
                    ? "bg-indigo-100 border-green-500 text-green-700"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="withdrawType"
                  value={type}
                  checked={withdrawType === type}
                  onChange={() => setWithdrawType(type)}
                  className="hidden"
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        {/* Amount */}
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Amount (₹)
        </label>
        <input
          type="text"
          placeholder="Enter amount"
          value={withdrawAmount}
          onChange={(e) =>
            /^\d*\.?\d*$/.test(e.target.value) &&
            setWithdrawAmount(e.target.value)
          }
          className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        />

        {/* Password */}
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="relative mb-4">
          <input
            type={showWithdrawPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={withdrawPassword}
            onChange={(e) => setWithdrawPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-10"
            required
          />
          <span
            onClick={() => setShowWithdrawPassword((prev) => !prev)}
            className="absolute top-2.5 right-3 cursor-pointer text-gray-500"
          >
            {showWithdrawPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        {/* Error */}
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-semibold"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
