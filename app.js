// DOM ELEMENTS
const searchToggleBtn = document.getElementById('searchToggleBtn');
const searchInputWrapper = document.getElementById('searchInputWrapper');
const searchInput = document.getElementById('searchInput');
const mainHeader = document.getElementById('mainHeader');
const menuToggleBtn = document.getElementById('menuToggleBtn');
const navMenu = document.getElementById('navMenu');
const backToTopBtn = document.getElementById('backToTopBtn');
const modalOverlay = document.getElementById('modalOverlay');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalBody = document.getElementById('modalBody');
const langButtons = document.querySelectorAll('.lang-btn');

// TRANSLATION DICTIONARY FOR ARABIC & FRENCH (SIMULATOR)
const translations = {
    ar: {
        dir: 'rtl',
        menu: {
            workingHours: 'أوقات العمل',
            publications: 'منشوراتنا',
            urbanDev: 'برنامج التنمية الحضرية',
            actionProg: 'برنامج عمل الجماعة',
            procedures: 'الإجراءات الإدارية',
            sustainable: 'بيوكرى مدينة مستدامة',
            municipality: 'الجماعة الترابية'
        },
        hero: {
            title: 'بوابة الجماعة الترابية لبيوكرى',
            btn: 'تعرف على الجماعة'
        },
        sections: {
            news: 'مستجدات الجماعة',
            procedures: 'الاجراءات الادارية',
            urban: 'برنامج التنمية الحضرية لبيوكرى',
            multimedia: 'صوت و صورة',
            events: 'انشطة ومناسبات'
        }
    },
    fr: {
        dir: 'ltr',
        menu: {
            workingHours: 'Horaires',
            publications: 'Publications',
            urbanDev: 'PDU de Biougra',
            actionProg: 'Plan d\'Action',
            procedures: 'Démarches Administratives',
            sustainable: 'Biougra Ville Durable',
            municipality: 'La Commune'
        },
        hero: {
            title: 'Portail de la Commune d\'Agadir',
            btn: 'Découvrir la Commune'
        },
        sections: {
            news: 'Actualités de la Commune',
            procedures: 'Démarches Administratives',
            urban: 'Programme de Développement Urbain',
            multimedia: 'Multimédia',
            events: 'Activités & Événements'
        }
    },
    en: {
        dir: 'ltr',
        menu: {
            workingHours: 'Hours of Work',
            publications: 'Publications',
            urbanDev: 'Urban Development',
            actionProg: 'Action Plan',
            procedures: 'Administrative Procedures',
            sustainable: 'Sustainable Agadir',
            municipality: 'The Municipality'
        },
        hero: {
            title: 'Portal of the Municipality of Agadir',
            btn: 'Discover the Municipality'
        },
        sections: {
            news: 'Municipality Updates',
            procedures: 'Administrative Services',
            urban: 'Urban Development Program',
            multimedia: 'Multimedia & Press',
            events: 'Activities & Events'
        }
    },
    tz: {
        dir: 'rtl',
        menu: {
            workingHours: 'ⵜⵉⵎⵍⴰⵍⵉⵏ',
            publications: 'ⵜⵉⵥⵔⵉⴳⵉⵏ ⵏⵏⵖ',
            urbanDev: 'ⴰⵀⵉⵍ ⵏ ⵜⴳⵎⵉ ⵜⴰⵖⵔⵎⴰⵏⵜ',
            actionProg: 'ⴰⵀⵉⵍ ⵏ ⵜⵡⵓⵔⵉ ⵏ ⵜⴳⵔⴰⵡⵜ',
            procedures: 'ⵜⵉⵡⵓⵔⵉⵡⵉⵏ ⵜⵉⴷⴱⵍⴰⵏⵉⵏ',
            sustainable: 'ⴰⴽⴰⴷⵉⵔ ⵜⴰⵖⵔⵎⵜ ⵜⴰⵎⵙⴳⴷⵍⵜ',
            municipality: 'ⵜⴰⴳⵔⴰⵡⵜ ⵜⴰⴽⴰⵍⴰⵏⵜ'
        },
        hero: {
            title: 'ⵜⴰⴱⵡⴰⴱⵜ ⵏ ⵜⴳⵔⴰⵡⵜ ⵜⴰⴽⴰⵍⴰⵏⵜ ⵏ ⵓⴳⴰⴷⵉⵔ',
            btn: 'ⵙⵙⵏ ⵜⴰⴳⵔⴰⵡⵜ'
        },
        sections: {
            news: 'ⵉⵎⴰⵢⵏⵓⵜⵏ ⵏ ⵜⴳⵔⴰⵡⵜ',
            procedures: 'ⵜⵉⵡⵓⵔⵉⵡⵉⵏ ⵜⵉⴷⴱⵍⴰⵏⵉⵏ',
            urban: 'ⴰⵀⵉⵍ ⵏ ⵜⴳⵎⵉ ⵜⴰⵖⵔⵎⴰⵏⵜ ⵏ ⵓⴳⴰⴷⵉⵔ',
            multimedia: 'ⵉⵎⵙⵍⵉ ⴷ ⵜⵡⵍⴰⴼⵜ',
            events: 'ⵜⵉⵎⵙⴰⵔⵉⵏ ⴷ ⵜⵉⵎⵍⵉⵍⵉⵜⵉⵏ'
        }
    }
};

// --- SEARCH TOGGLE ---
if (searchToggleBtn) {
    searchToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        searchInputWrapper.classList.toggle('active');
        if (searchInputWrapper.classList.contains('active')) {
            searchInput.focus();
        }
    });

    document.addEventListener('click', (e) => {
        if (!searchToggleBtn.contains(e.target) && !searchInputWrapper.contains(e.target)) {
            searchInputWrapper.classList.remove('active');
        }
    });
}

// --- STICKY HEADER SHRINK ---
window.addEventListener('scroll', () => {
    if (mainHeader) {
        if (window.scrollY > 80) {
            mainHeader.classList.add('shrink');
        } else {
            mainHeader.classList.remove('shrink');
        }
    }
    if (backToTopBtn) {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    }
});

