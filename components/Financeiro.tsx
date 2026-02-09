
import React, { useState, useMemo } from 'react';
import { 
  Plus, TrendingUp, ArrowDown, Search, Edit2, X, Save, DollarSign, History
} from 'lucide-react';
import { Transaction, FinancialAccount, UserAuth } from '../types';
import { COST_CENTERS, OPERATION_NATURES } from '../constants';

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
  const [formData, setFormData] = useState<Partial<Transaction>>({
    description: '', amount: 0, date: new Date().toISOString().split('T')[0], type: 'INCOME', status: 'PAID', unitId: currentUnitId
  });

  const totals = useMemo(() => transactions.reduce((acc, curr) => {
    if (curr.status === 'PAID') {
      if (curr.type === 'INCOME') acc.income += curr.amount;
      else acc.expense += curr.amount;
    }
    return acc;
  }, { income: 0, expense: 0 }), [transactions]);

  const filtered = transactions.filter(t => t.description.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-4 animate-in fade-in pb-16">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-lg font-black text-slate-900 uppercase">Tesouraria & ERP</h1>
          <p className="text-slate-400 font-medium text-[10px] uppercase">ADJPA v5.0</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-5 py-1.5 bg-slate-900 text-white rounded-lg font-bold text-[10px] uppercase shadow-md flex items-center gap-1.5"><Plus size={14}/> Novo Lançamento</button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[{l: 'Receita Realizada', v: totals.income, i: <TrendingUp/>, c: 'emerald'}, {l: 'Despesa Liquidada', v: totals.expense, i: <ArrowDown/>, c: 'rose'}, {l: 'Contas a Pagar', v: 0, i: <History/>, c: 'amber'}].map((s, i) => (
          <div key={i} className="bg-white p-3.5 rounded-xl border border-slate-100 flex items-center gap-3">
            {/* Fix: Explicitly defining generic type for ReactElement to allow 'size' prop in cloneElement */}
            <div className={`p-2 rounded-lg bg-${s.c}-50 text-${s.c}-600`}>{React.cloneElement(s.i as React.ReactElement<{ size?: number }>, {size: 16})}</div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase leading-none">{s.l}</p>
              <p className="text-lg font-black text-slate-900 mt-0.5">R$ {s.v.toLocaleString('pt-BR')}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/30 text-[10px] text-slate-400 font-black uppercase tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Descrição</th>
              <th className="px-6 py-3 text-right">Valor</th>
              <th className="px-6 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-[11px]">
            {filtered.map(t => (
              <tr key={t.id} className="hover:bg-slate-50/50 transition-all">
                <td className="px-4 py-2.5">{new Date(t.date).toLocaleDateString('pt-BR')}</td>
                <td className="px-4 py-2.5 font-bold">{t.description}</td>
                <td className={`px-6 py-2.5 text-right font-black ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>R$ {t.amount.toLocaleString('pt-BR')}</td>
                <td className="px-6 py-2.5 text-center"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[9px] font-black uppercase">Liquidado</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
