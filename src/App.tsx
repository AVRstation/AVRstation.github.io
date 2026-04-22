import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SnakeGame } from './components/SnakeGame';
import { PongGame } from './components/PongGame';
import { SpaceInvadersGame } from './components/SpaceInvadersGame';
import { sounds } from './lib/sounds';
import { ProjectCard } from './components/ProjectCard';
import { SlotMachine } from './components/SlotMachine';
import { TreasureChest } from './components/TreasureChest';
import { AchievementSystem, AchievementSystemHandle } from './components/AchievementSystem';
import { 
  Briefcase, 
  Gamepad2, 
  Layers, 
  Send, 
  Mail, 
  ExternalLink, 
  Linkedin,
  Disc,
  Globe,
  Sun,
  Moon,
  Power,
  Settings,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Languages
} from 'lucide-react';

type Language = 'ru' | 'en' | 'cn' | 'hi' | 'es' | 'ar' | 'fr';

const TRANSLATIONS: Record<Language, any> = {
  ru: {
    first_name: "АЛЕКСАНДР",
    last_name: "КОПАНЕВ",
    role: "Senior гейм дизайнер • Product Owner • Креативный продюсер",
    status: "Связаться",
    experience_title: "ОПЫТ",
    experience: [
      { highlight: "27+ лет", text: "глубокой насмотренности и экспертизы в игровом домене" },
      { highlight: "12+ лет", text: "в индустрии VR/AR технологий" },
      { highlight: "12+ лет", text: "в геймификации и проектировании игровых систем" },
      { highlight: "9+ лет", text: "стратегического управления IT-продуктами" },
      { highlight: "8+ лет", text: "руководства командами разработки и креативного продакшена" },
      { highlight: "5+ лет", text: "запуска и интеграции решений на базе Искусственного Интеллекта" }
    ],
    projects_title: "Проекты и Кейсы",
    contact_cta_title: "Готовы к следующему технологическому рывку?",
    contact_cta_text: "Давайте обсудим ваш проект, будь то создание метавселенной, сложной сетевой механики или образовательного VR-симулятора.",
    skills: {
      producer: "Продюсер",
      gamedev: "Геймдизайнер",
      po: "Product Owner"
    },
    snake_rules: "Змейка следует за курсором. Ешь яблоки и расти. Не врезайся в себя и ИИ-противника!",
    pong_rules: "Pong: Управляйте ракеткой мышью. Отбивайте мяч и не дайте ИИ забить гол!",
    space_rules: "Invaders: Управляйте кораблем мышью. Уничтожьте пришельцев, прежде чем они доберутся до вас!",
    snake_best: "Рекорд: 314",
    game_snake: "Змейка",
    game_pong: "Pong",
    game_space: "Invaders",
    contributions_label: "ЧТО СДЕЛАНО"
  },
  en: {
    first_name: "Aleksandr",
    last_name: "Kopanev",
    role: "Senior Game Designer • Product Owner • Creative Producer",
    status: "Contact",
    experience_title: "EXPERIENCE",
    experience: [
      { highlight: "27+ years", text: "of deep gaming domain expertise and analysis" },
      { highlight: "12+ years", text: "pioneering in VR/AR Industry" },
      { highlight: "12+ years", text: "in gamification and game systems design" },
      { highlight: "9+ years", text: "of strategic product management" },
      { highlight: "8+ years", text: "leading development & creative clusters" },
      { highlight: "5+ years", text: "shipping and integrating AI-driven solutions" }
    ],
    projects_title: "Projects & Cases",
    contact_cta_title: "Ready for the next tech leap?",
    contact_cta_text: "Let's discuss your project, whether it's a metaverse, complex network mechanics, or an educational VR simulator.",
    skills: {
      producer: "Producer",
      gamedev: "Game Designer",
      po: "Product Owner"
    },
    snake_rules: "Snake follows cursor. Eat apples to grow. Avoid hitting yourself or the AI opponent!",
    pong_rules: "Pong: Use mouse to move paddle. Hit the ball back and don't let AI score!",
    space_rules: "Invaders: Control ship with mouse. Destroy aliens before they reach you!",
    snake_best: "Best score: 314",
    game_snake: "Snake",
    game_pong: "Pong",
    game_space: "Invaders",
    contributions_label: "KEY CONTRIBUTIONS"
  },
  cn: {
    first_name: "亚历山大",
    last_name: "科帕内夫",
    role: "资深游戏设计师 • 产品负责人 • 创意制片人",
    status: "联系我",
    experience_title: "经验",
    experience: [
      { highlight: "27+ 年", text: "深厚的游戏领域专业知识和分析能力" },
      { highlight: "12+ 年", text: "虚拟现实/增强现实 (VR/AR) 行业先驱" },
      { highlight: "12+ 年", text: "游戏化和游戏系统设计专家" },
      { highlight: "9+ 年", text: "战略产品管理经验" },
      { highlight: "8+ 年", text: "领导开发和创意团队" },
      { highlight: "5+ 年", text: "发布和集成人工智能驱动的解决方案" }
    ],
    projects_title: "项目与案例",
    contact_cta_title: "准备好迎接下一次技术飞跃了吗？",
    contact_cta_text: "让我们讨论您的项目，无论是元宇宙、复杂的网络机制，还是教育性 VR 模拟器。",
    skills: {
      producer: "制片人",
      gamedev: "游戏设计师",
      po: "产品负责人"
    },
    snake_rules: "蛇跟随光标。吃苹果生长。避免撞到自己或 AI 对手！",
    pong_rules: "Pong：使用鼠标移动球拍。击回球，不要让 AI 進球！",
    space_rules: "Invaders：使用鼠标移动飞船。在敌人到达之前摧毁他们！",
    snake_best: "最高纪录：314",
    game_snake: "贪吃蛇",
    game_pong: "乒乓球",
    game_space: "太空入侵者",
    contributions_label: "主要贡献"
  },
  hi: {
    first_name: "अलेक्सांद्र",
    last_name: "कोपानेव",
    role: "सीनियर गेम डिजाइनर • प्रोडक्ट ओनर • क्रिएटिव प्रोड्यूसर",
    status: "संपर्क करें",
    experience_title: "अनुभव",
    experience: [
      { highlight: "27+ वर्ष", text: "गहन गेमिंग डोमेन विशेषज्ञता और विश्लेषण" },
      { highlight: "12+ वर्ष", text: "VR/AR उद्योग में अग्रणी" },
      { highlight: "12+ वर्ष", text: "गेमीफिकेशन और गेम सिस्टम डिजाइन में" },
      { highlight: "9+ वर्ष", text: "रणनीतिक उत्पाद प्रबंधन के" },
      { highlight: "8+ वर्ष", text: "विकास और रचनात्मक समूहों का नेतृत्व" },
      { highlight: "5+ वर्ष", text: "AI-संचालित समाधानों की शिपिंग और एकीकरण" }
    ],
    projects_title: "परियोजनाएं और मामले",
    contact_cta_title: "अगली तकनीक छलांग के लिए तैयार हैं?",
    contact_cta_text: "आइए आपकी परियोजना पर चर्चा करें, चाहे वह मेटावर्स हो, जटिल नेटवर्क यांत्रिकी हो, या शैक्षिक VR सिम्युलेटर हो।",
    skills: {
      producer: "निर्माता",
      gamedev: "गेम डिजाइनर",
      po: "प्रोडक्ट ओनर"
    },
    snake_rules: "साँप कर्सर का अनुसरण करता है। बढ़ने के लिए सेब खाएं। खुद को या AI प्रतिद्वंद्वी को मारने से बचें!",
    pong_rules: "पोंग: पैडल चलाने के लिए माउस का उपयोग करें। गेंद को वापस मारें और AI को स्कोर न करने दें!",
    space_rules: "इनवेडर्स: माउस से जहाज को नियंत्रित करें। एलियंस के आप तक पहुँचने से पहले उन्हें नष्ट कर दें!",
    snake_best: "सर्वश्रेष्ठ स्कोर: 314",
    game_snake: "साँप",
    game_pong: "पोंग",
    game_space: "इनवेडर्स",
    contributions_label: "प्रमुख योगदान"
  },
  es: {
    first_name: "Aleksandr",
    last_name: "Kopanev",
    role: "Diseñador Senior de Juegos • Product Owner • Productor Creativo",
    status: "Contacto",
    experience_title: "EXPERIENCIA",
    experience: [
      { highlight: "27+ años", text: "de profunda experiencia y análisis en el dominio de los juegos" },
      { highlight: "12+ años", text: "pionero en la industria VR/AR" },
      { highlight: "12+ años", text: "en gamificación y diseño de sistemas de juego" },
      { highlight: "9+ años", text: "de gestión estratégica de productos" },
      { highlight: "8+ años", text: "liderando grupos creativos y de desarrollo" },
      { highlight: "5+ años", text: "entregando e integrando soluciones impulsadas por AI" }
    ],
    projects_title: "Proyectos y Casos",
    contact_cta_title: "¿Listo para el próximo salto tecnológico?",
    contact_cta_text: "Hablemos de tu proyecto, ya sea un metaverso, mecánicas de red complejas o un simulador de VR educativo.",
    skills: {
      producer: "Productor",
      gamedev: "Diseñador de Juegos",
      po: "Product Owner"
    },
    snake_rules: "La serpiente sigue al cursor. Come manzanas para crecer. ¡Evita chocar contigo mismo o con el oponente de AI!",
    pong_rules: "Pong: Usa el ratón para mover la paleta. ¡Golpea la bola y no dejes que la AI anote!",
    space_rules: "Invaders: Controla la nave con el ratón. ¡Destruye a los alienígenas antes de que te alcancen!",
    snake_best: "Mejor puntuación: 314",
    game_snake: "Serpiente",
    game_pong: "Pong",
    game_space: "Invaders",
    contributions_label: "CONTRIBUCIONES CLAVE"
  },
  ar: {
    first_name: "ألكسندر",
    last_name: "كوبانيف",
    role: "مصمم ألعاب أول • صاحب منتج • منتج إبداعي",
    status: "اتصال",
    experience_title: "الخبرة",
    experience: [
      { highlight: "27+ سنة", text: "من الخبرة العميقة والتحليل في مجال الألعاب" },
      { highlight: "12+ سنة", text: "رائد في صناعة الواقع الافتراضي والمعزز" },
      { highlight: "12+ سنة", text: "في التلعيب وتصميم أنظمة الألعاب" },
      { highlight: "9+ سنوات", text: "من إدارة المنتجات الاستراتيجية" },
      { highlight: "8+ سنوات", text: "قيادة فرق التطوير والإنتاج الإبداعي" },
      { highlight: "5+ سنوات", text: "شحن ودمج الحلول المدعومة بالذكاء الاصطناعي" }
    ],
    projects_title: "المشاريع والحالات",
    contact_cta_title: "هل أنت مستعد للطفرة التكنولوجية التالية؟",
    contact_cta_text: "لنناقش مشروعك، سواء كان ميتافيرس، ميكانيكا شبكات معقدة، أو محاكي واقع افتراضي تعليمي.",
    skills: {
      producer: "منتج",
      gamedev: "مصمم ألعاب",
      po: "صاحب المنتج"
    },
    snake_rules: "الثعبان يتبع المؤشر. كل التفاح لتكبر. تجنب الاصطدام بنفسك أو بخصم الذكاء الاصطناعي!",
    pong_rules: "بونج: استخدم الماوس لتحريك المضرب. اضرب الكرة ولا تدع الذكاء الاصطناعي يسجل!",
    space_rules: "الغزاة: تحكم في السفينة بالماوس. دمر الفضائيين قبل أن يصلوا إليك!",
    snake_best: "أفضل نتيجة: 314",
    game_snake: "ثعبان",
    game_pong: "بونج",
    game_space: "غزاة",
    contributions_label: "المساهمات الرئيسية"
  },
  fr: {
    first_name: "Aleksandr",
    last_name: "Kopanev",
    role: "Designer de Jeux Senior • Product Owner • Producteur Créatif",
    status: "Contact",
    experience_title: "EXPÉRIENCE",
    experience: [
      { highlight: "27+ ans", text: "d'expertise et d'analyse approfondies du domaine du jeu" },
      { highlight: "12+ ans", text: "pionnier de l'industrie VR/AR" },
      { highlight: "12+ ans", text: "dans la gamification et la conception de systèmes de jeu" },
      { highlight: "9+ ans", text: "de gestion stratégique de produits" },
      { highlight: "8+ ans", text: "direction de pôles de développement & création" },
      { highlight: "5+ ans", text: "déploiement et intégration de solutions IA" }
    ],
    projects_title: "Projets & Études de cas",
    contact_cta_title: "Prêt pour le prochain bond technologique ?",
    contact_cta_text: "Discutons de votre projet, qu'il s'agisse d'un métavers, de mécaniques réseau complexes ou d'un simulateur VR éducatif.",
    skills: {
      producer: "Producteur",
      gamedev: "Designer de Jeux",
      po: "Product Owner"
    },
    snake_rules: "Le serpent suit le curseur. Mangez des pommes pour grandir. Évitez de vous heurter ou de heurter l'IA !",
    pong_rules: "Pong : Utilisez la souris pour bouger la raquette. Renvoyez la balle et ne laissez pas l'IA marquer !",
    space_rules: "Invaders : Contrôlez le vaisseau à la souris. Détruisez les aliens avant qu'ils ne vous atteignent !",
    snake_best: "Meilleur score : 314",
    game_snake: "Serpent",
    game_pong: "Pong",
    game_space: "Invaders",
    contributions_label: "PRINCIPALES CONTRIBUTIONS"
  }
};

