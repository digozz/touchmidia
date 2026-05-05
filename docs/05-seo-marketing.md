# 05 — SEO e Marketing

Documento que define a estratégia de SEO, analytics e tracking da Fase 1.1. Objetivo: capturar busca orgânica para keywords de intenção comercial em torno de **interatividade touch screen para eventos**.

---

## Objetivo de SEO

**Capturar a intenção** de quem busca soluções com totem touch interativo para eventos no Brasil.

A landing precisa ranquear para queries de cauda longa do tipo:
- "totem touch screen para evento"
- "jogo interativo para feira"
- "roleta digital para ativação"
- "captura de leads em evento"
- "totem com quiz para evento corporativo"

A estratégia central: cada um dos 10 jogos vira **uma página dedicada**, otimizada para keyword específica desse jogo. Total de 14 páginas indexáveis dão massa de conteúdo suficiente para SEO.

---

## Palavras-chave alvo

### Principais (head terms)
| Keyword | Intenção | Volume estimado | Página alvo |
|---|---|---|---|
| totem interativo evento | Comercial | Médio | `/` (home) |
| totem touch screen | Informacional → Comercial | Alto | `/jogos` |
| gamificação evento corporativo | Comercial | Médio | `/` |
| tela touch screen | Informacional | Alto | `/como-funciona` |
| jogo interativo | Informacional | Alto | `/jogos` |

### Cauda longa (long-tail) — uma por página de jogo
| Keyword | Página alvo |
|---|---|
| roleta premiada digital para evento | `/jogos/roleta-premiada` |
| raspadinha virtual personalizada | `/jogos/raspadinha` |
| caça-níquel digital para ativação | `/jogos/caca-niquel` |
| plinko digital para evento | `/jogos/plinko` |
| caixa misteriosa digital | `/jogos/caixa-misteriosa` |
| quiz interativo para feira | `/jogos/quiz` |
| verdadeiro ou falso interativo | `/jogos/verdadeiro-falso` |
| jogo da memória personalizado | `/jogos/jogo-da-memoria` |
| quebra-cabeça da marca | `/jogos/quebra-cabeca` |
| jogo de pegar itens para evento | `/jogos/pegue-os-itens` |

### Modificadores geográficos
Considerando que o cliente está no Ceará, vale incluir variações com:
- "Fortaleza"
- "Nordeste"
- "Brasil"

Nas meta descriptions e em pelo menos uma frase do corpo do texto. **Não** abusar — pode parecer keyword stuffing.

### Termos de intenção transacional
Em CTAs e meta descriptions:
- "contratar"
- "preço"
- "orçamento"
- "alugar" (mesmo não fazendo locação ainda — quem busca isso pode ser cliente)
- "personalizado"

---

## Meta Tags por Página

### Padrão para todas as páginas

```html
<title>{Page Title} | TOUCH MIDIA</title>
<meta name="description" content="{descrição única, 150-160 chars}" />
<link rel="canonical" href="https://touchmidia.com{path}" />

<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:title" content="{título OG}" />
<meta property="og:description" content="{descrição OG}" />
<meta property="og:image" content="https://touchmidia.com/og/{slug}.png" />
<meta property="og:url" content="https://touchmidia.com{path}" />
<meta property="og:locale" content="pt_BR" />
<meta property="og:site_name" content="TOUCH MIDIA" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{título}" />
<meta name="twitter:description" content="{descrição}" />
<meta name="twitter:image" content="https://touchmidia.com/og/{slug}.png" />
```

### Por página

