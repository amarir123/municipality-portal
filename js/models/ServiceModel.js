const defaultServices = [
    {
        id: 1,
        title: "طلب شواهد الحالة المدنية والولادة",
        category: "الحالة المدنية",
        description: "دليل وخدمة إيداع طلب الحصول على عقود الازدياد الشواهد الفردية والعائلية.",
        link: "https://www.rokhas.ma",
        isExternal: true,
        fileSize: "رقمي"
    },
    {
        id: 2,
        title: "دليل مساطر رخص التعمير والبناء 2026",
        category: "التعمير والبناء",
        description: "تحميل الدليل الموحد للمستندات والوثائق المطلوبة لطلب الحصول على رخصة البناء والتأهيل.",
        link: "assets/docs/building_permit_guide.pdf",
        isExternal: false,
        fileSize: "2.4 MB PDF"
    },
    {
        id: 3,
        title: "برنامج عمل الجماعة للفترة 2022-2027",
        category: "برامج ووظائق",
        description: "البرنامج الكامل لمشاريع الجماعة والاستراتيجيات التنموية المعتمدة.",
        link: "assets/docs/action_program_2022_2027.pdf",
        isExternal: false,
        fileSize: "5.1 MB PDF"
    },
    {
        id: 4,
        title: "ميزانية الجماعة وحصر الفائض المالي 2026",
        category: "المالية والميزانية",
        description: "التقرير المالي السنوي للمداخيل والمصاريف وحسابات القرب الرسمية للجماعة.",
        link: "assets/docs/budget_summary_2026.pdf",
        isExternal: false,
        fileSize: "1.8 MB PDF"
    }
];

export class ServiceModel {
    static STORAGE_KEY = 'agadir_services';

    static init() {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultServices));
        }
    }

    static getAll() {
        this.init();
        try {
            const list = JSON.parse(localStorage.getItem(this.STORAGE_KEY));
            if (Array.isArray(list) && list.length > 0) return list;
            this.saveAll(defaultServices);
            return defaultServices;
        } catch (e) {
            return defaultServices;
        }
    }

    static saveAll(list) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
    }

    static add(item) {
        const list = this.getAll();
        item.id = Date.now();
        list.unshift(item);
        this.saveAll(list);
        return item;
    }

    static delete(id) {
        let list = this.getAll();
        list = list.filter(item => item.id !== Number(id) && item.id !== id);
        this.saveAll(list);
    }
}