const GET_SKILLS = (lang: Language) => [
  {
    category: TRANSLATIONS[lang].skills.producer,
    items: {
      ru: ["Управление полным циклом IT-производства", "Масштабирование цифровых экосистем и инфраструктуры", "Стратегическое планирование и риск-менеджмент", "Оптимизация Delivery-процессов и качества"],
      cn: ["全周期 IT 生产管理", "扩展数字生态系统和基础设施", "战略规划和风险缓解", "交付优化和卓越质量"],
      en: ["Full-cycle IT production management", "Scaling digital ecosystems & infrastructure", "Strategic planning & risk mitigation", "Delivery optimization & quality excellence"],
      hi: ["पूर्ण-चक्र आईटी उत्पादन प्रबंधन", "डिजिटल पारिस्थितिकी तंत्र और बुनियादी ढांचे को स्केल करना", "रणनीतिक योजना और जोखिम शमन", "वितरण अनुकूलन और गुणवत्ता उत्कृष्टता"],
      es: ["Gestión de producción de TI de ciclo completo", "Escalamiento de ecosistemas digitales e infraestructura", "Planificación estratégica y mitigación de riesgos", "Optimización de entrega y excelencia en calidad"],
      ar: ["إدارة إنتاج تكنولوجيا المعلومات كاملة الدورة", "توسيع النظم البيئية الرقمية والبنية التحتية", "التخطيط الاستراتيجي وتخفيف المخاطر", "تحسين التسليم والتميز في الجودة"],
      fr: ["Gestion de la production informatique en cycle complet", "Mise à l'échelle des écosystèmes numériques et de l'infrastructure", "Planification stratégique et atténuation des risques", "Optimisation de la livraison et excellence de la qualité"]
    }[lang],
    icon: <Briefcase className="w-5 h-5 text-blue-400" />
  },
  {
    category: TRANSLATIONS[lang].skills.gamedev,
    items: {
      ru: ["Проектирование высококонверсионных игровых циклов", "R&D и интеграция передовых технологий (AI/XR)", "Балансировка игровой экономики и монетизации", "Архитектура уникального пользовательского опыта (UX)"],
      cn: ["设计高转化率的游戏循环", "新兴技术的研究与集成 (AI/XR)", "游戏经济和获利平衡", "独特的沉浸式 UX 架构"],
      en: ["Design of high-conversion game loops", "R&D & integration of emerging tech (AI/XR)", "Game economy & monetization balancing", "Unique immersive UX architecture"],
      hi: ["उच्च-रूपाান্তরण गेम लूप का डिज़ाइन", "उभरती तकनीक (AI/XR) का अनुसंधान और एकीकरण", "गेम इकोनॉमी और मुद्रीकरण संतुलन", "अद्वितीय इमर्सिव UX आर्किटेक्चर"],
      es: ["Diseño de ciclos de juego de alta conversión", "I+D e integración de tecnologías emergentes (AI/XR)", "Equilibrio de la economía del juego y monetización", "Arquitectura de experiencia de usuario (UX) inmersiva única"],
      ar: ["تصميم حلقات ألعاب عالية التحويل", "البحث والتطوير ودمج التقنيات الناشئة (AI/XR)", "موازنة اقتصاد اللعبة وتحقيق الدخل", "بنية تجربة مستخدم غامرة فريدة"],
      fr: ["Conception de boucles de jeu à haute conversion", "R&D et intégration de technologies émergentes (IA/XR)", "Équilibrage de l'économie du jeu et de la monétisation", "Architecture UX immersive unique"]
    }[lang],
    icon: <Gamepad2 className="w-5 h-5 text-purple-400" />
  },
  {
    category: TRANSLATIONS[lang].skills.po,
    items: {
      ru: ["Максимизация ценности продукта и ROI", "Data-driven автоматизация бизнес-процессов", "Управление Roadmaps и стратегией развития", "Формирование и рост кросс-функциональных команд"],
      cn: ["最大化产品价值和投资回报率 (ROI)", "数据驱动的业务流程自动化", "产品战略和路线图编排", "跨职能团队建设和成长"],
      en: ["Maximizing product value & ROI", "Data-driven business process automation", "Product strategy & roadmap orchestration", "Cross-functional team building & growth"],
      hi: ["उत्पाद मूल्य और ROI को अधिकतम करना", "डेटा-संचालित व्यावसायिक प्रक्रिया स्वचालन", "उत्पाद रणनीति और रोडमैप ऑर्केस्ट्रेशन", "क्रॉस-फंक्शनल टीम निर्माण और विकास"],
      es: ["Maximización del valor del producto y ROI", "Automatización de procesos de negocio basada en datos", "Orquestación de estrategia de producto y hoja de ruta", "Construcción y crecimiento de equipos multifuncionales"],
      ar: ["تعظيم قيمة المنتج والعائد على الاستثمار", "أتمتة عمليات الأعمال القائمة على البيانات", "تنسيق استراتيجية المنتج وخارطة الطريق", "بناء ونمو فرق العمل المتداخلة الوظائف"],
      fr: ["Maximisation de la valeur du produit et du ROI", "Automatisation des processus métier pilotée par les données", "Orchestration de la stratégie produit et de la feuille de route", "Construction et croissance d'équipes transversales"]
    }[lang],
    icon: <Layers className="w-5 h-5 text-emerald-400" />
  }
];

