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
      {/* <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6 mb-24">
        <h1 className="font-bold text-center text-7xl">
          <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            "Hold my beer"
          </span>{" "}
          <span className="inline-block animate-bounce">🍺</span>
        </h1>
        <p className="text-center text-2xl font-medium text-primary/70 tracking-wide">
          AI generated videos suck? Watch this.
        </p>
      </div> */}
      <div className="flex h-full w-full bg-secondary px-6 py-24 dark:bg-black">
        <div className="z-10 mx-auto flex h-full w-full max-w-screen-xl gap-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            <Link
              href="/generate"
              className="group flex w-full flex-col rounded-lg border border-border bg-card transition-all duration-200 hover:bg-red-500/10 dark:hover:bg-red-500/20 hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/10 active:scale-[0.98]"
            >
              <div className="flex w-full px-6">
                <div className="w-full border-b border-border" />
              </div>
              <div className="relative mx-auto flex w-full flex-col items-center p-6">
                <div className="relative flex w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-lg border border-border bg-secondary px-6 py-24 dark:bg-card">
                  <div className="z-10 flex max-w-[460px] flex-col items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-card hover:border-red-500/40 transition-colors duration-300">
                      <Play className="h-8 w-8 stroke-[1.5px] text-primary/60" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-base font-medium text-primary">
                        {t("title_1")}
                      </p>
                    </div>
                  </div>
                  <div className="base-grid absolute h-full w-full opacity-40" />
                  <div className="absolute bottom-0 h-full w-full bg-gradient-to-t from-[hsl(var(--card))] to-transparent" />
                </div>
              </div>
            </Link>
            <Link
              href="/generate"
              className="group flex w-full flex-col rounded-lg border border-border bg-card transition-all duration-200 hover:bg-red-500/10 dark:hover:bg-red-500/20 hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/10 active:scale-[0.98]"
            >
              <div className="flex w-full px-6">
                <div className="w-full border-b border-border" />
              </div>
              <div className="relative mx-auto flex w-full  flex-col items-center p-6">
                <div className="relative flex w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-lg border border-border bg-secondary px-6 py-24 dark:bg-card">
                  <div className="z-10 flex max-w-[460px] flex-col items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-card hover:border-red-500/40 transition-colors duration-300">
                      <ListVideo className="h-8 w-8 stroke-[1.5px] text-primary/60" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-base font-medium text-primary">
                        {t("title_2")}
                      </p>
                    </div>
                  </div>
                  <div className="base-grid absolute h-full w-full opacity-40" />
                  <div className="absolute bottom-0 h-full w-full bg-gradient-to-t from-[hsl(var(--card))] to-transparent" />
                </div>
              </div>
            </Link>
            <Link
              href="/generate"
              className="group flex w-full flex-col rounded-lg border border-border bg-card transition-all duration-200 hover:bg-red-500/10 dark:hover:bg-red-500/20 hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/10 active:scale-[0.98]"
            >
              <div className="flex w-full px-6">
                <div className="w-full border-b border-border" />
              </div>
              <div className="relative mx-auto flex w-full  flex-col items-center p-6">
                <div className="relative flex w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-lg border border-border bg-secondary px-6 py-24 dark:bg-card">
                  <div className="z-10 flex max-w-[460px] flex-col items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-card hover:border-red-500/40 transition-colors duration-300">
                      <MousePointer className="h-8 w-8 stroke-[1.5px] text-primary/60" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-base font-medium text-primary">
                        {t("title_3")}
                      </p>
                    </div>
                  </div>
                  <div className="base-grid absolute h-full w-full opacity-40" />
                  <div className="absolute bottom-0 h-full w-full bg-gradient-to-t from-[hsl(var(--card))] to-transparent" />
                </div>
              </div>
            </Link>
            <Link
              href="/generate"
              className="group flex w-full flex-col rounded-lg border border-border bg-card transition-all duration-200 hover:bg-red-500/10 dark:hover:bg-red-500/20 hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/10 active:scale-[0.98]"
            >
              <div className="flex w-full px-6">
                <div className="w-full border-b border-border" />
              </div>
              <div className="relative mx-auto flex w-full  flex-col items-center p-6">
                <div className="relative flex w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-lg border border-border bg-secondary px-6 py-24 dark:bg-card">
                  <div className="z-10 flex max-w-[460px] flex-col items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-card hover:border-red-500/40 transition-colors duration-300">
                      <Image className="h-8 w-8 stroke-[1.5px] text-primary/60" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-base font-medium text-primary">
                        {t("title_4")}
                      </p>
                    </div>
                  </div>
                  <div className="base-grid absolute h-full w-full opacity-40" />
                  <div className="absolute bottom-0 h-full w-full bg-gradient-to-t from-[hsl(var(--card))] to-transparent" />
                </div>
              </div>
            </Link>
            <Link
              href="/generate"
              className="group flex w-full flex-col rounded-lg border border-border bg-card transition-all duration-200 hover:bg-red-500/10 dark:hover:bg-red-500/20 hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/10 active:scale-[0.98]"
            >
              <div className="flex w-full px-6">
                <div className="w-full border-b border-border" />
              </div>
              <div className="relative mx-auto flex w-full  flex-col items-center p-6">
                <div className="relative flex w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-lg border border-border bg-secondary px-6 py-24 dark:bg-card">
                  <div className="z-10 flex max-w-[460px] flex-col items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-card hover:border-red-500/40 transition-colors duration-300">
                      <Video className="h-8 w-8 stroke-[1.5px] text-primary/60" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-base font-medium text-primary">
                        {t("title_5")}
                      </p>
                    </div>
                  </div>
                  <div className="base-grid absolute h-full w-full opacity-40" />
                  <div className="absolute bottom-0 h-full w-full bg-gradient-to-t from-[hsl(var(--card))] to-transparent" />
                </div>
              </div>
            </Link>
            <Link
              href="/generate"
              className="group flex w-full flex-col rounded-lg border border-border bg-card transition-all duration-200 hover:bg-red-500/10 dark:hover:bg-red-500/20 hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/10 active:scale-[0.98]"
            >
              <div className="flex w-full px-6">
                <div className="w-full border-b border-border" />
              </div>
              <div className="relative mx-auto flex w-full  flex-col items-center p-6">
                <div className="relative flex w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-lg border border-border bg-secondary px-6 py-24 dark:bg-card">
                  <div className="z-10 flex max-w-[460px] flex-col items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-card hover:border-red-500/40">
                      <AudioLines className="h-8 w-8 stroke-[1.5px] text-primary/60" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-base font-medium text-primary">
                        {t("title_6")}
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
