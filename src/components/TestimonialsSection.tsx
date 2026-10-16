import React, { useState, useEffect } from 'react';
import { 
  Star, ShieldCheck, CheckCircle2, MessageSquare, ThumbsUp, Send, 
  MapPin, Plus, X, Heart, Sparkles, Filter, Home, Building2, UserCheck
} from 'lucide-react';
import { AgencyConfig, TestimonialItem } from '../types.ts';
import { INITIAL_TESTIMONIALS } from '../data/initialData.ts';

interface TestimonialsSectionProps {
  config: AgencyConfig;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ config }) => {
  // Load testimonials from localStorage or fallback to INITIAL_TESTIMONIALS
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(() => {
    try {
      const saved = localStorage.getItem('boas_limpas_testimonials');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return INITIAL_TESTIMONIALS;
    } catch {
      return INITIAL_TESTIMONIALS;
    }
  });

  const [activeFilter, setActiveFilter] = useState<string>('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // New review form state
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    rating: 5,
    serviceType: 'Ao Domicílio',
    comment: '',
  });

  // Save to localStorage when changed
  useEffect(() => {
    try {
      localStorage.setItem('boas_limpas_testimonials', JSON.stringify(testimonials));
    } catch (e) {
      console.error('Failed to save testimonials', e);
    }
  }, [testimonials]);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.comment.trim()) return;

    const initials = formData.name
      .trim()
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    const newTestimonial: TestimonialItem = {
      id: `custom-test-${Date.now()}`,
      name: formData.name.trim(),
      location: formData.location.trim() || 'Maputo',
      rating: formData.rating,
      date: 'Hoje (Recente)',
      serviceType: formData.serviceType,
      comment: formData.comment.trim(),
      verified: true,
      avatarInitials: initials || 'VIP',
    };

    setTestimonials([newTestimonial, ...testimonials]);
    setSubmittedSuccess(true);

    setTimeout(() => {
      setSubmittedSuccess(false);
      setIsModalOpen(false);
      setFormData({
        name: '',
        location: '',
        rating: 5,
        serviceType: 'Ao Domicílio',
        comment: '',
      });
    }, 1800);
  };

  // Filter logic
  const filteredTestimonials = testimonials.filter((t) => {
    if (activeFilter === 'todos') return true;
    if (activeFilter === 'domicilio') {
      return t.serviceType.toLowerCase().includes('domicílio') || t.serviceType.toLowerCase().includes('residência');
    }
    if (activeFilter === 'hotel') {
      return t.serviceType.toLowerCase().includes('hotel');
    }
    if (activeFilter === 'espaco') {
      return t.serviceType.toLowerCase().includes('espaço') || t.serviceType.toLowerCase().includes('casal');
    }
    return true;
  });

  return (
    <section id="depoimentos" className="py-14 sm:py-20 bg-zinc-950 border-t border-zinc-900 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div 
        aria-hidden="true" 
        className="absolute top-1/4 right-0 w-96 h-96 bg-red-600/5 blur-3xl pointer-events-none rounded-full" 
      />
      <div 
        aria-hidden="true" 
        className="absolute bottom-10 left-0 w-96 h-96 bg-red-900/5 blur-3xl pointer-events-none rounded-full" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-red-500 uppercase tracking-widest mb-2.5 px-3 py-1 bg-red-950/40 rounded-full border border-red-900/50">
            <Sparkles className="w-3.5 h-3.5 text-red-500" />
            <span>Confiança, Reputação & Sigilo</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-serif tracking-tight">
            Depoimentos de Clientes Satisfeitos
          </h2>
          
          <p className="text-sm sm:text-base text-zinc-400 mt-3 leading-relaxed">
            A máxima discrição e a confiança são nossos pilares. Atendimento exclusivo <strong className="text-zinc-200">ao domicílio e no espaço escolhido por cada cliente</strong> em Maputo e Matola, garantindo anonimato absoluto.
          </p>
        </div>

        {/* Big Trust Bar / Social Proof Strip */}
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 mb-12 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-zinc-800/80">
            
            {/* Rating Highlight */}
            <div className="pb-4 md:pb-0 md:pr-4 flex flex-col items-center md:items-start">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">4.9</span>
                <span className="text-xs text-zinc-400 font-semibold uppercase">/ 5.0</span>
              </div>
              <div className="flex items-center gap-1 text-amber-400 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-zinc-400">Classificação média verificada</p>
            </div>

            {/* Pillar 1: Ao Domicílio & Espaço */}
            <div className="pt-4 md:pt-0 md:px-6 flex flex-col items-center md:items-start">
              <div className="w-9 h-9 rounded-xl bg-red-950/60 border border-red-800/60 text-red-400 flex items-center justify-center mb-2">
                <Home className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white">100% ao Domicílio</h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                No seu lar, hotel ou espaço escolhido por si
              </p>
            </div>

            {/* Pillar 2: Sigilo & Discrição */}
            <div className="pt-4 md:pt-0 md:px-6 flex flex-col items-center md:items-start">
              <div className="w-9 h-9 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 flex items-center justify-center mb-2">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white">Sigilo Absoluto</h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                Carro descaracterizado e total anonimato
              </p>
            </div>

            {/* Pillar 3: Fidelidade das Fotos & Vídeos */}
            <div className="pt-4 md:pt-0 md:pl-6 flex flex-col items-center md:items-start">
              <div className="w-9 h-9 rounded-xl bg-red-950/60 border border-red-800/60 text-red-400 flex items-center justify-center mb-2">
                <UserCheck className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white">Fotos & Vídeos Reais</h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                Garantia de atendimento pela mesma pessoa do catálogo
              </p>
            </div>

          </div>
        </div>

        {/* Filter Bar & Add Review CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5 mr-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Filtrar por:</span>
            </span>

            {[
              { id: 'todos', label: 'Todos os Depoimentos' },
              { id: 'domicilio', label: 'Ao Domicílio / Residência' },
              { id: 'hotel', label: 'Suíte de Hotel' },
              { id: 'espaco', label: 'Espaço do Cliente' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  activeFilter === f.id
                    ? 'bg-red-600 border-red-500 text-white shadow-md shadow-red-950'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Leave Review Action Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-red-500/60 text-zinc-200 hover:text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5 text-red-500" />
            <span>Deixar Seu Depoimento Anônimo</span>
          </button>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestimonials.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-900/90 border border-zinc-800 hover:border-red-900/50 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-red-950/20 group"
            >
              <div>
                {/* Top Row: Stars & Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-400 group-hover:border-red-900/50 transition-colors">
                    {item.serviceType}
                  </span>
                </div>

                {/* Comment quote */}
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic mb-6">
                  "{item.comment}"
                </p>
              </div>

              {/* Bottom Client Info */}
              <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-950 to-zinc-900 border border-red-800/50 flex items-center justify-center text-xs font-bold text-red-300">
                    {item.avatarInitials || 'VIP'}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">{item.name}</span>
                      {item.verified && (
                        <span title="Cliente com atendimento verificado">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-zinc-500">
                      <MapPin className="w-3 h-3 text-red-500/70" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] text-zinc-500 font-mono">
                  {item.date}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* WhatsApp Private Feedback Banner */}
        <div className="mt-12 p-6 bg-gradient-to-r from-red-950/40 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/70 border border-emerald-800/80 flex items-center justify-center text-emerald-400 shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                Já foi atendido pela agência Boas e limpas?
              </h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                Envie o seu feedback confidencial direto para a nossa gerência com total sigilo.
              </p>
            </div>
          </div>

          <a
            href={`https://wa.me/258${config.phone1}?text=${encodeURIComponent(
              'Olá! Gostaria de deixar um feedback / elogio sobre o meu atendimento com a agência Boas e limpas.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-950/40 shrink-0 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Enviar Feedback pelo WhatsApp</span>
          </a>
        </div>

      </div>

      {/* MODAL: Enviar Depoimento Anônimo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            
            {/* Header */}
            <div className="px-6 py-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-5 h-5 text-red-500" />
                <h3 className="text-base font-bold text-white">
                  Deixar Depoimento Anônimo
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            {submittedSuccess ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-950 border border-emerald-800 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-white">Obrigado pelo seu depoimento!</h4>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  Sua avaliação foi registrada com sucesso com total anonimato e respeito à sua privacidade.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAddReview} className="p-6 space-y-4">
                <p className="text-xs text-zinc-400 leading-relaxed bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 inline mr-1.5" />
                  Seu nome real nunca é exigido. Use apenas um codinome ou inicial (ex: Dr. Carlos, M. P., etc.).
                </p>

                {/* Star Rating */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                    Sua Avaliação (1 a 5 Estrelas) *
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="p-1 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            formData.rating >= star
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-zinc-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-amber-400 ml-2 font-mono">
                      {formData.rating} de 5 estrelas
                    </span>
                  </div>
                </div>

                {/* Name / Pseudonym */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Nome ou Codinome *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Dr. Marcelo, M. P., Eng. Rui, etc."
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors"
                  />
                </div>

                {/* Location / Bairro */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Bairro / Cidade / Hotel (Opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Ex: Sommerschield, Maputo ou Matola"
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors"
                  />
                </div>

                {/* Service Type */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Modalidade de Atendimento *
                  </label>
                  <select
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-red-600 transition-colors"
                  >
                    <option value="Ao Domicílio">Ao Domicílio / Residência</option>
                    <option value="Espaço Escolhido">Espaço Escolhido pelo Cliente</option>
                    <option value="Suíte de Hotel">Suíte de Hotel / Resort</option>
                    <option value="Assinatura VIP">Subscrição VIP de 1000 MT</option>
                  </select>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Seu Relato / Comentário *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    placeholder="Conte como foi sua experiência, o sigilo, a higiene e a pontualidade..."
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white rounded-xl transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-red-950 transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publicar Depoimento</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}
    </section>
  );
};
