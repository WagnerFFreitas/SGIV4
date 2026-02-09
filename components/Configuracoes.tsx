
import React, { useState } from 'react';
import { Database, Download, UploadCloud, ShieldCheck } from 'lucide-react';
import { UserAuth } from '../types';

interface ConfiguracoesProps {
  user: UserAuth;
}

export const Configuracoes: React.FC<ConfiguracoesProps> = ({ user }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in pb-20">
      <div>
        <h1 className="text-2xl font-black text-slate-900 uppercase">Configurações</h1>
        <p className="text-slate-500 font-medium">Segurança e tabelas fiscais.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-amber-200 shadow-sm overflow-hidden border-l-8 border-l-amber-500 p-8 flex justify-between items-center bg-amber-50/30">
        <div className="flex-1">
          <h3 className="text-lg font-black text-slate-900 uppercase">Segurança & Backup</h3>
          <p className="text-sm text-slate-600 font-medium">Realize um backup semanal dos dados locais.</p>
        </div>
        <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase shadow-xl"><Download size={18}/> Baixar Cópia</button>
      </div>
    </div>
  );
};
