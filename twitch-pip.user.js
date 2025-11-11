// ==UserScript==
// @name         Twitch Picture-in-Picture (DPiP Overlay)
// @namespace    https://github.com/ImElio
// @version      1.0.0
// @description  Adds a PiP button on Twitch
// @author       Elio
// @match        https://www.twitch.tv/*
// @icon         https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.png
// @grant        none
// @updateURL    https://raw.githubusercontent.com/ImElio/Twitch-PiP/main/twitch-pip.user.js
// @downloadURL  https://raw.githubusercontent.com/ImElio/Twitch-PiP/main/twitch-pip.user.js
// ==/UserScript==

(() => {
  if (window.__TPP_RUNNING__) return; window.__TPP_RUNNING__ = true;

  const TAG = "[Twitch PiP]";
  const VERSION = "1.0.0";
  const log = (...a) => console.log(TAG, ...a);
  const BUTTON_ID = "tpp-btn";
  const STYLE_ID = "twitch-pip-styles";

  const SEL = {
    controlsGroup: '.player-controls__right-control-group',
    theatreBtn: '[data-a-target="player-theatre-mode-button"]',
    video: 'video',
    title: '[data-a-target="stream-title"]',
    gameLink: 'a[data-a-target="stream-game-link"], a[href*="/directory/game/"]',
    viewerCount: '[data-a-target="animated-channel-viewers-count"], [data-test-selector="viewercount"], [data-a-target="viewers-count"]'
  };

  const SVG = {
    pip: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M4 5h16a2 2 0 0 1 2 2v4h-2V7H4v10h7v2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2m11 6h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1Z"/></svg>`,
    game: `<svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"><path fill="currentColor" d="M6 5h12l2 4v10h-4v-2H8v2H4V9l2-4Zm2 2-1 2H6v8h2v-2h8v2h2V9h-1l-1-2H8Zm2 3h4v2h-4v-2Z"/></svg>`,
    viewers: `<svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"><path fill="currentColor" d="M12 5c5.5 0 10 5.5 10 7s-4.5 7-10 7S2 13.5 2 12s4.5-7 10-7Zm0 2C8.1 7 4.7 10.7 4.1 12c.6 1.3 4 5 7.9 5s7.3-3.7 7.9-5c-.6-1.3-4-5-7.9-5Zm0 2a3 3 0 1 1 0 6a3 3 0 0 1 0-6Z"/></svg>`,
    play: `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>`,
    pause: `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M6 5h5v14H6zm7 0h5v14h-5z"/></svg>`,

    vol0: `<svg class="w-[22px] h-[22px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
    <path d="M5.707 4.293a1 1 0 0 0-1.414 1.414l14 14a1 1 0 0 0 1.414-1.414l-.004-.005C21.57 16.498 22 13.938 22 12a9.972 9.972 0 0 0-2.929-7.071 1 1 0 1 0-1.414 1.414A7.972 7.972 0 0 1 20 12c0 1.752-.403 3.636-1.712 4.873l-1.433-1.433C17.616 14.37 18 13.107 18 12c0-1.678-.69-3.197-1.8-4.285a1 1 0 1 0-1.4 1.428A3.985 3.985 0 0 1 16 12c0 .606-.195 1.335-.59 1.996L13 11.586V6.135c0-1.696-1.978-2.622-3.28-1.536L7.698 6.284l-1.99-1.991ZM4 8h.586L13 16.414v1.451c0 1.696-1.978 2.622-3.28 1.536L5.638 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2Z"/>
    </svg>`,
    vol1: `<svg class="w-[22px] h-[22px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
    <path d="M15 6.037c0-1.724-1.978-2.665-3.28-1.562L7.638 7.933H6c-1.105 0-2 .91-2 2.034v4.066c0 1.123.895 2.034 2 2.034h1.638l4.082 3.458c1.302 1.104 3.28.162 3.28-1.562V6.037Z"/>
    <path fill-rule="evenodd" d="M16.786 7.658a.988.988 0 0 1 1.414-.014A6.135 6.135 0 0 1 20 12c0 1.662-.655 3.17-1.715 4.27a.989.989 0 0 1-1.414.014 1.029 1.029 0 0 1-.014-1.437A4.085 4.085 0 0 0 18 12a4.085 4.085 0 0 0-1.2-2.904 1.029 1.029 0 0 1-.014-1.438Z" clip-rule="evenodd"/>
    </svg>`,
    vol2: `<svg class="w-[22px] h-[22px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
    <path d="M15 6.037c0-1.724-1.978-2.665-3.28-1.562L7.638 7.933H6c-1.105 0-2 .91-2 2.034v4.066c0 1.123.895 2.034 2 2.034h1.638l4.082 3.458c1.302 1.104 3.28.162 3.28-1.562V6.037Z"/>
    <path fill-rule="evenodd" d="M16.786 7.658a.988.988 0 0 1 1.414-.014A6.135 6.135 0 0 1 20 12c0 1.662-.655 3.17-1.715 4.27a.989.989 0 0 1-1.414.014 1.029 1.029 0 0 1-.014-1.437A4.085 4.085 0 0 0 18 12a4.085 4.085 0 0 0-1.2-2.904 1.029 1.029 0 0 1-.014-1.438Z" clip-rule="evenodd"/>
    </svg>`,
    vol3: `<svg class="w-[22px] h-[22px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
    <path d="M13 6.037c0-1.724-1.978-2.665-3.28-1.562L5.638 7.933H4c-1.105 0-2 .91-2 2.034v4.066c0 1.123.895 2.034 2 2.034h1.638l4.082 3.458c1.302 1.104 3.28.162 3.28-1.562V6.037Z"/>
    <path fill-rule="evenodd" d="M14.786 7.658a.988.988 0 0 1 1.414-.014A6.135 6.135 0 0 1 18 12c0 1.662-.655 3.17-1.715 4.27a.989.989 0 0 1-1.414.014 1.029 1.029 0 0 1-.014-1.437A4.085 4.085 0 0 0 16 12a4.085 4.085 0 0 0-1.2-2.904 1.029 1.029 0 0 1-.014-1.438Z" clip-rule="evenodd"/>
    <path fill-rule="evenodd" d="M17.657 4.811a.988.988 0 0 1 1.414 0A10.224 10.224 0 0 1 22 12c0 2.807-1.12 5.35-2.929 7.189a.988.988 0 0 1-1.414 0 1.029 1.029 0 0 1 0-1.438A8.173 8.173 0 0 0 20 12a8.173 8.173 0 0 0-2.343-5.751 1.029 1.029 0 0 1 0-1.438Z" clip-rule="evenodd"/>
    </svg>`
  };

  let dipipWindow = null;
  let dipipVideo = null;
  let infoTimer = null;
  let debounceTimer = null;
  let observer = null;
  let restore = { muted: null, volume: null, hadPiP: false, src: null };

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .tpp-btn{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:6px;background:rgba(255,255,255,.08);color:#fff;margin-left:6px;cursor:pointer;transition:background .2s,opacity .2s}
      .tpp-btn:hover{background:rgba(255,255,255,.18)}
      .tpp-btn svg{display:block}
      .tpp-btn[disabled]{opacity:.4;pointer-events:none}
    `;
    document.head.appendChild(style);
  }

  function visibleControls() {
    const groups = Array.from(document.querySelectorAll(SEL.controlsGroup));
    return groups.find(g => g.offsetParent !== null) || groups[0] || null;
  }

  function ensureSingleButton() {
    injectStyles();
    const controls = visibleControls();
    if (!controls) return;
    const existing = document.getElementById(BUTTON_ID);
    if (existing && existing.isConnected && controls.contains(existing)) return;
    document.querySelectorAll(`#${BUTTON_ID}`).forEach(n => n.remove());
    const btn = document.createElement("button");
    btn.id = BUTTON_ID;
    btn.className = "tpp-btn";
    btn.type = "button";
    btn.title = "Picture-in-Picture";
    btn.setAttribute("aria-label", "Picture-in-Picture");
    btn.innerHTML = SVG.pip;
    btn.addEventListener("click", onPiPClick, { passive: true });
    const theatre = controls.querySelector(SEL.theatreBtn);
    if (theatre && theatre.parentElement) theatre.parentElement.insertBefore(btn, theatre.nextSibling);
    else controls.appendChild(btn);
  }

  function readInfo() {
    const title = document.querySelector(SEL.title)?.textContent?.trim() || "";
    const game = document.querySelector(SEL.gameLink)?.textContent?.trim() || "";
    let viewers = "";
    const vc = document.querySelector(SEL.viewerCount);
    if (vc) viewers = vc.textContent.replace(/\s+/g, " ").trim();
    return { title, game, viewers };
  }

  async function onPiPClick() {
    const video = document.querySelector(SEL.video);
    if (!video) return;
    try {
      if ('documentPictureInPicture' in window) {
        await openDocumentPiP(video);
      } else {
        await video.requestPictureInPicture();
      }
    } catch (e) {
      log("PiP error", e);
    }
  }

  function glass(bgAlpha = .32, borderAlpha = .10, blur = 10) {
    return `background:rgba(0,0,0,${bgAlpha});backdrop-filter:saturate(140%) blur(${blur}px);border:1px solid rgba(255,255,255,${borderAlpha});`;
  }

  async function openDocumentPiP(srcVideo) {
    if (dipipWindow && !dipipWindow.closed) { try { dipipWindow.focus(); return; } catch {} }
    const pipWin = await window.documentPictureInPicture.requestWindow({ width: 560, height: 340 });
    dipipWindow = pipWin;

    restore = { muted: srcVideo.muted, volume: srcVideo.volume, hadPiP: true, src: srcVideo };
    srcVideo.muted = true;

    const d = pipWin.document;
    const style = d.createElement("style");
    style.textContent = `
      :root{color-scheme:dark light}
      html,body{margin:0;height:100%;background:#111}
      .wrap{position:relative;width:100%;height:100%;background:#000;border-radius:10px;overflow:hidden}
      .vslot{position:absolute;inset:0}
      .top{position:absolute;top:10px;left:50%;transform:translateX(-50%) translateY(-6px);display:flex;gap:6px;align-items:center;border-radius:999px;padding:4px 8px;opacity:0;transition:opacity .16s, transform .16s;${glass()}}
      .chip{display:inline-flex;gap:6px;align-items:center;font:600 11px/1.1 system-ui,-apple-system,Segoe UI,Roboto,Arial;color:#fff;white-space:nowrap;user-select:none}
      .chip span{max-width:190px;overflow:hidden;text-overflow:ellipsis}
      .bottom-center{position:absolute;left:50%;bottom:10px;transform:translate(-50%,6px);display:flex;gap:8px;align-items:center;opacity:0;transition:opacity .16s, transform .16s}
      .ctrl{display:inline-flex;align-items:center;gap:6px;border-radius:8px;padding:4px 6px;${glass()}}
      .ctrl-btn{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:6px;background:rgba(255,255,255,.14);color:#fff;cursor:pointer}
      .volbox{display:inline-flex;align-items:center;gap:8px;border-radius:8px;padding:4px 8px;${glass()}}
      .vol-slider{appearance:none;width:120px;height:4px;border-radius:999px;background:rgba(255,255,255,.25);outline:none}
      .vol-slider::-webkit-slider-thumb{appearance:none;width:12px;height:12px;border-radius:50%;background:#fff;border:none}
      .vol-icon{display:inline-flex;width:22px;height:22px;color:#fff;cursor:pointer;align-items:center;justify-content:center}
      .vol-icon svg{width:50%;height:50%}
      .vol-pct{font:600 11px/1 system-ui,-apple-system,Segoe UI,Roboto,Arial;color:#fff;min-width:34px;text-align:right;user-select:none}
      .bottom-right{position:absolute;right:12px;bottom:10px;transform:translateY(6px);opacity:0;transition:opacity .16s, transform .16s}
      .wrap:hover .top,.wrap:hover .bottom-center,.wrap:hover .bottom-right{opacity:1;transform:translateX(-50%) translateY(0)}
      .wrap:hover .bottom-right{transform:translateY(0)}
      video{width:100%;height:100%;display:block}
      svg{flex:0 0 auto}
    `;
    d.head.appendChild(style);

    const wrap = d.createElement("div"); wrap.className = "wrap";
    const vslot = d.createElement("div"); vslot.className = "vslot";

    const top = d.createElement("div"); top.className = "top";
    const chipGame = d.createElement("div"); chipGame.className = "chip"; chipGame.id = "tpp-game";
    const chipView = d.createElement("div"); chipView.className = "chip"; chipView.id = "tpp-viewers";
    top.appendChild(chipGame);
    top.appendChild(chipView);

    const bottomCenter = d.createElement("div"); bottomCenter.className = "bottom-center";
    const ctrl = d.createElement("div"); ctrl.className = "ctrl";
    const toggleBtn = d.createElement("button"); toggleBtn.className = "ctrl-btn"; toggleBtn.type = "button"; toggleBtn.id = "tpp-toggle";
    ctrl.appendChild(toggleBtn);

    const volBox = d.createElement("div"); volBox.className = "volbox";
    const volIcon = d.createElement("div"); volIcon.className = "vol-icon"; volIcon.innerHTML = SVG.vol3;
    const volSlider = d.createElement("input"); volSlider.type = "range"; volSlider.className = "vol-slider"; volSlider.min="0"; volSlider.max="1"; volSlider.step="0.01";
    const volPct = d.createElement("div"); volPct.className = "vol-pct"; volPct.textContent = "100%";
    volBox.appendChild(volIcon); volBox.appendChild(volSlider); volBox.appendChild(volPct);

    bottomCenter.appendChild(ctrl);
    bottomCenter.appendChild(volBox);


    const v = d.createElement("video");
    v.autoplay = true; v.muted = false; v.playsInline = true; v.controls = false;
    v.srcObject = srcVideo.captureStream();

    vslot.appendChild(v);
    wrap.appendChild(vslot);
    wrap.appendChild(top);
    wrap.appendChild(bottomCenter);
    d.body.appendChild(wrap);

    dipipVideo = v;

    const tick = () => {
      const { game, viewers } = readInfo();
      chipGame.innerHTML = `${SVG.game}<span>${game || "—"}</span>`;
      chipView.innerHTML = `${SVG.viewers}<span>${viewers || "—"}</span>`;
    };
    tick();
    infoTimer = setInterval(tick, 2000);

    const setVolIcon = (val, muted) => {
      if (muted || val === 0) { volIcon.innerHTML = SVG.vol0; return; }
      if (val <= 0.33) { volIcon.innerHTML = SVG.vol1; return; }
      if (val <= 0.66) { volIcon.innerHTML = SVG.vol2; return; }
      volIcon.innerHTML = SVG.vol3;
    };

    let lastNonZero = restore.volume ?? 1;
    const applyVolume = (val, mutedSwap = null) => {
      if (!dipipVideo) return;
      if (mutedSwap !== null) dipipVideo.muted = mutedSwap;
      dipipVideo.volume = val;
      volSlider.value = String(val);
      volPct.textContent = `${Math.round(val * 100)}%`;
      setVolIcon(val, dipipVideo.muted);
    };

    volSlider.value = String(restore.volume ?? srcVideo.volume ?? 1);
    applyVolume(Number(volSlider.value), false);

    volSlider.addEventListener("input", () => {
      const vnum = Number(volSlider.value);
      if (vnum > 0) lastNonZero = vnum;
      dipipVideo.muted = vnum === 0;
      applyVolume(vnum);
    }, { passive: true });

    volIcon.addEventListener("click", () => {
      if (!dipipVideo) return;
      if (dipipVideo.muted || dipipVideo.volume === 0) {
        applyVolume(lastNonZero || 0.5, false);
      } else {
        lastNonZero = dipipVideo.volume || 0.5;
        applyVolume(0, true);
      }
    });

    const refreshToggleIcon = () => { toggleBtn.innerHTML = dipipVideo?.paused ? SVG.play : SVG.pause; };
    toggleBtn.addEventListener("click", () => { if (!dipipVideo) return; dipipVideo.paused ? dipipVideo.play() : dipipVideo.pause(); refreshToggleIcon(); });
    v.addEventListener("play", refreshToggleIcon);
    v.addEventListener("pause", refreshToggleIcon);
    refreshToggleIcon();

    const cleanup = () => {
      try {
        if (infoTimer) clearInterval(infoTimer);
        if (dipipVideo) {
          try { dipipVideo.pause(); } catch {}
          const tracks = dipipVideo.srcObject && dipipVideo.srcObject.getTracks ? dipipVideo.srcObject.getTracks() : [];
          tracks && tracks.forEach(t => { try { t.stop(); } catch {} });
          dipipVideo.srcObject = null;
        }
      } catch {}
      dipipWindow = null; dipipVideo = null;
      if (restore.hadPiP && restore.src) {
        try {
          restore.src.muted = restore.muted ?? false;
          if (typeof restore.volume === "number") restore.src.volume = restore.volume;
        } catch {}
      }
    };

    pipWin.addEventListener("unload", cleanup);
    window.addEventListener("pagehide", cleanup, { once: true });
  }

  function debouncedEnsure() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => { ensureSingleButton(); }, 80);
  }

  function observe() {
    if (observer) return;
    observer = new MutationObserver(() => debouncedEnsure());
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("popstate", debouncedEnsure, { passive: true });
    const push = history.pushState;
    history.pushState = function () { push.apply(this, arguments); debouncedEnsure(); };
  }

  function boot() {
    ensureSingleButton();
    observe();
    log("init", VERSION);
  }

  boot();
})();
