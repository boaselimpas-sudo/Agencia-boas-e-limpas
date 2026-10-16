import React from 'react';
import { Home, ShieldCheck, Clock, Car, CheckCircle2, Hotel, MapPin, Sparkles, Send, Phone } from 'lucide-react';
import { AgencyConfig } from '../types.ts';

interface LocationSectionProps {
  config: AgencyConfig;
  onNavigateToMenu?: () => void;
  onOpenCart?: () => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ 
  config,
  onNavigateToMenu,
  onOpenCart,
}) => {
  return (
    <section id="domicilio" className="py-14 sm:py-20 bg-zinc-950 border-t border-zinc-900 relative overflow-hidden">
      {/* Background glow */}
      <div 
        aria-hidden="true" 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-96 bg-red-600/5 blur-3xl pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-red-500 uppercase tracking-widest mb-2.5 px-3 py-1 bg-red-950/40 rounded-full border border-red-900/50">
            <Home className="w-3.5 h-3.5 text-red-500" />
            <span>Sem Ponto Físico Público · 100% Sigiloso</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-serif tracking-tight">
            Atendimento ao Domicílio & Espaço Escolhido
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 mt-3 leading-relaxed">
            Não realizamos atendimentos presenciais em agência para preservar o seu anonimato. Atendemos com exclusividade <strong className="text-zinc-200">no seu domicílio, na sua suíte de hotel ou no espaço privativo escolhido por você</strong> em Maputo e Matola.
          </p>
        </div>

        {/* 3 Main Modality Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* Card 1: Domicílio */}
          <div className="bg-zinc-900/90 border border-zinc-800 hover:border-red-900/60 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-red-950/20">
            <div>
              <div className="w-12 h-12 rounded-xl bg-red-950/70 border border-red-800/80 flex items-center justify-center mb-5 text-red-400">
                <Home className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Seu Domicílio</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-4">
                Relaxe no conforto absoluto da sua residência ou apartamento. A acompanhante desloca-se até o seu endereço com pontualidade e discrição exemplar.
              </p>
            </div>

            <ul className="space-y-2 pt-4 border-t border-zinc-800 text-xs text-zinc-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero exposição em condomínios</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Viaturas particulares sem adesivos</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Chegada combinada via WhatsApp</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Hotel & Suítes */}
          <div className="bg-zinc-900/90 border border-zinc-800 hover:border-red-900/60 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-red-950/20">
            <div>
              <div className="w-12 h-12 rounded-xl bg-red-950/70 border border-red-800/80 flex items-center justify-center mb-5 text-red-400">
                <Hotel className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Suítes de Hotéis & Resorts</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-4">
                Ideal para hóspedes, turistas e viajantes de negócios nos melhores hotéis de Maputo e Matola (Polana Hotel, Radisson Blu, Hotel Avenida, Glória, etc.).
              </p>
            </div>

            <ul className="space-y-2 pt-4 border-t border-zinc-800 text-xs text-zinc-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Entrada discreta pela recepção</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Atendimento direto na sua suíte</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Perfeito para noites corporativas</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Espaço Escolhido pelo Cliente */}
          <div className="bg-zinc-900/90 border border-zinc-800 hover:border-red-900/60 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-red-950/20">
            <div>
              <div className="w-12 h-12 rounded-xl bg-red-950/70 border border-red-800/80 flex items-center justify-center mb-5 text-red-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Espaço Escolhido por Si</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-4">
                Flats executivos, apartamentos alugados por temporada, casas de praia ou o refúgio seguro de sua preferência. Você define o local e o horário.
              </p>
            </div>

            <ul className="space-y-2 pt-4 border-t border-zinc-800 text-xs text-zinc-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Flexibilidade total de ponto de encontro</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Horários agendados sob medida</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Sigilo e privacidade 100% blindados</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Detailed Coverage Banner */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider">
                <Car className="w-4 h-4 text-red-500" />
                <span>Cobertura Rápida em Maputo, Matola & Arredores</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Onde você estiver, nós chegamos até você
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Nossas acompanhantes contam com transporte particular seguro e motorista exclusivo descaracterizado. Tempo estimado de deslocamento entre <strong className="text-zinc-200">20 a 40 minutos</strong> após a confirmação do seu pedido.
              </p>

              {/* Covered Neighborhoods Badges */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">
                  Bairros e Regiões com Deslocamento Imediato:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Polana Cimento',
                    'Sommerschield I e II',
                    'Costa do Sol',
                    'Bairro do Triunfo',
                    'Baixa de Maputo',
                    'Malhangalene',
                    'Coop & Alto Maé',
                    'Cidade da Matola',
                    'Matola Rio',
                    'Tchumene & Beluluane',
                  ].map((area) => (
                    <span
                      key={area}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 font-medium"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Summary Box */}
            <div className="lg:col-span-5 bg-zinc-950 border border-zinc-800/90 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Protocolo de Atendimento
                </span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Ativo 24h
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-950 border border-red-800 text-red-400 flex items-center justify-center font-bold text-[11px] shrink-0">
                    1
                  </div>
                  <div>
                    <strong className="text-white block">Assine a Subscrição (1000 MT / 30 dias)</strong>
                    <span className="text-zinc-400">Acesse fotos e vídeos em alta resolução sem restrições.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-950 border border-red-800 text-red-400 flex items-center justify-center font-bold text-[11px] shrink-0">
                    2
                  </div>
                  <div>
                    <strong className="text-white block">Escolha a Garota & Indique o Seu Espaço</strong>
                    <span className="text-zinc-400">Informe seu domicílio, condomínio, hotel ou local desejado.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-950 border border-red-800 text-red-400 flex items-center justify-center font-bold text-[11px] shrink-0">
                    3
                  </div>
                  <div>
                    <strong className="text-white block">Deslocamento Rápido & Sigilo Total</strong>
                    <span className="text-zinc-400">Chegada discreta no horário agendado com segurança garantida.</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800/80 flex flex-col gap-2">
                <a
                  href={`https://wa.me/258${config.phone1}?text=${encodeURIComponent(
                    'Olá! Gostaria de agendar um atendimento exclusivo ao domicílio / no meu espaço.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-red-950 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Agendar Atendimento ao Domicílio</span>
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
