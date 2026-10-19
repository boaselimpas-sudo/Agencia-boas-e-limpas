import React, { useState, useEffect } from "react";

export const AdminModal = ({ isOpen, onClose, onSave, onDelete, editingItem }: any) => {
  const [form, setForm] = useState({
    name: "", price: 4000, idade: 22, altura: "1.65", servicos: "", description: "",
    disponivel: true, images: [] as string[], videos: [] as string[]
  });

  useEffect(() => {
    if (editingItem) {
      setForm({
        name: editingItem.name || "", price: editingItem.price || 4000,
        idade: editingItem.idade || 22, altura: editingItem.altura || "1.65",
        servicos: editingItem.servicos || "", description: editingItem.description || "",
        disponivel: editingItem.disponivel !== false,
        images: editingItem.images || [], videos: editingItem.videos || []
      });
    } else {
      setForm({ name: "", price: 4000, idade: 22, altura: "1.65", servicos: "", description: "", disponivel: true, images: [], videos: [] });
    }
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const max = 600;
          let w = img.width, h = img.height;
          if (w > h) { if (w > max) { h = h * max / w; w = max; } } else { if (h > max) { w = w * max / h; h = max; } }
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL("image/jpeg", 0.6));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = async (e: any, type: "images" | "videos") => {
    const files = Array.from(e.target.files) as File[];
    if (form[type].length + files.length > 5) { alert(`Máx 5 ${type}`); return; }
    for (let file of files) {
      if (type === "images") {
        const compressed = await compressImage(file);
        setForm(p => ({ ...p, images: [...p.images, compressed] }));
      } else {
        const reader = new FileReader();
        reader.onload = (ev: any) => setForm(p => ({ ...p, videos: [...p.videos, ev.target.result] }));
        reader.readAsDataURL(file);
      }
    }
  };

  const removeItem = (idx: number, type: "images" | "videos") => {
    setForm(p => ({ ...p, [type]: p[type].filter((_, i) => i !== idx) }));
  };

  const handleSave = () => {
    if (!form.name) { alert("Nome!"); return; }
    if (form.images.length === 0) { alert("1 foto!"); return; }
    try {
      onSave({ ...editingItem, id: editingItem?.id || Date.now(), name: form.name, title: form.name, price: Number(form.price), idade: form.idade, altura: form.altura, servicos: form.servicos, description: form.description, disponivel: form.disponivel, images: form.images, videos: form.videos, image: form.images[0] });
      onClose();
    } catch (err) { alert("Fotos muito pesadas! Tenta só 2 fotos"); }
  };

  return (
    <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.9)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:"10px", overflowY:"auto"}}>
      <div style={{background:"#1a1a1a", borderRadius:"16px", padding:"16px", width:"100%", maxWidth:"500px", maxHeight:"95vh", overflowY:"auto"}}>
        <h2 style={{color:"white", fontWeight:"bold", marginBottom:"12px"}}>Nova Garota - Completo</h2>
        <input value={form.name} onChange={e=>setForm({...form, name: e.target.value})} placeholder="Nome: Liza" style={{width:"100%", padding:"10px", borderRadius:"8px", background:"#222", color:"white", border:"1px solid #444", marginBottom:"8px"}}/>
        <div style={{display:"flex", gap:"8px", marginBottom:"8px"}}>
          <input type="number" value={form.idade} onChange={e=>setForm({...form, idade: Number(e.target.value)})} placeholder="Idade" style={{flex:1, padding:"10px", borderRadius:"8px", background:"#222", color:"white", border:"1px solid #444"}}/>
          <input value={form.altura} onChange={e=>setForm({...form, altura: e.target.value})} placeholder="Altura 1.65" style={{flex:1, padding:"10px", borderRadius:"8px", background:"#222", color:"white", border:"1px solid #444"}}/>
          <input type="number" value={form.price} onChange={e=>setForm({...form, price: Number(e.target.value)})} placeholder="Preço" style={{flex:1, padding:"10px", borderRadius:"8px", background:"#222", color:"white", border:"1px solid #444"}}/>
        </div>
        <input value={form.servicos} onChange={e=>setForm({...form, servicos: e.target.value})} placeholder="Serviços: Anal, Oral, Beijo..." style={{width:"100%", padding:"10px", borderRadius:"8px", background:"#222", color:"white", border:"1px solid #444", marginBottom:"8px"}}/>
        <select value={form.disponivel ? "sim" : "nao"} onChange={e=>setForm({...form, disponivel: e.target.value==="sim"})} style={{width:"100%", padding:"10px", borderRadius:"8px", background:"#222", color:"white", border:"1px solid #444", marginBottom:"10px"}}>
          <option value="sim">✅ Disponível</option><option value="nao">🔴 Ocupada</option>
        </select>

        <label style={{color:"#f87171", fontSize:"12px", fontWeight:"bold"}}>📸 FOTOS Até 5 - Comprime auto</label>
        <input type="file" accept="image/*" multiple onChange={e=>handleFiles(e, "images")} style={{width:"100%", padding:"8px", background:"#222", color:"white", borderRadius:"8px", marginBottom:"8px"}}/>
        <div style={{display:"flex", gap:"5px", flexWrap:"wrap", marginBottom:"10px"}}>
          {form.images.map((img, idx) => (
            <div key={idx} style={{position:"relative", width:"60px", height:"60px"}}>
              <img src={img} style={{width:"100%", height:"100%", objectFit:"cover", borderRadius:"6px", border: idx===0 ? "2px solid red" : "1px solid #444"}}/>
              <button onClick={()=>removeItem(idx, "images")} style={{position:"absolute", top:"-5px", right:"-5px", background:"red", color:"white", borderRadius:"50%", width:"18px", height:"18px", border:"none", fontSize:"10px"}}>x</button>
            </div>
          ))}
        </div>

        <label style={{color:"#60a5fa", fontSize:"12px", fontWeight:"bold"}}>🎥 VÍDEOS Até 5</label>
        <input type="file" accept="video/*" multiple onChange={e=>handleFiles(e, "videos")} style={{width:"100%", padding:"8px", background:"#222", color:"white", borderRadius:"8px", marginBottom:"8px"}}/>
        
        <textarea value={form.description} onChange={e=>setForm({...form, description: e.target.value})} placeholder="Descrição: Moça extrovertida..." style={{width:"100%", padding:"8px", borderRadius:"8px", background:"#222", color:"white", border:"1px solid #444", minHeight:"50px", marginBottom:"12px"}}/>

        <div style={{display:"flex", gap:"8px"}}>
          <button onClick={onClose} style={{flex:1, padding:"12px", borderRadius:"20px", background:"#333", color:"white", border:"none"}}>Cancelar</button>
          <button onClick={handleSave} style={{flex:2, padding:"12px", borderRadius:"20px", background:"#dc2626", color:"white", border:"none", fontWeight:"bold"}}>💾 Salvar Agora</button>
        </div>
        <p style={{color:"#666", fontSize:"10px", marginTop:"8px", textAlign:"center"}}>Fotos são comprimidas para salvar leve</p>
      </div>
    </div>
  );
};
