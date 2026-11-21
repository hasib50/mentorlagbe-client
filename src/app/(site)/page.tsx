import PageTitle from "@/components/ui/PageTitle";
import Hero from "@/components/home/Hero";
import FeaturedTuitions from "@/components/home/FeaturedTuitions";
import SubjectsStats from "@/components/home/SubjectsStats";
import HowItWorks from "@/components/home/HowItWorks";
import PricingSection from "@/components/home/PricingSection";
import Testimonials from "@/components/home/Testimonials";
import CtaBanner from "@/components/home/CtaBanner";

export default function HomePage() {
  return (
    <>
      <PageTitle title="Find Your Ideal Tutor" />
      <Hero />
      <FeaturedTuitions />
      <SubjectsStats />
      <HowItWorks />
      <PricingSection id="pricing" />
      <Testimonials />
      <CtaBanner />
    </>
  );
}
