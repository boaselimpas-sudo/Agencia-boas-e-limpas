import { useState } from 'react';
import { INITIAL_MENU_ITEMS, INITIAL_AGENCY_CONFIG } from '../data/initialData';

export function AdminModal(props: any) {
  if (!props.isOpen) return null;
  const [autenticado, setAutenticado] = useState(false);
  const [codigo, setCodigo] = useState('');
  const [aba, setAba] = useState('modelos');
  const SENHA = 'Felixpro27';

  const [lista, setLista] = useState(() => {
    try {
      const keys = ['menu_items','agency_menu_items','boas_e_limpas_menu','vip_menu_items','agency_menu','menu'];
      for (let k of keys) {
        const s = localStorage.getItem(k);
        if (s) {
          const arr = JSON.parse(s);
          if (Array.isArray(arr) && arr.length > 0) return arr.map((m:any)=> ({
            name: m.name || m.nome || 'Modelo',
            price: m.price || m.preco || '3500',
            image: m.image || m.foto || m.img || '',
            services: m.services || m.servicos || 'Beijo, Massagem, Completo',
            location: m.location || m.localizacao || 'Polana, Maputo',
            height: m.height || m.altura || '1.65m - 60kg',
            description: m.description || m.descricao || 'Menina carinhosa, atenciosa e bem limpinha.',
            ...m
          }));
        }
      }
      return INITIAL_MENU_ITEMS.map((m:any)=>({
        name: m.name || 'Modelo',
        price: m.price || '3500',
        image: m.image || '',
        services: (m as any).services || 'Completo, Beijo, Oral',
        location: (m as any).location || 'Maputo',
        height: (m as any).height || '1.65m',
        description: (m as any).description || 'Boa e limpa, atenciosa.',
        ...m
      }));
    } catch { return INITIAL_MENU_ITEMS; }
  });

  const handleFoto = (idx: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e:any) => {
      const n = [...lista];
      n[idx].image = e.target.result;
      setLista(n);
    };
    reader.readAsDataURL(file);
  };

  const updateField = (idx: number, field: string, val: string) => {
    const n = [...lista];
    n[idx][field] = val;
    setLista(n);
  };

  const salvar = () => {
    const json = JSON.stringify(lista);
    localStorage.setItem('menu_items', json);
    localStorage.setItem('agency_menu_items', json);
    localStorage.setItem('boas_e_limpas_menu', json);
    localStorage.setItem('vip_menu_items', json);
    localStorage.setItem('agency_menu', json);
    if (props.onSaveConfig) props.onSaveConfig({ menu: lista, modelos: lista });
    if (props.onSaveMenu) props.onSaveMenu(lista);
    alert('✅ TUDO SALVO! 12 modelos atualizadas!');
    window.location.reload();
  };

  if (!autenticado) {
    return (
      <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.95)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px'}}>
        <div style={{background:'#1e1e1e', width:'100%', maxWidth:'380px', padding:'25px', borderRadius:'16px', color:'white'}}>
          <h2 style={{textAlign:'center'}}>🔒 Admin VIP</h2>
          <input type="password" placeholder="Código Felixpro27" value={codigo} onChange={e=>setCodigo(e.target.value)} style={{width:'100%', padding:'15px', borderRadius:'10px', margin:'15px 0', background:'#333', color:'white', border:'1px solid #555'}} />
          <button onClick={()=> codigo===SENHA ? setAutenticado(true) : alert('Senha errada!')} style={{width:'100%', padding:'15px', background:'#ff0000', borderRadius:'10px', fontWeight:'bold', color:'white', border:'none'}}>Entrar</button>
          <button onClick={props.onClose} style={{width:'100%', padding:'10px', background:'#333', borderRadius:'10px', marginTop:'10px', color:'white', border:'none'}}>Fechar</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.92)', zIndex:9999, overflowY:'auto', padding:'10px'}}>
      <div style={{background:'#111', maxWidth:'520px', margin:'10px auto', borderRadius:'16px', padding:'15px', color:'white', border:'1px solid #333'}}>
        <div style={{display:'flex', gap:'6px', marginBottom:'15px'}}>
          <button onClick={()=>setAba('modelos')} style={{flex:1, padding:'12px 4px', background:aba==='modelos'?'#ff0000':'#2a2a2a', borderRadius:'10px', border:'none', color:'white', fontWeight:'bold', fontSize:'12px'}}>👩 Modelos</button>
          <button onClick={()=>setAba('agencia')} style={{flex:1, padding:'12px 4px', background:aba==='agencia'?'#ff0000':'#2a2a2a', borderRadius:'10px', border:'none', color:'white', fontSize:'12px'}}>Agência</button>
        </div>

        {aba==='modelos' && (
          <div>
            <div style={{background:'#1e1e1e', padding:'10px', borderRadius:'8px', marginBottom:'10px', textAlign:'center', fontSize:'13px'}}>✅ {lista.length} modelos - Painel Completo</div>
            {lista.map((m:any, idx:number)=>(
              <div key={idx} style={{background:'#1e1e1e', border:'1px solid #2a2a2a', borderRadius:'14px', padding:'12px', marginBottom:'14px'}}>
                <div style={{display:'flex', gap:'10px', marginBottom:'10px'}}>
                  {m.image ? <img src={m.image} style={{width:'70px', height:'70px', objectFit:'cover', borderRadius:'10px'}} /> : <div style={{width:'70px', height:'70px', background:'#333', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center'}}>Sem foto</div>}
                  <div style={{flex:1}}>
                    <input value={m.name} onChange={e=>updateField(idx,'name',e.target.value)} placeholder="Nome" style={{width:'100%', padding:'8px', background:'#2a2a2a', border:'1px solid #333', borderRadius:'6px', color:'white', marginBottom:'6px'}} />
                    <div style={{display:'flex', gap:'6px'}}>
                      <input value={m.price} onChange={e=>updateField(idx,'price',e.target.value)} placeholder="Preço MT" style={{flex:1, padding:'8px', background:'#2a2a2a', border:'1px solid #333', borderRadius:'6px', color:'white'}} />
                      <input value={m.height} onChange={e=>updateField(idx,'height',e.target.value)} placeholder="Altura/Peso" style={{flex:1, padding:'8px', background:'#2a2a2a', border:'1px solid #333', borderRadius:'6px', color:'white'}} />
                    </div>
                  </div>
                </div>

                <label style={{display:'block', background:'#ff0000', padding:'10px', borderRadius:'8px', textAlign:'center', fontWeight:'bold', fontSize:'12px', marginBottom:'10px', cursor:'pointer'}}>
                  📷 TROCAR FOTO - GALERIA
                  <input type="file" accept="image/*" onChange={e=> e.target.files && handleFoto(idx, e.target.files[0])} style={{display:'none'}} />
                </label>

                <input value={m.location} onChange={e=>updateField(idx,'location',e.target.value)} placeholder="📍 Localização: ex: Polana, Maputo" style={{width:'100%', padding:'9px', background:'#2a2a2a', border:'1px solid #333', borderRadius:'6px', color:'white', marginBottom:'8px', fontSize:'13px'}} />
                <input value={m.services} onChange={e=>updateField(idx,'services',e.target.value)} placeholder="💋 Serviços: ex: Beijo, Oral, Completo, Massagem" style={{width:'100%', padding:'9px', background:'#2a2a2a', border:'1px solid #333', borderRadius:'6px', color:'white', marginBottom:'8px', fontSize:'13px'}} />
                <textarea value={m.description} onChange={e=>updateField(idx,'description',e.target.value)} placeholder="📝 Descrição da garota..." rows={2} style={{width:'100%', padding:'9px', background:'#2a2a2a', border:'1px solid #333', borderRadius:'6px', color:'white', fontSize:'13px'}} />
              </div>
            ))}
          </div>
        )}

        {aba==='agencia' && <p style={{color:'#aaa'}}>Config da agência fica no código principal. Use aba Modelos para editar tudo.</p>}

        <div style={{position:'sticky', bottom:0, background:'#111', padding:'10px 0', display:'flex', gap:'10px', marginTop:'10px'}}>
          <button onClick={props.onClose} style={{flex:1, padding:'15px', background:'#333', borderRadius:'12px', color:'white', border:'none'}}>Fechar</button>
          <button onClick={salvar} style={{flex:2, padding:'15px', background:'#ff0000', borderRadius:'12px', color:'white', fontWeight:'bold', border:'none'}}>💾 SALVAR TUDO</button>
        </div>
      </div>
    </div>
  );
      }
