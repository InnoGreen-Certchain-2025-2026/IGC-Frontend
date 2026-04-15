import Header from "@/components/custom/header";
import Footer from "@/components/custom/footer";

import HeroSection from "./components/HeroSection";
import StatsSection from "./components/StatsSection";
import ProblemSolutionSection from "./components/ProblemSolutionSection";
import TargetAudienceSection from "./components/TargetAudienceSection";
import FeaturesSection from "./components/FeaturesSection";
import StorySection from "./components/StorySection";
import ContactSection from "./components/ContactSection";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-white text-slate-900 selection:bg-[#f2ce3c] selection:text-[#214e41]">
      <Header />

      <main className="grow">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <StorySection />
        <ProblemSolutionSection />
        <TargetAudienceSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}
