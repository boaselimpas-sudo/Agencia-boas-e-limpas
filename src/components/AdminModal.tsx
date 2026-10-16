import React, { useState } from 'react';
import { X } from 'lucide-react';

const AdminModal = ({ isOpen, onClose }: any) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

      const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim().toLowerCase() === 'boas1014') {
      setIsAuthenticated(true);
      setPasswordInput('');
      setPasswordError('');
    } else {
      setPasswordError('Senha incorreta!');
    }
  };

  if (!isOpen) return null;

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 w-full max-w-sm">
          <h2 className="text-xl font-bold mb-6 text-center">Área do Proprietário</h2>
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Digite Boas1014"
              className="w-full border-2 border-pink-200 rounded-xl px-4 py-3 mb-2"
              autoFocus
            />
            {passwordError && <p className="text-red-500 text-sm mb-3">{passwordError}</p>}
            <button type="submit" className="w-full bg-pink-600 text-white py-3 rounded-xl font-bold">
              Entrar
            </button>
          </form>
          <button onClick={onClose} className="w-full mt-3 text-gray-500">Fechar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6">
        <h2 className="font-bold">Entrou! Senha funcionando!</h2>
        <button onClick={onClose} className="mt-4 bg-black text-white px-4 py-2 rounded">Fechar</button>
      </div>
    </div>
  );
};

