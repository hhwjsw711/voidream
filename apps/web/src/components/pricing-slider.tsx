import { useScopedI18n } from "@/locales/client";
import NumberFlow from "@number-flow/react";
import { Slider } from "@v1/ui/slider";

// 修改为积分配置（基准：3000积分）
const TIERS_POINTS = {
  1: 3000, // 第1档 (70元)
  2: 6000, // 第2档
  3: 15000, // 第3档
  4: 30000, // 第4档
  5: 60000, // 第5档
  6: 150000, // 第6档
  7: 300000, // 第7档
  8: 600000, // 第8档
};

// 修改价格配置（基准：70元）
const TIER_PRICES = {
  1: 70, // 基础价格
  2: 140, // 第2档价格
  3: 350, // 第3档价格
  4: 700, // 第4档价格
  5: 1400, // 第5档价格
  6: 3500, // 第6档价格
  7: 7000, // 第7档价格
  8: 14000, // 第8档价格
};

// 赠送积分配置（约10%赠送）
const TIER_BONUS_POINTS = {
  1: 300, // 基础赠送
  2: 600, // 第2档赠送
  3: 1500, // 第3档赠送
  4: 3000, // 第4档赠送
  5: 6000, // 第5档赠送
  6: 15000, // 第6档赠送
  7: 30000, // 第7档赠送
  8: 60000, // 第8档赠送
};

export function PricingSlider({
  value,
  setValue,
}: { value: number[]; setValue: (value: number[]) => void }) {
  const t = useScopedI18n("pricing_slider");

  const getPriceForStep = (step: number) => {
    return (
      TIER_PRICES[(step + 1) as keyof typeof TIER_PRICES] || TIER_PRICES[1]
    );
  };

  const getStepForPrice = (price: number) => {
    const tier = Number(
      Object.entries(TIER_PRICES).find(([_, p]) => p === price)?.[0] || 1,
    );
    return tier - 1;
  };

  const getPointsForPrice = (price: number) => {
    const tier = Object.entries(TIER_PRICES).find(([_, p]) => p === price)?.[0];
    return tier
      ? TIERS_POINTS[Number(tier) as keyof typeof TIERS_POINTS]
      : TIERS_POINTS[1];
  };

  const getTierNumber = (price: number) => {
    return (
      Object.entries(TIER_PRICES).find(([_, p]) => p === price)?.[0] || "1"
    );
  };

  const getBonusPointsForPrice = (price: number) => {
    const tier = Object.entries(TIER_PRICES).find(([_, p]) => p === price)?.[0];
    return tier
      ? TIER_BONUS_POINTS[Number(tier) as keyof typeof TIER_BONUS_POINTS]
      : TIER_BONUS_POINTS[1];
  };

  const handleValueChange = (newValue: number[]) => {
    setValue([getPriceForStep(Math.round(newValue[0]))]);
  };

  return (
    <div className="mt-8 ml-[100px]">
      <div className="relative mb-6">
        <div
          className="bg-[#1D1D1D] absolute -top-[135px] transform -translate-x-1/2 font-medium text-primary whitespace-nowrap flex flex-col gap-1 text-xs w-[210px]"
          style={{
            left: `${(getStepForPrice(value[0]) / 7) * 100}%`,
            transition: "left 0.2s ease-out",
          }}
        >
          <div className="border-b border-background p-2 flex text-xs uppercase">
            {t("tier", { tier: getTierNumber(value[0]) })}
          </div>

          <div className="text-xs flex items-center justify-between px-2 py-1">
            <span className="text-primary">
              {getPointsForPrice(value[0]).toLocaleString()}
            </span>
            <span className="text-secondary">{t("points")}</span>
          </div>

          <div className="text-xs flex items-center justify-between px-2 pb-2">
            <span className="text-primary">
              {getBonusPointsForPrice(value[0]).toLocaleString()}
            </span>
            <span className="text-secondary">{t("bonus_points")}</span>
          </div>
        </div>

        <div className="flex">
          <div className="flex w-full">
            <div className="w-[100px] -ml-[100px] h-1.5 bg-white" />
            <Slider
              value={[getStepForPrice(value[0])]}
              onValueChange={handleValueChange}
              step={1}
              min={0}
              max={7}
              className="w-full"
            />
          </div>
        </div>

        <NumberFlow
          value={value[0]}
          defaultValue={70}
          className="font-mono text-2xl -ml-[100px] mt-2"
          locales="zh-CN"
          format={{
            style: "currency",
            currency: "CNY",
            trailingZeroDisplay: "stripIfInteger",
          }}
          suffix={`/${t("period")}`}
        />
      </div>
    </div>
  );
}
