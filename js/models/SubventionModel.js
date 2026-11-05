// SUBVENTION MODEL: تدبير الدعم العمومي لجمعيات المجتمع المدني بجماعة ماسة
const SUBVENTION_STORAGE_KEY = 'massa_subventions_v5';

export const SubventionModel = {
    cleanLegacyData() {
        try {
            localStorage.removeItem('biougra_subventions_data');
            localStorage.removeItem('agadir_subventions_data');
            localStorage.removeItem('biougra_subventions_v2');
            localStorage.removeItem('biougra_subventions_v3');
            localStorage.removeItem('biougra_subventions_v4');
        } catch (e) {}
    },

    getDefaultData() {
        return {
            decisionTitle: "مقرر المجلس الجماعي لماسة القاضي بتحديد شروط ومعايير توزيع الدعم المالي السنوي على الجمعيات",
            decisionDetails: "بناء على القانون التنظيمي رقم 113.14 المتعلق بالجماعات، وخاصة المادتين 65 و92 منه، وبناء على مقرر المجلس الجماعي لماسة المتخذ خلال دورته العادية، تم تحديد المعايير الدقيقة لتوزيع المنح المالية المخصصة لدعم أنشطة المجتمع المدني (التعليم، الرياضة، الصحة، والتراث).",
            applicationFormName: "استمارة وبطاقة طلب الدعم المالي السنوي لجماعة ماسة (Fiche de Demande).pdf",
            applicationFormUrl: "#download-subvention-fiche",
            deadline: "30 نونبر",
            categoriesDistribution: [
                { category: "التربية والتعليم والنقل المدرسي", icon: "🚌", totalAmount: 180000, percentage: 92, count: 6, description: "دعم تسيير أسطول حافلات النقل المدرسي ومحاربة الهدر المدرسي بدواوير ماسة" },
                { category: "الرياضة والشباب", icon: "⚽", totalAmount: 140000, percentage: 88, count: 5, description: "دعم أندية كرة القدم (أمل ماسة، أنازار، أولمبيك الزاوية)، ملاعب القرب، وتأطير الناشئة" },
                { category: "الرعاية الاجتماعية ودار الطالب", icon: "🤝", totalAmount: 160000, percentage: 95, count: 4, description: "تسيير دار الطالب والطالبة ماسة، دعم الأشخاص في وضعية إعاقة، والحملات الطبية" },
                { category: "الثقافة والتراث الواحاتي", icon: "🏛️", totalAmount: 90000, percentage: 80, count: 4, description: "تثمين التراث الأمازيغي، صيانة قصبات تاسيلا، والفنون الشعبية (إسمكان وتماست)" },
                { category: "البيئة والماء الصالح للشرب", icon: "💧", totalAmount: 110000, percentage: 85, count: 5, description: "مواكبة جمعيات تدبير الماء بالدواوير (تسنولت، جوابر، إفنتار) وحماية واحة ماسة" }
            ],
            beneficiaries: [
                {
                    id: 1,
                    projectName: "تسيير أسطول حافلات النقل المدرسي لفائدة تلميذات وتلاميذ دواوير ماسة",
                    assocName: "جمعية وادي ماسة للنقل المدرسي والثقافة",
                    assocType: "التربية والتعليم والنقل المدرسي",
                    domainIcon: "🚌",
                    legalStatus: "موافقة نهائية",
                    statutStatus: "ملف قانوني مطابق",
                    annualRef: "2026/01",
                    amount: 90000,
                    progress: 100,
                    president: "إبراهيم إدلعرب",
                    bureauMembers: [
                        { role: "الرئيس", name: "إبراهيم إدلعرب", cin: "JB140293", phone: "0661234567" },
                        { role: "نائب الرئيس", name: "عمر باحسين", cin: "JB283910", phone: "0662345678" },
                        { role: "الكاتب العام", name: "الحسين إدبوش", cin: "JB392817", phone: "0663456789" },
                        { role: "أمين المال", name: "علي أشنكلي", cin: "JB482910", phone: "0664567890" }
                    ],
                    pvNumber: "محضر دورة المجلس الجماعي - مقرر عدد 18/2026",
                    projectSupported: "توفير خدمات النقل المدرسي اليومي لأكثر من 850 تلميذاً وتلميذة بمختلف الدواوير للثانويات والإعداديات"
                },
                {
                    id: 2,
                    projectName: "تسيير مؤسسة الرعاية الاجتماعية وإيواء التلاميذ المعوزين",
                    assocName: "الجمعية الخيرية الإسلامية دار الطالب والطالبة ماسة",
                    assocType: "الرعاية الاجتماعية ودار الطالب",
                    domainIcon: "🤝",
                    legalStatus: "موافقة نهائية",
                    statutStatus: "ملف قانوني مطابق",
                    annualRef: "2026/02",
                    amount: 80000,
                    progress: 100,
                    president: "محمد أوعزيز",
                    bureauMembers: [
                        { role: "الرئيس", name: "محمد أوعزيز", cin: "JB201928", phone: "0665123456" },
                        { role: "نائب الرئيس", name: "الحسن أرويش", cin: "JB392019", phone: "0666234567" },
                        { role: "الكاتب العام", name: "أحمد أعدي", cin: "JB402918", phone: "0667345678" },
                        { role: "أمين المال", name: "عبد العزيز بن الطالب", cin: "JB592019", phone: "0668456789" }
                    ],
                    pvNumber: "محضر دورة المجلس الجماعي - مقرر عدد 19/2026",
                    projectSupported: "التكفل بالإيواء والإطعام والمواكبة التربوية لـ 160 نزيلاً ونزيلة من أبناء الأسر الهشة بالدواوير النائية"
                },
                {
                    id: 3,
                    projectName: "التأطير الرياضي والمشاركة في منافسات عصبة سوس لكرة القدم",
                    assocName: "الجمعية الرياضية أمل ماسة (Amal Massa)",
                    assocType: "الرياضة والشباب",
                    domainIcon: "⚽",
                    legalStatus: "موافقة نهائية",
                    statutStatus: "ملف قانوني مطابق",
                    annualRef: "2026/03",
                    amount: 60000,
                    progress: 90,
                    president: "الحسين بداز",
                    bureauMembers: [
                        { role: "الرئيس", name: "الحسين بداز", cin: "JB304918", phone: "0669123456" },
                        { role: "نائب الرئيس", name: "سعيد بلعيد", cin: "JB492018", phone: "0670234567" },
                        { role: "الكاتب العام", name: "إدريس بوحسون", cin: "JB582910", phone: "0671345678" },
                        { role: "أمين المال", name: "كمال أيت الطالب", cin: "JB672819", phone: "0672456789" }
                    ],
                    pvNumber: "محضر دورة المجلس الجماعي - مقرر عدد 20/2026",
                    projectSupported: "تأطير مدرسة كرة القدم للفئات الصغرى وتدبير مشاركة الفريق الأول بالملعب الجماعي بسيدي عبو"
                },
                {
                    id: 4,
                    projectName: "تنظيم القوافل الطبية والفحوصات المتخصصة للفئات المعوزة",
                    assocName: "جمعية بصيص أمل ماسة للأعمال الاجتماعية والطبية",
                    assocType: "الرعاية الاجتماعية ودار الطالب",
                    domainIcon: "🩺",
                    legalStatus: "موافقة نهائية",
                    statutStatus: "ملف قانوني مطابق",
                    annualRef: "2026/04",
                    amount: 45000,
                    progress: 85,
                    president: "رشيد أوبلا",
                    bureauMembers: [
                        { role: "الرئيس", name: "رشيد أوبلا", cin: "JB782910", phone: "0673123456" },
                        { role: "نائبة الرئيس", name: "نعيمة آيت بي", cin: "JB892019", phone: "0674234567" },
                        { role: "الكاتب العام", name: "ياسين المنصوري", cin: "JB901928", phone: "0675345678" },
                        { role: "أمين المال", name: "فاطمة بوزيد", cin: "JB120938", phone: "0676456789" }
                    ],
                    pvNumber: "محضر دورة المجلس الجماعي - مقرر عدد 21/2026",
                    projectSupported: "تنظيم قوافل طبية متعددة التخصصات (طب العيون، السكري، وصحة الأم والطفل) بالمركز والدواوير"
                },
                {
                    id: 5,
                    projectName: "تثمين التراث الأمازيغي والمحافظة على قصبات وأسوار تاسيلا",
                    assocName: "جمعية ماسة الكبرى للتراث الثقافي وفنون تماست",
                    assocType: "الثقافة والتراث الواحاتي",
                    domainIcon: "🏛️",
                    legalStatus: "موافقة نهائية",
                    statutStatus: "ملف قانوني مطابق",
                    annualRef: "2026/05",
                    amount: 40000,
                    progress: 80,
                    president: "الحسين إدبوش",
                    bureauMembers: [
                        { role: "الرئيس", name: "الحسين إدبوش", cin: "JB239401", phone: "0677123456" },
                        { role: "نائب الرئيس", name: "عمر أفينو", cin: "JB348291", phone: "0678234567" },
                        { role: "الكاتب العام", name: "لحسن بوالزيت", cin: "JB459102", phone: "0679345678" },
                        { role: "أمينة المال", name: "خديجة أنجار", cin: "JB560293", phone: "0680456789" }
                    ],
                    pvNumber: "محضر دورة المجلس الجماعي - مقرر عدد 22/2026",
                    projectSupported: "تنظيم مهرجان التراث الواحاتي لماسة ومعارض الصناعة التقليدية والتعريف بالمواقع الأثرية"
                },
                {
                    id: 6,
                    projectName: "صيانة وتدبير منظومة التزويد بالماء الصالح للشرب بالدواوير",
                    assocName: "جمعية تسنولت للتنمية الاجتماعية وتدبير الماء الشروب",
                    assocType: "البيئة والماء الصالح للشرب",
                    domainIcon: "💧",
                    legalStatus: "موافقة نهائية",
                    statutStatus: "ملف قانوني مطابق",
                    annualRef: "2026/06",
                    amount: 50000,
                    progress: 100,
                    president: "أحمد أعدي",
                    bureauMembers: [
                        { role: "الرئيس", name: "أحمد أعدي", cin: "JB671203", phone: "0681123456" },
                        { role: "نائب الرئيس", name: "محمد كراج", cin: "JB782314", phone: "0682234567" },
                        { role: "الكاتب العام", name: "إبراهيم إدلعرب", cin: "JB893425", phone: "0683345678" },
                        { role: "أمين المال", name: "مبارك بيجديكن", cin: "JB904536", phone: "0684456789" }
                    ],
                    pvNumber: "محضر دورة المجلس الجماعي - مقرر عدد 23/2026",
                    projectSupported: "صيانة المضخات وتأهيل الخزان المائي وشبكة التوزيع الداخلية لخدمة أزيد من 1,470 نسمة بدوار تسنولت"
                }
            ]
        };
    },

    init() {
        this.cleanLegacyData();
        if (!localStorage.getItem(SUBVENTION_STORAGE_KEY)) {
            localStorage.setItem(SUBVENTION_STORAGE_KEY, JSON.stringify(this.getDefaultData()));
        }
    },

    get() {
        this.init();
        try {
            const raw = localStorage.getItem(SUBVENTION_STORAGE_KEY);
            if (!raw) return this.getDefaultData();
            return JSON.parse(raw);
        } catch (e) {
            return this.getDefaultData();
        }
    },

    save(data) {
        localStorage.setItem(SUBVENTION_STORAGE_KEY, JSON.stringify(data));
        return data;
    }
};
