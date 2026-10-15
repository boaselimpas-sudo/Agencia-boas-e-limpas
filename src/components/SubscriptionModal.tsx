import React, { useState } from 'react';
import { X, Lock, CheckCircle2, ShieldCheck, Send, Sparkles, AlertCircle, Copy, Check } from 'lucide-react';
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
  const [phone, setPhone] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setErrorMsg('Por favor, informe o seu número de telemóvel e-Mola.');
      return;
    }

    onActivateSubscription(phone.trim(), transactionRef.trim() || `EMOLA-${Date.now().toString().slice(-6)}`);
    onClose();
  };

  const handleWhatsAppProof = () => {
    const message = `*COMPROVATIVO DE SUBSCRIÇÃO E-MOLA (1 MÊS)*\n*Agência Boas e limpas*\n----------------------------------\n📱 *Número do Cliente:* ${phone.trim() || 'A informar'}\n💰 *Valor:* ${config.subscriptionPrice} MZN\n💳 *Forma de Pagamento:* e-Mola (Movitel)\n🔖 *Ref/Comprovativo:* ${transactionRef.trim() || 'Comprovativo em anexo'}\n----------------------------------\n_Solicito a ativação do meu acesso de 1 mês ao Catálogo VIP._`;
    const waUrl = `https://wa.me/258${config.emolaNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  const daysRemaining = subscription.expiresAt
    ? Math.max(0, Math.ceil((subscription.expiresAt - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header with Luxury Red Glow */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-red-950/80 via-zinc-900 to-zinc-950 border-b border-zinc-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-red-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Subscrição Mensal VIP
              </span>
              <h2 className="text-xl font-bold text-white font-serif">
                Acesso ao Catálogo Completo
              </h2>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {subscription.isSubscribed ? (
            // User is already subscribed
            <div className="p-5 bg-emerald-950/40 border border-emerald-800/80 rounded-2xl text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">Sua Subscrição está Ativa!</h3>
              <p className="text-xs text-zinc-300">
                Você possui acesso completo e irrestrito a todos os perfis, fotos e vídeos exclusivos do nosso Catálogo.
              </p>
              <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-700/60 text-emerald-200 text-xs font-mono font-bold">
                {daysRemaining} dias restantes de acesso
              </div>
              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer"
                >
                  Continuar Explorando o Catálogo
                </button>
              </div>
            </div>
          ) : (
            // Payment instructions for e-Mola
            <>
              {/* Value Banner */}
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-zinc-400 block font-medium">Plano de Subscrição (30 Dias)</span>
                  <span className="text-2xl font-black text-white font-serif">
                    {config.subscriptionPrice} <span className="text-sm font-sans text-red-500 font-bold">MZN / mês</span>
                  </span>
                </div>
                <span className="px-3 py-1 bg-red-600/20 text-red-400 text-xs font-bold rounded-full border border-red-500/30">
                  Via e-Mola (Movitel)
                </span>
              </div>

              {/* Step-by-Step Payment Instructions */}
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-mono">1</span>
                  Como fazer o pagamento via e-Mola:
                </h4>

                <div className="space-y-2 text-xs text-zinc-300">
                  <p>1. No seu telemóvel, disque <strong className="text-white font-mono bg-zinc-950 px-1.5 py-0.5 rounded">*898#</strong> ou acesse o aplicativo <strong>e-Mola</strong>.</p>
                  <p>2. Selecione a opção <strong>Transferir Dinheiro</strong>.</p>
                  <p>3. Transfira o valor de <strong className="text-white font-mono">{config.subscriptionPrice} MZN</strong> para a conta e-Mola oficial:</p>
                </div>

                {/* Account Details Box */}
                <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Número e-Mola Oficial</span>
                    <span className="text-base font-mono font-extrabold text-white">
                      {config.emolaNumber}
                    </span>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">Nome: {config.emolaName}</span>
                  </div>

                  <button
                    onClick={() => handleCopyNumber(config.emolaNumber)}
                    className="h-9 px-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedNumber ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-red-400" />}
                    <span>{copiedNumber ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>

              {/* Activation Form */}
              <form onSubmit={handleConfirmPayment} className="space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-mono">2</span>
                  Ativar meu Acesso de 1 Mês:
                </h4>

                {errorMsg && (
                  <div className="p-2.5 bg-red-950/80 border border-red-800 rounded-xl text-red-200 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs text-zinc-300 font-semibold mb-1">
                    Seu Número de Telemóvel e-Mola *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ex: 86XXXXXXX ou 87XXXXXXX"
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-300 font-semibold mb-1">
                    Código de Referência da Mensagem e-Mola (opcional)
                  </label>
                  <input
                    type="text"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    placeholder="Ex: ID de Transação recebido por SMS"
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 font-mono"
                  />
                </div>

                <div className="flex flex-col gap-2.5 pt-1">
                  <button
                    type="submit"
                    className="w-full h-13 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-xl shadow-red-950 cursor-pointer transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirmar Pagamento e-Mola & Desbloquear Catálogo</span>
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
                <span>Subscrição válida por 30 dias contínuos com sigilo e discrição absoluta.</span>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
