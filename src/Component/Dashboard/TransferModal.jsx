import React, { useState } from "react";

export default function TransferModal({
  amount,
  setAmount,
  accno,
  setAccno,
  password,
  setPassword,
  handleSubmit,
  handleClose,
  animateClose,
}) {
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !accno || !password) {
      setError("All fields are required");
      return;
    }

    try {
      await handleSubmit(e);
      window.location.reload(); // Close modal on success
    } catch (err) {
      setError("Transfer failed. Please try again.");
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
          Transfer Money
        </h2>

        {error && (
          <p className="text-red-600 text-sm font-medium mb-3">{error}</p>
        )}

        <form onSubmit={onSubmit}>
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

          {/* Account Number */}
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Account Number
          </label>
          <input
            type="text"
            placeholder="Enter account number"
            value={accno}
            onChange={(e) => setAccno(e.target.value)}
            className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />

          {/* Password */}
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
