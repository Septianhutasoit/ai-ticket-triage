# AI-Powered Support Ticket Triage System

Sistem otomatisasi triage tiket menggunakan AI (Llama 3 via Groq) untuk mengklasifikasikan tingkat urgensi tiket support secara real-time.

## 🚀 Fitur Utama
- **Automated Triage**: Menganalisis tiket menggunakan LLM Agent.
- **Real-time Dashboard**: Polling otomatis untuk memantau status analisis.
- **Dynamic Badging**: Klasifikasi warna berdasarkan tingkat urgensi (Critical, High, Medium, Low).
- **Audit Logs**: Melacak perubahan status tiket melalui System Logs.

## 🛠️ Tech Stack
- **Frontend**: Next.js (App Router), Tailwind CSS.
- **Backend**: FastAPI (Python), SQLAlchemy ORM.
- **Database**: MySQL 8.0.
- **Automation**: n8n (Workflow Engine).
- **AI Model**: LLaMA 3.3 70B via Groq API.

## 📦 Cara Install & Menjalankan
1. **Infrastructure**: Jalankan `docker compose up -d`.
2. **Backend**:
   - `cd backend`
   - `python -m venv venv && .\venv\Scripts\activate`
   - `pip install -r requirements.txt`
   - `uvicorn app.main:app --reload`
3. **Frontend**:
   - `cd frontend`
   - `npm install`
   - `npm run dev`
4. **n8n**: Import file `n8n/workflow.json` ke dalam n8n dashboard (http://localhost:5678).

## 📄 Struktur Folder
- `backend/app/models`: Skema Database SQLAlchemy.
- `backend/app/schemas`: Validasi Pydantic.
- `backend/app/routes`: Endpoint API FastAPI.
- `n8n/`: File ekspor workflow otomasi.
