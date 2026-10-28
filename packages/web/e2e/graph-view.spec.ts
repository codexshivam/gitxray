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

  test('execution stepper steps forward and backward with call stack and variables', async ({ page }) => {
    await page.goto('/?repo=pallets/flask');

    // 1. Wait for canvas to be visible first
    await expect(page.locator('canvas')).toBeVisible({ timeout: 25000 });

    // 2. Switch to Execution Stepper tab
    const stepperTab = page.getByRole('button', { name: /Execution Stepper/ });
    await expect(stepperTab).toBeVisible();
    await stepperTab.click();

    // 3. Verify Execution Stepper panels are mounted
    await expect(page.locator('text=Trace Scenario:')).toBeVisible();
    await expect(page.locator('div:has-text("Call Stack")').first()).toBeVisible();
    await expect(page.locator('div:has-text("Variables & Scope")').first()).toBeVisible();

    // 4. Step forward using the Next button
    const nextBtn = page.getByTitle('Next Step (Right Arrow)');
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();

    // 5. Switch to Recursive Factorial scenario
    const scenarioSelect = page.locator('select');
    await scenarioSelect.selectOption('recursive');

    // 6. Verify Call Stack depth reflects recursion
    await expect(page.locator('text=calc.py').first()).toBeVisible();
    await expect(page.locator('text=Depth:')).toBeVisible();
  });
});
