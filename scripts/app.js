import { COURSE_MAP, allNotions, findNotion } from './course-map.js';
import { QuizEngine } from './quiz-engine.js';
import { DrawingBoard } from './board.js';
import { loadState, saveState } from './storage.js';
import { RESULT, updateProgress } from './scheduler.js';
import {
  readHandedness,
  writeHandedness,
  setDrawerState,
  setQuestionCollapsed,
  setToolState
} from './ui-state.js';
import { renderSegments, renderSteps } from './math/render-math.js';
import { TestApp } from './tests/ui/test-app.js';
import { createTestEvents } from './mastery/mastery-event.js';
import { rebuildMastery } from './mastery/mastery-engine.js';
import { activeWorkspace } from './workspace/user-workspace.js';
import { initQuizPolish } from './quiz-polish.js';
import { createSessionDrawerController } from './session/session-drawer-controller.js';
import {
  SESSION_MODES,
  QUESTION_TYPES,
  RESULT_STATES,
  normalizeSessionConfig,
  currentPlanItem,
  recordPlanResult,
  isSessionComplete,
  resolveEvaluation,
  difficultyLabel,
  questionTypeLabel
} from './session/session-model.js';

const $ = id => document.getElementById(id);

let state = loadState();
let current = null;
let hintUsed = false;
let correctionSeen = false;
let sessionAnswered = 0;
let questionNumber = 0;
let sessionConfig;
let reflexTimeExceeded = false;
let timerId = null;
let timerDeadline = 0;
let drawerController;

try {
  sessionConfig = normalizeSessionConfig(activeWorkspace().read('active-session', {}) || {}, state);
  activeWorkspace().write('active-session', sessionConfig);
} catch {
  sessionConfig = normalizeSessionConfig({}, state);
}

const engine = new QuizEngine();
document.addEventListener('quiz-tsi-question-bank-ready', event => {
  engine.setDynamicProvider(event.detail.provider, event.detail.userId);
});

function persistSession() {
  try {
    activeWorkspace().write('active-session', sessionConfig);
  } catch {}
}

function updateHistoryButtons() {
  const undo = $('undoButton');
  const redo = $('redoButton');
  if (!undo || !redo || !board) return;
  undo.disabled = board.history.undoStack.length === 0;
  redo.disabled = board.history.redoStack.length === 0;
  undo.setAttribute('aria-label', undo.disabled ? 'Rien à annuler' : 'Annuler le dernier tracé');
  redo.setAttribute('aria-label', redo.disabled ? 'Rien à rétablir' : 'Rétablir le dernier tracé');
}

const board = new DrawingBoard({
  canvas: $('board'),
  wrap: $('boardWrap'),
  hint: $('boardHint'),
  tool: $('toolSelect'),
  size: $('sizeRange'),
  grid: $('gridToggle'),
  straightToggle: $('straightToggle'),
  scribbleToggle: $('scribbleToggle'),
  onChange: updateHistoryButtons,
  onPlacementChange: updateShapePlacement
});

const testApp = new TestApp({
  root: $('testApp'),
  board,
  onFinalized: session => {
    const events = createTestEvents(session, { deviceId: state.deviceId });
    const ids = new Set((state.masteryEvents || []).map(event => event.id));
    state = saveState({
      ...state,
      masteryEvents: [...(state.masteryEvents || []), ...events.filter(event => !ids.has(event.id))]
    });
    state = saveState({
      ...state,
      masteryStates: rebuildMastery(state.masteryEvents, allNotions().map(notion => notion.id))
    });
  }
});

initQuizPolish({
  boardWrap: $('boardWrap'),
  questionCard: $('questionCard'),
  questionToggle: $('questionToggle')
});

function option(select, value, label) {
  const row = document.createElement('option');
  row.value = value;
  row.textContent = label;
  select.append(row);
}

function ensureModeOptions() {
  const select = $('modeSelect');
  select.replaceChildren();
  for (const [value, label] of [
    [SESSION_MODES.DAILY, 'Révision du jour'],
    [SESSION_MODES.WEAK, 'Consolidation des points faibles'],
    [SESSION_MODES.FREE, 'Révision libre'],
    [SESSION_MODES.CHAPTER_TEST, 'Test de chapitres']
  ]) {
    option(select, value, label);
  }
}

