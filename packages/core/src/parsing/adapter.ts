import { LanguageAdapter } from '../types.js';

export class AdapterRegistry {
  private adapters = new Map<string, LanguageAdapter>();

  register(adapter: LanguageAdapter): void {
    for (const ext of adapter.extensions) {
      this.adapters.set(ext.toLowerCase(), adapter);
    }
  }

  getAdapter(filePath: string): LanguageAdapter | null {
    const dotIndex = filePath.lastIndexOf('.');
    if (dotIndex === -1) return null;
    const ext = filePath.slice(dotIndex).toLowerCase();
    return this.adapters.get(ext) || null;
  }
}
