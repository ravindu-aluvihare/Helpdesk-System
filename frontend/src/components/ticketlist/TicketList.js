import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TicketList.css";

const TicketList = ({ onRefresh }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingTicket, setEditingTicket] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/tickets");
      setTickets(response.data.tickets || []);
      setError("");
    } catch (err) {
      setError("Failed to load tickets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/tickets/${id}`);
      fetchTickets();
      if (onRefresh) onRefresh();
    } catch {
      alert("Failed to delete ticket.");
    }
  };

  const startEdit = (ticket) => {
    setEditingTicket(ticket.ticket_id);
    setEditTitle(ticket.title);
    setEditDescription(ticket.description);
  };

  const cancelEdit = () => {
    setEditingTicket(null);
    setEditTitle("");
    setEditDescription("");
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`http://127.0.0.1:8000/tickets/${id}`, {
        title: editTitle,
        description: editDescription,
      });
      setEditingTicket(null);
      fetchTickets();
      if (onRefresh) onRefresh();
    } catch {
      alert("Failed to update ticket.");
    }
  };

  if (loading) return <p>Loading tickets...</p>;
  if (error) return <p className="error-msg">{error}</p>;
  if (tickets.length === 0) return <p>No tickets available.</p>;

  return (
    <div className="ticket-list-container">
      <h2>Helpdesk Tickets</h2>
      <table className="ticket-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(({ ticket_id, title, description }) => (
            <tr
              key={ticket_id}
              className={ticket_id % 2 === 0 ? "even-row" : "odd-row"}
            >
              <td>{ticket_id}</td>
              <td>
                {editingTicket === ticket_id ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="edit-input"
                  />
                ) : (
                  title
                )}
              </td>
              <td>
                {editingTicket === ticket_id ? (
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={3}
                    className="edit-textarea"
                  />
                ) : (
                  description
                )}
              </td>
              <td>
                {editingTicket === ticket_id ? (
                  <>
                    <button
                      onClick={() => saveEdit(ticket_id)}
                      className="btn save-btn"
                    >
                      Save
                    </button>
                    <button onClick={cancelEdit} className="btn cancel-btn">
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit({ ticket_id, title, description })}
                      className="btn edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ticket_id)}
                      className="btn delete-btn"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TicketList;
