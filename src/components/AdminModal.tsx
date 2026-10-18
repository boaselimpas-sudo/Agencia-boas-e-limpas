import { useState } from 'react';

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

export function AdminModal({ isOpen, onClose, items, config, onSaveConfig, onResetDefaults }: Props) {
  const [activeTab, setActiveTab] = useState('config');
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, padding: 20, overflowY: 'auto' }}>
      <div style={{ background: '#fff', borderRadius: 12, maxWidth: 900, margin: '20px auto', padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontWeight: 'bold', fontSize: 20 }}>Painel Administrativo - Boas e Limpas</h2>
          <button onClick={onClose} style={{ background: '#000', color: '#fff', padding: '8px 16px', borderRadius: 8 }}>Fechar X</button>
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <button onClick={() => setActiveTab('config')} style={{ padding: '8px 12px', background: activeTab==='config' ? '#e11d48' : '#eee', color: activeTab==='config' ? '#fff' : '#000', borderRadius: 8 }}>Config</button>
          <button onClick={() => setActiveTab('info')} style={{ padding: '8px 12px', background: activeTab==='info' ? '#e11d48' : '#eee', color: activeTab==='info' ? '#fff' : '#000', borderRadius: 8 }}>Info</button>
        </div>

        {activeTab === 'config' && (
          <div>
            <h3 style={{ fontWeight: 'bold', marginBottom: 10 }}>Configuração da Agência</h3>
            <p><b>Nome:</b> {config?.name || 'Boas e limpas'}</p>
            <p><b>Itens no catálogo:</b> {items?.length || 0}</p>
            <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
              <button onClick={onResetDefaults} style={{ background: '#f59e0b', padding: '10px 16px', borderRadius: 8, color: '#fff' }}>Restaurar Padrão</button>
              <button onClick={() => onSaveConfig(config)} style={{ background: '#10b981', padding: '10px 16px', borderRadius: 8, color: '#fff' }}>Salvar</button>
            </div>
          </div>
        )}

        {activeTab === 'info' && (
          <div>
            <p>Seu painel admin está funcionando!</p>
            <p style={{ marginTop: 10 }}>Para editar as meninas, vídeos e preços completos, me avise que eu implemento a versão completa aqui.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminModal;
