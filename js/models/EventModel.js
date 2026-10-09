const defaultEvents = [
    {
        id: "meeting",
        date: "10",
        title: "جماعة بيوكرى تحتضن لقاءات تواصلية مع جمعيات ومهتمين لمناقشة القضايا الحضرية",
        image: "assets/event_right.png"
    },
    {
        id: "general",
        date: "10",
        title: "انعقاد لقاء تشاوري لمناقشة المخطط الجماعي للتنمية لمدينة بيوكرى",
        image: "assets/event_left.png"
    }
];

export class EventModel {
    static STORAGE_KEY = 'biougra_events';

    static init() {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultEvents));
        }
    }

    static getAll() {
        this.init();
        try {
            return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
        } catch (e) {
            return defaultEvents;
        }
    }

    static saveAll(eventsArray) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(eventsArray));
    }

    static update(id, updatedData) {
        let events = this.getAll();
        events = events.map(e => e.id === id ? { ...e, ...updatedData } : e);
        this.saveAll(events);
    }
}
