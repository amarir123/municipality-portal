import { NewsModel } from '../models/NewsModel.js?v=70.0';
import { ProjectModel } from '../models/ProjectModel.js?v=70.0';
import { PublicationModel } from '../models/PublicationModel.js?v=70.0';
import { EventModel } from '../models/EventModel.js?v=70.0';
import { BrandingModel } from '../models/BrandingModel.js?v=70.0';
import { VideoModel } from '../models/VideoModel.js?v=70.0';
import { ComplaintModel } from '../models/ComplaintModel.js?v=70.0';
import { ServiceModel } from '../models/ServiceModel.js?v=70.0';
import { MandateModel } from '../models/MandateModel.js?v=70.0';
import { SynthesisReportModel } from '../models/SynthesisReportModel.js?v=70.0';
import { SubventionModel } from '../models/SubventionModel.js?v=70.0';
import { PollModel } from '../models/PollModel.js?v=70.0';
import { ProcedureModel } from '../models/ProcedureModel.js?v=75.0';

import { NewsView } from '../views/NewsView.js';
import { ProjectView } from '../views/ProjectView.js';
import { PublicationView } from '../views/PublicationView.js';
import { EventView } from '../views/EventView.js';
import { VideoView } from '../views/VideoView.js';

export class MainController {
    constructor() {
        this.currentHeroSlide = 0;
        this.heroSlideTimer = null;
        this.init();
    }

    init() {
        this.applyBranding();
        this.loadPageData();
        this.syncStatsWithDatabase();
        this.loadMandateData();
        this.loadSynthesisData();
        this.loadActivePoll();
        this.loadSubventionsPublicData();
        this.loadProceduresData();
        // publications handled in loadPageData();
        this.bindEvents();
        this.checkAdminControlsVisibility();
        this.initHeroSlider();
        this.exposeGlobalHelpers();
        this.setupRealtimeSync();
    }

    setupRealtimeSync() {
        // Cross-tab real-time storage event synchronization with back office
        window.addEventListener('storage', (e) => {
            console.log('⚡ Realtime Back-Office Sync triggered by key:', e.key);
            this.applyBranding();
            this.loadPageData();
            this.syncStatsWithDatabase();
            this.loadMandateData();
            this.loadSynthesisData();
            this.loadActivePoll();
            this.loadSubventionsPublicData();
            this.loadProceduresData();
        });

        // Window focus synchronization when user switches back to display tab
        window.addEventListener('focus', () => {
            this.applyBranding();
            this.loadPageData();
            this.syncStatsWithDatabase();
            this.loadMandateData();
            this.loadSynthesisData();
            this.loadActivePoll();
            this.loadSubventionsPublicData();
            this.loadProceduresData();
        });
    }

    applyBranding() {
        const branding = BrandingModel.get();
        if (!branding) return;

        const muniName = branding.muniName || 'جماعة بيوكرى';
        const cityName = branding.cityName || branding.weatherCity || 'بيوكرى';

        // 1. Document Title
        document.title = `${muniName} | البوابة الرقمية الرسمية`;

        // 2. CSS Custom Properties / Colors
        const root = document.documentElement;
        if (branding.primaryColor) root.style.setProperty('--primary-color', branding.primaryColor);
        if (branding.secondaryColor) root.style.setProperty('--secondary-color', branding.secondaryColor);
        if (branding.creamColor) {
            root.style.setProperty('--cream-bg', branding.creamColor);
            root.style.setProperty('--sand-bg', branding.creamColor);
        }
        if (branding.accentColor) root.style.setProperty('--accent-color', branding.accentColor);
        if (branding.terracottaColor) root.style.setProperty('--terracotta', branding.terracottaColor);
        if (branding.darkColor) {
            root.style.setProperty('--dark-color', branding.darkColor);
            root.style.setProperty('--night-bg', branding.darkColor);
        }
        if (branding.textColor) root.style.setProperty('--text-main', branding.textColor);

        // 3. Municipality Name across all displays
        document.querySelectorAll('.muni-name-display').forEach(el => {
            el.textContent = muniName;
        });

        // 4. Header Brand
        const brandSmall = document.querySelector('.brand small') || document.getElementById('brandCitySub');
        if (brandSmall) {
            brandSmall.textContent = `Commune de ${cityName}`;
        }

        // 5. Hero Section Title & Gold City Name
        const heroTitleGold = document.querySelector('.hero-title-gold') || document.getElementById('heroMuniName');
        if (heroTitleGold) {
            heroTitleGold.textContent = cityName;
        }

        // 6. Section Subtitles referencing City
        const newsSubtitle = document.querySelector('.news-master-subtitle');
        if (newsSubtitle) {
            newsSubtitle.textContent = `تابعوا آخر المستجدات والأنشطة الجماعية لـ ${cityName}`;
        }
        const projSubtitle = document.querySelector('.projects-master-subtitle');
        if (projSubtitle) {
            projSubtitle.textContent = `مشاريع كبرى من أجل تنمية شاملة ومستدامة لمدينة ${cityName}`;
        }
        const mandateTitle = document.querySelector('.mandate-main-title');
        if (mandateTitle) {
            mandateTitle.textContent = `مؤسسة المجلس الجماعي لـ ${cityName} (الولاية 2021-2027)`;
        }

        // 7. Footer
        const footerTitle = document.getElementById('footerMuniName') || document.querySelector('.footer-col-title');
        if (footerTitle) {
            footerTitle.textContent = muniName;
        }
        const footerLogo = document.getElementById('footerLogoMainImg') || document.querySelector('.footer-logo-main') || document.querySelector('.footer-crest-img');
        if (footerLogo && branding.logoUrl) footerLogo.src = branding.logoUrl;

        // 8. Header Logo
        const headerLogo = document.getElementById('mainLogoHeaderImg') || document.querySelector('.royal-crest-img');
        if (headerLogo) {
            if (branding.logoUrl) headerLogo.src = branding.logoUrl;
            headerLogo.alt = `المملكة المغربية - ${muniName}`;
        }

        // 9. Weather Widgets
        const wCity = document.getElementById('weatherCityMini') || document.getElementById('weatherCityDisplay');
        const wTemp = document.getElementById('weatherTempMini') || document.getElementById('weatherTempDisplay');
        if (wCity) wCity.textContent = cityName;
        if (wTemp) wTemp.textContent = branding.weatherTemp || '23°C';

        // 10. Contact Info
        const fPhone = document.getElementById('footerPhoneDisplay');
        const fEmail = document.getElementById('footerEmailDisplay');
        const fAddress = document.getElementById('footerAddressDisplay');
        const fHours = document.getElementById('footerHoursDisplay');
        if (fPhone) fPhone.textContent = branding.phone || '+212 528 84 00 00';
        if (fEmail) fEmail.textContent = branding.email || 'contact@commune.ma';
        if (fAddress) fAddress.textContent = branding.address || 'المقر الرئيسي للجماعة';
        if (fHours) fHours.textContent = branding.workingHours || 'من الإثنين إلى الجمعة: 08:30 - 16:30';

        // 11. Slogan & Hero Subtitle
        const sloganEl = document.querySelector('.slogan-text');
        if (sloganEl && branding.slogan) sloganEl.textContent = branding.slogan;

        const heroSubEl = document.querySelector('.hero-main-subtitle');
        if (heroSubEl && branding.heroSubtitle) heroSubEl.textContent = branding.heroSubtitle;

        // 12. Hero 3D Stage Slides
        const s1 = document.getElementById('stageCardLeft');
        if (s1) {
            const t = s1.querySelector('.stage-card-title');
            const st = s1.querySelector('.stage-card-subtitle');
            const img = s1.querySelector('.stage-img');
            const badge = s1.querySelector('.card-glass-badge span:first-child');
            const date = s1.querySelector('.stage-card-date');
            if (t && branding.heroSlide1Title) t.textContent = branding.heroSlide1Title;
            if (st && branding.heroSlide1Subtitle) st.textContent = branding.heroSlide1Subtitle;
            if (img && branding.heroSlide1Img) img.src = branding.heroSlide1Img;
            if (badge && branding.heroSlide1Badge) badge.textContent = branding.heroSlide1Badge;
            if (date && branding.heroSlide1Date) date.textContent = branding.heroSlide1Date;
        }

        const s2 = document.getElementById('stageCardCenter');
        if (s2) {
            const t = s2.querySelector('.stage-card-title');
            const st = s2.querySelector('.stage-card-subtitle');
            const img = s2.querySelector('.stage-img');
            const badge = s2.querySelector('.card-glass-badge span:first-child');
            const date = s2.querySelector('.stage-card-date');
            if (t && branding.heroSlide2Title) t.textContent = branding.heroSlide2Title;
            if (st && branding.heroSlide2Subtitle) st.textContent = branding.heroSlide2Subtitle;
            if (img && branding.heroSlide2Img) img.src = branding.heroSlide2Img;
            if (badge && branding.heroSlide2Badge) badge.textContent = branding.heroSlide2Badge;
            if (date && branding.heroSlide2Date) date.textContent = branding.heroSlide2Date;
        }

        const s3 = document.getElementById('stageCardRight');
        if (s3) {
            const t = s3.querySelector('.stage-card-title');
            const st = s3.querySelector('.stage-card-subtitle');
            const img = s3.querySelector('.stage-img');
            const badge = s3.querySelector('.card-glass-badge span:first-child');
            const date = s3.querySelector('.stage-card-date');
            if (t && branding.heroSlide3Title) t.textContent = branding.heroSlide3Title;
            if (st && branding.heroSlide3Subtitle) st.textContent = branding.heroSlide3Subtitle;
            if (img && branding.heroSlide3Img) img.src = branding.heroSlide3Img;
            if (badge && branding.heroSlide3Badge) badge.textContent = branding.heroSlide3Badge;
            if (date && branding.heroSlide3Date) date.textContent = branding.heroSlide3Date;
        }

        if (branding.heroBgImg) {
            const landscape = document.querySelector('.stats-box-landscape');
            if (landscape) landscape.style.backgroundImage = 'url("' + branding.heroBgImg + '")';
        }

        if (window.rotatePanoSlide) {
            window.rotatePanoSlide(window.activePanoIdx || 0);
        }

        // 13. Portal Curved Ribbon Stats
        const statsSub = document.querySelector('.stats-curved-subtitle');
        if (statsSub && branding.statsSubtitle) statsSub.innerHTML = `${branding.statsSubtitle}`;

        const s1Num = document.getElementById('statServicesCount');
        if (s1Num) {
            s1Num.textContent = branding.stat1Val || '+120';
            const s1Lbl = s1Num.nextElementSibling;
            if (s1Lbl && branding.stat1Label) s1Lbl.textContent = branding.stat1Label;
        }
        const s2Num = document.getElementById('statTransparencyRate');
        if (s2Num) {
            s2Num.textContent = branding.stat2Val || '+98%';
            const s2Lbl = s2Num.nextElementSibling;
            if (s2Lbl && branding.stat2Label) s2Lbl.textContent = branding.stat2Label;
        }
        const s3Num = document.getElementById('statMandatePeriod');
        if (s3Num) {
            s3Num.textContent = branding.stat3Val || '+12';
            const s3Lbl = s3Num.nextElementSibling;
            if (s3Lbl && branding.stat3Label) s3Lbl.textContent = branding.stat3Label;
        }
        const s4Num = document.getElementById('statProjectsCount');
        if (s4Num) {
            s4Num.textContent = branding.stat4Val || '+45';
            const s4Lbl = s4Num.nextElementSibling;
            if (s4Lbl && branding.stat4Label) s4Lbl.textContent = branding.stat4Label;
        }

        // 14. Social Media Links
        if (branding.facebookUrl) document.querySelectorAll('a[aria-label="Facebook"], a[href*="facebook.com"]').forEach(a => a.href = branding.facebookUrl);
        if (branding.twitterUrl) document.querySelectorAll('a[aria-label="Twitter"], a[href*="twitter.com"]').forEach(a => a.href = branding.twitterUrl);
        if (branding.instagramUrl) document.querySelectorAll('a[aria-label="Instagram"], a[href*="instagram.com"]').forEach(a => a.href = branding.instagramUrl);
        if (branding.youtubeUrl) document.querySelectorAll('a[aria-label="YouTube"], a[href*="youtube.com"]').forEach(a => a.href = branding.youtubeUrl);

        // 11. Ticker
        const tickerSec = document.getElementById('tickerSection');
        const tickerContent = document.getElementById('tickerContent');
        if (tickerSec) tickerSec.style.display = branding.showTicker ? 'block' : 'none';
        if (tickerContent && branding.tickerText) tickerContent.textContent = branding.tickerText;

        // 12. Section Visibility Toggles
        const urbanSec = document.getElementById('urban-development');
        if (urbanSec) urbanSec.style.display = branding.showUrban !== false ? 'block' : 'none';

        const servicesSec = document.getElementById('servicesSection');
        if (servicesSec) servicesSec.style.display = branding.showServices !== false ? 'block' : 'none';

        const pubSec = document.getElementById('publicationsSection');
        if (pubSec) pubSec.style.display = branding.showPublications !== false ? 'block' : 'none';

        const eventSec = document.getElementById('events');
        if (eventSec) eventSec.style.display = branding.showEvents !== false ? 'block' : 'none';

        const multiSec = document.getElementById('multimedia');
        if (multiSec) multiSec.style.display = branding.showMultimedia !== false ? 'block' : 'none';
    }

