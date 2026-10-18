import {useState} from 'react';
export default function AdminModal(p:any){
 const m=p.meninas||[]; 
 const setM=p.setMeninas||(()=>{});
 const fechar=()=>{window.location.href='/';};
 const [s,setS]=useState(''); 
 const [ok,setOk]=useState(false);
 const [f,setF]=useState({nome:'',foto:'',preco:''});
 if(!ok) return (
 <div style={{position:'fixed',inset:0,zIndex:99999,background:'#000',display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
 <div style={{background:'#1e1e1e',padding:20,borderRadius:10,width:'100%',maxWidth:340}}>
 <h2 style={{color:'#fff'}}>Admin</h2>
 <input type="password" value={s} onChange={e=>setS((e.target as any).value)} placeholder="Senha" style={{width:'100%',padding:12,borderRadius:8,background:'#222',color:'#fff'}}/>
 <button onClick={()=>{if(s==='2024')setOk(true)}} style={{width:'100%',marginTop:10,padding:12,background:'#fff',fontWeight:'bold',borderRadius:8}}>Entrar</button>
 <button onClick={fechar} style={{width:'100%',marginTop:8,background:'transparent',color:'#888',border:'none'}}>Fechar</button>
 </div></div>);
 return (
 <div style={{position:'fixed',inset:0,zIndex:99999,background:'#0f0f0f',padding:15,overflow:'auto'}}>
 <div style={{display:'flex',justifyContent:'space-between'}}><h2 style={{color:'#fff'}}>Admin ({m.length})</h2><button onClick={fechar} style={{background:'#333',color:'#fff',border:'none',padding:'8px 14px',borderRadius:6}}>X Fechar</button></div>
 <div style={{marginTop:15,background:'#1e1e1e',padding:15,borderRadius:10,display:'flex',flexDirection:'column',gap:10}}>
 <input placeholder="Nome" value={f.nome} onChange={e=>setF({...f,nome:(e.target as any).value})} style={{padding:10,background:'#222',color:'#fff',borderRadius:6}}/>
 <input placeholder="Foto https://" value={f.foto} onChange={e=>setF({...f,foto:(e.target as any).value})} style={{padding:10,background:'#222',color:'#fff',borderRadius:6}}/>
 <input placeholder="Preco" value={f.preco} onChange={e=>setF({...f,preco:(e.target as any).value})} style={{padding:10,background:'#222',color:'#fff',borderRadius:6}}/>
 <button onClick={()=>{if(!f.nome)return;setM([...m,f]);setF({nome:'',foto:'',preco:''})}} style={{padding:12,background:'#fff',fontWeight:'bold',borderRadius:8}}>Adicionar</button>
 </div>
 <div style={{marginTop:15,display:'flex',flexDirection:'column',gap:10}}>
 {m.map((x:any,i:number)=><div key={i} style={{background:'#1e1e1e',padding:10,borderRadius:8,color:'#fff',display:'flex',justifyContent:'space-between'}}><span>{x.nome}</span><button onClick={()=>{let n=[...m];n.splice(i,1);setM(n)}} style={{background:'#7a1a1a',color:'#fff',border:'none',borderRadius:6,padding:'5px 10px'}}>X</button></div>)}
 </div></div>)
              }