function refreshNotions() {
  const part = $('partSelect').value;
  const chapter = $('chapterSelect').value;
  const select = $('notionSelect');
  select.replaceChildren();
  option(select, 'all', 'Toutes les notions');
  for (const notion of allNotions().filter(row =>
    (part === 'all' || row.partId === part) &&
    (chapter === 'all' || row.chapterId === chapter))) {
    option(select, notion.id, notion.label);
  }
}

function refreshChapters() {
  const part = $('partSelect').value;
  const select = $('chapterSelect');
  select.replaceChildren();
  option(select, 'all', 'Tous les chapitres');
  for (const section of COURSE_MAP.filter(row => part === 'all' || row.id === part)) {
    for (const chapter of section.chapters) option(select, chapter.id, chapter.label);
  }
  refreshNotions();
}

function initCourseSelectors() {
  const part = $('partSelect');
  part.replaceChildren();
  option(part, 'all', 'Toutes les parties');
  for (const section of COURSE_MAP) option(part, section.id, section.label);
  refreshChapters();
  part.addEventListener('change', refreshChapters);
  $('chapterSelect').addEventListener('change', refreshNotions);

  const testChapter = $('testChapterSelect');
  testChapter.replaceChildren();
  for (const section of COURSE_MAP) {
    for (const chapter of section.chapters) option(testChapter, chapter.id, chapter.label);
  }
}

function applySessionConfig() {
  if ($('modeSelect').querySelector(`option[value="${sessionConfig.mode}"]`)) {
    $('modeSelect').value = sessionConfig.mode;
  }

  $('partSelect').value = sessionConfig.partId || 'all';
  refreshChapters();
  if ($('chapterSelect').querySelector(`option[value="${sessionConfig.chapterId}"]`)) {
    $('chapterSelect').value = sessionConfig.chapterId;
  }
  refreshNotions();
  if ($('notionSelect').querySelector(`option[value="${sessionConfig.notionId}"]`)) {
    $('notionSelect').value = sessionConfig.notionId;
  }
  $('questionTypeSelect').value = sessionConfig.questionType || QUESTION_TYPES.CALCULATION;
  if (sessionConfig.difficulty && $('difficultySelect').querySelector(`option[value="${sessionConfig.difficulty}"]`)) {
    $('difficultySelect').value = String(sessionConfig.difficulty);
  }
}

function filters() {
  const plan = currentPlanItem(sessionConfig);
  if ([SESSION_MODES.DAILY, SESSION_MODES.WEAK].includes(sessionConfig.mode) && plan) {
    return {
      mode: sessionConfig.mode,
      partId: plan.partId,
      chapterId: plan.chapterId,
      notionId: plan.notionId,
      difficulty: plan.recommendedDifficulty,
      questionType: null
    };
  }

  return {
    mode: sessionConfig.mode,
    partId: sessionConfig.partId || 'all',
    chapterId: sessionConfig.chapterId || 'all',
    notionId: sessionConfig.notionId || 'all',
    difficulty: sessionConfig.difficulty,
    questionType: sessionConfig.questionType || QUESTION_TYPES.CALCULATION
  };
}

function clearQuestionTimer() {
  if (timerId) clearInterval(timerId);
  timerId = null;
}

function startQuestionTimer() {
  clearQuestionTimer();
  reflexTimeExceeded = false;
  const timer = $('questionTimer');
  if (!timer) return;

  const reflex = current?.questionType === QUESTION_TYPES.REFLEX;
  timer.hidden = !reflex;
  timer.classList.remove('expired');
  if (!reflex) return;

  timerDeadline = Date.now() + 60_000;
  const tick = () => {
    const remaining = Math.max(0, timerDeadline - Date.now());
    if (remaining <= 0) {
      reflexTimeExceeded = true;
      timer.textContent = 'Temps dépassé · termine tranquillement';
      timer.classList.add('expired');
      clearQuestionTimer();
      return;
    }
    timer.textContent = `Réflexe · ${Math.ceil(remaining / 1000)} s`;
  };
  tick();
  timerId = setInterval(tick, 250);
}

function updateIndicators() {
  const mastery = state.masteryStates?.[current?.notionId];
  $('mastery').textContent = mastery ? `${mastery.masteryScore} % estimés` : 'Pas encore évaluée';
  $('confidence').textContent = mastery
    ? `${mastery.confidenceScore < 35 ? 'Limitée' : mastery.confidenceScore < 65 ? 'Moyenne' : 'Élevée'} · ${mastery.evidenceCount} preuve${mastery.evidenceCount > 1 ? 's' : ''}`
    : 'Aucune preuve';
  $('nextReview').textContent = mastery?.nextReviewAt
    ? new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short' }).format(new Date(mastery.nextReviewAt))
    : 'À déterminer';
  $('sessionProgress').textContent = `Question ${Math.max(questionNumber, 1)} · ${sessionAnswered} réponse${sessionAnswered > 1 ? 's' : ''}`;
  $('saveStatus').textContent = 'Sauvegardé localement';
}

