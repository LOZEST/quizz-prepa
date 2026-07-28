import { QUESTION_TYPES, SESSION_MODES } from './session-model.js';
export function renderSessionDrawer(root, config, { pending = false } = {}) {
  if (!root) return;
  root.dataset.mode = config.mode;
  root.querySelectorAll('[data-session-panel]').forEach(panel => { panel.hidden = panel.dataset.sessionPanel !== config.mode; });
  const free = config.mode === SESSION_MODES.FREE;
  root.querySelector('[data-free-filters]')?.toggleAttribute('hidden', !free);
  const reflex = free && config.questionType === QUESTION_TYPES.REFLEX;
  root.querySelector('[data-difficulty-field]')?.toggleAttribute('hidden', reflex);
  root.querySelector('[data-reflex-note]')?.toggleAttribute('hidden', !reflex);
  root.querySelector('[data-switch-banner]')?.toggleAttribute('hidden', !pending);
}
export function readDrawerConfiguration(root) {
  const value = id => root.querySelector(`#${id}`)?.value;
  return { mode: value('modeSelect'), partId: value('partSelect'), chapterId: value('chapterSelect'), notionId: value('notionSelect'), questionType: value('questionTypeSelect'), difficulty: value('difficultySelect') };
}
