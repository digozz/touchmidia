# 04 — Arquitetura

Documento técnico que descreve **como** o site da TOUCH MIDIA é construído, hospedado e mantido. Foco na Fase 1.1 (landing). Decisões para fases futuras estão em `06-roadmap.md`.

---

## Stack — Fase 1.1 (landing)

| Camada | Tecnologia | Versão | Motivo |
|---|---|---|---|
| Framework | **Next.js** (App Router) | 15.x | SSR + ISR, SEO de primeira, ecossistema maduro |
| Linguagem | **TypeScript** | 5.x | Type-safety obrigatória |
| Estilização | **Tailwind CSS** | 4.x | Velocidade de iteração, consistência via design tokens |
| Componentes | **shadcn/ui** | latest | Componentes acessíveis, sem lock-in (código copiado, não importado) |
| Animação | **Framer Motion** | 11.x | Padrão de fato para animações React (roleta, transições) |
| Ícones | **Lucide** | latest | Padrão usado pelo shadcn, leve, tree-shakeable |
| Áudio | **Howler.js** | 2.x | Único caso onde precisamos de lib (som da roleta com mute control) |
| Form schema | n/a (sem form na Fase 1.1) | — | Será adicionado na Fase 1.2 (React Hook Form + Zod) |

**Dependências propositalmente NÃO incluídas:**
- ❌ Banco de dados — não há persistência na Fase 1.1
- ❌ Auth — não há login na Fase 1.1
- ❌ ORM — não há banco
- ❌ State management externo (Redux, Zustand) — `useState` resolve tudo na landing
- ❌ Date library (date-fns, dayjs) — não há datas dinâmicas
- ❌ HTTP client (axios) — não há chamadas de API
- ❌ PixiJS / Phaser — overkill para uma roleta com Framer Motion

> **Princípio:** dependência adicionada na Fase 1.1 precisa ser justificada. Stack mínima reduz superfície de bug, build mais rápido, deploy mais leve.

---

## Estrutura de pastas

```
touch-midia/
├── docs/                          (esta pasta — documentação)
│   ├── README.md
│   ├── 01-vision.md
│   ├── 02-product.md
│   ├── 03-landing.md
│   ├── 04-architecture.md         ← você está aqui
│   ├── 05-seo-marketing.md
│   └── 06-roadmap.md
│
├── public/                        (assets estáticos)
│   ├── favicon.ico
│   ├── og-default.png             (imagem OG padrão)
│   ├── robots.txt
│   ├── sitemap.xml                (gerado automaticamente)
│   └── audio/
│       └── roleta-spin.mp3        (som da demo)
│
├── src/
│   ├── app/                       (App Router do Next.js)
│   │   ├── layout.tsx             (layout raiz, fontes, metadata global)
│   │   ├── page.tsx               (home /)
│   │   ├── globals.css            (Tailwind base + variáveis CSS)
│   │   ├── not-found.tsx          (404)
│   │   ├── jogos/
│   │   │   ├── page.tsx           (/jogos — catálogo)
│   │   │   └── [slug]/
│   │   │       └── page.tsx       (/jogos/[slug] — páginas dedicadas)
│   │   ├── como-funciona/
│   │   │   └── page.tsx
│   │   ├── politica-de-privacidade/
│   │   │   └── page.tsx
│   │   ├── termos-de-uso/
│   │   │   └── page.tsx
│   │   ├── sitemap.ts             (gera sitemap.xml dinâmico)
│   │   └── robots.ts              (gera robots.txt)
│   │
│   ├── components/
│   │   ├── layout/                (header, footer, container)
│   │   ├── sections/              (hero, diferenciais, catalogo, etc.)
│   │   ├── games/                 (mockups SVG dos 10 jogos)
│   │   ├── demo/                  (roleta jogável da landing)
│   │   ├── ui/                    (componentes shadcn/ui copiados)
│   │   └── analytics/             (GA4 + Meta Pixel)
│   │
│   ├── content/                   (conteúdo dos jogos como dados)
│   │   └── games.ts               (array tipado com dados dos 10 jogos)
│   │
│   ├── lib/
│   │   ├── utils.ts               (cn() + helpers do shadcn)
│   │   ├── whatsapp.ts            (gera URLs do WhatsApp com mensagem contextual)
│   │   └── seo.ts                 (helpers para metadata por página)
│   │
│   └── styles/                    (se houver CSS adicional além do Tailwind)
│
├── .env.example                   (template de variáveis de ambiente)
├── .env.local                     (não commitado — variáveis locais)
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── README.md                      (do projeto, não da docs)
└── LICENSE                        (a definir)
```

