
import React, { useState, useMemo } from 'react';
import { 
  Printer, Check, Edit3, Save, DollarSign, Calculator, ArrowDownRight,
  Plus, X, FileText, Download, Shield,
  Loader2, Star, FileSearch, Printer as PrinterIcon
} from 'lucide-react';
import { DEFAULT_TAX_CONFIG } from '../constants';
import { Payroll } from '../types';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface FolhaProcessViewProps {
  employees: Payroll[];
  setEmployees: React.Dispatch<React.SetStateAction<Payroll[]>>;
}

export const FolhaProcessView: React.FC<FolhaProcessViewProps> = ({ employees, setEmployees }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [holeriteList, setHoleriteList] = useState<Payroll[]>([]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const toggleSelectAll = () => {
    if (selectedIds.length === employees.length) setSelectedIds([]);
    else setSelectedIds(employees.map(e => e.id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 leading-none">Folha de Pagamento</h1>
          <p className="text-slate-500 font-medium mt-2 text-sm">Cálculo de proventos, descontos e encargos patronais.</p>
        </div>
        <div className="flex items-center gap-3 no-print">
          <button 
            type="button"
            onClick={() => setHoleriteList(employees.filter(e => selectedIds.includes(e.id)))}
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-200 text-slate-600 rounded-lg font-bold text-xs uppercase transition-all hover:bg-slate-300"
          >
            <PrinterIcon size={16}/> Imprimir Recibos
          </button>
          <button 
            type="button"
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-lg font-bold text-xs uppercase shadow-lg transition-all hover:bg-slate-800"
          >
            <Calculator size={16}/> Processar Folha
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/30 text-[11px] text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 w-12 text-center">
                <div onClick={toggleSelectAll} className="cursor-pointer mx-auto flex items-center justify-center">
                  {selectedIds.length === employees.length && employees.length > 0 ? (
                    <Check className="text-indigo-600" size={18}/>
                  ) : (
                    <div className="w-4 h-4 border-2 border-slate-300 rounded" />
                  )}
                </div>
              </th>
              <th className="px-4 py-4">Colaborador</th>
              <th className="px-8 py-4">Vencimentos</th>
              <th className="px-8 py-4">Líquido a Receber</th>
              <th className="px-8 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {employees.map(emp => (
              <tr key={emp.id} className="hover:bg-slate-50/50 transition-all">
                <td className="px-6 py-4 text-center">
                   <input type="checkbox" checked={selectedIds.includes(emp.id)} onChange={() => setSelectedIds(prev => prev.includes(emp.id) ? prev.filter(id => id !== emp.id) : [...prev, emp.id])} className="w-4 h-4 accent-indigo-600" />
                </td>
                <td className="px-4 py-4">
                   <p className="font-bold text-slate-900 text-sm leading-none mb-1">{emp.employeeName}</p>
                   <p className="text-[10px] text-slate-500 font-bold uppercase">{emp.cargo}</p>
                </td>
                <td className="px-8 py-4">
                   <p className="text-slate-600 font-bold text-xs">R$ {emp.total_proventos.toFixed(2)}</p>
                </td>
                <td className="px-8 py-4">
                   <p className="text-emerald-700 font-black text-sm">R$ {emp.salario_liquido.toFixed(2)}</p>
                </td>
                <td className="px-8 py-4 text-right">
                   <button className="text-slate-400 hover:text-indigo-600"><Edit3 size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