function resetQuestionUi() {
  $('feedback').classList.add('hidden');
  $('conceptBlock').classList.add('hidden');
  $('trapBlock').classList.add('hidden');
  $('evaluationButtons').classList.add('hidden');
  $('resultBanner').classList.add('hidden');
  $('nextButton').classList.add('hidden');
}

function showSessionComplete() {
  clearQuestionTimer();
  $('questionChapter').textContent = 'Séance terminée';
  $('questionNotion').textContent = 'Bilan';
  $('questionKind').textContent = 'Terminé';
  $('questionDifficulty').textContent = '';
  $('questionTimer').hidden = true;
  renderSegments($('questionText'), {
    segments: [{ type: 'text', value: 'Toutes les questions prévues ont été traitées. Ouvre le menu pour consulter le bilan par notion.' }]
  });
  $('hintButton').disabled = true;
  $('correctionButton').disabled = true;
  $('skipButton').disabled = true;
  board.clear(false);
  drawerController?.sync(sessionConfig);
}

function showMissingCoverage() {
  $('questionChapter').textContent = 'Couverture manquante';
  $('questionNotion').textContent = 'Notion indisponible';
  $('questionKind').textContent = 'Aucune question validée';
  $('questionDifficulty').textContent = current.questionType ? questionTypeLabel(current.questionType) : '';
  renderSegments($('questionText'), {
    segments: [{ type: 'text', value: 'Aucune question validée ne correspond exactement à cette sélection. Choisis une autre notion, un autre type ou une autre difficulté.' }]
  });
  $('hintButton').disabled = true;
  $('correctionButton').disabled = true;
  $('skipButton').disabled = false;
  $('questionTimer').hidden = true;
  board.clear(false);
  updateHistoryButtons();
}

function newQuestion() {
  if (drawerController?.state.pending) {
    sessionConfig = drawerController.applyPending();
    persistSession();
    applySessionConfig();
  }

  if (isSessionComplete(sessionConfig)) {
    showSessionComplete();
    return;
  }

  current = engine.generate(filters(), state);
  hintUsed = false;
  correctionSeen = false;
  reflexTimeExceeded = false;
  questionNumber += 1;

  if (current.status === 'missing-coverage') {
    showMissingCoverage();
    drawerController?.sync(sessionConfig);
    return;
  }

  const notion = findNotion(current.notionId);
  $('hintButton').disabled = false;
  $('correctionButton').disabled = false;
  $('skipButton').disabled = false;
  $('questionChapter').textContent = notion?.chapterLabel || current.chapterId;
  $('questionNotion').textContent = notion?.label || current.notionId;
  $('questionKind').textContent = questionTypeLabel(current.questionType);
  $('questionDifficulty').textContent = current.questionType === QUESTION_TYPES.REFLEX
    ? 'Réflexe · difficulté aléatoire'
    : difficultyLabel(current.difficulty || current.masteryLevel);
  $('questionProgress').textContent = `Question ${questionNumber}`;
  renderSegments($('questionText'), current.question || current.questionHtml);

  resetQuestionUi();
  board.clear(false);
  updateIndicators();
  updateHistoryButtons();
  drawerController?.sync(sessionConfig);
  startQuestionTimer();
}

function showFeedback(type) {
  $('feedback').classList.remove('hidden');
  $('resultBanner').classList.add('hidden');
  $('nextButton').classList.add('hidden');

  if (type === 'hint') {
    hintUsed = true;
    $('feedbackTitle').textContent = 'Indice';
    renderSegments($('feedbackText'), current.hintContent || current.hint);
    $('conceptBlock').classList.add('hidden');
    $('trapBlock').classList.add('hidden');
    $('evaluationButtons').classList.add('hidden');
    return;
  }

  correctionSeen = true;
  clearQuestionTimer();
  $('feedbackTitle').textContent = 'Correction raisonnée';
  renderSteps($('feedbackText'), current.correction || current.correctionHtml);
  renderSegments($('hiddenConcept'), current.hiddenConceptContent || current.hiddenConcept);
  renderSegments($('oralFormulation'), current.oralFormulationContent || current.oralFormulation);
  $('conceptBlock').classList.remove('hidden');

  const explanation = current.trapExplanation;
  $('trapBlock').classList.toggle('hidden', !explanation);
  if (explanation) {
    $('trapMistake').textContent = explanation.commonMistake;
    $('trapTempting').textContent = explanation.whyTempting;
    $('trapWrong').textContent = explanation.whyWrong;
    $('trapReflex').textContent = explanation.reflexToRemember;
  }
  $('evaluationButtons').classList.remove('hidden');
}

