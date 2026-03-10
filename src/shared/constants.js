export const defaultCategories = {
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
