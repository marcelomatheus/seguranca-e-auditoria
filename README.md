# DeliMarket · Security Architecture Studio

Aplicação React para explorar a reengenharia de Segurança e Auditoria de Sistemas no estudo de caso DeliMarket.

## Execução

Requer Node.js 22.

```bash
npm install
npm run dev
npm run build
npx playwright install chromium
npm run test:e2e
```

## Interface

- **Dark neutro:** superfícies grafite com acentos azuis e riscos indicados em âmbar/vermelho.
- **Canvas quase integral:** zoom, pan, conexões e quatro zonas funcionais em cada board.
- **Abas inferiores estilo planilha:** sete diagramas sempre acessíveis; navegação horizontal.
- **Três perspectivas:** Antes, Depois e Comparar lado a lado.
- **Inspector:** clique num componente para conhecer lacuna, proposta, valor, evidência e referência.
- **Exportação PDF:** registra o board atual ou a comparação na mesma página A3 horizontal.

## Diagramas

1. Arquitetura e continuidade — CD, filiais, perímetro, rede, ERP, banco, energia, backups, DR, ETL, warehouse, BI, observabilidade, BIA e chaves.
2. Ativos e riscos — inventário, dependências, ameaças, matriz de probabilidade × impacto, tratamento, risco residual, auditoria e KRIs.
3. Controles lógicos e senhas — concessão/revogação, MFA, RBAC, segregação, PAM, senhas, contas de serviço e trilhas.
4. Backup e restauração — cópias, frequência, integridade, contenção, runbook de recuperação, conciliação de dados, RPO/RTO e reteste.
5. Ciclo de vida — finalidade, bases legais, qualidade, minimização no BI, classificação, retenção, descarte, direitos e incidentes.
6. Política de segurança — escopo, patrocínio, RACI, normas específicas, incidentes, treinamento, auditoria e exceções.
7. Implantação gradual — ações priorizadas de 0 a 360 dias, responsáveis e evidências.

## Fundamentação e honestidade do modelo

Os documentos originais da DeliMarket já trazem boas propostas de redundância, backup, proteção e LGPD. O **Antes** representa a situação diagnosticada ou o nível de especificação do plano anterior; o **Depois** detalha controles e critérios de auditoria. Nenhum deles comprova implantação real. O caso é fictício.

A meta de recuperação no documento visual é RPO ≤ 15 min / RTO ≤ 4 h, enquanto no documento detalhado é RPO ≤ 5 min / RTO ≤ 1 h; ambas são premissas e exigem BIA aprovada.

Fontes técnicas: ISO/IEC 27001, 27002 e 27005, ISO 22301, NIST SP 800-34, NIST SP 800-63B, LGPD e boas práticas do TCU.

## Estrutura do código

- `src/boardEnhancements.js`: zonas, componentes, conexões e metadados técnicos.
- `src/main.jsx`: interação dos diagramas, comparação, inspector e PDF.
- `src/styles.css`: tema, layout full-screen e tabs inferiores.
- `tests/smoke.spec.js`: smoke test real em Chromium com Playwright.

O workflow de CI executa o build de produção e o teste de navegador em pull requests.
