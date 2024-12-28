// src/components/Register.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook for redirection

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate(); // Navigate hook to redirect

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setMessage("Please fill out both fields.");
      return;
    }

    setLoading(true); // Set loading state to true
    try {
      const response = await axios.post("http://localhost:5000/register", { username, password });
      setMessage(response.data.message);
      setLoading(false); // Set loading state to false after successful registration
      navigate("/"); // Redirect to login page after successful registration
    } catch (error) {
      setLoading(false); // Set loading state to false on error
      if (error.response && error.response.status === 400) {
        setMessage("Username already taken. Please choose a different one.");
      } else {
        setMessage("Error: Unable to register user.");
      }
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}> {/* Disable button while loading */}
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;