const GET_PROJECTS = (lang: Language) => [
  {
    title: "STRIDE: Fates",
    description: {
      ru: "Сюжетный VR-экшен с элементами паркура. Исследование антиутопичного мегаполис, предлагающее игрокам абсолютную свободу тактических передвижений.",
      cn: "剧情驱动的 VR 跑酷射击游戏。探索反乌托邦大都市，为玩家提供极高的战术移动自由度和混合现实 (MR) 体验。",
      en: "Story-driven VR parkour action. Explores a dystopian metropolis while offering players absolute freedom in tactical movement.",
      hi: "स्टोरी-संचालित VR पार्कौर एक्शन। खिलाडियों को सामरिक आंदोलन में पूर्ण स्वतंत्रता प्रदान करते हुए एक डायस्टोपियन महानगर की खोज करता है।",
      es: "Acción de parkour en VR con historia. Explora una metrópolis distópica ofreciendo a los jugadores libertad absoluta en movimientos tácticos.",
      ar: "حركة باركور في الواقع الافتراضي تعتمد على القصة. استكشاف مدينة بائسة مع توفير حرية مطلقة للاعبين في الحركة التكتيكية.",
      fr: "Action de parkour VR narrative. Explore une métropole dystopique tout en offrant aux joueurs une liberté absolue de mouvement tactique."
    }[lang],
    whatDone: {
      ru: "Реализации Mix Reality режима, дизайн игрочного цикла, координация взаимодействия между командами разработки и нарратива.",
      cn: "实现混合现实模式，设计游戏循环，协调开发与叙事团队之间的协作。",
      en: "Mixed Reality mode implementation, game loop design, and cross-team coordination between development and narrative units.",
      hi: "मिश्रित वास्तविकता मोड कार्यान्वयन, गेम लूप डिजाइन, और विकास और कथा इकाइयों के बीच क्रॉस-टीम समन्वय।",
      es: "Implementación del modo de Realidad Mixta, diseño del ciclo de juego y coordinación entre los equipos de desarrollo y narrativa.",
      ar: "تنفيذ وضع الواقع المختلط، وتصميم حلقة اللعبة، والتنسيق عبر الفرق بين وحدات التطوير والسرد.",
      fr: "Mise en œuvre du mode Réalité Mixte, conception de la boucle de jeu et coordination entre les équipes de développement et de narration."
    }[lang],
    stack: ["Parkour Action", "Story-driven", "MR"],
    youtubeId: "LVMTZguRlKo",
    links: [
      { name: "Meta Quest", url: "https://www.meta.com/en-gb/experiences/5968439973240748/" },
      { name: "Steam", url: "https://store.steampowered.com/app/2597880/STRIDE_Fates/" },
      { name: "PlayStation", url: "https://store.playstation.com/en-us/concept/10010312" },
      { name: "Pico", url: "https://store-global.picoxr.com/gb/detail/1/7378790057861382150" }
    ]
  },
  {
    title: "STRIDE Multiplayer",
    description: {
      ru: "Соревновательный многопользовательский VR-шутер, где мобильность и паркур становятся главным тактическим преимуществом игрока.",
      cn: "竞技性多玩家 VR 射击游戏，在此移动能力和跑酷成为关键的战术优势。",
      en: "Competitive multiplayer VR shooter where high mobility and parkour maneuvers become primary tactical advantages.",
      hi: "प्रतिस्पर्धी मल्टीप्लेयर VR शूटर जहाँ उच्च गतिशीलता और पार्कौर पैंतरेबाज़ी प्राथमिक सामरिक लाभ बन जाते हैं।",
      es: "Shooter multijugador competitivo en VR donde la alta movilidad y las maniobras de parkour son ventajas tácticas clave.",
      ar: "لعبة إطلاق نار تنافسية متعددة اللاعبين في الواقع الافتراضي حيث تصبح الحركة العالية ومناورات الباركور ميزات تكتيكية أساسية.",
      fr: "Shooter VR multijoueur compétitif où la grande mobilité et les manœuvres de parkour deviennent les principaux avantages tactiques."
    }[lang],
    whatDone: {
      ru: "Проектирование и тюнинг сетевых механик, разработка под режимов, полный расчет и итеративная настройка игрового баланса.",
      cn: "设计和调优网络 mechanics，开发子模式，并对游戏平衡进行全面的算法计算和迭代测试。",
      en: "Network mechanics design & tuning, sub-mode development, and comprehensive algorithmic game balance iteration.",
      hi: "नेटवर्क मैकेनिक्स डिजाइन और ट्यूनिंग, उप-मोड विकास, और व्यापक एल्गोरिदम गेम बैलेंस इटरेशन।",
      es: "Diseño y ajuste de mecánicas de red, desarrollo de submodos e iteración algorítmica integral del equilibrio del juego.",
      ar: "تصميم وضبط ميكانيكا الشبكة، وتطوير الأوضاع الفرعية، وتكرار توازن اللعبة الخوارزمي الشامل.",
      fr: "Conception et réglage des mécaniques réseau, développement de sous-modes et itération algorithmique complète de l'équilibrage du jeu."
    }[lang],
    stack: ["Unreal Engine", "Singleplayer", "Multiplayer"],
    youtubeId: "83n7jWFOBE0",
    links: [
      { name: "Meta Quest", url: "https://www.oculus.com/experiences/quest/4901911359882668" },
      { name: "Steam", url: "https://store.steampowered.com/app/1292040/STRIDE" },
      { name: "PlayStation", url: "https://store.playstation.com/en-us/product/UP6195-CUSA25130_00-6556661881407173" },
      { name: "Pico", url: "https://store-global.picoxr.com/gb/detail/1/4029" }
    ]
  },
  {
    title: "STACK",
    description: {
      ru: "Тактический командный VR-шутер с глубоким упором на физическое взаимодействие объектов, разрушаемость и динамику ближнего боя.",
      cn: "战术性团队 VR 射击游戏，高度强调物理互动、环境破坏和动态近战体验。",
      en: "Tactical team VR shooter with a strong focus on physical object interactions, destructibility, and dynamic close combat.",
      hi: "भौतिक वस्तुओं की परस्पर क्रिया, विनाशकता और गतिशील करीबी मुकाबले पर गहरा ध्यान देने वाला सामरिक टीम VR शूटर।",
      es: "Shooter táctico por equipos en VR con un fuerte enfoque en interacciones físicas, destructibilidad y combate cuerpo a cuerpo dinámico.",
      ar: "لعبة إطلاق نار تكتيكية للفريق بالواقع الافتراضي مع تركيز قوي على تفاعلات الأشياء المادية، والقابلية للتدمير، والقتال القريب الديناميكي.",
      fr: "Shooter VR tactique en équipe mettant l'accent sur les interactions physiques, la destructibilité et le combat rapproché dynamique."
    }[lang],
    whatDone: {
      ru: "Проектирование физических взаимодействий, создание тактических карт, управление полным циклом разработки продукта.",
      cn: "设计物理交互、创建战术地图并管理产品的全生命周期开发。",
      en: "Designing physical interactions, tactical map creation, and full product development lifecycle management.",
      hi: "भौतिक क्रियाओं को डिजाइन करना, सामरिक मानचित्र निर्माण, और पूर्ण उत्पाद विकास जीवनचक्र प्रबंधन।",
      es: "Diseño de interacciones físicas, creación de mapas tácticos y gestión del ciclo de vida del desarrollo de productos.",
      ar: "تصميم التفاعلات المادية، وإنشاء الخرائط التكتيكية، وإدارة دورة حياة تطوير المنتج بالكامل.",
      fr: "Conception d'interactions physiques, création de cartes tactiques et gestion complète du cycle de vie du développement de produits."
    }[lang],
    stack: ["Unity", "Physics-based", "Action"],
    youtubeId: "RAJVJAjBX8c",
    links: [
      { name: "Meta Quest", url: "https://www.meta.com/experiences/stack/5366874313435765" },
      { name: "Pico", url: "https://store-global.picoxr.com/global/detail/1/7339799345019273268" }
    ]
  },
  {
    title: "Deadhook",
    description: {
      ru: "Динамичный VR-шутер с элементами Roguelike и продвинутой системой перемещения с помощью крюка-кошки.",
      cn: "具有 Roguelike 元素和先进钩爪移动系统的动态 VR 射击游戏。",
      en: "Dynamic VR shooter featuring Roguelike elements and an advanced grappling hook movement system.",
      hi: "रोगलाइक तत्वों और एक उन्नत ग्रैपलिंग हुक मूवमेंट सिस्टम की विशेषता वाला गतिशील VR शूटर।",
      es: "Shooter dinámico en VR con elementos Roguelike y un sistema avanzado de movimiento con gancho de agarre.",
      ar: "لعبة إطلاق نار ديناميكية في الواقع الافتراضي تتميز بعناصر Roguelike ونظام حركة متقدم بخطاف تصارع.",
      fr: "Shooter VR dynamique comprenant des éléments Roguelike et un système de mouvement par grappin avancé."
    }[lang],
    whatDone: {
      ru: "Геймдизайн кор-механик, проектирование Roguelike-цикла (мета-прогрессия, баланс оружия и противников), подготовка продукта к релизу на Meta Quest, SteamVR и PSVR2.",
      cn: "设计核心机制、Roguelike 循环（元进度、武器和敌人平衡），并筹备 Meta Quest、SteamVR 和 PSVR2 平台发布。",
      en: "Core mechanics design, Roguelike cycle planning (meta-progression, weapon/enemy balancing), and multi-platform release preparation (Meta Quest, SteamVR, PSVR2).",
      hi: "कोर मैकेनिक्स डिजाइन, रोगलाइक साइकिल प्लानिंग (मेटा-प्रोग्रेस, हथियार/दुश्मन संतुलन), और मल्टी-प्लेटफॉर्म रिलीज की तैयारी।",
      es: "Diseño de mecánicas principales, planificación del ciclo Roguelike (meta-progresión, equilibrio armas/enemigos) y preparación para múltiples plataformas.",
      ar: "تصميم الميكانيكا الأساسية، وتخطيط دورة Roguelike، وإعداد الإصدار متعدد المنصات.",
      fr: "Conception des mécanismes de base, planification du cycle Roguelike et préparation de la sortie multiplateforme."
    }[lang],
    stack: ["VR Roguelike", "Action", "Design"],
    youtubeId: "GB5ERsLVf6I",
    links: [
      { name: "Meta Quest", url: "https://www.meta.com/experiences/dead-hook/8896303273744663/" },
      { name: "Steam", url: "https://store.steampowered.com/app/2342360/Dead_Hook/" },
      { name: "PlayStation", url: "https://store.playstation.com/concept/10009531" },
      { name: "Pico", url: "https://store-global.picoxr.com/gb/detail/1/7309044953793970182" }
    ]
  },
  {
    title: "Against - Map Editor",
    description: {
      ru: "Профессиональный инструментарий и мощный редактор уровней, созданный для поддержки UGC-сообщества боевого ритм-шутера AGAINST.",
      cn: "专门为名为 AGAINST 的节奏射击游戏设计的专业工具 and 强大的关卡编辑器，旨在支持 UGC 社区。",
      en: "Professional toolset and powerful level editor built to support the UGC community of the rhythm combat shooter AGAINST.",
      hi: "रिदम कॉम्बैट शूटर AGAINST के UGC समुदाय का समर्थन करने के लिए बनाया गया पेशेवर टूलसेट और शक्तिशाली लेवल एडिटर।",
      es: "Conjunto de herramientas profesionales y editor de niveles potente creado para apoyar a la comunidad UGC del shooter rítmico AGAINST.",
      ar: "مجموعة أدوات احترافية ومحرر مستويات قوي تم بناؤه لدعم مجتمع المحتوى الذي ينشئه المستخدمون للعبة القتال الإيقاعي AGAINST.",
      fr: "Ensemble d'outils professionnels et éditeur de niveaux puissant conçu pour soutenir la communauté UGC du shooter rythmique AGAINST."
    }[lang],
    whatDone: {
      ru: "Проектирование UX/UI редактора, разработка клиента для моддеров, выстраивание надежной инфраструктуры для создания и обмена пользовательским контентом.",
      cn: "设计编辑器 UX/UI，为模组制作者开发客户端，并建立稳定的 UGC 内容共享基础设施。",
      en: "UX/UI design of the editor, developing the modder client, and building a robust infrastructure for UGC creation and exchange.",
      hi: "संपादक का UX/UI डिजाइन, मॉडर क्लाइंट विकसित करना, और UGC निर्माण और विनिमय के लिए एक मजबूत बुनियादी ढांचा तैयार करना।",
      es: "Diseño UX/UI del editor, desarrollo del cliente para modders y construcción de una infraestructura robusta para intercambio de contenido UGC.",
      ar: "تصميم تجربة المستخدم ومحرر واجهة المستخدم، وتطوير عميل التعديل، وبناء بنية تحتية قوية لتبادل المحتوى.",
      fr: "Conception UX/UI de l'éditeur, développement du client moddeur et construction d'une infrastructure robuste pour l'échange de contenu UGC."
    }[lang],
    stack: ["Editor Tooling", "Unity SDK", "User Generated Content"],
    youtubeId: "48VhkwMV80Y",
    links: [
      { name: "Steam", url: "https://store.steampowered.com/app/1584840/AGAINST" },
      { name: "Pico", url: "https://store-global.picoxr.com/ru/detail/1/3744" }
    ]
  },
  {
    title: "SPLIT FPV: Drone Racing",
    description: {
      ru: "Бесплатный реалистичный FPV-симулятор для прокачки навыков управления дроном. Включает проработанную физику полета и специализированные боевые миссии.",
      cn: "免费且真实的 FPV 模拟器，用于提高无人机驾驶技能。包含精细的飞行物理和专门的战斗任务。",
      en: "Free realistic FPV simulator to sharpen drone piloting skills. Features sophisticated flight physics and specialized combat missions.",
      hi: "ड्रोन पायलट कौशल को तेज करने के लिए मुफ्त यथार्थवादी FPV सिम्युलेटर। परिष्कृत उड़ान भौतिकी और सामरिक मिशनों की विशेषता।",
      es: "Simulador FPV realista gratuito para mejorar las habilidades de pilotaje de drones. Cuenta con físicas de vuelo sofisticadas y misiones de combate.",
      ar: "محاكي FPV واقعي مجاني لشحذ مهارات قيادة الطائرات بدون طيار. يتميز بفيزياء طيران متطورة ومهام قتالية متخصصة.",
      fr: "Simulateur FPV réaliste gratuit pour perfectionner les compétences de pilotage de drones. Comprend une physique de vol sophistiquée et des missions de combat."
    }[lang],
    whatDone: {
      ru: "Проектирование геймплея и прогрессии, тюнинг реалистичной физики полета, интеграция поддержки пультов и геймпадов.",
      cn: "设计游戏玩法 and 进度系统，调优真实飞行物理，集成遥控器和手柄支持。",
      en: "Gameplay & progression design, realistic flight physics tuning, transmitter and gamepad integration.",
      hi: "गेमप्ले और प्रगति डिजाइन, यथार्थवादी उड़ान भौतिकी ट्यूनिंग, ट्रांसमीटर और गेमपैड एकीकरण।",
      es: "Diseño de jugabilidad y progresión, ajuste de físicas de vuelo realistas e integración de transmisores y gamepads.",
      ar: "تصميم اللعب والتقدم، وضبط فيزياء الطيران الواقعية، وتكامل جهاز الإرسال ولوحة الألعاب.",
      fr: "Conception du gameplay et de la progression, réglage de la physique de vol réaliste, intégration de transmetteurs et de manettes."
    }[lang],
    stack: ["FPV Simulator", "Unity", "Gamedesign"],
    youtubeId: "73QgqnQXSvw",
    links: [
      { name: "Steam", url: "https://store.steampowered.com/app/4348580/SPLIT_FPV_Drone_Racing/" }
    ]
  },
  {
    title: "Shooter VR: LBE - Free Roam",
    description: {
      ru: "Динамичный LBE-шутер со свободным перемещением (Free Roam VR) для офлайн-арен, обеспечивающий высокую реиграбельность за счет встроенных инструментов создания уровней.",
      cn: "专为线下体验店设计的动态 LBE 自由移动射击游戏 (Free Roam VR)，通过内置关卡创建工具提供极高的重玩价值。",
      en: "Dynamic LBE Free Roam VR shooter for location-based entertainment, offering high replayability via built-in level creation tools.",
      hi: "स्थान-आधारित मनोरंजन के लिए गतिशील LBE फ्री रोम VR शूटर, जो अंतर्निहित लेवल निर्माण उपकरणों के माध्यम से उच्च रीप्लेबिलिटी प्रदान करता है।",
      es: "Shooter dinámico de VR de movimiento libre para centros de entretenimiento, que ofrece gran rejugabilidad mediante herramientas integradas.",
      ar: "لعبة إطلاق نار ديناميكية في الواقع الافتراضي للتجوال الحر للترفيه القائم على الموقع، وتوفر إمكانية إعادة لعب عالية.",
      fr: "Shooter VR dynamique en itinérance libre pour le divertissement géolocalisé, offrant une grande rejouabilité via des outils de création intégrés."
    }[lang],
    whatDone: {
      ru: "Руководство разработкой встроенного генератора и редактора карт, проектирование игрового цикла, настройка баланса для многопользовательских сессий.",
      cn: "主导内置地图生成器 and 关卡编辑器的开发，设计游戏循环，针对多玩家会话进行平衡调整。",
      en: "Leading the development of built-in map generator and editor, game loop design, and multiplayer session balancing.",
      hi: "अंतर्निहित मानचित्र जनरेटर और संपादक के विकास का नेतृत्व करना, गेम लूप डिजाइन, और मल्टीप्लेयर सत्र संतुलन।",
      es: "Liderazgo del desarrollo del generador y editor de mapas integrados, diseño del ciclo de juego y equilibrio de sesiones multijugador.",
      ar: "قيادة تطوير مولد الخرائط والمحرر المدمج، وتصميم حلقة اللعبة، وتوازن جلسات اللاعبين المتعددين.",
      fr: "Direction du développement du générateur et de l'éditeur de cartes intégrés, conception de la boucle de jeu et équilibrage des sessions multijoueurs."
    }[lang],
    stack: ["Multiplayer", "LBE", "Free Roam VR"],
    youtubeId: "I8B3NarPd2E",
    links: []
  },
  {
    title: "Football VR: LBE - Free Roam",
    description: {
      ru: "Иммерсивный симулятор футбола, переносящий реальные движения игрока на виртуальное поле с использованием технологии Full Body Tracking.",
      cn: "沉浸式足球模拟器，利用全身追踪技术将球员的真实动作转化为虚拟球场表现。",
      en: "Immersive football simulator translating real-world movements onto a virtual pitch using Full Body Tracking technology.",
      hi: "फुल बॉडी ट्रैकिंग तकनीक का उपयोग करके वास्तविक दुनिया के आंदोलनों को आभासी पिच पर अनुवाद करने वाला इमर्सिव फुटबॉल सिम्युलेटर।",
      es: "Simulador de fútbol inmersivo que traduce los movimientos reales a un campo virtual mediante tecnología de seguimiento de cuerpo completo.",
      ar: "محاكي كرة قدم غامر يترجم حركات العالم الحقيقي إلى ملعب افتراضي باستخدام تقنية تتبع الجسم بالكامل.",
      fr: "Simulateur de football immersif traduisant les mouvements du monde réel sur un terrain virtuel grâce à la technologie Full Body Tracking."
    }[lang],
    whatDone: {
      ru: "Интеграция комплексных систем трекинга всего тела, синхронизация физических и виртуальных объектов, управление процессами разработки.",
      cn: "集成复杂的全身追踪系统，同步物理 and 虚拟对象，管理开发流程。",
      en: "Integration of complex body tracking systems, physical-to-virtual object synchronization, and development process management.",
      hi: "जटिल बॉडी ट्रैकिंग सिस्टम का एकीकरण, भौतिक-से-आभासी वस्तु सिंक्रनाइज़ेशन, और विकास प्रक्रिया प्रबंधन।",
      es: "Integración de sistemas de seguimiento corporal complejos, sincronización de objetos físicos a virtuales y gestión de procesos.",
      ar: "تكامل أنظمة تتبع الجسم المعقدة، ومزامنة الأجسام المادية إلى الافتراضية، وإدارة عملية التطوير.",
      fr: "Intégration de systèmes de suivi corporel complexes, synchronisation physique-virtuelle et gestion du processus de développement."
    }[lang],
    stack: ["Full Body Tracking", "Unity", "Gamedesign"],
    youtubeId: "sSeCxxwv-A8",
    links: []
  },
  {
    title: "Rythm VR: Sports",
    description: {
      ru: "VR-кроссовер, органично объединяющий механики бокса, тенниса и боя на парных мечах с системой генеративного музыкального сопровождения.",
      cn: "结合了拳击、网球和双剑战斗机制与生成式音乐系统的 VR 跨界作品。",
      en: "VR crossover seamlessly merging boxing, tennis, and dual-sword combat mechanics with a generative music system.",
      hi: "बॉक्सिंग, टेनिस और ड्यूअल-सोर्ड कॉम्बैट मैकेनिक्स को जनरेटिव म्यूजिक सिस्टम के साथ जोड़ने वाला VR क्रॉसओवर।",
      es: "Crossover en VR que fusiona mecánicas de boxeo, tenis y combate con espadas duales con un sistema de música generativa.",
      ar: "كروس أوفر في الواقع الافتراضي يدمج بسلاسة ميكانيكا الملاكمة والتنس والقتال بالسيوف مع نظام موسيقي مولد.",
      fr: "Crossover VR fusionnant harmonieusement boxe, tennis et combat à l'épée avec un système de musique génératif."
    }[lang],
    whatDone: {
      ru: "Разработка концепции, балансировка спортивных паттернов движений с ритм-механиками, настройка алгоритмов генерации уровня под аудиоряд.",
      cn: "开发概念，将运动动作模式与节奏机制平衡，并根据音频序列调优关卡生成算法。",
      en: "Concept development, balancing sports movement patterns with rhythm mechanics, and tuning level generation algorithms to audio tracks.",
      hi: "संकल्पना विकास, लयबद्ध यांत्रिकी के साथ खेल आंदोलन पैटर्न को संतुलित करना, और ऑडियो ट्रैक के लिए स्तर उत्पादन एल्गोरिदम।",
      es: "Desarrollo de concepto, equilibrio de patrones deportivos con mecánicas rítmicas y ajuste de algoritmos de generación de niveles.",
      ar: "تطوير المفهوم، وموازنة أنماط الحركة الرياضية مع ميكانيكا الإيقاع، وضبط خوارزميات توليد المستويات.",
      fr: "Développement du concept, équilibrage des mouvements sportifs avec des mécanismes rythmiques et réglage des algorithmes de génération."
    }[lang],
    stack: ["Generative Music", "Rhythm Game", "Combat Sports"],
    youtubeId: "096o56nwQMo",
    links: []
  },
  {
    title: "Fencer VR",
    description: {
      ru: "Профессиональный VR-симулятор фехтования, отличающийся физически корректным поведением клинка и точнейшим отслеживанием стойки спортсмена.",
      cn: "专业 VR 击剑模拟器，具有物理精准的剑刃行为 and 对运动员姿势的精确追踪。",
      en: "Professional VR fencing simulator featuring physics-accurate blade behaviors and ultra-precise athlete posture tracking.",
      hi: "पेशेवर VR तलवारबाजी सिम्युलेटर भौतिकी-सटीक ब्लेड व्यवहार और अल्ट्रा-सटीक एथलीट आसन ट्रैकिंग की विशेषता है।",
      es: "Simulador de esgrima VR profesional con comportamientos de hoja físicamente precisos y seguimiento ultra preciso de la postura.",
      ar: "محاكي مبارزة بالواقع الافتراضي احترافي يتميز بسلوكيات نصل دقيقة فيزيائياً وتتبع دقيق لوضعية الرياضي.",
      fr: "Simulateur d'escrime VR professionnel présentant des comportements de lame précis sur le plan physique et un suivi de posture ultra-précis."
    }[lang],
    whatDone: {
      ru: "Разработка режимов, игрового цикла и заданий, подготовка продукта к релизу на Meta Quest.",
      cn: "开发各种模式、游戏循环 and 任务，并为 Meta Quest 平台版本做准备。",
      en: "Developing game modes, loop logic, and tasks, plus platform preparation for the Meta Quest release.",
      hi: "गेम मोड, लूप लॉजिक और टास्क विकसित करना, साथ ही मेटा क्वेस्ट रिलीज के लिए प्लेटफॉर्म की तैयारी।",
      es: "Desarrollo de modos de juego, lógica de ciclos y tareas, además de la preparación de la plataforma para Meta Quest.",
      ar: "تطوير أوضاع اللعبة، ومنطق الحلقة، والمهام، بالإضافة إلى التحضير لإصدار Meta Quest.",
      fr: "Développement des modes de jeu, de la logique de boucle et des tâches, ainsi que préparation de la plateforme pour Meta Quest."
    }[lang],
    stack: ["Physics Engine", "Precision Tracking", "Sports Sim"],
    youtubeId: "4DZVP613WoQ",
    links: [
      { name: "Meta Quest", url: "https://www.oculus.com/experiences/quest/4007385822625371/" }
    ]
  },
  {
    title: "Biathlon VR Trainer",
    description: {
      ru: "Специализированный спортивный тренажер для биатлонистов. Включает точное моделирование баллистики и интеграцию датчиков реальной физической нагрузки.",
      cn: "面向专业冬两项运动员的专用训练设备。包含精准的弹道建模 and 实际物理负载传感器集成。",
      en: "Specialized sports trainer for biathletes. Includes precise ballistics modeling and real physical load sensor integration.",
      hi: "बिआथलेट्स के लिए विशेष खेल प्रशिक्षक। इसमें सटीक बैलिस्टिक मॉडलिंग और वास्तविक भौतिक लोड सेंसर एकीकरण शामिल है।",
      es: "Entrenador deportivo especializado para biatletas. Incluye modelado balístico preciso e integración de sensores de carga física real.",
      ar: "مدرب رياضي متخصص للرياضيين الثنائيين. يتضمن نمذجة باليستية دقيقة وتكامل مستشعر الحمل البدني الحقيقي.",
      fr: "Entraîneur sportif spécialisé pour les biathlètes. Comprend une modélisation balistique précise et l'intégration de capteurs de charge physique."
    }[lang],
    whatDone: {
      ru: "Сбор требований у профессиональных тренеров, разработка аналитического модуля для оценки результатов, настройка реальной винтовки-контроллера для стрельбы и перезарядки.",
      cn: "向专业教练收集需求，开发结果分析模块，并针对真实步枪控制器的射击 and 装填进行调优。",
      en: "Requirement gathering from pro coaches, analytical results module development, and hardware tuning for a real rifle controller.",
      hi: "प्रो कोचों से आवश्यकता जुटाना, विश्लेषणात्मक परिणाम मॉड्यूल विकास, और एक वास्तविक राइफल नियंत्रक के लिए हार्डवेयर ट्यूनिंग।",
      es: "Recopilación de requisitos de entrenadores profesionales, desarrollo de módulo analítico y ajuste de hardware para un controlador de rifle real.",
      ar: "جمع المتطلبات من المدربين المحترفين، وتطوير وحدة النتائج التحليلية، وضبط الأجهزة لوحدة تحكم حقيقية بالبندقية.",
      fr: "Collecte des besoins auprès d'entraîneurs pro, développement d'un module analytique et réglage du matériel pour un contrôleur de fusil réel."
    }[lang],
    stack: ["Training Sim", "Simulation", "Analytics"],
    youtubeId: "MyqNSP_e0BE",
    links: []
  },
  {
    title: "Education VR Box",
    description: {
      ru: "Автономный аппаратно-программный VR-комплекс «под ключ» для образовательных учреждений с системой централизованного контроля.",
      cn: "为教育机构提供的端到端独立软硬件 VR 方案，配备集中控制系统。",
      en: "Standalone hardware/software VR turnkey solution for educational institutions with a centralized control system.",
      hi: "केंद्रीकृत नियंत्रण प्रणाली के साथ शैक्षणिक संस्थानों के लिए स्टैंडअलोन हार्डवेयर/सॉफ्टवेयर VR टर्नकी समाधान।",
      es: "Solución integral de hardware/software de VR para instituciones educativas con un sistema de control centralizado.",
      ar: "حل واقع افتراضي متكامل للأجهزة والبرامج للمؤسسات التعليمية مع نظام تحكم مركزي.",
      fr: "Solution clé en main VR matérielle/logicielle autonome pour les établissements d'enseignement avec un système de contrôle centralisé."
    }[lang],
    whatDone: {
      ru: "Интеграция аппаратного и программного обеспечения (EdTech), разработка системы одновременного запуска контента на сети устройств, продюсирование обучающих модулей.",
      cn: "集成软硬件 (EdTech)，开发跨设备网络批量内容启动系统，并统筹教学模块制作。",
      en: "Hardware/Software EdTech integration, multi-device bulk content management, and educational module producing.",
      hi: "हार्डवेयर/सॉफ्टवेयर EdTech एकीकरण, मल्टी-डिवाइस बल्क कंटेंट प्रबंधन, और शैक्षिक मॉड्यूल उत्पादन।",
      es: "Integración de hardware/software EdTech, gestión masiva de contenido en múltiples dispositivos y producción de módulos educativos.",
      ar: "تكامل EdTech للأجهزة والبرامج، وإدارة المحتوى بالجملة على أجهزة متعددة، وإنتاج الوحدات التعليمية.",
      fr: "Intégration d'EdTech matérielle/logicielle, gestion de contenu en masse sur plusieurs appareils et production de modules éducatifs."
    }[lang],
    stack: ["EdTech", "Hardware/Software Integration", "Education"],
    youtubeId: "BmsaeoKpcqU",
    links: []
  },
  {
    title: "Nevskiy Simulator",
    description: {
      ru: "Ивентный симулятор исторического боя на мечах, оптимизированный для высокой проходимости и вау-эффекта на крупных выставочных стендах.",
      cn: "为大型展台设计的活动用历史剑术模拟器，针对高带宽交互体验进行了优化。",
      en: "Event-based historical sword fighting simulator optimized for high throughput and high-impact tradeshow experiences.",
      hi: "बड़े प्रदर्शनी स्टैंडों पर उच्च थ्रूपुट और उच्च प्रभाव अनुभव के लिए अनुकूलित इवेंट-आधारित ऐतिहासिक तलवारबाजी सिम्युलेटर।",
      es: "Simulador de combate histórico con espadas para eventos, optimizado para alta concurrencia y gran impacto en ferias.",
      ar: "محاكي قتال بالسيوف تاريخي للأحداث، تم تحسينه للإنتاجية العالية والتجارب المؤثرة في المعارض التجارية.",
      fr: "Simulateur de combat historique à l'épée pour l'événementiel, optimisé pour un débit élevé et des expériences percutantes."
    }[lang],
    whatDone: {
      ru: "Проектирование коротких иммерсивных сессий, адаптация и оптимизация UX для неподготовленных пользователей, технический сетап выставочного стенда.",
      cn: "设计短小沉浸式体验流程，为普通大众优化 UX 路径，并负责展台的技术搭建。",
      en: "Designing short immersive sessions, UX optimization for lay users, and technical setup for exhibition stands.",
      hi: "लघु इमर्सिव सत्रों को डिजाइन करना, सामान्य उपयोगकर्ताओं के लिए UX अनुकूलन, और प्रदर्शनी स्टैंड के लिए तकनीकी सेटअप।",
      es: "Diseño de sesiones inmersivas cortas, optimización de UX para usuarios no preparados y montaje técnico del stand.",
      ar: "تصميم جلسات غامرة قصيرة، وتحسين تجربة المستخدم للمستخدمين العاديين، والإعداد الفني لمنصات المعارض.",
      fr: "Conception de sessions immersives courtes, optimisation de l'UX pour les novices et installation technique."
    }[lang],
    stack: ["Exhibition Tech", "Sword Fighting", "Immersive Experience"],
    youtubeId: "vbz74nwQv7M",
    links: []
  },
  {
    title: "VR Weapons Museum",
    description: {
      ru: "Интерактивная VR-энциклопедия стрелкового оружия with высокой детализацией исторически достоверной сборки/разборки и реалистичной физикой стрельбы.",
      cn: "具有高度详细且真实的游戏体验的互动式 VR 枪械百科全书，包含真实的组装/拆解 and 物理射击体验。",
      en: "Interactive VR museum of firearms with highly detailed, historically accurate assembly and realistic ballistics.",
      hi: "अत्यधिक विस्तृत, ऐतिहासिक रूप से सटीक असेंबली और यथार्थवादी बैलिस्टिक के साथ आग्नेयास्त्रों का इंटरैक्टिव VR संग्रहालय।",
      es: "Museo interactivo en VR de armas de fuego con ensamblaje históricamente preciso y balística realista.",
      ar: "متحف تفاعلي للأسلحة النارية في الواقع الافتراضي مع تجميع دقيق تاريخياً وباليستيات واقعية.",
      fr: "Musée interactif d'armes à feu VR avec assemblage historiquement précis et balistique réaliste."
    }[lang],
    whatDone: {
      ru: "Руководство процессом 3D-моделирования исторических референсов, настройка интерактивных взаимодействий, подготовка сюжетного повествования.",
      cn: "主导历史参考资料的 3D 建模流程，调优互动逻辑，并筹划博物馆内的叙事路径。",
      en: "Leading 3D modeling of historical assets, tuning interaction systems, and narrative planning.",
      hi: "ऐतिहासिक संपत्तियों का 3D मॉडलिंग, इंटरेक्शन सिस्टम ट्यूनिंग और कथा नियोजन का नेतृत्व करना।",
      es: "Liderazgo del modelado 3D de activos históricos, ajuste de sistemas de interacción y planificación narrativa.",
      ar: "قيادة النمذجة ثلاثية الأبعاد للأصول التاريخية، وضبط أنظمة التفاعل، والتخطيط السردي.",
      fr: "Direction de la modélisation 3D des actifs historiques, réglage des systèmes d'interaction et planification narrative."
    }[lang],
    stack: ["3D Interaction", "History", "VR"],
    youtubeId: "R-btZ92JkaY",
    links: []
  },
  {
    title: {
      ru: "Проектирование квартиры",
      cn: "公寓设计 VR",
      en: "Apartment Design VR",
      hi: "अपार्टमेंट डिज़ाइन VR",
      es: "Diseño de apartamentos en VR",
      ar: "تصميم الشقق بالواقع الافتراضي",
      fr: "Conception d'appartement VR"
    }[lang],
    description: {
      ru: "B2B VR/AR-решение для презентации объектов недвижимости застройщикам и конечным клиентам с возможностью кастомизации отделки в реальном времени.",
      cn: "面向房地产开发商及其终端客户的 B2B VR/AR 解决方案，支持实时定制化装修预览。",
      en: "B2B VR/AR solution for real estate visualization, allowing developers and clients to customize finishes in real-time.",
      hi: "रियल एस्टेट विज़ुअलाइज़ेशन के लिए B2B VR/AR समाधान, डेवलपर्स और ग्राहकों को वास्तविक समय में फिनिश को कस्टमाइज़ करने की अनुमति देता है।",
      es: "Solución B2B VR/AR para visualización inmobiliaria, que permite a desarrolladores y clientes personalizar acabados en tiempo real.",
      ar: "حل B2B بالواقع الافتراضي والواقع المعزز لتصور العقارات، مما يسمح للمطورين والعملاء بتخصيص التشطيبات في الوقت الفعلي.",
      fr: "Solution B2B VR/AR pour la visualisation immobilière, permettant aux promoteurs et clients de personnaliser les finitions en temps réel."
    }[lang],
    whatDone: {
      ru: "Управление разработкой, оптимизация и интеграция архитектурных CAD-моделей в движок, создание бесшовного пользовательского пути для VR-презентаций.",
      cn: "管理开发流程，优化并将建筑 CAD 模型集成到引擎中，并为 VR 演示设计无缝的用户路径。",
      en: "Development management, CAD architectural model optimization and integration, and seamless user journey design for VR tours.",
      hi: "विकास प्रबंधन, CAD वास्तुशिल्प मॉडल अनुकूलन और एकीकरण, और VR दौरों के लिए निर्बाध उपयोगकर्ता यात्रा डिजाइन।",
      es: "Gestión de desarrollo, optimización e integración de modelos arquitectónicos CAD y diseño de recorridos de usuario fluidos para tours VR.",
      ar: "إدارة التطوير، وتحسين النماذج المعمارية وتكاملها، وتصميم رحلة مستخدم سلسة لجولات الواقع الافتراضي.",
      fr: "Gestion du développement, optimisation et intégration de modèles architecturaux CAO et conception de parcours utilisateur fluides."
    }[lang],
    stack: ["Real Estate", "VR/AR", "Architecture"],
    youtubeId: "VK1YTMYuse0",
    links: []
  },
  {
    title: "Boxglass VR Cardboards",
    description: {
      ru: "Вывод на рынок и масштабирование hardware-стартапа по производству доступных мобильных VR-гарнитур.",
      cn: "生产实惠的 mobile VR 头显的硬件初创公司市场进入与扩张。",
      en: "Market entry and scaling for a hardware startup producing affordable mobile VR headsets.",
      hi: "किफायती मोबाइल VR हेडसेट बनाने वाले हार्डवेयर स्टार्टअप के लिए मार्केट एंट्री और स्केलिंग।",
      es: "Entrada al mercado y escalamiento de una startup de hardware que produce visores de VR móvil asequibles.",
      ar: "دخول السوق والتوسع لشركة أجهزة ناشئة تنتج سماعات واقع افتراضي محمولة بأسعار معقولة.",
      fr: "Entrée sur le marché et mise à l'échelle d'une startup matérielle produisant des casques VR mobiles abordables."
    }[lang],
    whatDone: {
      ru: "Выстраивание производственной цепочки, организация B2B-продаж, успешная техническая сертификация и интеграция продуктов с экосистемой Works With Google Cardboard.",
      cn: "建立制造供应链，组织 B2B 销售，并成功通过了 Works With Google Cardboard 生态系统的认证和集成。",
      en: "Supply chain setup, B2B sales management, and technical certification/integration with the 'Works With Google Cardboard' ecosystem.",
      hi: "आपूर्ति श्रृंखला सेटअप, B2B बिक्री प्रबंधन, और तकनीकी प्रमाणन/एकीकरण 'गूगल कार्डबोर्ड के साथ काम करता है' पारिस्थितिकी तंत्र के साथ।",
      es: "Configuración de la cadena de suministro, gestión de ventas B2B y certificación/integración técnica con el ecosistema 'Works With Google Cardboard'.",
      ar: "إعداد سلسلة التوريد، وإدارة مبيعات B2B، والاعتماد الفني/التكامل مع نظام 'يعمل مع جوجل كاردبورد'.",
      fr: "Mise en place de la chaîne d'approvisionnement, gestion des ventes B2B et certification/intégration technique avec l'écosystème 'Works With Google Cardboard'."
    }[lang],
    stack: ["StartUp", "Manufacturing", "B2B"],
    image: "https://static.tildacdn.com/tild3234-6461-4636-b435-643732656430/firm2222.jpg",
    links: [
      { name: { ru: "История Forbes", cn: "福布斯故事", en: "Forbes Story", hi: "फोर्ब्स कहानी", es: "Historia de Forbes", ar: "قصة فوربس", fr: "Histoire de Forbes" }[lang], url: "https://www.forbes.ru/tehnologii/341125-iz-izhevska-v-virtualnuyu-realnost-kak-startap-boxglass-razvivaet-vr-vmeste-s" }
    ]
  }
];

