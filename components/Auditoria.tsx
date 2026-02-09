
import React from 'react';
import { ShieldCheck, User, Terminal, Clock, Search } from 'lucide-react';
import { MOCK_AUDIT } from '../constants';

export const Auditoria: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic font-serif">Auditoria & Segurança</h1>
          <p className="text-slate-500 font-medium text-sm">Monitoramento de ações administrativas em tempo real.</p>
        </div>
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100 flex items-center gap-2">
          <ShieldCheck size={20}/><span className="text-[10px] font-black uppercase tracking-[0.2em]">Conformidade LGPD v2.1</span>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-50 bg-slate-50/30 flex items-center gap-3">
           <Search size={16} className="text-slate-300 ml-2"/>
           <input className="flex-1 bg-transparent border-none outline-none text-xs font-bold uppercase text-slate-500" placeholder="Filtrar por usuário ou tipo de ação..." />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/20">
              <tr>
                <th className="px-8 py-5">Agente Administrativo</th>
                <th className="px-8 py-5">Operação / Ação</th>
                <th className="px-8 py-5">Data/Hora Sinc.</th>
                <th className="px-8 py-5">Terminal IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_AUDIT.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-8 py-5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-[10px]">{log.userName[0]}</div>
                    <span className="text-xs font-black text-slate-700">{log.userName}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-slate-900 text-white text-[9px] font-black rounded-lg uppercase tracking-tighter group-hover:bg-indigo-600 transition-colors">{log.action}</span>
                  </td>
                  <td className="px-8 py-5"><div className="flex items-center gap-2 text-[10px] font-bold text-slate-500"><Clock size={12}/> {log.date}</div></td>
                  <td className="px-8 py-5 text-[10px] font-black text-indigo-400 font-mono tracking-tighter uppercase">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
