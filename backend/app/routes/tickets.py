from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import requests
import os

from ..database import get_db
from ..models.ticket import Ticket
from ..schemas.ticket import TicketCreate, TicketResponse, TicketUpdateAI

router = APIRouter()

@router.post("/", response_model=TicketResponse, status_code=status.HTTP_201_CREATED)
def create_ticket(ticket_data: TicketCreate, db: Session = Depends(get_db)) -> Ticket:
    try:
        new_ticket = Ticket(**ticket_data.model_dump())
        db.add(new_ticket)
        db.commit()
        db.refresh(new_ticket)

        # Trigger n8n Webhook
        requests.post(os.getenv("N8N_WEBHOOK_URL"), json={
            "ticket_id": new_ticket.id,
            "title": new_ticket.title,
            "description": new_ticket.description
        }, timeout=5)

        return new_ticket
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@router.get("/", response_model=List[TicketResponse])
def get_all_tickets(db: Session = Depends(get_db)) -> List[Ticket]:
    return db.query(Ticket).order_by(Ticket.created_at.desc()).all()

@router.get("/{ticket_id}", response_model=TicketResponse)
def get_ticket(ticket_id: int, db: Session = Depends(get_db)) -> Ticket:
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket

@router.patch("/{ticket_id}/analysis", response_model=TicketResponse)
def update_ticket_analysis(ticket_id: int, analysis: TicketUpdateAI, db: Session = Depends(get_db)) -> Ticket:
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    ticket.urgency_level = analysis.urgency_level
    ticket.severity_score = analysis.severity_score
    ticket.reasoning = analysis.reasoning
    ticket.status = "analyzed"
    
    db.commit()
    db.refresh(ticket)
    return ticket