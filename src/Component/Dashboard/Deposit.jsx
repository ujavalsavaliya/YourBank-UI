import React, { useState, useEffect } from "react";
import DepositModal from "./DepositModal";
import DepositIcon from "./assets/deposit.png";
import historyIcon from "./assets/history.png";

// Custom hook to detect small screen sizes
const useBreakpoint = (breakpoint = 640) => {
  const [isSmallScreen, setIsSmallScreen] = useState(
    window.innerWidth < breakpoint
  );

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < breakpoint);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isSmallScreen;
};

export default function Deposit() {
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [animateClose, setAnimateClose] = useState(false);
  const [depositType, setDepositType] = useState("UPI");
  const [depositAmount, setDepositAmount] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [deposits, setDeposits] = useState([]);

  // Check if screen is small
  const isSmallScreen = useBreakpoint();

  // Extract username from JWT stored in localStorage
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

  const handleOpenDeposit = () => {
    setDepositType("UPI");
    setAnimateClose(false);
    setShowDepositModal(true);
  };

  const handleCloseDeposit = () => {
    setAnimateClose(true);
    setTimeout(() => {
      setShowDepositModal(false);
      setDepositType("");
      setDepositAmount("");
    }, 300);
  };

  const handleSubmitDeposit = (e) => {
    e.preventDefault();
    console.log("Deposit:", depositType, "₹" + depositAmount);
    handleCloseDeposit();
  };

  useEffect(() => {
    if (!username) return;

    fetch(`http://localhost:8080/all-deposit/${username}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch deposit data");
        }
        return res.json();
      })
      .then((data) => {
        setDeposits(data);
      })
      .catch((error) => {
        console.error("Error fetching deposits:", error);
      });
  }, [username]);

  return (
    <div className="md:ml-60 p-4 sm:p-6 bg-gray-100 min-h-screen relative">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4 sm:mb-0">
            Deposit
          </h1>
          <button
            onClick={handleOpenDeposit}
            className="flex items-center gap-2 bg-gray-200 text-black text-sm font-semibold w-full sm:w-36 px-5 py-2 rounded-md hover:bg-gray-400 transition"
          >
            <img src={DepositIcon} alt="Deposit" className="h-5 w-5" />
            Deposit
          </button>
        </div>

        <div className="w-full sm:w-52 h-32 bg-gray-50 text-gray-700 rounded-xl border border-gray-200 shadow-sm p-4 mb-10">
          <div className="flex justify-between items-start mb-10">
            <h2 className="text-md font-semibold text-gray-600">Deposit</h2>
            <img src={DepositIcon} alt="Deposit" className="h-6 w-6" />
          </div>
          <p className="text-lg font-bold mt-4">
            ₹
            {deposits
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
                <tr className="bg-gray-100 text-gray-700 text-xs sm:text-sm font-semibold">
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left">No</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left">Date</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left">Time</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left">
                    Amount
                  </th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left">Type</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left">
                    Method
                  </th>
                  {!isSmallScreen && (
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left">
                      Action
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {deposits.length > 0 ? (
                  deposits
                    .slice(0, showMore ? deposits.length : 3)
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
                          className="text-xs sm:text-sm text-gray-700 border-t"
                        >
                          <td className="px-2 sm:px-4 py-2 sm:py-3">
                            #{index + 1}
                          </td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3">
                            {dateStr}
                          </td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3">
                            {timeStr}
                          </td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3">
                            ₹{tx.amount.toFixed(2)}
                          </td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3">Deposit</td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3">
                            {tx.depositType}
                          </td>
                          {!isSmallScreen && (
                            <td className="px-2 sm:px-4 py-2 sm:py-3">
                              <button className="text-indigo-600 font-semibold hover:underline">
                                View
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })
                ) : (
                  <tr className="text-xs sm:text-sm text-gray-700 border-t">
                    <td
                      colSpan={isSmallScreen ? 6 : 7}
                      className="text-center px-2 sm:px-4 py-2 sm:py-3 text-gray-500"
                    >
                      No deposit transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {!showMore && deposits.length > 3 && (
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

      {showDepositModal && (
        <DepositModal
          depositType={depositType}
          setDepositType={setDepositType}
          amount={depositAmount}
          setAmount={setDepositAmount}
          handleSubmit={handleSubmitDeposit}
          handleClose={handleCloseDeposit}
          animateClose={animateClose}
        />
      )}
    </div>
  );
}
