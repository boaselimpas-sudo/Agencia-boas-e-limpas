import React, { useState } from "react";

export const MenuSection: any = (props: any) => {
  const [showPay, setShowPay] = useState(false);
  const [paid, setPaid] = useState(()=> (typeof window !== 'undefined' ? localStorage.getItem('paid')==='true' : false));
  const items = props.items || [];

  return (
    <section id="menu" className="py-12 px-4 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Catálogo VIP</h2>
        <p className="text-zinc-400 mb-6">Prestadoras disponíveis em Matola & Maputo</p>

        {/* Filtros */}
        <div className="flex gap-2 overflow-x-auto mb-6 pb-2">
          <button className="bg-red-600 text-white px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap">Todos</button>
          <button className="bg-zinc-800 text-zinc-300 border border-zinc-700 px-5 py-2 rounded-full text-sm whitespace-nowrap">Limpeza Residencial</button>
          <button className="bg-zinc-800 text-zinc-300 border border-zinc-700 px-5 py-2 rounded-full text-sm whitespace-nowrap">VIP</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((item:any, i:number)=>{
            const foto = item.images?.[0] || item.foto || item.image;
            const disponivel = item.disponivel !== false;
            return(
              <div key={i} className="group bg-zinc-800/80 backdrop-blur border border-zinc-700/50 rounded-[24px] overflow-hidden shadow-xl hover:shadow-2xl hover:border-red-600/30 transition-all duration-300">
                <div className="relative h-[180px] overflow-hidden bg-zinc-900">
                  {foto ? <img src={foto} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" /> : <div className="w-full h-full flex items-center justify-center text-zinc-600">Sem foto</div>}
                  
                  <span className="absolute top-3 right-3 bg-red-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg">VIP ☆</span>
                  
                  {!paid && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[6px] flex items-center justify-center">
                      <button onClick={()=>setShowPay(true)} className="bg-white text-black text-xs font-bold px-3 py-1.5 rounded-full">Desbloquear 🔒</button>
                    </div>
                  )}
                  
                  {paid && !disponivel && (
                    <div className="absolute bottom-2 left-2 bg-red-600 text-white text-[10px] px-2 py-1 rounded-full">Indisponível</div>
                  )}
                </div>

                <div className="p-4">
                  <p className="text-white font-bold text-[15px] leading-tight truncate">{item.nome || item.name || 'Prestadora'}</p>
                  <p className="text-red-300/80 text-xs mt-1 flex items-center gap-1">📍 {item.local || item.location || 'Matola'}</p>
                  
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-yellow-500 text-xs">★★★★★</span>
                    <span className="text-white text-xs font-bold">{item.rating || '4.8'}</span>
                    <span className="text-zinc-500 text-[10px]">({item.avaliacoes || '124'})</span>
                  </div>

                  <p className="text-red-500 font-bold text-sm mt-2.5">Desde {item.preco || item.price || '1.200'} MT</p>
                  <p className="text-zinc-500 text-[10px]">por serviço</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  );
};
