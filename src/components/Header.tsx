import React from 'react';
import { ShoppingBag, Settings, Phone, Video, Lock, CheckCircle2, Star, Home } from 'lucide-react';
import { AgencyConfig } from '../types.ts';

interface HeaderProps {
  config: AgencyConfig;
  cartCount: number;
  isSubscribed: boolean;
  daysRemaining?: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onOpenSubscription: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  cartCount,
  isSubscribed,
  daysRemaining,
  onOpenCart,
  onOpenAdmin,
  onOpenSubscription,
  activeSection,
  onNavigate,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('inicio')}
              className="text-left group transition-all cursor-pointer"
            >
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-white font-serif flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-red-600 rounded-full inline-block group-hover:scale-125 transition-transform"></span>
                {config.name}
              </span>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Replaced Cardápio with Catálogo) */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-300">
            <button
              onClick={() => onNavigate('inicio')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeSection === 'inicio' ? 'text-red-500 font-semibold' : ''
              }`}
            >
              Início
            </button>
            <button
              onClick={() => onNavigate('catalogo')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeSection === 'catalogo' ? 'text-red-500 font-semibold' : ''
              }`}
            >
              Catálogo
            </button>
            <button
              onClick={() => onNavigate('galeria')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeSection === 'galeria' ? 'text-red-500 font-semibold' : ''
              }`}
            >
              <Video className="w-3.5 h-3.5 text-red-500" />
              <span>Galeria VIP</span>
            </button>
            <button
              onClick={() => onNavigate('depoimentos')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeSection === 'depoimentos' ? 'text-red-500 font-semibold' : ''
              }`}
            >
              <Star className="w-3.5 h-3.5 text-amber-400" />
              <span>Depoimentos</span>
            </button>
            <button
              onClick={() => onNavigate('domicilio')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeSection === 'domicilio' ? 'text-red-500 font-semibold' : ''
              }`}
            >
              Ao Domicílio
            </button>
            <button
              onClick={() => onNavigate('contato')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeSection === 'contato' ? 'text-red-500 font-semibold' : ''
              }`}
            >
              Contato
            </button>
          </nav>

          {/* Zone 3: Primary Action & Tools */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* VIP Subscription Button */}
            <button
              onClick={onOpenSubscription}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                isSubscribed
                  ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                  : 'bg-red-950/60 text-red-300 hover:text-white hover:bg-red-900 border-red-700/80 animate-pulse'
              }`}
              title="Subscrição Mensal VIP (1000 MT / 30 dias)"
            >
              {isSubscribed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5 text-red-400" />}
              <span>{isSubscribed ? `VIP Ativo (${daysRemaining ?? 30}d)` : 'Subscrição VIP (1000 MT)'}</span>
            </button>

            {/* Quick WhatsApp button */}
            <a
              href={`https://wa.me/258${config.phone1}?text=${encodeURIComponent('Olá! Gostaria de informações sobre o Catálogo da agência Boas e limpas.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-zinc-200 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-red-600/50 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-red-500" />
              <span>{config.phone1}</span>
            </a>

            {/* Admin toggle */}
            <button
              onClick={onOpenAdmin}
              className="px-2.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-red-600/60 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Gerenciar Cardápio & Mídias da Agência"
              aria-label="Gerenciar Cardápio & Mídias"
            >
              <Settings className="w-4 h-4 text-red-500" />
              <span className="hidden sm:inline">Gerenciar</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative inline-flex items-center justify-center gap-2 px-3.5 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-semibold rounded-lg shadow-lg shadow-red-900/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              aria-label={`Carrinho com ${cartCount} itens`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Carrinho</span>
              {cartCount > 0 && (
                <span className="min-w-5 h-5 px-1.5 text-xs font-bold bg-white text-red-700 rounded-full flex items-center justify-center tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
