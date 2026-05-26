export type GameCategory = "sorte" | "conhecimento" | "marca";

export type Game = {
  slug: string;
  name: string;
  category: GameCategory;
  shortDescription: string;
  longDescription: string;
  priceFrom: string;
  mechanics: string[];
  idealFor: string[];
  customizationOptions: string[];
  averageDuration: string;
  seoKeywords: string[];
  whatsappMessage: string;
};

export const CATEGORY_LABELS: Record<GameCategory, string> = {
  sorte: "Sorte & Brindes",
  conhecimento: "Conhecimento",
  marca: "Agilidade & Marca",
};

export const games: Game[] = [
  {
    slug: "roleta-premiada",
    name: "Roleta",
    category: "sorte",
    shortDescription:
      "O clássico que sempre gera fila. Roleta personalizada com sua marca.",
    longDescription:
      "A Roleta Premiada é o jogo mais versátil do catálogo. Funciona em qualquer tipo de evento, gera fila instantânea e entrega aquela sensação satisfatória de ver a roda desacelerando antes de revelar o prêmio. A animação fluida e a personalização total fazem dela o ponto alto do stand.",
    priceFrom: "R$ 297",
    mechanics: [
      "Visitante toca para girar a roleta",
      "Animação de desaceleração realista (3-5 segundos)",
      "A fatia onde o ponteiro para define o prêmio",
      "Algoritmo respeita o estoque em tempo real — prêmios esgotados são automaticamente removidos",
    ],
    idealFor: [
      "Stands em feiras corporativas",
      "Ativações de varejo",
      "Eventos de patrocínio",
      "Lançamentos de produto",
    ],
    customizationOptions: [
      "Logo no centro da roleta",
      "Cor de cada fatia",
      "Número de fatias (4, 6 ou 8)",
      "Imagem ou texto em cada prêmio",
      "Probabilidades base por prêmio",
    ],
    averageDuration: "~15 segundos por jogada",
    seoKeywords: [
      "roleta digital para evento",
      "roleta premiada virtual",
      "totem com roleta para evento corporativo",
      "roleta personalizada com marca",
    ],
    whatsappMessage: "Olá! Tenho interesse na Roleta Premiada da TOUCH MIDIA.",
  },
  {
    slug: "raspadinha",
    name: "Raspadinha Virtual",
    category: "sorte",
    shortDescription:
      "Gesto tátil que viraliza. Raspe e descubra o prêmio na hora.",
    longDescription:
      "A Raspadinha Virtual transforma o gesto físico de raspar em uma experiência digital de alta sensação. O visitante usa o dedo para revelar o prêmio na tela, e o efeito visual é tão satisfatório quanto a versão de papel — só que sem desperdício, com captura de leads e gestão de estoque.",
    priceFrom: "R$ 297",
    mechanics: [
      "Visitante recebe um cartão virtual coberto",
      "Usa o dedo (ou cursor) para raspar a camada de cima",
      "À medida que raspa, o prêmio é revelado",
      "Captura de lead integrada antes ou depois da revelação",
    ],
    idealFor: [
      "Eventos com brinde garantido (todo mundo ganha algo)",
      "Ativações em shopping centers",
      "Promoções de fim de ano",
      "Lançamentos com forte componente surpresa",
    ],
    customizationOptions: [
      "Visual da camada que cobre (textura prateada, dourada, ou sua marca)",
      "Imagens dos prêmios revelados",
      "Cor de fundo do cartão",
      "Mensagem pós-revelação",
    ],
    averageDuration: "~10 segundos por jogada",
    seoKeywords: [
      "raspadinha virtual personalizada",
      "raspadinha digital para evento",
      "raspadinha online com marca",
    ],
    whatsappMessage:
      "Olá! Tenho interesse na Raspadinha Virtual da TOUCH MIDIA.",
  },
  {
    slug: "caca-niquel",
    name: "Caça-Níquel",
    category: "sorte",
    shortDescription:
      "Slot machine com nostalgia e animação satisfatória. Três reels e o alinhamento define tudo.",
    longDescription:
      "O Caça-Níquel digital traz a nostalgia da slot machine para o seu stand. Três rolos giram com timings ligeiramente diferentes, o som de cada um parando entrega tensão, e o alinhamento define o prêmio. Funciona melhor em eventos descontraídos onde o visitante quer aquela sensação de cassino sem culpa.",
    priceFrom: "R$ 397",
    mechanics: [
      "Visitante puxa a alavanca virtual (ou clica no botão)",
      "Três rolos giram independentes com paradas escalonadas",
      "Combinação dos símbolos define o prêmio",
      "Probabilidades configuráveis por combinação",
    ],
    idealFor: [
      "Eventos de varejo descontraídos",
      "Food festivals e ativações de bar",
      "Marcas com posicionamento jovem",
      "Confraternizações corporativas",
    ],
    customizationOptions: [
      "Símbolos dos rolos (logos, produtos, ícones da marca)",
      "Cores e visual do gabinete",
      "Combinações vencedoras",
      "Som de jackpot personalizado",
    ],
    averageDuration: "~12 segundos por jogada",
    seoKeywords: [
      "caça-níquel digital evento",
      "slot machine personalizada",
      "totem com slot machine",
    ],
    whatsappMessage: "Olá! Tenho interesse no Caça-Níquel da TOUCH MIDIA.",
  },
  {
    slug: "plinko",
    name: "Plinko",
    category: "sorte",
    shortDescription:
      "O jogo viral do TikTok. Bola cai por pinos com física real e define o prêmio.",
    longDescription:
      "O Plinko é o jogo mais viral do momento. A bola cai do topo e quica entre os pinos com física simulada, criando um caminho imprevisível até parar em um dos slots inferiores. Ideal para atrair público jovem e gerar conteúdo orgânico nas redes sociais — todo mundo quer filmar.",
    priceFrom: "R$ 397",
    mechanics: [
      "Visitante posiciona a bola no topo do tabuleiro",
      "Bola cai por gravidade simulada, quicando entre os pinos",
      "Caminho é imprevisível, gera tensão até o final",
      "Slot final define o prêmio",
    ],
    idealFor: [
      "Marcas jovens (gaming, streetwear, entretenimento)",
      "Eventos com perfil tech (CIAB, Web Summit, Campus Party)",
      "Ativações que precisam viralizar nas redes",
      "Públicos millennial e Gen Z",
    ],
    customizationOptions: [
      "Cores do tabuleiro e bola",
      "Imagens nos slots inferiores",
      "Logo no fundo do tabuleiro",
      "Densidade dos pinos (mais pinos = mais aleatoriedade)",
    ],
    averageDuration: "~8 segundos por jogada",
    seoKeywords: [
      "plinko digital evento",
      "jogo plinko personalizado",
      "totem plinko marca",
    ],
    whatsappMessage: "Olá! Tenho interesse no Plinko da TOUCH MIDIA.",
  },
  {
    slug: "caixa-misteriosa",
    name: "Pega Urso",
    category: "sorte",
    shortDescription:
      "N caixas, um prêmio em cada. Visitante escolhe e revela. Surpresa pura.",
    longDescription:
      "A Caixa Misteriosa é o jogo mais simples e mais barato do catálogo — e justamente por isso funciona em quase qualquer cenário. O visitante vê N caixas idênticas na tela, escolhe uma com o dedo, e a animação revela o prêmio dentro. Tensão alta, fila rápida, custo de produção baixo.",
    mechanics: [
      "N caixas idênticas aparecem na tela",
      "Visitante escolhe uma com toque",
      "Animação de abertura revela o prêmio",
      "Demais caixas mostram o que perdeu (opcional)",
    ],
    idealFor: [
      "Lançamentos de produto (quem é a surpresa?)",
      "Eventos com fluxo intenso e tempo curto",
      "Ativações de baixo orçamento",
      "Marcas que valorizam o elemento de mistério",
    ],
    customizationOptions: [
      "Visual e cor das caixas",
      "Quantidade de caixas (3, 6, 9, 12)",
      "Imagens dos prêmios dentro",
      "Animação de abertura",
    ],
    averageDuration: "~10 segundos por jogada",
    seoKeywords: [
      "caixa misteriosa digital",
      "mystery box virtual evento",
      "jogo de caixa surpresa",
    ],
    whatsappMessage:
      "Olá! Tenho interesse na Caixa Misteriosa da TOUCH MIDIA.",
    priceFrom: "R$ 247",
  },
  {
    slug: "quiz",
    name: "Quiz Múltipla Escolha",
    category: "conhecimento",
    shortDescription:
      "Educa o lead sobre seu produto enquanto coleta dados. Ideal para feiras técnicas.",
    longDescription:
      "O Quiz é o jogo perfeito para feiras técnicas (farmacêutica, agronegócio, finanças, saúde) onde a marca precisa transmitir conhecimento real durante a interação. O visitante responde de 5 a 10 perguntas, recebe pontuação ao final, e ao longo do caminho absorve mensagens-chave da marca. Engajamento alto, retenção de mensagem alta.",
    mechanics: [
      "5 a 10 perguntas configuráveis pela marca",
      "Cada pergunta com 3 ou 4 alternativas",
      "Tempo limite por pergunta (configurável)",
      "Pontuação final com ranking",
      "Feedback imediato (acerto/erro) por pergunta",
    ],
    idealFor: [
      "Feiras técnicas e setoriais",
      "Lançamentos com aprendizado complexo",
      "Treinamentos disfarçados de jogo",
      "Eventos B2B onde mensagem é central",
    ],
    customizationOptions: [
      "Banco completo de perguntas e alternativas",
      "Tema visual (cores, logo, tipografia)",
      "Mensagem de feedback por resposta",
      "Tempo limite por pergunta",
      "Critério de pontuação",
    ],
    averageDuration: "~60-90 segundos por jogada",
    seoKeywords: [
      "quiz interativo para feira",
      "quiz personalizado evento",
      "totem com quiz para empresa",
    ],
    priceFrom: "R$ 347",
    whatsappMessage:
      "Olá! Tenho interesse no Quiz Múltipla Escolha da TOUCH MIDIA.",
  },
  {
    slug: "flappy",
    name: "Flappy",
    category: "marca",
    shortDescription:
      "Desvie dos obstáculos no estilo Flappy Bird. Viciante, competitivo e perfeito para rankings em eventos.",
    longDescription:
      "O Flappy é um arcade viciante no estilo Flappy Bird: o visitante controla um personagem e desvia de obstáculos tocando na tela. Simples de entender em segundos, impossível de parar. Ideal para criar filas, rivalidade e compartilhamento orgânico — especialmente em eventos com público jovem.",
    mechanics: [
      "Controle por toque na tela",
      "Dificuldade cresce com a pontuação",
      "Ranking de pontos em tempo real",
      "Reinício instantâneo após game over",
    ],
    idealFor: [
      "Eventos com público jovem",
      "Stands com alta circulação",
      "Ativações competitivas com ranking",
      "Intervalos de conferências",
    ],
    customizationOptions: [
      "Personagem com identidade da marca",
      "Cores e tema visual",
      "Obstáculos personalizados",
      "Tela de game over com CTA",
    ],
    averageDuration: "~1 a 3 minutos por jogada",
    seoKeywords: [
      "flappy bird para eventos",
      "jogo arcade totem interativo",
      "game personalizado evento corporativo",
    ],
    priceFrom: "R$ 297",
    whatsappMessage:
      "Olá! Tenho interesse no Flappy da TOUCH MIDIA.",
  },
  {
    slug: "jogo-da-memoria",
    name: "Jogo da Memória",
    category: "conhecimento",
    shortDescription:
      "Cartas com sua marca e produtos. Saturação positiva de marca durante o jogo.",
    longDescription:
      "O Jogo da Memória é único no catálogo: durante todo o tempo de jogada, o visitante está olhando para a marca. Cada par de cartas pode ter um produto, um logo, uma cor da marca — e encontrar pares exige atenção repetida a cada um. Saturação positiva sem cansar.",
    mechanics: [
      "Grade de cartas viradas para baixo (12, 16 ou 20 cartas)",
      "Visitante vira duas cartas por vez",
      "Encontra pares idênticos para limpar a mesa",
      "Pontuação baseada em tempo e número de tentativas",
    ],
    idealFor: [
      "Marcas com produtos visualmente atraentes (cosméticos, alimentos, moda)",
      "Lançamentos de portfólio (mostrar todos os produtos)",
      "Eventos voltados a famílias",
      "Ativações com público mais geral",
    ],
    customizationOptions: [
      "Imagens em cada par de cartas (produtos, logos, mascotes)",
      "Verso das cartas",
      "Tamanho da grade",
      "Tempo limite (opcional)",
    ],
    averageDuration: "~60 segundos por jogada",
    seoKeywords: [
      "jogo da memória personalizado",
      "memória digital evento",
      "totem jogo da memória marca",
    ],
    priceFrom: "R$ 297",
    whatsappMessage:
      "Olá! Tenho interesse no Jogo da Memória da TOUCH MIDIA.",
  },
  {
    slug: "quebra-cabeca",
    name: "Quebra-Cabeça da Marca",
    category: "marca",
    shortDescription:
      "Visitante monta seu logo ou produto contra o relógio. Memória ativa de marca.",
    longDescription:
      "O Quebra-Cabeça da Marca pega uma imagem central da empresa — logo, produto, embalagem — e a divide em peças que o visitante deve remontar contra o relógio. O ato de reconstruir ativa memória muscular e visual. O visitante sai do stand com a marca literalmente montada na cabeça.",
    mechanics: [
      "Imagem é dividida em peças (4, 9 ou 16)",
      "Peças aparecem embaralhadas",
      "Visitante arrasta para posicionar",
      "Cronômetro corre durante a montagem",
      "Pontuação por tempo de conclusão",
    ],
    idealFor: [
      "Ativação puramente visual de marca",
      "Lançamentos de produto (ver o produto inteiro depois de montá-lo)",
      "Marcas com identidade visual forte",
      "Eventos onde branding é o objetivo principal",
    ],
    customizationOptions: [
      "Imagem a ser montada (logo, produto, ilustração)",
      "Número de peças",
      "Visual do contorno e fundo",
      "Tempo limite",
    ],
    averageDuration: "~45-90 segundos por jogada",
    seoKeywords: [
      "quebra-cabeça da marca",
      "puzzle digital evento",
      "jogo de montar logo",
    ],
    priceFrom: "R$ 297",
    whatsappMessage:
      "Olá! Tenho interesse no Quebra-Cabeça da Marca da TOUCH MIDIA.",
  },
  {
    slug: "cobranca-de-penalti",
    name: "Futebol",
    category: "marca",
    shortDescription:
      "Mira, força, chute. Pênalti digital com sua marca no campo e no banner do patrocinador.",
    longDescription:
      "Cobrança de Pênalti é o jogo perfeito para marcas com presença esportiva ou eventos com público apaixonado por futebol. O visitante mira a direção, ajusta a força, cobra o pênalti e torce contra o goleiro. Mecânica simples, recall altíssimo — todo mundo já cobrou um pênalti na vida — e altamente brandável: bola, gramado, trave e banner atrás do gol carregam sua identidade visual.",
    mechanics: [
      "Visitante arrasta o dedo para mirar (direção e altura)",
      "Solta para definir a força do chute",
      "Goleiro defende em direção aleatória ou com IA simples",
      "Pontuação cresce com gols consecutivos e ranking do dia",
    ],
    idealFor: [
      "Marcas patrocinadoras de times (cervejarias, bancos, telecoms)",
      "Eventos esportivos, fan zones e fan fests",
      "Ativações em estádios e arenas",
      "Lançamentos com público masculino jovem ou famílias",
    ],
    customizationOptions: [
      "Bola personalizada (logo, padrão da marca)",
      "Gramado e trave com cores da marca",
      "Banner de patrocinador atrás do gol",
      "Camisa do cobrador e do goleiro (uniforme do time patrocinado)",
      "Som de torcida e narração customizáveis",
    ],
    averageDuration: "~12 segundos por jogada",
    seoKeywords: [
      "jogo de pênalti digital",
      "totem futebol evento",
      "ativação esportiva digital",
      "pênalti virtual personalizado",
      "jogo de chute a gol para evento",
    ],
    priceFrom: "R$ 447",
    whatsappMessage:
      "Olá! Tenho interesse na Cobrança de Pênalti da TOUCH MIDIA.",
  },
  {
    slug: "bate-toupeira",
    name: "Bate-Toupeira",
    category: "marca",
    shortDescription:
      "Toca rápido, marca ponto. Mecânica universal que vicia em segundos — totalmente customizável.",
    longDescription:
      "O Bate-Toupeira é mecânica universal: todo mundo entende em 2 segundos. Itens saltam de buracos, jogador toca pra acertar antes que voltem. A simplicidade é o que faz funcionar — sem tutorial, sem aprendizado, instantâneo. O grande trunfo é narrativo: trocamos a toupeira por qualquer coisa que sua marca queira atacar (problema, concorrente, mito do mercado) ou capturar (produto, mascote, oferta).",
    mechanics: [
      "Itens saltam de buracos em ritmo crescente",
      "Visitante toca para acertar antes de o item voltar",
      "Combos consecutivos multiplicam pontuação",
      "Itens negativos opcionais penalizam (errar = perder ponto)",
      "Round dura ~30 segundos com aceleração progressiva",
    ],
    idealFor: [
      "Marcas com mensagem de combate (problema → solução)",
      "Lançamentos de campanha com humor",
      "Eventos de varejo com público jovem",
      "Ativações que precisam viralizar (gameplay frenético é compartilhável)",
    ],
    customizationOptions: [
      "Sprite do item que sai do buraco (produto, mascote, ícone)",
      "Sprite do item negativo (concorrente, problema)",
      "Cenário e fundo com identidade visual",
      "Velocidade base e curva de progressão",
      "Mensagem de fim de round",
    ],
    averageDuration: "~30 segundos por jogada",
    seoKeywords: [
      "bate-toupeira digital",
      "whac-a-mole personalizado evento",
      "jogo de tocar rápido marca",
      "totem ação rápida evento",
    ],
    priceFrom: "R$ 297",
    whatsappMessage: "Olá! Tenho interesse no Bate-Toupeira da TOUCH MIDIA.",
  },
  {
    slug: "pegue-os-itens",
    name: "Pegue os Itens",
    category: "marca",
    shortDescription:
      "Itens caem da tela e o jogador pega. Estilo Fruit Ninja com produtos da sua marca.",
    longDescription:
      "Pegue os Itens é o jogo premium do catálogo. Inspirado em Fruit Ninja, transforma os produtos da marca em alvos que caem da tela, e o visitante usa gestos rápidos para capturá-los enquanto evita itens-bomba. Mecânica viciante, perfeita para eventos jovens e marcas que querem entrega visual de impacto.",
    mechanics: [
      "Itens caem do topo da tela em padrão crescente",
      "Visitante usa gestos para 'pegar' os itens",
      "Pontuação cresce com itens corretos",
      "Itens-bomba penalizam (ou tiram tempo)",
      "Round dura ~30 segundos",
    ],
    idealFor: [
      "Marcas jovens e modernas",
      "Lançamentos com itens icônicos",
      "Eventos esportivos e fitness",
      "Ativações com público Gen Z",
    ],
    customizationOptions: [
      "Sprites dos itens caindo (produtos da marca)",
      "Sprites dos itens-bomba",
      "Velocidade e densidade de spawn",
      "Background do jogo",
      "Música tema",
    ],
    averageDuration: "~30 segundos por jogada",
    seoKeywords: [
      "jogo de pegar itens evento",
      "fruit ninja personalizado marca",
      "jogo de gestos para evento",
    ],
    priceFrom: "R$ 497",
    whatsappMessage:
      "Olá! Tenho interesse no Pegue os Itens da TOUCH MIDIA.",
  },
];

export function getGameBySlug(slug: string): Game | undefined {
  return games.find((g) => g.slug === slug);
}

export function getGamesByCategory(category: GameCategory): Game[] {
  return games.filter((g) => g.category === category);
}
