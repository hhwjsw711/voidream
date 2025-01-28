import { DottedSeparator } from "@/components/dotted-separator";
import { FAQ } from "@/components/faq";
import { Pricing } from "@/components/pricing";

export default function Page() {
  return (
    <div className="space-y-12 max-w-screen-lg mx-auto">
      <Pricing />
      <DottedSeparator />
      <FAQ />
    </div>
  );
}