// --- MOBILE MENU TOGGLE ---
if (menuToggleBtn) {
    menuToggleBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggleBtn.classList.toggle('open');
    });

    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && (href === currentPath || (currentPath === '' && href === 'index.html') || (currentPath === 'index.html' && href.startsWith('index.html')))) {
            if (href === 'index.html' || href === currentPath) {
                link.classList.add('active');
            }
        }
        link.addEventListener('click', () => {
            if (navMenu) navMenu.classList.remove('active');
            if (menuToggleBtn) menuToggleBtn.classList.remove('open');
        });
    });
}

// --- BACK TO TOP SCROLL ---
if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// --- LANGUAGE SWITCHER SIMULATION ---
langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        
        langButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const html = document.documentElement;
        html.setAttribute('lang', lang === 'tz' ? 'kab' : lang);
        html.setAttribute('dir', translations[lang].dir);
        
        // Translate Header/Nav
        const links = document.querySelectorAll('.nav-menu a');
        if (links.length >= 7) {
            links[6].textContent = translations[lang].menu.municipality;
            links[5].textContent = translations[lang].menu.sustainable;
            links[4].textContent = translations[lang].menu.procedures;
            links[3].textContent = translations[lang].menu.actionProg;
            links[2].textContent = translations[lang].menu.urbanDev;
            links[1].textContent = translations[lang].menu.publications;
            links[0].textContent = translations[lang].menu.workingHours;
        }
        
        // Translate Hero Content
        const heroTitle = document.querySelector('.hero-title');
        const heroBtn = document.querySelector('.hero-section .btn');
        if (heroTitle && heroBtn) {
            heroTitle.textContent = translations[lang].hero.title;
            heroBtn.textContent = translations[lang].hero.btn;
        }
        
        // Translate Section Headers
        const sectionTitles = document.querySelectorAll('.section-title');
        if (sectionTitles.length >= 5) {
            sectionTitles[0].textContent = translations[lang].sections.news;
            sectionTitles[1].textContent = translations[lang].sections.procedures;
            sectionTitles[2].textContent = translations[lang].sections.urban;
            sectionTitles[3].textContent = translations[lang].sections.multimedia;
            sectionTitles[4].textContent = translations[lang].sections.events;
        }
    });
});

// --- DYNAMIC RENDERING ON DOM LOAD ---
window.addEventListener('DOMContentLoaded', () => {
    applyDynamicBranding();
    renderDynamicNews();
    renderDynamicEvents();
    renderDynamicPublications();
    renderDynamicVideos();
    updateActionProgramUI();
    checkAdminControlsVisibility();
});

// Hide/Show Admin controls depending on login status
function checkAdminControlsVisibility() {
    const isAdmin = sessionStorage.getItem('agadir_admin_logged') === 'true';
    if (isAdmin) {
        document.querySelectorAll('.admin-only').forEach(el => {
            if (el.tagName === 'DIV' || el.tagName === 'LI') {
                el.style.setProperty('display', 'flex', 'important');
            } else if (el.tagName === 'A') {
                el.style.setProperty('display', 'inline-block', 'important');
            }
        });
    }
}

// Dynamic Branding Customization Applicator
function applyDynamicBranding() {
    if (!window.agadirDB) return;
    const branding = window.agadirDB.getBranding();
    if (!branding) return;
    
    // Apply CSS Variables
    const root = document.documentElement;
    root.style.setProperty('--primary-color', branding.primaryColor);
    root.style.setProperty('--primary-hover', branding.primaryColor);
    root.style.setProperty('--primary-light', branding.primaryColor + '15');
    
    root.style.setProperty('--accent-color', branding.accentColor);
    root.style.setProperty('--accent-hover', branding.accentColor);
    root.style.setProperty('--accent-light', branding.accentColor + '15');
    
    root.style.setProperty('--dark-color', branding.darkColor);
    root.style.setProperty('--text-main', branding.textColor);
    
    // Swap Logos
    const logoElements = document.querySelectorAll('.main-logo, .footer-logo, .sidebar-logo img, .login-logo');
    logoElements.forEach(img => {
        img.src = branding.logoUrl;
    });
    
    // Swap Municipality Names
    const muniNameDisplays = document.querySelectorAll('.muni-name-display');
    muniNameDisplays.forEach(el => {
        el.textContent = branding.muniName;
    });

    // Swap Hero Background Image
    const heroSection = document.getElementById('hero');
    if (heroSection && branding.heroBgUrl) {
        heroSection.style.backgroundImage = 'url(' + branding.heroBgUrl + ')';
    }

    // Swap Category Cards images
    const cardCouncil = document.querySelector('[data-modal="council"] img');
    if (cardCouncil && branding.cardCouncilUrl) {
        cardCouncil.src = branding.cardCouncilUrl;
    }
    const cardProcedures = document.querySelector('[data-modal="procedures"] img');
    if (cardProcedures && branding.cardProceduresUrl) {
        cardProcedures.src = branding.cardProceduresUrl;
    }
    const cardTerritory = document.querySelector('[data-modal="territory"] img');
    if (cardTerritory && branding.cardTerritoryUrl) {
        cardTerritory.src = branding.cardTerritoryUrl;
    }
}

// 2b. Render Videos on Homepage
function renderDynamicVideos() {
    const container = document.getElementById('videosGridContainer');
    if (!container) return;

    const videos = window.agadirDB ? window.agadirDB.getVideos() : [];
    container.innerHTML = '';

    videos.forEach(vid => {
        container.innerHTML += `
            <div class="video-card" onclick="openDynamicModal('video-${vid.id}')">
                <div class="video-thumbnail-wrapper">
                    <img src="${vid.thumbnail}" alt="${vid.title}">
                    <div class="play-btn-overlay">
                        <svg class="play-icon" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                    </div>
                </div>
            </div>
        `;
    });
}

