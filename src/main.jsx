import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx"; // ✅ Ensure file name matches exactly
import "./index.css";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Review from "./pages/Review.jsx";
import Security from "./pages/Security.jsx";
import Investment from "./pages/Investment.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import Signup from "./components/Signup.jsx";
import Deposit from "./components/Dashboard/Deposit.jsx";
import Withdraw from "./components/Dashboard/Withdraw.jsx";
import Transfer from "./components/Dashboard/Transfer.jsx";
import Transition from "./components/Dashboard/Transition.jsx"; // ✅ spelling fixed
import Chatbot from "./components/Dashboard/Chatbot.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
        <Route path="" element={<Home />} />
        <Route path="/security" element={<Security />} />
        <Route path="/investment" element={<Investment />} />
        <Route path="/review" element={<Review />} />
      </Route>
      <Route element={<AuthPage />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>
      <Route element={<DashboardPage />}>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/deposit"
          element={
            <ProtectedRoute>
              <Deposit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/withdraw"
          element={
            <ProtectedRoute>
              <Withdraw />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transfer"
          element={
            <ProtectedRoute>
              <Transfer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transaction"
          element={
            <ProtectedRoute>
              <Transition /> {/* ✅ fixed typo */}
            </ProtectedRoute>
          }
        />
        <Route
          path="/chatbot"
          element={
            <ProtectedRoute>
              <Chatbot />
            </ProtectedRoute>
          }
        />
      </Route>
    </>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
