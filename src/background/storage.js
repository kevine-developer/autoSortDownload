import { defaultCategories } from '../shared/constants.js';

export async function getConfigAndStats() {
  const { config, stats } = await chrome.storage.local.get(['config', 'stats']);
  
  if (!config) {
    const initialConfig = {
      enabled: true,
      categories: defaultCategories
    };
    const initialStats = { total: 0 };
    await chrome.storage.local.set({ config: initialConfig, stats: initialStats });
    return { config: initialConfig, stats: initialStats };
  }
  
  return { config, stats: stats || { total: 0 } };
}

export async function saveConfigAndStats(config, stats) {
  await chrome.storage.local.set({ config, stats });
}

export async function updateStats(categoryName) {
  const { config, stats } = await getConfigAndStats();
  
  if (!stats[categoryName]) {
    stats[categoryName] = 0;
  }
  stats[categoryName]++;
  stats.total++;
  
  await saveConfigAndStats(config, stats);
  
  // Envoi d'un message pour informer que les statistiques ont été mises à jour
  chrome.runtime.sendMessage({ action: 'statsChanged' }).catch(() => {
    // Expected behavior that it might fail if the popup is closed
  });
}
