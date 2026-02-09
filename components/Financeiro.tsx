
import React, { useState, useMemo } from 'react';
import { 
  Plus, ArrowUp, ArrowDown, Download, FileText, CreditCard,
  Landmark, Wallet, TrendingUp, X, Save, DollarSign, Calendar, 
  Search, Filter, RefreshCw, Edit2, Trash2, ShieldCheck, 
  Receipt, User, Printer, Loader2, FileSearch, PieChart,
  Link as LinkIcon, Paperclip, CheckCircle2, AlertCircle, Layers,
  Briefcase, History, CheckCircle, Tag, MoreHorizontal
} from 'lucide-react';
import { Transaction, FinancialAccount, UserAuth } from '../types';
import { COST_CENTERS, OPERATION_NATURES, CHURCH_PROJECTS } from '../constants';

interface FinanceiroProps {
  transactions: Transaction[];
  currentUnitId: string;
  setTransactions: (newList: Transaction[]) => void;
  accounts: FinancialAccount[];
  setAccounts: (newList: FinancialAccount[]) => void;
  user?: UserAuth;
}

export const Financeiro: React.FC<FinanceiroProps> = ({ transactions, currentUnitId, setTransactions, accounts, setAccounts, user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Transaction>>({
    description: '', amount: 0, date: new Date().toISOString().split('T')[0], type: 'INCOME', category: 'TITHE', operationNature: 'nat6', costCenter: 'cc1', projectId: '', accountId: accounts[0]?.id || '', status: 'PAID', unitId: currentUnitId, paymentMethod: 'PIX'
  });

  const totals = useMemo(() => transactions.reduce((acc, curr) => {
    if (curr.status === 'PAID') {
      if (curr.type === 'INCOME') acc.income += curr.amount;
      else acc.expense += curr.amount;
    } else if (curr.status === 'PENDING') acc.payable += curr.amount;
    return acc;
  }, { income: 0, expense: 0, payable: 0 }), [transactions]);

  const filtered = transactions.filter(t => t.description.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSave = () => {
    if (!formData.description || !formData.amount) return alert("Preencha descrição e valor.");
    const data = { 
      ...formData, 
      id: editingId || Math.random().toString(36).substr(2, 9), 
      createdAt: new Date().toISOString(), 
      unitId: currentUnitId 
    } as Transaction;
    
    if (editingId) setTransactions(transactions.map(t => t.id === editingId ? data : t));
    else setTransactions([data, ...transactions]);
    
    setIsModalOpen(false); 
    setEditingId(null);
  };

  const openModal = (t?: Transaction) => {
    if (t) { 
      setEditingId(t.id); 
      setFormData({ ...t }); 
    } else { 
      setFormData({ 
        description: '', amount: 0, date: new Date().toISOString().split('T')[0], 
        type: 'INCOME', category: 'TITHE', operationNature: 'nat6', costCenter: 'cc1', 
        projectId: '', accountId: accounts[0]?.id || '', status: 'PAID', 
        unitId: currentUnitId, paymentMethod: 'PIX' 
      }); 
    }
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4 animate-in fade-in pb-16">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-none italic font-serif">Tesouraria & ERP Cloud</h1>
          <p className="text-slate-400 font-medium text-[10px] uppercase tracking-tighter mt-1">Gestão de Naturezas e Centros de Custo ADJPA v5.0</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsReportModalOpen(true)} className="px-4 py-1.5 bg-slate-200 text-slate-600 rounded-lg font-bold text-[10px] uppercase hover:bg-slate-300 transition-all flex items-center gap-1.5"><FileSearch size={14}/> Relatórios</button>
          <button onClick={() => openModal()} className="px-5 py-1.5 bg-slate-900 text-white rounded-lg font-bold text-[10px] uppercase shadow-md hover:bg-slate-800 transition-all flex items-center gap-1.5"><Plus size={14}/> Novo Lançamento</button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          {l: 'Receita Realizada', v: totals.income, i: <TrendingUp/>, c: 'emerald'}, 
          {l: 'Despesa Liquidada', v: totals.expense, i: <ArrowDown/>, c: 'rose'}, 
          {l: 'Contas a Pagar', v: totals.payable, i: <History/>, c: 'amber'}
        ].map((s, i) => (
          <div key={i} className="bg-white p-3.5 rounded-xl border border-slate-100 flex items-center gap-3 shadow-sm hover:shadow-md transition-all">
            <div className={`p-2 rounded-lg bg-${s.c}-50 text-${s.c}-600`}>
              {React.cloneElement(s.i as React.ReactElement<{ size?: number }>, {size: 16})}
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">{s.l}</p>
              <p className="text-lg font-black text-slate-900 mt-0.5">R$ {s.v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-1.5 rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col sm:flex-row gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2 text-slate-400" size={14} />
          <input type="text" placeholder="Buscar por descrição, fornecedor ou documento..." className="w-full pl-8 pr-4 py-1.5 bg-transparent outline-none text-[12px] text-slate-900 font-medium" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left min-w-[1000px]">
            <thead className="bg-slate-50/30 text-[10px] text-slate-400 font-black uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-4 py-3">Data / Competência</th>
                <th className="px-4 py-3">Lançamento / Origem</th>
                <th className="px-6 py-3">Natureza / Centro</th>
                <th className="px-6 py-3 text-right">Valor Líquido</th>
                <th className="px-6 py-3 text-center">Situação</th>
                <th className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-[11px]">
              {filtered.map(t => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-all">
                  <td className="px-4 py-2.5">
                    <p className="font-bold text-slate-900 leading-none">{new Date(t.date).toLocaleDateString('pt-BR')}</p>
                    <p className="text-[8px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">ID: {t.id.slice(0,5).toUpperCase()}</p>
                  </td>
                  <td className="px-4 py-2.5">
                    <p className="font-bold text-slate-700 leading-none mb-0.5">{t.description}</p>
                    <p className="text-[9px] text-slate-400 font-medium uppercase">{t.providerName || 'ADJPA Matriz'}</p>
                  </td>
                  <td className="px-6 py-2.5">
                    <p className="text-[9px] font-black text-indigo-600 uppercase tracking-tight leading-none">
                      {OPERATION_NATURES.find(n => n.id === t.operationNature)?.name || 'OUTROS'}
                    </p>
                    <p className="text-[8px] text-slate-400 font-bold uppercase mt-0.5">
                      {COST_CENTERS.find(c => c.id === t.costCenter)?.name || 'Geral'}
                    </p>
                  </td>
                  <td className={`px-6 py-2.5 text-right font-black ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-2.5 text-center">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${t.status === 'PAID' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {t.status === 'PAID' ? 'Liquidado' : 'Em Aberto'}
                    </span>
                  </td>
                  <td className="px-6 py-2.5 text-right text-slate-400">
                    <button onClick={() => openModal(t)} className="hover:text-indigo-600 transition-colors"><Edit2 size={15}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b flex justify-between items-center bg-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md"><DollarSign size={20}/></div>
                <div>
                   <h2 className="font-black uppercase text-sm tracking-tight text-slate-900">{editingId ? 'Editar Lançamento' : 'Novo Lançamento Contábil'}</h2>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">PostgreSQL Cloud Sinc • ERP v5.0</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400"><X size={20}/></button>
            </div>
            <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar bg-slate-50/30">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                   <label className="text-[10px] font-black uppercase block mb-1 text-slate-400">Descrição do Lançamento / Histórico</label>
                   <input className="w-full px-4 py-2 bg-white border border-slate-200 rounded-2xl font-bold text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase block mb-1 text-slate-400">Valor Bruto (R$)</label>
                  <input type="number" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-2xl font-black text-xs text-indigo-700" value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase block mb-1 text-slate-400">Data de Lançamento</label>
                  <input type="date" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-2xl font-bold text-xs" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase block mb-1 text-slate-400">Tipo de Fluxo</label>
                  <select className="w-full px-4 py-2 bg-white border border-slate-200 rounded-2xl font-bold text-xs outline-none" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}>
                    <option value="INCOME">Receita / Arrecadação (+)</option>
                    <option value="EXPENSE">Despesa / Pagamento (-)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase block mb-1 text-slate-400">Centro de Custo</label>
                  <select className="w-full px-4 py-2 bg-white border border-slate-200 rounded-2xl font-bold text-xs outline-none" value={formData.costCenter} onChange={e => setFormData({...formData, costCenter: e.target.value})} >
                    {COST_CENTERS.map(cc => <option key={cc.id} value={cc.id}>{cc.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase block mb-1 text-slate-400">Conta / Caixa Ativo</label>
                  <select className="w-full px-4 py-2 bg-white border border-slate-200 rounded-2xl font-bold text-xs outline-none" value={formData.accountId} onChange={e => setFormData({...formData, accountId: e.target.value})} >
                    {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="text-[10px] font-black uppercase block mb-1 text-slate-400">Natureza da Operação (FISCAL)</label>
                   <select className="w-full px-4 py-2 bg-white border border-slate-200 rounded-2xl font-bold text-xs outline-none" value={formData.operationNature} onChange={e => setFormData({...formData, operationNature: e.target.value})} >
                    {OPERATION_NATURES.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
                   </select>
                 </div>
                 <div>
                   <label className="text-[10px] font-black uppercase block mb-1 text-slate-400">Fornecedor / Favorecido</label>
                   <input className="w-full px-4 py-2 bg-white border border-slate-200 rounded-2xl font-bold text-xs" value={formData.providerName} onChange={e => setFormData({...formData, providerName: e.target.value})} placeholder="Ex: CPFL, Sabesp, Nome Fornecedor..." />
                 </div>
              </div>
              <div className="p-6 bg-indigo-50/50 rounded-[2rem] border border-indigo-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-sm"><CreditCard size={18}/></div>
                  <div>
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none">Meio de Movimentação</p>
                    <p className="text-xs font-bold text-slate-700 mt-1">Sincronização imediata via reconciliação bancária.</p>
                  </div>
                </div>
                <select className="px-4 py-1.5 bg-white border border-indigo-200 rounded-xl font-black text-[10px] uppercase outline-none shadow-sm" value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value as any})}>
                  <option value="PIX">PIX</option>
                  <option value="CASH">Dinheiro</option>
                  <option value="CREDIT_CARD">Cartão Corporativo</option>
                </select>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t flex gap-3 shadow-inner">
               <button onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 font-bold uppercase text-[11px] bg-white border border-slate-200 rounded-2xl hover:bg-slate-100 transition-all">Cancelar</button>
               <button onClick={handleSave} className="flex-2 py-2.5 font-black uppercase text-[11px] bg-indigo-600 text-white rounded-2xl shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"><Save size={16}/> Confirmar e Sincronizar ERP</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
