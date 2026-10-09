import { NewsModel } from '../models/NewsModel.js';
import { ProjectModel } from '../models/ProjectModel.js';
import { PublicationModel } from '../models/PublicationModel.js';
import { EventModel } from '../models/EventModel.js';
import { BrandingModel } from '../models/BrandingModel.js';
import { VideoModel } from '../models/VideoModel.js';
import { ComplaintModel } from '../models/ComplaintModel.js';
import { ServiceModel } from '../models/ServiceModel.js';

import { NewsView } from '../views/NewsView.js';
import { ProjectView } from '../views/ProjectView.js';
import { PublicationView } from '../views/PublicationView.js';
import { EventView } from '../views/EventView.js';
import { VideoView } from '../views/VideoView.js';

export class MainController {
    constructor() {
        this.init();
    }

    init() {
        this.applyBranding();
        this.loadPageData();
        this.bindEvents();
        this.checkAdminControlsVisibility();
    }

    applyBranding() {
        const branding = BrandingModel.get();
        if (!branding) return;

        const root = document.documentElement;
        if (branding.primaryColor) root.style.setProperty('--primary-color', branding.primaryColor);
        if (branding.accentColor) root.style.setProperty('--accent-color', branding.accentColor);
        if (branding.darkColor) root.style.setProperty('--dark-color', branding.darkColor);
        if (branding.textColor) root.style.setProperty('--text-main', branding.textColor);

        // Municipality Names
        document.querySelectorAll('.muni-name-display').forEach(el => {
            el.textContent = branding.muniName || 'الجماعة الترابية';
        });

        // Logos
        const headerLogo = document.getElementById('mainLogoHeaderImg');
        if (headerLogo && branding.logoUrl) headerLogo.src = branding.logoUrl;
        const footerLogo = document.getElementById('footerLogoImg');
        if (footerLogo && branding.logoUrl) footerLogo.src = branding.logoUrl;

        // Hero Background
        const heroSection = document.getElementById('hero');
        if (heroSection && branding.heroBgUrl) {
            heroSection.style.backgroundImage = `url('${branding.heroBgUrl}')`;
        }

        // Ticker
        const tickerSec = document.getElementById('tickerSection');
        const tickerContent = document.getElementById('tickerContent');
        if (tickerSec) {
            tickerSec.style.display = branding.showTicker ? 'block' : 'none';
        }
        if (tickerContent && branding.tickerText) {
            tickerContent.textContent = branding.tickerText;
        }

        // Section visibility toggles
        const urbanSec = document.getElementById('urban-development');
        if (urbanSec) urbanSec.style.display = branding.showUrban ? 'block' : 'none';

        const servicesSec = document.getElementById('servicesSection');
        if (servicesSec) servicesSec.style.display = branding.showServices ? 'block' : 'none';

        // Weather
        const wCity = document.getElementById('weatherCityDisplay');
        const wTemp = document.getElementById('weatherTempDisplay');
        if (wCity) wCity.textContent = branding.weatherCity || 'المدينة';
        if (wTemp) wTemp.textContent = branding.weatherTemp || '24°C';

        // Contact info
        const fPhone = document.getElementById('footerPhoneDisplay');
        const fEmail = document.getElementById('footerEmailDisplay');
        const fAddress = document.getElementById('footerAddressDisplay');
        const fHours = document.getElementById('footerHoursDisplay');
        if (fPhone) fPhone.textContent = branding.phone || '+212 528 84 00 00';
        if (fEmail) fEmail.textContent = branding.email || 'contact@commune.ma';
        if (fAddress) fAddress.textContent = branding.address || 'المقر الرئيسي للجماعة';
        if (fHours) fHours.textContent = branding.workingHours || 'من الإثنين إلى الجمعة';
    }

    loadPageData() {
        const news = NewsModel.getAll();
        NewsView.renderList(news);

        const projects = ProjectModel.getAll();
        ProjectView.renderGrid(projects);

        const publications = PublicationModel.getAll();
        PublicationView.renderList(publications);

        const events = EventModel.getAll();
        EventView.renderList(events);

        const videos = VideoModel.getAll();
        VideoView.renderList(videos);

        this.renderServices();
    }

    renderServices() {
        const container = document.getElementById('servicesHubContainer');
        if (!container) return;

        const services = ServiceModel.getAll();
        if (!services || services.length === 0) {
            container.innerHTML = `<div style="grid-column: span 3; text-align: center; color: #64748b;">لا توجد خدمات حالياً</div>`;
            return;
        }

        container.innerHTML = services.map(s => `
            <div class="service-hub-card">
                <div class="service-hub-badge">${s.category || 'خدمة إلكترونية'}</div>
                <h3 class="service-hub-title">${s.title}</h3>
                <p class="service-hub-desc">${s.description}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                    <span style="font-size: 0.8rem; color: #94a3b8;">${s.fileSize || 'PDF'}</span>
                    <a href="${s.link}" ${s.isExternal ? 'target="_blank"' : 'download'} class="btn btn-outline btn-sm">
                        ${s.isExternal ? 'الانتقال للخدمة ↗' : 'تحميل الوثيقة PDF 📥'}
                    </a>
                </div>
            </div>
        `).join('');
    }

    openNewsModal(id) {
        const item = NewsModel.getById(id);
        if (item) {
            NewsView.showDetailModal(item);
        }
    }

    closeModal() {
        const overlay = document.getElementById('modalOverlay');
        if (overlay) overlay.style.display = 'none';
    }

    bindEvents() {
        const modalCloseBtn = document.getElementById('modalCloseBtn');
        const modalOverlay = document.getElementById('modalOverlay');

        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', () => this.closeModal());
        }

        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) this.closeModal();
            });
        }
    }

    checkAdminControlsVisibility() {
        const isAdminLogged = sessionStorage.getItem('agadir_admin_logged') === 'true';
        document.querySelectorAll('.admin-only').forEach(el => {
            el.style.display = isAdminLogged ? 'inline-block' : 'none';
        });
    }
}
