// Baseline: previously proposed hybrid architecture (visual diagram 2 and detailed plan).
// A "gap" means an unresolved or insufficiently specified architectural condition,
// not a proven defect in deployed infrastructure. RPO/RTO measurement, failover
// procedures, immutable backups, security segmentation and BI reconciliation are
// ALREADY present in the previous proposal.
const infrastructureChanges = {
  users: {
    before: 'Perfis, MFA e serviços de apoio com RTO de 2h',
    after: 'Identidade/DNS/VPN recuperáveis antes do ERP',
    problem: 'INCONSISTÊNCIA EXPLÍCITA: o documento detalhado prevê RTO de 1 hora para o ERP, mas 2 horas para autenticação, DNS, VPN e rede — serviços críticos para acessá-lo. Recuperar o ERP primeiro não significa restabelecer a operação do negócio.',
    solution: 'Reordenar a BIA por dependências reais e alinhar as metas de identidade, DNS, VPN e rede à retomada do ERP. Definir e exercitar serviços de apoio disponíveis no site alternativo, com acesso de emergência controlado que não dependa exclusivamente do site primário.',
    value: 'Evita que o ERP esteja tecnicamente ativo na nuvem enquanto filiais, CD e operadores continuem impossibilitados de utilizá-lo.',
    evidence: 'BIA revisada, mapa das dependências e ensaio integrado de autenticação, DNS, VPN e ERP.',
    risk: 'critical'
  },
  edge: {
    before: 'Firewall, WAF, MFA e segmentação previstos',
    after: 'Isolamento da gestão e dos caminhos de DR',
    problem: 'A proposta anterior já separa ERP, BI, backup e administração e prevê firewall, WAF e EDR. Ainda é necessário verificar se o plano de controle (VPN, identidade, políticas e credenciais administrativas) permanece funcional e isolado quando o site primário ou o domínio principal é comprometido.',
    solution: 'Projetar caminhos de administração e acesso ao DR independentes de componentes exclusivos do site primário, validar regras entre segmentos e aplicar proteção aos acessos de gestão sem reproduzir o mesmo ponto único de falha na nuvem.',
    value: 'Reduz a possibilidade de o ataque ou a indisponibilidade de um ambiente bloquear também a recuperação do outro.',
    evidence: 'Matriz de fluxos de gestão/DR, revisão de dependências do IdP e teste de indisponibilidade do controle primário.',
    risk: 'critical'
  },
  erp: {
    before: 'ERP em cluster local e standby morno em nuvem',
    after: 'Eliminar falhas comuns do serviço ERP',
    problem: 'O cluster local e o standby na nuvem já são propostos. O plano não demonstra se balanceador, storage, DNS, autenticação e filas compartilham falhas capazes de interromper todas as instâncias de aplicação. Esse é um risco a verificar, não uma falha comprovada.',
    solution: 'Mapear e retirar pontos únicos nos componentes compartilhados da cadeia de atendimento; garantir que o standby tenha configuração, certificados, dependências, capacidade de escala e conectividade suficientes para receber pedidos na região secundária.',
    value: 'Evita que um cluster aparente alta disponibilidade enquanto uma dependência compartilhada derruba o serviço inteiro.',
    evidence: 'Mapa de domínios de falha, inventário de dependências e teste de indisponibilidade do balanceador/storage/identidade.',
    risk: 'critical'
  },
  bi: {
    before: 'Warehouse na nuvem, painel de crise e ETL resiliente',
    after: 'BI utilizável na perda da cadeia de acesso',
    problem: 'O documento detalhado já prevê dados com horário da última carga, reconciliação e painel de crise. Resta verificar se gestores conseguem acessar esse painel quando a VPN, o DNS ou a autenticação do site primário não estiverem disponíveis.',
    solution: 'Garantir um caminho de consulta ao painel de crise que opere na perda do site principal, preservando autorização e dados minimizados, e explicitar os níveis de operação quando a fonte ERP estiver indisponível.',
    value: 'Permite que a direção consulte entregas, pedidos e estoque com indicação de defasagem durante uma crise ampla.',
    evidence: 'Teste de acesso ao painel com o site primário isolado, controle de acesso e informação de frescor exibida.',
    risk: 'high'
  },
  connectivity: {
    before: 'Dois ISPs com SD-WAN/VPN e rotas alternativas',
    after: 'Eliminar falhas comuns da conectividade',
    problem: 'Dois provedores já estão previstos. Porém, dois links podem falhar juntos se dividirem entrada física, equipamento de borda, alimentação, roteamento ou concentrador VPN. O documento não comprova independência ponta a ponta desses elementos.',
    solution: 'Projetar diversidade física e lógica até os pontos críticos: entradas, caminhos, energia, equipamentos SD-WAN/VPN e terminação no DR. Onde houver elemento único inevitável, explicitar o risco residual e prever alternativa de operação.',
    value: 'Diminui o risco de uma única falha local ou de borda interromper simultaneamente os dois canais e o acesso ao DR.',
    evidence: 'Topologia física e lógica validada, análise de componentes comuns e ensaio de perda do equipamento de borda.',
    risk: 'critical'
  },
  power: {
    before: 'Dois circuitos, nobreak, gerador e teste em carga',
    after: 'Eliminar dependências comuns da alimentação',
    problem: 'O plano anterior já prevê circuitos redundantes, UPS, gerador, testes mensais e alimentação dupla dos racks. Ainda é necessário verificar se quadros, transferência, distribuição e refrigeração criam um ponto único de falha, apesar das duas entradas.',
    solution: 'Analisar a cadeia ponta a ponta (alimentação externa → quadros → ATS → UPS → PDU → servidores e climatização), separar circuitos que compartilhem componentes críticos e dimensionar autonomia de combustível e refrigeração na transição.',
    value: 'Ataca falhas simultâneas que não são resolvidas somente pela presença de dois circuitos e um gerador.',
    evidence: 'Diagrama unifilar, análise de pontos comuns e teste de transferência contemplando carga de TI e climatização.',
    risk: 'critical'
  },
  database: {
    before: 'HA local + réplica assíncrona e failover assistido',
    after: 'Fencing e integridade transacional no failover',
    problem: 'A proposta anterior reconhece o risco de dois primários, escolhe failover assistido e prevê RPO de 5 minutos. A replicação assíncrona, contudo, pode ter atraso variável e não garante por si só o limite em todas as falhas; o processo de impedir escrita simultânea não está tecnicamente especificado.',
    solution: 'Definir fencing do antigo primário, promoção com confirmação de isolamento e lag, política explícita para exceder o RPO e reconciliação de pedidos durante perda de transações. Não tratar failover assistido como garantia automática de consistência.',
    value: 'Reduz risco de split-brain, gravações conflitantes e perda silenciosa de pedidos durante uma comutação crítica.',
    evidence: 'Ensaio de partição de rede, prova de bloqueio de escritas no primário antigo, histórico do lag e conciliação transacional.',
    risk: 'critical'
  },
  etl: {
    before: 'ETL isolado, idempotente e com conciliação diária',
    after: 'Troca de origem sem lacunas ou duplicação',
    problem: 'O documento anterior já exige carga reexecutável, conciliação, atualização e reconexão do BI após failover. A proposta não detalha o tratamento do cursor de extração e da ordem dos eventos quando o banco muda de primário ou perde transações ainda não replicadas.',
    solution: 'Projetar checkpoints de extração compatíveis com a promoção do banco, reconciliação de lacunas por chave transacional e bloqueio de reprocessamentos que produzam duplicações após a troca de origem.',
    value: 'Evita que uma recuperação do ERP resulte em informações de BI incorretas mesmo quando o ETL volta a executar.',
    evidence: 'Teste de ETL durante promoção com perda simulada de logs, contagem de eventos e reconciliação ERP × warehouse.',
    risk: 'high'
  },
  physical: {
    before: 'Sala segura, refrigeração N+1 e sensores ambientais',
    after: 'Verificar falhas comuns do ambiente físico',
    problem: 'O documento anterior já inclui refrigeração com reserva, sensores de temperatura, água e fogo, controle de acesso e alarmes. Uma lacuna a avaliar é se climatização, detecção e rede de sensores compartilham energia e comunicações da mesma infraestrutura que precisam proteger.',
    solution: 'Avaliar alimentação e comunicação alternativas para monitoramento ambiental e preservar climatização durante a transição elétrica, com ações automáticas seguras diante de temperatura crítica.',
    value: 'Reduz a chance de falha ambiental em cascata mesmo com UPS/gerador e sensores previstos.',
    evidence: 'Diagrama de alimentação da climatização e sensores, ensaio integrado de falha elétrica e limites térmicos.',
    risk: 'high'
  },
  backup: {
    before: '3-2-1-1-0, cópias separadas e restore periódico',
    after: 'Recuperar a cadeia completa do serviço',
    problem: 'O plano anterior já inclui cópias imutáveis, credenciais separadas, testes mensais do banco, backup de configurações e restauração isolada. Porém, restaurar o banco sem também recuperar identidade, DNS, certificados, segredos e conectividade pode não devolver um ERP utilizável dentro da meta.',
    solution: 'Definir um conjunto recuperável de dependências do ERP, incluindo configuração segura, segredos sob custódia e serviços de apoio, e exercitar restauração ponta a ponta em ambiente segregado.',
    value: 'Reduz a diferença entre recuperar arquivos/dados e efetivamente voltar a receber pedidos e operar a logística.',
    evidence: 'Teste integrado de recuperação do ERP acessível por usuários, com dependências e dados reconciliados.',
    risk: 'critical'
  },
  recovery: {
    before: 'DR com standby, failover assistido, failback e RPO/RTO medidos',
    after: 'Dependências e reversão seguras no DR',
    problem: 'O projeto anterior JÁ determina runbooks, failover assistido, failback sem perda, testes trimestrais e medição de RPO/RTO reais. A lacuna crítica é a compatibilidade das metas entre serviços: apoio (DNS, VPN, autenticação e rede) com RTO de 2 horas versus ERP com RTO de 1 hora. Também faltam critérios técnicos de isolamento do antigo primário e decisão sobre divergências.',
    solution: 'Reavaliar a sequência e as metas conforme dependências; assegurar acesso, DNS e identidade antes do ERP; condicionar promoção a fencing do primário antigo; definir reconciliação e retorno sem sobrescrever transações realizadas na nuvem. Preservar a medição de RPO/RTO que o plano já previa.',
    value: 'Transforma um failover tecnicamente executado em retomada efetiva da operação, sem risco de dois ambientes gravarem de forma conflitante.',
    evidence: 'BIA coerente entre dependências, testes de partição/fencing, ensaio integrado de failover e failback com conciliação.',
    risk: 'critical'
  },

  lan: {
    before: 'Rede corporativa segmentada com SD-WAN/VPN',
    after: 'Acesso ao DR sem falhas comuns de rede',
    problem: 'A arquitetura anterior já prevê segmentação, dois ISPs e SD-WAN/VPN. O risco a verificar é a concentração do roteamento, DNS, VPN ou equipamentos de borda em um elemento que também seja necessário durante o failover.',
    solution: 'Mapear os pontos compartilhados entre matriz, CD, filiais e site de DR; prever acesso seguro ao ambiente alternativo mesmo quando a infraestrutura central de rede estiver indisponível.',
    value: 'Reduz a probabilidade de a recuperação em nuvem ser inacessível por uma falha na rede corporativa.',
    evidence: 'Topologia ponta a ponta, teste de perda do concentrador principal e acesso funcional ao DR.',
    risk: 'critical'
  },
  warehouse: {
    before: 'Data warehouse desacoplado do ERP',
    after: 'Repositório analítico acessível durante contingência',
    problem: 'O projeto anterior já separa o warehouse do banco transacional e prevê cópia em nuvem. É necessário verificar se a disponibilidade do repositório também depende de autenticação, rede ou serviços exclusivos do site principal.',
    solution: 'Verificar a continuidade de acesso e das permissões do warehouse no cenário de perda total do site primário, preservando a segregação de dados pessoais e o último estado íntegro.',
    value: 'Mantém a capacidade analítica necessária à logística e à direção sem afetar o ERP.',
    evidence: 'Teste de acesso a dados analíticos durante indisponibilidade do site e revisão das permissões.',
    risk: 'high'
  },
  soc: {
    before: 'Logs, EDR, alertas e monitoramento centralizados',
    after: 'Resposta disponível durante perda do site ou identidade',
    problem: 'O plano anterior já prevê logs protegidos, EDR, alertas e resposta a incidentes. Resta avaliar se o canal de monitoramento e o acionamento da equipe sobrevivem à falha do site ou à indisponibilidade da autenticação corporativa.',
    solution: 'Manter caminhos independentes de coleta e notificação de incidentes críticos e acesso seguro ao histórico de alertas a partir do ambiente de contingência.',
    value: 'A equipe consegue perceber e responder ao incidente mesmo quando a infraestrutura monitorada está indisponível.',
    evidence: 'Teste de perda do coletor primário, registro de recebimento de alertas externos e acesso à trilha em contingência.',
    risk: 'high'
  },
  bia: {
    before: 'BIA, metas e medição de RPO/RTO já propostas',
    after: 'RTO alinhado entre ERP e serviços de apoio',
    problem: 'A seção 5.1 do plano detalhado propõe RTO de 1 hora para ERP e de 2 horas para autenticação, DNS, VPN e rede, apesar de os serviços de apoio serem dependências críticas para o ERP operar. O documento já previa medições reais de RPO/RTO em testes.',
    solution: 'Rever a sequência de recuperação e estabelecer metas compatíveis para serviços de apoio e ERP, submetendo-as à aprovação da direção e à verificação em simulação integrada. Preservar as medições já propostas.',
    value: 'Evita declarar o ERP recuperado quando os usuários ainda não conseguem operar pedidos, estoque e logística.',
    evidence: 'BIA consistente por dependência e exercício integrado de recuperação com RTO fim a fim.',
    risk: 'critical'
  },
  kms: {
    before: 'TLS, AES-256, KMS/HSM e custódia dupla',
    after: 'Chaves recuperáveis durante perda de identidade',
    problem: 'O projeto anterior já exige criptografia, chaves separadas, KMS/HSM, rotação e custódia dupla. A lacuna a verificar é se essas chaves continuam acessíveis para restauração quando o IdP, a conta principal ou a VPN forem indisponibilizados.',
    solution: 'Projetar e exercitar um procedimento de recuperação segura das chaves e acesso às cópias externas sem dependência exclusiva do site ou identidade primários.',
    value: 'Evita que backups íntegros se tornem inutilizáveis durante um desastre.',
    evidence: 'Ensaio de recuperação de chaves sem acesso ao ambiente principal e trilhas de custódia.',
    risk: 'critical'
  },
  immutable: {
    before: 'Backup imutável e cifrado em outra região, KMS/HSM',
    after: 'Recuperação resistente à perda da identidade',
    problem: 'O plano anterior já separa credenciais do backup, usa MFA, imutabilidade, chaves em KMS/HSM, custódia dupla e testes de restauração. Falta especificar se o acesso à conta de backup e às chaves permanece possível quando o provedor de identidade, a conta principal ou a conectividade do site estiverem indisponíveis.',
    solution: 'Verificar independência do domínio de recuperação e estabelecer credenciais de emergência sob custódia, acesso ao KMS e cópias que permaneçam restauráveis durante indisponibilidade ou comprometimento do ambiente principal.',
    value: 'Evita que backups íntegros e imutáveis fiquem inacessíveis exatamente no momento em que são necessários.',
    evidence: 'Teste de recuperação sem IdP/VPN primários, demonstração de custódia das chaves e acesso à cópia off-site.',
    risk: 'critical'
  }
}

export function refineInfrastructureComparison(board) {
 if(board.id !== 'architecture')return board
 return {
   ...board,
   intro:'Lacunas arquiteturais críticas na proposta híbrida: dependências, falhas comuns e consistência de recuperação.',
   baseline:'O plano anterior já prevê alta disponibilidade, DR em nuvem, failover assistido, failback, RPO/RTO medidos, rede dupla, backup 3-2-1-1-0 e controles físicos e lógicos. O refinamento aponta riscos adicionais ainda não resolvidos explicitamente.',
   nodes:board.nodes.map(node=>{
     const improvement=infrastructureChanges[node.id]
     if(!improvement)throw new Error('Componente sem revisão de infraestrutura: '+node.id)
     return {...node,...improvement}
   })
 }
}
