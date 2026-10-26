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
        <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Lei nº 13.709/2018
              </span>
              <span className="text-xs text-slate-400">Ciência de uso, não parecer jurídico</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-1">
              Antes de usar o SSMA Enterprise
            </h2>
          </div>
        </div>

        <div className="space-y-4 text-sm text-slate-300 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
          <p className="leading-relaxed">
            O <strong>SSMA Enterprise | SanderVerse</strong> é ferramenta de capacitação e de apoio ao SESMT. Não substitui a NR vigente, o GRO, o PGR, o PCMSO nem o profissional de SST.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/80">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-1.5">
                <Lock className="w-4 h-4" />
                Identidade
              </div>
              <p className="text-xs text-slate-400 leading-normal">
                Se um identificador for reduzido a SHA-256 com salt, isso é pseudonimização. O dado continua pessoal enquanto a reidentificação for razoavelmente possível. O art. 12 não é efeito automático do hash. A base legal é do controlador.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30">
              <div className="flex items-center gap-2 text-rose-300 font-semibold text-xs mb-1.5">
                <AlertTriangle className="w-4 h-4" />
                Uso previsto
              </div>
              <p className="text-xs text-rose-200/90 leading-normal">
                Check-in, tempo de resposta e cenário não servem para punição, ranking, demissão ou prova disciplinar. Também não diagnosticam saúde.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700 text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-2 text-slate-300 font-semibold">
              <FileText className="w-4 h-4 text-blue-400" />
              O que o painel não é
            </div>
            <p>
              Relatório por setor, quando houver respostas suficientes, é agregado. Menos de 5 respostas é limite metodológico deste produto, não um número da NR-1 nem da LGPD. O painel não é anônimo por decreto e não entra no PGR como laudo.
            </p>
          </div>
        </div>

        <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 cursor-pointer hover:bg-slate-800/70 transition-colors">
          <input
            type="checkbox"
            id="lgpd-agree-checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded-sm border-slate-600 bg-slate-700 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-slate-900 cursor-pointer"
          />
          <span className="text-xs text-slate-200 leading-normal select-none">
            Entendi que este aceite não escolhe a base legal da empresa e que o exercício não declara conformidade com as NRs.
          </span>
        </label>

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
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