const CONTACTS = [
  { label: "Telegram", value: "@xrman", url: "https://t.me/xrman", icon: <Send />, color: "text-[#0088cc]", hoverBg: "hover:bg-[#0088cc]", shadow: "hover:shadow-[#0088cc]/30" },
  { label: "Email", value: "hello@xrman.dev", url: "mailto:avkopanev@gmail.com", icon: <Mail />, color: "text-[#EA4335]", hoverBg: "hover:bg-[#EA4335]", shadow: "hover:shadow-[#EA4335]/30" },
  { label: "LinkedIn", value: "Kopanev Alexandr", url: "https://linkedin.com/in/aleksandr-kopanev-18787b104", icon: <Linkedin />, color: "text-[#0077b5]", hoverBg: "hover:bg-[#0077b5]", shadow: "hover:shadow-[#0077b5]/30" },
  { label: "Discord", value: "xrman", url: "https://discordapp.com/users/258354536287043588/", icon: <Disc />, color: "text-[#5865F2]", hoverBg: "hover:bg-[#5865F2]", shadow: "hover:shadow-[#5865F2]/30" }
];

type Language = 'ru' | 'en' | 'cn' | 'hi' | 'es' | 'ar' | 'fr';

const detectInitialLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('portfolio-lang') as Language;
    if (saved && ['ru', 'en', 'cn', 'hi', 'es', 'ar', 'fr'].includes(saved)) return saved;
  }

  if (typeof navigator === 'undefined') return 'en';
  
  const userLangs = (navigator.languages || [navigator.language]).map(l => l.toLowerCase());
  
  for (const lang of userLangs) {
    if (lang.startsWith('ru')) return 'ru';
    if (lang.startsWith('zh')) return 'cn';
    if (lang.startsWith('hi')) return 'hi';
    if (lang.startsWith('es')) return 'es';
    if (lang.startsWith('ar')) return 'ar';
    if (lang.startsWith('fr')) return 'fr';
    if (lang.startsWith('en')) return 'en';
  }
  
  const preferred = userLangs[0] || '';
  if (preferred.startsWith('be') || preferred.startsWith('kk') || preferred.startsWith('uk')) return 'ru';

  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const russianZones = ['Europe/Moscow', 'Europe/Saratov', 'Europe/Ulyanovsk', 'Europe/Volgograd', 'Europe/Kirov', 'Europe/Astrakhan', 'Asia/Yekaterinburg', 'Asia/Omsk', 'Asia/Novosibirsk', 'Asia/Barnaul', 'Asia/Tomsk', 'Asia/Krasnoyarsk', 'Asia/Irkutsk', 'Asia/Chita', 'Asia/Yakutsk', 'Asia/Khabarovsk', 'Asia/Vladivostok', 'Asia/Sakhalin', 'Asia/Magadan', 'Asia/Srednekolymsk', 'Asia/Kamchatka', 'Asia/Anadyr'];
    const chinaZones = ['Asia/Shanghai', 'Asia/Chongqing', 'Asia/Harbin', 'Asia/Urumqi', 'Asia/Hong_Kong', 'Asia/Macau'];
    
    if (russianZones.includes(tz)) return 'ru';
    if (chinaZones.includes(tz)) return 'cn';
  } catch (e) {}

  return 'en';
};

