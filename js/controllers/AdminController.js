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
import { AdminView } from '../views/AdminView.js';

export class AdminController {
    constructor() {
        this.projectsChart = null;
        this.complaintsChart = null;
        this.currentCompFilter = 'all';
        this.init();
    }

    init() {
        this.checkAuth();
        this.applyAdminBranding();
        this.initializeBrandingForm();
    }

    checkAuth() {
        if (sessionStorage.getItem('agadir_admin_logged') === 'true') {
            const overlay = document.getElementById('loginOverlay');
            if (overlay) overlay.style.display = 'none';
            this.loadAllData();
        }
    }

    handleLogin(e) {
        if (e) e.preventDefault();
        const user = document.getElementById('adminUser')?.value;
        const pass = document.getElementById('adminPass')?.value;

        if (user === 'admin' && pass === 'admin123') {
            sessionStorage.setItem('agadir_admin_logged', 'true');
            const overlay = document.getElementById('loginOverlay');
            if (overlay) {
                overlay.style.opacity = '0';
                overlay.style.pointerEvents = 'none';
                overlay.style.display = 'none';
            }
            AdminView.showToast('تم تسجيل الدخول بنجاح! أهلاً بك في نظام الإدارة.');
            this.loadAllData();
        } else {
            AdminView.showToast('خطأ: اسم المستخدم أو كلمة المرور غير صحيحة.', true);
        }
    }

    handleLogout() {
        sessionStorage.removeItem('agadir_admin_logged');
        const overlay = document.getElementById('loginOverlay');
        if (overlay) {
            overlay.style.display = 'flex';
            setTimeout(() => { overlay.style.opacity = '1'; }, 50);
        }
    }

    loadAllData() {
        const news = NewsModel.getAll();
        AdminView.renderNewsTable(news);

        const projects = ProjectModel.getAll();
        AdminView.renderProjectsGrid(projects);

        const pubs = PublicationModel.getAll();
        AdminView.renderPubsTable(pubs);

        const complaints = ComplaintModel.getAll();
        this.renderComplaintsTable(complaints);

        const services = ServiceModel.getAll();
        this.renderServicesTable(services);

        this.renderStatsWidget(news.length, projects.length, complaints.length, services.length);
        this.renderEventsTable(EventModel.getAll());
        this.renderVideosTable(VideoModel.getAll());

        this.loadMandateData();
        this.loadSynthesisData();
        this.loadSubventionsData();
        this.loadPollsData();
        this.loadProceduresData();
        this.loadSynthesisAxes();

        this.initCharts(projects, complaints);
    }

    renderStatsWidget(newsCnt, projCnt, cmpCnt, srvCnt) {
        if (document.getElementById('statNewsCount')) document.getElementById('statNewsCount').innerText = newsCnt;
        if (document.getElementById('statProjectsCount')) document.getElementById('statProjectsCount').innerText = projCnt;
        if (document.getElementById('statComplaintsCount')) document.getElementById('statComplaintsCount').innerText = cmpCnt;
        if (document.getElementById('statServicesCount')) document.getElementById('statServicesCount').innerText = srvCnt;
    }

