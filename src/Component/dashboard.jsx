import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileModal from "./Dashboard/ProfileModal";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Assets
import Deposit from "../Component/Dashboard/assets/deposit.png";
import User from "./Dashboard/assets/user.png"
import Withdraw from "../Component/Dashboard/assets/cash-withdrawal.png";
import Transaction from "../Component/Dashboard/assets/money.png";
import balanceimg from "../Component/Dashboard/assets/donation.png";
import totalimg from "../Component/Dashboard/assets/invoice.png";
import history from "./Dashboard/assets/history.png";

// Components
import DepositModal from "./Dashboard/DepositModal";
import WithdrawModal from "./Dashboard/WithdrwalModal";

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

export default function Dashboard() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [animateClose, setAnimateClose] = useState(false);
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);

  // Deposit state
  const [depositType, setDepositType] = useState("UPI");
  const [depositAmount, setDepositAmount] = useState("");

  // Withdraw state
  const [withdrawType, setWithdrawType] = useState("UPI");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawPassword, setWithdrawPassword] = useState("");
  const [showWithdrawPassword, setShowWithdrawPassword] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({});

  const navigate = useNavigate();
  const isSmallScreen = useBreakpoint();

  // Open/close deposit modal
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

  // Open/close withdraw modal
  const handleOpenWithdraw = () => {
    setWithdrawType("UPI");
    setWithdrawPassword("");
    setShowWithdrawPassword(false);
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
      setShowWithdrawPassword(false);
    }, 300);
  };

  const handleSubmitWithdraw = (e) => {
    e.preventDefault();
    console.log("Withdraw:", withdrawType, "₹" + withdrawAmount);
    handleCloseWithdraw();
  };

  const handleOpenProfile = () => {
    fetch(`http://localhost:8080/account/holder/${username}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profile data");
        return res.json();
      })
      .then((data) => {
        setProfileData(data);
        setAnimateClose(false);
        setShowProfileModal(true);
      })
      .catch((err) => console.error("Error fetching profile:", err));
  };

  const handleCloseProfile = () => {
    setAnimateClose(true);
    setTimeout(() => setShowProfileModal(false), 300);
  };

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

  // Fetch deposits
  useEffect(() => {
    if (!username) return;

    fetch(`http://localhost:8080/all-deposit/${username}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch deposit data");
        return res.json();
      })
      .then(setDeposits)
      .catch((error) => console.error("Error fetching deposits:", error));
  }, [username]);

  // Fetch withdrawals
  useEffect(() => {
    if (!username) return;

    fetch(`http://localhost:8080/all-withdraw/${username}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch withdrawal data");
        return res.json();
      })
      .then(setWithdrawals)
      .catch((err) => console.error("Error fetching withdrawals:", err));
  }, [username]);

  // Fetch balance (assuming API returns a number)
  useEffect(() => {
    if (!username) return;

    fetch(`http://localhost:8080/account/balance/${username}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch balance data");
        return res.json();
      })
      .then((data) => setBalance(data))
      .catch((err) => console.error("Error fetching balance:", err));
  }, [username]);

  // Fetch transactions
  useEffect(() => {
    if (!username) return;

    fetch(`http://localhost:8080/all-trasition/${username}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch transactions");
        return res.json();
      })
      .then(setTransactions)
      .catch((err) => console.error("Error fetching transactions:", err));
  }, [username]);

  // Dashboard message fetch & error handling
  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch("http://localhost:8080/dashboard", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.text();
          setMessage(data);
        } else {
          throw new Error("Unauthorized or Invalid Token");
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Session expired. Redirecting to login...");
        setTimeout(() => {
          localStorage.removeItem("token");
          navigate("/login");
        }, 2000);
      }
    };

    fetchDashboard();
  }, [navigate]);

  // Calculate totals
  const depositTotal =
    deposits.length > 0
      ? deposits
          .reduce((total, item) => total + (item.amount || 0), 0)
          .toFixed(2)
      : "0.00";

  const withdrawTotal =
    withdrawals.length > 0
      ? withdrawals
          .reduce((total, item) => total + (item.amount || 0), 0)
          .toFixed(2)
      : "0.00";

  const total =
    transactions.length > 0
      ? transactions
          .reduce((total, item) => total + (item.amount || 0), 0)
          .toFixed(2)
      : "0.00";

  // Prepare data for the bar chart:
  const depositMap = deposits.reduce((acc, item) => {
    const dateKey = item.date ? item.date.split("T")[0] : "Unknown";
    acc[dateKey] = (acc[dateKey] || 0) + (item.amount || 0);
    return acc;
  }, {});

  const withdrawMap = withdrawals.reduce((acc, item) => {
    const dateKey = item.date ? item.date.split("T")[0] : "Unknown";
    acc[dateKey] = (acc[dateKey] || 0) + (item.amount || 0);
    return acc;
  }, {});

  const allDatesSet = new Set([
    ...Object.keys(depositMap),
    ...Object.keys(withdrawMap),
  ]);
  const allDates = Array.from(allDatesSet).sort();

  const mergedData = allDates.map((date) => ({
    date,
    Deposit: depositMap[date] || 0,
    Withdraw: withdrawMap[date] || 0,
    Balance: balance || 0,
  }));

  const maxDataValue = Math.max(
    ...mergedData.flatMap((item) => [item.Deposit, item.Withdraw, item.Balance])
  );

  const roundUpTo = 500;
  const maxY = Math.ceil(maxDataValue / roundUpTo) * roundUpTo || 2000;

  // ===== Prepare data for Pie Chart based on transaction methods =====
  const methodCounts = transactions.reduce((acc, txn) => {
    const method = txn.method || "Unknown";
    acc[method] = (acc[method] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(methodCounts).map(([method, count]) => ({
    name: method,
    value: count,
  }));

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#AA336A",
    "#7755AA",
  ];

  return (
    <div className="md:ml-60 p-4 sm:p-6 bg-gray-100 min-h-screen relative">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        {/* Top Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-2 sm:mb-3">
              Dashboard
              {console.error(message)}
            </h1>
            <p className="text-sm sm:text-md text-gray-600">
              Welcome to{" "}
              <span className="font-medium text-indigo-600">YourBank</span>!
              Over financial services
            </p>
          </div>
          {/* Updated Button Group */}
          <div className="flex flex-col items-center sm:flex-row sm:items-stretch sm:justify-end space-y-3 sm:space-x-3 sm:space-y-0 mt-4 sm:mt-0 w-full sm:w-auto">
            <button
              onClick={handleOpenDeposit}
              className="flex items-center justify-center gap-2 bg-gray-200 text-black text-sm font-semibold w-full sm:w-32 px-4 py-1.5 rounded-md hover:bg-gray-400 transition"
            >
              <img src={Deposit} alt="Deposit" className="h-4 w-4" />
              Deposit
            </button>
            <button
              onClick={handleOpenWithdraw}
              className="flex items-center justify-center gap-2 bg-gray-200 text-black text-sm font-semibold w-full sm:w-32 px-4 py-1.5 rounded-md hover:bg-gray-400 transition"
            >
              <img src={Withdraw} alt="Withdraw" className="h-4 w-4" />
              Withdraw
            </button>
            <button
              onClick={() => navigate("/transaction")}
              className="flex items-center justify-center gap-2 bg-gray-200 text-black text-sm font-semibold w-full sm:w-36 px-4 py-1.5 rounded-md hover:bg-gray-400 transition"
            >
              <img src={Transaction} alt="Transaction" className="h-4 w-4" />
              Transaction
            </button>
            <button
              onClick={handleOpenProfile}
              className="flex items-center justify-center gap-2 bg-gray-200 text-black text-sm font-semibold w-full sm:w-32 px-4 py-1.5 rounded-md hover:bg-gray-400 transition"
            >
              <img src={User} alt="Profile" className="h-4 w-4 mr-0.5" />
              Profile
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-100 text-red-700 border border-red-300 rounded p-3 mb-4">
            {error}
          </div>
        )}

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 justify-center mt-6">
          {[
            { title: "Balance", icon: balanceimg, value: balance },
            { title: "Deposit", icon: Deposit, value: depositTotal },
            { title: "Withdraw", icon: Withdraw, value: withdrawTotal },
            { title: "Total", icon: totalimg, value: total },
          ].map((item) => (
            <div
              key={item.title}
              className="w-full h-32 bg-gray-50 text-gray-700 rounded-xl border border-gray-200 shadow-sm p-4"
            >
              <div className="flex justify-between items-start mb-10">
                <h2 className="text-md font-semibold text-gray-600">
                  {item.title}
                </h2>
                <img src={item.icon} alt={item.title} className="h-6 w-6" />
              </div>
              <p className="text-lg font-bold mt-4">
                ₹
                {typeof item.value === "number"
                  ? item.value.toFixed(2)
                  : item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Bar Chart smaller */}
        <div className="h-[300px] mt-10 outline-none">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={mergedData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              barCategoryGap="20%"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, maxY]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Deposit" fill="#4ade80" />
              <Bar dataKey="Withdraw" fill="#f87171" />
              <Bar dataKey="Balance" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart for transaction methods */}
        <div className="h-[300px] mt-10 max-w-sm sm:max-w-md mx-auto outline-none">
          <h2 className="text-center text-xl font-semibold mb-4">
            Transactions by Method
          </h2>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Transactions */}
        <div className="mt-10">
          <div className="flex items-center gap-4 text-xl font-semibold text-gray-700 mb-7">
            <img src={history} alt="History" className="h-6 w-6" />
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
                {transactions.length > 0 ? (
                  transactions.slice(0, 5).map((txn, index) => (
                    <tr
                      key={txn.id || index}
                      className="text-xs sm:text-sm text-gray-700 border-t"
                    >
                      <td className="px-2 sm:px-4 py-2 sm:py-3">
                        #{txn.id || index + 1}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3">
                        {txn.date
                          ? new Date(txn.date).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3">
                        {txn.date
                          ? new Date(txn.date).toLocaleTimeString()
                          : "-"}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3">
                        ₹{txn.amount ? txn.amount.toFixed(2) : "-"}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3">
                        {txn.type || "-"}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3">
                        {txn.method || "-"}
                      </td>
                      {!isSmallScreen && (
                        <td className="px-2 sm:px-4 py-2 sm:py-3">
                          <button className="text-indigo-600 font-semibold hover:underline">
                            View
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr className="text-xs sm:text-sm text-gray-700 border-t">
                    <td
                      colSpan={isSmallScreen ? 6 : 7}
                      className="text-center px-2 sm:px-4 py-2 sm:py-3 text-gray-500"
                    >
                      No recent transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
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
          handleClose={handleCloseWithdraw}
          animateClose={animateClose}
          handleSubmit={handleSubmitWithdraw}
        />
      )}
      {showProfileModal && (
        <ProfileModal
          profileData={profileData}
          handleClose={handleCloseProfile}
          animateClose={animateClose}
        />
      )}
    </div>
  );
}
