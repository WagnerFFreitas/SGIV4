
import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles, PencilLine } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { Member, Payroll } from '../types';

interface ComunicacaoProps {
  members?: Member[];
  employees?: Payroll[];
}

export const Comunicacao: React.FC<ComunicacaoProps> = ({ members = [] }) => {
  const [topic, setTopic] = useState('');
  const [finalMessage, setFinalMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const generateMessage = async () => {
    if (!topic) return;
    setLoading(true);
    const result = await geminiService.generatePastoralResponse(topic);
    setFinalMessage(result || '');
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Comunicação Inteligente</h1>
        <p className="text-slate-500">Envio massivo de mensagens e avisos.</p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
           <textarea 
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl h-40 outline-none"
            placeholder="Tema da mensagem..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <button 
            onClick={generateMessage}
            className="w-full bg-slate-900 text-white py-4 mt-4 rounded-2xl font-bold flex items-center justify-center gap-2"
          >
            {loading ? "Gerando..." : "Gerar Mensagem IA"}
          </button>
        </div>
        <div className="bg-indigo-900 text-white p-8 rounded-[2rem] shadow-2xl">
           <textarea 
            className="w-full h-full bg-white/5 rounded-2xl p-6 border border-white/10 text-indigo-100 outline-none resize-none"
            value={finalMessage}
            readOnly
          />
        </div>
      </div>
    </div>
  );
};
