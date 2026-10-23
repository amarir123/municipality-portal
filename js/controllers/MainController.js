import { NewsModel } from '../models/NewsModel.js';
import { ProjectModel } from '../models/ProjectModel.js';
import { PublicationModel } from '../models/PublicationModel.js';
import { EventModel } from '../models/EventModel.js';
import { BrandingModel } from '../models/BrandingModel.js';
import { VideoModel } from '../models/VideoModel.js';
import { ComplaintModel } from '../models/ComplaintModel.js';
import { ServiceModel } from '../models/ServiceModel.js';
import { MandateModel } from '../models/MandateModel.js';
import { SynthesisReportModel } from '../models/SynthesisReportModel.js';
import { SubventionModel } from '../models/SubventionModel.js';
import { PollModel } from '../models/PollModel.js';

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
        this.bindEvents();
        this.checkAdminControlsVisibility();
        this.initHeroSlider();
        this.loadActivePoll();
        this.loadSubventionsPublicData();
        this.exposeGlobalHelpers();
    }

    applyBranding() {
        const branding = BrandingModel.get();
        if (!branding) return;

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

        // Municipality Names
        document.querySelectorAll('.muni-name-display').forEach(el => {
            el.textContent = branding.muniName || 'الجماعة الترابية';
        });

        // Logos
        const headerLogo = document.getElementById('mainLogoHeaderImg');
        if (headerLogo && branding.logoUrl) headerLogo.src = branding.logoUrl;
        const footerLogo = document.getElementById('footerLogoImg');
        if (footerLogo && branding.logoUrl) footerLogo.src = branding.logoUrl;

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
        if (fHours) fHours.textContent = branding.workingHours || 'من الإثنين إلى الجمعة: 08:30 - 16:30';
    }

    loadPageData() {
        try {
            const news = NewsModel.getAll();
            NewsView.renderList(news);
        } catch (e) { console.error('Error rendering news:', e); }

        try {
            const projects = ProjectModel.getAll();
            ProjectView.renderGrid(projects);
        } catch (e) { console.error('Error rendering projects:', e); }

        try {
            const publications = PublicationModel.getAll();
            PublicationView.renderList(publications);
        } catch (e) { console.error('Error rendering publications:', e); }

        try {
            const events = EventModel.getAll();
            EventView.renderList(events);
        } catch (e) { console.error('Error rendering events:', e); }

        try {
            const videos = VideoModel.getAll();
            VideoView.renderGrid(videos);
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
                        </div>
                    `).join('')}
                </div>
            `;
        } else if (tab === 'committees') {
            content.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 14px;">
                    ${mandate.committees.map(c => `
                        <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; background: #f8fafc; border-right: 4px solid var(--accent-color);">
                            <h4 style="color: var(--primary-color); font-size: 1.15rem; margin-bottom: 6px;">${c.name}</h4>
                            <p style="font-size: 0.9rem; color: #475569; margin-bottom: 10px;">${c.description}</p>
                            <div style="display: flex; gap: 15px; font-size: 0.88rem; font-weight: 600;">
                                <span>الرئيس: <strong>${c.president}</strong></span>
                                <span>نائب الرئيس: <strong>${c.vice}</strong></span>
                                <span class="badge badge-info">${c.membersCount} أعضاء</span>
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
                            </tr>
                        </thead>
                        <tbody>
                            ${mandate.councilMembers.map(m => `
                                <tr>
                                    <td><strong>${m.name}</strong></td>
                                    <td><span class="badge badge-info">${m.role}</span></td>
                                    <td>${m.district || '-'}</td>
                                    <td>${m.committee || '-'}</td>
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

        const tbody = document.getElementById('publicSubventionsTableBody');
        if (!tbody) return;

        tbody.innerHTML = sub.beneficiaries.map(b => `
            <tr>
                <td><strong>${b.assocName}</strong></td>
                <td><span class="badge badge-info">${b.assocType}</span></td>
                <td><span class="badge badge-success">${b.statutStatus}</span></td>
                <td style="font-size: 0.85rem; color: #64748b;">${b.pvNumber}</td>
                <td><strong style="color: var(--primary-color);">${Number(b.amount).toLocaleString()} درهم</strong></td>
            </tr>
        `).join('');
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
}
