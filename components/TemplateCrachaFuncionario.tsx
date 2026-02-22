import React from 'react';
import { Payroll } from '../types';

interface TemplateCrachaFuncionarioProps {
  employee: Payroll;
  id?: string;
}

export const TemplateCrachaFuncionario: React.FC<TemplateCrachaFuncionarioProps> = ({ employee, id }) => (
  <div 
    id={id} 
    className="flex flex-row items-start justify-center print:mb-0 mb-8 bg-transparent flex-shrink-0 gap-[5mm]" 
    style={{ 
      width: '176.2mm', // 85.6 * 2 + 5mm gap
      height: '53.98mm', 
      minWidth: '176.2mm', 
      minHeight: '53.98mm',
      pageBreakInside: 'avoid',
      breakInside: 'avoid',
      position: 'relative'
    }}
  >
    {/* FRENTE */}
    <div 
      className="relative flex flex-col p-3 shrink-0 bg-white overflow-hidden shadow-xl rounded-[1rem] border border-slate-200"
      style={{ width: '85.6mm', height: '53.98mm' }}
    >
      {/* Camada de Fundo Branco Base */}
      <div className="absolute inset-0 bg-white z-0" />

      {/* Marca d'água Fundo */}
      <img 
        src="img/fundo.png" 
        className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-10" 
        alt=""
        onError={(e) => (e.target as HTMLElement).style.display = 'none'}
      />

      {/* HEADER */}
      <div className="relative z-20 flex items-start w-full mb-1 gap-[2.5mm]" style={{ marginTop: '-2.2mm' }}>
        <div className="w-11 h-11 flex items-center justify-center shrink-0">
          <img 
            src="img/logo.png" 
            className="w-full h-full object-contain" 
            alt="Logo ADJPA" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://api.dicebear.com/7.x/initials/svg?seed=ADJPA&backgroundColor=003399&fontSize=45&bold=true";
            }}
          />
        </div>
        <div className="flex-1 text-left overflow-hidden flex flex-col gap-[0.2mm] min-w-0" style={{ marginTop: '2.4mm' }}>
          <p className="text-[8.5px] font-black text-[#003399] leading-normal uppercase tracking-tighter whitespace-nowrap overflow-visible">ASSEMBLEIA DE DEUS JESUS QUE ALIMENTA</p>
          <p className="text-[6.2px] font-bold text-slate-500 uppercase leading-none mt-0.5">RUA GERICINÓ, QD04 LT22 - STA CRUZ DA SERRA</p>
          <p className="text-[6.2px] font-bold text-slate-500 uppercase leading-none">DUQUE DE CAXIAS - RJ - CEP 25240-170</p>
          <p className="text-[6.2px] font-bold text-slate-500 uppercase leading-none">CNPJ 09.432.897/0001-05</p>
          <p className="text-[6.2px] font-black text-[#003399] uppercase leading-none">TEL.: (21) 2675-7036</p>
          <p className="text-[6.2px] font-black text-[#003399] uppercase leading-none opacity-70">RECURSOS HUMANOS</p>
        </div>
      </div>

      <div className="relative z-20 flex flex-1 items-center gap-3 px-1 mt-[-3mm]">
        <div 
          className="rounded-lg border-2 border-[#003399] p-0.5 flex items-center justify-center overflow-hidden shrink-0 shadow-md bg-white"
          style={{ width: '20mm', height: '25mm', minWidth: '20mm', minHeight: '25mm' }}
        >
          <div className="w-full h-full rounded-[0.4rem] bg-slate-50 overflow-hidden">
            <img 
              src={`https://picsum.photos/seed/${employee.id}/200`} 
              className="w-full h-full object-cover" 
              crossOrigin="anonymous" 
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center overflow-hidden">
           <h4 className="text-[11px] font-black text-slate-900 uppercase leading-tight mb-1 truncate">{employee.employeeName}</h4>
           <p className="text-[9px] font-bold text-[#003399] uppercase leading-none mb-0.5">{employee.cargo}</p>
           <p className="text-[7.5px] font-medium text-[#003399]/60 uppercase leading-none truncate">{employee.departamento}</p>
           
           <div className="mt-1.5 flex justify-start">
              <div className="w-9 h-9 bg-white p-0.5 border border-slate-200 rounded shadow-sm">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(employee.id)}`}
                  alt="QR Code"
                  className="w-full h-full"
                />
              </div>
           </div>
        </div>
      </div>
    </div>
    
    {/* VERSO */}
    <div 
      className="relative flex flex-col p-5 shrink-0 bg-white overflow-hidden shadow-xl rounded-[1rem] border border-slate-200"
      style={{ width: '85.6mm', height: '53.98mm' }}
    >
      {/* Marca d'água Fundo Verso */}
      <img 
        src="img/fundo.png" 
        className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-0" 
        alt=""
        onError={(e) => (e.target as HTMLElement).style.display = 'none'}
      />

      <div className="relative z-10 space-y-1.5 mb-2">
        <div className="flex justify-between border-b border-slate-100 pb-0.5">
          <p className="text-[6px] font-black text-slate-400 uppercase tracking-widest">MATRÍCULA</p>
          <p className="text-[8px] font-bold text-slate-800">{employee.matricula}</p>
        </div>
        <div className="flex justify-between border-b border-slate-100 pb-0.5">
          <p className="text-[6px] font-black text-slate-400 uppercase tracking-widest">ADMISSÃO</p>
          <p className="text-[8px] font-bold text-slate-800">{new Date(employee.data_admissao).toLocaleDateString('pt-BR')}</p>
        </div>
        <div className="flex justify-between border-b border-slate-100 pb-0.5">
          <p className="text-[6px] font-black text-slate-400 uppercase tracking-widest">VALIDADE</p>
          <p className="text-[8px] font-bold text-slate-800 italic">ATÉ 12/2026</p>
        </div>
      </div>

      <div className="relative z-10 bg-[#fff1f1] py-1.5 rounded-lg text-center mb-2 border border-rose-100">
        <p className="text-[9px] font-black text-[#e11d48] uppercase tracking-widest leading-none">DADOS VITAIS</p>
      </div>

      <div className="relative z-10 space-y-3">
        <div className="flex items-center gap-2">
          <p className="text-[6px] font-black text-slate-400 uppercase tracking-widest">TIPO SANGUÍNEO:</p>
          <p className="text-[8px] font-bold text-slate-800 bg-rose-50 px-1 rounded">{employee.blood_type || '---'}</p>
        </div>
        <div>
          <p className="text-[6px] font-black text-slate-400 uppercase mb-0.5 tracking-widest">EMERGÊNCIA:</p>
          <p className="text-[8px] font-bold text-slate-800">{employee.emergency_contact || '( ) _____-_____'}</p>
        </div>
      </div>

      <div className="relative z-10 mt-auto text-center">
        <p className="text-[5px] text-slate-400 font-bold uppercase leading-tight tracking-tighter">Crachá de uso pessoal e intransferível.<br/>Em caso de perda, comunique imediatamente o RH.</p>
      </div>
    </div>
  </div>
);