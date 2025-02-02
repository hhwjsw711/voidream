"use client";

import { useScopedI18n } from "@/locales/client";
import { api } from "@v1/backend/convex/_generated/api";
import { useToast } from "@v1/ui/use-toast";
import { cn } from "@v1/ui/utils";
import { useMutation, useQuery } from "convex/react";
import { Loader2, Monitor, Smartphone, Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { StepIndicator } from "../../_components/step-indicator";

function useCheckCredits() {
  const credits = useQuery(api.credits.getCredits);
  const { toast } = useToast();
  const t = useScopedI18n("generate.script");

  return (required: number): boolean => {
    if (!credits) {
      toast({
        title: t("form.errors.creditCheckFailed"),
        description: t("form.errors.tryAgain"),
        variant: "destructive",
      });
      return false;
    }
    return credits.remaining >= required;
  };
}

function calculateCredits(script: string) {
  // 计算段落数量
  const segments = script.split(/\n{2,}/);
  const imageCredits = segments.length * 10; // 每个段落 10 积分

  // 计算文本积分
  const textCredits = Math.max(
    Math.ceil(script.length / 100), // 每 100 字符 1 积分
    1,
  );

  return {
    imageCredits,
    textCredits,
    get totalCredits() {
      return this.imageCredits + this.textCredits;
    },
  };
}

export default function ScriptGeneration() {
  const [title, setTitle] = useState("");
  const [script, setScript] = useState("");
  const [customContext, setCustomContext] = useState("");
  const [useCustomContext, setUseCustomContext] = useState(true);
  const [videoFormat, setVideoFormat] = useState("horizontal");
  const t = useScopedI18n("generate.script");

  const [isPending, setIsPending] = useState(false);
  const generateScript = useMutation(api.script.generateScriptMutation);
  const { toast } = useToast();
  const checkCredits = useCheckCredits();
  const router = useRouter();

  const steps = [
    { number: 1, text: t("steps.step1") },
    { number: 2, text: t("steps.step2") },
    { number: 3, text: t("steps.step3") },
  ];
  const currentStep = 2;

  const contextKeys = [
    "photoRealistic",
    "scary",
    "fantasy",
    "scifi",
    "nature",
    "urban",
    "historical",
    "underwater",
    "steampunk",
    "cyberpunk",
    "fairytale",
    "postApocalyptic",
    "space",
  ];

  // 创建 premadeContexts 对象
  const premadeContexts = contextKeys.reduce(
    (acc, key) => ({
      ...acc,
      [key]: t(`contexts.descriptions.${key}`),
    }),
    {},
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || script.length < 10) {
      toast({
        title: t("form.errors.validation"),
        description: t("form.errors.checkFields"),
        variant: "destructive",
      });
      return;
    }

    setIsPending(true);
    try {
      const { totalCredits } = calculateCredits(script); // 传入完整文本
      if (!checkCredits(totalCredits)) {
        toast({
          title: t("form.errors.insufficientCredits"),
          description: t("form.errors.insufficientCreditsDesc"),
          variant: "destructive",
        });
        return;
      }

      const storyId = await generateScript({
        // 获取返回的 storyId
        title,
        script,
        customContext: useCustomContext ? customContext : "",
        useCustomContext,
        videoFormat,
      });

      toast({
        title: t("form.success.title"),
        description: t("form.success.description"),
      });

      router.push(`/stories/${storyId}`);
    } catch (error) {
      console.error(error);
      toast({
        title: t("form.errors.generateFailed"),
        description: t("form.errors.tryAgain"),
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="pt-8 sm:pt-12 pb-6 space-y-6 sm:space-y-8 px-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-gray-900 dark:text-gray-100">
          {t("title")}
        </h1>
        <StepIndicator steps={steps} currentStep={currentStep} />
      </div>

      <div className="flex-1 px-4 py-6">
        <div className="container mx-auto max-w-3xl">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {t("form.enterScript")}
              </h3>
            </div>
            <div className="p-6 pt-0">
              <form onSubmit={handleSubmit} className="space-y-6">
                <InputField
                  label={t("form.title")}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("form.titlePlaceholder")}
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {t("form.script")}
                  </label>
                  <textarea
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                    className="w-full min-h-[256px] rounded-md px-3 py-2 
                    text-gray-900 dark:text-gray-100 
                    bg-gray-50 dark:bg-gray-900 
                    border border-gray-200 dark:border-gray-700
                    placeholder:text-gray-500 dark:placeholder:text-gray-400
                    focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30 
                    focus:border-blue-500/50 dark:focus:border-blue-500/50 
                    focus:outline-none transition-all duration-200"
                    placeholder={t("form.scriptPlaceholder")}
                  />
                  <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                    <span>
                      {script.length} / 10000 {t("form.characters")}
                    </span>
                    <span>
                      {t("form.estimatedLength")}{" "}
                      {Math.max(1, Math.ceil(script.length / 10))}{" "}
                      {t("form.seconds")}
                    </span>
                  </div>
                </div>

                <div className="rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-base font-medium text-gray-900 dark:text-gray-100">
                          {t("form.customContext.title")}
                        </label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {t("form.customContext.description")}
                        </p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={useCustomContext}
                        onClick={() => setUseCustomContext(!useCustomContext)}
                        className={cn(
                          "inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
                          "focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30",
                          "disabled:cursor-not-allowed disabled:opacity-50",
                          useCustomContext
                            ? "bg-blue-600 dark:bg-blue-500"
                            : "bg-gray-200 dark:bg-gray-700",
                        )}
                      >
                        <span
                          className={cn(
                            "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform",
                            useCustomContext
                              ? "translate-x-4"
                              : "translate-x-0",
                          )}
                        />
                      </button>
                    </div>

                    {useCustomContext && (
                      <>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {t("form.customContext.label")}
                          </label>
                          <textarea
                            value={customContext}
                            onChange={(e) => setCustomContext(e.target.value)}
                            className="w-full min-h-[128px] rounded-md px-3 py-2 
                            text-gray-900 dark:text-gray-100 
                            bg-gray-50 dark:bg-gray-900 
                            border border-gray-200 dark:border-gray-700
                            placeholder:text-gray-500 dark:placeholder:text-gray-400
                            focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30 
                            focus:border-blue-500/50 dark:focus:border-blue-500/50 
                            focus:outline-none transition-all duration-200"
                            placeholder={t("form.customContext.placeholder")}
                          />
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t("form.customContext.note")}
                          </p>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 block">
                            {t("form.customContext.premadeContexts")}
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {contextKeys.map((key) => (
                              <button
                                key={key}
                                type="button"
                                onClick={() =>
                                  setCustomContext(premadeContexts[key])
                                }
                                className="h-8 px-3 rounded-md text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 transition-colors duration-200"
                              >
                                {t(`contexts.labels.${key}`)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {t("form.videoFormat.title")}
                  </label>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setVideoFormat("vertical")}
                      className={cn(
                        "flex-1 h-9 px-3 py-2 rounded-md shadow transition-colors duration-200",
                        "flex items-center justify-center gap-2",
                        videoFormat === "vertical"
                          ? "bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100",
                      )}
                    >
                      <Smartphone className="h-4 w-4" />
                      <span>{t("form.videoFormat.vertical")}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoFormat("horizontal")}
                      className={cn(
                        "flex-1 h-9 px-3 py-2 rounded-md shadow transition-colors duration-200",
                        "flex items-center justify-center gap-2",
                        videoFormat === "horizontal"
                          ? "bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100",
                      )}
                    >
                      <Monitor className="h-4 w-4" />
                      <span>{t("form.videoFormat.horizontal")}</span>
                    </button>
                  </div>
                </div>

                <CreditUsageEstimate script={script} />

                <button
                  type="submit"
                  disabled={isPending}
                  className={cn(
                    "w-full h-9 px-3 py-2",
                    "bg-blue-600 dark:bg-blue-500",
                    "hover:bg-blue-700 dark:hover:bg-blue-600",
                    "text-white font-semibold rounded-md shadow",
                    "transition-colors duration-300",
                    "flex items-center justify-center gap-2",
                    isPending && "opacity-50 cursor-not-allowed",
                  )}
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="h-4 w-4" />
                  )}
                  <span>
                    {isPending ? t("form.generating") : t("form.generate")} (
                    {calculateCredits(script).totalCredits} {/* 传入完整文本 */}
                    {t("form.credits")})
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

function InputField({ label, value, onChange, placeholder }: InputFieldProps) {
  return (
    <div className="space-y-2">
      <label
        className="text-sm font-medium text-gray-900 dark:text-gray-100"
        htmlFor={label.toLowerCase()}
      >
        {label}
      </label>
      <input
        id={label.toLowerCase()}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-9 w-full rounded-md px-3 py-2
            text-gray-900 dark:text-gray-100 
            bg-gray-50 dark:bg-gray-900 
            border border-gray-200 dark:border-gray-700
            placeholder:text-gray-500 dark:placeholder:text-gray-400
            focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30 
            focus:border-blue-500/50 dark:focus:border-blue-500/50 
            focus:outline-none transition-all duration-200"
      />
    </div>
  );
}

function CreditUsageEstimate({ script }: { script: string }) {
  const t = useScopedI18n("generate.script");
  const { imageCredits, textCredits, totalCredits } = calculateCredits(script); // 传入完整文本，而不是长度

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4 bg-gray-50 dark:bg-gray-900">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {t("form.creditEstimate.title")}
        </h4>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="px-4 py-2 text-left font-medium text-gray-900 dark:text-gray-100">
              {t("form.creditEstimate.item")}
            </th>
            <th className="px-4 py-2 text-right font-medium text-gray-900 dark:text-gray-100">
              {t("form.creditEstimate.credits")}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800">
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
              {t("form.creditEstimate.imageGeneration")}
            </td>
            <td className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">
              {imageCredits}
            </td>
          </tr>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
              {t("form.creditEstimate.textTokens")}
            </td>
            <td className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">
              {textCredits}
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2 font-medium text-gray-900 dark:text-gray-100">
              {t("form.creditEstimate.total")}
            </td>
            <td className="px-4 py-2 text-right font-medium text-gray-900 dark:text-gray-100">
              {totalCredits}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
