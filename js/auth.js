/* ============================
   ZnScripts - Authentication
   ============================ */

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const mobileLoginBtn = document.getElementById('mobileLoginBtn');
const mobileRegisterBtn = document.getElementById('mobileRegisterBtn');
const footerLoginBtn = document.getElementById('footerLoginBtn');
const footerRegisterBtn = document.getElementById('footerRegisterBtn');
const ctaRegisterBtn = document.getElementById('ctaRegisterBtn');

const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const closeLoginModal = document.getElementById('closeLoginModal');
const closeRegisterModal = document.getElementById('closeRegisterModal');
const switchToRegister = document.getElementById('switchToRegister');
const switchToLogin = document.getElementById('switchToLogin');

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

// Toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastIcon = toast.querySelector('.toast-icon');
    const toastMessage = toast.querySelector('.toast-message');
    
    toast.className = 'toast active ' + type;
    toastIcon.textContent = type === 'success' ? '✅' : type === 'error' ? '❌' : '⚠️';
    toastMessage.textContent = message;
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

// Open modal
function openModal(modal) {
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close modal
function closeModal(modal) {
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Update UI based on auth state
function updateAuthUI() {
    const user = getCurrentUser();
    const navActions = document.querySelector('.nav-actions');
    
    if (!navActions) return;
    
    if (user) {
        navActions.innerHTML = `
            <div class="user-menu">
                <button class="user-btn">
                    <span class="user-avatar">${user.username.charAt(0).toUpperCase()}</span>
                    <span>${user.username}</span>
                </button>
                <div class="user-dropdown">
                    <div class="dropdown-header">
                        <div class="dropdown-username">${user.username}</div>
                        <div class="dropdown-email">${user.email}</div>
                    </div>
                    <ul class="dropdown-menu">
                        ${user.role === 'admin' ? `
                        <li class="dropdown-item" onclick="window.location.href='admin.html'">
                            <span>⚙️</span> Painel Admin
                        </li>` : ''}
                        <li class="dropdown-item danger" onclick="logout()">
                            <span>🚪</span> Sair
                        </li>
                    </ul>
                </div>
            </div>
        `;
    } else {
        navActions.innerHTML = `
            <button class="btn btn-ghost" id="loginBtn">
                <span class="btn-icon">👤</span>
                Login
            </button>
            <button class="btn btn-primary" id="registerBtn">
                Registrar
            </button>
        `;
        
        // Re-attach event listeners
        document.getElementById('loginBtn')?.addEventListener('click', () => openModal(loginModal));
        document.getElementById('registerBtn')?.addEventListener('click', () => openModal(registerModal));
    }
}

// Login handler
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    const result = authenticateUser(username, password);
    
    if (result.success) {
        setCurrentUser(result.user);
        closeModal(loginModal);
        showToast('Login realizado com sucesso!');
        updateAuthUI();
        loginForm.reset();
    } else {
        showToast(result.error, 'error');
    }
}

// Register handler
function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    if (password !== confirmPassword) {
        showToast('As senhas não coincidem', 'error');
        return;
    }
    
    if (password.length < 6) {
        showToast('A senha deve ter pelo menos 6 caracteres', 'error');
        return;
    }
    
    const result = createUser({ username, email, password });
    
    if (result.success) {
        setCurrentUser(result.user);
        closeModal(registerModal);
        showToast('Conta criada com sucesso!');
        updateAuthUI();
        registerForm.reset();
    } else {
        showToast(result.error, 'error');
    }
}

// Logout
function logout() {
    clearCurrentUser();
    showToast('Você saiu da conta');
    updateAuthUI();
    
    // Redirect if on admin page
    if (window.location.pathname.includes('admin')) {
        window.location.href = 'index.html';
    }
}

// Event Listeners
if (loginBtn) loginBtn.addEventListener('click', () => openModal(loginModal));
if (registerBtn) registerBtn.addEventListener('click', () => openModal(registerModal));
if (mobileLoginBtn) mobileLoginBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(loginModal); });
if (mobileRegisterBtn) mobileRegisterBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(registerModal); });
if (footerLoginBtn) footerLoginBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(loginModal); });
if (footerRegisterBtn) footerRegisterBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(registerModal); });
if (ctaRegisterBtn) ctaRegisterBtn.addEventListener('click', () => openModal(registerModal));

if (closeLoginModal) closeLoginModal.addEventListener('click', () => closeModal(loginModal));
if (closeRegisterModal) closeRegisterModal.addEventListener('click', () => closeModal(registerModal));

if (switchToRegister) switchToRegister.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal(loginModal);
    openModal(registerModal);
});

if (switchToLogin) switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal(registerModal);
    openModal(loginModal);
});

if (loginForm) loginForm.addEventListener('submit', handleLogin);
if (registerForm) registerForm.addEventListener('submit', handleRegister);

// Close modals on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', () => {
        closeModal(loginModal);
        closeModal(registerModal);
    });
});

// Close modals on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal(loginModal);
        closeModal(registerModal);
    }
});

// Initialize auth UI on load
document.addEventListener('DOMContentLoaded', updateAuthUI);
