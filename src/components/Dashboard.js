import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = ({ token }) => {
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState({});
  const [expenseData, setExpenseData] = useState({
    payer: "",
    amount: "",
    participants: [],
    category: "",
  });
  const [categories, setCategories] = useState([]);
  const [report, setReport] = useState(null);

  // Fetching expenses, balances, categories, and initializing the dashboard
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

    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(response.data.categories);
      } catch (error) {
        console.log("Error fetching categories", error);
      }
    };

    fetchExpenses();
    fetchBalances();
    fetchCategories();
  }, [token]);

  // Handle adding a new expense
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

  // Handle deleting an expense
  const handleDeleteExpense = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/delete_expense/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(expenses.filter((expense) => expense.id !== id));
    } catch (error) {
      console.log("Error deleting expense", error);
    }
  };

  // Handle generating a report
  const handleGenerateReport = async () => {
    try {
      const response = await axios.get("http://localhost:5000/generate_report", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReport(response.data);
    } catch (error) {
      console.log("Error generating report", error);
    }
  };

  // Handle resetting the balances
  const handleResetBalances = async () => {
    try {
      await axios.post(
        "http://localhost:5000/reset_balance",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBalances({});
    } catch (error) {
      console.log("Error resetting balances", error);
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>

      {/* Expenses section */}
      <div>
        <h3>Expenses</h3>
        {expenses.map((expense) => (
          <div key={expense.id}>
            <p>Payer: {expense.payer}</p>
            <p>Amount: {expense.amount}</p>
            <p>Category: {expense.category}</p>
            <p>Participants: {expense.participants.join(", ")}</p>
            <button onClick={() => handleDeleteExpense(expense.id)}>Delete</button>
          </div>
        ))}
      </div>

      {/* Add expense form */}
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
        <select
          value={expenseData.category}
          onChange={(e) => setExpenseData({ ...expenseData, category: e.target.value })}
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <button onClick={handleAddExpense}>Add Expense</button>
      </div>

      {/* Balances section */}
      <div>
        <h3>Balances</h3>
        {Object.entries(balances).map(([user, balance]) => (
          <p key={user}>
            {user}: {balance}
          </p>
        ))}
        <button onClick={handleResetBalances}>Reset Balances</button>
      </div>

      {/* Report section */}
      <div>
        <h3>Report</h3>
        <button onClick={handleGenerateReport}>Generate Report</button>
        {report && <pre>{JSON.stringify(report, null, 2)}</pre>}
      </div>
    </div>
  );
};

export default Dashboard;
