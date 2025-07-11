import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "Terms of use",
};

export default function Page() {
  return (
    <>
      <div className="max-w-[600px] m-auto my-20">
        <h1 className="scroll-m-20 text-2xl tracking-tight lg:text-3xl">
          Terms of use
        </h1>

        <div className="text-component line-height-lg v-space-md">
          <p className="leading-7 mt-8">Last updated: July 11, 2025</p>

          <p className="leading-7 mt-8">
            These Terms of Use ("Terms") govern your access to and use of the
            https://www.voidream.com/ website, including its subdomains and
            content (the "Website"), and any services provided therein (the
            "Services"). By accessing or using our Website and Services, you
            ("User") agree to be bound by these Terms. If you do not agree to
            these Terms, you may not use the Website or Services.
          </p>

          <p className="leading-7 mt-8">
            Your use of the Website is also subject to our Acceptable Use
            Policy, which is incorporated by reference into these Terms.
          </p>

          <p className="leading-7 mt-8">
            We may modify these Terms at any time. We will indicate any changes
            by updating the "Last Updated" date at the top of this page. Your
            continued use of the Website after any changes become effective
            constitutes your acceptance of the new Terms. We recommend you
            review these Terms regularly.
          </p>

          <p className="leading-7 mt-8">
            Some Services may be subject to additional terms or conditions from
            us or third parties. You must agree to these additional terms before
            using such Services. If there is a conflict between these Terms and
            any additional terms, the additional terms will take precedence for
            that specific Service.
          </p>

          <p className="leading-7 mt-8">
            We may provide translations of these Terms for your convenience.
            However, the English language version is the legally binding one,
            and it will prevail in case of any discrepancies.
          </p>

          <p className="leading-7 mt-8">
            For information about how we collect and process your personal data,
            please see our Privacy Policy.
          </p>
        </div>
      </div>
    </>
  );
}
