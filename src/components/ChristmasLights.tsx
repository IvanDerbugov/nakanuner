import { motion } from "motion/react";

export function ChristmasLights({ position = "top" }: { position?: "top" | "bottom" }) {
  const lights = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    color: ['#ff0055', '#00ccff', '#ff6b00', '#bb00ff', '#00ff88'][i % 5],
    delay: i * 0.2,
  }));

  return (
    <div className={`md:fixed ${position === "top" ? "top-0" : "bottom-0"} left-0 right-0 z-50 pointer-events-none h-12 md:h-16`}>
      {/* Wire */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <path
          d="M 0,16 Q 100,28 200,16 T 400,16 T 600,16 T 800,16 T 1000,16 T 1200,16 T 1400,16 T 1600,16 T 1800,16 T 2000,16"
          stroke="#666"
          strokeWidth="1.2"
          fill="none"
        />
      </svg>

      {/* Lights */}
      <div className="absolute top-0 left-0 right-0 flex justify-around items-start pt-1">
        {lights.map((light) => (
          <motion.div
            key={light.id}
            className="relative"
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.9, 1.2, 0.9],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: light.delay,
              ease: "easeInOut",
            }}
          >
            {/* Bulb holder */}
            <div className="w-1 h-2 bg-gray-700 mx-auto" />
            
            {/* Bulb */}
            <motion.div
              className="w-4 h-5 md:w-6 md:h-7 rounded-full"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${light.color}, ${light.color}dd)`,
              }}
              animate={{
                boxShadow: [
                  `0 0 8px ${light.color}66, 0 0 16px ${light.color}44`,
                  `0 0 20px ${light.color}, 0 0 40px ${light.color}cc`,
                  `0 0 8px ${light.color}66, 0 0 16px ${light.color}44`,
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: light.delay,
                ease: "easeInOut",
              }}
            />
            
            {/* Reflection */}
            <div
              className="absolute top-2 md:top-3 left-1 w-1.5 h-2 md:w-2 md:h-3 rounded-full bg-white opacity-40"
              style={{ filter: 'blur(2px)' }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
