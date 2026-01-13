import HeroSection from "./hero-section";
import WorkflowSection from "./workflow-section";
import FeaturesSection from "./features-section";
import CallToAction from "./call-to-action";
import FAQs from "./faqs";
import Footer from "./footer";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <WorkflowSection />
      <CallToAction />
      <FAQs />
      <Footer />
    </div>
  );
}
