const CURSOR_KEY = "kermit-rtpk-cursor";

function hexToRgb(hex) {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");
  const n = parseInt(hex, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function tint(hex, t) {
  const [r, g, b] = hexToRgb(hex);
  return `rgb(${Math.round(r+(255-r)*t)},${Math.round(g+(255-g)*t)},${Math.round(b+(255-b)*t)})`;
}
function shade(hex, t) {
  const [r, g, b] = hexToRgb(hex);
  return `rgb(${Math.round(r*(1-t))},${Math.round(g*(1-t))},${Math.round(b*(1-t))})`;
}

function getCurrentAccent() {
  const v = getComputedStyle(document.body).getPropertyValue("--current-accent").trim();
  return v || "#63ff93";
}

function buildFrogSVG(accent) {
  const light  = tint(accent, 0.72);
  const dark   = shade(accent, 0.62);
  const stroke = shade(accent, 0.80);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34">
  <defs>
    <linearGradient id="fg" x1="8%" y1="6%" x2="88%" y2="94%">
      <stop offset="0%"   stop-color="${light}"/>
      <stop offset="38%"  stop-color="${accent}"/>
      <stop offset="100%" stop-color="${dark}"/>
    </linearGradient>
    <linearGradient id="fgS" x1="0%" y1="0%" x2="50%" y2="70%">
      <stop offset="0%"   stop-color="rgba(255,255,255,0.55)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </linearGradient>
  </defs>
  <path d="M4 2 L4 26 L10 20 L15 30 L19.5 28 L14.5 18 L24 18 Z"
        fill="url(#fg)" stroke="${stroke}" stroke-width="1.3"
        stroke-linejoin="round" stroke-linecap="round"/>
  <path d="M5.5 3.5 L5.5 17 L10 11"
        fill="none" stroke="url(#fgS)" stroke-width="1.6"
        stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
}

function makeCursorURL(svgString, hotX, hotY) {
  return `url("data:image/svg+xml,${encodeURIComponent(svgString)}") ${hotX} ${hotY}, auto`;
}

const CURSORS = {
  custom:  { label: "Custom",  build: () => makeCursorURL(buildFrogSVG(getCurrentAccent()), 4, 2) },
  default: { label: "Default", build: () => "auto" },
};

function applyCursor(key) {
  if (key === "frog") key = "custom";
  if (!CURSORS[key]) key = "custom";
  const style = document.getElementById("kermit-cursor-style") || (() => {
    const s = document.createElement("style");
    s.id = "kermit-cursor-style";
    document.head.appendChild(s);
    return s;
  })();
  const cur = CURSORS[key].build();
  style.textContent = cur === "auto"
    ? ""
    : `*, *::before, *::after { cursor: ${cur} !important; }`;
  try { localStorage.setItem(CURSOR_KEY, key); } catch (e) {}
}

function getCursor() {
  try {
    const stored = localStorage.getItem(CURSOR_KEY) || "custom";
    return stored === "frog" ? "custom" : stored;
  } catch (e) { return "custom"; }
}

document.addEventListener("DOMContentLoaded", () => {
  applyCursor(getCursor());

  if (window.applyKermitBackground) {
    const _orig = window.applyKermitBackground;
    window.applyKermitBackground = function(name) {
      const result = _orig(name);
      requestAnimationFrame(() => applyCursor(getCursor()));
      return result;
    };
  }
});

window.kermitCursors = CURSORS;
window.applyKermitCursor = applyCursor;
window.getKermitCursor = getCursor;
