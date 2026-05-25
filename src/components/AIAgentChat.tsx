import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, Bot, User, CornerDownLeft, Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import { Language } from "../types";
import { sounds } from "../lib/sounds";
import { SYSTEM_INSTRUCTION } from "../constants/systemInstruction";

interface AIAgentChatProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
  lang: Language;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

const LOCAL_STORAGE_KEY = "aleksandr_ai_chat_history";

const UI_TRANSLATIONS = {
  en: {
    title: "Aleksandr's AI Agent",
    subtitle: "AI Assistant • Online",
    placeholder: "Ask about Aleksandr's experience, games...",
    send: "Send",
    error: "Connection lost. Please make sure the server is active.",
    retry: "Retry",
    suggestHeader: "Quick Inquiries",
    clearLabel: "Clear chat",
    initialMsg: "Hi! I am Aleksandr's AI Agent. Ask me anything about his 27+ year career in GameDev, his VR/MR achievements on STRIDE, gameplay designs, systems, or his contact information. How can I help you today?"
  },
  ru: {
    title: "ИИ-Партнер Александра",
    subtitle: "Ассистент • В сети",
    placeholder: "Спросите об опыте Александра, его играх...",
    send: "Отправить",
    error: "Ошибка подключения. Проверьте соединение с сервером.",
    retry: "Повторить",
    suggestHeader: "Быстрые вопросы",
    clearLabel: "Очистить чат",
    initialMsg: "Привет! Я ИИ-агент Александра. Спросите меня о его 27-летнем опыте в игровой индустрии, VR/MR успехах в STRIDE, дизайне игровых систем или о контактах. Чем могу помочь вам сегодня?"
  },
  cn: {
    title: "Aleksandr 的 AI 助手",
    subtitle: "AI 助手 • 在线",
    placeholder: "向我提问关于 Aleksandr 的经验、项目等...",
    send: "发送",
    error: "与服务器失去连接。请重试。",
    retry: "重试",
    suggestHeader: "常见问题",
    clearLabel: "清空对话",
    initialMsg: "你好！我是 Aleksandr 的 AI 专属助手。您可以向我询问有关他 27 年以上的游戏开发生涯、他在 STRIDE 项目中的 VR/MR 成就、游戏玩法设计、系统或他的联络信息。今天有什么我可以帮您的吗？"
  },
  es: {
    title: "Socio de IA de Aleksandr",
    subtitle: "Asistente • En línea",
    placeholder: "Pregunta sobre la experiencia de Aleksandr, juegos...",
    send: "Enviar",
    error: "Error de conexión. Asegúrese de que el servidor esté activo.",
    retry: "Reintentar",
    suggestHeader: "Consultas rápidas",
    clearLabel: "Limpiar chat",
    initialMsg: "¡Hola! Soy el Agente de IA de Aleksandr. Pregúntame lo que quieras sobre sus más de 27 años de carrera en Gamedev, sus logros en STRIDE VR/MR, diseño de mecánicas o información de contacto. ¿Cómo puedo ayudarte hoy?"
  },
  fr: {
    title: "Partenaire IA d'Aleksandr",
    subtitle: "Assistant • En ligne",
    placeholder: "Posez vos questions sur l'expérience d'Aleksandr...",
    send: "Envoyer",
    error: "Connexion perdue. Assurez-vous que le serveur est actif.",
    retry: "Réessayer",
    suggestHeader: "Questions rapides",
    clearLabel: "Effacer le chat",
    initialMsg: "Bonjour ! Je suis l'agent IA d'Aleksandr. Posez-moi vos questions sur ses 27 années d'expérience dans le jeu vidéo, ses succès VR/MR sur STRIDE, ou ses coordonnées. Comment puis-je vous aider aujourd'hui ?"
  },
  hi: {
    title: "अलेक्जेंडर के एआई पार्टनर",
    subtitle: "एआई सहायक • ऑनलाइन",
    placeholder: "अलेक्जेंडर के अनुभव, खेलों के बारे में पूछें...",
    send: "भेजें",
    error: "कनेक्शन टूट गया. कृपया सर्वर की जांच करें।",
    retry: "पुनः प्रयास करें",
    suggestHeader: "त्वरित पूछताछ",
    clearLabel: "चैट साफ़ करें",
    initialMsg: "नमस्ते! मैं अलेक्जेंडर का एआई पार्टनर हूँ। आप मुझसे उनके गेम्डेव में 27+ वर्षों के करियर, STRIDE पर VR/MR उपलब्धियों, गेमप्ले डिज़ाइनों या उनके संपर्क विवरणों के बारे में कुछ भी पूछ सकते हैं। मैं आपकी क्या मदद कर सकता हूँ?"
  },
  ar: {
    title: "شريك الذكاء الاصطناعي لألكسندر",
    subtitle: "المساعد • نشط",
    placeholder: "اسأل عن خبرة ألكسندر، ألعابه...",
    send: "إرسال",
    error: "انقطع الاتصال. يرجى التحقق من الخادم.",
    retry: "إعادة المحاولة",
    suggestHeader: "استفسارات سريعة",
    clearLabel: "مسح المحادثة",
    initialMsg: "مرحباً! أنا الوكيل الذكي الخاص بألكسندر. اسألني عن مسيرته التي تمتد لأكثر من 27 عاماً في عالم تطوير الألعاب، أو إنجازاته في ألعاب الواقع الافتراضي مثل STRIDE، أو تفاصيل الاتصال به. كيف أستطيع مساعدتك اليوم؟"
  }
};

