export const INTERNAL_PAGES=Object.freeze(['index.html','session.html','quiz.html','questions.html','stats.html','settings.html','team.html']);
export function safePage(value,fallback='index.html'){const page=String(value||'').trim().replace(/^\.\//,'');return INTERNAL_PAGES.includes(page)?page:fallback}
export function pageHref(page){return`./${safePage(page)}`}
export function requestedPage(search=location.search){return safePage(new URLSearchParams(search).get('next'))}
export function loginHref(page=location.pathname.split('/').pop()){return`./login.html?next=${encodeURIComponent(safePage(page))}`}
