import { describe, it, expect } from 'vitest';
import { parseRepoInput } from './url';

describe('parseRepoInput', () => {
  it('parses shorthand owner/repo', () => {
    const res = parseRepoInput('pallets/flask');
    expect(res).toEqual({ owner: 'pallets', repo: 'flask', ref: undefined });
  });

  it('parses shorthand with branch ref', () => {
    const res = parseRepoInput('pallets/flask@main');
    expect(res).toEqual({ owner: 'pallets', repo: 'flask', ref: 'main' });
  });

  it('parses github.com URLs', () => {
    const res = parseRepoInput('https://github.com/facebook/react');
    expect(res).toEqual({ owner: 'facebook', repo: 'react', ref: undefined });
  });

  it('parses github.com URLs with .git and trailing slash', () => {
    const res = parseRepoInput('https://github.com/openai/whisper.git');
    expect(res).toEqual({ owner: 'openai', repo: 'whisper', ref: undefined });
  });

  it('parses gitxray.dev and gitxray.shivm.co URLs', () => {
    const res = parseRepoInput('https://gitxray.dev/expressjs/express');
    expect(res).toEqual({ owner: 'expressjs', repo: 'express', ref: undefined });

    const res2 = parseRepoInput('https://gitxray.shivm.co/codexshivam/nidaniq');
    expect(res2).toEqual({ owner: 'codexshivam', repo: 'nidaniq', ref: undefined });
  });

  it('returns null on invalid input', () => {
    expect(parseRepoInput('')).toBeNull();
    expect(parseRepoInput('invalid-single-word')).toBeNull();
  });
});