    initCharts(projects, complaints) {
        if (typeof Chart === 'undefined') return;

        // Projects Progress Chart
        const projCanvas = document.getElementById('projectsChartCanvas');
        if (projCanvas) {
            const ctx1 = projCanvas.getContext('2d');
            if (this.projectsChart) this.projectsChart.destroy();
            this.projectsChart = new Chart(ctx1, {
                type: 'bar',
                data: {
                    labels: projects.map(p => p.title.substring(0, 18) + '...'),
                    datasets: [{
                        label: 'نسبة الإنجاز %',
                        data: projects.map(p => p.progress),
                        backgroundColor: '#0d5ea6',
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    scales: { y: { beginAtZero: true, max: 100 } }
                }
            });
        }

        // Complaints Chart
        const cmpCanvas = document.getElementById('complaintsChartCanvas');
        if (cmpCanvas) {
            const ctx2 = cmpCanvas.getContext('2d');
            const pending = complaints.filter(c => c.status === 'قيد النظر').length;
            const inProgress = complaints.filter(c => c.status === 'قيد المعالجة').length;
            const resolved = complaints.filter(c => c.status === 'تم الحل').length;

            if (this.complaintsChart) this.complaintsChart.destroy();
            this.complaintsChart = new Chart(ctx2, {
                type: 'doughnut',
                data: {
                    labels: ['قيد النظر', 'قيد المعالجة', 'تم الحل'],
                    datasets: [{
                        data: [pending, inProgress, resolved],
                        backgroundColor: ['#f59e0b', '#3b82f6', '#10b981']
                    }]
                },
                options: { responsive: true }
            });
        }
    }

    renderComplaintsTable(complaints) {
        const tbody = document.getElementById('adminComplaintsTableBody');
        if (!tbody) return;

        if (!complaints || complaints.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #64748b;">لا توجد شكايات حالياً</td></tr>`;
            return;
        }

        tbody.innerHTML = complaints.map(c => `
            <tr>
                <td><strong style="color: var(--primary-color);">${c.id}</strong></td>
                <td><strong>${c.name}</strong><br><span style="font-size: 0.8rem; color: #64748b;">${c.phone}</span></td>
                <td><strong>${c.subject}</strong><br><span class="badge" style="background: #f1f5f9; color: #475569;">${c.category}</span></td>
                <td><span class="badge ${c.status === 'تم الحل' ? 'badge-success' : (c.status === 'قيد المعالجة' ? 'badge-info' : 'badge-warning')}">${c.status}</span></td>
                <td><span style="font-size: 0.85rem; color: #64748b;">${c.createdDate}</span></td>
                <td>
                    <button class="btn btn-outline btn-sm" onclick="window.adminController.openEditComplaintModal('${c.id}')">رد واقتراح حل ✏️</button>
                    <button class="btn btn-outline btn-sm" style="border-color: #ef4444; color: #ef4444;" onclick="window.adminController.deleteComplaint('${c.id}')">حذف</button>
                </td>
            </tr>
        `).join('');
    }

    filterComplaints(status) {
        const all = ComplaintModel.getAll();
        if (status === 'all') {
            this.renderComplaintsTable(all);
        } else {
            this.renderComplaintsTable(all.filter(c => c.status === status));
        }
    }

    openEditComplaintModal(id) {
        const item = ComplaintModel.getById(id);
        if (!item) return;

        document.getElementById('editCmpId').value = item.id;
        document.getElementById('cmpModalSubject').innerText = `طلب رقم: ${item.id} - ${item.subject}`;
        document.getElementById('cmpModalCitizen').innerText = `المواطن: ${item.name} (${item.phone}) - ${item.createdDate}`;
        document.getElementById('cmpModalDetails').innerText = `التفاصيل: ${item.details}`;
        document.getElementById('cmpModalStatus').value = item.status;
        document.getElementById('cmpModalResponseNote').value = item.response || '';

        const m = document.getElementById('adminEditComplaintModal');
        if (m) {
            m.style.display = 'flex';
            m.classList.add('active');
        }
    }

    closeComplaintEditModal() {
        const m = document.getElementById('adminEditComplaintModal');
        if (m) {
            m.style.display = 'none';
            m.classList.remove('active');
        }
    }

    saveComplaintResponse(e) {
        e.preventDefault();
        const id = document.getElementById('editCmpId').value;
        const status = document.getElementById('cmpModalStatus').value;
        const response = document.getElementById('cmpModalResponseNote').value;

        ComplaintModel.updateStatus(id, status, response);
        this.closeComplaintEditModal();
        AdminView.showToast('تم تحديث حالة الشكاية وإرسال الرد للمواطن بنجاح!');
        this.loadAllData();
    }

    deleteComplaint(id) {
        if (confirm('هل أنت تأكد من حذف هذه الشكاية؟')) {
            ComplaintModel.delete(id);
            AdminView.showToast('تم حذف الشكاية.');
            this.loadAllData();
        }
    }

    renderServicesTable(services) {
        const tbody = document.getElementById('adminServicesTableBody');
        if (!tbody) return;

        if (!services || services.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #64748b;">لا توجد خدمات حالياً</td></tr>`;
            return;
        }

        tbody.innerHTML = services.map(s => `
            <tr>
                <td><strong>${s.title}</strong><br><span class="badge" style="background: #eff6ff; color: #1d4ed8;">${s.category}</span></td>
                <td style="font-size: 0.85rem; color: #64748b;">${s.description}</td>
                <td><span style="font-size: 0.85rem;">${s.isExternal ? 'رابط خارجي' : 'وثيقة PDF'} (${s.fileSize || 'PDF'})</span></td>
                <td>
                    <button class="btn btn-outline btn-sm" onclick="window.adminController.openEditServiceModal(${s.id})">تعديل ✏️</button>
                    <button class="btn btn-outline btn-sm" style="border-color: #ef4444; color: #ef4444;" onclick="window.adminController.deleteService(${s.id})">حذف 🗑️</button>
                </td>
            </tr>
        `).join('');
    }

    openAddServiceModal() {
        const modal = document.getElementById('adminServiceModal');
        if (!modal) return;
        document.getElementById('editServiceId').value = '';
        document.getElementById('serviceTitleInput').value = '';
        document.getElementById('serviceCategoryInput').value = '';
        document.getElementById('serviceSizeInput').value = '2.4 MB PDF';
        document.getElementById('serviceDescInput').value = '';
        document.getElementById('serviceLinkInput').value = 'assets/docs/document.pdf';
        document.getElementById('adminServiceModalTitle').textContent = 'إضافة خدمة أو وثيقة إلكترونية';
        modal.style.display = 'flex';
    }

    openEditServiceModal(id) {
        const services = ServiceModel.getAll();
        const s = services.find(item => item.id === Number(id) || item.id === id);
        if (!s) return;
        const modal = document.getElementById('adminServiceModal');
        if (!modal) return;
        document.getElementById('editServiceId').value = s.id;
        document.getElementById('serviceTitleInput').value = s.title || '';
        document.getElementById('serviceCategoryInput').value = s.category || '';
        document.getElementById('serviceSizeInput').value = s.fileSize || '';
        document.getElementById('serviceDescInput').value = s.description || '';
        document.getElementById('serviceLinkInput').value = s.link || '';
        document.getElementById('adminServiceModalTitle').textContent = 'تعديل بيانات الخدمة والوثيقة';
        modal.style.display = 'flex';
    }

    closeServiceModal() {
        const modal = document.getElementById('adminServiceModal');
        if (modal) modal.style.display = 'none';
    }

    saveService(e) {
        if (e) e.preventDefault();
        const editId = document.getElementById('editServiceId')?.value;
        const title = document.getElementById('serviceTitleInput')?.value;
        const category = document.getElementById('serviceCategoryInput')?.value;
        const fileSize = document.getElementById('serviceSizeInput')?.value;
        const description = document.getElementById('serviceDescInput')?.value;
        const link = document.getElementById('serviceLinkInput')?.value;

        if (!title) return;

        const isExternal = link ? (link.startsWith('http://') || link.startsWith('https://')) : false;

        if (editId) {
            let list = ServiceModel.getAll();
            list = list.map(item => (item.id === Number(editId) || item.id === editId) ? {
                ...item,
                title, category, fileSize, description, link, isExternal
            } : item);
            ServiceModel.saveAll(list);
            AdminView.showToast('تم تحديث بيانات الخدمة بنجاح!');
        } else {
            ServiceModel.add({
                title, category, fileSize, description, link, isExternal
            });
            AdminView.showToast('تمت إضافة الخدمة الجديدة بنجاح!');
        }

        localStorage.setItem('biougra_last_sync_timestamp', Date.now().toString());
        this.closeServiceModal();
        this.loadAllData();
    }

    deleteService(id) {
        if (confirm('هل تود حذف هذه الخدمة؟')) {
            ServiceModel.delete(id);
            AdminView.showToast('تم حذف الخدمة.');
            this.loadAllData();
        }
    }

    initializeBrandingForm() {
        const branding = BrandingModel.get();
        if (!branding) return;

        if (document.getElementById('brandMuniName')) document.getElementById('brandMuniName').value = branding.muniName || '';
        if (document.getElementById('brandCityName')) document.getElementById('brandCityName').value = branding.cityName || '';
        if (document.getElementById('brandPhone')) document.getElementById('brandPhone').value = branding.phone || '';
        if (document.getElementById('brandEmail')) document.getElementById('brandEmail').value = branding.email || '';
        if (document.getElementById('brandWorkingHours')) document.getElementById('brandWorkingHours').value = branding.workingHours || '';
        if (document.getElementById('brandTickerText')) document.getElementById('brandTickerText').value = branding.tickerText || '';

        if (document.getElementById('brandPrimaryColor')) document.getElementById('brandPrimaryColor').value = branding.primaryColor || '#0d5ea6';
        if (document.getElementById('brandAccentColor')) document.getElementById('brandAccentColor').value = branding.accentColor || '#c69c55';
        if (document.getElementById('brandDarkColor')) document.getElementById('brandDarkColor').value = branding.darkColor || '#1e293b';
        if (document.getElementById('brandTextColor')) document.getElementById('brandTextColor').value = branding.textColor || '#334155';

        if (document.getElementById('brandShowTicker')) document.getElementById('brandShowTicker').checked = branding.showTicker !== false;
        if (document.getElementById('brandShowUrban')) document.getElementById('brandShowUrban').checked = branding.showUrban !== false;
        if (document.getElementById('brandShowServices')) document.getElementById('brandShowServices').checked = branding.showServices !== false;

        // Slogan & Hero Subtitle
        if (document.getElementById('brandSloganInput')) document.getElementById('brandSloganInput').value = branding.slogan || '';
        if (document.getElementById('brandHeroSubtitleInput')) document.getElementById('brandHeroSubtitleInput').value = branding.heroSubtitle || '';

        // Portal Stats Ribbon
        if (document.getElementById('brandStatsSubtitleInput')) document.getElementById('brandStatsSubtitleInput').value = branding.statsSubtitle || '';
        if (document.getElementById('brandStat1Val')) document.getElementById('brandStat1Val').value = branding.stat1Val || '+120';
        if (document.getElementById('brandStat1Label')) document.getElementById('brandStat1Label').value = branding.stat1Label || 'طلب معالجة شهرياً';
        if (document.getElementById('brandStat2Val')) document.getElementById('brandStat2Val').value = branding.stat2Val || '+98%';
        if (document.getElementById('brandStat2Label')) document.getElementById('brandStat2Label').value = branding.stat2Label || 'معدل إنجاز المشاريع';
        if (document.getElementById('brandStat3Val')) document.getElementById('brandStat3Val').value = branding.stat3Val || '+12';
        if (document.getElementById('brandStat3Label')) document.getElementById('brandStat3Label').value = branding.stat3Label || 'برنامج قطاعي';
        if (document.getElementById('brandStat4Val')) document.getElementById('brandStat4Val').value = branding.stat4Val || '+45';
        if (document.getElementById('brandStat4Label')) document.getElementById('brandStat4Label').value = branding.stat4Label || 'مشروع تنموي';

        // Hero 3D Stage Slides
        if (document.getElementById('heroSlide1TitleInput')) document.getElementById('heroSlide1TitleInput').value = branding.heroSlide1Title || 'تأهيل البنية التحتية بالمنطقة';
        if (document.getElementById('heroSlide1SubtitleInput')) document.getElementById('heroSlide1SubtitleInput').value = branding.heroSlide1Subtitle || 'أشغال تهيئة الطرقات والأحياء السكنية.';
        if (document.getElementById('heroSlide1BadgeInput')) document.getElementById('heroSlide1BadgeInput').value = branding.heroSlide1Badge || 'أخبار الجماعة 📰';
        if (document.getElementById('heroSlide1DateInput')) document.getElementById('heroSlide1DateInput').value = branding.heroSlide1Date || '15 ماي 2025';

        if (document.getElementById('heroSlide2TitleInput')) document.getElementById('heroSlide2TitleInput').value = branding.heroSlide2Title || 'إطلاق أسطول حافلات النقل الحضري بالنيابة';
        if (document.getElementById('heroSlide2SubtitleInput')) document.getElementById('heroSlide2SubtitleInput').value = branding.heroSlide2Subtitle || 'تعزيز أسطول النقل الحضري لتسهيل تنقل المواطنين.';
        if (document.getElementById('heroSlide2BadgeInput')) document.getElementById('heroSlide2BadgeInput').value = branding.heroSlide2Badge || 'خدمات النقل 🚌';
        if (document.getElementById('heroSlide2DateInput')) document.getElementById('heroSlide2DateInput').value = branding.heroSlide2Date || '12 ماي 2025';

        if (document.getElementById('heroSlide3TitleInput')) document.getElementById('heroSlide3TitleInput').value = branding.heroSlide3Title || 'مشروع السوق الأسبوعي الجديد';
        if (document.getElementById('heroSlide3SubtitleInput')) document.getElementById('heroSlide3SubtitleInput').value = branding.heroSlide3Subtitle || 'إعطاء انطلاقة أشغال بناء السوق الأسبوعي الحديث.';
        if (document.getElementById('heroSlide3BadgeInput')) document.getElementById('heroSlide3BadgeInput').value = branding.heroSlide3Badge || 'المشاريع 🏗️';
        if (document.getElementById('heroSlide3DateInput')) document.getElementById('heroSlide3DateInput').value = branding.heroSlide3Date || '10 ماي 2025';

        // Hero Slide Images & Background Previews
        for (let i = 1; i <= 3; i++) {
            const imgVal = branding['heroSlide' + i + 'Img'];
            const inp = document.getElementById('heroSlide' + i + 'ImgInput');
            const prv = document.getElementById('heroSlide' + i + 'ImgPreview');
            if (inp && imgVal) inp.value = imgVal;
            if (prv && imgVal) prv.src = imgVal;
        }
        if (branding.heroBgImg) {
            const bgInp = document.getElementById('heroBgImgInput');
            const bgPrv = document.getElementById('heroBgImgPreview');
            if (bgInp) bgInp.value = branding.heroBgImg;
            if (bgPrv) bgPrv.src = branding.heroBgImg;
        }

        // Social Media
        if (document.getElementById('brandFacebookInput')) document.getElementById('brandFacebookInput').value = branding.facebookUrl || '';
        if (document.getElementById('brandTwitterInput')) document.getElementById('brandTwitterInput').value = branding.twitterUrl || '';
        if (document.getElementById('brandInstagramInput')) document.getElementById('brandInstagramInput').value = branding.instagramUrl || '';
        if (document.getElementById('brandYoutubeInput')) document.getElementById('brandYoutubeInput').value = branding.youtubeUrl || '';
    }

    saveBrandingSettings(e) {
        if (e) e.preventDefault();
        try {
            const muniName = document.getElementById('brandMuniName')?.value?.trim();
            const cityName = document.getElementById('brandCityName')?.value?.trim();

            if (!muniName) {
                AdminView.showToast('تعذر الحفظ: يرجى إدخال اسم الجماعة الترابية.', true, 'حقل مطلوب ناقص');
                document.getElementById('brandMuniName')?.focus();
                return;
            }
            if (!cityName) {
                AdminView.showToast('تعذر الحفظ: يرجى إدخال اسم المدينة أو الإقليم.', true, 'حقل مطلوب ناقص');
                document.getElementById('brandCityName')?.focus();
                return;
            }

            const current = BrandingModel.get() || {};

            const updated = {
                ...current,
                muniName: muniName,
                cityName: cityName,
                logoUrl: document.getElementById('brandLogoUrlInput')?.value || current.logoUrl,
                phone: document.getElementById('brandPhone')?.value || current.phone || '',
                email: document.getElementById('brandEmail')?.value || current.email || '',
                workingHours: document.getElementById('brandWorkingHours')?.value || current.workingHours || '',
                tickerText: document.getElementById('brandTickerText')?.value || current.tickerText || '',
                primaryColor: document.getElementById('brandPrimaryColor')?.value || current.primaryColor || '#0B5E44',
                accentColor: document.getElementById('brandAccentColor')?.value || current.accentColor || '#F2A93B',
                darkColor: document.getElementById('brandDarkColor')?.value || current.darkColor || '#032D20',
                textColor: document.getElementById('brandTextColor')?.value || current.textColor || '#2D3748',
                showTicker: document.getElementById('brandShowTicker')?.checked ?? current.showTicker ?? false,
                showUrban: document.getElementById('brandShowUrban')?.checked ?? current.showUrban ?? true,
                showServices: document.getElementById('brandShowServices')?.checked ?? current.showServices ?? true,

                // Slogan & Hero Subtitle
                slogan: document.getElementById('brandSloganInput')?.value || current.slogan,
                heroSubtitle: document.getElementById('brandHeroSubtitleInput')?.value || current.heroSubtitle,

                // Stats Ribbon
                statsSubtitle: document.getElementById('brandStatsSubtitleInput')?.value || current.statsSubtitle,
                stat1Val: document.getElementById('brandStat1Val')?.value || current.stat1Val,
                stat1Label: document.getElementById('brandStat1Label')?.value || current.stat1Label,
                stat2Val: document.getElementById('brandStat2Val')?.value || current.stat2Val,
                stat2Label: document.getElementById('brandStat2Label')?.value || current.stat2Label,
                stat3Val: document.getElementById('brandStat3Val')?.value || current.stat3Val,
                stat3Label: document.getElementById('brandStat3Label')?.value || current.stat3Label,
                stat4Val: document.getElementById('brandStat4Val')?.value || current.stat4Val,
                stat4Label: document.getElementById('brandStat4Label')?.value || current.stat4Label,

                // Hero Slides
                heroSlide1Title: document.getElementById('heroSlide1TitleInput')?.value || current.heroSlide1Title,
                heroSlide1Subtitle: document.getElementById('heroSlide1SubtitleInput')?.value || current.heroSlide1Subtitle,
                heroSlide1Img: document.getElementById('heroSlide1ImgInput')?.value || current.heroSlide1Img,
                heroSlide2Img: document.getElementById('heroSlide2ImgInput')?.value || current.heroSlide2Img,
                heroSlide3Img: document.getElementById('heroSlide3ImgInput')?.value || current.heroSlide3Img,
                heroBgImg: document.getElementById('heroBgImgInput')?.value || current.heroBgImg,
                heroSlide1Badge: document.getElementById('heroSlide1BadgeInput')?.value || current.heroSlide1Badge,
                heroSlide1Date: document.getElementById('heroSlide1DateInput')?.value || current.heroSlide1Date,

                heroSlide2Title: document.getElementById('heroSlide2TitleInput')?.value || current.heroSlide2Title,
                heroSlide2Subtitle: document.getElementById('heroSlide2SubtitleInput')?.value || current.heroSlide2Subtitle,
                heroSlide2Badge: document.getElementById('heroSlide2BadgeInput')?.value || current.heroSlide2Badge,
                heroSlide2Date: document.getElementById('heroSlide2DateInput')?.value || current.heroSlide2Date,

                heroSlide3Title: document.getElementById('heroSlide3TitleInput')?.value || current.heroSlide3Title,
                heroSlide3Subtitle: document.getElementById('heroSlide3SubtitleInput')?.value || current.heroSlide3Subtitle,
                heroSlide3Badge: document.getElementById('heroSlide3BadgeInput')?.value || current.heroSlide3Badge,
                heroSlide3Date: document.getElementById('heroSlide3DateInput')?.value || current.heroSlide3Date,

                // Social
                facebookUrl: document.getElementById('brandFacebookInput')?.value || current.facebookUrl,
                twitterUrl: document.getElementById('brandTwitterInput')?.value || current.twitterUrl,
                instagramUrl: document.getElementById('brandInstagramInput')?.value || current.instagramUrl,
                youtubeUrl: document.getElementById('brandYoutubeInput')?.value || current.youtubeUrl
            };

            BrandingModel.save(updated);
            this.applyAdminBranding();
            AdminView.showToast('تم حفظ وتحديث هوية الجماعة والشرائح بنجاح! تم تطبيق التغييرات على الواجهة الرئيسية. ✅', false, 'تم الحفظ بنجاح!');
        } catch (err) {
            console.error('Error saving branding:', err);
            const reason = (err && err.name === 'QuotaExceededError')
                ? 'حجم الصور المرفوعة كبير جداً وتجاوز سعة ذاكرة التخزين، يرجى اختيار صور أقل حجماً.'
                : (err ? err.message : 'حدث خطأ غير متوقع أثناء الحفظ');
            AdminView.showToast('فشل الحفظ: ' + reason, true, 'فشل الحفظ ❌');
        }
    }

    applyAdminBranding() {
        const branding = BrandingModel.get();
        if (!branding) return;

        const root = document.documentElement;
        if (branding.primaryColor) root.style.setProperty('--primary-color', branding.primaryColor);
        if (branding.accentColor) root.style.setProperty('--accent-color', branding.accentColor);

        const loginLogo = document.getElementById('adminLoginLogo');
        if (loginLogo && branding.logoUrl) loginLogo.src = branding.logoUrl;

        const sidebarLogo = document.getElementById('adminSidebarLogo');
        if (sidebarLogo && branding.logoUrl) sidebarLogo.src = branding.logoUrl;
    }

    handleExportPackage() {
        const jsonStr = BrandingModel.exportPackageJSON();
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `municipal_saas_package_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        AdminView.showToast('تم تصدير حزمة الجماعة بنجاح! يمكن تركيبه للجماعة الجديدة.');
    }

    handleImportPackageFile(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const success = BrandingModel.importPackageJSON(evt.target.result);
            if (success) {
                AdminView.showToast('تم استيراد حزمة الجماعة الجديدة بنجاح! جاري التحديث...');
                setTimeout(() => { location.reload(); }, 1200);
            } else {
                AdminView.showToast('خطأ: الملف المحدد غير صالح.', true);
            }
        };
        reader.readAsText(file);
    }

    // Standard News CRUD
    openAddNewsModal() {
        document.getElementById('editNewsId').value = '';
        document.getElementById('editNewsTitle').value = '';
        document.getElementById('editNewsDate').value = new Date().toLocaleDateString('ar-MA', { day: 'numeric', month: 'long' });
        document.getElementById('editNewsExcerpt').value = '';
        document.getElementById('editNewsContent').value = '';
        const m = document.getElementById('adminEditNewsModal');
        if (m) {
            m.style.display = 'flex';
            m.classList.add('active');
        }
    }

    openEditNewsModal(id) {
        const item = NewsModel.getById(id);
        if (!item) return;
        document.getElementById('editNewsId').value = item.id;
        document.getElementById('editNewsTitle').value = item.title;
        document.getElementById('editNewsDate').value = item.date;
        document.getElementById('editNewsExcerpt').value = item.excerpt;
        document.getElementById('editNewsContent').value = item.content;
        const m = document.getElementById('adminEditNewsModal');
        if (m) {
            m.style.display = 'flex';
            m.classList.add('active');
        }
    }

    closeNewsModal() {
        const m = document.getElementById('adminEditNewsModal');
        if (m) {
            m.style.display = 'none';
            m.classList.remove('active');
        }
    }

    saveNewsItem(e) {
        if (e) e.preventDefault();
        try {
            const title = document.getElementById('editNewsTitle')?.value?.trim();
            if (!title) {
                AdminView.showToast('تعذر الحفظ: يرجى كتابة عنوان الخبر أولاً.', true, 'حقل مطلوب ناقص');
                document.getElementById('editNewsTitle')?.focus();
                return;
            }

            const id = document.getElementById('editNewsId')?.value;
            const item = {
                title: title,
                date: document.getElementById('editNewsDate')?.value || '',
                excerpt: document.getElementById('editNewsExcerpt')?.value || '',
                content: document.getElementById('editNewsContent')?.value || ''
            };

            if (id) {
                NewsModel.update(id, item);
                AdminView.showToast('تم تعديل ونشر الخبر بنجاح! تم تحديث البوابة. 📰', false, 'تم الحفظ بنجاح!');
            } else {
                NewsModel.add(item);
                AdminView.showToast('تمت إضافة الخبر الجديد ونشره بنجاح! 📰', false, 'تم الحفظ بنجاح!');
            }

            this.closeNewsModal();
            this.loadAllData();
        } catch (err) {
            console.error('Error in saveNewsItem:', err);
            AdminView.showToast('فشل حفظ الخبر: ' + (err.message || 'حدث خطأ'), true, 'فشل الحفظ ❌');
        }
    }

    deleteNewsItem(id) {
        if (confirm('هل أنت تأكد من حذف هذا الخبر؟')) {
            NewsModel.delete(id);
            AdminView.showToast('تم حذف الخبر.');
            this.loadAllData();
        }
    }

    // ==========================================
    // PROJECTS CRUD (المشاريع التنموية)
    // ==========================================
    openAddProjectModal() {
        const modal = document.getElementById('adminProjectModal');
        if (!modal) return;
        document.getElementById('editProjId').value = '';
        document.getElementById('projTitleInput').value = '';
        document.getElementById('projCategoryInput').value = 'مشاريع التنمية الحضرية 🏗️';
        document.getElementById('projStatusInput').value = 'قيد الإنجاز';
        document.getElementById('projProgressInput').value = 75;
        document.getElementById('projBudgetInput').value = '500 مليون درهم';
        document.getElementById('projDetailsInput').value = '';
        document.getElementById('adminProjectModalTitle').textContent = 'إضافة مشروع تنموي جديد';
        modal.style.display = 'flex';
    }

    openEditProjectModal(id) {
        const projects = ProjectModel.getAll();
        const proj = projects.find(p => p.id === id);
        if (!proj) return;

        const modal = document.getElementById('adminProjectModal');
        if (!modal) return;
        document.getElementById('editProjId').value = proj.id;
        document.getElementById('projTitleInput').value = proj.title || '';
        document.getElementById('projCategoryInput').value = proj.category || '';
        document.getElementById('projStatusInput').value = proj.status || 'قيد الإنجاز';
        document.getElementById('projProgressInput').value = proj.progress || 0;
        document.getElementById('projBudgetInput').value = proj.budget || '';
        document.getElementById('projDetailsInput').value = proj.details || proj.description || '';
        document.getElementById('adminProjectModalTitle').textContent = `تعديل مشروع: ${proj.title}`;
        modal.style.display = 'flex';
    }

    closeProjectModal() {
        const modal = document.getElementById('adminProjectModal');
        if (modal) modal.style.display = 'none';
    }

    saveProject(e) {
        if (e) e.preventDefault();
        const editId = document.getElementById('editProjId')?.value;
        const title = document.getElementById('projTitleInput')?.value;
        const category = document.getElementById('projCategoryInput')?.value;
        const status = document.getElementById('projStatusInput')?.value;
        const progress = Number(document.getElementById('projProgressInput')?.value) || 0;
        const budget = document.getElementById('projBudgetInput')?.value;
        const details = document.getElementById('projDetailsInput')?.value;

        if (!title) return;

        if (editId) {
            ProjectModel.update(editId, { title, category, status, progress, budget, details });
            AdminView.showToast('تم تحديث بيانات المشروع التنموي بنجاح! 🚀');
        } else {
            ProjectModel.add({
                title, category, status, progress, budget, details,
                image: 'assets/ref_project_road.jpg'
            });
            AdminView.showToast('تمت إضافة المشروع التنموي الجديد بنجاح! 🚀');
        }

        localStorage.setItem('biougra_last_sync_timestamp', Date.now().toString());
        this.closeProjectModal();
        this.loadAllData();
    }

    deleteProject(id) {
        if (confirm('هل أنت متأكد من حذف هذا المشروع التنموي؟')) {
            ProjectModel.delete(id);
            localStorage.setItem('biougra_last_sync_timestamp', Date.now().toString());
            AdminView.showToast('تم حذف المشروع بنجاح.');
            this.loadAllData();
        }
    }

    // ==========================================
    // EVENTS CRUD (أنشطة ومناسبات الجماعة)
    // ==========================================
    renderEventsTable(events) {
        AdminView.renderEventsTable(events);
    }

    openAddEventModal() {
        const modal = document.getElementById('adminEventModal');
        if (!modal) return;
        document.getElementById('editEventId').value = '';
        document.getElementById('eventTitleInput').value = '';
        document.getElementById('eventDateInput').value = '';
        document.getElementById('eventLocationInput').value = 'مقر الجماعة الترابية';
        document.getElementById('adminEventModalTitle').textContent = 'إضافة نشاط أو مناسبة جديدة';
        modal.style.display = 'flex';
    }

    openEditEventModal(id) {
        const events = EventModel.getAll();
        const ev = events.find(e => e.id === id);
        if (!ev) return;

        const modal = document.getElementById('adminEventModal');
        if (!modal) return;
        document.getElementById('editEventId').value = ev.id;
        document.getElementById('eventTitleInput').value = ev.title || '';
        document.getElementById('eventDateInput').value = ev.date || '';
        document.getElementById('eventLocationInput').value = ev.location || '';
        if (ev.image) document.getElementById('eventImageInput').value = ev.image;
        document.getElementById('adminEventModalTitle').textContent = 'تعديل نشاط الجماعة';
        modal.style.display = 'flex';
    }

    closeEventModal() {
        const modal = document.getElementById('adminEventModal');
        if (modal) modal.style.display = 'none';
    }

    saveEvent(e) {
        if (e) e.preventDefault();
        const editId = document.getElementById('editEventId')?.value;
        const title = document.getElementById('eventTitleInput')?.value;
        const date = document.getElementById('eventDateInput')?.value;
        const location = document.getElementById('eventLocationInput')?.value;
        const image = document.getElementById('eventImageInput')?.value || 'assets/card_council.png';

        if (!title || !date) return;

        if (editId) {
            EventModel.update(editId, { title, date, location, image });
            AdminView.showToast('تم تعديل النشاط بنجاح! 📅');
        } else {
            EventModel.add({ title, date, location, image });
            AdminView.showToast('تمت إضافة النشاط بنجاح! 📅');
        }

        localStorage.setItem('biougra_last_sync_timestamp', Date.now().toString());
        this.closeEventModal();
        this.loadAllData();
    }

    deleteEvent(id) {
        if (confirm('هل أنت متأكد من حذف هذا النشاط؟')) {
            EventModel.delete(id);
            localStorage.setItem('biougra_last_sync_timestamp', Date.now().toString());
            AdminView.showToast('تم حذف النشاط.');
            this.loadAllData();
        }
    }

    // ==========================================
    // VIDEOS & GALLERY CRUD (معرض الصور والفيديوهات)
    // ==========================================
    renderVideosTable(videos) {
        AdminView.renderVideosTable(videos);
    }

    openAddVideoModal() {
        const modal = document.getElementById('adminVideoModal');
        if (!modal) return;
        document.getElementById('editVideoId').value = '';
        document.getElementById('videoTitleInput').value = '';
        document.getElementById('videoDurationInput').value = '02:30';
        document.getElementById('adminVideoModalTitle').textContent = 'إضافة وسيط أو فيديو جديد';
        modal.style.display = 'flex';
    }

    openEditVideoModal(id) {
        const videos = VideoModel.getAll();
        const vid = videos.find(v => v.id === id);
        if (!vid) return;

        const modal = document.getElementById('adminVideoModal');
        if (!modal) return;
        document.getElementById('editVideoId').value = vid.id;
        document.getElementById('videoTitleInput').value = vid.title || '';
        document.getElementById('videoDurationInput').value = vid.duration || '02:30';
        if (vid.thumbnail) document.getElementById('videoThumbInput').value = vid.thumbnail;
        document.getElementById('adminVideoModalTitle').textContent = 'تعديل الوسيط أو الفيديو';
        modal.style.display = 'flex';
    }

    closeVideoModal() {
        const modal = document.getElementById('adminVideoModal');
        if (modal) modal.style.display = 'none';
    }

    saveVideo(e) {
        if (e) e.preventDefault();
        const editId = document.getElementById('editVideoId')?.value;
        const title = document.getElementById('videoTitleInput')?.value;
        const duration = document.getElementById('videoDurationInput')?.value || '02:30';
        const thumbnail = document.getElementById('videoThumbInput')?.value || 'assets/video_park.png';

        if (!title) return;

        if (editId) {
            VideoModel.update(editId, { title, duration, thumbnail });
            AdminView.showToast('تم تحديث عنصر المعرض بنجاح! 🎥');
        } else {
            VideoModel.add({ title, duration, thumbnail });
            AdminView.showToast('تمت إضافة عنصر المعرض الجديد! 🎥');
        }

        localStorage.setItem('biougra_last_sync_timestamp', Date.now().toString());
        this.closeVideoModal();
        this.loadAllData();
    }

    deleteVideo(id) {
        if (confirm('هل أنت متأكد من حذف هذا الوسيط؟')) {
            VideoModel.delete(id);
            localStorage.setItem('biougra_last_sync_timestamp', Date.now().toString());
            AdminView.showToast('تم حذف الوسيط.');
            this.loadAllData();
        }
    }

    // Publications CRUD
    openAddPubModal() {
        const title = prompt('عنوان المنشور أو التقرير:');
        if (!title) return;
        const type = prompt('نوع المنشور (تقرير سنوي، ميزانية، اتفاقية):', 'تقرير إداري');
        const size = prompt('حجم الملف (مثال: 3.5 MB PDF):', '2.0 MB PDF');

        PublicationModel.add({
            title: title,
            type: type || 'تقرير',
            size: size || '1.0 MB PDF'
        });

        AdminView.showToast('تم إضافة المنشور بنجاح!');
        this.loadAllData();
    }

    openEditPubModal(id) {
        const pubs = PublicationModel.getAll();
        const pub = pubs.find(p => p.id === Number(id) || p.id === id);
        if (!pub) return;
        const newTitle = prompt('تعديل عنوان المنشور:', pub.title);
        if (!newTitle) return;
        const newType = prompt('تعديل نوع المنشور:', pub.type);
        const newSize = prompt('تعديل حجم الملف:', pub.size);

        PublicationModel.update(pub.id, {
            title: newTitle,
            type: newType || pub.type,
            size: newSize || pub.size
        });

        AdminView.showToast('تم تعديل بيانات المنشور بنجاح.');
        this.loadAllData();
    }

    deletePubItem(id) {
        if (confirm('هل تود حذف هذا المنشور؟')) {
            PublicationModel.delete(id);
            AdminView.showToast('تم حذف المنشور.');
            this.loadAllData();
        }
    }


    // ==========================================
    // MANDATE 2021-2027 METHODS (الولاية 2021-2027)
    // ==========================================
    showMandateSubTab(tab) {
        document.getElementById('adminMandateBureauCard').style.display = (tab === 'bureau') ? 'block' : 'none';
        document.getElementById('adminMandateCommitteesCard').style.display = (tab === 'committees') ? 'block' : 'none';
        document.getElementById('adminMandateCouncilCard').style.display = (tab === 'council') ? 'block' : 'none';

        document.getElementById('adminMandateTabBureau').className = (tab === 'bureau') ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm';
        document.getElementById('adminMandateTabCommittees').className = (tab === 'committees') ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm';
        document.getElementById('adminMandateTabCouncil').className = (tab === 'council') ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm';
    }

    saveMayorData(e) {
        if (e) e.preventDefault();
        const name = document.getElementById('mayorNameInput')?.value;
        const role = document.getElementById('mayorRoleInput')?.value;
        const quote = document.getElementById('mayorQuoteInput')?.value;

        if (!name) return;

        MandateModel.updateMayor(name, quote, role);
        localStorage.setItem('biougra_last_sync_timestamp', Date.now().toString());
        AdminView.showToast('تم حفظ وتحديث بيانات وكلمة رئيس المجلس بنجاح! 👑');
        this.loadMandateData();
    }

    loadMandateData() {
        const mandate = MandateModel.get();
        if (!mandate) return;

        // Populate Mayor Form
        if (mandate.bureau && mandate.bureau.length > 0) {
            const mayor = mandate.bureau[0];
            const nameEl = document.getElementById('mayorNameInput');
            const roleEl = document.getElementById('mayorRoleInput');
            const quoteEl = document.getElementById('mayorQuoteInput');
            if (nameEl) nameEl.value = mayor.name || '';
            if (roleEl) roleEl.value = mayor.role || '';
            if (quoteEl) quoteEl.value = mayor.quote || '';
        }

        // Render Bureau Table
        const bureauTbody = document.getElementById('adminBureauTableBody');
        if (bureauTbody) {
            bureauTbody.innerHTML = mandate.bureau.map(m => `
                <tr>
                    <td><strong style="color: var(--primary-color);">${m.role}</strong></td>
                    <td>${m.name}</td>
                    <td><span class="badge badge-info">${m.party || 'الأغلبية'}</span></td>
                    <td>${m.phone || '-'}</td>
                    <td>
                        <button onclick="window.adminController.deleteBureauMember(${m.id})" class="btn btn-sm btn-outline" style="color: #ef4444; border-color: #ef4444;">حذف</button>
                    </td>
                </tr>
            `).join('');
        }

        // Render Committees Table
        const commTbody = document.getElementById('adminCommitteesTableBody');
        if (commTbody) {
            commTbody.innerHTML = mandate.committees.map(c => `
                <tr>
                    <td><strong style="color: var(--primary-color);">${c.name}</strong></td>
                    <td>${c.president}</td>
                    <td>${c.vice}</td>
                    <td><span class="badge badge-warning">${c.membersCount} أعضاء</span></td>
                    <td style="font-size: 0.85rem; color: #64748b;">${c.description}</td>
                </tr>
            `).join('');
        }

        // Render Council Members Table
        const councilTbody = document.getElementById('adminCouncilMembersTableBody');
        if (councilTbody) {
            councilTbody.innerHTML = mandate.councilMembers.map(m => `
                <tr>
                    <td><strong>${m.name}</strong></td>
                    <td><span class="badge badge-info">${m.role}</span></td>
                    <td>${m.district || '-'}</td>
                    <td>${m.committee || '-'}</td>
                    <td>
                        <button onclick="window.adminController.deleteCouncilMember(${m.id})" class="btn btn-sm btn-outline" style="color: #ef4444; border-color: #ef4444;">حذف</button>
                    </td>
                </tr>
            `).join('');
        }
    }

    openAddCouncilMemberModal() {
        document.getElementById('adminAddCouncilMemberModal').style.display = 'flex';
    }

    closeCouncilMemberModal() {
        document.getElementById('adminAddCouncilMemberModal').style.display = 'none';
    }

    saveCouncilMember(e) {
        if (e) e.preventDefault();
        const name = document.getElementById('memberFullName')?.value;
        const role = document.getElementById('memberRole')?.value;
        const district = document.getElementById('memberDistrict')?.value;
        const committee = document.getElementById('memberCommittee')?.value;
        const targetType = document.getElementById('memberTargetType')?.value;
        const cv = document.getElementById('memberCv')?.value || 'فاعل محلي يساهم في تدبير شؤون جماعة بيوكرى.';

        if (!name || !role) return;

        if (targetType === 'both' || targetType === 'bureau') {
            MandateModel.addBureauMember({ role, name, party: 'الأغلبية', cv, phone: '-' });
        }
        if (targetType === 'both' || targetType === 'council') {
            MandateModel.addCouncilMember({ name, role, district, committee, cv });
        }

        this.closeCouncilMemberModal();
        AdminView.showToast('تمت إضافة العضو بنجاح إلى تشكيلة المجلس!');
        this.loadMandateData();
    }

    deleteBureauMember(id) {
        if (confirm('هل أنت متأكد من حذف هذا العضو من المكتب المسير؟')) {
            MandateModel.deleteBureauMember(id);
            AdminView.showToast('تم حذف العضو من المكتب.');
            this.loadMandateData();
        }
    }

    deleteCouncilMember(id) {
        if (confirm('هل أنت متأكد من حذف هذا العضو من المجلس؟')) {
            MandateModel.deleteCouncilMember(id);
            AdminView.showToast('تم حذف العضو.');
            this.loadMandateData();
        }
    }

    // ==========================================
    // SYNTHESIS REPORT & COMPETENCES METHODS
    // ==========================================
    loadSynthesisData() {
        const report = SynthesisReportModel.get();
        if (!report) return;

        const titleInput = document.getElementById('synthesisReportTitleInput');
        const introInput = document.getElementById('synthesisReportIntroInput');
        if (titleInput) titleInput.value = report.title || '';
        if (introInput) introInput.value = report.introduction || '';

        // Render Activity Axes
        const axesTbody = document.getElementById('adminActivityAxesTableBody');
        if (axesTbody) {
            axesTbody.innerHTML = report.activityAxes.map(axis => `
                <tr>
                    <td><strong style="color: var(--primary-color);">${axis.name}</strong></td>
                    <td><span class="badge badge-info">${axis.budget}</span></td>
                    <td>${axis.projectsCount} مشاريع</td>
                    <td>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <div style="flex-grow: 1; background: #e2e8f0; height: 8px; border-radius: 4px; overflow: hidden;">
                                <div style="width: ${axis.completionRate}%; background: var(--accent-color); height: 100%;"></div>
                            </div>
                            <strong>${axis.completionRate}%</strong>
                        </div>
                    </td>
                </tr>
            `).join('');
        }

        this.renderCompProjectsTable();
    }

    saveSynthesisIntro(e) {
        if (e) e.preventDefault();
        const title = document.getElementById('synthesisReportTitleInput')?.value;
        const intro = document.getElementById('synthesisReportIntroInput')?.value;
        if (!intro) return;

        SynthesisReportModel.updateIntro(intro, title);
        AdminView.showToast('تم حفظ التقرير التركيبي والمقدمة بنجاح!');
    }

    filterCompProjects(status) {
        this.currentCompFilter = status;
        this.renderCompProjectsTable();
    }

    renderCompProjectsTable() {
        const report = SynthesisReportModel.get();
        if (!report) return;

        let projects = report.competenceProjects || [];
        if (this.currentCompFilter && this.currentCompFilter !== 'all') {
            projects = projects.filter(p => p.status === this.currentCompFilter);
        }

        const tbody = document.getElementById('adminCompProjectsTableBody');
        if (!tbody) return;

        tbody.innerHTML = projects.map(p => {
            let statusBadge = '<span class="badge-status-etude">لدراسة</span>';
            if (p.status === 'في طور الإنجاز') statusBadge = '<span class="badge-status-encours">في طور الإنجاز</span>';
            if (p.status === 'تم تنفيذه') statusBadge = '<span class="badge-status-realise">تم تنفيذه / منجز</span>';

            return `
                <tr>
                    <td>
                        <strong>${p.projectName}</strong>
                        ${p.notes ? `<div style="font-size: 0.8rem; color: #64748b; margin-top: 3px;">${p.notes}</div>` : ''}
                    </td>
                    <td><span style="font-size: 0.85rem; font-weight: 600;">${p.competenceType}</span></td>
                    <td>${statusBadge}</td>
                    <td>${p.timeline || '-'}</td>
                    <td><strong>${Number(p.budget).toLocaleString()} درهم</strong></td>
                    <td>
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <span style="font-weight: 700; color: var(--primary-color);">${p.progress}%</span>
                        </div>
                    </td>
                    <td>
                        <button onclick="window.adminController.deleteCompProject(${p.id})" class="btn btn-sm btn-outline" style="color: #ef4444; border-color: #ef4444;">حذف</button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    openAddCompetenceProjectModal() {
        document.getElementById('adminAddCompetenceProjectModal').style.display = 'flex';
    }

    closeCompetenceProjectModal() {
        document.getElementById('adminAddCompetenceProjectModal').style.display = 'none';
    }

    saveCompetenceProject(e) {
        if (e) e.preventDefault();
        const name = document.getElementById('compProjName')?.value;
        const type = document.getElementById('compProjType')?.value;
        const status = document.getElementById('compProjStatus')?.value;
        const budget = Number(document.getElementById('compProjBudget')?.value) || 0;
        const timeline = document.getElementById('compProjTimeline')?.value;
        const progress = Number(document.getElementById('compProjProgress')?.value) || 0;
        const notes = document.getElementById('compProjNotes')?.value;

        if (!name) return;

        SynthesisReportModel.addProject({
            projectName: name,
            competenceType: type,
            status: status,
            budget: budget,
            timeline: timeline,
            progress: progress,
            notes: notes
        });

        this.closeCompetenceProjectModal();
        AdminView.showToast('تمت إضافة مشروع الاختصاص بنجاح!');
        this.loadSynthesisData();
    }

    deleteCompProject(id) {
        if (confirm('هل تود حذف هذا المشروع من التقرير التركيبي؟')) {
            SynthesisReportModel.deleteProject(id);
            AdminView.showToast('تم حذف المشروع.');
            this.loadSynthesisData();
        }
    }

    printSynthesisReport() {
        const report = SynthesisReportModel.get();
        if (!report) return;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html lang="ar" dir="rtl">
            <head>
                <title>${report.title}</title>
                <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;600;700&display=swap" rel="stylesheet">
                <style>
                    body { font-family: 'IBM Plex Sans Arabic', sans-serif; direction: rtl; padding: 40px; color: #1e293b; }
                    h1 { color: #0d5ea6; text-align: center; border-bottom: 3px solid #c69c55; padding-bottom: 15px; }
                    .intro { background: #f8fafc; padding: 20px; border-right: 4px solid #0d5ea6; margin: 25px 0; font-size: 1.05rem; line-height: 1.8; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #cbd5e1; padding: 10px 14px; text-align: right; }
                    th { background-color: #0d5ea6; color: white; }
                    tr:nth-child(even) { background-color: #f8fafc; }
                    .header-tag { text-align: center; color: #64748b; margin-bottom: 25px; }
                </style>
            </head>
            <body>
                <div class="header-tag">المملكة المغربية • وزارة الداخلية • الجماعة الترابية</div>
                <h1>${report.title}</h1>
                <div class="intro">
                    <strong>مقدمة التقرير والسياق العام:</strong><br>
                    ${report.introduction}
                </div>
                <h2>مشاريع الجماعة حسب الاختصاصات (Les Compétences)</h2>
                <table>
                    <thead>
                        <tr>
                            <th>المشروع</th>
                            <th>مجال الاختصاص</th>
                            <th>الحالة</th>
                            <th>الاعتمادات المالية</th>
                            <th>المخطط</th>
                            <th>نسبة الإنجاز</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${report.competenceProjects.map(p => `
                            <tr>
                                <td><strong>${p.projectName}</strong></td>
                                <td>${p.competenceType}</td>
                                <td>${p.status}</td>
                                <td>${Number(p.budget).toLocaleString()} درهم</td>
                                <td>${p.timeline}</td>
                                <td>${p.progress}%</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => { printWindow.print(); }, 500);
    }

    // ==========================================
    // SUBVENTIONS METHODS (تدبير الدعم للجمعيات)
    // ==========================================
    // ==========================================
    // SUBVENTIONS (الدعم العمومي للجمعيات)
    // ==========================================
    loadSubventionsData() {
        const sub = SubventionModel.get();
        if (!sub) return;

        const titleInput = document.getElementById('adminSubDecisionTitleInput');
        const detailsInput = document.getElementById('adminSubDecisionDetailsInput');
        if (titleInput) titleInput.value = sub.decisionTitle || '';
        if (detailsInput) detailsInput.value = sub.decisionDetails || '';

        const titleEl = document.getElementById('adminSubventionDecisionTitle');
        const detailsEl = document.getElementById('adminSubventionDecisionDetails');
        if (titleEl) titleEl.innerText = sub.decisionTitle || '';
        if (detailsEl) detailsEl.innerText = sub.decisionDetails || '';

        const tbody = document.getElementById('adminSubventionsTableBody');
        if (!tbody) return;

        tbody.innerHTML = (sub.beneficiaries || []).map(b => `
            <tr>
                <td>
                    <strong>${b.projectName || b.assocName}</strong>
                    <div style="font-size: 0.8rem; color: #64748b;">${b.assocName}</div>
                </td>
                <td>${b.president || '-'}</td>
                <td><span class="badge badge-info">${b.assocType}</span></td>
                <td><span class="badge badge-success">${b.statutStatus || 'مطابقة'}</span></td>
                <td style="font-size: 0.85rem; color: #15803d;">${b.legalStatus || 'موافقة'}</td>
                <td style="font-size: 0.85rem; color: #64748b;">${b.annualRef || '2026/01'}</td>
                <td><strong style="color: var(--primary-color);">${Number(b.amount).toLocaleString()} درهم</strong></td>
                <td>
                    <div style="display: flex; gap: 6px;">
                        <button onclick="window.adminController.openEditSubventionModal(${b.id})" class="btn btn-sm btn-primary" style="padding: 4px 10px; font-size: 0.8rem;">تعديل ✏️</button>
                        <button onclick="window.adminController.deleteSubventionBeneficiary(${b.id})" class="btn btn-sm btn-outline" style="color: #ef4444; border-color: #ef4444; padding: 4px 8px; font-size: 0.8rem;">حذف 🗑️</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    saveSubventionDecision(e) {
        if (e) e.preventDefault();
        const title = document.getElementById('adminSubDecisionTitleInput')?.value;
        const details = document.getElementById('adminSubDecisionDetailsInput')?.value;
        if (!title) return;
        SubventionModel.updateDecision(title, details);
        AdminView.showToast('تم تحديث نص قرار ومعايير الدعم بنجاح!');
        this.loadSubventionsData();
    }

    openAddSubventionModal() {
        const form = document.getElementById('adminSubventionForm');
        if (form) form.reset();
        document.getElementById('editSubId').value = '';
        document.getElementById('subModalTitle').textContent = 'إضافة جمعية مستفيدة من الدعم العمومي';
        document.getElementById('adminAddSubventionModal').style.display = 'flex';
    }

    openEditSubventionModal(id) {
        const sub = SubventionModel.get();
        const b = (sub.beneficiaries || []).find(item => item.id == id);
        if (!b) return;

        document.getElementById('editSubId').value = b.id;
        document.getElementById('subProjectName').value = b.projectName || '';
        document.getElementById('subAssocName').value = b.assocName || '';
        document.getElementById('subPresident').value = b.president || '';
        document.getElementById('subAssocType').value = b.assocType || 'رياضية';
        document.getElementById('subStatut').value = b.statutStatus || 'مطابقة';
        document.getElementById('subLegalStatus').value = b.legalStatus || 'موافقة';
        document.getElementById('subAnnualRef').value = b.annualRef || '2026/01';
        document.getElementById('subAmount').value = b.amount || 0;
        document.getElementById('subProgress').value = b.progress || 80;
        document.getElementById('subPvNumber').value = b.pvNumber || '';

        document.getElementById('subModalTitle').textContent = 'تعديل بيانات الجمعية المستفيدة';
        document.getElementById('adminAddSubventionModal').style.display = 'flex';
    }

    closeSubventionModal() {
        document.getElementById('adminAddSubventionModal').style.display = 'none';
    }

    saveSubventionBeneficiary(e) {
        if (e) e.preventDefault();
        const editId = document.getElementById('editSubId')?.value;
        const projectName = document.getElementById('subProjectName')?.value || '';
        const assocName = document.getElementById('subAssocName')?.value || '';
        const president = document.getElementById('subPresident')?.value || '';
        const assocType = document.getElementById('subAssocType')?.value || 'رياضية';
        const statut = document.getElementById('subStatut')?.value || 'مطابقة';
        const legalStatus = document.getElementById('subLegalStatus')?.value || 'موافقة';
        const annualRef = document.getElementById('subAnnualRef')?.value || '2026/01';
        const amount = Number(document.getElementById('subAmount')?.value) || 0;
        const progress = Number(document.getElementById('subProgress')?.value) || 80;
        const pvNumber = document.getElementById('subPvNumber')?.value || '';

        if (!assocName || !amount) {
            alert('يرجى ملء اسم الجمعية ومبلغ الدعم المالي.');
            return;
        }

        const payload = {
            projectName: projectName || assocName,
            assocName,
            president,
            assocType,
            statutStatus: statut,
            legalStatus,
            annualRef,
            pvNumber,
            amount,
            progress,
            projectSupported: projectName || assocName,
            year: new Date().getFullYear()
        };

        if (editId) {
            SubventionModel.updateBeneficiary(editId, payload);
            AdminView.showToast('تم تحديث بيانات الجمعية بنجاح!');
        } else {
            SubventionModel.addBeneficiary(payload);
            AdminView.showToast('تم تسجيل الجمعية المستفيدة بنجاح!');
        }

        this.closeSubventionModal();
        this.loadSubventionsData();
    }

    deleteSubventionBeneficiary(id) {
        if (confirm('هل تود حذف هذه الجمعية من لائحة المستفيدين؟')) {
            SubventionModel.deleteBeneficiary(id);
            AdminView.showToast('تم حذف الجمعية بنجاح.');
            this.loadSubventionsData();
        }
    }

    downloadSubventionFiche() {
        // Generate and download formal institutional printable application fiche
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
    // POLLS METHODS (سبر الآراء والمشاعر)
    // ==========================================
    loadPollsData() {
        const polls = PollModel.getAll();
        const container = document.getElementById('adminPollsListContainer');
        if (!container) return;

        if (polls.length === 0) {
            container.innerHTML = '<div style="color: #64748b; padding: 20px; text-align: center;">لا توجد استطلاعات رأي حالياً. قم بإنشاء سؤال جديد أعلاه.</div>';
            return;
        }

        container.innerHTML = polls.map(p => {
            let optionsHtml = '';
            if (p.type === 'sentiment' && p.sentimentOptions) {
                optionsHtml = p.sentimentOptions.map(opt => {
                    const pct = p.totalVotes > 0 ? Math.round((opt.votes / p.totalVotes) * 100) : 0;
                    return `
                        <div style="margin-bottom: 8px;">
                            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 2px;">
                                <span>${opt.emoji} ${opt.label} (${opt.votes} صوت)</span>
                                <strong>${pct}%</strong>
                            </div>
                            <div style="background: #e2e8f0; height: 6px; border-radius: 3px; overflow: hidden;">
                                <div style="background: var(--accent-color); width: ${pct}%; height: 100%;"></div>
                            </div>
                        </div>
                    `;
                }).join('');
            } else if (p.options) {
                optionsHtml = p.options.map(opt => {
                    const pct = p.totalVotes > 0 ? Math.round((opt.votes / p.totalVotes) * 100) : 0;
                    return `
                        <div style="margin-bottom: 8px;">
                            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 2px;">
                                <span>${opt.label} (${opt.votes} صوت)</span>
                                <strong>${pct}%</strong>
                            </div>
                            <div style="background: #e2e8f0; height: 6px; border-radius: 3px; overflow: hidden;">
                                <div style="background: var(--primary-color); width: ${pct}%; height: 100%;"></div>
                            </div>
                        </div>
                    `;
                }).join('');
            }

            return `
                <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin-bottom: 15px; background: ${p.isActive ? '#f0fdf4' : '#ffffff'};">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
                        <div>
                            <span class="badge ${p.isActive ? 'badge-success' : 'badge-info'}">${p.isActive ? 'نشط على البوابة حالياً ✓' : 'أرشيف'}</span>
                            <span style="font-size: 0.85rem; color: #64748b; margin-right: 8px;">التصنيف: ${p.category} • تاريخ النشر: ${p.createdAt}</span>
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <button onclick="window.adminController.togglePollActive(${p.id})" class="btn btn-sm ${p.isActive ? 'btn-outline' : 'btn-primary'}">
                                ${p.isActive ? 'إيقاف النشاط' : 'تفعيل ونشر'}
                            </button>
                            <button onclick="window.adminController.deletePoll(${p.id})" class="btn btn-sm btn-outline" style="color: #ef4444; border-color: #ef4444;">حذف</button>
                        </div>
                    </div>
                    <h4 style="color: var(--primary-color); font-size: 1.1rem; margin-bottom: 14px;">${p.question}</h4>
                    <div style="background: #ffffff; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0;">
                        <div style="font-weight: 700; font-size: 0.9rem; margin-bottom: 10px; color: #334155;">إجمالي المصوتين: ${p.totalVotes} مواطن</div>
                        ${optionsHtml}
                    </div>
                </div>
            `;
        }).join('');
    }

    handleCreatePoll(e) {
        if (e) e.preventDefault();
        const question = document.getElementById('newPollQuestion')?.value;
        const category = document.getElementById('newPollCategory')?.value;
        const type = document.getElementById('newPollType')?.value;
        const isActive = document.getElementById('newPollIsActive')?.checked;

        if (!question) return;

        PollModel.createPoll({
            question,
            category,
            type,
            isActive
        });

        document.getElementById('newPollQuestion').value = '';
        AdminView.showToast('تم نشر سؤال استطلاع الرأي والمشاعر بنجاح!');
        this.loadPollsData();
    }

    togglePollActive(id) {
        PollModel.setActive(id);
        AdminView.showToast('تم تحديث حالة تفعيل الاستطلاع على البوابة.');
        this.loadPollsData();
    }

    deletePoll(id) {
        if (confirm('هل تود حذف هذا الاستطلاع؟')) {
            PollModel.deletePoll(id);
            AdminView.showToast('تم حذف الاستطلاع.');
            this.loadPollsData();
        }
    }
    // ==========================================
    // ESSENTIAL CIVIC PROCEDURES METHODS (فضاء المواطن 3D)
    // ==========================================
    handleLogoUpload(event) {
        try {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                const base64 = e.target.result;
                const input = document.getElementById('brandLogoUrlInput');
                const preview = document.getElementById('brandLogoPreview');
                const adminSidebarLogo = document.getElementById('adminSidebarLogo');

                if (input) input.value = base64;
                if (preview) preview.src = base64;
                if (adminSidebarLogo) adminSidebarLogo.src = base64;

                // Auto-save logo directly to BrandingModel
                const current = BrandingModel.get() || {};
                current.logoUrl = base64;
                BrandingModel.save(current);

                AdminView.showToast('تم رفع وحفظ لوغو الجماعة بنجاح! تم التحديث في الهيدر والفوتر مباشرة. 🏛️', false, 'تم الحفظ والتطبيق! ✅');
            };
            reader.onerror = () => {
                AdminView.showToast('فشل قراءة ملف الشعار المحدد.', true, 'خطأ في قراءة الصورة');
            };
            reader.readAsDataURL(file);
        } catch (err) {
            AdminView.showToast('فشل تحميل الشعار: ' + (err.message || 'خطأ'), true, 'خطأ');
        }
    }

    handleSlideImageUpload(slideNum, event) {
        try {
            const file = event.target.files[0];
            if (!file) return;

            if (file.size > 2.5 * 1024 * 1024) {
                AdminView.showToast('تنبيه: حجم الصورة كبير (' + (file.size / (1024 * 1024)).toFixed(1) + ' ميغابايت). يُفضل اختيار صورة أقل من 2MB.', true, 'تنبيه حجم الصورة ⚠️');
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const base64 = e.target.result;
                const input = document.getElementById('heroSlide' + slideNum + 'ImgInput');
                const preview = document.getElementById('heroSlide' + slideNum + 'ImgPreview');
                if (input) input.value = base64;
                if (preview) preview.src = base64;

                // Auto-save image directly to BrandingModel so it instantly reflects on the front page!
                const current = BrandingModel.get() || {};
                current['heroSlide' + slideNum + 'Img'] = base64;
                BrandingModel.save(current);

                AdminView.showToast('تم رفع صورة الشريحة ' + slideNum + ' وحفظها بنجاح! تم تطبيق التغيير فوراً على الواجهة الرئيسية. 📸', false, 'تم الحفظ والتطبيق! ✅');
            };
            reader.onerror = () => {
                AdminView.showToast('فشل قراءة ملف الصورة المحدد، يرجى تجربة صورة أخرى.', true, 'خطأ في قراءة الصورة ❌');
            };
            reader.readAsDataURL(file);
        } catch (err) {
            AdminView.showToast('فشل تحميل الصورة: ' + (err.message || 'خطأ'), true, 'خطأ ❌');
        }
    }

    handleHeroBgUpload(event) {
        try {
            const file = event.target.files[0];
            if (!file) return;

            if (file.size > 3 * 1024 * 1024) {
                AdminView.showToast('تنبيه: حجم صورة الخلفية كبير (' + (file.size / (1024 * 1024)).toFixed(1) + ' ميغابايت). يُفضل اختيار صورة أقل من 2MB.', true, 'تنبيه حجم الصورة ⚠️');
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const base64 = e.target.result;
                const input = document.getElementById('heroBgImgInput');
                const preview = document.getElementById('heroBgImgPreview');
                if (input) input.value = base64;
                if (preview) preview.src = base64;

                // Auto-save hero background
                const current = BrandingModel.get() || {};
                current['heroBgImg'] = base64;
                BrandingModel.save(current);

                AdminView.showToast('تم رفع صورة خلفية الواجهة وحفظها بنجاح! تم تطبيق التغيير فوراً. 🌄', false, 'تم الحفظ والتطبيق! ✅');
            };
            reader.onerror = () => {
                AdminView.showToast('فشل قراءة ملف صورة الخلفية.', true, 'خطأ في قراءة الصورة ❌');
            };
            reader.readAsDataURL(file);
        } catch (err) {
            AdminView.showToast('فشل تحميل الصورة: ' + (err.message || 'خطأ'), true, 'خطأ ❌');
        }
    }

    loadProceduresData() {
        const procedures = ProcedureModel.getAll();
        AdminView.renderProceduresTable(procedures);
    }

    openAddProcedureModal() {
        const modal = document.getElementById('adminProcedureModal');
        if (!modal) return;
        document.getElementById('editProcId').value = '';
        document.getElementById('procNumInput').value = '';
        document.getElementById('procTitleInput').value = '';
        document.getElementById('procDescInput').value = '';
        document.getElementById('procDocsInput').value = 'بطاقة التعريف الوطنية الإلكترونية\nوثيقة إثبات السكنى أو النشاط';
        document.getElementById('procDeadlineInput').value = '24 إلى 48 ساعة';
        document.getElementById('procCostInput').value = 'مجانية';
        document.getElementById('adminProcedureModalTitle').textContent = 'إضافة إجراء إداري جديد';
        modal.style.display = 'flex';
    }

    openEditProcedureModal(id) {
        const proc = ProcedureModel.getById(id);
        if (!proc) return;
        const modal = document.getElementById('adminProcedureModal');
        if (!modal) return;
        document.getElementById('editProcId').value = proc.id;
        document.getElementById('procNumInput').value = proc.num || '';
        document.getElementById('procTitleInput').value = proc.title || '';
        document.getElementById('procDescInput').value = proc.desc || '';
        document.getElementById('procDocsInput').value = proc.documents || '';
        document.getElementById('procDeadlineInput').value = proc.deadline || '';
        document.getElementById('procCostInput').value = proc.cost || '';
        if (proc.icon) document.getElementById('procIconInput').value = proc.icon;
        document.getElementById('adminProcedureModalTitle').textContent = `تعديل: ${proc.title}`;
        modal.style.display = 'flex';
    }

    closeProcedureModal() {
        const modal = document.getElementById('adminProcedureModal');
        if (modal) modal.style.display = 'none';
    }

    saveProcedure(e) {
        if (e) e.preventDefault();
        try {
            const editId = document.getElementById('editProcId')?.value;
            const num = document.getElementById('procNumInput')?.value?.trim();
            const title = document.getElementById('procTitleInput')?.value?.trim();
            const desc = document.getElementById('procDescInput')?.value?.trim();
            const documents = document.getElementById('procDocsInput')?.value || '';
            const deadline = document.getElementById('procDeadlineInput')?.value || '';
            const cost = document.getElementById('procCostInput')?.value || '';
            const icon = document.getElementById('procIconInput')?.value || 'assets/medallion_residence.png';

            if (!title) {
                AdminView.showToast('تعذر الحفظ: يرجى كتابة عنوان الإجراء الإداري.', true, 'حقل مطلوب ناقص');
                document.getElementById('procTitleInput')?.focus();
                return;
            }

            if (editId) {
                ProcedureModel.update(editId, { num, title, desc, documents, deadline, cost, icon });
                AdminView.showToast('تم تعديل الإجراء الإداري بنجاح وتحديث فضاء المواطن! 🏛️', false, 'تم الحفظ بنجاح!');
            } else {
                ProcedureModel.add({ num, title, desc, documents, deadline, cost, icon });
                AdminView.showToast('تمت إضافة الإجراء الإداري الجديد بنجاح إلى فضاء المواطن! 🏛️', false, 'تم الحفظ بنجاح!');
            }

            this.closeProcedureModal();
            this.loadProceduresData();
        } catch (err) {
            console.error('Save procedure error:', err);
            AdminView.showToast('فشل حفظ الإجراء الإداري: ' + (err.message || 'حدث خطأ غير متوقع'), true, 'فشل الحفظ ❌');
        }
    }

    deleteProcedure(id) {
        if (confirm('هل أنت متأكد من حذف هذا الإجراء الإداري؟')) {
            ProcedureModel.delete(id);
            AdminView.showToast('تم حذف الإجراء الإداري.');
            this.loadProceduresData();
        }
    }

    // ==========================================
    // SYNTHESIS STRATEGIC AXES METHODS (محاور الاختصاصات الأربعة)
    // ==========================================
    loadSynthesisAxes() {
        const report = SynthesisReportModel.get();
        if (!report || !report.activityAxes) return;
        const axes = report.activityAxes;
        if (axes[0]) {
            if (document.getElementById('axis1Name')) document.getElementById('axis1Name').value = axes[0].name || '';
            if (document.getElementById('axis1Budget')) document.getElementById('axis1Budget').value = axes[0].budget || '';
            if (document.getElementById('axis1Projects')) document.getElementById('axis1Projects').value = axes[0].projectsCount || 4;
        }
        if (axes[1]) {
            if (document.getElementById('axis2Name')) document.getElementById('axis2Name').value = axes[1].name || '';
            if (document.getElementById('axis2Budget')) document.getElementById('axis2Budget').value = axes[1].budget || '';
            if (document.getElementById('axis2Projects')) document.getElementById('axis2Projects').value = axes[1].projectsCount || 5;
        }
        if (axes[2]) {
            if (document.getElementById('axis3Name')) document.getElementById('axis3Name').value = axes[2].name || '';
            if (document.getElementById('axis3Budget')) document.getElementById('axis3Budget').value = axes[2].budget || '';
            if (document.getElementById('axis3Projects')) document.getElementById('axis3Projects').value = axes[2].projectsCount || 3;
        }
        if (axes[3]) {
            if (document.getElementById('axis4Name')) document.getElementById('axis4Name').value = axes[3].name || '';
            if (document.getElementById('axis4Budget')) document.getElementById('axis4Budget').value = axes[3].budget || '';
            if (document.getElementById('axis4Projects')) document.getElementById('axis4Projects').value = axes[3].projectsCount || 6;
        }
    }

    saveSynthesisAxes(e) {
        if (e) e.preventDefault();
        try {
            const report = SynthesisReportModel.get() || {};
            const currentAxes = report.activityAxes || [];

            const updatedAxes = [
                {
                    id: 1,
                    name: document.getElementById('axis1Name')?.value || 'قطاع التهيئة الحضرية والبنية التحتية',
                    budget: document.getElementById('axis1Budget')?.value || '65,000,000 درهم',
                    projectsCount: Number(document.getElementById('axis1Projects')?.value) || 4,
                    completionRate: currentAxes[0]?.completionRate || 85,
                    icon: currentAxes[0]?.icon || '🏛️'
                },
                {
                    id: 2,
                    name: document.getElementById('axis2Name')?.value || 'قطاع التعليم والثقافة والرياضة',
                    budget: document.getElementById('axis2Budget')?.value || '40,000,000 درهم',
                    projectsCount: Number(document.getElementById('axis2Projects')?.value) || 5,
                    completionRate: currentAxes[1]?.completionRate || 75,
                    icon: currentAxes[1]?.icon || '🎓'
                },
                {
                    id: 3,
                    name: document.getElementById('axis3Name')?.value || 'قطاع الحكامة والتحول الرقمي',
                    budget: document.getElementById('axis3Budget')?.value || '25,000,000 درهم',
                    projectsCount: Number(document.getElementById('axis3Projects')?.value) || 3,
                    completionRate: currentAxes[2]?.completionRate || 90,
                    icon: currentAxes[2]?.icon || '💻'
                },
                {
                    id: 4,
                    name: document.getElementById('axis4Name')?.value || 'قطاع التنمية المستدامة والبيئة',
                    budget: document.getElementById('axis4Budget')?.value || '35,000,000 درهم',
                    projectsCount: Number(document.getElementById('axis4Projects')?.value) || 6,
                    completionRate: currentAxes[3]?.completionRate || 80,
                    icon: currentAxes[3]?.icon || '🌿'
                }
            ];

            SynthesisReportModel.updateAxes(updatedAxes);
            AdminView.showToast('تم حفظ وتحديث محاور التقرير التركيبي بنجاح! تم تحديث البيانات بالواجهة الرئيسية. 🏛️', false, 'تم الحفظ بنجاح!');
            this.loadSynthesisData();
        } catch (err) {
            console.error('Save synthesis axes error:', err);
            AdminView.showToast('فشل حفظ محاور التقرير التركيبي: ' + (err.message || 'حدث خطأ'), true, 'فشل الحفظ ❌');
        }
    }
}
