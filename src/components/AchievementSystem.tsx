import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star } from 'lucide-react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const ACHIEVEMENTS_LIST: Record<'en' | 'ru' | 'cn', Achievement[]> = {
  en: [
    { id: 'first_load', title: 'Hello World', description: 'Experience the Matrix', icon: '🌐' },
    { id: 'change_game', title: 'Multitasking', description: 'Switch between game systems', icon: '🎮' },
    { id: 'toggle_theme', title: 'Architect of Light', description: 'Toggle site theme', icon: '🌓' },
    { id: 'disable_games', title: 'Focus Mode', description: 'Disable background games', icon: '🔇' },
    { id: 'change_lang', title: 'Global Citizen', description: 'Switch profile language', icon: '🌍' },
    { id: 'slot_win', title: 'Lucky Strike', description: 'Win on the slot machine', icon: '🎰' },
    { id: 'chest_open', title: 'Dungeon Crawler', description: 'Found the ancient treasure', icon: '👑' },
    { id: 'watch_video', title: 'Cinematographer', description: 'Watched a project video', icon: '🎬' },
    { id: 'click_contact', title: 'Networking', description: 'Check out social links', icon: '📡' },
    { id: 'snake_point', title: 'Hungry Snake', description: 'Scored a point in Snake', icon: '🍎' },
    { id: 'pong_point', title: 'Ping Pong Pro', description: 'Scored a point in Pong', icon: '🏓' },
    { id: 'space_point', title: 'Space Defender', description: 'Scored a point in Invaders', icon: '👾' },
    { id: 'back_to_top', title: 'Time Traveler', description: 'Used the shortcut to top', icon: '⏳' },
    { id: 'toggle_power_on', title: 'Power Up', description: 'Re-enabled background games', icon: '⚡' },
    { id: 'f_key_click', title: 'Keyboard Warrior', description: 'Used the F-series keys', icon: '⌨️' },
    { id: 'long_session', title: 'Dedicated', description: 'Spent some time exploring', icon: '🧠' },
    { id: 'all_unlocked', title: 'Legend', description: 'Collected all achievements', icon: '🏆' },
  ],
  ru: [
    { id: 'first_load', title: 'Hello World', description: 'Добро пожаловать в Матрицу', icon: '🌐' },
    { id: 'change_game', title: 'Многозадачность', description: 'Переключение между играми', icon: '🎮' },
    { id: 'toggle_theme', title: 'Архитектор Света', description: 'Переключение темы сайта', icon: '🌓' },
    { id: 'disable_games', title: 'Режим Фокуса', description: 'Отключение фоновых игр', icon: '🔇' },
    { id: 'change_lang', title: 'Гражданин Мира', description: 'Смена языка профиля', icon: '🌍' },
    { id: 'slot_win', title: 'Удачный Выстрел', description: 'Победа в игровом автомате', icon: '🎰' },
    { id: 'chest_open', title: 'Охотник за Сокровищами', description: 'Древний сундук открыт', icon: '👑' },
    { id: 'watch_video', title: 'Киноман', description: 'Запущено видео проекта', icon: '🎬' },
    { id: 'click_contact', title: 'Нетворкинг', description: 'Просмотр социальных ссылок', icon: '📡' },
    { id: 'snake_point', title: 'Голодная змейка', description: 'Заработано очко в Змейке', icon: '🍎' },
    { id: 'pong_point', title: 'Мастер Понга', description: 'Заработано очко в Понге', icon: '🏓' },
    { id: 'space_point', title: 'Защитник Галактики', description: 'Заработано очко в Invaders', icon: '👾' },
    { id: 'back_to_top', title: 'Путешественник во Времени', description: 'Возврат наверх по ярлыку', icon: '⏳' },
    { id: 'toggle_power_on', title: 'Энергия', description: 'Фоновые игры снова включены', icon: '⚡' },
    { id: 'f_key_click', title: 'Воин Клавиатуры', description: 'Использование клавиш F-серии', icon: '⌨️' },
    { id: 'long_session', title: 'Преданный', description: 'Проведено время за изучением', icon: '🧠' },
    { id: 'all_unlocked', title: 'Легенда', description: 'Все достижения разблокированы', icon: '🏆' },
  ],
  cn: [
    { id: 'first_load', title: '你好世界', description: '体验黑客帝国', icon: '🌐' },
    { id: 'change_game', title: '多任务处理', description: '在游戏系统之间切换', icon: '🎮' },
    { id: 'toggle_theme', title: '光之建筑师', description: '切换网站主题', icon: '🌓' },
    { id: 'disable_games', title: '专注模式', description: '禁用背景游戏', icon: '🔇' },
    { id: 'change_lang', title: '全球公民', description: '切换个人资料语言', icon: '🌍' },
    { id: 'slot_win', title: '幸运一击', description: '在老虎机上获胜', icon: '🎰' },
    { id: 'chest_open', title: '地牢爬行者', description: '发现古代宝藏', icon: '👑' },
    { id: 'watch_video', title: '电影摄影师', description: '观看项目视频', icon: '🎬' },
    { id: 'click_contact', title: '社交达人', description: '查看社交链接', icon: '📡' },
    { id: 'snake_point', title: '饥饿的蛇', description: '在贪吃蛇中获得一分', icon: '🍎' },
    { id: 'pong_point', title: '乒乓球高手', description: '在乒乓球中获得一分', icon: '🏓' },
    { id: 'space_point', title: '太空防御者', description: '在太空入侵者中获得一分', icon: '👾' },
    { id: 'back_to_top', title: '时间旅行者', description: '使用捷径返回顶部', icon: '⏳' },
    { id: 'toggle_power_on', title: '能量提升', description: '重新启用背景游戏', icon: '⚡' },
    { id: 'f_key_click', title: '键盘战士', description: '使用 F 系列键', icon: '⌨️' },
    { id: 'long_session', title: '专注', description: '花费时间探索', icon: '🧠' },
    { id: 'all_unlocked', title: '传奇', description: '收集所有成就', icon: '🏆' },
  ],
};

