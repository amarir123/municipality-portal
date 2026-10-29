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

    // Slogan & Header Subtitle
    slogan: "من أجل تنمية مستدامة و خدمة أفضل للمواطنين",
    heroSubtitle: "تقريب الإدارة من المواطن وتعزيز التنمية المحلية",

    // Portal Curved Ribbon Statistics (الأرقام والإحصائيات)
    stat1Val: "+120",
    stat1Label: "طلب معالجة شهرياً",
    stat2Val: "+98%",
    stat2Label: "معدل إنجاز المشاريع",
    stat3Val: "+12",
    stat3Label: "برنامج قطاعي",
    stat4Val: "+45",
    stat4Label: "مشروع تنموي",
    statsSubtitle: "تعكس هذه الأرقام حجم الجهود المبذولة لخدمة الإقليم",

    // Hero 3D Stage Cards (شرائح العرض بالهيرو)
    heroSlide1Title: "تأهيل البنية التحتية بالمنطقة",
    heroSlide1Subtitle: "أشغال تهيئة الطرقات والأحياء السكنية.",
    heroSlide1Badge: "أخبار الجماعة 📰",
    heroSlide1Date: "15 ماي 2025",
    heroSlide1Img: "assets/video_hall.png",

    heroSlide2Title: "إطلاق أسطول حافلات النقل الحضري بالنيابة",
    heroSlide2Subtitle: "تعزيز أسطول النقل الحضري لتسهيل تنقل المواطنين والطلبة بالإقليم.",
    heroSlide2Badge: "خدمات النقل 🚌",
    heroSlide2Date: "12 ماي 2025",
    heroSlide2Img: "assets/video_bus.png",

    heroSlide3Title: "مشروع السوق الأسبوعي الجديد",
    heroSlide3Subtitle: "إعطاء انطلاقة أشغال بناء السوق الأسبوعي الحديث.",
    heroSlide3Badge: "المشاريع 🏗️",
    heroSlide3Date: "10 ماي 2025",
    heroSlide3Img: "assets/video_park.png",
    heroBgImg: "assets/biougra_landscape_clean.png",

    // Social Media Links
    facebookUrl: "https://facebook.com",
    twitterUrl: "https://twitter.com",
    instagramUrl: "https://instagram.com",
    youtubeUrl: "https://youtube.com",

    // Emergency Numbers
    emergencyCivil: "15",
    emergencyPolice: "19",
    emergencyGendarme: "177",

    // Section Visibility Toggles
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
                // Ensure newly introduced keys are preserved with defaults
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
        localStorage.setItem('biougra_last_sync_timestamp', Date.now().toString());
    }

    static exportPackageJSON() {
        const fullData = {
            branding: this.get(),
            news: JSON.parse(localStorage.getItem('biougra_news') || '[]'),
            projects: JSON.parse(localStorage.getItem('biougra_projects') || '[]'),
            publications: JSON.parse(localStorage.getItem('agadir_publications') || '[]'),
            events: JSON.parse(localStorage.getItem('biougra_events') || '[]'),
            services: JSON.parse(localStorage.getItem('agadir_services') || '[]'),
            procedures: JSON.parse(localStorage.getItem('biougra_procedures_data') || '[]'),
            exportedAt: new Date().toISOString()
        };
        return JSON.stringify(fullData, null, 2);
    }

    static importPackageJSON(jsonString) {
        try {
            const parsed = JSON.parse(jsonString);
            if (parsed.branding) localStorage.setItem('agadir_branding', JSON.stringify(parsed.branding));
            if (parsed.news) localStorage.setItem('biougra_news', JSON.stringify(parsed.news));
            if (parsed.projects) localStorage.setItem('biougra_projects', JSON.stringify(parsed.projects));
            if (parsed.publications) localStorage.setItem('agadir_publications', JSON.stringify(parsed.publications));
            if (parsed.events) localStorage.setItem('biougra_events', JSON.stringify(parsed.events));
            if (parsed.services) localStorage.setItem('agadir_services', JSON.stringify(parsed.services));
            if (parsed.procedures) localStorage.setItem('biougra_procedures_data', JSON.stringify(parsed.procedures));
            localStorage.setItem('biougra_last_sync_timestamp', Date.now().toString());
            return true;
        } catch (e) {
            console.error('Import Error', e);
            return false;
        }
    }
}
