# 02 — Produto

## Modelo Comercial

### Cobrança
- **Por evento** (não mensalidade, não por lead)
- Piso interno: **R$ 1.200/evento**
- **Preço NÃO é exibido na landing** — CTA leva para WhatsApp ou email
- Justificativa: preço baixo qualifica mas pode parecer "barato demais" para clientes premium. Calibrar via conversa.

### Canais de contato (oficiais)
- **WhatsApp:** (85) 9 8976-1076
- **Email:** contato@touchmidia.com

### Dados oficiais
- **Razão social / CNPJ:** 42.662.663/0001-11
- **Domínio:** touchmidia.com (registrado na Hostinger)

---

## Arquitetura Comercial: 3 Tiers

A plataforma suporta três níveis de venda. Apenas o **Tier 1** está em escopo da Fase 1.1 e 1.2.

### Tier 1 — White-label (foco da Fase 1.x)
Cliente escolhe um jogo do catálogo. Personaliza apenas:
- Logo
- Cores de fundo
- Imagens das cartas / fatias da roleta / itens de prêmio
- Lista de prêmios e probabilidades

**Sem desenvolvimento sob demanda. Margem alta. Volume.**

### Tier 2 — Híbrido (Fase 1.3+)
Jogo do catálogo + injeção de features específicas:
- Regra de pontuação customizada
- Integração com API do cliente (CRM próprio)
- Telas adicionais (tutorial, pesquisa pós-jogo)

**Margem média. Demanda sob agendamento.**

### Tier 3 — Customizado (Fase 2+)
Jogo desenvolvido do zero, hospedado na plataforma para usar:
- Módulo de captura de leads
- Dashboard de métricas
- Gestão de estoque

**Margem alta unitária. Tempo longo de produção. Vendido como projeto.**

---

## Diferencial Estratégico

**Preço baixo com alta qualidade.**

Os 3 ângulos que sustentam essa promessa:

1. **Catálogo amortizado** — desenvolvemos um jogo uma vez e revendemos N vezes
2. **Stack moderna** — Next.js, Tailwind, Framer Motion entregam qualidade visual sem custo de motor de jogo proprietário
3. **Operação enxuta** — um operador remoto pode atender múltiplos eventos simultâneos via dashboard

---

## Catálogo de 10 Jogos

Os 10 jogos que compõem o catálogo público (vitrine na landing). Apenas 2-3 serão implementados no MVP do produto (Fase 1.2). Os outros existem como cards no catálogo da landing — vendemos antes de produzir.

### Categoria 1 — Sorte & Brindes (5 jogos)
*Mecânica core: probabilidade ponderada por estoque. Foco em distribuição de brindes.*

#### 1. Roleta Premiada
- **Mecânica:** roda gira, para em uma fatia, fatia define o prêmio
- **Tempo de jogada:** ~15s
- **Ideal para:** qualquer evento — é o "default" do catálogo
- **Diferencial:** animação fluida de desaceleração com easing realista
- **MVP:** sim (é a roleta da demo da landing)

#### 2. Raspadinha Virtual
- **Mecânica:** usuário "raspa" com o dedo (gesture canvas) revelando o prêmio
- **Tempo de jogada:** ~10s
- **Ideal para:** eventos com brinde garantido (todo mundo ganha algo)
- **Diferencial:** gesto tátil viraliza, alta sensação de "ganhei algo"

#### 3. Caça-Níquel (Slot Machine)
- **Mecânica:** 3 reels giram independentes, alinhamento define prêmio
- **Tempo de jogada:** ~12s
- **Ideal para:** eventos descontraídos (varejo, food festivals, ativações de bar)
- **Diferencial:** nostalgia + animação satisfatória de alinhamento

#### 4. Plinko
- **Mecânica:** bola cai por pinos com física real, slot define prêmio
- **Tempo de jogada:** ~8s
- **Ideal para:** eventos jovens, marcas modernas (gaming, tecnologia)
- **Diferencial:** **viralizou no TikTok** — atrai público mais jovem

#### 5. Caixa Misteriosa
- **Mecânica:** usuário escolhe 1 entre N caixas que abrem revelando o prêmio
- **Tempo de jogada:** ~10s
- **Ideal para:** ativações com forte apelo de "surpresa" (lançamentos)
- **Diferencial:** menor custo de produção (boa para Tier 1 acessível)

### Categoria 2 — Conhecimento (3 jogos)
*Mecânica core: perguntas. Diferencial: educa o lead sobre a marca enquanto joga.*

