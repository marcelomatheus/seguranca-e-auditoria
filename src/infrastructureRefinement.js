// Referência do estado "Antes": diagrama 2 — Proposta (arquitetura híbrida)
// do trabalho anterior, e não o diagnóstico da DeliMarket (diagrama 1).
// As melhorias complementam controles já previstos; não comprovam implantação.
const infrastructureChanges = {
  users: {
    before: 'Áreas de negócio · acesso por perfil',
    after: 'Acesso por perfil auditável',
    problem: 'O projeto anterior já previa acesso por perfil e menor privilégio. Falta explicitar a matriz de permissões por área e o fluxo de aprovação/revisão.',
    solution: 'Documentar perfis de vendas, estoque, logística, financeiro e TI; vincular concessões a responsáveis e realizar revisões registradas.',
    value: 'Preserva o acesso por função já desenhado e amplia a rastreabilidade de concessões e alterações.',
    evidence: 'Matriz RBAC, aprovações e revisões periódicas.'
  },
  edge: {
    before: 'Firewall / WAF · MFA · menor privilégio',
    after: 'Regras revisadas + segmentação',
    problem: 'O diagrama anterior já inclui firewall, WAF, MFA e menor privilégio. Não detalha a gestão de regras, a separação de zonas ou como provar a eficácia desses controles.',
    solution: 'Inventariar regras, separar interfaces públicas e administrativas, revisar exceções e testar bloqueios de tráfego não autorizado.',
    value: 'Reduz exposição e transforma a proteção de borda prevista em um controle verificável.',
    evidence: 'Revisões de regras, logs de bloqueio e testes de segmentação.'
  },
  erp: {
    before: 'ERP em cluster no site primário',
    after: 'Cluster com failover comprovado',
    problem: 'O trabalho anterior já propõe ERP em cluster e ERP standby em nuvem. Precisa definir procedimento de comutação, responsáveis e critérios de validação do serviço.',
    solution: 'Formalizar runbook de failover/failback, testes com usuários-chave e verificação de pedidos, estoque e faturamento após a comutação.',
    value: 'Converte a redundância proposta em capacidade de continuidade testável.',
    evidence: 'Roteiro de teste, resultados de failover e RTO medido.'
  },
  bi: {
    before: 'BI e dashboards na nuvem',
    after: 'BI com atualização monitorada',
    problem: 'O projeto anterior já prevê BI na nuvem e data warehouse. Falta explicitar como monitorar atraso e qualidade das informações durante contingências.',
    solution: 'Definir SLA de atualização, mostrar o horário da última carga e testar disponibilidade dos indicadores durante falhas no ERP.',
    value: 'A diretoria mantém indicadores confiáveis e sabe quando dados estão desatualizados.',
    evidence: 'Painel de frescor dos dados, testes de continuidade e reconciliações.'
  },
  connectivity: {
    before: '2 ISPs + SD-WAN/VPN',
    after: 'Redundância de links testada',
    problem: 'Dois provedores distintos e SD-WAN/VPN já constam da arquitetura anterior. O refinamento é demonstrar independência das rotas e comutação dentro de metas definidas.',
    solution: 'Testar quedas de cada provedor, medir tempo de comutação, documentar rotas alternativas e revisar SLAs.',
    value: 'A continuidade das filiais deixa de depender apenas de uma configuração não aferida.',
    evidence: 'Relatórios de failover de links, disponibilidade e SLAs.'
  },
  power: {
    before: '2 circuitos + nobreak + gerador',
    after: 'Energia redundante supervisionada',
    problem: 'O projeto anterior já propõe dois circuitos, nobreak e gerador. Falta transformar a redundância em uma rotina de manutenção, teste sob carga e resposta a alarmes.',
    solution: 'Definir inspeções, teste de transferência sob carga, autonomia mínima baseada na BIA e alerta de falhas de alimentação.',
    value: 'Aumenta a confiabilidade da redundância elétrica que já foi projetada.',
    evidence: 'Laudos, testes de transferência, manutenção e alarmes.'
  },
  database: {
    before: 'BD primário HA + réplica de DR',
    after: 'Replicação e promoção validadas',
    problem: 'O diagrama anterior já prevê banco primário de alta disponibilidade e replicação contínua para DR. Faltam critérios operacionais para lag, promoção e conciliação.',
    solution: 'Monitorar atraso de replicação, definir promoção segura e ensaiar consistência transacional, retorno e prevenção de split-brain.',
    value: 'Reduz o risco de perda ou divergência de pedidos durante a troca de ambiente.',
    evidence: 'Monitoramento de lag, teste de promoção e conciliação de transações.'
  },
  etl: {
    before: 'ETL / API com validação e sincronização',
    after: 'ETL conciliado e observável',
    problem: 'A proposta anterior já desacopla ERP e BI via ETL/API e prevê validação de dados. Não especifica controles mensuráveis de reconciliação e falhas de carga.',
    solution: 'Definir checagens de contagem e totalização, alertas de atraso, reprocessamento idempotente e trilha de erros por carga.',
    value: 'Evita que o BI apresente resultados inconsistentes sem aviso.',
    evidence: 'Logs do pipeline, conciliações ERP × warehouse e alarmes.'
  },
  physical: {
    before: 'Sala segura, refrigeração e detecção de incêndio',
    after: 'Ambiente físico auditado',
    problem: 'A arquitetura anterior contempla refrigeração, acesso controlado e detecção de incêndio. É necessário detalhar inspeções, registros e testes desses dispositivos.',
    solution: 'Testar sensores ambientais e alarmes, revisar acessos à sala e manter manutenção e escalonamento documentados.',
    value: 'Transforma os controles físicos já desenhados em medidas mensuráveis.',
    evidence: 'Logs de acesso, testes de sensores e ordens de manutenção.'
  },
  backup: {
    before: 'Backup local NAS · regra 3-2-1',
    after: 'Restore local com procedimento e aceite',
    problem: 'O trabalho anterior já define cópia local, regra 3-2-1 e testes trimestrais. O refinamento é especificar a execução do restore e a validação de dados de negócio.',
    solution: 'Criar runbook de restauração, separar credenciais, executar testes registrados e reconciliar pedidos/estoque antes de liberar o ERP.',
    value: 'Comprova que o backup pode recuperar serviços e dados íntegros.',
    evidence: 'Relatórios de restauração, hashes, conciliações e tempo medido.'
  },
  recovery: {
    before: 'BD réplica + ERP standby em nuvem',
    after: 'DR acionável, medido e revertível',
    problem: 'O plano anterior prevê DR em nuvem e teste de failover trimestral. Ainda é necessário detalhar acionamento, sequência, responsáveis e retorno ao site primário.',
    solution: 'Formalizar runbook de desastre, validar failover e failback, medir RPO/RTO e registrar a autorização do negócio para retomada.',
    value: 'Reduz incerteza operacional ao executar a arquitetura híbrida já proposta.',
    evidence: 'Ata de simulação, checklist, RPO/RTO observados e aceite do negócio.'
  },
  immutable: {
    before: 'Backup em nuvem imutável, criptografado e versionado',
    after: 'Imutabilidade, custódia e restore verificados',
    problem: 'O projeto anterior já prevê cópia imutável em outra região, criptografia e chaves em KMS/HSM. Falta evidenciar proteção contra exclusão, acesso indevido e perda de chaves.',
    solution: 'Testar imutabilidade, segregação de permissões, recuperação de chaves e restauração de cópias de outra região.',
    value: 'Comprova a resistência das cópias contra ransomware e desastres.',
    evidence: 'Teste de exclusão negada, trilhas de acesso, recuperação de chave e restore off-site.'
  }
}

export function refineInfrastructureComparison(board) {
  if (board.id !== 'architecture') return board
  return {
    ...board,
    intro: 'Evolução da arquitetura híbrida já proposta: controles operacionais, testes e evidências.',
    baseline: 'O trabalho anterior já contemplava cluster, réplica em nuvem, redundância elétrica, dois links, backups 3-2-1, ETL/BI e segurança de borda.',
    nodes: board.nodes.map(node => ({ ...node, ...(infrastructureChanges[node.id] || {}) }))
  }
}