export default AdminModal;
import { X, Plus, Edit2, Trash2, RotateCcw, Save, ShieldAlert, Check, AlertTriangle, Upload, Video, Image as ImageIcon, Play, Sparkles, Lock, CreditCard } from 'lucide-react';
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
  onSaveItems,
  onSaveConfig,
  onSaveGalleryItems,
  onToggleSubscription,
  onResetDefaults,
}) => {
  const ADMIN_PASSWORD = "Boas1014";
const [isAuthenticated, setIsAuthenticated] = const [isAuthenticated, setIsAuthenticated] = useState(false);
const [passwordInput, setPasswordInput] = useState("");
  const [activeTab, setActiveTab] = useState<'items' | 'gallery' | 'config'>('items');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [agencyForm, setAgencyForm] = useState<AgencyConfig>(config);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  
  // In-app confirmation states
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [galleryItemToDelete, setGalleryItemToDelete] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // File upload input refs
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const directGalleryMediaRef = useRef<HTMLInputElement>(null);

  // Form for item creation/editing (without AI photos by default)
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
    videoUrl: PRESET_VIDEOS[0].url,
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
    modelName: 'Sheila',
    title: 'Novo Ensaio Exclusivo',
    type: 'video',
    fileUrl: '',
    duration: '0:30',
    price: 3500,
  });

  if (!isOpen) return null;

  const showNotification = (msg: string) => {
    setSaveSuccess(msg);
    setTimeout(() => setSaveSuccess(null), 3000);
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
      videoUrl: PRESET_VIDEOS[0].url,
    });
  };

  const handleStartEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsCreating(false);
    setItemForm({ ...item });
  };

  // Direct Photo Upload without link
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const mediaId = `photo-${Date.now()}`;
      const objectUrl = await saveMediaFile(mediaId, file, file.name, 'image');
      setItemForm((prev) => ({ ...prev, image: objectUrl, mediaStorageId: mediaId }));
      showNotification('Sua foto real foi carregada com sucesso!');
    } catch (err) {
      console.error(err);
      showNotification('Erro ao processar foto.');
    } finally {
      setIsUploading(false);
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
      showNotification('Vídeo MP4 exclusivo carregado do seu telemóvel!');
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
      const isVid = file.type.startsWith('video') || file.name.endsWith('.mp4');
      const mediaId = `gal-${Date.now()}`;
      const objectUrl = await saveMediaFile(mediaId, file, file.name, isVid ? 'video' : 'image');

      setGalleryUploadForm((prev) => ({
        ...prev,
        type: isVid ? 'video' : 'image',
        fileUrl: objectUrl,
        title: file.name.replace(/\.[^/.]+$/, ''),
      }));

      showNotification(`${isVid ? 'Vídeo MP4' : 'Foto'} selecionado do seu telemóvel! Preencha os dados e clique em Publicar.`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveDirectGalleryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryUploadForm.fileUrl) {
      alert('Por favor, selecione primeiro uma foto ou vídeo MP4 do seu dispositivo.');
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
    showNotification('Nova mídia publicada na Galeria do Site com sucesso!');
    setGalleryUploadForm({
      modelName: 'Sheila',
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

    const mediaId = `banner-${Date.now()}`;
    const objectUrl = await saveMediaFile(mediaId, file, file.name, 'image');
    setAgencyForm((prev) => ({ ...prev, heroImage: objectUrl }));
    showNotification('Banner da agência atualizado com sua foto!');
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemForm.name || !itemForm.price) return;

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
        available: true,
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
        };
        onSaveGalleryItems([galPhoto, ...galleryItems]);
      }

      showNotification('Novo perfil salvo com sua foto real!');
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
              hasVideo: itemForm.hasVideo !== undefined ? itemForm.hasVideo : it.hasVideo,
              videoDuration: itemForm.videoDuration || it.videoDuration,
              videoUrl: itemForm.videoUrl || it.videoUrl,
            }
          : it
      );
      onSaveItems(updated);
      showNotification('Perfil e foto atualizados com sucesso!');
    }

    setEditingItem(null);
    setIsCreating(false);
  };

  const executeDeleteItem = (id: string) => {
    onSaveItems(items.filter((it) => it.id !== id));
    setItemToDelete(null);
    showNotification('Item excluído com sucesso!');
  };

  const executeDeleteGalleryItem = (id: string) => {
    onSaveGalleryItems(galleryItems.filter((it) => it.id !== id));
    setGalleryItemToDelete(null);
    showNotification('Mídia removida da galeria do site!');
  };

  const executeResetDefaults = () => {
    onResetDefaults();
    setShowResetConfirm(false);
    showNotification('Catálogo e configurações restaurados para o padrão original!');
  };

  const handleSaveAgencyConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(agencyForm);
    showNotification('Configurações da agência e e-Mola salvas!');
  };
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === "Boas1014") {
      setIsAuthenticated(true);
      setPasswordError("");
    } else {
      setPasswordError("Senha incorreta!");
    }
  };
  if (!isOpen) return null;
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl w-full max-w-sm">
          <h2 className="text-white text-xl font-bold mb-2">Acesso Restrito</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} placeholder="Senha" className="w-full bg-zinc-800 border border-zinc-800 px-4 py-3 text-white rounded-lg" autoFocus />
            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
            <button type="submit" className="w-full bg-white text-black font-bold py-3 rounded-lg">Entrar</button>
            <button type="button" onClick={onClose} className="w-full text-zinc-400 text-sm">Fechar</button>
          </form>
        </div>
      </div>
    );
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            <div>
              <h2 className="text-base font-bold text-white">Painel do Proprietário & Gestão</h2>
              <p className="text-[11px] text-zinc-400">Suba suas fotos reais sem link, configure vídeos MP4 e subscrição e-Mola</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-4 px-6 pt-3 border-b border-zinc-800 bg-zinc-950 overflow-x-auto scrollbar-none">
          <button
            onClick={() => { setActiveTab('items'); setEditingItem(null); setIsCreating(false); }}
            className={`pb-3 text-xs font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'items'
                ? 'border-red-600 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Garotas do Catálogo ({items.length})
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`pb-3 text-xs font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'gallery'
                ? 'border-red-600 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-red-500" />
            <span>Subir Fotos & Vídeos MP4 ({galleryItems.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`pb-3 text-xs font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'config'
                ? 'border-red-600 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Subscrição e-Mola & WhatsApp
          </button>
        </div>

        {/* Notification Toast */}
        {saveSuccess && (
          <div className="mx-6 mt-3 p-2.5 bg-emerald-950/80 border border-emerald-800 rounded-xl text-emerald-200 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{saveSuccess}</span>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'gallery' ? (
            // DEDICATED DIRECT SITE GALLERY UPLOAD TAB
            <div className="space-y-6">
              
              {/* Upload from device box */}
              <div className="p-5 bg-zinc-900 border border-red-900/40 rounded-2xl space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Upload className="w-4 h-4 text-red-500" />
                    <span>Subir Suas Fotos Reais ou Vídeos MP4 do Dispositivo (Sem Link)</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Escolha fotos ou vídeos direto da galeria do seu telemóvel para publicar na Galeria do site.
                  </p>
                </div>

                <form onSubmit={handleSaveDirectGalleryItem} className="space-y-4 pt-1">
                  <input
                    ref={directGalleryMediaRef}
                    type="file"
                    accept="image/*,video/mp4,video/*"
                    className="hidden"
                    onChange={handleDirectGalleryMediaUpload}
                  />

                  <div className="flex flex-col sm:flex-row gap-4 items-center p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => directGalleryMediaRef.current?.click()}
                      className="w-full sm:w-auto px-5 py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-950 cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{isUploading ? 'Processando arquivo...' : 'Escolher Foto ou Vídeo .MP4 do Celular/PC'}</span>
                    </button>

                    <div className="flex-1 text-center sm:text-left truncate">
                      {galleryUploadForm.fileUrl ? (
                        <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold truncate">
                          <Check className="w-4 h-4 shrink-0" />
                          <span className="truncate">Arquivo pronto ({galleryUploadForm.type === 'video' ? 'Vídeo MP4' : 'Foto'})</span>
                        </div>
                      ) : (
                        <span className="text-xs text-zinc-500">Nenhum arquivo selecionado</span>
                      )}
                    </div>
                  </div>

                  {galleryUploadForm.fileUrl && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">Nome da Garota *</label>
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
                        <label className="block text-xs text-zinc-400 mb-1">Título da Mídia</label>
                        <input
                          type="text"
                          value={galleryUploadForm.title}
                          onChange={(e) => setGalleryUploadForm({ ...galleryUploadForm, title: e.target.value })}
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white"
                          placeholder="Ex: Ensaio de Biquíni, Reel VIP..."
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">Duração (se for vídeo)</label>
                        <input
                          type="text"
                          value={galleryUploadForm.duration}
                          onChange={(e) => setGalleryUploadForm({ ...galleryUploadForm, duration: e.target.value })}
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white font-mono"
                          placeholder="Ex: 0:35"
                        />
                      </div>

                      <div className="sm:col-span-3 flex justify-end pt-2">
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-950 cursor-pointer"
                        >
                          <Save className="w-4 h-4" />
                          <span>Publicar na Galeria do Site</span>
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>

              {/* In-app delete gallery item banner */}
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
                      Remover
                    </button>
                  </div>
                </div>
              )}

              {/* Current Site Gallery media items */}
              <div>
                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3">
                  Mídias Atualmente na Galeria ({galleryItems.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {galleryItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {item.thumbnailUrl || (item.type === 'image' && item.url) ? (
                          <img
                            src={item.thumbnailUrl || item.url}
                            alt={item.title}
                            className="w-12 h-12 rounded-lg object-cover bg-zinc-950 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-zinc-950 flex items-center justify-center text-red-500 font-bold shrink-0">
                            {item.modelName[0]}
                          </div>
                        )}
                        <div className="truncate">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white truncate">{item.modelName}</span>
                            <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${item.type === 'video' ? 'bg-red-950 text-red-400' : 'bg-zinc-800 text-zinc-300'}`}>
                              {item.type === 'video' ? 'Vídeo MP4' : 'Foto'}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 truncate">{item.title}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => setGalleryItemToDelete(item.id)}
                        className="p-2 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors shrink-0 cursor-pointer"
                        title="Remover"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : activeTab === 'items' ? (
            <>
              {isCreating || editingItem ? (
                // Item Edit / Create Form with Direct Device Photo Upload (No AI photos)
                <form onSubmit={handleSaveItem} className="p-4 sm:p-5 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-5">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-red-500" />
                      <span>{isCreating ? 'Adicionar Perfil com Sua Foto Real' : `Editando: ${editingItem?.name}`}</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => { setIsCreating(false); setEditingItem(null); }}
                      className="text-xs text-zinc-400 hover:text-white cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>

                  {/* SECTION 1: PHOTO REPLACEMENT DIRECT FROM DEVICE */}
                  <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-red-500" />
                        <span>Sua Foto Real da Garota (Sem Link / Sem IA)</span>
                      </label>
                      <span className="text-[11px] text-zinc-400">Upload direto da galeria do telemóvel</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                      {/* Photo preview */}
                      <div className="relative w-28 h-36 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-700 shrink-0 flex items-center justify-center">
                        {itemForm.image ? (
                          <img
                            src={itemForm.image}
                            alt="Foto Selecionada"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center p-2 text-zinc-500 text-xs">
                            <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                            <span>Sem Foto</span>
                          </div>
                        )}
                      </div>

                      {/* Photo controls */}
                      <div className="flex-1 space-y-3 w-full">
                        <input
                          ref={photoInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePhotoUpload}
                        />

                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => photoInputRef.current?.click()}
                            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Enviar Foto Real do Celular / PC</span>
                          </button>

                          {itemForm.image && (
                            <button
                              type="button"
                              onClick={() => setItemForm((prev) => ({ ...prev, image: '' }))}
                              className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs border border-zinc-800"
                            >
                              Remover Foto
                            </button>
                          )}
                        </div>

                        <p className="text-[11px] text-zinc-400">
                          Selecione diretamente qualquer foto da câmera ou galeria do telemóvel sem precisar de links externos.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: EXCLUSIVE VIDEO REPLACEMENT (.mp4) */}
                  <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Video className="w-4 h-4 text-red-500" />
                        <span>Vídeo Exclusivo da Garota (.mp4)</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={itemForm.hasVideo || false}
                          onChange={(e) => setItemForm({ ...itemForm, hasVideo: e.target.checked })}
                          className="rounded text-red-600 focus:ring-red-600"
                        />
                        <span>Exibir Vídeo Exclusivo</span>
                      </label>
                    </div>

                    {itemForm.hasVideo && (
                      <div className="space-y-3 pt-1">
                        <input
                          ref={videoInputRef}
                          type="file"
                          accept="video/mp4,video/*"
                          className="hidden"
                          onChange={handleVideoUpload}
                        />

                        <button
                          type="button"
                          onClick={() => videoInputRef.current?.click()}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Subir Vídeo .MP4 do Celular / PC</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Basic information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-zinc-300 font-bold mb-1">Nome da Garota / Item *</label>
                      <input
                        type="text"
                        required
                        value={itemForm.name}
                        onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white"
                        placeholder="Ex: Sheila"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-300 font-bold mb-1">Categoria *</label>
                      <select
                        value={itemForm.category}
                        onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white"
                      >
                        <option value="Garotas de programa">Garotas de programa</option>
                        <option value="Serviços & Pacotes">Serviços & Pacotes</option>
                        <option value="Bebidas VIP">Bebidas VIP</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-300 font-bold mb-1">Preço em Meticais (MZN) *</label>
                      <input
                        type="number"
                        required
                        value={itemForm.price}
                        onChange={(e) => setItemForm({ ...itemForm, price: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white font-mono"
                        placeholder="Ex: 3500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-300 font-bold mb-1">Etiqueta de Destaque</label>
                      <input
                        type="text"
                        value={itemForm.badge || ''}
                        onChange={(e) => setItemForm({ ...itemForm, badge: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white"
                        placeholder="Ex: VIP, Destaque, Top Model"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-300 font-bold mb-1">Detalhes Rápidos (Idade, altura, local)</label>
                    <input
                      type="text"
                      value={itemForm.details || ''}
                      onChange={(e) => setItemForm({ ...itemForm, details: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white"
                      placeholder="Ex: 23 anos · 1.68m · Atendimento em Maputo e Matola"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-300 font-bold mb-1">Descrição</label>
                    <textarea
                      rows={2}
                      value={itemForm.description || ''}
                      onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white resize-none"
                      placeholder="Descrição dos atributos ou serviços..."
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => { setIsCreating(false); setEditingItem(null); }}
                      className="px-4 py-2.5 bg-zinc-800 text-zinc-300 text-xs font-semibold rounded-xl cursor-pointer"
                    >
                      Voltar
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-red-950 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Salvar Perfil com Foto Real</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white">Catálogo de Garotas</p>
                    <p className="text-xs text-zinc-400">
                      Adicione fotos reais diretamente do seu telemóvel para cada garota.
                    </p>
                  </div>
                  <button
                    onClick={handleStartCreate}
                    className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-red-950 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar Garota</span>
                  </button>
                </div>
              )}

              {/* In-app delete confirmation banner */}
              {itemToDelete && (
                <div className="p-3 bg-red-950/80 border border-red-800 rounded-xl flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-red-200">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>Confirmar exclusão deste item do catálogo?</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setItemToDelete(null)}
                      className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md font-semibold cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => executeDeleteItem(itemToDelete)}
                      className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md font-bold cursor-pointer"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-zinc-900 border border-zinc-800/80 rounded-xl"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 rounded-lg object-cover bg-zinc-950 shrink-0 border border-zinc-800"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-red-500 font-bold font-serif shrink-0">
                            {item.name[0]}
                          </div>
                        )}
                        {item.hasVideo && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center border border-zinc-950">
                            <Play className="w-2.5 h-2.5 fill-white ml-0.5" />
                          </div>
                        )}
                      </div>

                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white truncate">{item.name}</h4>
                          {!item.image && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                              Sem foto (toque para adicionar)
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-mono text-red-400 font-bold">
                          {item.price.toLocaleString('pt-MZ')} MZN
                        </p>
                        <p className="text-[11px] text-zinc-500 truncate">{item.category}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleStartEdit(item)}
                        className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
                        title="Adicionar foto real do celular"
                      >
                        <Upload className="w-3.5 h-3.5 text-red-400" />
                        <span>Colocar Foto</span>
                      </button>
                      <button
                        onClick={() => setItemToDelete(item.id)}
                        className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            // Agency Configuration Form + e-Mola Subscription Settings
            <form onSubmit={handleSaveAgencyConfig} className="space-y-5">
              
              {/* e-Mola Subscription Settings Box */}
              <div className="p-4 bg-zinc-900 border border-red-900/50 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-red-500" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Configuração da Subscrição Mensal e-Mola (1 Mês)
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={onToggleSubscription}
                    className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      subscription.isSubscribed
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                    }`}
                  >
                    {subscription.isSubscribed ? 'Subscrição Ativada (Clique para Desativar)' : 'Subscrição Desativada (Clique para Ativar)'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div>
                    <label className="block text-xs text-zinc-300 font-bold mb-1">Preço da Subscrição (MZN) *</label>
                    <input
                      type="number"
                      required
                      value={agencyForm.subscriptionPrice || 500}
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
                    <label className="block text-xs text-zinc-300 font-bold mb-1">Nome da Conta e-Mola</label>
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

              {/* Banner Photo Replacement */}
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-3">
                <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-red-500" />
                  <span>Substituição da Imagem do Banner Principal (Sem Link)</span>
                </label>

                <div className="relative h-32 w-full rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                  {agencyForm.heroImage ? (
                    <img
                      src={agencyForm.heroImage}
                      alt="Banner da Agência"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-zinc-500">Sem banner personalizado (usando padrão escuro)</span>
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
                      onClick={() => bannerInputRef.current?.click()}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Subir Foto Real do Celular</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Phone & Information Fields */}
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
                <label className="block text-xs text-zinc-300 font-bold mb-1">Endereço da Agência</label>
                <input
                  type="text"
                  value={agencyForm.address}
                  onChange={(e) => setAgencyForm({ ...agencyForm, address: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Configurações</span>
                </button>
              </div>
            </form>
          )}

          {/* Reset to defaults section with inline confirmation */}
          <div className="pt-6 border-t border-zinc-800/80">
            {showResetConfirm ? (
              <div className="p-3 bg-red-950/80 border border-red-800 rounded-xl flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-red-200">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Restaurar todos os itens e preços para o padrão inicial?</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md font-semibold cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={executeResetDefaults}
                    className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md font-bold cursor-pointer"
                  >
                    Confirmar Restauração
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Restaurar padrão inicial da agência:</span>
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar Padrão</span>
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