const SUGGESTIONS: Record<Language, string[]> = {
  en: [
    "Tell me about Aleksandr's core projects",
    "What is his experience in VR/AR?",
    "What is the Matrix Core / Boss Battle on this site?",
    "How can I contact him directly?"
  ],
  ru: [
    "Расскажи о ключевых проектах Александра",
    "Какой у него опыт в VR/AR/MR?",
    "Что такое Boss Battle на этом сайте?",
    "Как связаться с Александром напрямую?"
  ],
  cn: [
    "介绍一下 Aleksandr 的核心项目",
    "他在 VR/AR 领域有什么经验？",
    "这个网站上的 Matrix Core (Boss 战) 是什么？",
    "我该如何直接联系他？"
  ],
  es: [
    "Cuéntame sobre los proyectos clave de Aleksandr",
    "¿Cuál es su experiencia en VR/AR?",
    "¿Qué es la Matrix Core (Batalla de Jefes) de esta web?",
    "¿Cómo puedo contactarlo directamente?"
  ],
  fr: [
    "Parle-moi des projets clés d'Aleksandr",
    "Quelle est son expérience en VR/AR ?",
    "Qu'est-ce que le Matrix Core (Boss Battle) sur ce site ?",
    "Comment puis-je le contacter directement ?"
  ],
  hi: [
    "अलेक्जेंडर के मुख्य प्रोजेक्ट्स के बारे में बताएं",
    "उनका VR/AR में क्या अनुभव है?",
    "इस साइट पर 'Matrix Core' (बॉस लड़ाई) क्या है?",
    "मैं उनसे सीधे संपर्क कैसे कर सकता हूँ?"
  ],
  ar: [
    "أخبرني عن مشاريع ألكسندر الرائدة",
    "ما هي خبرته في الـ VR/AR؟",
    "ما هي معركة الزعيم (Matrix Core) على هذا الموقع؟",
    "كيف يمكنني الاتصال به مباشرة؟"
  ]
};

