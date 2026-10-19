import { useState } from "react";
import { ShieldCheck, Lock, AlertTriangle, FileText, CheckCircle2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onAccept: () => void;
}

export function LGPDConsentModal({ isOpen, onAccept }: Props) {
  const [agreed, setAgreed] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 max-w-2xl w-full rounded-2xl shadow-2xl p-6 md:p-8 text-slate-100 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Lei nº 13.709/2018
              </span>
              <span className="text-xs text-slate-400">Segurança de Dados Sanitários</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-1">
              Termo de Consentimento Livre e Esclarecido (LGPD)
            </h2>
          </div>
        </div>

        {/* Informative text & guarantees */}
        <div className="space-y-4 text-sm text-slate-300 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
          <p className="leading-relaxed">
            Bem-vindo ao <strong>SSMA Enterprise | SanderVerse</strong>. Para proteger a integridade
            e a saúde biopsicossocial do trabalhador, informamos as diretrizes de privacidade aplicadas
            a todos os registros de <strong>SST e Módulo Psicológico</strong>:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/80">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-1.5">
                <Lock className="w-4 h-4" />
                Criptografia AES-256 e Hash
              </div>
              <p className="text-xs text-slate-400 leading-normal">
                Suas respostas no Check-in Emocional são encriptadas de ponta a ponta e identificadas
                exclusivamente por um código hash SHA-256 anônimo.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30">
              <div className="flex items-center gap-2 text-rose-300 font-semibold text-xs mb-1.5">
                <AlertTriangle className="w-4 h-4" />
                Vedação de Uso Punitivo
              </div>
              <p className="text-xs text-rose-200/90 leading-normal">
                É <strong>expressamente proibida</strong> a utilização de métricas de estresse ou
                fadiga para fins punitivos, demissões, cobranças de metas ou coação corporativa.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700 text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-2 text-slate-300 font-semibold">
              <FileText className="w-4 h-4 text-blue-400" />
              Finalidade Exclusivamente Preventiva e Didática
            </div>
            <p>
              Os relatórios consolidados disponibilizados ao SESMT e à CIPA são 100% anonimizados e
              agrupados por setor econômico, servindo apenas para adequar condições de trabalho,
              prevenir acidentes (NRs) e fornecer apoio psicológico profilático.
            </p>
          </div>
        </div>

        {/* Checkbox */}
        <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 cursor-pointer hover:bg-slate-800/70 transition-colors">
          <input
            type="checkbox"
            id="lgpd-agree-checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded-sm border-slate-600 bg-slate-700 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-slate-900 cursor-pointer"
          />
          <span className="text-xs text-slate-200 leading-normal select-none">
            Li e compreendo as salvaguardas da LGPD. Autorizo o processamento anonimizado dos meus
            check-ins emocionais para ajuste adaptativo do tempo de treinamento e sugestões de
            descompressão.
          </span>
        </label>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
          <button
            type="button"
            id="lgpd-accept-button"
            disabled={!agreed}
            onClick={onAccept}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              agreed
                ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 cursor-pointer"
                : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Aceitar Termos e Acessar Sistema
          </button>
        </div>
      </div>
    </div>
  );
}
