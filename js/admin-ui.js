import { initAuthGuard, logoutAdmin } from "./auth.js";

/**
 * Admin UI Controller
 */
export function initAdminUI() {
  // Guard page for logged in admin
  initAuthGuard((user) => {
    const userEmailEl = document.getElementById('adminUserEmail');
    if (userEmailEl) {
      userEmailEl.textContent = user.email || 'Authorized Admin';
    }
  });

  // Logout button
  const logoutBtns = document.querySelectorAll('.js-logout-btn');
  logoutBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      logoutAdmin();
    });
  });

  // Mobile sidebar toggle & backdrop
  const sidebarToggle = document.getElementById('adminSidebarToggle');
  const closeSidebarBtn = document.getElementById('closeSidebarBtn');
  const sidebar = document.querySelector('.admin-sidebar');
  
  let backdrop = document.querySelector('.admin-sidebar-backdrop');
  if (!backdrop && sidebar) {
    backdrop = document.createElement('div');
    backdrop.className = 'admin-sidebar-backdrop';
    document.body.appendChild(backdrop);
  }

  function toggleSidebar(show) {
    if (!sidebar) return;
    const shouldShow = show !== undefined ? show : !sidebar.classList.contains('open');
    sidebar.classList.toggle('open', shouldShow);
    if (backdrop) backdrop.classList.toggle('active', shouldShow);
  }

  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSidebar();
    });
  }

  if (closeSidebarBtn) {
    closeSidebarBtn.addEventListener('click', () => toggleSidebar(false));
  }

  if (backdrop) {
    backdrop.addEventListener('click', () => toggleSidebar(false));
  }

  // Active admin menu highlighting
  const currentPath = window.location.pathname;
  const navItems = document.querySelectorAll('.admin-nav-item');
  navItems.forEach(item => {
    const href = item.getAttribute('href');
    if (href && currentPath.endsWith(href)) {
      item.classList.add('active');
    }
  });
}
