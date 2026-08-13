const kermitBackgroundOptions = [
  {
    name: "Default Kermit Glow",
    value: "linear-gradient(135deg, #0d8f3f, #63ff93)",
    accent: "#63ff93"
  },
  {
    name: "Twilight Purple",
    value: "linear-gradient(135deg, #4b0082, #8a2be2)",
    accent: "#c77dff"
  },
  {
    name: "Midnight Black",
    value: "linear-gradient(135deg, #030303, #2c3e50)",
    accent: "#7a94ab"
  },
  {
    name: "Solar Flare",
    value: "linear-gradient(135deg, #ff8c00, #ff2d00)",
    accent: "#ffb347"
  },
  {
    name: "Aurora Dream",
    value: "linear-gradient(135deg, #3d8efd, #b92b27)",
    accent: "#3d8efd"
  },
  {
    name: "Neon Ocean",
    value: "linear-gradient(135deg, #00d2ff, #3a7bd5)",
    accent: "#00d2ff"
  },
  {
    name: "Cosmic Teal",
    value: "linear-gradient(135deg, #13f5d4, #1d6d8b)",
    accent: "#13f5d4"
  },
  {
    name: "Lavender Mist",
    value: "linear-gradient(135deg, #c77dff, #fcd7ff)",
    accent: "#fcd7ff"
  },
  {
    name: "Sunset Ember",
    value: "linear-gradient(135deg, #ff7e5f, #feb47b)",
    accent: "#feb47b"
  },
  {
    name: "Steel Noir",
    value: "linear-gradient(135deg, #343a40, #6c757d)",
    accent: "#9aa5b1"
  }
];

const BACKGROUND_STORAGE_KEY = "kermit-rtpk-background";
const NAVIGATION_STORAGE_KEY = "kermit-rtpk-navigation";
const SITE_NAME_STORAGE_KEY = "kermit-rtpk-site-name";
const SITE_ICON_STORAGE_KEY = "kermit-rtpk-site-icon";
const CLOAK_MODE_STORAGE_KEY = "kermit-rtpk-cloak-mode";
const DEFAULT_SITE_ICON = "assets/favicon.png";
const defaultDocumentTitle = document.title;
let currentBackgroundName = kermitBackgroundOptions[0].name;

function readPreference(key, fallback = "") {
  try {
    return localStorage.getItem(key) || fallback;
  } catch (error) {
    return fallback;
  }
}

function writePreference(key, value) {
  try {
    if (value) localStorage.setItem(key, value);
    else localStorage.removeItem(key);
  } catch (error) {
    console.warn("Unable to persist Kermit preference.", error);
  }
}

function getAccentContrast(hex) {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return ((r * 299) + (g * 587) + (b * 114)) / 1000 > 155 ? "#07140b" : "#ffffff";
}

function applyBackgroundByName(name) {
  const target =
    kermitBackgroundOptions.find((option) => option.name === name) ||
    kermitBackgroundOptions[0];
  const accent = target.accent || "#63ff93";
  const contrast = getAccentContrast(accent);
  const softAccent = `color-mix(in srgb, ${accent} 18%, transparent)`;
  document.documentElement.style.setProperty("--current-bg", target.value);
  document.documentElement.style.setProperty("--current-accent", accent);
  document.documentElement.style.setProperty("--current-accent-contrast", contrast);
  document.documentElement.style.setProperty("--accent-soft", softAccent);
  document.body.style.setProperty("--current-bg", target.value);
  document.body.style.setProperty("--current-accent", accent);
  document.body.style.setProperty("--current-accent-contrast", contrast);
  document.body.style.setProperty("--accent-soft", softAccent);
  document.body.style.background = target.value;
  currentBackgroundName = target.name;
  writePreference(BACKGROUND_STORAGE_KEY, target.name);
  return target;
}

function getStoredBackgroundName() {
  try {
    return localStorage.getItem(BACKGROUND_STORAGE_KEY);
  } catch (error) {
    return null;
  }
}

function initBackgroundPreference() {
  const stored = getStoredBackgroundName();
  applyBackgroundByName(stored || kermitBackgroundOptions[0].name);
}

