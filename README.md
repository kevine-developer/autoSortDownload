# 📂 Auto-organisateur de Téléchargements - Extension Chrome

## 🚀 Description

Cette extension Chrome permet d'organiser automatiquement les fichiers téléchargés en les classant dans des dossiers spécifiques en fonction de leur type. Grâce à l'API `chrome.downloads.onDeterminingFilename`, elle trie les fichiers selon leur extension et les enregistre dans des répertoires prédéfinis.
**Pour une prochaine version, une interface utilisateur sera intégrée afin de vous permettre de configurer ces paramètres directement depuis le navigateur.**

## ✨ Fonctionnalités

- 📂 **Classement automatique** des fichiers téléchargés dans des dossiers (Images, Vidéos, PDF, Documents, Musique, Archives, Logiciels, Applications, Code, Autres).
- 🔄 **Compatible** avec une large gamme d'extensions de fichiers.
- ⚡ **Fonctionne de manière transparente** sans intervention manuelle.

## 🛠 Installation

1. 📥 **Télécharger ou cloner** ce dépôt.
2. 🌐 Ouvrir Chrome et accéder à `chrome://extensions/`.
3. 🔧 **Activer le mode développeur** en haut à droite.
4. 📂 Cliquer sur **"Charger un paquet non compressé"**.
5. 📌 **Sélectionner le dossier** contenant l'extension.

## ⚙️ Fonctionnement

L'extension écoute les téléchargements en cours et modifie automatiquement leur destination en fonction de leur type. Voici les catégories prises en charge :

### 📷 Images
`.jpg`, `.jpeg`, `.png`, `.gif`, `.bmp`, `.svg`, `.webp`, `.ico`, `.tiff`

### 🎬 Vidéos
`.mp4`, `.avi`, `.mov`, `.mkv`, `.flv`, `.wmv`, `.webm`, `.mpg`, `.mpeg`, `.3gp`, `.ogv`, `.vob`, `.m4v`

### 📄 PDF
`.pdf`

### 📝 Documents
`.doc`, `.docx`, `.txt`, `.ppt`, `.pptx`, `.xls`, `.xlsx`, `.odt`, `.ods`, `.odp`, `.rtf`, `.tex`

### 🎵 Musique
`.mp3`, `.wav`, `.aac`, `.flac`, `.ogg`, `.wma`, `.m4a`

### 📦 Archives
`.zip`, `.rar`, `.tar`, `.gz`, `.7z`

### 🖥️ Logiciels
`.exe`, `.dmg`, `.pkg`, `.deb`, `.rpm`

### 📱 Applications
`.app`, `.apk`, `.bat`, `.sh`

### 💻 Code
`.html`, `.css`, `.js`, `.php`, `.py`, `.java`, `.cpp`, `.c`, `.h`, `.cs`, `.rb`, `.pl`, `.sql`, `.xml`, `.json`

### 🔄 Autres
`.torrent`, `.iso`, `.bin`, `.dll`

## 🔧 Personnalisation

Vous pouvez modifier la liste des catégories dans le code source pour ajouter, supprimer ou réorganiser le tri en fonction de vos besoins.

## 📜 Licence

MIT License. Libre à vous de modifier et d'améliorer l'extension !

## 👤 Auteur

Développé par **Kevine Narson YVES** [@TeloLabz](https://github.com/gastsar)
