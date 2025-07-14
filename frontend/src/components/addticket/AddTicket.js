import React, { useState } from "react";
import axios from "axios";
import "./AddTicket.css";

const AddTicket = ({ onTicketAdded }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!title.trim() || !description.trim()) {
      setError("Both title and description are required.");
      return;
    }

    try {
      const newTicket = { title, description };
      await axios.post("http://127.0.0.1:8000/tickets", newTicket);

      setMessage("🎉 Ticket added successfully!");
      setTitle("");
      setDescription("");
      if (onTicketAdded) onTicketAdded();
    } catch (err) {
      setError("Failed to add ticket. Please try again.");
    }
  };

  return (
    <div className="add-ticket-container">
      <h2>Add New Ticket</h2>
      <form onSubmit={handleSubmit} className="add-ticket-form">
        <label className="form-label">
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input"
            required
          />
        </label>

        <label className="form-label">
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="form-textarea"
            required
          />
        </label>

        <button type="submit" className="submit-btn">
          Add Ticket
        </button>

        {message && <p className="success-msg">{message}</p>}
        {error && <p className="error-msg">{error}</p>}
      </form>
    </div>
  );
};

export default AddTicket;
