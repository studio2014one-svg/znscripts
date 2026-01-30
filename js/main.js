/* ============================
   ZnScripts - Main JavaScript
   ============================ */

// ============= NAVIGATION =============

const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar?.classList.add('scrolled');
    } else {
        navbar?.classList.remove('scrolled');
    }
});

// Mobile menu toggle
mobileMenuBtn?.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    mobileMenu?.classList.toggle('active');
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn?.classList.remove('active');
        mobileMenu?.classList.remove('active');
    });
});

// ============= PARTICLES =============

function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        container.appendChild(particle);
    }
}

// ============= COUNTER ANIMATION =============

function animateCounter(element, target, duration = 2000) {
    if (!element) return;
    
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// ============= HOME PAGE =============

function initHomePage() {
    const stats = getStats();
    
    // Animate counters
    setTimeout(() => {
        animateCounter(document.getElementById('scriptsCount'), stats.scripts);
        animateCounter(document.getElementById('executorsCount'), stats.executors);
        animateCounter(document.getElementById('usersCount'), stats.users);
    }, 500);
    
    // Load recent scripts
    loadRecentScripts();
}

function loadRecentScripts() {
    const container = document.getElementById('recentScripts');
    if (!container) return;
    
    const scripts = getScripts().slice(0, 4);
    
    if (scripts.length === 0) {
        container.innerHTML = '<p class="empty-state">Nenhum script disponível ainda.</p>';
        return;
    }
    
    container.innerHTML = scripts.map(script => createScriptCard(script)).join('');
}

// ============= SCRIPT CARD =============

function createScriptCard(script) {
    const imageHtml = script.image 
        ? `<img src="${script.image}" alt="${script.name}">`
        : `<span class="card-image-placeholder">📜</span>`;
    
    return `
        <div class="script-card" onclick="openScriptDetail('${script.id}')">
            <div class="card-image">
                ${imageHtml}
            </div>
            <div class="card-content">
                <span class="card-badge">${script.game}</span>
                <h3 class="card-title">${script.name}</h3>
                <p class="card-description">${script.description}</p>
                <div class="card-meta">
                    <span class="card-creator">
                        <span>👤</span>
                        ${script.creator}
                    </span>
                </div>
            </div>
            <div class="card-actions">
                <button class="card-btn card-btn-primary" onclick="event.stopPropagation(); copyScript('${script.id}')">
                    📋 Copiar Script
                </button>
                <button class="card-btn card-btn-secondary" onclick="event.stopPropagation(); openScriptDetail('${script.id}')">
                    👁️ Ver
                </button>
            </div>
        </div>
    `;
}

// ============= EXECUTOR CARD =============

function createExecutorCard(executor) {
    const imageHtml = executor.image 
        ? `<img src="${executor.image}" alt="${executor.name}">`
        : `<span class="card-image-placeholder">🚀</span>`;
    
    const platformClass = `platform-${executor.platform}`;
    const platformLabel = {
        'windows': '🖥️ Windows',
        'mobile': '📱 Mobile',
        'mac': '🍎 Mac',
        'ios': '📱 iOS'
    }[executor.platform] || executor.platform;
    
    return `
        <div class="executor-card" onclick="openExecutorDetail('${executor.id}')">
            <div class="card-image">
                ${imageHtml}
            </div>
            <div class="card-content">
                <span class="platform-badge ${platformClass}">${platformLabel}</span>
                <h3 class="card-title">${executor.name}</h3>
                <p class="card-description">${executor.description}</p>
                <div class="card-meta">
                    <span class="card-creator">
                        <span>👤</span>
                        ${executor.creator}
                    </span>
                </div>
            </div>
            <div class="card-actions">
                <a href="${executor.downloadUrl}" target="_blank" class="card-btn card-btn-primary" onclick="event.stopPropagation()">
                    ⬇️ Download
                </a>
                <button class="card-btn card-btn-secondary" onclick="event.stopPropagation(); openExecutorDetail('${executor.id}')">
                    👁️ Ver
                </button>
            </div>
        </div>
    `;
}

// ============= COPY SCRIPT =============

function copyScript(scriptId) {
    const script = getScriptById(scriptId);
    if (!script) {
        showToast('Script não encontrado', 'error');
        return;
    }
    
    navigator.clipboard.writeText(script.code).then(() => {
        showToast('Script copiado para a área de transferência!');
    }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = script.code;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Script copiado para a área de transferência!');
    });
}