### Princípios da estrutura
- **`app/`** apenas para rotas — sem componentes pesados aqui
- **`components/`** dividido por **propósito**, não por tipo (sections, games, demo, ui)
- **`content/`** centraliza dados estáticos como código tipado — facilita SEO automático
- **`lib/`** para puro código de utilidade, sem JSX

---

## Conteúdo como código tipado

Os 10 jogos são dados estáticos. Em vez de CMS ou markdown, ficam como objeto TypeScript:

```typescript
// src/content/games.ts (esboço)

export type Game = {
  slug: string
  name: string
  category: 'sorte' | 'conhecimento' | 'marca'
  shortDescription: string
  longDescription: string
  mechanics: string[]
  idealFor: string[]
  customizationOptions: string[]
  averageDuration: string
  seoKeywords: string[]
  whatsappMessage: string
  mockupComponent: string  // referência ao componente SVG
}

export const games: Game[] = [
  {
    slug: 'roleta-premiada',
    name: 'Roleta Premiada',
    category: 'sorte',
    // ...
  },
  // ... 9 outros
]
```

**Vantagens:**
- Type-safe (TS reclama se faltar campo)
- Páginas de jogo são geradas dinamicamente a partir do array (`generateStaticParams`)
- Sitemap, breadcrumb, "jogos relacionados" tudo derivado deste array
- Trocar conteúdo = editar uma struct, não 10 arquivos JSX

---

## Infraestrutura

### VPS de produção
| Item | Valor |
|---|---|
| Provedor | Hostinger |
| Hostname | `srv1604792.hstgr.cloud` |
| IP público | `187.77.6.194` |
| Plano | KVM 1 |
| Validade | 2027-04-20 |
| OS | Linux (provavelmente Ubuntu — confirmar no setup) |
| Coolify | **Já instalado** (segundo informação do cliente em 2026-05-05) |

### Domínio
- **Domínio:** `touchmidia.com`
- **Registrado em:** Hostinger
- **DNS:** apontar `A` record de `touchmidia.com` e `www.touchmidia.com` para `187.77.6.194`
- **SSL:** Let's Encrypt automático via Coolify
- **Subdomínios reservados:**
  - `app.touchmidia.com` — painel do cliente (Fase 1.2+)
  - `admin.touchmidia.com` — painel admin (Fase 1.2+)
  - `coolify.touchmidia.com` — UI do Coolify (uso interno)

### Repositório
| Item | Valor |
|---|---|
| Provedor | GitHub |
| URL | https://github.com/digozz/touchmidia |
| Visibilidade | Privado |
| Branch principal | `main` |
| Estratégia | Trabalhar direto em `main` na Fase 1.1 (sem PRs); adotar branches temáticos a partir da 1.2 |

---

## Fluxo de Deploy

### Resumo
```
dev local → git push origin main → GitHub
GitHub webhook → Coolify
Coolify → docker build → deploy
SSL automático via Let's Encrypt
```

### Passo a passo do setup inicial

1. **No Coolify (UI web)**
   - Conectar conta do GitHub (OAuth)
   - Criar nova "Application"
   - Selecionar repositório `digozz/touchmidia`
   - Branch: `main`
   - Build pack: **Nixpacks** (detecta Next.js automaticamente)
   - Comando de build: `npm run build` (default)
   - Comando de start: `npm start` (default)
   - Porta interna: `3000`
   - Domínio: `touchmidia.com` + `www.touchmidia.com`
   - SSL: ativar Let's Encrypt

2. **No DNS (Hostinger)**
   - Criar `A` record: `@` → `187.77.6.194`
   - Criar `A` record: `www` → `187.77.6.194`
   - TTL: 3600

3. **Variáveis de ambiente no Coolify**
   - `NEXT_PUBLIC_GA_ID` — ID do GA4 (G-XXXXXXXXXX)
   - `NEXT_PUBLIC_META_PIXEL_ID` — ID do Pixel da Meta
   - `NEXT_PUBLIC_SITE_URL` — `https://touchmidia.com`
   - (Outras variáveis virão em fases posteriores)

4. **Deploy automático**
   - Cada `git push origin main` dispara build no Coolify
   - Health check em `/` (Next.js responde 200)
   - Rollback disponível na UI do Coolify (volta para deploy anterior)

