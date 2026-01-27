
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, ArrowUp, ArrowDown, Download, FileText, CreditCard,
  Landmark, Wallet, TrendingUp, X, Save, DollarSign, Calendar, 
  Search, Filter, RefreshCw, Edit2, Trash2, ShieldCheck, 
  Receipt, User, Printer, Loader2, FileSearch, PieChart,
  Link as LinkIcon, Paperclip, CheckCircle2, AlertCircle, Layers,
  Briefcase, History, CheckCircle, Tag, MoreHorizontal
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { Transaction, FinancialAccount, UserAuth } from '../types';
import { COST_CENTERS, OPERATION_NATURES, CHURCH_PROJECTS } from '../constants';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface FinanceProps {
  transactions: Transaction[];
  currentUnitId: string;
  setTransactions: (newList: Transaction[]) => void;
  accounts: FinancialAccount[];
  setAccounts: (newList: FinancialAccount[]) => void;
  user?: UserAuth;
}

type ReportType = 'BALANCES' | 'EXPENSES' | 'PAYABLES' | 'PROJECTS';

export const Finance: React.FC<FinanceProps> = ({ transactions, currentUnitId, setTransactions, accounts, setAccounts, user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [activeReport, setActiveReport] = useState<ReportType | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterCostCenter, setFilterCostCenter] = useState('ALL');
  const [viewType, setViewType] = useState<'CAIXA' | 'COMPETENCIA'>('CAIXA');
  
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Transaction>>({
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    competencyDate: new Date().toISOString().split('T')[0],
    type: 'INCOME',
    category: 'TITHE',
    operationNature: 'nat6',
    costCenter: COST_CENTERS[0].id,
    projectId: '',
    accountId: accounts[0]?.id || '',
    paymentMethod: 'CASH',
    invoiceNumber: '',
    providerName: '',
    providerCpf: '',
    providerCnpj: '',
    isInstallment: false,
    installmentsCount: 1,
    status: 'PAID',
    isConciliated: false,
    unitId: currentUnitId
  });

  useEffect(() => {
    if (formData.type === 'INCOME') {
      if (formData.operationNature === 'nat1' || formData.operationNature === 'nat3') {
        setFormData(prev => ({ ...prev, operationNature: 'nat6' }));
      }
    } else {
      if (formData.operationNature === 'nat6' || formData.operationNature === 'nat7') {
        setFormData(prev => ({ ...prev, operationNature: 'nat1' }));
      }
    }
  }, [formData.type]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (t.providerName && t.providerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (t.invoiceNumber && t.invoiceNumber.includes(searchTerm));
      const matchCategory = filterCategory === 'ALL' || t.category === filterCategory;
      const matchCostCenter = filterCostCenter === 'ALL' || t.costCenter === filterCostCenter;
      return matchSearch && matchCategory && matchCostCenter;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, searchTerm, filterCategory, filterCostCenter]);

  const totals = useMemo(() => {
    return transactions.reduce((acc, curr) => {
      const isPaid = curr.status === 'PAID';
      if (isPaid) {
        if (curr.type === 'INCOME') acc.income += curr.amount;
        else acc.expense += curr.amount;
      } else if (curr.status === 'PENDING') {
        acc.payable += curr.amount;
      }
      return acc;
    }, { income: 0, expense: 0, payable: 0 });
  }, [transactions]);

  const handleSave = () => {
    if (!formData.description || !formData.amount || formData.amount <= 0) {
      alert("Por favor, preencha descrição e valor corretamente.");
      return;
    }

    if (editingId) {
      const oldTransaction = transactions.find(t => t.id === editingId);
      if (!oldTransaction) return;

      if (oldTransaction.status === 'PAID') {
        const updatedAccounts = accounts.map(acc => {
          if (acc.id === oldTransaction.accountId) {
            const revertAdjustment = oldTransaction.type === 'INCOME' ? -oldTransaction.amount : oldTransaction.amount;
            return { ...acc, currentBalance: acc.currentBalance + revertAdjustment };
          }
          return acc;
        });
        setAccounts(updatedAccounts);
      }

      const updatedTransaction = { 
        ...oldTransaction, 
        ...formData, 
        updatedAt: new Date().toISOString() 
      } as Transaction;

      const updatedList = transactions.map(t => t.id === editingId ? updatedTransaction : t);
      setTransactions(updatedList);

      if (updatedTransaction.status === 'PAID') {
        const finalAccounts = accounts.map(acc => {
          if (acc.id === updatedTransaction.accountId) {
            const newAdjustment = updatedTransaction.type === 'INCOME' ? updatedTransaction.amount : -updatedTransaction.amount;
            return { ...acc, currentBalance: acc.currentBalance + newAdjustment };
          }
          return acc;
        });
        setAccounts(finalAccounts);
      }

      setEditingId(null);
    } else {
      const newEntries: Transaction[] = [];
      const baseDate = new Date(formData.date + 'T12:00:00');

      if (formData.type === 'EXPENSE' && formData.paymentMethod === 'CREDIT_CARD' && formData.isInstallment && (formData.installmentsCount || 1) > 1) {
        const installments = formData.installmentsCount || 1;
        const installmentAmount = (formData.amount || 0) / installments;

        for (let i = 1; i <= installments; i++) {
          const installmentDate = new Date(baseDate);
          installmentDate.setMonth(baseDate.getMonth() + (i - 1));

          newEntries.push({
            ...formData,
            id: 't' + Math.random().toString(36).substr(2, 9),
            unitId: currentUnitId,
            amount: installmentAmount,
            date: installmentDate.toISOString().split('T')[0],
            currentInstallment: i,
            status: i === 1 ? 'PAID' : 'PENDING',
            description: `${formData.description} (${i}/${installments})`,
            createdAt: new Date().toISOString(),
            createdBy: user?.name || 'Sistema'
          } as Transaction);
        }
      } else {
        newEntries.push({
          ...formData,
          id: 't' + Math.random().toString(36).substr(2, 9),
          unitId: currentUnitId,
          status: (formData.status as any) || 'PAID',
          createdAt: new Date().toISOString(),
          createdBy: user?.name || 'Sistema'
        } as Transaction);
      }

      setTransactions([...newEntries, ...transactions]);
      
      const updatedAccounts = accounts.map(acc => {
        if (acc.id === formData.accountId) {
          const adjustment = newEntries
            .filter(t => t.status === 'PAID')
            .reduce((sum, t) => sum + (t.type === 'INCOME' ? t.amount : -t.amount), 0);
          return { ...acc, currentBalance: acc.currentBalance + adjustment };
        }
        return acc;
      });
      setAccounts(updatedAccounts);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const openEditModal = (t: Transaction) => {
    setEditingId(t.id);
    setFormData({ ...t });
    setIsModalOpen(true);
  };

  const markAsPaid = (tId: string) => {
    const transaction = transactions.find(t => t.id === tId);
    if (!transaction || transaction.status === 'PAID') return;

    if (confirm(`Confirmar liquidação de R$ ${transaction.amount.toFixed(2)} em conta?`)) {
      const updatedTransactions = transactions.map(t => t.id === tId ? { ...t, status: 'PAID' as const, isConciliated: true } : t);
      setTransactions(updatedTransactions);
      
      const updatedAccounts = accounts.map(acc => {
        if (acc.id === transaction.accountId) {
          const adjustment = transaction.type === 'INCOME' ? transaction.amount : -transaction.amount;
          return { ...acc, currentBalance: acc.currentBalance + adjustment };
        }
        return acc;
      });
      setAccounts(updatedAccounts);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      description: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      competencyDate: new Date().toISOString().split('T')[0],
      type: 'INCOME',
      category: 'TITHE',
      operationNature: 'nat6',
      costCenter: COST_CENTERS[0].id,
      projectId: '',
      accountId: accounts[0]?.id || '',
      paymentMethod: 'CASH',
      invoiceNumber: '',
      providerName: '',
      providerCpf: '',
      providerCnpj: '',
      isInstallment: false,
      installmentsCount: 1,
      status: 'PAID',
      isConciliated: false,
      unitId: currentUnitId
    });
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    const element = document.getElementById('printable-area');
    if (!element) return;
    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Relatorio_Financeiro_${new Date().getTime()}.pdf`);
    } catch (error) { console.error(error); } finally { setIsGeneratingPDF(false); }
  };

  const FinancialReport = () => {
    if (!activeReport) return null;
    const reportTitle = { BALANCES: 'RELATÓRIO DE SALDOS', EXPENSES: 'RELATÓRIO DE SAÍDAS', PAYABLES: 'PASSIVOS A PAGAR', PROJECTS: 'PROJETOS' }[activeReport];
    return (
      <div className="bg-white p-8 text-slate-900 min-h-[297mm] flex flex-col border border-slate-200">
        <h1 className="text-xl font-bold uppercase mb-4">{reportTitle} - ADJPA</h1>
        <table className="w-full border-collapse border border-slate-300">
           <thead><tr className="bg-slate-100"><th className="border border-slate-300 p-2">Data</th><th className="border border-slate-300 p-2">Descrição</th><th className="border border-slate-300 p-2 text-right">Valor</th></tr></thead>
           <tbody>{transactions.map(t => (<tr key={t.id}><td className="border border-slate-300 p-2">{t.date}</td><td className="border border-slate-300 p-2">{t.description}</td><td className="border border-slate-300 p-2 text-right">R$ {t.amount.toFixed(2)}</td></tr>))}</tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 leading-tight">Finanças & ERP Contábil</h1>
          <p className="text-slate-500 font-medium text-sm">Controle de dízimos, ofertas e fluxo de caixa.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsReportModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-200 text-slate-600 rounded-lg font-bold text-xs uppercase transition-all hover:bg-slate-300"
          >
            <FileSearch size={16} /> Relatórios Analíticos
          </button>
          <button 
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-lg font-bold text-xs uppercase shadow-lg transition-all hover:bg-slate-800"
          >
            <Plus size={16} /> Novo Lançamento
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Receita Total', val: totals.income, icon: <TrendingUp size={18} className="text-emerald-600"/> },
          { label: 'Despesa Total', val: totals.expense, icon: <ArrowDown size={18} className="text-rose-600"/> },
          { label: 'Provisão a Pagar', val: totals.payable, icon: <History size={18} className="text-amber-600"/> },
        ].map((s, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-xl bg-indigo-50">{s.icon}</div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</p>
              <p className="text-xl font-black text-slate-900">R$ {s.val.toLocaleString('pt-BR')}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por descrição, fornecedor ou documento..." 
            className="w-full pl-10 pr-4 py-2.5 bg-transparent outline-none text-sm text-slate-900 font-medium" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-2.5 border border-slate-200 rounded-lg text-slate-800 font-bold text-xs uppercase hover:bg-slate-50 transition-colors">
          <Filter size={14} /> Filtros
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left min-w-[1000px]">
            <thead className="bg-slate-50/30 text-[11px] text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Data / Competência</th>
                <th className="px-6 py-4">Lançamento / Origem</th>
                <th className="px-6 py-4">Natureza</th>
                <th className="px-6 py-4 text-right">Valor</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-all">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900 text-sm">{new Date(t.date).toLocaleDateString('pt-BR')}</p>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">Competência: {t.competencyDate || '--'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900 text-sm leading-none mb-1">{t.description}</p>
                    <p className="text-[10px] text-slate-500 font-medium uppercase">{t.providerName || 'ADJPA Geral'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-black text-indigo-700 uppercase">{OPERATION_NATURES.find(n => n.id === t.operationNature)?.name || 'Geral'}</span>
                  </td>
                  <td className={`px-6 py-4 text-right font-black text-sm ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase ${t.status === 'PAID' ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50'}`}>
                      {t.status === 'PAID' ? 'Liquidado' : 'Aberto'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openEditModal(t)} className="text-slate-400 hover:text-indigo-600 transition-colors">
                      <Edit2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Relatórios */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
           <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                 <h2 className="text-lg font-bold text-slate-900">Relatórios de Auditoria</h2>
                 <button onClick={() => setIsReportModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X/></button>
              </div>
              <div className="p-8 grid grid-cols-2 gap-4">
                 {['BALANCES', 'EXPENSES', 'PAYABLES', 'PROJECTS'].map(rep => (
                   <button 
                    key={rep} 
                    onClick={() => {setActiveReport(rep as ReportType); handleDownloadPDF();}}
                    className="p-6 border border-slate-100 rounded-2xl hover:border-indigo-600 hover:bg-indigo-50 transition-all text-left group"
                   >
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{rep}</p>
                     <p className="font-bold text-slate-800 uppercase text-sm group-hover:text-indigo-700">Gerar Documento Analítico</p>
                   </button>
                 ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
