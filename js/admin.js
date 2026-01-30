/* ============================
   ZnScripts - Admin Panel
   ============================ */

// Check admin access
const adminLoginModal = document.getElementById('adminLoginModal');
const adminLoginForm = document.getElementById('adminLoginForm');

function checkAdminAccess() {
    const user = getCurrentUser();
    if (user && user.role === 'admin') {
        adminLoginModal?.classList.remove('active');
        initAdminPanel();
    } else {
        adminLoginModal?.classList.add('active');
    }
}

// Admin login
adminLoginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('adminLoginUsername').value;
    const password = document.getElementById('adminLoginPassword').value;
    
    const result = authenticateUser(username, password);
    
    if (result.success) {
        if (result.user.role === 'admin') {
            setCurrentUser(result.user);
            adminLoginModal?.classList.remove('active');
            showToast('Bem-vindo ao painel admin!');
            initAdminPanel();
        } else {
            showToast('Acesso negado. Você não é administrador.', 'error');
        }
    } else {
        showToast(result.error, 'error');
    }
});

// Initialize admin panel
function initAdminPanel() {
    const user = getCurrentUser();
    if (user) {
        document.getElementById('adminName').textContent = user.username;
    }
    
    loadDashboard();
    setupNavigation();
    setupScriptsSection();
    setupExecutorsSection();
    setupUsersSection();
    setupSettings();
}

// ============= NAVIGATION =============

function setupNavigation() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('adminSidebar');
    const adminMain = document.querySelector('.admin-main');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            switchSection(section);
            
            // Update active state
            sidebarLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Update page title
            document.getElementById('pageTitle').textContent = link.textContent.trim();
        });
    });
    
    sidebarToggle?.addEventListener('click', () => {
        sidebar?.classList.toggle('active');
    });
    
    // Close sidebar on outside click (mobile)
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024 && 
            !sidebar?.contains(e.target) && 
            !sidebarToggle?.contains(e.target)) {
            sidebar?.classList.remove('active');
        }
    });
}

function switchSection(sectionName) {
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`${sectionName}Section`)?.classList.add('active');
    
    // Refresh data when switching
    if (sectionName === 'dashboard') loadDashboard();
    if (sectionName === 'scripts') loadScriptsTable();
    if (sectionName === 'executors') loadExecutorsTable();
    if (sectionName === 'users') loadUsersTable();
}

// ============= DASHBOARD =============

function loadDashboard() {
    const stats = getStats();
    
    document.getElementById('totalScripts').textContent = stats.scripts;
    document.getElementById('totalExecutors').textContent = stats.executors;
    document.getElementById('totalUsers').textContent = stats.users;
    document.getElementById('totalGames').textContent = stats.games;
    
    // Recent scripts
    const recentScripts = getScripts().slice(0, 5);
    const recentScriptsList = document.getElementById('recentScriptsList');
    if (recentScriptsList) {
        recentScriptsList.innerHTML = recentScripts.map(s => `
            <div class="recent-item">
                <div class="recent-item-image">
                    ${s.image ? `<img src="${s.image}" alt="">` : '📜'}
                </div>
                <div class="recent-item-info">
                    <div class="recent-item-name">${s.name}</div>
                    <div class="recent-item-meta">${s.game}</div>
                </div>
            </div>
        `).join('') || '<p>Nenhum script ainda</p>';
    }
    
    // Recent executors
    const recentExecutors = getExecutors().slice(0, 5);
    const recentExecutorsList = document.getElementById('recentExecutorsList');
    if (recentExecutorsList) {
        recentExecutorsList.innerHTML = recentExecutors.map(e => `
            <div class="recent-item">
                <div class="recent-item-image">
                    ${e.image ? `<img src="${e.image}" alt="">` : '🚀'}
                </div>
                <div class="recent-item-info">
                    <div class="recent-item-name">${e.name}</div>
                    <div class="recent-item-meta">${e.platform}</div>
                </div>
            </div>
        `).join('') || '<p>Nenhum executor ainda</p>';
    }
}

