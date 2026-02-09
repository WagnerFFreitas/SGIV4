
/* ... conteúdo idêntico ao anterior mas exportado como Membros ... */
import React, { useState, useMemo } from 'react';
import { 
  Search, Edit2, X, User, Plus, Printer, QrCode, Square, CheckSquare, 
  Loader2, Save, Trash2, Camera, Heart, Baby, Flame, Award, Map, AlertCircle, DollarSign
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
        <div className="p-1 bg-white rounded border border-slate-100 shadow-sm"><QrCode size={40} className="text-[#0c0e2a]"/></div>
        <div className="text-center"><p className="text-[4px] font-black text-indigo-700 uppercase leading-none">Validação<br/>Digital</p></div>
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

  const [formData, setFormData] = useState<Partial<Member>>({
    name: '', cpf: '', rg: '', email: '', phone: '', status: 'ACTIVE', role: 'MEMBER', gender: 'M',
    address: { zipCode: '', street: '', number: '', neighborhood: '', city: '', state: '' },
    unitId: currentUnitId, contributions: [], otherMinistries: []
  });

  const filteredMembers = members.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSave = () => {
    if (!formData.name) return;
    const memberData = { ...formData, id: editingMember?.id || Math.random().toString(36).substr(2, 9), avatar: `https://i.pravatar.cc/150?u=${Math.random()}` } as Member;
    if (editingMember) setMembers(members.map(m => m.id === editingMember.id ? memberData : m));
    else setMembers([memberData, ...members]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4 animate-in fade-in pb-16">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight">Gestão de Membresia</h1>
          <p className="text-slate-400 font-medium text-[10px] uppercase">Prontuário e Cadastro Ministerial</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => selectedMemberIds.length > 0 && setIsIDCardOpen(true)} className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 text-white rounded-lg font-bold text-[10px] uppercase shadow-md"><Printer size={14} /> Imprimir</button>
          <button onClick={() => { setEditingMember(null); setFormData({name: '', unitId: currentUnitId}); setIsModalOpen(true); }} className="flex items-center gap-1.5 px-5 py-1.5 bg-slate-900 text-white rounded-lg font-bold text-[10px] uppercase shadow-md"><Plus size={14} /> Novo Cadastro</button>
        </div>
      </div>

      <div className="bg-white p-1.5 rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col sm:flex-row gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2 text-slate-400" size={14} />
          <input type="text" placeholder="Pesquisar..." className="w-full pl-8 pr-4 py-1.5 bg-transparent outline-none text-[12px]" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/30 text-[10px] text-slate-400 font-black uppercase tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-4 py-3"><div onClick={() => setSelectedMemberIds(selectedMemberIds.length === filteredMembers.length ? [] : filteredMembers.map(m => m.id))} className="cursor-pointer mx-auto">{selectedMemberIds.length === filteredMembers.length && filteredMembers.length > 0 ? <CheckSquare size={16} className="text-indigo-600"/> : <Square size={16} className="text-slate-300"/>}</div></th>
              <th className="px-3 py-3">Nome</th>
              <th className="px-6 py-3">Cargo</th>
              <th className="px-6 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-[11px]">
            {filteredMembers.map((member) => (
              <tr key={member.id} className="hover:bg-slate-50/50">
                <td className="px-4 py-2.5"><div onClick={() => setSelectedMemberIds(p => p.includes(member.id) ? p.filter(id => id !== member.id) : [...p, member.id])} className="cursor-pointer mx-auto">{selectedMemberIds.includes(member.id) ? <CheckSquare size={16} className="text-indigo-600"/> : <Square size={16} className="text-slate-300"/>}</div></td>
                <td className="px-3 py-2.5 font-bold text-slate-900">{member.name}</td>
                <td className="px-6 py-2.5">{member.ecclesiasticalPosition || 'Membro'}</td>
                <td className="px-6 py-2.5 text-right flex justify-end gap-2 text-slate-400">
                   <button onClick={() => { setEditingMember(member); setIsIDCardOpen(true); }}><QrCode size={15} /></button>
                   <button onClick={() => { setEditingMember(member); setFormData(member); setIsModalOpen(true); }}><Edit2 size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
           <div className="bg-white w-full max-w-4xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col">
              <div className="p-4 border-b flex justify-between items-center">
                 <h2 className="text-sm font-black uppercase">{editingMember ? 'Editar' : 'Novo'} Membro</h2>
                 <button onClick={() => setIsModalOpen(false)}><X size={20}/></button>
              </div>
              <div className="p-8 space-y-4">
                 <input className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl" placeholder="Nome Completo" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                 <button onClick={handleSave} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-black uppercase">Salvar Prontuário</button>
              </div>
           </div>
        </div>
      )}

      {isIDCardOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl">
           <div className="bg-white rounded-[2.5rem] w-full max-w-4xl shadow-2xl relative flex flex-col max-h-[90vh]">
              <div className="p-6 border-b flex justify-between items-center">
                 <h3 className="text-lg font-black uppercase">Visualização de Carteiras</h3>
                 <button onClick={() => setIsIDCardOpen(false)}><X size={20}/></button>
              </div>
              <div className="flex-1 overflow-y-auto p-12 bg-slate-50 flex flex-col items-center gap-4" id="printable-area">
                {members.filter(m => selectedMemberIds.includes(m.id)).map(m => (
                   <CarteiraMembro key={m.id} member={m} id={`card-to-print-${m.id}`} />
                ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
