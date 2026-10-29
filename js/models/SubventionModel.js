// SUBVENTION MODEL: تدبير الدعم العمومي للجمعيات والمستفيدين (النسخة المحدثة V4 - مطابقة للتصميم 100%)
const SUBVENTION_STORAGE_KEY = 'biougra_subventions_v4';

export const SubventionModel = {
    cleanLegacyData() {
        try {
            localStorage.removeItem('biougra_subventions_data');
            localStorage.removeItem('agadir_subventions_data');
            localStorage.removeItem('biougra_subventions_v2');
            localStorage.removeItem('biougra_subventions_v3');
        } catch (e) {}
    },

    getDefaultData() {
        return {
            decisionTitle: "قرار المجلس الجماعي لبيوكرى رقم 48/2026 القاضي بتحديد شروط ومعايير توزيع الدعم المالي على الجمعيات",
            decisionDetails: "بناء على القانون التنظيمي رقم 113.14 المتعلق بالجماعات، وخاصة المادة 92 منه، وبناء على مقتضيات المداولة رقم 104، المتخذة خلال الدورة العادية للمجلس الجماعي بتاريخ 10 يناير 2026، تم تحديد شروط ومعايير توزيع الدعم المالي على الجمعيات.",
            applicationFormName: "استمارة وبطاقة طلب الدعم المالي السنوي (Fiche de Demande de Subvention).pdf",
            applicationFormUrl: "#download-subvention-fiche",
            deadline: "30 نونبر 2026",
            // 5 Categories breakdown matching Master Reference
            categoriesDistribution: [
                { category: "الرياضية", icon: "🏃‍♂️", totalAmount: 180000, percentage: 85, count: 5, description: "دعم الأندية، تأطير الفئات الصغرى والشباب، والتنقل للمسابقات الجهوية والوطنية" },
                { category: "الثقافية والتراثية", icon: "🏛️", totalAmount: 120000, percentage: 76, count: 4, description: "إحياء التراث السوسي والأمازيغي، تنظيم المهرجانات والمعارض الفنية والمسرح" },
                { category: "التنموية والاجتماعية", icon: "👥", totalAmount: 140000, percentage: 90, count: 4, description: "الرعاية الاجتماعية، مساعدة الأشخاص في وضعية إعاقة، والتمكين الاقتصادي" },
                { category: "البيئية وتأهيل الأحياء", icon: "🍃", totalAmount: 70000, percentage: 70, count: 3, description: "غرس الأشجار، العناية بالمساحات الخضراء، وحملات النظافة والتحسيس البيئي" },
                { category: "التعليمية والتربوية", icon: "📖", totalAmount: 45000, percentage: 80, count: 2, description: "محاربة الهدر المدرسي، دروس الدعم المجانية، وتوفير المحافظ واللوازم للتلاميذ المعوزين" }
            ],
            // 5 Master Beneficiary Projects matching Master Reference Table 100%
            beneficiaries: [
                {
                    id: 1,
                    projectName: "مشروع تهيئة وتهيئة المحور الرياضي بالحي الجديد",
                    assocName: "الرياضية والتنمية الاجتماعية",
                    assocType: "رياضية",
                    domainIcon: "",
                    legalStatus: "موافقة",
                    statutStatus: "مطابقة",
                    annualRef: "2026/01",
                    amount: 45000,
                    progress: 80,
                    president: "رشيد أوبلا",
                    bureauMembers: [
                        { role: "الرئيس", name: "رشيد أوبلا", cin: "JB304928", phone: "0665123456" },
                        { role: "نائب الرئيس", name: "سعيد بلعيد", cin: "JB928374", phone: "0666234567" },
                        { role: "الكاتب العام", name: "عمر الدكالي", cin: "JB102938", phone: "0667345678" },
                        { role: "أمين المال", name: "كمال أيت الطالب", cin: "JB592019", phone: "0668456789" }
                    ],
                    pvNumber: "محضر دورة ماي 2026 - مقرر عدد 104",
                    projectSupported: "مشروع تهيئة وتأهيل المحور الرياضي بالحي الجديد وتأطير الفئات الصغرى"
                },
                {
                    id: 2,
                    projectName: "إحداث وتأهيل المراكز الثقافية والتراثية والصناعات التقليدية بالمنطقة",
                    assocName: "جمعية الإشراق للثقافة والفنون والتراث",
                    assocType: "ثقافية وتراثية",
                    domainIcon: "🏛️",
                    legalStatus: "موافقة",
                    statutStatus: "مطابقة",
                    annualRef: "2026/03",
                    amount: 65000,
                    progress: 100,
                    president: "خالد الزياني",
                    bureauMembers: [
                        { role: "الرئيس", name: "خالد الزياني", cin: "JB829102", phone: "0669123456" },
                        { role: "نائب الرئيس", name: "سميرة الإدريسي", cin: "JB482910", phone: "0670234567" },
                        { role: "الكاتب العام", name: "ياسين المنصوري", cin: "JB192830", phone: "0671345678" },
                        { role: "أمين المال", name: "رقية أيت إبراهيم", cin: "JB738291", phone: "0672456789" }
                    ],
                    pvNumber: "محضر دورة ماي 2026 - مقرر عدد 105",
                    projectSupported: "إحداث وتأهيل المراكز الثقافية والتراثية والصناعات التقليدية ببيوكرى"
                },
                {
                    id: 3,
                    projectName: "إنجاز المركب الثقافي والاجتماعي بجماعة بيوكرى",
                    assocName: "اتحاد جمعيات التنمية والتضامن المحلي لبيوكرى",
                    assocType: "تنموية واجتماعية",
                    domainIcon: "👥",
                    legalStatus: "تنموية وتربوية",
                    statutStatus: "مطابقة",
                    annualRef: "2026/05",
                    amount: 120000,
                    progress: 60,
                    president: "عبد الكريم المرابط",
                    bureauMembers: [
                        { role: "الرئيس", name: "عبد الكريم المرابط", cin: "JB192837", phone: "0661234567" },
                        { role: "نائب الرئيس", name: "فاطمة بوزيد", cin: "JB283910", phone: "0662345678" },
                        { role: "الكاتب العام", name: "حسن أيت همو", cin: "JB472819", phone: "0663456789" },
                        { role: "أمين المال", name: "عائشة الصالحي", cin: "JB582910", phone: "0664567890" }
                    ],
                    pvNumber: "محضر دورة ماي 2026 - مقرر عدد 106",
                    projectSupported: "إنجاز وتجهيز المركب الثقافي والاجتماعي لدعم الأسر والأشخاص في وضعية إعاقة"
                },
                {
                    id: 4,
                    projectName: "إحداث وتجهيز مركز صحي جماعي والفرق الطبية المتنقلة",
                    assocName: "اتحاد جمعيات الأحياء للبيئة والصحة المستدامة",
                    assocType: "بيئية",
                    domainIcon: "🍃",
                    legalStatus: "بيئية",
                    statutStatus: "مطابقة",
                    annualRef: "2026/07",
                    amount: 38000,
                    progress: 100,
                    president: "حسناء السملالي",
                    bureauMembers: [
                        { role: "الرئيسة", name: "حسناء السملالي", cin: "JB910293", phone: "0673123456" },
                        { role: "نائب الرئيس", name: "أحمد بنعلي", cin: "JB572819", phone: "0674234567" },
                        { role: "الكاتب العام", name: "فؤاد الغازي", cin: "JB283910", phone: "0675345678" },
                        { role: "أمين المال", name: "فاطمة الزهراء شريف", cin: "JB849201", phone: "0676456789" }
                    ],
                    pvNumber: "محضر دورة ماي 2026 - مقرر عدد 107",
                    projectSupported: "إحداث وتجهيز مركز صحي جماعي وتسيير الفرق الطبية المتنقلة بأحياء بيوكرى"
                },
                {
                    id: 5,
                    projectName: "بناء وتجهيز المركب المدرسي الحديث وتجهيزاته الداخلية",
                    assocName: "جمعية الآفاق لدعم التمدرس ومحاربة الهدر المدرسي",
                    assocType: "تعليمية وتربوية",
                    domainIcon: "📖",
                    legalStatus: "تعليمية وتربوية",
                    statutStatus: "مطابقة",
                    annualRef: "2026/09",
                    amount: 22000,
                    progress: 25,
                    president: "لطيفة العلمي",
                    bureauMembers: [
                        { role: "الرئيسة", name: "لطيفة العلمي", cin: "JB672910", phone: "0677123456" },
                        { role: "نائب الرئيس", name: "عبد الجليل الراجي", cin: "JB102948", phone: "0678234567" },
                        { role: "الكاتب العام", name: "جميلة التازي", cin: "JB492019", phone: "0679345678" },
                        { role: "أمين المال", name: "محمد الحيان", cin: "JB839201", phone: "0680456789" }
                    ],
                    pvNumber: "محضر دورة ماي 2026 - مقرر عدد 108",
                    projectSupported: "بناء وتجهيز المركب المدرسي الحديث وتوفير المحافظ والدروس الداعمة"
                }
            ],
            // Eligibility questionnaire
            eligibilityQuestions: {
                "رياضية": {
                    title: "معايير وشروط استفادة الجمعيات والأندية الرياضية",
                    criteria: [
                        "أن تكون الجمعية منخرطة بإحدى الجامعات الملكية المغربية أو العصب الجهوية المعترف بها.",
                        "توفر الجمعية على مقر رسمي وأنشطة منتظمة ومستمرة بتراب جماعة بيوكرى.",
                        "الإدلاء بالتقريرين الأدبي والمالي المصادق عليهما في آخر جمع عام.",
                        "تقديم برنامج عمل رياضي سنوي وميزانية تقديرية واضحة للموسم الرياضي."
                    ],
                    requiredDocs: [
                        "طلب الدعم موجه للسيد رئيس المجلس الجماعي وبطاقة الاستمارة الرسمية.",
                        "وصل الإيداع القانوني النهائي المسلم من السلطة المحلية المختصة (محيّن).",
                        "القانون الأساسي للجمعية ولائحة أعضاء المكتب المسير الحاليين.",
                        "محضر آخر جمع عام عادي أو استثنائي معتمد.",
                        "التقرير الأدبي والتقرير المالي للموسم المنصرم موقعان من طرف الرئيس وأمين المال.",
                        "شهادة الحساب البنكي (RIB) أصلية أو نموذج شيك ملغى باسم الجمعية."
                    ]
                },
                "ثقافية وتراثية": {
                    title: "معايير وشروط استفادة الجمعيات الثقافية والفنية والتراثية",
                    criteria: [
                        "المساهمة الفعالة في تنشيط المدينة وإبراز التراث الأمازيغي والموروث السوسي الأصيل.",
                        "تنظيم ندوات أو معارض أو عروض مسرحية وموسيقية هادفة ومجانية للعموم.",
                        "احترام آجال تقديم الملفات والشفافية المالية في صرف المنح السابقة."
                    ],
                    requiredDocs: [
                        "طلب الدعم موجه للسيد الرئيس وبطاقة الاستمارة الرسمية.",
                        "الملف القانوني المكتمل (القانون الأساسي + وصل الإيداع النهائي).",
                        "لائحة أعضاء المكتب المسير والتقرير الأدبي والمالي المعتمد.",
                        "بطاقة تقنية للمشروع أو المهرجان الثقافي المزمع تنظيمه.",
                        "شهادة الحساب البنكي (RIB) باسم الجمعية."
                    ]
                }
            }
        };
    },

    init() {
        this.cleanLegacyData();
        if (!localStorage.getItem(SUBVENTION_STORAGE_KEY)) {
            const def = this.getDefaultData();
            this.save(def);
        }
    },

    get() {
        this.cleanLegacyData();
        try {
            const raw = localStorage.getItem(SUBVENTION_STORAGE_KEY);
            if (!raw) {
                const def = this.getDefaultData();
                this.save(def);
                return def;
            }
            return JSON.parse(raw);
        } catch (e) {
            return this.getDefaultData();
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
