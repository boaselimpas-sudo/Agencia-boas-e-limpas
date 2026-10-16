import React from 'react';
import { MessageCircle, Phone, Clock, CreditCard, ShieldCheck } from 'lucide-react';
import { AgencyConfig } from '../types.ts';

interface ContactSectionProps {
  config: AgencyConfig;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ config }) => {
  return (
    <section id="contato" className="py-14 sm:py-20 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-red-500 uppercase tracking-widest mb-2">
            <Phone className="w-4 h-4" />
            <span>Canais Oficiais & Suporte</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-serif tracking-tight">
            Fale Conosco Diretamente
          </h2>
          <p className="text-sm text-zinc-400 mt-2">
            Estamos online para responder suas dúvidas, confirmar disponibilidades ou personalizar o seu atendimento de forma rápida e confidencial.
          </p>
        </div>

        {/* WhatsApp & Call Action Cards for BOTH numbers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          
          {/* Line 1: 864368486 */}
          <div className="bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 rounded-2xl p-6 transition-all duration-300 shadow-xl shadow-zinc-950">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-800/80">
                Linha Principal 1
              </span>
              <span className="text-xs text-zinc-400">Atendimento 24h</span>
            </div>

            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono mb-2">
              +258 {config.phone1}
            </div>
            <p className="text-xs text-zinc-400 mb-6">
              WhatsApp para pedidos rápidos, envio de catálogo e confirmações de presença.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <a
                href={`https://wa.me/258${config.phone1.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá! Gostaria de fazer uma reserva na agência ${config.name}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm transition-all shadow-md shadow-emerald-950/50"
              >
                <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                <span>WhatsApp</span>
              </a>

              <a
                href={`tel:+258${config.phone1}`}
                className="h-12 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 text-sm transition-colors border border-zinc-700"
              >
                <Phone className="w-4 h-4 text-zinc-400" />
                <span>Ligar Agora</span>
              </a>
            </div>
          </div>

          {/* Line 2: 878872648 */}
          <div className="bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 rounded-2xl p-6 transition-all duration-300 shadow-xl shadow-zinc-950">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-800/80">
                Linha Secundária 2
              </span>
              <span className="text-xs text-zinc-400">Atendimento Alternativo</span>
            </div>

            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono mb-2">
              +258 {config.phone2}
            </div>
            <p className="text-xs text-zinc-400 mb-6">
              Linha de contingência para reservas especiais, pacotes corporativos e dúvidas.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <a
                href={`https://wa.me/258${config.phone2.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá! Gostaria de atendimento pela Linha 2 da agência ${config.name}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm transition-all shadow-md shadow-emerald-950/50"
              >
                <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                <span>WhatsApp</span>
              </a>

              <a
                href={`tel:+258${config.phone2}`}
                className="h-12 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 text-sm transition-colors border border-zinc-700"
              >
                <Phone className="w-4 h-4 text-zinc-400" />
                <span>Ligar Agora</span>
              </a>
            </div>
          </div>

        </div>

        {/* Informational Cards Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto pt-4 border-t border-zinc-900">
          <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800/60 flex items-center gap-3">
            <Clock className="w-6 h-6 text-red-500 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white uppercase">Horário de Funcionamento</h4>
              <p className="text-xs text-zinc-400 mt-0.5">24h / 7 dias por semana</p>
            </div>
          </div>

          <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800/60 flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-red-500 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white uppercase">Pagamentos Aceitos</h4>
              <p className="text-xs text-zinc-400 mt-0.5">e-Mola, M-Pesa ou Dinheiro</p>
            </div>
          </div>

          <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800/60 flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-red-500 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white uppercase">Garantia de Sigilo</h4>
              <p className="text-xs text-zinc-400 mt-0.5">Discrição total e profissional</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
