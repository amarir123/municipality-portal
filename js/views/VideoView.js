export class VideoView {
    static renderGrid(videos, containerId = 'galleryThumbsRow') {
        this.renderList(videos, containerId);
    }

    static renderList(videos, containerId = 'galleryThumbsRow') {
        const container = document.getElementById(containerId) || 
                          document.getElementById('videoGridContainer') || 
                          document.querySelector('.gallery-thumbs-row');
        if (!container) return;

        if (!videos || videos.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: #64748b; padding: 30px;">لا توجد صور أو فيديوهات مضافة</div>`;
            return;
        }

        container.innerHTML = videos.map(vid => `
            <div class="gallery-thumb-card" onclick="openHeroVideoCapsule('${vid.id || ''}')" title="${vid.title}">
                <img src="${vid.thumbnail || 'assets/video_park.png'}" alt="${vid.title}" class="thumb-img">
                <div class="thumb-hover-overlay">
                    <span style="font-size: 1.2rem;">▶</span>
                </div>
            </div>
        `).join('');
    }
}
