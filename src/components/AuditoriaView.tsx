import { ArrowLeft } from "lucide-react";
import { COPSOQ_II_BR, COPSOQ_II_BR_ITENS } from "../data/copsoqIiBr";
import { MARCO_LEGAL } from "../data/marcoLegal";

export function AuditoriaView({ onBack }: { onBack: () => void }) {
  return (
    <div className="space-y-6 max-w-4xl">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-teal-700 px-3 py-1.5 rounded-xl bg-white border border-slate-200"
      >
        <ArrowLeft className="w-3.5 h-3.5 text-teal-600" />
        Voltar ao menu
      </button>
      <div>
        <p className="text-xs font-bold tracking-wide text-teal-700 uppercase">Auditoria de uso</p>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">O que este sistema pode afirmar</h1>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          SSMA Enterprise apoia a capacitação e o olhar do SESMT. Não substitui a NR vigente, o GRO, o PGR, o PCMSO nem o profissional de SST. Um acerto na tela não declara conformidade.
        </p>
      </div>
      <ul className="space-y-3">
        {MARCO_LEGAL.map((item) => (
          <li key={item.id} className="bg-white border border-slate-200 rounded-2xl p-4">
            <p className="text-sm font-bold text-slate-900">{item.titulo}</p>
            <p className="mt-2 text-sm text-slate-600">{item.alcance}</p>
            <p className="mt-2 text-sm text-slate-800">{item.limite}</p>
          </li>
        ))}
      </ul>
      <section className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
        <h2 className="text-sm font-bold text-slate-900">
          COPSOQ II-Br — {COPSOQ_II_BR_ITENS} itens, {COPSOQ_II_BR.length} dimensões
        </h2>
        <p className="text-sm text-slate-600">
          Fonte: Gonçalves e outros, Revista de Saúde Pública, 2021;55:69. Os enunciados não são reescritos neste repositório. O profissional aplica o instrumento validado e usa a leitura do setor como insumo do inventário. Isso não é o PGR e não classifica severidade no lugar da empresa.
        </p>
        <ul className="grid sm:grid-cols-2 gap-2">
          {COPSOQ_II_BR.map((dim) => (
            <li key={dim.id} className="text-xs text-slate-700 border border-slate-100 rounded-xl px-3 py-2">
              <span className="font-semibold">{dim.nome}</span>
              <span className="text-slate-400"> · {dim.itens} {dim.itens === 1 ? "item" : "itens"} · {dim.nomeNoArtigo}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
