// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Updated import
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import './App.css';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleTokenChange = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  return (
    <Router>
      <Routes> {/* Updated to Routes */}
        <Route path="/" element={<Login setToken={handleTokenChange} />} />
        <Route path="/register" element={<Register />} /> {/* Correctly using element */}
        <Route
          path="/dashboard"
          element={token ? <Dashboard token={token} /> : <Login setToken={handleTokenChange} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
