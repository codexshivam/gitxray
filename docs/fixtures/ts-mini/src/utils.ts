export function formatTimestamp(ms: number): string {
  return new Date(ms).toISOString();
}
