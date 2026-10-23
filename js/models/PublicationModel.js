const defaultPublications = [
    {
        id: 1,
        title: "التقرير السنوي لأنشطة جماعة بيوكرى 2025",
        type: "PDF",
        size: "4.8 ميغابايت",
        description: "يتضمن الحصيلة الكاملة لمشاريع البنية التحتية، الخدمات الاجتماعية، الميزانيات المنفذة، وشراكات الجماعة خلال سنة 2025."
    },
    {
        id: 2,
        title: "الميزانية السنوية المعتمدة برسم سنة 2026",
        type: "PDF",
        size: "2.1 ميغابايت",
        description: "تفصيل الموارد المالية والمداخيل الضريبية والنفقات العمومية التسييرية والاستثمارية المصادق عليها من طرف المجلس لسنة 2026."
    },
    {
        id: 3,
        title: "دليل رخص البناء والتعمير ببيوكرى",
        type: "DOCX",
        size: "1.5 ميغابايت",
        description: "مرشد توضيحي شامل للمهندسين والمواطنين يتضمن شروط البناء، الرسوم المعمول بها، والتصميم والخرائط المطلوبة عبر Rokhas.ma."
    },
    {
        id: 4,
        title: "كتيب مساطر الإجراءات الإدارية للمواطنين",
        type: "PDF",
        size: "3.2 ميغابايت",
        description: "كتيب تعريفي بالوثائق والمكاتب المخصصة للحالة المدنية، تصحيح الإمضاءات، الرخص الاقتصادية، وحفظ الصحة بالمدينة."
    }
];

export class PublicationModel {
    static STORAGE_KEY = 'biougra_publications';

    static init() {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultPublications));
        }
    }

    static getAll() {
        this.init();
        try {
            return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
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
