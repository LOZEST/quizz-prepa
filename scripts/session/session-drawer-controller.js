import { createSessionDrawerState } from './session-drawer-state.js';
import { FILTER_STABILIZATION_MS, boardHasWork, chapterTestConfiguration, sessionSwitchDecision } from './session-switch-policy.js';
import { readDrawerConfiguration, renderSessionDrawer } from './session-drawer-view.js';
import { SESSION_MODES } from './session-model.js';
export function createSessionDrawerController({ root, initial, learningState, storage = localStorage, board, hasStarted, onApply, onChapterTest, confirmClear = message => globalThis.confirm(message) }) {
  const state = createSessionDrawerState(initial, learningState, storage); let timer;
  const status = () => ({ boardUsed: boardHasWork(board), ...hasStarted() });
  const request = ({ stabilized = false } = {}) => {
    clearTimeout(timer); const next = readDrawerConfiguration(root);
    if (next.mode === SESSION_MODES.CHAPTER_TEST) { renderSessionDrawer(root, next); return; }
    const run = () => {
      if (sessionSwitchDecision(status()) === 'immediate') { const active = state.update(next); renderSessionDrawer(root, active); onApply(active, { clear: false }); }
      else { state.defer(next); renderSessionDrawer(root, next, { pending: true }); }
    };
    timer = stabilized ? setTimeout(run, FILTER_STABILIZATION_MS) : (run(), undefined);
  };
  root.addEventListener('change', event => { if (event.target.matches('select')) request({ stabilized: event.target.id !== 'modeSelect' }); });
  root.querySelector('[data-change-now]')?.addEventListener('click', () => { if (boardHasWork(board) && !confirmClear('Effacer le tableau et changer de question ?')) return; const active = state.applyPending(); renderSessionDrawer(root, active); onApply(active, { clear: true }); });
  root.querySelector('[data-finish-current]')?.addEventListener('click', () => { renderSessionDrawer(root, state.pending || state.active); root.querySelector('[data-switch-banner]').hidden = true; });
  root.querySelector('[data-start-chapter-test]')?.addEventListener('click', () => onChapterTest(chapterTestConfiguration({ chapterId: root.querySelector('#testChapterSelect')?.value, count: root.querySelector('input[name="chapterTestCount"]:checked')?.value })));
  renderSessionDrawer(root, state.active); return { state, request, applyPending: () => state.applyPending() };
}
