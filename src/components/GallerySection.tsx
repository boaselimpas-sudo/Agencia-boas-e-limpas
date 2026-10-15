import React, { useState, useMemo } from 'react';
import { Play, Sparkles, Video, Image as ImageIcon, Plus, ExternalLink, X, Send, ShoppingBag } from 'lucide-react';
import { GalleryMediaItem, AgencyConfig, MenuItem } from '../types.ts';

interface GallerySectionProps {
  galleryItems: GalleryMediaItem[];
  config: AgencyConfig;
  menuItems: MenuItem[];
  onOpenVideo: (modelIdOrItem: string) => void;
  onAddToCart: (item: MenuItem) => void;
  onOpenAdmin: () => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  galleryItems,
  config,
  menuItems,
  onOpenVideo,
  onAddToCart,
  onOpenAdmin,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'video' | 'image'>('all');
  const [selectedModel, setSelectedModel] = useState<string>('all');
  const [lightboxItem, setLightboxItem] = useState<GalleryMediaItem | null>(null);

  // Unique model names
  const modelNames = useMemo(() => {
    const names = Array.from(new Set(galleryItems.map((g) => g.modelName).filter(Boolean)));
    return ['all', ...names];
  }, [galleryItems]);

  // Filtered items
  const filtered = useMemo(() => {
    return galleryItems.filter((item) => {
      const matchType = filterType === 'all' || item.type === filterType;
      const matchModel = selectedModel === 'all' || item.modelName === selectedModel;
      return matchType && matchModel;
    });
  }, [galleryItems, filterType, selectedModel]);

  const handleBookingClick = (item: GalleryMediaItem) => {
    // Check if matching menu item exists
    const match = menuItems.find((m) => m.name.toLowerCase() === item.modelName.toLowerCase());
    if (match) {
      onAddToCart(match);
    } else {
      const waText = encodeURIComponent(
        `Olá! Vi a mídia de *${item.modelName}* na Galeria do site Boas e limpas e gostaria de agendar um atendimento.`
      );
      window.open(`https://wa.me/258${config.phone1}?text=${waText}`, '_blank');
    }
  };

  return (
    <section id="galeria" className="py-14 sm:py-20 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-red-500 uppercase tracking-widest mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Galeria Oficial Direta no Site</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-serif tracking-tight">
              Galeria VIP de Fotos & Vídeos MP4
            </h2>
            <p className="text-sm text-zinc-400 mt-1 max-w-xl">
              Assista aos vídeos exclusivos das garotas gravados em estúdio e ensaios fotográficos de alta resolução. Mídias reais geradas diretamente para o site.
            </p>
          </div>

          {/* Quick upload / manage shortcut */}
          <button
            onClick={onOpenAdmin}
            className="self-start md:self-auto px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-red-600/50 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4 text-red-500" />
            <span>Subir Fotos & Vídeos MP4</span>
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="space-y-3 mb-8">
          {/* Media Type Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                filterType === 'all'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              Todas as Mídias ({galleryItems.length})
            </button>
            <button
              onClick={() => setFilterType('video')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                filterType === 'video'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Vídeos Exclusivos MP4 ({galleryItems.filter((g) => g.type === 'video').length})</span>
            </button>
            <button
              onClick={() => setFilterType('image')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                filterType === 'image'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Fotos de Ensaio ({galleryItems.filter((g) => g.type === 'image').length})</span>
            </button>
          </div>

          {/* Model pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
            <span className="text-zinc-500 shrink-0 font-medium">Garota:</span>
            {modelNames.map((name) => (
              <button
                key={name}
                onClick={() => setSelectedModel(name)}
                className={`px-3 py-1 rounded-lg transition-colors shrink-0 cursor-pointer ${
                  selectedModel === name
                    ? 'bg-zinc-800 text-red-400 font-bold border border-red-500/40'
                    : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-850'
                }`}
              >
                {name === 'all' ? 'Todas' : name}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((item) => {
            const isVideo = item.type === 'video';

            return (
              <div
                key={item.id}
                className="group relative bg-zinc-900 border border-zinc-800/90 hover:border-red-600/60 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-red-950/20 flex flex-col justify-between"
              >
                {/* Media frame */}
                <div
                  onClick={() => {
                    if (isVideo) {
                      onOpenVideo(item.modelId || item.id);
                    } else {
                      setLightboxItem(item);
                    }
                  }}
                  className="relative aspect-[3/4] bg-zinc-950 overflow-hidden cursor-pointer"
                >
                  {item.thumbnailUrl || (item.type === 'image' && item.url) ? (
                    <img
                      src={item.thumbnailUrl || item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center text-center p-4">
                      <div className="w-16 h-16 rounded-full bg-red-950/60 border border-red-800/60 flex items-center justify-center text-red-500 font-serif font-black text-2xl mb-2">
                        {item.modelName[0]}
                      </div>
                      <span className="text-xs font-bold text-white font-serif">{item.modelName}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-white border border-zinc-700">
                      {isVideo ? 'Vídeo MP4' : 'Foto HD'}
                    </span>
                    {item.uploadedFromDevice && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white">
                        Do Dispositivo
                      </span>
                    )}
                  </div>

                  {/* Center Play Icon for Video */}
                  {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-red-600/90 group-hover:bg-red-600 group-hover:scale-110 text-white flex items-center justify-center shadow-xl shadow-red-950 transition-all">
                        <Play className="w-7 h-7 fill-white ml-0.5" />
                      </div>
                    </div>
                  )}

                  {/* Bottom details on image */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-baseline justify-between text-white">
                    <div>
                      <span className="text-sm font-bold block">{item.modelName}</span>
                      <span className="text-[11px] text-zinc-300 font-normal line-clamp-1">{item.title}</span>
                    </div>
                    {item.duration && (
                      <span className="text-[11px] font-mono bg-black/60 px-1.5 py-0.5 rounded text-zinc-300">
                        {item.duration}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Action footer */}
                <div className="p-3 bg-zinc-900 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                  {isVideo ? (
                    <button
                      onClick={() => onOpenVideo(item.modelId || item.id)}
                      className="flex-1 h-9 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Reproduzir Vídeo</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setLightboxItem(item)}
                      className="flex-1 h-9 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Ver Foto Completa</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleBookingClick(item)}
                    className="h-9 px-3 bg-zinc-950 hover:bg-emerald-950 border border-zinc-800 hover:border-emerald-600 text-emerald-400 font-bold rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    title={`Reservar com ${item.modelName}`}
                  >
                    <Send className="w-3 h-3" />
                    <span>Reservar</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Photo Lightbox Modal */}
      {lightboxItem && (
        <div
          onClick={() => setLightboxItem(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/70 hover:bg-black text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Photo */}
            <div className="relative aspect-[3/4] max-h-[70vh] bg-zinc-950 flex items-center justify-center overflow-hidden">
              <img
                src={lightboxItem.url}
                alt={lightboxItem.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Lightbox Footer */}
            <div className="p-5 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">{lightboxItem.modelName}</h3>
                <p className="text-xs text-zinc-400">{lightboxItem.title}</p>
                {lightboxItem.price && (
                  <p className="text-xs font-mono font-bold text-red-400 mt-0.5">
                    {lightboxItem.price.toLocaleString('pt-MZ')} MZN
                  </p>
                )}
              </div>

              <button
                onClick={() => {
                  handleBookingClick(lightboxItem);
                  setLightboxItem(null);
                }}
                className="h-11 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Agendar com {lightboxItem.modelName}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
