import React from "react";

export const MenuSection: any = (props: any) => {
  const items = props.items || [];
  return (
    <section id="menu" style={{padding:"20px"}}>
      <h2 style={{color:"white", fontSize:"24px", fontWeight:"bold"}}>Garotas ({items.length})</h2>
      <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(150px, 1fr))", gap:"15px", marginTop:"15px"}}>
        {items.map((item: any, i: number) => {
          const foto = item.images?.[0] || item.image || "";
          const disponivel = item.disponivel !== false;
          return (
            <div key={i} style={{background:"#222", borderRadius:"12px", overflow:"hidden", border:"1px solid #333"}}>
              <div style={{height:"200px", background:"#111", position:"relative"}}>
                {foto ? <img src={foto} alt={item.name} style={{width:"100%", height:"100%", objectFit:"cover"}}/> : <div style={{color:"#555", textAlign:"center", paddingTop:"80px"}}>Sem foto</div>}
                <div style={{position:"absolute", top:"5px", left:"5px", background: disponivel ? "green" : "red", color:"white", fontSize:"10px", padding:"3px 6px", borderRadius:"10px"}}>{disponivel ? "Disponível" : "Ocupada"}</div>
              </div>
              <div style={{padding:"10px"}}>
                <p style={{color:"white", fontWeight:"bold"}}>{item.name}</p>
                <p style={{color:"#4ade80"}}>{item.price} MZN</p>
                <p style={{color:"#888", fontSize:"10px"}}>📸 {item.images?.length || 1} fotos | 🎥 {item.videos?.length || 0} vídeos</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
