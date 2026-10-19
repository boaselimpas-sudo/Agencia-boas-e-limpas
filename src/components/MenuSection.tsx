import React, { useState } from "react";

export const MenuSection: any = (props: any) => {
  const [showPay, setShowPay] = useState(false);
  const [paid, setPaid] = useState(() => typeof window !== "undefined" && localStorage.getItem("menu_paid") !== null);
  const items = props.items || [];
  return (
    <section id="menu" style={{padding:"20px"}}>
      <h2 style={{color:"white", fontSize:"22px", fontWeight:"bold"}}>Garotas VIP ({items.length}) • 1ª foto grátis borrada</h2>
      <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(150px, 1fr))", gap:"14px", marginTop:"15px"}}>
        {items.map((item: any, i: number) => {
          const foto = item.images?.[0] || item.image || "";
          const disponivel = item.disponivel !== false;
          return (
            <div key={i} style={{background:"#222", borderRadius:"12px", overflow:"hidden", border:"1px solid #333"}}>
              <div style={{height:"210px", background:"#111", position:"relative"}}>
                {foto ? <img src={foto} style={{width:"100%", height:"100%", objectFit:"cover", filter: paid ? "none" : "blur(12px)"}}/> : <div style={{color:"#555", paddingTop:"80px", textAlign:"center"}}>Sem foto</div>}
                {!paid && <div style={{position:"absolute", inset:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column"}}><div style={{background:"#7f1d1d", width:"45px", height:"45px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid red"}}>🔒</div><span style={{background:"black", color:"white", fontSize:"9px", padding:"2px 6px", borderRadius:"10px", marginTop:"5px"}}>VIP 1000MT</span></div>}
                <div style={{position:"absolute", top:"6px", left:"6px", background: disponivel ? "#16a34a" : "#dc2626", color:"white", fontSize:"10px", padding:"3px 7px", borderRadius:"10px", fontWeight:"bold"}}>{disponivel ? "● Disponível" : "● Ocupada"}</div>
                {paid && <div style={{position:"absolute", bottom:"6px", left:"6px", background:"rgba(0,0,0,0.7)", color:"white", fontSize:"9px", padding:"2px 6px", borderRadius:"8px"}}>📸{item.images?.length || 1} 🎥{item.videos?.length || 0}</div>}
              </div>
              <div style={{padding:"10px"}}>
                <p style={{color:"white", fontWeight:"bold", fontSize:"14px"}}>{item.name}</p>
                <p style={{color:"#4ade80", fontSize:"13px"}}>{item.price} MZN</p>
                <button onClick={()=>{ if(!paid) setShowPay(true); else if(props.onAddToCart) props.onAddToCart(item); }} style={{width:"100%", marginTop:"6px", padding:"8px", borderRadius:"20px", border:"none", background: paid ? "#16a34a" : "#dc2626", color:"white", fontWeight:"bold", fontSize:"12px"}}>{paid ? "Ver Perfil" : "🔒 Desbloquear"}</button>
              </div>
            </div>
          );
        })}
      </div>
      {showPay && (
        <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px"}}>
          <div style={{background:"#1a1a1a", padding:"20px", borderRadius:"16px", maxWidth:"320px", width:"100%", textAlign:"center", border:"1px solid #333"}}>
            <h3 style={{color:"white", fontWeight:"bold"}}>Desbloquear Fotos?</h3>
            <p style={{color:"#aaa", fontSize:"13px", margin:"10px 0"}}>Pague 1000MT para ver todas fotos e vídeos sem blur!</p>
            <div style={{display:"flex", gap:"10px", marginTop:"15px"}}>
              <button onClick={()=>setShowPay(false)} style={{flex:1, padding:"10px", borderRadius:"20px", background:"#333", color:"white", border:"none"}}>Cancelar</button>
              <button onClick={()=>{ localStorage.setItem("menu_paid","yes"); setPaid(true); setShowPay(false); }} style={{flex:1, padding:"10px", borderRadius:"20px", background:"#dc2626", color:"white", border:"none", fontWeight:"bold"}}>Pagar 1000MT</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
