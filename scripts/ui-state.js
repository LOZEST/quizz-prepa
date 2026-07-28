import { activeWorkspace } from './workspace/user-workspace.js';

export const HANDEDNESS_KEY = 'quiz-tsi-handedness';

function preferenceStorage(fallback = localStorage) {
  try {
    const workspace = activeWorkspace();
    const area = 'ui-preferences';
    const readAll = () => workspace.read(area, {}) || {};
    return {
      getItem(key) {
        const values = readAll();
        return Object.prototype.hasOwnProperty.call(values, key) ? String(values[key]) : fallback.getItem(key);
      },
      setItem(key, value) {
        workspace.write(area, { ...readAll(), [key]: String(value) });
      }
    };
  } catch {
    return fallback;
  }
}

export function normalizeHandedness(value) {
  return value === 'left' ? 'left' : 'right';
}

export function readHandedness(storage = preferenceStorage()) {
  try {
    return normalizeHandedness(storage.getItem(HANDEDNESS_KEY));
  } catch {
    return 'right';
  }
}

export function writeHandedness(value, storage = preferenceStorage()) {
  const normalized = normalizeHandedness(value);
  storage.setItem(HANDEDNESS_KEY, normalized);
  return normalized;
}

export function setDrawerState({ drawer, backdrop, button }, open) {
  drawer.classList.toggle('open', open);
  drawer.setAttribute('aria-hidden', String(!open));
  drawer.inert = !open;
  backdrop.classList.toggle('hidden', !open);
  button.setAttribute('aria-expanded', String(open));
}

export function setQuestionCollapsed(card, button, collapsed) {
  card.classList.toggle('collapsed', collapsed);
  button.setAttribute('aria-expanded', String(!collapsed));
  button.setAttribute('aria-label', collapsed ? 'Agrandir la question' : 'Réduire la question');
  button.textContent = collapsed ? '⌄' : '⌃';
}

export function setToolState(select, button, tool) {
  const eraser = tool === 'eraser';
  select.value = eraser ? 'eraser' : 'pen';
  button.setAttribute('aria-pressed', String(eraser));
  button.setAttribute('aria-label', eraser ? 'Outil actif : gomme. Passer au stylo' : 'Outil actif : stylo. Passer à la gomme');
  button.querySelector('span').textContent = eraser ? '⌫' : '✎';
  button.querySelector('strong').textContent = eraser ? 'Gomme' : 'Stylo';
}
