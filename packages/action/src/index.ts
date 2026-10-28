import fs from 'node:fs';
import { BlastRadiusAction, ActionConfig } from './action.js';

export async function runAction(): Promise<void> {
  const token = process.env.GITHUB_TOKEN || process.env.INPUT_GITHUB_TOKEN || '';
  const repo = process.env.GITHUB_REPOSITORY || '';
  const eventPath = process.env.GITHUB_EVENT_PATH || '';
  const enabled = process.env.INPUT_ENABLED !== 'false';

  if (!enabled) {
    console.log('GitXray Action is disabled (input enabled: false).');
    return;
  }

  let prNumber = 0;
  if (eventPath && fs.existsSync(eventPath)) {
    try {
      const eventData = JSON.parse(fs.readFileSync(eventPath, 'utf8'));
      prNumber = eventData.pull_request?.number || 0;
    } catch (e) {
      console.warn('Could not read GITHUB_EVENT_PATH:', e);
    }
  }

  const config: ActionConfig = {
    githubToken: token,
    repo,
    prNumber,
    enabled
  };

  console.log(`GitXray Action running for repo: ${repo}, PR: #${prNumber}`);
}

export * from './action.js';

if (process.env.GITHUB_ACTIONS) {
  runAction().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
