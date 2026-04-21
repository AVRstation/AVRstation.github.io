import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SnakeGame } from './components/SnakeGame';
import { PongGame } from './components/PongGame';
import { SpaceInvadersGame } from './components/SpaceInvadersGame';
import { ProjectCard } from './components/ProjectCard';
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
  Moon
} from 'lucide-react';

const TRANSLATIONS = {
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
  }
};

const GET_SKILLS = (lang: 'ru' | 'en' | 'cn') => [
  {
    category: TRANSLATIONS[lang].skills.producer,
    items: lang === 'cn'
      ? ["全周期 IT 生产管理", "扩展数字生态系统和基础设施", "战略规划和风险缓解", "交付优化和卓越质量"]
      : lang === 'ru' 
        ? ["Управление полным циклом IT-производства", "Масштабирование цифровых экосистем и инфраструктуры", "Стратегическое планирование и риск-менеджмент", "Оптимизация Delivery-процессов и качества"]
        : ["Full-cycle IT production management", "Scaling digital ecosystems & infrastructure", "Strategic planning & risk mitigation", "Delivery optimization & quality excellence"],
    icon: <Briefcase className="w-5 h-5 text-blue-400" />
  },
  {
    category: TRANSLATIONS[lang].skills.gamedev,
    items: lang === 'cn'
      ? ["设计高转化率的游戏循环", "新兴技术的研究与集成 (AI/XR)", "游戏经济和获利平衡", "独特的沉浸式 UX 架构"]
      : lang === 'ru'
        ? ["Проектирование высококонверсионных игровых циклов", "R&D и интеграция передовых технологий (AI/XR)", "Балансировка игровой экономики и монетизации", "Архитектура уникального пользовательского опыта (UX)"]
        : ["Design of high-conversion game loops", "R&D & integration of emerging tech (AI/XR)", "Game economy & monetization balancing", "Unique immersive UX architecture"],
    icon: <Gamepad2 className="w-5 h-5 text-purple-400" />
  },
  {
    category: TRANSLATIONS[lang].skills.po,
    items: lang === 'cn'
      ? ["最大化产品价值和投资回报率 (ROI)", "数据驱动的业务流程自动化", "产品战略和路线图编排", "跨职能团队建设和成长"]
      : lang === 'ru'
        ? ["Максимизация ценности продукта и ROI", "Data-driven автоматизация бизнес-процессов", "Управление Roadmaps и стратегией развития", "Формирование и рост кросс-функциональных команд"]
        : ["Maximizing product value & ROI", "Data-driven business process automation", "Product strategy & roadmap orchestration", "Cross-functional team building & growth"],
    icon: <Layers className="w-5 h-5 text-emerald-400" />
  }
];

