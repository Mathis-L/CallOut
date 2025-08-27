// --- Firebase Configuration ---
const scriptProperties = PropertiesService.getScriptProperties();
const FIREBASE_CONFIG = {
  apiKey: scriptProperties.getProperty('FIREBASE_API_KEY'),
  authDomain: scriptProperties.getProperty('FIREBASE_AUTH_DOMAIN'),
  databaseURL: scriptProperties.getProperty('FIREBASE_DATABASE_URL'), 
  projectId: scriptProperties.getProperty('FIREBASE_PROJECT_ID')
};

// Main function that serves the user interface
function doGet(e) {
   // Log parameters for debugging if necessary
  // Logger.log("doGet received: " + JSON.stringify(e));

  // Get URL parameters
  let page = e.parameter.page || 'home'; // Default page: home
  let gameId = e.parameter.gameId || null;
  let userId = e.parameter.userId || null;
  let pseudo = e.parameter.pseudo || null;
  let action = e.parameter.action || null; // Parameter to determine the action on the target page
  let error = e.parameter.error || null; // To display error messages
  let message = e.parameter.message || null; // To display info messages

  let template;

  try {
    switch (page) {
      case 'home':
        template = HtmlService.createTemplateFromFile('HomePage');
        template.firebaseConfig = JSON.stringify(FIREBASE_CONFIG);
        template.error = error;
        template.message = message;
        return template.evaluate()
          .setTitle('Home - Multiplayer Game GAS')
          .setFaviconUrl("https://i.imgur.com/3dZdJFS.png") 
          .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
          .addMetaTag('viewport', 'width=device-width, initial-scale=1');

      case 'lobby':
        // Basic check for required lobby parameters
        if (!gameId || !pseudo) {
           // If essential info is missing, show the home page with an error
          Logger.log(`Paramètres manquants pour lobby: gameId=${gameId}, pseudo=${pseudo}`);
          template = HtmlService.createTemplateFromFile('HomePage');
          template.firebaseConfig = JSON.stringify(FIREBASE_CONFIG);
          template.error = "Impossible d'accéder au lobby : informations manquantes.";
          template.message = null;
          // Note: A server-side redirect isn't straightforward here, so we display the home page instead
          return template.evaluate()
                 .setTitle('Error - Multiplayer Game GAS')
                 .setFaviconUrl("https://i.imgur.com/3dZdJFS.png")
                 .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
                 .addMetaTag('viewport', 'width=device-width, initial-scale=1');
        }
        template = HtmlService.createTemplateFromFile('LobbyPage');
        template.firebaseConfig = JSON.stringify(FIREBASE_CONFIG);
        template.gameId = gameId;
        template.userId = userId; // Can be null when a player is joining
        template.pseudo = pseudo;
        template.action = action; // 'create' or 'join'
        return template.evaluate()
          .setTitle(`Lobby ${gameId} - Multiplayer Game GAS`)
          .setFaviconUrl("https://i.imgur.com/3dZdJFS.png")
          .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
          .addMetaTag('viewport', 'width=device-width, initial-scale=1');

      case 'game':
        // Basic check for required game parameters
         if (!gameId || !userId || !pseudo) {
             Logger.log(`Paramètres manquants pour game: gameId=${gameId}, userId=${userId}, pseudo=${pseudo}`);
             template = HtmlService.createTemplateFromFile('HomePage');
             template.firebaseConfig = JSON.stringify(FIREBASE_CONFIG);
             template.error = "Impossible d'accéder à la partie : informations manquantes.";
             template.message = null;
             return template.evaluate()
                    .setTitle('Error - Multiplayer Game GAS')
                    .setFaviconUrl("https://i.imgur.com/3dZdJFS.png")
                    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
                    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
         }
         template = HtmlService.createTemplateFromFile('GamePage');
         template.firebaseConfig = JSON.stringify(FIREBASE_CONFIG);
         template.gameId = gameId;
         template.userId = userId;
         template.pseudo = pseudo;
         return template.evaluate()
           .setTitle(`Call Out - Game ${gameId}`)
           .setFaviconUrl("https://i.imgur.com/3dZdJFS.png")
           .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
           .addMetaTag('viewport', 'width=device-width, initial-scale=1');

      case 'results':
        if (!gameId) {
           Logger.log(`Paramètre manquant pour results: gameId=${gameId}`);
           template = HtmlService.createTemplateFromFile('HomePage');
           template.firebaseConfig = JSON.stringify(FIREBASE_CONFIG);
           template.error = "Impossible d'afficher les résultats : code de partie manquant.";
           return template.evaluate().setTitle('Error - Call Out Game').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL).addMetaTag('viewport', 'width=device-width, initial-scale=1');
        }
        template = HtmlService.createTemplateFromFile('GameResultsPage');
        template.firebaseConfig = JSON.stringify(FIREBASE_CONFIG);
        template.gameId = gameId;
        return template.evaluate()
          .setTitle(`Results for ${gameId} - Call Out Game`)
          .setFaviconUrl("https://i.imgur.com/3dZdJFS.png")
          .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
          .addMetaTag('viewport', 'width=device-width, initial-scale=1');
          
      default:
        // Unknown page, redirect to home
        Logger.log(`Page inconnue demandée: ${page}`);
        template = HtmlService.createTemplateFromFile('HomePage');
        template.firebaseConfig = JSON.stringify(FIREBASE_CONFIG);
        template.error = "Page demandée inconnue ou paramètres invalides.";
        template.message = null;
        return template.evaluate()
          .setTitle('Home - Multiplayer Game GAS')
          .setFaviconUrl("https://i.imgur.com/3dZdJFS.png")
          .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
          .addMetaTag('viewport', 'width=device-width, initial-scale=1');
    }
  } catch (err) {
    Logger.log("Erreur critique dans doGet: " + err + "\nStack: " + err.stack);
    return HtmlService.createHtmlOutput(`<b>Erreur serveur lors du chargement de la page.</b><br>Détails : ${err}`)
             .setTitle('Erreur Serveur')
             .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
}

