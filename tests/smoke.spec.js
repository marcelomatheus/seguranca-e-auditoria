import { test, expect } from '@playwright/test'

test('renders dense bottom-tab boards, comparison, inspector and PDF', async ({ page }) => {
 const errors=[]
 page.on('pageerror', error=>errors.push(error.message))
 await page.goto('/')
 await page.getByRole('tab',{name:/Infraestrutura/i}).click()
 await expect(page.getByRole('heading',{name:/Arquitetura & continuidade/})).toBeVisible()
 await expect(page.getByRole('tab')).toHaveCount(8)
 const tabs=['Infraestrutura','Matriz de risco','Identidade e acesso','Recuperação','Governança de dados','Políticas & controles','Plano de execução']
 for(const label of tabs){
  await page.getByRole('tab',{name:new RegExp(label,'i')}).click()
  await expect(page.locator('.clean-card').first()).toBeVisible()
  expect(await page.locator('.clean-card').count()).toBeGreaterThan(8)
  await expect(page.locator('[data-testid="animated-connection"]').first()).toBeVisible()
  await expect(page.locator('animateMotion').first()).toHaveCount(1)
  await page.getByRole('button',{name:'Antes',exact:true}).click()
  await expect(page.locator('.clean-card-before').first()).toBeVisible()
  await page.getByRole('button',{name:'Depois',exact:true}).click()
  await expect(page.locator('.clean-card-after').first()).toBeVisible()
  await page.getByRole('button',{name:'Comparar',exact:false}).click()
  await expect(page.locator('.comparison-pane')).toHaveCount(2)
  await page.getByRole('button',{name:'Depois',exact:true}).click()
 }
 await page.locator('.clean-card').first().click()
 await expect(page.getByLabel('Detalhamento do controle')).toBeVisible()
 await expect(page.getByText('02 / SOLUÇÃO PROPOSTA')).toBeVisible()
 await page.getByRole('button',{name:'Fechar detalhes'}).click()
 const downloadPromise=page.waitForEvent('download',{timeout:45000})
 await page.getByRole('button',{name:/Exportar PDF/}).click()
 const download=await downloadPromise
 expect(download.suggestedFilename()).toMatch(/\.pdf$/)
 expect(errors).toEqual([])
})

test('connections are routed without cards and animate along paths', async ({page}) => {
 await page.goto('/')
 await page.getByRole('tab',{name:/Infraestrutura/i}).click()
 await expect.poll(async()=>page.locator('.diagram-connection').count()).toBeGreaterThan(5)
 const metrics=await page.evaluate(()=>{
  const cards=[...document.querySelectorAll('.react-flow__node-component')].map(el=>{
   const r=el.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}
  })
  const edges=[...document.querySelectorAll('.diagram-connection > path')].filter(el=>el.getAttribute('stroke-dasharray')===null)
  const sample=edges.flatMap(edge=>{
   const n=edge.getTotalLength(),points=[]
   for(let i=0;i<=25;i++){const p=edge.getPointAtLength(n*i/25);const matrix=edge.getScreenCTM();if(!matrix)continue;const v=new DOMPoint(p.x,p.y).matrixTransform(matrix);points.push(v)}
   return points
  })
  const intersections=sample.filter(p=>cards.some(c=>p.x>c.x+8&&p.x<c.x+c.w-8&&p.y>c.y+8&&p.y<c.y+c.h-8)).length
  return {connections:edges.length,animated:document.querySelectorAll('animateMotion').length,intersections}
 })
 expect(metrics.connections).toBeGreaterThan(5)
 expect(metrics.animated).toBe(metrics.connections)
 expect(metrics.intersections).toBe(0)
})

test('canvas fills viewport above spreadsheet-style bottom tabs', async ({ page }) => {
 await page.goto('/')
 await page.getByRole('tab',{name:/Infraestrutura/i}).click()
 const viewport=page.viewportSize()
 const rect=await page.locator('.canvas-stage').boundingBox()
 expect(rect.height).toBeGreaterThan(viewport.height*.55)
 const tabs=await page.locator('.sheetbar').boundingBox()
 expect(tabs.y).toBeGreaterThan(rect.y+rect.height-2)
 await page.getByRole('button',{name:'Referências'}).click()
 await expect(page.getByText('FONTES E PREMISSAS')).toBeVisible()
})


