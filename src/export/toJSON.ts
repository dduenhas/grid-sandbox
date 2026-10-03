import { PROJECT_KEYS, type State } from '../store/useStore';

export function toJSON(s: State): string {
  const state = Object.fromEntries(PROJECT_KEYS.map((k) => [k, s[k]]));
  return JSON.stringify({ app: 'grid-sandbox', version: 1, savedAt: new Date().toISOString(), state }, null, 2);
}
