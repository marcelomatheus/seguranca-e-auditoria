import { test, expect } from '@playwright/test'

test('renders dense bottom-tab boards, comparison, inspector and PDF', async ({ page }) => {
 const errors=[]
 page.on('pageerror', error=>errors.push(error.message))
 await page.goto('/')
 await expect(page.getByRole('heading',{name:/Arquitetura & continuidade/})).toBeVisible()
 await expect(page.getByRole('tab')).toHaveCount(7)
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
 await expect(page.locator('.clean-card').filter({hasText:'ERP em cluster no site primário'})).toBeVisible()
 await expect(page.locator('.clean-card').filter({hasText:'2 ISPs + SD-WAN/VPN'})).toBeVisible()
 await expect(page.locator('.clean-card').filter({hasText:'2 circuitos + nobreak + gerador'})).toBeVisible()
 await expect(page.locator('.clean-card').filter({hasText:'BD primário HA + réplica de DR'})).toBeVisible()
 await expect(page.locator('.clean-card').filter({hasText:'Backup em nuvem imutável, criptografado e versionado'})).toBeVisible()
 await expect(page.locator('.clean-card').filter({hasText:'Firewall / WAF · MFA · menor privilégio'})).toBeVisible()
 await expect(page.locator('.clean-card').filter({hasText:'BI e dashboards na nuvem'})).toBeVisible()
 await page.locator('.clean-card').filter({hasText:'ERP em cluster no site primário'}).click()
 await expect(page.getByText('01 / LACUNA DO PROJETO ANTERIOR')).toBeVisible()
 await expect(page.getByText('O trabalho anterior já propõe ERP em cluster e ERP standby em nuvem.',{exact:false})).toBeVisible()
 await expect(page.getByText('02 / SOLUÇÃO PROPOSTA')).toBeVisible()
 await page.getByRole('button',{name:'Fechar detalhes'}).click()
 await page.getByRole('button',{name:'Depois',exact:true}).click()
 await expect(page.locator('.clean-card').filter({hasText:'Cluster com failover comprovado'})).toBeVisible()
 await expect(page.locator('.clean-card').filter({hasText:'Energia redundante supervisionada'})).toBeVisible()
})
