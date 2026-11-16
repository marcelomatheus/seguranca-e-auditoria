import { test, expect } from '@playwright/test'

test('renders every board and supports comparison, inspection, and PDF export', async ({ page }) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /Arquitetura & continuidade/ })).toBeVisible()
  const boardLabels = [
    'Infraestrutura', 'Matriz de risco', 'Identidade e acesso',
    'Recuperação', 'Governança de dados', 'Políticas & controles', 'Plano de execução',
  ]
  for (const label of boardLabels) {
    await page.getByRole('button', { name: new RegExp(label, 'i') }).first().click()
    await expect(page.locator('.graph-node').first()).toBeVisible()
    await page.getByRole('button', { name: 'Antes', exact: true }).click()
    await expect(page.locator('.graph-node.before').first()).toBeVisible()
    await page.getByRole('button', { name: 'Depois', exact: true }).click()
    await expect(page.locator('.graph-node.after').first()).toBeVisible()
    await page.getByRole('button', { name: 'Comparar', exact: true }).click()
    await expect(page.locator('.split-pane')).toHaveCount(2)
    await page.getByRole('button', { name: 'Depois', exact: true }).click()
  }
  await page.locator('.graph-node').first().click()
  await expect(page.locator('.inspector')).toBeVisible()
  await expect(page.getByText('REFINAMENTO PROPOSTO', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Fechar detalhes' }).click()
  const downloadPromise = page.waitForEvent('download', { timeout: 30000 })
  await page.getByRole('button', { name: /Exportar PDF/ }).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toMatch(/\.pdf$/)
  expect(errors).toEqual([])
})
