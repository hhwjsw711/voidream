import { getScopedI18n } from "@/locales/server";
import {
  AudioLines,
  Image,
  ListVideo,
  MousePointer,
  Play,
  Video,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Dashboard | Voidream",
};

export default async function Page() {
  const t = await getScopedI18n("dashboard");
  return (
    <>
      <div className="flex h-full w-full bg-secondary px-6 py-24 dark:bg-card">
        <div className="z-10 mx-auto flex h-full w-full max-w-screen-xl gap-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            <Link
              href="/generate"
              className="group flex w-full flex-col rounded-lg border border-border bg-card dark:bg-black transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:border-primary/40 active:scale-[0.98]"
            >
              <div className="flex w-full px-6">
                <div className="w-full border-b border-border" />
              </div>
              <div className="relative mx-auto flex w-full flex-col items-center p-6">
                <div className="relative flex w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-lg border border-border bg-secondary px-6 py-24 dark:bg-card">
                  <div className="z-10 flex max-w-[460px] flex-col items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-card hover:border-primary/40">
                      <Play className="h-8 w-8 stroke-[1.5px] text-primary/60" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-base font-medium text-primary">
                        {t("features.quickGen")}
                      </p>
                    </div>
                  </div>
                  <div className="base-grid absolute h-full w-full opacity-40" />
                  <div className="absolute bottom-0 h-full w-full bg-gradient-to-t from-[hsl(var(--card))] to-transparent" />
                </div>
              </div>
            </Link>
            <Link
              href="#"
              className="group flex w-full flex-col rounded-lg border border-border bg-card dark:bg-black transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:border-primary/40 active:scale-[0.98]"
            >
              <div className="flex w-full px-6">
                <div className="w-full border-b border-border" />
              </div>
              <div className="relative mx-auto flex w-full flex-col items-center p-6">
                <div className="relative flex w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-lg border border-border bg-secondary px-6 py-24 dark:bg-card">
                  <div className="z-10 flex max-w-[460px] flex-col items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-card hover:border-primary/40">
                      <ListVideo className="h-8 w-8 stroke-[1.5px] text-primary/60" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-base font-medium text-primary">
                        {t("features.batchGen")}
                      </p>
                    </div>
                  </div>
                  <div className="base-grid absolute h-full w-full opacity-40" />
                  <div className="absolute bottom-0 h-full w-full bg-gradient-to-t from-[hsl(var(--card))] to-transparent" />
                </div>
              </div>
            </Link>
            <Link
              href="#"
              className="group flex w-full flex-col rounded-lg border border-border bg-card dark:bg-black transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:border-primary/40 active:scale-[0.98]"
            >
              <div className="flex w-full px-6">
                <div className="w-full border-b border-border" />
              </div>
              <div className="relative mx-auto flex w-full flex-col items-center p-6">
                <div className="relative flex w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-lg border border-border bg-secondary px-6 py-24 dark:bg-card">
                  <div className="z-10 flex max-w-[460px] flex-col items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-card hover:border-primary/40">
                      <MousePointer className="h-8 w-8 stroke-[1.5px] text-primary/60" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-base font-medium text-primary">
                        {t("features.content")}
                      </p>
                    </div>
                  </div>
                  <div className="base-grid absolute h-full w-full opacity-40" />
                  <div className="absolute bottom-0 h-full w-full bg-gradient-to-t from-[hsl(var(--card))] to-transparent" />
                </div>
              </div>
            </Link>
            <Link
              href="#"
              className="group flex w-full flex-col rounded-lg border border-border bg-card dark:bg-black transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:border-primary/40 active:scale-[0.98]"
            >
              <div className="flex w-full px-6">
                <div className="w-full border-b border-border" />
              </div>
              <div className="relative mx-auto flex w-full flex-col items-center p-6">
                <div className="relative flex w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-lg border border-border bg-secondary px-6 py-24 dark:bg-card">
                  <div className="z-10 flex max-w-[460px] flex-col items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-card hover:border-primary/40">
                      <Image className="h-8 w-8 stroke-[1.5px] text-primary/60" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-base font-medium text-primary">
                        {t("features.image")}
                      </p>
                    </div>
                  </div>
                  <div className="base-grid absolute h-full w-full opacity-40" />
                  <div className="absolute bottom-0 h-full w-full bg-gradient-to-t from-[hsl(var(--card))] to-transparent" />
                </div>
              </div>
            </Link>
            <Link
              href="#"
              className="group flex w-full flex-col rounded-lg border border-border bg-card dark:bg-black transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:border-primary/40 active:scale-[0.98]"
            >
              <div className="flex w-full px-6">
                <div className="w-full border-b border-border" />
              </div>
              <div className="relative mx-auto flex w-full flex-col items-center p-6">
                <div className="relative flex w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-lg border border-border bg-secondary px-6 py-24 dark:bg-card">
                  <div className="z-10 flex max-w-[460px] flex-col items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-card hover:border-primary/40">
                      <Video className="h-8 w-8 stroke-[1.5px] text-primary/60" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-base font-medium text-primary">
                        {t("features.video")}
                      </p>
                    </div>
                  </div>
                  <div className="base-grid absolute h-full w-full opacity-40" />
                  <div className="absolute bottom-0 h-full w-full bg-gradient-to-t from-[hsl(var(--card))] to-transparent" />
                </div>
              </div>
            </Link>
            <Link
              href="#"
              className="group flex w-full flex-col rounded-lg border border-border bg-card dark:bg-black transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:border-primary/40 active:scale-[0.98]"
            >
              <div className="flex w-full px-6">
                <div className="w-full border-b border-border" />
              </div>
              <div className="relative mx-auto flex w-full flex-col items-center p-6">
                <div className="relative flex w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-lg border border-border bg-secondary px-6 py-24 dark:bg-card">
                  <div className="z-10 flex max-w-[460px] flex-col items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-card hover:border-primary/40">
                      <AudioLines className="h-8 w-8 stroke-[1.5px] text-primary/60" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-base font-medium text-primary">
                        {t("features.audio")}
                      </p>
                    </div>
                  </div>
                  <div className="base-grid absolute h-full w-full opacity-40" />
                  <div className="absolute bottom-0 h-full w-full bg-gradient-to-t from-[hsl(var(--card))] to-transparent" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
