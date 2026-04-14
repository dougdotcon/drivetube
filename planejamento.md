# Planejamento Estratégico - DriveTube

## Objetivo
Transformar o DriveTube em uma plataforma SaaS comercializável com foco em 4 ofertas principais:
1. Micro-SaaS White-Label para nichos específicos (oceano azul)
2. Hub Creator Economy Web3 (modelo Patreon/OnlyFans com privacidade)
3. Portal B2B de entrega e aprovação audiovisual com escrow
4. Hub de onboarding corporativo (Netflix do RH)

## Princípios do plano
- Nichar primeiro, escalar depois
- Vender resultado e setup, não apenas software
- Priorizar recorrencia previsível (MRR)
- Aproveitar stack atual (Next.js + Fastify + Prisma + MySQL + TANOS)
- Isolar dados por tenant desde o inicio para escalar com segurança

## Estado atual (base pronta)
- Autenticacao com email/senha e Google
- Gestao de videos, playlists e favoritos
- Planos, assinaturas e waitlist
- Integracao de pagamentos cripto via TANOS (USDT)
- Estrutura pronta para evolucao multi-tenant

## Trilhas de produto

### Trilha 1 - Micro-SaaS White-Label para nichos
Objetivo: vender uma plataforma exclusiva para pequenos e medios negocios com treinamento interno ou cursos proprietarios.

Vertical inicial sugerida: estetica e beleza (lash design, clinicas, esteticistas).

Entregaveis:
- Branding por tenant (logo, cor, dominio, nome da plataforma)
- Templates de pagina de venda e area de alunos
- Gestao basica de certificados
- Painel administrativo simplificado para dono do negocio

KPI:
- 3 clientes pagantes no nicho em 60 dias
- Ticket medio de setup >= R$ 2.000
- Churn mensal < 5%

### Trilha 2 - Creator Economy Web3
Objetivo: permitir monetizacao com menor dependencia de plataformas tradicionais.

Publico-alvo:
- Educadores financeiros
- Analistas cripto
- Podcasters independentes
- Criadores sensiveis a censura/desmonetizacao

Entregaveis:
- Conteudo premium por assinatura
- Pay-per-view por video
- Cobranca com USDT e taxa da plataforma
- Historico de transacoes e comprovantes
- Controles de acesso por nivel de assinatura

KPI:
- 10 criadores ativos no piloto
- 100 transacoes no primeiro ciclo
- Taxa de conversao free -> paid > 4%

### Trilha 3 - Portal B2B para agencias audiovisuais
Objetivo: resolver entrega, aprovacao e pagamento final de videos sem calote.

Entregaveis:
- Area do cliente com login e visualizacao de pre-roll/previews
- Marca d'agua em pre-visualizacao
- Fluxo de aprovacao por etapa (ajustes/versao final)
- Escrow simplificado (pagamento confirmado -> libera download HQ)
- Registro de auditoria (quem aprovou, quando, versao)

KPI:
- 5 agencias piloto
- Reducao de inadimplencia percebida
- Tempo medio de aprovacao reduzido em >= 30%

### Trilha 4 - Hub de onboarding corporativo
Objetivo: organizar treinamentos de empresas que ja usam Google Workspace.

Entregaveis:
- Conexao com Drive corporativo
- Catalogacao inteligente por pastas/departamentos
- Trilhas obrigatorias por cargo
- Rastreio de progresso e conclusao por colaborador
- Relatorios para RH (adesao, conclusao, pendencias)

KPI:
- 2 pilotos B2B em empresas medias
- >= 80% de conclusao em trilhas obrigatorias
- Reducao de tempo de onboarding em >= 20%

## Plano de execucao por fases

### Fase 0 (Semana 1-2): Fundacao comercial e tecnica
- Definir proposta comercial oficial por oferta
- Ajustar posicionamento da landing e README
- Estruturar modelo de tenant no banco (separacao de dados)
- Definir observabilidade basica (logs, eventos, pagamentos)

Saidas:
- Pitch deck comercial
- Matriz de precificacao
- Documento tecnico de multi-tenant v1

