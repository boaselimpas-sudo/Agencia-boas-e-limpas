'use client';
import { useState } from 'react';

export function AdminModal(props:any){
 const meninas = props.meninas || [];
 const setMeninas = props.setMeninas || (()=>{});
 const fechar = ()=>{
  if(props.onClose) props.onClose();
  else if(props.setShowAdmin) props.setShowAdmin(false);
  else if(props.setAdminOpen) props.setAdminOpen(false);
  else if(props.setOpen) props.setOpen(false);
  else window.location.reload();
 };

 const [senha,setSenha]=useState('');
 const [logado,setLogado]=useState(false);
 const [erro,setErro]=useState('');
 const [aba,setAba]=useState('lista');
 const [editIdx,setEditIdx]=useState<number|null>(null);
 const vazio={nome:'',foto:'',desc:'',preco:'',whats:'',local:''};
 const [form,setForm]=useState(vazio);

 const salvar=()=>{
  if(!form.nome) return alert('Coloca o nome');
  let novas=[...meninas];
  if(editIdx!==null){ novas[editIdx]=form; }
  else{ novas.push(form); }
  setMeninas(novas);
  setForm(vazio); setEditIdx(null); setAba('lista');
 };

 if(!logado){
  return (
   <div style={{position:'fixed',inset:0,zIndex:99999,background:'rgba(0,0,0,0.85)',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}>
    <div style={{background:'#1e1e1e',border:'1px solid #333',padding:'24px',borderRadius:'12px',width:'100%',maxWidth:'360px'}}>
     <h2 style={{color:'#fff',margin:'0 0 15px 0',fontSize:'18px'}}>Acesso Admin</h2>
     <input type='password' placeholder='Digite a senha' value={senha} onChange={e=>setSenha(e.target.value)} style={{width:'100%',padding:'12px',borderRadius:'8px',border:'1px solid #444',background:'#222',color:'#fff',boxSizing:'border-box'}} />
     {erro && <div style={{color:'#ff5555',marginTop:'10px',fontSize:'13px'}}>{erro}</div>}
     <button onClick={()=>{if(senha==='2024'){setLogado(true);setErro('')}else{setErro('Senha incorreta')}}} style={{width:'100%',marginTop:'12px',padding:'12px',background:'#fff',color:'#000',border:'none',borderRadius:'8px',fontWeight:'bold',cursor:'pointer'}}>Entrar</button>
     <button onClick={fechar} style={{width:'100%',marginTop:'8px',padding:'10px',background:'transparent',color:'#888',border:'none',cursor:'pointer'}}>Fechar</button>
    </div>
   </div>
  )
 }

 return (
  <div style={{position:'fixed',inset:0,zIndex:99999,background:'#0f0f0f',display:'flex',flexDirection:'column',padding:'15px',overflow:'auto'}}>
   <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'15px'}}>
    <h2 style={{color:'#fff',margin:0}}>Painel Admin ({meninas.length})</h2>
    <button onClick={fechar} style={{background:'#333',color:'#fff',border:'none',padding:'8px 14px',borderRadius:'6px'}}>X Fechar</button>
   </div>
   <div style={{display:'flex',gap:'8px',marginBottom:'15px'}}>
    <button onClick={()=>setAba('lista')} style={{flex:1,padding:'10px',background:aba==='lista'?'#fff':'#333',color:aba==='lista'?'#000':'#fff',border:'none',borderRadius:'6px',fontWeight:'bold'}}>Lista</button>
    <button onClick={()=>{setForm(vazio);setEditIdx(null);setAba('form')}} style={{flex:1,padding:'10px',background:aba==='form'?'#fff':'#333',color:aba==='form'?'#000':'#fff',border:'none',borderRadius:'6px',fontWeight:'bold'}}>+ Nova</button>
   </div>

   {aba==='lista' ? (
    <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
     {meninas.length===0 && <p style={{color:'#888'}}>Nenhuma menina cadastrada</p>}
     {meninas.map((m:any,i:number)=>(
      <div key={i} style={{display:'flex',gap:'10px',background:'#1e1e1e',padding:'10px',borderRadius:'8px',alignItems:'center',border:'1px solid #222'}}>
       <img src={m.foto||''} alt='' style={{width:'55px',height:'55px',objectFit:'cover',borderRadius:'6px',background:'#333'}} />
       <div style={{flex:1,color:'#fff'}}><div style={{fontWeight:'bold',fontSize:'14px'}}>{m.nome||'Sem nome'}</div><div style={{fontSize:'12px',color:'#aaa'}}>{m.preco||''}</div></div>
       <button onClick={()=>{setForm(m);setEditIdx(i);setAba('form')}} style={{padding:'7px 12px',background:'#444',color:'#fff',border:'none',borderRadius:'6px'}}>Editar</button>
       <button onClick={()=>{if(confirm('Apagar '+m.nome+'?')){let n=[...meninas]; n.splice(i,1); setMeninas(n)}}} style={{padding:'7px 10px',background:'#7a1a1a',color:'#fff',border:'none',borderRadius:'6px'}}>X</button>
      </div>
     ))}
    </div>
   ) : (
    <div style={{display:'flex',flexDirection:'column',gap:'10px',background:'#1e1e1e',padding:'15px',borderRadius:'10px'}}>
     <input placeholder='Nome' value={form.nome} onChange={e=>setForm({...form,nome:e.target.value})} style={{padding:'11px',borderRadius:'6px',border:'1px solid #444',background:'#222',color:'#fff'}} />
     <input placeholder='Link da Foto (https://...)' value={form.foto} onChange={e=>setForm({...form,foto:e.target.value})} style={{padding:'11px',borderRadius:'6px',border:'1px solid #444',background:'#222',color:'#fff'}} />
     <input placeholder='Preço ex: 2000 MT / hora' value={form.preco} onChange={e=>setForm({...form,preco:e.target.value})} style={{padding:'11px',borderRadius:'6px',border:'1px solid #444',background:'#222',color:'#fff'}} />
     <input placeholder='WhatsApp ex: 25884...' value={form.whats} onChange={e=>setForm({...form,whats:e.target.value})} style={{padding:'11px',borderRadius:'6px',border:'1px solid #444',background:'#222',color:'#fff'}} />
     <textarea placeholder='Descrição' value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} style={{padding:'11px',borderRadius:'6px',border:'1px solid #444',background:'#222',color:'#fff',minHeight:'80px'}} />
     <button onClick={salvar} style={{padding:'13px',background:'#fff',color:'#000',border:'none',borderRadius:'8px',fontWeight:'bold',marginTop:'5px'}}>{editIdx!==null?'Salvar Alterações':'Adicionar Menina'}</button>
     <button onClick={()=>{setAba('lista');setForm(vazio);setEditIdx(null)}} style={{padding:'11px',background:'#333',color:'#fff',border:'none',borderRadius:'8px'}}>Cancelar</button>
    </div>
   )}
  </div>
 )
}
