import React from 'react';
import { BookOpen, Send, MapPin, MessageCircle, ShieldCheck, Clock, CreditCard, Sparkles, Upload, Home } from 'lucide-react';
import { AgencyConfig } from '../types.ts';

interface HeroProps {
  config: AgencyConfig;
  onNavigateToMenu: () => void;
  onNavigateToCart: () => void;
  onNavigateToLocation: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  config,
  onNavigateToMenu,
  onNavigateToCart,
  onNavigateToLocation,
}) => {
  return (
    <section className="relative overflow-hidden bg-zinc-950 pt-4 pb-12 sm:pt-8 sm:pb-16 border-b border-zinc-800/80">
      {/* Background ambient red glow */}
      <div 
        aria-hidden="true" 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-red-600/15 via-red-900/5 to-transparent blur-3xl pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Text & Primary Actions */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Clean metadata badge */}
            <div className="flex items-center gap-2 text-xs font-medium text-red-500 uppercase tracking-widest mb-3">
              <Sparkles className="w-4 h-4 text-red-500" />
              <span>Catálogo Oficial & Atendimento ao Domicílio</span>
              <span aria-hidden="true">·</span>
              <span className="text-zinc-400">Maputo & Matola</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-serif leading-[1.1] mb-4 text-balance">
              Bem-vindo à agência <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-rose-200">
                {config.name}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed mb-6 max-w-2xl">
              Catálogo selecionado com atendimento de altíssimo padrão, charme, elegância e discrição total. Atendimento exclusivo ao domicílio e espaço escolhido pelo cliente mediante subscrição mensal de 1000 MT.
            </p>

            {/* Requested Main Action Buttons (Substituted 'Ver Cardápio' -> 'Ver Catálogo') */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8">
              {/* Button 1: Ver Catálogo */}
              <button
                onClick={onNavigateToMenu}
                className="w-full h-14 px-6 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold rounded-xl shadow-lg shadow-red-950 flex items-center justify-center gap-3 transition-transform active:scale-[0.98] text-base cursor-pointer"
              >
                <BookOpen className="w-5 h-5 text-white" />
                <span>Ver Catálogo</span>
              </button>

              {/* Button 2: Fazer Pedido */}
              <button
                onClick={onNavigateToCart}
                className="w-full h-14 px-6 bg-white hover:bg-zinc-100 active:bg-zinc-200 text-zinc-950 font-bold rounded-xl shadow-md flex items-center justify-center gap-3 transition-transform active:scale-[0.98] text-base cursor-pointer"
              >
                <Send className="w-5 h-5 text-red-600" />
                <span>Fazer Pedido / Reserva</span>
              </button>

              {/* Button 3: Ao Domicílio & Espaço Escolhido */}
              <button
                onClick={onNavigateToLocation}
                className="w-full h-14 px-6 bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-700 text-zinc-100 border border-zinc-800 hover:border-zinc-700 font-semibold rounded-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] text-base cursor-pointer"
              >
                <Home className="w-5 h-5 text-red-500" />
                <span>Ao Domicílio / No Seu Espaço</span>
              </button>

              {/* Button 4: WhatsApp */}
              <div className="relative group">
                <a
                  href={`https://wa.me/258${config.phone1}?text=${encodeURIComponent('Olá! Vim através do Catálogo Oficial da Boas e limpas e gostaria de atendimento.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-14 px-6 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-3 transition-all active:scale-[0.98] text-base"
                >
                  <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
                  <span>WhatsApp Agência</span>
                </a>
              </div>
            </div>

            {/* Trust Markers Bar */}
            <div className="pt-4 border-t border-zinc-900 grid grid-cols-3 gap-2 text-center sm:text-left">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-red-500 shrink-0" />
                <span className="text-xs text-zinc-400">100% Sigilo & Discrição</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-500 shrink-0" />
                <span className="text-xs text-zinc-400">Disponível 24 Horas</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-red-500 shrink-0" />
                <span className="text-xs text-zinc-400">e-Mola, M-Pesa & Dinheiro</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Banner Container (User's real photo or luxury monogram) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl shadow-red-950/20 group">
              {config.heroImage ? (
                <img
                  src={config.heroImage}
                  alt="Ambiente VIP Boas e limpas"
                  className="w-full h-72 sm:h-96 lg:h-[460px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-72 sm:h-96 lg:h-[460px] bg-gradient-to-br from-zinc-900 via-red-950/40 to-zinc-950 flex flex-col items-center justify-center p-8 text-center border border-zinc-800">
                  <div className="w-24 h-24 rounded-3xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 font-serif font-black text-4xl shadow-xl shadow-red-950 mb-4">
                    BL
                  </div>
                  <h3 className="text-2xl font-bold text-white font-serif tracking-tight">{config.name}</h3>
                  <p className="text-xs text-zinc-400 mt-1 max-w-xs">{config.tagline}</p>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent pointer-events-none" />
              
              {/* Overlay card content */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-zinc-950/80 backdrop-blur-md border border-zinc-800/80">
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                  <span>Espaço Exclusivo & Atendimento</span>
                  <span className="text-red-400 font-semibold">Maputo VIP</span>
                </div>
                <p className="text-sm font-semibold text-white">
                  Atendimento em Domicílio, Hotel ou Suítes da Agência
                </p>
                <div className="mt-2 flex items-center justify-between text-xs text-zinc-400">
                  <span>Subscrição Mensal:</span>
                  <span className="font-mono text-white font-bold tabular-nums">
                    {config.subscriptionPrice} MZN via e-Mola
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
