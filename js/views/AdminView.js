export class AdminView {
    static showToast(message, isError = false, title = null) {
        const icon = isError ? '❌ ' : '✅ ';
        const header = title ? (title + '\n\n') : '';
        alert(icon + header + message);
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

        if (!projects || projects.length === 0) {
            container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 30px;">لا توجد مشاريع مضافة</div>';
            return;
        }

        container.innerHTML = projects.map(proj => `
            <div class="proj-admin-card">
                <div class="proj-admin-header">
                    <h3 class="proj-admin-title">${proj.title}</h3>
                    <span class="badge">${proj.status}</span>
                </div>
                <div style="margin: 12px 0;">
                    <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 5px;">نسبة الإنجاز: <strong>${proj.progress}%</strong></div>
                    <div class="project-progress"><div class="progress-bar" style="width: ${proj.progress}%;"></div></div>
                </div>
                <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 12px;">الميزانية: <strong>${proj.budget}</strong></div>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-outline btn-sm" style="flex: 1;" onclick="window.adminController.openEditProjectModal('${proj.id}')">تعديل ✏️</button>
                    <button class="btn btn-outline btn-sm" style="border-color: #ef4444; color: #ef4444;" onclick="window.adminController.deleteProject('${proj.id}')">حذف 🗑️</button>
                </div>
            </div>
        `).join('');
    }

    static renderEventsTable(events) {
        const tbody = document.getElementById('adminEventsTableBody');
        if (!tbody) return;

        if (!events || events.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #64748b; padding: 25px;">لا توجد أنشطة مضافة</td></tr>';
            return;
        }

        tbody.innerHTML = events.map(ev => `
            <tr>
                <td><span class="badge badge-info">${ev.date || 'تاريخ محدد'}</span></td>
                <td><strong>${ev.title}</strong></td>
                <td>📍 ${ev.location || 'مقر الجماعة'}</td>
                <td>
                    <button class="btn btn-outline btn-sm" onclick="window.adminController.openEditEventModal('${ev.id}')">تعديل ✏️</button>
                    <button class="btn btn-outline btn-sm" style="border-color: #ef4444; color: #ef4444;" onclick="window.adminController.deleteEvent('${ev.id}')">حذف 🗑️</button>
                </td>
            </tr>
        `).join('');
    }

    static renderVideosTable(videos) {
        const tbody = document.getElementById('adminVideosTableBody');
        if (!tbody) return;

        if (!videos || videos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #64748b; padding: 25px;">لا توجد عناصر وسائط مضافة</td></tr>';
            return;
        }

        tbody.innerHTML = videos.map(vid => `
            <tr>
                <td>
                    <img src="${vid.thumbnail || 'assets/video_park.png'}" style="width: 60px; height: 40px; border-radius: 6px; object-fit: cover; border: 1px solid #e2e8f0;">
                </td>
                <td><strong>${vid.title}</strong></td>
                <td><span class="badge">${vid.duration || '02:30'}</span></td>
                <td>
                    <button class="btn btn-outline btn-sm" onclick="window.adminController.openEditVideoModal('${vid.id}')">تعديل ✏️</button>
                    <button class="btn btn-outline btn-sm" style="border-color: #ef4444; color: #ef4444;" onclick="window.adminController.deleteVideo('${vid.id}')">حذف 🗑️</button>
                </td>
            </tr>
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

    static renderProceduresTable(procedures) {
        const tbody = document.getElementById('adminProceduresTableBody');
        if (!tbody) return;

        if (!procedures || procedures.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #64748b; padding: 25px;">لا توجد إجراءات إدارية مضافة</td></tr>';
            return;
        }

        tbody.innerHTML = procedures.map(p => `
            <tr>
                <td><span class="badge badge-info">${p.num || '01'}</span></td>
                <td><strong>${p.title}</strong></td>
                <td style="font-size: 0.85rem; color: #64748b; max-width: 250px;">${p.desc}</td>
                <td><span style="font-size: 0.85rem;">⏱️ ${p.deadline || '-'} | 💰 ${p.cost || 'مجانية'}</span></td>
                <td>
                    <button class="btn btn-outline btn-sm" onclick="window.adminController.openEditProcedureModal('${p.id}')">تعديل ✏️</button>
                    <button class="btn btn-outline btn-sm" style="border-color: #ef4444; color: #ef4444;" onclick="window.adminController.deleteProcedure('${p.id}')">حذف 🗑️</button>
                </td>
            </tr>
        `).join('');
    }

}

window.switchPanel = AdminView.switchPanel;
