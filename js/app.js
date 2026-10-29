import '../db.js?v=75.0';
import { MainController } from './controllers/MainController.js?v=75.0';
import { AdminController } from './controllers/AdminController.js?v=75.0';
import { AdminView } from './views/AdminView.js?v=75.0';

// Expose global window bindings for inline HTML handlers
window.switchPanel = AdminView.switchPanel;
window.handleAdminLogin = (e) => window.adminController && window.adminController.handleLogin(e);
window.handleLogout = () => window.adminController && window.adminController.handleLogout();

// Initialize MVC based on current page (safe for all ready states)
function initPortalApp() {
    if (document.body.classList.contains('admin-body') || window.location.pathname.endsWith('admin.html')) {
        if (!window.adminController) {
            window.adminController = new AdminController();
        }
    } else {
        if (!window.appController) {
            window.appController = new MainController();
            window.mainController = window.appController;
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortalApp);
} else {
    initPortalApp();
}
