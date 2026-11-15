import { Explorer } from "@/components/Explorer";
import { Hero } from "@/components/Hero";
import { Purchase } from "@/components/Purchase";
import { PracticeAreas } from "@/components/PracticeAreas";
import { Faq, Intro, Specs } from "@/components/Sections";

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <Explorer />
      <PracticeAreas />
      <Specs />
      <Purchase />
      <Faq />
    </>
  );
}
