
import React, { useState } from 'react';
import { 
  UserCheck, 
  Award, 
  BookOpen, 
  Heart, 
  Search, 
  Plus,
  TrendingUp,
  Star,
  Users
} from 'lucide-react';
import { Payroll } from '../types';

interface RHViewProps {
  employees: Payroll[];
}

export const RHView: React.FC<RHViewProps> = ({ employees }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 leading-tight">Recursos Humanos (RH)</h1>
          <p className="text-slate-500 font-medium text-sm">Desenvolvimento ministerial e quadro de competências.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-lg font-bold text-xs uppercase shadow-lg transition-all hover:bg-slate-800">
          <Award size={16} /> Novo Treinamento
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Treinamentos Ativos', val: '08', icon: <BookOpen size={18} className="text-indigo-600"/> },
          { label: 'Avaliações Pendentes', val: '03', icon: <Star size={18} className="text-indigo-600"/> },
          { label: 'Satisfação Interna', val: '94%', icon: <Heart size={18} className="text-indigo-600"/> },
        ].map((s, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-xl bg-indigo-50">{s.icon}</div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</p>
              <p className="text-xl font-black text-slate-900">{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
           <h3 className="font-bold text-slate-900 text-sm uppercase tracking-tight">Mapeamento de Competências</h3>
           <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
              <input className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Buscar colaborador..." />
           </div>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
           {employees.map(emp => (
             <div key={emp.id} className="p-4 bg-slate-50/50 hover:bg-white hover:shadow-md border border-transparent hover:border-slate-100 rounded-xl transition-all flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-xs">
                      {emp.employeeName.split(' ').map(n => n[0]).join('')}
                   </div>
                   <div>
                      <p className="font-bold text-slate-900 text-sm">{emp.employeeName}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">{emp.cargo}</p>
                   </div>
                </div>
                <div className="flex gap-1">
                   {[1,2,3,4,5].map(s => <Star key={s} size={10} className={s <= 4 ? "fill-amber-400 text-amber-400" : "text-slate-200"} />)}
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};