// 1. Render News on Homepage
function renderDynamicNews() {
    const container = document.getElementById('newsListContainer');
    if (!container) return;
    
    const news = window.agadirDB ? window.agadirDB.getNews() : [];
    container.innerHTML = '';
    
    news.forEach(item => {
        container.innerHTML += `
            <div class="news-item" onclick="openDynamicModal('article-${item.id}')">
                <div class="news-date">${item.date}</div>
                <div class="news-details">
                    <h3 class="news-title">${item.title}</h3>
                    <p class="news-excerpt">${item.excerpt}</p>
                </div>
            </div>
        `;
    });
}

// 2. Render Events on Homepage
function renderDynamicEvents() {
    const container = document.getElementById('eventsGridContainer');
    if (!container) return;
    
    const events = window.agadirDB ? window.agadirDB.getEvents() : [];
    container.innerHTML = '';
    
    events.forEach(event => {
        container.innerHTML += `
            <div class="event-card" onclick="openDynamicModal('event-${event.id}')">
                <div class="event-img-wrapper">
                    <img src="${event.image}" alt="${event.title}">
                </div>
                <div class="event-overlay-bar">
                    <div class="event-date-badge">${event.date}</div>
                    <div class="event-title-wrapper">
                        <h3 class="event-title-text">${event.title}</h3>
                    </div>
                </div>
            </div>
        `;
    });
}

