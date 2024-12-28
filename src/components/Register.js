import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook for redirection

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate(); // Navigate hook to redirect

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form inputs
    if (!email || !password) {
      setMessage("Please fill out both email and password.");
      return;
    }

    setLoading(true); // Set loading state to true
    try {
      const response = await axios.post("http://localhost:5000/register", { email, password });
      setMessage(response.data.message);
      setLoading(false); // Set loading state to false after successful registration
      navigate("/"); // Redirect to login page after successful registration
    } catch (error) {
      setLoading(false); // Set loading state to false on error
      if (error.response && error.response.status === 400) {
        setMessage("Email already registered. Please choose a different one.");
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
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      {message && <p>{message}</p>}
      <p>
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
};

export default Register;
