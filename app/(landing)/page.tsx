import HeroSection from "./hero-section";
import WorkflowSection from "./workflow-section";
import FeaturesSection from "./features-section";
import SkillsSection from "./skills-section";
import CallToAction from "./call-to-action";
import FAQs from "./faqs";
import Footer from "./footer";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <WorkflowSection />
      <FeaturesSection />
      <SkillsSection />
      <CallToAction />
      <FAQs />
      <Footer />
    </div>
  );
}
