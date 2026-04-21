"use client";
import { useEffect, useState, useRef } from "react";

interface Ticket {
  id: number;
  title: string;
  description: string;
  submitted_by: string;
  status: string;
  urgency_level: string | null;
  severity_score: number | null;
  reasoning: string | null;
  created_at: string;
}

export default function TicketSystem() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [formData, setFormData] = useState({ title: "", description: "", submitted_by: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedTickets, setExpandedTickets] = useState<number[]>([]);

  const API_BASE_URL = "http://127.0.0.1:8000/api/tickets/";

  const fetchTickets = async () => {
    try {
      const res = await fetch(API_BASE_URL);
      if (!res.ok) throw new Error("Gagal mengambil data");
      const data = await res.json();
      setTickets(data.sort((a: Ticket, b: Ticket) => b.id - a.id));
    } catch (err) {
      console.error("Koneksi Backend Terputus:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({ title: "", description: "", submitted_by: "" });
        await fetchTickets();
      } else {
        alert("Gagal mengirim ke server.");
      }
    } catch (err) {
      alert("Error: Pastikan Backend FastAPI sudah menyala!");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedTickets(prev =>
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
  };

  const getUrgencyStyles = (level: string | null) => {
    const base = "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ";
    switch (level) {
      case "Critical": return base + "bg-red-500/10 text-red-500 border-red-500/30";
      case "High": return base + "bg-orange-500/10 text-orange-500 border-orange-500/30";
      case "Medium": return base + "bg-cyan-500/10 text-cyan-500 border-cyan-500/30";
      case "Low": return base + "bg-emerald-500/10 text-emerald-500 border-emerald-500/30";
      default: return base + "bg-slate-700/10 text-slate-400 border-slate-700/30";
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 p-4 md:p-10 font-sans selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8">

        {/* SIDEBAR FORM */}
        <div className="xl:col-span-4">
          <div className="sticky top-10 bg-[#0f0f12] border border-white/5 p-8 rounded-[2rem] shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">New Support Ticket</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="group">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-[0.2em] group-focus-within:text-blue-500 transition-colors">Subject</label>
                <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#16161a] border border-white/5 rounded-2xl px-5 py-4 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none text-white placeholder:text-slate-700"
                  placeholder="What's the issue?" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-[0.2em]">Reporter</label>
                <input required value={formData.submitted_by} onChange={e => setFormData({ ...formData, submitted_by: e.target.value })}
                  className="w-full bg-[#16161a] border border-white/5 rounded-2xl px-5 py-4 focus:border-blue-500/50 transition-all outline-none text-white placeholder:text-slate-700"
                  placeholder="Your Name" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-[0.2em]">Full Description</label>
                <textarea required rows={5} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#16161a] border border-white/5 rounded-2xl px-5 py-4 focus:border-blue-500/50 transition-all outline-none resize-none text-white placeholder:text-slate-700"
                  placeholder="Describe the problem in detail..." />
              </div>
              <button disabled={isSubmitting} className="w-full bg-white text-black font-black py-5 rounded-2xl hover:bg-blue-500 hover:text-white transition-all active:scale-[0.98] disabled:opacity-50 uppercase text-xs tracking-[0.2em]">
                {isSubmitting ? "Syncing to Cloud..." : "Launch Ticket"}
              </button>
            </form>
          </div>
        </div>

        {/* MAIN DASHBOARD */}
        <div className="xl:col-span-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
            <div>
              <h1 className="text-5xl font-black tracking-tighter text-white mb-2">Triage <span className="text-blue-600">Center</span></h1>
              <p className="text-slate-500 font-medium border-l-2 border-blue-600 pl-4">Live AI-Driven Classification Protocol</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-full flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active Polling</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {tickets.length === 0 && (
              <div className="text-center py-32 bg-[#0f0f12] rounded-[3rem] border border-dashed border-white/5 shadow-inner">
                <p className="text-slate-600 font-medium">Waiting for incoming tickets...</p>
              </div>
            )}

            {tickets.map((t) => {
              const isExpanded = expandedTickets.includes(t.id);
              const isLong = t.description.length > 200;

              return (
                <div key={t.id} className="relative group bg-[#0f0f12] border border-white/5 p-8 rounded-[2.5rem] hover:border-blue-500/30 transition-all duration-500 shadow-sm overflow-hidden">
                  {/* Status Overlay for pending */}
                  {t.status === 'pending' && (
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>
                  )}

                  <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-bold text-white leading-tight group-hover:text-blue-400 transition-colors">{t.title}</h3>
                      </div>
                      <div className="flex flex-wrap gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><i className="w-1 h-1 bg-slate-700 rounded-full"></i> ID: #{t.id}</span>
                        <span className="flex items-center gap-1.5"><i className="w-1 h-1 bg-slate-700 rounded-full"></i> Reporter: {t.submitted_by}</span>
                        <span className="flex items-center gap-1.5"><i className="w-1 h-1 bg-slate-700 rounded-full"></i> {new Date(t.created_at).toLocaleTimeString()}</span>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col gap-2 shrink-0 items-end">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${t.status === 'analyzed' ? 'bg-blue-500 text-white border-blue-400' : 'bg-amber-500/10 text-amber-500 border-amber-500/30 animate-pulse'
                        }`}>
                        {t.status === 'pending' ? '🤖 Analyzing...' : t.status}
                      </span>
                      {t.urgency_level && (
                        <span className={getUrgencyStyles(t.urgency_level)}>
                          {t.urgency_level} • {t.severity_score}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description with Expand Logic */}
                  <div className="relative">
                    <p className={`text-slate-400 leading-relaxed text-sm transition-all duration-300 ${!isExpanded && isLong ? 'line-clamp-3 opacity-60' : 'opacity-100'}`}>
                      {t.description}
                    </p>
                    {isLong && (
                      <button onClick={() => toggleExpand(t.id)} className="mt-2 text-blue-500 text-[10px] font-bold uppercase tracking-widest hover:text-blue-400 transition-colors">
                        {isExpanded ? 'Collapse ▲' : 'Read Full Description ▼'}
                      </button>
                    )}
                  </div>

                  {/* AI INSIGHT SECTION */}
                  {t.reasoning && (
                    <div className="mt-8 relative group/ai">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur opacity-0 group-hover/ai:opacity-100 transition duration-1000"></div>
                      <div className="relative p-6 bg-black/40 rounded-3xl border border-white/5">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-blue-500 text-white text-[9px] font-black uppercase rounded shadow-lg shadow-blue-500/20">AI Reasoning</span>
                            <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Llama 3.3 Protocol</span>
                          </div>
                        </div>
                        <p className="text-slate-300 text-sm italic leading-relaxed font-serif">"{t.reasoning}"</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}