const defaultProjects = [
    { 
        id: "roads", 
        title: "تثنية الطريق 1016 وقنطرة وادي ماسة ومحاور الدواوير", 
        category: "مشاريع البنية التحتية وفك العزلة 🛣️", 
        status: "قيد الإنجاز", 
        progress: 90, 
        budget: "52.4 مليون درهم", 
        image: "assets/ref_project_road.jpg", 
        details: "مشروع استراتيجي مهيكل لفك العزلة وتأهيل المحاور الطرقية الكبرى بجماعة ماسة:\n\n- تثنية مقطع الطريق الإقليمية 1016 من سيدي عبو إلى مقر الجماعة على طول 9.2 كلم (15 مليون درهم).\n- إحداث قنطرة ثانية استراتيجية على وادي ماسة لتأمين انسيابية السير والوقاية من انقطاع الطرق أثناء الحمولات المائية (30 مليون درهم).\n- بناء وتعبيد المحاور الكبرى للطرق بدواوير: آيت السوق، آيت الياس، تكوت، أدولون، إفنتار، أكرار، سيدي بوالفضايل، أدومحيا، تسنولت، جوابر، العرب والمرس (7.4 مليون درهم)." 
    },
    { 
        id: "sanitation", 
        title: "شبكة التطهير السائل ومحطة المعالجة وحماية وادي ماسة", 
        category: "البيئة والموارد الطبيعية 🌿", 
        status: "قيد الإنجاز", 
        progress: 85, 
        budget: "85.0 مليون درهم", 
        image: "assets/video_park.png", 
        details: "المشروع البيئي الأكبر في تاريخ جماعة ماسة لحماية الفرشة المائية وواحة ماسة:\n\n- إنجاز شبكة جمع وصرف المياه العادمة بمركز ماسة على طول 32 كلم (40 مليون درهم).\n- إحداث محطة المعالجة والتصفية البيئية للمياه العادمة بمركز ماسة لإعادة استخدامها بسقي المساحات الخضراء والتشجير (30 مليون درهم).\n- إنجاز شبكة صرف مياه الأمطار بمركز ماسة لحماية الأحياء والساكنة من الفيضانات (15 مليون درهم)." 
    },
    { 
        id: "economic-dev", 
        title: "المنطقة الحرفية والسوق الأسبوعي ومرفأ الصيد بسيدي بوالفضايل", 
        category: "التنمية الاقتصادية والتشغيل 💼", 
        status: "قيد الإنجاز", 
        progress: 80, 
        budget: "85.0 مليون درهم", 
        image: "assets/card_territory.png", 
        details: "حزمة مشاريع نوعية للنهوض بالاقتصاد المحلي وخلق فرص الشغل لشباب ماسة:\n\n- إحداث الحي الصناعي والحرفي بسيدي عبو لجذب الاستثمارات وتوطين المقاولات الصغرى (40 مليون درهم).\n- إعادة هيكلة وتحديث السوق الأسبوعي بسيدي عبو وبناء المجزرة النموذجية والمحلات المهنية (25 مليون درهم).\n- إحداث مرفأ الصيد التقليدي ونقطة التفريغ المجهزة بسيدي بوالفضايل لدعم مهنيي البحر (20 مليون درهم)." 
    },
    { 
        id: "sports-culture", 
        title: "الملعب الجماعي بسيدي عبو والأنشطة الرياضية والثقافية", 
        category: "قطاع الشباب والرياضة والرياضة ⚽", 
        status: "منجز", 
        progress: 100, 
        budget: "18.0 مليون درهم", 
        image: "assets/video_bus.png", 
        details: "تأهيل البنيات التحتية الرياضية ودعم الإشعاع الثقافي لشباب وجمعيات ماسة:\n\n- تهيئة وتكسية الملعب الجماعي بسيدي عبو بالعشب الاصطناعي الممتاز والإنارة والمستودعات (8 مليون درهم بشراكة مع الجامعة الملكية المغربية لكرة القدم).\n- إحداث وتأهيل ملاعب القرب بمختلف دواوير الجماعة ومدرسة سيدي وساي.\n- تأهيل وتجهيز المركب الثقافي لماسة وصيانة السور التقليدي وقصبات تاسيلا وأخربان التاريخية." 
    },
    { 
        id: "digital-portal", 
        title: "إحداث البوابة الإلكترونية للجماعة وتحديث الإدارة (المشروع 5.5)", 
        category: "الحكامة والرقمنة والمرفق العام 💻", 
        status: "منجز ومستمر", 
        progress: 100, 
        budget: "2.5 مليون درهم", 
        image: "assets/video_hall.png", 
        details: "المشروع المبرمج رسمياً في برنامج عمل الجماعة (الرمز 5.5) لتكريس الإدارة الرقمية وقرب المرفق العام:\n\n- إطلاق البوابة الإلكترونية الرسمية لجماعة ماسة وتطبيق الهاتف لخدمة المرتفقين والمواطنين داخل وخارج أرض الوطن.\n- رقمنة المساطر الإدارية، إيداع الشكايات الإلكترونية، وتتبع المشاريع التنموية بتقارير آنية شفافة.\n- تجهيز الإدارة الجماعية بالعتاد المعلوماتي المتطور وربط المكاتب والمصالح الإدارية بشبكة الألياف البصرية." 
    }
];

export class ProjectModel {
    static STORAGE_KEY = 'massa_projects_v2';

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
        localStorage.setItem('massa_last_sync_timestamp', Date.now().toString());
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
