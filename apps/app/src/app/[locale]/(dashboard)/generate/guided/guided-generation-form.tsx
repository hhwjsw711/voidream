"use client";

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

const guidedGenerationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z
    .string()
    .min(50, "Description must be at least 50 characters long"),
});

type FormValues = z.infer<typeof guidedGenerationSchema>;

export function GuidedGenerationForm() {
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
          title: "Story created",
          description:
            "Your guided story is being generated. You'll be able to refine it soon.",
        });
        form.reset();
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Failed to create your guided story",
          description: "Please try again.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsPending(false);
      });
  };

  const fillYTShortTemplate = () => {
    form.setValue(
      "description",
      `Generate a 130-word max video script that is five short paragraphs.

Include a catchy hook or intro, a clear main learning point, and actionable advice for the viewer to try.

The topic of the script should match a title called: ${form.getValues("title")}`,
    );
  };

  return (
    <>
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="tracking-tight flex justify-between items-center text-2xl font-normal text-gray-800 dark:text-gray-100">
          Enter a Prompt
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={fillYTShortTemplate}
              className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              YT Short (60 seconds)
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
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Title{" "}
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      (will be used in template)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="flex h-9 w-full rounded-md px-3 py-1 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-gray-400 dark:focus-visible:ring-gray-500"
                      placeholder="Mastering Social Media Algorithms: Your Key to Success 📱"
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
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Story Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="flex min-h-[60px] w-full rounded-md px-3 py-2 text-sm h-64 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-gray-400 dark:focus-visible:ring-gray-500"
                      placeholder={`Generate a 130-word max video script that is five short paragraphs.

Include a catchy hook or intro, a clear main learning point, and actionable advice for the viewer to try.

The topic of the script should match a title called: Mastering Social Media Algorithms: Your Key to Success`}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-9 px-3 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold rounded-md shadow transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <Wand2 className="h-4 w-4 mr-2" />
              Generate Guided Story (1 credits)
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
