import React, { useState } from "react";
import {jwtDecode} from "jwt-decode";

export default function DepositModal({
  depositType,
  setDepositType,
  amount,
  setAmount,
  handleClose,
  animateClose,
}) {
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not authenticated");
        return;
      }

      const decoded = jwtDecode(token);
      const username = decoded.sub || decoded.username;

      const response = await fetch("http://localhost:8080/account/deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ depositType, amount, username }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to deposit money");
      }

      handleClose();
      window.location.reload(); // Close modal on success
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Deposit failed. Try again.");
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
          Deposit Money
        </h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <form onSubmit={handleSubmit}>
          {/* Deposit Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deposit Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {["UPI", "Net Banking", "Debit Card", "Credit Card"].map(
                (type) => (
                  <label
                    key={type}
                    className={`flex items-center px-4 py-2 border rounded-lg cursor-pointer transition-all ${
                      depositType === type
                        ? "bg-indigo-100 border-green-500 text-green-700"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="depositType"
                      value={type}
                      checked={depositType === type}
                      onChange={() => setDepositType(type)}
                      className="hidden"
                    />
                    {type}
                  </label>
                )
              )}
            </div>
          </div>

          {/* Amount */}
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Amount (₹)
          </label>
          <input
            type="text"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) =>
              /^\d*\.?\d*$/.test(e.target.value) && setAmount(e.target.value)
            }
            className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />

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
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-semibold"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
