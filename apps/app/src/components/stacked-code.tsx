"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function StackedCode() {
  const [activeIndex, setActiveIndex] = useState(4);
  const totalLayers = 5;

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev < totalLayers - 1 ? prev + 1 : 0));
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const translations = [
    "城市宣传 → 城市形象片、城市风光片、城市印象片，展现城市特色与魅力",
    "文旅非遗 → 非遗文化片、传统工艺片、文化记录片，传承文化精髓",
    "影视创作 → 电影预告片、微电影、短视频，制作精彩影视内容",
    "景区推广 → 景区宣传片、景点介绍片、旅游攻略片，展示旅游资源",
    "品牌营销 → 品牌故事片、产品宣传片、企业形象片，塑造品牌价值",
  ];

  return (
    <div className="relative -mt-32">
      {[...Array(totalLayers)].map((_, i) => {
        const position = (i - activeIndex + totalLayers) % totalLayers;
        const isActive = position === 0;

        return (
          <motion.div
            key={translations[i]}
            className="absolute w-full bg-background"
            initial={{ y: 0 }}
            animate={{
              y: position * 5,
              scale: 1 - position * 0.02,
              zIndex: position === 0 ? totalLayers : totalLayers - position,
              rotateX: position * 2,
            }}
            transition={{
              duration: isActive ? 1 : 0.8,
              ease: isActive ? [0.34, 1.56, 0.64, 1] : [0.43, 0.13, 0.23, 0.96],
            }}
            whileHover={
              isActive
                ? {
                    scale: 1.03,
                    y: position * 5 - 3,
                    transition: {
                      duration: 0.3,
                      ease: "easeOut",
                    },
                  }
                : undefined
            }
          >
            <div className="bg-[#121212] bg-noise border border-border">
              <div className="text-secondary font-mono text-sm text-center whitespace-nowrap overflow-hidden p-6">
                {translations[i]}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
