# Revisão crítica da infraestrutura — DeliMarket

## Escopo e método

Este parecer compara a **arquitetura híbrida do projeto anterior**, apresentada no diagrama 2 e no documento *Plano de ação para continuidade de negócios, redundância e governança de dados na DeliMarket*, com os riscos técnicos ainda não resolvidos explicitamente. O estado inicial da empresa (incidente histórico de 2023) **não** é o baseline da reengenharia.

Os achados são classificados como:

- **Inconsistência documentada:** divergência verificável entre seções/metas.
- **Risco arquitetural a verificar:** condição que pode comprometer segurança ou disponibilidade caso haja dependência compartilhada; não significa falha comprovada.
- **Detalhamento técnico insuficiente:** mecanismo previsto, mas sem critério completo de integração ou reação à falha.

**Não são novas contribuições:** medir RPO/RTO, comparar metas a resultados, fazer failover trimestral, adotar réplica assíncrona, executar failover assistido, prever failback, executar backups 3-2-1-1-0, segregar credenciais, usar MFA, prever ETL idempotente e conciliado, manter painel de crise, revisar acesso e testar nobreak/gerador. Tudo isso já aparece nos materiais anteriores.

## Achados principais

| Prioridade | Achado | Fundamentação no plano anterior | Reengenharia proposta |
|---|---|---|---|
| **Crítica — inconsistência documentada** | **Metas de recuperação incompatíveis** | A seção 5.1 define RTO de **1 h para ERP** e **2 h para autenticação, DNS, VPN e rede**, que são serviços de apoio classificados como críticos. | Definir RTO coerente para a cadeia operacional; exercitar a retomada de acesso ao ERP pelo CD, filiais e usuários, não somente o processo em nuvem. |
| **Crítica — risco a verificar** | **Pontos únicos nos componentes compartilhados do cluster** | O diagrama prevê cluster ERP e site secundário, mas não explicita todos os domínios de falha compartilhados (balanceador, armazenamento, DNS, identidade, filas). | Identificar e reduzir elementos únicos, validar suficiência do standby e independência das dependências críticas. |
| **Crítica — risco a verificar** | **Replicação assíncrona, partição de rede e split-brain** | A seção 5.2 já recomenda failover assistido para evitar dois primários; a seção 5.1 propõe RPO de 5 minutos, não perda zero. | Especificar fencing, condição para promoção, reação a lag acima da meta e conciliação de transações após a mudança de primário. |
| **Crítica — risco a verificar** | **Redundância de internet com elementos em comum** | A arquitetura prevê dois provedores e SD-WAN/VPN, mas não comprova rotas/entradas/equipamentos/energia independentes de ponta a ponta. | Verificar diversidade real e alternativas de acesso ao DR em falha de borda ou concentrador VPN. |
| **Crítica — risco a verificar** | **Redundância de energia com falha comum** | O plano já exige dois circuitos, UPS, gerador, alimentação dupla e teste em carga. Não apresenta a cadeia unifilar completa. | Avaliar quadros, chave de transferência, UPS, PDU e climatização para remover falhas comuns entre caminhos supostamente redundantes. |
| **Crítica — risco a verificar** | **DR inacessível por dependência de identidade e controle** | O plano prevê MFA, segmentação, logs, VPN e site alternativo; não especifica todo o caminho de autenticação e administração durante perda do site. | Construir caminho de acesso protegido ao DR que não dependa de serviços indisponíveis do ambiente primário. |
| **Crítica — integração operacional** | **Backup de dados sem recuperação garantida das dependências** | A política anterior já inclui backup de configurações, recuperação do banco e testes mensais; um ERP funcional também depende de DNS, identidade, certificados, serviços e segredos. | Exercitar restauração conjunta da cadeia de serviços, com validação funcional da operação. |
| **Crítica — risco a verificar** | **Backup off-site disponível, mas inacessível em crise de identidade** | O plano já prevê imutabilidade, KMS/HSM, credenciais separadas, custódia dupla e MFA. | Validar a recuperação do acesso ao armazenamento e às chaves se domínio, VPN ou credenciais centrais falharem. |
| Alta — risco a verificar | **BI de crise dependente da mesma cadeia de acesso** | A seção 5.4 já prevê painel de crise, último horário de carga, reconciliação diária e ETL idempotente. | Verificar como direção e gestores o acessam quando o site e a autenticação primários estão indisponíveis. |
| Alta — integração | **Checkpoint de ETL na troca do banco primário** | O plano anterior já define reconexão, reexecução idempotente e conciliação. | Tratar especificamente lacunas, eventos fora de ordem e cursor de extração durante promoção de réplica assíncrona. |
| Alta — risco a verificar | **Climatização e sensores dependentes da mesma energia ou rede** | O plano já prevê refrigeração com reserva, sensores e alarmes. | Avaliar a independência de alimentação e alertas durante falha elétrica simultânea. |

## Por que essa revisão é diferente

A reengenharia não adiciona mais um firewall, mais um backup ou simplesmente pede novos testes. Ela identifica **falhas de projeto que podem persistir mesmo quando todas as tecnologias já propostas forem implantadas**:

1. **Disponibilidade fim a fim:** não adianta o ERP recuperar em 1 hora se os acessos de rede, DNS e autenticação podem levar 2 horas.
2. **Domínios de falha:** duas instâncias, circuitos ou conexões não garantem redundância se dividirem o mesmo elemento crítico.
3. **Integridade na troca de ambiente:** failover não pode permitir duas origens gravando nem assumir que replicação assíncrona elimina perda transacional.
4. **Recuperação integral:** backup e DR só sustentam o negócio quando os usuários conseguem acessar os serviços e os dados estão coerentes.

## Limites da análise

Os documentos descrevem uma **proposta acadêmica**, não uma implantação inspecionada. Assim, não se pode afirmar que exista um único SD-WAN, quadro compartilhado, autenticação centralizada ou corrupção de replicação: são **riscos a confirmar por topologia técnica e ensaio**, e foram registrados dessa forma na aplicação. A incompatibilidade dos RTOs, por outro lado, é verificável diretamente na seção 5.1 do documento detalhado.

As prioridades (crítica/alta) expressam **gravidade técnica potencial da intervenção**, não medição de risco residual ou comprovação de falha.

**Fontes:** diagrama visual da arquitetura híbrida (diagrama 2), política de backup e recuperação (diagrama 3), proteção e segurança (diagrama 5); documento detalhado, especialmente seções **5.1, 5.2, 5.4, 5.5, 5.6, 6.1–6.4, 9 e 10**.
