const defaultBranding = {
    muniName: "الجماعة الترابية",
    cityName: "أكادير",
    logoUrl: "assets/logo.png",
    primaryColor: "#0d5ea6",
    accentColor: "#c69c55",
    darkColor: "#1e293b",
    textColor: "#334155",
    heroBgUrl: "assets/beach_bg.png",
    cardCouncilUrl: "assets/card_council.png",
    cardProceduresUrl: "assets/card_procedures.png",
    cardTerritoryUrl: "assets/card_territory.png",
    tickerText: "مرحباً بكم في البوابة الإلكترونية الرسمية للجماعة الترابية - تواصلوا معنا وقدموا طلباتكم وشكاياتكم إلكترونياً على مدار الساعة.",
    phone: "+212 528 84 00 00",
    email: "contact@commune.ma",
    address: "شارع محمد الخامس، المقر الرئيسي للجماعة",
    workingHours: "من الإثنين إلى الجمعة: 08:30 - 16:30",
    weatherCity: "أكادير",
    weatherTemp: "24°C",
    weatherStatus: "مشمس",
    showTicker: true,
    showUrban: true,
    showPublications: true,
    showEvents: true,
    showMultimedia: true,
    showServices: true
};

export class BrandingModel {
    static STORAGE_KEY = 'agadir_branding';

    static init() {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultBranding));
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
