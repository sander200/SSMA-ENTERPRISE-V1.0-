import { HardHat, Cpu, HeartPulse, Building2, ChevronRight, Pickaxe, Tractor } from "lucide-react";
import { ECONOMIC_SECTORS } from "../data/sectors";
import { SectorInfo } from "../types";
import { useLanguage } from "../i18n/LanguageContext";

interface Props {
  selectedSectorId: number;
  onSelectSector: (sector: SectorInfo) => void;
}

export function SectorGrid({ selectedSectorId, onSelectSector }: Props) {
  const { t, language } = useLanguage();

  function getIcon(name: string) {
    switch (name) {
      case "HardHat":
        return <HardHat className="w-5 h-5" />;
      case "Cpu":
        return <Cpu className="w-5 h-5" />;
      case "HeartPulse":
        return <HeartPulse className="w-5 h-5" />;
      case "Pickaxe":
        return <Pickaxe className="w-5 h-5" />;
      case "Tractor":
        return <Tractor className="w-5 h-5" />;
      default:
        return <Building2 className="w-5 h-5" />;
    }
  }

  const activeSectorLabel =
    language === "es"
      ? "Sector Activo en Simulador"
      : language === "en"
      ? "Active Simulator Sector"
      : "Setor Ativo no Simulador";

  const switchSectorLabel =
    language === "es"
      ? "Cambiar a este sector"
      : language === "en"
      ? "Switch to this sector"
      : "Trocar para este setor";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {t("sectorsHeading")}
        </h2>
        <span className="text-xs text-slate-500">{t("sectorsSubheading")}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ECONOMIC_SECTORS.map((sec) => {
          const isSelected = sec.id === selectedSectorId;
          return (
            <button
              key={sec.id}
              type="button"
              id={`select-sector-${sec.id}`}
              onClick={() => onSelectSector(sec)}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 cursor-pointer ${
                isSelected
                  ? "bg-slate-800/90 border-teal-500 shadow-lg shadow-teal-950/40 ring-1 ring-teal-500/50"
                  : "bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50"
              }`}
            >
              <div className="flex items-start justify-between w-full">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                      isSelected
                        ? "bg-teal-500/20 border-teal-500/40 text-teal-300"
                        : "bg-slate-800 border-slate-700 text-slate-400"
                    }`}
                  >
                    {getIcon(sec.iconName)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white leading-tight">{sec.name}</h3>
                    <span className="text-[11px] font-semibold text-teal-400 block mt-0.5">
                      {sec.norms}
                    </span>
                  </div>
                </div>

                <span
                  title="O grau da NR-4 não é o nome deste setor. Ele sai do anexo, pelo CNAE do estabelecimento."
                  className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700"
                >
                  {sec.riskClass}
                </span>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {sec.focusDescription}
              </p>

              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/60 w-full text-slate-500">
                <span>{isSelected ? activeSectorLabel : switchSectorLabel}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
