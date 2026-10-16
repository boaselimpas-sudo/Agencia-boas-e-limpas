import React from 'react';
import { AgencyConfig } from '../types.ts';
import { ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  config: AgencyConfig;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  config,
  onNavigate,
  onOpenAdmin,
}) => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 text-zinc-400 py-12 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand info */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold text-white font-serif tracking-tight mb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-red-600 rounded-full inline-block"></span>
              {config.name}
            </h3>
            <p className="text-xs text-zinc-400 max-w-sm leading-relaxed mb-4">
              Agência VIP de acompanhantes de alto padrão em Moçambique. Atendimento personalizado com elegância, conforto e sigilo absoluto.
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Privacidade e sigilo 100% garantidos</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('inicio')}
                  className="hover:text-red-400 transition-colors cursor-pointer"
                >
                  Início
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalogo')}
                  className="hover:text-red-400 transition-colors cursor-pointer"
                >
                  Catálogo Completo
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('galeria')}
                  className="hover:text-red-400 transition-colors cursor-pointer"
                >
                  Galeria VIP de Fotos & Vídeos
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('depoimentos')}
                  className="hover:text-red-400 transition-colors cursor-pointer"
                >
                  Depoimentos de Clientes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('domicilio')}
                  className="hover:text-red-400 transition-colors cursor-pointer"
                >
                  Ao Domicílio / Seu Espaço
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contato')}
                  className="hover:text-red-400 transition-colors cursor-pointer"
                >
                  Contato & Suporte
                </button>
              </li>
            </ul>
          </div>

          {/* Agency contacts & Admin */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Linhas Oficiais
            </h4>
            <div className="space-y-2 text-xs">
              <p>
                WhatsApp 1:{' '}
                <a
                  href={`https://wa.me/258${config.phone1}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white font-mono hover:text-red-400 transition-colors"
                >
                  +258 {config.phone1}
                </a>
              </p>
              <p>
                WhatsApp 2:{' '}
                <a
                  href={`https://wa.me/258${config.phone2}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white font-mono hover:text-red-400 transition-colors"
                >
                  +258 {config.phone2}
                </a>
              </p>
              <p className="text-zinc-500 pt-2">{config.address}</p>
              <div className="pt-2">
                <button
                  onClick={onOpenAdmin}
                  className="text-[11px] text-zinc-400 hover:text-red-400 underline transition-colors cursor-pointer"
                >
                  Gerenciar Cardápio & Mídias
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-zinc-900/80 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-4">
          <p>© {new Date().getFullYear()} {config.name}. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            <span>Desenvolvido para máxima discrição e comodidade</span>
            <Heart className="w-3 h-3 text-red-600 fill-red-600 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
};
