import { useState } from 'react';

export function AdminModal(props:any){
if(!props.isOpen) return null;
const [autenticado,setAutenticado]=useState(false);
const [codigo,setCodigo]=useState('');
const [aba,setAba]=useState('agencia');
const SENHA='Felixpro27';

const verificarCodigo=()=>{if(codigo===SENHA){setAutenticado(true)}else{alert('Código errado!');setCodigo('')}};

const salvar=()=>{if(props.onSaveConfig) props.onSaveConfig(props.config); alert('Salvo! ✅'); props.onClose();};

// FUNÇÃO NOVA: CARREGA FOTO DIRETO DO CELULAR
const handleFotoUpload = (e:any, index:number) => {
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = (ev:any) => {
    const newConfig = {...props.config};
    if(newConfig.modelos) newConfig.modelos[index].foto = ev.target.result;
    if(newConfig.girls) newConfig.girls[index].foto = ev.target.result;
    if(newConfig.meninas) newConfig.meninas[index].foto = ev.target.result;
    // tenta achar onde estão as fotos
    if(props.config.modelos) props.config.modelos[index].foto = ev.target.result;
    if(props.setConfig) props.setConfig({...props.config});
  };
  reader.readAsDataURL(file);
};

const modelos = props.config?.modelos || props.config?.girls || props.config?.meninas || [];

return(
<div onClick={props.onClose} style={{position:'fixed',inset:'0',zIndex:999999,background:'rgba(0,0,0,0.92)',display:'flex',justifyContent:'center',padding:'10px',overflowY:'auto'}}>
<div onClick={(e:any)=>e.stopPropagation()} style={{background:'#111',width:'100%',maxWidth:'500px',borderRadius:'16px',border:'1px solid #333',height:'fit-content'}}>
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
{aba==='agencia' && (
<div style={{color:'white',display:'flex',flexDirection:'column',gap:'12px'}}>
<label>Nome da Agência</label>
<input value={props.config?.nomeAgencia||''} onChange={e=>props.setConfig&&props.setConfig({...props.config,nomeAgencia:e.target.value})} style={{padding:'10px',borderRadius:'8px',background:'#222',border:'1px solid #444',color:'white'}}/>
<label>WhatsApp</label>
<input value={props.config?.whatsapp||''} onChange={e=>props.setConfig&&props.setConfig({...props.config,whatsapp:e.target.value})} style={{padding:'10px',borderRadius:'8px',background:'#222',border:'1px solid #444',color:'white'}}/>
</div>
)}

{aba==='fotos' && (
<div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
{modelos.map((m:any,i:number)=>(
<div key={i} style={{background:'#1a1a1a',padding:'12px',borderRadius:'10px',border:'1px solid #333'}}>
<p style={{color:'white',margin:'0 0 8px 0',fontWeight:'bold'}}>{m.nome||m.name||`Modelo ${i+1}`}</p>
{m.foto && <img src={m.foto} style={{width:'100%',height:'150px',objectFit:'cover',borderRadius:'8px',marginBottom:'8px'}}/>}
<label style={{display:'block',width:'100%',padding:'12px',background:'#ff0000',color:'white',textAlign:'center',borderRadius:'8px',fontWeight:'bold',cursor:'pointer'}}>
📷 Escolher Foto da Galeria
<input type="file" accept="image/*" onChange={(e)=>handleFotoUpload(e,i)} style={{display:'none'}}/>
</label>
</div>
))}
</div>
)}

{aba==='precos' && (
<div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
{modelos.map((m:any,i:number)=>(
<div key={i} style={{background:'#1a1a1a',padding:'10px',borderRadius:'8px',display:'flex',gap:'8px',alignItems:'center'}}>
<div style={{width:'50px',height:'50px',background:'#333',borderRadius:'6px',overflow:'hidden'}}>{m.foto && <img src={m.foto} style={{width:'100%',height:'100%',objectFit:'cover'}}/>}</div>
<div style={{flex:1}}>
<input value={m.nome||m.name||''} onChange={e=>{const c={...props.config}; const key=c.modelos?'modelos':c.girls?'girls':'meninas'; c[key][i].nome=e.target.value; if(c[key][i].name!==undefined) c[key][i].name=e.target.value; props.setConfig&&props.setConfig({...c})}} style={{width:'100%',padding:'6px',background:'#222',border:'1px solid #444',color:'white',borderRadius:'4px',marginBottom:'4px'}}/>
<input type="number" value={m.preco||m.price||''} onChange={e=>{const c={...props.config}; const key=c.modelos?'modelos':c.girls?'girls':'meninas'; if(c[key][i].preco!==undefined) c[key][i].preco=e.target.value; if(c[key][i].price!==undefined) c[key][i].price=e.target.value; props.setConfig&&props.setConfig({...c})}} style={{width:'100%',padding:'6px',background:'#222',border:'1px solid #444',color:'white',borderRadius:'4px'}}/>
</div>
</div>
))}
</div>
)}
</div>

<div style={{padding:'12px',display:'flex',gap:'10px',borderTop:'1px solid #222'}}>
<button onClick={props.onClose} style={{flex:1,padding:'12px',background:'#333',color:'white',border:'none',borderRadius:'8px'}}>Fechar</button>
<button onClick={salvar} style={{flex:1,padding:'12px',background:'#ff0000',color:'white',border:'none',borderRadius:'8px',fontWeight:'bold'}}>💾 Salvar</button>
</div>
</div>
)}
</div>
</div>
)}
export default AdminModal;
