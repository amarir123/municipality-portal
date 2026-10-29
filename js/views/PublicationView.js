export class PublicationView {
    static renderList(publications, containerId = 'frontPublicationsGrid') {
        const container = document.getElementById(containerId) || 
                          document.getElementById('pubsGrid') || 
                          document.querySelector('.pubs-front-grid');
        if (!container) return;

        if (!publications || publications.length === 0) {
            container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 40px;">لا توجد وثائق متاحة حالياً</div>`;
            return;
        }

        container.innerHTML = publications.map(p => `
            <div class="pub-front-card" onclick="window.appController?.openPubModal(${p.id})">
                <div class="pub-badge-tag">${p.category || p.type || 'وثيقة رسمية'}</div>
                <h3 class="pub-title">${p.title}</h3>
                <p class="pub-desc">${p.description || p.excerpt || ''}</p>
                <div class="pub-footer-bar">
                    <span class="pub-date-label">📅 ${p.date || '2026'}</span>
                    <a href="${p.fileUrl || '#'}" ${p.fileUrl ? 'download' : ''} class="pub-download-link" onclick="event.stopPropagation()">تحميل PDF 📥</a>
                </div>
            </div>
        `).join('');
    }

    static showDetailModal(item, modalOverlayId = 'modalOverlay', modalBodyId = 'modalBody') {
        const overlay = document.getElementById(modalOverlayId);
        const body = document.getElementById(modalBodyId);
        if (!overlay || !body || !item) return;

        body.innerHTML = `
            <div style="text-align: right; padding: 15px;">
                <span class="badge" style="margin-bottom: 15px;">${item.category || 'وثيقة'}</span>
                <h2 style="font-size: 1.3rem; color: var(--primary-color); margin-bottom: 15px;">${item.title}</h2>
                <p style="color: var(--text-main); line-height: 1.8; margin-bottom: 20px;">${item.description || ''}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; padding-top: 15px;">
                    <span style="font-size: 0.9rem; color: #64748b;">تاريخ النشر: ${item.date}</span>
                    <a href="${item.fileUrl || '#'}" download class="btn btn-primary btn-sm">تحميل الوثيقة PDF 📥</a>
                </div>
            </div>
        `;
        overlay.style.display = 'flex';
    }
}
