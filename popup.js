// Configuration et état global
let currentConfig = null;
let currentStats = null;

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  initializeEventListeners();
  updateHeaderUI();
  updateMainContentUI();
});

async function loadData() {
  await loadConfig();
  await loadStats();
}

// Chargement de la configuration
async function loadConfig() {
  try {
    const response = await sendMessage({ action: 'getConfig' });
    currentConfig = response;
  } catch (error) {
    console.error('Erreur lors du chargement de la configuration:', error);
  }
}

// Chargement des statistiques
async function loadStats() {
  try {
    const response = await sendMessage({ action: 'getStats' });
    currentStats = response;
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error);
  }
}

// Sauvegarde de la configuration
async function saveConfig() {
  try {
    await sendMessage({ action: 'saveConfig', config: currentConfig });
    showStatus('Configuration sauvegardée', 'success', 'save-status');
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    showStatus('Erreur lors de la sauvegarde', 'error', 'save-status');
  }
}

// Fonction pour afficher les messages de statut
function showStatus(message, type = 'info', elementId = null) {
  // Si un ID d'élément spécifique est fourni, l'utiliser
  if (elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = message;
      element.className = `status-message ${type}`;
      // Effacer le message après 3 secondes
      setTimeout(() => {
        element.textContent = '';
        element.className = 'status-message';
      }, 3000);
      return;
    }
  }

  // Sinon, créer un toast temporaire
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  
  // Styles inline pour le toast
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    padding: '12px 16px',
    borderRadius: '4px',
    color: 'white',
    fontSize: '14px',
    zIndex: '10000',
    animation: 'slideIn 0.3s ease-out',
    backgroundColor: type === 'success' ? '#4CAF50' : 
                     type === 'error' ? '#f44336' : 
                     type === 'warning' ? '#ff9800' : '#2196F3'
  });

  document.body.appendChild(toast);

  // Supprimer le toast après 3 secondes
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

// Communication avec le background script
function sendMessage(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, response => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(response);
      }
    });
  });
}

// Écouter les messages du background script
chrome.runtime.onMessage?.addListener((message, sender, sendResponse) => {
  if (message.action === 'configChanged') {
    // La configuration a changé dans le background, recharger
    loadConfig();
  } else if (message.action === 'statsChanged') {
    // Les statistiques ont changé, recharger
    loadStats();
  }
  sendResponse({ received: true });
});

// Initialisation des événements
function initializeEventListeners() {
  // Toggle principal
  document.getElementById('enabledToggle')?.addEventListener('change', async (e) => {
    currentConfig.enabled = e.target.checked;
    await saveConfig();
    updateHeaderUI();
  });

  // Onglets
  document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => switchTab(button.dataset.tab));
  });

  // Recherche
  document.getElementById('searchCategories')?.addEventListener('input', (e) => filterCategories(e.target.value));

  // Catégories en masse
  document.getElementById('enableAllCategories')?.addEventListener('click', () => {
    Object.keys(currentConfig.categories).forEach(key => currentConfig.categories[key].enabled = true);
    updateMainContentUI();
    saveConfig();
  });

  document.getElementById('disableAllCategories')?.addEventListener('click', () => {
    Object.keys(currentConfig.categories).forEach(key => currentConfig.categories[key].enabled = false);
    updateMainContentUI();
    saveConfig();
  });

  // Réinitialisation des stats
  document.getElementById('resetStats')?.addEventListener('click', async () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser les statistiques ?')) {
      await sendMessage({ action: 'resetStats' });
      await loadStats();
      updateMainContentUI();
    }
  });

  // Actions rapides
  document.getElementById('openDownloadsFolder')?.addEventListener('click', () => {
    chrome.downloads.showDefaultFolder();
  });
  
  document.getElementById('openOptionsPage')?.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
}

// Changement d'onglet
async function switchTab(tabName) {
  document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');

  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  document.getElementById(tabName)?.classList.add('active');

  // Nouvelle ligne : charger les statistiques avant de mettre à jour l'interface
  if (tabName === 'stats') {
    await loadStats(); 
  }
  updateMainContentUI();
}

