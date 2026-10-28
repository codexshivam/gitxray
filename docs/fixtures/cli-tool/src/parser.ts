export function parseArguments(argv: string[]): string {
  const flags = argv.slice(2);
  return flags[0] || 'default';
}
