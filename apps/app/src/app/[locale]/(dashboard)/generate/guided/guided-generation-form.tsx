"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@v1/backend/convex/_generated/api";
import { Button } from "@v1/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@v1/ui/form";
import { Input } from "@v1/ui/input";
import { Textarea } from "@v1/ui/textarea";
import { useToast } from "@v1/ui/use-toast";
import { useMutation } from "convex/react";
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
        <h3 className="tracking-tight flex justify-between items-center text-2xl font-normal text-gray-800">
          Enter a Prompt
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={fillYTShortTemplate}
              className="text-sm bg-gray-100"
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
                  <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700">
                    Title{" "}
                    <span className="text-xs text-gray-400">
                      (will be used in template)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="flex h-9 w-full rounded-md px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border border-gray-300 text-gray-900"
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
                  <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700">
                    Story Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="flex min-h-[60px] w-full rounded-md px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-64 bg-gray-50 border border-gray-300 text-gray-900"
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
              className="items-center whitespace-nowrap rounded-md text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow h-9 py-2 flex gap-2 justify-center px-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors duration-300"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 mr-2"
              >
                <path
                  d="M13.9 0.499976C13.9 0.279062 13.7209 0.0999756 13.5 0.0999756C13.2791 0.0999756 13.1 0.279062 13.1 0.499976V1.09998H12.5C12.2791 1.09998 12.1 1.27906 12.1 1.49998C12.1 1.72089 12.2791 1.89998 12.5 1.89998H13.1V2.49998C13.1 2.72089 13.2791 2.89998 13.5 2.89998C13.7209 2.89998 13.9 2.72089 13.9 2.49998V1.89998H14.5C14.7209 1.89998 14.9 1.72089 14.9 1.49998C14.9 1.27906 14.7209 1.09998 14.5 1.09998H13.9V0.499976ZM11.8536 3.14642C12.0488 3.34168 12.0488 3.65826 11.8536 3.85353L10.8536 4.85353C10.6583 5.04879 10.3417 5.04879 10.1465 4.85353C9.9512 4.65827 9.9512 4.34169 10.1465 4.14642L11.1464 3.14643C11.3417 2.95116 11.6583 2.95116 11.8536 3.14642ZM9.85357 5.14642C10.0488 5.34168 10.0488 5.65827 9.85357 5.85353L2.85355 12.8535C2.65829 13.0488 2.34171 13.0488 2.14645 12.8535C1.95118 12.6583 1.95118 12.3417 2.14645 12.1464L9.14646 5.14642C9.34172 4.95116 9.65831 4.95116 9.85357 5.14642ZM13.5 5.09998C13.7209 5.09998 13.9 5.27906 13.9 5.49998V6.09998H14.5C14.7209 6.09998 14.9 6.27906 14.9 6.49998C14.9 6.72089 14.7209 6.89998 14.5 6.89998H13.9V7.49998C13.9 7.72089 13.7209 7.89998 13.5 7.89998C13.2791 7.89998 13.1 7.72089 13.1 7.49998V6.89998H12.5C12.2791 6.89998 12.1 6.72089 12.1 6.49998C12.1 6.27906 12.2791 6.09998 12.5 6.09998H13.1V5.49998C13.1 5.27906 13.2791 5.09998 13.5 5.09998ZM8.90002 0.499976C8.90002 0.279062 8.72093 0.0999756 8.50002 0.0999756C8.2791 0.0999756 8.10002 0.279062 8.10002 0.499976V1.09998H7.50002C7.2791 1.09998 7.10002 1.27906 7.10002 1.49998C7.10002 1.72089 7.2791 1.89998 7.50002 1.89998H8.10002V2.49998C8.10002 2.72089 8.2791 2.89998 8.50002 2.89998C8.72093 2.89998 8.90002 2.72089 8.90002 2.49998V1.89998H9.50002C9.72093 1.89998 9.90002 1.72089 9.90002 1.49998C9.90002 1.27906 9.72093 1.09998 9.50002 1.09998H8.90002V0.499976Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                />
              </svg>
              Generate Guided Story (1 credits)
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
