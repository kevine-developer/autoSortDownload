chrome.downloads.onDeterminingFilename.addListener((downloadItem, suggest) => {
  // Liste des extensions et dossiers correspondants
  const categories = {
    Images: [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".bmp",
      ".svg",
      ".webp",
      ".ico",
      ".tiff",
    ],
    Vidéos: [
      ".mp4",
      ".avi",
      ".mov",
      ".mkv",
      ".flv",
      ".wmv",
      ".webm",
      ".mpg",
      ".mpeg",
      ".3gp",
      ".ogv",
      ".vob",
      ".m4v",
    ],
    PDF: [".pdf"],
    Documents: [
      ".doc",
      ".docx",
      ".txt",
      ".ppt",
      ".pptx",
      ".xls",
      ".xlsx",
      ".odt",
      ".ods",
      ".odp",
      ".rtf",
      ".tex",
    ],
    Musique: [".mp3", ".wav", ".aac", ".flac", ".ogg", ".wma", ".m4a"],
    Archives: [".zip", ".rar", ".tar", ".gz", ".7z"],
    Logiciels: [".exe", ".dmg", ".pkg", ".deb", ".rpm"],
    Applications: [".app", ".apk", ".bat", ".sh"],
    Code: [
      ".html",
      ".css",
      ".js",
      ".php",
      ".py",
      ".java",
      ".cpp",
      ".c",
      ".h",
      ".cs",
      ".rb",
      ".pl",
      ".sql",
      ".xml",
      ".json",
    ],
    Autres: [
      ".torrent",
      ".iso",
      ".bin",
      ".iso",
      ".iso",
      ".iso",
      ".iso",
      ".dll",
    ],
  };

  // Récupérer l'extension du fichier
  let fileName = downloadItem.filename;
  let fileExtension = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();

  // Trouver la catégorie correspondante
  for (const [folder, extensions] of Object.entries(categories)) {
    if (extensions.includes(fileExtension)) {
      // Déplacer dans un sous-dossier correspondant
      let newPath = folder + "/" + fileName;
      suggest({ filename: newPath });
      return;
    }
  }

  // Si aucune correspondance, ne rien changer
  suggest();
});
