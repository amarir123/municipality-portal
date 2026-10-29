export class NewsView {
    static renderList(newsList, containerId = 'newsGrid') {
        const container = document.getElementById(containerId) || 
                          document.querySelector('.news-cards-quad') || 
                          document.getElementById('newsListContainer');
        if (!container) return;

        if (!newsList || newsList.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: #64748b; padding: 30px; grid-column: 1/-1;">لا توجد مستجدات حالياً</div>`;
            return;
        }

        container.innerHTML = newsList.slice(0, 4).map(item => `
            <article class="news-porcelain-card" onclick="window.appController?.openNewsModal(${item.id})" role="button" tabindex="0">
                <div class="news-card-img-wrap">
                    <img src="${item.imageUrl || item.image || 'assets/event_left.png'}" alt="${item.title}" class="news-card-img">
                    <span class="news-date-pill">${item.date || ''}</span>
                </div>
                <div class="news-card-content">
                    <h4 class="news-card-title">${item.title || ''}</h4>
                    <p class="news-card-desc">${item.excerpt || item.description || ''}</p>
                    <div class="news-card-footer">
                        <span class="read-more-gold">اقرأ المزيد ←</span>
                    </div>
                </div>
            </article>
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
