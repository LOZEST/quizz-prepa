export const FILTER_STABILIZATION_MS = 200;

export function boardHasWork(board) {
  try {
    return Boolean(board?.capture?.().strokes?.length);
  } catch {
    return false;
  }
}

export function questionHasStarted({
  boardUsed = false,
  hintUsed = false,
  correctionSeen = false
} = {}) {
  return boardUsed || hintUsed || correctionSeen;
}

export function sessionSwitchDecision(status) {
  return questionHasStarted(status) ? 'ask' : 'immediate';
}

export function chapterTestConfiguration({ chapterId, count }) {
  const normalized = Number(count);
  if (!chapterId || ![20, 40].includes(normalized)) {
    throw new TypeError('Chapitre et format 20 ou 40 requis.');
  }
  return { mode: 'chapter-test', chapterId, count: normalized };
}