function applyNavigationOrientation(orientation = "vertical") {
  const value = orientation === "horizontal" ? "horizontal" : "vertical";
  document.body.classList.toggle("nav-horizontal", value === "horizontal");
  document.body.classList.toggle("nav-vertical", value === "vertical");
  writePreference(NAVIGATION_STORAGE_KEY, value);
  return value;
}

function getNavigationOrientation() {
  return readPreference(NAVIGATION_STORAGE_KEY, "vertical");
}

function applySiteIdentity() {
  const customName = readPreference(SITE_NAME_STORAGE_KEY).trim();
  const iconUrl = readPreference(SITE_ICON_STORAGE_KEY).trim();
  document.title = customName || defaultDocumentTitle;

  let icon = document.querySelector("link[data-kermit-site-icon]");
  if (!icon) {
    icon = document.createElement("link");
    icon.rel = "icon";
    icon.dataset.kermitSiteIcon = "true";
    document.head.appendChild(icon);
  }
  icon.href = iconUrl || DEFAULT_SITE_ICON;
}

function getKermitSitePreferences() {
  return {
    background: readPreference(BACKGROUND_STORAGE_KEY, kermitBackgroundOptions[0].name),
    navigation: getNavigationOrientation(),
    siteName: readPreference(SITE_NAME_STORAGE_KEY),
    siteIcon: readPreference(SITE_ICON_STORAGE_KEY),
    cloakMode: readPreference(CLOAK_MODE_STORAGE_KEY, "none"),
  };
}

document.addEventListener("DOMContentLoaded", () => {
  initBackgroundPreference();
  applyNavigationOrientation(getNavigationOrientation());
  applySiteIdentity();
});

window.kermitBackgroundOptions = kermitBackgroundOptions;
window.applyKermitBackground = applyBackgroundByName;
window.getActiveKermitBackground = () => currentBackgroundName;
window.applyKermitNavigation = applyNavigationOrientation;
window.getKermitNavigation = getNavigationOrientation;
window.applyKermitSiteIdentity = (name, iconUrl) => {
  writePreference(SITE_NAME_STORAGE_KEY, (name || "").trim());
  writePreference(SITE_ICON_STORAGE_KEY, (iconUrl || "").trim());
  applySiteIdentity();
};
window.resetKermitSiteIdentity = () => {
  writePreference(SITE_NAME_STORAGE_KEY, "");
  writePreference(SITE_ICON_STORAGE_KEY, "");
  applySiteIdentity();
  return {
    siteName: "",
    siteIcon: "",
  };
};
window.getKermitSitePreferences = getKermitSitePreferences;
window.setKermitCloakMode = (mode) => {
  const validMode = ["none", "blob", "aboutblank"].includes(mode) ? mode : "none";
  writePreference(CLOAK_MODE_STORAGE_KEY, validMode);
  return validMode;
};
window.getKermitCloakMode = () => readPreference(CLOAK_MODE_STORAGE_KEY, "none");

window.launchKermitCloak = async (mode = window.getKermitCloakMode()) => {
  const selectedMode = ["blob", "aboutblank"].includes(mode) ? mode : "none";
  const source = document.documentElement.outerHTML;
  const base = `<base href="${location.href.replace(/"/g, "&quot;")}">`;
  const html = source.includes("<head>") ? source.replace("<head>", `<head>${base}`) : source;

  if (selectedMode === "blob") {
    const blobUrl = URL.createObjectURL(new Blob([`<!doctype html>${html}`], { type: "text/html" }));
    const tab = window.open(blobUrl, "_blank");
    if (!tab) throw new Error("The browser blocked the new tab. Allow pop-ups and try again.");
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
    return "blob";
  }

  if (selectedMode === "aboutblank") {
    const tab = window.open("about:blank", "_blank");
    if (!tab) throw new Error("The browser blocked the new tab. Allow pop-ups and try again.");
    tab.document.open();
    tab.document.write(`<!doctype html>${html}`);
    tab.document.close();
    return "about:blank";
  }

  window.open(location.href, "_blank");
  return "normal";
};
