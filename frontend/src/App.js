import React, { useState } from "react";
import AddTicket from "./components/addticket/AddTicket";
import TicketList from "./components/ticketlist/TicketList";

const App = () => {
  const [refresh, setRefresh] = useState(false);

  const refreshTickets = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "2rem auto",
        padding: "1rem",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>
        Helpdesk Ticket System
      </h1>
      <AddTicket onTicketAdded={refreshTickets} />
      <TicketList key={refresh} />
    </div>
  );
};

export default App;
