/* ============================
   ZnScripts - Scripts Page
   ============================ */

// DOM Elements
const scriptsGrid = document.getElementById('scriptsGrid');
const searchInput = document.getElementById('searchInput');
const gameFilter = document.getElementById('gameFilter');
const sortFilter = document.getElementById('sortFilter');
const emptyState = document.getElementById('emptyState');

// Load all scripts
function loadScripts() {
    const query = searchInput?.value || '';
    const game = gameFilter?.value || '';
    const sort = sortFilter?.value || 'newest';
    
    let scripts = searchScripts(query, game);
    
    // Sort scripts
    switch (sort) {
        case 'oldest':
            scripts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
        case 'name':
            scripts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'newest':
        default:
            scripts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    renderScripts(scripts);
}

// Render scripts grid
function renderScripts(scripts) {
    if (!scriptsGrid) return;
    
    if (scripts.length === 0) {
        scriptsGrid.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    scriptsGrid.style.display = 'grid';
    if (emptyState) emptyState.style.display = 'none';
    
    scriptsGrid.innerHTML = scripts.map(script => createScriptCard(script)).join('');
}

// Load game filter options
function loadGameOptions() {
    if (!gameFilter) return;
    
    const games = getUniqueGames();
    
    games.forEach(game => {
        const option = document.createElement('option');
        option.value = game;
        option.textContent = game;
        gameFilter.appendChild(option);
    });
}

// Event Listeners
searchInput?.addEventListener('input', debounce(loadScripts, 300));
gameFilter?.addEventListener('change', loadScripts);
sortFilter?.addEventListener('change', loadScripts);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadGameOptions();
    loadScripts();
});
