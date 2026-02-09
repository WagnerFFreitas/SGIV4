
import React, { useState, useMemo } from 'react';
import { 
  Calculator, Briefcase, UserPlus, Edit2, Trash2, X, Save, 
  Landmark, FileText, PieChart, CreditCard, ChevronRight, 
  User, ShieldCheck, ArrowUpRight, ArrowDownRight,
  HeartPulse, FileCheck, Info, Stethoscope, Pill, Bus, Utensils,
  Clock, MapPin, Building, ShieldAlert, Zap
} from 'lucide-react';
import { MOCK_PAYROLL, DEFAULT_TAX_CONFIG } from '../constants';
import { Payroll } from '../types';

export const PayrollView: React.FC = () => {
  const [employees, setEmployees] = useState<Payroll[]>(MOCK_PAYROLL);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'docs' | 'contract' | 'bank' | 'payroll' | 'benefits' | 'costs'>('personal');
  const [editingEmp, setEditingEmp] = useState<Payroll | null>(null);
  
  const [formData, setFormData] = useState<Partial<Payroll>>({
    employeeName: '', cpf: '', rg: '', pis: '', ctps: '', cargo: '', matricula: '', departamento: '',
    data_admissao: new Date().toISOString().split('T')[0], tipo_contrato: 'CLT', salario_base: 0,
    he50_qtd: 0, adic_noturno_qtd: 0, gratificacoes: 0, inss: 0, fgts_retido: 0, month: '05', year: '2024',
    banco: '', agencia: '', conta: '', titular: '', chave_pix: '', va_ativo: false, vt_ativo: false
  });

  const totals = useMemo(() => {
    const proventos = (Number(formData.salario_base) || 0) + (Number(formData.gratificacoes) || 0) + (Number(formData.he50_qtd) * 25 || 0);
    const descontos = (Number(formData.inss) || 0) + (Number(formData.irrf) || 0);
    return { proventos, descontos, liquido: proventos - descontos };
  }, [formData]);

  const handleSave = () => {
    if (!formData.employeeName) return alert("Nome é obrigatório.");
    const data = { ...formData, id: editingEmp?.id || Math.random().toString(36).substr(2, 9), total_proventos: totals.proventos, total_descontos: totals.descontos, salario_liquido: totals.liquido } as Payroll;
    if (editingEmp) setEmployees(employees.map(e => e.id === editingEmp.id ? data : e));
    else setEmployees([data, ...employees]);
    closeModal();
  };

  const openModal = (emp?: Payroll) => {
    if (emp) { setEditingEmp(emp); setFormData(emp); }
    else setFormData({ employeeName: '', cargo: '', departamento: '', salario_base: 0, data_admissao: new Date().toISOString().split('T')[0], tipo_contrato: 'CLT', banco: '', agencia: '', conta: '', va_ativo: false, vt_ativo: false });
    setActiveTab('personal'); setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); setEditingEmp(null); };

  return (
    <div className="space-y-4 animate-in fade-in pb-16">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-none">Recursos Humanos & DP</h1>
          <p className="text-slate-400 font-medium text-[10px] uppercase tracking-tighter mt-1">Gestão de Vínculos Laborais e Conformidade eSocial</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center gap-1.5 px-5 py-1.5 bg-slate-900 text-white rounded-lg font-bold text-[10px] uppercase shadow-md hover:bg-slate-800 transition-all">
          <UserPlus size={14} /> Nova Admissão
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-slate-50/30 text-[10px] text-slate-400 font-black uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3">Colaborador / Prontuário</th>
                <th className="px-6 py-3">Cargo / Departamento</th>
                <th className="px-6 py-3">Remuneração Líquida</th>
                <th className="px-6 py-3">Situação eSocial</th>
                <th className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-[11px]">
              {employees.map(emp => (
                <tr key={emp.id} className="hover:bg-slate-50/50 transition-all">
                  <td className="px-6 py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs">{emp.employeeName[0]}</div>
                      <div>
                        <p className="font-bold text-slate-900 leading-none">{emp.employeeName}</p>
                        <p className="text-[9px] text-indigo-600 font-black mt-1">MAT: {emp.matricula}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-2.5">
                    <p className="font-bold text-slate-700 leading-none">{emp.cargo}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">{emp.departamento}</p>
                  </td>
                  <td className="px-6 py-2.5 font-black text-emerald-600 text-xs">R$ {emp.salario_liquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td className="px-6 py-2.5"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[9px] font-black uppercase shadow-sm">Transmitido</span></td>
                  <td className="px-6 py-2.5 text-right"><button onClick={() => openModal(emp)} className="text-slate-400 hover:text-indigo-600 transition-colors"><Edit2 size={15}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-6xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-4 bg-white border-b flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-900 text-white rounded-xl shadow-md"><Briefcase size={20}/></div>
                <div>
                   <h2 className="text-sm font-black uppercase text-slate-900">Registro Admissional Eletivo eSocial</h2>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sede Mundial • Prontuário Digital v5.0</p>
                </div>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-all"><X size={20}/></button>
            </div>

            <div className="flex border-b bg-slate-50/30 px-6 gap-6 overflow-x-auto scrollbar-hide">
              {[
                { id: 'personal', label: 'Dados Pessoais', icon: <User size={14}/> },
                { id: 'docs', label: 'Documentação Digital', icon: <FileCheck size={14}/> },
                { id: 'contract', label: 'Contrato e Jornada', icon: <FileText size={14}/> },
                { id: 'bank', label: 'Domicílio Bancário', icon: <Landmark size={14}/> },
                { id: 'benefits', label: 'Pacote de Benefícios', icon: <HeartPulse size={14}/> },
                { id: 'payroll', label: 'Lançamentos da Folha', icon: <Calculator size={14}/> },
                { id: 'costs', label: 'Custo Institucional', icon: <PieChart size={14}/> },
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 py-3 px-1 text-[10px] font-black uppercase tracking-tight transition-all relative whitespace-nowrap ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
                  {tab.icon} {tab.label}
                  {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 shadow-sm" />}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {activeTab === 'personal' && (
                <div className="grid grid-cols-3 gap-6 animate-in slide-in-from-right-4">
                  <div className="col-span-2 grid grid-cols-2 gap-4">
                    <div className="col-span-2"><label className="text-[10px] font-black uppercase mb-1 block text-slate-400">Nome Completo do Colaborador</label><input className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-xs focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.employeeName} onChange={e => setFormData({...formData, employeeName: e.target.value})} /></div>
                    <div><label className="text-[10px] font-black uppercase mb-1 block text-slate-400">CPF</label><input className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-xs" value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} /></div>
                    <div><label className="text-[10px] font-black uppercase mb-1 block text-slate-400">Data de Nascimento</label><input type="date" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-xs" value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} /></div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex flex-col items-center justify-center text-center gap-3">
                    <div className="p-4 bg-white rounded-[1.5rem] shadow-sm text-indigo-600"><User size={40}/></div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fotografia Identitária</p>
                  </div>
                </div>
              )}

              {activeTab === 'bank' && (
                <div className="grid grid-cols-2 gap-6 animate-in slide-in-from-right-4">
                  <div className="space-y-4">
                    <h4 className="text-[11px] font-black text-indigo-600 uppercase border-b pb-1">Instituição Financeira</h4>
                    <div><label className="text-[10px] font-black uppercase mb-1 block text-slate-400">Nome do Banco</label><input className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-xs" value={formData.banco} onChange={e => setFormData({...formData, banco: e.target.value})} /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="text-[10px] font-black uppercase mb-1 block text-slate-400">Agência</label><input className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-xs" value={formData.agencia} onChange={e => setFormData({...formData, agencia: e.target.value})} /></div>
                      <div><label className="text-[10px] font-black uppercase mb-1 block text-slate-400">Conta Número</label><input className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-xs" value={formData.conta} onChange={e => setFormData({...formData, conta: e.target.value})} /></div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[11px] font-black text-emerald-600 uppercase border-b pb-1">Pagamentos Digitais</h4>
                    <div><label className="text-[10px] font-black uppercase mb-1 block text-slate-400">Chave PIX (Preferencial)</label><input className="w-full px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-2xl font-black text-xs text-emerald-700" value={formData.chave_pix} onChange={e => setFormData({...formData, chave_pix: e.target.value})} /></div>
                  </div>
                </div>
              )}

              {activeTab === 'payroll' && (
                <div className="grid grid-cols-2 gap-10 animate-in slide-in-from-right-4">
                  <div className="space-y-4">
                    <h4 className="text-[11px] font-black text-emerald-600 uppercase border-b pb-1 flex items-center gap-2"><ArrowUpRight size={14}/> Proventos e Vencimentos</h4>
                    <div className="bg-emerald-50/30 p-6 rounded-[2rem] border border-emerald-100 space-y-4">
                      <div><label className="text-[10px] font-black uppercase mb-1 block text-emerald-600">Salário Base CLT</label><input type="number" className="w-full px-4 py-2 bg-white border border-emerald-100 rounded-xl font-black text-xs text-emerald-700" value={formData.salario_base} onChange={e => setFormData({...formData, salario_base: Number(e.target.value)})} /></div>
                      <div><label className="text-[10px] font-black uppercase mb-1 block text-emerald-600">Gratificações / Prêmios</label><input type="number" className="w-full px-4 py-2 bg-white border border-emerald-100 rounded-xl font-bold text-xs" value={formData.gratificacoes} onChange={e => setFormData({...formData, gratificacoes: Number(e.target.value)})} /></div>
                      <div><label className="text-[10px] font-black uppercase mb-1 block text-emerald-600">Horas Extras 50% (Qtd)</label><input type="number" className="w-full px-4 py-2 bg-white border border-emerald-100 rounded-xl font-bold text-xs" value={formData.he50_qtd} onChange={e => setFormData({...formData, he50_qtd: Number(e.target.value)})} /></div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[11px] font-black text-rose-600 uppercase border-b pb-1 flex items-center gap-2"><ArrowDownRight size={14}/> Deduções e Retenções</h4>
                    <div className="bg-rose-50/30 p-6 rounded-[2rem] border border-rose-100 space-y-4">
                      <div><label className="text-[10px] font-black uppercase mb-1 block text-rose-600">INSS Retido (Tabela Progressiva)</label><input type="number" className="w-full px-4 py-2 bg-white border border-rose-100 rounded-xl font-black text-xs text-rose-700" value={formData.inss} onChange={e => setFormData({...formData, inss: Number(e.target.value)})} /></div>
                      <div><label className="text-[10px] font-black uppercase mb-1 block text-rose-600">IRRF (Base Cálculo)</label><input type="number" className="w-full px-4 py-2 bg-white border border-rose-100 rounded-xl font-bold text-xs" value={formData.irrf} onChange={e => setFormData({...formData, irrf: Number(e.target.value)})} /></div>
                      <div className="p-4 bg-white/50 rounded-xl border border-rose-100 border-dashed flex items-center justify-between">
                        <span className="text-[9px] font-black text-rose-400 uppercase">Salário Líquido Final</span>
                        <span className="text-sm font-black text-slate-900">R$ {totals.liquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {['docs', 'contract', 'benefits', 'costs'].includes(activeTab) && (
                 <div className="py-20 flex flex-col items-center justify-center text-slate-300 gap-4 animate-in fade-in">
                   <div className="p-6 bg-slate-50 rounded-full border border-slate-100 shadow-inner"><ShieldCheck size={48} className="opacity-20 text-indigo-600"/></div>
                   <div className="text-center">
                      <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Módulo eSocial Cloud</p>
                      <p className="text-[10px] font-bold text-slate-300 uppercase mt-2">Pronto para receber dados massivos de integração institucional.</p>
                   </div>
                   <div className="flex gap-2">
                      <div className="px-3 py-1 bg-indigo-50 text-indigo-400 text-[8px] font-black rounded-full uppercase">S-1200</div>
                      <div className="px-3 py-1 bg-indigo-50 text-indigo-400 text-[8px] font-black rounded-full uppercase">S-2200</div>
                   </div>
                 </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t flex gap-3 shadow-inner">
              <button onClick={closeModal} className="flex-1 py-2.5 font-bold uppercase text-[11px] bg-white border border-slate-200 rounded-2xl hover:bg-slate-100 transition-all">Descartar Alterações</button>
              <button onClick={handleSave} className="flex-2 py-2.5 font-black uppercase text-[11px] bg-indigo-600 text-white rounded-2xl shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"><Save size={16}/> Sincronizar com Cloud v5.0</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
