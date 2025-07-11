import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy",
};

export default function Page() {
  return (
    <>
      <div className="max-w-[600px] m-auto my-20">
        <h1 className="scroll-m-20 text-2xl tracking-tight lg:text-3xl">
          Privacy Policy
        </h1>

        <div className="text-component line-height-lg v-space-md">
          <p className="leading-7 mt-8">Last updated: July 11, 2025</p>

          <p className="leading-7 mt-8">
            This Privacy Policy describes how Voidream Company (“Voidream
            Company,” “we,” “us,” or “our”) collects, uses, and shares your
            personal data when you use our websites and related services
            (collectively, the "Services").
          </p>

          <p className="leading-7 mt-8">
            The “Last Updated” date at the top of this policy indicates when it
            was last revised. We encourage you to review this Privacy Policy
            periodically to stay informed.
          </p>

          <p className="leading-7 mt-8">
            In some cases, supplemental privacy notices may apply to specific
            Services. If there is a conflict between this Privacy Policy and a
            supplemental notice, the supplemental notice will take precedence.
            Your use of our Services is also governed by our Terms of Use.
          </p>
        </div>
      </div>
    </>
  );
}
