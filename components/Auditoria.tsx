
import React from 'react';
import { ShieldCheck, User, Terminal } from 'lucide-react';
import { MOCK_AUDIT } from '../constants';

export const Auditoria: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in">
      <div>
        <h1 className="text-2xl font-black text-slate-900 uppercase">Auditoria & Logs</h1>
        <p className="text-slate-500 font-medium">Monitoramento em tempo real.</p>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="text-[10px] font-black text-slate-400 uppercase bg-slate-50/20">
            <tr>
              <th className="px-8 py-5">Usuário</th>
              <th className="px-8 py-5">Ação</th>
              <th className="px-8 py-5">Data/Hora</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {MOCK_AUDIT.map(log => (
              <tr key={log.id}>
                <td className="px-8 py-5 font-bold">{log.userName}</td>
                <td className="px-8 py-5"><span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black rounded-lg">{log.action}</span></td>
                <td className="px-8 py-5 text-xs text-slate-500">{log.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
