import { getSupabaseClient } from './supabase-client.js';
import { AuthService } from './auth-service.js';
import { AuthView } from './auth-view.js';
import {
  rememberAccount,
  readRememberedAccount,
  setActiveUser,
  clearRuntimeSession
} from './session-state.js';
import {
  activateWorkspace,
  deactivateWorkspace
} from '../workspace/user-workspace.js';
import { QuestionCache } from '../question-bank/question-cache.js';
import { QuestionRepository } from '../question-bank/question-repository.js';
import { QuestionSync } from '../question-bank/question-sync.js';
import {
  hasLegacyData,
  migrationStatus,
  migrateLegacy
} from '../workspace/legacy-migration.js';

const view = new AuthView();
let service;
let currentUserId;
let appLoaded = false;
let questionBankProvider;

function migrationChoice(workspace) {
  if (!hasLegacyData() || migrationStatus(workspace).decision !== 'pending') return;

  const dialog = document.createElement('dialog');
  dialog.className = 'sync-dialog';
  dialog.innerHTML = `
    <h2>Données locales antérieures</h2>
    <p>Des données locales antérieures ont été trouvées. Voulez-vous les rattacher à ce compte ?</p>
    <div class="dialog-actions">
      <button value="import" class="primary">Importer dans ce compte</button>
      <button value="decline">Continuer sans importer</button>
      <button value="later">Décider plus tard</button>
    </div>`;
  document.body.append(dialog);
  dialog.querySelectorAll('button').forEach(button => {
    button.onclick = () => {
      migrateLegacy(workspace, button.value);
      dialog.close();
      dialog.remove();
    };
  });
  dialog.showModal();
}

function loadQuestionBank({ userId, client }) {
  questionBankProvider?.stop?.();

  const cache = new QuestionCache();
  cache.open(userId);
  const sync = client ? new QuestionSync(cache, new QuestionRepository(client)) : null;
  const publish = () => {
    const questions = cache.questions();
    document.dispatchEvent(new CustomEvent('quiz-tsi-question-bank-ready', {
      detail: { userId, provider: () => questions }
    }));
  };

  publish();
  sync?.sync().then(publish).catch(publish);

  const stop = () => {
    sync?.stop();
    cache.close();
  };
  document.addEventListener('quiz-tsi-account-leaving', stop, { once: true });
  questionBankProvider = { cache, sync, stop };
}

async function enter(session, { offline = false } = {}) {
  const user = session?.user || session;
  if (!user?.id) return;

  const changed = currentUserId && currentUserId !== user.id;
  if (changed) location.reload();

  currentUserId = user.id;
  setActiveUser(user.id);
  const workspace = activateWorkspace(user.id);

  let profile = { role: user.role || 'user', display_name: user.displayName || '' };
  if (!offline) profile = await service.profile(user.id);

  const account = {
    userId: user.id,
    email: user.email,
    displayName: profile.display_name,
    role: profile.role
  };
  rememberAccount(account);
  view.showApp(account, { offline });
  migrationChoice(workspace);

  if (!appLoaded) {
    appLoaded = true;
    await import('../session/session-dom.js');
    await import('../app.js');
  }

  loadQuestionBank({ userId: user.id, client: offline ? null : service.client });

  if (!offline) {
    const { startProgressSync } = await import('../progress-sync/progress-sync.js');
    startProgressSync({ userId: user.id, supabase: service.client });
  }
}

async function logout() {
  document.dispatchEvent(new CustomEvent('quiz-tsi-account-leaving'));
  questionBankProvider?.stop?.();
  questionBankProvider = null;
  currentUserId = null;
  deactivateWorkspace();
  clearRuntimeSession();
  await service?.signOut();
  location.reload();
}

view.onLogin(async (email, password) => {
  view.loading(true);
  view.showError();
  try {
    await enter(await service.signIn(email, password));
  } catch (error) {
    view.showError(error.message);
  } finally {
    view.loading(false);
  }
});

(async () => {
  try {
    service = new AuthService(await getSupabaseClient());
    service.onChange(session => {
      if (!session && currentUserId) logout();
      else if (session) enter(session).catch(() => view.showLogin());
    });
    const session = await service.restore();
    if (session) await enter(session);
    else view.showLogin();
  } catch {
    const remembered = readRememberedAccount();
    if (!navigator.onLine && remembered) await enter(remembered, { offline: true });
    else view.showError('Service de connexion indisponible. Vérifiez la configuration et la connexion réseau.');
  }
})();
