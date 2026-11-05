const defaultBranding = {
    muniName: "الجماعة الترابية لماسة",
    cityName: "ماسة",
    cityLatin: "MASSA",
    logoUrl: "assets/logo.png",
    primaryColor: "#07574B", // Forest Green Institutional
    secondaryColor: "#063D35", // Deep Green
    creamColor: "#F8F5EC", // Warm Ivory
    accentColor: "#E6B83F", // Champagne Gold Accent
    terracottaColor: "#C10144", // Logo Burgundy Accent
    darkColor: "#063D35", // Deep Forest Green
    textColor: "#172B3D", // Text Navy High Contrast
    heroBgUrl: "assets/biougra_landscape_clean.png",
    cardCouncilUrl: "assets/card_council.png",
    cardProceduresUrl: "assets/card_procedures.png",
    cardTerritoryUrl: "assets/card_territory.png",
    tickerText: "مرحباً بكم في البوابة الإلكترونية الرسمية للجماعة الترابية لماسة - نافذتكم الرقمية للاطلاع على مشاريع الجماعة وبرنامج العمل وتقديم الشكايات والخدمات الإدارية.",
    phone: "+212 528 26 00 21",
    email: "contact@communedemassa.ma",
    address: "مقر الجماعة الترابية لماسة، حي بوتبوز، قيادة ماسة، دائرة بلفاع ماسة، إقليم اشتوكة آيت باها، 87452",
    workingHours: "الإثنين إلى الخميس: 08:30 - 16:30 | الجمعة: 08:30 - 11:30 و 15:00 - 16:30",
    weatherCity: "ماسة",
    weatherTemp: "24°C",
    weatherStatus: "مشمس",

    // Slogan & Header Subtitle
    slogan: "من أجل تنمية مجالية شاملة، حكامة تشاركية، وخدمة متميزة لساكنة ماسة",
    heroSubtitle: "البوابة الرسمية لرئاسة ومجلس الجماعة الترابية لماسة - إقليم اشتوكة آيت باها",

    // Portal Curved Ribbon Statistics (الأرقام والإحصائيات الرسمية لماسة)
    stat1Val: "17,579",
    stat1Label: "نسمة (الساكنة القانونية)",
    stat2Val: "440.84 م.د",
    stat2Label: "إجمالي الاستثمارات المبرمجة",
    stat3Val: "126",
    stat3Label: "مشروعاً تنموياً مهيكلاً",
    stat4Val: "4",
    stat4Label: "محاور استراتيجية كبرى",
    statsSubtitle: "مؤشرات التشخيص التشاركي لبرنامج عمل الجماعة الترابية لماسة 2017- 2022",

    // Hero 3D Stage Cards (شرائح العرض بالهيرو)
    heroSlide1Title: "تيسير رخص البناء والتعمير لماسة",
    heroSlide1Subtitle: "المصادقة على تصنيف القطاعات المستهدفة بإعادة الهيكلة على مساحة 179 هكتاراً.",
    heroSlide1Badge: "التعمير والإسكان 📐",
    heroSlide1Date: "28 أكتوبر 2026",
    heroSlide1Img: "assets/video_hall.png",

    heroSlide2Title: "مشروع التطهير السائل بمركز ماسة",
    heroSlide2Subtitle: "اتفاقية شراكة بغلاف 37 مليون درهم لحماية واحة ماسة ومحطة التصفية والمعالجة.",
    heroSlide2Badge: "البيئة والموارد 🌿",
    heroSlide2Date: "14 شتنبر 2026",
    heroSlide2Img: "assets/video_park.png",

    heroSlide3Title: "قنطرة وادي ماسة وتثنية الطريق 1016",
    heroSlide3Subtitle: "مشروع استراتيجي مهيكل لفك العزلة وتأمين انسيابية السير بين سيدي عبو والجماعة.",
    heroSlide3Badge: "البنية التحتية 🌉",
    heroSlide3Date: "18 يوليوز 2026",
    heroSlide3Img: "assets/ref_project_road.jpg",
    heroBgImg: "assets/biougra_landscape_clean.png",

    // Social Media Links
    facebookUrl: "https://facebook.com/communedemassa",
    twitterUrl: "https://twitter.com/communedemassa",
    instagramUrl: "https://instagram.com/communedemassa",
    youtubeUrl: "https://youtube.com/communedemassa",

    // Emergency Numbers
    emergencyCivil: "15",
    emergencyPolice: "19",
    emergencyGendarme: "177",

    // Section Visibility Toggles
    showHero: true,
    showPortalStats: true,
    showEssentialServices: true,
    showNews: true,
    showUrban: true,
    showMandate: true,
    showSynthesis: true,
    showSubventions: true,
    showPoll: true,
    showPublications: true,
    showMultimedia: true,
    showEvents: true,
    showTicker: false
};

