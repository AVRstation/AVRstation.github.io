import React, { useState, useEffect, Suspense, lazy, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sounds } from './lib/sounds';
import { ProjectCard } from './components/ProjectCard';
import { SlotMachine } from './components/SlotMachine';
import { TreasureChest } from './components/TreasureChest';
import { AchievementSystem, AchievementSystemHandle } from './components/AchievementSystem';
import { CustomCursor } from './components/CustomCursor';
import { RetroLoader } from './components/RetroLoader';
import { BulletHellGame } from './components/BulletHellGame';
import { RetroHUD } from './components/RetroHUD';
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

import { Language } from './types';
import { TRANSLATIONS } from './constants/translations';
import { CONTACTS, detectInitialLanguage, GET_SKILLS, GET_PROJECTS } from './constants/data';

// Lazy load games for performance
const SnakeGame = lazy(() => import('./components/SnakeGame').then(m => ({ default: m.SnakeGame })));
const PongGame = lazy(() => import('./components/PongGame').then(m => ({ default: m.PongGame })));
const SpaceInvadersGame = lazy(() => import('./components/SpaceInvadersGame').then(m => ({ default: m.SpaceInvadersGame })));

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
  const [activeGame, setActiveGame] = useState<'snake' | 'pong' | 'space' | 'bullet'>(() => {
    const r = Math.random();
    if (r < 0.33) return 'snake';
    if (r < 0.66) return 'pong';
    return 'space';
  });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [snakeScore, setSnakeScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [isSecretUnlocked, setIsSecretUnlocked] = useState(() => {
    const saved = localStorage.getItem('portfolio_achievements');
    if (saved) {
      try {
        const achs = JSON.parse(saved);
        return achs.includes('all_unlocked');
      } catch (e) {
        return false;
      }
    }
    return false;
  });

  const [pongScore, setPongScore] = useState(0);
  const [pongAiScore, setPongAiScore] = useState(0);

  const [spaceScore, setSpaceScore] = useState(0);
  const [spaceAiScore, setSpaceAiScore] = useState(0);

  const [isMobile, setIsMobile] = useState(false);
  const [contactTrigger, setContactTrigger] = useState(0);
  const [gameResetKey, setGameResetKey] = useState(0);
  const [copyrightReactions, setCopyrightReactions] = useState<{ id: number; x: number; y: number; char: string }[]>([]);

  const handleExitPlayMode = useCallback(() => {
    setIsPlayMode(false);
    if (activeGame === 'bullet') {
      setActiveGame('snake');
    }
  }, [activeGame]);

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
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
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

  const handleLegendUnlocked = () => {
    setIsSoundEnabled(true);
    setGamesEnabled(true);
    setIsPlayMode(true);
    setIsSecretUnlocked(true);
    setActiveGame('bullet');
  };

  return (
    <>
      <CustomCursor />
      <AnimatePresence mode="wait">
        {isLoading ? (
          <RetroLoader key="loader" onFinish={() => setIsLoading(false)} />
        ) : (
          <motion.div 
            key="app-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
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
            key={`snake-wrapper-${gameResetKey}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SnakeGame onScoreChange={setSnakeScore} onAIScoreChange={setAiScore} soundEnabled={isSoundEnabled} />
          </motion.div>
        )}
        {gamesEnabled && activeGame === 'pong' && (
          <motion.div
            key={`pong-wrapper-${gameResetKey}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PongGame onScoreChange={setPongScore} onAIScoreChange={setPongAiScore} soundEnabled={isSoundEnabled} />
          </motion.div>
        )}
        {gamesEnabled && activeGame === 'space' && (
          <motion.div
            key={`space-wrapper-${gameResetKey}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SpaceInvadersGame onScoreChange={setSpaceScore} onAIScoreChange={setSpaceAiScore} soundEnabled={isSoundEnabled} />
          </motion.div>
        )}
        {gamesEnabled && activeGame === 'bullet' && (
          <motion.div
            key={`bullet-wrapper-${gameResetKey}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <BulletHellGame 
              onScoreChange={() => {}} 
              onAIScoreChange={() => {}} 
              soundEnabled={isSoundEnabled}
              autoStart={isSecretUnlocked}
              onClose={() => {
                setActiveGame('snake');
                setIsSoundEnabled(false);
                setIsPlayMode(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="relative z-10 min-h-screen lg:h-screen lg:overflow-hidden flex flex-col p-4 md:p-6 lg:p-10 max-w-[1440px] mx-auto gap-6 lg:gap-8">
        <AchievementSystem 
          ref={achievementsRef} 
          lang={lang} 
          onLegendUnlocked={handleLegendUnlocked}
          onReset={() => {
            setSnakeScore(0);
            setAiScore(0);
            setPongScore(0);
            setPongAiScore(0);
            setSpaceScore(0);
            setSpaceAiScore(0);
            setGameResetKey(prev => prev + 1);
          }}
        />

        <RetroHUD isActive={isPlayMode} onExit={handleExitPlayMode} />
        {/* Header */}
      <header className={`flex flex-col lg:flex-row justify-between items-start lg:items-end pb-6 border-b border-[var(--glass-border)] gap-6 perspective-1000 relative z-[70] transition-all duration-700 ${isPlayMode ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
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
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
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
                aria-label="Select Language"
                aria-expanded={isLangOpen}
                aria-haspopup="listbox"
                title="Select Language"
              >
                <Languages className={`w-4 h-4 ${isLangOpen ? 'animate-pulse' : ''}`} />
              </button>

              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    role="listbox"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute top-full right-0 mt-3 w-40 panel-glass rounded-2xl p-2 z-[10001] flex flex-col gap-1"
                    style={{ transform: 'translateZ(0)' }}
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
                        role="option"
                        aria-selected={lang === l.code}
                        key={l.code}
                        onClick={() => {
                          setLang(l.code as Language);
                          setIsLangOpen(false);
                        }}
                        className={`w-full px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider text-left transition-all ${
                          lang === l.code 
                            ? 'bg-[var(--accent)] text-black shadow-lg cursor-default' 
                            : 'text-[var(--text-dim)] hover:text-[var(--text-main)] hover:bg-[var(--glass-border)]'
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Action Buttons Container */}
            <div className="flex items-center gap-3 relative z-[80]">
              
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
                  aria-label={t.settings_title}
                  aria-expanded={isSettingsOpen}
                  aria-haspopup="dialog"
                  title={t.settings_title}
                >
                  <Settings className={`w-4 h-4 ${isSettingsOpen ? 'animate-spin-slow' : ''}`} />
                </button>

                <AnimatePresence>
                  {isSettingsOpen && (
                    <motion.div
                      role="dialog"
                      aria-label={t.settings_title}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute top-full left-0 mt-3 w-64 panel-glass rounded-2xl p-4 z-[10001]"
                      style={{ transform: 'translateZ(0)' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h2 className="text-[10px] font-black uppercase text-[var(--accent)] mb-4 tracking-[0.2em] flex items-center gap-2">
                        <Settings className="w-3 h-3" />
                        <span>{t.settings_panel_title}</span>
                      </h2>

                      <div className="flex flex-col gap-3">
                        {/* Toggle Games */}
                        <div className="flex items-center justify-between group/row">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <Gamepad2 className={`w-3.5 h-3.5 ${gamesEnabled ? 'text-[var(--accent)]' : 'text-zinc-500'}`} />
                            <span className={`text-[11px] font-bold uppercase tracking-wider ${gamesEnabled ? 'text-[var(--text-main)]' : 'text-zinc-500'}`}>{t.settings_games}</span>
                          </label>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setGamesEnabled(!gamesEnabled);
                            }}
                            role="switch"
                            aria-checked={gamesEnabled}
                            aria-label={t.settings_games}
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
                          <label className="flex items-center gap-2 cursor-pointer">
                            {isSoundEnabled ? <Volume2 className="w-3.5 h-3.5 text-green-400" /> : <VolumeX className="w-3.5 h-3.5 text-zinc-500" />}
                            <span className={`text-[11px] font-bold uppercase tracking-wider ${isSoundEnabled ? 'text-[var(--text-main)]' : 'text-zinc-500'}`}>{t.settings_sounds}</span>
                          </label>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              const newState = !isSoundEnabled;
                              setIsSoundEnabled(newState);
                              if (newState) {
                                sounds.init();
                              }
                            }}
                            role="switch"
                            aria-checked={isSoundEnabled}
                            aria-label={t.settings_sounds}
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
                          <label className="flex items-center gap-2 cursor-pointer">
                            {isPlayMode ? <EyeOff className="w-3.5 h-3.5 text-purple-400" /> : <Eye className="w-3.5 h-3.5 text-zinc-500" />}
                            <span className={`text-[11px] font-bold uppercase tracking-wider ${isPlayMode ? 'text-[var(--text-main)]' : 'text-zinc-500'}`}>{t.settings_play_mode}</span>
                          </label>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsPlayMode(!isPlayMode);
                            }}
                            role="switch"
                            aria-checked={isPlayMode}
                            aria-label={t.settings_play_mode}
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

            {/* Game & Score Switcher */}
              <motion.div 
                onClick={() => setActiveGame(prev => {
                  if (prev === 'snake') return 'pong';
                  if (prev === 'pong') return 'space';
                  if (prev === 'space') return isSecretUnlocked ? 'bullet' : 'snake';
                  return 'snake';
                })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative hidden md:flex items-center header-3d-wrapper rounded-full p-1 cursor-pointer transition-all focus-within:ring-2 focus-within:ring-[var(--accent)]"
                role="button"
                aria-label={t.stats_change_game}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setActiveGame(prev => {
                      if (prev === 'snake') return 'pong';
                      if (prev === 'pong') return 'space';
                      if (prev === 'space') return isSecretUnlocked ? 'bullet' : 'snake';
                      return 'snake';
                    });
                  }
                }}
              >
                <div className="flex items-center gap-4 px-4 py-1.5" aria-live="polite">
                  <div className="flex items-center gap-1.5 mr-1" aria-hidden="true">
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
                        <span className="text-xs">👽</span>
                      </>
                    )}
                    {activeGame === 'bullet' && (
                      <>
                        <span className="text-xs">👾</span>
                        <span className="text-xs">🔥</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-[var(--accent)] tracking-widest">
                        {activeGame === 'snake' ? snakeScore : activeGame === 'pong' ? pongScore : activeGame === 'space' ? spaceScore : '999'}
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
                <div 
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-4 panel-glass rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[60] pointer-events-none scale-95 group-hover:scale-100"
                  style={{ transform: 'translateX(-50%) translateZ(0)' }}
                >
                  <div className="text-[10px] font-black uppercase text-[var(--accent)] mb-2 tracking-widest">
                    {activeGame === 'snake' ? t.game_snake : activeGame === 'pong' ? t.game_pong : activeGame === 'space' ? t.game_space : t.game_bullet}
                  </div>
                  <div className="text-xs text-white/90 leading-relaxed font-medium mb-3">
                    {activeGame === 'snake' ? t.snake_rules : activeGame === 'pong' ? t.pong_rules : activeGame === 'space' ? t.space_rules : t.bullet_rules}
                  </div>
                  <div className="pt-3 border-t border-[var(--glass-border)] flex items-center justify-between">
                    <span className="text-[10px] font-bold opacity-60 uppercase whitespace-nowrap">{t.stats_change_game}</span>
                  </div>
                </div>
              </motion.div>
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
        <aside className="flex flex-col gap-6 overflow-y-auto lg:pr-2">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="sleek-glass rounded-2xl p-6 flex flex-col gap-8"
          >
            <h2 className="sr-only">Skills & Tech Stack</h2>
            {skills?.map((cat) => (
              <section key={cat.category} className="skill-cat">
                <h3 className="text-xs uppercase font-extrabold tracking-[0.2em] text-[var(--text-dim)] mb-4 flex items-center gap-3 after:content-[''] after:flex-1 after:h-[1px] after:bg-[var(--glass-border)]">
                  {cat.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cat.items?.map(item => (
                    <span key={item} className="tag whitespace-normal text-left">
                      {item}
                    </span>
                  ))}
                </div>
              </section>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="sleek-glass rounded-2xl p-6"
          >
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-[var(--text-dim)] mb-4 opacity-60">{t.experience_title}</h2>
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
            t={t}
          />
        </main>
      </div>

      {/* Footer */}
      <footer className="footer-area relative z-[70] sleek-glass rounded-2xl p-6 md:px-10 flex flex-col md:flex-row justify-between items-center gap-8 mb-4 transition-all duration-700">
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
        
        {isPlayMode && (
          <div className="order-first md:order-none md:absolute md:left-1/2 md:-translate-x-1/2 z-10 w-full md:w-auto flex justify-center">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleExitPlayMode();
              }}
              className="bg-black/60 hover:bg-black/80 border border-[#00FF00]/50 hover:border-[#00FF00] text-[#00FF00] px-6 py-2.5 rounded-xl text-[9px] md:text-[10px] uppercase font-black tracking-[0.3em] transition-all duration-300 flex items-center gap-3 group shadow-[0_0_20px_rgba(0,255,0,0.2)] cursor-pointer"
            >
              <div className="w-2.5 h-2.5 bg-red-500 rounded-sm group-hover:animate-pulse shadow-[0_0_10px_#ff0000]" />
              Terminate Play Mode
            </button>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-4">
          {CONTACTS.map((contact, index) => (
            <a 
              key={contact.label} 
              href={contact.url} 
              target="_blank" 
              rel="noopener noreferrer"
              title={contact.label}
              aria-label={contact.label}
              onClick={() => {
                achievementsRef.current?.unlock('click_contact');
                achievementsRef.current?.unlock('f_key_click');
              }}
              className={`kb-key w-14 h-14 group transition-all duration-300 ${contact.hoverBg} ${contact.shadow} border-white/5 hover:border-transparent shadow-lg`}
            >
              <span className="kb-key-label group-hover:opacity-0 transition-opacity">F{index + 1}</span>
              <div className={`${contact.color} group-hover:!text-[var(--text-main)] transform group-hover:scale-110 transition-all`}>
                {React.cloneElement(contact.icon as React.ReactElement, { className: "w-6 h-6" })}
              </div>
            </a>
          ))}
        </div>
      </footer>

      {/* Floating Reactions Portal */}
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
  </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
