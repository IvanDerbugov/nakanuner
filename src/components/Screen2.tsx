import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { usePresentationContext } from "./PresentationContext";
import { SparkleButton } from "./SparkleButton";
import backgroundImage from "figma:asset/93e67b4997a6b798a245773c6dd6ea7c24a363b3.png";

export function Screen2() {
  const { nextSlide } = usePresentationContext();
  
  // Helper function for Russian pluralization
  const getPluralForm = (number: number, forms: [string, string, string]) => {
    const n = Math.abs(number) % 100;
    const n1 = n % 10;
    
    if (n > 10 && n < 20) return forms[2];
    if (n1 > 1 && n1 < 5) return forms[1];
    if (n1 === 1) return forms[0];
    return forms[2];
  };
  
  // Calculate target date: February 14, 2026
  const [targetDate] = useState(() => {
    const date = new Date('2026-02-14T00:00:00');
    return date;
  });
  
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div 
      className="w-full min-h-screen flex items-center justify-center px-4 md:px-8 py-12 md:py-12 relative"
      style={{
        backgroundColor: '#ff0055'
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
      
      <div className="max-w-6xl w-full relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-[40px] md:space-y-12"
        >
          {/* Heading */}
          <motion.div 
            className="space-y-[40px] md:space-y-6"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-h2 text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)] leading-tight text-[48px] font-bold uppercase p-[0px]">
              До <span className="text-[#d4ff00]">Дня всех влюблённых</span><br />
              осталось:
            </h2>
          </motion.div>

          {/* Countdown */}
          <div className="grid grid-cols-2 md:flex md:flex-row justify-center items-center gap-2 md:gap-4 max-w-4xl mx-auto">
            {[
              { value: String(timeLeft.days).padStart(2, '0'), label: getPluralForm(timeLeft.days, ['день', 'дня', 'дней']), color: '#ff6b00' },
              { value: String(timeLeft.hours).padStart(2, '0'), label: getPluralForm(timeLeft.hours, ['час', 'часа', 'часов']), color: '#d4ff00' },
              { value: String(timeLeft.minutes).padStart(2, '0'), label: getPluralForm(timeLeft.minutes, ['минута', 'минуты', 'минут']), color: '#00ccff' },
              { value: String(timeLeft.seconds).padStart(2, '0'), label: 'секунды', color: '#ff6b00' },
            ].map((item, index) => (
              <div key={item.label} className="flex flex-row items-center gap-2 md:gap-4">
                {index > 0 && (
                  <div className="hidden md:block text-2xl md:text-7xl lg:text-8xl text-white mx-0 md:mx-2">:</div>
                )}
                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative flex-1"
                >
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.2
                    }}
                    className="bg-white rounded-xl md:rounded-2xl p-2 md:p-6 shadow-2xl border-2 md:border-4 border-black relative overflow-hidden"
                  >
                    <div 
                      className="text-[34px] md:text-7xl lg:text-8xl tabular-nums leading-none mb-1 md:mb-2"
                      style={{ color: item.color }}
                    >
                      {item.value}
                    </div>
                    <div className="text-[13px] md:text-base lg:text-lg text-black tracking-wider uppercase">
                      {item.label}
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <SparkleButton onClick={nextSlide} className="btn-finish bg-[#d4ff00] text-black text-[16px] md:text-[20px] px-8 md:px-12">
              Успеть до праздников
            </SparkleButton>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}