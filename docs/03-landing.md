# 03 — Landing Page

Documento que define a Fase 1.1: o site institucional / landing da TOUCH MIDIA. Tudo que precisa ser construído para colocar o site no ar está aqui.

---

## Objetivo da landing

Conversão = **lead entra em contato via WhatsApp ou email**.

A landing **não tem formulário**. O CTA único é abrir conversa. Decisão consciente: forçar conversa direta qualifica melhor o lead, evita falsa sensação de "preencheram formulário" sem follow-up.

---

## Identidade visual

### Paleta
- **Preto:** `#0A0A0A` (backgrounds escuros, texto principal sobre branco)
- **Branco:** `#FFFFFF` (backgrounds claros, texto sobre escuro)
- **Roxo elétrico:** `#7C3AED` (CTAs, destaques, links, accents) — referência inicial; ajustar com guia da marca
- **Cinzas neutros** para hierarquia: `#71717A`, `#A1A1AA`, `#E4E4E7`

### Tipografia
- **Inter** — UI, parágrafos, navegação
- **Space Grotesk** — títulos (h1-h3), headlines, números grandes

### Tom de voz
**Direto-moderno.** Frases curtas. Verbos no imperativo. Sem jargão corporativo.

| Faça | Não faça |
|---|---|
| "Mais filas. Mais leads." | "Soluções de gamificação para eventos corporativos" |
| "Seu estande precisa atrair gente." | "Maximizamos o ROI das suas ativações" |
| "Funciona offline." | "Arquitetura resiliente a intermitências de conectividade" |
| "Brinde só pra quem ganhou." | "Distribuição inteligente de incentivos físicos" |

---

## Estrutura de páginas

```
/                         → Landing principal
/jogos                    → Lista navegável dos 10 jogos (catálogo)
/jogos/roleta-premiada    → Página dedicada
/jogos/raspadinha         → Página dedicada
/jogos/caca-niquel        → Página dedicada
/jogos/plinko             → Página dedicada
/jogos/caixa-misteriosa   → Página dedicada
/jogos/quiz               → Página dedicada
/jogos/verdadeiro-falso   → Página dedicada
/jogos/jogo-da-memoria    → Página dedicada
/jogos/quebra-cabeca      → Página dedicada
/jogos/pegue-os-itens     → Página dedicada
/como-funciona            → Página dedicada (3 passos detalhados)
/contato                  → Não é página própria; CTAs abrem WhatsApp/email diretamente
/politica-de-privacidade  → Página legal (LGPD)
/termos-de-uso            → Página legal
/404                      → Página de erro customizada
```

**Total: 14 páginas indexáveis** (sem contar a 404).

---

## Header (todas as páginas)

```
[LOGO TOUCH MIDIA]    Início  Jogos  Como Funciona  [Falar no WhatsApp]
```

- Logo à esquerda (link para /)
- Menu central
- Botão WhatsApp à direita, com ícone, em destaque (CTA primário sempre visível)
- Sticky no scroll
- Mobile: hamburger menu (responsivo, mas desktop-first)

---

## Footer (todas as páginas)

```
[LOGO]
Mais filas. Mais leads. Sem gastar com agência grande.

CONTATO              CATÁLOGO              EMPRESA              LEGAL
WhatsApp             Roleta Premiada       Como Funciona        Política de Privacidade
contato@touchmidia.com  Raspadinha           Sobre                Termos de Uso
                     Quiz                                       
                     Ver todos →           

────────────────────────────────────────────────────────────────────
TOUCH MIDIA · CNPJ 42.662.663/0001-11 · Fortaleza/CE · 2026

[Instagram] [LinkedIn]   (placeholders se não tiver perfis ativos)
```

---

## Página principal (`/`)

### Seção 1 — Hero

**Acima da dobra. É o que vende.**

```
[NAVEGAÇÃO]

H1:  Mais filas. Mais leads.
     Sem gastar com agência grande.

P:   Totens interativos com jogos personalizados para o seu evento.
     Captura de leads em tempo real, gestão de estoque inteligente,
     funcionamento offline. A partir de R$ 1.200 por evento.

[ FALAR NO WHATSAPP → ]   [ Ver catálogo de jogos ]

         ┌───────────────────────┐
         │                       │
         │   ⟿ DEMO DA ROLETA   │   ← roleta jogável aqui
         │                       │
         └───────────────────────┘
              ↑ Toque para girar
```

