# 06 — Roadmap

Documento que sequencia o que será construído, em que ordem e com que escopo. Cada fase tem entregas claras e critério de "feito".

---

## Visão geral das fases

```
Fase 1.1  →  Fase 1.2  →  Fase 1.3  →  Fase 2.0
Landing      MVP do      Catálogo      Tier 3 +
público      produto     expandido     locação de
             real        + Tier 2      equipamentos
```

**Foco atual: Fase 1.1.** O resto é referência futura.

---

## Fase 1.1 — Landing Page (em planejamento agora)

### Objetivo
Site institucional e catálogo público que **gera contato qualificado** via WhatsApp e email.

### Escopo
Coberto em detalhe em `03-landing.md`. Resumo:
- Home com hero, demo da roleta, diferenciais, catálogo, "como funciona", CTA final
- 10 páginas dedicadas de jogo (`/jogos/[slug]`)
- Página de catálogo (`/jogos`)
- Página `/como-funciona`
- Páginas legais (privacidade + termos)
- Página 404
- SEO completo (sitemap, robots, schema, OG, meta)
- GA4 + Meta Pixel
- Deploy automatizado via Coolify
- SSL ativo

### Critério de "feito"
- [ ] Todas as páginas listadas no escopo no ar
- [ ] Lighthouse 90+ em todas as métricas, em todas as páginas
- [ ] CTAs do WhatsApp e email funcionam com mensagens contextuais
- [ ] Demo da roleta jogável, com som suave + mute
- [ ] Sitemap.xml e robots.txt corretos
- [ ] GA4 e Meta Pixel disparando eventos
- [ ] HTTPS funcionando em `touchmidia.com` e `www.touchmidia.com`
- [ ] Push para `main` dispara deploy automático no Coolify

### Estimativa de tempo
**~7-9 dias úteis** de execução. Sem deadline rígido — qualidade > velocidade.

### Pendências antes do início (Fase 0)
1. Corrigir email do git local
2. Configurar autenticação GitHub local (PAT ou SSH)
3. Apontar DNS de `touchmidia.com` para `187.77.6.194`
4. Conectar Coolify ao repo via OAuth
5. Rotacionar chave SSH vazada em conversa anterior

### Pendências do cliente (não bloqueiam dev)
1. Enviar guia da marca (logo + paleta oficial) — sigo com provisório até chegar
2. Confirmar se quer "a partir de R$ 1.200" exibido no hero ou totalmente sem preço

### Limitações conscientes desta fase
- **Sem formulário** (CTAs apenas para WhatsApp/email)
- **Sem banco de dados**
- **Sem login**
- **Sem painel** (cliente ainda não acessa nada)
- **Sem produto real** (mockups de jogos, não jogos funcionais — exceto a Roleta da demo)
- **Sem cases reais** (mockups ilustrativos)
- **Apenas PT-BR**

---

## Fase 1.2 — MVP do Produto

### Objetivo
Construir o **produto que a Fase 1.1 vende**: ter pelo menos um jogo real funcionando em totens, com painel para o cliente acompanhar leads e gerenciar prêmios.

### Quando começar
Quando a Fase 1.1 estiver no ar **e** houver pelo menos **um cliente piloto** confirmado. Construir Fase 1.2 sem cliente é desperdício — estaríamos chutando requisitos sem feedback.

### Escopo principal

#### Aplicação do totem
- 2-3 jogos reais funcionais (Roleta + Raspadinha + Quiz, sugestão)
- PWA fullscreen (kiosk mode)
- Offline-first com Service Worker + IndexedDB
- Sincronização de leads ao recuperar conexão
- Captura de lead (antes ou depois do jogo, configurável)
- Tela de descanso (screensaver com logo do cliente)
- URL única por evento (`totem.touchmidia.com/[token-do-evento]`)

#### Painel do cliente
- Login (email + senha simples)
- Criar evento (nome, data início/fim, jogo escolhido)
- Personalização (logo, cores, prêmios, probabilidades)
- Configuração de captura (campos do formulário, antes/depois)
- Dashboard tempo real (jogadas, leads, prêmios)
- Exportação CSV/XLSX dos leads
- Geração da URL única do totem

#### Painel admin
- CRUD de clientes
- Cadastro de jogos no catálogo (admin curate)
- Visão consolidada de eventos ativos

#### Backend
- Banco de dados PostgreSQL (gerenciado via Coolify)
- API com Server Actions do Next.js (sem REST/GraphQL externo)
- Autenticação (Auth.js / NextAuth)
- Lógica do estoque inteligente (RN02)
- Lógica de probabilidade dinâmica

### Critério de "feito"
- [ ] Cliente piloto consegue: criar evento → personalizar → publicar → ver leads em tempo real → exportar
- [ ] Roleta real distribui prêmios respeitando estoque
- [ ] Funcionamento offline validado em ambiente real
- [ ] Pelo menos um evento real rodando com dados reais

