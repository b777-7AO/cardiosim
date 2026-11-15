import { Explorer } from "@/components/Explorer";
import { Hero } from "@/components/Hero";
import { Purchase } from "@/components/Purchase";
import { Faq, Intro, Specs } from "@/components/Sections";

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <Explorer />
      <Specs />
      <Purchase />
      <Faq />
    </>
  );
}
