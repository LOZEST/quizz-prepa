import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  chapterTestConfiguration,
  sessionSwitchDecision,
  FILTER_STABILIZATION_MS
} from '../scripts/session/session-switch-policy.js';
import { createSessionDrawerState } from '../scripts/session/session-drawer-state.js';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('la question est centrée sur tout l’écran et indépendante du tiroir', async () => {
  const css = await read('styles/question-sheet.css');
  assert.match(css, /#questionCard\s*\{[\s\S]*left:\s*50%/);
  assert.match(css, /transform:\s*translateX\(-50%\)/);
  assert.match(css, /width:\s*min\(720px,\s*calc\(100vw - 180px\)\)/);
  assert.match(css, /@media \(max-width: 700px\)[\s\S]*left:\s*16px[\s\S]*right:\s*16px/);
  assert.doesNotMatch(css, /!important/);

  const drawerCss = await read('styles/session-drawer.css');
  assert.doesNotMatch(drawerCss, /board-wrap|question-card|#questionCard|canvas/);
});

test('le DOM principal ne contient que les actions demandées', async () => {
  const html = await read('quiz.html');
  assert.doesNotMatch(html, /almostButton|Presque réussi|legacy-quiz-controls/);
  assert.doesNotMatch(html, /id="exportButton"|id="importInput"|id="logoutButton"/);
  assert.doesNotMatch(html, /<option value="3"|Réflexe prépa/);
  assert.match(html, /id="successButton"[^>]*>Réussi</);
  assert.match(html, /id="failedButton"[^>]*>Raté</);
  assert.match(html, /href="\.\/plan\.html"/);
  assert.match(html, /<details class="drawer-section pencil-settings">/);
});

test('révision du jour et consolidation ont de vraies listes dans le tiroir', async () => {
  const [html, view] = await Promise.all([
    read('quiz.html'),
    read('scripts/session/session-drawer-view.js')
  ]);
  assert.match(html, /data-daily-plan/);
  assert.match(html, /data-weak-plan/);
  assert.match(view, /createPlanRow/);
  assert.match(view, /item\.successes/);
  assert.match(view, /item\.priority/);
  assert.match(view, /difficultyLabel\(item\.recommendedDifficulty\)/);
});

test('la politique de changement distingue un tableau vide d’un travail commencé', () => {
  assert.equal(sessionSwitchDecision({ boardUsed: false, hintUsed: false }), 'immediate');
  assert.equal(sessionSwitchDecision({ boardUsed: true }), 'ask');
  assert.equal(sessionSwitchDecision({ correctionSeen: true }), 'ask');
  assert.ok(FILTER_STABILIZATION_MS >= 150 && FILTER_STABILIZATION_MS <= 250);
});

test('les réglages de séance utilisent un stockage de workspace et conservent le pending', () => {
  const areas = new Map();
  const workspace = {
    read: (area, fallback) => areas.get(area) ?? fallback,
    write: (area, value) => {
      areas.set(area, value);
      return value;
    }
  };

  const state = createSessionDrawerState({
    mode: 'free',
    notionId: 'powers-product',
    questionType: 'calculation',
    difficulty: 1
  }, {}, workspace);

  state.update({ notionId: 'powers-negative', questionType: 'course', difficulty: 2 });
  assert.equal(state.active.notionId, 'powers-negative');
  assert.equal(areas.get('session-drawer').questionType, 'course');

  state.defer({ notionId: 'powers-product', questionType: 'formula', difficulty: 1 });
  assert.equal(state.active.notionId, 'powers-negative');
  assert.equal(state.pending.questionType, 'formula');
  state.applyPending();
  assert.equal(state.active.questionType, 'formula');
});

test('le changement immédiat utilise un dialogue interne et jamais confirm()', async () => {
  const [controller, view, html] = await Promise.all([
    read('scripts/session/session-drawer-controller.js'),
    read('scripts/session/session-drawer-view.js'),
    read('quiz.html')
  ]);
  assert.doesNotMatch(controller, /globalThis\.confirm|\bconfirm\s*\(/);
  assert.match(controller, /requestSessionChangeConfirmation/);
  assert.match(view, /sessionChangeDialog/);
  assert.match(html, /id="sessionChangeDialog"/);
});

test('le test de chapitre transmet le chapitre et 20 ou 40 questions', () => {
  assert.deepEqual(
    chapterTestConfiguration({ chapterId: 'powers', count: '40' }),
    { mode: 'chapter-test', chapterId: 'powers', count: 40 }
  );
  assert.throws(() => chapterTestConfiguration({ chapterId: 'powers', count: 30 }));
});

test('la banque Supabase reste chargée sans fenêtre embarquée', async () => {
  const auth = await read('scripts/auth/auth-controller.js');
  assert.match(auth, /QuestionCache/);
  assert.match(auth, /QuestionRepository/);
  assert.match(auth, /QuestionSync/);
  assert.match(auth, /quiz-tsi-question-bank-ready/);
  assert.doesNotMatch(auth, /questionBankDialog|initQuestionBank\(/);
});

test('les préférences Pencil et le tableau utilisent le workspace actif', async () => {
  const [board, ui] = await Promise.all([
    read('scripts/board.js'),
    read('scripts/ui-state.js')
  ]);
  assert.match(board, /activeWorkspace/);
  assert.match(board, /grid:\s*this\.grid\.checked/);
  assert.match(board, /size:\s*Number\(this\.size\.value\)/);
  assert.match(ui, /activeWorkspace/);
  assert.match(ui, /ui-preferences/);
});

test('le cache PWA contient les modules de la fondation', async () => {
  const worker = await read('service-worker.js');
  for (const file of [
    'session-drawer-controller.js',
    'session-drawer-view.js',
    'session-drawer-state.js',
    'session-switch-policy.js',
    'styles/foundation.css',
    'styles/whiteboard.css',
    'styles/session-drawer.css',
    'styles/question-sheet.css'
  ]) {
    assert.match(worker, new RegExp(file.replaceAll('.', '\\.')));
  }
});