export class BrandingModel {
    static STORAGE_KEY = 'massa_branding_v3';

    static cleanLegacyData() {
        try {
            localStorage.removeItem('agadir_branding');
            localStorage.removeItem('biougra_branding');
            localStorage.removeItem('massa_branding_v2');
        } catch (e) {}
    }

    static init() {
        this.cleanLegacyData();
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (!stored) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultBranding));
        } else {
            try {
                const parsed = JSON.parse(stored);
                if (parsed.paletteVersion !== 'massa_forest_gold_v3') {
                    parsed.primaryColor = defaultBranding.primaryColor;
                    parsed.secondaryColor = defaultBranding.secondaryColor;
                    parsed.creamColor = defaultBranding.creamColor;
                    parsed.accentColor = defaultBranding.accentColor;
                    parsed.darkColor = defaultBranding.darkColor;
                    parsed.textColor = defaultBranding.textColor;
                    parsed.muniName = defaultBranding.muniName;
                    parsed.cityName = defaultBranding.cityName;
                    parsed.phone = defaultBranding.phone;
                    parsed.address = defaultBranding.address;
                    parsed.paletteVersion = 'massa_forest_gold_v3';
                    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(parsed));
                }
            } catch (e) {
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultBranding));
            }
        }
    }

    static get() {
        this.init();
        try {
            const data = JSON.parse(localStorage.getItem(this.STORAGE_KEY));
            return { ...defaultBranding, ...data };
        } catch (e) {
            return defaultBranding;
        }
    }

    static save(brandingData) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(brandingData));
        this.applyToDOM(brandingData);
    }

    static reset() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultBranding));
        this.applyToDOM(defaultBranding);
        return defaultBranding;
    }

    static applyToDOM(data = null) {
        const b = data || this.get();
        document.documentElement.style.setProperty('--primary-color', b.primaryColor || '#07574B');
        document.documentElement.style.setProperty('--secondary-color', b.secondaryColor || '#063D35');
        document.documentElement.style.setProperty('--cream-color', b.creamColor || '#F8F5EC');
        document.documentElement.style.setProperty('--accent-color', b.accentColor || '#E6B83F');
        document.documentElement.style.setProperty('--dark-color', b.darkColor || '#063D35');
        document.documentElement.style.setProperty('--text-main', b.textColor || '#172B3D');

        document.querySelectorAll('.muni-name-display').forEach(el => {
            el.textContent = b.muniName || 'الجماعة الترابية لماسة';
        });

        document.querySelectorAll('.city-name-display').forEach(el => {
            el.textContent = b.cityName || 'ماسة';
        });

        const logoEl = document.querySelector('.main-logo');
        if (logoEl && b.logoUrl) logoEl.src = b.logoUrl;

        const subTitleEl = document.querySelector('.hero-subtitle');
        if (subTitleEl && b.heroSubtitle) subTitleEl.textContent = b.heroSubtitle;

        const sloganEl = document.querySelector('.hero-slogan');
        if (sloganEl && b.slogan) sloganEl.textContent = b.slogan;
    }
}
