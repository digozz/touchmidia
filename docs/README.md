# TOUCH MIDIA — Documentação

Documentação completa do projeto TOUCH MIDIA. Lê os arquivos em ordem para ter o quadro inteiro, ou pula direto para o que interessa.

---

## O que é a TOUCH MIDIA (resumo de 1 minuto)

Plataforma SaaS de **jogos interativos para totens touch screen em eventos corporativos**. Substitui o estande chato com formulário em iPad por uma experiência que **gera fila** e **captura leads qualificados** com gestão inteligente de estoque de brindes.

**Modelo:** B2B2C. Cliente que paga = agências, marketing, trade. Usuário final = visitante do evento.

**Cobrança:** por evento, a partir de R$ 1.200 (preço não exibido no site).

**Diferencial declarado:** preço baixo com alta qualidade.

**Headline pública:** *"Mais filas. Mais leads. Sem gastar com agência grande."*

**Estado atual:** documentando a Fase 1.1 (landing page institucional). Produto real ainda não existe; será Fase 1.2.

---

## Índice

| # | Arquivo | O que tem |
|---|---|---|
| 00 | **README.md** | Você está aqui. Visão de 1 minuto e índice. |
| 01 | [01-vision.md](./01-vision.md) | O que é a TOUCH MIDIA, dor que resolve, público-alvo, posicionamento |
| 02 | [02-product.md](./02-product.md) | Modelo comercial, 3 tiers, catálogo de 10 jogos, regras de negócio |
| 03 | [03-landing.md](./03-landing.md) | Estrutura da landing, copy, demo da roleta, mockups, CTAs |
| 04 | [04-architecture.md](./04-architecture.md) | Stack, estrutura de pastas, infraestrutura, deploy, convenções |
| 05 | [05-seo-marketing.md](./05-seo-marketing.md) | Keywords, meta tags, sitemap, schema, GA4, Meta Pixel |
| 06 | [06-roadmap.md](./06-roadmap.md) | Fase 1.1 → 1.2 → 1.3 → 2.0, decisões deferidas |

---

## Caminhos recomendados de leitura

**Quero entender o produto:**  
01 → 02 → 06

**Quero entender o que vai ser construído agora:**  
03 → 04 → 05

**Quero saber o que vem depois:**  
06

**Quero contribuir / dar feedback:**  
01 (visão) e depois o doc específico do tópico que vai comentar

---

## Decisões já fechadas

Todas as decisões abaixo estão documentadas em detalhe nos arquivos correspondentes. Listadas aqui para referência rápida.

### Identidade
- Nome: **TOUCH MIDIA** (sem acento, com espaço)
- Paleta provisória: preto + roxo elétrico + branco
- Fontes: **Inter** (UI) + **Space Grotesk** (display)
- Tom: direto-moderno
- Aguardando: guia da marca oficial

### Negócio
- Cobrança por evento, a partir de R$ 1.200 (não exibido no site)
- Diferencial: preço baixo com alta qualidade
- Concorrente de referência: thinkprint.com.br
- Sem prova social real ainda (mockups por enquanto)
- Contato: WhatsApp (85) 9 8976-1076 e contato@touchmidia.com
- CNPJ: 42.662.663/0001-11

### Produto (catálogo de 10 jogos)
1. Roleta Premiada
2. Raspadinha Virtual
3. Caça-Níquel
4. Plinko
5. Caixa Misteriosa
6. Quiz Múltipla Escolha
7. Verdadeiro ou Falso
8. Jogo da Memória
9. Quebra-Cabeça da Marca
10. Pegue os Itens

Apenas 2-3 serão funcionais no MVP (Fase 1.2). Os outros são vitrine no catálogo da landing.

### Técnico
- Stack: Next.js 15 + TypeScript + Tailwind + shadcn/ui + Framer Motion
- Sem banco / auth / formulário na Fase 1.1
- Mockups de jogos em **CSS/SVG** (não imagens raster)
- Demo da Roleta: jogável, **com som suave + mute toggle**, sem captura de lead, CTA visível
- Hospedagem: **VPS Hostinger dedicada** (`srv1604792.hstgr.cloud`, IP `187.77.6.194`), Coolify já instalado
- Domínio: **touchmidia.com**
- Repo: **github.com/digozz/touchmidia** (privado)
- GA4 + Meta Pixel ativados desde o lançamento

### SEO
- Desktop-first, PT-BR
- 14 páginas indexáveis
- Foco: capturar intenção em torno de "totem touch interativo para eventos"
- Sitemap.xml dinâmico, robots.txt, schema.org, OG images automáticas

---

## Pendências antes de começar a executar

**Bloqueantes (precisam ser resolvidas antes do primeiro código):**
1. Corrigir email do git: está `rodrigozaranza@gmail.om`, deveria ser `.com`
2. Configurar autenticação GitHub local (PAT ou SSH)
3. Apontar DNS de touchmidia.com para 187.77.6.194
4. Conectar Coolify ao repo via OAuth
5. **Rotacionar a chave SSH que vazou na conversa anterior** (segurança)

**Não-bloqueantes (cliente envia quando puder):**
1. Guia da marca (logo + paleta oficial)
2. Confirmação se quer "a partir de R$ 1.200" no hero ou totalmente sem menção a preço

---

## Estado deste documento

- Criado em: 2026-05-05
- Status: aguardando aprovação do cliente para iniciar Fase 0 (setup) e em seguida Fase 1.1 (execução)
- Próxima atualização: ao concluir Fase 1.1 (refletir aprendizados e ajustes necessários para 1.2)
