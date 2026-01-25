import { motion } from "motion/react";
import { ReactNode, useEffect, useState } from "react";
import glitterTexture from 'figma:asset/b13e817bc404875ff0c4687a3081a0dcabceb3d0.png';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

interface SparkleButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  textColor?: string;
  hoverScale?: number;
}

export function SparkleButton({ 
  children, 
  className = "", 
  onClick,
  type = "button",
  disabled = false,
  textColor = "text-[rgb(0,0,0)]",
  hoverScale = 1.05
}: SparkleButtonProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    // Generate sparkles
    const generateSparkles = () => {
      const newSparkles: Sparkle[] = [];
      for (let i = 0; i < 20; i++) {
        newSparkles.push({
          id: Date.now() + i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 5 + 3,
          delay: Math.random() * 2,
          duration: Math.random() * 1.5 + 0.8,
        });
      }
      setSparkles(newSparkles);
    };

    generateSparkles();
    const interval = setInterval(generateSparkles, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`relative px-12 py-5 rounded-lg shadow-2xl transition-transform overflow-hidden ${className}`}
      style={{
        backgroundImage: `url(${glitterTexture})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay',
      }}
      whileHover={{ scale: hoverScale }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Sparkles */}
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
            scale: [0, 1.2, 1, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: sparkle.duration,
            delay: sparkle.delay,
            repeat: Infinity,
            repeatDelay: 0.5,
            ease: "easeInOut",
          }}
        >
          <svg
            width={sparkle.size * 2.5}
            height={sparkle.size * 2.5}
            viewBox="0 0 24 24"
            fill="none"
            className="drop-shadow-[0_0_8px_rgba(255,255,255,1)]"
          >
            <path
              d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
              fill="white"
            />
          </svg>
        </motion.div>
      ))}
      
      <span className={`relative z-10 ${textColor} font-bold text-[20px]`}>{children}</span>
    </motion.button>
  );
}