const GET_PROJECTS = (lang: 'ru' | 'en' | 'cn') => [
  {
    title: "STRIDE: Fates",
    description: lang === 'cn'
      ? "剧情驱动的 VR 跑酷射击游戏。探索反乌托邦大都市，为玩家提供极高的战术移动自由度和混合现实 (MR) 体验。"
      : lang === 'ru'
        ? "Сюжетный VR-экшен с элементами паркура. Исследование антиутопичного мегаполис, предлагающее игрокам абсолютную свободу тактических передвижений."
        : "Story-driven VR parkour action. Explores a dystopian metropolis while offering players absolute freedom in tactical movement.",
    whatDone: lang === 'cn'
      ? "实现混合现实模式，设计游戏循环，协调开发与叙事团队之间的协作。"
      : lang === 'ru'
        ? "Реализации Mix Reality режима, дизайн игрового цикла, координация взаимодействия между командами разработки и нарратива."
        : "Mixed Reality mode implementation, game loop design, and cross-team coordination between development and narrative units.",
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
    description: lang === 'cn'
      ? "竞技性多玩家 VR 射击游戏，在此移动能力和跑酷成为关键的战术优势。"
      : lang === 'ru'
        ? "Соревновательный многопользовательский VR-шутер, где мобильность и паркур становятся главным тактическим преимуществом игрока."
        : "Competitive multiplayer VR shooter where high mobility and parkour maneuvers become primary tactical advantages.",
    whatDone: lang === 'cn'
      ? "设计和调优网络 mechanics，开发子模式，并对游戏平衡进行全面的算法计算和迭代测试。"
      : lang === 'ru'
        ? "Проектирование и тюнинг сетевых механик, разработка под режимов, полный расчет и итеративная настройка игрового баланса."
        : "Network mechanics design & tuning, sub-mode development, and comprehensive algorithmic game balance iteration.",
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
    description: lang === 'cn'
      ? "战术性团队 VR 射击游戏，高度强调物理互动、环境破坏和动态近战体验。"
      : lang === 'ru'
        ? "Тактический командный VR-шутер с глубоким упором на физическое взаимодействие объектов, разрушаемость и динамику ближнего боя."
        : "Tactical team VR shooter with a strong focus on physical object interactions, destructibility, and dynamic close combat.",
    whatDone: lang === 'cn'
      ? "设计物理交互、创建战术地图并管理产品的全生命周期开发。"
      : lang === 'ru'
        ? "Проектирование физических взаимодействий, создание тактических карт, управление полным циклом разработки продукта."
        : "Designing physical interactions, tactical map creation, and full product development lifecycle management.",
    stack: ["Unity", "Physics-based", "Action"],
    youtubeId: "RAJVJAjBX8c",
    links: [
      { name: "Meta Quest", url: "https://www.meta.com/experiences/stack/5366874313435765" },
      { name: "Pico", url: "https://store-global.picoxr.com/global/detail/1/7339799345019273268" }
    ]
  },
  {
    title: "Deadhook",
    description: lang === 'cn'
      ? "具有 Roguelike 元素和先进钩爪移动系统的动态 VR 射击游戏。"
      : lang === 'ru' 
        ? "Динамичный VR-шутер с элементами Roguelike и продвинутой системой перемещения с помощью крюка-кошки."
        : "Dynamic VR shooter featuring Roguelike elements and an advanced grappling hook movement system.",
    whatDone: lang === 'cn'
      ? "设计核心机制、Roguelike 循环（元进度、武器和敌人平衡），并筹备 Meta Quest、SteamVR 和 PSVR2 平台发布。"
      : lang === 'ru'
        ? "Геймдизайн кор-механик, проектирование Roguelike-цикла (мета-прогрессия, баланс оружия и противников), подготовка продукта к релизу на Meta Quest, SteamVR и PSVR2."
        : "Core mechanics design, Roguelike cycle planning (meta-progression, weapon/enemy balancing), and multi-platform release preparation (Meta Quest, SteamVR, PSVR2).",
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
    description: lang === 'cn'
      ? "专门为名为 AGAINST 的节奏射击游戏设计的专业工具 and 强大的关卡编辑器，旨在支持 UGC 社区。"
      : lang === 'ru'
        ? "Профессиональный инструментарий и мощный редактор уровней, созданный для поддержки UGC-сообщества боевого ритм-шутера AGAINST."
        : "Professional toolset and powerful level editor built to support the UGC community of the rhythm combat shooter AGAINST.",
    whatDone: lang === 'cn'
      ? "设计编辑器 UX/UI，为模组制作者开发客户端，并建立稳定的 UGC 内容共享基础设施。"
      : lang === 'ru'
        ? "Проектирование UX/UI редактора, разработка клиента для моддеров, выстраивание надежной инфраструктуры для создания и обмена пользовательским контентом."
        : "UX/UI design of the editor, developing the modder client, and building a robust infrastructure for UGC creation and exchange.",
    stack: ["Editor Tooling", "Unity SDK", "User Generated Content"],
    youtubeId: "48VhkwMV80Y",
    links: [
      { name: "Steam", url: "https://store.steampowered.com/app/1584840/AGAINST" },
      { name: "Pico", url: "https://store-global.picoxr.com/ru/detail/1/3744" }
    ]
  },
  {
    title: "SPLIT FPV: Drone Racing",
    description: lang === 'cn'
      ? "免费且真实的 FPV 模拟器，用于提高无人机驾驶技能。包含精细的飞行物理和专门的战斗任务。"
      : lang === 'ru' 
        ? "Бесплатный реалистичный FPV-симулятор для прокачки навыков управления дроном. Включает проработанную физику полета и специализированные боевые миссии."
        : "Free realistic FPV simulator to sharpen drone piloting skills. Features sophisticated flight physics and specialized combat missions.",
    whatDone: lang === 'cn'
      ? "设计游戏玩法 and 进度系统，调优真实飞行物理，集成遥控器和手柄支持。"
      : lang === 'ru'
        ? "Проектирование геймплея и прогрессии, тюнинг реалистичной физики полета, интеграция поддержки пультов и геймпадов."
        : "Gameplay & progression design, realistic flight physics tuning, transmitter and gamepad integration.",
    stack: ["FPV Simulator", "Unity", "Gamedesign"],
    youtubeId: "73QgqnQXSvw",
    links: [
      { name: "Steam", url: "https://store.steampowered.com/app/4348580/SPLIT_FPV_Drone_Racing/" }
    ]
  },
  {
    title: "Shooter VR: LBE - Free Roam",
    description: lang === 'cn'
      ? "专为线下体验店设计的动态 LBE 自由移动射击游戏 (Free Roam VR)，通过内置关卡创建工具提供极高的重玩价值。"
      : lang === 'ru'
        ? "Динамичный LBE-шутер со свободным перемещением (Free Roam VR) для офлайн-арен, обеспечивающий высокую реиграбельность за счет встроенных инструментов создания уровней."
        : "Dynamic LBE Free Roam VR shooter for location-based entertainment, offering high replayability via built-in level creation tools.",
    whatDone: lang === 'cn'
      ? "主导内置地图生成器 and 关卡编辑器的开发，设计游戏循环，针对多玩家会话进行平衡调整。"
      : lang === 'ru'
        ? "Руководство разработкой встроенного генератора и редактора карт, проектирование игрового цикла, настройка баланса для многопользовательских сессий."
        : "Leading the development of built-in map generator and editor, game loop design, and multiplayer session balancing.",
    stack: ["Multiplayer", "LBE", "Free Roam VR"],
    youtubeId: "I8B3NarPd2E",
    links: []
  },
  {
    title: "Football VR: LBE - Free Roam",
    description: lang === 'cn'
      ? "沉浸式足球模拟器，利用全身追踪技术将球员的真实动作转化为虚拟球场表现。"
      : lang === 'ru' 
        ? "Иммерсивный симулятор футбола, переносящий реальные движения игрока на виртуальное поле с использованием технологии Full Body Tracking." 
        : "Immersive football simulator translating real-world movements onto a virtual pitch using Full Body Tracking technology.",
    whatDone: lang === 'cn'
      ? "集成复杂的全身追踪系统，同步物理 and 虚拟对象，管理开发流程。"
      : lang === 'ru'
        ? "Интеграция комплексных систем трекинга всего тела, синхронизация физических и виртуальных объектов, управление процессами разработки."
        : "Integration of complex body tracking systems, physical-to-virtual object synchronization, and development process management.",
    stack: ["Full Body Tracking", "Unity", "Gamedesign"],
    youtubeId: "sSeCxxwv-A8",
    links: []
  },
  {
    title: "Rythm VR: Sports",
    description: lang === 'cn'
      ? "结合了拳击、网球和双剑战斗机制与生成式音乐系统的 VR 跨界作品。"
      : lang === 'ru' 
        ? "VR-кроссовер, органично объединяющий механики бокса, тенниса и боя на парных мечах с системой генеративного музыкального сопровождения."
        : "VR crossover seamlessly merging boxing, tennis, and dual-sword combat mechanics with a generative music system.",
    whatDone: lang === 'cn'
      ? "开发概念，将运动动作模式与节奏机制平衡，并根据音频序列调优关卡生成算法。"
      : lang === 'ru'
        ? "Разработка концепции, балансировка спортивных паттернов движений с ритм-механиками, настройка алгоритмов генерации уровня под аудиоряд."
        : "Concept development, balancing sports movement patterns with rhythm mechanics, and tuning level generation algorithms to audio tracks.",
    stack: ["Generative Music", "Rhythm Game", "Combat Sports"],
    youtubeId: "096o56nwQMo",
    links: []
  },
  {
    title: "Fencer VR",
    description: lang === 'cn'
      ? "专业 VR 击剑模拟器，具有物理精准的剑刃行为 and 对运动员姿势的精确追踪。"
      : lang === 'ru'
        ? "Профессиональный VR-симулятор фехтования, отличающийся физически корректным поведением клинка и точнейшим отслеживанием стойки спортсмена."
        : "Professional VR fencing simulator featuring physics-accurate blade behaviors and ultra-precise athlete posture tracking.",
    whatDone: lang === 'cn'
      ? "开发各种模式、游戏循环 and 任务，并为 Meta Quest 平台版本做准备。"
      : lang === 'ru'
        ? "Разработка режимов, игрового цикла и заданий, подготовка продукта к релизу на Meta Quest."
        : "Developing game modes, loop logic, and tasks, plus platform preparation for the Meta Quest release.",
    stack: ["Physics Engine", "Precision Tracking", "Sports Sim"],
    youtubeId: "4DZVP613WoQ",
    links: [
      { name: "Meta Quest", url: "https://www.oculus.com/experiences/quest/4007385822625371/" }
    ]
  },
  {
    title: "Biathlon VR Trainer",
    description: lang === 'cn'
      ? "面向专业冬两项运动员的专用训练设备。包含精准的弹道建模 and 实际物理负载传感器集成。"
      : lang === 'ru'
        ? "Специализированный спортивный тренажер для биатлонистов. Включает точное моделирование баллистики и интеграцию датчиков реальной физической нагрузки."
        : "Specialized sports trainer for biathletes. Includes precise ballistics modeling and real physical load sensor integration.",
    whatDone: lang === 'cn'
      ? "向专业教练收集需求，开发结果分析模块，并针对真实步枪控制器的射击 and 装填进行调优。"
      : lang === 'ru'
        ? "Сбор требований у профессиональных тренеров, разработка аналитического модуля для оценки результатов, настройка реальной винтовки-контроллера для стрельбы и перезарядки."
        : "Requirement gathering from pro coaches, analytical results module development, and hardware tuning for a real rifle controller.",
    stack: ["Training Sim", "Simulation", "Analytics"],
    youtubeId: "MyqNSP_e0BE",
    links: []
  },
  {
    title: "Education VR Box",
    description: lang === 'cn'
      ? "为教育机构提供的端到端独立软硬件 VR 方案，配备集中控制系统。"
      : lang === 'ru'
        ? "Автономный аппаратно-программный VR-комплекс «под ключ» для образовательных учреждений с системой централизованного контроля."
        : "Standalone hardware/software VR turnkey solution for educational institutions with a centralized control system.",
    whatDone: lang === 'cn'
      ? "集成软硬件 (EdTech)，开发跨设备网络批量内容启动系统，并统筹教学模块制作。"
      : lang === 'ru'
        ? "Интеграция аппаратного и программного обеспечения (EdTech), разработка системы одновременного запуска контента на сети устройств, продюсирование обучающих модулей."
        : "Hardware/Software EdTech integration, multi-device bulk content management, and educational module producing.",
    stack: ["EdTech", "Hardware/Software Integration", "Education"],
    youtubeId: "BmsaeoKpcqU",
    links: []
  },
  {
    title: "Nevskiy Simulator",
    description: lang === 'cn'
      ? "为大型展台设计的活动用历史剑术模拟器，针对高带宽交互体验进行了优化。"
      : lang === 'ru'
        ? "Ивентный симулятор исторического боя на мечах, оптимизированный для высокой проходимости и вау-эффекта на крупных выставочных стендах."
        : "Event-based historical sword fighting simulator optimized for high throughput and high-impact tradeshow experiences.",
    whatDone: lang === 'cn'
      ? "设计短小沉浸式体验流程，为普通大众优化 UX 路径，并负责展台的技术搭建。"
      : lang === 'ru'
        ? "Проектирование коротких иммерсивных сессий, адаптация и оптимизация UX для неподготовленных пользователей, технический сетап выставочного стенда."
        : "Designing short immersive sessions, UX optimization for lay users, and technical setup for exhibition stands.",
    stack: ["Exhibition Tech", "Sword Fighting", "Immersive Experience"],
    youtubeId: "vbz74nwQv7M",
    links: []
  },
  {
    title: "VR Weapons Museum",
    description: lang === 'cn'
      ? "具有高度详细且真实的游戏体验的互动式 VR 枪械百科全书，包含真实的组装/拆解 and 物理射击体验。"
      : lang === 'ru'
        ? "Интерактивная VR-энциклопедия стрелкового оружия with высокой детализацией исторически достоверной сборки/разборки и реалистичной физикой стрельбы."
        : "Interactive VR museum of firearms with highly detailed, historically accurate assembly and realistic ballistics.",
    whatDone: lang === 'cn'
      ? "主导历史参考资料的 3D 建模流程，调优互动逻辑，并筹划博物馆内的叙事路径。"
      : lang === 'ru'
        ? "Руководство процессом 3D-моделирования исторических референсов, настройка интерактивных взаимодействий, подготовка сюжетного повествования."
        : "Leading 3D modeling of historical assets, tuning interaction systems, and narrative planning.",
    stack: ["3D Interaction", "History", "VR"],
    youtubeId: "R-btZ92JkaY",
    links: []
  },
  {
    title: lang === 'ru' ? "Проектирование квартиры" : "Apartment Design VR",
    description: lang === 'cn'
      ? "面向房地产开发商及其终端客户的 B2B VR/AR 解决方案，支持实时定制化装修预览。"
      : lang === 'ru'
        ? "B2B VR/AR-решение для презентации объектов недвижимости застройщикам и конечным клиентам с возможностью кастомизации отделки в реальном времени."
        : "B2B VR/AR solution for real estate visualization, allowing developers and clients to customize finishes in real-time.",
    whatDone: lang === 'cn'
      ? "管理开发流程，优化并将建筑 CAD 模型集成到引擎中，并为 VR 演示设计无缝的用户路径。"
      : lang === 'ru'
        ? "Управление разработкой, оптимизация и интеграция архитектурных CAD-моделей в движок, создание бесшовного пользовательского пути для VR-презентаций."
        : "Development management, CAD architectural model optimization and integration, and seamless user journey design for VR tours.",
    stack: ["Real Estate", "VR/AR", "Architecture"],
    youtubeId: "VK1YTMYuse0",
    links: []
  },
  {
    title: "Boxglass VR Cardboards",
    description: lang === 'cn'
      ? "生产实惠的 mobile VR 头显的硬件初创公司市场进入与扩张。"
      : lang === 'ru'
        ? "Вывод на рынок и масштабирование hardware-стартапа по производству доступных мобильных VR-гарнитур."
        : "Market entry and scaling for a hardware startup producing affordable mobile VR headsets.",
    whatDone: lang === 'cn'
      ? "建立制造供应链，组织 B2B 销售，并成功通过了 Works With Google Cardboard 生态系统的认证和集成。"
      : lang === 'ru'
        ? "Выстраивание производственной цепочки, организация B2B-продаж, успешная техническая сертификация и интеграция продуктов с экосистемой Works With Google Cardboard."
        : "Supply chain setup, B2B sales management, and technical certification/integration with the 'Works With Google Cardboard' ecosystem.",
    stack: ["StartUp", "Manufacturing", "B2B"],
    image: "https://static.tildacdn.com/tild3234-6461-4636-b435-643732656430/firm2222.jpg",
    links: [
      { name: lang === 'ru' ? "История Forbes" : "Forbes Story", url: "https://www.forbes.ru/tehnologii/341125-iz-izhevska-v-virtualnuyu-realnost-kak-startap-boxglass-razvivaet-vr-vmeste-s" }
    ]
  }
];

