import { useState } from 'react';

export function AdminModal(props: any) {
  if (!props.isOpen) return null;

  const [autenticado, setAutenticado] = useState(false);
  const [codigo, setCodigo] = useState('');
  const SENHA = '2025'; // SEU CÓDIGO AQUI - pode trocar!

  const [tab, setTab] = useState(props.initialTab || 'config');
  const [config, setConfigLocal] = useState(props.config || {});
  const [items, setItemsLocal] = useState(props.items || []);
  const [gallery, setGalleryLocal] = useState(props.galleryItems || []);

  const verificarCodigo = () => {
    if (codigo === SENHA) {
      setAutenticado(true);
    } else {
      alert('Código errado! Tenta 2025');
    }
  };

  const salvarTudo = () => {
    if (props.onSaveConfig) props.onSaveConfig(config);
    if (props.onSaveItems) props.onSaveItems(items);
    if (props.onSaveGalleryItems) props.onSaveGalleryItems(gallery);
    alert('Salvo com sucesso! ✅');
    props.onClose();
    setAutenticado(false);
    setCodigo('');
  };

  return (
    <div onClick={props.onClose} style={{position:'fixed',inset:'0',zIndex:999999,background:'rgba(0,0,0,0.92)',display:'flex',justifyContent:'center',padding:'10px',overflowY:'auto'}}>
      <div onClick={(e:any)=>e.stopPropagation()} style={{background:'#111',width:'100%',maxWidth:'600px',borderRadius:'16px',border:'1px solid #333',display:'flex',flexDirection:'column',maxHeight:'95vh'}}>
        
        {/* CABEÇALHO */}
        <div style={{padding:'16px',borderBottom:'1px solid #222',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h3 style={{color:'white',margin:0}}>🔒 Admin VIP</h3>
          <button onClick={props.onClose} style={{background:'#ff0000',color:'white',border:'none',width:'38px',height:'38px',borderRadius:'50%',fontWeight:'bold',fontSize:'18px'}}>X</button>
        </div>

        {/* TELA DE CÓDIGO */}
        {!autenticado ? (
          <div style={{padding:'30px 20px',display:'flex',flexDirection:'column',gap:'16px',alignItems:'center'}}>
            <div style={{fontSize:'48px'}}>🔐</div>
            <h3 style={{color:'white',margin:0}}>Digite o Código de Acesso</h3>
            <input 
              type="password" 
              value={codigo} 
              onChange={e=>setCodigo(e.target.value)}
              placeholder="Código"
              style={{width:'100%',padding:'16px',borderRadius:'10px',background:'#222',border:'2px solid #ff0000',color:'white',fontSize:'20px',textAlign:'center',letterSpacing:'8px'}} 
              onKeyDown={e=>e.key==='Enter' && verificarCodigo()}
            />
            <button onClick={verificarCodigo} style={{width:'100%',padding:'16px',background:'#ff0000',color:'white',border:'none',borderRadius:'10px',fontWeight:'bold',fontSize:'16px'}}>Entrar</button>
            <p style={{color:'#666',fontSize:'12px'}}>Código padrão: 2025</p>
          </div>
        ) : (
          <>
            <div style={{display:'flex',gap:'6px',padding:'12px',background:'#0a0a0a'}}>
              <button onClick={()=>setTab('config')} style={{flex:1,padding:'10px',borderRadius:'8px',border:'none',background:tab==='config'?'#ff0000':'#222',color:'white',fontWeight:'bold'}}>Agência</button>
              <button onClick={()=>setTab('gallery')} style={{flex:1,padding:'10px',borderRadius:'8px',border:'none',background:tab==='gallery'?'#ff0000':'#222',color:'white',fontWeight:'bold'}}>Fotos</button>
              <button onClick={()=>setTab('items')} style={{flex:1,padding:'10px',borderRadius:'8px',border:'none',background:tab==='items'?'#ff0000':'#222',color:'white',fontWeight:'bold'}}>Preços</button>
            </div>

            <div style={{flex:1,overflowY:'auto',padding:'16px',display:'flex',flexDirection:'column',gap:'12px'}}>
              {tab==='config' && (
                <>
                  <label style={{color:'#999',fontSize:'12px'}}>Nome da Agência</label>
                  <input value={config.name||''} onChange={e=>setConfigLocal({...config,name:e.target.value})} style={{padding:'12px',borderRadius:'8px',background:'#222',border:'1px solid #333',color:'white'}} />
                  <label style={{color:'#999',fontSize:'12px'}}>WhatsApp</label>
                  <input value={config.phone||config.whatsapp||''} onChange={e=>setConfigLocal({...config,phone:e.target.value,whatsapp:e.target.value})} style={{padding:'12px',borderRadius:'8px',background:'#222',border:'1px solid #333',color:'white'}} />
                  <label style={{color:'#999',fontSize:'12px'}}>Preço VIP</label>
                  <input value={config.subscriptionPrice||''} onChange={e=>setConfigLocal({...config,subscriptionPrice:e.target.value})} style={{padding:'12px',borderRadius:'8px',background:'#222',border:'1px solid #333',color:'white'}} />
                </>
              )}
              {tab==='gallery' && gallery.map((g:any,i:number)=>(
                <div key={i} style={{background:'#1a1a1a',padding:'10px',borderRadius:'8px',border:'1px solid #222'}}>
                  <img src={g.image||g.src} style={{width:'100%',height:'120px',objectFit:'cover',borderRadius:'6px'}} />
                  <input value={g.name||''} placeholder="Nome" onChange={e=>{const ng=[...gallery];ng[i]={...ng[i],name:e.target.value};setGalleryLocal(ng)}} style={{width:'100%',marginTop:'6px',padding:'8px',background:'#222',border:'1px solid #333',color:'white',borderRadius:'6px'}} />
                  <input value={g.image||g.src||''} placeholder="Link da foto" onChange={e=>{const ng=[...gallery];ng[i]={...ng[i],image:e.target.value,src:e.target.value};setGalleryLocal(ng)}} style={{width:'100%',marginTop:'4px',padding:'8px',background:'#222',border:'1px solid #333',color:'white',borderRadius:'6px',fontSize:'11px'}} />
                </div>
              ))}
              {tab==='items' && items.slice(0,10).map((it:any,i:number)=>(
                <div key={i} style={{background:'#1a1a1a',padding:'10px',borderRadius:'8px',border:'1px solid #222',display:'flex',gap:'8px',alignItems:'center'}}>
                  <img src={it.image||it.src} style={{width:'50px',height:'50px',objectFit:'cover',borderRadius:'6px'}} />
                  <div style={{flex:1}}>
                    <input value={it.name||''} onChange={e=>{const ni=[...items];ni[i]={...ni[i],name:e.target.value};setItemsLocal(ni)}} style={{width:'100%',padding:'6px',background:'#222',border:'1px solid #333',color:'white',borderRadius:'4px',fontSize:'12px'}} />
                    <input value={it.price||''} onChange={e=>{const ni=[...items];ni[i]={...ni[i],price:e.target.value};setItemsLocal(ni)}} style={{width:'100%',marginTop:'4px',padding:'6px',background:'#222',border:'1px solid #333',color:'white',borderRadius:'4px',fontSize:'12px'}} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{padding:'12px',borderTop:'1px solid #222',display:'flex',gap:'8px'}}>
              <button onClick={props.onClose} style={{flex:1,padding:'14px',background:'#222',color:'white',border:'1px solid #444',borderRadius:'10px'}}>Fechar</button>
              <button onClick={salvarTudo} style={{flex:1,padding:'14px',background:'#ff0000',color:'white',border:'none',borderRadius:'10px',fontWeight:'bold'}}>💾 Salvar</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export default AdminModal;