| Página | Title | Description (~155 chars) |
|---|---|---|
| `/` | TOUCH MIDIA \| Totens Interativos com Jogos para Eventos | Mais filas, mais leads. Totens com jogos personalizados para o seu evento. Roleta, quiz, raspadinha e outros 7 jogos. A partir de R$ 1.200. |
| `/jogos` | Catálogo de Jogos para Eventos \| TOUCH MIDIA | 10 jogos prontos para personalizar com sua marca: roleta, raspadinha, quiz, plinko e mais. Captura de leads em tempo real. |
| `/jogos/roleta-premiada` | Roleta Premiada para Eventos \| TOUCH MIDIA | Roleta digital personalizada com sua marca. Distribui prêmios com gestão inteligente de estoque. Funciona offline. |
| `/jogos/raspadinha` | Raspadinha Virtual Personalizada \| TOUCH MIDIA | Raspadinha digital com a sua marca. Gesto tátil, alto engajamento, integração com captura de leads. |
| `/jogos/caca-niquel` | Caça-Níquel Digital para Ativação \| TOUCH MIDIA | Slot machine personalizada com a sua marca. Animação fluida e nostalgia que gera fila no estande. |
| `/jogos/plinko` | Plinko Digital para Evento \| TOUCH MIDIA | O jogo viral do TikTok agora no seu estande. Bola cai por pinos com física real e define o prêmio. |
| `/jogos/caixa-misteriosa` | Caixa Misteriosa Digital \| TOUCH MIDIA | Visitante escolhe uma caixa, descobre o prêmio. Visual personalizado com a sua marca. Alto custo-benefício. |
| `/jogos/quiz` | Quiz Interativo para Feira \| TOUCH MIDIA | Quiz personalizado para educar o lead sobre seu produto enquanto coleta dados. Ideal para feiras técnicas. |
| `/jogos/verdadeiro-falso` | Verdadeiro ou Falso Interativo \| TOUCH MIDIA | Rounds curtos de 30 segundos. Alto throughput de leads em eventos com fluxo intenso. |
| `/jogos/jogo-da-memoria` | Jogo da Memória Personalizado \| TOUCH MIDIA | Cartas com a sua marca e produtos. Saturação positiva de marca durante o jogo. |
| `/jogos/quebra-cabeca` | Quebra-Cabeça da Marca \| TOUCH MIDIA | Visitante monta o seu logo ou produto contra o relógio. Memória ativa e engajamento alto. |
| `/jogos/pegue-os-itens` | Jogo de Pegar Itens para Evento \| TOUCH MIDIA | Itens caem da tela e o jogador pega. Estilo Fruit Ninja com os produtos da sua marca. |
| `/como-funciona` | Como Funciona \| TOUCH MIDIA | Em 3 passos: escolha o jogo, personalize com sua marca, receba os leads em tempo real. |
| `/politica-de-privacidade` | Política de Privacidade \| TOUCH MIDIA | Como tratamos seus dados em conformidade com a LGPD. |
| `/termos-de-uso` | Termos de Uso \| TOUCH MIDIA | Termos e condições de uso do site. |

Implementação: usar `generateMetadata` do Next.js (App Router) por página.

---

## Sitemap

### `/sitemap.xml` (gerado dinamicamente)

```typescript
// src/app/sitemap.ts (esboço)

import { games } from '@/content/games'

export default function sitemap() {
  const baseUrl = 'https://touchmidia.com'
  const lastModified = new Date()

  const staticPages = [
    { url: baseUrl, priority: 1.0 },
    { url: `${baseUrl}/jogos`, priority: 0.9 },
    { url: `${baseUrl}/como-funciona`, priority: 0.8 },
    { url: `${baseUrl}/politica-de-privacidade`, priority: 0.3 },
    { url: `${baseUrl}/termos-de-uso`, priority: 0.3 },
  ]

  const gamePages = games.map((game) => ({
    url: `${baseUrl}/jogos/${game.slug}`,
    priority: 0.8,
  }))

  return [...staticPages, ...gamePages].map((page) => ({
    ...page,
    lastModified,
    changeFrequency: 'weekly' as const,
  }))
}
```

### `/robots.txt`

```
User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://touchmidia.com/sitemap.xml
```

Sem `/api/` no início mas já bloqueado para fases futuras.

---

## Schema.org (Structured Data)

Adicionar JSON-LD em todas as páginas relevantes para enriquecer aparição em SERPs.

### Em todas as páginas (`Organization`)
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "TOUCH MIDIA",
  "url": "https://touchmidia.com",
  "logo": "https://touchmidia.com/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+55-85-98976-1076",
    "contactType": "Sales",
    "areaServed": "BR",
    "availableLanguage": "Portuguese"
  },
  "sameAs": []
}
```

### Em páginas de jogo (`Service` ou `Product`)
```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Totem interativo com jogo de {Nome do Jogo}",
  "provider": {
    "@type": "Organization",
    "name": "TOUCH MIDIA"
  },
  "areaServed": "BR",
  "description": "{descrição do jogo}",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "BRL",
    "priceSpecification": {
      "@type": "PriceSpecification",
      "minPrice": 1200
    }
  }
}
```

### Na home — `BreadcrumbList`, `WebSite`, `SearchAction`
Marcação útil para Google entender a hierarquia.

---

## Open Graph Images

Estratégia: imagens OG **geradas automaticamente** por página usando o `next/og` (ImageResponse API).

```typescript
// src/app/jogos/[slug]/opengraph-image.tsx (esboço)

import { ImageResponse } from 'next/og'
import { games } from '@/content/games'

