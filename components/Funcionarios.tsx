
import React, { useState } from 'react';
import { Briefcase, Plus, QrCode, Square, CheckSquare, Edit2, Search, Building, UserCheck } from 'lucide-react';
import { Payroll } from '../types';

interface FuncionariosProps {
  employees: Payroll[];
  currentUnitId: string;
  setEmployees: (newList: Payroll[]) => void;
}

export const Funcionarios: React.FC<FuncionariosProps> = ({ employees, currentUnitId, setEmployees }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = employees.filter(e => e.employeeName.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-5 animate-in fade-in pb-16">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight">Prontuário de Funcionários</h1>
          <p className="text-slate-400 font-medium text-[11px] uppercase tracking-widest">Gestão Admissional e Vínculos CLT/PJ</p>
        </div>
        <div className="flex gap-2">
          <button className="px-5 py-2 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase shadow-lg flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95"><Plus size={14} /> Nova Admissão</button>
        </div>
      </div>

      <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
         <Search className="text-slate-300 ml-2" size={18}/>
         <input 
          type="text" 
          placeholder="Pesquisar por nome ou matrícula..." 
          className="flex-1 bg-transparent outline-none text-xs font-bold text-slate-700"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
         />
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/30 text-[10px] text-slate-400 font-black uppercase tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-4 py-4 text-center w-10">#</th>
              <th className="px-3 py-4">Colaborador</th>
              <th className="px-6 py-4">Cargo / Tipo</th>
              <th className="px-6 py-4">Data Admissão</th>
              <th className="px-6 py-4">Status eSocial</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-xs">
            {filtered.map((emp) => (
              <tr key={emp.id} className="hover:bg-slate-50/50 transition-all">
                <td className="px-4 py-3 text-center"><Square size={16} className="text-slate-200 mx-auto"/></td>
                <td className="px-3 py-3 font-bold text-slate-900">
                   <p>{emp.employeeName}</p>
                   <p className="text-[8px] text-slate-400 uppercase font-black tracking-tighter mt-1">MAT: {emp.matricula}</p>
                </td>
                <td className="px-6 py-3">
                   <p className="font-bold text-slate-600">{emp.cargo}</p>
                   <p className="text-[9px] text-indigo-500 font-black uppercase">{emp.tipo_contrato}</p>
                </td>
                <td className="px-6 py-3 font-medium text-slate-500">{new Date(emp.data_admissao).toLocaleDateString('pt-BR')}</td>
                <td className="px-6 py-3"><span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase text-emerald-700 bg-emerald-50 border border-emerald-100">Sincronizado</span></td>
                <td className="px-6 py-3 text-right text-slate-300 hover:text-indigo-600 cursor-pointer transition-colors"><Edit2 size={16}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