### Fase 1 (Semana 3-6): MVP comercial para nicho inicial
- Entregar white-label minimo para nicho beleza
- Habilitar onboarding guiado do cliente
- Criar jornada de conversao waitlist -> demonstracao -> contrato

Saidas:
- 1 caso real publicado (estudo de caso)
- Scripts comerciais e proposta padrao

### Fase 2 (Semana 7-10): Monetizacao e creator mode
- Fortalecer assinatura + pay-per-view
- Dashboard de receita para criadores
- Melhorar confiabilidade do fluxo de pagamento (webhooks e reconciliacao)

Saidas:
- Plano Creator ativo
- Politica de taxas e saque definida

### Fase 3 (Semana 11-14): B2B audiovisual e escrow
- Publicar modulo de aprovacao por versao
- Liberacao automatica de download apos pagamento
- Trilha de notificacoes para cliente e agencia

Saidas:
- Oferta oficial para agencias
- Contrato padrao com clausulas de aprovacao

### Fase 4 (Semana 15-18): Onboarding corporativo e analytics
- Painel RH com progresso por colaborador
- Relatorios exportaveis
- Regras por departamento/cargo

Saidas:
- Oferta Enterprise inicial
- 2 pilotos corporativos acompanhados

## Go-to-market (GTM)

### Oferta comercial
Modelo recomendado:
- Setup Fee: R$ 2.000 a R$ 5.000 (implantacao)
- Mensalidade base: a partir de R$ 300/mes (infra + suporte)
- Taxa transacional (creator/pay-per-view): percentual por venda
- Add-ons: customizacao visual, migracao de conteudo, analytics avancado

### Canais
- LinkedIn (B2B: RH, agencias, franqueadoras)
- Instagram e comunidades de nicho (beleza e criadores)
- Twitter/X e comunidades Web3
- Parcerias com consultores de marketing e produtoras

### Aquecimento de demanda com waitlist
- Usar waitlist para criar escassez e validar interesse por vertical
- Rodar cohorts quinzenais de entrada
- Coletar feedback estruturado dos primeiros usuarios

## Requisitos tecnicos prioritarios

### Multi-tenant
- TenantId em entidades principais
- Middleware de isolamento por tenant
- Permissoes por papel (owner/admin/member/client)
- Personalizacao visual por tenant

### Pagamentos
- Confirmacao via webhook
- Status de transacao e reconciliacao
- Regras de liberacao de conteudo por pagamento/assinatura

### Compliance e seguranca
- Termos de uso por vertical
- Politica de privacidade e retenção de dados
- Logs de auditoria para operacoes sensiveis

## Riscos e mitigacoes
- Risco: tentar atender todos os nichos ao mesmo tempo
  - Mitigacao: foco em 1 vertical por ciclo
- Risco: friccao tecnica na implantacao de clientes
  - Mitigacao: playbook de setup padronizado
- Risco: dependencia de canais pagos para venda
  - Mitigacao: estrategia organica com conteudo e estudos de caso
- Risco: pagamentos sem reconciliacao confiavel
  - Mitigacao: implementar webhooks e monitoramento proativo

## Backlog imediato (proximos 30 dias)
1. Publicar reposicionamento de marca e README
2. Formalizar pacotes comerciais (Setup + Mensalidade + Taxa)
3. Implementar base multi-tenant no banco e backend
4. Fechar 3 pilotos pagos (1 beleza, 1 criador, 1 agencia)
5. Instrumentar analytics de conversao e uso

## Critérios de sucesso (90 dias)
- >= 5 clientes pagantes totais
- MRR >= R$ 3.000
- 1 estudo de caso publicado por vertical ativa
- Churn controlado e NPS qualitativo positivo

## Responsabilidades sugeridas
- Produto: priorizacao por impacto e tempo de entrega
- Engenharia: plataforma multi-tenant, pagamentos e seguranca
- Comercial: prospeccao, demos, fechamento e onboarding
- Sucesso do cliente: ativacao, engajamento e renovacao

## Revisao do plano
- Revisao quinzenal de metas e KPIs
- Repriorizacao mensal baseada em receita e feedback real
