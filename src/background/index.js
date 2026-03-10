import { handleDownload } from './sorter.js';
import { handleMessage } from './messageHandler.js';
import { getConfigAndStats } from './storage.js';

console.log("Service Worker AutoSortDownload démarré.");

// Listener principal de l'API des téléchargements
chrome.downloads.onDeterminingFilename.addListener((downloadItem, suggest) => {
  handleDownload(downloadItem, suggest).catch(e => {
    console.error("Erreur dans onDeterminingFilename:", e);
    suggest();
  });
  return true;
});

// Listener de messages pour la communication avec la pop-up
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  return handleMessage(request, sender, sendResponse);
});

// Initialisation de la configuration au démarrage
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installée/mise à jour.");
  getConfigAndStats().then(() => {
    console.log("Configuration de stockage initialisée.");
  });
});
