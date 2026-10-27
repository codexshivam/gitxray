export class ExecutionTracer {
  constructor() {
    this.frames = [];
    this.callStack = [];
    this.variables = new Map();
    this.dbState = new Map();
  }

  reset() {
    this.frames = [];
    this.callStack = [];
    this.variables.clear();
    this.dbState.clear();
  }

  recordStep({ file, line, fn, type, payload, stateChanges = {}, dbMutations = [] }) {
    if (type === 'call') {
      this.callStack.push({ file, fn, line });
    } else if (type === 'return') {
      if (this.callStack.length > 0) {
        this.callStack.pop();
      }
    }

    const previousVars = Object.fromEntries(this.variables);
    for (const [key, val] of Object.entries(stateChanges)) {
      this.variables.set(key, JSON.parse(JSON.stringify(val)));
    }
    const currentVars = Object.fromEntries(this.variables);

    for (const mutation of dbMutations) {
      const { table, op, row } = mutation;
      if (!this.dbState.has(table)) {
        this.dbState.set(table, []);
      }
      const tableRows = this.dbState.get(table);
      if (op === 'insert') {
        tableRows.push(row);
      } else if (op === 'update') {
        const idx = tableRows.findIndex(r => r.id === row.id);
        if (idx !== -1) tableRows[idx] = row;
        else tableRows.push(row);
      } else if (op === 'delete') {
        const idx = tableRows.findIndex(r => r.id === row.id);
        if (idx !== -1) tableRows.splice(idx, 1);
      }
    }

    const frame = {
      stepIndex: this.frames.length,
      timestamp: Date.now(),
      file,
      line,
      fn,
      type,
      payload,
      stack: JSON.parse(JSON.stringify(this.callStack)),
      variables: currentVars,
      variableDiff: this._diffObjects(previousVars, currentVars),
      dbSnapshot: Object.fromEntries(
        Array.from(this.dbState.entries()).map(([k, v]) => [k, JSON.parse(JSON.stringify(v))])
      )
    };

    this.frames.push(frame);
    return frame;
  }

  _diffObjects(prev, curr) {
    const diff = { updated: {}, added: {}, removed: {} };
    for (const key of Object.keys(curr)) {
      if (!(key in prev)) {
        diff.added[key] = curr[key];
      } else if (JSON.stringify(prev[key]) !== JSON.stringify(curr[key])) {
        diff.updated[key] = { from: prev[key], to: curr[key] };
      }
    }
    for (const key of Object.keys(prev)) {
      if (!(key in curr)) {
        diff.removed[key] = prev[key];
      }
    }
    return diff;
  }

  getTimeline() {
    return {
      totalSteps: this.frames.length,
      frames: this.frames
    };
  }

  scrub(index) {
    const clampedIndex = Math.max(0, Math.min(index, this.frames.length - 1));
    return this.frames[clampedIndex] || null;
  }
}
