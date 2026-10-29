// SYNTHESIS REPORT & COMPETENCES PROJECTS MODEL: التقرير التركيبي ومشاريع الاختصاصات
const SYNTHESIS_STORAGE_KEY = 'biougra_synthesis_report_v3';

export const SynthesisReportModel = {
    cleanLegacyData() {
        try {
            localStorage.removeItem('agadir_synthesis_report');
            localStorage.removeItem('biougra_synthesis_report');
            localStorage.removeItem('biougra_synthesis_report_v2');
        } catch (e) {}
    },

    getDefaultData() {
        return {
            title: "التقرير التركيبي لحصيلة المشاريع التنموية - الولاية الانتدابية",
            subtitle: "الحكامة الترابية والتدبير التشاركي للشأن المحلي، لخدمة الصالح العام ومواكبة تطلعات الساكنة.",
            reportingPeriod: "2027-2021",
            lastUpdated: "2026-10-28",
            executiveMetrics: {
                totalProjects: 20,
                completedProjects: 8,
                inProgressProjects: 12,
                overallProgress: 80,
                totalBudget: 185000000
            },
            budgetSheet: {
                totalBudget: "185,000,000 درهم",
                ownBudget: "65,000,000 درهم",
                partnerships: "85,000,000 درهم",
                loansAndSubsidies: "35,000,000 درهم",
                executionRate: "80%",
                fileDownloadUrl: "#download-budget-sheet",
                fileName: "ورقة_الميزانية_المفصلة_لبرنامج_عمل_الجماعة_2021_2027.pdf"
            },
            activityAxes: [
                {
                    id: 1,
                    name: "قطاع التهيئة الحضرية والبنية التحتية",
                    budget: "65,000,000 درهم",
                    projectsCount: 4,
                    completionRate: 85,
                    icon: "🏛️"
                },
                {
                    id: 2,
                    name: "قطاع التعليم والثقافة والرياضة",
                    budget: "40,000,000 درهم",
                    projectsCount: 5,
                    completionRate: 75,
                    icon: "🎓"
                },
                {
                    id: 3,
                    name: "قطاع الشؤون الاجتماعية",
                    budget: "35,000,000 درهم",
                    projectsCount: 3,
                    completionRate: 70,
                    icon: "👥"
                },
                {
                    id: 4,
                    name: "قطاع البيئة والتنمية المستدامة",
                    budget: "45,000,000 درهم",
                    projectsCount: 2,
                    completionRate: 90,
                    icon: "🍃"
                }
            ],
            competenceProjects: [
                {
                    id: 1,
                    competenceType: "التجهيزات والبنية التحتية",
                    projectName: "مشروع تهيئة وتوسعة المدخل الطرقي والبيئة الحضرية والمرافق الحضرية",
                    status: "قيد الإنجاز",
                    budget: 185000000,
                    timeline: "2023 - 2026",
                    progress: 80,
                    strategicOrientation: "البرامج الرياضي/الاجتماعي",
                    orientationIcon: "🎯",
                    etude: "مكتب الدراسات الهندسية NOVEC - مصادق عليها بتاريخ 14/03/2023 (كلفة الدراسة: 1,800,000 درهم)",
                    marche: "صفقة عمومية رقم 12/ج.ب/2023 - شركة أشغال سوس الكبرى (SOTRASOUS)",
                    duree: "24 شهراً (تاريخ الأمر بالخدمة: 01/06/2023 - التسليم المرتقب: دجنبر 2026)",
                    beneficiaires: "45,000 نسمة تشمل كافة أحياء مركز بيوكرى ومستعملي الطريق الجهوية 105",
                    documents: "دفتر الشروط الخاصة (CPS)، اتفاقية تمويل الشطر الثاني، محضر تقدم الأشغال رقم 08"
                },
                {
                    id: 2,
                    competenceType: "التعليم والثقافة والرياضة",
                    projectName: "إحداث وتأهيل المرافق الرياضية والمحلات الجماعية وتحسينها",
                    status: "منجز",
                    budget: 65000000,
                    timeline: "2022 - 2025",
                    progress: 100,
                    strategicOrientation: "المنشآت الرياضية",
                    orientationIcon: "⚽",
                    etude: "مكتب الهندسة والتهيئة البيئية ECO-Souss - شتنبر 2022",
                    marche: "صفقة عمومية رقم 05/ج.ب/2022 - مقاولة الجنوب للتهيئة والإنشاء",
                    duree: "18 شهراً - منجز ومسلم نهائياً",
                    beneficiaires: "الساكنة المحلية، الأندية الرياضية، الجمعيات البيئية، والأسر",
                    documents: "محضر التسليم النهائي للأشغال، دفتر الورش، شهادة المطابقة البيئية"
                },
                {
                    id: 3,
                    competenceType: "التجهيزات والبنية التحتية",
                    projectName: "إحداث المرافق الإدارية والمرافق العمومية",
                    status: "قيد الإنجاز",
                    budget: 120000000,
                    timeline: "2024 - 2027",
                    progress: 60,
                    strategicOrientation: "البنية الإدارية",
                    orientationIcon: "🏛️",
                    etude: "مكتب الدراسات المعمارية ARCHI-DESIGN ومكتب المراقبة SOCOTEC - 2023",
                    marche: "صفقة البناء الكبرى رقم 18/ج.ب/2023 - تجمع شركات العمران الجنوب",
                    duree: "30 شهراً (الأشغال الكبرى بلغت 60% مع تقدم أشغال التجهيز الداخلي)",
                    beneficiaires: "عموم المرتفقين والموظفين والفاعلين الاقتصاديين بإقليم اشتوكة آيت باها",
                    documents: "رخصة البناء الإدارية، كشوفات الحساب المؤقتة رقم 01 إلى 05، اتفاقية الشراكة مع الوزارة"
                },
                {
                    id: 4,
                    competenceType: "البيئة والتنمية المستدامة",
                    projectName: "تهيئة وتطوير المساحات الخضراء والحدائق العمومية",
                    status: "منجز",
                    budget: 45000000,
                    timeline: "2023 - 2025",
                    progress: 100,
                    strategicOrientation: "البيئة والتنمية المستدامة",
                    orientationIcon: "🌱",
                    etude: "مكتب الدراسات الحضرية والتهيئة AGER - يونيو 2023",
                    marche: "صفقة عمومية رقم 08/ج.ب/2023 - شركة البناء والتهيئة الجنوبية",
                    duree: "14 شهراً - منجز ومفتوح أمام التجار والمهنيين",
                    beneficiaires: "أزيد من 850 تاجراً وفلاحاً محلياً، و60,000 مواطن أسبوعياً",
                    documents: "كناش التحملات لتوزيع المحلات، محضر معاينة المطابقة، القرار الجبائي المنظم للسوق"
                },
                {
                    id: 5,
                    competenceType: "الصحة",
                    projectName: "بناء وتجهيز مركز صحي جماعي",
                    status: "دراسة",
                    budget: 38000000,
                    timeline: "2026 - 2027",
                    progress: 25,
                    strategicOrientation: "الخدمات الصحية",
                    orientationIcon: "🏥",
                    etude: "مكتب الدراسات البيوطبية BIO-INGÉNIERIE - إبريل 2026 (مرحلة التدقيق)",
                    marche: "طلب عروض أثمان رقم 02/2027 في طور الإعداد والنشر بالبوابة المغربية للصفقات",
                    duree: "16 شهراً مرتقبة بعد فتح الأظرفة والمصادقة على الصفقة",
                    beneficiaires: "22,000 نسمة بالأحياء الناقصة التجهيز والمداشر المجاورة",
                    documents: "اتفاقية تحويل الاختصاص من وزارة الصحة، وثيقة التحديد العقاري للبقعة الأرضية"
                },
                {
                    id: 6,
                    competenceType: "التجهيزات والبنية التحتية",
                    projectName: "إعادة تأهيل الطريق الرابط بين الجماعة والمناطق المجاورة",
                    status: "قيد الإنجاز",
                    budget: 22000000,
                    timeline: "2024 - 2026",
                    progress: 100,
                    strategicOrientation: "البنية التحتية الطرقية",
                    orientationIcon: "🛣️",
                    etude: "مكتب الاستشارات الطرقية TRANS-ROAD - مصادق عليها في يناير 2024",
                    marche: "صفقة الأشغال الطرقية رقم 04/2024 - شركة تهيئة الطرق السريعة",
                    duree: "12 شهراً - الأشغال مكتملة والمسار مفتوح في وجه حركة السير",
                    beneficiaires: "مستعملو الطريق بين بيوكرى والجماعات المجاورة، أسطول النقل وسيارات الأجرة",
                    documents: "محضر التسليم المؤقت، شهادة مطابقة الجودة التقنية للطبقات الإسفلتية"
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
            // Sanitize competence projects if any legacy messy labels remain
            if (data && data.competenceProjects) {
                let hasLegacy = false;
                data.competenceProjects.forEach((p, idx) => {
                    if (p.competenceType && p.competenceType.includes('Compétences')) {
                        hasLegacy = true;
                        const def = this.getDefaultData();
                        if (def.competenceProjects[idx]) {
                            p.competenceType = def.competenceProjects[idx].competenceType;
                            p.status = def.competenceProjects[idx].status;
                            p.strategicOrientation = def.competenceProjects[idx].strategicOrientation;
                            p.orientationIcon = def.competenceProjects[idx].orientationIcon;
                        }
                    }
                });
                if (hasLegacy) {
                    this.save(data);
                }
            }
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
