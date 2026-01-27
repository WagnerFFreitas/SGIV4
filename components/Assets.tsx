
import React, { useState, useMemo } from 'react';
import { 
  Box, Plus, Search, Filter, TrendingDown, 
  MapPin, Calendar, DollarSign, Edit2, Trash2,
  Tag, HardDrive, Building2, Music, Truck, Info
} from 'lucide-react';
import { Asset } from '../types';

interface AssetsProps {
  assets: Asset[];
  setAssets: (assets: Asset[]) => void;
  currentUnitId: string;
}

export const Assets: React.FC<AssetsProps> = ({ assets, setAssets, currentUnitId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');

  const filteredAssets = assets.filter(a => 
    a.unitId === currentUnitId &&
    (a.description.toLowerCase().includes(searchTerm.toLowerCase()) || a.assetNumber.includes(searchTerm)) &&
    (filterCategory === 'ALL' || a.category === filterCategory)
  );

  const totalValue = filteredAssets.reduce((acc, curr) => acc + curr.currentValue, 0);

  const categories = [
    { id: 'IMÓVEL', label: 'Imóveis', icon: <Building2 size={16}/> },
    { id: 'VEÍCULO', label: 'Veículos', icon: <Truck size={16}/> },
    { id: 'SOM_LUZ', label: 'Som e Luz', icon: <Music size={16}/> },
    { id: 'INSTRUMENTO', label: 'Instrumentos', icon: <Music size={16}/> },
    { id: 'MÓVEL', label: 'Móveis', icon: <Box size={16}/> },
    { id: 'INFORMÁTICA', label: 'Informática', icon: <HardDrive size={16}/> },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 leading-tight">Gestão de Patrimônio</h1>
          <p className="text-slate-500 font-medium text-sm">Controle de ativos, tombamento e inventário.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-lg font-bold text-xs uppercase shadow-lg transition-all hover:bg-slate-800">
          <Plus size={16} /> Novo Tombamento
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Itens Registrados', val: filteredAssets.length, icon: <Box size={18} className="text-indigo-600"/> },
          { label: 'Valor em Inventário', val: `R$ ${totalValue.toLocaleString('pt-BR')}`, icon: <DollarSign size={18} className="text-indigo-600"/> },
          { label: 'Depreciação Trimestral', val: '4.2%', icon: <TrendingDown size={18} className="text-indigo-600"/> },
        ].map((s, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-xl bg-indigo-50">{s.icon}</div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</p>
              <p className="text-xl font-black text-slate-900">{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar descrição ou tombamento..." 
            className="w-full pl-10 pr-4 py-2.5 bg-transparent outline-none text-sm text-slate-900 font-medium"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="px-6 py-2.5 border border-slate-200 rounded-lg text-slate-800 font-bold text-xs uppercase outline-none focus:bg-slate-50 transition-colors"
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
        >
          <option value="ALL">Todas Categorias</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssets.map(asset => (
          <div key={asset.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                  <Box size={20} />
                </div>
                <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${
                  asset.condition === 'NOVO' ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50'
                }`}>
                  {asset.condition}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 uppercase text-sm leading-tight">{asset.description}</h3>
                <p className="text-[10px] text-slate-500 font-medium uppercase mt-1 tracking-tighter">#{asset.assetNumber} • {asset.category}</p>
              </div>
              <div className="pt-4 border-t border-slate-50 flex justify-between">
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Vlr Atual</p>
                  <p className="text-sm font-black text-slate-900">R$ {asset.currentValue.toLocaleString('pt-BR')}</p>
                </div>
                <div className="flex gap-2 self-end">
                   <button className="text-slate-400 hover:text-indigo-600 transition-colors"><Edit2 size={16}/></button>
                   <button className="text-slate-400 hover:text-rose-600 transition-colors"><Trash2 size={16}/></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
