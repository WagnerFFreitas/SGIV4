
import React, { useState, useMemo } from 'react';
import { 
  Briefcase, UserPlus, Edit2, Trash2, X, Save, 
  FileText, User, ShieldCheck, ChevronRight, FileCheck, MapPin,
  Plus, Calendar, Check, QrCode, Download, Printer, Loader2, Square, CheckSquare,
  Search, Building
} from 'lucide-react';
import { Payroll } from '../types';

interface DPViewProps {
  employees: Payroll[];
  currentUnitId: string;
  setEmployees: (newList: Payroll[]) => void;
}

export const DPView: React.FC<DPViewProps> = ({ employees, currentUnitId, setEmployees }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const toggleSelectAll = () => setSelectedIds(selectedIds.length === employees.length ? [] : employees.map(e => e.id));

  return (
    <div className="space-y-5 animate-in fade-in duration-500 pb-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5">
        <div>
          <h1 className="text-lg font-black text-slate-900 leading-tight uppercase tracking-tight">Gestão de Funcionários</h1>
          <p className="text-slate-400 font-medium text-[11px] uppercase tracking-tighter">Controle de Vínculos Laborais e Conformidade eSocial</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex items-center justify-center gap-1.5 px-4 py-1.5 bg-slate-200 text-slate-600 rounded-lg font-bold text-[10px] uppercase hover:bg-slate-300"><QrCode size={14} /> Crachás</button>
          <button className="flex items-center justify-center gap-1.5 px-5 py-1.5 bg-slate-900 text-white rounded-lg font-bold text-[10px] uppercase shadow-md hover:bg-slate-800"><Plus size={14} /> Novo Funcionário</button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-slate-50/30 text-[10px] text-slate-400 font-black uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-4 py-3 w-10 text-center"><div onClick={toggleSelectAll} className="cursor-pointer mx-auto">{selectedIds.length === employees.length ? <CheckSquare size={16} className="text-indigo-600"/> : <Square size={16} className="text-slate-300"/>}</div></th>
                <th className="px-3 py-3">Funcionário</th>
                <th className="px-6 py-3">Tipo de Vínculo</th>
                <th className="px-6 py-3">Documentação</th>
                <th className="px-6 py-3">Status eSocial</th>
                <th className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-[12px]">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/50 transition-all">
                  <td className="px-4 py-2.5 text-center"><div onClick={() => setSelectedIds(prev => prev.includes(emp.id) ? prev.filter(id => id !== emp.id) : [...prev, emp.id])} className="cursor-pointer mx-auto">{selectedIds.includes(emp.id) ? <CheckSquare size={16} className="text-indigo-600"/> : <Square size={16} className="text-slate-300"/>}</div></td>
                  <td className="px-3 py-2.5">
                    <p className="font-bold text-slate-900 leading-none">{emp.employeeName}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5 tracking-tighter">MAT: {emp.matricula}</p>
                  </td>
                  <td className="px-6 py-2.5">
                    <p className="font-bold text-slate-700 leading-none">{emp.cargo}</p>
                    <p className="text-[8px] text-indigo-600 font-black uppercase mt-0.5">{emp.tipo_contrato}</p>
                  </td>
                  <td className="px-6 py-2.5"><span className="text-[9px] font-black text-slate-500 uppercase">CPF: {emp.cpf}</span></td>
                  <td className="px-6 py-2.5"><span className="px-2 py-0.5 rounded text-[9px] font-black uppercase text-emerald-700 bg-emerald-50">Sincronizado</span></td>
                  <td className="px-6 py-2.5 text-right text-slate-400"><button className="hover:text-indigo-600"><Edit2 size={15}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
