import React, { useState } from 'react';
import { Briefcase, Plus, QrCode, Square, CheckSquare, Edit2, Search, Building, UserCheck, Printer, X, Download, Loader2 } from 'lucide-react';
import { Payroll } from '../types';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { TemplateCrachaFuncionario } from './TemplateCrachaFuncionario';

interface FuncionariosProps {
  employees: Payroll[];
  currentUnitId: string;
  setEmployees: (newList: Payroll[]) => void;
}

export const Funcionarios: React.FC<FuncionariosProps> = ({ employees, currentUnitId, setEmployees }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isIDCardOpen, setIsIDCardOpen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const filtered = employees.filter(e => e.employeeName.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4', true);
      const selectedEmployees = employees.filter(e => selectedIds.includes(e.id));
      const cardHeight = 53.98;
      const cardWidth = 176.2;
      
      let yPos = 15;

      for (let i = 0; i < selectedEmployees.length; i++) {
        if (yPos + cardHeight > 280) {
          pdf.addPage();
          yPos = 15;
        }
        const el = document.getElementById(`badge-to-print-${selectedEmployees[i].id}`);
        if (el) {
          // Escala 8 para qualidade ultra-nítida (768 DPI)
          const canvas = await html2canvas(el, { 
            scale: 8, 
            useCORS: true,
            backgroundColor: '#ffffff',
            imageTimeout: 0,
            onclone: (clonedDoc) => {
              const badge = clonedDoc.getElementById(`badge-to-print-${selectedEmployees[i].id}`);
              if (badge) {
                // Fix: Access non-standard CSS properties using type assertion
                (badge.style as any).fontSmooth = 'always';
                (badge.style as any).webkitFontSmoothing = 'antialiased';
              }
            }
          });
          const imgData = canvas.toDataURL('image/png', 1.0);
          // 'NONE' para evitar artefatos de compressão em documentos oficiais
          pdf.addImage(imgData, 'PNG', 17, yPos, cardWidth, cardHeight, undefined, 'NONE');
          yPos += cardHeight + 8;
        }
      }
      pdf.save(`Lote_Crachas_HD_${new Date().getTime()}.pdf`);
    } catch (e) { 
      console.error(e); 
      alert("Erro ao gerar PDF.");
    } finally { 
      setIsGeneratingPDF(false); 
    }
  };

  const handleDirectPrint = () => {
    window.print();
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) setSelectedIds([]);
    else setSelectedIds(filtered.map(e => e.id));
  };

  return (
    <div className="space-y-5 animate-in fade-in pb-16">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight italic font-serif">Gestão de Colaboradores</h1>
          <p className="text-slate-400 font-medium text-[11px] uppercase tracking-widest mt-1">Sincronização Ativa eSocial ADJPA Cloud</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => selectedIds.length > 0 && setIsIDCardOpen(true)}
            className={`px-5 py-2 rounded-xl font-bold text-[10px] uppercase shadow-lg flex items-center gap-1.5 transition-all ${selectedIds.length > 0 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
          >
            <Printer size={14} /> Imprimir Crachás ({selectedIds.length})
          </button>
          <button className="px-5 py-2 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase shadow-lg flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95"><Plus size={14} /> Admissão Digital</button>
        </div>
      </div>

      <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
         <Search className="text-slate-300 ml-2" size={18}/>
         <input 
          type="text" 
          placeholder="Pesquisar por nome ou matrícula..." 
          className="flex-1 bg-transparent outline-none text-xs font-bold text-slate-700"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
         />
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/30 text-[10px] text-slate-400 font-black uppercase tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-4 py-4 text-center w-10">
                <div onClick={toggleSelectAll} className="cursor-pointer mx-auto">
                  {selectedIds.length === filtered.length && filtered.length > 0 ? <CheckSquare size={16} className="text-indigo-600"/> : <Square size={16} className="text-slate-300"/>}
                </div>
              </th>
              <th className="px-3 py-4">Colaborador</th>
              <th className="px-6 py-4">Cargo / Tipo</th>
              <th className="px-6 py-4">Status eSocial</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-xs">
            {filtered.map((emp) => (
              <tr key={emp.id} className="hover:bg-slate-50/50 transition-all">
                <td className="px-4 py-3 text-center">
                  <div onClick={() => setSelectedIds(p => p.includes(emp.id) ? p.filter(id => id !== emp.id) : [...p, emp.id])} className="cursor-pointer mx-auto">
                    {selectedIds.includes(emp.id) ? <CheckSquare size={16} className="text-indigo-600"/> : <Square size={16} className="text-slate-300"/>}
                  </div>
                </td>
                <td className="px-3 py-3 font-bold text-slate-900">
                   <p>{emp.employeeName}</p>
                   <p className="text-[8px] text-slate-400 uppercase font-black tracking-tighter mt-1">MAT: {emp.matricula}</p>
                </td>
                <td className="px-6 py-3">
                   <p className="font-bold text-slate-600">{emp.cargo}</p>
                   <p className="text-[9px] text-indigo-500 font-black uppercase">{emp.tipo_contrato}</p>
                </td>
                <td className="px-6 py-3"><span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase text-emerald-700 bg-emerald-50 border border-emerald-100">Sincronizado</span></td>
                <td className="px-6 py-3 text-right text-slate-300 hover:text-indigo-600 cursor-pointer transition-colors flex justify-end gap-2">
                   <button onClick={() => { setSelectedIds([emp.id]); setIsIDCardOpen(true); }}><QrCode size={16}/></button>
                   <Edit2 size={16}/>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isIDCardOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl no-print">
           <div className="bg-white rounded-[2.5rem] w-full max-w-4xl shadow-2xl relative flex flex-col max-h-[90vh]">
              <div className="p-6 border-b flex justify-between items-center bg-white rounded-t-[2.5rem]">
                 <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md"><Printer size={18}/></div>
                    <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">Prévia de Crachás Corporativos</h3>
                 </div>
                 <button onClick={() => setIsIDCardOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-all"><X size={20}/></button>
              </div>
              <div className="flex-1 overflow-y-auto p-12 bg-slate-50 flex flex-col items-center gap-8 custom-scrollbar" id="printable-area">
                {employees.filter(e => selectedIds.includes(e.id)).map(e => (
                   <TemplateCrachaFuncionario key={e.id} employee={e} id={`badge-to-print-${e.id}`} />
                ))}
              </div>
              <div className="p-6 border-t flex flex-col md:flex-row gap-4 bg-white rounded-b-[2.5rem] shadow-inner">
                <button 
                  onClick={handleDownloadPDF} 
                  disabled={isGeneratingPDF} 
                  className="flex-1 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase text-xs flex items-center justify-center gap-2 shadow-xl hover:bg-slate-800 transition-all"
                >
                  {isGeneratingPDF ? <Loader2 size={18} className="animate-spin"/> : <Download size={18}/>}
                  {isGeneratingPDF ? 'Renderizando Ultra HD...' : `Baixar Crachás HD (${selectedIds.length})`}
                </button>
                <button 
                  onClick={handleDirectPrint}
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase text-xs flex items-center justify-center gap-2 shadow-xl hover:bg-indigo-700 transition-all"
                >
                  <Printer size={18}/> Imprimir Crachás Agora
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};