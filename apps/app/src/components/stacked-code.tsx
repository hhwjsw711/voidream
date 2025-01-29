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
    "城市宣传 → 城市形象宣传片、人文风光片、城市纪实片，展现城市独特魅力与发展活力",
    "文化传承 → 非遗记录片、传统技艺展示、民俗文化片，让传统文化焕发新生",
    "创意短片 → 创意短视频、故事微电影、预告片制作，打造精彩影视内容",
    "旅游推广 → 景区宣传片、特色景点介绍、旅游体验片，全方位展示旅游魅力",
    "品牌营销 → 品牌故事片、产品宣传片、企业形象片，提升品牌价值与影响力",
    "活动记录 → 活动花絮、大型庆典、节日纪实片，留存精彩瞬间",
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
              <div className="text-secondary font-mono text-base text-center whitespace-nowrap overflow-hidden p-6">
                {translations[i]}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
