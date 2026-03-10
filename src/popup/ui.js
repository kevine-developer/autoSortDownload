import { saveConfigAPI, loadStatsAPI, sendMessage } from './api.js';

let currentConfig = null;
let currentStats = null;

export const setConfig = (c) => { currentConfig = c; };
export const setStats = (s) => { currentStats = s; };

export function updateHeaderUI() {
  if (!currentConfig) return;
  const statusEl = document.getElementById('status-message');
  if (statusEl) {
    statusEl.textContent = currentConfig.enabled ? 'ACTIF' : 'INACTIF';
    statusEl.style.color = currentConfig.enabled ? '#c8ff00' : '#9ba1a6';
  }
  const toggleEl = document.getElementById('enabledToggle');
  if (toggleEl) toggleEl.checked = currentConfig.enabled;
}

export function updateMainContentUI() {
  const activePage = document.querySelector('.page.active')?.id;
  if (activePage === 'categories') updateCategoriesUI();
  if (activePage === 'stats') updateStatsUI();
}

export function updateCategoriesUI() {
  const list = document.getElementById('categoriesList');
  if (!list) return;

  if (!currentConfig || !currentConfig.categories) {
    list.innerHTML = '<li class="category-item">Chargement...</li>';
    return;
  }

  const entries = Object.entries(currentConfig.categories);
  list.innerHTML = '';
  
  entries.forEach(([name, cat]) => {
    const li = document.createElement('li');
    li.className = 'category-item';
    li.innerHTML = `
      <div>
        <span class="category-name">${name}</span>
        <span class="category-ext">${cat.extensions.slice(0, 3).join(', ')}${cat.extensions.length > 3 ? '...' : ''}</span>
      </div>
      <label class="switch">
        <input type="checkbox" ${cat.enabled ? 'checked' : ''}>
        <span class="slider"></span>
      </label>
    `;

    li.querySelector('input').addEventListener('change', async (e) => {
      currentConfig.categories[name].enabled = e.target.checked;
      await saveConfigAPI(currentConfig);
    });

    list.appendChild(li);
  });
}

export function updateStatsUI() {
  if (!currentStats) return;
  const totalEl = document.getElementById('totalFiles');
  if (totalEl) totalEl.textContent = currentStats.total || 0;

  const list = document.getElementById('statsList');
  if (list) {
    list.innerHTML = '';
    Object.entries(currentStats).forEach(([key, val]) => {
      if (key === 'total' || val === 0) return;
      const li = document.createElement('li');
      li.className = 'stat-item';
      li.innerHTML = `<span>${key}</span><span class="stat-count">${val}</span>`;
      list.appendChild(li);
    });
  }
}


export function switchTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tabId));
  document.querySelectorAll('.page').forEach(p => p.classList.toggle('active', p.id === tabId));
  updateMainContentUI();
}

export function initializeEventListeners() {
  document.getElementById('enabledToggle')?.addEventListener('change', async (e) => {
    if (currentConfig) {
      currentConfig.enabled = e.target.checked;
      await saveConfigAPI(currentConfig);
      updateHeaderUI();
    }
  });

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  document.getElementById('searchCategories')?.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    document.querySelectorAll('.category-item').forEach(li => {
      const name = li.querySelector('.category-name').textContent.toLowerCase();
      li.style.display = name.includes(term) ? 'flex' : 'none';
    });
  });

  document.getElementById('resetStats')?.addEventListener('click', async () => {
    if (confirm('Voulez-vous réinitialiser les statistiques ?')) {
      await sendMessage({ action: 'resetStats' });
      setStats(await loadStatsAPI());
      updateStatsUI();
    }
  });

  document.getElementById('openDownloadsFolder')?.addEventListener('click', () => chrome.downloads.showDefaultFolder());
  document.getElementById('refreshButton')?.addEventListener('click', () => location.reload());
}
