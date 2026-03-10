import { loadConfigAPI, loadStatsAPI } from './api.js';
import { 
  setConfig, 
  setStats, 
  updateHeaderUI, 
  updateMainContentUI, 
  initializeEventListeners 
} from './ui.js';

window.onerror = function(msg, url, line, col, error) {
  console.error("Global Error:", msg, "at", url, ":", line, ":", col);
};

window.onunhandledrejection = function(event) {
  console.error("Unhandled Promise Rejection:", event.reason);
};

async function init() {
  console.log("Initialisation du popup...");
  
  initializeEventListeners(); // Init listeners early

  try {
    const config = await loadConfigAPI();
    const stats = await loadStatsAPI();
    
    if (config) setConfig(config);
    if (stats) setStats(stats);
    
    updateHeaderUI();
    updateMainContentUI();
    console.log("Popup initialisé avec succès.");
  } catch (e) {
    console.error("Erreur d'initialisation du popup:", e);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

chrome.runtime.onMessage?.addListener((message, sender, sendResponse) => {
  if (message.action === 'configChanged') {
    loadConfigAPI().then(cfg => {
      if (cfg) {
        setConfig(cfg);
        updateHeaderUI();
        updateMainContentUI();
      }
    });
  } else if (message.action === 'statsChanged') {
    loadStatsAPI().then(sts => {
      if (sts) {
        setStats(sts);
        updateMainContentUI();
      }
    });
  }
  sendResponse({ received: true });
});