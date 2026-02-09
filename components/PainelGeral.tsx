
import React, { useEffect, useState } from 'react';
import { 
  Users, TrendingUp, DollarSign, Target, ChevronRight, Sparkles 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { geminiService } from '../services/geminiService';
import { UserAuth, Member, Payroll } from '../types';

const chartData = [
  { name: 'Jan', revenue: 4000 }, { name: 'Fev', revenue: 3000 },
  { name: 'Mar', revenue: 2000 }, { name: 'Abr', revenue: 2780 },
  { name: 'Mai', revenue: 4890 },
];

interface PainelGeralProps {
  user: UserAuth;
  members: Member[];
  employees: Payroll[];
}

export const PainelGeral: React.FC<PainelGeralProps> = ({ user, members, employees }) => {
  const [insights, setInsights] = useState<string>('Analisando base de dados para gerar recomendações estratégicas...');

  useEffect(() => {
    geminiService.analyzeChurchHealth({
      totalMembers: members.length,
      activeMembers: members.filter(m => m.status === 'ACTIVE').length,
      monthlyRevenue: 25000,
      monthlyExpenses: 18000
    }).then(setInsights);
  }, [members]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-lg font-black text-slate-900 uppercase tracking-tighter italic font-serif">Painel Geral</h1>
          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter mt-0.5">Indicadores Críticos e Insights em Tempo Real</p>
        </div>
        <div className="flex gap-2">
           <div className="px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-lg text-[9px] font-black text-indigo-600 uppercase">Status: Online</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { l: 'Total Membros', v: members.length, t: '+12%', i: <Users />, c: 'indigo' },
          { l: 'Arrecadação', v: 'R$ 25.4k', t: '+8%', i: <DollarSign />, c: 'emerald' },
          { l: 'Frequência Média', v: '312', t: '-2%', i: <Target />, c: 'amber' },
          { l: 'Novos Visitantes', v: '18', t: '+24%', i: <TrendingUp />, c: 'blue' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-4 rounded-[1.5rem] border border-slate-100 flex flex-col shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between mb-2">
              <div className={`p-2 bg-${s.c}-50 text-${s.c}-600 rounded-xl`}>
                {React.cloneElement(s.i as React.ReactElement<{ size?: number }>, { size: 16 })}
              </div>
              <span className={`text-[9px] font-black ${s.t.startsWith('+') ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'} px-2 py-0.5 rounded-full`}>{s.t}</span>
            </div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.l}</p>
            <h3 className="text-xl font-black text-slate-900 mt-1">{s.v}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 bg-white p-6 rounded-[2rem] border border-slate-100 h-80 shadow-sm">
          <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-6 border-b pb-2 flex items-center gap-2">
            <TrendingUp size={14} className="text-indigo-600"/> Evolução da Arrecadação
          </h3>
          <ResponsiveContainer width="100%" height="80%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{fontSize: 9, fontWeight: 700}} axisLine={false} />
              <YAxis tick={{fontSize: 9, fontWeight: 700}} axisLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-4 bg-slate-900 p-6 rounded-[2rem] shadow-xl relative overflow-hidden flex flex-col h-80">
           <div className="absolute top-0 right-0 p-8 opacity-5"><Sparkles size={180}/></div>
           <h3 className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-6 flex items-center gap-2 relative z-10">
              <Sparkles size={14}/> Recomendações Estratégicas IA
           </h3>
           <div className="flex-1 bg-white/5 backdrop-blur-md rounded-[1.5rem] p-5 border border-white/10 relative z-10">
              <p className="text-indigo-50 text-[12px] leading-relaxed italic font-medium">"{insights}"</p>
           </div>
           <div className="mt-4 flex items-center justify-between text-[8px] font-black text-indigo-400 uppercase tracking-widest relative z-10">
              <span>Engine: Gemini 3.0 Flash</span>
              <span>Updated: Agora</span>
           </div>
        </div>
      </div>
    </div>
  );
};
