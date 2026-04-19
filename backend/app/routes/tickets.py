from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.ticket import Ticket
from ..schemas.ticket import TicketCreate, TicketResponse, TicketUpdateAI
import requests
import os

router = APIRouter()

@router.post("/", response_model=TicketResponse)
def create_ticket(ticket_data: TicketCreate, db: Session = Depends(get_db)):
    new_ticket = Ticket(**ticket_data.model_dump())
    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)

    try:
        requests.post(os.getenv("N8N_WEBHOOK_URL"), json={
            "ticket_id": new_ticket.id,
            "title": new_ticket.title,
            "description": new_ticket.description
        })
    except Exception as e:
        print(f"Webhook failed: {e}")

    return new_ticket

@router.get("/", response_model=list[TicketResponse])
def get_all_tickets(db: Session = Depends(get_db)):
    return db.query(Ticket).all()

@router.get("/{ticket_id}", response_model=TicketResponse)
def get_ticket(ticket_id: int, db: Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket

@router.patch("/{ticket_id}/analysis", response_model=TicketResponse)
def update_ticket_analysis(ticket_id: int, analysis: TicketUpdateAI, db: Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    ticket.urgency_level = analysis.urgency_level
    ticket.severity_score = analysis.severity_score
    ticket.reasoning = analysis.reasoning
    ticket.status = "completed"
    
    db.commit()
    db.refresh(ticket)
    return ticket