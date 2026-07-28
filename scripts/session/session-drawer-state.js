import { normalizeSessionConfig } from './session-model.js';

export const SESSION_PREFERENCES_KEY = 'quiz-tsi-session-drawer-v1';
export function createSessionDrawerState(initial, learningState = {}, storage = localStorage) {
  let active = normalizeSessionConfig(initial, learningState);
  let pending = null;
  const persist = () => storage.setItem(SESSION_PREFERENCES_KEY, JSON.stringify(active));
  return {
    get active() { return active; },
    get pending() { return pending; },
    update(next) { active = normalizeSessionConfig({ ...active, ...next, plan: [] }, learningState); persist(); return active; },
    defer(next) { pending = normalizeSessionConfig({ ...active, ...next, plan: [] }, learningState); storage.setItem(SESSION_PREFERENCES_KEY, JSON.stringify(pending)); return pending; },
    applyPending() { if (pending) active = pending; pending = null; persist(); return active; },
    clearPending() { pending = null; }
  };
}
