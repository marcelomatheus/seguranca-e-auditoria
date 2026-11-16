# DeliMarket · Security Architecture Studio

Aplicação React para apresentação interativa da reengenharia de Segurança e Auditoria de Sistemas da **DeliMarket**.

## Execução

Requer Node.js 20.19+ ou 22.12+.

\`\`\`bash
npm install
npm run dev
npm run build
\`\`\`

## Recursos

- Sete boards: arquitetura, riscos, identidades, backup/restauração, ciclo de dados, PSI e implantação gradual.
- Canvas navegável com zoom, pan, conexões, cards e ícones.
- Modos **Antes**, **Depois** e **Comparar** (duas vistas paralelas).
- Inspeção de cada controle com risco, lacuna, refinamento, valor para o cliente e evidência de auditoria.
- Tooltips nativos ao passar sobre um nó, transições e conexões animadas no modo refinado.
- Exportação do board em PDF (nos modos simples e comparação).
- Interface responsiva e navegação por teclado nos controles principais.

## Referências de análise

- ISO/IEC 27001, ISO/IEC 27002 e ISO/IEC 27005.
- ISO 22301 e NIST SP 800-34.
- NIST SP 800-63B (políticas de autenticação).
- LGPD (Lei 13.709/2018).
- Estudo de caso DeliMarket: plano detalhado e diagrama visual disponibilizados para a disciplina.

**Natureza das informações:** diagramas conceituais e propostas de reengenharia, não evidências de implantação ou certificação. O resumo visual do material indica metas de RPO ≤ 15 min e RTO ≤ 4 h; o estudo detalhado trabalha com RPO ≤ 5 min e RTO ≤ 1 h. Os valores devem ser aprovados por BIA e testados. A exportação usa uma imagem de alta resolução do canvas inserida no PDF.

## Estrutura

- \`src/main.jsx\`: dados de arquitetura, componentes do canvas e interações.
- \`src/styles.css\`: sistema visual, layouts e animações.
- \`index.html\`: shell da aplicação.

## Verificação

\`npm run build\` valida o bundle. Recomendado também executar manualmente os sete boards, alternar modos, clicar nós e exportar PDFs de modo simples e comparativo no navegador.
