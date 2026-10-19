import React, { useState } from "react";
import { PaywallModal } from "./PaywallModal";

interface MenuItem { id?: string; name?: string; title?: string; price?: number; [key: string]: any; }
interface Props {
  items?: MenuItem[];
  cart?: any[];
  config?: any;
  subscription?: any;
  onAddToCart?: (item: any) => void;
  [key: string]: any;
}

export const MenuSection: React.FC<Props> = (props) => {
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
      <h2 style={{fontSize:"28px", fontWeight:"bold", marginBottom:"10px"}}>Nosso Menu</h2>
      
      {!isPaid && (
        <div style={{background:"#fef3c7", border:"2px dashed #f59e0b", padding:"16px", borderRadius:"12px", margin:"16px 0", textAlign:"center"}}>
          <p style={{fontWeight:"bold", fontSize:"18px"}}>🔒 Menu Bloqueado</p>
          <p>Desbloqueie com 1000MT via M-Pesa</p>
          <button onClick={()=>setShowPaywall(true)} style={{background:"#16a34a", color:"white", padding:"10px 20px", borderRadius:"8px", marginTop:"10px", border:"none", fontWeight:"bold"}}>Desbloquear Agora - 1000MT</button>
        </div>
      )}

      <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(160px, 1fr))", gap:"16px", marginTop:"20px"}}>
        {items.length === 0 ? <p>Nenhum item no menu.</p> : items.map((item: any, i: number) => (
          <div key={item.id || i} style={{border:"1px solid #e5e7eb", borderRadius:"16px", padding:"16px", background:"white", boxShadow:"0 1px 3px rgba(0,0,0,0.1)"}}>
            {item.image && <img src={item.image} alt={item.name} style={{width:"100%", height:"100px", objectFit:"cover", borderRadius:"8px", marginBottom:"8px"}} />}
            <h3 style={{fontWeight:"bold", fontSize:"16px"}}>{item.name || item.title || "Drink"}</h3>
            <p style={{color:"#16a34a", fontWeight:"bold", marginTop:"4px"}}>{item.price || 0} MT</p>
            <button onClick={()=>handleAdd(item)} style={{width:"100%", background:isPaid?"#16a34a":"#9ca3af", color:"white", padding:"8px", borderRadius:"8px", marginTop:"10px", border:"none", fontWeight:"bold", cursor:"pointer"}}>
              {isPaid ? "Adicionar" : "🔒 1000MT"}
            </button>
          </div>
        ))}
      </div>

      <PaywallModal isOpen={showPaywall} onClose={()=>setShowPaywall(false)} onUnlock={()=>setIsPaid(true)} />
    </section>
  );
};
