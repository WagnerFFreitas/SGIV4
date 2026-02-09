
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { PainelGeral } from './components/PainelGeral';
import { Membros } from './components/Membros';
import { Financeiro } from './components/Financeiro';
import { RecursosHumanos } from './components/RecursosHumanos';
import { Funcionarios } from './components/Funcionarios';
import { Afastamentos } from './components/Afastamentos';
import { Patrimonio } from './components/Patrimonio';
import { ProcessamentoFolha } from './components/ProcessamentoFolha';
import { Eventos } from './components/Eventos';
import { Comunicacao } from './components/Comunicacao';
import { Relatorios } from './components/Relatorios';
import { Auditoria } from './components/Auditoria';
import { PortalMembro } from './components/PortalMembro';
import { Configuracoes } from './components/Configuracoes';
import { UserAuth, Payroll, Member, Transaction, FinancialAccount, Unit, Asset, EmployeeLeave } from './types';
import { dbService } from './services/databaseService';
import { MOCK_PAYROLL, MOCK_LEAVES, MOCK_ASSETS } from './constants';
import { 
  User as UserIcon, Key, LogIn, Church, AlertCircle, Loader2, Cloud, Terminal
} from 'lucide-react';

const SYSTEM_USERS = [
  { id: 'u1', name: 'Pr. Anderson Lima', username: 'anderson', password: '123', role: 'ADMIN' as const, avatar: 'https://picsum.photos/seed/pastor/100', unitId: 'u-sede' },
  { id: 'dev', name: 'Desenvolvedor Master', username: 'desenvolvedor', password: 'dev@ecclesia_secure_2024', role: 'DEVELOPER' as const, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=dev', unitId: 'u-sede' }
];

const Login: React.FC<{ onLogin: (user: UserAuth) => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const user = SYSTEM_USERS.find(u => u.username === username && u.password === password);
    if (user) {
      onLogin({ id: user.id, name: user.name, username: user.username, role: user.role, avatar: user.avatar, unitId: user.unitId });
    } else {
      setError('Credenciais inválidas. Verifique usuário e senha.');
    }
  };

  const quickDevLogin = () => {
    const devUser = SYSTEM_USERS.find(u => u.id === 'dev')!;
    setUsername(devUser.username);
    setPassword(devUser.password);
    onLogin({ 
      id: devUser.id, 
      name: devUser.name, 
      username: devUser.username, 
      role: devUser.role, 
      avatar: devUser.avatar, 
      unitId: devUser.unitId 
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 text-center">
        <div className="p-10 pt-12">
          <div className="inline-flex p-4 bg-indigo-600 text-white rounded-[1.5rem] shadow-lg mb-6">
            <Church size={40} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter italic font-serif">ADJPA ERP</h1>
          <p className="text-slate-500 font-medium mb-10 text-[10px] uppercase tracking-[0.2em]">Enterprise Cloud Edition v5.0</p>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div className="relative">
              <UserIcon className="absolute left-4 top-4 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Usuário" 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            <div className="relative">
              <Key className="absolute left-4 top-4 text-slate-400" size={20} />
              <input 
                type="password" 
                placeholder="Senha" 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-rose-600 bg-rose-50 p-3 rounded-xl text-xs font-bold animate-in shake">
                <AlertCircle size={16} /> {error}
              </div>
            )}
            <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 shadow-xl transition-all flex items-center justify-center gap-2 mt-2">
              <LogIn size={20} /> Acessar Sistema Cloud
            </button>
          </form>

          <div className="mt-6 flex flex-col gap-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Atalhos de Acesso</p>
            <button 
              onClick={quickDevLogin}
              className="flex items-center justify-center gap-2 py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all text-[10px] font-black uppercase border border-slate-200"
            >
              <Terminal size={14} className="text-indigo-600"/> Acesso Desenvolvedor
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase">
             <Cloud size={12}/> PostgreSQL Supabase Engine v5.0
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserAuth | null>(null);
  const [currentUnitId, setCurrentUnitId] = useState<string>('u-sede');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  
  const [employees, setEmployees] = useState<Payroll[]>(MOCK_PAYROLL);
  const [members, setMembers] = useState<Member[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<FinancialAccount[]>([]);
  const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);
  const [leaves, setLeaves] = useState<EmployeeLeave[]>(MOCK_LEAVES);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [m, t, a] = await Promise.all([
          dbService.getMembers(),
          dbService.getTransactions(),
          dbService.getAccounts()
        ]);
        setMembers(m);
        setTransactions(t);
        setAccounts(a);
      } catch (err) {
        console.error("Erro ao carregar dados remotos.");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (currentUser) fetchData();
    else setIsLoading(false);
  }, [currentUser]);

  if (isLoading) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
       <Loader2 size={48} className="text-indigo-600 animate-spin" />
       <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Sincronizando Banco de Dados...</p>
    </div>
  );

  if (!currentUser) return <Login onLogin={u => { setCurrentUser(u); setCurrentUnitId(u.unitId); }} />;

  const unitMembers = members.filter(m => m.unitId === currentUnitId);
  const unitEmployees = employees.filter(e => e.unitId === currentUnitId);
  const unitTransactions = transactions.filter(t => t.unitId === currentUnitId);
  const unitAccounts = accounts.filter(a => a.unitId === currentUnitId);
  const unitAssets = assets.filter(a => a.unitId === currentUnitId);
  const unitLeaves = leaves.filter(l => l.unitId === currentUnitId);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <PainelGeral user={currentUser} members={unitMembers} employees={unitEmployees} />;
      case 'members': return (
        <Membros 
          members={unitMembers} 
          currentUnitId={currentUnitId}
          setMembers={setMembers} 
          setTransactions={setTransactions}
          accounts={unitAccounts}
          setAccounts={setAccounts}
        />
      );
      case 'finance': return (
        <Financeiro 
          transactions={unitTransactions} 
          currentUnitId={currentUnitId}
          setTransactions={setTransactions}
          accounts={unitAccounts}
          setAccounts={setAccounts}
          user={currentUser}
        />
      );
      case 'assets': return <Patrimonio assets={unitAssets} setAssets={setAssets} currentUnitId={currentUnitId} />;
      case 'rh': return <RecursosHumanos employees={unitEmployees} />;
      case 'dp': return <Funcionarios employees={unitEmployees} setEmployees={setEmployees} currentUnitId={currentUnitId} />;
      case 'leaves': return <Afastamentos leaves={unitLeaves} setLeaves={setLeaves} currentUnitId={currentUnitId} />;
      case 'payroll': return <ProcessamentoFolha employees={unitEmployees} setEmployees={setEmployees} />;
      case 'events': return <Eventos />;
      case 'reports': return <Relatorios />;
      case 'messages': return <Comunicacao members={unitMembers} employees={unitEmployees} />;
      case 'audit': return <Auditoria />;
      case 'portal': return <PortalMembro />;
      case 'settings': return <Configuracoes user={currentUser} />;
      default: return <PainelGeral user={currentUser} members={unitMembers} employees={unitEmployees} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      user={currentUser}
      onLogout={() => setCurrentUser(null)}
      currentUnitId={currentUnitId}
      onUnitChange={setCurrentUnitId}
    >
      <div className="max-w-[1600px] mx-auto">
        {renderContent()}
      </div>
    </Layout>
  );
};

export default App;
