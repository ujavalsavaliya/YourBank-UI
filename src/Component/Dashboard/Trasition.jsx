// Transaction.jsx
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import historyIcon from "./assets/history.png";
import { FaChevronDown } from "react-icons/fa";

// Custom hook to detect screen size
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

export default function Transaction() {
  const [showMore, setShowMore] = useState(false);
  const [typeFilter, setTypeFilter] = useState("All Type");
  const [dateFilter, setDateFilter] = useState("This Month");
  const [methodFilter, setMethodFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [openDropdown, setOpenDropdown] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  const isSmallScreen = useBreakpoint();

  const types = ["All Type", "Deposit", "Withdraw", "Transfer"];
  const dates = ["Today", "Last 7 Days", "This Month", "Last 3 Month"];
  const methods = ["All", "UPI", "Netbanking", "Debit Card", "Credit Card"];

  const getUsernameFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.sub || decoded.username || null;
    } catch (err) {
      console.error("Invalid token", err);
      return null;
    }
  };

  useEffect(() => {
    const username = getUsernameFromToken();
    if (!username) return;

    fetch(`http://localhost:8080/all-trasition/${username}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch transactions");
        return res.json();
      })
      .then((data) => {
        setTransactions(data);
        setFilteredTransactions(data);
      })
      .catch((err) => console.error("Error fetching transactions:", err));
  }, []);

  useEffect(() => {
    let filtered = [...transactions];

    if (typeFilter !== "All Type") {
      filtered = filtered.filter(
        (tx) => tx.type.toLowerCase() === typeFilter.toLowerCase()
      );
    }

    const today = new Date();
    filtered = filtered.filter((tx) => {
      const txDate = new Date(tx.date);
      if (dateFilter === "Today") {
        return txDate.toDateString() === today.toDateString();
      }
      if (dateFilter === "Last 7 Days") {
        return today - txDate <= 7 * 24 * 60 * 60 * 1000;
      }
      if (dateFilter === "This Month") {
        return (
          txDate.getMonth() === today.getMonth() &&
          txDate.getFullYear() === today.getFullYear()
        );
      }
      if (dateFilter === "Last 3 Month") {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(today.getMonth() - 3);
        return txDate >= threeMonthsAgo;
      }
      return true;
    });

    if (methodFilter !== "All") {
      filtered = filtered.filter(
        (tx) =>
          tx.method && tx.method.toLowerCase() === methodFilter.toLowerCase()
      );
    }

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((tx) =>
        `${tx.amount} ${tx.type} ${tx.method || ""}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  }, [typeFilter, dateFilter, methodFilter, transactions, searchTerm]);

  const handleSelect = (setValue, value) => {
    setValue(value);
    setOpenDropdown("");
  };

  return (
    <div className="md:ml-60 p-4 sm:p-6 bg-gray-100 min-h-screen relative">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        {/* Heading and Search */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4 sm:mb-0">
            Transaction
          </h1>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md bg-indigo-100 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 mb-8 sm:mb-10 relative z-10">
          {/* Type Dropdown */}
          <div className="relative w-full sm:w-40">
            <button
              onClick={() =>
                setOpenDropdown(openDropdown === "type" ? "" : "type")
              }
              className="px-4 py-2 border border-gray-300 rounded-md text-sm bg-white shadow-sm w-full text-left flex justify-between items-center hover:bg-gray-50 transition"
            >
              {typeFilter}{" "}
              <FaChevronDown
                className={`transition-transform duration-300 ${
                  openDropdown === "type" ? "rotate-180" : ""
                }`}
              />
            </button>
            {openDropdown === "type" && (
              <div className="absolute mt-1 w-full rounded-md shadow-lg bg-white border border-gray-200 transition-all duration-200">
                {types.map((type) => (
                  <div
                    key={type}
                    onClick={() => handleSelect(setTypeFilter, type)}
                    className="px-4 py-2 text-sm hover:bg-indigo-100 cursor-pointer transition"
                  >
                    {type}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Date Dropdown */}
          <div className="relative w-full sm:w-44">
            <button
              onClick={() =>
                setOpenDropdown(openDropdown === "date" ? "" : "date")
              }
              className="px-4 py-2 border border-gray-300 rounded-md text-sm bg-white shadow-sm w-full text-left flex justify-between items-center hover:bg-gray-50 transition"
            >
              {dateFilter}{" "}
              <FaChevronDown
                className={`transition-transform duration-300 ${
                  openDropdown === "date" ? "rotate-180" : ""
                }`}
              />
            </button>
            {openDropdown === "date" && (
              <div className="absolute mt-1 w-full rounded-md shadow-lg bg-white border border-gray-200 transition-all duration-200">
                {dates.map((date) => (
                  <div
                    key={date}
                    onClick={() => handleSelect(setDateFilter, date)}
                    className="px-4 py-2 text-sm hover:bg-indigo-100 cursor-pointer transition"
                  >
                    {date}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Method Radio Buttons */}
          <div className="flex gap-4 items-center flex-wrap">
            {methods.map((method) => (
              <label
                key={method}
                className="flex flex-col items-center cursor-pointer relative group"
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={methodFilter === method}
                  onChange={() => setMethodFilter(method)}
                  className="hidden"
                />
                <span
                  className={`relative overflow-hidden px-4 py-2 text-sm font-medium rounded-md border shadow-sm transition-all duration-300 ${
                    methodFilter === method
                      ? "bg-indigo-500 text-white border-indigo-500 shadow-md"
                      : "bg-white border-gray-300 text-gray-700"
                  }`}
                >
                  <span className="relative z-10">{method}</span>
                  <div
                    className={`absolute inset-0 transition-transform duration-300 origin-bottom ${
                      methodFilter === method
                        ? "bg-indigo-600"
                        : "bg-indigo-100 group-hover:scale-100 scale-0"
                    }`}
                  ></div>
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Transaction Table */}
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
                {filteredTransactions.length > 0 ? (
                  filteredTransactions
                    .slice(0, showMore ? filteredTransactions.length : 10)
                    .map((tx, idx) => (
                      <tr
                        key={idx}
                        className="text-xs sm:text-sm text-gray-700 border-t"
                      >
                        <td className="px-2 sm:px-4 py-2 sm:py-3">
                          #{idx + 1}
                        </td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3">
                          {tx.date.split("T")[0]}
                        </td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3">
                          {tx.date.split("T")[1].substring(0, 8)}
                        </td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3">
                          ₹{tx.amount}
                        </td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3">{tx.type}</td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3">
                          {tx.method || "N/A"}
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
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {!showMore && filteredTransactions.length > 10 && (
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
    </div>
  );
}
