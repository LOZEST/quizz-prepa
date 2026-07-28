export function prepareSessionDom() {
  const meta = document.querySelector('.question-meta');
  if (!meta || document.getElementById('questionTimer')) return;

  const timer = document.createElement('span');
  timer.id = 'questionTimer';
  timer.className = 'question-timer';
  timer.hidden = true;
  meta.append(timer);
}

prepareSessionDom();
