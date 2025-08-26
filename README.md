# Call Out 🫵 - Real-Time Multiplayer Game

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<p align="center">
  <img src="screenshots/LogoCallOut.png" alt="Logo" width="150"/>
</p>

**Call Out 🫵** is a free multiplayer web application designed to liven up your evenings with friends through interactive "Who among us is most likely to..." type votes. Developed with **Google Apps Script** and **Firebase Realtime Database**, it operates in real-time without a dedicated backend server.

🚀 Why this project is special:
*   It demonstrates that a **complex and free web app** can be created with accessible tools.
*   The **multiplayer lobby system** can host multiple players and can easily serve as a foundation for other online games.
*   A **smooth real-time experience** thanks to Firebase: vote synchronization, customizable avatars, coin toss animation, etc.

📚 This project allowed me to learn how to develop a real-time web game, manage multiple connections, and design an interactive interface without using a heavy backend.

🧪 The app is testable online via [Call Out Demo](https://script.google.com/macros/s/AKfycbzozmc1IhN_cuT7p9ccirAdfpFzP7ho6fqVRQ8WU9yNMrdYGtIWYwvt83eTTrYhM38S/exec), and can be easily hosted by anyone by following the instructions in this README.

<p align="center">
  <img src="screenshots/Splash screen.png" alt="Splash Screen"/>
</p>

## ✨ Main Features

*   **Real-Time Multiplayer Game:** Game state synchronization among all participants via Firebase, secured with authentication rules.
*   **Lobby System:** Create and join games via unique codes.
*   **Interactive Voting Mechanism:** Players vote to answer questions concerning other participants.
*   **Thematic Question Sets:** The game leader can choose from different sets of questions (Chill, Spicy Mix, Extra Hot).
*   **🔥 NEW - Confession Mode:** A surprise round that puts one player in the hot seat! The most-targeted player from the previous round gets their revenge by choosing who must answer a juicy, personal question. Other players then vote on whether they believe the answer, granting temporary immunity to the convincing confessor.
*   **📊 NEW - Detailed Results Page:** At the end of the game, a dedicated page displays a complete breakdown of stats, player awards, and data visualizations like heatmaps and score evolution charts.
*   **Animated Coin Toss:** Introduces an element of chance for revealing votes.
*   **Customizable Avatars:** Players can choose an avatar to represent themselves.
*   **Player Presence Management:** Detection of connections and disconnections.
*   **Entirely Free Deployment:** Hosted on the Google Apps Script platform.
*   **Extensibility:** Easy to add new questions and avatars.

## 🛠️ Technical Architecture

*   **Backend:** Google Apps Script (GAS)
*   **Database:** Firebase Realtime Database
*   **Frontend:** HTML, CSS, JavaScript (Vanilla)
*   **Configuration:** Google Apps Script PropertiesService

## 📂 Repository Structure

This repository is organized as follows:

*   **/GAS**: Contains all code files intended for deployment on Google Apps Script.
    *   `Code.gs`: Main backend script.
    *   `HomePage.html`, `LobbyPage.html`, `GamePage.html`, `GameResultsPage.html`: HTML pages for the user interface.
    *   `GamePage.css.html`, `GameResultsPage.css.html`: CSS styles for the game and results pages.
    *   `GamePage.js.html`, `GameResultsPage.js.html`: Client-side JavaScript scripts for the game and results pages.
    *   `Questions.html`: HTML file containing the list of game questions.
    *   `AvatarData.html`: HTML file containing the list of avatars (generated or manually configured).
*   **/Firebase rules**: Contains the JSON file for the Firebase Realtime Database security rules.
*   **/Scripts**: Includes the utility Python script for avatar generation.
    *   `generate_avatars.py`: Script to convert PNG images to Base64 format and generate the `AvatarData.html` file.
    *   `requirements.txt`: List of Python dependencies for the `generate_avatars.py` script.
*   **/Avatars**: Folder intended to contain source PNG images for avatar generation via the Python script. (This folder may initially be empty or contain examples).
*   **/screenshots**: Folder containing images for this README.

## 🚀 Deployment Guide

To deploy your own instance of Call Out 🫵, follow these steps:

**1. Prerequisites:**

*   A Google account.
*   An active Firebase project ([firebase.google.com](https://firebase.google.com/)).
*   Python 3.x installed locally (if you wish to use the avatar generation script).
*   Git (to clone this repository) (if you wish to use the avatar generation script).

**2. Firebase Configuration:**

*   Create a new Firebase project or use an existing one.
*   Enable **Authentication** and activate the **Anonymous** sign-in method.
*   Enable and configure **Realtime Database**.
    *   When creating, choose an appropriate region.
    *   **Security Rules (Important):** Go to the "Rules" tab of your Realtime Database and paste the content from the `/Firebase rules/rules.json` file. These rules are secure and rely on Firebase Authentication to control read/write access.
*   In **Project settings** > **General**, register a new **Web app**.
    *   Do NOT check "Also set up Firebase Hosting...".
*   Copy the provided `firebaseConfig` object. You will need the `apiKey`, `authDomain`, `databaseURL`, and `projectId` values.

**3. Google Apps Script Configuration:**

*   Create a new project on [script.google.com](https://script.google.com/).
*   Copy the content of the files from the `/GAS` folder of this repository into the corresponding files in your Apps Script project. (Create HTML files if they don't exist via `File > New > HTML file`).
*   Configure the **Script Properties** (Project Settings ⚙️ > Script properties (at the bottom of the page)) with your Firebase keys:
    *   `FIREBASE_API_KEY`
    *   `FIREBASE_AUTH_DOMAIN`
    *   `FIREBASE_DATABASE_URL`
    *   `FIREBASE_PROJECT_ID`
*   Save the properties.

**4. Deploying the Web Application:**

*   In the Apps Script editor, click **Deploy** > **New deployment**.
*   Deployment type: **Web app**.
*   Configure:
    *   **Execute as:** `Me`.
    *   **Who has access:** `Anyone`. (so your friends can connect)
*   Click **Deploy**.
*   Authorize the permissions required by the script.
*   Copy the provided **Web app URL**. This is the access URL for your game. (Share it with your friends!)

**(Optional) Configuring the Trigger for Automatic Cleanup:**
Lobby deletion management in the database is not reliable. To address this issue and clean the database, I use the Firebase Realtime Database REST API. However, this method is **deprecated and obsolete**:
*   Generate a `FIREBASE_DATABASE_ID` (this is the legacy database secret):
    *   In your Firebase project, click Project Settings ⚙️ on the left > Service accounts > Database secrets > Show Secret.
*   Configure GAS:
    *    **Script Properties** (Project Settings ⚙️ > Script properties (at the bottom of the page)) with `FIREBASE_DATABASE_ID`
    *   To run the `cleanUpOldLobbies` function periodically (e.g., every Monday morning):
        *   In the Apps Script editor, go to the **Triggers** section (⏰ icon).
        *   Click **Add Trigger**.
        *   Configure to run `cleanUpOldLobbies` on a `Time-driven` event (e.g., `Hourly timer`).

## 🔧 Customization

**1. Adding or Modifying Questions:**

*   Modify the `Questions.html` file (located in `/GAS` for deployment) by adding or changing the strings in the `gentleQuestions`, `mixQuestions`, `extremeQuestions`, or the new `...ConfessionQuestions` arrays.
*   After any modification, **redeploy** your Apps Script web application (Deploy > Manage deployments > choose your deployment > Edit ✏️ > New version & Description (optional) > Deploy).

**2. Adding or Modifying Avatars:**

*   **Method 1: Using Public URLs (Recommended for simplicity)**
    *   Open the `AvatarData.html` file (in `/GAS`).
    *   Modify or add objects to the JavaScript array `AVATAR_LIST`. Each object must have the following structure: `{ name: "Avatar Name", src: "PUBLIC_IMAGE_URL.png" }`.
    *   Ensure that the URLs point directly to publicly accessible image files (.png, .jpg, .gif, .svg).
    *   **Redeploy** your Apps Script application after modification.

*   **Method 2: Generating Custom Avatars with AI and Python (Local)**
    1.  **Preparation (locally):**
        *   Clone this GitHub repository to your machine.
        *   Navigate to the `/Scripts` folder.
        *   Install Python dependencies: `pip install -r requirements.txt` (this will install `Pillow`).
    2.  **Creating Avatars with AI:**
        *   Obtain an image of the person for whom you want to create an avatar.
        *   Use ChatGPT to generate an image, by providing the person's image and writing a prompt such as:
            `"Generate a high-quality chibi-style sticker of this person with a transparent background."` (note: chibi-style creates cute stickers, feel free to choose another style, graffiti art, comic, caricature in Pixar style, etc.)
        *   Download the generated image (ensure it is in `.png` format and preferably with a transparent background).
    3.  **Organizing Files:**
        *   Place all PNG images you want to use as avatars in the `/Avatars` folder of your local copy of the repository.
    4.  **Running the Python Script:**
        *   From the root folder of your local repository copy, run the `generate_avatars.py` script, specifying the `/Avatars` folder:
            ```bash
            python Scripts/generate_avatars.py
            ```
        *   The script will process each PNG image in the `/Avatars` folder, resize it to 128x128, convert it to a Base64 string, and generate a file named `avatars_output.txt` in the root of the `/Avatars` folder. This file will contain the ready-to-use JavaScript `AVATAR_LIST` structure.
    5.  **Integration into GAS:**
        *   Open the generated `Avatars/avatars_output.txt` file.
        *   Copy **its entire content** (CTRL+A > CTRL+C).
        *   In your Google Apps Script project, open the `AvatarData.html` file.
        *   **Replace** the existing content of the `AvatarData.html` file (CTRL+A > CTRL+V) with the content you just copied.
    6.  **Redeployment:**
        *   **Redeploy** your Apps Script web application for the new avatars to take effect.

## 🎮 How to Play

1.  Access the Web app URL that you deployed.
2.  Enter a nickname and select an avatar.
3.  **To create a game:** Click "Create a Party!" and share the generated game code.
4.  **To join a game:** Enter your nickname, choose an avatar, enter the provided game code, and click "Join The Fun!".
5.  In the **lobby**, wait for other players. The game leader (creator) can select the question set, enable **Confession Mode**, and start the game.
6.  During the **voting** phase, select the avatar of the player who you think best matches the displayed question.
7.  Check the **results** to see who received the most votes.
8.  The **coin toss** will determine if the names of voters for a specific player are revealed.
9.  **Confession Time!** If enabled, this surprise round may trigger. The most-voted player from the previous round gets to pick who answers a juicy question. The target must answer, and everyone else judges if they are convinced.
10. Click "Ready for the next round" to continue. The game progresses when all connected players are ready.
11. Use the "Bail Out!" button to disconnect from the game or lobby. The leader can end the game for everyone.
12. Once the game is over, check out the **results page** for a full breakdown of the game's chaos!

## 📄 License

This project is distributed under the MIT License. For more details, please see the `LICENSE` file in this repository.