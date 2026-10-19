import React, { useState, useEffect } from "react";

export const AdminModal = ({ isOpen, onClose, onSave, onDelete, editingItem }: any) => {
  const [form, setForm] = useState({
    name: "",
    price: 4000,
    description: "",
    disponivel: true,
    images: ["", "", "", "", ""],
    videos: ["", "", "", "", ""],
    category: "VIP"
  });

  useEffect(() => {
    if (editingItem) {
      setForm({
        name: editingItem.name || editingItem.title || "",
        price: editingItem.price || 4000,
        description: editingItem.description || "",
        disponivel: editingItem.disponivel !== false,
        images: [...(editingItem.images || [editingItem.image || ""]), "", "", "", ""].slice(0,5),
        videos: [...(editingItem.videos || []), "", "", "", ""].slice(0,5),
        category: editingItem.category || "VIP"
      });
    } else {
      setForm({ name: "", price: 4000, description: "", disponivel: true, images: ["", "", "", "", ""], videos: ["", "", "", "", ""], category: "VIP" });
    }
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const cleanImages = form.images.filter((i: string) => i.trim() !== "");
    const cleanVideos = form.videos.filter((v: string) => v.trim() !== "");
    if (!form.name || cleanImages.length === 0) {
      alert("Coloca nome e pelo menos 1 foto!");
      return;
    }
    onSave({
      ...editingItem,
      name: form.name,
      title: form.name,
      price: Number(form.price),
      description: form.description,
      disponivel: form.disponivel,
      images: cleanImages,
      videos: cleanVideos,
      image: cleanImages[0], // primeira foto = capa que aparece no catálogo com blur
      photo: cleanImages[0],
      cover: cleanImages[0]
    });
    onClose();
  };

  return (
    <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:"10px", overflowY:"auto"}}>
      <div style={{background:"#1a1a1a", border:"1px solid #333", borderRadius:"16px", padding:"20px", width:"100%", maxWidth:"500px", maxHeight:"90vh", overflowY:"auto"}}>
        <h2 style={{color:"white", fontSize:"20px", fontWeight:"bold", marginBottom:"16px"}}>{editingItem ? "Editar Garota" : "Nova Garota"} - Painel Admin</h2>

        <label style={{color:"#ccc", fontSize:"12px"}}>Nome da Garota</label>
        <input value={form.name} onChange={e=>setForm({...form, name: e.target.value})} placeholder="Ex: Vanessa" style={{width:"100%", padding:"10px", borderRadius:"8px", background:"#222", color:"white", border:"1px solid #444", marginBottom:"12px"}}/>

        <div style={{display:"flex", gap:"10px", marginBottom:"12px"}}>
          <div style={{flex:1}}>
            <label style={{color:"#ccc", fontSize:"12px"}}>Preço (MZN) - pode mudar quando quiser</label>
            <input type="number" value={form.price} onChange={e=>setForm({...form, price: Number(e.target.value)})} style={{width:"100%", padding:"10px", borderRadius:"8px", background:"#222", color:"white", border:"1px solid #444"}}/>
          </div>
          <div style={{flex:1}}>
            <label style={{color:"#ccc", fontSize:"12px"}}>Disponível?</label>
            <select value={form.disponivel ? "sim" : "nao"} onChange={e=>setForm({...form, disponivel: e.target.value==="sim"})} style={{width:"100%", padding:"10px", borderRadius:"8px", background:"#222", color:"white", border:"1px solid #444"}}>
              <option value="sim">✅ Sim - Disponível</option>
              <option value="nao">🔴 Não - Ocupada</option>
            </select>
          </div>
        </div>

        <label style={{color:"#f87171", fontSize:"13px", fontWeight:"bold"}}>📸 5 Fotos (a 1ª aparece borrada no catálogo como propaganda)</label>
        {form.images.map((img: string, idx: number) => (
          <input key={idx} value={img} onChange={e=>{
            const newImages = [...form.images];
            newImages[idx] = e.target.value;
            setForm({...form, images: newImages});
          }} placeholder={`Link Foto ${idx+1} - https://...`} style={{width:"100%", padding:"8px", borderRadius:"8px", background:"#222", color:"white", border:"1px solid #444", marginBottom:"6px", fontSize:"12px"}}/>
        ))}

        <label style={{color:"#60a5fa", fontSize:"13px", fontWeight:"bold", marginTop:"10px", display:"block"}}>🎥 5 Vídeos (opcional)</label>
        {form.videos.map((vid: string, idx: number) => (
          <input key={idx} value={vid} onChange={e=>{
            const newVideos = [...form.videos];
            newVideos[idx] = e.target.value;
            setForm({...form, videos: newVideos});
          }} placeholder={`Link Vídeo ${idx+1} - https://...`} style={{width:"100%", padding:"8px", borderRadius:"8px", background:"#222", color:"white", border:"1px solid #444", marginBottom:"6px", fontSize:"12px"}}/>
        ))}

        <label style={{color:"#ccc", fontSize:"12px", marginTop:"10px", display:"block"}}>Descrição</label>
        <textarea value={form.description} onChange={e=>setForm({...form, description: e.target.value})} placeholder="Top Model, 22 anos..." style={{width:"100%", padding:"10px", borderRadius:"8px", background:"#222", color:"white", border:"1px solid #444", minHeight:"60px", marginBottom:"16px"}}/>

        <div style={{display:"flex", gap:"10px"}}>
          <button onClick={onClose} style={{flex:1, padding:"12px", borderRadius:"20px", background:"#333", color:"white", border:"none"}}>Cancelar</button>
          {editingItem && onDelete && (
            <button onClick={()=>{ if(confirm("Tem certeza que quer ELIMINAR essa garota?")){ onDelete(editingItem); onClose(); }}} style={{flex:1, padding:"12px", borderRadius:"20px", background:"#7f1d1d", color:"white", border:"none", fontWeight:"bold"}}>🗑️ Eliminar</button>
          )}
          <button onClick={handleSave} style={{flex:2, padding:"12px", borderRadius:"20px", background:"#dc2626", color:"white", border:"none", fontWeight:"bold"}}>💾 Salvar Garota</button>
        </div>
        <p style={{color:"#666", fontSize:"10px", marginTop:"10px", textAlign:"center"}}>Foto 1 = capa que aparece com blur no catálogo pra cliente pagar 1000MT</p>
      </div>
    </div>
  );
};