// Quick actions
document.getElementById('quickAddScript')?.addEventListener('click', () => {
    switchSection('scripts');
    document.querySelector('[data-section="scripts"]')?.classList.add('active');
    document.querySelector('[data-section="dashboard"]')?.classList.remove('active');
    openScriptFormModal();
});

document.getElementById('quickAddExecutor')?.addEventListener('click', () => {
    switchSection('executors');
    document.querySelector('[data-section="executors"]')?.classList.add('active');
    document.querySelector('[data-section="dashboard"]')?.classList.remove('active');
    openExecutorFormModal();
});

// ============= SCRIPTS SECTION =============

let currentEditScriptId = null;

function setupScriptsSection() {
    document.getElementById('addScriptBtn')?.addEventListener('click', openScriptFormModal);
    document.getElementById('closeScriptFormModal')?.addEventListener('click', closeScriptFormModal);
    document.getElementById('cancelScriptForm')?.addEventListener('click', closeScriptFormModal);
    document.getElementById('scriptForm')?.addEventListener('submit', handleScriptSubmit);
    document.getElementById('scriptsSearch')?.addEventListener('input', debounce(loadScriptsTable, 300));
    
    // Image preview
    document.getElementById('scriptImageFile')?.addEventListener('change', handleScriptImageUpload);
    
    loadScriptsTable();
}

function loadScriptsTable() {
    const query = document.getElementById('scriptsSearch')?.value || '';
    const scripts = searchScripts(query);
    const tbody = document.getElementById('scriptsTableBody');
    
    if (!tbody) return;
    
    if (scripts.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="table-empty">Nenhum script encontrado</td></tr>`;
        return;
    }
    
    tbody.innerHTML = scripts.map(s => `
        <tr>
            <td>
                <div class="table-image">
                    ${s.image ? `<img src="${s.image}" alt="">` : '<span class="table-image-placeholder">📜</span>'}
                </div>
            </td>
            <td><strong>${s.name}</strong></td>
            <td>${s.game}</td>
            <td>${s.creator}</td>
            <td>${formatDate(s.createdAt)}</td>
            <td>
                <div class="table-actions">
                    <button class="table-btn" onclick="editScript('${s.id}')">✏️</button>
                    <button class="table-btn danger" onclick="confirmDeleteScript('${s.id}')">🗑️</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openScriptFormModal(scriptId = null) {
    const modal = document.getElementById('scriptFormModal');
    const title = document.getElementById('scriptFormTitle');
    const form = document.getElementById('scriptForm');
    
    currentEditScriptId = scriptId;
    
    if (scriptId) {
        const script = getScriptById(scriptId);
        if (script) {
            title.textContent = 'Editar Script';
            document.getElementById('scriptId').value = script.id;
            document.getElementById('scriptName').value = script.name;
            document.getElementById('scriptGame').value = script.game;
            document.getElementById('scriptDescription').value = script.description;
            document.getElementById('scriptCode').value = script.code;
            document.getElementById('scriptCreator').value = script.creator;
            document.getElementById('scriptDiscord').value = script.discord || '';
            document.getElementById('scriptImage').value = script.image || '';
            
            if (script.image) {
                document.getElementById('scriptImagePreview').innerHTML = `<img src="${script.image}" alt="Preview">`;
            }
        }
    } else {
        title.textContent = 'Adicionar Script';
        form?.reset();
        document.getElementById('scriptImagePreview').innerHTML = '';
    }
    
    modal?.classList.add('active');
}

function closeScriptFormModal() {
    document.getElementById('scriptFormModal')?.classList.remove('active');
    document.getElementById('scriptForm')?.reset();
    document.getElementById('scriptImagePreview').innerHTML = '';
    currentEditScriptId = null;
}

function handleScriptImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        const base64 = event.target.result;
        document.getElementById('scriptImage').value = base64;
        document.getElementById('scriptImagePreview').innerHTML = `<img src="${base64}" alt="Preview">`;
    };
    reader.readAsDataURL(file);
}

