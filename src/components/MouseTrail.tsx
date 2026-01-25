import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail } from 'lucide-react';

interface Letter {
  id: number;
  x: number;
  y: number;
  size: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
}

export function MouseTrail() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [lastTime, setLastTime] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      
      // Создаём письмо каждые 100ms
      if (now - lastTime > 100) {
        const newLetter: Letter = {
          id: now,
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 12 + 12, // Размер от 12 до 24
          offsetX: (Math.random() - 0.5) * 40, // Смещение по X от -20 до 20
          offsetY: (Math.random() - 0.5) * 40, // Смещение по Y от -20 до 20
          rotation: (Math.random() - 0.5) * 60, // Поворот от -30 до 30 градусов
        };

        setLetters((prev) => [...prev, newLetter]);
        setLastTime(now);

        // Удаляем письмо через 1 секунду
        setTimeout(() => {
          setLetters((prev) => prev.filter((letter) => letter.id !== newLetter.id));
        }, 1000);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [lastTime]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      <AnimatePresence>
        {letters.map((letter) => (
          <motion.div
            key={letter.id}
            initial={{ 
              opacity: 0.8, 
              scale: 1,
              x: letter.x - letter.size / 2 + letter.offsetX,
              y: letter.y - letter.size / 2 + letter.offsetY,
              rotate: letter.rotation,
            }}
            animate={{ 
              opacity: 0,
              scale: 0.5,
              y: letter.y - letter.size / 2 + letter.offsetY - 40,
              rotate: letter.rotation + (Math.random() - 0.5) * 40,
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 1,
              ease: "easeOut"
            }}
            className="absolute"
          >
            <Mail 
              style={{
                width: letter.size,
                height: letter.size,
                color: ['#ccff00', '#ff0055', '#00ccff', '#ff6b00', '#bb00ff'][letter.id % 5],
                filter: 'drop-shadow(0 0 4px currentColor)',
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
