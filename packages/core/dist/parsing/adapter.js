export class AdapterRegistry {
    adapters = new Map();
    register(adapter) {
        for (const ext of adapter.extensions) {
            this.adapters.set(ext.toLowerCase(), adapter);
        }
    }
    getAdapter(filePath) {
        const dotIndex = filePath.lastIndexOf('.');
        if (dotIndex === -1)
            return null;
        const ext = filePath.slice(dotIndex).toLowerCase();
        return this.adapters.get(ext) || null;
    }
}
//# sourceMappingURL=adapter.js.map