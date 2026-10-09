const defaultComplaints = [
    {
        id: "TKT-2026-001",
        name: "أحمد بناني",
        phone: "0661234567",
        email: "ahmed.bennani@email.com",
        subject: "طلب إنارة عمومية بشارع الحسن الثاني",
        category: "إنارة عمومية",
        details: "نحيطكم علماً بعطل في عمودين للإنارة العمومية قرب المسجد الجامع، يرجى التدخل الصيانة.",
        status: "قيد المعالجة",
        response: "تم توجيه الطلب إلى المصلحة التقنية المكلفة بالإنارة، وسيكون التدخل برمج غداً صباحاً.",
        createdDate: "05 أكتوبر 2026"
    },
    {
        id: "TKT-2026-002",
        name: "فاطمة الزهراء",
        phone: "0669876543",
        email: "f.zahra@email.com",
        subject: "استفسار حول الوثائق المطلوبة لرخصة البناء",
        category: "رخص وتعمير",
        details: "أرغب في استخراج رخصة بناء لمنزل فردي بطابقين، ما هي الوثائق والرسوم الإدارية المطلوبة؟",
        status: "تم الحل",
        response: "تم إرسال دليل المساطر الإدارية الخاص برخص التعمير عبر بريدكم الإلكتروني، ويمكنكم إيداع الملف برقم رخصتي.",
        createdDate: "02 أكتوبر 2026"
    }
];

export class ComplaintModel {
    static STORAGE_KEY = 'agadir_complaints';

    static init() {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultComplaints));
        }
    }

    static getAll() {
        this.init();
        try {
            return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
        } catch (e) {
            return defaultComplaints;
        }
    }

    static getById(ticketId) {
        const list = this.getAll();
        return list.find(item => item.id.toUpperCase() === ticketId.trim().toUpperCase());
    }

    static saveAll(list) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
    }

    static add(data) {
        const list = this.getAll();
        const randomNum = Math.floor(100 + Math.random() * 900);
        const ticketId = `TKT-${new Date().getFullYear()}-${randomNum}`;
        const newComplaint = {
            id: ticketId,
            name: data.name,
            phone: data.phone || '',
            email: data.email || '',
            subject: data.subject,
            category: data.category || 'عام',
            details: data.details,
            status: 'قيد النظر',
            response: 'طلبكم قيد الدراسة والمراجعة من طرف المصلحة المختصة بالجماعة.',
            createdDate: new Date().toLocaleDateString('ar-MA', { day: 'numeric', month: 'long', year: 'numeric' })
        };
        list.unshift(newComplaint);
        this.saveAll(list);
        return newComplaint;
    }

    static updateStatus(ticketId, status, responseNote) {
        let list = this.getAll();
        list = list.map(item => {
            if (item.id === ticketId) {
                return {
                    ...item,
                    status: status || item.status,
                    response: responseNote !== undefined ? responseNote : item.response
                };
            }
            return item;
        });
        this.saveAll(list);
    }

    static delete(ticketId) {
        let list = this.getAll();
        list = list.filter(item => item.id !== ticketId);
        this.saveAll(list);
    }
}
