import { normalizeSessionConfig } from './session-model.js';

export const SESSION_PREFERENCES_KEY = 'session-drawer';

function write(storage, value) {
  if (!storage) return;
  if (typeof storage.write === 'function') {
    storage.write(SESSION_PREFERENCES_KEY, value);
    return;
  }
  storage.setItem(SESSION_PREFERENCES_KEY, JSON.stringify(value));
}

export function createSessionDrawerState(initial, learningState = {}, storage = null) {
  let active = normalizeSessionConfig(initial, learningState);
  let pending = null;

  const persist = () => write(storage, active);

  return {
    get active() {
      return active;
    },
    get pending() {
      return pending;
    },
    update(next) {
      active = normalizeSessionConfig({ ...active, ...next, plan: [] }, learningState);
      pending = null;
      persist();
      return active;
    },
    defer(next) {
      pending = normalizeSessionConfig({ ...active, ...next, plan: [] }, learningState);
      return pending;
    },
    applyPending() {
      if (pending) active = pending;
      pending = null;
      persist();
      return active;
    },
    replaceActive(next) {
      active = normalizeSessionConfig(next, learningState);
      persist();
      return active;
    },
    clearPending() {
      pending = null;
    }
  };
}