export interface AchievementSystemHandle {
  unlock: (id: string) => void;
}

interface AchievementSystemProps {
  lang: 'en' | 'ru' | 'cn';
}

const SECRET_ACHIEVEMENTS = ['slot_win', 'chest_open', 'f_key_click', 'long_session', 'all_unlocked'];

export const AchievementSystem = forwardRef<AchievementSystemHandle, AchievementSystemProps>(({ lang }, ref) => {
  const currentAchievements = ACHIEVEMENTS_LIST[lang];
  
  const [unlocked, setUnlocked] = useState<string[]>(() => {
    const saved = localStorage.getItem('portfolio_achievements');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeNotification, setActiveNotification] = useState<Achievement | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!isExpanded) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.achievement-system-trigger')) {
        setIsExpanded(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [isExpanded]);

  const unlock = useCallback((id: string) => {
    setUnlocked(prev => {
      if (prev.includes(id)) return prev;
      
      const achievement = currentAchievements.find(a => a.id === id);
      if (achievement) {
        setActiveNotification(achievement);
        setTimeout(() => setActiveNotification(null), 5000);
      }

      const next = [...prev, id];
      
      // Auto-unlock the final one if all others are done
      if (next.length === currentAchievements.length - 1 && !next.includes('all_unlocked')) {
        setTimeout(() => unlock('all_unlocked'), 2000);
      }

      localStorage.setItem('portfolio_achievements', JSON.stringify(next));
      return next;
    });
  }, [currentAchievements]);

  useImperativeHandle(ref, () => ({
    unlock
  }));

  // Session timer
  useEffect(() => {
    const timer = setTimeout(() => unlock('long_session'), 120000); // 2 mins
    return () => clearTimeout(timer);
  }, [unlock]);

  // First load
  useEffect(() => {
    const timer = setTimeout(() => unlock('first_load'), 1000);
    return () => clearTimeout(timer);
  }, [unlock]);

  return (
    <>
      <AnimatePresence>
        {activeNotification && (
          <motion.div
            initial={{ opacity: 0, x: 100, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            className="fixed bottom-10 right-10 z-[100] w-72 sleek-glass rounded-2xl p-4 border border-[var(--accent)]/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-start gap-4 overflow-hidden"
          >
            {/* Progress Bar */}
            <motion.div 
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 5, ease: "linear" }}
              className="absolute bottom-0 left-0 h-1 bg-[var(--accent)]/50"
            />

            <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/20 flex items-center justify-center text-2xl shadow-inner border border-[var(--accent)]/10">
              {activeNotification.icon}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-black tracking-widest text-[var(--accent)] uppercase">Achievement Unlocked</span>
                <div className="flex items-center gap-1 text-[10px] font-bold opacity-60">
                  <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                  {unlocked.length}/{currentAchievements.length}
                </div>
              </div>
              <h4 className="text-sm font-black text-white uppercase tracking-tight">{activeNotification.title}</h4>
              <p className="text-[10px] text-[var(--text-dim)] font-medium leading-tight mt-1">{activeNotification.description}</p>
            </div>

            {/* Glowing Ring */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-[var(--accent)]/5 rounded-full blur-2xl" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trophy Trigger */}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col items-end">
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="mb-4 pointer-events-auto"
            >
              <div className="w-80 h-[400px] overflow-hidden sleek-glass rounded-2xl border border-white/10 shadow-2xl flex flex-col">
                <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-widest text-white">
                    {lang === 'ru' ? 'Достижения' : lang === 'cn' ? '成就' : 'Achievements'}
                  </h3>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[10px] font-black text-[var(--accent)]">
                    {unlocked.length}/{currentAchievements.length}
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                  <div className="flex flex-col gap-1">
                    {currentAchievements.map(ach => {
                      const isUnlocked = unlocked.includes(ach.id);
                      const isSecret = SECRET_ACHIEVEMENTS.includes(ach.id) && !isUnlocked;
                      
                      const displayTitle = isSecret 
                        ? (lang === 'ru' ? 'Секретное достижение' : lang === 'cn' ? '秘密成就' : 'Secret Achievement') 
                        : ach.title;
                      
                      const displayDesc = isSecret 
                        ? (lang === 'ru' ? 'Выполните скрытое условие' : lang === 'cn' ? '完成隐藏条件以解锁' : 'Unlock to reveal details') 
                        : ach.description;

                      return (
                        <div 
                          key={ach.id} 
                          className={`p-3 rounded-xl border flex items-center gap-3 transition-colors ${
                            isUnlocked 
                              ? 'bg-[var(--accent)]/5 border-[var(--accent)]/20' 
                              : 'bg-black/20 border-white/5 opacity-50 grayscale'
                          }`}
                        >
                          <div className={`text-2xl transition-all ${isSecret ? 'blur-sm opacity-20' : ''}`}>
                            {isSecret ? '❓' : ach.icon}
                          </div>
                          <div className="flex-1">
                            <div className="text-[10px] font-black uppercase tracking-tight text-white mb-0.5">
                              {displayTitle}
                            </div>
                            <div className="text-[9px] text-[var(--text-dim)] font-medium leading-tight">
                              {displayDesc}
                            </div>
                          </div>
                          {isUnlocked && (
                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          whileHover={{ opacity: 1, scale: 1.1 }}
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className={`cursor-pointer p-2 rounded-full transition-all achievement-system-trigger ${
            isExpanded ? 'bg-[var(--accent)]/20 shadow-[0_0_15px_rgba(0,240,255,0.3)]' : 'bg-black/20'
          }`}
        >
          <Trophy className={`w-5 h-5 transition-colors ${isExpanded ? 'text-[var(--accent)]' : 'text-[var(--text-dim)] hover:text-[var(--accent)]'}`} />
        </motion.div>
      </div>
    </>
  );
});
