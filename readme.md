# Twitch Picture-in-Picture (DPiP Overlay)

<p align="center">
  <a href="https://raw.githubusercontent.com/Elio/Twitch-PiP/main/twitch-picture-in-picture.user.js">
    <img alt="Install with Tampermonkey" src="https://img.shields.io/badge/Install%20Userscript-Click%20to%20Install-4CAF50?logo=greasyfork&logoColor=white">
  </a>
  &nbsp;
  <a href="https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo" target="_blank" rel="noopener">
    <img alt="Get Tampermonkey" src="https://img.shields.io/badge/Get%20Tampermonkey-Chromium%20browsers-3D3D3D?logo=google-chrome&logoColor=white">
  </a>
</p>

---

## ✨ Features

- PiP button injected next to the **Theatre** control
- DPiP overlay (when supported) with:
  - Game chip + Viewers chip (glass style)
  - Play/Pause control
  - Volume slider with dynamic icon (mute/low/med/high) + percentage
  - “By Elio v1.0.0” badge (top-right, links to this repo)
- Restores the original tab volume when DPiP closes
- Duplicate-button guard & DOM mutation resilience


## 🚀 Installation

1. Install **Tampermonkey** (works on Brave/Chromium, Edge, Chrome, Opera):
   - [Get Tampermonkey (Chromium)](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
2. Click **Install Userscript** (opens the raw file; Tampermonkey will prompt to install):
   - `https://raw.githubusercontent.com/ImElio/Twitch-PiP/main/twitch-picture-in-picture.user.js`

> Alternative managers: **Violentmonkey** (Chromium/Firefox) also works—open the same raw URL to install.

---

## 🧩 Usage

1. Open any Twitch stream page.
2. Click the **PiP** icon next to the **Theatre** button.
3. In the DPiP window:
   - **Hover** to reveal the glass controls.
   - Use **Play/Pause** and the **Volume** slider; click the volume icon to **mute/unmute**.
   - The **By Elio v1.0.0** badge (top-right) links back to this repository.

Closing the DPiP window stops its captured tracks and restores the original tab’s audio settings.

---

## ⚙️ Requirements & Notes

- **Document Picture-in-Picture** is available in modern Chromium-based browsers.
- If DPiP isn’t supported, the script falls back to classic element **Picture-in-Picture**.
- No special permissions. Runs on `https://www.twitch.tv/*`.

---

## 🔧 Troubleshooting

- **No PiP button visible**: Wait for the player UI to load or toggle Theatre mode once.
- **Multiple buttons**: The script auto-cleans duplicates; refresh if it persists.
- **Double audio**: Close the DPiP window—capture stops and the page volume is restored. Refresh if audio persists (rare).
- **Volume not changing**: Adjust the slider **inside the DPiP window** (that slider controls the captured stream).

---

## 🛡 Privacy

No analytics or tracking. Only Twitch and the update URL are requested.