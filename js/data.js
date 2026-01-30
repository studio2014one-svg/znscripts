/* ============================
   ZnScripts - Data Management
   LocalStorage Database System
   ============================ */

const DB_KEYS = {
    USERS: 'znscripts_users',
    SCRIPTS: 'znscripts_scripts',
    EXECUTORS: 'znscripts_executors',
    CURRENT_USER: 'znscripts_current_user',
    SETTINGS: 'znscripts_settings'
};

function initializeDatabase() {
    if (localStorage.getItem(DB_KEYS.SETTINGS)) return;

    const defaultUsers = [{
        id: 'admin_1',
        username: 'admin',
        email: 'admin@znscripts.com',
        password: hashPassword('admin123'),
        role: 'admin',
        createdAt: new Date().toISOString()
    }];

    const defaultScripts = [
        {
            id: 'script_1',
            name: 'Blox Fruits Auto Farm',
            game: 'Blox Fruits',
            description: 'Script completo de auto farm para Blox Fruits. Inclui farm de frutas, quests, mastery e muito mais. Atualizado e funcionando!',
            code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/example/bloxfruits/main/script.lua"))()',
            creator: 'Zn_Atxug',
            discord: 'https://discord.gg/example',
            image: '',
            createdAt: new Date().toISOString()
        },
        {
            id: 'script_2',
            name: 'Pet Simulator X Dupe',
            game: 'Pet Simulator X',
            description: 'Script de duplicação de pets funcionando. Use com cuidado para não ser banido.',
            code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/example/petx/main/dupe.lua"))()',
            creator: 'ScriptDev',
            discord: '',
            image: '',
            createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
            id: 'script_3',
            name: 'Murder Mystery 2 ESP',
            game: 'Murder Mystery 2',
            description: 'ESP completo para MM2. Mostra murderer, sheriff e jogadores através das paredes.',
            code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/example/mm2/main/esp.lua"))()',
            creator: 'MM2Scripts',
            discord: 'https://discord.gg/mm2scripts',
            image: '',
            createdAt: new Date(Date.now() - 172800000).toISOString()
        },
        {
            id: 'script_4',
            name: 'Jailbreak Auto Rob',
            game: 'Jailbreak',
            description: 'Script de roubo automático para Jailbreak. Rouba banco, joalheria, trem e muito mais automaticamente.',
            code: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/example/jailbreak/main/autorob.lua"))()',
            creator: 'JBScripts',
            discord: '',
            image: '',
            createdAt: new Date(Date.now() - 259200000).toISOString()
        }
    ];

    const defaultExecutors = [
        {
            id: 'executor_1',
            name: 'Fluxus',
            platform: 'windows',
            description: 'Executor gratuito e confiável para Windows. Suporta a maioria dos scripts e tem interface amigável.',
            downloadUrl: 'https://fluxteam.net/',
            creator: 'Flux Team',
            discord: 'https://discord.gg/fluxus',
            image: '',
            createdAt: new Date().toISOString()
        },
        {
            id: 'executor_2',
            name: 'Arceus X',
            platform: 'mobile',
            description: 'Melhor executor para Android. Fácil de usar e suporta muitos scripts.',
            downloadUrl: 'https://arceusx.com/',
            creator: 'Arceus Team',
            discord: 'https://discord.gg/arceusx',
            image: '',
            createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
            id: 'executor_3',
            name: 'Krnl',
            platform: 'windows',
            description: 'Executor poderoso e gratuito. Alta compatibilidade com scripts.',
            downloadUrl: 'https://krnl.place/',
            creator: 'Krnl Team',
            discord: 'https://discord.gg/krnl',
            image: '',
            createdAt: new Date(Date.now() - 172800000).toISOString()
        }
    ];

    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(defaultUsers));
    localStorage.setItem(DB_KEYS.SCRIPTS, JSON.stringify(defaultScripts));
    localStorage.setItem(DB_KEYS.EXECUTORS, JSON.stringify(defaultExecutors));
    localStorage.setItem(DB_KEYS.SETTINGS, JSON.stringify({ initialized: true, lastUpdate: new Date().toISOString() }));
}

function hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return 'hash_' + Math.abs(hash).toString(16);
}

function verifyPassword(password, hash) {
    return hashPassword(password) === hash;
}

function generateId(prefix = 'item') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// USERS
function getUsers() {
    const users = localStorage.getItem(DB_KEYS.USERS);
    return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
}

function getUserById(id) {
    return getUsers().find(u => u.id === id);
}

function getUserByUsername(username) {
    return getUsers().find(u => u.username.toLowerCase() === username.toLowerCase());
}