const CONTACTS = [
  { label: "Telegram", value: "@xrman", url: "https://t.me/xrman", icon: <Send className="w-6 h-6" />, color: "bg-blue-600 hover:bg-blue-500" },
  { label: "Email", value: "hello@xrman.dev", url: "mailto:avkopanev@gmail.com", icon: <Mail className="w-6 h-6" />, color: "bg-zinc-800 hover:bg-zinc-700" },
  { label: "LinkedIn", value: "Kopanev Alexandr", url: "https://linkedin.com/in/aleksandr-kopanev-18787b104", icon: <Linkedin className="w-6 h-6" />, color: "bg-blue-700 hover:bg-blue-600" },
  { label: "Discord", value: "xrman", url: "https://discordapp.com/users/258354536287043588/", icon: <Disc className="w-6 h-6" />, color: "bg-indigo-600 hover:bg-indigo-500" }
];

const detectInitialLanguage = (): 'ru' | 'en' | 'cn' => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('portfolio-lang') as 'ru' | 'en' | 'cn';
    if (saved && ['ru', 'en', 'cn'].includes(saved)) return saved;
  }

  if (typeof navigator === 'undefined') return 'en';
  
  const userLangs = (navigator.languages || [navigator.language]).map(l => l.toLowerCase());
  
  // 1. Look for a direct preferred match in the supported set
  for (const lang of userLangs) {
    if (lang.startsWith('ru')) return 'ru';
    if (lang.startsWith('zh')) return 'cn';
    if (lang.startsWith('en')) return 'en';
  }
  
  // 2. Fuzzy mapping for related languages if no direct match was found in the preferred list
  const preferred = userLangs[0] || '';
  if (preferred.startsWith('be') || preferred.startsWith('kk') || preferred.startsWith('uk')) return 'ru';

  // 3. Fallback: Check TimeZone
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
  const [lang, setLang] = useState<'ru' | 'en' | 'cn'>(detectInitialLanguage);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
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
        {activeGame === 'snake' && (
          <motion.div
            key="snake-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SnakeGame onScoreChange={setSnakeScore} onAIScoreChange={setAiScore} />
          </motion.div>
        )}
        {activeGame === 'pong' && (
          <motion.div
            key="pong-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PongGame onScoreChange={setPongScore} onAIScoreChange={setPongAiScore} />
          </motion.div>
        )}
        {activeGame === 'space' && (
          <motion.div
            key="space-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SpaceInvadersGame onScoreChange={setSpaceScore} onAIScoreChange={setSpaceAiScore} />
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="relative z-10 min-h-screen lg:h-screen lg:overflow-hidden flex flex-col p-4 md:p-6 lg:p-10 max-w-[1440px] mx-auto gap-6 lg:gap-8">
      {/* Header */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end pb-6 border-b border-[var(--glass-border)] gap-6 perspective-1000">
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
              onClick={toggleTheme}
              className="p-2 rounded-full bg-[var(--glass)] border border-[var(--glass-border)] text-[var(--accent)] hover:bg-[var(--glass-border)] transition-all"
              title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-[var(--glass)] border border-[var(--glass-border)] rounded-full p-1">
              <button 
                onClick={() => setLang('ru')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${lang === 'ru' ? 'bg-[var(--accent)] text-black' : 'text-[var(--text-dim)] hover:text-white'}`}
              >
                RU
              </button>
              <button 
                onClick={() => setLang('en')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${lang === 'en' ? 'bg-[var(--accent)] text-black' : 'text-[var(--text-dim)] hover:text-white'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLang('cn')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${lang === 'cn' ? 'bg-[var(--accent)] text-black' : 'text-[var(--text-dim)] hover:text-white'}`}
              >
                CN
              </button>
            </div>

            {/* Game & Score Switcher */}
            <motion.div 
              onClick={() => setActiveGame(prev => {
                if (prev === 'snake') return 'pong';
                if (prev === 'pong') return 'space';
                return 'snake';
              })}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative hidden md:flex items-center bg-[var(--glass)] border border-[var(--glass-border)] rounded-full p-1 cursor-pointer hover:border-[var(--accent)] transition-colors z-50"
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
                  <span className="text-[10px] font-bold opacity-60 uppercase">Click to change game</span>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.a 
            key={isMobile ? 'contact-static' : `${snakeScore}-${aiScore}-${pongScore}-${pongAiScore}-${spaceScore}-${spaceAiScore}`}
            href="https://t.me/xrman"
            target="_blank"
            rel="noopener noreferrer"
            className="status-pill gap-2 cursor-pointer scale-90 sm:scale-100 origin-right"
            animate={isMobile ? {} : { 
              rotateZ: [0, -10, 10, -10, 10, 0],
              rotateX: [0, 25, 0],
              scale: [1, 1.15, 1],
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

      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-[320px_1fr] gap-6 lg:gap-8 overflow-hidden">
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
              />
            ))}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="footer-area sleek-glass rounded-2xl p-6 md:px-10 flex flex-col md:flex-row justify-between items-center gap-8 mb-4">
        <div className="flex flex-col gap-2">
          <div className="text-[var(--text-dim)] text-xs md:text-sm font-black tracking-widest uppercase">
            © 2026 ALEKSANDR KOPANEV
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {CONTACTS.map((contact) => (
            <a 
              key={contact.label} 
              href={contact.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`footer-btn px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 hover:scale-105 ${
                contact.label === 'Telegram' 
                  ? 'bg-white text-black' 
                  : 'sleek-glass text-white'
              }`}
            >
              {contact.label}
            </a>
          ))}
        </div>
      </footer>
    </div>
  </>
);
}
