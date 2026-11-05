const defaultPublications = [
    {
        id: 1,
        title: "برنامج عمل الجماعة الترابية لماسة 2017- 2022 كامل",
        type: "DOCX / PDF",
        size: "4.19 ميغابايت",
        description: "الوثيقة التخطيطية الكبرى المعتمدة من طرف المجلس الجماعي لماسة، تتضمن التشخيص المالي والمجالي التشاركي و126 مشروعاً مهيكلاً بغلاف 440.84 مليون درهم."
    },
    {
        id: 2,
        title: "الميزانية السنوية وحصر الفائض المالي لجماعة ماسة",
        type: "PDF",
        size: "2.10 ميغابايت",
        description: "البيان المالي السنوي المفصل للمداخيل والمصاريف وحسابات القرب الرسمية، وحصر الفائض المالي الحقيقي المبرمج في مشاريع فك العزلة بالدواوير."
    },
    {
        id: 3,
        title: "وثيقة تصنيف قطاعات إعادة الهيكلة وتيسير رخص البناء (179 هكتاراً)",
        type: "PDF",
        size: "1.85 ميغابايت",
        description: "الوثيقة التقنية المصادق عليها بعمالة إقليم اشتوكة آيت باها لتيسير وتبسيط مساطر منح رخص البناء والربط بالشبكات بأحياء مركز ماسة."
    },
    {
        id: 4,
        title: "دليل المساطر والإجراءات الإدارية الموحدة للمرتفقين",
        type: "PDF",
        size: "2.60 ميغابايت",
        description: "دليل إرشادي شامل للمواطنين يتضمن مساطر الحالة المدنية، تصحيح الإمضاءات، الرخص الاقتصادية، رخص التعمير عبر Rokhas.ma، والشرطة الإدارية."
    },
    {
        id: 5,
        title: "دفتر الشروط والتحملات الخاص بتدبير السوق الأسبوعي بسيدي عبو",
        type: "PDF",
        size: "1.40 ميغابايت",
        description: "كناش التحملات المنظم لاستغلال المرافق التجارية، سوق المواشي، المجزرة العصرية، والمحلات المهنية بالسوق الأسبوعي بسيدي عبو ومحلات تاسيلا."
    },
    {
        id: 6,
        title: "استمارة وبطاقة معايير دعم جمعيات المجتمع المدني لسنة 2026",
        type: "PDF",
        size: "0.85 ميغابايت",
        description: "ملف الترشيح الرسمي السنوي للجمعيات والتعاونيات للاستفادة من المنح الجماعية لدعم النقل المدرسي، الرياضة، الثقافة، والعمل الاجتماعي."
    }
];

export class PublicationModel {
    static STORAGE_KEY = 'massa_publications_v2';

    static cleanLegacyData() {
        try {
            localStorage.removeItem('biougra_publications');
            localStorage.removeItem('agadir_publications');
        } catch (e) {}
    }

    static init() {
        this.cleanLegacyData();
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultPublications));
        }
    }

    static getAll() {
        this.init();
        try {
            const list = JSON.parse(localStorage.getItem(this.STORAGE_KEY));
            if (Array.isArray(list) && list.length > 0) return list;
            this.saveAll(defaultPublications);
            return defaultPublications;
        } catch (e) {
            return defaultPublications;
        }
    }

    static saveAll(pubsArray) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(pubsArray));
    }

    static add(pub) {
        const pubs = this.getAll();
        pub.id = Date.now();
        pubs.unshift(pub);
        this.saveAll(pubs);
        return pub;
    }

    static update(id, updatedData) {
        let pubs = this.getAll();
        pubs = pubs.map(p => p.id === Number(id) || p.id === id ? { ...p, ...updatedData } : p);
        this.saveAll(pubs);
    }

    static delete(id) {
        let pubs = this.getAll();
        pubs = pubs.filter(p => p.id !== Number(id) && p.id !== id);
        this.saveAll(pubs);
    }
}