// 3. Render Publications on Publications Page
function renderDynamicPublications() {
    const container = document.getElementById('publicationsListContainer');
    if (!container) return;
    
    const pubs = window.agadirDB ? window.agadirDB.getPublications() : [];
    container.innerHTML = '';
    
    pubs.forEach(pub => {
        const fileIconClass = pub.type.toLowerCase() === 'docx' ? 'doc' : '';
        container.innerHTML += `
            <div class="pub-card ${fileIconClass}">
                <div class="pub-file-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </div>
                <div class="pub-details">
                    <h3 class="pub-title">${pub.title}</h3>
                    <div class="pub-meta">
                        <span>نوع الملف: ${pub.type}</span>
                        <span>الحجم: ${pub.size}</span>
                    </div>
                    <p class="pub-description">${pub.description}</p>
                    <div class="pub-action-row">
                        <button class="btn btn-primary" onclick="simulateDownload(this)">تحميل الوثيقة</button>
                        <div class="download-progress-bar">
                            <div class="download-progress"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

// 4. Update Action Program UI on Action-Program Page
function updateActionProgramUI() {
    const items = document.querySelectorAll('.accordion-item');
    if (items.length < 5 || !window.agadirDB) return;
    
    const projects = window.agadirDB.getProjects();
    
    // Axis 1: Roads
    const p1 = projects.find(p => p.id === 'roads');
    if (p1) {
        items[0].querySelector('.axis-meta div:nth-child(1) strong').nextSibling.textContent = ' ' + p1.budget;
        items[0].querySelector('.axis-meta div:nth-child(2) strong').nextSibling.textContent = ' ' + p1.progress + '%';
        items[0].querySelector('.axis-progress').style.width = p1.progress + '%';
    }
    // Axis 2: Environment
    const p2 = projects.find(p => p.id === 'environment');
    if (p2) {
        items[1].querySelector('.axis-meta div:nth-child(1) strong').nextSibling.textContent = ' ' + p2.budget;
        items[1].querySelector('.axis-meta div:nth-child(2) strong').nextSibling.textContent = ' ' + p2.progress + '%';
        items[1].querySelector('.axis-progress').style.width = p2.progress + '%';
    }
    // Axis 3: Combined / Sports-dev
    const p3 = projects.find(p => p.id === 'sports-dev');
    if (p3) {
        items[2].querySelector('.axis-meta div:nth-child(1) strong').nextSibling.textContent = ' ' + p3.budget;
        items[2].querySelector('.axis-meta div:nth-child(2) strong').nextSibling.textContent = ' ' + p3.progress + '%';
        items[2].querySelector('.axis-progress').style.width = p3.progress + '%';
    }
    // Axis 4: Tourism / Culture
    const p4 = projects.find(p => p.id === 'tourism');
    if (p4) {
        items[3].querySelector('.axis-meta div:nth-child(1) strong').nextSibling.textContent = ' ' + p4.budget;
        items[3].querySelector('.axis-meta div:nth-child(2) strong').nextSibling.textContent = ' ' + p4.progress + '%';
        items[3].querySelector('.axis-progress').style.width = p4.progress + '%';
    }
    // Axis 5: Smart Governance (other)
    const p5 = projects.find(p => p.id === 'other');
    if (p5) {
        items[4].querySelector('.axis-meta div:nth-child(1) strong').nextSibling.textContent = ' ' + p5.budget;
        items[4].querySelector('.axis-meta div:nth-child(2) strong').nextSibling.textContent = ' ' + p5.progress + '%';
        items[4].querySelector('.axis-progress').style.width = p5.progress + '%';
    }
}

// --- STATIC AND DYNAMIC MODAL MANAGER ---
// Static contents
const staticModalData = {
    council: {
        title: 'المجلس الجماعي لبيوكرى',
        content: `
            <div class="modal-text">
                <p>يتكون المجلس الجماعي لبيوكرى من أعضاء يمثلون مختلف الهيئات السياسية بالمدينة، برئاسة رئيس المجلس الجماعي وفريقه التنفيذي.</p>
                <br>
                <p><strong>مهام المجلس الجماعي:</strong></p>
                <ul class="modal-list">
                    <li>إعداد برنامج عمل الجماعة وتتبع تنفيذه.</li>
                    <li>التصديق على الميزانية السنوية للمدينة وتوزيع نفقاتها.</li>
                    <li>تدبير المرافق العمومية المحلية (الإنارة، المساحات الخضراء، النفايات).</li>
                    <li>الموافقة على اتفاقيات الشراكة وتأهيل البنية التحتية.</li>
                </ul>
                <p>يعقد المجلس دوراته العادية ثلاث مرات في السنة (أكتوبر، فبراير، ماي)، بالإضافة إلى دورات استثنائية عند الحاجة.</p>
            </div>
        `
    },
    procedures: {
        title: 'الإجراءات الإدارية للمواطنين',
        content: `
            <div class="modal-text">
                <p>تسعى جماعة بيوكرى إلى رقمنة وتسهيل جميع الإجراءات الإدارية لتوفير الوقت والجهد على المواطنين والشركات.</p>
                <br>
                <div class="modal-tabs">
                    <button class="modal-tab active" onclick="switchModalTab(event, 'tab-digital')">الخدمات الرقمية</button>
                    <button class="modal-tab" onclick="switchModalTab(event, 'tab-physical')">الخدمات بالمقاطعات</button>
                </div>
                
                <div id="tab-digital" class="modal-tab-content active">
                    <p>يمكنكم قضاء الإجراءات التالية عبر المنصات الوطنية الرقمية:</p>
                    <ul class="modal-list">
                        <li><strong>منصة Wathyqa.ma:</strong> لطلب شواهد الحالة المدنية (عقد الازدياد، النسخة الكاملة) وإيصالها لعنوانكم.</li>
                        <li><strong>منصة Rokhas.ma:</strong> لإيداع ودراسة طلبات رخص البناء ورخص الأنشطة الاقتصادية والتجارية.</li>
                        <li><strong>منصة Chikaya.ma:</strong> لتقديم الشكاوى والاقتراحات وتتبع معالجتها من طرف مصالح الجماعة.</li>
                    </ul>
                </div>
                
                <div id="tab-physical" class="modal-tab-content">
                    <p>بالنسبة للخدمات التي تتطلب الحضور الشخصي، تستقبلكم المصالح الحضرية لبيوكرى لتقديم الخدمات التالية:</p>
                    <ul class="modal-list">
                        <li>تصحيح الإمضاء (تطابق الشواهد مع أصولها).</li>
                        <li>تصاريح الولادة والوفاة وتحديث دفاتر الحالة المدنية.</li>
                        <li>طلبات شواهد السكن والإدارة المحلية.</li>
                    </ul>
                </div>
            </div>
        `
    },
    territory: {
        title: 'الجماعة الترابية لبيوكرى',
        content: `
            <div class="modal-text">
                <p>تعتبر الجماعة الترابية لبيوكرى شخصاً معنوياً خاضعاً للقانون العام، وتتمتع بالاستقلال الإداري والمالي، وتعتبر عاصمة إقليم شتوكة أيت باها لتقريب الإدارة من المواطنين.</p>
                <br>
                <p><strong>الهيكل الإداري للجماعة:</strong></p>
                <ul class="modal-list">
                    <li><strong>المديرية العامة للمصالح:</strong> تسهر على التنسيق الإداري العام وتنزيل قرارات الرئاسة والمجلس.</li>
                    <li><strong>قسم التعمير والممتلكات:</strong> يدبر التوسع العمراني للمدينة والتراخيص الهندسية والممتلكات العامة.</li>
                    <li><strong>قسم الشؤون المالية والميزانية:</strong> يتولى تدبير الموارد المالية والتحصيل الضريبي المحلي.</li>
                    <li><strong>قسم الأشغال والصيانة:</strong> يشرف على البنية التحتية، تعبيد الطرق، صيانة شبكات الإنارة والحدائق.</li>
                </ul>
            </div>
        `
    },
    health: {
        title: 'شؤون حفظ الصحة والوقاية',
        content: `
            <div class="modal-text">
                <p>يدير المكتب الجماعي لحفظ الصحة ببيوكرى جميع العمليات الطبية والوقائية لضمان صحة وسلامة الساكنة.</p>
                <br>
                <div class="modal-tabs">
                    <button class="modal-tab active" onclick="switchModalTab(event, 'health-req')">شواهد التفتيش الصحي</button>
                    <button class="modal-tab" onclick="switchModalTab(event, 'health-vacc')">الوقاية ومحاربة الأوبئة</button>
                </div>
                <div id="health-req" class="modal-tab-content active">
                    <p>للحصول على شهادة السلامة الصحية للمحلات التجارية والمطاعم:</p>
                    <ul class="modal-list">
                        <li>تقديم طلب باسم رئيس الجماعة.</li>
                        <li>نسخة من بطاقة التعريف ورخصة النشاط الاقتصادي.</li>
                        <li>ملف صحي للمستخدمين بالمحل.</li>
                        <li>معاينة ميدانية من طرف اللجنة الصحية للجماعة للتأكد من شروط النظافة.</li>
                    </ul>
                </div>
                <div id="health-vacc" class="modal-tab-content">
                    <p>تقدم المصلحة الخدمات الوقائية التالية:</p>
                    <ul class="modal-list">
                        <li>عمليات التعقيم والتطهير في الأماكن العامة ومحاربة نواقل الأمراض (الحشرات والقوارض).</li>
                        <li>تلقيح المواطنين المسافرين والوقاية من السعار ومراقبة جودة المياه الصالحة للشرب والمواد الغذائية.</li>
                    </ul>
                </div>
            </div>
        `
    },
    culture: {
        title: 'الشؤون الثقافية وتدبير الفضاءات',
        content: `
            <div class="modal-text">
                <p>تشرف جماعة بيوكرى على شبكة واسعة من الفضاءات الثقافية لتنشيط الحياة الفنية بالمدينة.</p>
                <br>
                <p><strong>كيفية حجز قاعة أو فضاء ثقافي لتنظيم فعالية:</strong></p>
                <ul class="modal-list">
                    <li>توجيه طلب كتابي باسم رئيس المجلس الجماعي قبل 15 يوماً على الأقل من الفعالية.</li>
                    <li>إرفاق الطلب ببرنامج النشاط والملف القانوني للجمعية أو الجهة المنظمة.</li>
                    <li>بعد الموافقة، يتم توقيع التزام باحترام ضوابط الفضاء والمحافظة على تجهيزاته.</li>
                </ul>
            </div>
        `
    },
    social: {
        title: 'الشؤون الاجتماعية ودعم المجتمع المدني',
        content: `
            <div class="modal-text">
                <p>تقدم الجماعة برامج دعم سنوية للجمعيات النشيطة في المجالات الاجتماعية، الرعاية، ودعم الفئات الهشة بالمدينة.</p>
                <br>
                <p><strong>ملف دعم الجمعيات السنوي:</strong></p>
                <ul class="modal-list">
                    <li>طلب الدعم موجه للرئاسة وملء الاستمارة المخصصة.</li>
                    <li>الملف القانوني المحدث للجمعية (الوصل النهائي، القانون الأساسي، لائحة المكتب).</li>
                    <li>التقرير الأدبي والمالي للسنة الفارطة مصادق عليهما.</li>
                    <li>المخطط السنوي لمشاريع الجمعية والميزانية المتوقعة.</li>
                </ul>
            </div>
        `
    },
    economic: {
        title: 'الشؤون الاقتصادية والتراخيص والشرطة الإدارية',
        content: `
            <div class="modal-text">
                <p>تختص مصلحة الشؤون الاقتصادية بدراسة طلبات الترخيص بفتح المحلات التجارية والخدماتية والصناعية ومراقبتها عبر مصلحة الشرطة الإدارية.</p>
                <br>
                <div class="modal-tabs">
                    <button class="modal-tab active" onclick="switchModalTab(event, 'econ-lic')">رخص الأنشطة الاقتصادية</button>
                    <button class="modal-tab" onclick="switchModalTab(event, 'econ-occup')">الاحتلال المؤقت للملك العام</button>
                </div>
                <div id="econ-lic" class="modal-tab-content active">
                    <p>تقدم الطلبات حصراً عبر منصة <strong>Rokhas.ma</strong> وتشمل الوثائق:</p>
                    <ul class="modal-list">
                        <li>تصميم المحل وعقد الكراء أو الملكية.</li>
                        <li>بطاقة التعريف وتصميم التهيئة للنشاط المقترح.</li>
                        <li>موافقة مصالح الوقاية المدنية والمكتب الصحي عند الحاجة.</li>
                    </ul>
                </div>
                <div id="econ-occup" class="modal-tab-content">
                    <p>للاحتلال المؤقت لملك الجماعة (وضع طاولات المقاهي، اللوحات الإشهارية، واجهات المحلات):</p>
                    <ul class="modal-list">
                        <li>تقديم طلب يحدد المساحة والغرض المطلوبة.</li>
                        <li>أداء الرسوم والواجبات المحددة في القرار الجبائي الجماعي بعد الترخيص الفعلي.</li>
                    </ul>
                </div>
            </div>
        `
    },
    sports: {
        title: 'الشؤون الرياضية واستغلال الملاعب',
        content: `
            <div class="modal-text">
                <p>تدير الجماعة الملاعب الرياضية الحضرية وملاعب القرب الموزعة عبر أحياء بيوكرى لتشجيع الممارسة الرياضية للشباب والنوادي المحلية.</p>
                <br>
                <p><strong>شروط حجز واستغلال ملاعب القرب:</strong></p>
                <ul class="modal-list">
                    <li>حجز الحصص الزمنية يتم عبر البوابة الرقمية أو لدى دور الحي التابع لها الملعب.</li>
                    <li>الاستغلال مجاني لفائدة أطفال وشباب الأحياء السكنية المجاورة ضمن فترات محددة.</li>
                    <li>تخصص فترات خاصة للجمعيات الرياضية والفرق المنخرطة في إطار اتفاقيات شراكة لتنظيم تدريباتها.</li>
                </ul>
            </div>
        `
    },
    civil: {
        title: 'مكتب الحالة المدنية والوثائق الشخصية',
        content: `
            <div class="modal-text">
                <p>يعتبر مكتب الحالة المدنية من أكثر المرافق حيوية وتواصلاً مع المواطنين لتوثيق الوقائع المدنية.</p>
                <br>
                <div class="modal-tabs">
                    <button class="modal-tab active" onclick="switchModalTab(event, 'civ-birth')">تسجيل الولادات</button>
                    <button class="modal-tab" onclick="switchModalTab(event, 'civ-cert')">شواهد الحالة المدنية</button>
                </div>
                <div id="civ-birth" class="modal-tab-content active">
                    <p>يجب التصريح بالولادة في أجل أقصاه 30 يوماً من تاريخ الوضع مصحوباً بالوثائق التالية:</p>
                    <ul class="modal-list">
                        <li>شهادة الولادة الطبية الصادرة عن المشفى أو المولدة.</li>
                        <li>الدفتر العائلي أو نسخة من عقد الزواج للوالدين.</li>
                        <li>نسخة من بطاقتي التعريف الوطنية للزوجين.</li>
                    </ul>
                </div>
                <div id="civ-cert" class="modal-tab-content">
                    <p>للحصول على نسخ عقود الازدياد بشكل فوري، يمكنكم تقديم الطلب إلكترونياً عبر <strong>Wathyqa.ma</strong> أو سحبها مباشرة من أي مقاطعة إدارية على الصعيد الوطني بفضل الربط الشبكي الموحد.</p>
                </div>
            </div>
        `
    },
    park: {
        title: 'فيديو: تهيئة المنتزه الحضري لبيوكرى',
        content: `
            <div class="modal-text">
                <p>شاهد تفاصيل افتتاح وتهيئة المنتزه الحضري لبيوكرى لخدمة الساكنة وتوفير فضاءات الترفيه والألعاب.</p>
                <br>
                <div class="modal-video-container">
                    <img src="assets/video_park.png" alt="Video Placeholder" class="modal-video-placeholder">
                    <div class="modal-video-ui">
                        <button class="btn btn-gold btn-play-sim" style="padding: 6px 12px; font-size: 0.8rem;" onclick="simulateVideoPlay(this)">تشغيل الفيديو ▷</button>
                        <div class="modal-video-bar">
                            <div class="modal-video-progress" id="vid-prog-park"></div>
                        </div>
                        <span style="font-size: 0.8rem;" id="vid-time-park">00:00 / 02:45</span>
                    </div>
                </div>
            </div>
        `
    },
    hall: {
        title: 'فيديو: القاعة المغطاة الرياضية ببيوكرى',
        content: `
            <div class="modal-text">
                <p>فيديو يعرض أشغال تهيئة وإعادة هيكلة القاعة المغطاة ببيوكرى وتجهيزها بأحدث الأرضيات والمدرجات لاستقبال المباريات الوطنية والرياضية.</p>
                <br>
                <div class="modal-video-container">
                    <img src="assets/video_hall.png" alt="Video Placeholder" class="modal-video-placeholder">
                    <div class="modal-video-ui">
                        <button class="btn btn-gold btn-play-sim" style="padding: 6px 12px; font-size: 0.8rem;" onclick="simulateVideoPlay(this)">تشغيل الفيديو ▷</button>
                        <div class="modal-video-bar">
                            <div class="modal-video-progress" id="vid-prog-hall"></div>
                        </div>
                        <span style="font-size: 0.8rem;" id="vid-time-hall">00:00 / 01:50</span>
                    </div>
                </div>
            </div>
        `
    },
    bus: {
        title: 'فيديو: إطلاق مشاريع النقل والتأهيل الحضري ببيوكرى',
        content: `
            <div class="modal-text">
                <p>تغطية إعلامية خاصة بمناسبة بدء تنفيذ التحديثات والمشروعات الصديقة للبيئة بمركز وجماعة بيوكرى.</p>
                <br>
                <div class="modal-video-container">
                    <img src="assets/video_bus.png" alt="Video Placeholder" class="modal-video-placeholder">
                    <div class="modal-video-ui">
                        <button class="btn btn-gold btn-play-sim" style="padding: 6px 12px; font-size: 0.8rem;" onclick="simulateVideoPlay(this)">تشغيل الفيديو ▷</button>
                        <div class="modal-video-bar">
                            <div class="modal-video-progress" id="vid-prog-bus"></div>
                        </div>
                        <span style="font-size: 0.8rem;" id="vid-time-bus">00:00 / 03:15</span>
                    </div>
                </div>
            </div>
        `
    }
};

// Main dispatcher function for modals
function openDynamicModal(dataKey) {
    if (!window.agadirDB) {
        // Fallback if db.js not loaded
        const staticData = staticModalData[dataKey];
        if (staticData) {
            modalBody.innerHTML = `<h3 class="modal-title">${staticData.title}</h3>${staticData.content}`;
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        return;
    }
    
    let title = "";
    let content = "";
    
    if (dataKey.startsWith('article-')) {
        const id = parseInt(dataKey.replace('article-', ''));
        const news = window.agadirDB.getNews();
        const newsItem = news.find(n => n.id === id);
        if (newsItem) {
            title = newsItem.title;
            content = `
                <div class="modal-text">
                    <p style="color: var(--accent-color); font-weight: 700; font-size: 0.85rem;">تاريخ النشر: ${newsItem.date}</p>
                    <br>
                    <p style="white-space: pre-wrap; font-size: 0.95rem;">${newsItem.content}</p>
                </div>
            `;
        }
    } else if (dataKey.startsWith('event-')) {
        const id = dataKey.replace('event-', '');
        const events = window.agadirDB.getEvents();
        const eventItem = events.find(e => e.id === id);
        if (eventItem) {
            title = eventItem.title;
            content = `
                <div class="modal-text">
                    <p style="color: var(--accent-color); font-weight: 700; font-size: 0.85rem;">النشاط المدرج - تاريخ اليوم: ${eventItem.date}</p>
                    <br>
                    <img src="${eventItem.image}" alt="Event Photo" style="border-radius: 8px; margin-bottom: 20px; box-shadow: var(--box-shadow); width: 100%;">
                    <p style="font-size: 0.95rem;">ينعقد هذا النشاط في سياق تنزيل محاور برنامج عمل الجماعة الترابية لبيوكرى وتعزيز التواصل المباشر مع المجتمع المدني والفاعلين.</p>
                </div>
            `;
        }
    } else {
        // Check if project key
        const projects = window.agadirDB.getProjects();
        const proj = projects.find(p => p.id === dataKey);
        if (proj) {
            title = `مشروع تهيئة: ${proj.title}`;
            content = `
                <div class="modal-text">
                    <p style="white-space: pre-wrap; font-size: 0.95rem; margin-bottom: 20px;">${proj.details}</p>
                    <div style="background-color: var(--primary-light); padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: var(--box-shadow);">
                        <p><strong>حالة المشروع:</strong> ${proj.status}</p>
                        <p><strong>الميزانية التقديرية:</strong> ${proj.budget}</p>
                        <p style="margin-top: 10px;"><strong>نسبة الإنجاز الفعلية: <span style="color: var(--primary-color);">${proj.progress}%</span></strong></p>
                        <div style="width: 100%; height: 8px; background-color: #dee2e6; border-radius: 4px; margin-top: 8px; overflow: hidden;">
                            <div style="width: ${proj.progress}%; height: 100%; background-color: var(--accent-color); border-radius: 4px;"></div>
                        </div>
                    </div>
                </div>
            `;
        } else if (dataKey.startsWith('video-')) {
            const id = dataKey.replace('video-', '');
            const videos = window.agadirDB.getVideos();
            const video = videos.find(v => v.id === id);
            if (video) {
                title = `فيديو: ${video.title}`;
                content = `
                    <div class="modal-text">
                        <p>فيديو يعرض المستجدات وأعمال التنمية الحضرية لبلدية بيوكرى.</p>
                        <br>
                        <div class="modal-video-container">
                            <img src="${video.thumbnail}" alt="Video Placeholder" class="modal-video-placeholder">
                            <div class="modal-video-ui">
                                <button class="btn btn-gold btn-play-sim" style="padding: 6px 12px; font-size: 0.8rem;" onclick="simulateVideoPlay(this)">تشغيل الفيديو ▷</button>
                                <div class="modal-video-bar">
                                    <div class="modal-video-progress" id="vid-prog-${video.id}"></div>
                                </div>
                                <span style="font-size: 0.8rem;" id="vid-time-${video.id}">00:00 / ${video.duration}</span>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                const staticData = staticModalData[dataKey];
                if (staticData) {
                    title = staticData.title;
                    content = staticData.content;
                }
            }
        } else {
            // Fallback to static contents
            const staticData = staticModalData[dataKey];
            if (staticData) {
                title = staticData.title;
                content = staticData.content;
            }
        }
    }
    
    if (title && content) {
        modalBody.innerHTML = `
            <h3 class="modal-title">${title}</h3>
            ${content}
        `;
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeDynamicModal() {
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    if (videoSimInterval) {
        clearInterval(videoSimInterval);
        videoSimInterval = null;
    }
}

if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeDynamicModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeDynamicModal();
    });
}

