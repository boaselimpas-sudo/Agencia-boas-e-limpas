// @ts-nocheck
import { useState, useEffect } from 'react';

export function AdminModal(props: any) {
  const { isOpen, onClose, items = [], config = {}, galleryItems = [], subscription, onSaveItems, onSaveConfig, onSaveGalleryItems, onToggleSubscription, onResetDefaults } = props;
  const [tab, setTab] = useState('itens');
  const [localItems, setLocalItems] = useState<any[]>(items);
  const [localGallery, setLocalGallery] = useState<any[]>(galleryItems);
  const [localConfig, setLocalConfig] = useState<any>(config);
  const [editIdx, setEditIdx] = useState<number | null>(null);

  useEffect(() => {
    setLocalItems(props.items || []);
    setLocalGallery(props.galleryItems || []);
    setLocalConfig(props.config || {});
  }, [props.items, props.galleryItems, props.config, props.isOpen]);

  if (!isOpen) return null;

  const saveAll = () => {
    if(onSaveItems) onSaveItems(localItems);
    if(onSaveGalleryItems) onSaveGalleryItems(localGallery);
    if(onSaveConfig) onSaveConfig(localConfig);
    alert('✅ Salvo com sucesso!');
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 99999, overflowY: 'auto', padding: 10 }}>
      <div style={{ background: '#fff', borderRadius: 12, maxWidth: 1000, margin: '20px auto', padding: 15 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
          <h2 style={{ fontWeight: 'bold' }}>PAINEL ADMIN - {localItems.length} MENINAS</h2>
          <button onClick={onClose} style={{ background: '#000', color: '#fff', padding: '8px 16px', borderRadius: 8 }}>X Fechar</button>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 15 }}>
          <button onClick={() => setTab('itens')} style={{ padding: '8px 12px', borderRadius: 8, background: tab==='itens'?'#e11d48':'#eee', color: tab==='itens'?'#fff':'#000' }}>Catálogo ({localItems.length})</button>
          <button onClick={() => setTab('config')} style={{ padding: '8px 12px', borderRadius: 8, background: tab==='config'?'#e11d48':'#eee', color: tab==='config'?'#fff':'#000' }}>Config</button>
        </div>
        {tab==='itens' && (
          <div>
            <button onClick={() => setLocalItems([...localItems, { id: Date.now(), name: 'Nova Garota', age: 22, price: '1500 MT', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04', description: 'Nova', available: true }])} style={{ background: '#10b981', color: '#fff', padding: '10px', borderRadius: 8, width: '100%', marginBottom: 10 }}>+ Adicionar Menina</button>
            {localItems.map((it:any, i:number) => (
              <div key={i} style={{ border: '1px solid #ddd', padding: 10, borderRadius: 8, marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <b>{i+1}. {it.name}</b>
                  <div style={{ display: 'flex', gap: 5 }}>
                    <button onClick={() => setEditIdx(editIdx===i?null:i)} style={{ background: '#3b82f6', color: '#fff', padding: '4px 8px', borderRadius: 5 }}>{editIdx===i?'Fechar':'Editar'}</button>
                    <button onClick={() => { if(confirm('Apagar?')) setLocalItems(localItems.filter((_:any, idx:number)=>idx!==i)) }} style={{ background: '#ef4444', color: '#fff', padding: '4px 8px', borderRadius: 5 }}>Apagar</button>
                  </div>
                </div>
                {editIdx===i && (
                  <div style={{ marginTop: 8, display: 'grid', gap: 6 }}>
                    <input value={it.name||''} onChange={e=>{ const a=[...localItems]; a[i].name=e.target.value; setLocalItems(a); }} placeholder="Nome" style={{ padding: 8, border: '1px solid #ddd', borderRadius: 6 }}/>
                    <input value={it.image||it.imageUrl||''} onChange={e=>{ const a=[...localItems]; a[i].image=e.target.value; a[i].imageUrl=e.target.value; setLocalItems(a); }} placeholder="Link da foto" style={{ padding: 8, border: '1px solid #ddd', borderRadius: 6 }}/>
                    <input value={it.price||''} onChange={e=>{ const a=[...localItems]; a[i].price=e.target.value; setLocalItems(a); }} placeholder="Preço" style={{ padding: 8, border: '1px solid #ddd', borderRadius: 6 }}/>
                    <input value={it.age||''} onChange={e=>{ const a=[...localItems]; a[i].age=e.target.value; setLocalItems(a); }} placeholder="Idade" style={{ padding: 8, border: '1px solid #ddd', borderRadius: 6 }}/>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {tab==='config' && (
          <div style={{ display: 'grid', gap: 10 }}>
            <label>WhatsApp (com código país)</label>
            <input value={localConfig.whatsapp||''} onChange={e=>setLocalConfig({...localConfig, whatsapp:e.target.value})} style={{ padding: 10, border: '1px solid #ddd', borderRadius: 8 }}/>
            <label>Preço VIP</label>
            <input value={localConfig.vipPrice||''} onChange={e=>setLocalConfig({...localConfig, vipPrice:e.target.value})} style={{ padding: 10, border: '1px solid #ddd', borderRadius: 8 }}/>
          </div>
        )}
        <button onClick={saveAll} style={{ marginTop: 20, background: '#e11d48', color: '#fff', padding: '14px', borderRadius: 10, width: '100%', fontWeight: 'bold', fontSize: 16 }}>💾 SALVAR TUDO</button>
      </div>
    </div>
  );
}
export default AdminModal;