function createUser(userData) {
    const users = getUsers();
    if (users.find(u => u.username.toLowerCase() === userData.username.toLowerCase())) {
        return { success: false, error: 'Nome de usuário já existe' };
    }
    if (users.find(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
        return { success: false, error: 'Email já cadastrado' };
    }
    const newUser = {
        id: generateId('user'),
        username: userData.username,
        email: userData.email,
        password: hashPassword(userData.password),
        role: 'user',
        createdAt: new Date().toISOString()
    };
    users.push(newUser);
    saveUsers(users);
    return { success: true, user: { ...newUser, password: undefined } };
}

function updateUser(id, updates) {
    const users = getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return { success: false, error: 'Usuário não encontrado' };
    if (updates.password) updates.password = hashPassword(updates.password);
    users[index] = { ...users[index], ...updates };
    saveUsers(users);
    return { success: true, user: { ...users[index], password: undefined } };
}

function deleteUser(id) {
    const users = getUsers();
    const filtered = users.filter(u => u.id !== id);
    if (filtered.length === users.length) return { success: false, error: 'Usuário não encontrado' };
    saveUsers(filtered);
    return { success: true };
}

function authenticateUser(username, password) {
    const user = getUserByUsername(username);
    if (!user) return { success: false, error: 'Usuário não encontrado' };
    if (!verifyPassword(password, user.password)) return { success: false, error: 'Senha incorreta' };
    return { success: true, user: { ...user, password: undefined } };
}

// SCRIPTS
function getScripts() {
    const scripts = localStorage.getItem(DB_KEYS.SCRIPTS);
    return scripts ? JSON.parse(scripts) : [];
}

function saveScripts(scripts) {
    localStorage.setItem(DB_KEYS.SCRIPTS, JSON.stringify(scripts));
}

function getScriptById(id) {
    return getScripts().find(s => s.id === id);
}

function createScript(scriptData) {
    const scripts = getScripts();
    const newScript = {
        id: generateId('script'),
        name: scriptData.name,
        game: scriptData.game,
        description: scriptData.description,
        code: scriptData.code,
        creator: scriptData.creator,
        discord: scriptData.discord || '',
        image: scriptData.image || '',
        createdAt: new Date().toISOString()
    };
    scripts.unshift(newScript);
    saveScripts(scripts);
    return { success: true, script: newScript };
}

function updateScript(id, updates) {
    const scripts = getScripts();
    const index = scripts.findIndex(s => s.id === id);
    if (index === -1) return { success: false, error: 'Script não encontrado' };
    scripts[index] = { ...scripts[index], ...updates, updatedAt: new Date().toISOString() };
    saveScripts(scripts);
    return { success: true, script: scripts[index] };
}

function deleteScript(id) {
    const scripts = getScripts();
    const filtered = scripts.filter(s => s.id !== id);
    if (filtered.length === scripts.length) return { success: false, error: 'Script não encontrado' };
    saveScripts(filtered);
    return { success: true };
}

function searchScripts(query, gameFilter = '') {
    let scripts = getScripts();
    if (query) {
        const q = query.toLowerCase();
        scripts = scripts.filter(s => 
            s.name.toLowerCase().includes(q) ||
            s.game.toLowerCase().includes(q) ||
            s.description.toLowerCase().includes(q)
        );
    }
    if (gameFilter) {
        scripts = scripts.filter(s => s.game.toLowerCase() === gameFilter.toLowerCase());
    }
    return scripts;
}

function getUniqueGames() {
    const scripts = getScripts();
    return [...new Set(scripts.map(s => s.game))].sort();
}

// EXECUTORS
function getExecutors() {
    const executors = localStorage.getItem(DB_KEYS.EXECUTORS);
    return executors ? JSON.parse(executors) : [];
}

function saveExecutors(executors) {
    localStorage.setItem(DB_KEYS.EXECUTORS, JSON.stringify(executors));
}

function getExecutorById(id) {
    return getExecutors().find(e => e.id === id);
}

function createExecutor(executorData) {
    const executors = getExecutors();
    const newExecutor = {
        id: generateId('executor'),
        name: executorData.name,
        platform: executorData.platform,
        description: executorData.description,
        downloadUrl: executorData.downloadUrl,
        creator: executorData.creator,
        discord: executorData.discord || '',
        image: executorData.image || '',
        createdAt: new Date().toISOString()
    };
    executors.unshift(newExecutor);
    saveExecutors(executors);
    return { success: true, executor: newExecutor };
}

function updateExecutor(id, updates) {
    const executors = getExecutors();
    const index = executors.findIndex(e => e.id === id);
    if (index === -1) return { success: false, error: 'Executor não encontrado' };
    executors[index] = { ...executors[index], ...updates, updatedAt: new Date().toISOString() };
    saveExecutors(executors);
    return { success: true, executor: executors[index] };
}

function deleteExecutor(id) {
    const executors = getExecutors();
    const filtered = executors.filter(e => e.id !== id);
    if (filtered.length === executors.length) return { success: false, error: 'Executor não encontrado' };
    saveExecutors(filtered);
    return { success: true };
}

function searchExecutors(query, platformFilter = '') {
    let executors = getExecutors();
    if (query) {
        const q = query.toLowerCase();
        executors = executors.filter(e => 
            e.name.toLowerCase().includes(q) ||
            e.description.toLowerCase().includes(q)
        );
    }
    if (platformFilter) {
        executors = executors.filter(e => e.platform.toLowerCase() === platformFilter.toLowerCase());
    }
    return executors;
}

// SESSION
function getCurrentUser() {
    const user = localStorage.getItem(DB_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
}

function setCurrentUser(user) {
    localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(user));
}

function clearCurrentUser() {
    localStorage.removeItem(DB_KEYS.CURRENT_USER);
}

function isLoggedIn() {
    return getCurrentUser() !== null;
}

function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'admin';
}

// STATS
function getStats() {
    return {
        scripts: getScripts().length,
        executors: getExecutors().length,
        users: getUsers().length,
        games: getUniqueGames().length
    };
}

// RESET
function resetDatabase() {
    localStorage.removeItem(DB_KEYS.USERS);
    localStorage.removeItem(DB_KEYS.SCRIPTS);
    localStorage.removeItem(DB_KEYS.EXECUTORS);
    localStorage.removeItem(DB_KEYS.SETTINGS);
    initializeDatabase();
}

initializeDatabase();
