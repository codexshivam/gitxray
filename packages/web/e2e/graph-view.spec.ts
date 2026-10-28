import { test, expect } from '@playwright/test';

test.describe('GitXray Web Shell & Graph View E2E', () => {
  test('landing page loads and allows selecting a sample repo', async ({ page }) => {
    await page.goto('/');

    // 1. Verify landing hero headline
    await expect(page.locator('h1')).toContainText('Decompile any GitHub repo');

    // 2. Click on a showcase card (e.g. Whisper or Flask)
    const showcaseCard = page.locator('text=pallets/flask').or(page.locator('text=Whisper')).first();
    await showcaseCard.click();

    // 3. Verify workspace loads with canvas
    await expect(page.locator('canvas')).toBeVisible({ timeout: 20000 });
  });

  test('open a known repo route -> graph renders -> clicking a node shows code', async ({ page }) => {
    // Open known repo route via query parameter for static dev server
    await page.goto('/?repo=pallets/flask');

    // 1. Wait for Canvas to render (indicates analysis pipeline is complete and active)
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 25000 });

    // 2. Verify header metrics and files are displayed
    await expect(page.locator('text=Files')).toBeVisible();

    // 3. Verify Ranked Hierarchy Sidebar is mounted
    const rankedSidebar = page.locator('aside');
    await expect(rankedSidebar).toBeVisible();
    await expect(page.locator('text=Ranked Hierarchy')).toBeVisible();

    // 4. Click a node in the ranked sidebar
    const fileButton = page.locator('aside button').nth(1);
    await fileButton.click();

    // 5. Verify FileInspector drawer opens with Source Code tab button, Dependencies tab, and code table
    await expect(page.getByRole('button', { name: /Source Code/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Dependencies/ })).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
  });
});
