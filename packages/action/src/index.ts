export async function runAction(): Promise<void> {
  console.log('GitXray Action running...');
}

if (process.env.GITHUB_ACTIONS) {
  runAction().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