function handleScriptSubmit(e) {
    e.preventDefault();
    
    const scriptData = {
        name: document.getElementById('scriptName').value,
        game: document.getElementById('scriptGame').value,
        description: document.getElementById('scriptDescription').value,
        code: document.getElementById('scriptCode').value,
        creator: document.getElementById('scriptCreator').value,
        discord: document.getElementById('scriptDiscord').value,
        image: document.getElementById('scriptImage').value
    };
    
    let result;
    if (currentEditScriptId) {
        result = updateScript(currentEditScriptId, scriptData);
    } else {
        result = createScript(scriptData);
    }
    
    if (result.success) {
        showToast(currentEditScriptId ? 'Script atualizado!' : 'Script adicionado!');
        closeScriptFormModal();
        loadScriptsTable();
        loadDashboard();
    } else {
        showToast(result.error, 'error');
    }
}

function editScript(id) {
    openScriptFormModal(id);
}

function confirmDeleteScript(id) {
    const script = getScriptById(id);
    if (!script) return;
    
    openDeleteModal(`Tem certeza que deseja excluir o script "${script.name}"?`, () => {
        const result = deleteScript(id);
        if (result.success) {
            showToast('Script excluído!');
            loadScriptsTable();
            loadDashboard();
        } else {
            showToast(result.error, 'error');
        }
    });
}

// ============= EXECUTORS SECTION =============

let currentEditExecutorId = null;

function setupExecutorsSection() {
    document.getElementById('addExecutorBtn')?.addEventListener('click', () => openExecutorFormModal());
    document.getElementById('closeExecutorFormModal')?.addEventListener('click', closeExecutorFormModal);
    document.getElementById('cancelExecutorForm')?.addEventListener('click', closeExecutorFormModal);
    document.getElementById('executorForm')?.addEventListener('submit', handleExecutorSubmit);
    document.getElementById('executorsSearch')?.addEventListener('input', debounce(loadExecutorsTable, 300));
    
    document.getElementById('executorImageFile')?.addEventListener('change', handleExecutorImageUpload);
    
    loadExecutorsTable();
}

function loadExecutorsTable() {
    const query = document.getElementById('executorsSearch')?.value || '';
    const executors = searchExecutors(query);
    const tbody = document.getElementById('executorsTableBody');
    
    if (!tbody) return;
    
    if (executors.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="table-empty">Nenhum executor encontrado</td></tr>`;
        return;
    }
    
    const platformLabels = {
        'windows': '🖥️ Windows',
        'mobile': '📱 Mobile',
        'mac': '🍎 Mac',
        'ios': '📱 iOS'
    };
    
    tbody.innerHTML = executors.map(e => `
        <tr>
            <td>
                <div class="table-image">
                    ${e.image ? `<img src="${e.image}" alt="">` : '<span class="table-image-placeholder">🚀</span>'}
                </div>
            </td>
            <td><strong>${e.name}</strong></td>
            <td>${platformLabels[e.platform] || e.platform}</td>
            <td>${e.creator}</td>
            <td>${formatDate(e.createdAt)}</td>
            <td>
                <div class="table-actions">
                    <button class="table-btn" onclick="editExecutor('${e.id}')">✏️</button>
                    <button class="table-btn danger" onclick="confirmDeleteExecutor('${e.id}')">🗑️</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openExecutorFormModal(executorId = null) {
    const modal = document.getElementById('executorFormModal');
    const title = document.getElementById('executorFormTitle');
    const form = document.getElementById('executorForm');
    
    currentEditExecutorId = executorId;
    
    if (executorId) {
        const executor = getExecutorById(executorId);
        if (executor) {
            title.textContent = 'Editar Executor';
            document.getElementById('executorId').value = executor.id;
            document.getElementById('executorName').value = executor.name;
            document.getElementById('executorPlatform').value = executor.platform;
            document.getElementById('executorDescription').value = executor.description;
            document.getElementById('executorDownload').value = executor.downloadUrl;
            document.getElementById('executorCreator').value = executor.creator;
            document.getElementById('executorDiscord').value = executor.discord || '';
            document.getElementById('executorImage').value = executor.image || '';
            
            if (executor.image) {
                document.getElementById('executorImagePreview').innerHTML = `<img src="${executor.image}" alt="Preview">`;
            }
        }
    } else {
        title.textContent = 'Adicionar Executor';
        form?.reset();
        document.getElementById('executorImagePreview').innerHTML = '';
    }
    
    modal?.classList.add('active');
}

function closeExecutorFormModal() {
    document.getElementById('executorFormModal')?.classList.remove('active');
    document.getElementById('executorForm')?.reset();
    document.getElementById('executorImagePreview').innerHTML = '';
    currentEditExecutorId = null;
}

function handleExecutorImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        const base64 = event.target.result;
        document.getElementById('executorImage').value = base64;
        document.getElementById('executorImagePreview').innerHTML = `<img src="${base64}" alt="Preview">`;
    };
    reader.readAsDataURL(file);
}

