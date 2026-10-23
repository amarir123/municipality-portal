// SUBVENTION MODEL: تدبير الدعم العمومي للجمعيات والمستفيدين
const SUBVENTION_STORAGE_KEY = 'agadir_subventions_data';

export const SubventionModel = {
    init() {
        if (!localStorage.getItem(SUBVENTION_STORAGE_KEY)) {
            const defaultData = {
                decisionTitle: "قرار المجلس الجماعي رقم 48/2026 القاضي بتحديد شروط ومعايير توزيع الدعم المالي على الجمعيات",
                decisionDetails: "بناء على القانون التنظيمي رقم 113.14 المتعلق بالجماعات، وبناء على مداولات المجلس الجماعي في دورته العادية، يفتح باب إيداع طلبات الدعم المالي السنوي لفائدة الجمعيات والاتحادات والمنظمات المحلية النشيطة داخل النفوذ الترابي للجماعة.",
                applicationFormName: "استمارة طلب الدعم السنوي للجماعة الترابية (Fiche de Demande de Subvention).pdf",
                applicationFormUrl: "#download-subvention-fiche",
                deadline: "30 نونبر 2026",
                beneficiaries: [
                    {
                        id: 1,
                        assocName: "اتحاد جمعيات التنمية والتضامن المحلي",
                        president: "عبد الكريم المرابط",
                        assocType: "تنموية واجتماعية",
                        statutStatus: "مطابق ومحيّن (Statut Conforme)",
                        legalStatus: "ملف قانوني مكتمل (وصل إيداع نهائي)",
                        pvNumber: "محضر دورة ماي 2026 - مقرر عدد 104",
                        amount: 80000,
                        year: 2026,
                        projectSupported: "مشروع الرعاية المنزلية للأشخاص في وضعية إعاقة والتكوين المهني"
                    },
                    {
                        id: 2,
                        assocName: "جمعية النجم الرياضي للتكواندو وفنون الحرب",
                        president: "رشيد أوبلا",
                        assocType: "رياضية",
                        statutStatus: "مطابق ومحيّن (Statut Conforme)",
                        legalStatus: "ملف قانوني مكتمل (وصل إيداع نهائي)",
                        pvNumber: "محضر دورة ماي 2026 - مقرر عدد 105",
                        amount: 60000,
                        year: 2026,
                        projectSupported: "المشاركة في البطولة الوطنية وتأطير فئات البراعم والشباب"
                    },
                    {
                        id: 3,
                        assocName: "مكتب اتحاد جمعيات الأحياء للبيئة والنظافة",
                        president: "حسناء السملالي",
                        assocType: "بيئية وتأهيل الأحياء",
                        statutStatus: "مطابق ومحيّن (Statut Conforme)",
                        legalStatus: "ملف قانوني مكتمل (وصل إيداع نهائي)",
                        pvNumber: "محضر دورة ماي 2026 - مقرر عدد 106",
                        amount: 45000,
                        year: 2026,
                        projectSupported: "حملات التوعية البيئية وغرس الأشجار وتزيين الأزقة"
                    },
                    {
                        id: 4,
                        assocName: "جمعية الإشراق للثقافة والفنون والتراث",
                        president: "خالد الزياني",
                        assocType: "ثقافية وتراثية",
                        statutStatus: "مطابق ومحيّن (Statut Conforme)",
                        legalStatus: "ملف قانوني مكتمل (وصل إيداع نهائي)",
                        pvNumber: "محضر دورة ماي 2026 - مقرر عدد 107",
                        amount: 50000,
                        year: 2026,
                        projectSupported: "تنظيم المهرجان السنوي للمسرح والتراث الأمازيغي المحلي"
                    },
                    {
                        id: 5,
                        assocName: "جمعية الآفاق لدعم التمدرس ومحاربة الهدر المدرسي",
                        president: "لطيفة العلمي",
                        assocType: "تعليمية وتربوية",
                        statutStatus: "مطابق ومحيّن (Statut Conforme)",
                        legalStatus: "ملف قانوني مكتمل (وصل إيداع نهائي)",
                        pvNumber: "محضر دورة ماي 2026 - مقرر عدد 108",
                        amount: 35000,
                        year: 2026,
                        projectSupported: "توفير النقل المدرسي والمحافظ والكتب للتلاميذ المعوزين"
                    }
                ]
            };
            this.save(defaultData);
        }
    },

    get() {
        try {
            return JSON.parse(localStorage.getItem(SUBVENTION_STORAGE_KEY));
        } catch (e) {
            return null;
        }
    },

    save(data) {
        localStorage.setItem(SUBVENTION_STORAGE_KEY, JSON.stringify(data));
        return data;
    },

    addBeneficiary(item) {
        const data = this.get();
        item.id = Date.now();
        data.beneficiaries.push(item);
        this.save(data);
        return data;
    },

    deleteBeneficiary(id) {
        const data = this.get();
        data.beneficiaries = data.beneficiaries.filter(b => b.id !== id);
        this.save(data);
        return data;
    },

    updateBeneficiary(id, fields) {
        const data = this.get();
        const idx = data.beneficiaries.findIndex(b => b.id === id);
        if (idx !== -1) {
            data.beneficiaries[idx] = { ...data.beneficiaries[idx], ...fields };
            this.save(data);
        }
        return data;
    }
};
