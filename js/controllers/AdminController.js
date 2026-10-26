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

        this.loadMandateData();
        this.loadSynthesisData();
        this.loadSubventionsData();
        this.loadPollsData();

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

    loadMandateData() {
        const mandate = MandateModel.get();
        if (!mandate) return;

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
    loadSubventionsData() {
        const sub = SubventionModel.get();
        if (!sub) return;

        const titleEl = document.getElementById('adminSubventionDecisionTitle');
        const detailsEl = document.getElementById('adminSubventionDecisionDetails');
        if (titleEl) titleEl.innerText = sub.decisionTitle;
        if (detailsEl) detailsEl.innerText = sub.decisionDetails;

        const tbody = document.getElementById('adminSubventionsTableBody');
        if (!tbody) return;

        tbody.innerHTML = sub.beneficiaries.map(b => `
            <tr>
                <td><strong>${b.assocName}</strong></td>
                <td>${b.president}</td>
                <td><span class="badge badge-info">${b.assocType}</span></td>
                <td><span class="badge badge-success">${b.statutStatus}</span></td>
                <td style="font-size: 0.85rem; color: #15803d;">${b.legalStatus}</td>
                <td style="font-size: 0.85rem; color: #64748b;">${b.pvNumber}</td>
                <td><strong style="color: var(--primary-color);">${Number(b.amount).toLocaleString()} درهم</strong></td>
                <td>
                    <button onclick="window.adminController.deleteSubventionBeneficiary(${b.id})" class="btn btn-sm btn-outline" style="color: #ef4444; border-color: #ef4444;">حذف</button>
                </td>
            </tr>
        `).join('');
    }

    openAddSubventionModal() {
        document.getElementById('adminAddSubventionModal').style.display = 'flex';
    }

    closeSubventionModal() {
        document.getElementById('adminAddSubventionModal').style.display = 'none';
    }

    saveSubventionBeneficiary(e) {
        if (e) e.preventDefault();
        const assocName = document.getElementById('subAssocName')?.value;
        const president = document.getElementById('subPresident')?.value;
        const assocType = document.getElementById('subAssocType')?.value;
        const statut = document.getElementById('subStatut')?.value;
        const legalStatus = document.getElementById('subLegalStatus')?.value;
        const pvNumber = document.getElementById('subPvNumber')?.value;
        const amount = Number(document.getElementById('subAmount')?.value) || 0;

        if (!assocName || !amount) return;

        SubventionModel.addBeneficiary({
            assocName,
            president,
            assocType,
            statutStatus: statut,
            legalStatus,
            pvNumber,
            amount,
            year: new Date().getFullYear(),
            projectSupported: "دعم الأنشطة السنوية وبرامج القرب"
        });

        this.closeSubventionModal();
        AdminView.showToast('تم تسجيل الجمعية المستفيدة بنجاح!');
        this.loadSubventionsData();
    }

    deleteSubventionBeneficiary(id) {
        if (confirm('هل تود حذف هذه الجمعية من لائحة المستفيدين؟')) {
            SubventionModel.deleteBeneficiary(id);
            AdminView.showToast('تم حذف الجمعية.');
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
}