    loadPageData() {
        try {
            const news = NewsModel.getAll();
            NewsView.renderList(news);
        } catch (e) { console.error('Error rendering news:', e); }

        try {
            const projects = ProjectModel.getAll();
            ProjectView.renderGrid(projects, 'projectsShowcaseGrid');
        } catch (e) { console.error('Error rendering projects:', e); }

        try {
            const publications = PublicationModel.getAll();
            PublicationView.renderList(publications);
        } catch (e) { console.error('Error rendering publications:', e); }

        try {
            const events = EventModel.getAll();
            EventView.renderList(events, 'eventsGridContainer');
        } catch (e) { console.error('Error rendering events:', e); }

        try {
            const videos = VideoModel.getAll();
            VideoView.renderGrid(videos, 'galleryThumbsRow');
        } catch (e) { console.error('Error rendering videos:', e); }

        try {
            const services = ServiceModel.getAll();
            this.renderServicesHub(services);
        } catch (e) { console.error('Error rendering services:', e); }
    }

    renderServicesHub(services) {
        const container = document.getElementById('servicesHubContainer');
        if (!container) return;

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

    // ==========================================
    // HERO VIDEO SLIDER (مع الدخلة)
    // ==========================================
    initHeroSlider() {
        const slides = document.querySelectorAll('.hero-slide');
        if (slides.length <= 1) return;

        this.startHeroAutoSlide();
    }

    goToHeroSlide(index) {
        const slides = document.querySelectorAll('.hero-slide');
        const dots = document.querySelectorAll('.slider-dot');
        if (slides.length === 0) return;

        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));

        this.currentHeroSlide = (index + slides.length) % slides.length;
        if (slides[this.currentHeroSlide]) slides[this.currentHeroSlide].classList.add('active');
        if (dots[this.currentHeroSlide]) dots[this.currentHeroSlide].classList.add('active');

