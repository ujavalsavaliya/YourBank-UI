import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import ProtectedRoute from "./Component/ProtectedRoute.jsx";
import "./index.css";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Home from "./Pages/home.jsx";
import Review from "./Pages/review.jsx";
import Security from "./Pages/security.jsx";
import Investment from "./Pages/investment.jsx";
import AuthPage from "./Pages/AuthPage.jsx";
import Login from "./Component/Login.jsx";
import Dashboard from "./Component/Dashboard.jsx";
import DashboardPage from "./Pages/DashboardPage.jsx";
import Signup from "./Component/Signup.jsx";
import Deposit from "./Component/Dashboard/Deposit.jsx";
import Withdraw from "./Component/Dashboard/Withdraw.jsx";
import Transfer from "./Component/Dashboard/Transfer.jsx";
import Trasition from "./Component/Dashboard/Trasition.jsx";
import Chatbot from "./Component/Dashboard/chatbot.jsx";

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
              <Trasition />
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
