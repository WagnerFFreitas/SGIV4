import React, { useState, useMemo } from 'react';
import { 
  Search, Edit2, X, User, Plus, Printer, QrCode, Square, CheckSquare, 
  Loader2, Save, Trash2, Camera, Heart, Baby, Flame, Award, Map, AlertCircle, 
  DollarSign, Star, Users, TrendingUp, Download, Phone, Mail, Briefcase, 
  Info, Sparkles, BookOpen, MapPin, Calendar, History, Tag, Landmark, Users2, Wand2
} from 'lucide-react';
import { Member, Transaction, FinancialAccount, MemberContribution, Dependent } from '../types';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { TemplateCarteiraMembro } from './TemplateCarteiraMembro';

type MemberTab = 'pessoais' | 'endereco' | 'vida_crista' | 'ministerios' | 'financeiro' | 'rh' | 'outros';

interface MembrosProps {
  members: Member[];
  currentUnitId: string;
  setMembers: (newList: Member[]) => void;
  setTransactions: (newList: Transaction[]) => void;
  accounts: FinancialAccount[];
  setAccounts: (newList: FinancialAccount[]) => void;
}

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
    name: '', cpf: '', rg: '', email: '', phone: '', whatsapp: '', profession: '',
    status: 'ACTIVE', role: 'MEMBER', gender: 'M', maritalStatus: 'SINGLE',
    address: { zipCode: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '' },
    unitId: currentUnitId, contributions: [], otherMinistries: [],
    holySpiritBaptism: 'NAO', discipleshipCourse: 'NAO_INICIADO', biblicalSchool: 'NAO_FREQUENTA',
    isTithable: false, isRegularGiver: false, participatesCampaigns: false,
    dependents: [], bloodType: 'A+', emergencyContact: ''
  });

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (m.cpf && m.cpf.includes(searchTerm))
  );

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const fillWithDummyData = () => {
    const maleNames = ["Gabriel Silva Santos", "Fernando Henrique Lima", "Roberto Carlos Mendes", "Anderson Silva Oliveira", "Marcos Paulo Costa"];
    const femaleNames = ["Mariana Costa Souza", "Patrícia Gomes Oliveira", "Luciana Maria Ferreira", "Cláudia Regina Diniz", "Beatriz Alcantara"];
    
    const isMale = Math.random() > 0.5;
    const randomName = isMale 
      ? maleNames[Math.floor(Math.random() * maleNames.length)] 
      : femaleNames[Math.floor(Math.random() * femaleNames.length)];

    const randomCPF = `${Math.floor(Math.random()*900+100)}.${Math.floor(Math.random()*900+100)}.${Math.floor(Math.random()*900+100)}-${Math.floor(Math.random()*90+10)}`;
    const randomRG = `${Math.floor(Math.random()*90+10)}.${Math.floor(Math.random()*900+100)}.${Math.floor(Math.random()*900+100)}-${Math.floor(Math.random()*9+1)}`;
    const randomPhone = `(11) 9${Math.floor(Math.random()*9000+1000)}-${Math.floor(Math.random()*9000+1000)}`;

    setFormData({
      ...formData,
      name: randomName,
      cpf: randomCPF,
      rg: randomRG,
      email: `${randomName.split(' ')[0].toLowerCase()}@exemplo.com.br`,
      phone: randomPhone,
      whatsapp: randomPhone,
      gender: isMale ? 'M' : 'F',
      birthDate: `${1970 + Math.floor(Math.random() * 30)}-0${1 + Math.floor(Math.random() * 8)}-${10 + Math.floor(Math.random() * 18)}`,
      fatherName: isMale ? "José de Arimateia Santos" : "Manoel Gomes Ferreira",
      motherName: isMale ? "Maria do Carmo Silva" : "Regina Célia Oliveira",
      bloodType: ["A+", "B+", "O+", "AB+", "O-", "A-"][Math.floor(Math.random() * 6)],
      emergencyContact: `(21) 9${Math.floor(Math.random()*9000+1000)}-${Math.floor(Math.random()*9000+1000)} (Esposa/Marido)`,
      address: {
        zipCode: "01001-000",
        street: "Praça da Sé",
        number: String(Math.floor(Math.random() * 1000)),
        neighborhood: "Centro",
        city: "São Paulo",
        state: "SP"
      },
      ecclesiasticalPosition: ["Membro", "Diácono", "Presbítero", "Missionária", "Obreiro"][Math.floor(Math.random() * 5)],
      mainMinistry: ["Louvor", "Infantil", "Ação Social", "Missões", "Ensino"][Math.floor(Math.random() * 5)],
      baptismDate: "2010-05-22",
      membershipDate: "2015-01-10",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(randomName)}&background=${isMale ? '003399' : 'e11d48'}&color=fff&bold=true`
    });
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

  const handleSave = () => {
    if (!formData.name) return alert("O nome é obrigatório.");
    const memberId = editingMember?.id || `M${Math.floor(Math.random()*90000+10000)}`;
    const memberData = { 
      ...formData, 
      id: memberId,
      avatar: formData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'M')}&background=003399&color=fff&bold=true` 
    } as Member;
    
    if (editingMember) setMembers(members.map(m => m.id === editingMember.id ? memberData : m));
    else setMembers([memberData, ...members]);
    
    setIsModalOpen(false);
    setEditingMember(null);
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4', true);
      const selectedMembers = members.filter(m => selectedMemberIds.includes(m.id));
      const cardHeight = 53.98;
      const cardWidth = 176.2; 
      let currentY = 15;

      for (let i = 0; i < selectedMembers.length; i++) {
        if (currentY + cardHeight > 280) {
          pdf.addPage();
          currentY = 15;
        }
        const el = document.getElementById(`card-to-print-${selectedMembers[i].id}`);
        if (el) {
          const canvas = await html2canvas(el, { 
            scale: 8, 
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            imageTimeout: 0,
            onclone: (clonedDoc) => {
              const card = clonedDoc.getElementById(`card-to-print-${selectedMembers[i].id}`);
              if (card) {
                (card.style as any).fontSmooth = 'always';
                (card.style as any).webkitFontSmoothing = 'antialiased';
              }
            }
          });
          
          const imgData = canvas.toDataURL('image/png', 1.0);
          pdf.addImage(imgData, 'PNG', 17, currentY, cardWidth, cardHeight, undefined, 'NONE');
          currentY += cardHeight + 8;
        }
      }
      pdf.save(`Lote_Carteirinhas_UltraHD_${new Date().getTime()}.pdf`);
    } catch (e) { 
      console.error("Erro ao gerar PDF:", e);
      alert("Houve um erro ao gerar o PDF. Tente imprimir direto.");
    } finally { 
      setIsGeneratingPDF(false); 
    }
  };

  const handleDirectPrint = () => { window.print(); };

  const InputField = ({ label, value, onChange, placeholder = "", type = "text", className = "" }: any) => (
    <div className={className}>
      <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block tracking-wider">{label}</label>
      <input 
        type={type}
        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
        value={value || ''} 
        onChange={e => onChange(e.target.value)} 
        placeholder={placeholder}
      />
    </div>
  );

  const SelectField = ({ label, value, onChange, options, className = "" }: any) => (
    <div className={className}>
      <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block tracking-wider">{label}</label>
      <select 
        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );

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
          <button onClick={() => { 
            setEditingMember(null); 
            setFormData({
              name: '', unitId: currentUnitId, status: 'ACTIVE', role: 'MEMBER',
              address: {zipCode:'', street:'', number:'', complement: '', neighborhood:'', city:'', state:''},
              isTithable: false, isRegularGiver: false, participatesCampaigns: false, contributions: [], otherMinistries: [], dependents: [], bloodType: 'A+', emergencyContact: ''
            }); 
            setIsModalOpen(true); 
          }} className="flex items-center gap-1.5 px-5 py-1.5 bg-slate-900 text-white rounded-lg font-bold text-[10px] uppercase shadow-md hover:bg-slate-800 transition-all">
            <Plus size={14} /> Novo Cadastro
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/30 text-[10px] text-slate-400 font-black uppercase tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-4 py-3 w-10 text-center">
                <div onClick={() => setSelectedMemberIds(selectedMemberIds.length === filteredMembers.length ? [] : filteredMembers.map(m => m.id))} className="cursor-pointer mx-auto">
                  {selectedMemberIds.length === filteredMembers.length && filteredMembers.length > 0 ? <CheckSquare size={16} className="text-indigo-600"/> : <Square size={16} className="text-slate-300"/>}
                </div>
              </th>
              <th className="px-3 py-3">Membro</th>
              <th className="px-6 py-3">Cargo / CPF</th>
              <th className="px-6 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-[11px]">
            {filteredMembers.map((member) => (
              <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-2.5 text-center">
                  <div onClick={() => setSelectedMemberIds(p => p.includes(member.id) ? p.filter(id => id !== member.id) : [...p, member.id])} className="cursor-pointer mx-auto">
                    {/* Fixed Error: Changed selectedIds to selectedMemberIds */}
                    {selectedMemberIds.includes(member.id) ? <CheckSquare size={16} className="text-indigo-600"/> : <Square size={16} className="text-slate-300"/>}
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-3">
                    <img src={member.avatar} className="w-8 h-8 rounded-lg object-cover border border-slate-100" alt="" />
                    <div><p className="font-bold text-slate-900 leading-none">{member.name}</p><p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">Matrícula: {member.id}</p></div>
                  </div>
                </td>
                <td className="px-6 py-2.5">
                  <p className="font-bold text-slate-700">{member.ecclesiasticalPosition || 'Membro'}</p>
                  <p className="text-[9px] text-slate-400 uppercase">{member.cpf || '---'}</p>
                </td>
                <td className="px-6 py-2.5 text-right flex justify-end gap-3 text-slate-400">
                   <button onClick={() => { setEditingMember(member); setSelectedMemberIds([member.id]); setIsIDCardOpen(true); }}><QrCode size={16} /></button>
                   <button onClick={() => { setEditingMember(member); setFormData(member); setIsModalOpen(true); }}><Edit2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-5xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col h-full max-h-[95vh]">
            <div className="p-4 border-b flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md"><User size={18}/></div>
                <div>
                  <h2 className="text-sm font-black uppercase tracking-tight">{editingMember ? 'Editar' : 'Novo'} Registro</h2>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={fillWithDummyData} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-xl font-black text-[9px] uppercase hover:bg-amber-100 transition-all border border-amber-200">
                  <Wand2 size={12}/> Preencher Teste
                </button>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20}/></button>
              </div>
            </div>

            <div className="flex border-b bg-slate-50/30 px-6 gap-6 overflow-x-auto scrollbar-hide shrink-0">
              {[
                { id: 'pessoais', label: 'Dados Pessoais', icon: <User size={14}/> },
                { id: 'endereco', label: 'Endereço', icon: <Map size={14}/> },
                { id: 'vida_crista', label: 'Vida Cristã', icon: <Flame size={14}/> },
                { id: 'ministerios', label: 'Ministérios', icon: <Award size={14}/> },
                { id: 'financeiro', label: 'Financeiro', icon: <DollarSign size={14}/> },
                { id: 'rh', label: 'Gestão de RH', icon: <Briefcase size={14}/> },
                { id: 'outros', label: 'Observações', icon: <Info size={14}/> },
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as MemberTab)} className={`flex items-center gap-2 py-3 px-1 text-[10px] font-black uppercase tracking-tight transition-all relative whitespace-nowrap ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
                  {tab.icon} {tab.label}
                  {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full" />}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6 bg-white">
              {activeTab === 'pessoais' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-3xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                        <img src={formData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'M')}&background=003399&color=fff&bold=true`} className="w-full h-full object-cover" />
                      </div>
                      <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-3xl">
                        <Camera className="text-white mb-1" size={24} />
                        <span className="text-[8px] text-white font-black uppercase tracking-tighter">Trocar Foto</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                      </label>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-4">
                       <InputField label="Nome Completo" value={formData.name} onChange={(v:any) => setFormData({...formData, name: v})} className="col-span-2" />
                       <InputField label="CPF" value={formData.cpf} onChange={(v:any) => setFormData({...formData, cpf: v})} />
                       <InputField label="RG" value={formData.rg} onChange={(v:any) => setFormData({...formData, rg: v})} />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputField label="E-mail" value={formData.email} onChange={(v:any) => setFormData({...formData, email: v})} />
                    <InputField label="Telefone" value={formData.phone} onChange={(v:any) => setFormData({...formData, phone: v})} />
                    <InputField label="WhatsApp" value={formData.whatsapp} onChange={(v:any) => setFormData({...formData, whatsapp: v})} />
                    <InputField label="Nascimento" type="date" value={formData.birthDate} onChange={(v:any) => setFormData({...formData, birthDate: v})} />
                    <SelectField label="Gênero" value={formData.gender} onChange={(v:any) => setFormData({...formData, gender: v})} options={[{value:'M', label:'Masculino'}, {value:'F', label:'Feminino'}]} />
                    <SelectField label="Estado Civil" value={formData.maritalStatus} onChange={(v:any) => setFormData({...formData, maritalStatus: v})} options={[{value:'SINGLE', label:'Solteiro(a)'}, {value:'MARRIED', label:'Casado(a)'}, {value:'DIVORCED', label:'Divorciado(a)'}, {value:'WIDOWED', label:'Viúvo(a)'}]} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                    <InputField label="Nome do Pai" value={formData.fatherName} onChange={(v:any) => setFormData({...formData, fatherName: v})} />
                    <InputField label="Nome da Mãe" value={formData.motherName} onChange={(v:any) => setFormData({...formData, motherName: v})} />
                  </div>
                </div>
              )}

              {activeTab === 'rh' && (
                <div className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
                         <h4 className="text-[10px] font-black text-indigo-600 uppercase flex items-center gap-2"><Heart size={14}/> Informações de Saúde</h4>
                         <div className="grid grid-cols-2 gap-4">
                            <SelectField label="Tipo Sanguíneo" value={formData.bloodType} onChange={(v:any) => setFormData({...formData, bloodType: v})} options={[{value:'A+', label:'A+'}, {value:'A-', label:'A-'}, {value:'B+', label:'B+'}, {value:'B-', label:'B-'}, {value:'O+', label:'O+'}, {value:'O-', label:'O-'}, {value:'AB+', label:'AB+'}, {value:'AB-', label:'AB-'}]} />
                            <InputField label="Contato Emergência" value={formData.emergencyContact} onChange={(v:any) => setFormData({...formData, emergencyContact: v})} placeholder="(00) 00000-0000" />
                         </div>
                      </div>

                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
                         <h4 className="text-[10px] font-black text-indigo-600 uppercase flex items-center gap-2"><Landmark size={14}/> Dados Bancários</h4>
                         <div className="grid grid-cols-2 gap-4">
                            <InputField label="Banco" value={formData.bank} onChange={(v:any) => setFormData({...formData, bank: v})} />
                            <InputField label="Chave PIX" value={formData.pixKey} onChange={(v:any) => setFormData({...formData, pixKey: v})} />
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'endereco' && (
                <div className="grid grid-cols-12 gap-4">
                   <InputField label="CEP" value={formData.address?.zipCode} onChange={(v:any) => setFormData({...formData, address: {...formData.address!, zipCode: v}})} className="col-span-4" />
                   <InputField label="Cidade" value={formData.address?.city} onChange={(v:any) => setFormData({...formData, address: {...formData.address!, city: v}})} className="col-span-8" />
                   <InputField label="Rua" value={formData.address?.street} onChange={(v:any) => setFormData({...formData, address: {...formData.address!, street: v}})} className="col-span-9" />
                   <InputField label="Nº" value={formData.address?.number} onChange={(v:any) => setFormData({...formData, address: {...formData.address!, number: v}})} className="col-span-3" />
                </div>
              )}

              {activeTab === 'ministerios' && (
                <div className="grid grid-cols-2 gap-6">
                   <InputField label="Cargo Eclesiástico" value={formData.ecclesiasticalPosition} onChange={(v:any) => setFormData({...formData, ecclesiasticalPosition: v})} />
                   <InputField label="Ministério Principal" value={formData.mainMinistry} onChange={(v:any) => setFormData({...formData, mainMinistry: v})} />
                   <InputField label="Data Consagração" type="date" value={formData.consecrationDate} onChange={(v:any) => setFormData({...formData, consecrationDate: v})} />
                   <InputField label="Data Membresia" type="date" value={formData.membershipDate} onChange={(v:any) => setFormData({...formData, membershipDate: v})} />
                </div>
              )}
            </div>

            <div className="p-4 border-t bg-slate-50 flex gap-3">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 font-bold uppercase text-[11px] bg-white border border-slate-200 rounded-2xl">Cancelar</button>
              <button onClick={handleSave} className="flex-2 py-3 font-black uppercase text-[11px] bg-indigo-600 text-white rounded-2xl shadow-lg flex items-center justify-center gap-2 hover:bg-indigo-700">
                <Save size={16}/> Salvar Registro Ministerial
              </button>
            </div>
          </div>
        </div>
      )}

      {isIDCardOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl no-print">
           <div className="bg-white rounded-[2.5rem] w-full max-w-5xl shadow-2xl relative flex flex-col h-[90vh] overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center bg-white shrink-0">
                 <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-md"><Printer size={20}/></div>
                    <div>
                      <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 leading-none">Prévia de Credenciais</h3>
                    </div>
                 </div>
                 <button onClick={() => setIsIDCardOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-all"><X size={24}/></button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 bg-slate-50 flex flex-col items-center gap-8 custom-scrollbar" id="printable-area">
                {members.filter(m => selectedMemberIds.includes(m.id)).map(m => (
                   <TemplateCarteiraMembro key={m.id} member={m} id={`card-to-print-${m.id}`} />
                ))}
              </div>

              <div className="p-6 border-t flex flex-col md:flex-row gap-4 bg-white shrink-0 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)]">
                <button 
                  onClick={handleDownloadPDF} 
                  disabled={isGeneratingPDF} 
                  className="flex-1 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-3 shadow-xl"
                >
                  {isGeneratingPDF ? <Loader2 size={20} className="animate-spin"/> : <Download size={20}/>}
                  {isGeneratingPDF ? 'Renderizando PDF Ultra HD...' : 'Baixar PDF de Alta Fidelidade (Gráfica)'}
                </button>
                <button 
                  onClick={handleDirectPrint}
                  className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-3 shadow-xl"
                >
                  <Printer size={20}/> Imprimir na Impressora
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};