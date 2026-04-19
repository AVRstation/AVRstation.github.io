import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Briefcase, 
  Gamepad2, 
  Layers, 
  MapPin, 
  Send, 
  Mail, 
  ExternalLink, 
  Linkedin,
  Disc,
  Globe
} from 'lucide-react';

const TRANSLATIONS = {
  ru: {
    first_name: "АЛЕКСАНДР",
    last_name: "КОПАНЕВ",
    role: "Senior гейм дизайнер • Product Owner • Креативный продюсер",
    status: "Доступен для проектов",
    experience_title: "ОПЫТ",
    experience: [
      { highlight: "27+ лет", text: "опыта как игрока" },
      { highlight: "12+ лет", text: "в индустрии VR/AR" },
      { highlight: "12+ лет", text: "в геймификации и геймдизайне" },
      { highlight: "9+ лет", text: "в управлении продуктами" },
      { highlight: "8+ лет", text: "в разработке и руководстве творческими командами" },
      { highlight: "5+ лет", text: "в создании и сопровождении проектов в области Искусственного Интеллекта" }
    ],
    projects_title: "Проекты и Кейсы",
    footer_location: "г. Москва, Россия — GMT+3",
    contact_cta_title: "Готовы к следующему технологическому рывку?",
    contact_cta_text: "Давайте обсудим ваш проект, будь то создание метавселенной, сложной сетевой механики или образовательного VR-симулятора.",
    skills: {
      producer: "Продюсер",
      gamedev: "Геймдизайнер",
      po: "Product Owner"
    }
  },
  en: {
    first_name: "Aleksandr",
    last_name: "Kopanev",
    role: "Senior Game Designer • Product Owner • Creative Producer",
    status: "Available for projects",
    experience_title: "EXPERIENCE",
    experience: [
      { highlight: "27+ years", text: "of experience as a game player" },
      { highlight: "12+ years", text: "in VR AR Industry" },
      { highlight: "12+ years", text: "in Gamification and Game Design" },
      { highlight: "9+ years", text: "in Product Management" },
      { highlight: "8+ years", text: "in Development and leading creative teams" },
      { highlight: "5+ years", text: "in creating and following Artificial Intelligence projects" }
    ],
    projects_title: "Projects & Cases",
    footer_location: "Moscow, Russia — GMT+3",
    contact_cta_title: "Ready for the next tech leap?",
    contact_cta_text: "Let's discuss your project, whether it's a metaverse, complex network mechanics, or an educational VR simulator.",
    skills: {
      producer: "Producer",
      gamedev: "Game Designer",
      po: "Product Owner"
    }
  }
};

const GET_SKILLS = (lang: 'ru' | 'en') => [
  {
    category: TRANSLATIONS[lang].skills.producer,
    items: lang === 'ru' 
      ? ["Управление IT-проектами (Agile/Scrum)", "Внедрение и сопровождение IT-решений", "Разработка технической и проектной документации", "Оптимизация и масштабирование цифровых решений"]
      : ["IT Project Management (Agile/Scrum)", "IT Solutions Implementation", "Technical & Project Documentation", "Digital Solutions Optimization & Scaling"],
    icon: <Briefcase className="w-5 h-5 text-blue-400" />
  },
  {
    category: TRANSLATIONS[lang].skills.gamedev,
    items: lang === 'ru'
      ? ["Разработка пользовательских сценариев взаимодействия", "Исследование и адаптация новых технологий (AI, XR, Blockchain)", "Проектирование игровых механик", "Создание концептов и прототипов"]
      : ["UX Interaction Scenarios Development", "Emerging Tech Research (AI, XR, Blockchain)", "Game Mechanics Design", "Concepts & Prototyping"],
    icon: <Gamepad2 className="w-5 h-5 text-purple-400" />
  },
  {
    category: TRANSLATIONS[lang].skills.po,
    items: lang === 'ru'
      ? ["Анализ и автоматизация бизнес-процессов", "Тестирование и контроль качества программных продуктов", "Консультирование и обучение пользователей", "Управление жизненным циклом продукта"]
      : ["Business Process Analysis & Automation", "Software QA & Testing Control", "User Consulting & Training", "Product Lifecycle Management"],
    icon: <Layers className="w-5 h-5 text-emerald-400" />
  }
];