### Workflow local

```bash
# Clonar (uma vez)
git clone https://github.com/digozz/touchmidia.git C:\ANTIGRAVITY\touch-midia
cd C:\ANTIGRAVITY\touch-midia

# Instalar deps
npm install

# Dev server
npm run dev          # http://localhost:3000

# Type-check
npm run typecheck    # tsc --noEmit

# Build local (sanity check antes de push)
npm run build && npm run start

# Push (deploy automático)
git add .
git commit -m "feat: ..."
git push origin main
```

---

## Convenções de Código

### Nomenclatura
- **Arquivos:** kebab-case (`hero-section.tsx`, `roleta-demo.tsx`)
- **Componentes React:** PascalCase (`HeroSection`, `RoletaDemo`)
- **Funções/variáveis:** camelCase (`buildWhatsappUrl`, `gameSlug`)
- **Tipos/interfaces:** PascalCase (`Game`, `GameCategory`)
- **Constantes globais:** SCREAMING_SNAKE_CASE (`WHATSAPP_NUMBER`, `SITE_URL`)

### Estrutura de componente
```typescript
// 1. Imports (externos primeiro, depois internos)
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// 2. Tipos
type Props = {
  className?: string
}

// 3. Componente
export function HeroSection({ className }: Props) {
  return (
    <section className={cn('...', className)}>
      ...
    </section>
  )
}
```

### Server vs Client Components
- **Default: Server Component** (sem diretiva)
- **`'use client'`** apenas em componentes com:
  - Estado (`useState`, `useReducer`)
  - Efeitos (`useEffect`)
  - Eventos do navegador
  - Bibliotecas que dependem do DOM (Framer Motion, Howler)
- A demo da roleta é Client. Hero, Footer, páginas de jogos podem ser Server.

### Testes
- **Sem suite de testes na Fase 1.1.** Landing é estática, manualmente verificável.
- Testes entram quando houver lógica de negócio real (Fase 1.2: gestão de estoque, probabilidade dinâmica).

---

## Variáveis de Ambiente

```bash
# .env.example (commitado, sem valores reais)

# Site
NEXT_PUBLIC_SITE_URL=https://touchmidia.com

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=XXXXXXXXXXXXXXX

# Contato (também usado em CTAs)
NEXT_PUBLIC_WHATSAPP_NUMBER=5585989761076
NEXT_PUBLIC_CONTACT_EMAIL=contato@touchmidia.com
```

`.env.local` NÃO vai pro git (já no `.gitignore`).

---

## Segurança

### O essencial na Fase 1.1
- **HTTPS obrigatório** (Let's Encrypt via Coolify)
- **Headers de segurança** via `next.config.ts`:
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- **Sem secrets no client-side** — Next.js separa `NEXT_PUBLIC_*` (cliente) do resto (servidor)
- **Dependências auditadas:** `npm audit` antes de cada deploy

### Não aplicável na Fase 1.1
- CSRF (não há formulários)
- Rate limiting (não há endpoints)
- Sanitização de input (não há input de usuário)

Estas medidas entram em escopo na Fase 1.2 quando houver autenticação e formulários reais.

---

## Monitoramento (Fase 1.1: mínimo viável)

- **Coolify:** logs do container, status de build, uptime básico
- **GA4:** páginas mais visitadas, fontes de tráfego, comportamento
- **Meta Pixel:** conversões para campanhas pagas

Sem APM (Sentry, New Relic) na Fase 1.1 — overkill para landing estática. Adicionar quando houver lógica de negócio real.

---

## Pendências de Setup (Fase 0, antes de qualquer código)

1. ✅ VPS contratada e Coolify instalado
2. ✅ Repositório criado (`github.com/digozz/touchmidia`)
3. ⏳ Corrigir email do git: `git config --global user.email "rodrigozaranza@gmail.com"`
4. ⏳ Configurar autenticação do GitHub local (Personal Access Token via HTTPS, ou SSH key)
5. ⏳ Apontar DNS de `touchmidia.com` para `187.77.6.194`
6. ⏳ Conectar Coolify ao repositório GitHub via OAuth
7. ⏳ **Rotacionar a chave SSH** que vazou em conversa anterior (alta prioridade)

Itens 3 a 7 serão resolvidos no início da execução da Fase 1.1, com guia passo a passo do Claude.