// Exported function so the client-side script can get the web app's base URL
function getScriptUrl() {
 try {
   const url = ScriptApp.getService().getUrl();
   // Logger.log("getScriptUrl() called, returns: " + url);
   return url;
 } catch (error) {
    Logger.log("Erreur dans getScriptUrl: " + error);
    // The client will handle the failure in its withFailureHandler
    throw new Error("Impossible de récupérer l'URL du script.");
 }
}

// Function to include partial HTML files (e.g., for common CSS or JS).
// This is a common pattern in Google Apps Script web apps.
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// Periodically cleans up old lobbies that were not closed properly.
// This function should be called using a time-based trigger
// in the Apps Script editor (⏰ icon).
function cleanUpOldLobbies() {
  const databaseUrl = FIREBASE_CONFIG.databaseURL;
  const secret = scriptProperties.getProperty('FIREBASE_DATABASE_ID'); // Authentication token

  const lobbiesPath = `${databaseUrl}/lobbies.json?auth=${secret}`;

  try {
    const response = UrlFetchApp.fetch(lobbiesPath);
    const lobbies = JSON.parse(response.getContentText());

    if (!lobbies) {
      Logger.log("Aucun lobby trouvé.");
      return;
    }

    const now = Date.now();
    const twelveHoursInMs = 12 * 60 * 60 * 1000;
    const expiredLobbyKeys = [];

    for (let lobbyId in lobbies) {
      const lobby = lobbies[lobbyId];

      if (!lobby.createdAt) {
        Logger.log(`Lobby ${lobbyId} ne contient pas 'createdAt'. Ignoré.`);
        continue;
      }

      const age = now - lobby.createdAt;

      if (age > twelveHoursInMs) {
        Logger.log(`Lobby ${lobbyId} a plus de 12h. Prévu pour suppression.`);
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