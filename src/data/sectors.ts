import { SectorInfo, TestScenario } from "../types";

/**
 * riskClass não é o grau da NR-4.
 * O grau do estabelecimento sai do anexo da NR-4, pelo CNAE da atividade
 * principal e, se for diferente, da preponderante. O nome deste setor não o define.
 */
export const ECONOMIC_SECTORS: SectorInfo[] = [
  {
    id: 1,
    name: "Construção Civil",
    shortCode: "CC",
    norms: "NR-18, NR-35",
    normList: ["NR-18", "NR-35"],
    focusDescription:
      "Trabalho em altura, montagem de andaimes, proteções coletivas (EPCs) e seleção/uso correto de EPIs.",
    iconName: "HardHat",
    riskClass: "Pelo CNAE",
    primaryColor: "amber",
  },
  {
    id: 2,
    name: "Indústria & Manufatura",
    shortCode: "IND",
    norms: "NR-12, NR-10",
    normList: ["NR-12", "NR-10"],
    focusDescription:
      "Segurança em máquinas e equipamentos, procedimentos de bloqueio e etiquetagem (LOTO) e riscos elétricos.",
    iconName: "Cpu",
    riskClass: "Pelo CNAE",
    primaryColor: "blue",
  },
  {
    id: 3,
    name: "Serviços de Saúde",
    shortCode: "SAU",
    norms: "NR-32",
    normList: ["NR-32"],
    focusDescription:
      "Biossegurança hospitalar, descarte seguro de perfurocortantes e contenção de exposição a agentes biológicos.",
    iconName: "HeartPulse",
    riskClass: "Pelo CNAE",
    primaryColor: "emerald",
  },
  {
    id: 4,
    name: "Mineração & Espaços Confinados",
    shortCode: "MIN",
    norms: "NR-22, NR-33",
    normList: ["NR-22", "NR-33"],
    focusDescription:
      "Monitoramento atmosférico rigoroso, ventilação de recintos, PET e protocolos de resgate de emergência.",
    iconName: "Pickaxe",
    riskClass: "Pelo CNAE",
    primaryColor: "slate",
  },
  {
    id: 5,
    name: "Agronegócio",
    shortCode: "AGR",
    norms: "NR-31",
    normList: ["NR-31"],
    focusDescription:
      "Manejo seguro de defensivos agrícolas, operação de maquinário pesado e prevenção contra insolação térmica.",
    iconName: "Tractor",
    riskClass: "Pelo CNAE",
    primaryColor: "lime",
  },
  {
    id: 6,
    name: "Ambientes Administrativos",
    shortCode: "ADM",
    norms: "NR-17",
    normList: ["NR-17"],
    focusDescription:
      "Ergonomia aplicada, mitigação de estresse corporativo, controle de carga mental e gestão saudável de prazos.",
    iconName: "Building2",
    riskClass: "Pelo CNAE",
    primaryColor: "violet",
  },
];

