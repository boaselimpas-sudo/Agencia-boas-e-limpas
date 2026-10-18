import { useState, useEffect } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  items: any[];
  config: any;
  galleryItems: any[];
  subscription: any;
  initialTab: any;
  onSaveItems: (items: any[]) => void;
  onSaveConfig: (config: any) => void;
  onSaveGalleryItems: (items: any[]) => void;
  onToggleSubscription: () => void;
  onResetDefaults: () => void;
};

export function AdminModal({ isOpen, onClose, items, config, galleryItems, subscription, onSaveItems, onSaveConfig, onSaveGalleryItems, onToggleSubscription, onResetDefaults }: Props) {
  const [tab, setTab] = useState('itens');
  const [localItems, setLocalItems] = useState<any[]>(items || []);
  const [localGallery, setLocalGallery] = useState<any[]>(galleryItems || []);
  const [localConfig, setLocalConfig] = useState<any>(config || {});
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    setLocalItems(items || []);
    setLocalGallery(galleryItems || []);
    setLocalConfig(config || {});
  }, [items, galleryItems, config, isOpen]);

  if (!isOpen) return null;

  const saveAll = () => {
    onSaveItems(localItems);
    onSaveGalleryItems(localGallery);
    onSaveConfig(localConfig);
    alert('Salvo com sucesso!');
    onClose();
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...localItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setLocalItems(newItems);
  };

  const addNewItem = () => {
    const newItem = {
      id: Date.now(),
      name: 'Nova Garota',
      age: 22,
      price: '1500 MT',
      image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04',
      description: 'Nova integrante',
      available: true
    };
    setLocalItems([...localItems, newItem]);
  };

  const deleteItem = (index: number) => {
    if (confirm('Apagar essa menina?')) {
      setLocalItems(localItems.filter((_, i) => i !== index));
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 99999, overflowY: 'auto', padding: 10 }}>
      <div style={{ background: '#fff', borderRadius: 12, maxWidth: 1000, margin: '10px auto', padding: 15 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, borderBottom: '1px solid #eee', paddingBottom: 10 }}>
          <h2 style={{ fontWeight: 'bold', fontSize: 18 }}>Painel Admin - Boas e Limpas ({localItems.length} itens)</h2>
          <button onClick={onClose} style={{ background: '#000', color: '#fff', padding: '8px 14px', borderRadius: 8 }}>Fechar X</button>
        </div>

        <div style={{ display: 'flex', gap: 6, marginBottom: 15, flexWrap: 'wrap' }}>
          {[
            { id: 'itens', label: `Catálogo (${localItems.length})` },
            { id: 'galeria', label: `Galeria VIP (${localGallery.length})` },
            { id: 'config', label: 'Config' },
            { id: 'assinatura', label: 'VIP' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '8px 12px', borderRadius: 8, fontSize: 13, background: tab === t.id ? '#e11d48' : '#f3f4f6', color: tab === t.id ? '#fff' : '#000', border: 'none', fontWeight: tab === t.id ? 'bold' : 'normal' }}>{t.label}</button>
          ))}
        </div>

        {tab === 'itens' && (
          <div>
            <button onClick={addNewItem} style={{ background: '#10b981', color: '#fff', padding: '10px 16px', borderRadius: 8, marginBottom: 15, width: '100%' }}>+ Adicionar Nova Menina</button>
            <div style={{ display: 'grid', gap: 12 }}>
              {localItems.map((item, idx) => (
                <div key={idx} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, background: '#fafafa' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>{idx + 1}. {item.name || 'Sem nome'}</strong>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => setEditingIndex(editingIndex === idx ? null : idx)} style={{ background: '#3b82f6', color: '#fff', padding: '6px 10px', borderRadius: 6, fontSize: 12 }}>{editingIndex === idx ? 'Fechar' : 'Editar'}</button>
                      <button onClick={() => deleteItem(idx)} style={{ background: '#ef4444', color: '#fff', padding: '6px 10px', borderRadius: 6, fontSize: 12 }}>Apagar</button>
                    </div>
                  </div>
                  {editingIndex === idx && (
                    <div style={{ marginTop: 10, display: 'grid', gap: 8 }}>
                      <input value={item.name || ''} onChange={e => updateItem(idx, 'name', e.target.value)} placeholder="Nome" style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd' }} />
                      <input value={item.image || item.imageUrl || ''} onChange={e => updateItem(idx, 'image', e.target.value)} placeholder="Link da Foto" style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd' }} />
                      <input value={item.price || ''} onChange={e => updateItem(idx, 'price', e.target.value)} placeholder="Preço ex: 1500 MT" style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd' }} />
                      <input value={item.age || ''} onChange={e => updateItem(idx, 'age', e.target.value)} placeholder="Idade" style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd' }} />
                      <textarea value={item.description || ''} onChange={e => updateItem(idx, 'description', e.target.value)} placeholder="Descrição" style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd' }} rows={2} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'galeria' && (
          <div>
            <p style={{ fontSize: 13, color: '#666', marginBottom: 10 }}>Edite os vídeos da Galeria VIP. Cole links de imagem/vídeo.</p>
            <div style={{ display: 'grid', gap: 10 }}>
              {localGallery.map((g, idx) => (
                <div key={idx} style={{ border: '1px solid #eee', padding: 10, borderRadius: 8 }}>
                  <input value={g.title || g.name || ''} onChange={e => { const ng = [...localGallery]; ng[idx] = { ...ng[idx], title: e.target.value }; setLocalGallery(ng); }} placeholder="Título" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd', marginBottom: 6 }} />
                  <input value={g.url || g.image || ''} onChange={e => { const ng = [...localGallery]; ng[idx] = { ...ng[idx], url: e.target.value }; setLocalGallery(ng); }} placeholder="Link do vídeo/foto" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd' }} />
                </div>
              ))}
              <button onClick={() => setLocalGallery([...localGallery, { title: 'Novo Vídeo VIP', url: '' }])} style={{ background: '#10b981', color: '#fff', padding: 10, borderRadius: 8 }}>+ Adicionar Vídeo</button>
            </div>
          </div>
        )}

        {tab === 'config' && (
          <div style={{ display: 'grid', gap: 10 }}>
            <label>Nome da Agência</label>
            <input value={localConfig.name || ''} onChange={e => setLocalConfig({ ...localConfig, name: e.target.value })} style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }} />
            <label>WhatsApp</label>
            <input value={localConfig.whatsapp || ''} onChange={e => setLocalConfig({ ...localConfig, whatsapp: e.target.value })} style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }} placeholder="258..." />
            <label>Preço VIP (texto)</label>
            <input value={localConfig.vipPrice || localConfig.subscriptionPrice || ''} onChange={e => setLocalConfig({ ...localConfig, vipPrice: e.target.value })} style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }} placeholder="1000 MT" />
            <label>Mensagem Topo</label>
            <input value={localConfig.headerMessage || ''} onChange={e => setLocalConfig({ ...localConfig, headerMessage: e.target.value })} style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }} />
          </div>
        )}

        {tab === 'assinatura' && (
          <div>
            <p><b>Status VIP:</b> {subscription?.active ? 'Ativo' : 'Inativo'}</p>
            <button onClick={onToggleSubscription} style={{ marginTop: 10, background: subscription?.active ? '#ef4444' : '#10b981', color: '#fff', padding: '10px 16px', borderRadius: 8 }}>{subscription?.active ? 'Desativar VIP' : 'Ativar VIP'}</button>
            <hr style={{ margin: '20px 0' }} />
            <button onClick={onResetDefaults} style={{ background: '#f59e0b', color: '#fff', padding: '10px 16px', borderRadius: 8, width: '100%' }}>Restaurar Tudo ao Padrão</button>
          </div>
        )}

        <div style={{ marginTop: 20, display: 'flex', gap: 10, position: 'sticky', bottom: 0, background: '#fff', padding: '10px 0', borderTop: '1px solid #eee' }}>
          <button onClick={saveAll} style={{ flex: 1, background: '#e11d48', color: '#fff', padding: '14px', borderRadius: 10, fontWeight: 'bold', fontSize: 16 }}>💾 SALVAR TUDO</button>
        </div>
      </div>
    </div>
  );
}
export default AdminModal;
