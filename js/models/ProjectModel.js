const defaultProjects = [
    { id: "roads", title: "الطرق والمحاور الكبرى", category: "مشاريع البنية التحتية 🛣️", status: "قيد الإنجاز", progress: 85, budget: "1.1 مليار درهم", image: "assets/ref_project_road.jpg", details: "توسيع وتأهيل الشبكة الطرقية لمدينة بيوكرى لتسهيل حركة المرور وتحسين المظهر الجمالي للمدينة وضمان السلامة الطرقية.\n\n- تأهيل الشوارع الرئيسية (شوارع محمد الخامس والحسن الثاني والمدارات الكبرى).\n- إنشاء الممر تحت الأرضي بمدخل المدينة لتخفيف الاكتظاظ المروري.\n- تثبيت أنظمة إنارة ذكية LED لخفض استهلاك الطاقة." },
    { id: "culture-dev", title: "المركب الثقافي ودار الصانعة", category: "قطاع التعليم 🏫", status: "قيد الإنجاز", progress: 70, budget: "500 مليون درهم", image: "assets/video_hall.png", details: "بناء وتجهيز المؤسسات والمرافق التنموية لتعزيز التكوين والشباب.\n\n- بناء وتأهيل المركب الثقافي لبيوكرى ليكون أيقونة فنية وثقافية.\n- إحداث متحف التراث المحلي لتخليد ذاكرة المنطقة التاريخية.\n- تجديد وتحديث شبكة المكتبات البلدية ودور الثقافة المحلية." },
    { id: "environment", title: "تهيئة المنتزه الحضري والبيئة", category: "البيئة والتنمية المستدامة 🌿", status: "مكتمل ومستمر", progress: 95, budget: "450 مليون درهم", image: "assets/video_park.png", details: "حماية الموارد الطبيعية وتوسيع المساحات الخضراء بالمدينة.\n\n- تهيئة وتدشين المنتزه الحضري لبيوكرى مع ملاعب قرب وفضاءات ترفيهية.\n- إنشاء شبكة سقي المساحات الخضراء والحدائق العامة بالمياه العادمة بعد معالجتها.\n- تشجير الأحياء السكنية المجاورة لتقليل درجات الحرارة الحضرية." },
    { id: "sports-dev", title: "تجهيز القاعات المغطاة وملاعب القرب", category: "قطاع الرياضة ⚽", status: "مستمر", progress: 85, budget: "300 مليون درهم", image: "assets/video_bus.png", details: "تأهيل البنيات الرياضية وتشجيع الممارسة الرياضية للناشئة.\n\n- تأهيل الملعب البلدي وتجهيزه بأحدث أرضيات العشب الاصطناعي.\n- بناء وتأهيل القاعات المغطاة الكبرى للألعاب الجماعية.\n- إحداث وتسيير ملاعب قرب بأحياء المدينة." },
    { id: "other", title: "مشروع السوق الأسبوعي الجديد", category: "التنمية الاقتصادية 💼", status: "قيد الإنجاز", progress: 80, budget: "200 مليون درهم", image: "assets/card_territory.png", details: "دعم المقاولات المحلية وتنشيط الحركية التجارية.\n\n- إعادة هيكلة وتطوير السوق البلدي بالكامل وتنظيمه الداخلي.\n- بناء أسواق نموذجية جديدة بمختلف المقاطعات لتقريب الخدمات من المواطنين.\n- بناء المحطة الطرقية الحديثة للمسافرين." }
];

export class ProjectModel {
    static STORAGE_KEY = 'biougra_projects';

    static init() {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultProjects));
        }
    }

    static getAll() {
        this.init();
        try {
            const list = JSON.parse(localStorage.getItem(this.STORAGE_KEY));
            if (Array.isArray(list) && list.length > 0) return list;
            this.saveAll(defaultProjects);
            return defaultProjects;
        } catch (e) {
            return defaultProjects;
        }
    }

    static getById(id) {
        const projects = this.getAll();
        return projects.find(item => item.id === id);
    }

    static saveAll(projectsArray) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projectsArray));
        localStorage.setItem('biougra_last_sync_timestamp', Date.now().toString());
    }

    static update(id, updatedData) {
        let projects = this.getAll();
        projects = projects.map(item => item.id === id ? { ...item, ...updatedData } : item);
        this.saveAll(projects);
        return projects;
    }

    static add(item) {
        let projects = this.getAll();
        if (!item.id) item.id = 'proj-' + Date.now();
        projects.unshift(item);
        this.saveAll(projects);
        return item;
    }

    static delete(id) {
        let projects = this.getAll();
        projects = projects.filter(item => item.id !== id);
        this.saveAll(projects);
        return projects;
    }
}
