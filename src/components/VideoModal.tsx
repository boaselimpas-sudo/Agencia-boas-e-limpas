import React, { useState, useRef, useEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight, ShoppingBag, Send, Sparkles } from 'lucide-react';
import { MenuItem, AgencyConfig } from '../types.ts';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: MenuItem[];
  initialItemId: string | null;
  config: AgencyConfig;
  onAddToCart: (item: MenuItem) => void;
  onOpenCart: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  items,
  initialItemId,
  config,
  onAddToCart,
  onOpenCart,
}) => {
  // Only items with videos
  const videoItems = items.filter((it) => it.hasVideo && it.videoUrl);
  
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [addedNotice, setAddedNotice] = useState<boolean>(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // Set initial index when opening
  useEffect(() => {
    if (initialItemId && videoItems.length > 0) {
      const idx = videoItems.findIndex((it) => it.id === initialItemId);
      if (idx !== -1) {
        setCurrentIndex(idx);
      }
    }
  }, [initialItemId, videoItems.length]);

  const currentItem = videoItems[currentIndex] || videoItems[0];

  useEffect(() => {
    setVideoError(false);
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, [currentIndex]);

  if (!isOpen || !currentItem) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % videoItems.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + videoItems.length) % videoItems.length);
  };

  const handleAddAndNotify = () => {
    onAddToCart(currentItem);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const handleDirectWhatsApp = () => {
    const text = encodeURIComponent(
      `Olá! Assisti ao vídeo exclusivo da *${currentItem.name}* no cardápio digital da agência Boas e limpas e gostaria de agendar um atendimento.`
    );
    window.open(`https://wa.me/258${config.phone1}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Container simulating high-end VIP Reel */}
      <div className="relative w-full max-w-sm sm:max-w-md h-[86vh] sm:h-[88vh] bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between">
        
        {/* Top Floating Bar */}
        <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-zinc-700/60">
              <Sparkles className="w-3.5 h-3.5 text-red-500" />
              Vídeo Exclusivo VIP
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-colors"
              title={isMuted ? 'Ativar Som' : 'Silenciar'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-colors"
              title="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Player / Fallback Canvas */}
        <div
          onClick={togglePlay}
          className="relative flex-1 bg-zinc-950 flex items-center justify-center overflow-hidden cursor-pointer"
        >
          {!videoError && currentItem.videoUrl ? (
            <video
              ref={videoRef}
              src={currentItem.videoUrl}
              autoPlay
              loop
              playsInline
              muted={isMuted}
              onError={() => setVideoError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            // Elegant fallback loop with ambient background
            <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-zinc-950">
              {currentItem.image ? (
                <img
                  src={currentItem.image}
                  alt={currentItem.name}
                  className="w-full h-full object-cover animate-pulse duration-[3000ms]"
                />
              ) : (
                <div className="text-center p-8">
                  <div className="w-24 h-24 rounded-full bg-red-950/80 border border-red-700/80 flex items-center justify-center text-red-500 font-serif font-black text-4xl mx-auto mb-3 shadow-2xl">
                    {currentItem.name[0]}
                  </div>
                  <h4 className="text-xl font-bold text-white font-serif">{currentItem.name}</h4>
                  <p className="text-xs text-zinc-400 mt-1">Apresentação Exclusiva VIP</p>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30 pointer-events-none" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-16 h-16 rounded-full bg-red-600/80 backdrop-blur-md flex items-center justify-center text-white shadow-xl shadow-red-950">
                  <Play className="w-8 h-8 fill-white ml-1" />
                </div>
              </div>
            </div>
          )}

          {/* Pause Indicator overlay */}
          {!isPlaying && !videoError && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
              <div className="w-16 h-16 rounded-full bg-black/70 border border-white/20 flex items-center justify-center text-white">
                <Play className="w-8 h-8 fill-white ml-1" />
              </div>
            </div>
          )}

          {/* Left / Right navigation arrows */}
          {videoItems.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-all active:scale-95"
                title="Garota Anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-all active:scale-95"
                title="Próxima Garota"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Reel Indicator Bar Dots */}
          <div className="absolute top-14 left-4 right-4 flex items-center gap-1.5 z-20">
            {videoItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                className={`h-1 rounded-full transition-all flex-1 cursor-pointer ${
                  idx === currentIndex ? 'bg-red-500' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Model Details & Actions Overlay */}
        <div className="p-4 sm:p-5 bg-gradient-to-t from-zinc-950 via-zinc-950/95 to-transparent border-t border-zinc-800/80 space-y-3 z-20">
          
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-bold text-white font-serif">
                  {currentItem.name}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-600 text-white">
                  {currentItem.badge || 'VIP'}
                </span>
              </div>
              <p className="text-xs text-zinc-300 font-medium mt-0.5">{currentItem.details}</p>
              <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                {currentItem.description}
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] text-zinc-400 block uppercase">Cachê / Valor</span>
              <span className="text-lg sm:text-xl font-extrabold text-red-500 font-mono tabular-nums">
                {currentItem.price.toLocaleString('pt-MZ')} <span className="text-xs font-sans text-zinc-300">MZN</span>
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={handleAddAndNotify}
              className={`h-12 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer ${
                addedNotice
                  ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/50'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{addedNotice ? 'Adicionado ao Carrinho!' : 'Adicionar ao Carrinho'}</span>
            </button>

            <button
              onClick={handleDirectWhatsApp}
              className="h-12 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-emerald-950/60 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Chamar no WhatsApp</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
