"use client";
import { useEffect, useState } from "react";

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

export default function TicketSystem() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [formData, setFormData] = useState({ title: "", description: "", submitted_by: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTickets = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/tickets/");
      const data = await res.json();
      setTickets(data);
    } catch (err) {
      console.error("Gagal koneksi ke API Backend:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch("http://localhost:8000/api/tickets/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setFormData({ title: "", description: "", submitted_by: "" });
      fetchTickets();
    } catch (err) {
      alert("Gagal mengirim tiket!");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 3000);
    return () => clearInterval(interval);
  }, []);

  const getUrgencyStyles = (level: string | null) => {
    switch (level) {
      case "Critical": return "bg-red-500/20 text-red-400 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]";
      case "High": return "bg-orange-500/20 text-orange-400 border-orange-500/50";
      case "Medium": return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "Low": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50";
      default: return "bg-slate-700/50 text-slate-400 border-slate-600";
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* BAGIAN FORM (Kiri) */}
        <div className="lg:col-span-1">
          <div className="sticky top-10 bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="text-blue-500">➕</span> Submit Ticket
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Subject</label>
                <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-blue-500 transition-all outline-none" placeholder="Masalah server..." />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Reporter</label>
                <input required value={formData.submitted_by} onChange={e => setFormData({ ...formData, submitted_by: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-blue-500 transition-all outline-none" placeholder="Nama/Email..." />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Description</label>
                <textarea required rows={4} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:border-blue-500 transition-all outline-none resize-none" placeholder="Jelaskan detail masalah..." />
              </div>
              <button disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50">
                {isSubmitting ? "Sending..." : "Create Ticket"}
              </button>
            </form>
          </div>
        </div>

        {/* BAGIAN DASHBOARD (Kanan) */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-white text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Dashboard Triage</h1>
              <p className="text-slate-500 font-medium">Real-time AI Ticket Analysis Monitoring</p>
            </div>
            <div className="hidden md:block bg-slate-900 border border-slate-800 px-4 py-2 rounded-full text-[10px] font-bold text-slate-400">
              LIVE POLLING ACTIVE
            </div>
          </div>

          <div className="space-y-4">
            {tickets.length === 0 && <div className="text-center py-20 text-slate-600 italic">Belum ada tiket yang masuk.</div>}

            {tickets.map((t) => (
              <div key={t.id} className="group bg-slate-900/40 border border-slate-800/80 p-6 rounded-3xl hover:bg-slate-800/40 transition-all">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{t.title}</h3>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">ID: #{t.id} • By {t.submitted_by}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${t.status === 'analyzed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
                      }`}>
                      {t.status}
                    </span>
                    {t.urgency_level && (
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${getUrgencyStyles(t.urgency_level)}`}>
                        {t.urgency_level} • {t.severity_score}%
                      </span>
                    )}
                  </div>
                </div>

                <p className="mt-4 text-slate-400 text-sm leading-relaxed">"{t.description}"</p>

                {t.reasoning && (
                  <div className="mt-6 p-4 bg-slate-950/50 rounded-2xl border border-slate-800/50">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-blue-500 text-xs">🤖</span>
                      <span className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">AI Reasoning Analysis</span>
                    </div>
                    <p className="text-slate-300 text-sm italic leading-relaxed">{t.reasoning}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}