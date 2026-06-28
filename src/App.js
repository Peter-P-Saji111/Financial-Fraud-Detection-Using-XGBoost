import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Prediction from "./pages/Prediction";
import TransactionHistory from "./pages/TransactionHistory";
import Analytics from "./pages/Analytics";

function App() {
  return (
    <Router>
      <div style={{ display: "flex", height: "100vh", fontFamily: "Arial, sans-serif" }}>

        {/* Sidebar */}
        <aside
          style={{
            width: "260px",
            background: "#0f172a",
            color: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "2px 0 10px rgba(0,0,0,0.2)"
          }}
        >
          <div>
            <div
              style={{
                padding: "25px",
                fontSize: "24px",
                fontWeight: "bold",
                borderBottom: "1px solid #334155"
              }}
            >
                🛡 Signal Aggregator
            </div>

            <nav
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "20px",
                gap: "15px"
              }}
            >
              <NavLink
                to="/"
                style={({ isActive }) => ({
                  textDecoration: "none",
                  color: "white",
                  padding: "12px",
                  borderRadius: "8px",
                  background: isActive ? "#2563eb" : "transparent"
                })}
              >
                📊 Dashboard
              </NavLink>

              <NavLink
                to="/predict"
                style={({ isActive }) => ({
                  textDecoration: "none",
                  color: "white",
                  padding: "12px",
                  borderRadius: "8px",
                  background: isActive ? "#2563eb" : "transparent"
                })}
              >
                🔍 Predict Fraud
              </NavLink>

              <NavLink
                to="/transactions"
                style={({ isActive }) => ({
                  textDecoration: "none",
                  color: "white",
                  padding: "12px",
                  borderRadius: "8px",
                  background: isActive ? "#2563eb" : "transparent"
                })}
              >
                📜 Transactions
              </NavLink>

              <NavLink
                to="/analytics"
                style={({ isActive }) => ({
                  textDecoration: "none",
                  color: "white",
                  padding: "12px",
                  borderRadius: "8px",
                  background: isActive ? "#2563eb" : "transparent"
                })}
              >
                📈 Analytics
              </NavLink>
            </nav>
          </div>

          {/* Footer */}
          <div
            style={{
              padding: "20px",
              borderTop: "1px solid #334155",
              color: "#94a3b8",
              fontSize: "14px"
            }}
          >
            <div>🟢 Model Status</div>
            <div>XGBoost Online</div>
          </div>
        </aside>

        {/* Main Content */}
        <main
          style={{
            flex: 1,
            background: "#f8fafc",
            overflowY: "auto",
            padding: "25px"
          }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/predict" element={<Prediction />} />
            <Route path="/transactions" element={<TransactionHistory />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}

export default App;