import { motion } from "motion/react";
import { SparkleButton } from "./SparkleButton";
import { usePresentationContext } from "./PresentationContext";
import backgroundImage from "figma:asset/93e67b4997a6b798a245773c6dd6ea7c24a363b3.png";

export function Screen6() {
  const { goToSlide } = usePresentationContext();
  const benefits = [
    {
      title: "Опыт",
      description: "18 лет в email-маркетинге. Мы съели собаку на праздничных кампаниях.",
      emoji: "🎯",
      color: "#ff0055",
    },
    {
      title: "Команда",
      description: "За вашим проектом — живые менеджер, email-маркетологи и верстальщики, которые контролируют AI и отвечают за результат.",
      emoji: "👥",
      color: "#00ccff",
    },
    {
      title: "Портфолио",
      description: "Крупные клиенты и успешные кейсы по email-маркетингу",
      emoji: "⭐",
      color: "#ff6b00",
    },
    {
      title: "Награды",
      description: "Проксима, Email Competitors и другие премии в области email-маркетинга",
      emoji: "🏆",
      color: "#bb00ff",
    },
  ];

  return (
    <div 
      className="w-full min-h-screen flex items-center justify-center px-4 md:px-8 py-12 md:py-12 relative"
      style={{
        backgroundColor: '#00ccff'
      }}
    >
      {/* Background Image with Opacity */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: '110%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.8
        }}
      />
      
      <div className="max-w-5xl w-full relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="space-y-[60px] md:space-y-8"
        >
          {/* Heading */}
          <div className="space-y-[60px] md:space-y-4 bg-[rgba(255,255,255,0)]">
            <motion.h2 
              className="text-white drop-shadow-[0_4px_20px_rgba(0,0,100,0.5)] leading-tight text-center text-[36px] font-black uppercase px-4 mt-[60px] md:mt-0"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Кто празднику рад — тот накануне рассылку сделал! А мы в этом поможем
            </motion.h2>
            <motion.p 
              className="text-white drop-shadow-[0_2px_10px_rgba(0,0,100,0.5)] text-center text-[20px] md:text-[24px] font-medium uppercase"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              KINETICA это:
            </motion.p>
          </div>

          {/* Benefits grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.15 }}
                whileHover={{ scale: 1.05, rotate: 2, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-2xl border-4 border-black relative overflow-hidden group cursor-pointer"
              >
                {/* Emoji and Title */}
                <div className="flex items-center gap-3 mb-2 md:mb-3">
                  <div className="text-4xl md:text-5xl text-[48px]">
                    {benefit.emoji}
                  </div>
                  <h3 className="text-black text-[18px] font-black uppercase">
                    {benefit.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-black leading-tight text-[16px] md:text-[18px] font-normal">
                  {benefit.description}
                </p>

                {/* Decorative element */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-2"
                  style={{ backgroundColor: benefit.color }}
                  animate={{ scaleX: [0, 1] }}
                  transition={{ duration: 0.8, delay: 0.5 + index * 0.15 + 0.3 }}
                />
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="text-center mt-6"
          >
            <SparkleButton onClick={() => goToSlide(2)} className="btn-want bg-[#d4ff00] text-black text-[16px] md:text-[20px] px-8 md:px-12">
              Вернуться к форме
            </SparkleButton>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}