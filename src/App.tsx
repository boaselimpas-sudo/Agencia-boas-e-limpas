import { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { MenuSection } from './components/MenuSection.tsx';
import { GallerySection } from './components/GallerySection.tsx';
import { TestimonialsSection } from './components/TestimonialsSection.tsx';
import { LocationSection } from './components/LocationSection.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { Footer } from './components/Footer.tsx';
import { BottomNav } from './components/BottomNav.tsx';
import { CartModal } from './components/CartModal.tsx';
import { AdminModal } from './components/AdminModal.tsx';
import { VideoModal } from './components/VideoModal.tsx';
import { SubscriptionModal } from './components/SubscriptionModal.tsx';
import { AgeGate } from './components/AgeGate.tsx';
import { MenuItem, CartItem, AgencyConfig, GalleryMediaItem, SubscriptionStatus } from './types.ts';
import { INITIAL_AGENCY_CONFIG, INITIAL_MENU_ITEMS, INITIAL_GALLERY_ITEMS } from './data/initialData.ts';
import { saveMediaFile } from './utils/mediaStorage.ts';

export default function App() {
  // Load configuration from localStorage or initial
  const [config, setConfig] = useState<AgencyConfig>(() => {
    try {
      const saved = localStorage.getItem('boas_limpas_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_AGENCY_CONFIG,
          ...parsed,
        };
      }
      return INITIAL_AGENCY_CONFIG;
    } catch {
      return INITIAL_AGENCY_CONFIG;
    }
  });

  // Load subscription status (30 days validity via e-Mola)
  const [subscription, setSubscription] = useState<SubscriptionStatus>(() => {
    try {
      const saved = localStorage.getItem('boas_limpas_sub');
      if (saved) {
        const parsed: SubscriptionStatus = JSON.parse(saved);
        // Check if expired
        if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
          return { isSubscribed: false };
        }
        return parsed;
      }
      return { isSubscribed: false };
    } catch {
      return { isSubscribed: false };
    }
  });

  // Load menu items from localStorage or initial
  const [items, setItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem('boas_limpas_items');
      if (saved) {
        const parsed: MenuItem[] = JSON.parse(saved);
        // If items stored had AI photos, clear them if user wants clean slots for their own photos
        return parsed.map((item) => {
          // If previous image is an AI generated asset path, clear it so user can upload their real photo
          const isAiPhoto = item.image && item.image.includes('/src/assets/images/profile_');
          return {
            ...item,
            image: isAiPhoto ? '' : item.image,
          };
        });
      }
      return [];
    } catch {
      return [];
    }
  });

  // Load site gallery items
  const [galleryItems, setGalleryItems] = useState<GalleryMediaItem[]>(() => {
    try {
      const saved = localStorage.getItem('boas_limpas_gallery');
      if (saved) {
        const parsed: GalleryMediaItem[] = JSON.parse(saved);
        // Filter out AI photos from gallery as requested
        return parsed.filter((g) => !g.url || !g.url.includes('/src/assets/images/profile_'));
      }
      return INITIAL_GALLERY_ITEMS;
    } catch {
      return INITIAL_GALLERY_ITEMS;
    }
  });

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('boas_limpas_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<'items' | 'gallery' | 'config'>('items');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [activeVideoItemId, setActiveVideoItemId] = useState<string | null>(null);

  const handleOpenAdmin = (tab: 'items' | 'gallery' | 'config' = 'items') => {
    setAdminTab(tab);
    setIsAdminOpen(true);
  };

  // Active section for navigation
  const [activeSection, setActiveSection] = useState('inicio');

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('boas_limpas_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  // Sync subscription to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('boas_limpas_sub', JSON.stringify(subscription));
    } catch (e) {
      console.error('Failed to save subscription to localStorage', e);
    }
  }, [subscription]);

  // Automatically expire subscription if 30 days elapsed
  useEffect(() => {
    if (subscription.isSubscribed && subscription.expiresAt && Date.now() > subscription.expiresAt) {
      setSubscription({ isSubscribed: false });
    }
  }, [subscription]);

  const daysRemaining = subscription.expiresAt
    ? Math.max(0, Math.ceil((subscription.expiresAt - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  // Subscription Actions
  const handleActivateSubscription = (phone: string, ref: string) => {
    const newSub: SubscriptionStatus = {
      isSubscribed: true,
      subscribedAt: Date.now(),
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
      customerPhone: phone,
      transactionRef: ref,
    };
    setSubscription(newSub);
  };

  const handleToggleSubscription = () => {
    if (subscription.isSubscribed) {
      setSubscription({ isSubscribed: false });
    } else {
      handleActivateSubscription('860000000', 'ADMIN-TEST');
    }
  };

  // Direct Photo Upload for a specific item (without links!)
  const handleUploadItemPhoto = async (itemId: string, file: File) => {
    try {
      const mediaId = `item-photo-${itemId}-${Date.now()}`;
      const objectUrl = await saveMediaFile(mediaId, file, file.name, 'image');

      const updatedItems = items.map((it) =>
        it.id === itemId ? { ...it, image: objectUrl } : it
      );
      handleSaveItems(updatedItems);

      // Also publish to site gallery automatically!
      const targetItem = items.find((it) => it.id === itemId);
      if (targetItem) {
        const newGalItem: GalleryMediaItem = {
          id: `gal-${Date.now()}`,
          title: `Foto Real de ${targetItem.name}`,
          modelName: targetItem.name,
          type: 'image',
          url: objectUrl,
          price: targetItem.price,
          modelId: itemId,
          uploadedFromDevice: true,
        };
        handleSaveGalleryItems([newGalItem, ...galleryItems]);
      }
    } catch (err) {
      console.error('Failed to upload item photo', err);
    }
  };

  // Cart actions
  const handleAddToCart = (item: MenuItem) => {
    // If not subscribed, prompt for subscription first!
    if (!subscription.isSubscribed) {
      setIsSubscriptionModalOpen(true);
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prevCart.map((ci) =>
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prevCart, { item, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((ci) => {
          if (ci.item.id === itemId) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((ci) => ci.item.id !== itemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Video modal opener
  const handleOpenVideo = (itemIdOrModel: string) => {
    if (!subscription.isSubscribed) {
      setIsSubscriptionModalOpen(true);
      return;
    }

    const match = items.find(
      (it) =>
        it.id === itemIdOrModel ||
        it.name.toLowerCase() === itemIdOrModel.toLowerCase()
    );
    setActiveVideoItemId(match ? match.id : itemIdOrModel);
    setIsVideoModalOpen(true);
  };

  // Admin persistence actions
  const handleSaveItems = (newItems: MenuItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem('boas_limpas_items', JSON.stringify(newItems));
    } catch (e) {
      console.error('Failed to save items to localStorage', e);
    }
  };

  const handleSaveGalleryItems = (newGallery: GalleryMediaItem[]) => {
    setGalleryItems(newGallery);
    try {
      localStorage.setItem('boas_limpas_gallery', JSON.stringify(newGallery));
    } catch (e) {
      console.error('Failed to save gallery to localStorage', e);
    }
  };

  const handleSaveConfig = (newConfig: AgencyConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem('boas_limpas_config', JSON.stringify(newConfig));
    } catch (e) {
      console.error('Failed to save config to localStorage', e);
    }
  };

  const handleResetDefaults = () => {
    setItems(INITIAL_MENU_ITEMS);
    setConfig(INITIAL_AGENCY_CONFIG);
    setGalleryItems(INITIAL_GALLERY_ITEMS);
    setSubscription({ isSubscribed: false });
    try {
      localStorage.removeItem('boas_limpas_items');
      localStorage.removeItem('boas_limpas_config');
      localStorage.removeItem('boas_limpas_gallery');
      localStorage.removeItem('boas_limpas_sub');
    } catch (e) {
      console.error('Failed to reset localStorage', e);
    }
  };

  // Smooth navigation (substituting cardapio -> catalogo, localizacao -> domicilio)
  const handleNavigate = (sectionId: string) => {
    let targetId = sectionId === 'cardapio' ? 'catalogo' : sectionId;
    if (targetId === 'localizacao') {
      targetId = 'domicilio';
    }
    setActiveSection(targetId);
    if (targetId === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(targetId);
      if (el) {
        const headerOffset = 70;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }
  };

  const totalCartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      {/* 18+ Age Gate Verification */}
      <AgeGate />

      {/* Top Header */}
      <Header
        config={config}
        cartCount={totalCartCount}
        isSubscribed={subscription.isSubscribed}
        daysRemaining={daysRemaining}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => handleOpenAdmin('items')}
        onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Section 1: Início (Hero & Apresentação) */}
        <div id="inicio">
          <Hero
            config={config}
            onNavigateToMenu={() => handleNavigate('catalogo')}
            onNavigateToCart={() => setIsCartOpen(true)}
            onNavigateToLocation={() => handleNavigate('domicilio')}
          />
        </div>

        {/* Section 2: Catálogo Completo (com bloqueio e-Mola / M-Pesa de 1000 MT se não subscrito) */}
        <MenuSection
          items={items}
          cart={cart}
          subscription={subscription}
          config={config}
          onAddToCart={handleAddToCart}
          onOpenVideo={handleOpenVideo}
          onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
          onUploadItemPhoto={handleUploadItemPhoto}
          onOpenAdmin={() => handleOpenAdmin('items')}
        />

        {/* Section 3: Galeria VIP de Fotos & Vídeos MP4 (Restrita a subscritos de 1000 MT / 30 dias) */}
        <GallerySection
          galleryItems={galleryItems}
          config={config}
          menuItems={items}
          subscription={subscription}
          onOpenVideo={handleOpenVideo}
          onAddToCart={handleAddToCart}
          onOpenAdmin={() => handleOpenAdmin('gallery')}
          onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
        />

        {/* Section 4: Depoimentos de Clientes Satisfeitos (Aumenta Confiança & Credibilidade) */}
        <TestimonialsSection config={config} />

        {/* Section 5: Atendimento ao Domicílio & Espaço Escolhido pelo Cliente */}
        <LocationSection 
          config={config}
          onNavigateToMenu={() => handleNavigate('catalogo')}
          onOpenCart={() => setIsCartOpen(true)}
        />

        {/* Section 6: Contato & WhatsApp Oficiais */}
        <ContactSection config={config} />
      </main>

      {/* Footer */}
      <Footer
        config={config}
        onNavigate={handleNavigate}
        onOpenAdmin={() => handleOpenAdmin('items')}
      />

      {/* Fixed Mobile Bottom Navigation */}
      <BottomNav
        activeSection={activeSection}
        cartCount={totalCartCount}
        onNavigate={handleNavigate}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Modals */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        config={config}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        items={items}
        config={config}
        galleryItems={galleryItems}
        subscription={subscription}
        initialTab={adminTab}
        onSaveItems={handleSaveItems}
        onSaveConfig={handleSaveConfig}
        onSaveGalleryItems={handleSaveGalleryItems}
        onToggleSubscription={handleToggleSubscription}
        onResetDefaults={handleResetDefaults}
      />

      {/* 1-Month e-Mola Subscription Modal */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        config={config}
        subscription={subscription}
        onActivateSubscription={handleActivateSubscription}
      />

      {/* Exclusive Video Player Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        items={items}
        initialItemId={activeVideoItemId}
        config={config}
        onAddToCart={handleAddToCart}
        onOpenCart={() => {
          setIsVideoModalOpen(false);
          setIsCartOpen(true);
        }}
      />
    </div>
  );
}
