
import React from 'react';
import { BarChart3, Download, FileSpreadsheet, DollarSign, Users, Briefcase } from 'lucide-react';

export const Relatorios: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in pb-20">
      <div>
        <h1 className="text-2xl font-black text-slate-900 uppercase">Relatórios & Integração</h1>
        <p className="text-slate-500 font-medium">Extração de dados para contabilidade.</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {['Financeiro', 'Recursos Humanos', 'Membros'].map((cat, i) => (
          <div key={i} className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b pb-4 mb-4">{cat}</h3>
            <button className="w-full py-3 bg-slate-50 text-slate-700 rounded-xl font-bold text-xs uppercase hover:bg-indigo-50 flex items-center justify-center gap-2">
               <Download size={14}/> Exportar CSV
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
