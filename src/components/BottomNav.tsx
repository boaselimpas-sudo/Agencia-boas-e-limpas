import React from 'react';
import { Home, UtensilsCrossed, ShoppingBag, Phone, Video } from 'lucide-react';

interface BottomNavProps {
  activeSection: string;
  cartCount: number;
  onNavigate: (sectionId: string) => void;
  onOpenCart: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeSection,
  cartCount,
  onNavigate,
  onOpenCart,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-lg border-t border-zinc-800 px-2 py-1.5 safe-area-pb">
      <div className="grid grid-cols-5 items-center justify-around">
        
        {/* Início */}
        <button
          onClick={() => onNavigate('inicio')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-colors cursor-pointer ${
            activeSection === 'inicio' ? 'text-red-500 font-bold' : 'text-zinc-400 hover:text-white'
          }`}
          aria-label="Ir para o Início"
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Início</span>
        </button>

        {/* Catálogo */}
        <button
          onClick={() => onNavigate('catalogo')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-colors cursor-pointer ${
            activeSection === 'catalogo' ? 'text-red-500 font-bold' : 'text-zinc-400 hover:text-white'
          }`}
          aria-label="Ver Catálogo"
        >
          <UtensilsCrossed className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Catálogo</span>
        </button>

        {/* Carrinho (Focal Center Button) */}
        <button
          onClick={onOpenCart}
          className="relative flex flex-col items-center justify-center -top-3 cursor-pointer group"
          aria-label="Abrir Carrinho de Pedidos"
        >
          <div className="w-13 h-13 rounded-full bg-red-600 group-hover:bg-red-500 group-active:scale-95 text-white flex items-center justify-center shadow-lg shadow-red-950/80 transition-all border-2 border-zinc-950">
            <ShoppingBag className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-white text-red-700 text-[11px] font-extrabold rounded-full flex items-center justify-center border-2 border-zinc-950 tabular-nums">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold text-zinc-300 mt-0.5">Carrinho</span>
        </button>

        {/* Galeria VIP */}
        <button
          onClick={() => onNavigate('galeria')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-colors cursor-pointer ${
            activeSection === 'galeria' ? 'text-red-500 font-bold' : 'text-zinc-400 hover:text-white'
          }`}
          aria-label="Galeria VIP de Fotos e Vídeos"
        >
          <Video className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Galeria VIP</span>
        </button>

        {/* Contato */}
        <button
          onClick={() => onNavigate('contato')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-colors cursor-pointer ${
            activeSection === 'contato' ? 'text-red-500 font-bold' : 'text-zinc-400 hover:text-white'
          }`}
          aria-label="Ir para Contato"
        >
          <Phone className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Contato</span>
        </button>

      </div>
    </nav>
  );
};