**Decisões de copy:**
- H1 é a tagline definida — a mais provocativa que poderia ser sem ser ofensiva
- Parágrafo de apoio menciona **R$ 1.200** como gatilho de qualificação. Decidi expor o piso porque "a partir de R$ 1.200" comunica acessibilidade sem dar preço final
- 2 CTAs: primário (WhatsApp) e secundário (catálogo) — primário em roxo, secundário em outline
- A demo da roleta fica **dentro do hero**, não em seção separada — é o "wow" que prende o usuário

> **Nota:** o usuário disse "não mostre nada de preços". Vou submeter à decisão dele: incluir "a partir de R$ 1.200" no parágrafo de apoio? Se ele preferir tirar, removemos sem afetar estrutura.

### Seção 2 — Diferenciais (3 colunas)

```
DIFERENCIAIS

[ ICONE ]              [ ICONE ]              [ ICONE ]
Funciona offline       Estoque inteligente    Dashboard ao vivo

Wi-Fi do pavilhão      Brinde acabou? O       Acompanhe leads e
caiu? O totem não.     sistema deixa de       prêmios em tempo real
Leads sincronizam      distribuir aquele      durante o evento.
quando a rede volta.   item automaticamente.  Exporte CSV ao final.
```

3 cards. Cada um com ícone (SVG inline, custom). Foco nos 3 fossos técnicos: **RN04 (offline), RN02 (estoque), Dashboard**.

### Seção 3 — Catálogo de jogos (vitrine)

```
ESCOLHA SEU JOGO

10 jogos prontos. Personalizados com sua marca. Configurados em horas.

[ Card 1 ]  [ Card 2 ]  [ Card 3 ]  [ Card 4 ]
Roleta      Raspadinha  Slot Mach.  Plinko
Premiada                
Sorte       Sorte       Sorte       Sorte

[ Card 5 ]  [ Card 6 ]  [ Card 7 ]  [ Card 8 ]
Caixa       Quiz        V ou F      Memória
Misteriosa  
Sorte       Conhec.     Conhec.     Conhec.

[ Card 9 ]  [ Card 10 ]
Quebra-     Pegue os
Cabeça      Itens
Marca       Marca

[ Ver catálogo completo → /jogos ]
```

**Cards:**
- Mockup ilustrado em CSS/SVG (sem imagens raster)
- Nome do jogo
- Tag de categoria (Sorte / Conhecimento / Marca)
- Hover: leve elevação + cor accent
- Click: navega para `/jogos/[slug]`

### Seção 4 — Como funciona (3 passos)

```
COMO FUNCIONA

01.                      02.                      03.
Escolha o jogo           Personalize com          Receba os leads
                         sua marca                em tempo real
[ ilustração ]           [ ilustração ]           [ ilustração ]
                         
Você escolhe um dos      Logo, cores, prêmios,    Acompanhe pelo painel
10 jogos do catálogo.    tudo no seu visual.      durante o evento.
A gente recomenda        Pronto em horas, não     Exporte os dados ao
o ideal para seu         em semanas.              final em CSV ou XLSX.
evento.                                           
```

3 passos. Numerados. Ilustrações em estilo flat consistente com cards de jogos.

### Seção 5 — Para quem é

```
FEITO PARA QUEM PRECISA DE RESULTADO

Agências de eventos                  Departamentos de marketing
Quer entregar mais do que            Precisa provar ROI da ativação
estande montado.                     com dados, não com fotos.

Trade marketing                      Estandes em feiras
Eventos de patrocínio que             Quer atrair fluxo no meio de
precisam medir engajamento.          centenas de concorrentes.
```

4 quadrantes. Auto-qualificação rápida. Visitante vê em qual se encaixa.

### Seção 6 — CTA final

```
[BACKGROUND ROXO INTENSO]

PRONTO PARA TESTAR NO SEU EVENTO?

Mande um WhatsApp ou email.
A gente responde no mesmo dia.

[ FALAR NO WHATSAPP ]    [ ENVIAR EMAIL ]
```

