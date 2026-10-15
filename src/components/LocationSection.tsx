import React from 'react';
import { MapPin, Navigation, Shield, Car, CheckCircle2, Building2 } from 'lucide-react';
import { AgencyConfig } from '../types.ts';

interface LocationSectionProps {
  config: AgencyConfig;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ config }) => {
  return (
    <section id="localizacao" className="py-14 sm:py-20 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-red-500 uppercase tracking-widest mb-2">
            <MapPin className="w-4 h-4" />
            <span>Localização Nobre & Discreta</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-serif tracking-tight">
            Nossa Localização & Cobertura
          </h2>
          <p className="text-sm text-zinc-400 mt-2">
            Localização privilegiada em área nobre de Maputo com suítes exclusivas, além de atendimento VIP em domicílio ou nos melhores hotéis da cidade.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Info Card */}
          <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-6">
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-red-800/80 flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Sede & Suítes Privativas</h3>
                  <p className="text-sm text-zinc-300 font-medium mt-0.5">{config.address}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{config.city}</p>
                </div>
              </div>

              {/* Perks list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-800/80">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Entrada Reservada</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">Acesso totalmente sigiloso e sem exposição pública.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Car className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Estacionamento Privativo</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">Vagas internas cobertas com monitoramento discreto.</p>
                  </div>
                </div>
              </div>

              {/* Covered Areas */}
              <div className="pt-4 border-t border-zinc-800/80">
                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3">
                  Bairros e Regiões com Atendimento Domiciliar / Hotel:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Polana Cimento',
                    'Sommerschield',
                    'Costa do Sol',
                    'Triunfo',
                    'Baixa de Maputo',
                    'Malhangalene',
                    'Matola e Arredores',
                  ].map((area) => (
                    <span
                      key={area}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      {area}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Navigation Button */}
            <div className="mt-8 pt-6 border-t border-zinc-800 flex flex-col sm:flex-row gap-3">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  'Polana Cimento, Maputo, Mozambique'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm transition-colors shadow-md shadow-red-950"
              >
                <Navigation className="w-4 h-4" />
                <span>Ver Rota no Google Maps</span>
              </a>
              <a
                href={`https://wa.me/258${config.phone1}?text=${encodeURIComponent(
                  'Olá! Gostaria de receber a localização exata das suítes da agência Boas e limpas.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 px-5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold rounded-xl flex items-center justify-center gap-2 text-sm transition-colors"
              >
                <span>Solicitar Ponto por WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Map Preview Graphic */}
          <div className="lg:col-span-5 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                  Guia de Privacidade
                </span>
                <span className="text-xs text-emerald-400 font-medium">Disponibilidade Imediata</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Atendimento em Qualquer Ponto da Cidade
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                Nossas acompanhantes deslocam-se de forma rápida e discreta em viatura própria ou motorista particular até a sua localização.
              </p>
            </div>

            {/* Visual stylised Map Frame */}
            <div className="h-56 w-full rounded-xl bg-zinc-950 border border-zinc-800 relative flex items-center justify-center overflow-hidden">
              {/* Grid lines */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#dc2626_1px,transparent_1px)] [background-size:16px_16px]" />
              
              <div className="relative text-center p-4">
                <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg shadow-red-600/50 animate-bounce">
                  <MapPin className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-white">Maputo & Matola</p>
                <p className="text-xs text-zinc-400 mt-0.5">Tempo estimado de chegada: 20 a 40 min</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-zinc-800 text-center">
              <span className="text-xs text-zinc-400">
                Central de Atendimento 24h: <strong className="text-white font-mono">{config.phone1}</strong>
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
