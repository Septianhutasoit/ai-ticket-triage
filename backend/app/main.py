from fastapi import FastAPI
from .database import engine, Base
from .routes import tickets
from fastapi.middleware.cors import CORSMiddleware

# Otomatis membuat tabel di MySQL saat dijalankan
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Ticket Triage API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Menghubungkan rute tiket
app.include_router(tickets.router, prefix="/api/tickets", tags=["Tickets"])

@app.get("/")
def home():
    return {"message": "Backend FastAPI is Running!"}