test('infraestrutura compara o projeto híbrido anterior com a reengenharia, sem retroceder ao diagnóstico inicial', async ({ page }) => {
 await page.goto('/')
 await page.getByRole('tab',{name:/Infraestrutura/i}).click()
 await page.getByRole('button',{name:'Antes',exact:true}).click()
 await expect(page.getByText('PROJETO ANTERIOR · ARQUITETURA HÍBRIDA')).toBeVisible()
 await expect(page.locator('.clean-card').filter({hasText:'ERP em cluster local e standby morno em nuvem'})).toBeVisible()
 await expect(page.locator('.clean-card').filter({hasText:'Dois ISPs com SD-WAN/VPN e rotas alternativas'})).toBeVisible()
 await expect(page.locator('.clean-card').filter({hasText:'Dois circuitos, nobreak, gerador e teste em carga'})).toBeVisible()
 await expect(page.locator('.clean-card').filter({hasText:'HA local + réplica assíncrona e failover assistido'})).toBeVisible()
 await expect(page.locator('.clean-card').filter({hasText:'Backup imutável e cifrado em outra região, KMS/HSM'})).toBeVisible()
 await expect(page.locator('.clean-card').filter({hasText:'Firewall, WAF, MFA e segmentação previstos'})).toBeVisible()
 await expect(page.locator('.clean-card').filter({hasText:'Warehouse na nuvem, painel de crise e ETL resiliente'})).toBeVisible()
 await page.locator('.clean-card').filter({hasText:'ERP em cluster local e standby morno em nuvem'}).click()
 await expect(page.getByText('01 / LACUNA DO PROJETO ANTERIOR')).toBeVisible()
 await expect(page.getByText('O cluster local e o standby na nuvem já são propostos.',{exact:false})).toBeVisible()
 await expect(page.getByText('02 / SOLUÇÃO PROPOSTA')).toBeVisible()
 await page.getByRole('button',{name:'Fechar detalhes'}).click()
 await page.getByRole('button',{name:'Depois',exact:true}).click()
 await expect(page.locator('.clean-card').filter({hasText:'Eliminar falhas comuns do serviço ERP'})).toBeVisible()
 await expect(page.locator('.clean-card').filter({hasText:'Eliminar dependências comuns da alimentação'})).toBeVisible()
})

test('seis seções usam o plano acadêmico anterior como referência', async ({page}) => {
 const errors=[]
 page.on('pageerror',error=>errors.push(error.message))
 await page.goto('/')
 const cases=[
  {tab:'Matriz de risco',before:'Matriz R1–R11 e ativos citados',after:'Inventário vinculando ativos e riscos'},
  {tab:'Identidade e acesso',before:'MFA administrativo e remoto proposto',after:'MFA forte com recuperação segura'},
  {tab:'Recuperação',before:'Regra 3-2-1 e imutabilidade propostas',after:'Proteção testada em laboratório'},
  {tab:'Governança de dados',before:'Coleta minimizada com finalidade e base legal',after:'Finalidade documentada por processo'},
  {tab:'Políticas & controles',before:'Política 3-2-1 e rotina de testes definida',after:'Procedimentos e aceite registrados'},
  {tab:'Plano de execução',before:'Fase 3: DR, BI e failover medindo RPO/RTO',after:'Dependências e isolamento validados'},
 ]
 for(const item of cases){
  await page.getByRole('tab',{name:new RegExp(item.tab,'i')}).click()
  await page.getByRole('button',{name:'Antes',exact:true}).click()
  await expect(page.getByText('PROJETO ANTERIOR · PROPOSTA JÁ REFINADA')).toBeVisible()
  await expect(page.locator('.clean-card').filter({hasText:item.before})).toBeVisible()
  await page.getByRole('button',{name:'Depois',exact:true}).click()
  await expect(page.locator('.clean-card').filter({hasText:item.after})).toBeVisible()
 }
 await expect(page.getByLabel('Gravidade das intervenções')).toBeVisible()
 await expect(page.locator('.clean-risk-critical').first()).toBeVisible()
 await page.locator('.clean-card').first().click()
 await expect(page.getByText('01 / LACUNA DO PROJETO ANTERIOR')).toBeVisible()
 await expect(page.getByText(/GRAVIDADE DA INTERVENÇÃO · (CRÍTICA|ALTA|MODERADA)/)).toBeVisible()
 expect(errors).toEqual([])
})

test('cada card mostra uma única gravidade por cor em todas as seções', async ({page}) => {
 await page.goto('/')
 for(const tab of ['Infraestrutura','Matriz de risco','Identidade e acesso','Recuperação','Governança de dados','Políticas & controles','Plano de execução']){
  await page.getByRole('tab',{name:new RegExp(tab,'i')}).click()
  const cards=page.locator('.clean-card')
  const count=await cards.count()
  expect(count).toBeGreaterThan(8)
  expect(await page.locator('.clean-risk').count()).toBe(count)
  expect(await page.locator('.clean-card-severity-critical, .clean-card-severity-high, .clean-card-severity-medium').count()).toBe(count)
  const colored=await page.locator('.clean-card').first().evaluate(el=>getComputedStyle(el,'::before').backgroundColor)
  expect(colored).not.toBe('rgba(0, 0, 0, 0)')
 }
})