function handleExecutorSubmit(e) {
    e.preventDefault();
    
    const executorData = {
        name: document.getElementById('executorName').value,
        platform: document.getElementById('executorPlatform').value,
        description: document.getElementById('executorDescription').value,
        downloadUrl: document.getElementById('executorDownload').value,
        creator: document.getElementById('executorCreator').value,
        discord: document.getElementById('executorDiscord').value,
        image: document.getElementById('executorImage').value
    };
    
    let result;
    if (currentEditExecutorId) {
        result = updateExecutor(currentEditExecutorId, executorData);
    } else {
        result = createExecutor(executorData);
    }
    
    if (result.success) {
        showToast(currentEditExecutorId ? 'Executor atualizado!' : 'Executor adicionado!');
        closeExecutorFormModal();
        loadExecutorsTable();
        loadDashboard();
    } else {
        showToast(result.error, 'error');
    }
}

function editExecutor(id) {
    openExecutorFormModal(id);
}

function confirmDeleteExecutor(id) {
    const executor = getExecutorById(id);
    if (!executor) return;
    
    openDeleteModal(`Tem certeza que deseja excluir o executor "${executor.name}"?`, () => {
        const result = deleteExecutor(id);
        if (result.success) {
            showToast('Executor excluído!');
            loadExecutorsTable();
            loadDashboard();
        } else {
            showToast(result.error, 'error');
        }
    });
}

// ============= USERS SECTION =============

function setupUsersSection() {
    document.getElementById('usersSearch')?.addEventListener('input', debounce(loadUsersTable, 300));
    document.getElementById('closeUserEditModal')?.addEventListener('click', closeUserEditModal);
    document.getElementById('cancelUserEdit')?.addEventListener('click', closeUserEditModal);
    document.getElementById('userEditForm')?.addEventListener('submit', handleUserEditSubmit);
    
    loadUsersTable();
}