        this.startHeroAutoSlide();
    }

    nextHeroSlide() {
        this.goToHeroSlide(this.currentHeroSlide + 1);
    }

    prevHeroSlide() {
        this.goToHeroSlide(this.currentHeroSlide - 1);
    }

    startHeroAutoSlide() {
        if (this.heroSlideTimer) clearInterval(this.heroSlideTimer);
        this.heroSlideTimer = setInterval(() => {
            this.nextHeroSlide();
        }, 7000);
    }

    // ==========================================
    // CITIZEN SENTIMENT & OPINION POLL (سبر الآراء والمشاعر)
    // ==========================================
    loadActivePoll() {
        const poll = PollModel.getActivePoll();
        if (!poll) {
            const sec = document.getElementById('citizenPollSection');
            if (sec) sec.style.display = 'none';
            return;
        }

        const questionEl = document.getElementById('pollQuestionText');
        const categoryEl = document.getElementById('pollCategoryBadge');
        const dateEl = document.getElementById('pollDateDisplay');
        const totalVotesEl = document.getElementById('pollTotalVotesCount');

        if (questionEl) questionEl.innerText = poll.question;
        if (categoryEl) categoryEl.innerText = `🗳️ ${poll.category || 'استطلاع رأي المواطنين'}`;
        if (dateEl) dateEl.innerText = `تاريخ النشر: ${poll.createdAt}`;
        if (totalVotesEl) totalVotesEl.innerText = `إجمالي المصوتين: ${poll.totalVotes} مواطن`;

        this.renderPollResults(poll);
    }

    renderPollResults(poll) {
        const barsList = document.getElementById('pollBarsList');
        if (!barsList) return;

        if (poll.type === 'sentiment' && poll.sentimentOptions) {
            barsList.innerHTML = poll.sentimentOptions.map(opt => {
                const pct = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
                return `
                    <div class="poll-result-bar-item">
                        <div class="poll-bar-header">
                            <span>${opt.emoji} ${opt.label}</span>
                            <span><strong>${pct}%</strong> (${opt.votes} صوت)</span>
                        </div>
                        <div class="poll-progress-track">
                            <div class="poll-progress-fill" style="width: ${pct}%;"></div>
                        </div>
                    </div>
                `;
            }).join('');
        } else if (poll.options) {
            barsList.innerHTML = poll.options.map(opt => {
                const pct = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
                return `
                    <div class="poll-result-bar-item">
                        <div class="poll-bar-header">
                            <span>${opt.label}</span>
                            <span><strong>${pct}%</strong> (${opt.votes} صوت)</span>
                        </div>
                        <div class="poll-progress-track">
                            <div class="poll-progress-fill" style="width: ${pct}%;"></div>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    submitSentimentVote(key) {
        const poll = PollModel.getActivePoll();
        if (!poll) return;

        if (PollModel.hasUserVoted(poll.id)) {
            alert('لقد قمت بالتصويت مسبقاً في هذا الاستطلاع. شكراً لمشاركتك الإيجابية!');
            return;
        }

        const updatedPoll = PollModel.voteSentiment(poll.id, key);
        if (updatedPoll) {
            // Highlight chosen button
            document.querySelectorAll('.sentiment-emoji-btn').forEach(btn => btn.classList.remove('voted'));
            const clickedBtn = event?.currentTarget;
            if (clickedBtn) clickedBtn.classList.add('voted');

            const totalVotesEl = document.getElementById('pollTotalVotesCount');
            if (totalVotesEl) totalVotesEl.innerText = `إجمالي المصوتين: ${updatedPoll.totalVotes} مواطن`;

            this.renderPollResults(updatedPoll);
            alert('تم تسجيل رأيكم ومشاعركم بنجاح! شكراً لمساهمتكم في تقييم العمل الجماعي.');
        }
    }

    // ==========================================
    // MANDATE 2021-2027 POPUP (تشكيلة المجلس)
    // ==========================================
    openMandateModal() {
        const overlay = document.getElementById('mandateModalOverlay');
        if (overlay) {
            overlay.style.display = 'flex';
            this.switchMandateTab('bureau');
        }
    }

    closeMandateModal() {
        const overlay = document.getElementById('mandateModalOverlay');
        if (overlay) overlay.style.display = 'none';
    }

    switchMandateTab(tab) {
        const mandate = MandateModel.get();
        if (!mandate) return;

        const content = document.getElementById('mandateTabContent');
        if (!content) return;

        const btnB = document.getElementById('tabBtnBureau');
        const btnC = document.getElementById('tabBtnCommittees');
        const btnCo = document.getElementById('tabBtnCouncil');
        if (btnB) btnB.className = (tab === 'bureau') ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm';
        if (btnC) btnC.className = (tab === 'committees') ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm';
        if (btnCo) btnCo.className = (tab === 'council') ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm';

        if (tab === 'bureau') {
            content.innerHTML = `
                <div class="mandate-grid-cards">
                    ${mandate.bureau.map(m => `
                        <div class="mandate-member-card">
                            <div class="mandate-member-role">${m.role}</div>
                            <div class="mandate-member-name">${m.name}</div>
                            <div style="font-size: 0.85rem; color: #64748b;">الانتماء: ${m.party || 'الأغلبية'}</div>
                            ${m.phone ? `<div style="font-size: 0.85rem; color: var(--primary-color); margin-top: 6px;">📞 ${m.phone}</div>` : ''}
                            <button type="button" onclick="openMemberCv('${m.name}', '${m.role}', '${m.cv || 'عضو المكتب المسير لجماعة بيوكرى'}', 'المكتب المسير')" class="btn btn-outline btn-sm" style="margin-top: 10px; width: 100%; font-size: 0.8rem; border-color: #cbd5e1;">
                                <span>📄 السيرة الذاتية [CV]</span>
                            </button>
                        </div>
                    `).join('')}
                </div>
            `;
        } else if (tab === 'committees') {
            content.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 16px;">
                    ${mandate.committees.map(c => `
                        <div style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; background: #ffffff; border-right: 5px solid var(--accent-color); box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 10px;">
                                <div>
                                    <h4 style="color: var(--primary-color); font-size: 1.2rem; font-weight: 800; margin: 0 0 6px 0;">${c.name}</h4>
                                    <p style="font-size: 0.92rem; color: #475569; margin: 0 0 12px 0;">${c.description}</p>
                                </div>
                                <span class="badge badge-info" style="font-size: 0.85rem; padding: 4px 10px;">${c.membersCount} أعضاء</span>
                            </div>
                            <div style="display: flex; gap: 18px; font-size: 0.9rem; font-weight: 700; color: #1e293b; margin-bottom: 14px; background: #f8fafc; padding: 10px 14px; border-radius: 8px;">
                                <span>رئيس اللجنة: <strong style="color: var(--primary-color);">${c.president}</strong></span>
                                <span>نائب الرئيس: <strong style="color: var(--primary-color);">${c.vice}</strong></span>
                            </div>
                            <div style="margin-top: 12px; border-top: 1px dashed #e2e8f0; padding-top: 12px;">
                                <div style="font-size: 0.86rem; font-weight: 800; color: #64748b; margin-bottom: 10px;">أعضاء اللجنة [معاينة السيرة الذاتية CV]:</div>
                                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                    ${(c.membersList || []).map(m => `
                                        <button type="button" onclick="openMemberCv('${m.name}', '${m.role}', '${m.cv}', '${c.name}')" class="btn btn-outline btn-sm" style="background: #f8fafc; border-color: #cbd5e1; font-size: 0.82rem; padding: 6px 12px; border-radius: 6px; cursor: pointer;">
                                            <span>👤 ${m.name}</span>
                                            <span style="background: #1e3a8a; color: #ffffff; padding: 2px 6px; border-radius: 4px; font-size: 0.72rem; margin-right: 6px;">CV 📄</span>
                                        </button>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        } else if (tab === 'council') {
            content.innerHTML = `
                <div style="overflow-x: auto;">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>الاسم الكامل</th>
                                <th>الصفة في المجلس</th>
                                <th>الدائرة الانتخابية</th>
                                <th>اللجنة التابع لها</th>
                                <th>السيرة الذاتية</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${mandate.councilMembers.map(m => `
                                <tr>
                                    <td><strong>${m.name}</strong></td>
                                    <td><span class="badge badge-info">${m.role}</span></td>
                                    <td>${m.district || '-'}</td>
                                    <td>${m.committee || '-'}</td>
                                    <td>
                                        <button type="button" onclick="openMemberCv('${m.name}', '${m.role}', '${m.cv || 'مستشار جماعي بالمجلس الجماعي لبيوكرى'}', '${m.committee || 'المجلس الجماعي'}')" class="btn btn-outline btn-sm" style="font-size: 0.78rem; padding: 4px 10px; cursor: pointer;">
                                            <span>معاينة CV 📄</span>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
    }
    // ==========================================
    // SUBVENTIONS PUBLIC MODAL (دعم الجمعيات)
    // ==========================================
    openSubventionsModal() {
        const overlay = document.getElementById('subventionsModalOverlay');
        if (overlay) {
            overlay.style.display = 'flex';
            this.loadSubventionsPublicData();
        }
    }

    closeSubventionsModal() {
        const overlay = document.getElementById('subventionsModalOverlay');
        if (overlay) overlay.style.display = 'none';
    }

    loadSubventionsPublicData() {
        const sub = SubventionModel.get();
        if (!sub) return;

        const titleEl = document.getElementById('subventionDecisionTitleDisplay');
        const detailsEl = document.getElementById('subventionDecisionDetailsDisplay');
        const deadlineEl = document.getElementById('subventionDeadlineDisplay');
        if (titleEl && sub.decisionTitle) titleEl.textContent = sub.decisionTitle;
        if (detailsEl && sub.decisionDetails) detailsEl.textContent = sub.decisionDetails;
        if (deadlineEl && sub.deadline) deadlineEl.textContent = `📅 آخر أجل لإيداع الملفات: ${sub.deadline}`;

        const renderRows = (tbody) => {
            if (!tbody) return;
            tbody.innerHTML = (sub.beneficiaries || []).map((b, idx) => {
                const formattedAmount = Number(b.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                const progressPct = b.progress || 80;
                const annualRef = b.annualRef || `2026/${String((idx + 1) * 2 - 1).padStart(2, '0')}`;
                const legalBadge = b.legalStatus || 'موافقة';
                const domainIcon = b.domainIcon ? ` <span class="tag-ico">${b.domainIcon}</span>` : '';
                const projName = b.projectName || b.projectSupported || b.assocName;

                return `
                <tr class="subvention-table-row">
                    <td class="col-sub-assoc">
                        <div class="assoc-name-wrapper">
                            <strong class="assoc-name-title">${projName}</strong>
                            <span class="assoc-sub-name">${b.assocName}</span>
                        </div>
                    </td>
                    <td class="col-sub-domain">
                        <span class="assoc-domain-tag">${b.assocType}${domainIcon}</span>
                    </td>
                    <td class="col-sub-legal">
                        <span class="assoc-legal-tag">${legalBadge}</span>
                    </td>
                    <td class="col-sub-status">
                        <span class="assoc-status-pill">
                            <span class="status-check-ico">✔</span>
                            <span>${b.statutStatus || 'مطابقة'}</span>
                        </span>
                    </td>
                    <td class="col-sub-ref">
                        <span class="assoc-ref-tag">${annualRef}</span>
                    </td>
                    <td class="col-sub-amount">
                        <div class="assoc-amount-row">
                            <span class="assoc-pct-val">${progressPct}%</span>
                            <span class="assoc-amount-val">${formattedAmount}</span>
                            <div class="assoc-bar-track">
                                <div class="assoc-bar-fill" style="width: ${progressPct}%;"></div>
                            </div>
                        </div>
                    </td>
                    <td class="col-sub-action">
                        <button type="button" onclick="openAssocDetails(${b.id})" class="btn-assoc-details-lux">
                            <span class="btn-action-ico">📄</span>
                            <span>تفاصيل المشروع</span>
                        </button>
                    </td>
                </tr>
                `;
            }).join('');
        };

        renderRows(document.getElementById('publicSubventionsTableBody'));
        renderRows(document.getElementById('frontSubventionsTableBody'));
        renderRows(document.getElementById('subventionsModalTableBody'));

        // Render Categories Distribution Cards (5 Elevated Porcelain Luxury Cards)
        const catGrid = document.getElementById('subventionsCatDistributionGrid');
        if (catGrid && sub.categoriesDistribution) {
            catGrid.innerHTML = sub.categoriesDistribution.map(c => {
                let domainIco = c.icon || '🏛️';
                if (c.category.includes('رياضية')) domainIco = '🏃‍♂️';
                else if (c.category.includes('ثقافية')) domainIco = '🏛️';
                else if (c.category.includes('اجتماعية')) domainIco = '👥';
                else if (c.category.includes('بيئية')) domainIco = '🍃';
                else if (c.category.includes('تعليمية')) domainIco = '📖';

                return `
                <div class="subvention-cat-lux-card">
                    <div class="cat-card-top-row">
                        <span class="cat-count-pill">${c.count} الجمعيات</span>
                        <div class="cat-card-medallion">${domainIco}</div>
                    </div>
                    <div class="cat-card-main-content">
                        <h4 class="cat-card-title">${c.category}</h4>
                        <span class="cat-card-label">المبلغ الإجمالي للدعم</span>
                        <div class="cat-card-amount-val">${Number(c.totalAmount).toLocaleString()} <small>درهم</small></div>
                    </div>
                    <div class="cat-card-progress-footer">
                        <span class="cat-card-pct">${c.percentage}%</span>
                        <div class="cat-card-track">
                            <div class="cat-card-fill" style="width: ${c.percentage}%;"></div>
                        </div>
                    </div>
                </div>
                `;
            }).join('');
        }

        // Initialize Eligibility Questionnaire (Crée question)
        this.selectSubventionCategory('رياضية');
    }

    downloadSubventionFiche() {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html lang="ar" dir="rtl">
            <head>
                <title>استمارة طلب الدعم السنوي للجماعة الترابية</title>
                <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;600;700&display=swap" rel="stylesheet">
                <style>
                    body { font-family: 'IBM Plex Sans Arabic', sans-serif; direction: rtl; padding: 40px; color: #1e293b; line-height: 1.8; }
                    .header { text-align: center; border-bottom: 2px solid #0d5ea6; padding-bottom: 20px; margin-bottom: 30px; }
                    h1 { color: #0d5ea6; font-size: 1.6rem; margin-top: 10px; }
                    .box { border: 1px solid #cbd5e1; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
                    .title { font-weight: 700; color: #0d5ea6; margin-bottom: 12px; font-size: 1.15rem; }
                    .field-line { margin-bottom: 12px; border-bottom: 1px dotted #cbd5e1; padding-bottom: 6px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                    th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: right; }
                    th { background: #f1f5f9; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div>المملكة المغربية • وزارة الداخلية • الجماعة الترابية</div>
                    <h1>استمارة وملف طلب منحة / دعم مالي لفائدة الجمعيات (Fiche de Demande)</h1>
                    <div>برسم السنة المالية ${new Date().getFullYear()}</div>
                </div>

                <div class="box">
                    <div class="title">1. التعريف بالجمعية أو الاتحاد</div>
                    <div class="field-line">اسم الجمعية الكامل: ............................................................................</div>
                    <div class="field-line">رقم وتاريخ وصل الإيداع القانوني النهائي: ...........................................................</div>
                    <div class="field-line">اسم الرئيس(ة): ............................................. رقم الهاتف: ...........................</div>
                    <div class="field-line">رقم الحساب البنكي (RIB - 24 رقماً): ...........................................................</div>
                </div>

                <div class="box">
                    <div class="title">2. الوثائق القانونية المرفقة الواجب الإدلاء بها (Dossier Juridique)</div>
                    <table>
                        <tr><th>الوثيقة المطلوبة</th><th>الوضعية</th></tr>
                        <tr><td>نسخة من القانون الأساسي محين ومصادق عليه</td><td>[ ] نعم  [ ] لا</td></tr>
                        <tr><td>نسخة من وصل الإيداع القانوني المسلم من السلطة المحلية</td><td>[ ] نعم  [ ] لا</td></tr>
                        <tr><td>لائحة أعضاء المكتب المسير للجمعية مع أرقام بطاقاتهم</td><td>[ ] نعم  [ ] لا</td></tr>
                        <tr><td>التقريرين الأدبي والمالي لآخر جمع عام مصادق عليهما</td><td>[ ] نعم  [ ] لا</td></tr>
                        <tr><td>شهادة التعريف البنكي الأصلية (Attestation de RIB)</td><td>[ ] نعم  [ ] لا</td></tr>
                    </table>
                </div>

                <div class="box">
                    <div class="title">3. موضوع المشروع أو النشاط المراد تمويله ومبلغ الدعم المطلوب</div>
                    <div class="field-line">عنوان المشروع / النشاط: ....................................................................</div>
                    <div class="field-line">المبلغ المالي المطلوب من الجماعة (بالدرهم): ..................................................</div>
                    <div class="field-line">مساهمة الجمعية أو الشركاء الآخرين: ...........................................................</div>
                </div>

                <div style="display: flex; justify-content: space-between; margin-top: 50px;">
                    <div><strong>توقيع وخاتم رئيس الجمعية:</strong></div>
                    <div><strong>تاريخ وتأشيرة مكتب الضبط بالجماعة:</strong></div>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => { printWindow.print(); }, 500);
    }

    // ==========================================
    // LEGAL POPUP (Zoom effect)
    // ==========================================
    openLegalPopup() {
        const overlay = document.getElementById('legalPopupOverlay');
        if (overlay) overlay.classList.add('active');
    }

    closeLegalPopup() {
        const overlay = document.getElementById('legalPopupOverlay');
        if (overlay) overlay.classList.remove('active');
    }

    openNewsModal(id) {
        const item = NewsModel.getById(id);
        if (item) {
            NewsView.showDetailModal(item);
        }
    }

    openProjectModal(id) {
        const proj = ProjectModel.getById(id);
        const overlay = document.getElementById('modalOverlay');
        const body = document.getElementById('modalBody');
        if (!overlay || !body) return;

        if (proj) {
            body.innerHTML = `
                <div style="text-align: right; padding: 10px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                        <span class="hero-badge-tag" style="background: rgba(15, 157, 138, 0.15); color: var(--secondary-color); font-weight: 700;">${proj.status}</span>
                        <span style="color: var(--accent-color); font-weight: 800; font-size: 1rem;">نسبة الإنجاز: ${proj.progress}%</span>
                    </div>
                    <h2 style="font-size: 1.5rem; color: var(--primary-color); margin-bottom: 12px; font-weight: 800;">${proj.title}</h2>
                    <div class="urban-progress-wrapper" style="margin-bottom: 18px;">
                        <div class="urban-progress-bar" style="width: ${proj.progress}%;"></div>
                    </div>
                    <p style="font-size: 0.95rem; color: var(--text-main); line-height: 1.8; white-space: pre-line;">${proj.details || 'مشروع تنموي معتمد في إطار برنامج التنمية الحضرية لجماعة بيوكرى.'}</p>
                    <div style="margin-top: 20px; padding: 12px; background: #f8fafc; border-radius: 10px; font-size: 0.9rem; border-right: 3px solid var(--accent-color);">
                        <strong>الميزانية المرصودة:</strong> ${proj.budget}
                    </div>
                </div>
            `;
            overlay.style.display = 'flex';
        }
    }

    openEventModal(id) {
        const events = EventModel.getAll();
        const ev = events.find(e => e.id === id);
        const overlay = document.getElementById('modalOverlay');
        const body = document.getElementById('modalBody');
        if (!overlay || !body) return;

        if (ev) {
            body.innerHTML = `
                <div style="text-align: right; padding: 10px;">
                    <div style="height: 220px; border-radius: 14px; overflow: hidden; margin-bottom: 16px;">
                        <img src="${ev.image || 'assets/event_right.png'}" alt="${ev.title}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <span style="display: inline-block; background: var(--accent-color); color: #0B1530; padding: 4px 14px; border-radius: 20px; font-size: 0.85rem; margin-bottom: 10px; font-weight: 800;">
                        📅 ${ev.date}
                    </span>
                    <h2 style="font-size: 1.35rem; color: var(--primary-color); margin-bottom: 14px; font-weight: 800; line-height: 1.4;">${ev.title}</h2>
                    <p style="font-size: 0.95rem; color: var(--text-main); line-height: 1.8;">
                        تخليداً للأنشطة التواصلية والتنموية، تنظم جماعة بيوكرى هذه الفعالية بمشاركة مختلف الفاعلين المحليين وممثلي المجتمع المدني لتعزيز التقارب وخدمة الصالح العام.
                    </p>
                    <div style="margin-top: 14px; color: var(--text-muted); font-size: 0.9rem;">
                        📍 المكان: ${ev.location || 'المقر الرئيسي للجماعة الترابية لبيوكرى'}
                    </div>
                </div>
            `;
            overlay.style.display = 'flex';
        }
    }

    // ==========================================
    // DYNAMIC STATS SECTION LIVE SYNC
    // ==========================================
    syncStatsWithDatabase() {
        try {
            const branding = BrandingModel.get() || {};

            const statProjects = document.getElementById('statProjectsCount');
            if (statProjects) {
                const val = branding.stat4Val || '+45';
                statProjects.textContent = val;
                statProjects.setAttribute('data-target', val.replace(/[^0-9]/g, '') || '45');
                const lbl = statProjects.nextElementSibling;
                if (lbl && branding.stat4Label) lbl.textContent = branding.stat4Label;
            }

            const statPeriod = document.getElementById('statMandatePeriod');
            if (statPeriod) {
                const val = branding.stat3Val || '+12';
                statPeriod.textContent = val;
                statPeriod.setAttribute('data-target', val.replace(/[^0-9]/g, '') || '12');
                const lbl = statPeriod.nextElementSibling;
                if (lbl && branding.stat3Label) lbl.textContent = branding.stat3Label;
            }

            const statTransparency = document.getElementById('statTransparencyRate');
            if (statTransparency) {
                const val = branding.stat2Val || '+98%';
                statTransparency.textContent = val;
                statTransparency.setAttribute('data-target', val.replace(/[^0-9]/g, '') || '98');
                const lbl = statTransparency.nextElementSibling;
                if (lbl && branding.stat2Label) lbl.textContent = branding.stat2Label;
            }

            const statServices = document.getElementById('statServicesCount');
            if (statServices) {
                const val = branding.stat1Val || '+120';
                statServices.textContent = val;
                statServices.setAttribute('data-target', val.replace(/[^0-9]/g, '') || '120');
                const lbl = statServices.nextElementSibling;
                if (lbl && branding.stat1Label) lbl.textContent = branding.stat1Label;
            }
        } catch (e) {
            console.error('Error syncing stats:', e);
        }
    }

    // ==========================================
    // MANDATE 2021-2027 SHOWCASE DATA LOADER (3D LUXURY SUITE)
    // ==========================================
    loadMandateData() {
        const mandate = MandateModel.get();
        if (!mandate) return;

        // Render Mayor Card on Homepage
        const mayorNameEl = document.getElementById('mandateMayorName');
        const mayorRoleEl = document.getElementById('mandateMayorRole');
        const mayorQuoteEl = document.getElementById('mandateMayorQuote');
        if (mayorNameEl && mandate.bureau && mandate.bureau.length > 0) {
            mayorNameEl.textContent = mandate.bureau[0].name;
        }
        if (mayorRoleEl && mandate.bureau && mandate.bureau.length > 0) {
            mayorRoleEl.textContent = mandate.bureau[0].role;
        }
        if (mayorQuoteEl && mandate.bureau && mandate.bureau[0].quote) {
            mayorQuoteEl.textContent = mandate.bureau[0].quote;
        }

        // Render Bureau preview cards
        const bureauGrid = document.getElementById('mandateBureauGrid');
        if (bureauGrid && mandate.bureau) {
            bureauGrid.innerHTML = mandate.bureau.slice(1, 5).map(m => `
                <div class="bureau-card" onclick="openMandateModal()" role="button" tabindex="0">
                    <div class="vice-card-zellige-watermark"></div>
                    <div class="vice-medallion-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="#0A3158">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                    </div>
                    <div class="bureau-role">${m.role}</div>
                    <div class="bureau-assignment">${m.assignment || ''}</div>
                    <div class="bureau-name">${m.name}</div>
                    <div class="bureau-party">${m.party || 'الأغلبية'}</div>
                </div>
            `).join('');
        }
    }

    // ==========================================
    // SYNTHESIS REPORT & STRATEGIC AXES LOADER (ULTRA-PREMIUM 3D SUITE)
    // ==========================================
    loadSynthesisData() {
        const report = SynthesisReportModel.get();
        if (!report) return;

        const titleEl = document.getElementById('synthesisReportTitle');
        const introEl = document.getElementById('synthesisReportIntro');
        const periodEl = document.getElementById('synthesisReportPeriod');

        if (titleEl && report.title) {
            titleEl.innerHTML = `${report.title} <span class="synthesis-period-tag" id="synthesisReportPeriod">${report.reportingPeriod || '2027-2021'}</span>`;
        }
        if (introEl && report.subtitle) {
            introEl.textContent = report.subtitle;
        }

        // Executive Metrics Bar
        if (report.executiveMetrics) {
            const m = report.executiveMetrics;
            const tProjects = document.getElementById('synthesisTotalProjects');
            const cProjects = document.getElementById('synthesisCompletedProjects');
            const ipProjects = document.getElementById('synthesisInProgressProjects');
            const oProgress = document.getElementById('synthesisOverallProgress');
            const tBudget = document.getElementById('synthesisTotalBudget');

            if (tProjects) tProjects.textContent = m.totalProjects;
            if (cProjects) cProjects.textContent = m.completedProjects;
            if (ipProjects) ipProjects.textContent = m.inProgressProjects;
            if (oProgress) oProgress.textContent = `${m.overallProgress}%`;
            if (tBudget) tBudget.textContent = Number(m.totalBudget).toLocaleString();
        }

        // Render 4 Strategic Development Domains Cards
        const axesContainer = document.getElementById('synthesisAxesGrid');
        if (axesContainer && report.activityAxes) {
            axesContainer.innerHTML = report.activityAxes.map(axis => `
                <div class="synthesis-domain-card">
                    <div class="domain-card-thumb">
                        ${this.getDomainVectorSvg(axis.id)}
                        <div class="domain-card-medallion">${axis.icon || '🏛️'}</div>
                    </div>
                    <div class="domain-card-body">
                        <h4 class="domain-card-title">${axis.name}</h4>
                        <div class="domain-card-stats-row">
                            <div class="domain-stat-col">
                                <span class="stat-col-label">عدد المشاريع</span>
                                <strong class="stat-col-val">${axis.projectsCount} <small>مشاريع</small></strong>
                            </div>
                            <div class="domain-stat-divider"></div>
                            <div class="domain-stat-col">
                                <span class="stat-col-label">الميزانية المبرمجة</span>
                                <strong class="stat-col-val">${axis.budget.replace(' درهم', '')} <small>درهم</small></strong>
                            </div>
                            <div class="domain-stat-divider"></div>
                            <div class="domain-stat-col">
                                <span class="stat-col-label">نسبة الإنجاز</span>
                                <strong class="stat-col-val">${axis.completionRate}%</strong>
                            </div>
                        </div>
                        <div class="domain-progress-track">
                            <div class="domain-progress-fill" style="width: ${axis.completionRate}%;"></div>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // Render Competence Projects Table
        const tableBody = document.getElementById('synthesisProjectsTableBody');
        if (tableBody && report.competenceProjects) {
            tableBody.innerHTML = report.competenceProjects.map(p => {
                let statusClass = 'status-in-progress';
                let statusLabel = 'قيد الإنجاز';

                const rawStatus = (p.status || '').trim();
                if (rawStatus === 'منجز' || rawStatus === 'تم تنفيذه') {
                    statusClass = 'status-completed';
                    statusLabel = 'منجز';
                } else if (rawStatus === 'دراسة' || rawStatus === 'لدراسة' || rawStatus.includes('دراسة')) {
                    statusClass = 'status-study';
                    statusLabel = 'دراسة';
                } else {
                    statusClass = 'status-in-progress';
                    statusLabel = 'قيد الإنجاز';
                }

                let domain = (p.competenceType || '').replace(/\s*\(Compétences.*?\)/i, '').trim();
                if (!domain || domain.includes('اختصاصات')) {
                    const fallbackMap = {
                        1: 'التجهيزات والبنية التحتية',
                        2: 'التعليم والثقافة والرياضة',
                        3: 'التجهيزات والبنية التحتية',
                        4: 'البيئة والتنمية المستدامة',
                        5: 'الصحة',
                        6: 'التجهيزات والبنية التحتية'
                    };
                    domain = fallbackMap[p.id] || 'التجهيزات والبنية التحتية';
                }

                let orientLabel = p.strategicOrientation || 'التنمية الحضرية';
                let orientIco = p.orientationIcon || '🎯';

                return `
                <tr class="synthesis-table-row">
                    <td class="col-proj-name">
                        <div class="proj-name-wrapper">
                            <span class="proj-bullet-ico">📌</span>
                            <span class="proj-name-text">${p.projectName}</span>
                        </div>
                    </td>
                    <td class="col-domain">
                        <span class="domain-tag">${domain}</span>
                    </td>
                    <td class="col-status">
                        <span class="status-pill ${statusClass}">${statusLabel}</span>
                    </td>
                    <td class="col-budget">
                        <span class="budget-num">${Number(p.budget).toLocaleString()}</span>
                        <span class="budget-cur">درهم</span>
                    </td>
                    <td class="col-progress">
                        <div class="table-progress-wrap">
                            <span class="progress-pct">${p.progress}%</span>
                            <div class="table-progress-bar-track">
                                <div class="table-progress-bar-fill" style="width: ${p.progress}%;"></div>
                            </div>
                        </div>
                    </td>
                    <td class="col-orientation">
                        <div class="orientation-wrap">
                            <span class="orientation-ico">${orientIco}</span>
                            <span class="orientation-label">${orientLabel}</span>
                        </div>
                    </td>
                    <td class="col-action">
                        <button type="button" onclick="openProjectConsistance(${p.id})" class="btn-table-details">
                            <span class="btn-eye-ico">👁️</span>
                            <span>تفاصيل المشروع</span>
                        </button>
                    </td>
                </tr>
                `;
            }).join('');
        }
    }

    // ==========================================
    // CITIZEN COMPLAINT TRACKING
    // ==========================================
    trackCitizenComplaint() {
        const input = document.getElementById('citizenTrackTicketInput');
        const resultBox = document.getElementById('citizenTrackResultBox');
        if (!input || !resultBox) return;

        const ticketId = input.value.trim();
        if (!ticketId) {
            alert('يرجى إدخال رقم الشكاية (مثال: TKT-2026-001)');
            return;
        }

        const item = ComplaintModel.getById(ticketId);
        if (!item) {
            resultBox.style.display = 'block';
            resultBox.innerHTML = `
                <div style="padding: 18px; border-radius: 12px; background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.3); color: #fca5a5; text-align: center;">
                    ⚠️ لم يتم العثور على أي شكاية مطابقة للرقم المرجعي <strong>"${ticketId}"</strong>. يرجى التحقق من الرقم والمحاولة مرة أخرى.
                </div>
            `;
            return;
        }

        const isSolved = item.status === 'تم الحل' || item.status === 'تمت المعالجة';
        resultBox.style.display = 'block';
        resultBox.innerHTML = `
            <div class="complaint-result-card">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 12px;">
                    <div>
                        <span class="complaint-result-status ${isSolved ? 'solved' : 'pending'}">${item.status}</span>
                        <strong style="color: #ffffff; font-size: 1.05rem; margin-right: 10px;">الرقم المرجعي: ${item.id}</strong>
                    </div>
                    <span style="font-size: 0.85rem; color: #94a3b8;">تاريخ الإيداع: ${item.createdDate}</span>
                </div>
                <h4 style="color: #ffffff; font-size: 1.15rem; margin: 0 0 8px 0;">${item.subject}</h4>
                <p style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.6; margin: 0 0 14px 0;"><strong>تفاصيل الطلب:</strong> ${item.details}</p>
                <div class="complaint-admin-reply">
                    <div style="font-weight: 700; color: #E3B351; margin-bottom: 4px;">✍️ الرد الإداري الرسمي من مصالح الجماعة:</div>
                    <div>${item.response || 'طلبكم قيد المتابعة والمعالجة من طرف المصلحة المعنية.'}</div>
                </div>
            </div>
        `;
    }

    // ==========================================
    // EXPORT SYNTHESIS REPORT PRINTABLE
    // ==========================================
    exportSynthesisReportPDF() {
        const report = SynthesisReportModel.get();
        if (!report) return;

        const printWin = window.open('', '_blank');
        printWin.document.write(`
            <html lang="ar" dir="rtl">
            <head>
                <title>${report.title}</title>
                <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
                <style>
                    body { font-family: 'Cairo', sans-serif; direction: rtl; padding: 40px; color: #0f172a; line-height: 1.8; background: #fff; }
                    .header { text-align: center; border-bottom: 3px double #C9972E; padding-bottom: 25px; margin-bottom: 30px; }
                    h1 { color: #1e3a8a; font-size: 1.6rem; margin-top: 10px; }
                    .intro-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 20px; margin-bottom: 30px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #cbd5e1; padding: 10px 14px; text-align: right; }
                    th { background: #f1f5f9; color: #1e3a8a; font-weight: 700; }
                    .print-btn { background: #C9972E; color: #fff; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; font-family: inherit; }
                    @media print { .no-print { display: none; } }
                </style>
            </head>
            <body>
                <div class="no-print" style="margin-bottom: 20px; text-align: left;">
                    <button class="print-btn" onclick="window.print()">🖨️ طباعة التقرير (Print PDF)</button>
                </div>
                <div class="header">
                    <div>المملكة المغربية • وزارة الداخلية • إقليم اشتوكة آيت باها</div>
                    <h1>الجماعة الترابية لبيوكرى</h1>
                    <h2>${report.title}</h2>
                    <div>الولاية الانتدابية ${report.reportingPeriod || '2021-2027'}</div>
                </div>
                <div class="intro-box">
                    <strong>مقدمة التقرير:</strong>
                    <p>${report.introduction}</p>
                </div>
                <h3>1. محاور العمل الاستراتيجية الكبرى:</h3>
                <table>
                    <thead>
                        <tr>
                            <th>المحور الاستراتيجي</th>
                            <th>الاعتمادات المرصودة</th>
                            <th>عدد المشاريع</th>
                            <th>نسبة الإنجاز</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(report.activityAxes || []).map(a => `
                            <tr>
                                <td><strong>${a.name}</strong></td>
                                <td>${a.budget}</td>
                                <td>${a.projectsCount}</td>
                                <td><strong>${a.completionRate}%</strong></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <h3 style="margin-top: 40px;">2. مشاريع مجالات الاختصاص:</h3>
                <table>
                    <thead>
                        <tr>
                            <th>اسم المشروع</th>
                            <th>مجال الاختصاص</th>
                            <th>الحالة</th>
                            <th>الميزانية (درهم)</th>
                            <th>نسبة الإنجاز</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(report.competenceProjects || []).map(p => `
                            <tr>
                                <td><strong>${p.projectName}</strong></td>
                                <td>${p.competenceType}</td>
                                <td>${p.status}</td>
                                <td>${Number(p.budget).toLocaleString()} د.م</td>
                                <td>${p.progress}%</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </body>
            </html>
        `);
        printWin.document.close();
    }

    exposeGlobalHelpers() {
        window.openLegalPopup = () => this.openLegalPopup();
        window.closeLegalPopup = () => this.closeLegalPopup();
        window.openNewsModal = (id) => this.openNewsModal(id);
        window.openProjectModal = (id) => this.openProjectModal(id);
        window.openEventModal = (id) => this.openEventModal(id);
        window.nextHeroSlide = () => this.nextHeroSlide();
        window.prevHeroSlide = () => this.prevHeroSlide();
        window.goToHeroSlide = (idx) => this.goToHeroSlide(idx);
        window.submitSentimentVote = (key) => this.submitSentimentVote(key);
        window.openMandateModal = () => this.openMandateModal();
        window.closeMandateModal = () => this.closeMandateModal();
        window.switchMandateTab = (tab) => this.switchMandateTab(tab);
        window.openSubventionsModal = () => this.openSubventionsModal();
        window.closeSubventionsModal = () => this.closeSubventionsModal();
        window.downloadSubventionFiche = () => this.downloadSubventionFiche();
        window.trackCitizenComplaint = () => this.trackCitizenComplaint();
        window.exportSynthesisReportPDF = () => this.exportSynthesisReportPDF();

        // New Helpers from user requirements
        window.openMemberCv = (name, role, cv, committee) => this.openMemberCv(name, role, cv, committee);
        window.closeMemberCv = () => this.closeMemberCv();
        window.openProjectConsistance = (id) => this.openProjectConsistance(id);
        window.closeProjectConsistance = () => this.closeProjectConsistance();
        window.openBudgetSheetModal = () => this.openBudgetSheetModal();
        window.closeBudgetSheetModal = () => this.closeBudgetSheetModal();
        window.openAssocDetails = (id) => this.openAssocDetails(id);
        window.closeAssocDetails = () => this.closeAssocDetails();
        window.selectSubventionCategory = (cat) => this.selectSubventionCategory(cat);
        window.submitOnlineSubventionApplication = (e) => this.submitOnlineSubventionApplication(e);
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

    closeModal() {
        const overlay = document.getElementById('modalOverlay');
        if (overlay) overlay.style.display = 'none';
    }

    checkAdminControlsVisibility() {
        const isAdminLogged = sessionStorage.getItem('agadir_admin_logged') === 'true';
        document.querySelectorAll('.admin-only').forEach(el => {
            el.style.display = isAdminLogged ? 'inline-block' : 'none';
        });
    }

    // ==========================================
    // MEMBER CV MODAL
    // ==========================================
    openMemberCv(name, role, cv, committee) {
        const overlay = document.getElementById('memberCvModal');
        if (!overlay) return;
        const nameEl = document.getElementById('cvMemberName');
        const roleEl = document.getElementById('cvMemberRole');
        const commEl = document.getElementById('cvMemberCommittee');
        const bioEl = document.getElementById('cvMemberBio');
        if (nameEl) nameEl.textContent = name;
        if (roleEl) roleEl.textContent = role;
        if (commEl) commEl.textContent = committee || 'المجلس الجماعي لبيوكرى';
        if (bioEl) bioEl.textContent = cv || 'فاعل محلي يساهم في تدبير شؤون جماعة بيوكرى وخدمة المصلحة العامة.';
        overlay.style.display = 'flex';
    }

    closeMemberCv() {
        const overlay = document.getElementById('memberCvModal');
        if (overlay) overlay.style.display = 'none';
    }

    // ==========================================
    // PROJECT CONSISTANCE MODAL (تركيبة المشروع: دراسة، صفقات، مدة، مستفيدين، وثائق)
    // ==========================================
    openProjectConsistance(id) {
        const report = SynthesisReportModel.get();
        if (!report) return;
        const project = (report.competenceProjects || []).find(p => p.id === id);
        if (!project) return;

        const overlay = document.getElementById('projectConsistanceModal');
        if (!overlay) return;

        const titleEl = document.getElementById('consTitle');
        const typeEl = document.getElementById('consTypeBadge');
        const statusEl = document.getElementById('consStatusBadge');
        const budgetEl = document.getElementById('consBudget');
        const progEl = document.getElementById('consProgress');

        if (titleEl) titleEl.textContent = project.projectName;
        if (typeEl) typeEl.textContent = project.competenceType;
        if (statusEl) statusEl.textContent = project.status;
        if (budgetEl) budgetEl.textContent = `${Number(project.budget).toLocaleString()} درهم`;
        if (progEl) progEl.textContent = `${project.progress}%`;

        // Consistance breakdown items
        const etudeEl = document.getElementById('consEtude');
        const marcheEl = document.getElementById('consMarche');
        const dureeEl = document.getElementById('consDuree');
        const benEl = document.getElementById('consBeneficiaires');
        const docsEl = document.getElementById('consDocs');

        if (etudeEl) etudeEl.textContent = project.etude || 'دراسة تقنية ومعمارية مصادق عليها ومودعة لدى قسم التعمير والأشغال.';
        if (marcheEl) marcheEl.textContent = project.marche || 'طلب عروض أثمان ودفتر تحملات معتمد وفق مرسوم الصفقات العمومية.';
        if (dureeEl) dureeEl.textContent = project.duree || `${project.timeline} (وفق الجدول الزمني المصادق عليه)`;
        if (benEl) benEl.textContent = project.beneficiaires || 'ساكنة جماعة بيوكرى والزوار والمرتفقين.';
        if (docsEl) docsEl.textContent = project.documents || 'دفتر الشروط الخاصة (CPS)، اتفاقيات الشراكة، ومحاضر التسليم المؤقت والنهائي.';

        overlay.style.display = 'flex';
    }

    closeProjectConsistance() {
        const overlay = document.getElementById('projectConsistanceModal');
        if (overlay) overlay.style.display = 'none';
    }

    // ==========================================
    // BUDGET SHEET MODAL (ورقة الميزانية)
    // ==========================================
    openBudgetSheetModal() {
        const overlay = document.getElementById('budgetSheetModal');
        if (overlay) overlay.style.display = 'flex';
    }

    closeBudgetSheetModal() {
        const overlay = document.getElementById('budgetSheetModal');
        if (overlay) overlay.style.display = 'none';
    }

    // ==========================================
    // ASSOCIATION DETAILS MODAL (مكتب الجمعية والملف القانوني)
    // ==========================================
    openAssocDetails(id) {
        const sub = SubventionModel.get();
        if (!sub) return;
        const assoc = (sub.beneficiaries || []).find(b => b.id === id);
        if (!assoc) return;

        const overlay = document.getElementById('assocDetailsModal');
        if (!overlay) return;

        const nameEl = document.getElementById('assocModalName');
        const typeEl = document.getElementById('assocModalType');
        const amountEl = document.getElementById('assocModalAmount');
        const projEl = document.getElementById('assocModalProject');
        const statutEl = document.getElementById('assocModalStatut');
        const legalEl = document.getElementById('assocModalLegal');
        const pvEl = document.getElementById('assocModalPv');

        if (nameEl) nameEl.textContent = assoc.assocName;
        if (typeEl) typeEl.textContent = assoc.assocType;
        if (amountEl) amountEl.textContent = `${Number(assoc.amount).toLocaleString()} درهم`;
        if (projEl) projEl.textContent = assoc.projectSupported || 'مشروع سنوي معتمد';
        if (statutEl) statutEl.textContent = assoc.statutStatus || 'مطابق ومحيّن ومصادق عليه';
        if (legalEl) legalEl.textContent = assoc.legalStatus || 'وصل إيداع نهائي ومحضر قانوني مكتمل';
        if (pvEl) pvEl.textContent = assoc.pvNumber || 'مقرر دورة المجلس الجماعي';

        const bureauContainer = document.getElementById('assocModalBureauMembers');
        if (bureauContainer) {
            const members = assoc.bureauMembers || [{ role: 'الرئيس', name: assoc.president, phone: '0661000000' }];
            bureauContainer.innerHTML = members.map(m => `
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong style="color: var(--primary-color); display: block; font-size: 0.95rem;">${m.name}</strong>
                        <span style="font-size: 0.82rem; color: #64748b;">${m.role} ${m.cin ? `(ب.ت.و: ${m.cin})` : ''}</span>
                    </div>
                    ${m.phone ? `<span style="font-size: 0.82rem; color: #10b981; font-weight: 700;">📞 ${m.phone}</span>` : ''}
                </div>
            `).join('');
        }

        overlay.style.display = 'flex';
    }

    closeAssocDetails() {
        const overlay = document.getElementById('assocDetailsModal');
        if (overlay) overlay.style.display = 'none';
    }

    // ==========================================
    // SUBVENTION ELIGIBILITY QUESTIONNAIRE (Crée question لكي تستفيد)
    // ==========================================
    selectSubventionCategory(category) {
        const sub = SubventionModel.get();
        if (!sub || !sub.eligibilityQuestions) return;

        const data = sub.eligibilityQuestions[category] || sub.eligibilityQuestions["رياضية"];

        // Update active button state
        document.querySelectorAll('.eligibility-tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });

        const titleEl = document.getElementById('eligibilityCatTitle');
        const criteriaEl = document.getElementById('eligibilityCriteriaList');
        const docsEl = document.getElementById('eligibilityDocsList');

        if (titleEl) titleEl.textContent = data.title;
        if (criteriaEl) {
            criteriaEl.innerHTML = data.criteria.map(c => `<li>${c}</li>`).join('');
        }
        if (docsEl) {
            docsEl.innerHTML = data.requiredDocs.map(d => `<li>${d}</li>`).join('');
        }
    }

    submitOnlineSubventionApplication(event) {
        if (event) event.preventDefault();
        alert('تم تسجيل طلب إيداع ملف الدعم الخاص بجمعيتكم بنجاح لدى مصلحة الشؤون الاجتماعية والجمعيات بجماعة بيوكرى! سيتم التواصل معكم فور انتهاء دراسة الملف.');
    }


    getDomainVectorSvg(id) {
        switch(Number(id)) {
            case 1:
                return `<svg class="domain-svg-canvas" viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="domGrad1" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stop-color="#0a192f"/>
                            <stop offset="50%" stop-color="#1e3a5f"/>
                            <stop offset="100%" stop-color="#0f2b48"/>
                        </linearGradient>
                        <linearGradient id="goldGrad1" x1="0" y1="1" x2="0" y2="0">
                            <stop offset="0%" stop-color="#D4AF37"/>
                            <stop offset="100%" stop-color="#F3E5AB"/>
                        </linearGradient>
                    </defs>
                    <rect width="400" height="220" fill="url(#domGrad1)"/>
                    <circle cx="340" cy="50" r="30" fill="url(#goldGrad1)" opacity="0.15"/>
                    <path d="M0 160 Q 100 120, 200 150 T 400 130 L 400 220 L 0 220 Z" fill="#142c4b" opacity="0.8"/>
                    <path d="M-20 180 Q 120 150, 240 175 T 420 160 L 420 220 L -20 220 Z" fill="#0d1f35"/>
                    <polygon points="170,220 230,220 205,160 195,160" fill="#223b5d"/>
                    <line x1="200" y1="165" x2="200" y2="215" stroke="#E9BD62" stroke-dasharray="6,4" stroke-width="2"/>
                    <rect x="50" y="110" width="35" height="50" fill="#1b3658" opacity="0.7"/>
                    <rect x="70" y="90" width="40" height="70" fill="#24456e" opacity="0.8"/>
                    <path d="M70 90 L90 70 L110 90 Z" fill="url(#goldGrad1)" opacity="0.6"/>
                    <rect x="290" y="100" width="45" height="60" fill="#1b3658" opacity="0.7"/>
                    <rect x="325" y="80" width="30" height="80" fill="#24456e" opacity="0.8"/>
                </svg>`;
            case 2:
                return `<svg class="domain-svg-canvas" viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="domGrad2" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stop-color="#08182b"/>
                            <stop offset="50%" stop-color="#143b68"/>
                            <stop offset="100%" stop-color="#0a2544"/>
                        </linearGradient>
                    </defs>
                    <rect width="400" height="220" fill="url(#domGrad2)"/>
                    <ellipse cx="200" cy="170" rx="150" ry="40" fill="none" stroke="#2563EB" stroke-width="3" opacity="0.4"/>
                    <ellipse cx="200" cy="170" rx="110" ry="28" fill="none" stroke="#D4AF37" stroke-width="2" opacity="0.5"/>
                    <path d="M60 40 L160 180" stroke="#FDE047" stroke-width="1.5" opacity="0.15"/>
                    <path d="M340 40 L240 180" stroke="#FDE047" stroke-width="1.5" opacity="0.15"/>
                    <circle cx="200" cy="110" r="45" fill="#1D4ED8" opacity="0.25"/>
                    <polygon points="200,85 208,103 227,103 212,114 218,132 200,121 182,132 188,114 173,103 192,103" fill="#E9BD62" opacity="0.7"/>
                </svg>`;
            case 3:
                return `<svg class="domain-svg-canvas" viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="domGrad3" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stop-color="#06241b"/>
                            <stop offset="60%" stop-color="#0d3b2e"/>
                            <stop offset="100%" stop-color="#041812"/>
                        </linearGradient>
                    </defs>
                    <rect width="400" height="220" fill="url(#domGrad3)"/>
                    <circle cx="200" cy="70" r="32" fill="#10B981" opacity="0.2"/>
                    <path d="M0 150 Q 120 110, 220 140 T 400 135 L 400 220 L 0 220 Z" fill="#0b4333" opacity="0.7"/>
                    <path d="M-30 175 Q 140 145, 260 170 T 430 160 L 430 220 L -30 220 Z" fill="#062e22"/>
                    <path d="M80 185 Q 85 130 90 100" stroke="#E9BD62" stroke-width="4" fill="none"/>
                    <path d="M90 100 Q 60 90 40 105 M90 100 Q 70 80 55 85 M90 100 Q 100 75 125 80 M90 100 Q 115 90 135 105 M90 100 Q 90 70 90 55" stroke="#10B981" stroke-width="2.5" fill="none"/>
                    <path d="M320 185 Q 315 135 310 105" stroke="#E9BD62" stroke-width="3.5" fill="none"/>
                    <path d="M310 105 Q 285 95 270 110 M310 105 Q 295 85 280 90 M310 105 Q 320 80 340 85 M310 105 Q 330 95 350 110" stroke="#10B981" stroke-width="2.2" fill="none"/>
                </svg>`;
            case 4:
            default:
                return `<svg class="domain-svg-canvas" viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="domGrad4" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stop-color="#0a192f"/>
                            <stop offset="50%" stop-color="#16385c"/>
                            <stop offset="100%" stop-color="#0d233a"/>
                        </linearGradient>
                    </defs>
                    <rect width="400" height="220" fill="url(#domGrad4)"/>
                    <circle cx="200" cy="110" r="50" fill="#0284C7" opacity="0.2"/>
                    <circle cx="200" cy="110" r="70" fill="none" stroke="#E9BD62" stroke-width="1.5" stroke-dasharray="5,5" opacity="0.4"/>
                    <path d="M200 75 L225 85 V115 C225 135 200 150 200 150 C200 150 175 135 175 115 V85 Z" fill="#0369A1" opacity="0.6" stroke="#38BDF8" stroke-width="2"/>
                    <path d="M195 95 H205 V125 H195 Z M185 105 H215 V115 H185 Z" fill="#FFFFFF" opacity="0.9"/>
                </svg>`;
        }
    }

    // ==========================================
    // ESSENTIAL CIVIC PROCEDURES (فضاء المواطن 3D)
    // ==========================================
    loadProceduresData() {
        try {
            const procedures = ProcedureModel.getAll();
            const grid = document.getElementById('servicesGrid');
            if (!grid || !procedures || procedures.length === 0) return;

            grid.innerHTML = procedures.map((p, idx) => `
                <article class="essential-card" onclick="window.openServiceDetail('${p.id}')" role="button" tabindex="0" aria-label="${p.title}">
                    <div class="card-watermark-corner"></div>
                    <div class="card-top-row">
                        <div class="essential-card-num">${p.num || String(idx + 1).padStart(2, '0')}</div>
                    </div>
                    <div class="card-core-layout">
                        <div class="service-medallion-box">
                            <div class="medallion-outer-bezel">
                                <div class="medallion-inner-core">
                                    <img src="${p.icon || 'assets/medallion_residence.png'}" alt="${p.title}" class="medallion-icon-img" loading="lazy">
                                </div>
                            </div>
                        </div>
                        <div class="service-text-pane">
                            <h3 class="essential-title">${p.title}</h3>
                            <p class="essential-desc">${p.desc}</p>
                            <div class="card-action-wrap">
                                <span class="essential-action-btn">طلب الإجراء ←</span>
                            </div>
                        </div>
                    </div>
                </article>
            `).join('');

            // Dynamic Modal Function
            window.openServiceDetail = function(key) {
                const proc = ProcedureModel.getById(key) || ProcedureModel.getAll().find(p => p.id === key);
                if (!proc) return;

                const modalBody = document.getElementById('modalBody');
                const modalOverlay = document.getElementById('modalOverlay');
                if (!modalBody || !modalOverlay) return;

                const docs = (proc.documents ? proc.documents.split('\n') : []).filter(Boolean);

                modalBody.innerHTML = `
                    <div style="text-align: center; margin-bottom: 22px;">
                        <img src="${proc.icon || 'assets/medallion_residence.png'}" style="width: 70px; height: 70px; margin-bottom: 12px; object-fit: contain;">
                        <h2 style="color: var(--primary-color); font-size: 1.6rem; font-weight: 800; margin: 0;">${proc.title}</h2>
                        <p style="color: #64748b; font-size: 0.95rem; margin-top: 8px;">${proc.desc}</p>
                    </div>
                    <div style="background: #f8fafc; border-radius: 12px; padding: 18px; margin-bottom: 20px; border-right: 4px solid var(--primary-color);">
                        <h4 style="color: var(--dark-color); font-size: 1.05rem; margin-bottom: 10px; font-weight: 700;">📋 الوثائق والشروط المطلوبة:</h4>
                        <ul style="list-style: none; padding: 0; margin: 0;">
                            ${docs.length > 0 ? docs.map(d => `<li style="padding: 6px 0; font-size: 0.95rem; color: #334155;">• ${d}</li>`).join('') : '<li style="color: #64748b;">بطاقة التعريف الوطنية والوثائق الثبوتية المعنية.</li>'}
                        </ul>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
                        <div style="background: rgba(242, 169, 59, 0.1); border-radius: 10px; padding: 12px; text-align: center;">
                            <strong style="display: block; color: var(--accent-color); font-size: 0.85rem; margin-bottom: 4px;">⏱️ أجل التسليم:</strong>
                            <span style="font-size: 0.95rem; font-weight: 700; color: var(--primary-color);">${proc.deadline || 'فوري عند الشباك'}</span>
                        </div>
                        <div style="background: rgba(15, 157, 138, 0.1); border-radius: 10px; padding: 12px; text-align: center;">
                            <strong style="display: block; color: var(--secondary-color); font-size: 0.85rem; margin-bottom: 4px;">💰 الرسوم والواجبات:</strong>
                            <span style="font-size: 0.95rem; font-weight: 700; color: var(--secondary-color);">${proc.cost || 'مجانية'}</span>
                        </div>
                    </div>
                    <div style="text-align: center;">
                        <button onclick="document.getElementById('modalOverlay').style.display='none'" class="btn btn-primary" style="min-width: 140px;">إغلاق النافذة</button>
                    </div>
                `;
                modalOverlay.style.display = 'flex';
            };
        } catch (e) {
            console.error('Error in loadProceduresData:', e);
        }
    }
}
