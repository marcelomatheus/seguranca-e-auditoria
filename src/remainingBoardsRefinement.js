/**
 * The baseline of every board is the PREVIOUS ACADEMIC PROPOSAL
 * (DeliMarket proposal diagram and the detailed continuity plan),
 * not the company's 2023 pre-project incident.
 * Proposals are not evidence of actual implementation.
 * Each entry is [id, previous proposal, refined proposal, remaining gap, justified measure].
 */
const proposals = {
 assets: {
  intro: 'Aprofundamento da matriz e da BIA já propostas: donos, rastreabilidade e risco residual.',
  baseline: 'O trabalho anterior já propunha matriz qualitativa R1–R11, probabilidade/impacto, BIA, controles, responsáveis sugeridos e indicadores.',
  entries: [
   ['inventory','Matriz R1–R11 e ativos citados','Inventário vinculando ativos e riscos','A matriz anterior identifica sistemas e riscos, mas não relaciona cada controle a um identificador de ativo e seu proprietário.','Criar inventário versionado com proprietário, criticidade, dependências e vínculo com riscos e controles.'],
   ['owners','Responsáveis sugeridos no cronograma','Propriedade formal por ativo','O plano já sugere equipes responsáveis por ações, mas não atribui um proprietário de negócio a cada ativo crítico.','Definir proprietário, custodiante e aprovador por ativo e uma agenda de revisão.'],
   ['class','Dados classificados e criticidade proposta','Classificação aplicada por ativo','O projeto anterior já propõe classes de informação e criticidade por processo; falta demonstrar sua aplicação consistente nos sistemas.','Relacionar classes a requisitos de acesso, retenção e criptografia e verificar a aplicação.'],
   ['dependencies','Arquitetura híbrida e dependências mapeadas','Dependências verificadas por cenário','A arquitetura e a BIA anteriores apontam dependências, mas não trazem evidências de testes de efeitos em cascata.','Vincular componentes às dependências operacionais e realizar exercícios de indisponibilidade controlada.'],
   ['threat','Matriz de riscos com probabilidade e impacto','Critérios e premissas rastreáveis','O documento anterior já avalia probabilidade, impacto e base de riscos; pode explicitar melhor a escala e evidências de atualização.','Formalizar critérios de pontuação, premissas, periodicidade e revisão após mudanças.'],
   ['scenarios','Riscos R1–R11 com base e gravidade','Cenários ligados a controles e provas','A matriz qualitativa já existe; ainda falta vincular cada cenário à eficácia do controle correspondente.','Criar relacionamento cenário → ativo → controle → teste → evidência de auditoria.'],
   ['bia','BIA e RPO/RTO propostos por serviço','BIA aprovada e exercitada','O plano detalhado já sugere BIA e metas por serviço, mas os valores permanecem premissas sem aprovação real.','Formalizar homologação da direção e comparar resultados medidos em ensaios com metas aprovadas.'],
   ['matrix','Riscos priorizados e plano de ações','Risco residual fundamentado','O projeto anterior já prioriza riscos e ações; falta registrar a exposição após o controle e a decisão de aceitação.','Reavaliar probabilidade/impacto após ensaios e coletar aceite formal do proprietário do risco.'],
   ['treat','Plano com responsáveis, prazos e prioridade','Tratamento com eficácia verificada','O cronograma anterior já apresenta responsáveis e prazos; o próximo passo é comprovar conclusão e eficácia.','Associar ações a critérios de aceite, custos comparativos, evidências e teste posterior.'],
   ['residual','Redução de riscos por controles propostos','Risco residual avaliado e aprovado','Os riscos são tratados por medidas propostas, mas não há resultados empíricos que sustentem o risco remanescente.','Medir ou estimar exposição pós-controle e exigir aprovação fundamentada da direção.'],
   ['audit','Logs, auditoria e indicadores propostos','Testes auditáveis por controle','A proposta já prevê logs e relatórios periódicos; falta uma matriz que conecte cada risco a evidência de funcionamento.','Definir teste, amostra, responsável, periodicidade, resultado e tratamento de achados.'],
   ['kri','KPIs e metas de acompanhamento propostas','KRIs com limites e escalonamento','O documento detalhado já estabelece indicadores e metas; não define limites operacionais de escalonamento para todos os riscos.','Criar indicadores de risco com limites, destinatários, prazo de resposta e registro de decisões.']
  ]
 },
 identity:{
  intro:'Refinamento dos controles lógicos e de acesso já previstos: formalização, identidade e auditoria.',
  baseline:'O plano anterior já inclui MFA administrativo/remoto, menor privilégio, perfis, segregação de funções, revisão trimestral, logs e segmentação.',
  entries:[
   ['request','Perfis e privilégio mínimo propostos','Solicitação com aprovação e prazo','Os perfis já foram definidos conceitualmente; ainda falta fluxo documentado de solicitação e aprovação individual.','Exigir justificativa, proprietário aprovador, prazo e registro por concessão.'],
   ['joiner','Perfis por área e revisão de acesso','Workflow de admissão, mudança e saída','O projeto anterior propõe perfis e revisões trimestrais, mas não detalha eventos de admissão, mudança e desligamento.','Formalizar workflow JML com aprovação, recálculo de privilégios e revogação rastreável.'],
   ['move','Menor privilégio e revisão trimestral','Recertificação na mudança de função','O plano prevê revisões, mas não especifica a remoção imediata de permissões obsoletas quando a função muda.','Revogar acessos antigos antes de liberar novas permissões e registrar a mudança.'],
   ['offboard','Cancelamento de acesso físico e revisões','Desligamento lógico com checklist','O documento anterior exige revogação de acesso físico e revisão de permissões; falta checklist integrado para VPN, IdP e serviços externos.','Coordenar RH e TI para revogar sessões, contas e tokens no desligamento e conferir logs.'],
   ['password','MFA e menor privilégio, sem norma de senha','Política de senha com critérios testáveis','O plano anterior enfatiza MFA e controle de acesso, mas não especifica uma política detalhada de senhas.','Definir comprimento, senhas comprometidas, gerenciadores, reset, bloqueios e testes de implementação.'],
   ['mfa','MFA administrativo e remoto proposto','MFA forte com recuperação segura','MFA já faz parte do projeto anterior; falta especificar fator aceitável, proteção contra phishing e recuperação de credenciais.','Padronizar fatores por risco, credenciais resistentes a phishing para acessos sensíveis e recuperação auditável.'],
   ['rbac','Menor privilégio e perfis por área','Matriz RBAC por operação','O projeto anterior prevê menor privilégio e perfis, porém sem tabela de permissões por operação crítica.','Criar matriz função × sistema × permissão e validar segregação de funções com os gestores.'],
   ['sod','Separação de funções já proposta','Matriz SoD com conflitos e testes','O plano detalhado separa administradores do ERP e backups; faltam conflitos transacionais do negócio e testes de aplicação.','Definir combinações incompatíveis para estoque, pagamento, faturamento e administração, com análise de exceções.'],
   ['service','Contas de serviço não utilizadas por pessoas','Cofre e rotação para integrações','O projeto anterior já distingue contas técnicas de login humano; não explicita custódia, rotação e escopo de credenciais de integração.','Criar inventário de identidades técnicas, cofre de segredos e acesso mínimo com rotação registrada.'],
   ['privileged','MFA e acessos administrativos protegidos','PAM com sessão auditada','A proposta anterior já aplica MFA e proteção administrativa; não detalha concessões temporárias nem gravação de ações privilegiadas.','Adotar elevação sob demanda, expiração automática e trilhas específicas para administração crítica.'],
   ['reviews','Revisão trimestral de acessos prevista','Recertificação com aceite do gestor','O documento anterior já prevê revisão trimestral; precisa definir o fluxo de decisão e a comprovação da remoção.','Solicitar aceite por proprietário, executar revogações e auditar pendências de revisão.'],
   ['logs','Logs centralizados e protegidos propostos','Correlação e alertas acionáveis','O trabalho anterior já propõe logs centralizados protegidos; falta explicitar correlação e acionamento para eventos críticos.','Criar alertas para falhas de MFA, elevações, mudanças de perfis e tentativas anômalas, com responsáveis.']
  ]
 },
 restore:{
  intro:'Detalhamento da política de backup e restauração já prevista, com validação dos resultados.',
  baseline:'O plano anterior já prevê backups full/incrementais/log, 3-2-1, imutabilidade, KMS, restore semanal/mensal, failover trimestral e simulação anual.',
  entries:[
   ['schedule','Full semanal, incremental diário e logs a 5/15 min','Rotina auditável com alertas','O plano anterior já define frequência de full, incremental e logs, com diferenças entre o visual (15 min) e o detalhado (5 min).','Homologar frequência após BIA, monitorar janela, sucesso, atraso e capacidade de recuperação.'],
   ['protect','Regra 3-2-1 e imutabilidade propostas','Proteção testada em laboratório','A política anterior já usa 3-2-1, versionamento e imutabilidade; sua eficácia ainda depende de testes de recuperação e privilégios.','Testar restauração e tentativas de exclusão, vinculando falhas a ações corretivas.'],
   ['copies','NAS local + nuvem imutável + cópia externa','Isolamento e retenção comprovados','O diagrama anterior já prevê três cópias distribuídas por locais e mídias; falta evidência de isolamento e restauração entre locais.','Validar integridade, segregação de contas, prazo de retenção e restauração de cada destino.'],
   ['keys','AES-256 e gestão KMS/HSM propostas','Chaves recuperáveis com custódia','O documento anterior já descreve KMS, hierarquia, rotação, custódia dupla e cópia de recuperação.','Exercitar perda de credenciais e recuperação de chave sob custódia com registro de participantes.'],
   ['detect','Monitoramento de backups e alertas previstos','Triage por severidade e SLA','O plano já prevê alertas e resposta a incidentes; falta associar cada evento a uma gravidade, prazo e ação definida.','Classificar falha de job, corrupção e ransomware, atribuindo plantão e escalonamento.'],
   ['isolate','Fluxo detectar → isolar → restaurar','Contenção com critérios de segurança','O diagrama anterior já define detecção e isolamento; ainda precisa de condições verificáveis para liberar a etapa de restauração.','Definir checklist de contenção, preservação de evidência e liberação do ambiente limpo.'],
   ['source','Validar integridade antes de retomar','Seleção documentada de ponto limpo','O plano anterior já exige validação de integridade e consistência; pode aprofundar seleção da cópia segura após incidente.','Verificar hashes, ponto de recuperação, indícios de comprometimento e autorização para restauro.'],
   ['infra','Runbooks e dependências já recomendados','Ordem de dependências executável','O texto anterior já pede runbooks, mas a sequência de rede, identidade, banco e aplicação ainda pode ser operacionalizada.','Definir pré-requisitos, pontos de verificação e responsáveis por serviço antes da restauração de ERP.'],
   ['db','Restauração mensal do banco com totais','PITR e reconciliação transacional','A proposta anterior já exige restore mensal com conferência de totais e backup de log; falta ensaio de restauração ponto no tempo.','Executar PITR até instante aprovado e reconciliar pedidos, estoque e transações fiscais.'],
   ['restore','Restaurar → validar → retomar; testes mensais','Runbook com critérios de aceite','A política anterior contém sequência de recuperação e testes periódicos; a lacuna é a granularidade do procedimento e da aprovação do negócio.','Detalhar comandos/responsáveis, recuperação segura, validação e aceite do gestor antes da liberação.'],
   ['validate','Integridade e totais já conferidos em teste','Aceite formal da operação','O plano já prevê conferir pedidos e estoque durante a restauração; não define formalização da aprovação para retomar a produção.','Documentar amostras, totais esperados, divergências e assinatura de responsável operacional.'],
   ['rpor','RPO 15/5 min e RTO 4/1h como metas','Metas homologadas e medidas','O plano visual sugere 15 min/4 h e o detalhado 5 min/1 h: ambas são propostas e precisam ser decididas pela direção.','Homologar BIA e aferir tempo e perda reais por cenário, registrando desvios.']
  ]
 },
 lifecycle:{
  intro:'Ciclo de dados e LGPD já propostos, refinados por responsáveis, verificações e rastreabilidade.',
  baseline:'O plano anterior já especifica finalidade, minimização, classificação, criptografia, pseudonimização no BI, retenção, descarte, DPO e direitos do titular.',
  entries:[
   ['collect','Coleta minimizada com finalidade e base legal','Finalidade documentada por processo','O plano anterior já determina coleta mínima, finalidade e base legal; falta associar cada sistema e campo a um registro verificável.','Documentar finalidade, base legal, dados e responsável por operação de tratamento.'],
   ['catalog','Inventário e ROPA recomendados','ROPA atualizado e auditável','O documento anterior já recomenda inventário pessoal e registro de operações (ROPA); falta processo de atualização e evidência de cobertura.','Vincular sistemas a tratamentos, responsáveis e revisão periódica documentada.'],
   ['legal','Finalidade, transparência e base legal','Matriz por tratamento revisada','Finalidade e hipótese legal já constam das diretrizes; falta mapeamento detalhado das bases aplicáveis a cada operação.','Validar com jurídico matriz finalidade, categoria, base legal, aviso e alteração de finalidade.'],
   ['use','Acesso por perfil e finalidade informada','Uso rastreável e revisto','O plano anterior já restringe uso à finalidade e ao perfil; falta verificar usos secundários e exportações.','Registrar acessos sensíveis, revisar exportações e exigir justificativas para exceções.'],
   ['quality','Validação de ETL, totais e qualidade','Linhagem e testes de qualidade','O plano detalhado já exige validação de ETL e conciliação diária ERP × BI; pode acrescentar rastreio de origem e tratamento de inconsistências.','Registrar origem e versão de cada carga, erros de esquema e reconciliação automatizada.'],
   ['minimize','Agregação e pseudonimização no BI','Mascaramento validado por perfil','A proposta anterior já indica pseudonimização/agregação no BI; não demonstra por quais perfis e consultas os identificadores ficam ocultos.','Aplicar políticas de mascaramento e testar consultas e exportações para cada papel.'],
   ['classify','Dados classificados e donos indicados','Classificação aplicada com revisões','O diagrama anterior prevê categorias e donos dos dados; falta formalizar revisão e evidência de aplicação das etiquetas.','Revisar classificações por categoria e associá-las a acessos e retenção.'],
   ['store','Criptografia TLS/AES e backup 3-2-1','Proteção validada em repouso e trânsito','O estudo anterior já propõe TLS, AES-256, proteção em armazenamento e backups; falta evidenciar cobertura e exceções.','Inventariar fluxos, revisar configurações e testar acesso e recuperação de chaves.'],
   ['retain','Temporalidade e descarte propostos','Prazos aprovados por categoria','O projeto anterior já traz prazos exemplificativos e propõe tabela de temporalidade; não aprova prazo legal individual por tipo de dado.','Jurídico e contabilidade homologam prazos, gatilhos e bloqueios legais por categoria.'],
   ['temporal','Tabela de temporalidade recomendada','Tabela versionada e fiscalizada','O plano anterior já prevê tabela de retenção por finalidade e prazo; é preciso provar atualização e aplicação.','Vincular prazo, fundamento, proprietário, destino e rotina de revisão por classe de dado.'],
   ['delete','Descarte seguro e sanitização NIST previstos','Descarte com cadeia de evidências','O trabalho anterior já especifica descarte seguro, clear/purge/destroy e certificado; falta definir processo de verificação da execução.','Registrar solicitação, sanitização, aprovação e comprovante por mídia ou conjunto de dados.'],
   ['replay','Reaplicação de exclusões após restore prevista','Reconciliação automática pós-restore','O documento detalhado já prevê registrar exclusões e reaplicá-las quando um backup antigo for restaurado.','Automatizar a reconciliação de exclusões válidas antes de disponibilizar a base restaurada e auditar o resultado.']
  ]
 },
 policy:{
  intro:'Formalização e governança sobre controles que o plano anterior já descrevia.',
  baseline:'O projeto anterior já define diretrizes, responsáveis sugeridos, auditoria, logs, resposta a incidentes, gestão de chaves, backup e indicadores.',
  entries:[
   ['board','Diretrizes e governança com diretoria prevista','PSI formalmente aprovada','O plano anterior já atribui decisões e relatórios à direção; falta documento institucional de PSI com aprovação e vigência.','Formalizar PSI com aprovação, versão, responsável, escopo e ciclo de revisão.'],
   ['scope','Diretrizes de segurança e escopo no plano','Escopo normativo e exceções','O trabalho anterior descreve objetivos de proteção, mas não constitui PSI institucional assinada.','Publicar escopo, abrangência, deveres e exceções em uma política formal.'],
   ['owners','DPO, TI e donos dos dados sugeridos','RACI vinculada a controles','O diagrama anterior já propõe DPO, TI e responsáveis de negócio; faltam critérios de aprovação e substituição por controle.','Construir RACI por processo, política e dado, com aceite dos envolvidos.'],
   ['roles','Cronograma com responsáveis sugeridos','RACI e prestação de contas','O cronograma original já lista responsáveis por ação; a reengenharia deve explicitar a responsabilidade duradoura após a implantação.','Formalizar papéis responsáveis, aprovadores e pontos de escalonamento de cada controle.'],
   ['standards','Regras técnicas descritas em seções','Normas operacionais versionadas','A proposta anterior detalha backup, acesso, criptografia, LGPD e incidentes; as regras ainda não foram publicadas como normas obrigatórias.','Consolidar política e procedimentos com versões, donos, prazo de revisão e evidência de ciência.'],
   ['passwords','MFA, menor privilégio e perfis propostos','Norma específica de senhas','O plano anterior propõe MFA e autorização, mas não descreve requisitos completos de escolha, recuperação e proteção de senhas.','Definir tamanho, bloqueio de senhas comprometidas, gerenciamento, recuperação e controles de força bruta.'],
   ['backup','Política 3-2-1 e rotina de testes definida','Procedimentos e aceite registrados','O projeto anterior já especifica frequência, retenção, cifragem e testes semanais, mensais, trimestrais e anuais.','Publicar runbook obrigatório com responsáveis, evidências, prazos de correção e validação de restauração.'],
   ['usage','Classificação, LGPD e acesso por perfil','Norma de uso aceitável','O plano anterior já define controles sobre dados e acesso; falta uma norma operacional de uso dos dispositivos e canais.','Definir regras de uso de dispositivos, transferência, compartilhamento e tratamento por categoria.'],
   ['train','Treinamento previsto no cronograma','Programa recorrente e avaliado','O plano anterior já programa capacitação de TI e logística; não define avaliação do aprendizado nem periodicidade de reforço.','Criar calendário de treinamento, simulações e registro de resultados por função.'],
   ['incident','Alertas, isolamento, runbooks e resposta previstos','Resposta com severidade e SLA','O plano anterior já prevê resposta a incidentes e comunicação de crise; falta matriz de severidade, escalonamento e exercícios registrados.','Definir categorias, responsáveis, prazos e critério de encerramento, com simulações e post-mortem.'],
   ['exceptions','SLA com fornecedores e controles previstos','Exceções com prazo e compensação','O plano anterior prevê contratos de nuvem e ISPs e controles de acesso; não detalha exceções temporárias a políticas.','Registrar exceções com aprovador, justificativa, vencimento e controles compensatórios.'],
   ['audit','Auditoria, relatório à direção e revisão anual','PDCA com achados rastreáveis','O trabalho anterior já prevê auditoria, monitoramento e revisão anual; falta rotina de abertura, correção e reteste de achados.','Atribuir dono e prazo a não conformidades, registrar reavaliação e revisar indicadores.']
  ]
 },
 roadmap:{
  intro:'Do cronograma de implantação anterior ao acompanhamento da eficácia das entregas.',
  baseline:'O plano anterior já tem quatro fases, responsáveis, prazos, prioridades, metas de KPI e atividades de restauração, energia, nuvem e LGPD.',
  entries:[
   ['phase1','Fase 1: energia, backup e contingência','Comprovação dos controles prioritários','O plano anterior já prevê testar backups/energia e executar contingência imediatamente; falta definir aceite e acompanhamento sistemático dos resultados.','Vincular entregas da fase a testes, responsáveis, evidências e pendências de risco.'],
   ['restore','Teste de restore já previsto nos 0–15 dias','Restore com critério de aceite','O cronograma anterior já exige testar a restauração inicial e corrigir a rotina.','Registrar pontos de restauração, dados reconciliados, tempo real e aprovação.'],
   ['energy','Teste de nobreak/gerador nos 0–30 dias','Teste de carga com plano corretivo','O cronograma anterior já exige testar energia redundante sob carga e revisar manutenção.','Documentar autonomia, resultado da transferência, falhas e prazo de correção.'],
   ['inventory','Diagnóstico de riscos e dados já proposto','Inventário rastreável de ativos','O trabalho anterior já identifica sistemas críticos e prevê inventário de dados pessoais, mas não centraliza donos e dependências por ativo.','Entregar inventário versionado com dono, risco e evidência de revisão.'],
   ['phase2','Fase 2: BIA, MFA, política e sensores','Governança testável de acessos','O plano original já programa BIA, autenticação forte e controles físicos entre 30 e 90 dias.','Associar cada entrega a aprovação, política publicada, teste de execução e ação corretiva.'],
   ['mfa','Ativação de MFA, perfis e segregação prevista','MFA/RBAC validados e auditados','O cronograma anterior já inclui MFA, perfis e separação de funções.','Validar cobertura em contas críticas, revisar exceções e demonstrar remoção de acessos indevidos.'],
   ['psi','Políticas de acesso/backup e LGPD descritas','PSI institucional aprovada','O estudo anterior já traz diretrizes e políticas setoriais, mas não consolida uma PSI com aprovação formal.','Publicar PSI, obter ciência dos usuários e designar responsáveis pela manutenção.'],
   ['monitor','Alertas, logs e KPIs já planejados','Monitoramento com escalonamento','O plano anterior já define telemetria e indicadores para backup, replicação, energia e acessos.','Configurar limites, responsável de plantão, prazo para resposta e registros de acionamento.'],
   ['phase3','Fase 3: DR, BI e failover na nuvem','Resiliência demonstrada em ensaios','O cronograma anterior já prevê construir DR, separar BI e testar failover até 180 dias.','Exigir relatórios de teste e análise das diferenças de RPO/RTO antes do aceite.'],
   ['dr','Standby e réplica em nuvem previstos','Failover/failback homologados','O trabalho anterior já propõe DR em nuvem e primeiro teste de failover.','Medir promoção, retorno, integridade de pedidos e aprovação do negócio.'],
   ['phase4','Fase 4: LGPD, capacitação e revisão','Auditoria com correções verificadas','O plano anterior já prevê treinamento, auditoria ISO e simulação anual de desastre.','Acompanhar achados, responsáveis, retestes e risco residual aceito.'],
   ['audit','Diagnóstico ISO e simulação anual previstos','Plano de auditoria com follow-up','O cronograma anterior já contém diagnóstico de lacunas e simulação anual.','Definir amostras, evidências, SLA de achados, verificação de correção e relatório à direção.']
  ]
 }
}

const byId = Object.fromEntries(Object.entries(proposals).map(([id, data]) => [
 id, {intro:data.intro, baseline:data.baseline, entries:Object.fromEntries(data.entries.map(([nodeId,before,after,problem,solution])=>[
   nodeId,{before,after,problem,solution}
 ]))]}
]))

export function refineRemainingBoards(board){
 const specification=byId[board.id]
 if(!specification)return board
 return {
  ...board,
  intro:specification.intro,
  baseline:specification.baseline,
  nodes:board.nodes.map(node=>({...node,...specification.entries[node.id]}))
 }
}