const GET_PROJECTS = (lang: 'ru' | 'en') => [
  {
    title: "SPLIT FPV: Drone Racing",
    description: lang === 'ru' 
      ? "Бесплатный реалистичный FPV-симулятор для прокачки реальных навыков управления дроном. Подключай настоящий пульт, бери в руки геймпад или клавиатуру и отправляйся в небо."
      : "Free realistic FPV simulator to improve real drone piloting skills. Connect a real transmitter, take a gamepad or keyboard and take to the skies.",
    stack: ["FPV Simulation", "Unity", "Transmitter Support"],
    youtubeId: "73QgqnQXSvw",
    links: []
  },
  {
    title: "Football VR",
    description: lang === 'ru' 
      ? "Футбол в виртуальной реальности на реальном поле с трекингом всего тела." 
      : "Virtual reality football on a real field with full body tracking.",
    stack: ["Full Body Tracking", "Unity", "Tracking Systems"],
    youtubeId: "sSeCxxwv-A8",
    links: []
  },
  {
    title: "Rythm VR",
    description: lang === 'ru' 
      ? "Ритм-игра объединяющая спортивные направления бокса, тенниса, парных мечей с генеративной музыкой."
      : "Rhythm game combining box, tennis, dual swords with generative music.",
    stack: ["Generative Music", "Rhythm Game", "Combat Sports"],
    youtubeId: "096o56nwQMo",
    links: []
  },
  {
    title: "STRIDE Multiplayer",
    description: lang === 'ru'
      ? "Многопользовательский VR-паркур шутер. Разработка сетевых механик и игрового баланса."
      : "Multiplayer VR parkour shooter. Network mechanics and game balance development.",
    stack: ["Unity", "VR", "Multiplayer", "C#"],
    youtubeId: "83n7jWFOBE0",
    links: [
      { name: "Oculus", url: "https://www.oculus.com/experiences/quest/4901911359882668" },
      { name: "Steam", url: "https://store.steampowered.com/app/1292040/STRIDE" }
    ]
  },
  {
    title: "STACK",
    description: lang === 'ru'
      ? "Командный шутер в виртуальной реальности с упором на динамику и физическое взаимодействие."
      : "VR team shooter focused on dynamics and physical interaction.",
    stack: ["OpenVR", "Physics-based", "Action"],
    youtubeId: "RAJVJAjBX8c",
    links: [
      { name: "Meta Quest", url: "https://www.meta.com/experiences/stack/5366874313435765" }
    ]
  },
  {
    title: "Against - Map Editor",
    description: lang === 'ru'
      ? "Разработка редактора уровней для боевого ритм-шутера. Инструментарий для творческого сообщества."
      : "Level editor for rhythm-combat shooter. Community creative toolkit.",
    stack: ["Editor Tooling", "Unity SDK", "User Generated Content"],
    youtubeId: "48VhkwMV80Y",
    links: [
      { name: "Steam", url: "https://store.steampowered.com/app/1584840/AGAINST" }
    ]
  },
  {
    title: "Fencer VR",
    description: lang === 'ru'
      ? "Реалистичный симулятор фехтования. Точное отслеживание движений и физически корректное поведение клинка."
      : "Realistic fencing simulator. Precise motion tracking and physics-based blade behavior.",
    stack: ["Physics Engine", "Precision Tracking", "Sports Sim"],
    youtubeId: "4DZVP613WoQ",
    links: [
      { name: "Quest Store", url: "https://www.oculus.com/experiences/quest/4007385822625371/" }
    ]
  },
  {
    title: "Biathlon VR Trainer",
    description: lang === 'ru'
      ? "Профессиональный тренажер для биатлонистов. Моделирование стрельбы и физических нагрузок."
      : "Professional simulator for biathletes. Shooting and physical load modeling.",
    stack: ["Training Sim", "Simulation", "Analytics"],
    youtubeId: "MyqNSP_e0BE",
    links: []
  },
  {
    title: "Education VR Box",
    description: lang === 'ru'
      ? "Автономное VR-решение для школ. Образовательные модули и централизованное управление системой."
      : "Autonomous VR solution for schools. Educational modules and centralized system management.",
    stack: ["EdTech", "Hardware/Software Integration", "Education"],
    youtubeId: "BmsaeoKpcqU",
    links: []
  },
  {
    title: "Nevskiy Simulator",
    description: lang === 'ru'
      ? "Симулятор боя на мечах для выставочных стендов. Интерактивный опыт исторического сражения."
      : "Sword fighting simulator for exhibition stands. Immersive historical battle experience.",
    stack: ["Exhibition Tech", "Sword Fighting", "Immersive Experience"],
    youtubeId: "vbz74nwQv7M",
    links: []
  },
  {
    title: "VR Weapons Museum",
    description: lang === 'ru'
      ? "Интерактивная энциклопедия стрелкового оружия с возможностью детального изучения и стрельбы."
      : "Interactive small arms encyclopedia with detailed study and shooting options.",
    stack: ["3D Interaction", "History", "VR"],
    youtubeId: "R-btZ92JkaY",
    links: []
  },
  {
    title: "Boxglass VR Cardboards",
    description: lang === 'ru'
      ? "Масштабирование VR-стартапа по производству доступных гарнитур. Интеграция с Google Cardboard."
      : "Scaling affordable VR headset startup. Integration with Google Cardboard.",
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

export default function App() {
  const [lang, setLang] = useState<'ru' | 'en'>('ru');
  const t = TRANSLATIONS[lang];
  const skills = GET_SKILLS(lang);
  const projects = GET_PROJECTS(lang);

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden flex flex-col p-4 md:p-6 lg:p-10 max-w-[1440px] mx-auto gap-6 lg:gap-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-6 border-b border-[var(--glass-border)] gap-4">
        <div className="name-brand">
          <div className="text-2xl md:text-3xl font-extrabold tracking-tighter uppercase">
            {t.first_name}<span className="text-[var(--accent)] font-black"> {t.last_name}</span>
          </div>
          <div className="text-[10px] md:text-xs text-[var(--text-dim)] mt-1 tracking-wider font-medium uppercase opacity-80">
            {t.role}
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Language Switcher */}
          <div className="flex items-center bg-[var(--glass)] border border-[var(--glass-border)] rounded-full p-1 self-start sm:self-auto">
            <button 
              onClick={() => setLang('ru')}
              className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${lang === 'ru' ? 'bg-[var(--accent)] text-black' : 'text-[var(--text-dim)] hover:text-white'}`}
            >
              RU
            </button>
            <button 
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${lang === 'en' ? 'bg-[var(--accent)] text-black' : 'text-[var(--text-dim)] hover:text-white'}`}
            >
              EN
            </button>
          </div>

          <div className="status-pill flex items-center gap-2 whitespace-nowrap !border-emerald-500/50 !bg-emerald-500/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400">{t.status}</span>
          </div>
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
                <h3 className="text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--text-dim)] mb-4 flex items-center gap-3 after:content-[''] after:flex-1 after:h-[1px] after:bg-[var(--glass-border)]">
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
            <div className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-dim)] mb-3 opacity-60">{t.experience_title}</div>
            <div className="text-xs leading-relaxed text-zinc-300">
              {t.experience.map((exp, i) => (
                <p key={i} className="mb-2">
                  <span className="text-white font-bold">{exp.highlight}</span> {exp.text}
                </p>
              ))}
            </div>
          </motion.div>
        </aside>

        {/* Main Feed - Projects */}
        <main className="flex-1 overflow-y-auto pr-0 lg:pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 pb-10">
            {projects.map((project, idx) => (
              <motion.div 
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 + 0.2 }}
                className="project-card sleek-glass rounded-2xl overflow-hidden sleek-card-hover group flex flex-col"
              >
                <div className="aspect-video relative overflow-hidden bg-zinc-900 border-b border-[var(--glass-border)]">
                  {project.youtubeId ? (
                    <iframe 
                      src={`https://www.youtube.com/embed/${project.youtubeId}?modestbranding=1&rel=0&iv_load_policy=3&color=white`}
                      className="absolute inset-0 w-full h-full grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={project.title}
                    />
                  ) : project.image ? (
                    <img 
                      src={project.image} 
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                       <Globe className="w-12 h-12 text-zinc-700" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                </div>
                
                <div className="p-5 md:p-6 flex flex-col flex-1">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.stack.map(s => (
                      <span key={s} className="text-[9px] font-mono font-bold uppercase text-[var(--accent)] opacity-80">
                        • {s}
                      </span>
                    ))}
                  </div>
                  <h4 className="text-lg md:text-xl font-bold mb-2 group-hover:text-[var(--accent)] transition-colors">{project.title}</h4>
                  <p className="text-[var(--text-dim)] text-xs md:text-sm leading-relaxed mb-4 flex-1">
                    {project.description}
                  </p>
                  
                  <div className="flex gap-4 items-center">
                    {project.links.map(link => (
                      <a 
                        key={link.url} 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 hover:text-white transition-colors"
                      >
                        {link.name} <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="footer-area sleek-glass rounded-2xl p-5 md:px-8 flex flex-col md:flex-row justify-end items-center gap-6">
        <div className="flex flex-wrap justify-center gap-3">
          {CONTACTS.map((contact) => (
            <a 
              key={contact.label} 
              href={contact.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 hover:scale-105 ${
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
  );
}
