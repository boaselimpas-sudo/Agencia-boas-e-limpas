'use client';
import { useState } from 'react';
export default function AdminModal({meninas,setMeninas,onClose,config,setConfig}:{meninas:any[],setMeninas:any,onClose:any,config:any,setConfig:any}){
const SENHA='2024';
const [senha,setSenha]=useState('');
const [logado,setLogado]=useState(false);
const [erro,setErro]=useState('');
const [aba,setAba]=useState('catalogo');
const [idx,setIdx]=useState<number|null>(null);
const [form,setForm]=useState({nome:'',foto:'',desc:'',preco:'',local:'',idade:'',wpp:''});
const vazio={nome:'',foto:'',desc:'',preco:'',local:'',idade:'',wpp:''};
if(!logado){
return (
<div style={{position:'fixed',inset:0,zIndex:999999,background:'#000',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}>
<div style={{background:'#1a1a1a',border:'1px solid #333',padding:'25px',borderRadius:'12px',width:'100%',maxWidth:'360px'}}>
<h2 style={{color:'#fff',margin:'0 0 15px 0',textAlign:'center'}}>🔒 Painel Admin</h2>
<input type='password' placeholder='Senha: 2024' value={senha} onChange={e=>setSenha(e.target.value)} style={{width:'100%',padding:'12px',borderRadius:'8px',border:'1px solid #444',background:'#222',color:'#fff',marginBottom:'10px',boxSizing:'border-box'}}/>
{erro && <div style={{color:'#ff4444',fontSize:'13px',marginBottom:'8px',textAlign:'center'}}>{erro}</div>}
<button onClick={()=>{if(senha===SENHA){setLogado(true);setErro('')}else setErro('Senha incorreta!')}} style={{width:'100%',padding:'12px',background:'#E30613',color:'#fff',border:'none',borderRadius:'8px',fontWeight:'bold'}}>Entrar</button>
<button onClick={onClose} style={{width:'100%',padding:'10px',background:'transparent',color:'#aaa',border:'none',marginTop:'8px'}}>Cancelar</button>
</div>
</div>
)}
const salvar=()=>{if(!form.nome)return alert('Nome obrigatório');if(idx===null)setMeninas([...meninas,{...form,id:Date.now()}]);else{const c=[...meninas];c[idx]=form;setMeninas(c)};setForm(vazio);setIdx(null)}
const editar=(i:number)=>{setForm(meninas[i]);setIdx(i);setAba('catalogo')}
const apagar=(i:number)=>{if(confirm('Apagar?'))setMeninas(meninas.filter((_:any,j:number)=>j!==i))}
return (
<div style={{position:'fixed',inset:0,zIndex:9999,background:'#0a0a0a',color:'#fff',overflow:'auto',padding:'15px'}}>
<div style={{maxWidth:'600px',margin:'0 auto',background:'#1a1a1a',borderRadius:'12px',padding:'15px',border:'1px solid #333'}}>
<div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'15px'}}>
<h2 style={{color:'#fff',margin:0,fontSize:'16px'}}>PAINEL - {meninas.length} MENINAS</h2>
<button onClick={onClose} style={{background:'#000',color:'#fff',border:'1px solid #444',padding:'8px 16px',borderRadius:'20px'}}>X Fechar</button>
</div>
<div style={{display:'flex',gap:'8px',marginBottom:'15px'}}>
<button onClick={()=>setAba('catalogo')} style={{padding:'8px 14px',borderRadius:'20px',border:'none',background:aba==='catalogo'?'#E30613':'#333',color:'#fff'}}>Catálogo ({meninas.length})</button>
<button onClick={()=>setAba('config')} style={{padding:'8px 14px',borderRadius:'20px',border:'none',background:aba==='config'?'#E30613':'#333',color:'#fff'}}>Config</button>
</div>
{aba==='catalogo'&&(
<div>
<button onClick={()=>{setForm(vazio);setIdx(null)}} style={{width:'100%',padding:'12px',background:'#10b981',color:'#fff',border:'none',borderRadius:'8px',marginBottom:'15px',fontWeight:'bold'}}>+ Adicionar Menina</button>
<div style={{background:'#222',padding:'12px',borderRadius:'8px',marginBottom:'20px',border:'1px solid #333'}}>
<input placeholder='Nome' value={form.nome} onChange={e=>setForm({...form,nome:e.target.value})} style={{width:'100%',padding:'10px',marginBottom:'8px',background:'#111',color:'#fff',border:'1px solid #444',borderRadius:'6px',boxSizing:'border-box'}}/>
<input placeholder='Link da Foto' value={form.foto} onChange={e=>setForm({...form,foto:e.target.value})} style={{width:'100%',padding:'10px',marginBottom:'8px',background:'#111',color:'#fff',border:'1px solid #444',borderRadius:'6px',boxSizing:'border-box'}}/>
<input placeholder='Preço ex: 2500 MT' value={form.preco} onChange={e=>setForm({...form,preco:e.target.value})} style={{width:'100%',padding:'10px',marginBottom:'8px',background:'#111',color:'#fff',border:'1px solid #444',borderRadius:'6px',boxSizing:'border-box'}}/>
<input placeholder='WhatsApp' value={form.wpp} onChange={e=>setForm({...form,wpp:e.target.value})} style={{width:'100%',padding:'10px',marginBottom:'8px',background:'#111',color:'#fff',border:'1px solid #444',borderRadius:'6px',boxSizing:'border-box'}}/>
<button onClick={salvar} style={{width:'100%',padding:'12px',background:'#E30613',color:'#fff',border:'none',borderRadius:'8px',fontWeight:'bold'}}>{idx===null?'Salvar Nova':'Atualizar'}</button>
</div>
{meninas.map((m:any,i:number)=>(
<div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',background:'#222',padding:'10px',borderRadius:'8px',marginBottom:'8px',border:'1px solid #333'}}>
<span style={{color:'#fff',fontWeight:'bold',flex:1}}>{i+1}. {m.nome}</span>
<div style={{display:'flex',gap:'6px'}}>
<button onClick={()=>editar(i)} style={{background:'#3b82f6',color:'#fff',border:'none',padding:'6px 10px',borderRadius:'6px'}}>Editar</button>
<button onClick={()=>apagar(i)} style={{background:'#ef4444',color:'#fff',border:'none',padding:'6px 10px',borderRadius:'6px'}}>Apagar</button>
</div>
</div>
))}
</div>
)}
{aba==='config'&&<div style={{background:'#222',padding:'15px',borderRadius:'8px',border:'1px solid #333'}}><p style={{color:'#fff'}}>Configurações do site aqui</p><input placeholder='WPP Principal' value={config.wpp||''} onChange={e=>setConfig({...config,wpp:e.target.value})} style={{width:'100%',padding:'10px',background:'#111',color:'#fff',border:'1px solid #444',borderRadius:'6px'}}/></div>}
</div>
</div>
)
 }
