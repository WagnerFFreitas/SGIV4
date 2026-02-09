
import React, { useState } from 'react';
import { Box, Plus, Search, DollarSign, Building2 } from 'lucide-react';
import { Asset } from '../types';

interface PatrimonioProps {
  assets: Asset[];
  setAssets: (assets: Asset[]) => void;
  currentUnitId: string;
}

export const Patrimonio: React.FC<PatrimonioProps> = ({ assets, currentUnitId }) => {
  const filtered = assets.filter(a => a.unitId === currentUnitId);

  return (
    <div className="space-y-6 animate-in fade-in pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold text-slate-900 uppercase">Gestão de Patrimônio</h1>
          <p className="text-slate-500 font-medium text-sm">Controle de ativos e inventário.</p>
        </div>
        <button className="px-6 py-2.5 bg-slate-900 text-white rounded-lg font-bold text-xs uppercase shadow-lg"><Plus size={16} /> Novo Tombamento</button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {filtered.map(asset => (
          <div key={asset.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
             <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl w-fit mb-4"><Box size={20}/></div>
             <h3 className="font-bold text-slate-900 uppercase text-sm leading-tight">{asset.description}</h3>
             <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">#{asset.assetNumber}</p>
             <p className="text-sm font-black text-slate-900 mt-4">R$ {asset.currentValue.toLocaleString('pt-BR')}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