function evaluate(choice) {
  if (choice !== RESULT.SKIPPED && !correctionSeen) return;

  const result = choice === RESULT.SKIPPED
    ? RESULT_STATES.SKIPPED
    : resolveEvaluation({
      choice,
      hintUsed,
      timeExceeded: current?.questionType === QUESTION_TYPES.REFLEX && reflexTimeExceeded
    });

  current.hintUsed = hintUsed;
  current.correctionSeen = correctionSeen;
  current.timeExceeded = reflexTimeExceeded;

  if (result !== RESULT_STATES.SKIPPED) {
    state = saveState(updateProgress(state, current, result));
    const event = state.masteryEvents?.at(-1);
    if (event) {
      document.dispatchEvent(new CustomEvent('quiz-tsi-sync-mutation', {
        detail: {
          operationType: 'append-event',
          entityType: 'mastery-event',
          entityId: event.id,
          payload: event
        }
      }));
    }
    sessionAnswered += 1;
  }

  sessionConfig = recordPlanResult(sessionConfig, result);
  persistSession();
  drawerController?.sync(sessionConfig);

  const labels = {
    success: 'Réussi sans aide.',
    partial: hintUsed && reflexTimeExceeded
      ? 'Partiellement réussi : indice utilisé et temps dépassé.'
      : hintUsed
        ? 'Partiellement réussi : indice utilisé.'
        : 'Partiellement réussi : temps dépassé.',
    failed: 'Raté : la notion sera rapprochée dans les révisions.',
    skipped: 'Question passée : aucune incidence sur la maîtrise.'
  };

  $('evaluationButtons').classList.add('hidden');
  $('resultBanner').textContent = labels[result];
  $('resultBanner').classList.remove('hidden');
  $('nextButton').classList.remove('hidden');
  updateIndicators();
}

function skipQuestion() {
  if (!current) return;
  evaluate(RESULT.SKIPPED);
  newQuestion();
}

function toggleDrawer(open) {
  setDrawerState({
    drawer: $('settingsDrawer'),
    backdrop: $('drawerBackdrop'),
    button: $('drawerButton')
  }, open);

  if (open) {
    drawerController?.render();
    requestAnimationFrame(() => $('closeDrawer').focus());
  } else {
    $('drawerButton').focus();
  }
}

function applyHandedness(value, persist = false) {
  const handedness = persist ? writeHandedness(value) : value;
  $('app').classList.toggle('tool-left', handedness === 'left');
  $('app').classList.toggle('tool-right', handedness === 'right');
  const input = document.querySelector(`input[name="handedness"][value="${handedness}"]`);
  if (input) input.checked = true;
}

function setShapeMenu(open) {
  $('shapeMenu').classList.toggle('hidden', !open);
  $('shapeToggle').setAttribute('aria-expanded', String(open));
}

function updateShapePlacement(boardState) {
  $('shapeToggle').setAttribute('aria-pressed', String(boardState.active === true));
  if (boardState.active) {
    $('shapeStatus').textContent = `Placer : ${boardState.label}`;
    setToolState($('toolSelect'), $('toolToggle'), 'pen');
  } else {
    $('shapeStatus').textContent = boardState.placed
      ? 'Forme placée. Outil Stylo actif.'
      : boardState.cancelled
        ? 'Placement annulé. Outil Stylo actif.'
        : '';
  }
}

function runHistory(direction) {
  direction === 'undo' ? board.undo() : board.redo();
  updateHistoryButtons();
}

function bindBoardClearDialog() {
  const dialog = $('boardClearDialog');
  $('clearButton').addEventListener('click', () => dialog.showModal());
  dialog.querySelector('[data-board-clear-cancel]').addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-board-clear-confirm]').addEventListener('click', () => {
    board.clear();
    dialog.close();
  });
}

