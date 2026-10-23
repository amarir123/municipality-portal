// SYNTHESIS REPORT & COMPETENCES PROJECTS MODEL: التقرير التركيبي ومشاريع الاختصاصات
const SYNTHESIS_STORAGE_KEY = 'agadir_synthesis_report';

export const SynthesisReportModel = {
    init() {
        if (!localStorage.getItem(SYNTHESIS_STORAGE_KEY)) {
            const defaultData = {
                title: "التقرير التركيبي لحصيلة المشاريع التنموية - الولاية الانتدابية 2021-2027",
                introduction: "في إطار تنزيل مقتضيات القانون التنظيمي 113.14 المتعلق بالجماعات، وتفعيلاً لمبادئ الحكامة الترابية والشفافية في التدبير العمومي، يهدف هذا التقرير التركيبي إلى استعراض حصيلة تنفيذ المشاريع التنموية الكبرى للجماعة الترابية، وتوزيعها الدقيق حسب مجالات الاختصاص الذاتية والمشتركة والمنقولة، مع إبراز الاعتمادات المالية المرصودة ونسب الإنجاز المحققة خدمةً لساكنة المدينة.",
                reportingPeriod: "2021-2027",
                lastUpdated: "2026-10-19",
                activityAxes: [
                    { id: 1, name: "المحور الأول: تقوية البنيات التحتية الأساسية وشبكة الطرق والتنقل الحضري", budget: "850,000,000 درهم", projectsCount: 14, completionRate: 85 },
                    { id: 2, name: "المحور الثاني: التأهيل البيئي، المناطق الخضراء، والإنارة العمومية المستدامة", budget: "420,000,000 درهم", projectsCount: 9, completionRate: 90 },
                    { id: 3, name: "المحور الثالث: دعم المرافق الرياضية، الثقافية، ودور الشباب والطفولة", budget: "280,000,000 درهم", projectsCount: 11, completionRate: 75 },
                    { id: 4, name: "المحور الرابع: الرقمنة الشاملة للإدارة، وتجويد الخدمات الجماعية للمواطنين", budget: "95,000,000 درهم", projectsCount: 6, completionRate: 92 }
                ],
                competenceProjects: [
                    {
                        id: 1,
                        competenceType: "اختصاصات ذاتية (Compétences Propres)",
                        projectName: "مشروع تهيئة وتوسعة المحاور الطرقية الرئيسية والمداخل الحضرية",
                        status: "في طور الإنجاز", // لدراسة / في طور الإنجاز / تم تنفيذه
                        budget: 185000000,
                        timeline: "2023 - 2026",
                        progress: 80,
                        projectsCount: 4,
                        notes: "أشغال التعبيد والتطهير السائل وتوسعة الأرصفة في شطرها النهائي."
                    },
                    {
                        id: 2,
                        competenceType: "اختصاصات ذاتية (Compétences Propres)",
                        projectName: "مشروع إنشاء وتأهيل المنتزهات البيئية والمساحات الخضراء الذكية",
                        status: "تم تنفيذه",
                        budget: 65000000,
                        timeline: "2022 - 2025",
                        progress: 100,
                        projectsCount: 3,
                        notes: "تم افتتاح المنتزهات الحضرية وتزويدها بنظم سقي بالمياه المعالجة."
                    },
                    {
                        id: 3,
                        competenceType: "اختصاصات مشتركة (Compétences Partagées)",
                        projectName: "إنجاز المركب الثقافي والمسرح البلدي الموحد والمكتبة الوسائطية",
                        status: "في طور الإنجاز",
                        budget: 120000000,
                        timeline: "2024 - 2027",
                        progress: 60,
                        projectsCount: 2,
                        notes: "بشراكة مع وزارة الشباب والثقافة والتواصل ومجلس الجهة."
                    },
                    {
                        id: 4,
                        competenceType: "اختصاصات مشتركة (Compétences Partagées)",
                        projectName: "إعادة تأهيل الأسواق الأسبوعية وأسواق القرب الجماعية",
                        status: "تم تنفيذه",
                        budget: 45000000,
                        timeline: "2023 - 2025",
                        progress: 100,
                        projectsCount: 3,
                        notes: "تسليم المحلات وتنظيم التجار والمهنيين."
                    },
                    {
                        id: 5,
                        competenceType: "اختصاصات منقولة (Compétences Transférées)",
                        projectName: "بناء وصيانة المراكز الصحية والمستوصفات للقرب بالمناطق الهشة",
                        status: "لدراسة",
                        budget: 38000000,
                        timeline: "2026 - 2027",
                        progress: 25,
                        projectsCount: 2,
                        notes: "في مرحلة الدراسات التقنية والمصادقة على التصاميم المعمارية."
                    },
                    {
                        id: 6,
                        competenceType: "اختصاصات ذاتية (Compétences Propres)",
                        projectName: "مشروع الرقمنة الشاملة للوثائق ورقمنة الحالة المدنية والشكايات",
                        status: "تم تنفيذه",
                        budget: 22000000,
                        timeline: "2024 - 2026",
                        progress: 100,
                        projectsCount: 1,
                        notes: "إطلاق البوابة الإلكترونية وتطبيق الهاتف الموحد وتتبع الشكايات."
                    }
                ]
            };
            this.save(defaultData);
        }
    },

    get() {
        try {
            return JSON.parse(localStorage.getItem(SYNTHESIS_STORAGE_KEY));
        } catch (e) {
            return null;
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
    }
};
