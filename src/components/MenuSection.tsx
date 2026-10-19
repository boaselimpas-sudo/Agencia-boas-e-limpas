import React, { useState } from "react";
import { PaywallModal } from "./PaywallModal";

export const MenuSection: React.FC<any> = (props) => {
  const [showPaywall, setShowPaywall] = useState(false);
  const [isPaid, setIsPaid] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("menu_paid") !== null;
    return false;
  });
  const items = props.items || [];
  const handleAdd = (item: any) => {
    if (!isPaid) { setShowPaywall(true); return; }
    if (props.onAddToCart) props.onAddToCart(item);
  };

  return (
    <section id="menu" style={{padding:"20px", maxWidth:"1000px", margin:"0 auto"}}>
      <h2 style={{fontSize:"28px", fontWeight:"bold", color:"white"}}>Garotas de Programa</h2>
      <p style={{color:"#9ca3af", marginBottom:"16px"}}>{items.length} perfis • 1ª foto como amostra grátis</p>
      <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(160px, 1fr))", gap:"16px"}}>
        {items.map((item: any, i: number) => {
          const foto = item.images?.[0] || item.image || item.photo || item.cover || "";
          const disponivel = item.disponivel !== false;
          const totalFotos = item.images?.length || (foto ? 1 : 0);
          const totalVideos = item.videos?.length || 0;
          return (
            <div key={item.id || i} style={{borderRadius:"16px", overflow:"hidden", background:"#1f1f1f", border:"1px solid #333", position:"relative"}}>
              <div style={{position:"relative", height:"220px", background:"#111"}}>
                {foto ? <img src={foto} alt={item.name} style={{width:"100%", height:"100%", objectFit:"cover", filter: isPaid ? "none" : "blur(10px)", opacity: isPaid ? 1 : 0.8}}/> : <div style={{width:"100%", height:"100%", background:"#333"}}/>}
                {!isPaid && (
                  <div style={{position:"absolute", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
                    <div style={{background:"rgba(127,29,29,0.9)", width:"50px", height:"50px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid #ef4444"}}>🔒</div>
                    <p style={{color:"white", fontSize:"10px", fontWeight:"bold", marginTop:"8px", background:"rgba(0,0,0,0.7)", padding:"2px 8px", borderRadius:"10px"}}>VIP • 1000MT</p>
                  </div>
                )}
                <div style={{position:"absolute", top:"8px", left:"8px", background: disponivel ? "#16a34a" : "#dc2626", color:"white", fontSize:"9px", padding:"3px 7px", borderRadius:"10px", fontWeight:"bold"}}>
                  {disponivel ? "● Disponível" : "● Ocupada"}
                </div>
                {isPaid && <div style={{position:"absolute", bottom:"8px", left:"8px", background:"rgba(0,0,0,0.7)", color:"white", fontSize:"9px", padding:"2px 6px", borderRadius:"10px"}}>📸 {totalFotos} fotos • 🎥 {totalVideos} vídeos</div>}
              </div>
              <div style={{padding:"12px"}}>
                <h3 style={{fontWeight:"bold", color:"white", fontSize:"14px"}}>{item.name || item.title}</h3>
                <p style={{color:"#16a34a", fontWeight:"bold", fontSize:"13px", marginTop:"4px"}}>{item.price || 4000} MZN</p>
                <button onClick={()=>handleAdd(item)} style={{width:"100%", background: isPaid ? "#16a34a" : "#dc2626", color:"white", padding:"8px", borderRadius:"20px", marginTop:"8px", border:"none", fontWeight:"bold", fontSize:"12px"}}>
                  {isPaid ? "Ver Perfil Completo" : "🔒 Desbloquear Fotos"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <PaywallModal isOpen={showPaywall} onClose={()=>setShowPaywall(false)} onUnlock={()=>setIsPaid(true)} />
    </section>
  );
};
