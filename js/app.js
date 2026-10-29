import '../db.js?v=60.0';
import { MainController } from './controllers/MainController.js?v=60.0';
import { AdminController } from './controllers/AdminController.js';
import { AdminView } from './views/AdminView.js';

// Expose global window bindings for inline HTML handlers
window.switchPanel = AdminView.switchPanel;
window.handleAdminLogin = (e) => window.adminController && window.adminController.handleLogin(e);
window.handleLogout = () => window.adminController && window.adminController.handleLogout();

// Initialize MVC based on current page
document.addEventListener('DOMContentLoaded', () => {
    if (document.body.classList.contains('admin-body') || window.location.pathname.endsWith('admin.html')) {
        window.adminController = new AdminController();
    } else {
        window.appController = new MainController();
        window.mainController = window.appController;
    }
});