// ============= SCRIPT DETAIL =============

function openScriptDetail(scriptId) {
    const script = getScriptById(scriptId);
    if (!script) return;
    
    const modal = document.getElementById('scriptModal');
    const detail = document.getElementById('scriptDetail');
    
    if (!modal || !detail) return;
    
    const imageHtml = script.image 
        ? `<img src="${script.image}" alt="${script.name}">`
        : `<span class="detail-image-placeholder">📜</span>`;
    
    detail.innerHTML = `
        <div class="detail-image">
            ${imageHtml}
        </div>
        <div class="detail-header">
            <h2 class="detail-title">${script.name}</h2>
            <span class="detail-badge">${script.game}</span>
        </div>
        <p class="detail-description">${script.description}</p>
        <div class="detail-meta">
            <div class="meta-item">
                <span class="meta-label">Criador</span>
                <span class="meta-value">${script.creator}</span>
            </div>
            ${script.discord ? `
            <div class="meta-item">
                <span class="meta-label">Discord</span>
                <span class="meta-value"><a href="${script.discord}" target="_blank">${script.discord}</a></span>
            </div>
            ` : ''}
            <div class="meta-item">
                <span class="meta-label">Adicionado em</span>
                <span class="meta-value">${new Date(script.createdAt).toLocaleDateString('pt-BR')}</span>
            </div>
        </div>
        <div class="detail-code">${escapeHtml(script.code)}</div>
        <div class="detail-actions">
            <button class="btn btn-primary btn-lg" onclick="copyScript('${script.id}')">
                📋 Copiar Script
            </button>
            ${script.discord ? `
            <a href="${script.discord}" target="_blank" class="btn btn-outline btn-lg">
                💬 Discord
            </a>
            ` : ''}
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ============= EXECUTOR DETAIL =============

function openExecutorDetail(executorId) {
    const executor = getExecutorById(executorId);
    if (!executor) return;
    
    const modal = document.getElementById('executorModal');
    const detail = document.getElementById('executorDetail');
    
    if (!modal || !detail) return;
    
    const imageHtml = executor.image 
        ? `<img src="${executor.image}" alt="${executor.name}">`
        : `<span class="detail-image-placeholder">🚀</span>`;
    
    const platformLabel = {
        'windows': '🖥️ Windows',
        'mobile': '📱 Mobile (Android)',
        'mac': '🍎 Mac',
        'ios': '📱 iOS'
    }[executor.platform] || executor.platform;
    
    detail.innerHTML = `
        <div class="detail-image">
            ${imageHtml}
        </div>
        <div class="detail-header">
            <h2 class="detail-title">${executor.name}</h2>
            <span class="detail-badge">${platformLabel}</span>
        </div>
        <p class="detail-description">${executor.description}</p>
        <div class="detail-meta">
            <div class="meta-item">
                <span class="meta-label">Criador</span>
                <span class="meta-value">${executor.creator}</span>
            </div>
            ${executor.discord ? `
            <div class="meta-item">
                <span class="meta-label">Discord</span>
                <span class="meta-value"><a href="${executor.discord}" target="_blank">${executor.discord}</a></span>
            </div>
            ` : ''}
            <div class="meta-item">
                <span class="meta-label">Adicionado em</span>
                <span class="meta-value">${new Date(executor.createdAt).toLocaleDateString('pt-BR')}</span>
            </div>
        </div>
        <div class="detail-actions">
            <a href="${executor.downloadUrl}" target="_blank" class="btn btn-primary btn-lg">
                ⬇️ Download
            </a>
            ${executor.discord ? `
            <a href="${executor.discord}" target="_blank" class="btn btn-outline btn-lg">
                💬 Discord
            </a>
            ` : ''}
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ============= CLOSE MODALS =============

document.getElementById('closeScriptModal')?.addEventListener('click', () => {
    document.getElementById('scriptModal')?.classList.remove('active');
    document.body.style.overflow = '';
});

document.getElementById('closeExecutorModal')?.addEventListener('click', () => {
    document.getElementById('executorModal')?.classList.remove('active');
    document.body.style.overflow = '';
});

// Close on overlay click
document.querySelectorAll('#scriptModal .modal-overlay, #executorModal .modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', () => {
        document.getElementById('scriptModal')?.classList.remove('active');
        document.getElementById('executorModal')?.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ============= UTILITIES =============

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

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

document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    
    // Check if we're on the home page
    if (document.getElementById('recentScripts')) {
        initHomePage();
    }
});
