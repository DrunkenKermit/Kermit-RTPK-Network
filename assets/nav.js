document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("menuToggle");
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.getElementById("sidebarOverlay");

  if (!toggle || !sidebar) return;

  const setCollapsed = (collapsed) => {
    document.body.classList.toggle("nav-collapsed", collapsed);
    sidebar.classList.toggle("open", !collapsed);
    overlay?.classList.toggle("active", !collapsed && window.innerWidth <= 640);
    toggle.classList.toggle("active", !collapsed);
    toggle.setAttribute("aria-expanded", String(!collapsed));
    toggle.setAttribute("aria-label", collapsed ? "Expand toolbar" : "Collapse toolbar");
    toggle.title = collapsed ? "Expand toolbar" : "Collapse toolbar";
  };

  const openSidebar = () => {
    setCollapsed(false);
  };

  const closeSidebar = () => {
    setCollapsed(true);
  };

  const isCollapsed = () => document.body.classList.contains("nav-collapsed");

  if (window.innerWidth <= 640 && document.body.classList.contains("nav-vertical")) {
    setCollapsed(true);
  } else {
    setCollapsed(false);
  }

  toggle.addEventListener("click", () => {
    setCollapsed(!isCollapsed());
  });

  overlay?.addEventListener("click", closeSidebar);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeSidebar();
  });

  sidebar.querySelectorAll(".sidebar-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      if (window.innerWidth <= 640) closeSidebar();
    });
  });

});
