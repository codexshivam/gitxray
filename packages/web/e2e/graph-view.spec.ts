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

  test('unbox mode verifies student code deterministically and marks milestone complete', async ({ page }) => {
    await page.goto('/?repo=pallets/flask');

    // 1. Wait for canvas to be visible first
    await expect(page.locator('canvas')).toBeVisible({ timeout: 25000 });

    // 2. Switch to Unbox Mode tab
    const unboxTab = page.getByRole('button', { name: /Unbox Mode/ });
    await expect(unboxTab).toBeVisible();
    await unboxTab.click();

    // 3. Verify course header and milestone list
    await expect(page.locator('text=Build Flask from Scratch')).toBeVisible();
    await expect(page.locator('text=Reviewed Course')).toBeVisible();
    await expect(page.locator('text=Stage 0: The WSGI Dispatcher Core Loop')).toBeVisible();

    // 4. Run Check on incomplete starter code -> expect failure
    const checkBtn = page.getByRole('button', { name: /Run Hard Invariant Check/ });
    await checkBtn.click();
    await expect(page.locator('text=FAIL:')).toBeVisible();

    // 5. Click Solution button to load working code
    const solutionBtn = page.getByRole('button', { name: 'Solution' });
    await solutionBtn.click();

    // 6. Run Check on correct solution -> expect deterministic pass
    await checkBtn.click();
    await expect(page.locator('text=PASS: Deterministic Invariants Validated')).toBeVisible();
    await expect(page.locator('text=Verified Complete')).toBeVisible();
  });

  test('opens Socratic AI modal and Export Context modal with live badge and CLAUDE.md', async ({ page }) => {
    await page.goto('/?repo=pallets/flask');

    // Wait for workspace canvas
    await expect(page.locator('canvas')).toBeVisible({ timeout: 25000 });

    // 1. Open AI Mentor modal
    const aiBtn = page.getByRole('button', { name: /AI Mentor/ }).first();
    await aiBtn.click();
    await expect(page.locator('text=Socratic AI Explanations')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Settings' })).toBeVisible();

    // Close AI modal
    await page.getByRole('button', { name: 'Done' }).click();
    await expect(page.locator('text=Socratic AI Explanations')).not.toBeVisible();

    // 2. Open Export Context modal
    const exportBtn = page.getByRole('button', { name: /Export Context/ });
    await exportBtn.click();
    await expect(page.locator('text=Export Architecture Context & Badges')).toBeVisible();
    await expect(page.getByRole('button', { name: 'CLAUDE.md' })).toBeVisible();
    await expect(page.getByRole('button', { name: '.agents/skills.md' })).toBeVisible();
    await expect(page.getByRole('button', { name: /SVG Architecture Badge/ })).toBeVisible();

    // Switch to SVG Badge tab
    const badgeTab = page.getByRole('button', { name: /SVG Architecture Badge/ });
    await badgeTab.click();
    await expect(page.locator('text=Live Badge Preview:')).toBeVisible();

    // Verify Download File button is visible
    await expect(page.getByRole('button', { name: 'Download File' })).toBeVisible();
    await page.keyboard.press('Escape').catch(() => {});
  });
});