### Estimativa
**~30-45 dias úteis** dependendo de retrabalho com piloto.

---

## Fase 1.3 — Catálogo Expandido + Tier 2

### Objetivo
Aumentar volume de venda ampliando o catálogo de jogos jogáveis e abrindo modelo híbrido.

### Escopo principal

- Implementar mais 4-6 jogos do catálogo (até ter 6-8 reais funcionando)
- **Tier 2 — Híbrido:** infraestrutura para customizações específicas por cliente
  - Sistema de "regras adicionais" plugáveis no jogo base
  - Webhooks para integração com APIs externas (CRM do cliente)
  - Telas customizáveis (tutorial pré-jogo, pesquisa pós-jogo)
- Blog em `/blog` para conteúdo SEO informacional
- Página `/cases` com casos reais (quando autorizados)
- Newsletter (captura de email)

### Quando começar
Quando a Fase 1.2 tiver pelo menos **3-5 clientes ativos** e **dados de uso** suficientes para priorizar quais jogos do catálogo de fato têm demanda.

### Estimativa
**~30-60 dias úteis**, em paralelo com operação dos clientes existentes.

---

## Fase 2.0 — Tier 3 + Locação de Equipamento

### Objetivo
Subir um nível na curva de valor: jogos sob medida + locação opcional de totens físicos (deixa de ser só software).

### Escopo principal

- **Tier 3 — Customizado:** pipeline para hospedar jogos desenvolvidos sob demanda
  - Cada jogo customizado roda como microserviço
  - Acesso ao módulo de captura de leads e dashboard padrão
  - Cobrança como projeto, não como produto
- **Locação de equipamentos:**
  - Compra inicial de N totens
  - Logística de envio/recolhimento
  - Operação no evento (técnico in loco se contratado)
  - Sistema de reservas e disponibilidade no painel
- API pública para parceiros / integrações
- Multi-idioma (inglês, mínimo)
- Plano enterprise (eventos múltiplos, multi-totem, conta corporativa)

### Quando começar
Quando o produto base (1.1, 1.2, 1.3) estiver gerando **receita recorrente estável** que sustente investimento em hardware.

### Estimativa
**60+ dias úteis** + investimento em equipamento (não-trivial — orçar separadamente).

---

## Decisões deferidas

Lista de coisas que **não** vão ser decididas agora, mas serão necessárias em alguma fase futura. Catalogadas aqui para não esquecer.

| Tópico | Decidir em | Notas |
|---|---|---|
| Plano de cobrança recorrente vs por evento | Fase 1.2 | Hoje é "por evento". Quando volume crescer, considerar mensalidade para clientes recorrentes |
| Plataforma de pagamento (Stripe, Pagar.me, Asaas) | Fase 1.2 | Quando iniciar cobrança automatizada |
| Estratégia de billing para Tier 3 | Fase 2.0 | Cobrança como projeto, mas precisa estrutura interna |
| Sistema de tickets / suporte | Fase 1.3 | Hoje WhatsApp resolve; quando passar de 10 clientes ativos, profissionalizar |
| Multi-tenant (isolamento de dados por cliente) | Fase 1.2 | Decidir se PostgreSQL com row-level security ou banco por cliente |
| Internacionalização (i18n) | Fase 2.0 | Inglês primeiro, depois espanhol |
| Estratégia de cache da API (Redis?) | Fase 1.3 | Só relevante quando dashboard tempo real escalar |
| Notificações push (PWA) | Fase 1.3 | Notificar operador do evento sobre eventos importantes (ex: "estoque de Camiseta acabou") |

---

## O que está fora de escopo, em qualquer fase prevista

Coisas que **não** estão no horizonte e devem ser explicitamente recusadas se surgirem como pedido:

- Aplicativo mobile nativo (iOS/Android) — PWA resolve
- Integração com hardware proprietário (impressoras térmicas, leitor de QR, etc.) — apenas web standard
- Marketplace público de jogos criados por terceiros
- Editor visual de jogos para clientes não-técnicos
- Cripto / NFT / Web3 / "metaverso" — não.

Esses itens podem ser revistos com justificativa forte, mas o default é recusa.

---

## Próximos passos imediatos (após este documento)

Quando o cliente aprovar a documentação:

1. **Fase 0 — Setup** (1 dia)
   - Resolver pendências de email git, autenticação GitHub, DNS, Coolify, chave SSH
   - Inicializar projeto Next.js no repo `digozz/touchmidia`
   - Primeiro deploy "Hello World" no `touchmidia.com` para validar pipeline

2. **Fase 1.1 — Execução** (7-9 dias úteis)
   - Seguir checklist em `03-landing.md`
   - Iterar com feedback do cliente
   - Lançar