function loadUsersTable() {
    const query = document.getElementById('usersSearch')?.value || '';
    let users = getUsers();
    
    if (query) {
        const q = query.toLowerCase();
        users = users.filter(u => 
            u.username.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q)
        );
    }
    
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;
    
    if (users.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="table-empty">Nenhum usuário encontrado</td></tr>`;
        return;
    }
    
    tbody.innerHTML = users.map(u => `
        <tr>
            <td><strong>${u.username}</strong></td>
            <td>${u.email}</td>
            <td><span class="user-type-badge ${u.role}">${u.role === 'admin' ? 'Admin' : 'Usuário'}</span></td>
            <td>${formatDate(u.createdAt)}</td>
            <td>
                <div class="table-actions">
                    <button class="table-btn" onclick="editUser('${u.id}')">✏️</button>
                    ${u.role !== 'admin' ? `<button class="table-btn danger" onclick="confirmDeleteUser('${u.id}')">🗑️</button>` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

function editUser(id) {
    const user = getUserById(id);
    if (!user) return;
    
    document.getElementById('editUserId').value = user.id;
    document.getElementById('editUserRole').value = user.role;
    document.getElementById('editUserPassword').value = '';
    
    document.getElementById('userEditModal')?.classList.add('active');
}

function closeUserEditModal() {
    document.getElementById('userEditModal')?.classList.remove('active');
}

function handleUserEditSubmit(e) {
    e.preventDefault();
    
    const userId = document.getElementById('editUserId').value;
    const role = document.getElementById('editUserRole').value;
    const password = document.getElementById('editUserPassword').value;
    
    const updates = { role };
    if (password) {
        updates.password = password;
    }
    
    const result = updateUser(userId, updates);
    
    if (result.success) {
        showToast('Usuário atualizado!');
        closeUserEditModal();
        loadUsersTable();
    } else {
        showToast(result.error, 'error');
    }
}

function confirmDeleteUser(id) {
    const user = getUserById(id);
    if (!user) return;
    
    openDeleteModal(`Tem certeza que deseja excluir o usuário "${user.username}"?`, () => {
        const result = deleteUser(id);
        if (result.success) {
            showToast('Usuário excluído!');
            loadUsersTable();
            loadDashboard();
        } else {
            showToast(result.error, 'error');
        }
    });
}

// ============= SETTINGS =============

function setupSettings() {
    document.getElementById('changePasswordForm')?.addEventListener('submit', handlePasswordChange);
    document.getElementById('resetDataBtn')?.addEventListener('click', confirmResetData);
    
    const settings = JSON.parse(localStorage.getItem(DB_KEYS.SETTINGS) || '{}');
    if (settings.lastUpdate) {
        document.getElementById('lastUpdate').textContent = formatDate(settings.lastUpdate);
    }
}

function handlePasswordChange(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmNewPassword').value;
    
    const user = getCurrentUser();
    if (!user) return;
    
    // Verify current password
    const authResult = authenticateUser(user.username, currentPassword);
    if (!authResult.success) {
        showToast('Senha atual incorreta', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showToast('As novas senhas não coincidem', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showToast('A nova senha deve ter pelo menos 6 caracteres', 'error');
        return;
    }
    
    const result = updateUser(user.id, { password: newPassword });
    
    if (result.success) {
        showToast('Senha alterada com sucesso!');
        document.getElementById('changePasswordForm')?.reset();
    } else {
        showToast(result.error, 'error');
    }
}

function confirmResetData() {
    openDeleteModal('Isso irá resetar todos os dados para os valores padrão. Continuar?', () => {
        resetDatabase();
        showToast('Dados resetados!');
        loadDashboard();
        loadScriptsTable();
        loadExecutorsTable();
        loadUsersTable();
    });
}

// ============= DELETE MODAL =============

let deleteCallback = null;

function openDeleteModal(message, callback) {
    const modal = document.getElementById('deleteModal');
    document.getElementById('deleteMessage').textContent = message;
    deleteCallback = callback;
    modal?.classList.add('active');
}

document.getElementById('cancelDelete')?.addEventListener('click', () => {
    document.getElementById('deleteModal')?.classList.remove('active');
    deleteCallback = null;
});

document.getElementById('confirmDelete')?.addEventListener('click', () => {
    if (deleteCallback) {
        deleteCallback();
    }
    document.getElementById('deleteModal')?.classList.remove('active');
    deleteCallback = null;
});

// ============= LOGOUT =============

document.getElementById('logoutBtn')?.addEventListener('click', () => {
    clearCurrentUser();
    window.location.href = 'index.html';
});

// ============= UTILITIES =============

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============= INITIALIZE =============

document.addEventListener('DOMContentLoaded', checkAdminAccess);

// Close modals on overlay click
document.querySelectorAll('#scriptFormModal .modal-overlay, #executorFormModal .modal-overlay, #userEditModal .modal-overlay, #deleteModal .modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', () => {
        closeScriptFormModal();
        closeExecutorFormModal();
        closeUserEditModal();
        document.getElementById('deleteModal')?.classList.remove('active');
    });
});
