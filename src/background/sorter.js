import { getConfigAndStats, updateStats } from './storage.js';

export async function handleDownload(downloadItem, suggest) {
  const { config } = await getConfigAndStats();
  
  if (!config.enabled) {
    suggest();
    return;
  }
  
  const fileName = downloadItem.filename;
  const lastDotIndex = fileName.lastIndexOf(".");
  const fileExtension = lastDotIndex !== -1 ? fileName.slice(lastDotIndex).toLowerCase() : "";

  for (const [folder, category] of Object.entries(config.categories)) {
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
      await updateStats(folder);
      
      const iconPath = chrome.runtime.getURL("src/assets/icon.png");

      chrome.notifications.create({
        type: "basic",
        iconUrl: iconPath,
        title: "TriAuto",
        message: `Le fichier "${fileName}" a été déplacé vers le dossier "${folder}".`,
        priority: 0
      });

      return;
    }
  }

  suggest();
}

export async function runManualSort() {
  const { config } = await getConfigAndStats();

  if (!config.enabled) return;

  chrome.downloads.search({ state: "complete" }, async (downloads) => {
    for (const item of downloads) {
      const fileNameNormalized = item.filename.replace(/\\/g, '/');
      const parts = fileNameNormalized.split('/');
      const baseFilename = parts[parts.length - 1];
      const isAlreadySorted = false; // On ne peut pas savoir de façon certaine, mais on procède

      if (parts.length > 0) {
        const lastDotIndex = baseFilename.lastIndexOf(".");
        const fileExtension = lastDotIndex !== -1 ? baseFilename.slice(lastDotIndex).toLowerCase() : "";
        
        for (const [folder, category] of Object.entries(config.categories)) {
          if (category.enabled && category.extensions && category.extensions.includes(fileExtension)) {
            // Il faudrait faire attention pour ne pas re-trier les fichiers déjà dans ces dossiers
            const isInsideCategoryFolder = parts[parts.length - 2] === folder;
            if (!isInsideCategoryFolder) {
               chrome.downloads.download({
                  url: `file:///${item.filename}`,
                  filename: `${folder}/${baseFilename}`
               });
               await updateStats(folder);
               break;
            }
          }
        }
      }
    }
  });
}
