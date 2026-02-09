
import React from 'react';
import { Award, BookOpen, Heart, Star, Search } from 'lucide-react';
import { Payroll } from '../types';

interface RecursosHumanosProps {
  employees: Payroll[];
}

export const RecursosHumanos: React.FC<RecursosHumanosProps> = ({ employees }) => {
  return (
    <div className="space-y-6 animate-in fade-in pb-20">
      <div>
        <h1 className="text-xl font-bold text-slate-900 uppercase">Recursos Humanos</h1>
        <p className="text-slate-500 font-medium text-sm">Desenvolvimento ministerial e quadro de competências.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Treinamentos Ativos', val: '08', icon: <BookOpen size={18}/> },
          { label: 'Avaliações Pendentes', val: '03', icon: <Star size={18}/> },
          { label: 'Satisfação Interna', val: '94%', icon: <Heart size={18}/> },
        ].map((s, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">{s.icon}</div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</p>
              <p className="text-xl font-black text-slate-900">{s.val}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
