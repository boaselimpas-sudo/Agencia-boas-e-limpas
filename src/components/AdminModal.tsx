 // @ts-nocheck
import { useState } from "react";

export default function AdminModal({ girls, onClose, onSave, onDelete, onAdd }: any) {
  const [senha, setSenha] = useState("");
  const [logado, setLogado] = useState(false);
  const SENHA_CORRETA = "2024";

  if (!logado) {
    return (
      <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.9)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center'}}>
        <div style={{background:'#111', padding:'30px', borderRadius:'15px', border:'2px solid #ff0066', width:'90%', maxWidth:'350px'}}>
          <h2 style={{color:'#fff', textAlign:'center', marginBottom:'20px'}}>🔒 Painel Admin</h2>
          <input type="password" placeholder="Digite a senha" value={senha} onChange={(e)=>setSenha(e.target.value)} style={{width:'100%', padding:'15px', borderRadius:'10px', border:'1px solid #333', background:'#222', color:'#fff', fontSize:'18px'}} />
          <button onClick={()=>{ if(senha===SENHA_CORRETA) setLogado(true); else alert("Senha errada!"); }} style={{width:'100%', marginTop:'15px', padding:'15px', background:'#ff0066', color:'#fff', border:'none', borderRadius:'10px', fontSize:'18px', fontWeight:'bold'}}>Entrar</button>
          <button onClick={onClose} style={{width:'100%', marginTop:'10px', padding:'10px', background:'transparent', color:'#aaa', border:'none'}}>Fechar</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{position:'fixed', inset:0, background:'#000', zIndex:9999, overflowY:'auto', padding:'20px'}}>
      <div style={{maxWidth:'600px', margin:'0 auto', background:'#111', borderRadius:'15px', padding:'20px', border:'1px solid #333'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
          <h2 style={{color:'#fff', margin:0}}>PAINEL ADMIN - {girls.length} MENINAS</h2>
          <button onClick={onClose} style={{background:'#222', color:'#fff', border:'1px solid #444', padding:'10px 20px', borderRadius:'10px'}}>X Fechar</button>
        </div>
        <div style={{display:'flex', gap:'10px', marginBottom:'15px'}}>
          <button style={{background:'#ff0066', color:'#fff', padding:'10px 20px', borderRadius:'10px', border:'none', fontWeight:'bold'}}>Catálogo ({girls.length})</button>
          <button style={{background:'#222', color:'#fff', padding:'10px 20px', borderRadius:'10px', border:'1px solid #444'}}>Config</button>
        </div>
        <button onClick={onAdd} style={{width:'100%', background:'#00c67a', color:'#fff', padding:'15px', borderRadius:'10px', border:'none', fontWeight:'bold', fontSize:'16px', marginBottom:'20px'}}>+ Adicionar Menina</button>
        {girls.map((g:any, i:number)=>(
          <div key={i} style={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'#1a1a1a', border:'1px solid #333', padding:'12px', borderRadius:'10px', marginBottom:'10px'}}>
            <span style={{color:'#fff', fontWeight:'bold'}}>{i+1}. {g.nome || g.name}</span>
            <div style={{display:'flex', gap:'8px'}}>
              <button onClick={()=>onSave(i)} style={{background:'#3b82f6', color:'#fff', border:'none', padding:'8px 15px', borderRadius:'8px'}}>Editar</button>
              <button onClick={()=>onDelete(i)} style={{background:'#ef4444', color:'#fff', border:'none', padding:'8px 15px', borderRadius:'8px'}}>Apagar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
            }
