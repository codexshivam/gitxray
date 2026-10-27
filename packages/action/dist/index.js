export async function runAction() {
    console.log('GitXray Action running...');
}
if (process.env.GITHUB_ACTIONS) {
    runAction().catch(err => {
        console.error(err);
        process.exit(1);
    });
}
//# sourceMappingURL=index.js.map