// Mise à jour de l'interface de l'en-tête
function updateHeaderUI() {
  if (!currentConfig) return;
  const statusMessage = currentConfig.enabled ? 'Tri automatique activé' : 'Tri automatique désactivé';
  document.getElementById('status-message').textContent = statusMessage;
  document.getElementById('status-message').className = `subtitle ${currentConfig.enabled ? 'active' : ''}`;
  document.getElementById('enabledToggle').checked = currentConfig.enabled;
}

// Mise à jour du contenu de l'onglet actif
function updateMainContentUI() {
  const activeTab = document.querySelector('.tab-content.active')?.id;
  if (!activeTab) return;

  switch (activeTab) {
    case 'categories':
      updateCategoriesUI();
      break;
    case 'stats':
      updateStatsUI();
      break;
  }
}

// Mise à jour de l'affichage des catégories
function updateCategoriesUI() {
  if (!currentConfig) return;
  const categoriesList = document.getElementById('categoriesList');
  if (!categoriesList) return;
  
  categoriesList.innerHTML = '';

  Object.entries(currentConfig.categories).forEach(([name, category]) => {
    const categoryElement = createCategoryElement(name, category);
    categoriesList.appendChild(categoryElement);
  });
}

// Création d'un élément de catégorie
function createCategoryElement(name, category) {
  const div = document.createElement('li');
  div.className = 'category-item';
  div.dataset.category = name.toLowerCase();

  const extensionsText = category.extensions.length > 0
    ? category.extensions.slice(0, 5).join(', ') + 
      (category.extensions.length > 5 ? ` +${category.extensions.length - 5}` : '')
    : 'Aucune extension';

  div.innerHTML = `
    <div class="category-info">
      <div class="category-details">
        <div class="category-name">${name}</div>
        <div class="category-extensions">${extensionsText}</div>
      </div>
    </div>
    <label class="category-toggle">
      <input type="checkbox" ${category.enabled ? 'checked' : ''}>
      <span class="slider"></span>
    </label>
  `;

  div.querySelector('input[type="checkbox"]')?.addEventListener('change', async (e) => {
    currentConfig.categories[name].enabled = e.target.checked;
    await saveConfig();
  });

  return div;
}

// Filtrage des catégories
function filterCategories(searchTerm) {
  const categories = document.querySelectorAll('.category-item');
  const term = searchTerm.toLowerCase();

  categories.forEach(category => {
    const categoryName = category.dataset.category;
    const visible = categoryName.includes(term) || term === '';
    category.style.display = visible ? 'flex' : 'none';
  });
}

// Mise à jour de l'affichage des statistiques
function updateStatsUI() {
  if (!currentStats) return;

  // Mise à jour du nombre total
  document.getElementById('totalFiles').textContent = currentStats.total || 0;

  // Mise à jour de la grille des top stats
  const statsGrid = document.getElementById('statsGrid');
  if (statsGrid) {
    Array.from(statsGrid.children).forEach(child => {
      if (!child.classList.contains('total')) child.remove();
    });

    const sortedStats = Object.entries(currentStats)
      .filter(([key]) => key !== 'total')
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 3);
    
    sortedStats.forEach(([category, count]) => {
      const card = document.createElement('div');
      card.className = 'stat-card';
      card.innerHTML = `<div class="stat-number">${count}</div><div class="stat-label">${category}</div>`;
      statsGrid.appendChild(card);
    });
  }
  
  // Mise à jour de la liste complète des stats
  const statsList = document.getElementById('statsList');
  if (statsList) {
    statsList.innerHTML = '';
    const totalFiles = currentStats.total || 0;
    
    if (totalFiles === 0) {
      statsList.innerHTML = `<div class="stat-item"><span class="stat-item-name" style="color: var(--text-muted); font-style: italic;">Aucun fichier organisé pour le moment</span></div>`;
    } else {
      Object.entries(currentStats)
        .filter(([key]) => key !== 'total')
        .sort(([, countA], [, countB]) => countB - countA)
        .forEach(([category, count]) => {
          const percentage = Math.round((count / totalFiles) * 100);
          const item = document.createElement('div');
          item.className = 'stat-item';
          item.innerHTML = `<span class="stat-item-name">${category}</span><span class="stat-item-count">${count} (${percentage}%)</span>`;
          statsList.appendChild(item);
        });
    }
  }
}