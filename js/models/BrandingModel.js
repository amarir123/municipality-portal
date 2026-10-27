const defaultBranding = {
    muniName: "جماعة بيوكرى",
    cityName: "بيوكرى",
    logoUrl: "assets/logo.png",
    primaryColor: "#1B3A8A",
    secondaryColor: "#0F9D8A",
    creamColor: "#FBF6EC",
    accentColor: "#F2A93B",
    terracottaColor: "#D9603B",
    darkColor: "#0B1530",
    textColor: "#0B1530",
    heroBgUrl: "assets/biougra_bg.png",
    cardCouncilUrl: "assets/card_council.png",
    cardProceduresUrl: "assets/card_procedures.png",
    cardTerritoryUrl: "assets/card_territory.png",
    tickerText: "مرحباً بكم في البوابة الإلكترونية الرسمية لجماعة بيوكرى - تواصلوا معنا وقدموا طلباتكم وتتبعوا ملفاتكم وشكاياتكم إلكترونياً على مدار الساعة.",
    phone: "+212 528 81 80 00",
    email: "contact@biougra.ma",
    address: "شارع محمد الخامس، المقر الرئيسي لجماعة بيوكرى",
    workingHours: "من الإثنين إلى الجمعة: 08:30 - 16:30",
    weatherCity: "بيوكرى",
    weatherTemp: "23°C",
    weatherStatus: "مشمس",
    showTicker: false,
    showUrban: true,
    showPublications: true,
    showEvents: true,
    showMultimedia: true,
    showServices: true
};

export class BrandingModel {
    static STORAGE_KEY = 'agadir_branding';

    static init() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (!stored) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultBranding));
        } else {
            try {
                const parsed = JSON.parse(stored);
                // Ensure defaults for any newly introduced keys without overriding saved values
                const merged = { ...defaultBranding, ...parsed };
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(merged));
            } catch (e) {}
        }
    }

    static get() {
        this.init();
        try {
            const stored = JSON.parse(localStorage.getItem(this.STORAGE_KEY));
            return { ...defaultBranding, ...stored };
        } catch (e) {
            return defaultBranding;
        }
    }

    static save(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }

    static exportPackageJSON() {
        const fullData = {
            branding: this.get(),
            news: JSON.parse(localStorage.getItem('biougra_news') || '[]'),
            projects: JSON.parse(localStorage.getItem('agadir_projects') || '[]'),
            publications: JSON.parse(localStorage.getItem('agadir_publications') || '[]'),
            events: JSON.parse(localStorage.getItem('agadir_events') || '[]'),
            services: JSON.parse(localStorage.getItem('agadir_services') || '[]'),
            exportedAt: new Date().toISOString()
        };
        return JSON.stringify(fullData, null, 2);
    }

    static importPackageJSON(jsonString) {
        try {
            const parsed = JSON.parse(jsonString);
            if (parsed.branding) localStorage.setItem('agadir_branding', JSON.stringify(parsed.branding));
            if (parsed.news) localStorage.setItem('biougra_news', JSON.stringify(parsed.news));
            if (parsed.projects) localStorage.setItem('agadir_projects', JSON.stringify(parsed.projects));
            if (parsed.publications) localStorage.setItem('agadir_publications', JSON.stringify(parsed.publications));
            if (parsed.events) localStorage.setItem('agadir_events', JSON.stringify(parsed.events));
            if (parsed.services) localStorage.setItem('agadir_services', JSON.stringify(parsed.services));
            return true;
        } catch (e) {
            console.error('Import Error', e);
            return false;
        }
    }
}