export default function Image({ params }: { params: { slug: string } }) {
  const game = games.find((g) => g.slug === params.slug)
  
  return new ImageResponse(
    (
      <div style={{ /* layout com nome do jogo, paleta TOUCH MIDIA */ }}>
        {game?.name}
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
```

Vantagens:
- Toda página tem OG personalizada sem trabalho de design
- Atualiza automaticamente quando o conteúdo muda
- Ranking visual coerente em redes sociais

---

## Google Analytics 4 (GA4)

### Setup
1. Criar propriedade GA4 (ID começa com `G-`)
2. Inserir ID na env `NEXT_PUBLIC_GA_ID`
3. Componente `<GoogleAnalytics />` em `app/layout.tsx`
4. Carregar script com `next/script` strategy `afterInteractive`

### Eventos a rastrear
| Evento | Quando dispara | Parâmetros |
|---|---|---|
| `page_view` | Mudança de página (automático) | path |
| `whatsapp_click` | Click em qualquer CTA WhatsApp | source (header / hero / cta_final / page_jogo_X) |
| `email_click` | Click em qualquer CTA email | source |
| `roleta_spin` | Usuário gira a roleta da demo | result (prêmio sorteado) |
| `roleta_replay` | Usuário joga de novo | spin_count |
| `game_card_click` | Click em card do catálogo | game_slug |
| `scroll_depth` | Marcos de 25%, 50%, 75%, 100% | depth |

### Metas a configurar no GA4
- **Conversão primária:** `whatsapp_click`
- **Conversão secundária:** `email_click`
- **Engajamento:** `roleta_spin` (>2 vezes na sessão)

---

## Meta Pixel (Facebook / Instagram Ads)

### Setup
1. Criar Pixel no Business Manager
2. ID na env `NEXT_PUBLIC_META_PIXEL_ID`
3. Componente `<MetaPixel />` em `app/layout.tsx`
4. Carregar via `next/script`

### Eventos a rastrear
| Evento padrão Meta | Disparo |
|---|---|
| `PageView` | Toda navegação (automático) |
| `ViewContent` | Visita página de jogo (`content_name` = nome do jogo) |
| `Contact` | Click em WhatsApp ou email |
| `Lead` | (será usado quando tivermos formulário, Fase 1.2) |

### Configurações importantes
- **Modo de correspondência avançada:** desativado por enquanto (sem dados de usuário)
- **Conversões prioritárias:** `Contact` (CTA do WhatsApp/email)
- **Domain Verification:** verificar `touchmidia.com` no Business Manager (importante para iOS 14+)

---

## Estratégia de conteúdo (pós-lançamento)

Não faz parte da Fase 1.1, mas vale registrar para depois.

### Blog (Fase 2 ou 3)
Pasta `/blog` com artigos otimizados para SEO informacional:
- "Como gerar leads em feiras corporativas (guia 2026)"
- "Roleta digital vs roleta física: qual escolher?"
- "Como medir ROI de ativação em evento"
- "Checklist do estande perfeito"

### Cases (quando houver)
Pasta `/cases` com histórias de clientes reais. Hoje **não temos permissão** para usar nomes reais. Quando tivermos, criar um por cliente.

### Newsletter
Captura de email para receber dicas. Não está em escopo agora; pode entrar quando blog existir.

---

## Performance e Core Web Vitals

SEO moderno depende de Core Web Vitals. Alvos da Fase 1.1:

| Métrica | Alvo | Como atingir |
|---|---|---|
| **LCP** (Largest Contentful Paint) | < 2.5s | Otimizar hero (imagem hero é a roleta SVG, leve) |
| **FID/INP** (Input Delay) | < 200ms | JS mínimo, code splitting do Next |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Reservar dimensões de mockups e imagens |
| **TBT** (Total Blocking Time) | < 200ms | Não bloquear thread principal com animações pesadas |

Ferramentas para medir:
- Lighthouse (Chrome DevTools)
- PageSpeed Insights (Google)
- WebPageTest (validação independente)

Auditoria em build CI (Coolify) — não bloqueante na Fase 1.1, mas relatório é útil.

---

## Acessibilidade

Acessibilidade é critério de SEO moderno (Google considera). Alvos:

- **Lighthouse Accessibility ≥ 95**
- Contraste de cor AA mínimo (WCAG 2.1)
- Navegação por teclado funcional
- `alt` em todas as imagens (mesmo SVG decorativos com `aria-hidden`)
- Estrutura semântica (`<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`)
- Hierarquia de heading correta (um `h1` por página)
- Foco visível em elementos interativos

A demo da roleta deve funcionar via teclado (Enter/Space para girar) e ter `aria-live` para anunciar resultado.

---

## Métricas de sucesso (primeiros 90 dias pós-lançamento)

Sem deadline rígido, mas é útil ter números-alvo:

| Métrica | Alvo 30 dias | Alvo 90 dias |
|---|---|---|
| Visitantes únicos / mês | 200 | 1.000 |
| Posições top-10 no Google | 5 keywords | 15 keywords |
| Conversões (WhatsApp + email) | 5 | 30 |
| Lighthouse Performance | ≥ 90 | ≥ 90 |

Estes números pressupõem **algum tráfego pago** (Meta Ads, Google Ads). Sem ads, multiplique tempo por 3-4.
