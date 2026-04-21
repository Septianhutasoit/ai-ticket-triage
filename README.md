<div align="center">

<img src="https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
<img src="https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
<img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
<img src="https://img.shields.io/badge/n8n-1.123-EA4B71?style=for-the-badge&logo=n8n&logoColor=white" alt="n8n" />
<img src="https://img.shields.io/badge/Cohere-Command_R-39594E?style=for-the-badge&logo=cohere&logoColor=white" alt="Cohere" />
<img src="https://img.shields.io/badge/Docker-27.0-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
<img src="https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" />
<img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />

<br />
<br />

<h1>🎫 AI-Powered Support Ticket Triage System</h1>

<p>
  <strong>Automated · Intelligent · Real-time</strong>
  <br />
  Sistem triase tiket support otomatis berbasis AI yang mengklasifikasikan urgensi secara real-time.
  <br />
  <sub>Built for Junior Developer Technical Assessment</sub>
</p>

<p>
  <a href="#-demo-preview"><strong>Demo</strong></a> ·
  <a href="#-fitur-unggulan"><strong>Fitur</strong></a> ·
  <a href="#-tech-stack"><strong>Tech Stack</strong></a> ·
  <a href="#-system-flow"><strong>Flow</strong></a> ·
  <a href="#-quick-start"><strong>Quick Start</strong></a> ·
  <a href="#-dokumentasi-visual"><strong>Screenshots</strong></a>
</p>

<br />

---

## ✨ **Fitur Unggulan**

<table>
  <tr>
    <td width="50%">
      <h3>🤖 AI-Powered Triage</h3>
      <p>Klasifikasi otomatis tingkat urgensi menggunakan <strong>Cohere Command-R</strong> dengan akurasi tinggi. Output mencakup urgency level, severity score, dan reasoning logis.</p>
    </td>
    <td width="50%">
      <h3>📊 Real-time Dashboard</h3>
      <p>Monitoring status tiket secara <strong>live polling</strong> setiap 5 detik. Badge warna dinamis untuk setiap level urgensi dengan animasi transisi halus.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🎨 Modern UI/UX</h3>
      <p>Dark mode, skeleton loading, expandable text ("Read More"), dan responsive design menggunakan <strong>Tailwind CSS</strong> dengan animasi micro-interactions.</p>
    </td>
    <td width="50%">
      <h3>🔧 System Logging</h3>
      <p>Pencatatan otomatis setiap aktivitas sistem untuk keperluan audit, debugging, dan monitoring performa.</p>
    </td>
  </tr>
</table>

<br />

---

## 🛠️ **Tech Stack**

<div align="center">

| **Layer** | **Technology** | **Version** | **Description** |
| :---: | :--- | :---: | :--- |
| 🎨 **Frontend** | Next.js (App Router) | 15.0 | React framework dengan SSR & SSG |
| | Tailwind CSS | 3.4 | Utility-first CSS framework |
| | TypeScript | 5.0 | Static type checking |
| ⚙️ **Backend** | FastAPI | 0.115 | High-performance Python API |
| | SQLAlchemy | 2.0 | Python SQL toolkit & ORM |
| | Pydantic | 2.10 | Data validation & settings |
| 🗄️ **Database** | MySQL | 8.0 | Relational database |
| 🔄 **Workflow** | n8n | 1.123 | Automation & orchestration |
| 🧠 **AI Agent** | Cohere Command-R | 08-2024 | LLM for text classification |
| 🐳 **Container** | Docker & Docker Compose | 27.0 | Containerization |

</div>

<br />

---

## 🔄 **System Flow**

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant F as ⚛️ Next.js<br/>Frontend
    participant B as 🐍 FastAPI<br/>Backend
    participant D as 🗄️ MySQL<br/>Database
    participant N as 🔄 n8n<br/>Workflow
    participant AI as 🧠 Cohere<br/>LLM Agent

    U->>F: 1. Submit Ticket Form
    F->>B: POST /tickets
    B->>D: INSERT (status: pending)
    B-->>N: Webhook Trigger
    N->>AI: Prompt + Ticket Content
    AI-->>N: JSON (urgency, score, reasoning)
    N->>B: PATCH /tickets/{id}/analysis
    B->>D: UPDATE (status: analyzed)
    F-->>U: 7. Dashboard (Live Polling)
    
    Note over F,D: Dashboard auto-refresh setiap 5 detik
