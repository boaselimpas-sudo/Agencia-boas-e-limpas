export function AdminModal(props: any) {
  const visivel = props.isOpen ?? props.open ?? false;
  const onClose = props.onClose;
  const children = props.children;

  if (!visivel) return null;

  return (
    <div 
      onClick={onClose}
      style={{
        position:'fixed', inset:'0', zIndex:999999,
        background:'rgba(0,0,0,0.85)',
        display:'flex', alignItems:'center', justifyContent:'center',
        padding:'16px'
      }}
    >
      <div 
        onClick={(e: any)=>e.stopPropagation()}
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
          <div style={{color:'#ccc', fontSize:'14px'}}>
            <p>Painel funcionando! Clique no X pra fechar.</p>
            <button onClick={onClose} style={{marginTop:'15px', width:'100%', padding:'14px', background:'white', color:'black', border:'none', borderRadius:'10px', fontWeight:'bold'}}>Fechar Painel</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminModal;
