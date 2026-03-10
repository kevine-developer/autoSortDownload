import { getConfigAndStats, saveConfigAndStats } from './storage.js';
import { defaultCategories } from '../shared/constants.js';
import { runManualSort } from './sorter.js';

export function handleMessage(request, sender, sendResponse) {
  console.log("Message reçu dans le background:", request.action);
  
  (async () => {
    try {
      const { config, stats } = await getConfigAndStats();
      
      switch (request.action) {
        case 'getConfig':
          sendResponse(config);
          break;
        case 'saveConfig':
          await saveConfigAndStats(request.config, stats);
          sendResponse({ status: 'success' });
          break;
        case 'getStats':
          sendResponse(stats);
          break;
        case 'resetStats':
          await saveConfigAndStats(config, { total: 0 });
          sendResponse({ status: 'success' });
          break;
        case 'resetConfig':
          const resetConfig = { enabled: true, categories: defaultCategories };
          await saveConfigAndStats(resetConfig, stats);
          sendResponse({ status: 'success' });
          break;
        case 'runManualSort':
          await runManualSort();
          sendResponse({ status: 'success' });
          break;
        default:
          console.warn("Action inconnue reçue:", request.action);
          sendResponse({ error: 'Action unknown' });
      }
    } catch (e) {
      console.error("Erreur dans handleMessage:", e);
      sendResponse({ error: e.message });
    }
  })();
  
  return true; // Indispensable pour l'async
}
