import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "motion/react";
import { useState, useEffect, useRef } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { usePresentationContext } from "./PresentationContext";
import { sendChatMessage } from "../api/chatApi";
import starBurst from "figma:asset/199b0c9df4900b8c0ca721bd47970251ffed136c.png";
import christmasCharacter from "figma:asset/140cec68fe81e6fc55cc24ecfa9f4e3bd7ff0e43.png";
import valentineCharacter from "figma:asset/d49448a11085c0433c91861fee27b73c54f3e7f8.png";
import militaryCharacter from "figma:asset/94902e1b0965508d62b91ca15c4929bb64f03a27.png";
import womensCharacter from "figma:asset/27b525be2cd3ff5663f2e6bad9bd0d35ee341a24.png";
import kineticaLogo from "figma:asset/563ea12327e4a272a175ddc427c32d754639df3b.png";

type Message = {
  text: string;
  isBot: boolean;
};

const CHAT_STORAGE_KEY = "nakanunshchik_chat_state";

export function Screen1() {
  const { nextSlide } = usePresentationContext();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(
    mouseY,
    [0, window.innerHeight],
    [10, -10],
  );
  const rotateY = useTransform(
    mouseX,
    [0, window.innerWidth],
    [-10, 10],
  );
  const rotateZ = useTransform(
    mouseX,
    [0, window.innerWidth],
    [-5, 5],
  );

  // Opposite movement for character
  const characterX = useTransform(
    mouseX,
    [0, window.innerWidth],
    [20, -20],
  );
  const characterY = useTransform(
    mouseY,
    [0, window.innerHeight],
    [20, -20],
  );

  const [sparkles, setSparkles] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      size: number;
      delay: number;
      duration: number;
    }>
  >([]);

  const [titleSparkles, setTitleSparkles] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      size: number;
      delay: number;
      duration: number;
    }>
  >([]);

  // Load/save chat state (как в старом Наканунщике)
  const loadChatState = (): { messages: Message[]; input: string } => {
    try {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          messages: parsed.messages || [],
          input: parsed.input || "",
        };
      }
    } catch (e) {
      console.error("Failed to load chat state:", e);
    }
    return {
      messages: [
        {
          text: "Добрый день! Я Наканунщик из KINETICA. Рад помочь вам с идеями для спецпроекта. Расскажите, пожалуйста, чем занимается ваш бизнес?",
          isBot: true,
        },
      ],
      input: "",
    };
  };

  const initialState = loadChatState();
  const [messages, setMessages] = useState<Message[]>(initialState.messages);
  const [input, setInput] = useState(initialState.input);
  const [isLoading, setIsLoading] = useState(false);
  const [typingDots, setTypingDots] = useState(1);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(
        CHAT_STORAGE_KEY,
        JSON.stringify({ messages, input })
      );
    } catch (e) {
      console.error("Failed to save chat state:", e);
    }
  }, [messages, input]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Prevent wheel event from propagating to parent (to avoid slide navigation)
  // Теперь это обрабатывается в PresentationLayout через data-chat-container
  // Но оставляем stopPropagation для дополнительной защиты
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    const handleWheel = (e: WheelEvent) => {
      e.stopPropagation();
    };

    chatContainer.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      chatContainer.removeEventListener("wheel", handleWheel);
    };
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setTypingDots(1);
      return;
    }
    const interval = setInterval(() => {
      setTypingDots((prev) => (prev >= 3 ? 1 : prev + 1));
    }, 500);
    return () => clearInterval(interval);
  }, [isLoading]);

  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);

  const holidays = [
    { name: "Новый Год", image: christmasCharacter, color: "#d4ff00" },
    { name: "14 февраля", image: valentineCharacter, color: "#ff0055" },
    { name: "23 февраля", image: militaryCharacter, color: "#00ccff" },
    { name: "8 марта", image: womensCharacter, color: "#bb00ff" },
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () =>
      window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const generateSparkles = () => {
      const newSparkles = [];
      for (let i = 0; i < 15; i++) {
        newSparkles.push({
          id: Date.now() + i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 2,
          delay: Math.random() * 2,
          duration: Math.random() * 1.5 + 1,
        });
      }
      setSparkles(newSparkles);
    };

    generateSparkles();
    const interval = setInterval(generateSparkles, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Generate sparkles for title
    const generateTitleSparkles = () => {
      const newSparkles = [];
      for (let i = 0; i < 25; i++) {
        newSparkles.push({
          id: Date.now() + i + 1000,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 3,
          delay: Math.random() * 3,
          duration: Math.random() * 2 + 1,
        });
      }
      setTitleSparkles(newSparkles);
    };

    generateTitleSparkles();
    const interval = setInterval(generateTitleSparkles, 2000);
    return () => clearInterval(interval);
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % holidays.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [holidays.length]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { text: input.trim(), isBot: false };
    const validMessages = messages.filter(
      (msg) =>
        !msg.text.includes("Извините, произошла ошибка") &&
        !msg.text.includes("Проверьте консоль браузера")
    );
    const updatedMessages = [...validMessages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const botResponse = await sendChatMessage(updatedMessages);
      if (botResponse) {
        setMessages((prev) => [...prev, botResponse]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            text: "Извините, произошла ошибка при подключении к серверу. Попробуйте еще раз.",
            isBot: true,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          text: "Извините, произошла ошибка при отправке сообщения. Попробуйте еще раз.",
          isBot: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center px-2 sm:px-4 md:px-8 py-3 sm:py-6 md:py-8 lg:py-12 relative"
      style={{
        backgroundColor: '#d4ff00',
        backgroundImage: 'none'
      }}
    >
      <div className="max-w-7xl w-full relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-4 sm:mb-6 md:mb-8 mt-[15px]"
        >
          <img
            src={kineticaLogo}
            alt="KINETICA Performance Agency"
            className="h-4 sm:h-5 md:h-6 lg:h-7 w-auto"
          />
        </motion.div>

        {/* Centered heading */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 sm:mb-8 md:mb-10 lg:mb-12"
        >
          <div className="text-center">
            <div className="relative inline-block">
              <h1 className="text-[rgb(0,0,0)] leading-none font-bold text-[40px] xs:text-[48px] sm:text-[56px] md:text-[70px] lg:text-[80px] p-[0px] m-[0px]">
                НАКАНУНЩИК
              </h1>

              {/* Sparkles on title */}
              {titleSparkles.map((sparkle) => (
                <motion.div
                  key={sparkle.id}
                  className="absolute pointer-events-none"
                  style={{
                    left: `${sparkle.x}%`,
                    top: `${sparkle.y}%`,
                  }}
                  initial={{ opacity: 0, scale: 0, rotate: 0 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    scale: [0, 1.8, 1, 0],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: sparkle.duration,
                    delay: sparkle.delay,
                    repeat: Infinity,
                    repeatDelay: 0.8,
                    ease: "easeInOut",
                  }}
                >
                  <svg
                    width={sparkle.size * 3}
                    height={sparkle.size * 3}
                    viewBox="0 0 24 24"
                    fill="none"
                    className="drop-shadow-[0_0_10px_rgba(255,255,255,1)]"
                  >
                    <path
                      d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
                      fill="white"
                    />
                  </svg>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-12 items-center screen1-grid">
          {/* Left column - Character */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-3 sm:space-y-6 md:space-y-10 lg:space-y-14"
          >
            {/* Character with star */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex justify-center relative"
            >
              <motion.div
                className="relative"
                style={{
                  rotateX,
                  rotateY,
                  rotateZ,
                  transformStyle: "preserve-3d",
                  perspective: 1000,
                }}
              >
                <img
                  src={starBurst}
                  alt=""
                  className="w-[280px] sm:w-[340px] md:w-[420px] lg:w-[490px] h-auto m-[0px]"
                />

                {/* Sparkles on star */}
                {sparkles.map((sparkle) => (
                  <motion.div
                    key={sparkle.id}
                    className="absolute pointer-events-none"
                    style={{
                      left: `${sparkle.x}%`,
                      top: `${sparkle.y}%`,
                    }}
                    initial={{ opacity: 0, scale: 0, rotate: 0 }}
                    animate={{
                      opacity: [0, 1, 1, 0],
                      scale: [0, 1.5, 1, 0],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: sparkle.duration,
                      delay: sparkle.delay,
                      repeat: Infinity,
                      repeatDelay: 1,
                      ease: "easeInOut",
                    }}
                  >
                    <svg
                      width={sparkle.size * 3}
                      height={sparkle.size * 3}
                      viewBox="0 0 24 24"
                      fill="none"
                      className="drop-shadow-[0_0_6px_rgba(255,255,255,1)]"
                    >
                      <path
                        d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
                        fill="white"
                      />
                    </svg>
                  </motion.div>
                ))}
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.img
                  src={holidays[currentSlide].image}
                  alt={holidays[currentSlide].name}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140px] sm:w-[170px] md:w-[210px] lg:w-[252px] h-auto object-contain"
                  key={currentSlide}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.5 }}
                />
              </AnimatePresence>
            </motion.div>

            {/* Subtitle after image */}
            <div className="text-center px-2">
              <h2 className="text-black max-w-xl mx-auto leading-tight text-[14px] sm:text-[15px] md:text-[17px] lg:text-[18px] font-bold fast-start">
                Быстрый запуск email-рассылок для{"\u00A0"}любимых клиентов к{"\u00A0"}праздникам!
              </h2>
              
              {/* CTA Button */}
              <motion.button
                onClick={nextSlide}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 sm:mt-5 md:mt-6 bg-gradient-to-r from-[#ff0055] to-[#bb00ff] text-white font-bold px-7 sm:px-6 md:px-8 py-3 sm:py-3 md:py-3.5 rounded-[20px] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all text-[16px] sm:text-[13px] md:text-[15px] lg:text-[16px]"
              >
                Интересно. Что дальше?
              </motion.button>
            </div>
          </motion.div>

          {/* Right column - Chat */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full flex justify-center"
          >
            <motion.div
              ref={chatContainerRef}
              data-chat-container
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-xl md:rounded-2xl shadow-2xl border-4 border-black overflow-hidden w-full max-w-md"
            >
              {/* Chat header */}
              <div className="bg-gradient-to-r from-[#ff0055] to-[#bb00ff] text-white px-3 md:px-6 py-3 md:py-4 flex items-center justify-between border-b-4 border-black">
                <div className="flex items-center gap-2 md:gap-3">
                  <motion.div
                    className="w-2.5 h-2.5 md:w-3 md:h-3 bg-[#d4ff00] rounded-full"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-base md:text-xl font-bold">AI НАКАНУНЩИКА</span>
                </div>
                <span className="text-xs md:text-base">ОНЛАЙН 🟢</span>
              </div>

              {/* Messages */}
              <div
                ref={messagesContainerRef}
                className="h-[217px] sm:h-[272px] md:h-[326px] overflow-y-auto p-3 md:p-4 space-y-2 md:space-y-3 bg-gradient-to-b from-white to-gray-50 mx-auto"
                onWheel={(e) => {
                  e.stopPropagation();
                }}
              >
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[90%] sm:max-w-[85%] md:max-w-[80%] px-2.5 sm:px-3 md:px-4 py-2 md:py-3 rounded-xl md:rounded-2xl shadow-lg ${
                        message.isBot
                          ? "bg-gradient-to-r from-[#00ccff] to-[#0088ff] text-white"
                          : "bg-black text-white"
                      }`}
                    >
                      <span className="whitespace-pre-line leading-relaxed text-[11px] sm:text-[12px] md:text-[14px]">
                        {message.text}
                      </span>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-[90%] sm:max-w-[85%] md:max-w-[80%] px-2.5 sm:px-3 md:px-4 py-2 md:py-3 rounded-xl md:rounded-2xl shadow-lg bg-gradient-to-r from-[#00ccff] to-[#0088ff] text-white">
                      <span className="whitespace-pre-line leading-relaxed text-[11px] sm:text-[12px] md:text-[14px]">
                        печатает{".".repeat(typingDots)}
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input */}
              <div
                className="p-3 md:p-4 bg-white border-t-4 border-black"
                onWheel={(e) => {
                  e.stopPropagation();
                }}
              >
                <div className="flex gap-2 md:gap-3">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    onKeyDown={(e) => {
                      if (e.key === " " || e.key === "Spacebar") {
                        e.stopPropagation();
                      }
                    }}
                    placeholder={
                      isLoading ? "Бот печатает..." : "Пишите сюда... 💬"
                    }
                    className="flex-1 border-4 border-black rounded-full text-sm md:text-base px-3 md:px-4 py-2 md:py-3"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSend}
                    onWheel={(e) => {
                      e.stopPropagation();
                    }}
                    className="bg-[#ff0055] hover:bg-[#bb00ff] text-white px-3 md:px-6 rounded-full border-4 border-black"
                    disabled={isLoading}
                  >
                    <Send className="w-4 h-4 md:w-5 md:h-5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}