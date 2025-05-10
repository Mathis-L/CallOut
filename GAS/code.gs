// --- Configuration Firebase ---
// REMPLACEZ PAR VOS PROPRES VALEURS !
const scriptProperties = PropertiesService.getScriptProperties();
const FIREBASE_CONFIG = {
  apiKey: scriptProperties.getProperty('FIREBASE_API_KEY'),
  authDomain: scriptProperties.getProperty('FIREBASE_AUTH_DOMAIN'),
  databaseURL: scriptProperties.getProperty('FIREBASE_DATABASE_URL'), // Important pour Realtime Database
  projectId: scriptProperties.getProperty('FIREBASE_PROJECT_ID'),
  databaseId : scriptProperties.getProperty('FIREBASE_DATABASE_ID') // Pour périodiquement effacer la base de donnée
  // storageBucket: "YOUR_STORAGE_BUCKET",
  // messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  // appId: "YOUR_APP_ID"
};

// Fonction principale qui sert l'interface utilisateur
function doGet(e) {
  // Logger les paramètres pour le débogage si nécessaire
  // Logger.log("doGet reçu : " + JSON.stringify(e));

  // Récupérer les paramètres de l'URL
  let page = e.parameter.page || 'home'; // Page par défaut: accueil
  let gameId = e.parameter.gameId || null;
  let userId = e.parameter.userId || null;
  let pseudo = e.parameter.pseudo || null;
  let action = e.parameter.action || null; // Nouveau paramètre pour savoir quoi faire sur la page cible
  let error = e.parameter.error || null; // Pour afficher des messages d'erreur
  let message = e.parameter.message || null; // Pour afficher des messages d'info

  let template;

  try {
    switch (page) {
      case 'home':
        template = HtmlService.createTemplateFromFile('HomePage');
        template.firebaseConfig = JSON.stringify(FIREBASE_CONFIG);
        template.error = error;
        template.message = message;
        return template.evaluate()
          .setTitle('Accueil - Jeu Multijoueur')
          .setFaviconUrl("https://i.imgur.com/3dZdJFS.png")
          .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
          .addMetaTag('viewport', 'width=device-width, initial-scale=1');

      case 'lobby':
        // Vérification basique des paramètres nécessaires pour le lobby
        if (!gameId || !pseudo) {
          // Rediriger vers l'accueil avec une erreur si les infos de base manquent
          Logger.log(`Paramètres manquants pour lobby: gameId=${gameId}, pseudo=${pseudo}`);
          template = HtmlService.createTemplateFromFile('HomePage');
          template.firebaseConfig = JSON.stringify(FIREBASE_CONFIG);
          template.error = "Impossible d'accéder au lobby : informations manquantes.";
          template.message = null;
          // Note : On ne peut pas faire de redirection serveur ici facilement, on affiche l'accueil
          return template.evaluate()
                 .setTitle('Erreur - Jeu Multijoueur')
                 .setFaviconUrl("https://i.imgur.com/3dZdJFS.png")
                 .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
                 .addMetaTag('viewport', 'width=device-width, initial-scale=1');
        }
        template = HtmlService.createTemplateFromFile('LobbyPage');
        template.firebaseConfig = JSON.stringify(FIREBASE_CONFIG);
        template.gameId = gameId;
        template.userId = userId; // Peut être null si on rejoint
        template.pseudo = pseudo;
        template.action = action; // 'create' ou 'join'
        return template.evaluate()
          .setTitle(`Lobby ${gameId} - Jeu Multijoueur`)
          .setFaviconUrl("https://i.imgur.com/3dZdJFS.png")
          .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
          .addMetaTag('viewport', 'width=device-width, initial-scale=1');

      case 'game':
        // Vérification basique des paramètres nécessaires pour le jeu
         if (!gameId || !userId || !pseudo) {
             Logger.log(`Paramètres manquants pour game: gameId=${gameId}, userId=${userId}, pseudo=${pseudo}`);
             template = HtmlService.createTemplateFromFile('HomePage');
             template.firebaseConfig = JSON.stringify(FIREBASE_CONFIG);
             template.error = "Impossible d'accéder à la partie : informations manquantes.";
             template.message = null;
             return template.evaluate()
                    .setTitle('Erreur - Jeu Multijoueur')
                    .setFaviconUrl("https://i.imgur.com/3dZdJFS.png")
                    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
                    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
         }
         template = HtmlService.createTemplateFromFile('GamePage'); // Charger la nouvelle page
         template.firebaseConfig = JSON.stringify(FIREBASE_CONFIG);
         template.gameId = gameId;
         template.userId = userId;
         template.pseudo = pseudo;
         return template.evaluate()
           .setTitle(`Partie ${gameId} - Jeu Multijoueur`)
           .setFaviconUrl("https://i.imgur.com/3dZdJFS.png")
           .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
           .addMetaTag('viewport', 'width=device-width, initial-scale=1');

      default:
        // Page inconnue, rediriger vers l'accueil
        Logger.log(`Page inconnue demandée: ${page}`);
        template = HtmlService.createTemplateFromFile('HomePage');
        template.firebaseConfig = JSON.stringify(FIREBASE_CONFIG);
        template.error = "Page demandée inconnue ou paramètres invalides.";
        template.message = null;
        return template.evaluate()
          .setTitle('Accueil - Jeu Multijoueur')
          .setFaviconUrl("https://i.imgur.com/3dZdJFS.png")
          .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
          .addMetaTag('viewport', 'width=device-width, initial-scale=1');
    }
  } catch (err) {
    Logger.log("Erreur critique dans doGet: " + err + "\nStack: " + err.stack);
    // Page d'erreur générique en cas de problème serveur
    return HtmlService.createHtmlOutput(`<b>Erreur serveur lors du chargement de la page.</b><br>Détails : ${err}`)
             .setTitle('Erreur Serveur')
             .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
}

// Fonction exportée pour que le client puisse obtenir l'URL de base
function getScriptUrl() {
 try {
   const url = ScriptApp.getService().getUrl();
   // Logger.log("getScriptUrl() appelée, retourne: " + url);
   return url;
 } catch (error) {
    Logger.log("Erreur dans getScriptUrl: " + error);
    // Il n'est pas possible de retourner une erreur directement au client ici
    // Le client gérera l'échec dans withFailureHandler
    throw new Error("Impossible de récupérer l'URL du script.");
 }
}

// Fonction pour inclure des fichiers HTML partiels (si nécessaire, ex: CSS commun)
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// --- Fonctions serveur potentielles ---
function cleanUpLobbies() {
  const databaseUrl = FIREBASE_CONFIG.databaseURL;
  const secret = FIREBASE_CONFIG.databaseId; // Nécessaire si on utilise REST Auth via Admin SDK

  const lobbiesPath = `${databaseUrl}/lobbies.json?auth=${secret}`;

  try {
    const response = UrlFetchApp.fetch(lobbiesPath);
    const lobbies = JSON.parse(response.getContentText());

    if (!lobbies) {
      Logger.log("Aucun lobby trouvé.");
      return;
    }

    const now = Date.now();
    const expiredLobbyKeys = [];

    for (let lobbyId in lobbies) {
      const lobby = lobbies[lobbyId];
      const players = lobby.players || {};
      const allDisconnected = Object.values(players).every(p => !p.isConnected);

      if (allDisconnected) {
        Logger.log(`Tous les joueurs du lobby ${lobbyId} sont déconnectés. Prévu pour suppression.`);
        expiredLobbyKeys.push(lobbyId);
      }
    }

    expiredLobbyKeys.forEach(lobbyId => {
      const deleteUrl = `${databaseUrl}/lobbies/${lobbyId}.json?auth=${secret}`;
      UrlFetchApp.fetch(deleteUrl, { method: 'delete' });
      Logger.log(`Lobby supprimé : ${lobbyId}`);
    });

    Logger.log(`${expiredLobbyKeys.length} lobby(s) supprimé(s).`);

  } catch (error) {
    Logger.log("Erreur lors du nettoyage des lobbies : " + error);
  }
}