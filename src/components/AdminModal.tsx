'use client';
import { useState } from 'react';
export function AdminModal({meninas,setMeninas,onClose}:any){
 const SENHA='2024';
 const [senha,setSenha]=useState('');
 const [logado,setLogado]=useState(false);
 const [erro,setErro]=useState('');
 const [aba,setAba]=useState('catalogo');
 const [idx,setIdx]=useState<number|null>(null);
 const vazio={nome:'',foto:'',desc:'',preco:'',whats:''};
 const [form,setForm]=useState(vazio);
 const salvar=()=>{
  if(idx!==null){
   const c=[...meninas]; c[idx]=form; setMeninas(c);
  } else { setMeninas([...meninas,form]); }
  setForm(vazio); setIdx(null); setAba('catalogo');
 };
 if(!logado){
  return (
  <div style={{position:'fixed',inset:0,zIndex:9999,background:'rgba(0,0,0,0.8)',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}>
   <div style={{background:'#1a1a1a',border:'1px solid #333',padding:'24px',borderRadius:'12px',width:'100%',maxWidth:'380px'}}>
    <h2 style={{color:'#fff',margin:'0 0 15px 0'}}>Acesso Admin</h2>
    <input type='password' placeholder='Digite a senha' value={senha} onChange={e=>setSenha(e.target.value)} style={{width:'100%',padding:'12px',borderRadius:'8px',border:'1px solid #444',background:'#222',color:'#fff',boxSizing:'border-box'}} />
    {erro && <div style={{color:'#ff4444',marginTop:'10px',fontSize:'14px'}}>{erro}</div>}
    <button onClick={()=>{if(senha===SENHA){setLogado(true);setErro('')}else{setErro('Senha incorreta')}}} style={{width:'100%',marginTop:'12px',padding:'12px',background:'#fff',color:'#000',border:'none',borderRadius:'8px',fontWeight:'bold'}}>Entrar</button>
    <button onClick={onClose} style={{width:'100%',marginTop:'8px',padding:'10px',background:'transparent',color:'#888',border:'none'}}>Fechar</button>
   </div>
  </div>
  )
 }
 return (
  <div style={{position:'fixed',inset:0,zIndex:9999,background:'rgba(0,0,0,0.9)',display:'flex',alignItems:'center',justifyContent:'center',padding:'10px',overflow:'auto'}}>
   <div style={{background:'#1a1a1a',border:'1px solid #333',padding:'20px',borderRadius:'12px',width:'100%',maxWidth:'500px',maxHeight:'90vh',overflow:'auto'}}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'15px'}}>
     <h2 style={{color:'#fff',margin:0}}>Painel Admin</h2>
     <button onClick={onClose} style={{background:'#333',color:'#fff',border:'none',padding:'6px 12px',borderRadius:'6px'}}>X</button>
    </div>
    <div style={{display:'flex',gap:'8px',marginBottom:'15px'}}>
     <button onClick={()=>setAba('catalogo')} style={{flex:1,padding:'10px',background:aba==='catalogo'?'#fff':'#333',color:aba==='catalogo'?'#000':'#fff',border:'none',borderRadius:'6px'}}>Catálogo</button>
     <button onClick={()=>{setForm(vazio);setIdx(null);setAba('form')}} style={{flex:1,padding:'10px',background:aba==='form'?'#fff':'#333',color:aba==='form'?'#000':'#fff',border:'none',borderRadius:'6px'}}>+ Nova</button>
    </div>
    {aba==='catalogo' ? (
     <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
      {meninas.map((m:any,i:number)=>(
       <div key={i} style={{display:'flex',gap:'10px',background:'#222',padding:'10px',borderRadius:'8px',alignItems:'center'}}>
        <img src={m.foto} style={{width:'50px',height:'50px',objectFit:'cover',borderRadius:'6px'}} />
        <div style={{flex:1,color:'#fff'}}><div style={{fontWeight:'bold'}}>{m.nome}</div><div style={{fontSize:'12px',color:'#888'}}>{m.preco}</div></div>
        <button onClick={()=>{setForm(m);setIdx(i);setAba('form')}} style={{padding:'6px 10px',background:'#444',color:'#fff',border:'none',borderRadius:'5px'}}>Editar</button>
        <button onClick={()=>{if(confirm('Apagar?')){setMeninas(meninas.filter((_:any,j:number)=>j!==i))}}} style={{padding:'6px 10px',background:'#662222',color:'#fff',border:'none',borderRadius:'5px'}}>X</button>
       </div>
      ))}
     </div>
    ) : (
     <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
      <input placeholder='Nome' value={form.nome} onChange={e=>setForm({...form,nome:e.target.value})} style={{padding:'10px',borderRadius:'6px',border:'1px solid #444',background:'#222',color:'#fff'}} />
      <input placeholder='Link da Foto' value={form.foto} onChange={e=>setForm({...form,foto:e.target.value})} style={{padding:'10px',borderRadius:'6px',border:'1px solid #444',background:'#222',color:'#fff'}} />
      <input placeholder='Preço' value={form.preco} onChange={e=>setForm({...form,preco:e.target.value})} style={{padding:'10px',borderRadius:'6px',border:'1px solid #444',background:'#222',color:'#fff'}} />
      <input placeholder='WhatsApp' value={form.whats} onChange={e=>setForm({...form,whats:e.target.value})} style={{padding:'10px',borderRadius:'6px',border:'1px solid #444',background:'#222',color:'#fff'}} />
      <textarea placeholder='Descrição' value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} style={{padding:'10px',borderRadius:'6px',border:'1px solid #444',background:'#222',color:'#fff',minHeight:'80px'}} />
      <button onClick={salvar} style={{padding:'12px',background:'#fff',color:'#000',border:'none',borderRadius:'8px',fontWeight:'bold'}}>{idx!==null?'Salvar':'Adicionar'}</button>
      <button onClick={()=>{setAba('catalogo');setForm(vazio);setIdx(null)}} style={{padding:'10px',background:'#333',color:'#fff',border:'none',borderRadius:'8px'}}>Cancelar</button>
     </div>
    )}
   </div>
  </div>
 )
  }
