from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from ..database import Base    # Kita Ambil Base dari database.py

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255))
    description = Column(Text)
    submitted_by = Column(String(255))
    status = Column(String(50), default="pending")
    urgency_level = Column(String(50), nullable=True)
    severity_score = Column(Integer, nullable=True)
    reasoning = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)