export class ProjectView {
    static renderGrid(projects, containerId = 'projectsGridContainer') {
        const container = document.getElementById(containerId) || document.getElementById('projectsContainer');
        if (!container) return;

        if (!projects || projects.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: #64748b; padding: 40px; grid-column: 1/-1;">لا توجد مشاريع مضافة</div>`;
            return;
        }

        container.innerHTML = projects.map(proj => `
            <div class="urban-card">
                <div class="urban-card-header">
                    <h3 class="urban-card-title">${proj.title}</h3>
                    <span class="urban-badge">${proj.status}</span>
                </div>
                <div class="urban-progress-wrapper">
                    <div class="urban-progress-bar" style="width: ${proj.progress}%;"></div>
                </div>
                <div class="urban-meta-info">
                    <span>نسبة الإنجاز: <strong>${proj.progress}%</strong></span>
                    <span>الميزانية: ${proj.budget}</span>
                </div>
            </div>
        `).join('');
    }
}
