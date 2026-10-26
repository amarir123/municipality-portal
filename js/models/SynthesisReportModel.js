// SYNTHESIS REPORT & COMPETENCES PROJECTS MODEL: التقرير التركيبي ومشاريع الاختصاصات
const SYNTHESIS_STORAGE_KEY = 'biougra_synthesis_report';

export const SynthesisReportModel = {
    init() {
        if (!localStorage.getItem(SYNTHESIS_STORAGE_KEY)) {
            const defaultData = {
                title: "التقرير التركيبي لحصيلة المشاريع التنموية - الولاية الانتدابية 2021-2027",
                introduction: "في إطار تنزيل مقتضيات القانون التنظيمي 113.14 المتعلق بالجماعات، وتفعيلاً لمبادئ الحكامة الترابية والشفافية في التدبير العمومي، يهدف هذا التقرير التركيبي إلى استعراض حصيلة تنفيذ المشاريع التنموية الكبرى للجماعة الترابية لبيوكرى، وتوزيعها الدقيق حسب مجالات الاختصاص الذاتية والمشتركة والمنقولة، مع إبراز الاعتمادات المالية المرصودة وتركيبة كل مشروع (الدراسات، الصفقات، الآجال، المستفيدين، والوثائق التعاقدية).",
                reportingPeriod: "2021-2027",
                lastUpdated: "2026-10-26",
                budgetSheet: {
                    totalBudget: "1,645,000,000 درهم",
                    ownBudget: "485,000,000 درهم",
                    partnerships: "860,000,000 درهم",
                    loansAndSubsidies: "300,000,000 درهم",
                    executionRate: "86.4%",
                    fileDownloadUrl: "#download-budget-sheet",
                    fileName: "ورقة_الميزانية_المفصلة_لبرنامج_عمل_الجماعة_2021_2027.pdf"
                },
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
                        projectName: "مشروع تهيئة وتوسعة المحاور الطرقية الرئيسية والمداخل الحضرية لبيوكرى",
                        status: "في طور الإنجاز",
                        budget: 185000000,
                        timeline: "2023 - 2026",
                        progress: 80,
                        // Consistance details per user paper:
                        etude: "مكتب الدراسات الهندسية NOVEC - مصادق عليها بتاريخ 14/03/2023 (كلفة الدراسة: 1,800,000 درهم)",
                        marche: "صفقة عمومية رقم 12/ج.ب/2023 - شركة أشغال سوس الكبرى (SOTRASOUS)",
                        duree: "24 شهراً (تاريخ الأمر بالخدمة: 01/06/2023 - التسليم المرتقب: دجنبر 2026)",
                        beneficiaires: "45,000 نسمة تشمل كافة أحياء مركز بيوكرى ومستعملي الطريق الجهوية 105",
                        documents: "دفتر الشروط الخاصة (CPS)، اتفاقية تمويل الشطر الثاني، محضر تقدم الأشغال رقم 08"
                    },
                    {
                        id: 2,
                        competenceType: "اختصاصات ذاتية (Compétences Propres)",
                        projectName: "إنشاء وتأهيل المنتزهات البيئية والمساحات الخضراء وشبكة السقي الذكي",
                        status: "تم تنفيذه",
                        budget: 65000000,
                        timeline: "2022 - 2025",
                        progress: 100,
                        etude: "مكتب الهندسة الطبيعية والبيئية ECO-PAYSAGE - مصادق عليها في 20/09/2022",
                        marche: "صفقة عمومية رقم 04/ج.ب/2023 - مقاولة النخيل للتهيئة والبيئة",
                        duree: "18 شهراً - تم التسليم النهائي والافتتاح الرسمي",
                        beneficiaires: "ساكنة المدينة بأكملها والزوار، وفضاءات مجهزة لأزيد من 15,000 طفل وأسرة",
                        documents: "دفتر التحملات البيئي، محضر الاستلام المؤقت، محضر الاستلام النهائي"
                    },
                    {
                        id: 3,
                        competenceType: "اختصاصات مشتركة (Compétences Partagées)",
                        projectName: "إنجاز المركب الثقافي وفضاءات دار الصانعة والمكتبة الوسائطية الكبرى",
                        status: "في طور الإنجاز",
                        budget: 120000000,
                        timeline: "2024 - 2027",
                        progress: 60,
                        etude: "تجمع المكاتب المعمارية ARCHI-SUD والمكتب التقني VERITAS - شتنبر 2023",
                        marche: "صفقة رقم 18/ج.ب/2024 - مقاولة البناء الحديث بشراكة مع وزارة الثقافة والجهة",
                        duree: "30 شهراً (مرحلة إتمام الهيكل الخرساني والتشطيبات الفنية)",
                        beneficiaires: "شباب ونساء وحرفيو إقليم اشتوكة، طاقة استيعابية 600 مقعد للمسرح و18 ورشة للصناعة التقليدية",
                        documents: "اتفاقية شراكة مع وزارة الثقافة، دفتر الشروط المعمارية، رخصة البناء رقم 2023/112"
                    },
                    {
                        id: 4,
                        competenceType: "اختصاصات مشتركة (Compétences Partagées)",
                        projectName: "إعادة تأهيل وعصرنة السوق الأسبوعي وأسواق القرب النموذجية",
                        status: "تم تنفيذه",
                        budget: 45000000,
                        timeline: "2023 - 2025",
                        progress: 100,
                        etude: "مكتب الدراسات الحضرية والتهيئة AGER - يونيو 2023",
                        marche: "صفقة عمومية رقم 08/ج.ب/2023 - شركة البناء والتهيئة الجنوبية",
                        duree: "14 شهراً - منجز ومفتوح أمام التجار والمهنيين",
                        beneficiaires: "أزيد من 850 تاجراً وفلاحاً محلياً، و60,000 مواطن أسبوعياً",
                        documents: "كناش التحملات لتوزيع المحلات، محضر معاينة المطابقة، القرار الجبائي المنظم للسوق"
                    },
                    {
                        id: 5,
                        competenceType: "اختصاصات منقولة (Compétences Transférées)",
                        projectName: "بناء وصيانة المراكز الصحية ومستوصفات القرب بالأحياء الهشة",
                        status: "لدراسة",
                        budget: 38000000,
                        timeline: "2026 - 2027",
                        progress: 25,
                        etude: "مكتب الدراسات البيوطبية BIO-INGÉNIERIE - إبريل 2026 (مرحلة التدقيق)",
                        marche: "طلب عروض أثمان رقم 02/2027 في طور الإعداد والنشر بالبوابة المغربية للصفقات",
                        duree: "16 شهراً مرتقبة بعد فتح الأظرفة والمصادقة على الصفقة",
                        beneficiaires: "22,000 نسمة بالأحياء الناقصة التجهيز والمداشر المجاورة",
                        documents: "اتفاقية تحويل الاختصاص من وزارة الصحة، وثيقة التحديد العقاري للبقعة الأرضية"
                    },
                    {
                        id: 6,
                        competenceType: "اختصاصات ذاتية (Compétences Propres)",
                        projectName: "الرقمنة الشاملة للإدارة ورقمنة الحالة المدنية والشكايات والتتبع الآني",
                        status: "تم تنفيذه",
                        budget: 22000000,
                        timeline: "2024 - 2026",
                        progress: 100,
                        etude: "مكتب الاستشارات الرقمية DIGITAL-GOV - مصادق عليها في يناير 2024",
                        marche: "صفقة الخدمات البرمجية رقم 01/2024 - شركة الحلول السحابية المتقدمة",
                        duree: "12 شهراً - النظام يعمل بنجاح ومربوط بالبوابة الرسمية",
                        beneficiaires: "كافة المواطنين والمهاجرين بالخارج، وإدارة الجماعة وموظفيها",
                        documents: "شهادة مطابقة CNDP، دفتر الشروط التقنية، عقد الصيانة والدعم الفني السنوي"
                    }
                ]
            };
            this.save(defaultData);
        }
    },

    get() {
        try {
            return JSON.parse(localStorage.getItem(SYNTHESIS_STORAGE_KEY)) || JSON.parse(localStorage.getItem('agadir_synthesis_report'));
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