// Bind clicks globally
document.querySelectorAll('[data-modal]').forEach(element => {
    element.addEventListener('click', () => {
        const key = element.getAttribute('data-modal');
        openDynamicModal(key);
    });
});

document.querySelectorAll('[data-proc]').forEach(element => {
    element.addEventListener('click', () => {
        const key = element.getAttribute('data-proc');
        openDynamicModal(key);
    });
});

document.querySelectorAll('[data-project]').forEach(element => {
    element.addEventListener('click', () => {
        const key = element.getAttribute('data-project');
        openDynamicModal(key);
    });
});

document.querySelectorAll('[data-video]').forEach(element => {
    element.addEventListener('click', () => {
        const key = element.getAttribute('data-video');
        openDynamicModal(key);
    });
});

// --- SUB-TABS INTERACTIVE CONTROLLER (Inside Modal) ---
window.switchModalTab = function(event, tabId) {
    const modalContent = event.target.closest('.modal-text');
    
    modalContent.querySelectorAll('.modal-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    modalContent.querySelectorAll('.modal-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    event.target.classList.add('active');
    modalContent.querySelector('#' + tabId).classList.add('active');
};

// --- SIMULATED VIDEO PLAYER TIMER ---
let videoSimInterval = null;
window.simulateVideoPlay = function(button) {
    if (button.textContent.includes('إيقاف')) {
        button.textContent = 'تشغيل الفيديو ▷';
        if (videoSimInterval) {
            clearInterval(videoSimInterval);
            videoSimInterval = null;
        }
        return;
    }
    
    button.textContent = 'إيقاف الفيديو ❚❚';
    const progressDiv = button.nextElementSibling.querySelector('.modal-video-progress');
    const timeSpan = button.nextElementSibling.nextElementSibling;
    
    let timeStr = timeSpan.textContent.split(' / ')[1];
    let durationParts = timeStr.split(':');
    let totalSeconds = parseInt(durationParts[0]) * 60 + parseInt(durationParts[1]);
    let currentSeconds = 0;
    
    let currentWidth = parseFloat(progressDiv.style.width) || 0;
    if (currentWidth > 0 && currentWidth < 100) {
        currentSeconds = Math.floor((currentWidth / 100) * totalSeconds);
    }
    
    videoSimInterval = setInterval(() => {
        currentSeconds++;
        if (currentSeconds >= totalSeconds) {
            currentSeconds = 0;
            progressDiv.style.width = '0%';
            button.textContent = 'تشغيل الفيديو ▷';
            clearInterval(videoSimInterval);
            videoSimInterval = null;
        } else {
            let percent = (currentSeconds / totalSeconds) * 100;
            progressDiv.style.width = percent + '%';
        }
        
        let displayMin = Math.floor(currentSeconds / 60).toString().padStart(2, '0');
        let displaySec = (currentSeconds % 60).toString().padStart(2, '0');
        timeSpan.textContent = `${displayMin}:${displaySec} / ${timeStr}`;
    }, 1000);
};

// Fallbacks for buttons without defined actions
const moreNewsBtn = document.getElementById('moreNewsBtn');
if (moreNewsBtn) {
    moreNewsBtn.addEventListener('click', () => {
        alert('تنبيه: سيتم توجيهكم إلى صفحة أرشيف المستجدات الكاملة للجماعة.');
    });
    moreNewsBtn.style.cursor = 'pointer';
}

const moreMediaBtn = document.getElementById('moreMediaBtn');
if (moreMediaBtn) {
    moreMediaBtn.addEventListener('click', () => {
        alert('تنبيه: سيتم توجيهكم إلى معرض الوسائط الإعلامية الكامل لمدينة بيوكرى.');
    });
    moreMediaBtn.style.cursor = 'pointer';
}

// --- VISUAL EXCELLENCE & CREATIVE EFFECT SCRIPTS ---

// 1. Scroll progress bar indicator & Sticky header shrink
window.addEventListener('scroll', () => {
    const scrollBar = document.getElementById('scrollBar');
    if (scrollBar) {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollBar.style.width = scrolled + '%';
    }
    
    const header = document.getElementById('mainHeader');
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

// 2. Viewport Reveal Observers
document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.reveal, .news-item, .event-card, .pub-item, .urban-card, .info-card');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // If the stats counter block is entered, trigger count up
                if (entry.target.id === 'stats-section') {
                    animateStatsCounters();
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    
    revealElements.forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });
});

