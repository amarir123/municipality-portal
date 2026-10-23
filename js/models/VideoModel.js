const defaultVideos = [
    { id: "park", title: "تهيئة المنتزه الحضري لبيوكرى", thumbnail: "assets/video_park.png", duration: "02:45" },
    { id: "hall", title: "القاعة المغطاة الرياضية ببيوكرى بحلتها الجديدة", thumbnail: "assets/video_hall.png", duration: "01:50" },
    { id: "bus", title: "إطلاق خدمات النقل الحضري والتنمية بمدينة بيوكرى", thumbnail: "assets/video_bus.png", duration: "03:15" }
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
    }

    static update(id, updatedData) {
        let videos = this.getAll();
        videos = videos.map(v => v.id === id ? { ...v, ...updatedData } : v);
        this.saveAll(videos);
    }
}
