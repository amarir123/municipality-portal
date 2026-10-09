import { NewsModel } from '../models/NewsModel.js';
import { ProjectModel } from '../models/ProjectModel.js';
import { PublicationModel } from '../models/PublicationModel.js';
import { EventModel } from '../models/EventModel.js';
import { BrandingModel } from '../models/BrandingModel.js';
import { VideoModel } from '../models/VideoModel.js';
import { ComplaintModel } from '../models/ComplaintModel.js';
import { ServiceModel } from '../models/ServiceModel.js';
import { AdminView } from '../views/AdminView.js';

export class AdminController {
    constructor() {
        this.projectsChart = null;
        this.complaintsChart = null;
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
                setTimeout(() => { overlay.style.display = 'none'; }, 500);
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
        this.renderEventsForm(EventModel.getAll());
        this.renderVideosForm(VideoModel.getAll());

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
                <td><span style="font-size: 0.85rem;">${s.isExternal ? 'رابط خارجي (Rokhas.ma)' : 'وثيقة PDF تنزيل'} (${s.fileSize})</span></td>
                <td>
                    <button class="btn btn-outline btn-sm" style="border-color: #ef4444; color: #ef4444;" onclick="window.adminController.deleteService(${s.id})">حذف</button>
                </td>
            </tr>
        `).join('');
    }

    openAddServiceModal() {
        const title = prompt('أدخل عنوان الخدمة أو الوثيقة:');
        if (!title) return;
        const cat = prompt('التصنيف (مثال: التعمير، الحالة المدنية):', 'خدمة عامة');
        const desc = prompt('وصف قصير للخدمة:');
        const link = prompt('رابط الملف أو الصفحة (مثال: assets/docs/file.pdf أو https://rokhas.ma):', 'assets/docs/form.pdf');

        ServiceModel.add({
            title: title,
            category: cat || 'عام',
            description: desc || 'خدمة إلكترونية ووثائق رسمية للجماعة الترابية.',
            link: link || '#',
            isExternal: link ? link.startsWith('http') : false,
            fileSize: link && link.endsWith('.pdf') ? '1.5 MB PDF' : 'رقمي'
        });

        AdminView.showToast('تمت إضافة الخدمة والوثيقة بنجاح!');
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
    }

    saveBrandingSettings(e) {
        e.preventDefault();
        const current = BrandingModel.get();

        const updated = {
            ...current,
            muniName: document.getElementById('brandMuniName').value,
            cityName: document.getElementById('brandCityName').value,
            phone: document.getElementById('brandPhone').value,
            email: document.getElementById('brandEmail').value,
            workingHours: document.getElementById('brandWorkingHours').value,
            tickerText: document.getElementById('brandTickerText').value,
            primaryColor: document.getElementById('brandPrimaryColor').value,
            accentColor: document.getElementById('brandAccentColor').value,
            darkColor: document.getElementById('brandDarkColor').value,
            textColor: document.getElementById('brandTextColor').value,
            showTicker: document.getElementById('brandShowTicker').checked,
            showUrban: document.getElementById('brandShowUrban').checked,
            showServices: document.getElementById('brandShowServices').checked
        };

        BrandingModel.save(updated);
        this.applyAdminBranding();
        AdminView.showToast('تم حفظ وتحديث هوية الجماعة والألوان بنجاح! 🚀');
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
        e.preventDefault();
        const id = document.getElementById('editNewsId').value;
        const item = {
            title: document.getElementById('editNewsTitle').value,
            date: document.getElementById('editNewsDate').value,
            excerpt: document.getElementById('editNewsExcerpt').value,
            content: document.getElementById('editNewsContent').value
        };

        if (id) {
            NewsModel.update(id, item);
            AdminView.showToast('تم تعديل الخبر بنجاح.');
        } else {
            NewsModel.add(item);
            AdminView.showToast('تم إضافة الخبر الجديد بنجاح.');
        }

        this.closeNewsModal();
        this.loadAllData();
    }

    deleteNewsItem(id) {
        if (confirm('هل أنت تأكد من حذف هذا الخبر؟')) {
            NewsModel.delete(id);
            AdminView.showToast('تم حذف الخبر.');
            this.loadAllData();
        }
    }

    // Projects Edit Modal
    openEditProjectModal(id) {
        const projects = ProjectModel.getAll();
        const proj = projects.find(p => p.id === id);
        if (!proj) return;

        const newProg = prompt(`تعديل نسبة إنجاز المشروع (${proj.title}):`, proj.progress);
        if (newProg === null) return;
        const newBudget = prompt(`تعديل الميزانية المرصودة:`, proj.budget);
        const newStatus = prompt(`تعديل حالة المشروع (مثال: قيد الإنجاز، مكتمل):`, proj.status);

        ProjectModel.update(id, {
            progress: Number(newProg) || proj.progress,
            budget: newBudget || proj.budget,
            status: newStatus || proj.status
        });

        AdminView.showToast('تم تحديث بيانات المشروع التنموي!');
        this.loadAllData();
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

    renderEventsForm(events) {}
    renderVideosForm(videos) {}
}
