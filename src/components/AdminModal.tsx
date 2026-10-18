'use client';
import { useState } from 'react';
export function AdminModal({meninas,setMeninas}:any){
 const SENHA='2024';
 const [senha,setSenha]=useState('');
 const [logado,setLogado]=useState(false);
 const [erro,setErro]=useState('');
 const [aba,setAba]=useState('catalogo');
 const [idx,setIdx]=useState<number|null>(null);
 const [form,setForm]=useState({nome:'',foto:'',desc:'',preco:''});
 const vazio={nome:'',foto:'',desc:'',preco:''};
 if(!logado){
  return (
  <div style={{position:'fixed',inset:0,zIndex:9999,background:'rgba(0,0,0,0.8)',display:'flex',alignItems:'center',justifyContent:'center'}}>
   <div style={{background:'#1a1a1a',border:'1px solid #333',padding:'24px',borderRadius:'12px',width:'90%',maxWidth:'380px'}}>
    <h2 style={{color:'#fff',margin:'0 0 15px 0'}}>Acesso Admin</h2>
    <input type='password' placeholder='Digite a senha' value={senha} onChange={e=>setSenha(e.target.value)} style={{width:'100%',padding:'12px',borderRadius:'8px'}} />
    {erro && <div style={{color:'#ff4444',marginTop:'10px',fontSize:'14px'}}>{erro}</div>}
    <button onClick={()=>{if(senha===SENHA){setLogado(true);setErro('')}else{setErro('Senha incorreta')}}} style={{width:'100%',marginTop:'12px',padding:'12px',background:'#fff',color:'#000',border:'none',borderRadius:'8px',fontWeight:'bold'}}>Entrar</button>
   </div>
  </div>
  )
 }
 return null;
}
