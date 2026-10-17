import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  X, Plus, Edit2, Trash2, RotateCcw, Save, ShieldAlert, Check, 
  AlertTriangle, Upload, Video, Image as ImageIcon, Play, Sparkles, 
  CreditCard, Search, Copy, Eye, CheckCircle2, Film, Lock, Key, EyeOff, ShieldCheck,
  QrCode, Smartphone, Wallet
} from 'lucide-react';
import { MenuItem, AgencyConfig, GalleryMediaItem, SubscriptionStatus } from '../types.ts';
import { PRESET_VIDEOS } from '../data/initialData.ts';
import { saveMediaFile } from '../utils/mediaStorage.ts';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: MenuItem[];
  config: AgencyConfig;
  galleryItems: GalleryMediaItem[];
  subscription: SubscriptionStatus;
  initialTab?: 'items' | 'gallery' | 'config';
  onSaveItems: (newItems: MenuItem[]) => void;
  onSaveConfig: (newConfig: AgencyConfig) => void;
  onSaveGalleryItems: (newGalleryItems: GalleryMediaItem[]) => void;
  onToggleSubscription: () => void;
  onResetDefaults: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  items,
  config,
  galleryItems,
  subscription,
  initialTab = 'items',
  onSaveItems,
  onSaveConfig,
  onSaveGalleryItems,
  onToggleSubscription,
  onResetDefaults,
}) => {
  const ADMIN_PASSCODE = 'boas1014';

// Admin Passcode Protection
const [isAuthenticated, setIsAuthenticated] = useState(() => {
  try {
    return sessionStorage.getItem('boas_admin_auth') === 'true';
  } catch {
    return false;
  }
});
  const [passcodeError, setPasscodeError] = useState<string | null>(null);
  const [showPasscode, setShowPasscode] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<'items' | 'gallery' | 'config'>(initialTab);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [agencyForm, setAgencyForm] = useState<AgencyConfig>(config);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  
  // Search & Filters inside Admin
  const [itemSearchQuery, setItemSearchQuery] = useState<string>('');
  const [itemCategoryFilter, setItemCategoryFilter] = useState<string>('all');
  const [mediaFilterType, setMediaFilterType] = useState<'all' | 'video' | 'image'>('all');
  const [mediaSearchQuery, setMediaSearchQuery] = useState<string>('');

  // Video / Photo preview modal inside Admin
  const [adminMediaPreview, setAdminMediaPreview] = useState<{
    url: string;
    type: 'video' | 'image';
    title: string;
    modelName?: string;
  } | null>(null);

  // In-app confirmation states
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [galleryItemToDelete, setGalleryItemToDelete] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // File upload input refs
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const directGalleryMediaRef = useRef<HTMLInputElement>(null);
  const quickPhotoInputRef = useRef<HTMLInputElement>(null);
  const quickUploadTargetItemId = useRef<string | null>(null);
  const emolaQrInputRef = useRef<HTMLInputElement>(null);
  const mpesaQrInputRef = useRef<HTMLInputElement>(null);

  // When modal opens, require password verification before granting access
  useEffect(() => {
    if (isOpen) {
      if (initialTab) {
        setActiveTab(initialTab);
      }
      setAgencyForm(config);
      setIsAuthenticated(false);
      setPasscode('');
      setPasscodeError(null);
    }
  }, [isOpen, initialTab, config]);

  // Form for item creation/editing
  const [itemForm, setItemForm] = useState<Partial<MenuItem>>({
    name: '',
    category: 'Garotas de programa',
    price: 3500,
    description: '',
    details: '',
    image: '',
    badge: 'VIP',
    available: true,
    hasVideo: true,
    videoDuration: '0:32',
    videoUrl: PRESET_VIDEOS[0]?.url || '',
  });

  // Form for direct gallery upload
  const [galleryUploadForm, setGalleryUploadForm] = useState<{
    modelName: string;
    title: string;
    type: 'video' | 'image';
    fileUrl: string;
    duration: string;
    price: number;
  }>({
    modelName: items[0]?.name || 'Sheila',
    title: 'Novo Ensaio Exclusivo',
    type: 'video',
    fileUrl: '',
    duration: '0:30',
    price: 3500,
  });

  // Unique categories for filtering
  const allCategories = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return ['all', ...Array.from(set)];
  }, [items]);

  // Filtered items list for Admin Cardápio tab
  const filteredAdminItems = useMemo(() => {
    return items.filter((item) => {
      const matchCat = itemCategoryFilter === 'all' || item.category === itemCategoryFilter;
      const matchSearch =
        item.name.toLowerCase().includes(itemSearchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(itemSearchQuery.toLowerCase()) ||
        (item.details && item.details.toLowerCase().includes(itemSearchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [items, itemCategoryFilter, itemSearchQuery]);

  // Filtered gallery media list
  const filteredGalleryItems = useMemo(() => {
    return galleryItems.filter((item) => {
      const matchType = mediaFilterType === 'all' || item.type === mediaFilterType;
      const matchSearch =
        item.modelName.toLowerCase().includes(mediaSearchQuery.toLowerCase()) ||
        item.title.toLowerCase().includes(mediaSearchQuery.toLowerCase());
      return matchType && matchSearch;
    });
  }, [galleryItems, mediaFilterType, mediaSearchQuery]);

  if (!isOpen) return null;

  const showNotification = (msg: string) => {
    setSaveSuccess(msg);
    setTimeout(() => setSaveSuccess(null), 3500);
  };

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === ADMIN_PASSCODE) {
      setIsAuthenticated(true);
      setPasscodeError(null);
      setPasscode('');
      try {
        sessionStorage.setItem('boas_admin_auth', 'true');
      } catch (err) {
        console.error(err);
      }
      showNotification('Senha correta! Acesso liberado à gestão de cardápio, galeria e configurações.');
    } else {
      setPasscodeError("Senha incorreta. Digite a senha 'boas7715' para acessar.");
    }
  };

  const handleLogoutAdmin = () => {
    setIsAuthenticated(false);
    setPasscode('');
    try {
      sessionStorage.removeItem('boas_admin_auth');
    } catch (err) {
      console.error(err);
    }
    showNotification('Sessão de administrador encerrada.');
  };

  const handleStartCreate = () => {
    setIsCreating(true);
    setEditingItem(null);
    setItemForm({
      name: '',
      category: 'Garotas de programa',
      price: 3500,
      description: '',
      details: '',
      image: '',
      badge: 'VIP',
      available: true,
      hasVideo: true,
      videoDuration: '0:30',
      videoUrl: PRESET_VIDEOS[0]?.url || '',
    });
  };

  const handleStartEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsCreating(false);
    setItemForm({ ...item });
  };

  const handleDuplicateItem = (item: MenuItem) => {
    const duplicated: MenuItem = {
      ...item,
      id: `garota-${Date.now()}`,
      name: `${item.name} (Cópia)`,
    };
    onSaveItems([duplicated, ...items]);
    showNotification(`Perfil duplicado como "${duplicated.name}". Você pode editá-lo agora!`);
  };

  const handleToggleItemAvailability = (id: string) => {
    const updated = items.map((it) => (it.id === id ? { ...it, available: !it.available } : it));
    onSaveItems(updated);
    const target = updated.find((it) => it.id === id);
    showNotification(`Status de ${target?.name} alterado para: ${target?.available ? 'Disponível' : 'Ocupada / Indisponível'}`);
  };

  // Direct Photo Upload for editing item
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const mediaId = `photo-${Date.now()}`;
      const objectUrl = await saveMediaFile(mediaId, file, file.name, 'image');
      setItemForm((prev) => ({ ...prev, image: objectUrl, mediaStorageId: mediaId }));
      showNotification('Foto real selecionada do seu celular com sucesso!');
    } catch (err) {
      console.error(err);
      showNotification('Erro ao processar foto.');
    } finally {
      setIsUploading(false);
    }
  };

  // Quick Photo upload directly from the list item
  const handleTriggerQuickPhotoUpload = (itemId: string) => {
    quickUploadTargetItemId.current = itemId;
    quickPhotoInputRef.current?.click();
  };

  const handleQuickPhotoSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const itemId = quickUploadTargetItemId.current;
    if (!file || !itemId) return;

    setIsUploading(true);
    try {
      const mediaId = `photo-${Date.now()}`;
      const objectUrl = await saveMediaFile(mediaId, file, file.name, 'image');
      const updated = items.map((it) => (it.id === itemId ? { ...it, image: objectUrl, mediaStorageId: mediaId } : it));
      onSaveItems(updated);

      // Also add to gallery so it's visible in VIP gallery
      const targetItem = items.find((i) => i.id === itemId);
      if (targetItem) {
        const galItem: GalleryMediaItem = {
          id: `gal-${Date.now()}`,
          title: `Foto Oficial ${targetItem.name}`,
          modelName: targetItem.name,
          type: 'image',
          url: objectUrl,
          price: targetItem.price,
          modelId: targetItem.id,
          uploadedFromDevice: true,
        };
        onSaveGalleryItems([galItem, ...galleryItems]);
      }

      showNotification(`Foto de ${targetItem?.name || 'item'} atualizada com sucesso!`);
    } catch (err) {
      console.error(err);
      showNotification('Erro ao salvar foto.');
    } finally {
      setIsUploading(false);
      quickUploadTargetItemId.current = null;
      if (quickPhotoInputRef.current) quickPhotoInputRef.current.value = '';
    }
  };

  // Direct Video Upload (.mp4)
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const mediaId = `video-${Date.now()}`;
      const objectUrl = await saveMediaFile(mediaId, file, file.name, 'video');
      setItemForm((prev) => ({ ...prev, videoUrl: objectUrl, hasVideo: true, mediaStorageId: mediaId }));
      showNotification('Vídeo MP4 exclusivo carregado do seu celular!');
    } catch (err) {
      console.error(err);
      showNotification('Erro ao processar arquivo de vídeo.');
    } finally {
      setIsUploading(false);
    }
  };

  // Direct Gallery Media Upload from Device (Photo or MP4)
  const handleDirectGalleryMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const isVid = file.type.startsWith('video') || file.name.toLowerCase().endsWith('.mp4');
      const mediaId = `gal-${Date.now()}`;
      const objectUrl = await saveMediaFile(mediaId, file, file.name, isVid ? 'video' : 'image');

      setGalleryUploadForm((prev) => ({
        ...prev,
        type: isVid ? 'video' : 'image',
        fileUrl: objectUrl,
        title: file.name.replace(/\.[^/.]+$/, ''),
      }));

      showNotification(`${isVid ? 'Vídeo MP4' : 'Foto'} selecionado do seu telemóvel! Preencha os detalhes e clique em Publicar.`);
    } catch (err) {
      console.error(err);
      showNotification('Erro ao processar mídia.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveDirectGalleryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryUploadForm.fileUrl) {
      showNotification('Selecione primeiro uma foto ou vídeo MP4 do seu telemóvel.');
      return;
    }

    const newItem: GalleryMediaItem = {
      id: `gal-user-${Date.now()}`,
      title: galleryUploadForm.title || `${galleryUploadForm.type === 'video' ? 'Vídeo Exclusivo' : 'Foto de Ensaio'} ${galleryUploadForm.modelName}`,
      modelName: galleryUploadForm.modelName,
      type: galleryUploadForm.type,
      url: galleryUploadForm.fileUrl,
      thumbnailUrl: galleryUploadForm.type === 'image' ? galleryUploadForm.fileUrl : undefined,
      duration: galleryUploadForm.type === 'video' ? galleryUploadForm.duration : undefined,
      price: galleryUploadForm.price,
      uploadedFromDevice: true,
    };

    onSaveGalleryItems([newItem, ...galleryItems]);
    showNotification('Nova mídia publicada na Galeria VIP com sucesso!');
    setGalleryUploadForm({
      modelName: items[0]?.name || 'Sheila',
      title: 'Novo Ensaio Exclusivo',
      type: 'video',
      fileUrl: '',
      duration: '0:30',
      price: 3500,
    });
  };

  // Handle Banner Upload
  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const mediaId = `banner-${Date.now()}`;
      const objectUrl = await saveMediaFile(mediaId, file, file.name, 'image');
      setAgencyForm((prev) => ({ ...prev, heroImage: objectUrl }));
      showNotification('Banner da agência atualizado com sua foto real!');
    } catch (err) {
      console.error(err);
      showNotification('Erro ao processar imagem do banner.');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle e-Mola Receiving / QR Code Image Upload
  const handleEmolaQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const mediaId = `emola-qr-${Date.now()}`;
      const objectUrl = await saveMediaFile(mediaId, file, file.name, 'image');
      setAgencyForm((prev) => ({ ...prev, emolaQrImage: objectUrl }));
      showNotification('Imagem de recebimento do e-Mola atualizada com sucesso!');
    } catch (err) {
      console.error(err);
      showNotification('Erro ao processar imagem do e-Mola.');
    } finally {
      setIsUploading(false);
      if (emolaQrInputRef.current) emolaQrInputRef.current.value = '';
    }
  };

  // Handle M-Pesa Receiving / QR Code Image Upload
  const handleMpesaQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const mediaId = `mpesa-qr-${Date.now()}`;
      const objectUrl = await saveMediaFile(mediaId, file, file.name, 'image');
      setAgencyForm((prev) => ({ ...prev, mpesaQrImage: objectUrl }));
      showNotification('Imagem de recebimento do M-Pesa atualizada com sucesso!');
    } catch (err) {
      console.error(err);
      showNotification('Erro ao processar imagem do M-Pesa.');
    } finally {
      setIsUploading(false);
      if (mpesaQrInputRef.current) mpesaQrInputRef.current.value = '';
    }
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemForm.name || !itemForm.price) {
      showNotification('Informe ao menos o nome e o preço do item.');
      return;
    }

    if (isCreating) {
      const newItem: MenuItem = {
        id: `item-${Date.now()}`,
        name: itemForm.name || '',
        category: itemForm.category || 'Garotas de programa',
        price: Number(itemForm.price) || 0,
        description: itemForm.description || '',
        details: itemForm.details || '',
        image: itemForm.image || '',
        badge: itemForm.badge,
        available: itemForm.available !== undefined ? itemForm.available : true,
        hasVideo: !!itemForm.hasVideo,
        videoDuration: itemForm.videoDuration || '0:30',
        videoUrl: itemForm.videoUrl || '',
      };
      onSaveItems([newItem, ...items]);

      if (newItem.image) {
        const galPhoto: GalleryMediaItem = {
          id: `gal-auto-img-${Date.now()}`,
          title: `Foto Oficial ${newItem.name}`,
          modelName: newItem.name,
          type: 'image',
          url: newItem.image,
          price: newItem.price,
          modelId: newItem.id,
          uploadedFromDevice: true,
        };
        onSaveGalleryItems([galPhoto, ...galleryItems]);
      }

      showNotification('Novo perfil salvo no cardápio com sucesso!');
    } else if (editingItem) {
      const updated = items.map((it) =>
        it.id === editingItem.id
          ? {
              ...it,
              name: itemForm.name || it.name,
              category: itemForm.category || it.category,
              price: Number(itemForm.price) || it.price,
              description: itemForm.description || it.description,
              details: itemForm.details || it.details,
              image: itemForm.image !== undefined ? itemForm.image : it.image,
              badge: itemForm.badge,
              available: itemForm.available !== undefined ? itemForm.available : it.available,
              hasVideo: itemForm.hasVideo !== undefined ? itemForm.hasVideo : it.hasVideo,
              videoDuration: itemForm.videoDuration || it.videoDuration,
              videoUrl: itemForm.videoUrl || it.videoUrl,
            }
          : it
      );
      onSaveItems(updated);
      showNotification('Perfil e mídias atualizados com sucesso!');
    }

    setEditingItem(null);
    setIsCreating(false);
  };

  const executeDeleteItem = (id: string) => {
    onSaveItems(items.filter((it) => it.id !== id));
    setItemToDelete(null);
    showNotification('Perfil excluído do catálogo.');
  };

  const executeDeleteGalleryItem = (id: string) => {
    onSaveGalleryItems(galleryItems.filter((it) => it.id !== id));
    setGalleryItemToDelete(null);
    showNotification('Mídia removida da galeria.');
  };

  const executeResetDefaults = () => {
    onResetDefaults();
    setShowResetConfirm(false);
    showNotification('Catálogo e configurações restaurados para o padrão original!');
  };

  const handleSaveAgencyConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(agencyForm);
    showNotification('Configurações da agência, e-Mola e WhatsApp salvas!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Hidden input for quick photo replacement directly from item card */}
      <input
        ref={quickPhotoInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleQuickPhotoSelected}
      />

      {/* Hidden inputs for payment QR Code / Receiving images */}
      <input
        ref={emolaQrInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleEmolaQrUpload}
      />
      <input
        ref={mpesaQrInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleMpesaQrUpload}
      />

      <div className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Header Bar */}
        <div className="px-5 sm:px-6 py-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-600/40 flex items-center justify-center text-red-500">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Painel de Administração da Agência
                </h2>
                {isAuthenticated ? (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Admin Autenticado (boas7715)
                  </span>
                ) : (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-red-600 text-white flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Protegido por Código
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400">
                {isAuthenticated
                  ? 'Você está autenticado como administrador. Troque fotos, vídeos MP4 ou adicione novas garotas.'
                  : 'Acesso exclusivo para o administrador. Digite o código de segurança para gerenciar mídias e cardápio.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogoutAdmin}
                className="px-2.5 py-1.5 text-xs font-semibold text-zinc-400 hover:text-red-400 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                title="Bloquear painel e sair do modo administrador"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Bloquear / Sair</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="Fechar Painel Admin"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

          
  if (!isAuthenticated) { return (
          <div className="p-6 sm:p-12 flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto my-auto animate-in fade-in duration-200">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-700 flex items-center justify-center text-white shadow-xl shadow-red-950/60">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold text-red-500 uppercase tracking-widest">
                Painel Administrativo
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                Verificação de Senha
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">
                Digite a senha de administrador para acessar a gestão de cardápio, galeria de mídias e configurações.
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit}>
  <input
    type="password"
    value={passwordInput}
    onChange={(e) => setPasswordInput(e.target.value)}
    placeholder="Digite a senha"
    className="w-full p-3 border rounded-lg mb-4 pl-10"
    autoFocus
    required
  />
  <div className="flex gap-2">
    <button type="button" onClick={onClose} className="flex-1 py-3 bg-gray-200 rounded-lg">
      Cancelar
    </button>
    <button type="submit" className="flex-1 py-3 bg-red-600 text-white rounded-lg">
      Entrar
    </button>
  </div>
</form>
</div>
);
}

return (
  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
      <div className="flex border-b">
        <button
                className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-2 ${
                  activeTab === 'items'
                    ? 'border-red-600 text-white'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Sparkles className="w-4 h-4 text-red-500" />
                <span>Gestão do Cardápio ({items.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('gallery')}
                className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-2 ${
                  activeTab === 'gallery'
                    ? 'border-red-600 text-white'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Video className="w-4 h-4 text-red-500" />
                <span>Gestão da Galeria ({galleryItems.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('config')}
                className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-2 ${
                  activeTab === 'config'
                    ? 'border-red-600 text-white'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <CreditCard className="w-4 h-4 text-red-500" />
                <span>Configurações da Agência</span>
              </button>
            </div>

        {/* Feedback Alert Toast */}
        {saveSuccess && (
          <div className="mx-5 sm:mx-6 mt-3 p-3 bg-emerald-950/90 border border-emerald-800 rounded-xl text-emerald-200 text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{saveSuccess}</span>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* TAB 1: GERENCIAR CARDÁPIO & PERFIS */}
          {activeTab === 'items' && (
            <div className="space-y-5">
              
              {/* If Creating or Editing an Item */}
              {isCreating || editingItem ? (
                <form onSubmit={handleSaveItem} className="p-5 sm:p-6 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-6">
                  
                  {/* Form Header */}
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-500 flex items-center justify-center">
                        <Edit2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">
                          {isCreating ? 'Adicionar Novo Perfil ao Cardápio' : `Editando Perfil: ${editingItem?.name}`}
                        </h3>
                        <p className="text-xs text-zinc-400">
                          Preencha as informações, adicione a foto real e o vídeo MP4 exclusivo
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => { setIsCreating(false); setEditingItem(null); }}
                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Voltar à Lista
                    </button>
                  </div>

                  {/* MEDIA UPLOAD SECTION: FOTO REAL & VÍDEO EXCLUSIVO */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Foto Real Direct Upload */}
                    <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                            <ImageIcon className="w-4 h-4 text-red-500" />
                            <span>Foto Real (Upload Sem Link)</span>
                          </label>
                          <span className="text-[10px] text-zinc-400">Direto da câmera/galeria</span>
                        </div>

                        <div className="flex gap-4 items-center">
                          {/* Image preview frame */}
                          <div className="relative w-24 h-32 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-700 shrink-0 flex items-center justify-center group">
                            {itemForm.image ? (
                              <>
                                <img
                                  src={itemForm.image}
                                  alt="Foto do perfil"
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => setAdminMediaPreview({ url: itemForm.image!, type: 'image', title: itemForm.name || 'Foto Real' })}
                                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                                  title="Ver Ampliado"
                                >
                                  <Eye className="w-5 h-5" />
                                </button>
                              </>
                            ) : (
                              <div className="text-center p-2 text-zinc-500 text-xs">
                                <ImageIcon className="w-7 h-7 mx-auto mb-1 opacity-50" />
                                <span className="text-[10px]">Sem foto</span>
                              </div>
                            )}
                          </div>

                          <div className="flex-1 space-y-2">
                            <input
                              ref={photoInputRef}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handlePhotoUpload}
                            />

                            <button
                              type="button"
                              disabled={isUploading}
                              onClick={() => photoInputRef.current?.click()}
                              className="w-full px-3.5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>{isUploading ? 'Processando foto...' : 'Escolher Foto do Celular/PC'}</span>
                            </button>

                            {itemForm.image && (
                              <button
                                type="button"
                                onClick={() => setItemForm((prev) => ({ ...prev, image: '' }))}
                                className="w-full px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg text-xs border border-zinc-800 cursor-pointer"
                              >
                                Remover Foto
                              </button>
                            )}

                            <p className="text-[10px] text-zinc-400 leading-tight">
                              Arquivos são salvos com segurança no armazenamento local de alta capacidade do navegador.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Vídeo MP4 Direct Upload */}
                    <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                            <Video className="w-4 h-4 text-red-500" />
                            <span>Vídeo Exclusivo (.mp4)</span>
                          </label>
                          <label className="flex items-center gap-1.5 text-xs text-zinc-300 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={itemForm.hasVideo || false}
                              onChange={(e) => setItemForm({ ...itemForm, hasVideo: e.target.checked })}
                              className="rounded text-red-600 focus:ring-red-600"
                            />
                            <span>Ativar Vídeo</span>
                          </label>
                        </div>

                        {itemForm.hasVideo ? (
                          <div className="space-y-2.5">
                            <input
                              ref={videoInputRef}
                              type="file"
                              accept="video/mp4,video/*"
                              className="hidden"
                              onChange={handleVideoUpload}
                            />

                            <div className="flex gap-2">
                              <button
                                type="button"
                                disabled={isUploading}
                                onClick={() => videoInputRef.current?.click()}
                                className="flex-1 px-3.5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                <span>{isUploading ? 'Processando vídeo...' : 'Subir Vídeo .MP4'}</span>
                              </button>

                              {itemForm.videoUrl && (
                                <button
                                  type="button"
                                  onClick={() => setAdminMediaPreview({ url: itemForm.videoUrl!, type: 'video', title: itemForm.name || 'Vídeo Exclusivo' })}
                                  className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                                  title="Assistir Vídeo de Teste"
                                >
                                  <Play className="w-3.5 h-3.5 fill-white" />
                                  <span>Testar</span>
                                </button>
                              )}
                            </div>

                            <div className="flex items-center gap-2 pt-1">
                              <label className="text-xs text-zinc-400 whitespace-nowrap">Duração do Reel:</label>
                              <input
                                type="text"
                                value={itemForm.videoDuration || '0:30'}
                                onChange={(e) => setItemForm({ ...itemForm, videoDuration: e.target.value })}
                                className="w-24 px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white font-mono text-center"
                                placeholder="0:30"
                              />
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-zinc-500 py-4 text-center">
                            Marque a opção "Ativar Vídeo" acima para habilitar o upload de vídeo MP4 para este perfil.
                          </p>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* FORM FIELDS: TEXT & PRICING */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-zinc-300 font-bold mb-1">Nome / Identificação *</label>
                      <input
                        type="text"
                        required
                        value={itemForm.name || ''}
                        onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-red-600"
                        placeholder="Ex: Sheila"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-300 font-bold mb-1">Categoria *</label>
                      <input
                        type="text"
                        required
                        value={itemForm.category || 'Garotas de programa'}
                        onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-red-600"
                        placeholder="Garotas de programa, Bebidas VIP..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-300 font-bold mb-1">Preço em Meticais (MZN) *</label>
                      <input
                        type="number"
                        required
                        value={itemForm.price || 3500}
                        onChange={(e) => setItemForm({ ...itemForm, price: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-red-600"
                        placeholder="3500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-zinc-300 font-bold mb-1">Etiqueta de Destaque</label>
                      <input
                        type="text"
                        value={itemForm.badge || ''}
                        onChange={(e) => setItemForm({ ...itemForm, badge: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-red-600"
                        placeholder="VIP, Destaque, Novidade..."
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs text-zinc-300 font-bold mb-1">Disponibilidade Imediata</label>
                      <div className="flex items-center gap-3 h-10 px-3 bg-zinc-950 border border-zinc-800 rounded-lg">
                        <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                          <input
                            type="radio"
                            name="availability"
                            checked={itemForm.available === true}
                            onChange={() => setItemForm({ ...itemForm, available: true })}
                            className="text-emerald-500 focus:ring-emerald-500"
                          />
                          <span className="text-emerald-400 font-bold">Disponível para Agendamento</span>
                        </label>

                        <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer ml-3">
                          <input
                            type="radio"
                            name="availability"
                            checked={itemForm.available === false}
                            onChange={() => setItemForm({ ...itemForm, available: false })}
                            className="text-amber-500 focus:ring-amber-500"
                          />
                          <span className="text-amber-400 font-bold">Ocupada / Indisponível</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-300 font-bold mb-1">
                      Detalhes Rápidos (Idade, Altura, Região de Maputo)
                    </label>
                    <input
                      type="text"
                      value={itemForm.details || ''}
                      onChange={(e) => setItemForm({ ...itemForm, details: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-red-600"
                      placeholder="Ex: 23 anos · 1.68m · Atendimento em Maputo e Matola"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-300 font-bold mb-1">Descrição do Atendimento</label>
                    <textarea
                      rows={2}
                      value={itemForm.description || ''}
                      onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white resize-none focus:outline-none focus:border-red-600"
                      placeholder="Descrição detalhada sobre os serviços prestados, simpatia e discrição..."
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                    <button
                      type="button"
                      onClick={() => { setIsCreating(false); setEditingItem(null); }}
                      className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-xl cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-red-950 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Salvar Perfil no Cardápio</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Cardápio Items List & Toolbars */
                <div className="space-y-4">
                  
                  {/* Top Action & Search Bar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1">
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={itemSearchQuery}
                          onChange={(e) => setItemSearchQuery(e.target.value)}
                          placeholder="Buscar no cardápio por nome ou categoria..."
                          className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-600"
                        />
                      </div>

                      <select
                        value={itemCategoryFilter}
                        onChange={(e) => setItemCategoryFilter(e.target.value)}
                        className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-300 cursor-pointer focus:outline-none"
                      >
                        {allCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat === 'all' ? 'Todas as Categorias' : cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={handleStartCreate}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-red-950 cursor-pointer whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Adicionar Novo Perfil</span>
                    </button>
                  </div>

                  {/* Inline Delete Confirmation */}
                  {itemToDelete && (
                    <div className="p-3 bg-red-950/80 border border-red-800 rounded-xl flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 text-red-200">
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                        <span>Confirmar exclusão definitiva deste item do cardápio?</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setItemToDelete(null)}
                          className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md font-semibold cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => executeDeleteItem(itemToDelete)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md font-bold cursor-pointer"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Items Grid */}
                  <div className="space-y-2.5">
                    {filteredAdminItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 bg-zinc-900 border border-zinc-800/90 hover:border-zinc-700 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors"
                      >
                        {/* Left: Thumbnail & Info */}
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {/* Photo or Monogram */}
                          <div className="relative shrink-0">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-14 h-16 rounded-lg object-cover bg-zinc-950 border border-zinc-800 cursor-pointer"
                                onClick={() => setAdminMediaPreview({ url: item.image!, type: 'image', title: item.name })}
                                title="Clique para ampliar"
                              />
                            ) : (
                              <div className="w-14 h-16 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-red-500 font-bold font-serif text-lg">
                                {item.name[0]}
                              </div>
                            )}

                            {item.hasVideo && (
                              <button
                                onClick={() => item.videoUrl && setAdminMediaPreview({ url: item.videoUrl, type: 'video', title: item.name })}
                                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center border border-zinc-950 shadow cursor-pointer"
                                title="Assistir vídeo de teste"
                              >
                                <Play className="w-2.5 h-2.5 fill-white ml-0.5" />
                              </button>
                            )}
                          </div>

                          {/* Data info */}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-bold text-white truncate">{item.name}</h4>
                              {item.badge && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-600/30 text-red-300 border border-red-800/50 font-bold">
                                  {item.badge}
                                </span>
                              )}
                              <button
                                onClick={() => handleToggleItemAvailability(item.id)}
                                className={`text-[10px] px-2 py-0.5 rounded font-bold cursor-pointer border transition-colors ${
                                  item.available !== false
                                    ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                                    : 'bg-amber-950/80 text-amber-400 border-amber-800'
                                }`}
                                title="Clique para alternar disponibilidade"
                              >
                                {item.available !== false ? '● Disponível' : '○ Ocupada'}
                              </button>
                            </div>

                            <p className="text-xs font-mono text-red-400 font-bold mt-0.5">
                              {item.price.toLocaleString('pt-MZ')} MZN
                            </p>
                            <p className="text-[11px] text-zinc-400 truncate max-w-md">
                              {item.category} {item.details ? `· ${item.details}` : ''}
                            </p>
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-zinc-800">
                          {/* Quick Photo Upload Button */}
                          <button
                            onClick={() => handleTriggerQuickPhotoUpload(item.id)}
                            className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer border border-zinc-700"
                            title="Subir foto real do telemóvel para este perfil"
                          >
                            <Upload className="w-3.5 h-3.5 text-red-400" />
                            <span>{item.image ? 'Trocar Foto' : 'Pôr Foto'}</span>
                          </button>

                          {/* Edit Details */}
                          <button
                            onClick={() => handleStartEdit(item)}
                            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                            title="Editar Dados e Vídeo"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Duplicate Item */}
                          <button
                            onClick={() => handleDuplicateItem(item)}
                            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                            title="Duplicar Perfil"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          {/* Delete Item */}
                          <button
                            onClick={() => setItemToDelete(item.id)}
                            className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                            title="Excluir Perfil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

            </div>
          )}

          {/* TAB 2: CENTRAL DE MÍDIAS (FOTOS & VÍDEOS MP4) */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              
              {/* Device Upload Banner Box */}
              <div className="p-5 bg-zinc-900 border border-red-900/40 rounded-2xl space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      <Upload className="w-4 h-4 text-red-500" />
                      <span>Subir Fotos Reais ou Vídeos MP4 do Telemóvel/PC (Sem Link)</span>
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      Selecione arquivos diretamente da memória do seu celular para publicar na Galeria VIP e associar às garotas.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSaveDirectGalleryItem} className="space-y-4 pt-1">
                  <input
                    ref={directGalleryMediaRef}
                    type="file"
                    accept="image/*,video/mp4,video/*"
                    className="hidden"
                    onChange={handleDirectGalleryMediaUpload}
                  />

                  {/* Pick file area */}
                  <div className="flex flex-col sm:flex-row gap-4 items-center p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => directGalleryMediaRef.current?.click()}
                      className="w-full sm:w-auto px-5 py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-950 cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{isUploading ? 'Processando arquivo...' : 'Escolher Foto ou Vídeo .MP4'}</span>
                    </button>

                    <div className="flex-1 text-center sm:text-left truncate">
                      {galleryUploadForm.fileUrl ? (
                        <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold truncate">
                          <Check className="w-4 h-4 shrink-0" />
                          <span className="truncate">
                            Arquivo selecionado: ({galleryUploadForm.type === 'video' ? 'Vídeo MP4' : 'Foto de Ensaio'})
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-zinc-500">Nenhum arquivo selecionado</span>
                      )}
                    </div>
                  </div>

                  {/* Fields if file is picked */}
                  {galleryUploadForm.fileUrl && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-zinc-950 rounded-xl border border-zinc-800 animate-in fade-in duration-200">
                      <div>
                        <label className="block text-xs text-zinc-400 font-bold mb-1">Nome da Garota / Modelo *</label>
                        <input
                          type="text"
                          required
                          value={galleryUploadForm.modelName}
                          onChange={(e) => setGalleryUploadForm({ ...galleryUploadForm, modelName: e.target.value })}
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white"
                          placeholder="Ex: Sheila, Vanessa..."
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-zinc-400 font-bold mb-1">Título da Mídia</label>
                        <input
                          type="text"
                          value={galleryUploadForm.title}
                          onChange={(e) => setGalleryUploadForm({ ...galleryUploadForm, title: e.target.value })}
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white"
                          placeholder="Ex: Ensaio VIP, Apresentação..."
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-zinc-400 font-bold mb-1">Duração (se for vídeo)</label>
                        <input
                          type="text"
                          value={galleryUploadForm.duration}
                          onChange={(e) => setGalleryUploadForm({ ...galleryUploadForm, duration: e.target.value })}
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white font-mono"
                          placeholder="Ex: 0:30"
                        />
                      </div>

                      <div className="sm:col-span-3 flex justify-end gap-2 pt-2">
                        {galleryUploadForm.type === 'video' && (
                          <button
                            type="button"
                            onClick={() => setAdminMediaPreview({ url: galleryUploadForm.fileUrl, type: 'video', title: galleryUploadForm.title, modelName: galleryUploadForm.modelName })}
                            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-white" />
                            <span>Testar Vídeo</span>
                          </button>
                        )}
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-950 cursor-pointer"
                        >
                          <Save className="w-4 h-4" />
                          <span>Publicar Mídia na Galeria VIP</span>
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>

              {/* Gallery Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  <button
                    onClick={() => setMediaFilterType('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
                      mediaFilterType === 'all'
                        ? 'bg-red-600 text-white'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    Todas ({galleryItems.length})
                  </button>
                  <button
                    onClick={() => setMediaFilterType('video')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1.5 ${
                      mediaFilterType === 'video'
                        ? 'bg-red-600 text-white'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    <Film className="w-3 h-3" />
                    <span>Vídeos MP4 ({galleryItems.filter((g) => g.type === 'video').length})</span>
                  </button>
                  <button
                    onClick={() => setMediaFilterType('image')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1.5 ${
                      mediaFilterType === 'image'
                        ? 'bg-red-600 text-white'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    <ImageIcon className="w-3 h-3" />
                    <span>Fotos de Ensaio ({galleryItems.filter((g) => g.type === 'image').length})</span>
                  </button>
                </div>

                <div className="relative w-full sm:w-60">
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={mediaSearchQuery}
                    onChange={(e) => setMediaSearchQuery(e.target.value)}
                    placeholder="Buscar por garota ou título..."
                    className="w-full pl-8 pr-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Inline Delete Gallery Item Alert */}
              {galleryItemToDelete && (
                <div className="p-3 bg-red-950/80 border border-red-800 rounded-xl flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-red-200">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>Confirmar remoção desta mídia da galeria pública do site?</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setGalleryItemToDelete(null)}
                      className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md font-semibold cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => executeDeleteGalleryItem(galleryItemToDelete)}
                      className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md font-bold cursor-pointer"
                    >
                      Remover Mídia
                    </button>
                  </div>
                </div>
              )}

              {/* Gallery Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredGalleryItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-between gap-3 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Thumbnail with play trigger */}
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-zinc-950 border border-zinc-800 shrink-0 flex items-center justify-center">
                        {item.thumbnailUrl || (item.type === 'image' && item.url) ? (
                          <img
                            src={item.thumbnailUrl || item.url}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-zinc-950 flex items-center justify-center text-red-500 font-bold">
                            {item.modelName[0]}
                          </div>
                        )}

                        {item.type === 'video' && (
                          <button
                            onClick={() => setAdminMediaPreview({ url: item.url, type: 'video', title: item.title, modelName: item.modelName })}
                            className="absolute inset-0 bg-black/40 flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer"
                            title="Assistir Vídeo"
                          >
                            <Play className="w-4 h-4 fill-white" />
                          </button>
                        )}
                        {item.type === 'image' && (
                          <button
                            onClick={() => setAdminMediaPreview({ url: item.url, type: 'image', title: item.title, modelName: item.modelName })}
                            className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                            title="Ver Foto Ampliada"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="truncate min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white truncate">{item.modelName}</span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase shrink-0 ${
                            item.type === 'video' ? 'bg-red-950 text-red-400 border border-red-900' : 'bg-zinc-800 text-zinc-300'
                          }`}>
                            {item.type === 'video' ? 'Vídeo MP4' : 'Foto'}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 truncate">{item.title}</p>
                        {item.duration && (
                          <span className="text-[10px] text-zinc-500 font-mono">Duração: {item.duration}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => setGalleryItemToDelete(item.id)}
                        className="p-2 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                        title="Remover Mídia"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 3: CONFIGURAÇÕES & AGÊNCIA & E-MOLA */}
          {activeTab === 'config' && (
            <form onSubmit={handleSaveAgencyConfig} className="space-y-6">
              
              {/* e-Mola Subscription Box */}
              <div className="p-5 bg-zinc-900 border border-red-900/50 rounded-2xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-500 flex items-center justify-center">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                        Subscrição Mensal e-Mola (1 Mês de Acesso ao Catálogo)
                      </h3>
                      <p className="text-xs text-zinc-400">
                        Os clientes pagam este valor para desbloquear vídeos e perfis completos
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onToggleSubscription}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer shrink-0 ${
                      subscription.isSubscribed
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                    }`}
                  >
                    {subscription.isSubscribed ? 'Subscrição Ativada (Modo Teste)' : 'Subscrição Desativada'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-xs text-zinc-300 font-bold mb-1">Preço da Subscrição (1000 MT / 30 Dias) *</label>
                    <input
                      type="number"
                      required
                      value={agencyForm.subscriptionPrice || 1000}
                      onChange={(e) => setAgencyForm({ ...agencyForm, subscriptionPrice: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-300 font-bold mb-1">Número e-Mola Oficial *</label>
                    <input
                      type="text"
                      required
                      value={agencyForm.emolaNumber || '864368486'}
                      onChange={(e) => setAgencyForm({ ...agencyForm, emolaNumber: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white font-mono"
                      placeholder="864368486"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-300 font-bold mb-1">Nome Titular e-Mola</label>
                    <input
                      type="text"
                      value={agencyForm.emolaName || 'Boas e limpas VIP'}
                      onChange={(e) => setAgencyForm({ ...agencyForm, emolaName: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white"
                      placeholder="Boas e limpas VIP"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: CONFIGURAÇÃO DE PAGAMENTOS (M-PESA / E-MOLA) & IMAGENS DE RECEBIMENTO */}
              <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-5">
                <div className="border-b border-zinc-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-500 flex items-center justify-center">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                        Configuração de Pagamentos & Imagens de Recebimento
                      </h3>
                      <p className="text-xs text-zinc-400">
                        Atualize os números oficiais e suba as imagens de QR Code para recebimento via e-Mola e M-Pesa
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 w-fit">
                    M-Pesa & e-Mola (Moçambique)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* CARD 1: E-MOLA (MOVITEL) */}
                  <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                            e-Mola (Movitel)
                          </h4>
                        </div>
                        {agencyForm.emolaQrImage ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Imagem Ativa
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                            Sem QR Code
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-2.5">
                        <div>
                          <label className="block text-[11px] text-zinc-400 font-semibold mb-1">
                            Número de Telemóvel e-Mola Oficial *
                          </label>
                          <input
                            type="text"
                            required
                            value={agencyForm.emolaNumber || '864368486'}
                            onChange={(e) => setAgencyForm({ ...agencyForm, emolaNumber: e.target.value })}
                            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white font-mono"
                            placeholder="864368486"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-zinc-400 font-semibold mb-1">
                            Nome do Titular e-Mola
                          </label>
                          <input
                            type="text"
                            value={agencyForm.emolaName || 'Boas e limpas VIP'}
                            onChange={(e) => setAgencyForm({ ...agencyForm, emolaName: e.target.value })}
                            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white"
                            placeholder="Boas e limpas VIP"
                          />
                        </div>
                      </div>

                      {/* e-Mola Receiving / QR Code Image Display & Upload */}
                      <div className="pt-1 space-y-2">
                        <label className="block text-[11px] text-zinc-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
                          <span>Imagem de Recebimento / QR Code e-Mola</span>
                        </label>

                        <div className="flex gap-3 items-center">
                          <div className="relative w-22 h-22 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 shrink-0 flex items-center justify-center group">
                            {agencyForm.emolaQrImage ? (
                              <>
                                <img
                                  src={agencyForm.emolaQrImage}
                                  alt="QR Code e-Mola"
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => setAdminMediaPreview({ url: agencyForm.emolaQrImage!, type: 'image', title: 'QR Code / Imagem de Recebimento e-Mola' })}
                                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                                  title="Visualizar Imagem Ampliada"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <div className="text-center p-1 text-zinc-600">
                                <QrCode className="w-6 h-6 mx-auto mb-0.5 opacity-40" />
                                <span className="text-[9px] block">Sem Imagem</span>
                              </div>
                            )}
                          </div>

                          <div className="flex-1 space-y-1.5">
                            <button
                              type="button"
                              disabled={isUploading}
                              onClick={() => emolaQrInputRef.current?.click()}
                              className="w-full px-3 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-amber-500/50 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Upload className="w-3.5 h-3.5 text-amber-400" />
                              <span>{agencyForm.emolaQrImage ? 'Atualizar Imagem e-Mola' : 'Subir Imagem / QR e-Mola'}</span>
                            </button>

                            {agencyForm.emolaQrImage && (
                              <button
                                type="button"
                                onClick={() => setAgencyForm((prev) => ({ ...prev, emolaQrImage: '' }))}
                                className="w-full px-2 py-1 text-[11px] text-zinc-400 hover:text-red-400 text-center cursor-pointer"
                              >
                                Remover Imagem
                              </button>
                            )}

                            <p className="text-[10px] text-zinc-500 leading-tight">
                              Selecione foto do QR Code ou dados de recebimento do seu telemóvel/PC.
                            </p>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* CARD 2: M-PESA (VODACOM) */}
                  <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                            M-Pesa (Vodacom)
                          </h4>
                        </div>
                        {agencyForm.mpesaQrImage ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Imagem Ativa
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                            Sem QR Code
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-2.5">
                        <div>
                          <label className="block text-[11px] text-zinc-400 font-semibold mb-1">
                            Número de Telemóvel M-Pesa Oficial *
                          </label>
                          <input
                            type="text"
                            value={agencyForm.mpesaNumber || '848872648'}
                            onChange={(e) => setAgencyForm({ ...agencyForm, mpesaNumber: e.target.value })}
                            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white font-mono"
                            placeholder="848872648"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-zinc-400 font-semibold mb-1">
                            Nome do Titular M-Pesa
                          </label>
                          <input
                            type="text"
                            value={agencyForm.mpesaName || 'Boas e limpas VIP'}
                            onChange={(e) => setAgencyForm({ ...agencyForm, mpesaName: e.target.value })}
                            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white"
                            placeholder="Boas e limpas VIP"
                          />
                        </div>
                      </div>

                      {/* M-Pesa Receiving / QR Code Image Display & Upload */}
                      <div className="pt-1 space-y-2">
                        <label className="block text-[11px] text-zinc-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-red-500" />
                          <span>Imagem de Recebimento / QR Code M-Pesa</span>
                        </label>

                        <div className="flex gap-3 items-center">
                          <div className="relative w-22 h-22 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 shrink-0 flex items-center justify-center group">
                            {agencyForm.mpesaQrImage ? (
                              <>
                                <img
                                  src={agencyForm.mpesaQrImage}
                                  alt="QR Code M-Pesa"
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => setAdminMediaPreview({ url: agencyForm.mpesaQrImage!, type: 'image', title: 'QR Code / Imagem de Recebimento M-Pesa' })}
                                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                                  title="Visualizar Imagem Ampliada"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <div className="text-center p-1 text-zinc-600">
                                <QrCode className="w-6 h-6 mx-auto mb-0.5 opacity-40" />
                                <span className="text-[9px] block">Sem Imagem</span>
                              </div>
                            )}
                          </div>

                          <div className="flex-1 space-y-1.5">
                            <button
                              type="button"
                              disabled={isUploading}
                              onClick={() => mpesaQrInputRef.current?.click()}
                              className="w-full px-3 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-red-500/50 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Upload className="w-3.5 h-3.5 text-red-400" />
                              <span>{agencyForm.mpesaQrImage ? 'Atualizar Imagem M-Pesa' : 'Subir Imagem / QR M-Pesa'}</span>
                            </button>

                            {agencyForm.mpesaQrImage && (
                              <button
                                type="button"
                                onClick={() => setAgencyForm((prev) => ({ ...prev, mpesaQrImage: '' }))}
                                className="w-full px-2 py-1 text-[11px] text-zinc-400 hover:text-red-400 text-center cursor-pointer"
                              >
                                Remover Imagem
                              </button>
                            )}

                            <p className="text-[10px] text-zinc-500 leading-tight">
                              Selecione foto do QR Code ou dados de recebimento do seu telemóvel/PC.
                            </p>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              </div>

              {/* Banner Photo Replacement */}
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-3">
                <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-red-500" />
                  <span>Substituição da Foto do Banner Principal (Sem Link)</span>
                </label>

                <div className="relative h-32 w-full rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                  {agencyForm.heroImage ? (
                    <img
                      src={agencyForm.heroImage}
                      alt="Banner da Agência"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-zinc-500">Sem banner personalizado (usando padrão escuro luxuoso)</span>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <input
                      ref={bannerInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleBannerUpload}
                    />
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => bannerInputRef.current?.click()}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{isUploading ? 'Processando foto...' : 'Subir Foto do Banner'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Agency Contacts & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-300 font-bold mb-1">Nome da Agência</label>
                  <input
                    type="text"
                    value={agencyForm.name}
                    onChange={(e) => setAgencyForm({ ...agencyForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-300 font-bold mb-1">WhatsApp Principal (Linha 1)</label>
                  <input
                    type="text"
                    value={agencyForm.phone1}
                    onChange={(e) => setAgencyForm({ ...agencyForm, phone1: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white font-mono"
                    placeholder="864368486"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-300 font-bold mb-1">WhatsApp Secundário (Linha 2)</label>
                  <input
                    type="text"
                    value={agencyForm.phone2}
                    onChange={(e) => setAgencyForm({ ...agencyForm, phone2: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white font-mono"
                    placeholder="878872648"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-300 font-bold mb-1">Cidade / Região</label>
                  <input
                    type="text"
                    value={agencyForm.city}
                    onChange={(e) => setAgencyForm({ ...agencyForm, city: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-300 font-bold mb-1">Modalidade de Atendimento / Local</label>
                <input
                  type="text"
                  value={agencyForm.address}
                  onChange={(e) => setAgencyForm({ ...agencyForm, address: e.target.value })}
                  placeholder="Atendimento Exclusivo ao Domicílio & Espaço Escolhido pelo Cliente"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white"
                />
                <p className="text-[11px] text-zinc-500 mt-1">
                  Atendimento exclusivamente ao domicílio e no espaço escolhido pelo cliente (residência, hotéis ou locais privativos).
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-red-950"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Todas as Configurações</span>
                </button>
              </div>

              {/* Reset Defaults with inline confirmation */}
              <div className="pt-6 border-t border-zinc-800/80">
                {showResetConfirm ? (
                  <div className="p-3 bg-red-950/80 border border-red-800 rounded-xl flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-red-200">
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>Restaurar todos os perfis e configurações para o padrão inicial?</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setShowResetConfirm(false)}
                        className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md font-semibold cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={executeResetDefaults}
                        className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md font-bold cursor-pointer"
                      >
                        Confirmar Restauração
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500">Restaurar catálogo para dados de demonstração:</span>
                    <button
                      type="button"
                      onClick={() => setShowResetConfirm(true)}
                      className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restaurar Padrão</span>
                    </button>
                  </div>
                )}
              </div>

            </form>
          )}

        </div>
          </>
        )}

      </div>

      {/* Internal Media Preview Modal (Video Player / Photo Zoom) */}
      {adminMediaPreview && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative max-w-2xl w-full bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">{adminMediaPreview.title}</h4>
                {adminMediaPreview.modelName && (
                  <span className="text-xs text-zinc-400">Garota: {adminMediaPreview.modelName}</span>
                )}
              </div>
              <button
                onClick={() => setAdminMediaPreview(null)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-black flex items-center justify-center max-h-[70vh]">
              {adminMediaPreview.type === 'video' ? (
                <video
                  src={adminMediaPreview.url}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[60vh] w-auto max-w-full rounded-lg shadow-lg"
                />
              ) : (
                <img
                  src={adminMediaPreview.url}
                  alt={adminMediaPreview.title}
                  className="max-h-[60vh] w-auto max-w-full rounded-lg object-contain"
                />
              )}
            </div>

            <div className="p-3 bg-zinc-900 border-t border-zinc-800 flex justify-end">
              <button
                onClick={() => setAdminMediaPreview(null)}
                className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Fechar Pré-visualização
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
