from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
from dotenv import load_dotenv
import os
from pydantic import BaseModel
from fastapi import Path

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME")
    )

class Ticket(BaseModel):
    title: str
    description: str

@app.get("/db-check")
def db_check():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        cursor.close()
        conn.close()
        return {"tables": tables}
    except Exception as e:
        return {"error": str(e)}

@app.post("/tickets")
def create_ticket(ticket: Ticket):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        sql = "INSERT INTO tickets (title, description) VALUES (%s, %s)"
        values = (ticket.title, ticket.description)
        cursor.execute(sql, values)
        conn.commit()
        new_ticket_id = cursor.lastrowid
        cursor.close()
        conn.close()
        return {"message": "Ticket created successfully", "ticket_id": new_ticket_id}
    except Exception as e:
        return {"error": str(e)}

@app.get("/tickets")
def get_all_tickets():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT ticket_id, title, description FROM tickets")
        tickets = cursor.fetchall()
        cursor.close()
        conn.close()
        return {"tickets": tickets}
    except Exception as e:
        return {"error": str(e)}

@app.put("/tickets/{ticket_id}")
def update_ticket(ticket_id: int = Path(..., description="The ID of the ticket to update"), ticket: Ticket = None):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        sql = "UPDATE tickets SET title = %s, description = %s WHERE ticket_id = %s"
        values = (ticket.title, ticket.description, ticket_id)
        cursor.execute(sql, values)
        conn.commit()
        cursor.close()
        conn.close()
        if cursor.rowcount == 0:
            return {"message": f"No ticket found with id {ticket_id}"}
        return {"message": "Ticket updated successfully"}
    except Exception as e:
        return {"error": str(e)}

@app.delete("/tickets/{ticket_id}")
def delete_ticket(ticket_id: int = Path(..., description="The ID of the ticket to delete")):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        sql = "DELETE FROM tickets WHERE ticket_id = %s"
        cursor.execute(sql, (ticket_id,))
        conn.commit()
        cursor.close()
        conn.close()
        if cursor.rowcount == 0:
            return {"message": f"No ticket found with id {ticket_id}"}
        return {"message": "Ticket deleted successfully"}
    except Exception as e:
        return {"error": str(e)}
