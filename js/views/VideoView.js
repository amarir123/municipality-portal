export class VideoView {
    static renderList(videos, containerId = 'videoGridContainer') {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (!videos || videos.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: #64748b; padding: 30px;">لا توجد مرئيات مضافة</div>`;
            return;
        }

        container.innerHTML = videos.map(vid => `
            <div class="media-card">
                <div class="media-thumb-wrapper">
                    <img src="${vid.thumbnail || 'assets/video_park.png'}" alt="${vid.title}">
                    <div class="media-play-overlay">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    </div>
                    <span class="media-duration">${vid.duration || '02:30'}</span>
                </div>
                <div class="media-body">
                    <h3 class="media-title" id="vid-title-text-${vid.id}">${vid.title}</h3>
                </div>
            </div>
        `).join('');
    }
}
