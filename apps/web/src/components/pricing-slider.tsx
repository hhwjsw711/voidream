import { useScopedI18n } from "@/locales/client";
import NumberFlow from "@number-flow/react";
import { Slider } from "@v1/ui/slider";

const POINTS_TIERS = {
  1: 100, // ¥98
  2: 500, // ¥398
  3: 1200, // ¥898
  4: 2500, // ¥1798
  5: 6000, // ¥3998
  6: 15000, // ¥8998
  7: 35000, // ¥19998
  8: 100000, // ¥49998
};

const BONUS_POINTS = {
  1: 10, // 赠送10积分
  2: 100, // 赠送100积分
  3: 300, // 赠送300积分
  4: 800, // 赠送800积分
  5: 2000, // 赠送2000积分
  6: 6000, // 赠送6000积分
  7: 15000, // 赠送15000积分
  8: 50000, // 赠送50000积分
};

const TIER_PRICES = {
  1: 98,
  2: 398,
  3: 898,
  4: 1798,
  5: 3998,
  6: 8998,
  7: 19998,
  8: 49998,
};

export function PricingSlider({
  value,
  setValue,
}: { value: number[]; setValue: (value: number[]) => void }) {
  const t = useScopedI18n("pricing_slider");

  const getStepForPrice = (price: number) => {
    return Number(
      Object.entries(TIER_PRICES).find(([_, p]) => p === price)?.[0] || 1,
    );
  };

  const getPointsForPrice = (price: number) => {
    const tier = Object.entries(TIER_PRICES).find(([_, p]) => p === price)?.[0];
    return tier
      ? POINTS_TIERS[Number(tier) as keyof typeof POINTS_TIERS]
      : POINTS_TIERS[1];
  };

  const getBonusPointsForPrice = (price: number) => {
    const tier = Object.entries(TIER_PRICES).find(([_, p]) => p === price)?.[0];
    return tier
      ? BONUS_POINTS[Number(tier) as keyof typeof BONUS_POINTS]
      : BONUS_POINTS[1];
  };

  const getTierNumber = (price: number) => {
    return getStepForPrice(price);
  };

  const handleValueChange = (newValue: number[]) => {
    setValue([
      TIER_PRICES[(Math.round(newValue[0]) + 1) as keyof typeof TIER_PRICES],
    ]);
  };

  return (
    <div className="mt-8 ml-[100px]">
      <div className="relative mb-6">
        <div
          className="bg-[#1D1D1D] absolute -top-[105px] transform -translate-x-1/2 font-medium text-primary whitespace-nowrap flex flex-col gap-1 text-xs w-[210px]"
          style={{
            left: `${((getStepForPrice(value[0]) - 1) / 7) * 100}%`,
          }}
        >
          <div className="border-b border-background p-2 uppercase">
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
            <span className="text-secondary">{t("bonus")}</span>
          </div>
        </div>

        <div className="flex">
          <div className="w-[100px] -ml-[100px] h-1.5 bg-white" />
          <Slider
            value={[getStepForPrice(value[0]) - 1]}
            onValueChange={handleValueChange}
            step={1}
            min={0}
            max={7}
          />
        </div>
      </div>

      <NumberFlow
        value={value[0]}
        defaultValue={98}
        className="font-mono text-2xl -ml-[100px]"
        locales="zh-CN"
        format={{
          style: "currency",
          currency: "CNY",
          trailingZeroDisplay: "stripIfInteger",
        }}
        suffix={`/${t("period")}`}
      />
    </div>
  );
}
