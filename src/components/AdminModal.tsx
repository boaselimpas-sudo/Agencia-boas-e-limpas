import { useState } from 'react';
import { INITIAL_MENU_ITEMS, INITIAL_AGENCY_CONFIG } from '../data/initialData';

export function AdminModal(props: any) {
  if (!props.isOpen) return null;
  const [autenticado, setAutenticado] = useState(false);
  const [codigo, setCodigo] = useState('');
  const [aba, setAba] = useState('fotos');
  const SENHA = 'Felixpro27';

  const verificarCodigo = () => {
    if (codigo === SENHA) setAutenticado(true);
    else alert('Senha errada!');
  };

  const [configAgencia, setConfigAgencia] = useState(() => {
    try {
      const s = localStorage.getItem('agency_config') || localStorage.getItem('agency_config_v2');
      return s ? JSON.parse(s) : INITIAL_AGENCY_CONFIG;
    } catch { return INITIAL_AGENCY_CONFIG; }
  });

  const [lista, setLista] = useState(() => {
    try {
      const keys = ['menu_items','agency_menu_items','boas_e_limpas_menu','vip_menu_items','agency_menu','menu'];
      for (let k of keys) {
        const s = localStorage.getItem(k);
        if (s) {
          const arr = JSON.parse(s);
          if (Array.isArray(arr) && arr.length > 0) return arr;
        }
      }
      return INITIAL_MENU_ITEMS;
    } catch { return INITIAL_MENU_ITEMS; }
  });

  const handleFotoUpload = (e: any, idx: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev: any) => {
      const base64 = ev.target.result;
      const nova = [...lista];
      nova[idx].image = base64;
      nova[idx].foto = base64;
      nova[idx].img = base64;
      setLista(nova);
    };
    reader.readAsDataURL(file);
  };

  const salvar = () => {
    const jsonMenu = JSON.stringify(lista);
    const jsonConfig = JSON.stringify(configAgencia);
    // Salva em TODAS as chaves possiveis
    localStorage.setItem('menu_items', jsonMenu);
    localStorage.setItem('agency_menu_items', jsonMenu);
    localStorage.setItem('boas_e_limpas_menu', jsonMenu);
    localStorage.setItem('vip_menu_items', jsonMenu);
    localStorage.setItem('agency_config', jsonConfig);
    localStorage.setItem('INITIAL_AGENCY_CONFIG', jsonConfig);
    
    if (props.onSaveConfig) {
      // tenta salvar do jeito que o App.tsx espera
      props.onSaveConfig({ ...configAgencia, menu: lista, modelos: lista, items: lista });
      if (props.onSaveMenu) props.onSaveMenu(lista);
    }
    alert('✅ SALVO! Vai recarregar o site agora.');
    setTimeout(() => window.location.reload(), 500);
  };

  return (
    <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.9)', zIndex:9999, overflowY:'auto', padding:'15px'}}>
      <div style={{background:'#1a1a1a', maxWidth:'500px', margin:'20px auto', borderRadius:'16px', padding:'20px', color:'white'}}>
        
        {!autenticado ? (
          <div>
            <h2 style={{textAlign:'center'}}>🔒 Admin VIP</h2>
            <input type="password" placeholder="Código" value={codigo} onChange={(e:any)=>setCodigo(e.target.value)} style={{width:'100%', padding:'15px', borderRadius:'10px', margin:'15px 0', background:'#333', color:'white', border:'1px solid #444'}} />
            <button onClick={verificarCodigo} style={{width:'100%', padding:'15px', background:'red', borderRadius:'10px', fontWeight:'bold'}}>Entrar</button>
            <button onClick={props.onClose} style={{width:'100%', padding:'10px', background:'#333', borderRadius:'10px', marginTop:'10px'}}>Fechar</button>
          </div>
        ) : (
          <div>
            <div style={{display:'flex', gap:'8px', marginBottom:'20px'}}>
              <button onClick={()=>setAba('agencia')} style={{flex:1, padding:'12px', background:aba==='agencia'?'#ff0000':'#333', borderRadius:'10px', border:'none', color:'white'}}>Agência</button>
              <button onClick={()=>setAba('fotos')} style={{flex:1, padding:'12px', background:aba==='fotos'?'#ff0000':'#333', borderRadius:'10px', border:'none', color:'white', fontWeight:'bold'}}>Fotos</button>
              <button onClick={()=>setAba('precos')} style={{flex:1, padding:'12px', background:aba==='precos'?'#ff0000':'#333', borderRadius:'10px', border:'none', color:'white'}}>Preços</button>
            </div>

            {aba==='fotos' && (
              <div>
                <p style={{background:'#222', padding:'10px', borderRadius:'8px'}}>✅ Lista encontrada: ({lista.length} modelos) - FOTOS DIRETO DO CELULAR!</p>
                {lista.map((m:any, idx:number)=>(
                  <div key={idx} style={{border:'1px solid #333', padding:'12px', margin:'12px 0', borderRadius:'12px', background:'#222'}}>
                    <b style={{fontSize:'16px'}}>{m.name || m.nome} - {m.price || m.preco} MT</b>
                    {m.image && <img src={m.image} style={{width:'100%', height:'200px', objectFit:'cover', borderRadius:'10px', margin:'10px 0'}} />}
                    <label style={{display:'block', width:'100%', background:'#ff0000', padding:'14px', borderRadius:'10px', textAlign:'center', fontWeight:'bold', cursor:'pointer'}}>
                      📷 ESCOLHER FOTO DA GALERIA
                      <input type="file" accept="image/*" onChange={(e)=>handleFotoUpload(e, idx)} style={{display:'none'}} />
                    </label>
                    <p style={{fontSize:'11px', color:'#aaa', marginTop:'6px', textAlign:'center'}}>SEM LINK! Escolhe direto do celular</p>
                  </div>
                ))}
              </div>
            )}

            {aba==='agencia' && <div><p>Aba agência - use a aba Fotos para trocar fotos.</p><textarea value={JSON.stringify(configAgencia, null, 2)} onChange={(e)=>{try{setConfigAgencia(JSON.parse(e.target.value))}catch{}}} style={{width:'100%', height:'200px', background:'#222', color:'white'}} /></div>}
            {aba==='precos' && <div>{lista.map((m:any, idx:number)=><div key={idx} style={{display:'flex', gap:'10px', margin:'10px 0'}}><span style={{flex:1}}>{m.name}</span><input value={m.price} onChange={(e)=>{const n=[...lista]; n[idx].price=e.target.value; setLista(n)}} style={{width:'80px', padding:'8px', background:'#333', color:'white', borderRadius:'6px'}} /></div>)}</div>}

            <div style={{display:'flex', gap:'10px', marginTop:'20px'}}>
              <button onClick={props.onClose} style={{flex:1, padding:'16px', background:'#333', borderRadius:'12px', color:'white', border:'none'}}>Fechar</button>
              <button onClick={salvar} style={{flex:2, padding:'16px', background:'#ff0000', borderRadius:'12px', color:'white', fontWeight:'bold', border:'none', fontSize:'16px'}}>💾 SALVAR TUDO</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  }
