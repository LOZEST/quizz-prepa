export const HANDEDNESS_KEY='quiz-tsi-handedness';
export function normalizeHandedness(value){return value==='left'?'left':'right'}
export function readHandedness(storage=localStorage){try{return normalizeHandedness(storage.getItem(HANDEDNESS_KEY))}catch{return'right'}}
export function writeHandedness(value,storage=localStorage){const normalized=normalizeHandedness(value);storage.setItem(HANDEDNESS_KEY,normalized);return normalized}
export function setDrawerState({drawer,backdrop,button},open){drawer.classList.toggle('open',open);drawer.setAttribute('aria-hidden',String(!open));drawer.inert=!open;backdrop.classList.toggle('hidden',!open);button.setAttribute('aria-expanded',String(open))}
export function setQuestionCollapsed(card,button,collapsed){card.classList.toggle('collapsed',collapsed);button.setAttribute('aria-expanded',String(!collapsed));button.setAttribute('aria-label',collapsed?'Agrandir la question':'Réduire la question');button.textContent=collapsed?'⌄':'⌃'}
export function setToolState(select,button,tool){const eraser=tool==='eraser';select.value=eraser?'eraser':'pen';button.setAttribute('aria-pressed',String(eraser));button.setAttribute('aria-label',eraser?'Outil actif : gomme. Passer au stylo':'Outil actif : stylo. Passer à la gomme');button.querySelector('span').textContent=eraser?'⌫':'✎';button.querySelector('strong').textContent=eraser?'Gomme':'Stylo'}