#### 6. Quiz Múltipla Escolha
- **Mecânica:** 5-10 perguntas, alternativas A/B/C/D, pontuação no final
- **Tempo de jogada:** ~60-90s
- **Ideal para:** feiras técnicas (farmacêutica, agronegócio, finanças, saúde)
- **Diferencial:** o cliente educa o lead sobre seu produto enquanto coleta dados

#### 7. Verdadeiro ou Falso
- **Mecânica:** afirmações, jogador escolhe V/F, pontuação no final
- **Tempo de jogada:** ~30s (rounds curtos)
- **Ideal para:** alto throughput de leads/hora (eventos com fluxo intenso)
- **Diferencial:** mais rápido que o Quiz, fila roda mais rápido

#### 8. Jogo da Memória
- **Mecânica:** par de cartas idênticas, jogador encontra todos os pares
- **Tempo de jogada:** ~60s
- **Ideal para:** marcas com produtos visuais (cosméticos, alimentos, moda)
- **Diferencial:** marca aparece em **todas** as cartas — saturação positiva

### Categoria 3 — Agilidade & Marca (2 jogos)
*Mecânica core: skill + tempo. Diferencial: ranking gera competitividade.*

#### 9. Quebra-Cabeça da Marca
- **Mecânica:** peças do logo/produto embaralhadas, montar contra o relógio
- **Tempo de jogada:** ~45-90s
- **Ideal para:** ativação puramente visual de marca
- **Diferencial:** trabalho ativo do jogador para reconstruir a marca = memória forte

#### 10. Pegue os Itens (estilo Fruit Ninja)
- **Mecânica:** itens caem da tela, jogador "pega" com gesto, pontua
- **Tempo de jogada:** ~30s
- **Ideal para:** eventos jovens, lançamentos de produto (itens são o produto caindo)
- **Diferencial:** **jogo premium do catálogo** — usar para eventos com orçamento maior

---

## Regras de Negócio Centrais

Estas regras são o **fosso técnico** do produto. Concorrente sem elas tem produto inferior.

### RN01 — Personalização por Tier
Definida acima na seção de Tiers.

### RN02 — Estoque Inteligente (regra crítica)
Se um jogo distribui prêmios físicos, o sistema deve:

1. Decrementar o estoque em tempo real após cada vitória
2. **O algoritmo de probabilidade DEVE consultar o estoque antes de definir o resultado**
3. Se um prêmio está zerado, a probabilidade dele cair vai automaticamente para 0%
4. As outras probabilidades são re-normalizadas

**Exemplo:** Roleta com 4 prêmios (Camiseta 25%, Caneca 25%, Voucher 25%, "Mais Sorte!" 25%). Camiseta esgota. Sistema redistribui: Caneca 33,3%, Voucher 33,3%, "Mais Sorte!" 33,4%.

**Por que isso importa:** sem essa regra, o cliente promete brindes que não tem mais e cria constrangimento no estande.

### RN03 — Captura de Lead (Antes vs Depois)
O administrador do cliente escolhe **quando** o formulário de captura aparece:

- **Antes do jogo:** formulário é pré-requisito para liberar o jogo (maximiza captura, reduz throughput)
- **Depois do jogo:** formulário libera a pontuação/brinde após jogar (maximiza throughput, reduz captura)

Default sugerido: **antes**, mas configurável por evento.

### RN04 — Funcionamento Offline-First
Redes de internet em eventos são instáveis. O totem deve:

1. Cachear todos os assets (imagens, sons) no Service Worker do navegador
2. Continuar funcionando se a internet cair
3. Salvar leads em IndexedDB local
4. Sincronizar com o backend assim que a conexão voltar
5. Indicar visualmente o status (online / offline) discretamente para o operador

---

## Funcionalidades do Painel do Cliente (Fase 1.2+)

Não fazem parte da landing. Listadas aqui para referência futura.

| Feature | Descrição |
|---|---|
| Login | Email + senha (sem multi-tenant complexo no início) |
| Criar evento | Nome, data início/fim, jogo selecionado |
| Personalização | Upload de logo, escolha de cores, upload de assets dos prêmios |
| Configuração de prêmios | Lista de prêmios, estoque inicial, probabilidades base |
| Configuração de captura | Formulário antes/depois, campos obrigatórios |
| Dashboard tempo real | Total jogadas, leads capturados, prêmios distribuídos |
| Exportação | CSV e XLSX dos leads |
| Geração de URL/token | URL única do totem para aquele evento |

---

## Funcionalidades do Painel Admin (interno)

| Feature | Descrição |
|---|---|
| Cadastro de clientes | CRUD de clientes da plataforma |
| Catálogo de jogos | Cadastro/edição dos jogos disponíveis |
| Deploy de jogos custom | Pipeline para hospedar Tier 3 |
| Visão consolidada | Métricas agregadas de todos os eventos ativos |