export const INITIAL_SCENARIOS: TestScenario[] = [
  {
    scenario_id: "cc-35-001",
    sector: "Construção Civil",
    norm_reference: "NR-18 e NR-35",
    situation_description:
      "Montagem de estrutura metálica no 12º andar. Vento moderado de 35 km/h iniciou-se subitamente. O encarregado pressiona a equipe para finalizar a fixação antes do término do turno para evitar atraso no cronograma da obra.",
    environmental_conditions: "Vento moderado (35 km/h), altura de 36 metros, céu nublado",
    human_factor_pressure: "Pressão de prazo pelo encarregado e pressa de encerramento do turno",
    options: [
      {
        id: "A",
        text: "Continuar a atividade rapidamente utilizando apenas o cinto de segurança abdominal para ganhar tempo e mobilidade.",
        is_correct: false,
        justification:
          "Incorreto. A NR-35 proíbe expressamente cinto abdominal para retenção de quedas (exige cinturão tipo paraquedista) e veda atividades em altura sob ventos fortes sem plano específico de resgate.",
      },
      {
        id: "B",
        text: "Paralisar imediatamente a atividade de altura, ancorar os materiais soltos e reportar a condição climática ao SESMT.",
        is_correct: true,
        justification:
          "Correto. Atende rigorosamente à NR-35 quanto a condições meteorológicas adversas e exercício regular do Direito de Recusa diante de risco iminente.",
      },
      {
        id: "C",
        text: "Remover a linha de vida temporária para permitir que o guindaste aproxime a carga mais rapidamente.",
        is_correct: false,
        justification:
          "Incorreto. A desativação de proteção contra quedas é falta gravíssima de SST segundo a NR-18 e NR-35.",
      },
    ],
    risk_level: "Crítico",
  },
  {
    scenario_id: "ind-12-001",
    sector: "Indústria & Manufatura",
    norm_reference: "NR-12 e NR-10",
    situation_description:
      "Uma prensa hidráulica industrial de conformação de chapas trava inesperadamente. A esteira traseira continua recebendo peças e há risco de transbordamento de óleo.",
    environmental_conditions: "Piso oleoso, ruído de 87 dB(A), temperatura quente de fábrica",
    human_factor_pressure: "Meta de produção de peças para exportação com entrega às 18h",
    options: [
      {
        id: "A",
        text: "Abaixar a grade de proteção com um calço improvisado e limpar o óleo com estopa enquanto o motor esfria.",
        is_correct: false,
        justification:
          "Incorreto. Burlar intertravamentos de proteção viola o item 12.38 da NR-12 e causa graves riscos de esmagamento.",
      },
      {
        id: "B",
        text: "Executar o procedimento LOTO: desenergizar o painel, instalar cadeado e garra de bloqueio, etiquetar e testar a ausência de pressão hidráulica residual antes de qualquer toque.",
        is_correct: true,
        justification:
          "Correto. Cumpre com exatidão a NR-12 e NR-10 para bloqueio de fontes de energia potencialmente perigosas e despressurização prévia.",
      },
      {
        id: "C",
        text: "Pedir para o operador colega manter o botão de emergência pressionado enquanto inspeciona manualmente as engrenagens.",
        is_correct: false,
        justification:
          "Incorreto. O botão de emergência não substitui o bloqueio mecânico/físico de energia (LOTO). Falha elétrica súbita pode reativar o maquinário.",
      },
    ],
    risk_level: "Crítico",
  },
  {
    scenario_id: "saude-32-042",
    sector: "Serviços de Saúde",
    norm_reference: "NR-32",
    situation_description:
      "Durante o descarte de materiais perfurocortantes em um pronto-socorro movimentado, o coletor rígido atinge o limite máximo de capacidade (marcador de 80%). Um funcionário com pressa tenta empurrar os materiais com os dedos para abrir espaço.",
    environmental_conditions: "Ambiente hospitalar com alta lotação e troca de curativos",
    human_factor_pressure: "Fadiga de plantão contínuo de 12 horas",
    options: [
      {
        id: "A",
        text: "Pressionar levemente os materiais com uma luva de procedimento para acomodá-los.",
        is_correct: false,
        justification:
          "Incorreto. A NR-32 proíbe expressamente reencapar agulhas e compactar resíduos perfurocortantes com as mãos ou pressão direta.",
      },
      {
        id: "B",
        text: "Substituir imediatamente o recipiente por um novo coletor fechado e devidamente identificado conforme norma.",
        is_correct: true,
        justification:
          "Correto. O descarte deve ser feito em recipiente rígido específico, substituído quando atingir 2/3 da capacidade ou o limite indicado.",
      },
      {
        id: "C",
        text: "Despejar o excedente de agulhas usadas numa caixa de papelão comum provisória.",
        is_correct: false,
        justification:
          "Incorreto. A NR-32 exige recipientes rígidos resistentes à punctura, estanqueidade e ruptura com identificação de risco biológico.",
      },
    ],
    risk_level: "Alto",
  },
  {
    scenario_id: "min-33-001",
    sector: "Mineração & Espaços Confinados",
    norm_reference: "NR-33 e NR-22",
    situation_description:
      "Inspeção técnica em galeria subterrânea de drenagem de rejeitos (profundidade de 8 metros). O detector multigás portátil acusa 18.5% de Oxigênio (O2) e presença de 15 ppm de Sulfeto de Hidrogênio (H2S).",
    environmental_conditions: "Umidade de 95%, temperatura elevada (34°C), pouca ventilação natural",
    human_factor_pressure: "A equipe de escavação está parada aguardando liberação do duto",
    options: [
      {
        id: "A",
        text: "Não emitir a Permissão de Entrada e Trabalho (PET), ventilar mecanicamente com insuflador forçado de ar até oxigênio atingir faixa segura (19.5% a 23%) e H2S zerar.",
        is_correct: true,
        justification:
          "Correto. A NR-33 proíbe terminantemente o ingresso em atmosfera IPVS ou deficiente em oxigênio (<19.5%). A ventilação contínua e a reavaliação são obrigatórias.",
      },
      {
        id: "B",
        text: "Liberar a entrada rápida de apenas um trabalhador experiente usando máscara com filtro químico comum de carvão ativado.",
        is_correct: false,
        justification:
          "Incorreto. Filtros químicos não fornecem oxigênio em atmosferas deficientes e o H2S pode causar colapso respiratório súbito.",
      },
      {
        id: "C",
        text: "Entrar sem vigia externo para agilizar a medição visual interna das rachaduras da galeria.",
        is_correct: false,
        justification:
          "Incorreto. A presença de vigia dedicado com sistema de comunicação e equipamento de resgate é requisito inegociável da NR-33.",
      },
    ],
    risk_level: "Crítico",
  },
  {
    scenario_id: "agro-31-001",
    sector: "Agronegócio",
    norm_reference: "NR-31",
    situation_description:
      "Aplicação de defensivos agrícolas via pulverizador tratorizado em lavoura de soja. O termômetro de campo registra 34°C ao meio-dia e velocidade do vento de 18 km/h. O operador está sem o respirador PFF2 pois queixa-se de calor intenso.",
    environmental_conditions: "Radiação solar intensa, temperatura de 34°C, deriva por vento",
    human_factor_pressure: "Necessidade de terminar o talhão antes da chuva prevista para o dia seguinte",
    options: [
      {
        id: "A",
        text: "Permitir a continuidade da aplicação com janelas da cabine abertas para amenizar a sensação térmica.",
        is_correct: false,
        justification:
          "Incorreto. Viola a NR-31. O operador fica exposto diretamente aos vapores tóxicos e à deriva dos produtos químicos.",
      },
      {
        id: "B",
        text: "Suspender imediatamente a pulverização devido ao vento e temperatura desfavoráveis, exigir o uso do EPI hidro-repelente com respirador e reprogramar para o início da manhã/final da tarde.",
        is_correct: true,
        justification:
          "Correto. A NR-31 estabelece limites meteorológicos para pulverização (evitando evaporação e deriva) e torna obrigatório o conjunto completo de EPIs homologados com CA.",
      },
      {
        id: "C",
        text: "Trocar o EPI completo por camisa de algodão de manga longa umedecida com água fresca.",
        is_correct: false,
        justification:
          "Incorreto. O tecido de algodão umedecido acelera a absorção dérmica de agrotóxicos perigosos, aumentando o risco de intoxicação aguda.",
      },
    ],
    risk_level: "Alto",
  },
  {
    scenario_id: "adm-17-015",
    sector: "Ambientes Administrativos",
    norm_reference: "NR-17",
    situation_description:
      "Analista de dados relata dor cervical aguda, formigamento nos membros superiores e rigidez nos punhos após 5 horas contínuas de digitação com monitor abaixo da linha dos olhos e cadeira sem apoio lombar ajustável.",
    environmental_conditions: "Ar-condicionado regulado em 18°C, luminosidade com reflexo em telas",
    human_factor_pressure: "Fechamento contábil trimestral com prazo fatal de entrega no mesmo dia",
    options: [
      {
        id: "A",
        text: "Continuar trabalhando ininterruptamente tomando analgésico por conta própria para não estourar o prazo do relatório.",
        is_correct: false,
        justification:
          "Incorreto. Viola a NR-17 quanto à organização do trabalho e ritmo de digitação. Mascarar dores osteomusculares com medicamentos agrava quadros de LER/DORT.",
      },
      {
        id: "B",
        text: "Acionar a pausa ativa ergonômica, regular a altura do monitor no nível dos olhos, ajustar os apoios da cadeira para ângulo de 90° nos cotovelos e joelhos e comunicar à CIPA/SESMT.",
        is_correct: true,
        justification:
          "Correto. Cumpre as diretrizes ergonômicas da NR-17 sobre postos de trabalho informatizados, alternância postural e pausas obrigatórias para descanso neuromuscular.",
      },
      {
        id: "C",
        text: "Colocar o laptop sobre o colo e continuar digitando recostado para relaxar as costas.",
        is_correct: false,
        justification:
          "Incorreto. O uso prolongado de notebooks sem suporte ergonômico e teclado/mouse periféricos sobrecarrega a coluna vertebral cervical e lombar.",
      },
    ],
    risk_level: "Moderado",
  },
];
