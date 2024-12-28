import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook for redirection

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate(); // Navigate hook to redirect

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form inputs
    if (!email || !password) {
      setError("Please provide both email and password.");
      return;
    }

    setLoading(true); // Set loading state to true
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
      setToken(response.data.token); // Save token in App state
      setError("");
      setLoading(false); // Set loading state to false after successful login
      navigate("/dashboard"); // Redirect to the dashboard after login
    } catch (error) {
      setLoading(false); // Set loading state to false on error
      if (error.response && error.response.status === 401) {
        setError("Invalid credentials! Please try again.");
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}> {/* Disable button while loading */}
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      {error && <p>{error}</p>}
      <p>
        Don't have an account? <a href="/register">Register here</a>
      </p>
    </div>
  );
};

export default Login;
