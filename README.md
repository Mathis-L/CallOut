# Call Out 🫵 - Jeu Multijoueur en Temps Réel

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<p align="center">
  <img src="screenshots/LogoCallOut.png" alt="Logo" width="150"/>
</p>

**Call Out 🫵** est une application web multijoueur gratuite conçue pour animer vos soirées entre amis avec des votes interactifs du type "Qui de nous est le plus susceptible de...". Développée avec **Google Apps Script** et **Firebase Realtime Database**, elle fonctionne en temps réel sans serveur backend dédié.

🚀 Pourquoi ce projet est spécial :
*   Il démontre qu'on peut créer une **web app complexe et gratuite** avec des outils accessibles.
*   Le système de **lobby multijoueur** permet d'accueillir plusieurs joueurs et peut facilement servir de base à d'autres jeux en ligne.
*   Une **expérience fluide en temps réel** grâce à Firebase : synchronisation des votes, avatars personnalisables, animation de lancer de pièce, etc.

📚 Ce projet m’a permis d’apprendre à développer un jeu en temps réel sur le web, à gérer des connexions multiples et à concevoir une interface interactive sans utiliser de backend lourd.

🧪 L’app est testable en ligne via [Démo Call Out](https://script.google.com/macros/s/AKfycbzozmc1IhN_cuT7p9ccirAdfpFzP7ho6fqVRQ8WU9yNMrdYGtIWYwvt83eTTrYhM38S/exec), et peut être facilement hébergée par n’importe qui en suivant les instructions de ce README.

<p align="center">
  <img src="screenshots/Splash screen.png" alt="Spalsh Screen"/>
</p>

## ✨ Fonctionnalités Principales

*   **Jeu Multijoueur en Temps Réel:** Synchronisation de l'état du jeu entre tous les participants via Firebase.
*   **Système de Lobby:** Création et jonction de parties via des codes uniques.
*   **Mécanisme de Vote Interactif:** Les joueurs votent pour répondre à des questions concernant les autres participants.
*   **Sets de Questions Thématiques:** Le leader de la partie peut choisir parmi différents ensembles de questions (Gentil, Mix, Extrême).
*   **Lancer de Pièce Animé:** Introduit un élément de hasard pour la révélation des votes.
*   **Avatars Personnalisables:** Les joueurs peuvent choisir un avatar pour les représenter.
*   **Gestion de la Présence des Joueurs:** Détection des connexions et déconnexions.
*   **Déploiement Entièrement Gratuit:** Hébergé sur la plateforme Google Apps Script.
*   **Extensibilité:** Facilité d'ajout de nouvelles questions et d'avatars.

## 🛠️ Architecture Technique

*   **Backend:** Google Apps Script (GAS)
*   **Base de Données:** Firebase Realtime Database
*   **Frontend:** HTML, CSS, JavaScript (Vanilla)
*   **Configuration:** Google Apps Script PropertiesService

## 📂 Structure du Dépôt

Ce dépôt est organisé comme suit :

*   **/GAS**: Contient tous les fichiers de code destinés à être déployés sur Google Apps Script.
    *   `Code.gs`: Script principal du backend.
    *   `HomePage.html`, `LobbyPage.html`, `GamePage.html`: Pages HTML pour l'interface utilisateur.
    *   `GamePage.css.html`: Styles CSS pour la page de jeu.
    *   `GamePage.js.html`: Scripts JavaScript côté client pour la page du jeu.
    *   `Questions.html`: Fichier HTML contenant la liste des questions du jeu.
    *   `AvatarData.html`: Fichier HTML contenant la liste des avatars (généré ou configuré manuellement).
*   **/Scripts**: Comprend le script Python utilitaire pour la génération d'avatars.
    *   `generate_avatars.py`: Script pour convertir des images PNG en format Base64 et générer le fichier `AvatarData.html`.
    *   `requirements.txt`: Liste des dépendances Python pour le script `generate_avatars.py`.
*   **/Avatars**: Dossier destiné à contenir les images PNG sources pour la génération d'avatars via le script Python. (Ce dossier peut être initialement vide ou contenir des exemples).

## 🚀 Guide de Déploiement

Pour déployer votre propre instance de Call Out 🫵, suivez ces étapes :

**1. Prérequis:**

*   Un compte Google.
*   Un projet Firebase actif ([firebase.google.com](https://firebase.google.com/)).
*   Python 3.x installé localement (si vous souhaitez utiliser le script de génération d'avatars).
*   Git (pour cloner ce dépôt). (si vous souhaitez utiliser le script de génération d'avatars).

**2. Configuration de Firebase:**

*   Créez un nouveau projet Firebase ou utilisez un projet existant.
*   Activez et configurez **Realtime Database**.
    *   Lors de la création, choisissez une région appropriée.
    *   **Règles de Sécurité (Important):** Pour le développement initial, vous pouvez utiliser des règles ouvertes. **Ces règles ne sont PAS SÉCURISÉES pour un environnement de production.**
        ```json
        {
          "rules": {
            ".read": true,
            ".write": true
          }
        }
        ```
        *Il est fortement recommandé d'implémenter l'authentification Firebase et des règles de sécurité granulaires pour la production.*
*   Dans les **Paramètres du projet** > **Général**, enregistrez une nouvelle **application Web**.
    *   Ne cochez PAS "Configurer également Firebase Hosting...".
*   Copiez l'objet de configuration `firebaseConfig` fourni. Vous aurez besoin des valeurs `apiKey`, `authDomain`, `databaseURL`, et `projectId`.

**3. Configuration de Google Apps Script:**

*   Créez un nouveau projet sur [script.google.com](https://script.google.com/).
*   Copiez le contenu des fichiers du dossier `/GAS` de ce dépôt dans les fichiers correspondants de votre projet Apps Script. (Créez les fichiers HTML s'ils n'existent pas via `Fichier > Nouveau > Fichier HTML`).
*   Configurez les **Propriétés du script** (Paramètres du projet ⚙️ > Propriétés du script (en bas de page)) avec vos clés Firebase :
    *   `FIREBASE_API_KEY`
    *   `FIREBASE_AUTH_DOMAIN`
    *   `FIREBASE_DATABASE_URL`
    *   `FIREBASE_PROJECT_ID`
*   Enregistrez les propriétés.

**4. Déploiement de l'Application Web:**

*   Dans l'éditeur Apps Script, cliquez sur **Déployer** > **Nouveau déploiement**.
*   Type de déploiement : **Application Web**.
*   Configurez :
    *   **Exécuter en tant que:** `Moi`.
    *   **Qui a accès:** `Tout le monde`. (pour que vos amis puissent se connecter)
*   Cliquez sur **Déployer**.
*   Autorisez les permissions requises par le script.
*   Copiez l'**URL de l'application Web** fournie. C'est l'URL d'accès à votre jeu. (Partagez le avec vos amis !)

**(Optionnel) Configuration du Déclencheur pour Nettoyage Automatique:**  
La gestion des suppressions de lobby dans la base de donnée est pas fiable donc pour palier à ce problème et nettoyer la base de donnée j'utilise l'API REST de Firebase Realtime Database, cependant cette méthode est **déconseillé et opsolète** :
*   Générer une `FIREBASE_DATABASE_ID` :
    *   Dans votre projet firebase cliquer sur Paramètres du projet ⚙️ sur la gauche > Comptes de service > Secrets de la base de données > afficher le Secret.
*   Configurez GAS :
    *    **Propriétés du script** (Paramètres du projet ⚙️ > Propriétés du script (en bas de page)) avec `FIREBASE_DATABASE_ID`
    *   Pour exécuter la fonction `cleanUpLobbies` périodiquement (ex: tout les lundis matin) :
        *   Dans l'éditeur Apps Script, allez à la section **Déclencheurs** (icône ⏰).
        *   Cliquez sur **Ajouter un déclencheur**.
        *   Configurez pour exécuter `cleanUpLobbies` sur un événement `Temporel` (ex: `Minuteur horaire`).

## 🔧 Personnalisation

**1. Ajouter ou Modifier des Questions:**

*   Modifiez le fichier `Questions.html` (situé dans `/GAS` pour le déploiement) en ajoutant ou modifiant les chaînes de caractères dans les tableaux `gentleQuestions`, `mixQuestions`, ou `extremeQuestions`.
*   Après toute modification, **redéployez** votre application Web Apps Script (Déployer > Gérer les déploiements > choisissez votre déploiement > Modifier ✏️ > Nouvelle version & Description (optionnel)> Déployer).

**2. Ajouter ou Modifier des Avatars:**

*   **Méthode 1: Utilisation d'URLs Publiques (Recommandé pour la simplicité)**
    *   Ouvrez le fichier `AvatarData.html` (dans `/GAS`).
    *   Modifiez ou ajoutez des objets au tableau JavaScript `AVATAR_LIST`. Chaque objet doit avoir la structure suivante : `{ name: "Nom de l'avatar", src: "URL_PUBLIQUE_DE_L_IMAGE.png" }`.
    *   Assurez-vous que les URLs pointent directement vers des fichiers image (.png, .jpg, .gif, .svg) accessibles publiquement.
    *   **Redéployez** votre application Apps Script après modification.

*   **Méthode 2: Génération d'Avatars Personnalisés avec IA et Python (Local)**
    1.  **Préparation (localement):**
        *   Clonez ce dépôt GitHub sur votre machine.
        *   Naviguez vers le dossier `/Scripts`.
        *   Installez les dépendances Python : `pip install -r requirements.txt` (cela installera `Pillow`).
    2.  **Création d'Avatars avec IA :**
        *   Obtenez une image de la personne pour laquelle vous souhaitez créer un avatar.
        *   Utilisez ChatGPT pour générer une image, en donnant l'image de la personne et en écrivant un prompt tel que :
            `"Generate a high-quality chibi-style sticker of this person with a transparent background."` (note: chibi-style créer des stickers mignon, libre à vous de choisir un autre style, graffiti art, comic, caricature in pixar style ...)
        *   Téléchargez l'image générée (assurez-vous qu'elle soit au format `.png` et avec un fond transparent si possible).
    3.  **Organisation des Fichiers:**
        *   Placez toutes les images PNG que vous souhaitez utiliser comme avatars dans le dossier `/Avatars` de votre copie locale du dépôt.
    4.  **Exécution du Script Python:**
        *   Depuis le dossier racine de votre copie locale du dépôt, exécutez le script `generate_avatars.py` en spécifiant le dossier `/Avatars` :
            ```bash
            python Scripts/generate_avatars.py
            ```
        *   Le script traitera chaque image PNG dans le dossier `/Avatars`, la redimensionnera en 128x128, la convertira en une chaîne Base64, et générera un fichier nommé `avatars_output.txt` à la racine du dossier `/Avatars`. Ce fichier contiendra la structure JavaScript `AVATAR_LIST` prête à l'emploi.
    5.  **Intégration dans GAS:**
        *   Ouvrez le fichier `Avatars/avatars_output.txt` généré.
        *   Copiez **l'intégralité de son contenu** (CTRL+A > CTRL+C).
        *   Dans votre projet Google Apps Script, ouvrez le fichier `AvatarData.html`.
        *   **Remplacez** le contenu existant du fichier `AvatarData.html` (CTRL+A > CTRL+V) par le contenu que vous venez de copier.
    6.  **Redéploiement:**
        *   **Redéployez** votre application Web Apps Script pour que les nouveaux avatars soient pris en compte.

## 🎮 Comment Jouer

1.  Accédez à l'URL de l'application Web que vous avez déployée.
2.  Entrez un pseudo et sélectionnez un avatar.
3.  **Pour créer une partie:** Cliquez sur "Créer une Partie" et partagez le code de partie généré.
4.  **Pour rejoindre une partie:** Entrez votre pseudo, choisissez un avatar, saisissez le code de partie fourni, et cliquez sur "Rejoindre une Partie".
5.  Dans le **lobby**, attendez les autres joueurs. Le leader de la partie (créateur) peut sélectionner le set de questions et démarrer le jeu.
6.  Pendant la phase de **vote**, sélectionnez l'avatar du joueur qui, selon vous, correspond le mieux à la question affichée.
7.  Consultez les **résultats** pour voir qui a reçu le plus de votes.
8.  Le **lancer de pièce** déterminera si les noms des votants pour un joueur spécifique sont révélés.
9.  Cliquez sur "Prêt pour la prochaine manche" pour continuer. Le jeu progresse lorsque tous les joueurs connectés sont prêts.
10. Utilisez le bouton "Quitter" pour vous déconnecter de la partie ou du lobby.

## 📄 Licence

Ce projet est distribué sous la licence MIT. Pour plus de détails, veuillez consulter le fichier `LICENSE` dans ce dépôt.