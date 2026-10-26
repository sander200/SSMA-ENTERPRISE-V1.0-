/** Gonçalves, Moriguchi, Chaves e Sato. Rev Saúde Pública. 2021;55:69. */
export type CopsoqDimensao = {
  id: string;
  nome: string;
  nomeNoArtigo: string;
  itens: number;
};

export const COPSOQ_II_BR: CopsoqDimensao[] = [
  { id: "demands", nome: "Exigências do trabalho", nomeNoArtigo: "Demands at work", itens: 6 },
  { id: "influence", nome: "Influência e desenvolvimento", nomeNoArtigo: "Influence and development", itens: 4 },
  { id: "meaning", nome: "Sentido e comprometimento", nomeNoArtigo: "Meaning and commitment", itens: 4 },
  { id: "relations", nome: "Relações interpessoais", nomeNoArtigo: "Interpersonal relationships", itens: 6 },
  { id: "leadership", nome: "Liderança", nomeNoArtigo: "Leadership", itens: 4 },
  { id: "satisfaction", nome: "Satisfação no trabalho", nomeNoArtigo: "Job satisfaction", itens: 1 },
  { id: "family", nome: "Conflito trabalho-família", nomeNoArtigo: "Work family conflicts", itens: 2 },
  { id: "values", nome: "Valores no local de trabalho", nomeNoArtigo: "Values at the workplace", itens: 4 },
  { id: "health", nome: "Saúde geral", nomeNoArtigo: "General health", itens: 1 },
  { id: "burnout", nome: "Esgotamento e estresse", nomeNoArtigo: "Burnout and stress", itens: 4 },
  { id: "offensive", nome: "Comportamentos ofensivos", nomeNoArtigo: "Offensive behaviours", itens: 4 },
];

export const COPSOQ_II_BR_ITENS = COPSOQ_II_BR.reduce((n, d) => n + d.itens, 0);
