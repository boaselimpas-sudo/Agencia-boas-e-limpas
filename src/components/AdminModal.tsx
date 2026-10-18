import { useState } from 'react';
export function AdminModal(props:any){
if(!props.isOpen) return null;
const [autenticado,setAutenticado]=useState(false);
const [codigo,setCodigo]=useState('');
const [aba,setAba]=useState('agencia');
const SENHA='Felixpro27';
const verificarCodigo=()=>{if(codigo===SENHA){setAutenticado(true)}else{alert('Código errado!');setCodigo('')}};
const salvar=()=>{if(props.onSaveConfig) props.onSaveConfig(props.config); alert('Salvo com fotos! ✅'); props.onClose();};

// ACHA AUTOMATICO ONDE ESTÃO AS MODELOS
let chaveModelos = '';
let lista:any[] = [];
if(props.config){
  for(let k of Object.keys(props.config)){
    let v:any = (props.config as any)[k];
    if(Array.isArray(v) && v.length>0 && typeof v[0]==='object'){
      // se tem foto ou nome, é a lista de modelos
      if(v[0].foto!==undefined || v[0].image!==undefined || v[0].img!==undefined || v[0].photo!==undefined || v[0].nome!==undefined || v[0].name!==undefined){
        chaveModelos = k;
        lista = v;
        break;
      }
    }
  }
}

const handleFotoUpload = (e:any, idx:number) => {
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = (ev:any) => {
    const novo = {...props.config};
    novo[chaveModelos][idx].foto = ev.target.result;
    if(novo[chaveModelos][idx].image!==undefined) novo[chaveModelos][idx].image = ev.target.result;
    if(novo[chaveModelos][idx].img!==undefined) novo[chaveModelos][idx].img = ev.target.result;
    if(novo[chaveModelos][idx].photo!==undefined) novo[chaveModelos][idx].photo = ev.target.result;
    if(props.setConfig) props.setConfig({...novo});
  };
  reader.readAsDataURL(file);
};

return(
<div onClick={props.onClose} style={{position:'fixed',inset:'0',zIndex:999999,background:'rgba(0,0,0,0.92)',display:'flex',justifyContent:'center',padding:'10px',overflowY:'auto'}}>
<div onClick={(e:any)=>e.stopPropagation()} style={{background:'#111',width:'100%',maxWidth:'500px',borderRadius:'16px',border:'1px solid #333'}}>
<div style={{padding:'16px',display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:'1px solid #222'}}>
<h3 style={{color:'white',margin:0}}>🔒 Admin VIP</h3>
<button onClick={props.onClose} style={{background:'#ff0000',color:'white',border:'none',width:'36px',height:'36px',borderRadius:'50%',fontWeight:'bold'}}>X</button>
</div>
{!autenticado?(
<div style={{padding:'30px 20px',display:'flex',flexDirection:'column',gap:'16px',alignItems:'center'}}>
<div style={{fontSize:'48px'}}>🔐</div>
<h3 style={{color:'white',margin:0}}>Digite o Código</h3>
<input type="password" value={codigo} onChange={e=>setCodigo(e.target.value)} placeholder="Código" style={{width:'100%',padding:'16px',borderRadius:'10px',background:'#222',border:'2px solid #ff0000',color:'white',fontSize:'18px',textAlign:'center'}} onKeyDown={e=>e.key==='Enter'&&verificarCodigo()} />
<button onClick={verificarCodigo} style={{width:'100%',padding:'16px',background:'#ff0000',color:'white',border:'none',borderRadius:'10px',fontWeight:'bold'}}>Entrar</button>
</div>
):(
<div>
<div style={{display:'flex',gap:'8px',padding:'12px'}}>
<button onClick={()=>setAba('agencia')} style={{flex:1,padding:'10px',borderRadius:'8px',border:'none',background:aba==='agencia'?'#ff0000':'#333',color:'white',fontWeight:'bold'}}>Agência</button>
<button onClick={()=>setAba('fotos')} style={{flex:1,padding:'10px',borderRadius:'8px',border:'none',background:aba==='fotos'?'#ff0000':'#333',color:'white',fontWeight:'bold'}}>Fotos</button>
<button onClick={()=>setAba('precos')} style={{flex:1,padding:'10px',borderRadius:'8px',border:'none',background:aba==='precos'?'#ff0000':'#333',color:'white',fontWeight:'bold'}}>Preços</button>
</div>
<div style={{padding:'16px',maxHeight:'60vh',overflowY:'auto'}}>
{aba==='fotos' && (
<div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
<p style={{color:'#aaa',fontSize:'12px'}}>Lista encontrada: {chaveModelos} ({lista.length} modelos)</p>
{lista.map((m:any,i:number)=>(
<div key={i} style={{background:'#1a1a1a',padding:'12px',borderRadius:'10px',border:'1px solid #333'}}>
<p style={{color:'white',margin:'0 0 8px 0',fontWeight:'bold'}}>{m.nome||m.name||`Modelo ${i+1}`}</p>
{(m.foto||m.image||m.img||m.photo) && <img src={m.foto||m.image||m.img||m.photo} style={{width:'100%',height:'150px',objectFit:'cover',borderRadius:'8px',marginBottom:'8px'}}/>}
<label style={{display:'block',width:'100%',padding:'14px',background:'#ff0000',color:'white',textAlign:'center',borderRadius:'8px',fontWeight:'bold',cursor:'pointer'}}>
📷 ESCOLHER FOTO DO CELULAR
<input type="file" accept="image/*" onChange={(e)=>handleFotoUpload(e,i)} style={{display:'none'}}/>
</label>
</div>
))}
{lista.length===0 && <p style={{color:'white'}}>Nenhuma modelo encontrada! Chaves: {Object.keys(props.config||{}).join(', ')}</p>}
</div>
)}
{aba!=='fotos' && <div style={{color:'white',padding:'20px'}}><p>Aba {aba} - use a aba Fotos para carregar fotos direto do celular!</p><p style={{fontSize:'12px',color:'#aaa'}}>Config keys: {Object.keys(props.config||{}).join(', ')}</p></div>}
</div>
<div style={{padding:'12px',display:'flex',gap:'10px',borderTop:'1px solid #222'}}>
<button onClick={props.onClose} style={{flex:1,padding:'12px',background:'#333',color:'white',border:'none',borderRadius:'8px'}}>Fechar</button>
<button onClick={salvar} style={{flex:1,padding:'12px',background:'#ff0000',color:'white',border:'none',borderRadius:'8px',fontWeight:'bold'}}>💾 Salvar Tudo</button>
</div>
</div>
)}
</div>
</div>
)}
export default AdminModal;
