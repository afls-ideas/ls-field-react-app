import { test, expect } from '@playwright/test';

test.describe('Field Ledger', () => {
  test('dashboard loads with its heading', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: 'Your territory at a glance' })
    ).toBeVisible();
  });

  test('navigates to the visits page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Visits' }).click();
    await expect(page.getByRole('heading', { name: 'Visits' })).toBeVisible();
  });

  test('not found route shows 404', async ({ page }) => {
    await page.goto('/non-existent-route');
    await expect(page.getByText('404')).toBeVisible();
  });
});