// 3. Stats Increment Counters Animation
function animateStatsCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const increment = target / 80;
        
        let current = 0;
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.ceil(current).toLocaleString();
                setTimeout(updateCounter, 15);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };
        updateCounter();
    });
}

// 4. Quick Theme Switcher from homepage top bar
window.applyQuickTheme = function(themeKey) {
    const themePresets = {
        classic: { primary: '#0d5ea6', accent: '#c69c55', dark: '#1e293b', text: '#334155' },
        eco: { primary: '#15803d', accent: '#86efac', dark: '#0f172a', text: '#334155' },
        royal: { primary: '#991b1b', accent: '#fcd34d', dark: '#111827', text: '#334155' },
        modern: { primary: '#1f2937', accent: '#9ca3af', dark: '#111827', text: '#334155' }
    };
    
    const p = themePresets[themeKey];
    if (!p || !window.agadirDB) return;
    
    const currentBranding = window.agadirDB.getBranding();
    currentBranding.primaryColor = p.primary;
    currentBranding.accentColor = p.accent;
    currentBranding.darkColor = p.dark;
    currentBranding.textColor = p.text;
    
    window.agadirDB.saveBranding(currentBranding);
    applyDynamicBranding();
    showQuickToast('تم تغيير مظهر الموقع بنجاح!');
};

