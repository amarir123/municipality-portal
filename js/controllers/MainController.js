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
        this.syncStatsWithDatabase();
        this.loadMandateData();
        this.loadSynthesisData();
        this.loadActivePoll();
        this.loadSubventionsPublicData();
        this.loadPublicationsData();
        this.bindEvents();
        this.checkAdminControlsVisibility();
        this.initHeroSlider();
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

        // Logos (Header, Footer & Brand Mark)
        const headerLogo = document.getElementById('mainLogoHeaderImg') || document.querySelector('.logo img');
        if (headerLogo && branding.logoUrl) headerLogo.src = branding.logoUrl;
        const footerLogo = document.getElementById('footerLogoMainImg') || document.querySelector('.footer-logo-main');
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

        // Weather (Header Tools Popup & Widgets)
        const wCity = document.getElementById('weatherCityDisplay') || document.getElementById('weatherCityMini');
        const wTemp = document.getElementById('weatherTempDisplay') || document.getElementById('weatherTempMini');
        if (wCity) wCity.textContent = branding.weatherCity || 'بيوكرى';
        if (wTemp) wTemp.textContent = branding.weatherTemp || '23°C';

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
            tbody.innerHTML = (sub.beneficiaries || []).map(b => `
                <tr>
                    <td><strong>${b.assocName}</strong></td>
                    <td><span class="badge" style="background: rgba(201, 151, 46, 0.15); color: #E3B351; border: 1px solid rgba(201, 151, 46, 0.3);">${b.assocType}</span></td>
                    <td><span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3);">${b.statutStatus}</span></td>
                    <td style="font-size: 0.85rem; color: #94a3b8;">${b.pvNumber}</td>
                    <td><strong style="color: #E3B351;">${Number(b.amount).toLocaleString()} درهم</strong></td>
                    <td>
                        <button type="button" onclick="openAssocDetails(${b.id})" class="btn-footer-chikaya" style="padding: 6px 12px; font-size: 0.8rem; background: rgba(16, 185, 129, 0.2); border-color: #10b981; color: #10b981; border-radius: 6px; cursor: pointer; white-space: nowrap;">
                            <span>👥 مكتب الجمعية والملف</span>
                        </button>
                    </td>
                </tr>
            `).join('');
        };

        renderRows(document.getElementById('publicSubventionsTableBody'));
        renderRows(document.getElementById('frontSubventionsTableBody'));
        renderRows(document.getElementById('subventionsModalTableBody'));

        // Render Categories Distribution Cards (توزيع الدعم)
        const catGrid = document.getElementById('subventionsCatDistributionGrid');
        if (catGrid && sub.categoriesDistribution) {
            catGrid.innerHTML = sub.categoriesDistribution.map(c => `
                <div class="subvention-cat-card">
                    <div class="sub-cat-header">
                        <span class="sub-cat-title">${c.icon} ${c.category}</span>
                        <span class="badge" style="background: rgba(201, 151, 46, 0.2); color: #E3B351; font-size: 0.75rem; border: 1px solid rgba(201, 151, 46, 0.3);">${c.count} جمعيات</span>
                    </div>
                    <div class="sub-cat-amount">${Number(c.totalAmount).toLocaleString()} د.م</div>
                    <div class="sub-cat-meta">حصة ${c.percentage}% من ميزانية الدعم السنوي</div>
                    <div class="sub-cat-bar-track">
                        <div class="sub-cat-bar-fill" style="width: ${c.percentage}%;"></div>
                    </div>
                </div>
            `).join('');
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
            const projects = ProjectModel.getAll() || [];
            const services = ServiceModel.getAll() || [];
            const mandate = MandateModel.get();
            const complaints = ComplaintModel.getAll() || [];

            const statPeriod = document.getElementById('statMandatePeriod');
            if (statPeriod && mandate && mandate.term) {
                statPeriod.textContent = mandate.term;
            }

            const statProjects = document.getElementById('statProjectsCount');
            if (statProjects) {
                const count = Math.max(projects.length, 50);
                statProjects.textContent = `+${count}`;
                statProjects.setAttribute('data-target', count);
            }

            const statServices = document.getElementById('statServicesCount');
            if (statServices) {
                const count = Math.max(services.length, 25);
                statServices.textContent = `+${count}`;
                statServices.setAttribute('data-target', count);
            }

            const statTransparency = document.getElementById('statTransparencyRate');
            if (statTransparency) {
                statTransparency.textContent = '+100%';
            }
        } catch (e) {
            console.error('Error syncing stats with database:', e);
        }
    }

    // ==========================================
    // MANDATE 2021-2027 SHOWCASE DATA LOADER
    // ==========================================
    loadMandateData() {
        const mandate = MandateModel.get();
        if (!mandate) return;

        // Render Mayor Card on Homepage
        const mayorNameEl = document.getElementById('mandateMayorName');
        const mayorRoleEl = document.getElementById('mandateMayorRole');
        if (mayorNameEl && mandate.bureau && mandate.bureau.length > 0) {
            mayorNameEl.textContent = mandate.bureau[0].name;
        }
        if (mayorRoleEl && mandate.bureau && mandate.bureau.length > 0) {
            mayorRoleEl.textContent = mandate.bureau[0].role;
        }

        // Render Bureau preview cards
        const bureauGrid = document.getElementById('mandateBureauGrid');
        if (bureauGrid && mandate.bureau) {
            bureauGrid.innerHTML = mandate.bureau.slice(1, 5).map(m => `
                <div class="bureau-card" onclick="openMandateModal()" role="button" tabindex="0">
                    <div class="bureau-role">${m.role}</div>
                    <div class="bureau-name">${m.name}</div>
                    <div class="bureau-party">${m.party || 'الأغلبية'}</div>
                </div>
            `).join('');
        }
    }

    // ==========================================
    // SYNTHESIS REPORT & STRATEGIC AXES LOADER
    // ==========================================
    loadSynthesisData() {
        const report = SynthesisReportModel.get();
        if (!report) return;

        const titleEl = document.getElementById('synthesisReportTitle');
        const introEl = document.getElementById('synthesisReportIntro');
        const periodEl = document.getElementById('synthesisReportPeriod');

        if (titleEl) titleEl.textContent = report.title;
        if (introEl) introEl.textContent = report.introduction;
        if (periodEl) periodEl.textContent = report.reportingPeriod || '2021-2027';

        // Render 4 Strategic Axes
        const axesContainer = document.getElementById('synthesisAxesGrid');
        if (axesContainer && report.activityAxes) {
            axesContainer.innerHTML = report.activityAxes.map(axis => `
                <div class="synthesis-axis-card">
                    <div class="synthesis-axis-title">${axis.name}</div>
                    <div class="synthesis-axis-meta">
                        <span>الميزانية: <strong>${axis.budget}</strong></span>
                        <span>المشاريع: <strong>${axis.projectsCount} مشروعاً</strong></span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.82rem; color: #cbd5e1; margin-top: 10px;">
                        <span>نسبة الإنجاز الميداني:</span>
                        <strong style="color: #E3B351;">${axis.completionRate}%</strong>
                    </div>
                    <div class="synthesis-progress-track">
                        <div class="synthesis-progress-fill" style="width: ${axis.completionRate}%;"></div>
                    </div>
                </div>
            `).join('');
        }

        // Render Competence Projects Table
        const tableBody = document.getElementById('synthesisProjectsTableBody');
        if (tableBody && report.competenceProjects) {
            tableBody.innerHTML = report.competenceProjects.map(p => `
                <tr>
                    <td><strong>${p.projectName}</strong></td>
                    <td><span class="badge" style="background: rgba(201, 151, 46, 0.15); color: #E3B351; border: 1px solid rgba(201, 151, 46, 0.3);">${p.competenceType}</span></td>
                    <td><span class="badge" style="background: ${p.status === 'تم تنفيذه' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)'}; color: ${p.status === 'تم تنفيذه' ? '#10b981' : '#f59e0b'};">${p.status}</span></td>
                    <td><strong>${Number(p.budget).toLocaleString()} درهم</strong></td>
                    <td>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span>${p.progress}%</span>
                            <div style="flex: 1; min-width: 50px; height: 6px; background: rgba(255,255,255,0.1); border-radius: 999px; overflow: hidden;">
                                <div style="height: 100%; width: ${p.progress}%; background: #C9972E;"></div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <button type="button" onclick="openProjectConsistance(${p.id})" class="btn-footer-chikaya" style="padding: 6px 12px; font-size: 0.8rem; background: rgba(201, 151, 46, 0.2); border-color: #C9972E; color: #E3B351; border-radius: 6px; cursor: pointer; white-space: nowrap;">
                            <span>🔍 تركيبة المشروع (Consistance)</span>
                        </button>
                    </td>
                </tr>
            `).join('');
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

}
