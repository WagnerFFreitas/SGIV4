
import React, { useState } from 'react';
import { Box, Plus, Search, DollarSign, Building2, TrendingDown, Music, Truck, HardDrive, Trash2, Edit2 } from 'lucide-react';
import { Asset } from '../types';

interface PatrimonioProps {
  assets: Asset[];
  setAssets: (assets: Asset[]) => void;
  currentUnitId: string;
}

export const Patrimonio: React.FC<PatrimonioProps> = ({ assets, currentUnitId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const filtered = assets.filter(a => a.unitId === currentUnitId && (a.description.toLowerCase().includes(searchTerm.toLowerCase()) || a.assetNumber.includes(searchTerm)));

  return (
    <div className="space-y-6 animate-in fade-in pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight italic font-serif">Gestão de Patrimônio</h1>
          <p className="text-slate-500 font-medium text-[11px] uppercase tracking-widest mt-1">Controle de Ativos Imobilizados e Inventário ADJPA.</p>
        </div>
        <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase shadow-lg transition-transform hover:scale-105"><Plus size={16} /> Novo Tombamento</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Itens Registrados', val: filtered.length, icon: <Box size={18}/>, c: 'indigo' },
          { label: 'Valor em Inventário', val: `R$ ${filtered.reduce((a,c)=>a+c.currentValue, 0).toLocaleString('pt-BR')}`, icon: <DollarSign size={18}/>, c: 'emerald' },
          { label: 'Depreciação Média', val: '4.2%', icon: <TrendingDown size={18}/>, c: 'amber' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-5 rounded-[1.5rem] border border-slate-100 flex items-center gap-4 shadow-sm">
            <div className={`p-3 rounded-xl bg-${s.c}-50 text-${s.c}-600`}>{s.icon}</div>
            <div><p className="text-[10px] font-black text-slate-400 uppercase leading-none tracking-widest">{s.label}</p><p className="text-xl font-black text-slate-900 mt-1">{s.val}</p></div>
          </div>
        ))}
      </div>

      <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
         <Search size={18} className="text-slate-300 ml-2"/>
         <input type="text" placeholder="Buscar por descrição ou número de tombamento..." className="flex-1 bg-transparent outline-none text-xs font-bold text-slate-700" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(asset => (
          <div key={asset.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
             <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors"><Box size={20}/></div>
                <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[8px] font-black uppercase border border-emerald-100">{asset.condition}</span>
             </div>
             <h3 className="font-black text-slate-900 uppercase text-[12px] leading-tight mb-1">{asset.description}</h3>
             <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">TOMB: #{asset.assetNumber}</p>
             <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-end">
                <div><p className="text-[8px] font-black text-slate-400 uppercase leading-none">Valor Atual</p><p className="text-sm font-black text-slate-900 mt-1">R$ {asset.currentValue.toLocaleString('pt-BR')}</p></div>
                <div className="flex gap-2 text-slate-300">
                   <button className="hover:text-indigo-600 transition-colors"><Edit2 size={16}/></button>
                   <button className="hover:text-rose-600 transition-colors"><Trash2 size={16}/></button>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};
