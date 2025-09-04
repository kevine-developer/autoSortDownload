let isSortingEnabled = true;
let userCategories = {};
let downloadStats = {};

// Catégories par défaut
const defaultCategories = {
  Images: { extensions: [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg", ".webp", ".ico", ".tiff"], enabled: true },
  Vidéos: { extensions: [".mp4", ".avi", ".mov", ".mkv", ".flv", ".wmv", ".webm", ".mpg", ".mpeg", ".3gp", ".ogv", ".vob", ".m4v"], enabled: true },
  PDF: { extensions: [".pdf"], enabled: true },
  Documents: { extensions: [".doc", ".docx", ".txt", ".ppt", ".pptx", ".xls", ".xlsx", ".odt", ".ods", ".odp", ".rtf", ".tex"], enabled: true },
  Musique: { extensions: [".mp3", ".wav", ".aac", ".flac", ".ogg", ".wma", ".m4a"], enabled: true },
  Archives: { extensions: [".zip", ".rar", ".tar", ".gz", ".7z"], enabled: true },
  Logiciels: { extensions: [".exe", ".dmg", ".pkg", ".deb", ".rpm"], enabled: true },
  Applications: { extensions: [".app", ".apk", ".bat", ".sh"], enabled: true },
  Code: { extensions: [".html", ".css", ".js", ".php", ".py", ".java", ".cpp", ".c", ".h", ".cs", ".rb", ".pl", ".sql", ".xml", ".json"], enabled: true },
  Autres: { extensions: [".torrent", ".iso", ".bin", ".dll"], enabled: true }
};

// Fonction pour charger la configuration et les statistiques depuis le stockage local
async function loadConfig() {
  const { config, stats } = await chrome.storage.local.get(['config', 'stats']);
  
  if (config) {
    isSortingEnabled = config.enabled;
    userCategories = config.categories;
  } else {
    // Initialisation si aucune configuration n'est trouvée
    isSortingEnabled = true;
    userCategories = defaultCategories;
    await saveConfig();
  }
  
  downloadStats = stats || { total: 0 };
}

// Fonction pour sauvegarder la configuration et les statistiques
async function saveConfig() {
  const config = {
    enabled: isSortingEnabled,
    categories: userCategories
  };
  await chrome.storage.local.set({ config: config, stats: downloadStats });
}

// Mise à jour des statistiques
function updateStats(categoryName) {
  if (!downloadStats[categoryName]) {
    downloadStats[categoryName] = 0;
  }
  downloadStats[categoryName]++;
  downloadStats.total++;
  saveConfig();
}

// Listener principal de l'API des téléchargements
chrome.downloads.onDeterminingFilename.addListener((downloadItem, suggest) => {
  if (!isSortingEnabled) {
    suggest(); // L'extension est désactivée, ne rien faire.
    return;
  }
  
  const fileName = downloadItem.filename;
  const lastDotIndex = fileName.lastIndexOf(".");
  const fileExtension = lastDotIndex !== -1 ? fileName.slice(lastDotIndex).toLowerCase() : "";

  for (const [folder, category] of Object.entries(userCategories)) {
    if (category.enabled && category.extensions && category.extensions.includes(fileExtension)) {
      let newPath = folder + "/" + fileName;

      // Gestion des doublons pour éviter l'écrasement des fichiers
      let newName = fileName;
      let i = 1;
      const originalPath = folder + "/" + fileName;
      while (downloadItem.byExtension && downloadItem.byExtension.includes(originalPath) && newPath !== originalPath) {
        const parts = fileName.split('.');
        const namePart = parts.slice(0, -1).join('.');
        const extPart = parts[parts.length - 1];
        newName = `${namePart}(${i}).${extPart}`;
        newPath = folder + "/" + newName;
        i++;
      }
      
      suggest({ filename: newPath });
      updateStats(folder);
      
      // Envoi d'une notification pour informer l'utilisateur du tri
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icons/icon-48.png",
        title: "TriAuto",
        message: `Le fichier "${fileName}" a été déplacé vers le dossier "${folder}".`,
        priority: 0
      });

      return;
    }
  }

  suggest();
});

// Listener de messages pour la communication avec la pop-up et la page d'options
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'getConfig':
      sendResponse({ enabled: isSortingEnabled, categories: userCategories });
      break;
    case 'saveConfig':
      isSortingEnabled = request.config.enabled;
      userCategories = request.config.categories;
      saveConfig();
      sendResponse({ status: 'success' });
      break;
    case 'getStats':
      sendResponse(downloadStats);
      break;
    case 'resetStats':
      downloadStats = { total: 0 };
      saveConfig();
      sendResponse({ status: 'success' });
      break;
    case 'resetConfig':
      userCategories = defaultCategories;
      isSortingEnabled = true;
      saveConfig();
      sendResponse({ status: 'success' });
      break;
    case 'runManualSort':
      // Récupérer les fichiers dans le dossier de téléchargement par défaut
      chrome.downloads.search({ state: "complete" }, (downloads) => {
        downloads.forEach((item) => {
          // Exclure les fichiers qui ont déjà été triés par cette extension
          if (!item.filename.includes('/')) {
            // Logique de tri manuelle, basée sur la même logique que le listener
            const lastDotIndex = item.filename.lastIndexOf(".");
            const fileExtension = lastDotIndex !== -1 ? item.filename.slice(lastDotIndex).toLowerCase() : "";
            
            for (const [folder, category] of Object.entries(userCategories)) {
              if (category.enabled && category.extensions && category.extensions.includes(fileExtension)) {
                // Déplacer le fichier
                chrome.downloads.download({
                  url: `file:///${item.filename}`, // Nécessite l'API `downloads` et la permission `host_permissions`
                  filename: `${folder}/${item.filename}`
                });
                updateStats(folder);
                break;
              }
            }
          }
        });
      });
      sendResponse({ status: 'success' });
      break;
  }
  // Le retour est nécessaire pour une réponse asynchrone
  return true;
});

// Initialisation de la configuration au démarrage du service worker
loadConfig();