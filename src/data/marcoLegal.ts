export type Referencia = {
  id: string;
  titulo: string;
  alcance: string;
  limite: string;
};

export const MARCO_LEGAL: Referencia[] = [
  {
    id: "clt",
    titulo: "CLT, Capítulo V (arts. 154 a 201)",
    alcance:
      "Segurança e medicina do trabalho. O empregador cumpre as normas e instrui; o empregado observa e colabora (arts. 157 e 158).",
    limite: "O capítulo não é cumprido por um aplicativo.",
  },
  {
    id: "nr1",
    titulo: "NR-1 — GRO e PGR",
    alcance:
      "Inventário de riscos e plano de ação. A Portaria MTE 1.419/2024 incluiu os fatores psicossociais relacionados ao trabalho. A vigência desse trecho foi relatada para 26 de maio de 2026, após a Portaria MTE 765/2025. Conferir no texto consolidado.",
    limite:
      "Questionário não é obrigatório. Se for usado, não basta sozinho. Este sistema não redige o PGR.",
  },
  {
    id: "nr7",
    titulo: "NR-7 e NR-17",
    alcance: "PCMSO e ASO; ergonomia e avaliação do posto e da organização do trabalho.",
    limite: "Check-in emocional não é exame nem AEP.",
  },
  {
    id: "campo",
    titulo: "NRs de campo dos exercícios",
    alcance:
      "NR-6, NR-10, NR-12, NR-18, NR-22, NR-31, NR-32, NR-33 e NR-35. A lista não esgota a atividade.",
    limite: "A resposta do exercício não é o texto oficial e não libera máquina, andaime ou instalação.",
  },
  {
    id: "cat",
    titulo: "Lei 8.213/1991",
    alcance: "Comunicação do acidente de trabalho, quando o fato se enquadra na lei.",
    limite: "O sistema não emite CAT.",
  },
  {
    id: "lgpd",
    titulo: "Lei 13.709/2018",
    alcance:
      "Percepção de saúde pode ser dado sensível. SHA-256 com salt, se usado, é pseudonimização. O art. 12 não é efeito automático do hash.",
    limite:
      "A base legal é do controlador. Esconder média em grupo pequeno é cautela de produto, não um número fixado na lei.",
  },
];
