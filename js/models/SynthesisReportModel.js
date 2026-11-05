// SYNTHESIS REPORT & COMPETENCES PROJECTS MODEL: التقرير التركيبي ومشاريع الاختصاصات لبرنامج عمل جماعة ماسة
const SYNTHESIS_STORAGE_KEY = 'massa_pac_synthesis_report_v1';

export const SynthesisReportModel = {
    cleanLegacyData() {
        try {
            localStorage.removeItem('agadir_synthesis_report');
            localStorage.removeItem('biougra_synthesis_report');
            localStorage.removeItem('biougra_synthesis_report_v2');
            localStorage.removeItem('biougra_synthesis_report_v3');
        } catch (e) {}
    },

    getDefaultData() {
        return {
            title: "التقرير التركيبي لحصيلة المشاريع التنموية - برنامج عمل جماعة ماسة",
            subtitle: "الحكامة الترابية والتدبير التشاركي للشأن المحلي، لخدمة الصالح العام ومواكبة تطلعات ساكنة جماعة ماسة.",
            reportingPeriod: "2017 - 2022",
            lastUpdated: "2026-11-04",
            executiveMetrics: {
                totalProjects: 126,
                completedProjects: 82,
                inProgressProjects: 44,
                overallProgress: 85,
                totalBudget: 440840000
            },
            budgetSheet: {
                totalBudget: "440,840,000 درهم",
                ownBudget: "49,490,000 درهم (ميزانية الجماعة والوعاء العقاري)",
                partnerships: "362,000,000 درهم (الوزارات والشركاء المؤسساتيون)",
                loansAndSubsidies: "29,350,000 درهم (صندوق التنمية القروية FDR وصندوق الكوارث)",
                executionRate: "85%",
                fileDownloadUrl: "#download-budget-sheet",
                fileName: "برنامج_عمل_الجماعة_الترابية_لماسة_2017_2022.docx"
            },
            activityAxes: [
                {
                    id: 1,
                    name: "المحور 1: التجهيزات الأساسية وفك العزلة وتنظيم المجال",
                    budget: "65,940,000 درهم",
                    projectsCount: 29,
                    completionRate: 88,
                    icon: "🛣️"
                },
                {
                    id: 2,
                    name: "المحور 2: حماية البيئة والتطهير والوقاية من الفيضانات",
                    budget: "123,900,000 درهم",
                    projectsCount: 16,
                    completionRate: 82,
                    icon: "🌿"
                },
                {
                    id: 3,
                    name: "المحور 3: الحكامة والمقاربة التشاركية وتكافؤ الفرص والرقمنة",
                    budget: "61,500,000 درهم",
                    projectsCount: 51,
                    completionRate: 90,
                    icon: "🏛️"
                },
                {
                    id: 4,
                    name: "المحور 4: الجاذبية الاقتصادية وتثمين الموروث الثقافي والرياضي",
                    budget: "186,600,000 درهم",
                    projectsCount: 30,
                    completionRate: 80,
                    icon: "💼"
                }
            ],
            competenceProjects: [
                {
                    id: 1,
                    competenceType: "البيئة والتطهير السائل",
                    projectName: "إنجاز شبكة التطهير السائل ومحطة التصفية والمعالجة بمركز ماسة",
                    status: "قيد الإنجاز",
                    budget: 70000000,
                    timeline: "2018 - 2022",
                    progress: 85,
                    strategicOrientation: "المحور البيئي والوقائي",
                    orientationIcon: "💧",
                    etude: "الدراسة التقنية المنجزة من طرف ONEE قطاع الماء وكتابة الدولة المكلفة بالتنمية المستدامة (كلفة الدراسة: 2,500,000 درهم)",
                    marche: "اتفاقية شراكة متعددة الأطراف (وزارة الداخلية، كتابة الدولة في الماء، مجلس جهة سوس ماسة، ONEE)",
                    duree: "36 شهراً (تشمل شبكة الصرف الرئيسية بطول 32 كلم ومحطة المعالجة الطبيعية لتثمين المياه العادمة)",
                    beneficiaires: "ساكنة مركز ماسة ومختلف الأحياء المجاورة (أكثر من 12,000 مستفيد مباشر)",
                    documents: "اتفاقية التطهير السائل، محضر انطلاق أشغال الشطر الأول، دفتر الشروط والمطابقة البيئية"
                },
                {
                    id: 2,
                    competenceType: "التنمية الاقتصادية والتشغيل",
                    projectName: "إحداث وتجهيز الحي الصناعي والحرفي بسيدي عبو",
                    status: "قيد الإنجاز",
                    budget: 40000000,
                    timeline: "2019 - 2022",
                    progress: 75,
                    strategicOrientation: "الجاذبية الاقتصادية وتنشيط الاستثمار",
                    orientationIcon: "🏭",
                    etude: "دراسة الجدوى الاقتصادية والمخطط الطبوغرافي منجز من طرف الجماعة الترابية لماسة ومجموعة العمران",
                    marche: "مشروع مهيكل بشراكة مع وزارة التجارة والصناعة، وزارة الداخلية، ومجلس جهة سوس ماسة",
                    duree: "24 شهراً لتهيئة البنية التحتية، الربط بالشبكات والمقاسم الحرفية",
                    beneficiaires: "المهنيون، الحرفيون، الشباب حاملو المشاريع بالمنطقة، وجلب الاستثمارات المنتجة",
                    documents: "مقرر المجلس الجماعي لتخصيص العقار، محضر اللجنة الإقليمية للاستثمار، تصاميم التهيئة الحرفية"
                },
                {
                    id: 3,
                    competenceType: "التجهيزات الأساسية والطرق",
                    projectName: "إحداث قنطرة ثانية على وادي ماسة وتثنية الطريق الإقليمية 1016",
                    status: "قيد الإنجاز",
                    budget: 45000000,
                    timeline: "2017 - 2021",
                    progress: 90,
                    strategicOrientation: "فك العزلة وتأهيل الشبكة الطرقية",
                    orientationIcon: "🌉",
                    etude: "المديرية الإقليمية للتجهيز والنقل باشتوكة آيت باها ومكتب الدراسات CID",
                    marche: "صفقات الطرق والمنشآت الفنية بتمويل مشترك بين وزارة التجهيز والنقل، الجماعة وصندوق التنمية القروية FDR",
                    duree: "20 شهراً - إنجاز المنشأة الفنية الكبرى وتثنية مقطع الطريق الرابط بين سيدي عبو ومقر الجماعة على طول 9.2 كلم",
                    beneficiaires: "مستعملو الطريق بين ماسة وتيزنيت وسيدي إفني وكافة ساكنة دواوير الجماعة",
                    documents: "محضر المعاينة التقنية للمنشأة الفنية، كشف الحساب رقم 04، اتفاقية الشراكة الطرقية"
                },
                {
                    id: 4,
                    competenceType: "التهيئة الحضرية والسكن",
                    projectName: "إعادة هيكلة الأحياء الناقصة التجهيز بالمركز والدواوير",
                    status: "منجز",
                    budget: 33000000,
                    timeline: "2017 - 2020",
                    progress: 100,
                    strategicOrientation: "تحسين جودة الحياة والمشهد الحضري",
                    orientationIcon: "🏘️",
                    etude: "الوكالة الحضرية لأكادير ومفتشية إعداد التراب الوطني والإسكان",
                    marche: "اتفاقية سياسة المدينة وإعادة الهيكلة بشراكة مع وزارة السكنى وسياسة المدينة والمجلس الإقليمي",
                    duree: "24 شهراً - تبليط الأزقة، الإنارة العمومية، الصرف الصحي والتأهيل الحضري",
                    beneficiaires: "أحياء تاسيلا، سيدي بورجا، الركاين، الزاوية، ودواوير الضفة الشرقية والغربية",
                    documents: "محضر التسليم النهائي للأشغال، تقرير لجنة التتبع التقنية، شهادة إبراء الذمة"
                },
                {
                    id: 5,
                    competenceType: "الأسواق والمرافق التجارية",
                    projectName: "إعادة هيكلة وعصرنة السوق الأسبوعي بسيدي عبو",
                    status: "قيد الإنجاز",
                    budget: 25000000,
                    timeline: "2018 - 2022",
                    progress: 80,
                    strategicOrientation: "الرواج التجاري وتثمين المنتوجات الفلاحية",
                    orientationIcon: "🛒",
                    etude: "الدراسة التقنية والمعمارية لإعادة تهيئة الفضاء التجاري وبناء المحلات النموذجية",
                    marche: "صفقة عمومية بتمويل من وزارة الداخلية (DGCL)، الجماعة الترابية لماسة ومجلس الجهة",
                    duree: "18 شهراً - تسوير السوق، بناء المجزرة العصرية، مرافق صحية وفضاء بيع المواشي والسلع",
                    beneficiaires: "أزيد من 1,200 تاجر وفلاح محلي، وتوافد أسبوعي يتجاوز 25,000 مرتفق من كافة أرجاء ماسة واشتوكة",
                    documents: "دفتر الشروط والتحملات الخاص بتدبير المرفق التجاري، كشف تقدم الأشغال رقم 06"
                },
                {
                    id: 6,
                    competenceType: "الصيد التقليدي والاقتصاد الساحلي",
                    projectName: "إحداث مرفأ الصيد التقليدي ونقطة تفريغ السمك بسيدي بوالفضايل",
                    status: "قيد الإنجاز",
                    budget: 20000000,
                    timeline: "2019 - 2022",
                    progress: 85,
                    strategicOrientation: "تنمية الاقتصاد البحري وحماية مهنيي الصيد",
                    orientationIcon: "⛵",
                    etude: "المكتب الوطني للصيد ومعهد الدراسات البحرية بشراكة مع وزارة الفلاحة والصيد البحري",
                    marche: "مشروع مهيكل يشمل بناء رصيف الإرساء، مخازن البحارة، مصنع الثلج وسوق السمك الأولي",
                    duree: "24 شهراً بتمويل من وزارة الفلاحة والصيد البحري (15 م.د) ومجلس جهة سوس ماسة (5 م.د)",
                    beneficiaires: "أكثر من 350 بحاراً تقليدياً وتعاونيات الصيد البحري بساحل ماسة وسيدي بوالفضايل",
                    documents: "اتفاقية تأهيل نقطة التفريغ المجهزة، قرار التصفيف الساحلي، دفتر الورش"
                },
                {
                    id: 7,
                    competenceType: "الرياضة والشباب",
                    projectName: "تهيئة وتعشيب وتجهيز الملعب الجماعي بسيدي عبو وملاعب القرب",
                    status: "منجز",
                    budget: 8000000,
                    timeline: "2018 - 2021",
                    progress: 100,
                    strategicOrientation: "دعم الطفولة والشباب والممارسة الرياضية",
                    orientationIcon: "⚽",
                    etude: "المكتب الوطني للشبيبة والرياضة والجامعة الملكية المغربية لكرة القدم",
                    marche: "شراكة مبرمة مع الجامعة الملكية المغربية لكرة القدم (4 م.د)، وزارة الشباب والرياضة، والمجلس الإقليمي",
                    duree: "12 شهراً - تكسية الملعب بالعشب الاصطناعي الممتاز، الإنارة الكاشفة، المدرجات ومستودعات الملابس",
                    beneficiaires: "الأندية والفرق الرياضية الماسية والجمعيات الرياضية وعموم شباب المنطقة",
                    documents: "محضر التسليم النهائي للمشروع، رخصة المطابقة الرياضية، شهادة الضمان العشاري"
                },
                {
                    id: 8,
                    competenceType: "الحكامة والرقمنة والمرفق العام",
                    projectName: "إحداث البوابة الإلكترونية للجماعة وتحديث الإدارة (المشروع 5.5)",
                    status: "منجز ومستمر",
                    budget: 1500000,
                    timeline: "2020 - 2022",
                    progress: 100,
                    strategicOrientation: "التحول الرقمي وتسهيل الولوج للمعلومة",
                    orientationIcon: "💻",
                    etude: "مصلحة الإعلاميات والتواصل بالجماعة وأطر الرقمنة والتحول الرقمي الإداري",
                    marche: "مشروع تطوير البوابة الرسمية، منصة الشكايات، الشباك الرقمي للرخص وتتبع المشاريع التنموية",
                    duree: "مشروع مستمر للتحديث الإداري وتقديم خدمات القرب الرقمية للمواطنين ومغاربة العالم",
                    beneficiaires: "كافة المواطنين والمرتفقين، الجالية المقيمة بالخارج، والمستثمرون",
                    documents: "دفتر التحملات الرقمي، دليل المساطر الإلكترونية، ميثاق حماية المعطيات ذات الطابع الشخصي CNDP"
                }
            ]
        };
    },

    init() {
        this.cleanLegacyData();
        const data = this.getDefaultData();
        this.save(data);
    },

    get() {
        try {
            const raw = localStorage.getItem(SYNTHESIS_STORAGE_KEY);
            if (!raw) {
                const def = this.getDefaultData();
                this.save(def);
                return def;
            }
            const data = JSON.parse(raw);
            return data;
        } catch (e) {
            return this.getDefaultData();
        }
    },

    save(data) {
        localStorage.setItem(SYNTHESIS_STORAGE_KEY, JSON.stringify(data));
        return data;
    },

    updateIntro(introText, reportTitle) {
        const data = this.get();
        data.introduction = introText;
        if (reportTitle) data.title = reportTitle;
        data.lastUpdated = new Date().toISOString().split('T')[0];
        this.save(data);
        return data;
    },

    addProject(proj) {
        const data = this.get();
        proj.id = Date.now();
        data.competenceProjects.push(proj);
        this.save(data);
        return data;
    },

    deleteProject(id) {
        const data = this.get();
        data.competenceProjects = data.competenceProjects.filter(p => p.id !== id);
        this.save(data);
        return data;
    },

    updateProject(id, updatedFields) {
        const data = this.get();
        const idx = data.competenceProjects.findIndex(p => p.id === id);
        if (idx !== -1) {
            data.competenceProjects[idx] = { ...data.competenceProjects[idx], ...updatedFields };
            this.save(data);
        }
        return data;
    },

    updateAxes(axes) {
        const data = this.get();
        data.activityAxes = axes;
        this.save(data);
        return data;
    }
};
