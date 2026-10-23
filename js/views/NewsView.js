export class NewsView {
    static renderList(newsList, containerId = 'newsListContainer') {
        const container = document.getElementById(containerId) || document.getElementById('newsGrid');
        if (!container) return;

        if (!newsList || newsList.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: #64748b; padding: 30px;">لا توجد مستجدات حالياً</div>`;
            return;
        }

        container.innerHTML = newsList.map(item => `
            <div class="news-item" onclick="window.appController?.openNewsModal(${item.id})">
                <div class="news-date">${item.date || ''}</div>
                <div class="news-details">
                    <h3 class="news-title">${item.title || ''}</h3>
                    <p class="news-excerpt">${item.excerpt || ''}</p>
                </div>
            </div>
        `).join('');
    }

    static showDetailModal(item, modalOverlayId = 'modalOverlay', modalBodyId = 'modalBody') {
        const overlay = document.getElementById(modalOverlayId);
        const body = document.getElementById(modalBodyId);
        if (!overlay || !body || !item) return;

        body.innerHTML = `
            <div style="text-align: right; padding: 10px;">
                <span style="display: inline-block; background: var(--accent-color); color: #fff; padding: 4px 14px; border-radius: 20px; font-size: 0.85rem; margin-bottom: 12px; font-weight: 700;">
                    ${item.date}
                </span>
                <h2 style="font-size: 1.4rem; color: var(--dark-color); margin-bottom: 16px; line-height: 1.4; font-weight: 700;">${item.title}</h2>
                <div style="font-size: 1rem; color: var(--text-main); line-height: 1.8; white-space: pre-line; border-top: 1px solid #e2e8f0; padding-top: 16px;">
                    ${item.content || item.excerpt}
                </div>
            </div>
        `;
        overlay.style.display = 'flex';
    }
}
