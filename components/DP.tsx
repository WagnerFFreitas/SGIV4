
import React, { useState, useMemo } from 'react';
import { 
  Briefcase, UserPlus, Edit2, Trash2, X, Save, 
  FileText, User, ShieldCheck, ChevronRight, FileCheck, MapPin,
  HeartPulse, Pill, Bus, Utensils, ArrowDownRight, Landmark, Users,
  CreditCard, Plus, Calendar, Check, Droplets, PhoneCall, DollarSign, Clock, Star,
  Upload, FileWarning, ExternalLink, AlertCircle, Home, HardDrive,
  QrCode, Download, Printer, Loader2, Square, CheckSquare, Phone, Mail, Info, Trash,
  Stethoscope, Accessibility, CreditCard as CardIcon, Map, Search, Building, UserCircle,
  Camera
} from 'lucide-react';
import { Payroll, Dependent } from '../types';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface DPViewProps {
  employees: Payroll[];
  currentUnitId: string;
  setEmployees: (newList: Payroll[]) => void;
}

const EmployeeIDCard: React.FC<{ emp: Payroll }> = ({ emp }) => {
  const getVinculoColor = (tipo: string) => {
    switch (tipo) {
      case 'CLT': return 'bg-indigo-600';
      case 'PJ': return 'bg-emerald-600';
      case 'VOLUNTARIO': return 'bg-amber-600';
      default: return 'bg-slate-600';
    }
  };
  const vinculoLabel = { 'CLT': 'Efetivo', 'PJ': 'Terceirizado', 'VOLUNTARIO': 'Voluntário', 'TEMPORARIO': 'Estagiário' }[emp.tipo_contrato] || 'Visitante';
  return (
    <div className="flex flex-row items-start justify-center gap-2 no-break id-card-element bg-white p-2 border border-slate-100 rounded-xl" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
      <div className="w-[54mm] h-[86mm] bg-white rounded-xl shadow-2xl relative overflow-hidden flex flex-col items-center border border-slate-200 shrink-0">
        <div className="w-full bg-[#1e293b] py-3 px-2 flex flex-col items-center justify-center border-b-4 border-indigo-600">
           <span className="text-[9px] font-black text-white uppercase tracking-tighter">ADJPA ERP</span>
           <p className="text-[6px] font-bold text-slate-400 uppercase tracking-widest leading-none">Identidade Ministerial</p>
        </div>
        <div className={`w-full ${getVinculoColor(emp.tipo_contrato)} py-1 flex items-center justify-center`}>
           <span className="text-[6px] font-black text-white uppercase tracking-[0.2em]">{vinculoLabel}</span>
        </div>
        <div className="mt-4"><div className="w-24 h-24 rounded-full border-[3px] border-slate-100 overflow-hidden shadow-xl bg-slate-50 flex items-center justify-center"><img src={`https://ui-avatars.com/api/?name=${emp.employeeName}&background=f1f5f9&color=475569&size=200&bold=true`} className="w-full h-full object-cover" crossOrigin="anonymous"/></div></div>
        <div className="flex-1 w-full px-4 flex flex-col items-center justify-center text-center">
          <h4 className="text-[10px] font-black uppercase text-slate-900 mb-0.5 tracking-tight">{emp.employeeName}</h4>
          <p className="text-[8px] font-bold text-indigo-600 uppercase tracking-wider mb-1">{emp.cargo}</p>
        </div>
        <div className="w-full px-4 pb-4 flex flex-col items-center gap-2"><div className="p-1.5 bg-slate-50 rounded-lg border border-slate-100"><QrCode size={38} className="text-slate-900"/></div></div>
      </div>
    </div>
  );
};

export const DPView: React.FC<DPViewProps> = ({ employees, currentUnitId, setEmployees }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIDCardOpen, setIsIDCardOpen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'personal' | 'address' | 'payroll_base' | 'benefits' | 'dependents' | 'bank' | 'contract'>('personal');
  const [editingEmp, setEditingEmp] = useState<Payroll | null>(null);

  const [formData, setFormData] = useState<Partial<Payroll>>({
    employeeName: '', cpf: '', rg: '', pis: '', ctps: '', cargo: '', 
    salario_base: 0, dependentes_lista: [], dependentes_qtd: 0,
    address: { zipCode: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '' },
    unitId: currentUnitId
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === employees.length) setSelectedIds([]);
    else setSelectedIds(employees.map(e => e.id));
  };

  const handleSave = () => {
    if (!formData.employeeName) return;
    if (editingEmp) {
      setEmployees(employees.map(e => e.id === editingEmp.id ? { ...e, ...formData } as Payroll : e));
    } else {
      setEmployees([{ ...formData, id: Math.random().toString(36).substr(2, 9), status: 'ACTIVE' } as Payroll, ...employees]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 leading-tight">Depto. Pessoal & Admissões</h1>
          <p className="text-slate-500 font-medium text-sm">Gestão de vínculos contratuais e conformidade CLT.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button onClick={() => setIsIDCardOpen(true)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-200 text-slate-600 rounded-lg font-bold text-xs uppercase transition-all hover:bg-slate-300">
            <QrCode size={16} /> Imprimir Crachás
          </button>
          <button onClick={() => { setEditingEmp(null); setIsModalOpen(true); }} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-lg font-bold text-xs uppercase shadow-lg transition-all hover:bg-slate-800">
            <Plus size={16} /> Admissão Digital
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left min-w-[1000px]">
            <thead className="bg-slate-50/30 text-[11px] text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 w-12 text-center">
                   <div onClick={toggleSelectAll} className="cursor-pointer">
                    {selectedIds.length === employees.length && employees.length > 0 ? (
                      <CheckSquare className="text-indigo-600" size={18}/>
                    ) : (
                      <Square className="text-slate-300" size={18}/>
                    )}
                   </div>
                </th>
                <th className="px-4 py-4">Colaborador</th>
                <th className="px-8 py-4">Vínculo / Cargo</th>
                <th className="px-8 py-4">Documentação</th>
                <th className="px-8 py-4">Status eSocial</th>
                <th className="px-8 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/50 transition-all">
                  <td className="px-6 py-4 text-center">
                    <div onClick={() => setSelectedIds(prev => prev.includes(emp.id) ? prev.filter(id => id !== emp.id) : [...prev, emp.id])} className="cursor-pointer">
                      {selectedIds.includes(emp.id) ? <CheckSquare className="text-indigo-600" size={18}/> : <Square className="text-slate-300" size={18}/>}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-bold text-slate-900 text-sm leading-none mb-1">{emp.employeeName}</p>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">{emp.matricula}</p>
                  </td>
                  <td className="px-8 py-4">
                    <p className="text-slate-900 font-bold text-xs">{emp.cargo}</p>
                    <p className="text-[9px] text-indigo-700 font-black uppercase">{emp.tipo_contrato}</p>
                  </td>
                  <td className="px-8 py-4">
                    <span className="text-[10px] font-black text-slate-700 uppercase">CPF: {emp.cpf}</span>
                  </td>
                  <td className="px-8 py-4">
                    <span className="px-2.5 py-1 rounded text-[10px] font-black uppercase text-emerald-700 bg-emerald-50">Transmitido</span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <button onClick={() => { setEditingEmp(emp); setFormData(emp); setIsModalOpen(true); }} className="text-slate-400 hover:text-indigo-600 transition-colors">
                      <Edit2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
