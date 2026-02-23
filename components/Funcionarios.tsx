import React, { useState } from 'react';
import { 
  Briefcase, Plus, QrCode, Square, CheckSquare, Edit2, Search, Building, 
  UserCheck, Printer, X, Download, Loader2, Save, Trash2, Camera, 
  Landmark, DollarSign, MapPin, Calendar, Info, Users, ShieldCheck, 
  Heart, AlertCircle, Wand2, FileText, CreditCard, Clock, Percent,
  User, Phone, Mail, Award, Tag, History, Users2, Star, TrendingUp,
  MessageSquare, CheckCircle2, XCircle, Calculator
} from 'lucide-react';
import { Payroll, Dependent } from '../types';
import { DEFAULT_TAX_CONFIG } from '../constants';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { TemplateCrachaFuncionario } from './TemplateCrachaFuncionario';

interface FuncionariosProps {
  employees: Payroll[];
  currentUnitId: string;
  setEmployees: (newList: Payroll[]) => void;
}

type EmployeeTab = 'pessoais' | 'contrato' | 'financeiro' | 'folha' | 'beneficios' | 'documentos';

const InputField = ({ label, value, onChange, placeholder, type = "text", icon: Icon }: any) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
      {Icon && <Icon size={12} className="text-slate-300"/>} {label}
    </label>
    <input 
      type={type}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
    />
  </div>
);

const SelectField = ({ label, value, onChange, options, icon: Icon }: any) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
      {Icon && <Icon size={12} className="text-slate-300"/>} {label}
    </label>
    <select 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
    >
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