test('home apresenta resumo macro e permite navegar para todos os sete diagramas', async ({page}) => {
 const errors=[]
 page.on('pageerror',error=>errors.push(error.message))
 await page.goto('/')
 await expect(page.getByRole('main',{name:'Visão geral da reengenharia'})).toBeVisible()
 await expect(page.getByRole('heading',{name:/Da arquitetura proposta à segurança verificável/})).toBeVisible()
 await expect(page.getByRole('tab')).toHaveCount(8)
 await expect(page.getByRole('tab',{name:/Visão geral/})).toHaveAttribute('aria-selected','true')
 await expect(page.getByText('O projeto anterior já tinha uma base sólida.')).toBeVisible()
 await expect(page.locator('.overview-workstream')).toHaveCount(7)
 await expect(page.getByText('Problemas identificados.',{exact:false})).toBeVisible()
 await expect(page.getByText('Menos suposições.',{exact:false})).toBeVisible()
 await page.getByRole('button',{name:/Explorar diagramas/}).click()
 await expect(page.getByRole('heading',{name:/Arquitetura & continuidade/})).toBeVisible()
 await page.getByRole('tab',{name:/Visão geral/}).click()
 await page.locator('.overview-workstream').filter({hasText:'Dados e LGPD'}).click()
 await expect(page.getByRole('heading',{name:/Ciclo de vida/})).toBeVisible()
 await page.getByRole('tab',{name:/Visão geral/}).click()
 await page.getByRole('button',{name:/Fontes e premissas/}).click()
 await expect(page.getByText('FONTES E PREMISSAS',{exact:true})).toBeVisible()
 expect(errors).toEqual([])
})

test('home possui rolagem vertical independente mantendo tabs inferiores', async ({page})=>{
 await page.goto('/')
 const pageArea=page.locator('.overview-page')
 await expect(pageArea).toBeVisible()
 const before=await pageArea.evaluate(el=>({height:el.clientHeight,scroll:el.scrollHeight}))
 expect(before.scroll).toBeGreaterThan(before.height)
 await pageArea.evaluate(el=>el.scrollTo(0,el.scrollHeight))
 await expect(page.getByRole('tab',{name:/Visão geral/})).toBeVisible()
 await expect(page.getByRole('button',{name:/Abrir primeiro diagrama/})).toBeVisible()
})

test('infraestrutura expõe riscos sistêmicos e reconhece a medição de RPO e RTO já prevista', async ({page})=>{
 await page.goto('/')
 await page.getByRole('tab',{name:/Infraestrutura/i}).click()
 await page.getByRole('button',{name:'Antes',exact:true}).click()
 await expect(page.locator('.clean-card').filter({hasText:'Perfis, MFA e serviços de apoio com RTO de 2h'})).toBeVisible()
 await expect(page.locator('.clean-card').filter({hasText:'DR com standby, failover assistido, failback e RPO/RTO medidos'})).toBeVisible()
 await page.getByRole('button',{name:'Depois',exact:true}).click()
 for(const text of [
   'Identidade/DNS/VPN recuperáveis antes do ERP',
   'Fencing e integridade transacional no failover',
   'Eliminar falhas comuns da conectividade',
   'Eliminar dependências comuns da alimentação',
   'Recuperar a cadeia completa do serviço'
 ]){
  await expect(page.locator('.clean-card').filter({hasText:text})).toBeVisible()
 }
 await page.locator('.clean-card').filter({hasText:'Dependências e reversão seguras no DR'}).click()
 await expect(page.getByText('01 / LACUNA DO PROJETO ANTERIOR')).toBeVisible()
 await expect(page.getByText(/ERP com RTO de 1 hora/)).toBeVisible()
 await expect(page.getByText(/A medição de RPO\/RTO que o plano já previa/)).toHaveCount(0)
 await expect(page.getByText(/Preservar a medição de RPO\/RTO que o plano já previa/)).toBeVisible()
 await expect(page.getByText(/GRAVIDADE DA INTERVENÇÃO · CRÍTICA/)).toBeVisible()
})


test('inicialização cobre todos os nós da infraestrutura sem exceções', async ({page})=>{
 const errors=[]
 page.on('pageerror',e=>errors.push(e.message))
 await page.goto('/')
 await page.getByRole('tab',{name:/Infraestrutura/i}).click()
 await expect(page.locator('.clean-card')).toHaveCount(12)
 await page.getByRole('button',{name:'Antes',exact:true}).click()
 await expect(page.locator('.clean-card')).toHaveCount(12)
 await page.getByRole('button',{name:'Depois',exact:true}).click()
 await expect(page.locator('.clean-card')).toHaveCount(12)
 const labels=['Rede corporativa','Data warehouse','Detecção e resposta','BIA e continuidade','Criptografia e chaves']
 const { ENHANCEMENTS }=await import('../src/boardEnhancements.js')
 const { refineInfrastructureComparison }=await import('../src/infrastructureRefinement.js')
 const extras=ENHANCEMENTS.architecture.extra.map(([id,,label])=>({id,label,problem:'test',solution:'test'}))
 const base=Object.keys(ENHANCEMENTS.architecture.existing).map(id=>({id,label:id}))
 const all=refineInfrastructureComparison({id:'architecture',nodes:[...base,...extras]})
 expect(all.nodes).toHaveLength(base.length+extras.length)
 for(const node of all.nodes){
  expect(node.before).toBeTruthy()
  expect(node.after).toBeTruthy()
  expect(node.problem).toBeTruthy()
  expect(node.solution).toBeTruthy()
  expect(node.evidence).toBeTruthy()
 }
 for(const label of labels)expect(all.nodes.some(node=>node.label===label)).toBe(true)
 expect(errors).toEqual([])
})
