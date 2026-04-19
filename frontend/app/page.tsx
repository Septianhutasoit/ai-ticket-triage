"use client";
import { useEffect, useState } from "react";

// Tipe Data untuk Type Safety
interface Ticket {
  id: number;
  title: string;
  description: string;
  submitted_by: string;
  status: string;
  urgency_level: string | null;
  severity_score: number | null;
  reasoning: string | null;
}

export default function Dashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const fetchTickets = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/tickets/");
      const data = await res.json();
      setTickets(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 5000); // POLLING (Requirement Hal 4)
    return () => clearInterval(interval);
  }, []);

  const getUrgencyColor = (level: string | null) => {
    switch (level) {
      case "Critical": return "bg-red-600 text-white";
      case "High": return "bg-orange-500 text-white";
      case "Medium": return "bg-blue-500 text-white";
      case "Low": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 border-b border-slate-800 pb-4 flex items-center gap-3">
          <span className="bg-blue-600 p-2 rounded-lg">🎫</span> AI Ticket Triage Dashboard
        </h1>

        <div className="grid gap-6">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl hover:border-slate-700 transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-100">{ticket.title}</h2>
                  <p className="text-slate-500 text-sm italic">By {ticket.submitted_by} • ID: #{ticket.id}</p>
                </div>
                <div className="flex gap-2">
                  {/* Status Badge */}
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    ticket.status === 'analyzed' ? 'border-emerald-500 text-emerald-500' : 'border-amber-500 text-amber-500 animate-pulse'
                  }`}>
                    {ticket.status}
                  </span>
                  
                  {/* Urgency Badge (Requirement Hal 4) */}
                  {ticket.urgency_level && (
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getUrgencyColor(ticket.urgency_level)}`}>
                      {ticket.urgency_level} ({ticket.severity_score})
                    </span>
                  )}
                </div>
              </div>
              <p className="text-slate-400 text-sm line-clamp-2 mb-4">"{ticket.description}"</p>
              
              {/* Reasoning Section */}
              {ticket.reasoning && (
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
                  <p className="text-[10px] font-bold text-slate-600 uppercase mb-2">AI Analysis Reasoning</p>
                  <p className="text-sm text-slate-300 leading-relaxed">{ticket.reasoning}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}