export default function App() {
  const achievementsRef = React.useRef<AchievementSystemHandle>(null);
  const settingsRef = React.useRef<HTMLDivElement>(null);
  const langRef = React.useRef<HTMLDivElement>(null);
  const [lang, setLang] = useState<Language>(detectInitialLanguage);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [gamesEnabled, setGamesEnabled] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [isPlayMode, setIsPlayMode] = useState(false);
  const [activeGame, setActiveGame] = useState<'snake' | 'pong' | 'space'>(() => {
    const r = Math.random();
    if (r < 0.33) return 'snake';
    if (r < 0.66) return 'pong';
    return 'space';
  });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [snakeScore, setSnakeScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);

  const [pongScore, setPongScore] = useState(0);
  const [pongAiScore, setPongAiScore] = useState(0);

  const [spaceScore, setSpaceScore] = useState(0);
  const [spaceAiScore, setSpaceAiScore] = useState(0);

  const [isMobile, setIsMobile] = useState(false);
  const [contactTrigger, setContactTrigger] = useState(0);
  const [copyrightReactions, setCopyrightReactions] = useState<{ id: number; x: number; y: number; char: string }[]>([]);

  const handleCopyrightClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    
    // Randomize appearance within the button's bounds
    const getRandomX = () => rect.left + Math.random() * rect.width;
    const getRandomY = () => rect.top + Math.random() * rect.height;
    
    const reaction1 = { 
      id: Date.now(), 
      x: getRandomX(), 
      y: getRandomY(), 
      char: '👍', 
      offset: (Math.random() - 0.5) * 60 
    };
    const reaction2 = { 
      id: Date.now() + 1, 
      x: getRandomX(), 
      y: getRandomY(), 
      char: '❤️', 
      offset: (Math.random() - 0.5) * 60 
    };
    
    setCopyrightReactions(prev => [...prev, reaction1, reaction2]);
    
    setTimeout(() => {
      setCopyrightReactions(prev => prev.filter(r => r.id !== reaction1.id && r.id !== reaction2.id));
    }, 2000);
  };

  // Achievement Triggers
  useEffect(() => {
    const isFirstRun = !localStorage.getItem('ach_lang_init');
    if (!isFirstRun) achievementsRef.current?.unlock('change_lang');
    localStorage.setItem('ach_lang_init', 'true');
  }, [lang]);

  useEffect(() => {
    const isFirstRun = !localStorage.getItem('ach_theme_init');
    if (!isFirstRun) achievementsRef.current?.unlock('toggle_theme');
    localStorage.setItem('ach_theme_init', 'true');
  }, [theme]);

  useEffect(() => {
    const isFirstRun = !localStorage.getItem('ach_game_init');
    if (!isFirstRun) achievementsRef.current?.unlock('change_game');
    localStorage.setItem('ach_game_init', 'true');
  }, [activeGame]);

  useEffect(() => {
    if (!gamesEnabled) achievementsRef.current?.unlock('disable_games');
    else {
      const wasDisabled = localStorage.getItem('ach_games_disabled');
      if (wasDisabled === 'true') achievementsRef.current?.unlock('toggle_power_on');
    }
    localStorage.setItem('ach_games_disabled', (!gamesEnabled).toString());
  }, [gamesEnabled]);

  useEffect(() => {
    if (snakeScore > 0) achievementsRef.current?.unlock('snake_point');
  }, [snakeScore]);

  useEffect(() => {
    if (pongScore > 0) achievementsRef.current?.unlock('pong_point');
  }, [pongScore]);

  useEffect(() => {
    if (spaceScore > 0) achievementsRef.current?.unlock('space_point');
  }, [spaceScore]);

  useEffect(() => {
    // Reset all scores when game changes
    setSnakeScore(0);
    setAiScore(0);
    setPongScore(0);
    setPongAiScore(0);
    setSpaceScore(0);
    setSpaceAiScore(0);
  }, [activeGame]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024); // Covering both mobile and tablet as requested earlier
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('portfolio-lang', lang);
  }, [lang]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSettingsOpen && settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
      if (isLangOpen && langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };

    if (isSettingsOpen || isLangOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSettingsOpen, isLangOpen]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const t = TRANSLATIONS[lang];
  const skills = GET_SKILLS(lang);
  const projects = GET_PROJECTS(lang);

  return (
    <>
      {/* Background Glow */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 opacity-20 transition-opacity duration-300 hidden lg:block"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, var(--accent), transparent 70%)`,
        }}
      />

      {/* Interactive Games */}
      <AnimatePresence mode="wait">
        {gamesEnabled && activeGame === 'snake' && (
          <motion.div
            key="snake-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SnakeGame onScoreChange={setSnakeScore} onAIScoreChange={setAiScore} soundEnabled={isSoundEnabled} />
          </motion.div>
        )}
        {gamesEnabled && activeGame === 'pong' && (
          <motion.div
            key="pong-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PongGame onScoreChange={setPongScore} onAIScoreChange={setPongAiScore} soundEnabled={isSoundEnabled} />
          </motion.div>
        )}
        {gamesEnabled && activeGame === 'space' && (
          <motion.div
            key="space-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SpaceInvadersGame onScoreChange={setSpaceScore} onAIScoreChange={setSpaceAiScore} soundEnabled={isSoundEnabled} />
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="relative z-10 min-h-screen lg:h-screen lg:overflow-hidden flex flex-col p-4 md:p-6 lg:p-10 max-w-[1440px] mx-auto gap-6 lg:gap-8">
        <AchievementSystem ref={achievementsRef} lang={lang} />
        {/* Header */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end pb-6 border-b border-[var(--glass-border)] gap-6 perspective-1000 relative z-[70]">
        <div className="name-brand w-full lg:w-auto">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tighter uppercase leading-tight">
            {t.first_name}<span className="text-[var(--accent)] font-black"> {t.last_name}</span>
          </h1>
          <div className="text-[10px] sm:text-xs md:text-sm text-[var(--text-dim)] mt-1 tracking-wider font-bold uppercase opacity-80 max-w-full overflow-hidden text-ellipsis">
            {t.role}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 md:gap-6 w-full lg:w-auto justify-between lg:justify-end">
          {/* Theme & Language Switchers */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button 
              onClick={() => {
                toggleTheme();
                sounds.init();
              }}
              className="p-2 rounded-full header-3d-wrapper text-[var(--accent)] transition-all"
              title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Language Switcher Dropdown */}
            <div className="relative" ref={langRef}>
              <button 
                onClick={() => {
                  setIsLangOpen(!isLangOpen);
                  sounds.init();
                }}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 header-3d-wrapper relative z-[90] ${
                  isLangOpen 
                    ? 'bg-[var(--accent)] text-black shadow-[0_0_20px_var(--accent)]' 
                    : 'text-[var(--accent)] hover:bg-white/5 opacity-80 hover:opacity-100'
                }`}
                title="Select Language"
              >
                <Languages className={`w-4 h-4 ${isLangOpen ? 'animate-pulse' : ''}`} />
              </button>

              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-3 w-40 sleek-glass rounded-2xl p-2 border border-[var(--glass-border)] shadow-2xl z-[10001] flex flex-col gap-1"
                  >
                    {[
                      { code: 'en', label: 'English' },
                      { code: 'ru', label: 'Русский' },
                      { code: 'cn', label: '中文' },
                      { code: 'es', label: 'Español' },
                      { code: 'fr', label: 'Français' },
                      { code: 'hi', label: 'हिन्दी' },
                      { code: 'ar', label: 'العربية' }
                    ].map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLang(l.code as Language);
                          setIsLangOpen(false);
                        }}
                        className={`w-full px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider text-left transition-all ${
                          lang === l.code 
                            ? 'bg-[var(--accent)] text-black shadow-lg cursor-default' 
                            : 'text-[var(--text-dim)] hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Game & Score Switcher */}
            <div className="flex items-center gap-3 relative z-[80]">
              <motion.div 
                onClick={() => setActiveGame(prev => {
                  if (prev === 'snake') return 'pong';
                  if (prev === 'pong') return 'space';
                  return 'snake';
                })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative hidden md:flex items-center header-3d-wrapper rounded-full p-1 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-4 px-4 py-1.5">
                  <div className="flex items-center gap-1.5 mr-1">
                    {activeGame === 'snake' && (
                      <>
                        <span className="text-xs">🐍</span>
                        <span className="text-xs">🍎</span>
                      </>
                    )}
                    {activeGame === 'pong' && (
                      <>
                        <span className="text-xs">🏓</span>
                        <span className="text-xs">⚽</span>
                      </>
                    )}
                    {activeGame === 'space' && (
                      <>
                        <span className="text-xs">🚀</span>
                        <span className="text-xs">👾</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-[var(--accent)] tracking-widest">
                        {activeGame === 'snake' ? snakeScore : activeGame === 'pong' ? pongScore : spaceScore}
                      </span>
                      <span className="text-[10px] opacity-70 uppercase font-bold">You</span>
                    </div>
                    <div className="w-[1px] h-3 bg-[var(--glass-border)]" />
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] opacity-70 uppercase font-bold">AI</span>
                      <span className="text-xs font-black text-[#FF00FF] tracking-widest">
                        {activeGame === 'snake' ? aiScore : activeGame === 'pong' ? pongAiScore : spaceAiScore}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tooltip (Positioned Above) */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-4 sleek-glass rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[60] pointer-events-none scale-95 group-hover:scale-100 border border-[var(--glass-border)] shadow-2xl">
                  <div className="text-[10px] font-black uppercase text-[var(--accent)] mb-2 tracking-widest">
                    {activeGame === 'snake' ? t.game_snake : activeGame === 'pong' ? t.game_pong : t.game_space}
                  </div>
                  <div className="text-xs text-white/90 leading-relaxed font-medium mb-3">
                    {activeGame === 'snake' ? t.snake_rules : activeGame === 'pong' ? t.pong_rules : t.space_rules}
                  </div>
                  <div className="pt-3 border-t border-[var(--glass-border)] flex items-center justify-between">
                    <span className="text-[10px] font-bold opacity-60 uppercase whitespace-nowrap">Click to change game</span>
                  </div>
                </div>
              </motion.div>

              {/* Settings Dropdown (Separated to avoid click interception) */}
              <div className="relative" ref={settingsRef}>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSettingsOpen(!isSettingsOpen);
                  }}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 header-3d-wrapper relative z-[90] ${
                    isSettingsOpen 
                      ? 'bg-[var(--accent)] text-black shadow-[0_0_20px_var(--accent)]' 
                      : 'text-[var(--accent)] hover:bg-white/5 opacity-80 hover:opacity-100'
                  }`}
                  title="Game Settings"
                >
                  <Settings className={`w-4 h-4 ${isSettingsOpen ? 'animate-spin-slow' : ''}`} />
                </button>

                <AnimatePresence>
                  {isSettingsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-3 w-64 sleek-glass rounded-2xl p-4 border border-[var(--glass-border)] shadow-2xl z-[10001]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="text-[10px] font-black uppercase text-[var(--accent)] mb-4 tracking-[0.2em] flex items-center gap-2">
                        <Settings className="w-3 h-3" />
                        <span>Control Panel</span>
                      </div>

                      <div className="flex flex-col gap-3">
                        {/* Toggle Games */}
                        <div className="flex items-center justify-between group/row">
                          <div className="flex items-center gap-2">
                            <Gamepad2 className={`w-3.5 h-3.5 ${gamesEnabled ? 'text-[var(--accent)]' : 'text-zinc-500'}`} />
                            <span className={`text-[11px] font-bold uppercase tracking-wider ${gamesEnabled ? 'text-white' : 'text-zinc-500'}`}>Background Games</span>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setGamesEnabled(!gamesEnabled);
                            }}
                            className={`w-8 h-4 rounded-full relative transition-colors duration-300 ${gamesEnabled ? 'bg-[var(--accent)]' : 'bg-zinc-700'}`}
                          >
                            <motion.div 
                              animate={{ x: gamesEnabled ? 16 : 2 }}
                              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-sm"
                            />
                          </button>
                        </div>

                        {/* Toggle Sound */}
                        <div className="flex items-center justify-between group/row">
                          <div className="flex items-center gap-2">
                            {isSoundEnabled ? <Volume2 className="w-3.5 h-3.5 text-green-400" /> : <VolumeX className="w-3.5 h-3.5 text-zinc-500" />}
                            <span className={`text-[11px] font-bold uppercase tracking-wider ${isSoundEnabled ? 'text-white' : 'text-zinc-500'}`}>Game Sounds</span>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              const newState = !isSoundEnabled;
                              setIsSoundEnabled(newState);
                              if (newState) {
                                sounds.init();
                              }
                            }}
                            className={`w-8 h-4 rounded-full relative transition-colors duration-300 ${isSoundEnabled ? 'bg-green-500' : 'bg-zinc-700'}`}
                          >
                            <motion.div 
                              animate={{ x: isSoundEnabled ? 16 : 2 }}
                              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-sm"
                            />
                          </button>
                        </div>

                        {/* Toggle Play Mode */}
                        <div className="flex items-center justify-between group/row">
                          <div className="flex items-center gap-2">
                            {isPlayMode ? <EyeOff className="w-3.5 h-3.5 text-purple-400" /> : <Eye className="w-3.5 h-3.5 text-zinc-500" />}
                            <span className={`text-[11px] font-bold uppercase tracking-wider ${isPlayMode ? 'text-white' : 'text-zinc-500'}`}>Play Mode</span>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsPlayMode(!isPlayMode);
                            }}
                            className={`w-8 h-4 rounded-full relative transition-colors duration-300 ${isPlayMode ? 'bg-purple-500' : 'bg-zinc-700'}`}
                          >
                            <motion.div 
                              animate={{ x: isPlayMode ? 16 : 2 }}
                              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-sm"
                            />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <motion.a 
            key={`${contactTrigger}-${snakeScore}-${aiScore}-${pongScore}-${pongAiScore}-${spaceScore}-${spaceAiScore}`}
            href="https://t.me/xrman"
            target="_blank"
            rel="noopener noreferrer"
            className="status-pill shine-effect gap-2 cursor-pointer scale-90 sm:scale-100 origin-right"
            animate={isMobile ? {} : { 
              rotateZ: [0, -10, 10, -10, 10, 0],
              rotateX: [0, 25, 0],
              scale: contactTrigger > 0 ? [1, 1.3, 1, 1.2, 1] : [1, 1.15, 1],
              y: [0, -10, 0]
            }}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95, y: 0 }}
            transition={{ 
              duration: 0.6, 
              ease: "backOut"
            }}
          >
            <Send className="w-4 h-4" />
            <span>{t.status}</span>
          </motion.a>
        </div>
      </header>

      <div className={`flex-1 flex flex-col lg:grid lg:grid-cols-[320px_1fr] gap-6 lg:gap-8 overflow-hidden transition-all duration-700 ${isPlayMode ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
        {/* Sidebar */}
        <aside className="flex flex-col gap-6 overflow-y-auto lg:pr-2 scrollbar-none">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="sleek-glass rounded-2xl p-6 flex flex-col gap-8"
          >
            {skills.map((cat) => (
              <div key={cat.category} className="skill-cat">
                <h3 className="text-xs uppercase font-extrabold tracking-[0.2em] text-[var(--text-dim)] mb-4 flex items-center gap-3 after:content-[''] after:flex-1 after:h-[1px] after:bg-[var(--glass-border)]">
                  {cat.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map(item => (
                    <span key={item} className="tag whitespace-normal text-left">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="sleek-glass rounded-2xl p-6"
          >
            <div className="text-xs uppercase font-extrabold tracking-widest text-[var(--text-dim)] mb-4 opacity-60">{t.experience_title}</div>
            <div className="text-sm leading-relaxed text-[var(--text-dim)]">
              {t.experience.map((exp, i) => (
                <p key={i} className="mb-3">
                  <span className="text-[var(--accent)] font-extrabold">{exp.highlight}</span> {exp.text}
                </p>
              ))}
            </div>
          </motion.div>
        </aside>

        {/* Main Feed - Projects */}
        <main className="flex-1 overflow-y-auto pr-0 lg:pr-4">
          <h2 className="text-sm uppercase font-black tracking-[0.3em] text-[var(--accent)] mb-8 opacity-80 flex items-center gap-4">
            <Briefcase className="w-4 h-4" /> {t.projects_title}
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--glass-border)] to-transparent" />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 pb-10">
            {projects.map((project, idx) => (
              <ProjectCard 
                key={project.title}
                project={project}
                idx={idx}
                contributionsLabel={t.contributions_label}
                onWatchVideo={() => achievementsRef.current?.unlock('watch_video')}
              />
            ))}
          </div>

          {/* Treasure Interactive */}
          <TreasureChest 
            onOpen={() => achievementsRef.current?.unlock('chest_open')} 
            onBackToTop={() => achievementsRef.current?.unlock('back_to_top')} 
          />
        </main>
      </div>

      {/* Footer */}
      <footer className="footer-area sleek-glass rounded-2xl p-6 md:px-10 flex flex-col md:flex-row justify-between items-center gap-8 mb-4">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
          <SlotMachine 
            soundEnabled={isSoundEnabled}
            onWin={() => {
              setContactTrigger(prev => prev + 1);
              achievementsRef.current?.unlock('slot_win');
            }} 
          />
          <div className="flex flex-col gap-2">
            <motion.div 
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyrightClick}
              className="text-[var(--text-dim)] text-xs md:text-sm font-black tracking-widest uppercase copyright-badge shine-effect-hover active:scale-95 transition-transform"
            >
              © 2026 ALEKSANDR KOPANEV
            </motion.div>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          {CONTACTS.map((contact, index) => (
            <a 
              key={contact.label} 
              href={contact.url} 
              target="_blank" 
              rel="noopener noreferrer"
              title={contact.label}
              onClick={() => {
                achievementsRef.current?.unlock('click_contact');
                achievementsRef.current?.unlock('f_key_click');
              }}
              className={`kb-key w-14 h-14 group transition-all duration-300 ${contact.hoverBg} ${contact.shadow} border-white/5 hover:border-transparent shadow-lg`}
            >
              <span className="kb-key-label !text-white/20 group-hover:opacity-0 transition-opacity">F{index + 1}</span>
              <div className={`${contact.color} group-hover:!text-white transform group-hover:scale-110 transition-all`}>
                {React.cloneElement(contact.icon as React.ReactElement, { className: "w-6 h-6" })}
              </div>
            </a>
          ))}
        </div>
      </footer>

      {/* Floating Reactions Portal (moved to root to fix positioning) */}
      <AnimatePresence>
        {copyrightReactions.map(reaction => (
          <motion.div
            key={reaction.id}
            initial={{ opacity: 0, scale: 0.5, y: reaction.y, x: reaction.x }}
            animate={{ 
              opacity: [0, 1, 1, 0], 
              scale: [0.5, 1.5, 1.8, 1.2], 
              y: reaction.y - 120, 
              x: reaction.x + (reaction as any).offset 
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            className="fixed pointer-events-none z-[9999] text-3xl select-none"
            style={{ left: 0, top: 0 }}
          >
            {reaction.char}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  </>
);
}
