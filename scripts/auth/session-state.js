const KEY='quiz-tsi:last-account';
export function rememberAccount(account){localStorage.setItem(KEY,JSON.stringify({userId:account.userId,email:account.email||'',displayName:account.displayName||'',role:account.role||'user'}))}
export function readRememberedAccount(){try{const value=JSON.parse(localStorage.getItem(KEY));return value?.userId?value:null}catch{return null}}
export function setActiveUser(userId){sessionStorage.setItem('quiz-tsi:active-user',userId)}
export function clearRuntimeSession(){sessionStorage.removeItem('quiz-tsi:active-user')}
