export default function MenuSection({ items = [] }: any) {
  const lista = items || [];

  return (
    <section id="menu" className="py-12 px-4 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-2">Catálogo VIP</h2>
        <p className="text-zinc-400 mb-6">Prestadoras em Matola & Maputo</p>

        <div className="flex gap-2 overflow-x-auto mb-6">
          <button className="bg-red-600 text-white px-5 py-2 rounded-full text-sm font-bold">Todos</button>
          <button className="bg-zinc-800 text-zinc-300 border border-zinc-700 px-5 py-2 rounded-full text-sm">Residencial</button>
          <button className="bg-zinc-800 text-zinc-300 border border-zinc-700 px-5 py-2 rounded-full text-sm">VIP</button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {lista.map((item: any, i: number) => {
            const foto = item.images?.[0] || item.foto || item.image;
            return (
              <div key={i} className="bg-zinc-800 border border-zinc-700 rounded-[24px] overflow-hidden">
                <div className="relative h-[180px] bg-zinc-900">
                  {foto && <img src={foto} className="w-full h-full object-cover" />}
                  <span className="absolute top-3 right-3 bg-red-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">VIP</span>
                </div>
                <div className="p-4">
                  <p className="text-white font-bold text-[14px] truncate">{item.nome || item.name || 'Prestadora'}</p>
                  <p className="text-zinc-400 text-xs mt-1">📍 {item.local || 'Matola'}</p>
                  <p className="text-red-500 font-bold text-sm mt-2">Desde {item.preco || item.price || '1.200'} MT</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export const MenuSection2 = () => null;
// redeploy
