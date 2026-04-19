from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TicketCreate(BaseModel):
    title: str
    description: str
    submitted_by: str

class TicketUpdateAI(BaseModel):
    urgency_level: str
    severity_score: int
    reasoning: str

class TicketResponse(BaseModel):
    id: int
    title: str
    description: str
    submitted_by: str
    status: str
    urgency_level: Optional[str] = None
    severity_score: Optional[int] = None
    reasoning: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True