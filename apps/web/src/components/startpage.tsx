import { Hero } from "@/components/hero";
import { SectionFive } from "@/components/section-five";
import { SectionFour } from "@/components/section-four";
import { SectionOne } from "@/components/section-one";
import { SectionSeven } from "@/components/section-seven";
import { SectionThree } from "@/components/section-three";
import { SectionTwo } from "@/components/section-two";

export function StartPage() {
  return (
    <>
      <Hero />
      <SectionOne />
      <SectionTwo />
      <SectionThree />
      <SectionFour />
      <SectionFive />
      <SectionSeven />
    </>
  );
}
