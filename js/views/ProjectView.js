export class ProjectView {
    static renderGrid(projects, containerId = 'projectsShowcaseGrid') {
        const container = document.getElementById(containerId) || 
                          document.getElementById('projectsGridContainer') || 
                          document.querySelector('.projects-showcase-grid');
        if (!container) return;

        if (!projects || projects.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: #64748b; padding: 40px; grid-column: 1/-1;">لا توجد مشاريع مضافة</div>`;
            return;
        }

        const featured = projects[0];
        const rest = projects.slice(1, 5);

        const featImg = featured.image || 'assets/ref_project_road.jpg';
        const featDesc = featured.details ? featured.details.split('\n')[0] : (featured.description || 'مشروع مهيكل يهدف إلى تحسين البنية التحتية وتسهيل حركة التنقل والتنمية.');
        const featBadge = featured.category || featured.status || 'مشاريع البنية التحتية 🛣️';

        const defaultIcons = ['🏫', '🌿', '⚽', '💼', '🏥', '💡'];
        const defaultImages = ['assets/video_hall.png', 'assets/video_park.png', 'assets/video_bus.png', 'assets/card_territory.png', 'assets/ref_project_road.jpg'];

        container.innerHTML = `
            <!-- Featured Wide Card -->
            <article class="featured-project-card" onclick="window.appController?.openProjectModal('${featured.id}')" role="button" tabindex="0">
                <div class="featured-img-wrap">
                    <img src="${featImg}" alt="${featured.title}" class="featured-proj-img">
                    <div class="featured-badge-tag">${featBadge}</div>
                </div>
                <div class="featured-proj-overlay">
                    <h3 class="featured-proj-title">${featured.title}</h3>
                    <p class="featured-proj-desc">${featDesc}</p>
                    <div class="featured-proj-footer">
                        <span class="btn-proj-details">التفاصيل ←</span>
                        <div class="featured-proj-meta">
                            <span>نسبة الإنجاز: <strong>${featured.progress}%</strong></span>
                            <span class="sep">•</span>
                            <span>الميزانية: <strong>${featured.budget}</strong></span>
                        </div>
                    </div>
                </div>
            </article>

            <!-- 2x2 Sub-Projects Grid -->
            <div class="sub-projects-2x2-grid">
                ${rest.map((p, idx) => {
                    const pImg = p.image || defaultImages[idx % defaultImages.length];
                    const pIcon = defaultIcons[idx % defaultIcons.length];
                    const pBadge = p.category || `${p.title} ${pIcon}`;
                    const pDesc = p.details ? p.details.split('\n')[0] : (p.description || 'مشاريع تنموية لتعزيز المرافق والخدمات المحلية.');
                    return `
                    <article class="sub-project-card" onclick="window.appController?.openProjectModal('${p.id}')" role="button" tabindex="0">
                        <div class="sub-proj-thumb-wrap">
                            <img src="${pImg}" alt="${p.title}" class="sub-proj-img">
                            <span class="sub-proj-badge">${pBadge}</span>
                        </div>
                        <div class="sub-proj-body">
                            <h4 class="sub-proj-title">${p.title}</h4>
                            <p class="sub-proj-desc">${pDesc}</p>
                            <div class="sub-proj-progress">
                                <span class="prog-label">نسبة الإنجاز: ${p.progress}%</span>
                                <div class="prog-track"><div class="prog-fill" style="width: ${p.progress}%;"></div></div>
                            </div>
                        </div>
                    </article>
                    `;
                }).join('')}
            </div>
        `;
    }
}
