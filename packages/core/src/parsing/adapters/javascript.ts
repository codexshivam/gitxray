import { TypeScriptAdapter } from './typescript.js';

export class JavaScriptAdapter extends TypeScriptAdapter {
  override name = 'javascript';
  override extensions = ['.js', '.jsx', '.mjs', '.cjs'];
}