export function AIAgentChat({ isOpen, onClose, soundEnabled, lang }: AIAgentChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<boolean>(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;
  const suggestions = SUGGESTIONS[lang] || SUGGESTIONS.en;

  // Load chat history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setMessages(JSON.parse(stored));
      } else {
        setMessages([
          {
            role: "assistant",
            content: t.initialMsg
          }
        ]);
      }
    } catch {
      setMessages([
        {
          role: "assistant",
          content: t.initialMsg
        }
      ]);
    }
  }, [lang]);

  // Save chat history to localStorage
  const saveMessages = (newMsgs: Message[]) => {
    setMessages(newMsgs);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newMsgs));
    } catch (e) {
      console.error("Failed to persist chat history", e);
    }
  };

  // Scroll to bottom on updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  const handleSend = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    if (soundEnabled) {
      // Soft modern blip on sending
      sounds.playNote(480, "sine", 0.08, 0.05);
    }

    const userMessage: Message = { role: "user", content: trimmed };
    const updatedMessages = [...messages, userMessage];
    saveMessages(updatedMessages);
    setInput("");
    setIsLoading(true);
    setErrorStatus(false);

    let reply = "";
    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: trimmed,
          history: messages // Pass preceding history for multi-turn context
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      reply = data.reply;
    } catch (err) {
      console.warn("Express backend endpoint failed or not found, attempting direct client fallback...", err);
      
      const clientApiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
      if (!clientApiKey) {
        throw new Error("Could not connect to AI. Please ensure VITE_GEMINI_API_KEY is configured in Vercel.");
      }

      // Map history to client-side REST format
      const contentsArray: any[] = [];
      messages.forEach((msg) => {
        contentsArray.push({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }]
        });
      });
      // Add current message
      contentsArray.push({
        role: "user",
        parts: [{ text: trimmed }]
      });

      // Standard REST request directly to Google's Gemini endpoint
      const directUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${clientApiKey}`;
      const directResponse = await fetch(directUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: contentsArray,
          systemInstruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }]
          },
          generationConfig: {
            temperature: 0.7
          }
        })
      });

      if (!directResponse.ok) {
        const errJson = await directResponse.json().catch(() => ({}));
        throw new Error(errJson?.error?.message || `Direct Gemini call failed: Status ${directResponse.status}`);
      }

      const directData = await directResponse.json();
      const directText = directData.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!directText) {
        throw new Error("Empty text response from direct Gemini API");
      }
      reply = directText;
    }

    try {
      if (soundEnabled) {
        // High soft double-pulse on receiving
        setTimeout(() => {
          sounds.playNote(587.33, "sine", 0.1, 0.05); // D5
          setTimeout(() => sounds.playNote(659.25, "sine", 0.12, 0.05), 60); // E5
        }, 100);
      }

      saveMessages([...updatedMessages, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error("AI agent message error", err);
      setErrorStatus(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    if (soundEnabled) {
      sounds.playNote(150, "sine", 0.15, 0.05);
    }
    const reset = [{ role: "assistant" as const, content: t.initialMsg }];
    saveMessages(reset);
    setErrorStatus(false);
  };

  const retryLastMessage = () => {
    const lastUser = [...messages].reverse().find(m => m.role === "user");
    if (lastUser) {
      handleSend(lastUser.content);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Shadow Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-[8000] backdrop-blur-[2px]"
            onClick={onClose}
          />

          {/* Chat Sliding Drawer */}
          <motion.div
            initial={{ x: "100%", opacity: 0.8 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.8 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-[460px] bg-zinc-950/80 backdrop-blur-xl border-l border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] z-[8001] flex flex-col pt-4 pb-6 overflow-hidden"
          >
            {/* HUD Scan Line Decorative Detail */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%),_linear-gradient(90deg,_rgba(255,0,0,0.06),_rgba(0,255,0,0.02),_rgba(0,0,255,0.06))] bg-[size:100%_4px,_6px_100%]" />

            {/* Header */}
            <div className="px-6 pb-4 border-b border-white/5 flex items-center justify-between relative z-10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--accent)]/30 to-[var(--accent)]/10 border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent)] shadow-[0_0_15px_rgba(251,191,36,0.15)]">
                    <Bot className="w-5 h-5 animate-pulse" />
                  </div>
                  {/* Pulsing Green status dot */}
                  <span className="absolute bottom-[-1px] right-[-1px] w-2.5 h-2.5 bg-green-500 rounded-full border border-black animate-ping" />
                  <span className="absolute bottom-[-1px] right-[-1px] w-2.5 h-2.5 bg-green-500 rounded-full border border-black" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                    {t.title}
                    <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
                  </h3>
                  <p className="text-[10px] text-green-400/80 uppercase font-black tracking-widest flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse inline-block" />
                    {t.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {messages.length > 1 && (
                  <button
                    onClick={handleClear}
                    title={t.clearLabel}
                    className="p-1 px-2.5 text-[9px] uppercase font-bold tracking-wider text-zinc-500 hover:text-red-400 bg-white/5 hover:bg-red-500/10 rounded-lg border border-white/5 transition-colors cursor-pointer"
                  >
                    {t.clearLabel}
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 border border-white/5 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 custom-scrollbar flex flex-col">
              {messages.map((msg, index) => {
                const isAI = msg.role === "assistant";
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex gap-3 max-w-[85%] ${isAI ? 'self-start' : 'self-end flex-row-reverse text-right'}`}
                  >
                    {/* Character/Icon Avatar */}
                    <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold border ${
                      isAI 
                        ? 'bg-zinc-900 border-white/10 text-[var(--accent)] shadow-md' 
                        : 'bg-[var(--accent)]/15 border-[var(--accent)]/30 text-white'
                    }`}>
                      {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4 text-[var(--accent)]" />}
                    </div>

                    <div className="flex flex-col gap-1">
                      {/* Dialogue Bubble */}
                      <div className={`p-3.5 rounded-2xl text-[12px] leading-relaxed break-words text-left ${
                        isAI 
                          ? 'bg-zinc-900/40 text-zinc-200 border border-white/5 font-medium' 
                          : 'bg-[var(--accent)]/10 text-white border border-[var(--accent)]/20 font-semibold'
                      }`}>
                        {/* Display with line-by-line formatting */}
                        {msg.content.split("\n").map((line, i) => {
                          // Handle minimal markdown symbols like list asterisks or titles
                          if (line.trim().startsWith("*") || line.trim().startsWith("-")) {
                            return (
                              <div key={i} className="pl-4 relative my-0.5">
                                <span className="absolute left-0 text-[var(--accent)]">•</span>
                                {line.replace(/^[\*\-]\s*/, "")}
                              </div>
                            );
                          }
                          if (line.trim().startsWith("###")) {
                            return (
                              <h4 key={i} className="text-[11px] font-black uppercase text-[var(--accent)] tracking-wider mt-2.5 mb-1">
                                {line.replace(/^###\s*/, "")}
                              </h4>
                            );
                          }
                          return <p key={i} className="mb-1.5 last:mb-0">{line}</p>;
                        })}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Loader */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3 max-w-[85%] self-start"
                >
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 shrink-0 flex items-center justify-center text-[var(--accent)]">
                    <Bot className="w-4 h-4 animate-bounce" />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-zinc-900/40 text-zinc-400 border border-white/5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </motion.div>
              )}

              {/* Error boundary */}
              {errorStatus && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-4 rounded-xl border border-red-500/30 bg-red-500/5 text-red-200/90 text-[11px] flex flex-col gap-2 shrink-0 max-w-[90%] self-center text-center"
                >
                  <div className="flex items-center justify-center gap-1.5 text-red-400 font-bold">
                    <AlertCircle className="w-4 h-4" />
                    <span>{t.error}</span>
                  </div>
                  <button
                    onClick={retryLastMessage}
                    className="mt-1 flex items-center justify-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 py-1.5 px-3 rounded-lg cursor-pointer transition-colors font-bold uppercase tracking-wider self-center"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    {t.retry}
                  </button>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Suggestions & Input Bar */}
            <div className="px-6 pt-2 pb-1 border-t border-white/5 space-y-4 shrink-0 relative z-10 bg-zinc-950/20 backdrop-blur-md">
              {/* Suggestions chips */}
              {messages.length <= 1 && !isLoading && (
                <div className="space-y-1.5 animate-fade-in">
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-wider">
                    {t.suggestHeader}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pr-1">
                    {suggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(sug)}
                        className="text-[11px] font-semibold text-zinc-300 bg-white/5 hover:bg-[var(--accent)]/15 hover:text-white border border-white/5 hover:border-[var(--accent)]/30 py-1.5 px-2.5 rounded-xl transition-all duration-300 text-left line-clamp-1 cursor-pointer shadow-sm hover:shadow-[0_0_10px_rgba(251,191,36,0.05)] active:scale-95"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Text Input Row */}
              <div className="flex items-center gap-2 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSend(input);
                    }
                  }}
                  disabled={isLoading}
                  placeholder={t.placeholder}
                  className="flex-1 bg-zinc-900 text-white placeholder-zinc-500 border border-white/5 hover:border-white/10 focus:border-[var(--accent)] text-xs font-medium py-3 px-4 rounded-xl outline-none transition-all pr-12"
                />

                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button
                    onClick={() => handleSend(input)}
                    disabled={!input.trim() || isLoading}
                    title={t.send}
                    className={`p-1.5 rounded-lg flex items-center justify-center transition-all ${
                      input.trim() && !isLoading
                        ? 'bg-[var(--accent)] text-zinc-950 shadow-[0_0_10px_var(--accent)] hover:scale-105 select-none hover:shadow-[0_0_15px_var(--accent)]'
                        : 'bg-zinc-800 text-zinc-600 border border-white/5 scale-100 opacity-60'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
