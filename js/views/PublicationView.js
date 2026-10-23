export class PublicationView {
    static renderList(publications, containerId = 'pubsGrid') {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (!publications || publications.length === 0) {
            container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 40px;">لا توجد وثائق متاحة حالياً</div>`;
            return;
        }

        container.innerHTML = publications.map(pub => `
            <div class="pub-card">
                <div class="pub-type-badge">${pub.type || 'PDF'}</div>
                <h3 class="pub-title">${pub.title}</h3>
                <p class="pub-desc">${pub.description || ''}</p>
                <div class="pub-meta">
                    <span>حجم الملف: ${pub.size || 'غير محدد'}</span>
                    <button class="pub-download-btn" onclick="alert('جاري تحميل المستند...')">تحميل Document 🠄</button>
                </div>
            </div>
        `).join('');
    }
}
