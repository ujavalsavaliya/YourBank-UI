import React, { useState, useEffect } from "react";
import TransferModal from "./TransferModal";
import TransferIcon from "./assets/invoice.png";
import historyIcon from "./assets/history.png";

export default function Transfer() {
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [animateClose, setAnimateClose] = useState(false);
  const [transferAmount, setTransferAmount] = useState("");
  const [accno, setAccno] = useState("");
  const [password, setPassword] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [transfers, setTransfers] = useState([]);

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

  const handleOpenTransfer = () => {
    setAnimateClose(false);
    setShowTransferModal(true);
  };

  const handleCloseTransfer = () => {
    setAnimateClose(true);
    setTimeout(() => {
      setShowTransferModal(false);
      setTransferAmount("");
      setAccno("");
      setPassword("");
    }, 300);
  };

  const handleSubmitTransfer = async (e) => {
    e.preventDefault();
    if (!username) {
      alert("User not authenticated.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8080/account/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username,
          amount: parseInt(transferAmount),
          accno,
          password,
        }),
      });

      const data = await response.text();

      if (!response.ok) {
        throw new Error(data);
      }

      alert("Transfer successful!");
      handleCloseTransfer();
    } catch (err) {
      alert("Transfer failed: " + err.message);
    }
  };

  useEffect(() => {
    if (!username) return;

    fetch(`http://localhost:8080/all-transfer/${username}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch transfer data");
        }
        return res.json();
      })
      .then((data) => {
        setTransfers(data);
      })
      .catch((error) => {
        console.error("Error fetching transfers:", error);
      });
  }, [username]);

  return (
    <div className="ml-60 p-6 bg-gray-100 min-h-screen relative">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Transfer</h1>
          <button
            onClick={handleOpenTransfer}
            className="flex items-center gap-2 bg-gray-200 text-black text-sm font-semibold w-36 px-5 py-2 rounded-md hover:bg-gray-400 transition"
          >
            <img src={TransferIcon} alt="Transfer" className="h-5 w-5" />
            Transfer
          </button>
        </div>

        <div className="w-52 h-32 bg-gray-50 text-gray-700 rounded-xl border border-gray-200 shadow-sm p-4 mb-10">
          <div className="flex justify-between items-start mb-10">
            <h2 className="text-md font-semibold text-gray-600">Transfer</h2>
            <img src={TransferIcon} alt="Transfer" className="h-6 w-6" />
          </div>
          <p className="text-lg font-bold mt-4">
            ₹
            {transfers
              .reduce((total, item) => total + item.amount, 0)
              .toFixed(2)}
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
                  <th className="px-4 py-3 text-left">Account No</th>
                  <th className="px-4 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {transfers
                  .slice(0, showMore ? transfers.length : 3)
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
                        <td className="px-4 py-3">Transfer</td>
                        <td className="px-4 py-3">{tx.accno}</td>
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

            {!showMore && transfers.length > 3 && (
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

      {showTransferModal && (
        <TransferModal
          amount={transferAmount}
          setAmount={setTransferAmount}
          accno={accno}
          setAccno={setAccno}
          password={password}
          setPassword={setPassword}
          handleSubmit={handleSubmitTransfer}
          handleClose={handleCloseTransfer}
          animateClose={animateClose}
        />
      )}
    </div>
  );
}
