import React, { useState } from "react";
export const MenuSection: any = (props: any) => {
  const [showPay, setShowPay] = useState(false);
  const [paid, setPaid] = useState(()=>typeof window!=="undefined" && localStorage.getItem("menu_paid")!==null);
  const items = props.items || [];
  return (
    <section id="menu" style={{padding:"20px"}}>
      <h2 style={{color:"white", fontSize:"20px", fontWeight:"bold"}}>Garotas ({items.length})</h2>
      <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(150px, 1fr))", gap:"12px", marginTop:"12px"}}>
        {items.map((item:any,i:number)=>{
          const foto=item.images?.[0]||item.image||"";
          const disponivel=item.disponivel!==false;
          return(
            <div key={i} style={{background:"#222", borderRadius:"12px", overflow:"hidden", border:"1px solid #333"}}>
              <div style={{height:"200px", background:"#111", position:"relative"}}>
                {foto ? <img src={foto} style={{width:"100%", height:"100%", objectFit:"cover", filter: paid ? "none":"blur(12px)"}}/> : <div style={{color:"#555", textAlign:"center", paddingTop:"80px"}}>Sem foto</div>}
                {!paid && <div style={{position:"absolute", inset:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center"}}><span style={{background:"#7f1d1d", width:"40px", height:"40px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center"}}>🔒</span></div>}
                <div style={{position:"absolute", top:"5px", left:"5px", background: disponivel ? "green":"red", color:"white", fontSize:"10px", padding:"2px 6px", borderRadius:"10px"}}>{disponivel ? "● Disponível":"● Ocupada"}</div>
                {paid && <div style={{position:"absolute", bottom:"5px", left:"5px", background:"rgba(0,0,0,0.7)", color:"white", fontSize:"9px", padding:"2px 5px", borderRadius:"8px"}}>{item.idade||22}a • {item.altura||"1.65"}m</div>}
              </div>
              <div style={{padding:"8px"}}>
                <p style={{color:"white", fontWeight:"bold", fontSize:"13px"}}>{item.name}</p>
                <p style={{color:"#aaa", fontSize:"10px"}}>{item.servicos||""}</p>
                <p style={{color:"#4ade80", fontSize:"12px"}}>{item.price} MZN</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