ensureModeOptions();
initCourseSelectors();
applySessionConfig();
applyHandedness(readHandedness());
setToolState($('toolSelect'), $('toolToggle'), 'pen');
$('sizeValue').textContent = $('sizeRange').value;
const rememberedShapeSize = board.shapeSize;
const rememberedShapeInput = document.querySelector(`input[name="shapeSize"][value="${rememberedShapeSize}"]`);
if (rememberedShapeInput) rememberedShapeInput.checked = true;

drawerController = createSessionDrawerController({
  root: $('settingsDrawer'),
  initial: sessionConfig,
  learningState: state,
  board,
  hasStarted: () => ({ hintUsed, correctionSeen }),
  onApply: (config, { clear }) => {
    sessionConfig = config;
    persistSession();
    applySessionConfig();
    if (clear) board.clear(false);
    newQuestion();
  },
  onChapterTest: config => {
    sessionConfig = config;
    persistSession();
    testApp.startWith(config);
    toggleDrawer(false);
  }
});

$('sizeRange').addEventListener('input', () => {
  $('sizeValue').textContent = $('sizeRange').value;
});
$('undoButton').addEventListener('click', () => runHistory('undo'));
$('redoButton').addEventListener('click', () => runHistory('redo'));
bindBoardClearDialog();

document.addEventListener('keydown', event => {
  const target = event.target;
  if (event.key === 'Escape' && $('settingsDrawer').classList.contains('open')) {
    event.preventDefault();
    toggleDrawer(false);
    return;
  }
  if (target?.matches?.('input,textarea,select,[contenteditable="true"]')) return;
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z') {
    event.preventDefault();
    runHistory(event.shiftKey ? 'redo' : 'undo');
  }
});

document.querySelectorAll('[data-board-shape]').forEach(button => {
  button.addEventListener('click', () => {
    const selected = document.querySelector('input[name="shapeSize"]:checked').value;
    board.selectShape(button.dataset.boardShape, selected);
    setShapeMenu(false);
  });
});

$('shapeToggle').addEventListener('click', () => {
  if (board.cancelShapePlacement()) {
    setShapeMenu(false);
    return;
  }
  setShapeMenu($('shapeMenu').classList.contains('hidden'));
});
$('cancelShape').addEventListener('click', () => {
  board.cancelShapePlacement();
  setShapeMenu(false);
});

$('hintButton').addEventListener('click', () => showFeedback('hint'));
$('correctionButton').addEventListener('click', () => showFeedback('correction'));
$('closeFeedback').addEventListener('click', () => $('feedback').classList.add('hidden'));
$('successButton').addEventListener('click', () => evaluate(RESULT_STATES.SUCCESS));
$('failedButton').addEventListener('click', () => evaluate(RESULT_STATES.FAILED));
$('skipButton').addEventListener('click', skipQuestion);
$('nextButton').addEventListener('click', newQuestion);

$('drawerButton').addEventListener('click', () => toggleDrawer(true));
$('closeDrawer').addEventListener('click', () => toggleDrawer(false));
$('drawerBackdrop').addEventListener('click', () => toggleDrawer(false));
$('questionToggle').addEventListener('click', () => {
  setQuestionCollapsed(
    $('questionCard'),
    $('questionToggle'),
    !$('questionCard').classList.contains('collapsed')
  );
});
$('toolToggle').addEventListener('click', () => {
  board.cancelShapePlacement();
  setShapeMenu(false);
  setToolState(
    $('toolSelect'),
    $('toolToggle'),
    $('toolSelect').value === 'pen' ? 'eraser' : 'pen'
  );
});
document.querySelectorAll('input[name="handedness"]').forEach(input => {
  input.addEventListener('change', () => applyHandedness(input.value, true));
});

document.addEventListener('quiz-tsi-progress-merged', event => {
  state = event.detail.state;
  sessionConfig = normalizeSessionConfig(sessionConfig, state);
  persistSession();
  updateIndicators();
  drawerController?.sync(sessionConfig);
});

updateHistoryButtons();
drawerController.sync(sessionConfig);

if (
  sessionConfig.mode === SESSION_MODES.CHAPTER_TEST &&
  sessionConfig.chapterId &&
  [20, 40].includes(Number(sessionConfig.count))
) {
  testApp.startWith(sessionConfig);
} else {
  if (sessionConfig.mode === SESSION_MODES.CHAPTER_TEST) {
    sessionConfig = normalizeSessionConfig({ mode: SESSION_MODES.DAILY }, state);
    persistSession();
    drawerController.sync(sessionConfig);
  }
  newQuestion();
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js')
    .catch(error => console.warn('Service worker indisponible', error));
}
