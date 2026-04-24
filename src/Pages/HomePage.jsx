import Navbar from "../Components/Navbar";
import HomeMainSection from "../Components/HomeMainSection";
import WhyChooseUsSection from "../Components/WhyChooseUsSection";
import FeaturedBranchesSection from "../Components/FeaturedBranchesMain";
import SpecialOffersPreview from "../Components/SpecialOffersSection";
import RoomTypesPreview from "../Components/RoomTypesPreview";
import ReviewsPreview from "../Components/ReviewsPreview";
import CallToActionSection from "../Components/CallToActionSection";
import Footer from "../Components/Footer";

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <HomeMainSection />
      <WhyChooseUsSection />
      <FeaturedBranchesSection />
      <SpecialOffersPreview />
      <RoomTypesPreview />
      <ReviewsPreview />
      <CallToActionSection />
      <Footer />
    </div>
  );
}