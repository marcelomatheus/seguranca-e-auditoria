export const ENHANCEMENTS = {
 architecture:{
  zones:[['Operação e acesso','Pedidos, CD, filiais e proteção de borda'],['Data center primário','Operação transacional, energia e dados'],['Continuidade e nuvem','Recuperação, integrações e análise'],['Governança e segurança','Telemetria, auditoria e resposta']],
  existing:{erp:1,database:1,power:1,connectivity:0,recovery:2},
  extra:[
   ['users',0,'Clientes e filiais','Users','Acesso direto e dependente do site','Perfis segregados por canal','Pedidos e CD dependem do único ponto de acesso.','Separar clientes, filiais, logística e administração com autorização por função.','Reduz impacto lateral de acessos indevidos.','Matriz de acesso e trilha por perfil.','high'],
   ['edge',0,'Perímetro e VPN','Shield','Borda sem política demonstrada','Firewall + WAF + VPN','A filtragem não está demonstrada no caso.','Segmentar tráfego entre internet, aplicações, filiais e administração; registrar regras e exceções.','Diminui exposição de serviços críticos.','Inventário de regras e teste de segmentação.','high'],
   ['lan',0,'Rede corporativa','Network','Conectividade centralizada','SD-WAN e rotas distintas','Filiais ficam isoladas quando o link principal falha.','Configurar redundância real de provedores e testes automáticos da comutação.','Mantém pedidos de centros de distribuição.','Teste de indisponibilidade do link.','high'],
   ['backup',1,'Backup operacional','HardDrive','Cópia local não validada','NAS + cópia externa imutável','A cópia mais recente estava corrompida no incidente.','Aplicar retenção versionada, segregação de credenciais e restauração em ambiente limpo.','Reduz perda irreversível de pedidos.','Histórico de jobs, teste de restore.','critical'],
   ['physical',1,'Ambiente físico','Thermometer','Sem evidência de sensores','Temperatura + incêndio + acesso','Uma falha física pode interromper toda a operação.','Monitorar temperatura, fumaça, acesso à sala e circuitos; definir plantão e alertas.','Protege a infraestrutura de incidentes locais.','Eventos ambientais e teste de alarmes.','high'],
   ['etl',2,'Integração ETL / API','GitBranch','BI dependente do ERP','Carga incremental e conciliação','Falhas transacionais deixam painéis desatualizados.','Desacoplar o pipeline analítico, validar totais e controlar atraso das cargas.','Gestão continua tomando decisões na crise.','Conciliação ERP × BI e SLA do ETL.','high'],
   ['warehouse',2,'Data warehouse','Database','Consulta ligada ao operacional','Repositório analítico isolado','Consultas analíticas competem com o ERP.','Armazenar dados tratados em camada independente com anonimização quando cabível.','Reduz carga na base transacional.','Métricas de latência e segregação.','medium'],
   ['bi',2,'BI executivo','ChartNoAxesCombined','Painéis sem resiliência','Dashboards e indicadores de crise','Diretoria pode perder visão do estoque e logística.','Oferecer painel de disponibilidade, perdas, entregas e atualização dos dados.','Suporta decisões durante incidentes.','Tempo da última carga e reconciliação.','medium'],
   ['immutable',2,'Backup off-site','CloudUpload','Ausência de isolamento validado','Criptografado + imutável','Desastre físico afeta cópias no mesmo local.','Replicar backup a outra região/conta, com chave separada e retenção bloqueada.','Sobrevive à perda total do data center.','Teste de cópia externa e imutabilidade.','critical'],
   ['soc',3,'Detecção e resposta','Radar','Monitoramento fragmentado','Logs, EDR e alertas','Falhas e intrusões podem demorar a ser percebidas.','Correlacionar alertas de ERP, rede, réplica, backup e identidade com runbooks.','Reduz tempo até detecção e contenção.','Incidentes registrados e MTTD.','high'],
   ['bia',3,'BIA e continuidade','ClipboardCheck','Metas sem aprovação formal','RPO/RTO por criticidade','Duas versões do plano sugerem metas distintas.','Aprovar metas com a direção após análise de impacto, testar e revisar periodicamente.','Investimento proporcional ao impacto.','BIA aprovada e atas de failover.','high'],
   ['kms',3,'Criptografia e chaves','KeyRound','Recomendação geral','TLS, AES-GCM e KMS','Criptografia sem custódia de chaves não garante recuperação.','Aplicar TLS, proteção em repouso, separação de chaves e testes de recuperação.','Protege dados e viabiliza restore seguro.','Inventário de chaves e teste de acesso.','high']
  ],
  links:[['users','edge','acesso'],['edge','lan','VPN'],['lan','erp','pedidos'],['connectivity','lan','redundância'],['power','erp','energia'],['physical','power','ambiente'],['erp','database','transações'],['database','backup','cópia'],['database','recovery','replicação'],['backup','immutable','off-site'],['database','etl','extrai'],['etl','warehouse','valida'],['warehouse','bi','indicadores'],['soc','recovery','alertas'],['bia','recovery','RTO/RPO'],['kms','immutable','chaves']]
 },
 assets:{
  zones:[['Descoberta','O que precisa ser protegido'],['Avaliação','Vulnerabilidades, ameaças e impactos'],['Tratamento','Controles e risco residual'],['Verificação','Governança e auditoria']],
  existing:{inventory:0,threat:1,matrix:2,audit:3},
  extra:[
   ['owners',0,'Donos dos ativos','Users','Sem propriedade demonstrada','RACI por ativo','Não há responsabilização operacional observável.','Atribuir responsáveis, custodiante técnico e periodicidade de revisão.','Evita ativos sem proteção.','Inventário assinado.','high'],
   ['class',0,'Classificação','Tags','Criticidade sem inventário','Público a restrito','ERP e dados pessoais exigem controles diferentes.','Classificar por confidencialidade, integridade, disponibilidade e impacto.','Garante investimento proporcional.','Inventário classificado.','high'],
   ['dependencies',0,'Dependências','Workflow','Sistemas tratados em blocos','Mapa de interdependência','A falha elétrica afeta ERP, BI e logística em cascata.','Mapear energia, link, rede, autenticação, banco, ETL e parceiros.','Encontra falhas sistêmicas.','Diagrama de dependência validado.','critical'],
   ['scenarios',1,'Cenários R1–R6','AlertTriangle','Riscos qualitativos isolados','Probabilidade × impacto','O plano descreve riscos mas não explicita critério comparável.','Pontuar cenários, evidências e incertezas, preservando a distinção entre fatos e hipóteses.','Priorização defendível.','Matriz de risco com critérios.','high'],
   ['bia',1,'Impacto ao negócio','ClipboardCheck','18h de queda observadas','BIA por processo','Não há tolerância documentada por pedidos, estoque e faturamento.','Estimar impacto operacional, perda de dados e dependências por processo.','Evita gastar em controles sem valor.','BIA aprovada.','critical'],
   ['appetite',2,'Apetite a risco','Gauge','Sem critério formal','Limites de aceitação','Aceitar riscos informalmente enfraquece governança.','Diretoria aprova limites e escalonamento dos cenários críticos.','Decisões auditáveis.','Ata da direção.','medium'],
   ['treat',2,'Plano de tratamento','ListChecks','Mitigações listadas','Responsável, prazo e custo','Controle proposto sem responsável pode não ser implantado.','Definir prioridade, dono, evidência de aceite, custo relativo e dependências.','Execução mensurável.','Registro de ações e entregas.','high'],
   ['residual',2,'Risco residual','ShieldCheck','Redução presumida','Reavaliação após controle','Implantação não elimina completamente as ameaças.','Recalcular exposição e formalizar aceitação após testes.','Transparência à direção.','Risco residual documentado.','medium'],
   ['findings',3,'Não conformidades','FileWarning','Sem fluxo de achados','Correção com SLA','Constatações de auditoria podem ficar pendentes.','Abrir achado, evidência, responsável, prazo, reteste e fechamento.','Elimina recorrência.','Relatório de achados.','high'],
   ['kri',3,'Indicadores de risco','ChartNoAxesCombined','Métricas operacionais','KRIs e tendência','Disponibilidade isolada não mede risco de exposição.','Medir contas órfãs, backups inválidos, alertas, revisão de privilégios e exceções.','Antecipação de incidentes.','Painel mensal de KRIs.','medium']
  ],
  links:[['inventory','owners'],['owners','class'],['class','dependencies'],['dependencies','threat'],['threat','scenarios'],['scenarios','bia'],['bia','matrix'],['matrix','treat'],['treat','residual'],['residual','audit'],['audit','findings'],['findings','kri']]
 },
 identity:{
  zones:[['Ciclo de vida','Entrada, alteração e saída'],['Autenticação','Fatores e credenciais'],['Autorização','Permissões por papel'],['Supervisão','Acesso privilegiado e trilhas']],
  existing:{joiner:0,password:1,rbac:2,privileged:3},
  extra:[
   ['request',0,'Solicitação de acesso','FilePlus','Concessões pontuais','Aprovação por owner','A solicitação informal não garante necessidade.','Criar ticket vinculado ao cargo, justificativa, data e aprovação do gestor.','Menor exposição por concessões.','Trilha de solicitações.','high'],
   ['move',0,'Mudança de função','RefreshCw','Permissões antigas persistem','Remover antes de conceder','Promoção pode acumular privilégios incompatíveis.','Aplicar workflow joiner-mover-leaver e reconciliação de papéis.','Evita privilégios acumulados.','Logs de provisionamento.','high'],
   ['offboard',0,'Desligamento','UserX','Revogação não descrita','Revogação imediata','Credenciais válidas após o desligamento representam risco.','Desabilitar IdP, VPN, tokens, sessões e contas de terceiros no término.','Reduz acessos não autorizados.','Relatório de contas revogadas.','critical'],
   ['mfa',1,'MFA por criticidade','Fingerprint','MFA sugerido genericamente','Fatores resistentes a phishing','Credenciais roubadas podem abrir acesso remoto.','Exigir MFA forte para administração, VPN e sistemas críticos, com recuperação segura.','Mitiga roubo de senha.','Política IdP e auditoria.','critical'],
   ['passwordhealth',1,'Senhas comprometidas','KeyRound','Sem teste de credenciais','Bloqueio + rate limit','Senhas vazadas podem ser reutilizadas.','Bloquear senhas comuns/comprometidas; aceitar senhas longas e gerenciadores; limitar tentativas.','Menos tomada de conta.','Teste de política do IdP.','high'],
   ['sod',2,'Segregação de funções','GitFork','Papéis amplos','Matriz SoD','Mesmo operador não deve aprovar e executar operação sensível.','Separar pagamento, cadastro, alteração de estoque e aprovação financeira.','Dificulta fraudes internas.','Matriz de conflitos.','critical'],
   ['service',2,'Identidades de serviço','Bot','Segredos em integrações','Cofre e rotação','Credenciais compartilhadas são difíceis de rastrear.','Usar contas de serviço nominadas, privilégios mínimos e rotação de segredos.','Reduz comprometimento sistêmico.','Inventário e rotação.','high'],
   ['reviews',3,'Recertificação','ClipboardCheck','Revisão periódica genérica','Revisão por owner trimestral','Permissões podem sobreviver a mudanças de função.','Solicitar revisão formal por dono do sistema com evidência e remoção.','Menos acesso indevido.','Atas e relatórios de revisão.','high'],
   ['logs',3,'Trilhas de acesso','ScrollText','Logs propostos','SIEM e correlação','Acesso anômalo pode não ser detectado.','Registrar autenticações, falhas, elevações e alterações de permissão, com alertas.','Rastreabilidade e resposta.','Logs protegidos e alertas.','high'],
   ['breakglass',3,'Acesso emergencial','Siren','Sem procedimento','Break-glass auditável','Incidente pode exigir acesso fora do fluxo normal.','Definir contas de emergência com custódia, expiração, registro e revisão posterior.','Recupera sem perder controle.','Registro de acionamento.','medium']
  ],
  links:[['request','joiner'],['joiner','move'],['move','offboard'],['joiner','password'],['password','mfa'],['mfa','rbac'],['rbac','sod'],['rbac','service'],['sod','privileged'],['privileged','reviews'],['privileged','logs'],['breakglass','logs']]
 },
 restore:{
  zones:[['Proteção','Cópias, frequência e confiança'],['Detecção e contenção','Decidir quando e de onde recuperar'],['Restauração operacional','Sequência técnica validada'],['Retomada e prova','Verificar integridade e medir metas']],
  existing:{protect:0,isolate:1,restore:2,measure:3},
  extra:[
   ['schedule',0,'Calendário de backup','CalendarClock','Rotina sem aferição real','Full, incremental e WAL','Uma cópia antiga não atende perda aceitável de dados.','Executar full semanal, incremental diário e logs conforme BIA; observar atraso e falhas.','Menos perda de pedidos.','Relatório diário dos jobs.','critical'],
   ['copies',0,'Cópias e localidade','HardDriveDownload','Backup no mesmo ambiente','3-2-1 com isolamento','Incêndio e ransomware atingem local e cópia.','Cópia local, mídia distinta e imutável fora do site, com credenciais segregadas.','Resiliência contra desastre.','Inventário das cópias.','critical'],
   ['keys',0,'Chaves e cofres','KeyRound','Criptografia isolada','KMS + custódia dupla','A perda da chave torna a cópia inútil.','Testar recuperação das chaves, rotação e segregação de funções.','Preserva confidencialidade e restauração.','Ata de recuperação de chave.','high'],
   ['detect',1,'Alerta e classificação','BellRing','Detecção tardia','Runbook por severidade','A resposta pode atrasar diante de corrupção ou ransomware.','Alertas sobre jobs, integridade, alteração em massa e replicação, com acionamento humano.','Resposta mais rápida.','Log e cronologia do incidente.','high'],
   ['source',1,'Escolha do ponto limpo','ScanSearch','Cópia restaurada sem critério','Ponto íntegro verificado','Restaurar cópia contaminada pode reiniciar o incidente.','Verificar hashes, consistência e evidência de malware antes da recuperação.','Evita reinfecção.','Checklist de integridade.','critical'],
   ['infra',2,'Infraestrutura base','Server','Ordem indefinida','Rede → identidade → serviços','ERP não sobe sem DNS, acesso, serviços e banco.','Recuperar primeiro rede, identidade, armazenamento e dependências.','Menos retrabalho em desastre.','Runbook de dependências.','high'],
   ['db',2,'Banco transacional','Database','Restauração de cópia antiga','PITR e validação transacional','Pedidos podem divergir do estoque.','Restaurar full, incrementais e logs até ponto seguro; testar integridade.','Reduz inconsistência de negócio.','DBCC/checksums e reconciliação.','critical'],
   ['apps',2,'ERP e integrações','Boxes','Religamento genérico','Subida em camadas','Serviços indisponíveis isolam filiais e BI.','Subir ERP, APIs, filas, ETL e BI com healthchecks e isolamento controlado.','Retomada coordenada.','Checklist por serviço.','high'],
   ['validate',3,'Conciliação funcional','ClipboardCheck','Validação genérica','Pedidos × estoque × fiscal','Banco tecnicamente íntegro pode conter perdas de transações.','Conferir totais, amostras, faturamento, saldos e pedidos pendentes com usuários-chave.','Confiança para liberar o serviço.','Termo de aceite do negócio.','critical'],
   ['rpor',3,'Medição RPO e RTO','Timer','15min/4h ou 5min/1h','Metas BIA aprovadas','Documentos apresentam metas distintas.','Medir tempo real desde incidente e perda confirmada; comparar à BIA aprovada.','Metas realistas e verificáveis.','Relatório de simulação.','high'],
   ['lessons',3,'Lições aprendidas','FileCheck2','Revisão eventual','Reteste e correção','Falhas repetem sem responsável e prazo.','Registrar causa-raiz, ações corretivas, dono, prazo e teste de eficácia.','Maturidade crescente.','Plano de ação encerrado.','medium']
  ],
  links:[['schedule','protect'],['protect','copies'],['copies','keys'],['copies','detect'],['detect','isolate'],['isolate','source'],['source','infra'],['infra','db'],['db','restore'],['restore','apps'],['apps','validate'],['validate','measure'],['measure','rpor'],['rpor','lessons']]
 },
 lifecycle:{
  zones:[['Entrada e identificação','Minimização e bases legais'],['Tratamento e circulação','ERP, ETL, BI e acesso'],['Guarda e conservação','Classificação, storage e retenção'],['Eliminação e governança','Exclusão, titulares e evidências']],
  existing:{collect:0,classify:2,use:1,retain:2},
  extra:[
   ['catalog',0,'ROPA e inventário','ListChecks','Tratamentos não rastreados','Registro das operações','Não é possível evidenciar finalidade de cada dado.','Mapear coleta, fonte, finalidade, base legal, responsáveis e compartilhamentos.','Transparência e governança.','ROPA atualizado.','high'],
   ['legal',0,'Base legal e aviso','BookOpen','Finalidade genérica','Matriz finalidade × base','Tratamentos podem não ter justificativa documentada.','Registrar a hipótese aplicável e informação ao titular por processo.','Menos risco regulatório.','Matriz revisada pelo jurídico.','high'],
   ['quality',1,'Qualidade da informação','ListChecks','Validação de ETL proposta','Consistência e linhagem','Dado incorreto propagado gera decisão errada.','Validar schema, conciliar totais, registrar origem e corrigir divergências.','Indicadores confiáveis.','Logs ETL e conciliação.','medium'],
   ['minimize',1,'Pseudonimização no BI','EyeOff','Dados identificáveis no BI','Redução da superfície de dados','Painéis raramente precisam de identificação completa.','Mascarar identificadores, agregar métricas e limitar exportação.','Mitiga vazamentos analíticos.','Teste de permissões e amostras.','high'],
   ['store',2,'Armazenamento seguro','Database','ERP e backups centralizados','Criptografia e segregação','Acúmulo concentra impactos em caso de vazamento.','Criptografia em repouso e trânsito, chaves segregadas e acesso por dado.','Protege confidencialidade.','Configuração e logs de chaves.','high'],
   ['temporal',2,'Tabela de temporalidade','CalendarRange','Prazos ilustrativos','Prazo por categoria e lei','Prazo fiscal ilustrativo não cobre todos os dados.','Jurídico define fundamento, retenção e exceções legais por categoria.','Menos exposição desnecessária.','Tabela de retenção aprovada.','high'],
   ['requests',3,'Direitos do titular','MessageSquareText','Canal não operacionalizado','Fluxo de solicitações','Pedido de correção ou exclusão pode ficar sem resposta.','Receber, validar identidade, analisar hipótese e registrar resposta e prazo.','Direitos atendidos de forma auditável.','Tickets e histórico.','high'],
   ['delete',3,'Descarte e sanitização','Trash2','Descarte conceitual','Clear, purge, destroy','Excluir arquivo não elimina mídias e cópias antigas.','Registrar descarte seguro e sanitização por sensibilidade, contrato e evidência.','Reduz vazamento pós-uso.','Certificado de descarte.','high'],
   ['replay',3,'Exclusão após restore','RefreshCcw','Backup pode reintroduzir dado','Reaplicar exclusões','Restore de cópia antiga reintroduz dados eliminados.','Manter livro de exclusões para reaplicação após restauração antes de abrir acesso.','Evita retratamento indevido.','Relatório de reconciliação.','high'],
   ['incident',3,'Incidentes LGPD','Siren','Resposta genérica','Avaliação e comunicação','Tratamento de incidente exige análise jurídica e técnica.','Definir triagem, avaliação de risco/dano e procedimento de comunicação aplicável.','Resposta consistente.','Registro de decisão e comunicado.','high']
  ],
  links:[['collect','catalog'],['catalog','legal'],['legal','use'],['use','quality'],['quality','minimize'],['minimize','classify'],['classify','store'],['store','retain'],['retain','temporal'],['temporal','delete'],['delete','replay'],['requests','incident']]
 },
 policy:{
  zones:[['Governança','Mandato, escopo e papéis'],['Normas técnicas','Regras claras de proteção'],['Operação','Treinamento e incidentes'],['Controle e auditoria','Conformidade e melhoria']],
  existing:{scope:0,standards:1,roles:0,audit:3},
  extra:[
   ['board',0,'Patrocínio da diretoria','Landmark','Diretrizes sem aprovação','PSI e apetite aprovados','Sem patrocínio, controles podem não ter orçamento.','Diretoria define objetivos, alcance, risco tolerável e revisão da PSI.','Continuidade das decisões.','Ata e versão assinada.','high'],
   ['owners',0,'DPO e donos de dados','Users','Papéis sugeridos','RACI auditável','TI, jurídico e negócio podem sobrepor decisões.','Definir accountable, executor, consultado e informado por controle.','Menos conflitos de responsabilidade.','RACI aprovado.','medium'],
   ['passwords',1,'Norma de autenticação','KeyRound','Recomendação genérica','Requisitos mensuráveis','Não há padrão auditável para credenciais.','Definir comprimento, MFA por risco, bloqueio, reset e armazenamento seguro.','Contas menos vulneráveis.','Política do IdP.','high'],
   ['backup',1,'Norma de backup','HardDrive','Estratégia proposta','Ritual de teste e retenção','Ter cópias sem dono e teste não garante recuperação.','Definir frequências, locais, imutabilidade, custódia e testes mensais/trimestrais.','Recuperação verificável.','Relatórios de restauração.','critical'],
   ['usage',1,'Uso aceitável e classificação','Tags','Diretrizes dispersas','Norma por tipo de dado','Dados internos circulam sem regras uniformes.','Aplicar classificação, proteção de dispositivos, compartilhamento e descarte.','Menos vazamento acidental.','Termos de ciência.','high'],
   ['train',2,'Conscientização','GraduationCap','Treinamento tardio','Campanhas periódicas','Erros humanos enfraquecem controles técnicos.','Treinar e medir simulações, incidentes e conduta de dados.','Mais prevenção operacional.','Presença e indicadores.','medium'],
   ['incident',2,'Tratamento de incidentes','Siren','Resposta genérica','Classificação e escalonamento','Decisões no incidente podem ser improvisadas.','Runbooks, RACI, comunicação, preservação de evidências e post-mortem.','Menor tempo de resposta.','Tickets e simulações.','critical'],
   ['exceptions',2,'Exceções e fornecedores','FileWarning','Sem gestão de exceção','Prazo e compensação','Acesso excepcional permanente amplia exposição.','Registrar justificativa, aprovação, expiração e controles compensatórios.','Menos risco oculto.','Registro de exceções.','high'],
   ['indicators',3,'Indicadores de controle','ChartNoAxesCombined','KPIs técnicos isolados','Cobertura e eficácia','Disponibilidade não prova conformidade.','Medir MFA, recertificação, restore, revisão de regras e achados.','Gestão baseada em evidências.','Painel mensal.','medium'],
   ['auditplan',3,'Plano de auditoria','ClipboardCheck','Revisão anual genérica','Teste por controle','Política sem teste não demonstra cumprimento.','Aplicar checklist, amostragem, achados, prazo, responsáveis e reteste.','Proteção sustentável.','Relatório e plano de correção.','high']
  ],
  links:[['board','scope'],['scope','roles'],['roles','standards'],['standards','passwords'],['standards','backup'],['standards','usage'],['usage','train'],['backup','incident'],['incident','exceptions'],['exceptions','audit'],['audit','indicators'],['indicators','auditplan']]
 },
 roadmap:{
  zones:[['Fase 1 • 0–30 dias','Conter riscos imediatos'],['Fase 2 • 31–90 dias','Formalizar segurança básica'],['Fase 3 • 91–180 dias','Comprovar resiliência'],['Fase 4 • 181–360 dias','Auditar e evoluir']],
  existing:{phase1:0,phase2:1,phase3:2,phase4:3},
  extra:[
   ['restore',0,'Testar restore atual','HardDriveDownload','Cópia corrompida no caso','Restore demonstrado','Empresa pode não conseguir recuperar o ERP.','Restaurar amostra e banco em laboratório com registro de integridade.','Reduz risco imediato.','Ata e tempo do teste.','critical'],
   ['energy',0,'Inspecionar energia','Zap','Pane elétrica 18h','UPS/gerador testados','Fator causal direto do incidente.','Teste sob carga e plano de manutenção dos circuitos e gerador.','Reduz indisponibilidade.','Relatório de facilities.','critical'],
   ['inventory',0,'Inventário inicial','Layers3','Ativos dispersos','Lista com donos e riscos','Não é possível priorizar o que não está mapeado.','Relacionar ERP, rede, dados, mídias e dependências com responsáveis.','Prioridade de investimento.','Inventário crítico.','high'],
   ['mfa',1,'Identidades e MFA','Fingerprint','Privilégios não aferidos','RBAC e MFA implantados','Contas administrativas são porta de entrada de ataque.','Exigir MFA, eliminar contas órfãs e aprovar matriz de acesso.','Menos acesso indevido.','Matriz e logs.','critical'],
   ['psi',1,'Publicar a PSI','FileCheck2','Controles sem norma','Política aprovada','Execução depende de critérios formais.','Aprovar PSI, política de senha, acesso e backup com papéis definidos.','Padronização organizacional.','Documentos assinados.','high'],
   ['monitor',1,'Implantar telemetria','Radar','Monitoramento fragmentado','Logs e alertas centralizados','Falhas de backup e banco podem passar despercebidas.','Monitorar replicação, energia, jobs, autenticação e disponibilidade.','Resposta antecipada.','Dashboards e alertas.','high'],
   ['dr',2,'DR em nuvem','Cloud','Site único','Ambiente secundário','Perder o site interrompe a logística nacional.','Replicar dados e ensaiar promoção e retorno com validação do negócio.','Resiliência do ERP.','Relatório de failover.','critical'],
   ['bi',2,'Desacoplar BI','ChartNoAxesCombined','BI dependente do ERP','ETL + warehouse','Indicadores desaparecem durante incidente.','Carga incremental, validação e dashboard de contingência.','Decisão mesmo em crise.','SLA de atualização e totais.','medium'],
   ['bia',2,'Homologar RPO/RTO','Timer','Metas divergentes','BIA assinada','15min/4h e 5min/1h exigem decisão.','Diretoria aprova criticidade e metas após ensaio e análise de custo.','Investimento alinhado ao negócio.','BIA e medições.','high'],
   ['audit',3,'Auditar controles','ClipboardCheck','Revisões não rastreadas','Achados e plano de ação','Controles podem degradar ao longo do tempo.','Auditoria periódica com retestes e evidências de correção.','Melhoria contínua.','Relatório de auditoria.','high'],
   ['people',3,'Treinar equipes','GraduationCap','Conhecimento informal','Simulação anual e capacitação','Falha humana atrasa a resposta.','Exercitar operação degradada, resposta a incidente e uso aceitável.','Resposta coordenada.','Lista de presença e simulação.','medium'],
   ['report',3,'Revisão executiva','ChartNoAxesCombined','Indicadores sem plano','Riscos e KRIs reportados','Diretoria precisa decidir sobre risco residual.','Consolidar disponibilidade, testes, incidentes e eficácia dos controles.','Governança sustentável.','Painel de KRIs e ata.','medium']
  ],
  links:[['phase1','restore'],['restore','energy'],['energy','inventory'],['inventory','phase2'],['phase2','mfa'],['mfa','psi'],['psi','monitor'],['monitor','phase3'],['phase3','dr'],['dr','bi'],['bi','bia'],['bia','phase4'],['phase4','audit'],['audit','people'],['people','report']]
 }
}

export function expandBoards(boards) {
 return boards.map(board=>{
  const ext=ENHANCEMENTS[board.id]
  const existing=board.nodes.map(node=>({...node,zone:ext.existing[node.id]??0}))
  const extra=ext.extra.map(([id,zone,label,icon,before,after,problem,solution,value,evidence,risk])=>({id,zone,label,icon,before,after,problem,solution,value,evidence,risk}))
  return {...board,zones:ext.zones,nodes:[...existing,...extra],edges:ext.links.map(([source,target,label])=>[source,target,label||''])}
 })
}
