// src/components/Dashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = ({ token }) => {
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [expenseData, setExpenseData] = useState({
    payer: "",
    amount: "",
    participants: [],
  });

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/expenses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExpenses(response.data.expenses);
      } catch (error) {
        console.log("Error fetching expenses", error);
      }
    };

    const fetchBalances = async () => {
      try {
        const response = await axios.get("http://localhost:5000/balances", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBalances(response.data.balances);
      } catch (error) {
        console.log("Error fetching balances", error);
      }
    };

    fetchExpenses();
    fetchBalances();
  }, [token]);

  const handleAddExpense = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/add_expense",
        expenseData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setExpenses([...expenses, response.data.data]);
    } catch (error) {
      console.log("Error adding expense", error);
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <div>
        <h3>Expenses</h3>
        {expenses.map((expense) => (
          <div key={expense.id}>
            <p>Payer: {expense.payer}</p>
            <p>Amount: {expense.amount}</p>
            <p>Participants: {expense.participants.join(", ")}</p>
          </div>
        ))}
      </div>
      <div>
        <h3>Add Expense</h3>
        <input
          type="text"
          placeholder="Payer"
          value={expenseData.payer}
          onChange={(e) => setExpenseData({ ...expenseData, payer: e.target.value })}
        />
        <input
          type="number"
          placeholder="Amount"
          value={expenseData.amount}
          onChange={(e) => setExpenseData({ ...expenseData, amount: e.target.value })}
        />
        <input
          type="text"
          placeholder="Participants (comma-separated)"
          value={expenseData.participants.join(", ")}
          onChange={(e) => setExpenseData({ ...expenseData, participants: e.target.value.split(",") })}
        />
        <button onClick={handleAddExpense}>Add Expense</button>
      </div>
      <div>
        <h3>Balances</h3>
        {Object.entries(balances).map(([user, balance]) => (
          <p key={user}>
            {user}: {balance}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