export const Funcionarios: React.FC<FuncionariosProps> = ({ employees, currentUnitId, setEmployees }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isIDCardOpen, setIsIDCardOpen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Payroll | null>(null);
  const [activeTab, setActiveTab] = useState<EmployeeTab>('pessoais');
  const [isSearchingCEP, setIsSearchingCEP] = useState(false);

  const [formData, setFormData] = useState<Partial<Payroll>>({
    employeeName: '', cpf: '', rg: '', email: '', matricula: '',
    pis: '', ctps: '', titulo_eleitor: '', reservista: '', aso_data: '',
    blood_type: 'A+', emergency_contact: '', cargo: '', funcao: '',
    departamento: '', cbo: '', data_admissao: '', birthDate: '',
    tipo_contrato: 'CLT', jornada_trabalho: '44h', regime_trabalho: 'PRESENCIAL',
    salario_base: 0, tipo_salario: 'MENSAL', status: 'ACTIVE',
    unitId: currentUnitId, month: new Date().toISOString().slice(5, 7),
    year: new Date().getFullYear().toString(),
    he50_qtd: 0, he100_qtd: 0, dsr_ativo: true, adic_noturno_qtd: 0,
    insalubridade_grau: 'NONE', periculosidade_ativo: false,
    comissoes: 0, gratificacoes: 0, premios: 0, ats_percentual: 0,
    auxilio_moradia: 0, arredondamento: 0, dependentes_qtd: 0,
    dependentes_lista: [], is_pcd: false, tipo_deficiencia: '',
    banco: '', codigo_banco: '', agencia: '', conta: '',
    tipo_conta: 'CORRENTE', titular: '', chave_pix: '',
    vt_ativo: false, vale_transporte_total: 0, va_ativo: false,
    vale_alimentacao: 0, vr_ativo: false, vale_refeicao: 0,
    ps_ativo: false, plano_saude_colaborador: 0, po_ativo: false,
    plano_saude_dependentes: 0, vale_farmacia: 0, seguro_vida: 0,
    faltas: 0, atrasos: 0, adiantamento: 0, pensao_alimenticia: 0,
    consignado: 0, outros_descontos: 0, coparticipacoes: 0,
    inss: 0, fgts_retido: 0, irrf: 0, fgts_patronal: 0,
    inss_patronal: 0, rat: 0, terceiros: 0,
    total_proventos: 0, total_descontos: 0, salario_liquido: 0,
    address: { zipCode: '', street: '', number: '', neighborhood: '', city: '', state: '' }
  });

  const filtered = employees.filter(e => 
    e.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.matricula.includes(searchTerm) ||
    e.cpf.includes(searchTerm)
  );

  const handleSave = () => {
    if (!formData.employeeName || !formData.cpf || !formData.matricula) {
      alert("Nome, CPF e Matrícula são obrigatórios.");
      return;
    }

    if (editingEmployee) {
      setEmployees(employees.map(e => e.id === editingEmployee.id ? { ...e, ...formData } as Payroll : e));
    } else {
      const newEmployee: Payroll = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
      } as Payroll;
      setEmployees([...employees, newEmployee]);
    }
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const handleEdit = (emp: Payroll) => {
    setEditingEmployee(emp);
    setFormData(emp);
    setIsModalOpen(true);
    setActiveTab('pessoais');
  };

  const handleNew = () => {
    setEditingEmployee(null);
    setFormData({
      employeeName: '', cpf: '', rg: '', email: '', matricula: '',
      pis: '', ctps: '', titulo_eleitor: '', reservista: '', aso_data: '',
      blood_type: 'A+', emergency_contact: '', cargo: '', funcao: '',
      departamento: '', cbo: '', data_admissao: '', birthDate: '',
      tipo_contrato: 'CLT', jornada_trabalho: '44h', regime_trabalho: 'PRESENCIAL',
      salario_base: 0, tipo_salario: 'MENSAL', status: 'ACTIVE',
      unitId: currentUnitId, month: new Date().toISOString().slice(5, 7),
      year: new Date().getFullYear().toString(),
      he50_qtd: 0, he100_qtd: 0, dsr_ativo: true, adic_noturno_qtd: 0,
      insalubridade_grau: 'NONE', periculosidade_ativo: false,
      comissoes: 0, gratificacoes: 0, premios: 0, ats_percentual: 0,
      auxilio_moradia: 0, arredondamento: 0, dependentes_qtd: 0,
      dependentes_lista: [], is_pcd: false, tipo_deficiencia: '',
      banco: '', codigo_banco: '', agencia: '', conta: '',
      tipo_conta: 'CORRENTE', titular: '', chave_pix: '',
      vt_ativo: false, vale_transporte_total: 0, va_ativo: false,
      vale_alimentacao: 0, vr_ativo: false, vale_refeicao: 0,
      ps_ativo: false, plano_saude_colaborador: 0, po_ativo: false,
      plano_saude_dependentes: 0, vale_farmacia: 0, seguro_vida: 0,
      faltas: 0, atrasos: 0, adiantamento: 0, pensao_alimenticia: 0,
      consignado: 0, outros_descontos: 0, coparticipacoes: 0,
      inss: 0, fgts_retido: 0, irrf: 0, fgts_patronal: 0,
      inss_patronal: 0, rat: 0, terceiros: 0,
      total_proventos: 0, total_descontos: 0, salario_liquido: 0,
      address: { zipCode: '', street: '', number: '', neighborhood: '', city: '', state: '' }
    });
    setIsModalOpen(true);
    setActiveTab('pessoais');
  };

  const searchCEP = async (cep: string) => {
    const cleanCEP = cep.replace(/\D/g, '');
    if (cleanCEP.length !== 8) return;
    setIsSearchingCEP(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          address: {
            ...prev.address!,
            street: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade,
            state: data.uf
          }
        }));
      }
    } catch (e) { console.error(e); }
    finally { setIsSearchingCEP(false); }
  };

  const calculateTaxes = (base: number) => {
    if (!base || isNaN(base)) return { inss: 0, irrf: 0, net: 0, patronal: 0, fgts: 0 };
    
    // Simple estimation based on DEFAULT_TAX_CONFIG
    let inss = 0;
    let remaining = base;
    for (const bracket of DEFAULT_TAX_CONFIG.inssBrackets) {
      const prevLimit = DEFAULT_TAX_CONFIG.inssBrackets[DEFAULT_TAX_CONFIG.inssBrackets.indexOf(bracket) - 1]?.limit || 0;
      const range = Math.min(remaining, (bracket.limit || Infinity) - prevLimit);
      if (range <= 0) break;
      inss += range * bracket.rate;
      if (bracket.limit && base <= bracket.limit) break;
    }

    const irrfBase = base - inss - (formData.dependentes_qtd || 0) * 189.59;
    let irrf = 0;
    for (const bracket of DEFAULT_TAX_CONFIG.irrfBrackets) {
      if (irrfBase > (DEFAULT_TAX_CONFIG.irrfBrackets[DEFAULT_TAX_CONFIG.irrfBrackets.indexOf(bracket) - 1]?.limit || 0)) {
        irrf = (irrfBase * bracket.rate) - bracket.deduction;
      }
    }
    irrf = Math.max(0, irrf);

    const fgts = base * DEFAULT_TAX_CONFIG.fgtsRate;
    const patronal = base * DEFAULT_TAX_CONFIG.patronalRate;
    const net = base - inss - irrf;

    return { inss, irrf, net, patronal, fgts };
  };

  const maskCPF = (v: string) => v.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4").substring(0, 14);
  const maskCEP = (v: string) => v.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, "$1-$2").substring(0, 9);

  const taxEstimates = calculateTaxes(formData.salario_base || 0);

  const getASOStatus = (date: string) => {
    if (!date) return { label: 'Não Informado', color: 'text-slate-400 bg-slate-100' };
    const asoDate = new Date(date);
    const today = new Date();
    const diffTime = asoDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { label: 'Vencido', color: 'text-rose-600 bg-rose-50' };
    if (diffDays < 30) return { label: 'Vence em breve', color: 'text-amber-600 bg-amber-50' };
    return { label: 'Válido', color: 'text-emerald-600 bg-emerald-50' };
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4', true);
      const selectedEmployees = employees.filter(e => selectedIds.includes(e.id));
      const cardHeight = 85.6;
      const cardWidth = 112.96;
      
      let yPos = 15;

      for (let i = 0; i < selectedEmployees.length; i++) {
        if (yPos + cardHeight > 280) {
          pdf.addPage();
          yPos = 15;
        }
        const el = document.getElementById(`badge-to-print-${selectedEmployees[i].id}`);
        if (el) {
          // Escala 8 para qualidade ultra-nítida (768 DPI)
          const canvas = await html2canvas(el, { 
            scale: 8, 
            useCORS: true,
            backgroundColor: '#ffffff',
            imageTimeout: 0,
            onclone: (clonedDoc) => {
              const badge = clonedDoc.getElementById(`badge-to-print-${selectedEmployees[i].id}`);
              if (badge) {
                // Fix: Access non-standard CSS properties using type assertion
                (badge.style as any).fontSmooth = 'always';
                (badge.style as any).webkitFontSmoothing = 'antialiased';
              }
            }
          });
          const imgData = canvas.toDataURL('image/png', 1.0);
          // 'NONE' para evitar artefatos de compressão em documentos oficiais
          pdf.addImage(imgData, 'PNG', 17, yPos, cardWidth, cardHeight, undefined, 'NONE');
          yPos += cardHeight + 8;
        }
      }
      pdf.save(`Lote_Crachas_HD_${new Date().getTime()}.pdf`);
    } catch (e) { 
      console.error(e); 
      alert("Erro ao gerar PDF.");
    } finally { 
      setIsGeneratingPDF(false); 
    }
  };

  const handleDirectPrint = () => {
    window.print();
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) setSelectedIds([]);
    else setSelectedIds(filtered.map(e => e.id));
  };

  return (
    <div className="space-y-5 animate-in fade-in pb-16">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight italic font-serif">Gestão de Colaboradores</h1>
          <p className="text-slate-400 font-medium text-[11px] uppercase tracking-widest mt-1">Sincronização Ativa eSocial ADJPA Cloud</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => selectedIds.length > 0 && setIsIDCardOpen(true)}
            className={`px-5 py-2 rounded-xl font-bold text-[10px] uppercase shadow-lg flex items-center gap-1.5 transition-all ${selectedIds.length > 0 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
          >
            <Printer size={14} /> Imprimir Crachás ({selectedIds.length})
          </button>
          <button 
            onClick={handleNew}
            className="px-5 py-2 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase shadow-lg flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95"
          >
            <Plus size={14} /> Admissão Digital
          </button>
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
              <th className="px-4 py-4 text-center w-10">
                <div onClick={toggleSelectAll} className="cursor-pointer mx-auto">
                  {selectedIds.length === filtered.length && filtered.length > 0 ? <CheckSquare size={16} className="text-indigo-600"/> : <Square size={16} className="text-slate-300"/>}
                </div>
              </th>
              <th className="px-3 py-4">Colaborador</th>
              <th className="px-6 py-4">Cargo / Tipo</th>
              <th className="px-6 py-4">Status eSocial</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-xs">
            {filtered.map((emp) => (
              <tr key={emp.id} className="hover:bg-slate-50/50 transition-all">
                <td className="px-4 py-3 text-center">
                  <div onClick={() => setSelectedIds(p => p.includes(emp.id) ? p.filter(id => id !== emp.id) : [...p, emp.id])} className="cursor-pointer mx-auto">
                    {selectedIds.includes(emp.id) ? <CheckSquare size={16} className="text-indigo-600"/> : <Square size={16} className="text-slate-300"/>}
                  </div>
                </td>
                <td className="px-3 py-3 font-bold text-slate-900">
                   <p>{emp.employeeName}</p>
                   <p className="text-[8px] text-slate-400 uppercase font-black tracking-tighter mt-1">MAT: {emp.matricula}</p>
                </td>
                <td className="px-6 py-3">
                   <p className="font-bold text-slate-600">{emp.cargo}</p>
                   <p className="text-[9px] text-indigo-500 font-black uppercase">{emp.tipo_contrato}</p>
                </td>
                <td className="px-6 py-3"><span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase text-emerald-700 bg-emerald-50 border border-emerald-100">Sincronizado</span></td>
                <td className="px-6 py-3 text-right text-slate-300 hover:text-indigo-600 cursor-pointer transition-colors flex justify-end gap-2">
                   <button onClick={() => { setSelectedIds([emp.id]); setIsIDCardOpen(true); }}><QrCode size={16}/></button>
                   <button onClick={() => handleEdit(emp)}><Edit2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[3rem] w-full max-w-6xl shadow-2xl relative flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white rounded-t-[3rem]">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200">
                  <Briefcase size={24}/>
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">
                    {editingEmployee ? 'Editar Colaborador' : 'Nova Admissão Digital'}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Sincronização eSocial Ativa</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleSave} className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
                  <Save size={18}/> Salvar Registro
                </button>
                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all">
                  <X size={24}/>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="flex gap-2 mb-8 bg-slate-50 p-1.5 rounded-[2rem] sticky top-0 z-10 border border-slate-100">
                {(['pessoais', 'contrato', 'financeiro', 'folha', 'beneficios', 'documentos'] as EmployeeTab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-wider transition-all ${
                      activeTab === tab 
                        ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {tab === 'pessoais' && 'Dados Pessoais'}
                    {tab === 'contrato' && 'Contrato & Cargo'}
                    {tab === 'financeiro' && 'Financeiro'}
                    {tab === 'folha' && 'Folha & Encargos'}
                    {tab === 'beneficios' && 'Benefícios'}
                    {tab === 'documentos' && 'Documentos'}
                  </button>
                ))}
              </div>

              {activeTab === 'pessoais' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-48 space-y-4">
                      <div className="aspect-square bg-slate-100 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 relative overflow-hidden group cursor-pointer">
                        {formData.avatar ? (
                          <img src={formData.avatar} className="w-full h-full object-cover" alt="Avatar" />
                        ) : (
                          <>
                            <Camera size={32} className="mb-2 group-hover:scale-110 transition-transform"/>
                            <span className="text-[10px] font-black uppercase">Foto 3x4</span>
                          </>
                        )}
                        <input 
                          type="file" 
                          className="absolute inset-0 opacity-0 cursor-pointer" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => setFormData({...formData, avatar: reader.result as string});
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </div>
                      <button className="w-full py-2 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase hover:bg-slate-200 transition-all">Remover Foto</button>
                    </div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <InputField label="Nome Completo" value={formData.employeeName} onChange={(v:any) => setFormData({...formData, employeeName: v})} placeholder="Nome completo do funcionário" icon={User} />
                      <InputField label="CPF" value={formData.cpf} onChange={(v:any) => setFormData({...formData, cpf: maskCPF(v)})} placeholder="000.000.000-00" icon={ShieldCheck} />
                      <InputField label="RG" value={formData.rg} onChange={(v:any) => setFormData({...formData, rg: v})} placeholder="00.000.000-0" icon={FileText} />
                      <InputField label="PIS" value={formData.pis} onChange={(v:any) => setFormData({...formData, pis: v})} placeholder="000.00000.00-0" icon={CreditCard} />
                      <InputField label="CTPS" value={formData.ctps} onChange={(v:any) => setFormData({...formData, ctps: v})} placeholder="00000/000" icon={FileText} />
                      <InputField label="Data de Nascimento" value={formData.birthDate} onChange={(v:any) => setFormData({...formData, birthDate: v})} type="date" icon={Calendar} />
                      <SelectField label="Tipo Sanguíneo" value={formData.blood_type} onChange={(v:any) => setFormData({...formData, blood_type: v})} options={[
                        {label: 'A+', value: 'A+'}, {label: 'A-', value: 'A-'}, {label: 'B+', value: 'B+'}, {label: 'B-', value: 'B-'},
                        {label: 'AB+', value: 'AB+'}, {label: 'AB-', value: 'AB-'}, {label: 'O+', value: 'O+'}, {label: 'O-', value: 'O-'}
                      ]} icon={Heart} />
                      <InputField label="E-mail Corporativo" value={formData.email} onChange={(v:any) => setFormData({...formData, email: v})} placeholder="email@empresa.com" icon={Mail} />
                      <InputField label="Contato de Emergência" value={formData.emergency_contact} onChange={(v:any) => setFormData({...formData, emergency_contact: v})} placeholder="Nome e Telefone" icon={Phone} />
                      <InputField label="Vínculo com Membro (ID)" value={formData.membro_id} onChange={(v:any) => setFormData({...formData, membro_id: v})} placeholder="ID do Membro (se houver)" icon={Users2} />
                    </div>
                  </div>

                  <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
                    <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2"><MapPin size={14}/> Localização & Endereço</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CEP</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            value={formData.address?.zipCode} 
                            onChange={(e) => {
                              const v = maskCEP(e.target.value);
                              setFormData({...formData, address: {...formData.address!, zipCode: v}});
                              if (v.length === 9) searchCEP(v.replace('-', ''));
                            }}
                            placeholder="00000-000"
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                          />
                          {isSearchingCEP && <Loader2 size={14} className="absolute right-4 top-3.5 animate-spin text-indigo-600"/>}
                        </div>
                      </div>
                      <div className="md:col-span-2"><InputField label="Logradouro" value={formData.address?.street} onChange={(v:any) => setFormData({...formData, address: {...formData.address!, street: v}})} placeholder="Rua, Avenida..." /></div>
                      <InputField label="Número" value={formData.address?.number} onChange={(v:any) => setFormData({...formData, address: {...formData.address!, number: v}})} placeholder="123" />
                      <InputField label="Bairro" value={formData.address?.neighborhood} onChange={(v:any) => setFormData({...formData, address: {...formData.address!, neighborhood: v}})} placeholder="Centro" />
                      <InputField label="Cidade" value={formData.address?.city} onChange={(v:any) => setFormData({...formData, address: {...formData.address!, city: v}})} placeholder="São Paulo" />
                      <InputField label="Estado" value={formData.address?.state} onChange={(v:any) => setFormData({...formData, address: {...formData.address!, state: v}})} placeholder="SP" />
                      <InputField label="Complemento" value={formData.address?.complement} onChange={(v:any) => setFormData({...formData, address: {...formData.address!, complement: v}})} placeholder="Apto, Bloco..." />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'contrato' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
                  <InputField label="Matrícula" value={formData.matricula} onChange={(v:any) => setFormData({...formData, matricula: v})} placeholder="Ex: 2024001" icon={Tag} />
                  <InputField label="Cargo" value={formData.cargo} onChange={(v:any) => setFormData({...formData, cargo: v})} placeholder="Ex: Analista" icon={Briefcase} />
                  <InputField label="Função" value={formData.funcao} onChange={(v:any) => setFormData({...formData, funcao: v})} placeholder="Ex: Desenvolvedor" icon={Star} />
                  <InputField label="Departamento" value={formData.departamento} onChange={(v:any) => setFormData({...formData, departamento: v})} placeholder="Ex: TI" icon={Building} />
                  <InputField label="CBO" value={formData.cbo} onChange={(v:any) => setFormData({...formData, cbo: v})} placeholder="Ex: 2124-05" icon={FileText} />
                  <InputField label="Data de Admissão" value={formData.data_admissao} onChange={(v:any) => setFormData({...formData, data_admissao: v})} type="date" icon={Calendar} />
                  <InputField label="Data de Demissão" value={formData.data_demissao} onChange={(v:any) => setFormData({...formData, data_demissao: v})} type="date" icon={Calendar} />
                  <SelectField label="Tipo de Contrato" value={formData.tipo_contrato} onChange={(v:any) => setFormData({...formData, tipo_contrato: v})} options={[
                    {label: 'CLT', value: 'CLT'}, {label: 'PJ', value: 'PJ'}, {label: 'Voluntário', value: 'VOLUNTARIO'}, {label: 'Temporário', value: 'TEMPORARIO'}
                  ]} icon={FileText} />
                  <InputField label="Jornada de Trabalho" value={formData.jornada_trabalho} onChange={(v:any) => setFormData({...formData, jornada_trabalho: v})} placeholder="Ex: 44h semanais" icon={Clock} />
                  <SelectField label="Regime de Trabalho" value={formData.regime_trabalho} onChange={(v:any) => setFormData({...formData, regime_trabalho: v})} options={[
                    {label: 'Presencial', value: 'PRESENCIAL'}, {label: 'Híbrido', value: 'HIBRIDO'}, {label: 'Remoto', value: 'REMOTO'}
                  ]} icon={Building} />
                  <InputField label="Sindicato" value={formData.sindicato} onChange={(v:any) => setFormData({...formData, sindicato: v})} placeholder="Nome do sindicato" icon={Users} />
                  <InputField label="Convenção Coletiva" value={formData.convencao_coletiva} onChange={(v:any) => setFormData({...formData, convencao_coletiva: v})} placeholder="Ref. da convenção" icon={FileText} />
                </div>
              )}

              {activeTab === 'financeiro' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField label="Salário Base" value={formData.salario_base} onChange={(v:any) => setFormData({...formData, salario_base: parseFloat(v)})} type="number" icon={DollarSign} />
                      <SelectField label="Tipo de Salário" value={formData.tipo_salario} onChange={(v:any) => setFormData({...formData, tipo_salario: v})} options={[
                        {label: 'Mensal', value: 'MENSAL'}, {label: 'Horista', value: 'HORISTA'}, {label: 'Comissionado', value: 'COMISSIONADO'}
                      ]} icon={DollarSign} />
                      <InputField label="Arredondamento" value={formData.arredondamento} onChange={(v:any) => setFormData({...formData, arredondamento: parseFloat(v)})} type="number" icon={TrendingUp} />
                    </div>

                    <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white space-y-6 shadow-xl shadow-indigo-100">
                      <h4 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 opacity-80"><Calculator size={14}/> Estimativa de Folha</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-white/10 pb-2">
                          <span className="text-[10px] font-bold uppercase opacity-60">INSS (Retido)</span>
                          <span className="text-sm font-black">R$ {taxEstimates.inss.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/10 pb-2">
                          <span className="text-[10px] font-bold uppercase opacity-60">IRRF (Retido)</span>
                          <span className="text-sm font-black">R$ {taxEstimates.irrf.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-[10px] font-black uppercase">Salário Líquido</span>
                          <span className="text-xl font-black">R$ {taxEstimates.net.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-white/10">
                        <p className="text-[9px] font-bold uppercase opacity-60 mb-2">Custo Total Igreja</p>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold">Encargos + Salário</span>
                          <span className="text-sm font-black">R$ {(formData.salario_base! + taxEstimates.patronal + taxEstimates.fgts).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
                    <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2"><Landmark size={14}/> Dados Bancários & PIX</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <InputField label="Banco" value={formData.banco} onChange={(v:any) => setFormData({...formData, banco: v})} placeholder="Nome do Banco" icon={Building} />
                      <InputField label="Código do Banco" value={formData.codigo_banco} onChange={(v:any) => setFormData({...formData, codigo_banco: v})} placeholder="Ex: 001" />
                      <InputField label="Agência" value={formData.agencia} onChange={(v:any) => setFormData({...formData, agencia: v})} placeholder="0000" />
                      <InputField label="Conta" value={formData.conta} onChange={(v:any) => setFormData({...formData, conta: v})} placeholder="00000-0" />
                      <SelectField label="Tipo de Conta" value={formData.tipo_conta} onChange={(v:any) => setFormData({...formData, tipo_conta: v})} options={[
                        {label: 'Corrente', value: 'CORRENTE'}, {label: 'Poupança', value: 'POUPANCA'}
                      ]} />
                      <InputField label="Titular" value={formData.titular} onChange={(v:any) => setFormData({...formData, titular: v})} placeholder="Nome do titular" />
                      <InputField label="Chave PIX" value={formData.chave_pix} onChange={(v:any) => setFormData({...formData, chave_pix: v})} placeholder="CPF, E-mail, Celular..." icon={QrCode} />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'folha' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                      <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
                        <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2"><Clock size={14}/> Horas Extras & Adicionais</h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                          <InputField label="H.E. 50% (Qtd)" value={formData.he50_qtd} onChange={(v:any) => setFormData({...formData, he50_qtd: parseFloat(v)})} type="number" icon={Clock} />
                          <InputField label="H.E. 100% (Qtd)" value={formData.he100_qtd} onChange={(v:any) => setFormData({...formData, he100_qtd: parseFloat(v)})} type="number" icon={Clock} />
                          <InputField label="Adicional Noturno (Qtd)" value={formData.adic_noturno_qtd} onChange={(v:any) => setFormData({...formData, adic_noturno_qtd: parseFloat(v)})} type="number" icon={Clock} />
                          <div className="flex items-center gap-3 pt-6">
                            <input type="checkbox" checked={formData.dsr_ativo} onChange={(e) => setFormData({...formData, dsr_ativo: e.target.checked})} className="w-5 h-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-500" />
                            <label className="text-xs font-bold text-slate-600 uppercase">DSR Ativo</label>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
                        <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2"><TrendingUp size={14}/> Variáveis & Prêmios</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <SelectField label="Grau de Insalubridade" value={formData.insalubridade_grau} onChange={(v:any) => setFormData({...formData, insalubridade_grau: v})} options={[
                            {label: 'Nenhum', value: 'NONE'}, {label: 'Mínimo (10%)', value: 'LOW'}, {label: 'Médio (20%)', value: 'MEDIUM'}, {label: 'Máximo (40%)', value: 'HIGH'}
                          ]} icon={AlertCircle} />
                          <div className="flex items-center gap-3 pt-6">
                            <input type="checkbox" checked={formData.periculosidade_ativo} onChange={(e) => setFormData({...formData, periculosidade_ativo: e.target.checked})} className="w-5 h-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-500" />
                            <label className="text-xs font-bold text-slate-600 uppercase">Periculosidade (30%)</label>
                          </div>
                          <InputField label="ATS (%)" value={formData.ats_percentual} onChange={(v:any) => setFormData({...formData, ats_percentual: parseFloat(v)})} type="number" icon={Percent} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <InputField label="Comissões" value={formData.comissoes} onChange={(v:any) => setFormData({...formData, comissoes: parseFloat(v)})} type="number" icon={DollarSign} />
                          <InputField label="Gratificações" value={formData.gratificacoes} onChange={(v:any) => setFormData({...formData, gratificacoes: parseFloat(v)})} type="number" icon={DollarSign} />
                          <InputField label="Prêmios" value={formData.premios} onChange={(v:any) => setFormData({...formData, premios: parseFloat(v)})} type="number" icon={Award} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-6 shadow-xl">
                        <h4 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 opacity-60"><ShieldCheck size={14}/> Encargos Patronais</h4>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center border-b border-white/10 pb-2">
                            <span className="text-[10px] font-bold uppercase opacity-60">INSS Patronal (20%)</span>
                            <span className="text-sm font-black">R$ {(taxEstimates.patronal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-white/10 pb-2">
                            <span className="text-[10px] font-bold uppercase opacity-60">FGTS (8%)</span>
                            <span className="text-sm font-black">R$ {taxEstimates.fgts.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                          </div>
                          <div className="pt-4">
                            <p className="text-[9px] font-bold uppercase opacity-60 mb-1">Custo Total Mensal</p>
                            <p className="text-2xl font-black text-emerald-400">R$ {(formData.salario_base! + taxEstimates.patronal + taxEstimates.fgts).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                            <p className="text-[9px] opacity-40 mt-1">* Estimativa baseada em configurações fiscais padrão.</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                        <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2"><Users2 size={14}/> Dependentes & PCD</h4>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <input type="checkbox" checked={formData.is_pcd} onChange={(e) => setFormData({...formData, is_pcd: e.target.checked})} className="w-5 h-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-500" />
                            <label className="text-xs font-bold text-slate-600 uppercase">É PCD</label>
                          </div>
                          <InputField label="Tipo de Deficiência" value={formData.tipo_deficiencia} onChange={(v:any) => setFormData({...formData, tipo_deficiencia: v})} placeholder="Se PCD, especifique" />
                          <InputField label="Qtd. Dependentes" value={formData.dependentes_qtd} onChange={(v:any) => setFormData({...formData, dependentes_qtd: parseInt(v)})} type="number" icon={Users} />
                        </div>
                      </div>
                    </div>
                  </div>

                    <div className="space-y-4 pt-4 border-t border-slate-200">
                      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lista de Dependentes</h5>
                      <div className="space-y-3">
                        {formData.dependentes_lista && formData.dependentes_lista.length > 0 ? (
                          formData.dependentes_lista.map((dep, i) => (
                            <div key={dep.id} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                              <div>
                                <p className="text-xs font-bold text-slate-800">{dep.name}</p>
                                <p className="text-[10px] text-slate-500 uppercase font-black">{dep.relationship} • {new Date(dep.birthDate).toLocaleDateString('pt-BR')}</p>
                              </div>
                              <button 
                                onClick={() => setFormData({...formData, dependentes_lista: formData.dependentes_lista?.filter((_, idx) => idx !== i)})}
                                className="text-rose-500 hover:bg-rose-50 p-2 rounded-xl transition-all"
                              >
                                <Trash2 size={16}/>
                              </button>
                            </div>
                          ))
                        ) : (
                          <p className="text-[10px] text-slate-400 italic font-medium">Nenhum dependente registrado.</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-4 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                        <div className="md:col-span-2">
                          <input id="emp-dep-name" placeholder="Nome do Dependente" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <select id="emp-dep-rel" className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500 appearance-none">
                          <option value="FILHO">Filho(a)</option>
                          <option value="CONJUGE">Cônjuge</option>
                          <option value="PAI">Pai</option>
                          <option value="MAE">Mãe</option>
                          <option value="OUTRO">Outro</option>
                        </select>
                        <input id="emp-dep-birth" type="date" className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500" />
                        <button 
                          onClick={() => {
                            const n = document.getElementById('emp-dep-name') as HTMLInputElement;
                            const r = document.getElementById('emp-dep-rel') as HTMLSelectElement;
                            const b = document.getElementById('emp-dep-birth') as HTMLInputElement;
                            if (!n.value || !b.value) return alert("Preencha nome e data de nascimento.");
                            const newDep: Dependent = {
                              id: Math.random().toString(36).substr(2, 9),
                              name: n.value,
                              relationship: r.value as any,
                              birthDate: b.value
                            };
                            setFormData({...formData, dependentes_lista: [...(formData.dependentes_lista || []), newDep]});
                            n.value = ''; b.value = '';
                          }}
                          className="md:col-span-4 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase hover:bg-slate-800 transition-all shadow-lg"
                        >
                          Adicionar Dependente à Lista
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              {activeTab === 'beneficios' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
                      <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2"><TrendingUp size={14}/> Vales & Auxílios</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100">
                          <div className="flex items-center gap-3">
                            <input type="checkbox" checked={formData.vt_ativo} onChange={(e) => setFormData({...formData, vt_ativo: e.target.checked})} className="w-4 h-4 rounded text-indigo-600" />
                            <span className="text-xs font-bold text-slate-600">Vale Transporte</span>
                          </div>
                          <input type="number" value={formData.vale_transporte_total} onChange={(e) => setFormData({...formData, vale_transporte_total: parseFloat(e.target.value)})} className="w-24 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-right" />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100">
                          <div className="flex items-center gap-3">
                            <input type="checkbox" checked={formData.va_ativo} onChange={(e) => setFormData({...formData, va_ativo: e.target.checked})} className="w-4 h-4 rounded text-indigo-600" />
                            <span className="text-xs font-bold text-slate-600">Vale Alimentação</span>
                          </div>
                          <input type="number" value={formData.vale_alimentacao} onChange={(e) => setFormData({...formData, vale_alimentacao: parseFloat(e.target.value)})} className="w-24 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-right" />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100">
                          <div className="flex items-center gap-3">
                            <input type="checkbox" checked={formData.vr_ativo} onChange={(e) => setFormData({...formData, vr_ativo: e.target.checked})} className="w-4 h-4 rounded text-indigo-600" />
                            <span className="text-xs font-bold text-slate-600">Vale Refeição</span>
                          </div>
                          <input type="number" value={formData.vale_refeicao} onChange={(e) => setFormData({...formData, vale_refeicao: parseFloat(e.target.value)})} className="w-24 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-right" />
                        </div>
                        <InputField label="Auxílio Moradia" value={formData.auxilio_moradia} onChange={(v:any) => setFormData({...formData, auxilio_moradia: parseFloat(v)})} type="number" icon={Building} />
                      </div>
                    </div>

                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
                      <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2"><Heart size={14}/> Saúde & Seguros</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100">
                          <div className="flex items-center gap-3">
                            <input type="checkbox" checked={formData.ps_ativo} onChange={(e) => setFormData({...formData, ps_ativo: e.target.checked})} className="w-4 h-4 rounded text-indigo-600" />
                            <span className="text-xs font-bold text-slate-600">Plano de Saúde</span>
                          </div>
                          <input type="number" value={formData.plano_saude_colaborador} onChange={(e) => setFormData({...formData, plano_saude_colaborador: parseFloat(e.target.value)})} className="w-24 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-right" />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100">
                          <div className="flex items-center gap-3">
                            <input type="checkbox" checked={formData.po_ativo} onChange={(e) => setFormData({...formData, po_ativo: e.target.checked})} className="w-4 h-4 rounded text-indigo-600" />
                            <span className="text-xs font-bold text-slate-600">Plano Saúde Dependentes</span>
                          </div>
                          <input type="number" value={formData.plano_saude_dependentes} onChange={(e) => setFormData({...formData, plano_saude_dependentes: parseFloat(e.target.value)})} className="w-24 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-right" />
                        </div>
                        <InputField label="Vale Farmácia" value={formData.vale_farmacia} onChange={(v:any) => setFormData({...formData, vale_farmacia: parseFloat(v)})} type="number" icon={Plus} />
                        <InputField label="Seguro de Vida" value={formData.seguro_vida} onChange={(v:any) => setFormData({...formData, seguro_vida: parseFloat(v)})} type="number" icon={ShieldCheck} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'documentos' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputField label="Título de Eleitor" value={formData.titulo_eleitor} onChange={(v:any) => setFormData({...formData, titulo_eleitor: v})} placeholder="0000 0000 0000" icon={FileText} />
                    <InputField label="Certificado de Reservista" value={formData.reservista} onChange={(v:any) => setFormData({...formData, reservista: v})} placeholder="000000000000" icon={ShieldCheck} />
                    <div className="space-y-1.5">
                      <InputField label="Data do ASO" value={formData.aso_data} onChange={(v:any) => setFormData({...formData, aso_data: v})} type="date" icon={Calendar} />
                      {formData.aso_data && (
                        <div className={`text-[9px] font-black uppercase px-3 py-1 rounded-full w-fit ${getASOStatus(formData.aso_data).color}`}>
                          Status: {getASOStatus(formData.aso_data).label}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
                    <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2"><CreditCard size={14}/> CNH (Carteira Nacional de Habilitação)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <InputField label="Número CNH" value={formData.cnh_numero} onChange={(v:any) => setFormData({...formData, cnh_numero: v})} placeholder="00000000000" />
                      <InputField label="Categoria" value={formData.cnh_categoria} onChange={(v:any) => setFormData({...formData, cnh_categoria: v})} placeholder="Ex: AB" />
                      <InputField label="Vencimento" value={formData.cnh_vencimento} onChange={(v:any) => setFormData({...formData, cnh_vencimento: v})} type="date" />
                    </div>
                  </div>

                  <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
                    <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2"><History size={14}/> Histórico de Folha (Mês Atual)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <InputField label="Faltas (Dias)" value={formData.faltas} onChange={(v:any) => setFormData({...formData, faltas: parseInt(v)})} type="number" />
                      <InputField label="Atrasos (Minutos)" value={formData.atrasos} onChange={(v:any) => setFormData({...formData, atrasos: parseInt(v)})} type="number" />
                      <InputField label="Adiantamento" value={formData.adiantamento} onChange={(v:any) => setFormData({...formData, adiantamento: parseFloat(v)})} type="number" />
                      <InputField label="Pensão Alimentícia" value={formData.pensao_alimenticia} onChange={(v:any) => setFormData({...formData, pensao_alimenticia: parseFloat(v)})} type="number" />
                      <InputField label="Consignado" value={formData.consignado} onChange={(v:any) => setFormData({...formData, consignado: parseFloat(v)})} type="number" />
                      <InputField label="Coparticipações" value={formData.coparticipacoes} onChange={(v:any) => setFormData({...formData, coparticipacoes: parseFloat(v)})} type="number" />
                      <InputField label="Outros Descontos" value={formData.outros_descontos} onChange={(v:any) => setFormData({...formData, outros_descontos: parseFloat(v)})} type="number" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isIDCardOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl no-print">
           <div className="bg-white rounded-[2.5rem] w-full max-w-4xl shadow-2xl relative flex flex-col max-h-[90vh]">
              <div className="p-6 border-b flex justify-between items-center bg-white rounded-t-[2.5rem]">
                 <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md"><Printer size={18}/></div>
                    <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">Prévia de Crachás Corporativos</h3>
                 </div>
                 <button onClick={() => setIsIDCardOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-all"><X size={20}/></button>
              </div>
              <div className="flex-1 overflow-y-auto p-12 bg-slate-50 flex flex-col items-center gap-8 custom-scrollbar" id="printable-area">
                {employees.filter(e => selectedIds.includes(e.id)).map(e => (
                   <TemplateCrachaFuncionario key={e.id} employee={e} id={`badge-to-print-${e.id}`} />
                ))}
              </div>
              <div className="p-6 border-t flex flex-col md:flex-row gap-4 bg-white rounded-b-[2.5rem] shadow-inner">
                <button 
                  onClick={handleDownloadPDF} 
                  disabled={isGeneratingPDF} 
                  className="flex-1 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase text-xs flex items-center justify-center gap-2 shadow-xl hover:bg-slate-800 transition-all"
                >
                  {isGeneratingPDF ? <Loader2 size={18} className="animate-spin"/> : <Download size={18}/>}
                  {isGeneratingPDF ? 'Renderizando Ultra HD...' : `Baixar Crachás HD (${selectedIds.length})`}
                </button>
                <button 
                  onClick={handleDirectPrint}
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase text-xs flex items-center justify-center gap-2 shadow-xl hover:bg-indigo-700 transition-all"
                >
                  <Printer size={18}/> Imprimir Crachás Agora
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};