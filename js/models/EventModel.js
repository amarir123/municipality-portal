const defaultEvents = [
    {
        id: "session-oct",
        date: "15 أكتوبر",
        title: "دورة أكتوبر العادية للمجلس الجماعي: دراسة والمصادقة على مشروع ميزانية سنة 2027",
        image: "assets/card_council.png",
        location: "قاعة الاجتماعات الكبرى بمقر الجماعة"
    },
    {
        id: "meeting",
        date: "10 أكتوبر",
        title: "لقاءات تواصلية مع جمعيات المجتمع المدني لمناقشة القضايا الحضرية",
        image: "assets/event_right.png",
        location: "المركب الثقافي"
    },
    {
        id: "general",
        date: "05 أكتوبر",
        title: "انعقاد لقاء تشاوري لمناقشة مخطط التنمية الحضرية المندمجة 2021-2027",
        image: "assets/event_left.png",
        location: "مقر الجماعة الترابية"
    },
    {
        id: "environment-day",
        date: "28 شتنبر",
        title: "انطلاق فعاليات الحملة البيئية الكبرى لتشجير ونظافة الأحياء والمؤسسات التعليمية",
        image: "assets/card_territory.png",
        location: "شوارع وأحياء المدينة"
    }
];

export class EventModel {
    static STORAGE_KEY = 'biougra_events';

    static init() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (!stored) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultEvents));
        }
    }

    static getAll() {
        this.init();
        try {
            const list = JSON.parse(localStorage.getItem(this.STORAGE_KEY));
            if (Array.isArray(list) && list.length > 0) return list;
            this.saveAll(defaultEvents);
            return defaultEvents;
        } catch (e) {
            return defaultEvents;
        }
    }

    static saveAll(eventsArray) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(eventsArray));
        localStorage.setItem('biougra_last_sync_timestamp', Date.now().toString());
    }

    static update(id, updatedData) {
        let events = this.getAll();
        events = events.map(e => e.id === id ? { ...e, ...updatedData } : e);
        this.saveAll(events);
        return events;
    }

    static add(event) {
        let events = this.getAll();
        if (!event.id) event.id = 'ev-' + Date.now();
        events.unshift(event);
        this.saveAll(events);
        return event;
    }

    static delete(id) {
        let events = this.getAll();
        events = events.filter(e => e.id !== id);
        this.saveAll(events);
        return events;
    }
}
