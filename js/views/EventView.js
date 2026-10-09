export class EventView {
    static renderList(events, containerId = 'eventsGridContainer') {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (!events || events.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: #64748b; padding: 30px;">لا توجد أنشطة حالياً</div>`;
            return;
        }

        container.innerHTML = events.map(ev => `
            <article class="event-card">
                <div class="event-img-wrapper">
                    <img src="${ev.image || 'assets/event_right.png'}" alt="${ev.title}">
                    <span class="event-date-badge">${ev.date || '10'} أكتوبر</span>
                </div>
                <div class="event-body">
                    <h3 class="event-title-text">${ev.title}</h3>
                    <div class="event-meta">📍 المقر الرئيسي للجماعة الترابية</div>
                </div>
            </article>
        `).join('');
    }
}
