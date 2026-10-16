import React, { useState } from 'react';
import { 
  X, Lock, CheckCircle2, ShieldCheck, Send, Sparkles, AlertCircle, Copy, Check,
  QrCode, Smartphone, Wallet, Clock, Calendar
} from 'lucide-react';
import { AgencyConfig, SubscriptionStatus } from '../types.ts';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AgencyConfig;
  subscription: SubscriptionStatus;
  onActivateSubscription: (phone: string, ref: string) => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  config,
  subscription,
  onActivateSubscription,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'emola' | 'mpesa'>('emola');
  const [phone, setPhone] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentPrice = config.subscriptionPrice || 1000;
  const emolaNum = config.emolaNumber || '864368486';
  const emolaHolder = config.emolaName || 'Boas e limpas VIP';
  const mpesaNum = config.mpesaNumber || '848872648';
  const mpesaHolder = config.mpesaName || 'Boas e limpas VIP';

  const selectedNumber = paymentMethod === 'emola' ? emolaNum : mpesaNum;
  const selectedHolder = paymentMethod === 'emola' ? emolaHolder : mpesaHolder;
  const selectedQrImage = paymentMethod === 'emola' ? config.emolaQrImage : config.mpesaQrImage;

  const handleCopyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setErrorMsg(`Por favor, informe o seu número de telemóvel ${paymentMethod === 'emola' ? 'e-Mola' : 'M-Pesa'}.`);
      return;
    }

    const defaultRef = `${paymentMethod.toUpperCase()}-${Date.now().toString().slice(-6)}`;
    onActivateSubscription(phone.trim(), transactionRef.trim() || defaultRef);
    onClose();
  };

  const handleWhatsAppProof = () => {
    const methodLabel = paymentMethod === 'emola' ? 'e-Mola (Movitel)' : 'M-Pesa (Vodacom)';
    const message = `*COMPROVATIVO DE SUBSCRIÇÃO VIP (30 DIAS)*\n*Agência Boas e limpas*\n----------------------------------\n📱 *Número do Cliente:* ${phone.trim() || 'A informar'}\n💰 *Valor Pago:* ${currentPrice} MT\n💳 *Forma de Pagamento:* ${methodLabel}\n🔖 *Ref/Comprovativo:* ${transactionRef.trim() || 'Comprovativo anexado'}\n----------------------------------\n_Solicito o desbloqueio do Catálogo e Galeria por 30 dias._`;
    const waPhone = paymentMethod === 'emola' ? emolaNum : (config.phone1 || emolaNum);
    const waUrl = `https://wa.me/258${waPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  const daysRemaining = subscription.expiresAt
    ? Math.max(0, Math.ceil((subscription.expiresAt - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  const expirationDateFormatted = subscription.expiresAt
    ? new Date(subscription.expiresAt).toLocaleDateString('pt-MZ', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header with Luxury Red Glow */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-red-950/80 via-zinc-900 to-zinc-950 border-b border-zinc-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-red-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Subscrição Mensal VIP (30 Dias)
              </span>
              <h2 className="text-xl font-bold text-white font-serif">
                Acesso Restrito ao Catálogo & Mídias
              </h2>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {subscription.isSubscribed ? (
            // User is already subscribed
            <div className="p-5 bg-emerald-950/40 border border-emerald-800/80 rounded-2xl text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Sua Subscrição está Ativa!</h3>
                <p className="text-xs text-zinc-300 mt-1">
                  Você possui acesso VIP completo e irrestrito para ver todas as fotos de ensaio e vídeos exclusivos do nosso Catálogo por 30 dias.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-zinc-950/80 rounded-xl border border-zinc-800/80 text-left">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Tempo Restante</span>
                    <span className="text-sm font-bold text-emerald-300 font-mono">{daysRemaining} dias</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Válido Até</span>
                    <span className="text-sm font-bold text-zinc-200 font-mono">{expirationDateFormatted}</span>
                  </div>
                </div>
              </div>

              {subscription.customerPhone && (
                <p className="text-[11px] text-zinc-400">
                  Cliente registrado: <strong className="text-zinc-200 font-mono">{subscription.customerPhone}</strong>
                </p>
              )}

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="w-full h-12 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer shadow-lg shadow-red-950"
                >
                  Explorar Catálogo & Fotos Liberadas
                </button>
              </div>
            </div>
          ) : (
            // Payment instructions for 1000 MT
            <>
              {/* Value Banner */}
              <div className="p-4 bg-gradient-to-r from-zinc-900 to-zinc-900/90 border border-zinc-800 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-zinc-400 block font-medium">Subscrição Individual por Cliente</span>
                  <span className="text-2xl font-black text-white font-serif">
                    {currentPrice} <span className="text-sm font-sans text-red-500 font-bold">MT / 30 dias</span>
                  </span>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-red-600/20 text-red-400 text-xs font-bold rounded-full border border-red-500/30 block w-fit ml-auto">
                    30 Dias de Acesso
                  </span>
                  <span className="text-[10px] text-zinc-400 mt-1 block">Fotos & Vídeos MP4</span>
                </div>
              </div>

              {/* Informative notice */}
              <div className="p-3.5 bg-red-950/30 border border-red-900/40 rounded-xl flex items-start gap-2.5 text-xs text-zinc-300">
                <ShieldCheck className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>
                  O catálogo e as mídias são estritamente restritos. Somente clientes que realizarem a subscrição mensal de <strong>{currentPrice} MT</strong> terão acesso liberado a fotos e vídeos por tempo determinado de 30 dias.
                </span>
              </div>

              {/* Payment Method Selector (e-Mola / M-Pesa) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Escolha o método de pagamento:
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('emola')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'emola'
                        ? 'bg-amber-950/40 border-amber-500 text-white shadow-md shadow-amber-950/50'
                        : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      <span className="text-xs font-bold">e-Mola (Movitel)</span>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-mono">*898#</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mpesa')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'mpesa'
                        ? 'bg-red-950/40 border-red-500 text-white shadow-md shadow-red-950/50'
                        : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                      <span className="text-xs font-bold">M-Pesa (Vodacom)</span>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-mono">*150#</span>
                  </button>
                </div>
              </div>

              {/* Step 1: Payment Instructions */}
              <div className="p-4 bg-zinc-900/70 border border-zinc-800 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-mono">1</span>
                  <span>Como pagar via {paymentMethod === 'emola' ? 'e-Mola' : 'M-Pesa'}:</span>
                </h4>

                <div className="space-y-1.5 text-xs text-zinc-300">
                  <p>
                    1. No telemóvel, marque <strong className="text-white font-mono bg-zinc-950 px-1.5 py-0.5 rounded">{paymentMethod === 'emola' ? '*898#' : '*150#'}</strong> ou use o app <strong>{paymentMethod === 'emola' ? 'e-Mola' : 'M-Pesa'}</strong>.
                  </p>
                  <p>2. Selecione a opção <strong>Transferir Dinheiro</strong>.</p>
                  <p>
                    3. Transfira o valor de <strong className="text-white font-mono">{currentPrice} MT</strong> para a conta oficial:
                  </p>
                </div>

                {/* Account Details Box */}
                <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
                        Número Oficial {paymentMethod === 'emola' ? 'e-Mola' : 'M-Pesa'}
                      </span>
                      <span className="text-lg font-mono font-black text-white tracking-wide">
                        {selectedNumber}
                      </span>
                      <span className="text-[10px] text-zinc-400 block mt-0.5">Nome Titular: {selectedHolder}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyNumber(selectedNumber)}
                      className="h-9 px-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      {copiedNumber ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-red-400" />}
                      <span>{copiedNumber ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>

                  {selectedQrImage && (
                    <div className="pt-2 border-t border-zinc-800/80 flex flex-col items-center justify-center p-3 bg-zinc-900/60 rounded-xl">
                      <span className="text-[11px] font-bold text-zinc-300 mb-2 flex items-center gap-1.5">
                        <QrCode className="w-3.5 h-3.5 text-red-400" />
                        QR Code de Recebimento Oficial ({paymentMethod === 'emola' ? 'e-Mola' : 'M-Pesa'})
                      </span>
                      <img
                        src={selectedQrImage}
                        alt={`QR Code ${paymentMethod}`}
                        className="w-36 h-36 object-contain rounded-lg border border-zinc-700 bg-white p-1 shadow-md"
                      />
                      <span className="text-[10px] text-zinc-400 mt-1.5">Escaneie no aplicativo para transferir os {currentPrice} MT</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 2: Form to Activate Access */}
              <form onSubmit={handleConfirmPayment} className="space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-mono">2</span>
                  <span>Ativar Acesso Imediato por 30 Dias:</span>
                </h4>

                {errorMsg && (
                  <div className="p-2.5 bg-red-950/80 border border-red-800 rounded-xl text-red-200 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs text-zinc-300 font-semibold mb-1">
                    Seu Número de Telemóvel ({paymentMethod === 'emola' ? 'e-Mola' : 'M-Pesa'}) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder={paymentMethod === 'emola' ? 'Ex: 86XXXXXXX ou 87XXXXXXX' : 'Ex: 84XXXXXXX ou 85XXXXXXX'}
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-300 font-semibold mb-1">
                    Código / ID da Transação (SMS do {paymentMethod === 'emola' ? 'e-Mola' : 'M-Pesa'})
                  </label>
                  <input
                    type="text"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    placeholder="Ex: PP261016... ou ID da confirmação"
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 font-mono"
                  />
                  <span className="text-[10px] text-zinc-500 mt-1 block">Insira o código recebido por mensagem após a transferência.</span>
                </div>

                <div className="flex flex-col gap-2.5 pt-1">
                  <button
                    type="submit"
                    className="w-full h-13 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-xl shadow-red-950 cursor-pointer transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirmar Pagamento ({currentPrice} MT) & Desbloquear por 30 Dias</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppProof}
                    className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-emerald-400 border border-zinc-800 hover:border-emerald-600/50 font-semibold rounded-xl flex items-center justify-center gap-2 text-xs transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar Comprovativo pelo WhatsApp</span>
                  </button>
                </div>
              </form>

              <div className="p-3 bg-zinc-900/40 rounded-xl border border-zinc-800/80 flex items-center gap-2.5 text-xs text-zinc-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Subscrição individual válida por 30 dias contínuos em cada cliente com sigilo absoluto.</span>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
