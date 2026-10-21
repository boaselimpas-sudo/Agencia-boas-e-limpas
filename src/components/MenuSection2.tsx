export default function MenuSection2() {
  return (
    <section className="py-12 px-4 bg-gray-50">
      <h2 className="text-2xl font-bold text-center mb-8">Nossos Serviços VIP</h2>
      <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
        <div className="bg-white p-4 rounded-xl shadow text-center">Residencial</div>
        <div className="bg-white p-4 rounded-xl shadow text-center">Pós-Obra</div>
        <div className="bg-white p-4 rounded-xl shadow text-center">Escritórios</div>
        <div className="bg-white p-4 rounded-xl shadow text-center">Vidros</div>
      </div>
    </section>
  )
}
