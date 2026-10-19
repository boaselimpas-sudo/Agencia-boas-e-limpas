import React, { useState, useEffect } from "react";

export const AdminModal = ({ isOpen, onClose, onSave, onDelete, editingItem }: any) => {
  const [form, setForm] = useState({
    name: "",
    price: 4000,
    description: "",
    disponivel: true,
    images: [] as string[],
    videos: [] as string[],
    category: "VIP"
  });

  useEffect(() => {
    if (editingItem) {
      setForm({
        name: editingItem.name || "",
        price: editingItem.price || 4000,
        description: editingItem.description || "",
        disponivel: editingItem.disponivel !== false,
        images: editingItem.images || (editingItem.image ? [editingItem.image] : []),
        videos: editingItem.videos || [],
        category: editingItem.category || "VIP"
      });
    } else {
      setForm({ name: "", price: 4000, description: "", disponivel: true, images: [], videos: [], category: "VIP" });
    }
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleFiles = (e: any, type: "images" | "videos") => {
    const files = Array.from(e.target.files) as File[];
    const max = type === "images" ? 5 : 5;
    const current = form[type].length;
    if (current + files.length > max) {
      alert(`Só pode ${max} ${type}! Você já tem ${current}`);
      return;
    }
    files.forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (ev: any) => {
        setForm(prev => ({ ...prev, [type]: [...prev[type], ev.target.result] }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeItem = (idx: number, type: "images" | "videos") => {
    setForm(prev => ({ ...prev, [type]: prev[type].filter((_, i) => i !== idx) }));
  };

  const handleSave = () => {
    if (!form.name || form.images.length === 0) {
      alert("Coloca nome e pelo menos 1 foto da galeria!");
      return;
    }
    onSave({
      ...editingItem,
      name: form.name,
      title: form.name,
      price: Number(form.price),
      description: form.description,
      disponivel: form.disponivel,
      images: form.images,
      videos: form.videos,
      image: form.images[0]
    });
    onClose();
  };

  return (
    <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:"10px", overflowY:"auto"}}>
      <div style={{background:"#1a1a1a", borderRadius:"16px", padding:"20px", width:"100%", maxWidth:"500px", maxHeight:"95vh", overflowY:"auto"}}>
        <h2 style={{color:"white", fontWeight:"bold", marginBottom:"15px"}}>{editingItem ? "Editar Garota" : "Nova Garota"}</h2>

        <input value={form.name} onChange={e=>setForm({...form, name: e.target.value})} placeholder="Nome: Vanessa" style={{width:"100%", padding:"12px", borderRadius:"8px", background:"#222", color:"white", border:"1px solid #444", marginBottom:"10px"}}/>

        <div style={{display:"flex", gap:"10px", marginBottom:"10px"}}>
          <input type="number" value={form.price} onChange={e=>setForm({...form, price: Number(e.target.value)})} placeholder="Preço" style={{flex:1, padding:"12px", borderRadius:"8px", background:"#222", color:"white", border:"1px solid #444"}}/>
          <select value={form.disponivel ? "sim" : "nao"} onChange={e=>setForm({...form, disponivel: e.target.value==="sim"})} style={{flex:1, padding:"12px", borderRadius:"8px", background:"#222", color:"white", border:"1px solid #444"}}>
            <option value="sim">✅ Disponível</option>
            <option value="nao">🔴 Ocupada</option>
          </select>
        </div>

        <label style={{color:"#f87171", fontSize:"13px", fontWeight:"bold", display:"block", marginBottom:"6px"}}>📸 FOTOS - Até 5 da galeria (1ª é capa com blur)</label>
        <input type="file" accept="image/*" multiple onChange={e=>handleFiles(e, "images")} style={{width:"100%", padding:"10px", background:"#222", color:"white", borderRadius:"8px", marginBottom:"10px"}}/>
        <div style={{display:"flex", gap:"6px", flexWrap:"wrap", marginBottom:"15px"}}>
          {form.images.map((img, idx) => (
            <div key={idx} style={{position:"relative", width:"70px", height:"70px"}}>
              <img src={img} style={{width:"100%", height:"100%", objectFit:"cover", borderRadius:"8px", border: idx===0 ? "2px solid #ef4444" : "1px solid #444"}}/>
              <button onClick={()=>removeItem(idx, "images")} style={{position:"absolute", top:"-5px", right:"-5px", background:"red", color:"white", borderRadius:"50%", width:"20px", height:"20px", border:"none", fontSize:"12px"}}>x</button>
              {idx===0 && <span style={{position:"absolute", bottom:"-6px", left:"0", fontSize:"8px", background:"#ef4444", color:"white", padding:"1px 3px", borderRadius:"4px"}}>CAPA</span>}
            </div>
          ))}
        </div>

        <label style={{color:"#60a5fa", fontSize:"13px", fontWeight:"bold", display:"block", marginBottom:"6px"}}>🎥 VÍDEOS - Até 5 da galeria</label>
        <input type="file" accept="video/*" multiple onChange={e=>handleFiles(e, "videos")} style={{width:"100%", padding:"10px", background:"#222", color:"white", borderRadius:"8px", marginBottom:"10px"}}/>
        <div style={{display:"flex", gap:"6px", flexWrap:"wrap", marginBottom:"15px"}}>
          {form.videos.map((vid, idx) => (
            <div key={idx} style={{position:"relative", width:"70px", height:"70px", background:"#333", borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center"}}>
              <video src={vid} style={{width:"100%", height:"100%", objectFit:"cover", borderRadius:"8px"}}/>
              <button onClick={()=>removeItem(idx, "videos")} style={{position:"absolute", top:"-5px", right:"-5px", background:"red", color:"white", borderRadius:"50%", width:"20px", height:"20px", border:"none"}}>x</button>
            </div>
          ))}
        </div>

        <textarea value={form.description} onChange={e=>setForm({...form, description: e.target.value})} placeholder="Descrição..." style={{width:"100%", padding:"10px", borderRadius:"8px", background:"#222", color:"white", border:"1px solid #444", minHeight:"60px", marginBottom:"15px"}}/>

        <div style={{display:"flex", gap:"10px"}}>
          <button onClick={onClose} style={{flex:1, padding:"12px", borderRadius:"20px", background:"#333", color:"white", border:"none"}}>Cancelar</button>
          {editingItem && <button onClick={()=>{ if(confirm("Eliminar?")){ onDelete(editingItem); onClose(); }}} style={{padding:"12px", borderRadius:"20px", background:"#7f1d1d", color:"white", border:"none"}}>🗑️</button>}
          <button onClick={handleSave} style={{flex:2, padding:"12px", borderRadius:"20px", background:"#dc2626", color:"white", border:"none", fontWeight:"bold"}}>💾 Salvar</button>
        </div>
      </div>
    </div>
  );
};
