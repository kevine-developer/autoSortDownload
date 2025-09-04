

#  TriAuto des Téléchargements - Extension Chrome

##  Vue d'ensemble

**TriAuto des Téléchargements** est une extension Chrome conçue pour simplifier la gestion de vos téléchargements. Elle classe automatiquement vos fichiers dans des dossiers dédiés, en se basant sur leur type, pour un espace de téléchargement toujours organisé.

Avec son interface utilisateur intuitive, vous pouvez personnaliser votre expérience, visualiser les statistiques de tri et même effectuer des actions rapides.

---

##  Fonctionnalités clés

* **Tri automatique intelligent** : Les fichiers sont instantanément redirigés vers des dossiers comme **"Images"**, **"Vidéos"**, **"PDF"**, et plus encore, dès la fin du téléchargement. Cette fonction est gérée par l'API `chrome.downloads.onDeterminingFilename`.
* **Interface utilisateur complète** :
    * **Contrôle facile** : Activez ou désactivez le tri automatique en un seul clic.
    * **Personnalisation avancée** : Gérez les catégories de fichiers, activez ou désactivez le tri pour des types spécifiques, ou triez toutes les catégories en masse.
    * **Statistiques en temps réel** : Visualisez le nombre total de fichiers triés et consultez les statistiques détaillées par catégorie.
* **Actions rapides** : Accédez directement à votre dossier de téléchargements ou à la page d'options de l'extension.
* **Tri manuel** : Une fonctionnalité permet de classer manuellement les fichiers déjà présents dans votre dossier de téléchargement par défaut.

---

##  Catégories par défaut

L'extension est préconfigurée avec les catégories suivantes. Chaque liste peut être personnalisée via l'interface de l'extension.

| Catégorie | Extensions prises en charge |
| :--- | :--- |
| Images | `.jpg`, `.jpeg`, `.png`, `.gif`, `.bmp`, `.svg`, `.webp`, `.ico`, `.tiff` |
| Vidéos | `.mp4`, `.avi`, `.mov`, `.mkv`, `.flv`, `.wmv`, `.webm`, `.mpg`, `.mpeg`, `.3gp`, `.ogv`, `.vob`, `.m4v` |
| PDF | `.pdf` |
| Documents | `.doc`, `.docx`, `.txt`, `.ppt`, `.pptx`, `.xls`, `.xlsx`, `.odt`, `.ods`, `.odp`, `.rtf`, `.tex` |
| Musique | `.mp3`, `.wav`, `.aac`, `.flac`, `.ogg`, `.wma`, `.m4a` |
| Archives | `.zip`, `.rar`, `.tar`, `.gz`, `.7z` |
| Logiciels | `.exe`, `.dmg`, `.pkg`, `.deb`, `.rpm` |
| Applications | `.app`, `.apk`, `.bat`, `.sh` |
| Code | `.html`, `.css`, `.js`, `.php`, `.py`, `.java`, `.cpp`, `.c`, `.h`, `.cs`, `.rb`, `.pl`, `.sql`, `.xml`, `.json` |
| Autres | `.torrent`, `.iso`, `.bin`, `.dll` |

---

##  Installation

1.  **Téléchargez** ou **clonez** le dépôt GitHub.
2.  Ouvrez Chrome et accédez à l'adresse `chrome://extensions/`.
3.  **Activez le "Mode développeur"** en haut à droite.
4.  Cliquez sur le bouton **"Charger l'extension non empaquetée"**.
5.  **Sélectionnez le dossier** de l'extension que vous venez de télécharger.
6.  L'extension est maintenant installée et active ! 

---

##  Confidentialité

Votre vie privée est respectée. Toutes les données, y compris les statistiques de téléchargement et les configurations, sont stockées **localement** sur votre machine. Aucune donnée n'est envoyée à des serveurs externes.

---

##  Licence

Ce projet est sous **licence MIT**. Vous êtes libre de l'utiliser, de le modifier et de le distribuer.

---

##  Auteur

Développé par **Kevine Narson YVES** [GitHub - @DevEnGalère](https://github.com/kevine-developer)