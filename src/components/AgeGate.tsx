import React from 'react';

// --- BLOQUEIO +18 ANOS - INICIO ---
export function AgeGate() {
  const [ok, setOk] = React.useState(false);

  React.useEffect(() => {
    const saved = localStorage.getItem("age_ok");
    if (saved === "yes") setOk(true);
  }, []);

  if (ok) return null;

  return (
    <div style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(0,0,0,0.95)",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px",backdropFilter:"blur(8px)"}}>
      <div style={{maxWidth:"400px",width:"100%",background:"#18181b",border:"1px solid #27272a",borderRadius:"16px",padding:"24px",textAlign:"center",boxShadow:"0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)"}}>
        <div style={{width:"48px",height:"48px",margin:"0 auto 16px",background:"rgba(239, 68, 68, 0.15)",border:"1px solid rgba(239, 68, 68, 0.3)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"#ef4444",fontWeight:"800",fontSize:"18px"}}>
          18+
        </div>
        <h2 style={{color:"white",fontSize:"20px",fontWeight:"bold",marginBottom:"12px"}}>Conteúdo Exclusivo para Maiores de 18 Anos</h2>
        <p style={{color:"#a1a1aa",fontSize:"14px",marginBottom:"20px",lineHeight:"1.5"}}>Este site contém conteúdo para adultos em Maputo. Você confirma ter 18+ anos?</p>
        <button 
          onClick={()=>{
            localStorage.setItem("age_ok","yes"); 
            setOk(true);
            try {
              location.reload();
            } catch {
              // ignore
            }
          }} 
          style={{width:"100%",background:"white",color:"black",padding:"12px",borderRadius:"8px",fontWeight:"bold",marginBottom:"8px",cursor:"pointer",border:"none",fontSize:"14px"}}
        >
          Sim, tenho 18+ anos - Entrar
        </button>
        <button 
          onClick={()=>{
            try {
              window.location.href="https://google.com";
            } catch {
              // ignore
            }
          }} 
          style={{width:"100%",background:"transparent",color:"#a1a1aa",padding:"12px",cursor:"pointer",border:"none",fontSize:"14px"}}
        >
          Não, sair
        </button>
      </div>
    </div>
  );
}
// --- BLOQUEIO +18 ANOS - FIM ---