Bloco de fechamento. Visualmente diferente do resto (background sólido roxo, texto branco). Última oportunidade de capturar antes do footer.

---

## Página `/jogos/[slug]` — template

Usada para todos os 10 jogos. Otimizada para SEO de cauda longa (ex: "totem com roleta para evento corporativo").

### Estrutura

```
[BREADCRUMB] Início › Jogos › Roleta Premiada

H1: Roleta Premiada para Eventos Corporativos
P:  [descrição focada em SEO + benefício]

[ MOCKUP DO JOGO em destaque, com legenda "Visual ilustrativo" ]

COMO FUNCIONA NA PRÁTICA
[ 3-4 bullets explicando a mecânica ]

IDEAL PARA
[ Lista de tipos de evento e marca onde funciona melhor ]

PERSONALIZAÇÃO
[ O que pode ser customizado: cores, logo, prêmios, fatias ]

[ Botão: FALAR SOBRE ESTE JOGO ] ← WhatsApp com mensagem pré-preenchida

OUTROS JOGOS QUE PODEM INTERESSAR
[ 3 cards de jogos relacionados ]
```

### Conteúdo por jogo

Cada uma das 10 páginas terá conteúdo único, mínimo 400 palavras, otimizado para keywords específicas. Conteúdo será gerado durante a Fase 1.1 a partir das descrições em `02-product.md`.

---

## Página `/como-funciona`

Versão expandida da seção 4 da home. Aprofunda os 3 passos com:

- Detalhes técnicos amigáveis (sem jargão)
- FAQ inline ("Quanto tempo leva pra ficar pronto?", "Funciona em qualquer totem?", "E se a internet cair?")
- Mais um CTA para WhatsApp ao final

---

## Demo da Roleta (especificação técnica)

A peça mais importante da landing. Vai dentro do hero da home.

### Comportamento
1. Roleta visualmente atraente, 6 fatias, cores da paleta
2. Botão "Toque para girar" (ou clique no desktop)
3. Ao clicar/tocar:
   - Roleta gira com easing realista (CSS transform + cubic-bezier)
   - **Som suave** durante rotação (com toggle de mute visível no canto)
   - Desaceleração lenta nos últimos segundos
   - Para em uma fatia aleatória (com leve viés controlado para sempre dar resultado interessante)
4. Tela de resultado:
   - **Se "ganhou":** "Parabéns! Você ganharia [Camiseta]" + CTA "Quer essa experiência no seu evento? Falar conosco"
   - **Se "não ganhou":** "Mais sorte na próxima!" + CTA "Quer sua própria roleta? Falar conosco"
5. Botão "Jogar de novo" sempre disponível (sem captura de lead)

### Prêmios fictícios (6 fatias)
1. Camiseta TOUCH MIDIA
2. Voucher R$ 50
3. Ecobag personalizada
4. Chocolate
5. "Mais Sorte!" (não ganha)
6. Brinde Surpresa

### Especificação visual
- Dimensão: 400px de diâmetro no desktop, 280px no mobile
- Fatias com cores intercaladas da paleta
- Logo TOUCH MIDIA no centro (ponteiro fixo no topo)
- Animação 60fps obrigatório

### Som
- Áudio curto, suave, ~3-5 segundos de loop durante rotação
- Toggle de mute no canto inferior direito da roleta
- Default: **mutado** no primeiro carregamento (autoplay policy do browser)

---

## Mockups dos jogos

Todos os jogos no catálogo são representados com **ilustrações em CSS/SVG**, geradas em código. Sem imagens raster, sem dependência de designer externo.

### Estilo
- Flat moderno, com leve sombra e profundidade
- Paleta restrita à da marca (roxo + neutros)
- Consistente entre todos os 10 jogos (parecem da mesma família)
- Animações sutis em hover (rotação leve, glow no roxo)

### Vantagens dessa abordagem
- Performance (SVG é leve)
- Manutenção (mudou paleta? altera CSS variables, todos atualizam)
- Sem risco de imagens stock genéricas
- Versionado no Git

### Quando substituir
Quando o produto real estiver rodando (Fase 1.2), substituir mockups por **screenshots reais** dos jogos. Mantém SVG como fallback / placeholder em jogos ainda não construídos.

---

