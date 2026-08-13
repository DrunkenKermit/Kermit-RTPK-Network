const ANIM_KEY = "kermit-rtpk-anim";
const ANIM_LEVELS = ["full", "reduced", "off"];
const TRANSITION_TIME = 460;

document.documentElement.classList.add("page-loading");

function applyAnimLevel(level) {
  if (!ANIM_LEVELS.includes(level)) level = "full";
  document.body?.classList.remove("anim-reduced", "anim-off");
  if (level === "reduced") document.body?.classList.add("anim-reduced");
  if (level === "off") document.body?.classList.add("anim-off");
  try { localStorage.setItem(ANIM_KEY, level); } catch (error) {}
}

function getAnimLevel() {
  try { return localStorage.getItem(ANIM_KEY) || "full"; } catch (error) { return "full"; }
}

function createLoader() {
  if (document.querySelector(".page-loader")) return;
  const loader = document.createElement("div");
  loader.className = "page-loader";
  loader.setAttribute("role", "status");
  loader.setAttribute("aria-label", "Loading");
  loader.innerHTML = '<span class="page-loader-label">Loading</span><span class="loading-dots" aria-hidden="true"><i></i><i></i><i></i></span>';
  document.body.appendChild(loader);
}

function finishLoading() {
  createLoader();
  window.setTimeout(() => {
    document.documentElement.classList.remove("page-loading");
    document.documentElement.classList.add("page-ready");
    document.body.classList.add("page-ready");
  }, TRANSITION_TIME);
}

function showPageTransition(event) {
  const link = event.currentTarget;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === "_blank") return;
  const destination = link.getAttribute("href");
  if (!destination || destination.startsWith("#") || destination.startsWith("mailto:")) return;
  const nextUrl = new URL(destination, window.location.href);
  if (nextUrl.origin !== window.location.origin || nextUrl.pathname === window.location.pathname) return;
  event.preventDefault();
  document.documentElement.classList.remove("page-ready");
  document.documentElement.classList.add("page-loading");
  document.body.classList.remove("page-ready");
  createLoader();
  window.setTimeout(() => { window.location.href = nextUrl.href; }, 180);
}

function initAnimations() {
  applyAnimLevel(getAnimLevel());
  createLoader();
  document.querySelectorAll('a[href$=".html"]').forEach((link) => {
    link.addEventListener("click", showPageTransition);
  });
  finishLoading();
}

document.addEventListener("DOMContentLoaded", initAnimations);

window.kermitAnimLevels = ANIM_LEVELS;
window.applyKermitAnimLevel = applyAnimLevel;
window.getKermitAnimLevel = getAnimLevel;
