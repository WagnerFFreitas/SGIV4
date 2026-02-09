
import React, { useState, useMemo } from 'react';
import { 
  Search, Edit2, X, MapPin, Sparkles, Heart, ChevronRight, User, BookOpen, Layers, 
  DollarSign, Briefcase, Camera, Check, Calendar, Plus, Trash, Download, QrCode, 
  Users, TrendingUp, UserCheck, Baby, Printer, Mail, Phone, Star, Square, 
  CheckSquare, Loader2, Award, Flame, Zap, Droplets, Map, Building, AlertCircle,
  Info, Trash2, Save
} from 'lucide-react';
import { Member, MemberContribution, Transaction, FinancialAccount, Dependent } from '../types';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

type MemberTab = 'pessoais' | 'familia' | 'vida_crista' | 'ministerios' | 'endereco' | 'financeiro' | 'observacoes';

interface MembersProps {
  members: Member[];
  currentUnitId: string;
  setMembers: (newList: Member[]) => void;
  setTransactions: (newList: Transaction[]) => void;
  accounts: FinancialAccount[];
  setAccounts: (newList: FinancialAccount[]) => void;
}

const MemberIDCard: React.FC<{ member: Member, id?: string }> = ({ member, id }) => (
  <div id={id} className="flex flex-row items-start justify-center gap-0 print:mb-0 mb-6 no-break bg-white shadow-sm rounded-xl overflow-hidden border border-slate-200" style={{ pageBreakInside: 'avoid', breakInside: 'avoid', width: '171.2mm', minWidth: '171.2mm', height: '53.98mm' }}>
    {/* Frente - CR80 (85.6mm) - Estilo Dark */}
    <div className="w-[85.6mm] h-[53.98mm] bg-[#0c0e2a] relative overflow-hidden flex flex-col p-4 text-white shrink-0">
      <div className="flex justify-between items-start w-full mb-3">
        <div className="flex items-center gap-2">
          <div className="bg-white p-1 rounded-md">
            <img src="https://i.ibb.co/3yk0Q9k/logo-church.png" className="w-6 h-6 object-contain" alt="Logo" />
          </div>
          <div className="text-left leading-none">
            <p className="text-[10px] font-black uppercase tracking-tight">ADJPA</p>
            <p className="text-[5px] font-bold text-indigo-400 uppercase tracking-tighter">Assembleia de Deus</p>
          </div>
        </div>
        <div className="bg-[#4d4fdf] px-2 py-0.5 rounded-full">
           <span className="text-[6px] font-black text-white uppercase tracking-widest">MEMBRO</span>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-1">
        <div className="w-18 h-20 rounded-lg bg-[#1e2238] border border-white/10 overflow-hidden shrink-0 shadow-lg">
          <img 
            src={member.avatar} 
            className="w-full h-full object-cover" 
            crossOrigin="anonymous" 
            onError={(e) => (e.currentTarget.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(member.name))} 
          />
        </div>
        <div className="flex-1 flex flex-col justify-center">
           <h4 className="text-[12px] font-black uppercase leading-tight mb-0.5 text-white tracking-tight">{member.name}</h4>
           <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-3">MEMBRO ATIVO</p>
           
           <div className="space-y-0.5">
              <p className="text-[4px] font-black text-slate-400 uppercase tracking-widest">Congregação</p>
              <p className="text-[7px] font-bold text-white uppercase">SEDE MUNDIAL</p>
           </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4d4fdf] via-[#7c7ef4] to-[#4d4fdf]"></div>
    </div>
    
    {/* Verso - CR80 (85.6mm) - Estilo Clean */}
    <div className="w-[85.6mm] h-[53.98mm] bg-white relative overflow-hidden flex p-4 shrink-0">
      <div className="flex-1 flex flex-col">
        <h4 className="text-[10px] font-black text-[#0c0e2a] uppercase border-b border-slate-100 pb-1 mb-3 tracking-tighter">Credencial de Identificação</h4>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-auto">
          <div>
            <p className="text-[4px] font-black text-slate-400 uppercase mb-0.5">CPF</p>
            <p className="text-[8px] font-bold text-slate-900">{member.cpf || '123.456.789-00'}</p>
          </div>
          <div>
            <p className="text-[4px] font-black text-slate-400 uppercase mb-0.5">Data Nasc.</p>
            <p className="text-[8px] font-bold text-slate-900">{member.birthDate ? new Date(member.birthDate + 'T12:00:00').toLocaleDateString('pt-BR') : '15/05/1985'}</p>
          </div>
          <div>
            <p className="text-[4px] font-black text-slate-400 uppercase mb-0.5">Data Batismo</p>
            <p className="text-[8px] font-bold text-slate-900">{member.baptismDate ? new Date(member.baptismDate + 'T12:00:00').toLocaleDateString('pt-BR') : 'Não Informado'}</p>
          </div>
          <div>
            <p className="text-[4px] font-black text-slate-400 uppercase mb-0.5">Validade</p>
            <p className="text-[8px] font-black text-rose-600">31/12/2025</p>
          </div>
        </div>

        <div className="mt-auto border-t border-dashed border-slate-200 pt-1 text-center">
          <p className="text-[5px] text-slate-600 uppercase font-black tracking-widest leading-none">Assinatura do Pastor Presidente</p>
        </div>
      </div>

      <div className="w-16 flex flex-col items-center justify-center gap-1 border-l border-slate-50 pl-2 ml-2">
        <div className="p-1 bg-white rounded border border-slate-100 shadow-sm">
          <QrCode size={40} className="text-[#0c0e2a]"/>
        </div>
        <div className="text-center">
          <p className="text-[4px] font-black text-indigo-700 uppercase leading-none">Validação<br/>Digital</p>
        </div>
      </div>
    </div>
  </div>
);