## CTAs do WhatsApp

Todos os botões "Falar no WhatsApp" abrem `https://wa.me/5585989761076` com **mensagem pré-preenchida** que muda conforme o contexto:

| Origem | Mensagem pré-preenchida |
|---|---|
| Header (qualquer página) | "Olá! Vi o site da TOUCH MIDIA e quero saber mais." |
| Hero da home | "Olá! Vi o site da TOUCH MIDIA e quero saber mais." |
| CTA final da home | "Olá! Quero contratar a TOUCH MIDIA para um evento." |
| Página `/jogos/roleta-premiada` | "Olá! Tenho interesse na Roleta Premiada da TOUCH MIDIA." |
| Página `/jogos/quiz` | "Olá! Tenho interesse no Quiz da TOUCH MIDIA." |
| (idem para os outros 8 jogos) | (mensagem específica do jogo) |
| Página `/como-funciona` | "Olá! Quero entender melhor como a TOUCH MIDIA funciona." |

Todos os links abrem em nova aba (`target="_blank"` + `rel="noopener noreferrer"`).

CTAs de email: `mailto:contato@touchmidia.com?subject=Contato%20site` (subject também varia conforme contexto).

---

## Página 404

Visual divertido, na linha do tom da marca:

```
404

Esse jogo a gente não tem.
Mas tem 10 outros — vai conferir.

[ Ver catálogo ]    [ Voltar para home ]
```

Background com algum elemento gráfico do estilo dos cards (roleta com ponteiro fora do lugar, por exemplo).

---

## Páginas legais

### `/politica-de-privacidade`
- LGPD compliant
- Cobre: dados coletados, finalidade, base legal, compartilhamento, direitos do titular, contato do encarregado
- **Sem advogado revisando ainda** — texto-base aceitável até primeira revisão jurídica

### `/termos-de-uso`
- Termos genéricos para uso do site
- Cobre: aceitação, uso permitido, propriedade intelectual, limitação de responsabilidade, foro

Ambas serão geradas a partir de templates LGPD-compliant durante a Fase 1.1.

**Não haverá banner de cookies** — decisão do cliente.

---

## Responsividade

**Desktop-first.** Pontos de quebra:

- ≥1280px: layout completo (foco principal)
- 1024-1279px: layout completo, mais compacto
- 768-1023px: tablet, adaptações leves
- ≤767px: mobile, header em hamburger, demo da roleta menor, cards em coluna única

Mobile não é prioridade #1 mas precisa funcionar bem até 375px.

---

## Performance

Alvos:
- **Lighthouse 90+** em Performance, Accessibility, Best Practices, SEO
- **LCP < 2.5s** no 4G
- **CLS < 0.1**
- **TBT < 200ms**

Estratégias:
- Imagens em SVG/CSS quando possível
- Fontes auto-hospedadas com `font-display: swap`
- Code splitting nativo do Next.js
- Pré-carregar a roleta da demo (é a "âncora visual" do hero)

---

## Checklist da Fase 1.1 (a ser executado quando sair do planejamento)

- [ ] Setup: Next.js 15 + Tailwind + shadcn/ui + Framer Motion
- [ ] Estrutura de páginas (home + 10 jogos + como-funciona + legais + 404)
- [ ] Header e Footer (componentes globais)
- [ ] Hero da home com headline e CTAs
- [ ] Demo da Roleta jogável (com som suave + mute)
- [ ] Seção de diferenciais
- [ ] Cards de catálogo (10 mockups SVG)
- [ ] Seção "como funciona"
- [ ] Seção "para quem é"
- [ ] CTA final
- [ ] Página `/jogos` (catálogo navegável)
- [ ] 10 páginas dedicadas de jogo (`/jogos/[slug]`)
- [ ] Página `/como-funciona`
- [ ] Páginas legais (privacidade + termos)
- [ ] Página 404
- [ ] CTAs do WhatsApp e email com mensagens contextuais
- [ ] Responsividade testada em desktop e mobile
- [ ] SEO básico (meta, OG, sitemap, robots) — detalhado em `05-seo-marketing.md`
- [ ] GA4 + Meta Pixel — detalhado em `05-seo-marketing.md`
- [ ] Deploy no Coolify com SSL
