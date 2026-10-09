export class AdminView {
    static showToast(message, isError = false) {
        const toast = document.getElementById('toastNotify');
        const toastMsg = document.getElementById('toastMessage');
        if (!toast || !toastMsg) return;

        toastMsg.innerText = message;
        if (isError) {
            toast.style.background = '#ef4444';
        } else {
            toast.style.background = '#10b981';
        }
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    static switchPanel(btn, panelId) {
        document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.admin-panel-content').forEach(p => p.classList.remove('active'));

        if (btn) btn.classList.add('active');
        const targetPanel = document.getElementById(panelId);
        if (targetPanel) targetPanel.classList.add('active');
    }

    static renderNewsTable(newsList) {
        const tbody = document.getElementById('adminNewsTableBody');
        if (!tbody) return;

        if (!newsList || newsList.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #64748b;">لا توجد أخبار</td></tr>`;
            return;
        }

        tbody.innerHTML = newsList.map(n => `
            <tr>
                <td><strong>${n.title}</strong></td>
                <td><span class="badge" style="background: #e0f2fe; color: #0369a1;">${n.date}</span></td>
                <td style="max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${n.excerpt}</td>
                <td>
                    <button class="btn btn-outline btn-sm" onclick="window.adminController.openEditNewsModal(${n.id})">تعديل</button>
                    <button class="btn btn-outline btn-sm" style="border-color: #ef4444; color: #ef4444;" onclick="window.adminController.deleteNewsItem(${n.id})">حذف</button>
                </td>
            </tr>
        `).join('');
    }

    static renderProjectsGrid(projects) {
        const container = document.getElementById('adminProjectsGrid');
        if (!container) return;

        container.innerHTML = projects.map(proj => `
            <div class="proj-admin-card">
                <div class="proj-admin-header">
                    <h3 class="proj-admin-title">${proj.title}</h3>
                    <span class="badge">${proj.status}</span>
                </div>
                <div style="margin: 15px 0;">
                    <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 5px;">نسبة الإنجاز: <strong>${proj.progress}%</strong></div>
                    <div class="project-progress"><div class="progress-bar" style="width: ${proj.progress}%;"></div></div>
                </div>
                <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 15px;">الميزانية: ${proj.budget}</div>
                <button class="btn btn-outline btn-sm" style="width: 100%;" onclick="window.adminController.openEditProjectModal('${proj.id}')">تعديل التقرير والتفاصيل ✏️</button>
            </div>
        `).join('');
    }

    static renderPubsTable(pubs) {
        const tbody = document.getElementById('adminPubsTableBody');
        if (!tbody) return;

        tbody.innerHTML = pubs.map(p => `
            <tr>
                <td><strong>${p.title}</strong></td>
                <td><span class="badge">${p.type}</span></td>
                <td>${p.size}</td>
                <td>
                    <button class="btn btn-outline btn-sm" onclick="window.adminController.openEditPubModal(${p.id})">تعديل</button>
                    <button class="btn btn-outline btn-sm" style="border-color: #ef4444; color: #ef4444;" onclick="window.adminController.deletePubItem(${p.id})">حذف</button>
                </td>
            </tr>
        `).join('');
    }
}

window.switchPanel = AdminView.switchPanel;
