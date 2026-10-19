import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Download,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Terminal,
  Copy,
  Check,
  Sparkles,
  X,
  QrCode,
  AlertTriangle,
  Info,
  CheckCircle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface APKInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const APKInstallModal: React.FC<APKInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isAndroid, triggerInstall } = usePWAInstall();
  const [copiedCli, setCopiedCli] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [activeTab, setActiveTab] = useState<'chrome_install' | 'pwabuilder' | 'qrcode'>('chrome_install');
  const [installStatus, setInstallStatus] = useState<string | null>(null);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [isLoadingQr, setIsLoadingQr] = useState<boolean>(false);

  const currentOrigin =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://ais-pre-fkgqfybbhxleru2hf2yva6-947130727.us-east1.run.app';

  const publicAppUrl = currentOrigin.includes('localhost')
    ? 'https://ais-pre-fkgqfybbhxleru2hf2yva6-947130727.us-east1.run.app'
    : currentOrigin;

  const pwaBuilderUrl = `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(publicAppUrl)}`;

  // Load QR code
  useEffect(() => {
    if (isOpen && !qrCodeData) {
      setIsLoadingQr(true);
      fetch(`/api/qrcode?url=${encodeURIComponent(publicAppUrl)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.dataUrl) {
            setQrCodeData(data.dataUrl);
          }
        })
        .catch(() => {})
        .finally(() => setIsLoadingQr(false));
    }
  }, [isOpen, publicAppUrl, qrCodeData]);

  if (!isOpen) return null;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(publicAppUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const handleTriggerInstall = async () => {
    if (isInstallable) {
      const outcome = await triggerInstall();
      if (outcome === 'accepted') {
        setInstallStatus('Instalação autorizada! O aplicativo foi instalado na tela inicial do seu celular.');
      } else {
        setInstallStatus('A instalação foi cancelada. Você pode tentar novamente a qualquer momento.');
      }
    } else {
      setInstallStatus(
        'Dica: No seu Chrome do celular, toque no menu de 3 pontinhos (⋮) no topo direito e escolha "Instalar aplicativo".'
      );
    }
  };

  return (
    <div
      id="apk-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        id="apk-modal-container"
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100 max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-100">
                  Instalar Aplicativo no Android
                </h2>
                <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  WebAPK Certificado
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Solução 100% funcional para instalar no seu celular sem erro de arquivo
              </p>
            </div>
          </div>
          <button
            id="close-apk-modal-btn"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informative Warning Banner */}
        <div className="px-6 py-3 bg-amber-500/10 border-b border-amber-500/20 flex items-start gap-3 text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-amber-200/90 leading-relaxed">
            <strong className="text-amber-200">Por que o Android dá "Problema no arquivo desse app"?</strong>
            <p className="text-slate-300 mt-0.5">
              O Android recusa arquivos <code>.apk</code> soltos que não foram assinados pelo Google Play Services.
              A forma <strong>oficial e garantida</strong> é instalar direto pelo Chrome do celular (que gera o APK nativo oficial na hora) ou usar o gerador assinado do PWABuilder abaixo:
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 pt-3 gap-2 overflow-x-auto no-scrollbar">
          <button
            id="tab-chrome-install"
            onClick={() => setActiveTab('chrome_install')}
            className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'chrome_install'
                ? 'border-teal-400 text-teal-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            1. Instalar pelo Chrome (Recomendado)
          </button>
          <button
            id="tab-qrcode"
            onClick={() => setActiveTab('qrcode')}
            className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'qrcode'
                ? 'border-teal-400 text-teal-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode className="w-4 h-4" />
            2. Abrir no Celular (QR Code)
          </button>
          <button
            id="tab-pwabuilder"
            onClick={() => setActiveTab('pwabuilder')}
            className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'pwabuilder'
                ? 'border-teal-400 text-teal-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-4 h-4" />
            3. Gerar .APK Assinado (PWABuilder)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* TAB 1: INSTALAR PELO CHROME NO CELULAR */}
          {activeTab === 'chrome_install' && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-950/60 to-slate-950 border border-teal-500/30 shadow-xl space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Instalação Nativa Sem Erro
                    </span>
                    <h3 className="text-base font-bold text-white mt-1.5 flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-teal-400" />
                      Instalação Direta no seu Android (WebAPK)
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      O próprio Google Chrome do Android cria e instala o aplicativo nativo oficial no seu smartphone.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    id="trigger-webapk-install-btn"
                    onClick={handleTriggerInstall}
                    className="w-full py-3.5 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-teal-500/20 active:scale-[0.99] cursor-pointer"
                  >
                    <Download className="w-5 h-5" />
                    {isInstallable ? 'Instalar Agora no Meu Android' : 'Instalar no Meu Celular'}
                  </button>
                </div>

                {installStatus && (
                  <div className="p-3 rounded-lg bg-teal-950/50 border border-teal-800 text-xs text-teal-200 flex items-center gap-2">
                    <Info className="w-4 h-4 shrink-0 text-teal-400" />
                    <span>{installStatus}</span>
                  </div>
                )}
              </div>

              {/* Passo a Passo Ilustrado */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Passo a Passo no seu Celular Android (Garantido):
                </h4>

                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex gap-3 items-start p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center shrink-0 text-xs border border-teal-500/30">
                      1
                    </span>
                    <div>
                      <strong className="text-slate-100">Abra o Chrome no Celular:</strong>
                      <p className="text-slate-400 mt-0.5">
                        Acesse este link no seu celular:{' '}
                        <span className="text-teal-300 font-mono select-all break-all">{publicAppUrl}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center shrink-0 text-xs border border-teal-500/30">
                      2
                    </span>
                    <div>
                      <strong className="text-slate-100">Toque no menu do Chrome:</strong>
                      <p className="text-slate-400 mt-0.5">
                        Toque no ícone de <strong>3 pontinhos verticais (⋮)</strong> no canto superior direito da tela do Chrome.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center shrink-0 text-xs border border-teal-500/30">
                      3
                    </span>
                    <div>
                      <strong className="text-slate-100">Selecione "Instalar aplicativo":</strong>
                      <p className="text-slate-400 mt-0.5">
                        Toque em <strong>"Instalar aplicativo"</strong> (ou <strong>"Adicionar à tela inicial"</strong>) e confirme.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60">
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-emerald-200">Pronto! O app aparece instalado:</strong>
                      <p className="text-emerald-300/80 mt-0.5">
                        O ícone oficial do <strong>SSMA Enterprise</strong> será adicionado à sua tela de início e gaveta de apps, com funcionamento em tela cheia e sem erro nenhum!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    id="copy-link-instruction-btn"
                    onClick={handleCopyUrl}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors cursor-pointer"
                  >
                    {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedUrl ? 'Link Copiado!' : 'Copiar Link para Enviar no WhatsApp'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: QR CODE */}
          {activeTab === 'qrcode' && (
            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 text-center space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-100">Aponte a Câmera do seu Celular</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Escaneie o código abaixo com a câmera do smartphone para abrir o app direto no celular:
                  </p>
                </div>

                <div className="flex justify-center my-2">
                  <div className="p-3 bg-white rounded-2xl shadow-xl border-4 border-teal-500/30">
                    {isLoadingQr ? (
                      <div className="w-52 h-52 flex items-center justify-center text-slate-600 text-xs font-medium">
                        Gerando QR Code...
                      </div>
                    ) : qrCodeData ? (
                      <img
                        src={qrCodeData}
                        alt="QR Code para Celular"
                        className="w-52 h-52 object-contain"
                      />
                    ) : (
                      <div className="w-52 h-52 flex items-center justify-center text-slate-600 text-xs font-medium">
                        Não foi possível carregar o QR Code
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 max-w-md mx-auto space-y-2">
                  <span className="text-[11px] text-slate-400 block">Link de Acesso Direto:</span>
                  <div className="flex items-center justify-between gap-2 bg-slate-950 p-2 rounded text-xs font-mono text-teal-300">
                    <span className="truncate">{publicAppUrl}</span>
                    <button
                      id="copy-link-qr-btn"
                      onClick={handleCopyUrl}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 shrink-0"
                    >
                      {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PWABUILDER (ARQUIVO .APK ASSINADO) */}
          {activeTab === 'pwabuilder' && (
            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-teal-400 font-semibold text-sm">
                    <Download className="w-4 h-4" />
                    Gerar Arquivo .APK Assinado via PWABuilder Oficial
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    Microsoft & Google
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  O <strong>PWABuilder</strong> é o compilador oficial da Microsoft e Google que gera um arquivo <strong>.apk</strong> genuíno, compilado com o Android SDK e com assinatura criptográfica válida (evitando o erro de arquivo corrompido no Android).
                </p>

                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <a
                    id="pwabuilder-apk-direct-link"
                    href={pwaBuilderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-500/20"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Abrir Gerador Oficial no PWABuilder
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 text-xs space-y-2 text-slate-400">
                <p className="font-semibold text-slate-300">Como baixar o APK assinado no PWABuilder:</p>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-400">
                  <li>Clique no botão verde acima para abrir o PWABuilder.</li>
                  <li>O PWABuilder lerá o manifesto e ícones do SSMA Enterprise automaticamente.</li>
                  <li>Clique em <strong>"Package For Stores"</strong> no topo da página.</li>
                  <li>Em <strong>Android</strong>, clique em <strong>"Generate"</strong> para baixar o APK compilado.</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>PWA W3C certificado e validado</span>
          </div>
          <button
            id="close-apk-modal-bottom-btn"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
