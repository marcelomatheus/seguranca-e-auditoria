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
  await expect(page.locator('.element').first()).toBeVisible()
  expect(await page.locator('.element').count()).toBeGreaterThan(8)
  await page.getByRole('button',{name:'Antes',exact:true}).click()
  await expect(page.locator('.element-before').first()).toBeVisible()
  await page.getByRole('button',{name:'Depois',exact:true}).click()
  await expect(page.locator('.element-after').first()).toBeVisible()
  await page.getByRole('button',{name:'Comparar',exact:false}).click()
  await expect(page.locator('.comparison-pane')).toHaveCount(2)
  await page.getByRole('button',{name:'Depois',exact:true}).click()
 }
 await page.locator('.element').first().click()
 await expect(page.getByLabel('Detalhamento do controle')).toBeVisible()
 await expect(page.getByText('02 / DEFINIÇÃO DE REENGENHARIA')).toBeVisible()
 await page.getByRole('button',{name:'Fechar detalhes'}).click()
 const downloadPromise=page.waitForEvent('download',{timeout:45000})
 await page.getByRole('button',{name:/Exportar PDF/}).click()
 const download=await downloadPromise
 expect(download.suggestedFilename()).toMatch(/\.pdf$/)
 expect(errors).toEqual([])
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
