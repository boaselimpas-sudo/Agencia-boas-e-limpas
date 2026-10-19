import React, { useState } from "react";
interface Props { isOpen: boolean; onClose: () => void; onUnlock: () => void; }
export const PaywallModal: React.FC<Props> = ({ isOpen, onClose, onUnlock }) => {
  const [paid, setPaid] = useState(false);
  if (!isOpen) return null;
  const handlePay = () => {
    localStorage.setItem("menu_paid","true");
    setPaid(true); onUnlock();
    setTimeout(()=>onClose(),1500);
  };
  return (
    <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:20}}>
      <div style={{background:"white",borderRadius:16,padding:24,maxWidth:400,width:"100%",textAlign:"center"}}>
        {!paid ? (
          <>
            <h2>🔒 Menu Bloqueado</h2>
            <p>Pague <b>1000MT</b> via M-Pesa para desbloquear!</p>
            <div style={{background:"#f3f4f6",padding:12,borderRadius:8,margin:"16px 0",textAlign:"left"}}>
              <p><b>M-Pesa:</b> 84 123 4567</p><p><b>Valor:</b> 1000MT</p>
            </div>
            <button onClick={handlePay} style={{width:"100%",background:"#16a34a",color:"white",padding:12,borderRadius:8,border:"none"}}>Já Paguei - Desbloquear</button>
            <button onClick={onClose} style={{width:"100%",marginTop:8,background:"transparent",border:"none"}}>Fechar</button>
          </>
        ) : (<><h2 style={{color:"green"}}>✅ Pago!</h2><p>Menu desbloqueado!</p></>)}
      </div>
    </div>
  );
};
