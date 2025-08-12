// Withdraw.js
import React, { useState, useEffect } from "react";
import WithdrawModal from "./WithdrwalModal";
import WithdrawIcon from "./assets/cash-withdrawal.png";
import historyIcon from "./assets/history.png";

export default function Withdraw() {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [animateClose, setAnimateClose] = useState(false);
  const [withdrawType, setWithdrawType] = useState("UPI");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawPassword, setWithdrawPassword] = useState("");
  const [showWithdrawPassword, setShowWithdrawPassword] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [withdrawals, setWithdrawals] = useState([]);

  const getUsernameFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const payload = JSON.parse(jsonPayload);
      return payload.sub || payload.username || null;
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  };

  const username = getUsernameFromToken();

  useEffect(() => {
    if (!username) return;

    fetch(`http://localhost:8080/all-withdraw/${username}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch withdrawal data");
        }
        return res.json();
      })
      .then((data) => setWithdrawals(data))
      .catch((err) => console.error("Error fetching withdrawals:", err));
  }, [username]);

  const handleOpenWithdraw = () => {
    setWithdrawType("UPI");
    setWithdrawAmount("");
    setWithdrawPassword("");
    setAnimateClose(false);
    setShowWithdrawModal(true);
  };

  const handleCloseWithdraw = () => {
    setAnimateClose(true);
    setTimeout(() => {
      setShowWithdrawModal(false);
      setWithdrawType("");
      setWithdrawAmount("");
      setWithdrawPassword("");
    }, 300);
  };

  const handleSubmitWithdraw = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/account/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: withdrawAmount,
          type: withdrawType,
          password: withdrawPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      console.log("Withdraw successful");
      handleCloseWithdraw();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="ml-60 p-6 bg-gray-100 min-h-screen relative">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Withdraw</h1>
          <button
            onClick={handleOpenWithdraw}
            className="flex items-center gap-2 bg-gray-200 text-black text-sm font-semibold w-36 px-5 py-2 rounded-md hover:bg-gray-400 transition"
          >
            <img src={WithdrawIcon} alt="Withdraw" className="h-5 w-5" />
            Withdraw
          </button>
        </div>

        <div className="w-52 h-32 bg-gray-50 text-gray-700 rounded-xl border border-gray-200 shadow-sm p-4 mb-10">
          <div className="flex justify-between items-start mb-10">
            <h2 className="text-md font-semibold text-gray-600">Withdraw</h2>
            <img src={WithdrawIcon} alt="Withdraw" className="h-6 w-6" />
          </div>
          <p className="text-lg font-bold mt-4">
            ₹{withdrawals.reduce((sum, tx) => sum + tx.amount, 0).toFixed(2)}
          </p>
        </div>

        <div className="mt-10">
          <div className="flex items-center gap-4 text-xl font-semibold text-gray-700 mb-7">
            <img src={historyIcon} alt="History" className="h-6 w-6" />
            <span>Recent Transactions</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-sm font-semibold">
                  <th className="px-4 py-3 text-left">No</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Time</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Method</th>
                  <th className="px-4 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals
                  .slice(0, showMore ? withdrawals.length : 3)
                  .map((tx, index) => {
                    const dateObj = new Date(tx.date);
                    const dateStr = dateObj.toLocaleDateString();
                    const timeStr = dateObj.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <tr
                        key={tx.id}
                        className="text-sm text-gray-700 border-t"
                      >
                        <td className="px-4 py-3">#{index + 1}</td>
                        <td className="px-4 py-3">{dateStr}</td>
                        <td className="px-4 py-3">{timeStr}</td>
                        <td className="px-4 py-3">₹{tx.amount.toFixed(2)}</td>
                        <td className="px-4 py-3">Withdraw</td>
                        <td className="px-4 py-3">
                          {tx.withdrawType || "N/A"}
                        </td>
                        <td className="px-4 py-3">
                          <button className="text-indigo-600 font-semibold hover:underline">
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            {!showMore && withdrawals.length > 3 && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setShowMore(true)}
                  className="text-sm text-blue-600 hover:underline font-semibold"
                >
                  Read More
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showWithdrawModal && (
        <WithdrawModal
          withdrawType={withdrawType}
          setWithdrawType={setWithdrawType}
          withdrawAmount={withdrawAmount}
          setWithdrawAmount={setWithdrawAmount}
          withdrawPassword={withdrawPassword}
          setWithdrawPassword={setWithdrawPassword}
          showWithdrawPassword={showWithdrawPassword}
          setShowWithdrawPassword={setShowWithdrawPassword}
          handleSubmit={handleSubmitWithdraw}
          handleClose={handleCloseWithdraw}
          animateClose={animateClose}
        />
      )}
    </div>
  );
}
