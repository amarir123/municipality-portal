const defaultVideos = [
    { id: "park", title: "تهيئة المنتزه الحضري والمساحات الخضراء", thumbnail: "assets/video_park.png", duration: "02:45" },
    { id: "hall", title: "القاعة المغطاة الرياضية بحلتها الجديدة", thumbnail: "assets/video_hall.png", duration: "01:50" },
    { id: "bus", title: "إطلاق خدمات النقل الحضري والتنمية", thumbnail: "assets/video_bus.png", duration: "03:15" },
    { id: "roads", title: "مشروع تهيئة وتوسيع الطرق والمحاور الكبرى", thumbnail: "assets/ref_project_road.jpg", duration: "04:10" },
    { id: "council", title: "جلسات ودورات المجلس الجماعي", thumbnail: "assets/card_council.png", duration: "05:20" }
];

export class VideoModel {
    static STORAGE_KEY = 'biougra_videos';

    static init() {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultVideos));
        }
    }

    static getAll() {
        this.init();
        try {
            const list = JSON.parse(localStorage.getItem(this.STORAGE_KEY));
            if (Array.isArray(list) && list.length > 0) return list;
            this.saveAll(defaultVideos);
            return defaultVideos;
        } catch (e) {
            return defaultVideos;
        }
    }

    static saveAll(videosArray) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(videosArray));
        localStorage.setItem('biougra_last_sync_timestamp', Date.now().toString());
    }

    static update(id, updatedData) {
        let videos = this.getAll();
        videos = videos.map(v => v.id === id ? { ...v, ...updatedData } : v);
        this.saveAll(videos);
        return videos;
    }

    static add(video) {
        let videos = this.getAll();
        if (!video.id) video.id = 'vid-' + Date.now();
        videos.unshift(video);
        this.saveAll(videos);
        return video;
    }

    static delete(id) {
        let videos = this.getAll();
        videos = videos.filter(v => v.id !== id);
        this.saveAll(videos);
        return videos;
    }
}
