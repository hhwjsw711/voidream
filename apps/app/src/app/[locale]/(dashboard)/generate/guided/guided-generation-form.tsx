"use client";

import { useScopedI18n } from "@/locales/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@v1/backend/convex/_generated/api";
import { Button } from "@v1/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@v1/ui/form";
import { Input } from "@v1/ui/input";
import { Textarea } from "@v1/ui/textarea";
import { useToast } from "@v1/ui/use-toast";
import { useMutation } from "convex/react";
import { Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

export function GuidedGenerationForm() {
  const t = useScopedI18n("generate.guided.form");

  const guidedGenerationSchema = z.object({
    title: z.string().min(1, t("validation.titleRequired")),
    description: z.string().min(50, t("validation.descriptionLength")),
  });

  type FormValues = z.infer<typeof guidedGenerationSchema>;

  const generateGuidedStory = useMutation(
    api.guidedStory.generateGuidedStoryMutation,
  );
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(guidedGenerationSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    setIsPending(true);
    generateGuidedStory(values)
      .then((newStoryId) => {
        router.push(`/stories/${newStoryId}/refine`);
        toast({
          title: t("toast.success.title"),
          description: t("toast.success.description"),
        });
        form.reset();
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: t("toast.error.title"),
          description: t("toast.error.description"),
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsPending(false);
      });
  };

  const fillYTShortTemplate = () => {
    const title = form.getValues("title");
    form.setValue(
      "description",
      `生成一个最多130字的视频脚本，分为五个简短段落。

包含一个吸引人的开场白，一个清晰的主要观点，以及给观众的实用建议。

脚本主题应该匹配标题：${title}`,
    );
  };

  return (
    <>
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="tracking-tight flex justify-between items-center text-2xl font-bold text-gray-900 dark:text-gray-100">
          {t("title")}
          <div className="flex gap-2">
            <Button
              type="button"
              className="h-9 px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-md shadow transition-colors duration-300 flex items-center justify-center gap-2"
              onClick={fillYTShortTemplate}
            >
              {t("buttons.ytShort")}
            </Button>
          </div>
        </h3>
      </div>
      <div className="p-6 pt-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {t("titleLabel")}{" "}
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {t("titleNote")}
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-9 w-full rounded-md px-3 py-2
                        text-gray-900 dark:text-gray-100 
                        bg-gray-50 dark:bg-gray-900 
                        border border-gray-200 dark:border-gray-700
                        placeholder:text-gray-500 dark:placeholder:text-gray-400
                        focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30 
                        focus:border-blue-500/50 dark:focus:border-blue-500/50 
                        focus:outline-none transition-all duration-200"
                      placeholder={t("titlePlaceholder")}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {t("descriptionLabel")}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-[60px] w-full rounded-md px-3 py-2 h-64
                        text-gray-900 dark:text-gray-100 
                        bg-gray-50 dark:bg-gray-900 
                        border border-gray-200 dark:border-gray-700
                        placeholder:text-gray-500 dark:placeholder:text-gray-400
                        focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30 
                        focus:border-blue-500/50 dark:focus:border-blue-500/50 
                        focus:outline-none transition-all duration-200"
                      placeholder={t("descriptionPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-9 px-3 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white hover:text-white font-semibold rounded-md shadow transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <Wand2 className="h-4 w-4" />
              {isPending ? t("buttons.generating") : t("buttons.generate")} (1{" "}
              {t("credits")}) )
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
