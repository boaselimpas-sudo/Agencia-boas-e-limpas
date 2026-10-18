import { useEffect } from "react";

export function AdminModal({ isOpen, open, onClose, children }: any) {
  const visivel = isOpen ?? open ?? false;
  
  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape' && onClose) onClose(); };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose]);

  if (!visivel) return null;

  return (
    <div 
      onClick={onClose}
      style={{
        position:'fixed', inset:0, zIndex:999999,
        background:'rgba(0,0,0,0.85)',
        display:'flex', alignItems:'center', justifyContent:'center',
        padding:'16px'
      }}
    >
      <div 
        onClick={(e)=>e.stopPropagation()}
        style={{
          background:'#151515', width:'100%', maxWidth:'520px',
          borderRadius:'16px', padding:'20px',
          border:'1px solid #333', maxHeight:'90vh', overflowY:'auto'
        }}
      >
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'18px'}}>
          <h3 style={{color:'white', margin:0}}>🔓 Painel Administrativo</h3>
          <button 
            onClick={onClose}
            style={{
              background:'#ff0000', color:'white', border:'none',
              width:'40px', height:'40px', borderRadius:'50%',
              fontSize:'20px', fontWeight:'bold', cursor:'pointer'
            }}
          >X</button>
        </div>

        {children ? children : (
          <div style={{color:'#ccc', fontSize:'14px', lineHeight:'1.5'}}>
            <p>✅ Agora o painel fecha!</p>
            <p>• Clique no <b style={{color:'white'}}>X vermelho</b></p>
            <p>• Clique fora da caixa preta</p>
            <p>• Aperte ESC no teclado</p>
            <div style={{marginTop:'20px', padding:'12px', background:'#222', borderRadius:'8px'}}>
              Aqui você vai trocar fotos e preços. Se me mandar o arquivo App.tsx eu já coloco os campos de edição aqui dentro.
            </div>
            <button onClick={onClose} style={{marginTop:'20px', width:'100%', padding:'14px', background:'white', color:'black', border:'none', borderRadius:'10px', fontWeight:'bold', cursor:'pointer'}}>Fechar Painel</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminModal;
