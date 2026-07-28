import {
  currentPlanItem,
  difficultyLabel,
  QUESTION_TYPES,
  SESSION_MODES
} from './session-model.js';

function setValue(control, value) {
  if (!control || value === undefined || value === null) return;
  const normalized = String(value);
  if ([...control.options].some(option => option.value === normalized)) control.value = normalized;
}

function planDetails(item, mode) {
  const details = [];
  if (item.chapterLabel) details.push(item.chapterLabel);
  if (item.reason) details.push(item.reason);

  if (mode === SESSION_MODES.WEAK) {
    details.push(`Niveau conseillé : ${difficultyLabel(item.recommendedDifficulty)}`);
  }
  if (item.partials) details.push(`${item.partials} réussite${item.partials > 1 ? 's' : ''} partielle${item.partials > 1 ? 's' : ''}`);
  if (item.failures) details.push(`${item.failures} échec${item.failures > 1 ? 's' : ''}`);
  return details;
}

function createPlanRow(item, mode, active) {
  const row = document.createElement('details');
  row.className = 'session-plan-item';
  row.classList.toggle('current', item === active);
  row.classList.toggle('complete', Boolean(item.questionCount && item.answered >= item.questionCount));

  const summary = document.createElement('summary');
  const rank = document.createElement('span');
  rank.className = 'plan-rank';
  rank.textContent = mode === SESSION_MODES.WEAK ? String(item.priority || '–') : '•';

  const label = document.createElement('span');
  label.className = 'plan-label';
  label.textContent = item.label;

  const score = document.createElement('strong');
  score.className = 'plan-score';
  score.textContent = mode === SESSION_MODES.WEAK
    ? difficultyLabel(item.recommendedDifficulty)
    : `${item.successes || 0}/${item.questionCount || 0}`;

  summary.append(rank, label, score);

  const detailBox = document.createElement('div');
  detailBox.className = 'plan-details';
  for (const text of planDetails(item, mode)) {
    const line = document.createElement('span');
    line.textContent = text;
    detailBox.append(line);
  }

  row.append(summary, detailBox);
  return row;
}

function renderPlan(root, config, mode) {
  const list = root.querySelector(mode === SESSION_MODES.DAILY ? '[data-daily-plan]' : '[data-weak-plan]');
  const empty = root.querySelector(mode === SESSION_MODES.DAILY ? '[data-daily-empty]' : '[data-weak-empty]');
  if (!list || !empty) return;

  const rows = Array.isArray(config.plan) ? config.plan : [];
  const active = currentPlanItem(config);
  list.replaceChildren(...rows.map(item => createPlanRow(item, mode, active)));
  list.hidden = rows.length === 0;
  empty.hidden = rows.length !== 0;
}

export function renderSessionDrawer(root, config, { pending = false } = {}) {
  if (!root || !config) return;

  root.dataset.mode = config.mode;
  root.querySelectorAll('[data-session-panel]').forEach(panel => {
    panel.hidden = panel.dataset.sessionPanel !== config.mode;
  });

  setValue(root.querySelector('#modeSelect'), config.mode);
  setValue(root.querySelector('#partSelect'), config.partId || 'all');
  setValue(root.querySelector('#chapterSelect'), config.chapterId || 'all');
  setValue(root.querySelector('#notionSelect'), config.notionId || 'all');
  setValue(root.querySelector('#questionTypeSelect'), config.questionType || QUESTION_TYPES.CALCULATION);
  setValue(root.querySelector('#difficultySelect'), config.difficulty || 2);

  const reflex = config.mode === SESSION_MODES.FREE && config.questionType === QUESTION_TYPES.REFLEX;
  root.querySelector('[data-difficulty-field]')?.toggleAttribute('hidden', reflex);
  root.querySelector('[data-reflex-note]')?.toggleAttribute('hidden', !reflex);
  root.querySelector('[data-switch-banner]')?.toggleAttribute('hidden', !pending);

  renderPlan(root, config, SESSION_MODES.DAILY);
  renderPlan(root, config, SESSION_MODES.WEAK);
}

export function readDrawerConfiguration(root) {
  const value = id => root.querySelector(`#${id}`)?.value;
  const questionType = value('questionTypeSelect') || QUESTION_TYPES.CALCULATION;
  return {
    mode: value('modeSelect'),
    partId: value('partSelect') || 'all',
    chapterId: value('chapterSelect') || 'all',
    notionId: value('notionSelect') || 'all',
    questionType,
    difficulty: questionType === QUESTION_TYPES.REFLEX ? null : value('difficultySelect')
  };
}

export function requestSessionChangeConfirmation(root) {
  const dialog = document.getElementById('sessionChangeDialog');
  if (!dialog) return Promise.resolve(false);

  return new Promise(resolve => {
    const confirm = dialog.querySelector('[data-session-change-confirm]');
    const cancel = dialog.querySelector('[data-session-change-cancel]');

    const finish = result => {
      confirm.removeEventListener('click', accept);
      cancel.removeEventListener('click', reject);
      dialog.removeEventListener('cancel', reject);
      if (dialog.open) dialog.close();
      resolve(result);
    };
    const accept = () => finish(true);
    const reject = event => {
      event?.preventDefault?.();
      finish(false);
    };

    confirm.addEventListener('click', accept);
    cancel.addEventListener('click', reject);
    dialog.addEventListener('cancel', reject);
    dialog.showModal();
  });
}
