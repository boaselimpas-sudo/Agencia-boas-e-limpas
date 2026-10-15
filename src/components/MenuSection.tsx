import React, { useState, useMemo, useRef } from 'react';
import { Plus, Check, Search, Sparkles, AlertCircle, Play, Video, Lock, ShieldCheck, Upload, User } from 'lucide-react';
import { MenuItem, CartItem, SubscriptionStatus, AgencyConfig } from '../types.ts';

interface MenuSectionProps {
  items: MenuItem[];
  cart: CartItem[];
  subscription: SubscriptionStatus;
  config: AgencyConfig;
  onAddToCart: (item: MenuItem) => void;
  onOpenVideo: (itemId: string) => void;
  onOpenSubscription: () => void;
  onUploadItemPhoto: (itemId: string, file: File) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  items,
  cart,
  subscription,
  config,
  onAddToCart,
  onOpenVideo,
  onOpenSubscription,
  onUploadItemPhoto,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [uploadingItemId, setUploadingItemId] = useState<string | null>(null);
  
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(items.map(item => item.category)));
    return ['all', ...cats];
  }, [items]);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.details && item.details.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  // Video items for the top reels strip
  const videoProfiles = useMemo(() => {
    return items.filter(item => item.hasVideo);
  }, [items]);

  // Check if item is in cart and its quantity
  const getItemQuantityInCart = (itemId: string): number => {
    const found = cart.find(cartItem => cartItem.item.id === itemId);
    return found ? found.quantity : 0;
  };

  const handleFileChange = (itemId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadItemPhoto(itemId, file);
    }
  };

  const isLocked = !subscription.isSubscribed;
  const daysRemaining = subscription.expiresAt
    ? Math.max(0, Math.ceil((subscription.expiresAt - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <section id="catalogo" className="py-12 sm:py-16 bg-zinc-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* VIP Video Stories / Reels Strip */}
        {videoProfiles.length > 0 && (
          <div className="mb-10 p-4 sm:p-5 bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-red-950/20 border border-zinc-800 rounded-2xl">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-red-500" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Vídeos Exclusivos das Garotas (Reels VIP)
                </h3>
              </div>
              {isLocked ? (
                <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Requer Subscrição e-Mola
                </span>
              ) : (
                <span className="text-xs text-zinc-400">Toque para assistir</span>
              )}
            </div>

            <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
              {videoProfiles.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => {
                    if (isLocked) {
                      onOpenSubscription();
                    } else {
                      onOpenVideo(profile.id);
                    }
                  }}
                  className="group flex flex-col items-center gap-2 shrink-0 cursor-pointer transition-transform active:scale-95"
                >
                  <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 group-hover:scale-105 transition-transform duration-300">
                    <div className="p-0.5 bg-zinc-950 rounded-full">
                      {profile.image ? (
                        <img
                          src={profile.image}
                          alt={profile.name}
                          className="w-16 h-16 sm:w-18 sm:h-18 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-zinc-900 flex items-center justify-center text-red-500 font-serif font-bold text-lg">
                          {profile.name[0]}
                        </div>
                      )}
                    </div>
                    {/* Play / Lock icon badge */}
                    <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-red-600 border-2 border-zinc-950 flex items-center justify-center text-white shadow-md">
                      {isLocked ? <Lock className="w-3 h-3" /> : <Play className="w-3 h-3 fill-white ml-0.5" />}
                    </div>
                  </div>
                  <span className="text-xs font-bold text-zinc-200 group-hover:text-red-400 transition-colors">
                    {profile.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-red-500 uppercase tracking-widest mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Catálogo & Perfis Exclusivos</span>
              {subscription.isSubscribed && (
                <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-md text-[10px] font-bold">
                  Subscrição Ativa ({daysRemaining} dias)
                </span>
              )}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-serif tracking-tight">
              Nosso Catálogo VIP
            </h2>
            <p className="text-sm text-zinc-400 mt-1 max-w-xl">
              {isLocked
                ? 'Para acessar o catálogo completo e vídeos exclusivos, faça sua subscrição mensal via e-Mola.'
                : 'Catálogo desbloqueado com sucesso. Escolha seu acompanhamento e faça seu agendamento direto.'}
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar no catálogo..."
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8 border-b border-zinc-900">
          {categories.map(cat => {
            const label = cat === 'all' ? 'Ver Catálogo Completo' : cat;
            const count = cat === 'all' ? items.length : items.filter(i => i.category === cat).length;
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-red-600 text-white shadow-lg shadow-red-950/50'
                    : 'bg-zinc-900/90 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800/80'
                }`}
              >
                <span>{label}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-red-700/80 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* LOCKED PAYWALL BANNER OVERLAY IF NOT SUBSCRIBED */}
        {isLocked && (
          <div className="mb-10 p-6 bg-gradient-to-r from-red-950/70 via-zinc-900 to-zinc-950 border border-red-800/70 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 shrink-0">
                <Lock className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <span className="text-xs font-bold uppercase tracking-wider text-red-400">Acesso Restrito</span>
                  <span className="text-xs text-zinc-400">· Subscrição Mensal (1 Mês)</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-serif mt-0.5">
                  Subscreva para Ver o Catálogo & Fotos das Garotas
                </h3>
                <p className="text-xs text-zinc-300 mt-1 max-w-xl">
                  Para proteger a privacidade de nossas modelos e garantir clientes exclusivos, o acesso ao catálogo completo requer uma taxa de subscrição mensal de <strong>{config.subscriptionPrice} MZN via e-Mola (Movitel)</strong>.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenSubscription}
              className="w-full md:w-auto px-7 py-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-extrabold rounded-2xl shadow-xl shadow-red-950 flex items-center justify-center gap-2.5 text-sm transition-all hover:scale-[1.02] cursor-pointer shrink-0"
            >
              <Lock className="w-4 h-4" />
              <span>Pagar via e-Mola & Desbloquear Catálogo</span>
            </button>
          </div>
        )}

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16 px-4 rounded-2xl border border-zinc-800 bg-zinc-900/30">
            <AlertCircle className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            <p className="text-lg font-semibold text-zinc-300">Nenhum item encontrado no catálogo</p>
            <p className="text-sm text-zinc-500 mt-1">Tente buscar por outro termo ou selecione outra categoria.</p>
          </div>
        )}

        {/* Items Grid (with graceful blur if locked) */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${isLocked ? 'select-none' : ''}`}>
          {filteredItems.map(item => {
            const qtyInCart = getItemQuantityInCart(item.id);

            return (
              <article
                key={item.id}
                className="group flex flex-col bg-zinc-900 border border-zinc-800/90 hover:border-red-600/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-red-950/20 relative"
              >
                {/* Photo / Silhouette Container */}
                <div className="relative aspect-[3/4] bg-zinc-950 overflow-hidden flex items-center justify-center">
                  
                  {/* Hidden file input for direct photo upload without link */}
                  <input
                    ref={(el) => { fileInputRefs.current[item.id] = el; }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(item.id, e)}
                  />

                  {item.image ? (
                    // User's own real photo uploaded
                    <img
                      src={item.image}
                      alt={item.name}
                      className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ${isLocked ? 'blur-md opacity-40' : ''}`}
                    />
                  ) : (
                    // Discreet luxury VIP silhouette / monogram card (no AI faces!)
                    <div className={`w-full h-full bg-gradient-to-b from-zinc-900 to-zinc-950 flex flex-col items-center justify-center p-6 text-center ${isLocked ? 'blur-sm opacity-50' : ''}`}>
                      <div className="w-20 h-20 rounded-full bg-red-950/60 border border-red-800/60 flex items-center justify-center text-red-500 font-serif font-black text-3xl shadow-inner mb-3">
                        {item.name[0]}
                      </div>
                      <span className="text-sm font-bold text-white font-serif">{item.name}</span>
                      <span className="text-xs text-zinc-400 mt-0.5">{item.details || 'Perfil VIP Agência'}</span>

                      {/* Direct Upload button without link for owner */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRefs.current[item.id]?.click();
                        }}
                        className="mt-4 px-3 py-1.5 bg-zinc-800 hover:bg-red-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-zinc-700"
                        title="Subir sua própria foto sem link"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Colocar Foto Real</span>
                      </button>
                    </div>
                  )}

                  {/* Lock overlay if client is not subscribed */}
                  {isLocked && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[4px] flex flex-col items-center justify-center p-4 text-center z-10">
                      <div className="w-12 h-12 rounded-full bg-red-600/30 border border-red-500/60 flex items-center justify-center text-red-400 mb-2 shadow-lg">
                        <Lock className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Conteúdo VIP Bloqueado
                      </span>
                      <p className="text-[11px] text-zinc-300 mt-1 max-w-[180px]">
                        Requer subscrição de 1 mês via e-Mola
                      </p>
                      <button
                        onClick={onOpenSubscription}
                        className="mt-3 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-md cursor-pointer"
                      >
                        Subscrever Agora
                      </button>
                    </div>
                  )}

                  {/* Badges / Category info */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-zinc-950/80 backdrop-blur-md text-zinc-200 border border-zinc-800/80">
                      {item.category}
                    </span>
                    {item.badge && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-red-600 text-white shadow-sm">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* Exclusive Video Button Overlay if unlocked */}
                  {!isLocked && item.hasVideo && (
                    <button
                      onClick={() => onOpenVideo(item.id)}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-2.5 rounded-full bg-black/75 hover:bg-red-600 text-white text-xs font-bold flex items-center gap-2 border border-white/20 backdrop-blur-md shadow-xl transition-all duration-300 group-hover:scale-110 active:scale-95 cursor-pointer z-20"
                    >
                      <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center">
                        <Play className="w-2.5 h-2.5 fill-white ml-0.5" />
                      </div>
                      <span>Vídeo Exclusivo</span>
                    </button>
                  )}

                  {/* Price Tag Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-baseline justify-between bg-zinc-950/85 backdrop-blur-md px-3 py-2 rounded-xl border border-zinc-800/80 z-20">
                    <span className="text-xs text-zinc-400 font-medium">Cachê / Valor</span>
                    <span className="text-lg font-extrabold text-white font-mono tabular-nums">
                      {item.price.toLocaleString('pt-MZ')} <span className="text-red-500 text-xs font-sans">MZN</span>
                    </span>
                  </div>
                </div>

                {/* Content Container */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">
                      {item.name}
                    </h3>
                    
                    {item.details && (
                      <p className="text-xs text-zinc-400 mt-1 font-medium">
                        {item.details}
                      </p>
                    )}

                    <p className="text-xs text-zinc-400 leading-relaxed mt-2 line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  {/* Actions Area */}
                  <div className="mt-5 pt-3 border-t border-zinc-800/60 space-y-2">
                    {isLocked ? (
                      <button
                        onClick={onOpenSubscription}
                        className="w-full h-12 rounded-xl font-bold text-xs flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-red-400 border border-red-900/60 transition-colors cursor-pointer"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Desbloquear via e-Mola (1 Mês)</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onAddToCart(item)}
                        className={`w-full h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer ${
                          qtyInCart > 0
                            ? 'bg-zinc-800 text-white hover:bg-zinc-700 border border-red-500/50'
                            : 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-md shadow-red-950/40'
                        }`}
                      >
                        {qtyInCart > 0 ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span>Adicionado ({qtyInCart}) · Mais 1</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            <span>Adicionar ao Carrinho</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
};
