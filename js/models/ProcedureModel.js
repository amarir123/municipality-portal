const defaultProcedures = [
    {
        id: "residence",
        num: "01",
        title: "شهادة السكنى والإقامة",
        desc: "شروط وإجراءات الحصول على شهادة السكنى لتجديد أو إنجاز البطاقة الوطنية والمصالح الإدارية.",
        icon: "assets/medallion_residence.png",
        documents: "بطاقة التعريف الوطنية، وثيقة إثبات السكنى (عقد كراء، فاتورة ماء أو كهرباء)، صورتان شمسيتان.",
        deadline: "تسلم خلال 24 إلى 48 ساعة",
        cost: "مجانية (أو حسب الرسوم الجبائية المقررة)"
    },
    {
        id: "birth",
        num: "02",
        title: "عقد الازدياد والحالة المدنية",
        desc: "سحب وإيداع طلبات النسخ الكاملة والموجزة لرسم الولادة وسجل الحالة المدنية بالملحقات الإدارية.",
        icon: "assets/medallion_birth.png",
        documents: "الدفتر العائلي أو نسخة قديمة من رسم الولادة، بطاقة التعريف الوطنية لطالب الوثيقة.",
        deadline: "فوري في نفس اليوم",
        cost: "2 دراهم للنسخة (رسم التنبر الجبائي)"
    },
    {
        id: "building",
        num: "03",
        title: "رخص البناء وشواهد التعمير",
        desc: "إيداع وتتبع ملفات طلبات رخص البناء، الهدم، السكن، والشواهد الإدارية عبر منصة رخص الرقمية.",
        icon: "assets/medallion_building.png",
        documents: "التصاميم الهندسية المعمارية، شهادة الملكية العقارية، دفتر التحملات ورأي الوكالة الحضرية.",
        deadline: "من 15 إلى 30 يوماً حسب طبيعة المشروع",
        cost: "حسب المتر المربع ونوعية البناء"
    },
    {
        id: "legalize",
        num: "04",
        title: "تصحيح الإمضاء ومطابقة النسخ",
        desc: "الإشهاد على صحة التوقيع ومطابقة النسخ لأصولها بمكاتب الحالة المدنية ومكاتب تصحيح الإمضاءات.",
        icon: "assets/medallion_legalize.png",
        documents: "أصل الوثيقة المراد مطابقتها، بطاقة التعريف الوطنية للموقع مع الحضور الشخصي.",
        deadline: "فوري عند الشباك",
        cost: "2 دراهم رسم جبائي عن كل إشهاد"
    },
    {
        id: "taxes",
        num: "05",
        title: "الجبايات والرسوم المحلية",
        desc: "أداء الرسوم والجبايات البلدية، الرسم على الأراضي الحضرية غير المبنية، ورخص احتلال الملك العام.",
        icon: "assets/medallion_taxes.png",
        documents: "الإقرار السنوي، نسخة من رخصة الاستغلال، والوصل المالي السابق.",
        deadline: "تسليم الوصل في الحين",
        cost: "حسب جدول التعريفات الجبائية المقررة"
    },
    {
        id: "complaints",
        num: "06",
        title: "شكايات وإنارات القرب",
        desc: "إيداع الشكايات والمقترحات المتعلقة بالإنارة العمومية، النظافة، الطرق، والمرافق العامة المباشرة.",
        icon: "assets/medallion_complaints.png",
        documents: "بيان بموضوع الشكاية مع تحديد الموقع الجغرافي أو صورة للحالة المرصودة.",
        deadline: "معالجة وإحالة خلال 48 ساعة",
        cost: "خدمة مجانية متاحة لكافة المواطنين"
    }
];

export class ProcedureModel {
    static STORAGE_KEY = 'biougra_procedures_data';

    static init() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (!stored) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultProcedures));
        }
    }

    static getAll() {
        this.init();
        try {
            const list = JSON.parse(localStorage.getItem(this.STORAGE_KEY));
            if (Array.isArray(list) && list.length > 0) return list;
            this.saveAll(defaultProcedures);
            return defaultProcedures;
        } catch (e) {
            return defaultProcedures;
        }
    }

    static getById(id) {
        const list = this.getAll();
        return list.find(item => item.id === id);
    }

    static saveAll(list) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
        localStorage.setItem('biougra_last_sync_timestamp', Date.now().toString());
    }

    static update(id, updatedData) {
        let list = this.getAll();
        list = list.map(item => item.id === id ? { ...item, ...updatedData } : item);
        this.saveAll(list);
        return list;
    }

    static add(item) {
        let list = this.getAll();
        if (!item.id) item.id = 'proc-' + Date.now();
        if (!item.num) item.num = String(list.length + 1).padStart(2, '0');
        list.push(item);
        this.saveAll(list);
        return item;
    }

    static delete(id) {
        let list = this.getAll();
        list = list.filter(item => item.id !== id);
        this.saveAll(list);
        return list;
    }
}
