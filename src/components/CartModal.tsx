import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Send, PhoneCall, ShoppingBag, ShieldCheck, MapPin, CheckCircle, Copy, ExternalLink } from 'lucide-react';
import { CartItem, AgencyConfig, OrderFormData } from '../types.ts';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  config: AgencyConfig;
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cart,
  config,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [formData, setFormData] = useState<OrderFormData>({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    locationType: 'domicilio',
    paymentMethod: 'm-pesa',
    observations: '',
    agencyPhone: '864368486',
  });

  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [generatedWaUrl, setGeneratedWaUrl] = useState<string>('');
  const [generatedMessage, setGeneratedMessage] = useState<string>('');
  const [copiedMsg, setCopiedMsg] = useState(false);

  if (!isOpen) return null;

  const totalAmount = cart.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);
  const totalItemsCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!formData.customerName.trim()) {
      setValidationError('Por favor, informe seu nome para o agendamento.');
      return;
    }

    if (!formData.customerPhone.trim()) {
      setValidationError('Por favor, informe seu número de telefone de contato.');
      return;
    }

    if (!formData.customerAddress.trim()) {
      setValidationError('Por favor, informe o endereço ou nome do hotel para o atendimento.');
      return;
    }

    // Format items list for WhatsApp
    const itemsText = cart
      .map(
        (ci, idx) =>
          `${idx + 1}. *${ci.item.name}*\n   Quantidade: ${ci.quantity}\n   Valor: ${(
            ci.item.price * ci.quantity
          ).toLocaleString('pt-MZ')} MZN`
      )
      .join('\n\n');

    const paymentLabel =
      formData.paymentMethod === 'm-pesa'
        ? 'M-Pesa (Vodacom)'
        : formData.paymentMethod === 'emola'
        ? 'e-Mola (Movitel)'
        : 'Dinheiro em Mão';

    const locationLabel =
      formData.locationType === 'domicilio'
        ? 'Residência / Domicílio'
        : formData.locationType === 'hotel'
        ? 'Hotel / Hospedagem'
        : 'Na Agência Boas e Limpas';

    const message = `*SOLICITAÇÃO DE PEDIDO / AGENDAMENTO*\n*Agência Boas e limpas*\n----------------------------------------\n*ITENS SELECIONADOS:*\n${itemsText}\n\n*VALOR TOTAL:* ${totalAmount.toLocaleString('pt-MZ')} MZN\n----------------------------------------\n*DADOS DO CLIENTE:*\n👤 *Nome:* ${formData.customerName.trim()}\n📱 *Telefone:* ${formData.customerPhone.trim()}\n📍 *Local:* ${locationLabel}\n🏠 *Endereço/Detalhes:* ${formData.customerAddress.trim()}\n💳 *Forma de Pagamento:* ${paymentLabel}\n📝 *Observações:* ${formData.observations.trim() || 'Nenhuma'}\n----------------------------------------\n_Pedido gerado via Cardápio Digital Boas e limpas_`;

    const selectedPhone = formData.agencyPhone;
    const waUrl = `https://wa.me/258${selectedPhone}?text=${encodeURIComponent(message)}`;

    setGeneratedWaUrl(waUrl);
    setGeneratedMessage(message);
    setStep('success');

    // Attempt direct redirection or tab open safely
    try {
      const w = window.open(waUrl, '_blank');
      if (!w || w.closed || typeof w.closed === 'undefined') {
        // Popup was blocked by browser/iframe; the user will click the prominent WhatsApp button
      }
    } catch {
      // Fallback handled in the success screen
    }
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(generatedMessage);
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 2500);
  };

  const handleFinishAndReset = () => {
    onClearCart();
    setStep('cart');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-bold text-white font-serif">
              {step === 'cart'
                ? 'Seu Carrinho de Pedidos'
                : step === 'checkout'
                ? 'Finalizar Pedido via WhatsApp'
                : 'Pedido Preparado com Sucesso'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 && step !== 'success' ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <p className="text-base font-semibold text-zinc-200">Seu carrinho está vazio</p>
              <p className="text-xs text-zinc-400 mt-1">
                Explore nosso cardápio e adicione seus acompanhantes ou pacotes favoritos.
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer"
              >
                Voltar ao Cardápio
              </button>
            </div>
          ) : step === 'cart' ? (
            // CART REVIEW STEP
            <div className="space-y-4">
              <div className="space-y-3">
                {cart.map(({ item, quantity }) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 p-3.5 bg-zinc-900 border border-zinc-800/80 rounded-xl"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-lg object-cover bg-zinc-950 shrink-0 border border-zinc-800"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/src/assets/images/hero_banner_luxury_1791981846918.jpg';
                        }}
                      />
                      <div className="truncate">
                        <h4 className="text-sm font-bold text-white truncate">{item.name}</h4>
                        <p className="text-xs text-red-400 font-mono font-medium">
                          {item.price.toLocaleString('pt-MZ')} MZN
                        </p>
                        <p className="text-[11px] text-zinc-500">{item.category}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {/* Quantity Controller */}
                      <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg p-1">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="p-1 hover:text-red-400 transition-colors cursor-pointer"
                          aria-label="Diminuir quantidade"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-white font-mono tabular-nums">
                          {quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="p-1 hover:text-red-400 transition-colors cursor-pointer"
                          aria-label="Aumentar quantidade"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-2 text-zinc-500 hover:text-red-500 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                        title="Remover do carrinho"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary Box */}
              <div className="p-4 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-2">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Itens selecionados</span>
                  <span className="font-mono text-zinc-200">{totalItemsCount}</span>
                </div>
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Taxa de Agendamento</span>
                  <span className="text-emerald-400 font-semibold">Grátis</span>
                </div>
                <div className="pt-2 border-t border-zinc-800 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white">Valor Total</span>
                  <span className="text-xl font-extrabold text-red-500 font-mono tabular-nums">
                    {totalAmount.toLocaleString('pt-MZ')}{' '}
                    <span className="text-xs text-zinc-400 font-sans">MZN</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClearCart}
                  className="px-4 py-2.5 text-xs text-zinc-400 hover:text-red-400 hover:bg-zinc-900 rounded-xl transition-colors cursor-pointer"
                >
                  Esvaziar Carrinho
                </button>
                <button
                  type="button"
                  onClick={() => setStep('checkout')}
                  className="flex-1 h-12 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98] text-sm cursor-pointer shadow-lg shadow-red-950"
                >
                  <span>Avançar para Finalizar Pedido</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : step === 'checkout' ? (
            // CHECKOUT FORM STEP
            <form onSubmit={handleSubmitOrder} className="space-y-5">
              {validationError && (
                <div className="p-3 bg-red-950/80 border border-red-800 rounded-xl text-red-200 text-xs flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Recipient WhatsApp line selector */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                  Enviar Pedido para Qual Linha da Agência?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, agencyPhone: '864368486' })}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      formData.agencyPhone === '864368486'
                        ? 'bg-red-950/50 border-red-600 text-white shadow-md'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <PhoneCall className="w-4 h-4 text-red-500" />
                      <span className="text-xs font-bold">Linha Principal</span>
                    </div>
                    <span className="text-sm font-mono font-bold text-zinc-200">864 368 486</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, agencyPhone: '878872648' })}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      formData.agencyPhone === '878872648'
                        ? 'bg-red-950/50 border-red-600 text-white shadow-md'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <PhoneCall className="w-4 h-4 text-red-500" />
                      <span className="text-xs font-bold">Linha Secundária</span>
                    </div>
                    <span className="text-sm font-mono font-bold text-zinc-200">878 872 648</span>
                  </button>
                </div>
              </div>

              {/* Customer Name */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Seu Nome ou Como Prefere ser Chamado *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="Ex: Carlos, Dr. Manuel, etc."
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
                />
              </div>

              {/* Customer Phone */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Número de Telefone / WhatsApp do Cliente *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  placeholder="Ex: 84XXXXXXX ou 86XXXXXXX"
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all font-mono"
                />
              </div>

              {/* Location Type & Address */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Local do Atendimento *
                </label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {[
                    { id: 'domicilio', label: 'Domicílio' },
                    { id: 'hotel', label: 'Hotel' },
                    { id: 'agencia', label: 'Na Agência' },
                  ].map((loc) => (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, locationType: loc.id as any })}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        formData.locationType === loc.id
                          ? 'bg-zinc-800 border-red-500 text-white'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {loc.label}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <MapPin className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={formData.customerAddress}
                    onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                    placeholder="Endereço completo (Bairro, Rua, Hotel ou Referência)"
                    className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Forma de Pagamento *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'm-pesa', name: 'M-Pesa', desc: 'Vodacom' },
                    { id: 'emola', name: 'e-Mola', desc: 'Movitel' },
                    { id: 'dinheiro', name: 'Dinheiro', desc: 'No momento' },
                  ].map((pay) => (
                    <button
                      key={pay.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: pay.id as any })}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        formData.paymentMethod === pay.id
                          ? 'bg-red-950/40 border-red-600 text-white'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <span className="block text-sm font-bold text-white">{pay.name}</span>
                      <span className="text-[10px] text-zinc-400">{pay.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Observations */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Observações / Horário Desejado
                </label>
                <textarea
                  rows={2}
                  value={formData.observations}
                  onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                  placeholder="Ex: Prefiro atendimento às 21h, discrição total, etc."
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all resize-none"
                />
              </div>

              {/* Privacy Notice */}
              <div className="p-3 bg-zinc-900 border border-zinc-800/80 rounded-xl flex items-center gap-3 text-xs text-zinc-400">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  Garantia de 100% de sigilo. Seus dados nunca são compartilhados e o atendimento é confidencial.
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="px-4 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="flex-1 h-14 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-base shadow-lg shadow-emerald-950/50 cursor-pointer"
                >
                  <Send className="w-5 h-5" />
                  <span>
                    Enviar Pedido via WhatsApp ({totalAmount.toLocaleString('pt-MZ')} MZN)
                  </span>
                </button>
              </div>
            </form>
          ) : (
            // SUCCESS CONFIRMATION STEP
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 bg-emerald-950/80 border border-emerald-600 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-950">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white font-serif">
                  Pedido Pronto para Envio!
                </h3>
                <p className="text-sm text-zinc-300 mt-2 max-w-md mx-auto">
                  A mensagem com os dados do seu agendamento foi formatada com sucesso para a Linha Oficial <strong className="text-white font-mono">{formData.agencyPhone}</strong>.
                </p>
              </div>

              {/* Direct Link Button */}
              <div className="max-w-md mx-auto space-y-3">
                <a
                  href={generatedWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl flex items-center justify-center gap-3 text-base shadow-xl shadow-emerald-950 transition-all hover:scale-[1.01]"
                >
                  <span>Abrir Conversa no WhatsApp</span>
                  <ExternalLink className="w-5 h-5" />
                </a>

                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-semibold rounded-xl flex items-center justify-center gap-2 text-xs transition-colors cursor-pointer"
                >
                  {copiedMsg ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>Mensagem Copiada!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-zinc-400" />
                      <span>Copiar Texto do Pedido</span>
                    </>
                  )}
                </button>
              </div>

              <div className="pt-4 border-t border-zinc-800/80 flex justify-center">
                <button
                  type="button"
                  onClick={handleFinishAndReset}
                  className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Concluir e Voltar ao Cardápio
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
