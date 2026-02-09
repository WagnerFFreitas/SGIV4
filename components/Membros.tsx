
import React, { useState, useMemo } from 'react';
import { 
  Search, Edit2, X, User, Plus, Printer, QrCode, Square, CheckSquare, 
  Loader2, Save, Trash2, Camera, Heart, Baby, Flame, Award, Map, AlertCircle, DollarSign, Star, Users, TrendingUp, Download
} from 'lucide-react';
import { Member, Transaction, FinancialAccount } from '../types';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

type MemberTab = 'pessoais' | 'familia' | 'vida_crista' | 'ministerios' | 'endereco' | 'financeiro' | 'observacoes';

interface MembrosProps {
  members: Member[];
  currentUnitId: string;
  setMembers: (newList: Member[]) => void;
  setTransactions: (newList: Transaction[]) => void;
  accounts: FinancialAccount[];
  setAccounts: (newList: FinancialAccount[]) => void;
}

const CarteiraMembro: React.FC<{ member: Member, id?: string }> = ({ member, id }) => (
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
          <div><p className="text-[4px] font-black text-slate-400 uppercase mb-0.5">CPF</p><p className="text-[8px] font-bold text-slate-900">{member.cpf || '---'}</p></div>
          <div><p className="text-[4px] font-black text-slate-400 uppercase mb-0.5">Data Nasc.</p><p className="text-[8px] font-bold text-slate-900">{member.birthDate}</p></div>
          <div><p className="text-[4px] font-black text-slate-400 uppercase mb-0.5">Data Batismo</p><p className="text-[8px] font-bold text-slate-900">{member.baptismDate || '---'}</p></div>
          <div><p className="text-[4px] font-black text-slate-400 uppercase mb-0.5">Validade</p><p className="text-[8px] font-black text-rose-600">31/12/2025</p></div>
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

export const Membros: React.FC<MembrosProps> = ({ members, currentUnitId, setMembers, setTransactions, accounts, setAccounts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIDCardOpen, setIsIDCardOpen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [activeTab, setActiveTab] = useState<MemberTab>('pessoais');
  const [isSearchingCEP, setIsSearchingCEP] = useState(false);

  const stats = useMemo(() => ({
    active: members.filter(m => m.status === 'ACTIVE').length,
    leaders: members.filter(m => m.role === 'LEADER').length,
    visitors: members.filter(m => m.role === 'VISITOR').length,
    total: members.length
  }), [members]);

  const [formData, setFormData] = useState<Partial<Member>>({
    name: '', cpf: '', rg: '', email: '', phone: '', status: 'ACTIVE', role: 'MEMBER', gender: 'M',
    address: { zipCode: '', street: '', number: '', neighborhood: '', city: '', state: '' },
    unitId: currentUnitId, contributions: [], otherMinistries: []
  });

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (m.cpf && m.cpf.includes(searchTerm))
  );

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

  const handleSave = () => {
    if (!formData.name) return alert("O nome é obrigatório.");
    const memberData = { 
      ...formData, 
      id: editingMember?.id || Math.random().toString(36).substr(2, 9), 
      avatar: formData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'M')}` 
    } as Member;
    
    if (editingMember) setMembers(members.map(m => m.id === editingMember.id ? memberData : m));
    else setMembers([memberData, ...members]);
    
    setIsModalOpen(false);
    setEditingMember(null);
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const selectedMembers = members.filter(m => selectedMemberIds.includes(m.id));
      const cardHeight = 53.98;
      const cardWidth = 171.2;
      let currentY = 15;

      for (let i = 0; i < selectedMembers.length; i++) {
        if (currentY + cardHeight > 280) {
          pdf.addPage();
          currentY = 15;
        }
        const el = document.getElementById(`card-to-print-${selectedMembers[i].id}`);
        if (el) {
          const canvas = await html2canvas(el, { scale: 3, useCORS: true });
          const imgData = canvas.toDataURL('image/png');
          pdf.addImage(imgData, 'PNG', 19, currentY, cardWidth, cardHeight);
          currentY += cardHeight + 8;
        }
      }
      pdf.save(`Lote_Carteirinhas_${new Date().getTime()}.pdf`);
    } catch (e) { console.error(e); } finally { setIsGeneratingPDF(false); }
  };

  return (
    <div className="space-y-4 pb-16">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight italic font-serif">Gestão de Membresia</h1>
          <p className="text-slate-400 font-medium text-[10px] uppercase tracking-widest mt-1">Prontuário Ministerial ADJPA Cloud</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => selectedMemberIds.length > 0 && setIsIDCardOpen(true)} 
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-bold text-[10px] uppercase shadow-md transition-all ${selectedMemberIds.length > 0 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
          >
            <Printer size={14} /> Imprimir ({selectedMemberIds.length})
          </button>
          <button onClick={() => { setEditingMember(null); setFormData({name: '', unitId: currentUnitId, address: {zipCode:'', street:'', number:'', neighborhood:'', city:'', state:''}}); setIsModalOpen(true); }} className="flex items-center gap-1.5 px-5 py-1.5 bg-slate-900 text-white rounded-lg font-bold text-[10px] uppercase shadow-md hover:bg-slate-800 transition-all"><Plus size={14} /> Novo Cadastro</button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[{l: 'Ativos', v: stats.active, i: <User/>, c: 'indigo'}, {l: 'Liderança', v: stats.leaders, i: <Star/>, c: 'amber'}, {l: 'Visitantes', v: stats.visitors, i: <TrendingUp/>, c: 'blue'}, {l: 'Total Base', v: stats.total, i: <Users/>, c: 'slate'}].map((s, i) => (
          <div key={i} className="bg-white p-3 rounded-xl border border-slate-100 flex items-center gap-3 shadow-sm hover:shadow-md transition-all">
            <div className={`p-2 rounded-lg bg-${s.c}-50 text-${s.c}-600`}>
              {React.cloneElement(s.i as React.ReactElement<{ size?: number }>, { size: 16 })}
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase leading-none tracking-widest">{s.l}</p>
              <p className="text-lg font-black text-slate-900 mt-0.5">{s.v}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-1.5 rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col sm:flex-row gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2 text-slate-400" size={14} />
          <input type="text" placeholder="Pesquisar por nome ou CPF..." className="w-full pl-8 pr-4 py-1.5 bg-transparent outline-none text-[12px] font-medium" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/30 text-[10px] text-slate-400 font-black uppercase tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-4 py-3 w-10 text-center"><div onClick={() => setSelectedMemberIds(selectedMemberIds.length === filteredMembers.length ? [] : filteredMembers.map(m => m.id))} className="cursor-pointer mx-auto">{selectedMemberIds.length === filteredMembers.length && filteredMembers.length > 0 ? <CheckSquare size={16} className="text-indigo-600"/> : <Square size={16} className="text-slate-300"/>}</div></th>
              <th className="px-3 py-3">Identificação</th>
              <th className="px-6 py-3">Cargo / Ministério</th>
              <th className="px-6 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-[11px]">
            {filteredMembers.map((member) => (
              <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-2.5 text-center"><div onClick={() => setSelectedMemberIds(p => p.includes(member.id) ? p.filter(id => id !== member.id) : [...p, member.id])} className="cursor-pointer mx-auto">{selectedMemberIds.includes(member.id) ? <CheckSquare size={16} className="text-indigo-600"/> : <Square size={16} className="text-slate-300"/>}</div></td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-3">
                    <img src={member.avatar} className="w-8 h-8 rounded-lg object-cover border border-slate-100 shadow-sm" alt="" />
                    <div><p className="font-bold text-slate-900 leading-none">{member.name}</p><p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">CPF: {member.cpf || '---'}</p></div>
                  </div>
                </td>
                <td className="px-6 py-2.5 font-bold text-slate-700">{member.ecclesiasticalPosition || 'Membro'}</td>
                <td className="px-6 py-2.5 text-right flex justify-end gap-2 text-slate-400">
                   <button onClick={() => { setEditingMember(member); setSelectedMemberIds([member.id]); setIsIDCardOpen(true); }}><QrCode size={15} /></button>
                   <button onClick={() => { setEditingMember(member); setFormData(member); setIsModalOpen(true); }}><Edit2 size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-5xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b bg-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md"><User size={18}/></div>
                <h2 className="text-sm font-black uppercase tracking-tight">{editingMember ? 'Editar' : 'Novo'} Registro Ministerial</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-all"><X size={20}/></button>
            </div>

            <div className="flex border-b bg-slate-50/30 px-6 gap-6 overflow-x-auto scrollbar-hide">
              {[
                { id: 'pessoais', label: 'Dados Pessoais', icon: <User size={14}/> },
                { id: 'endereco', label: 'Endereço', icon: <Map size={14}/> },
                { id: 'vida_crista', label: 'Vida Cristã', icon: <Flame size={14}/> },
                { id: 'ministerios', label: 'Ministério', icon: <Award size={14}/> },
                { id: 'financeiro', label: 'Financeiro', icon: <DollarSign size={14}/> },
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as MemberTab)} className={`flex items-center gap-2 py-3 px-1 text-[10px] font-black uppercase tracking-tight transition-all relative whitespace-nowrap ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
                  {tab.icon} {tab.label}
                  {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full shadow-sm" />}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
              {activeTab === 'pessoais' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div><label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Nome Completo</label><input className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                   <div><label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">CPF</label><input className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm" value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} /></div>
                </div>
              )}
              {activeTab === 'endereco' && (
                <div className="grid grid-cols-2 gap-4">
                   <div className="col-span-2 relative">
                      <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">CEP (Sincronização Online)</label>
                      <input className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm" value={formData.address?.zipCode} onChange={e => {
                        setFormData({...formData, address: {...formData.address!, zipCode: e.target.value}});
                        if(e.target.value.replace(/\D/g,'').length === 8) handleCEPLookup(e.target.value);
                      }} />
                      {isSearchingCEP && <Loader2 size={16} className="absolute right-3 top-8 animate-spin text-indigo-500"/>}
                   </div>
                   <div className="col-span-2"><label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Logradouro</label><input className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm" value={formData.address?.street} /></div>
                </div>
              )}
            </div>

            <div className="p-4 border-t bg-slate-50 flex gap-3">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 font-bold text-[11px] uppercase bg-white border border-slate-200 rounded-xl">Cancelar</button>
              <button onClick={handleSave} className="flex-2 py-2.5 font-black text-[11px] uppercase bg-indigo-600 text-white rounded-xl shadow-lg flex items-center justify-center gap-2"><Save size={16}/> Sincronizar Prontuário</button>
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
                    <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">Prévia de Credenciais CR80</h3>
                 </div>
                 <button onClick={() => setIsIDCardOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-all"><X size={20}/></button>
              </div>
              <div className="flex-1 overflow-y-auto p-12 bg-slate-50 flex flex-col items-center gap-4 custom-scrollbar" id="printable-area">
                {members.filter(m => selectedMemberIds.includes(m.id)).map(m => (
                   <CarteiraMembro key={m.id} member={m} id={`card-to-print-${m.id}`} />
                ))}
              </div>
              <div className="p-6 border-t flex gap-4 bg-white rounded-b-[2.5rem] shadow-inner">
                <button 
                  onClick={handleDownloadPDF} 
                  disabled={isGeneratingPDF} 
                  className="flex-1 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase text-xs flex items-center justify-center gap-2 shadow-xl"
                >
                  {isGeneratingPDF ? <Loader2 size={18} className="animate-spin"/> : <Download size={18}/>}
                  {isGeneratingPDF ? 'Renderizando PDF...' : `Gerar Lote de Impressão (${selectedMemberIds.length})`}
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
