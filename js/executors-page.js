/* ============================
   ZnScripts - Executors Page
   ============================ */

// DOM Elements
const executorsGrid = document.getElementById('executorsGrid');
const searchInput = document.getElementById('searchInput');
const platformFilter = document.getElementById('platformFilter');
const sortFilter = document.getElementById('sortFilter');
const emptyState = document.getElementById('emptyState');

// Load all executors
function loadExecutors() {
    const query = searchInput?.value || '';
    const platform = platformFilter?.value || '';
    const sort = sortFilter?.value || 'newest';
    
    let executors = searchExecutors(query, platform);
    
    // Sort executors
    switch (sort) {
        case 'oldest':
            executors.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
        case 'name':
            executors.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'newest':
        default:
            executors.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    renderExecutors(executors);
}

// Render executors grid
function renderExecutors(executors) {
    if (!executorsGrid) return;
    
    if (executors.length === 0) {
        executorsGrid.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    executorsGrid.style.display = 'grid';
    if (emptyState) emptyState.style.display = 'none';
    
    executorsGrid.innerHTML = executors.map(executor => createExecutorCard(executor)).join('');
}

// Event Listeners
searchInput?.addEventListener('input', debounce(loadExecutors, 300));
platformFilter?.addEventListener('change', loadExecutors);
sortFilter?.addEventListener('change', loadExecutors);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadExecutors();
});
