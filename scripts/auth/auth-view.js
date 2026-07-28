export class AuthView {
  constructor(doc = document) {
    this.doc = doc;
    this.form = doc.getElementById('loginForm');
    this.error = doc.getElementById('authError');
    this.password = doc.getElementById('authPassword');

    doc.getElementById('togglePassword').onclick = () => {
      const visible = this.password.type === 'text';
      this.password.type = visible ? 'password' : 'text';
      doc.getElementById('togglePassword').textContent = visible ? 'Afficher le mot de passe' : 'Masquer le mot de passe';
    };
  }

  onLogin(handler) {
    this.form.addEventListener('submit', event => {
      event.preventDefault();
      handler(this.form.elements.email.value, this.password.value);
    });
  }

  loading(active) {
    const button = this.doc.getElementById('loginButton');
    button.disabled = active;
    button.textContent = active ? 'Connexion…' : 'Se connecter';
  }

  showError(message = '') {
    this.error.textContent = message;
  }

  showApp(account, { offline = false } = {}) {
    this.doc.getElementById('authView').classList.add('hidden');
    const app = this.doc.getElementById('app');
    app.classList.remove('hidden');
    app.removeAttribute('aria-hidden');

    const identity = account.displayName || account.email || 'Utilisateur';
    this.doc.getElementById('accountIdentity').textContent = identity;
    this.doc.getElementById('accountRole').textContent = ({
      user: 'Élève',
      admin: 'Administrateur',
      owner: 'Propriétaire'
    })[account.role] || 'Élève';
    this.doc.getElementById('accountInitial').textContent = identity.trim().charAt(0).toUpperCase() || 'U';
    this.doc.getElementById('offlineMode').classList.toggle('hidden', !offline);
  }

  showLogin() {
    this.doc.getElementById('authView').classList.remove('hidden');
    this.doc.getElementById('app').classList.add('hidden');
  }
}
