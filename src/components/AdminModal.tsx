import React, { useState, useEffect } from "react";
export const AdminModal = ({ isOpen, onClose, onSave, onDelete, editingItem }: any) => {
  const [form, setForm] = useState({ name:"", price:4000, idade:22, altura:"1.65", servicos:"", description:"", disponivel:true, images:[] as string[], videos:[] as string[] });
  useEffect(()=>{
    if(editingItem){ setForm({ name:editingItem.name||"", price:editingItem.price||4000, idade:editingItem.idade||22, altura:editingItem.altura||"1.65", servicos:editingItem.servicos||"", description:editingItem.description||"", disponivel:editingItem.disponivel!==false, images:editingItem.images||[], videos:editingItem.videos||[] }); }
    else{ setForm({ name:"", price:4000, idade:22, altura:"1.65", servicos:"", description:"", disponivel:true, images:[], videos:[] }); }
  },[editingItem, isOpen]);
  if(!isOpen) return null;
  const compress = (file: File): Promise<string> => new Promise(res=>{
    const r=new FileReader(); r.onload=(e:any)=>{
      const img=new Image(); img.onload=()=>{
        const c=document.createElement("canvas"); let w=img.width, h=img.height; const max=600;
        if(w>h){ if(w>max){ h=h*max/w; w=max; } } else{ if(h>max){ w=w*max/h; h=max; } }
        c.width=w; c.height=h; c.getContext("2d")?.drawImage(img,0,0,w,h); res(c.toDataURL("image/jpeg",0.6));
      }; img.src=e.target.result;
    }; r.readAsDataURL(file);
  });
  const handleFiles = async (e:any, type:"images"|"videos")=>{
    const files=Array.from(e.target.files) as File[];
    if(form[type].length+files.length>5){ alert("Máx 5"); return; }
    for(let f of files){
      if(type==="images"){ const c=await compress(f); setForm(p=>({...p, images:[...p.images, c]})); }
      else{ const r=new FileReader(); r.onload=(ev:any)=>setForm(p=>({...p, videos:[...p.videos, ev.target.result]})); r.readAsDataURL(f); }
    }
  };
  return(
    <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.9)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:"10px", overflowY:"auto"}}>
      <div style={{background:"#1a1a1a", borderRadius:"16px", padding:"16px", width:"100%", maxWidth:"500px", maxHeight:"95vh", overflowY:"auto"}}>
        <h2 style={{color:"white", fontWeight:"bold", marginBottom:"10px"}}>Painel Completo</h2>
        <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="Nome" style={{width:"100%", padding:"10px", borderRadius:"8px", background:"#222", color:"white", border:"1px solid #444", marginBottom:"6px"}}/>
        <div style={{display:"flex", gap:"6px", marginBottom:"6px"}}>
          <input type="number" value={form.idade} onChange={e=>setForm({...form, idade:Number(e.target.value)})} placeholder="Idade" style={{flex:1, padding:"10px", borderRadius:"8px", background:"#222", color:"white", border:"1px solid #444"}}/>
          <input value={form.altura} onChange={e=>setForm({...form, altura:e.target.value})} placeholder="Altura" style={{flex:1, padding:"10px", borderRadius:"8px", background:"#222", color:"white", border:"1px solid #444"}}/>
          <input type="number" value={form.price} onChange={e=>setForm({...form, price:Number(e.target.value)})} placeholder="Preço" style={{flex:1, padding:"10px", borderRadius:"8px", background:"#222", color:"white", border:"1px solid #444"}}/>
        </div>
        <input value={form.servicos} onChange={e=>setForm({...form, servicos:e.target.value})} placeholder="Serviços: Oral, Anal, Beijo" style={{width:"100%", padding:"10px", borderRadius:"8px", background:"#222", color:"white", border:"1px solid #444", marginBottom:"6px"}}/>
        <select value={form.disponivel ? "sim":"nao"} onChange={e=>setForm({...form, disponivel:e.target.value==="sim"})} style={{width:"100%", padding:"10px", borderRadius:"8px", background:"#222", color:"white", border:"1px solid #444", marginBottom:"8px"}}>
          <option value="sim">✅ Disponível</option><option value="nao">🔴 Ocupada</option>
        </select>
        <label style={{color:"#f87171", fontSize:"11px", fontWeight:"bold"}}>📸 FOTOS (até 5) - 1ª é capa</label>
        <input type="file" accept="image/*" multiple onChange={e=>handleFiles(e,"images")} style={{width:"100%", padding:"6px", background:"#222", color:"white", borderRadius:"8px", marginBottom:"6px"}}/>
        <div style={{display:"flex", gap:"4px", flexWrap:"wrap", marginBottom:"8px"}}>
          {form.images.map((img,idx)=><div key={idx} style={{position:"relative", width:"55px", height:"55px"}}><img src={img} style={{width:"100%", height:"100%", objectFit:"cover", borderRadius:"6px", border: idx===0 ? "2px solid red":"1px solid #444"}}/><button onClick={()=>setForm(p=>({...p, images:p.images.filter((_,i)=>i!==idx)}))} style={{position:"absolute", top:"-4px", right:"-4px", background:"red", color:"white", borderRadius:"50%", width:"16px", height:"16px", border:"none", fontSize:"9px"}}>x</button></div>)}
        </div>
        <label style={{color:"#60a5fa", fontSize:"11px", fontWeight:"bold"}}>🎥 VÍDEOS (até 5)</label>
        <input type="file" accept="video/*" multiple onChange={e=>handleFiles(e,"videos")} style={{width:"100%", padding:"6px", background:"#222", color:"white", borderRadius:"8px", marginBottom:"6px"}}/>
        <textarea value={form.description} onChange={e=>setForm({...form, description:e.target.value})} placeholder="Descrição..." style={{width:"100%", padding:"8px", borderRadius:"8px", background:"#222", color:"white", border:"1px solid #444", minHeight:"40px", marginBottom:"10px"}}/>
        <div style={{display:"flex", gap:"6px"}}>
          <button onClick={onClose} style={{flex:1, padding:"11px", borderRadius:"20px", background:"#333", color:"white", border:"none"}}>Cancelar</button>
          {editingItem && <button onClick={()=>{ if(confirm("Eliminar?")){ onDelete(editingItem); onClose(); } }} style={{padding:"11px", borderRadius:"20px", background:"#7f1d1d", color:"white", border:"none"}}>🗑️</button>}
          <button onClick={()=>{ if(!form.name||form.images.length===0){ alert("Nome + 1 foto!"); return; } onSave({...editingItem, id:editingItem?.id||Date.now(), name:form.name, title:form.name, price:Number(form.price), idade:form.idade, altura:form.altura, servicos:form.servicos, description:form.description, disponivel:form.disponivel, images:form.images, videos:form.videos, image:form.images[0]}); onClose(); }} style={{flex:2, padding:"11px", borderRadius:"20px", background:"#dc2626", color:"white", border:"none", fontWeight:"bold"}}>💾 Salvar</button>
        </div>
      </div>
    </div>
  );
};
