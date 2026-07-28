import { activeWorkspace } from '../workspace/user-workspace.js';
import { createSessionDrawerState } from './session-drawer-state.js';
import {
  FILTER_STABILIZATION_MS,
  boardHasWork,
  chapterTestConfiguration,
  sessionSwitchDecision
} from './session-switch-policy.js';
import {
  readDrawerConfiguration,
  renderSessionDrawer,
  requestSessionChangeConfirmation
} from './session-drawer-view.js';
import { SESSION_MODES } from './session-model.js';

function defaultStorage() {
  try {
    return activeWorkspace();
  } catch {
    return null;
  }
}

export function createSessionDrawerController({
  root,
  initial,
  learningState,
  storage = defaultStorage(),
  board,
  hasStarted,
  onApply,
  onChapterTest
}) {
  const state = createSessionDrawerState(initial, learningState, storage);
  let timer;
  let pendingAcknowledged = false;

  const status = () => ({
    boardUsed: boardHasWork(board),
    ...hasStarted()
  });

  const request = ({ stabilized = false } = {}) => {
    clearTimeout(timer);
    const next = readDrawerConfiguration(root);

    if (next.mode === SESSION_MODES.CHAPTER_TEST) {
      renderSessionDrawer(root, next);
      return;
    }

    const run = () => {
      if (sessionSwitchDecision(status()) === 'immediate') {
        const active = state.update(next);
        renderSessionDrawer(root, active);
        onApply(active, { clear: false });
        return;
      }

      const pending = state.defer(next);
      pendingAcknowledged = false;
      renderSessionDrawer(root, pending, { pending: true });
    };

    if (stabilized) timer = setTimeout(run, FILTER_STABILIZATION_MS);
    else run();
  };

  root.addEventListener('change', event => {
    if (!event.target.matches('select')) return;
    request({ stabilized: event.target.id !== 'modeSelect' });
  });

  root.querySelector('[data-change-now]')?.addEventListener('click', async () => {
    if (sessionSwitchDecision(status()) === 'ask') {
      const confirmed = await requestSessionChangeConfirmation(root);
      if (!confirmed) return;
    }
    const active = state.applyPending();
    pendingAcknowledged = false;
    renderSessionDrawer(root, active);
    onApply(active, { clear: true });
  });

  root.querySelector('[data-finish-current]')?.addEventListener('click', () => {
    pendingAcknowledged = true;
    renderSessionDrawer(root, state.pending || state.active, { pending: false });
  });

  root.querySelector('[data-start-chapter-test]')?.addEventListener('click', async () => {
    if (sessionSwitchDecision(status()) === 'ask') {
      const confirmed = await requestSessionChangeConfirmation(root);
      if (!confirmed) return;
    }
    const config = chapterTestConfiguration({
      chapterId: root.querySelector('#testChapterSelect')?.value,
      count: root.querySelector('input[name="chapterTestCount"]:checked')?.value
    });
    onChapterTest(config);
  });

  renderSessionDrawer(root, state.active);

  return {
    state,
    request,
    applyPending: () => state.applyPending(),
    sync(config) {
      const active = state.replaceActive(config);
      renderSessionDrawer(root, active);
      return active;
    },
    render(config = state.pending || state.active) {
      renderSessionDrawer(root, config, { pending: Boolean(state.pending) && !pendingAcknowledged });
    }
  };
}