export const Members: React.FC<MembersProps> = ({ members, currentUnitId, setMembers, setTransactions, accounts, setAccounts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIDCardOpen, setIsIDCardOpen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [activeTab, setActiveTab] = useState<MemberTab>('pessoais');
  const [isSearchingCEP, setIsSearchingCEP] = useState(false);

  const [formData, setFormData] = useState<Partial<Member>>({
    name: '', cpf: '', rg: '', email: '', phone: '', status: 'ACTIVE', role: 'MEMBER', gender: 'M',
    address: { zipCode: '', street: '', number: '', neighborhood: '', city: '', state: '' },
    unitId: currentUnitId, contributions: [], otherMinistries: []
  });

  const stats = useMemo(() => ({
    active: members.filter(m => m.status === 'ACTIVE').length,
    leaders: members.filter(m => m.role === 'LEADER').length,
    visitors: members.filter(m => m.role === 'VISITOR').length,
    total: members.length
  }), [members]);

  const filteredMembers = members.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()) || (m.cpf && m.cpf.includes(searchTerm)));

  const handleSave = () => {
    if (!formData.name) return alert("O nome é obrigatório.");
    const memberData = {
      ...formData,
      id: editingMember?.id || Math.random().toString(36).substr(2, 9),
      avatar: formData.avatar || `https://i.pravatar.cc/150?u=${Math.random()}`
    } as Member;
    
    if (editingMember) setMembers(members.map(m => m.id === editingMember.id ? memberData : m));
    else setMembers([memberData, ...members]);
    
    closeModal();
  };

  const openModal = (member?: Member) => {
    if (member) { setEditingMember(member); setFormData({ ...member }); }
    else setFormData({ name: '', status: 'ACTIVE', role: 'MEMBER', gender: 'M', address: { zipCode: '', street: '', number: '', neighborhood: '', city: '', state: '' }, unitId: currentUnitId, contributions: [], otherMinistries: [] });
    setActiveTab('pessoais'); setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); setEditingMember(null); };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const selectedMembers = members.filter(m => selectedMemberIds.includes(m.id));
      
      const cardHeight = 53.98; // mm
      const cardWidth = 171.2;  // mm (Frente + Verso lado a lado)
      const topMargin = 15;     // mm
      const pdfPageHeight = 297; // mm (A4)
      const pdfPageWidth = 210;  // mm (A4)
      const xOffset = (pdfPageWidth - cardWidth) / 2;
      
      let currentY = topMargin;

      for (let i = 0; i < selectedMembers.length; i++) {
        const member = selectedMembers[i];
        const elementId = `card-to-print-${member.id}`;
        const element = document.getElementById(elementId);
        
        if (element) {
          if (currentY + cardHeight > pdfPageHeight - 15) {
            pdf.addPage();
            currentY = topMargin;
          }

          const canvas = await html2canvas(element, { 
            scale: 3, 
            useCORS: true, 
            logging: false,
            backgroundColor: '#ffffff',
            onclone: (clonedDoc) => {
              const clonedEl = clonedDoc.getElementById(elementId);
              if (clonedEl) {
                clonedEl.style.width = '171.2mm';
                clonedEl.style.height = '53.98mm';
                clonedEl.style.display = 'flex';
                clonedEl.style.visibility = 'visible';
                clonedEl.style.position = 'static';
                clonedEl.style.margin = '0';
                clonedEl.style.padding = '0';
              }
            }
          });
          
          const imgData = canvas.toDataURL('image/png', 1.0);
          pdf.addImage(imgData, 'PNG', xOffset, currentY, cardWidth, cardHeight);
          
          currentY += cardHeight + 8;
        }
      }
      
      pdf.save(`Lote_Carteirinhas_CR80_${new Date().getTime()}.pdf`);
    } catch (e) { 
      console.error("Erro ao gerar PDF:", e); 
      alert("Houve um erro ao processar as carteirinhas.");
    } finally { 
      setIsGeneratingPDF(false); 
    }
  };

  const handleCEPLookup = async (cep: string) => {
    const clean = cep.replace(/\D/g, '');
    if (clean.length !== 8) return;
    setIsSearchingCEP(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          address: {
            ...prev.address!,
            street: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade,
            state: data.uf,
            zipCode: data.cep
          }
        }));
      }
    } catch (e) { console.error(e); } finally { setIsSearchingCEP(false); }
  };

  return (
    <div className="space-y-4 animate-in fade-in pb-16">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight">Gestão de Membresia</h1>
          <p className="text-slate-400 font-medium text-[10px] uppercase">Prontuário e Cadastro Ministerial</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => selectedMemberIds.length > 0 && setIsIDCardOpen(true)} 
            disabled={selectedMemberIds.length === 0}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-bold text-[10px] uppercase transition-all ${selectedMemberIds.length > 0 ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
          >
            <Printer size={14} /> Imprimir ({selectedMemberIds.length})
          </button>
          <button onClick={() => openModal()} className="flex items-center gap-1.5 px-5 py-1.5 bg-slate-900 text-white rounded-lg font-bold text-[10px] uppercase shadow-md hover:bg-slate-800 transition-all">
            <Plus size={14} /> Novo Cadastro
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[{l: 'Membros Ativos', v: stats.active, i: <User/>}, {l: 'Liderança', v: stats.leaders, i: <Star/>}, {l: 'Visitantes', v: stats.visitors, i: <TrendingUp/>}, {l: 'Registros Totais', v: stats.total, i: <Users/>}].map((s, i) => (
          <div key={i} className="bg-white p-3 rounded-xl border border-slate-100 flex items-center gap-3 shadow-sm hover:shadow-md transition-all">
            {/* Fix: Explicitly defining generic type for ReactElement to allow 'size' prop in cloneElement */}
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">{React.cloneElement(s.i as React.ReactElement<{ size?: number }>, {size: 16})}</div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">{s.l}</p>
              <p className="text-lg font-black text-slate-900 mt-0.5">{s.v}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-1.5 rounded-xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2 text-slate-400" size={14} />
          <input type="text" placeholder="Pesquisar por nome, CPF ou ID..." className="w-full pl-8 pr-4 py-1.5 bg-transparent outline-none text-[12px] text-slate-900 font-medium" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-slate-50/30 text-[10px] text-slate-400 font-black uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-4 py-3 w-10 text-center"><div onClick={() => setSelectedMemberIds(selectedMemberIds.length === filteredMembers.length ? [] : filteredMembers.map(m => m.id))} className="cursor-pointer mx-auto">{selectedMemberIds.length === filteredMembers.length && filteredMembers.length > 0 ? <CheckSquare size={16} className="text-indigo-600"/> : <Square size={16} className="text-slate-300"/>}</div></th>
                <th className="px-3 py-3">Identificação</th>
                <th className="px-6 py-3">Cargo / Ministério</th>
                <th className="px-6 py-3">Financeiro</th>
                <th className="px-6 py-3 eSocial">Status eSocial</th>
                <th className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-[11px]">
              {filteredMembers.map((member) => (
                <tr key={member.id} className={`hover:bg-slate-50/50 transition-all ${selectedMemberIds.includes(member.id) ? 'bg-indigo-50/20' : ''}`}>
                  <td className="px-4 py-2.5 text-center"><div onClick={() => setSelectedMemberIds(p => p.includes(member.id) ? p.filter(id => id !== member.id) : [...p, member.id])} className="cursor-pointer mx-auto">{selectedMemberIds.includes(member.id) ? <CheckSquare size={16} className="text-indigo-600"/> : <Square size={16} className="text-slate-300"/>}</div></td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-3">
                      <img src={member.avatar} className="w-8 h-8 rounded-lg object-cover border border-slate-100 shadow-sm" alt="" />
                      <div>
                        <p className="font-bold text-slate-900 leading-none mb-0.5">{member.name}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{member.phone || 'Sem contato'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-2.5">
                    <p className="font-bold text-slate-700 leading-none">{member.ecclesiasticalPosition || 'Membro'}</p>
                    <p className="text-[8px] text-indigo-600 font-black uppercase mt-0.5">{member.mainMinistry || 'GERAL'}</p>
                  </td>
                  <td className="px-6 py-2.5"><span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${member.isTithable ? 'text-emerald-700 bg-emerald-50' : 'text-slate-500 bg-slate-100'}`}>{member.isTithable ? 'Dizimista' : 'Doador'}</span></td>
                  <td className="px-6 py-2.5"><span className="px-2 py-0.5 rounded text-[9px] font-black uppercase text-emerald-700 bg-emerald-50">Sincronizado</span></td>
                  <td className="px-6 py-2.5 text-right">
                    <div className="flex justify-end gap-2 text-slate-400">
                      <button onClick={() => { setEditingMember(member); setIsIDCardOpen(true); }} className="hover:text-indigo-600 transition-colors"><QrCode size={15} /></button>
                      <button onClick={() => openModal(member)} className="hover:text-indigo-600 transition-colors"><Edit2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-5xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 bg-white border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md"><User size={20}/></div>
                <div>
                   <h2 className="text-sm font-black text-slate-900 uppercase">{editingMember ? 'Editar Prontuário Ministerial' : 'Novo Registro Eclesiástico'}</h2>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">PostgreSQL Cloud Sinc • ADJPA v5.0</p>
                </div>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-all"><X size={20}/></button>
            </div>

            <div className="flex border-b border-slate-50 bg-slate-50/30 px-6 gap-6 overflow-x-auto scrollbar-hide">
              {[
                { id: 'pessoais', label: 'Dados Pessoais', icon: <User size={14}/> },
                { id: 'familia', label: 'Núcleo Familiar', icon: <Heart size={14}/> },
                { id: 'vida_crista', label: 'Vida Cristã', icon: <Flame size={14}/> },
                { id: 'ministerios', label: 'Cargos e Ministérios', icon: <Award size={14}/> },
                { id: 'endereco', label: 'Endereço Residencial', icon: <Map size={14}/> },
                { id: 'financeiro', label: 'Movimentação Financeira', icon: <DollarSign size={14}/> },
                { id: 'observacoes', label: 'Observações Fiscais', icon: <AlertCircle size={14}/> },
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as MemberTab)} className={`flex items-center gap-2 py-3 px-1 text-[10px] font-black uppercase tracking-tight transition-all relative whitespace-nowrap ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
                  {tab.icon} {tab.label}
                  {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full shadow-sm" />}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
              {activeTab === 'pessoais' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-right-4">
                  <div className="col-span-3 md:col-span-1 flex flex-col items-center gap-4 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-inner">
                    <div className="w-32 h-32 rounded-[2.5rem] bg-white border-4 border-indigo-100 shadow-xl overflow-hidden relative group transition-transform hover:scale-105">
                      <img src={formData.avatar || `https://ui-avatars.com/api/?name=${formData.name}&background=4f46e5&color=fff`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"><Camera size={24}/></div>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Alterar Fotografia</p>
                      <p className="text-[8px] text-slate-400 uppercase mt-1">Máximo 2MB • PNG/JPG</p>
                    </div>
                  </div>
                  <div className="col-span-3 md:col-span-2 grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Nome Completo do Membro</label>
                      <input className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div><label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">CPF</label><input className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-xs" value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} /></div>
                    <div><label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">RG</label><input className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-xs" value={formData.rg} onChange={e => setFormData({...formData, rg: e.target.value})} /></div>
                    <div><label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Data de Nascimento</label><input type="date" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-xs" value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} /></div>
                    <div><label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Estado Civil</label><select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-xs outline-none" value={formData.maritalStatus} onChange={e => setFormData({...formData, maritalStatus: e.target.value as any})}><option value="SINGLE">Solteiro</option><option value="MARRIED">Casado</option><option value="DIVORCED">Divorciado</option><option value="WIDOWED">Viúvo</option></select></div>
                  </div>
                </div>
              )}

              {activeTab === 'endereco' && (
                <div className="grid grid-cols-4 gap-4 animate-in slide-in-from-right-4">
                   <div className="col-span-1 relative">
                      <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">CEP (Sinc Local)</label>
                      <input className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-xs outline-none focus:ring-2 focus:ring-indigo-500 transition-all" value={formData.address?.zipCode} onChange={e => {
                        setFormData({...formData, address: {...formData.address!, zipCode: e.target.value}});
                        if(e.target.value.replace(/\D/g,'').length === 8) handleCEPLookup(e.target.value);
                      }} />
                      {isSearchingCEP && <Loader2 className="absolute right-3 top-8 animate-spin text-indigo-500" size={16}/>}
                   </div>
                   <div className="col-span-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Rua / Logradouro</label>
                      <input className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-xs" value={formData.address?.street} onChange={e => setFormData({...formData, address: {...formData.address!, street: e.target.value}})} />
                   </div>
                   <div><label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Número</label><input className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-xs" value={formData.address?.number} onChange={e => setFormData({...formData, address: {...formData.address!, number: e.target.value}})} /></div>
                </div>
              )}

              {activeTab === 'ministerios' && (
                <div className="grid grid-cols-2 gap-6 animate-in slide-in-from-right-4">
                  <div className="space-y-4">
                    <h4 className="text-[11px] font-black text-indigo-600 uppercase border-b border-slate-100 pb-1">Identidade Ministerial</h4>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Cargo Eclesiástico Principal</label>
                      <input className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-xs" value={formData.ecclesiasticalPosition} onChange={e => setFormData({...formData, ecclesiasticalPosition: e.target.value})} placeholder="Ex: Diácono, Presbítero, Pastor..." />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Ministério Atuante</label>
                      <input className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-xs" value={formData.mainMinistry} onChange={e => setFormData({...formData, mainMinistry: e.target.value})} placeholder="Ex: Louvor, Infantil, Missões..." />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[11px] font-black text-indigo-600 uppercase border-b border-slate-100 pb-1">Datas e Consagração</h4>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Data de Admissão</label>
                      <input type="date" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-xs" value={formData.membershipDate} onChange={e => setFormData({...formData, membershipDate: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Dons Espirituais / Talentos</label>
                      <input className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-xs" value={formData.spiritualGifts} onChange={e => setFormData({...formData, spiritualGifts: e.target.value})} placeholder="Ex: Música, Ensino, Profecia..." />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'vida_crista' && (
                <div className="grid grid-cols-2 gap-6 animate-in slide-in-from-right-4">
                   <div className="space-y-4">
                      <h4 className="text-[11px] font-black text-indigo-600 uppercase border-b border-slate-100 pb-1">Batismos</h4>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Data do Batismo nas Águas</label>
                        <input type="date" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-xs" value={formData.baptismDate} onChange={e => setFormData({...formData, baptismDate: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Igreja do Batismo</label>
                        <input className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-xs" value={formData.baptismChurch} onChange={e => setFormData({...formData, baptismChurch: e.target.value})} />
                      </div>
                   </div>
                   <div className="space-y-4">
                      <h4 className="text-[11px] font-black text-indigo-600 uppercase border-b border-slate-100 pb-1">Experiência Espiritual</h4>
                      <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Batizado com o Espírito Santo?</label>
                         <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-xs outline-none" value={formData.holySpiritBaptism} onChange={e => setFormData({...formData, holySpiritBaptism: e.target.value as any})}><option value="SIM">Sim, Aleluia!</option><option value="NAO">Ainda não</option></select>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'familia' && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                   <div className="flex justify-between items-center">
                      <h4 className="text-[11px] font-black text-indigo-600 uppercase">Dependentes e Familiares</h4>
                      <button className="flex items-center gap-1 text-[10px] font-black text-indigo-600 uppercase hover:bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100 transition-all"><Plus size={14}/> Adicionar Familiar</button>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group">
                         <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg"><Baby size={18} className="text-slate-400"/></div>
                            <div>
                               <p className="text-xs font-bold text-slate-900">Enzo Oliveira</p>
                               <p className="text-[9px] font-bold text-slate-400 uppercase">Filho • 20/05/2018</p>
                            </div>
                         </div>
                         <button className="opacity-0 group-hover:opacity-100 text-rose-500 transition-all p-2 hover:bg-rose-50 rounded-lg"><Trash2 size={16}/></button>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'financeiro' && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                   <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                         <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Total Dízimos (Ano)</p>
                         <p className="text-lg font-black text-emerald-900">R$ 5.400,00</p>
                      </div>
                      <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                         <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-1">Média Mensal</p>
                         <p className="text-lg font-black text-indigo-900">R$ 450,00</p>
                      </div>
                      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-center justify-center">
                         <span className="px-3 py-1 bg-white border border-amber-200 rounded-full text-[9px] font-black text-amber-600 uppercase">Membro Fiel</span>
                      </div>
                   </div>
                   <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                      <table className="w-full text-left">
                         <thead className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-wider">
                            <tr><th className="px-6 py-3">Data</th><th className="px-6 py-3">Tipo</th><th className="px-6 py-3 text-right">Valor</th></tr>
                         </thead>
                         <tbody className="divide-y divide-slate-50 text-[11px]">
                            {formData.contributions?.map(c => (
                               <tr key={c.id} className="hover:bg-slate-50 transition-all"><td className="px-6 py-3">{new Date(c.date).toLocaleDateString('pt-BR')}</td><td className="px-6 py-3 font-bold">{c.type}</td><td className="px-6 py-3 text-right font-black text-emerald-600">R$ {c.value.toLocaleString('pt-BR')}</td></tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </div>
              )}

              {activeTab === 'observacoes' && (
                <div className="animate-in slide-in-from-right-4">
                   <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Anotações do Prontuário Ministerial</label>
                   <textarea className="w-full h-64 p-6 bg-slate-50 border border-slate-200 rounded-[2rem] font-medium text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none" placeholder="Histórico pastoral, observações disciplinares ou recomendações fiscais..." value={formData.observations} onChange={e => setFormData({...formData, observations: e.target.value})} />
                </div>
              )}
            </div>

            <div className="p-4 border-t bg-slate-50 flex gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              <button onClick={closeModal} className="flex-1 py-2.5 font-bold text-[11px] uppercase bg-white border border-slate-200 rounded-2xl hover:bg-slate-100 transition-all">Cancelar Operação</button>
              <button onClick={handleSave} className="flex-2 py-2.5 font-black text-[11px] uppercase bg-indigo-600 text-white rounded-2xl shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"><Save size={16}/> Sincronizar Prontuário</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Impressão Corrigido para corresponder à imagem */}
      {isIDCardOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl no-print animate-in fade-in duration-300">
           <div className="bg-white rounded-[2.5rem] w-full max-w-4xl shadow-2xl relative flex flex-col max-h-[95vh] border border-white/20">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white rounded-t-[2.5rem]">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md"><Printer size={20}/></div>
                    <div>
                      <h3 className="text-lg font-black uppercase tracking-tighter text-slate-900">Prévia de Credenciais CR80</h3>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">A4 Layout Engine • Padrão 85.6x54mm</p>
                    </div>
                 </div>
                 <button onClick={() => setIsIDCardOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400"><X size={20}/></button>
              </div>
              <div className="flex-1 overflow-y-auto p-12 bg-slate-50 flex flex-col items-center gap-2 custom-scrollbar" id="printable-area">
                {members.filter(m => selectedMemberIds.includes(m.id)).map(m => (
                   <MemberIDCard key={m.id} member={m} id={`card-to-print-${m.id}`} />
                ))}
              </div>
              <div className="p-6 border-t flex gap-4 bg-white rounded-b-[2.5rem] shadow-inner">
                <button 
                  onClick={handleDownloadPDF} 
                  disabled={isGeneratingPDF} 
                  className={`flex-1 py-4 rounded-[1.5rem] font-black uppercase text-xs flex items-center justify-center gap-2 transition-all ${isGeneratingPDF ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xl hover:scale-[1.02]'}`}
                >
                  {isGeneratingPDF ? <Loader2 size={18} className="animate-spin"/> : <Download size={18}/>}
                  {isGeneratingPDF ? 'Renderizando Lotes Digitais...' : `Gerar PDF para Gráfica (${selectedMemberIds.length} Membros)`}
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
