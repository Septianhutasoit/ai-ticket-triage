"use client";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);

  // Fungsi mengambil data dari FastAPI
  const fetchTickets = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/tickets/");
      const data = await res.json();
      setTickets(data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 3000); // Refresh tiap 3 detik (Otomatis!)
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-10 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-10 border-b border-slate-700 pb-6">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              🎫 AI Ticket Triage
            </h1>
            <p className="text-slate-400 mt-2">Monitoring tiket yang dianalisis oleh AI Llama 3</p>
          </div>
          <div className="text-right text-xs text-slate-500 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
            Backend: <span className="text-green-400 font-mono">http://localhost:8000</span>
          </div>
        </header>

        <div className="grid gap-6">
          {tickets.map((t: any) => (
            <div key={t.id} className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-all shadow-xl group">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold group-hover:text-blue-400 transition-colors">{t.title}</h3>
                  <p className="text-slate-400 text-sm mt-1">ID: #{t.id} | Diajukan oleh: <span className="text-slate-200">{t.submitted_by}</span></p>
                  <p className="text-slate-300 mt-4 italic text-sm">"{t.description}"</p>
                </div>

                <div className="flex flex-col gap-3 items-end">
                  {/* Status Badge */}
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${t.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                    }`}>
                    {t.status}
                  </span>

                  {/* Urgency Badge (Hanya muncul jika sudah dianalisis AI) */}
                  {t.urgency_level && (
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${t.urgency_level === 'Critical' ? 'bg-red-500 text-white shadow-lg shadow-red-500/50' :
                        t.urgency_level === 'High' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                      Urgency: {t.urgency_level}
                    </span>
                  )}
                </div>
              </div>

              {/* Reasoning AI (Hanya muncul jika sudah selesai) */}
              {t.reasoning && (
                <div className="mt-6 pt-4 border-t border-slate-700/50">
                  <p className="text-[11px] text-slate-500 uppercase font-bold tracking-widest mb-2">Analisis AI Reasoning:</p>
                  <p className="text-slate-400 text-sm leading-relaxed">{t.reasoning}</p>
                </div>
              )}
            </div>
          ))}

          {tickets.length === 0 && (
            <div className="text-center py-20 bg-slate-800/20 rounded-3xl border border-dashed border-slate-700">
              <p className="text-slate-500 italic">Belum ada tiket masuk ke database.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}