// 5. Live Search filter mechanism
window.handleHeroLiveSearch = function() {
    const query = document.getElementById('heroSearchInput').value.toLowerCase().trim();
    
    // Filter news items
    const newsItems = document.querySelectorAll('.news-item');
    newsItems.forEach(item => {
        const title = item.querySelector('.news-title').textContent.toLowerCase();
        const excerpt = item.querySelector('.news-excerpt').textContent.toLowerCase();
        if (title.includes(query) || excerpt.includes(query)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });

    // Filter event cards
    const eventCards = document.querySelectorAll('.event-card');
    eventCards.forEach(card => {
        const title = card.querySelector('.event-title-text').textContent.toLowerCase();
        if (title.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
};

// Quick notification feedback
function showQuickToast(msg) {
    let t = document.getElementById('toastNotify');
    if (!t) {
        t = document.createElement('div');
        t.id = 'toastNotify';
        t.className = 'toast-notify';
        t.innerHTML = `<span>✓</span><span id="toastMessage">${msg}</span>`;
        document.body.appendChild(t);
    }
    const msgSpan = t.querySelector('#toastMessage') || t.lastChild;
    msgSpan.textContent = msg;
    t.classList.add('active');
    setTimeout(() => t.classList.remove('active'), 3000);
}

// 6. Citizen Complaint Submission & Ticket Tracking Functions
window.openComplaintModal = function() {
    const modal = document.getElementById('complaintModalOverlay');
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
};

window.closeComplaintModal = function() {
    const modal = document.getElementById('complaintModalOverlay');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
};

window.submitCitizenComplaint = function(e) {
    e.preventDefault();
    if (!window.agadirDB) return;

    const data = {
        name: document.getElementById('cmpName').value,
        phone: document.getElementById('cmpPhone').value,
        email: document.getElementById('cmpEmail').value,
        category: document.getElementById('cmpCategory').value,
        subject: document.getElementById('cmpSubject').value,
        details: document.getElementById('cmpDetails').value
    };

    const created = window.agadirDB.addComplaint(data);
    window.closeComplaintModal();

    alert(`🎉 تم تسليم طلبكم بنجاح!\n\nرقم التتبع الخاص بكم هو: ${created.id}\nيرجى الاحتفاظ بهذا الرقم لمتابعة الشكاية.`);
    showQuickToast(`تم تسليم الشكاية برقم تتبع: ${created.id}`);
};

window.openTicketTrackModal = function() {
    const modal = document.getElementById('ticketTrackOverlay');
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
};

window.closeTicketTrackModal = function() {
    const modal = document.getElementById('ticketTrackOverlay');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
};

window.handleTrackTicketSearch = function() {
    const ticketId = document.getElementById('trackTicketInput').value;
    const resBox = document.getElementById('ticketResultDisplay');
    if (!ticketId || !resBox || !window.agadirDB) return;

    const complaints = window.agadirDB.getComplaints();
    const item = complaints.find(c => c.id.toUpperCase() === ticketId.trim().toUpperCase());

    resBox.style.display = 'block';
    if (item) {
        resBox.innerHTML = `
            <div style="font-weight: 700; color: var(--primary-color); margin-bottom: 6px;">رقم التتبع: ${item.id}</div>
            <div style="font-size: 0.9rem; margin-bottom: 4px;"><strong>الموضوع:</strong> ${item.subject}</div>
            <div style="font-size: 0.9rem; margin-bottom: 6px;"><strong>الحالة الحالية:</strong> <span class="badge" style="background: var(--primary-light); color: var(--primary-color);">${item.status}</span></div>
            <div style="font-size: 0.85rem; background: white; padding: 10px; border-radius: 6px; border-right: 3px solid var(--accent-color);">
                <strong>رد الجماعة الإداري:</strong><br>${item.response || 'طلبكم قيد الدراسة من طرف المصلحة المختصة.'}
            </div>
        `;
    } else {
        resBox.innerHTML = `<div style="color: #ef4444; text-align: center;">لم يتم العثور على أي طلب برقم التتبع (${ticketId}). تأكد من إدخال الرقم الصحيح.</div>`;
    }
};

// 7. Accessibility Controls (A11y Toolbar)
let currentFontSizeOffset = 0;
window.toggleA11yMenu = function() {
    const menu = document.getElementById('a11yMenu');
    if (menu) menu.classList.toggle('active');
};

window.changeFontSize = function(delta) {
    currentFontSizeOffset += delta;
    if (currentFontSizeOffset > 4) currentFontSizeOffset = 4;
    if (currentFontSizeOffset < -2) currentFontSizeOffset = -2;
    document.documentElement.style.fontSize = (16 + currentFontSizeOffset * 1.5) + 'px';
    showQuickToast(`حجم الخط الحالي: ${16 + currentFontSizeOffset * 1.5}px`);
};

window.resetFontSize = function() {
    currentFontSizeOffset = 0;
    document.documentElement.style.fontSize = '16px';
    showQuickToast('تمت إعادة الخط للوضع الافتراضي.');
};

window.toggleHighContrast = function() {
    document.body.classList.toggle('high-contrast-mode');
    showQuickToast('تم تغيير وضع التباين العالي.');
};

window.toggleDarkMode = function() {
    document.body.classList.toggle('dark-mode-theme');
    showQuickToast('تم تغيير الوضع الداكن.');
};

