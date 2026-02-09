
import React, { useState } from 'react';
import { Database, Download, UploadCloud, ShieldCheck, Calculator, Save, ShieldAlert, Fingerprint } from 'lucide-react';
import { UserAuth } from '../types';
import { DEFAULT_TAX_CONFIG } from '../constants';

interface ConfiguracoesProps {
  user: UserAuth;
}

export const Configuracoes: React.FC<ConfiguracoesProps> = ({ user }) => {
  const [taxConfig, setTaxConfig] = useState(DEFAULT_TAX_CONFIG);

  const handleBackup = () => {
    const backup = { date: new Date().toISOString(), system: 'ADJPA-ERP-v5', data: {} };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BACKUP_ADJPA_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in pb-20">
      <div>
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic font-serif">Configurações do Ecossistema</h1>
        <p className="text-slate-500 font-medium">Segurança, tabelas tributárias e resiliência de dados.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-amber-200 shadow-sm overflow-hidden border-l-8 border-l-amber-500 p-8 flex flex-col lg:flex-row justify-between items-center bg-amber-50/30 gap-8">
        <div className="flex-1 space-y-2">
          <h3 className="text-lg font-black text-slate-900 uppercase flex items-center gap-2"><ShieldAlert className="text-amber-500" size={20}/> Segurança & Backup Estratégico</h3>
          <p className="text-sm text-slate-600 font-medium leading-relaxed">Como este sistema opera localmente em sua infraestrutura de nuvem, é vital realizar backups semanais para evitar perda de dados por limpeza de cache.</p>
        </div>
        <div className="flex gap-4">
           <button onClick={handleBackup} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase shadow-xl hover:bg-slate-800 transition-all flex items-center gap-2"><Download size={18}/> Baixar Cópia Local</button>
           <button className="bg-white border-2 border-slate-900 text-slate-900 px-8 py-4 rounded-2xl font-black text-xs uppercase hover:bg-slate-50 transition-all flex items-center gap-2"><UploadCloud size={18}/> Restaurar</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-6">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] border-b border-slate-50 pb-4 flex items-center gap-2"><Calculator size={18} className="text-indigo-600"/> Tabelas eSocial (Encargos)</h4>
            <div className="space-y-4">
               <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-xs font-black text-slate-500 uppercase">Cota Patronal (INSS)</span>
                  <input className="w-20 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-right font-black text-sm text-indigo-600" type="number" defaultValue={taxConfig.patronalRate} />
               </div>
               <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-xs font-black text-slate-500 uppercase">FGTS Depósito</span>
                  <input className="w-20 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-right font-black text-sm text-indigo-600" type="number" defaultValue={taxConfig.fgtsRate} />
               </div>
               <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2"><Save size={16}/> Salvar Tabelas Fiscais</button>
            </div>
         </div>

         <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col justify-center">
            <div className="absolute top-0 right-0 p-8 opacity-10"><Fingerprint size={120}/></div>
            <h4 className="text-lg font-black uppercase mb-4 relative z-10">Certificado Digital A1</h4>
            <p className="text-indigo-100/70 text-sm leading-relaxed mb-8 relative z-10 font-medium">O certificado digital A1 é obrigatório para assinar digitalmente os eventos do eSocial e garantir a validade jurídica dos holerites eletrônicos.</p>
            <button className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-2xl font-black uppercase text-xs tracking-widest transition-all relative z-10">Instalar Novo Certificado</button>
         </div>
      </div>
    </div>
  );
};
