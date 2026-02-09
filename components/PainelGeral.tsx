
import React, { useEffect, useState, useMemo } from 'react';
import { 
  Users, TrendingUp, DollarSign, Sparkles, Target, 
  ChevronRight, AlertTriangle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { geminiService } from '../services/geminiService';
import { UserAuth, Member, Payroll } from '../types';

const chartData = [
  { name: 'Jan', revenue: 4000 }, { name: 'Fev', revenue: 3000 },
  { name: 'Mar', revenue: 2000 }, { name: 'Abr', revenue: 2780 },
  { name: 'Mai', revenue: 1890 },
];

interface PainelGeralProps {
  user: UserAuth;
  members: Member[];
  employees: Payroll[];
}

export const PainelGeral: React.FC<PainelGeralProps> = ({ user, members, employees }) => {
  const [insights, setInsights] = useState<string>('Carregando insights estratégicos...');

  useEffect(() => {
    geminiService.analyzeChurchHealth({
      totalMembers: members.length,
      activeMembers: members.filter(m => m.status === 'ACTIVE').length,
      monthlyRevenue: 25000,
      monthlyExpenses: 18000
    }).then(setInsights);
  }, [members]);

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-lg font-black text-slate-900">Olá, {user.name.split(' ')[0]}</h1>
          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">Sede Mundial • v5.0 ERP</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { l: 'Membros', v: members.length, t: '+12%', i: <Users />, c: 'indigo' },
          { l: 'Arrecadação', v: 'R$ 25.4k', t: '+8%', i: <DollarSign />, c: 'emerald' },
          { l: 'Frequência', v: '312', t: '-2%', i: <Target />, c: 'amber' },
          { l: 'Visitantes', v: '18', t: '+24%', i: <TrendingUp />, c: 'blue' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-3 rounded-xl border border-slate-100 flex flex-col">
            <div className="flex justify-between mb-2">
              {/* Fix: Explicitly defining generic type for ReactElement to allow 'size' prop in cloneElement */}
              <div className="p-1.5 bg-slate-50 text-indigo-600 rounded-lg">{React.cloneElement(s.i as React.ReactElement<{ size?: number }>, { size: 14 })}</div>
              <span className="text-[8px] font-black text-emerald-600 px-1 bg-emerald-50 rounded">{s.t}</span>
            </div>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{s.l}</p>
            <h3 className="text-md font-black text-slate-900 mt-0.5">{s.v}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8 bg-white p-4 rounded-xl border border-slate-100 h-64">
          <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4">Fluxo Financeiro</h3>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{fontSize: 9}} axisLine={false} />
              <YAxis tick={{fontSize: 9}} axisLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="col-span-4 bg-white p-4 rounded-xl border border-slate-100 overflow-y-auto h-64">
           <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4">Insights IA</h3>
           <div className="bg-indigo-900 p-4 rounded-xl text-indigo-100 text-[11px] leading-relaxed italic font-medium">"{insights}"</div>
        </div>
      </div>
    </div>
  );
};
