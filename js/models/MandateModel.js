// MANDATE MODEL: الولاية الانتدابية 2021-2027 (المكتب، اللجان، وأعضاء المجلس)
const MANDATE_STORAGE_KEY = 'agadir_mandate_2021_2027';

export const MandateModel = {
    init() {
        if (!localStorage.getItem(MANDATE_STORAGE_KEY)) {
            const defaultData = {
                term: "2021-2027",
                title: "المجلس الجماعي - الولاية الانتدابية 2021-2027",
                bureau: [
                    { id: 1, role: "رئيس المجلس الجماعي", name: "محمد أمين البقالي", party: "الأغلبية", phone: "0528840001" },
                    { id: 2, role: "النائب الأول للرئيس (المكلف بالتعمير والممتلكات)", name: "فاطمة الزهراء الإدريسي", party: "الأغلبية", phone: "0528840002" },
                    { id: 3, role: "النائب الثاني للرئيس (المكلف بالميزانية والمالية)", name: "عبد الله أيت المنصور", party: "الأغلبية", phone: "0528840003" },
                    { id: 4, role: "النائب الثالث للرئيس (المكلف بالأشغال والمرافق)", name: "عمر الراجي", party: "الأغلبية", phone: "0528840004" },
                    { id: 5, role: "النائب الرابع للرئيس (المكلفة بالشؤون الثقافية والاجتماعية)", name: "سميرة بنجلون", party: "الأغلبية", phone: "0528840005" },
                    { id: 6, role: "كاتب المجلس الجماعي", name: "يوسف التيجاني", party: "الأغلبية", phone: "0528840006" },
                    { id: 7, role: "نائب كاتب المجلس", name: "مريم الصالحي", party: "الأغلبية", phone: "0528840007" }
                ],
                committees: [
                    {
                        id: 1,
                        name: "لجنة الميزانية والشؤون المالية والبرمجة",
                        president: "عبد الله أيت المنصور",
                        vice: "خديجة الطاهري",
                        membersCount: 7,
                        description: "دراسة مشروع الميزانية، الحساب الإداري، والبرمجة المالية للمشاريع الجماعية."
                    },
                    {
                        id: 2,
                        name: "لجنة المرافق العمومية والخدمات والإنارة",
                        president: "عمر الراجي",
                        vice: "سعيد المتوكل",
                        membersCount: 6,
                        description: "تتبع التدبير المفوض، شبكات الماء والكهرباء، الإنارة العمومية، والنظافة."
                    },
                    {
                        id: 3,
                        name: "لجنة التنمية البشرية والشؤون الاجتماعية والثقافية والرياضية",
                        president: "سميرة بنجلون",
                        vice: "نادية المرابط",
                        membersCount: 8,
                        description: "تنسيق برامج المبادرة الوطنية للتنمية البشرية، دعم الجمعيات، والأنشطة الشبابية."
                    },
                    {
                        id: 4,
                        name: "لجنة التعمير وإعداد التراب والبيئة والمناطق الخضراء",
                        president: "فاطمة الزهراء الإدريسي",
                        vice: "أحمد العسري",
                        membersCount: 6,
                        description: "دراسة تصاميم التهيئة، رخص البناء الكبرى، والمحافظة على البيئة الحضرية."
                    }
                ],
                councilMembers: [
                    { id: 1, name: "محمد أمين البقالي", role: "رئيس المجلس", district: "الدائرة 1 - المركز", committee: "رئاسة المجلس" },
                    { id: 2, name: "فاطمة الزهراء الإدريسي", role: "نائبة الرئيس", district: "الدائرة 2 - الحي الإداري", committee: "لجنة التعمير" },
                    { id: 3, name: "عبد الله أيت المنصور", role: "نائب الرئيس", district: "الدائرة 3 - النهضة", committee: "لجنة الميزانية" },
                    { id: 4, name: "عمر الراجي", role: "نائب الرئيس", district: "الدائرة 4 - الوفاء", committee: "لجنة المرافق" },
                    { id: 5, name: "سميرة بنجلون", role: "نائبة الرئيس", district: "الدائرة 5 - النور", committee: "لجنة التنمية البشرية" },
                    { id: 6, name: "يوسف التيجاني", role: "كاتب المجلس", district: "الدائرة 6 - السلام", committee: "أمانة المجلس" },
                    { id: 7, name: "مريم الصالحي", role: "نائبة كاتب المجلس", district: "الدائرة 7 - الأمل", committee: "أمانة المجلس" },
                    { id: 8, name: "خديجة الطاهري", role: "مستشارة جماعية", district: "الدائرة 8 - المسيرة", committee: "لجنة الميزانية" },
                    { id: 9, name: "سعيد المتوكل", role: "مستشار جماعي", district: "الدائرة 9 - المستقبل", committee: "لجنة المرافق" },
                    { id: 10, name: "نادية المرابط", role: "مستشارة جماعية", district: "الدائرة 10 - المحيط", committee: "لجنة التنمية البشرية" },
                    { id: 11, name: "أحمد العسري", role: "مستشار جماعي", district: "الدائرة 11 - التضامن", committee: "لجنة التعمير" },
                    { id: 12, name: "حسن بوعبيد", role: "مستشار جماعي", district: "الدائرة 12 - الوحدة", committee: "لجنة الميزانية" }
                ]
            };
            this.save(defaultData);
        }
    },

    get() {
        try {
            return JSON.parse(localStorage.getItem(MANDATE_STORAGE_KEY));
        } catch (e) {
            return null;
        }
    },

    save(data) {
        localStorage.setItem(MANDATE_STORAGE_KEY, JSON.stringify(data));
        return data;
    },

    addBureauMember(member) {
        const data = this.get();
        member.id = Date.now();
        data.bureau.push(member);
        this.save(data);
        return data;
    },

    deleteBureauMember(id) {
        const data = this.get();
        data.bureau = data.bureau.filter(m => m.id !== id);
        this.save(data);
        return data;
    },

    addCouncilMember(member) {
        const data = this.get();
        member.id = Date.now();
        data.councilMembers.push(member);
        this.save(data);
        return data;
    },

    deleteCouncilMember(id) {
        const data = this.get();
        data.councilMembers = data.councilMembers.filter(m => m.id !== id);
        this.save(data);
        return data;
    }
};
