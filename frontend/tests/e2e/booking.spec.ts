import { test, expect } from '@playwright/test'

test('search for a listing and complete booking flow', async ({ page }) => {
  await page.route('**/api/v1/bookings', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ id: 'booking-123', status: 'CONFIRMED' }),
    })
  })

  await page.goto('/')
  await expect(page.locator('text=Featured destinations')).toBeVisible()

  const firstCard = page.locator('article').first()
  await expect(firstCard).toBeVisible()
  await firstCard.click()

  await expect(page).toHaveURL(/\/listings\/.+/)
  await expect(page.locator('text=Reserve your experience')).toBeVisible()

  await page.click('text=Next step')
  await page.click('text=Next step')
  await page.fill('input[type="number"]', '2')
  await page.click('button:has-text("Confirm booking")')

  await expect(page.locator('text=Booking confirmed!')).toBeVisible({ timeout: 10000 })
})
