import { HearingTest } from "@/components/HearingTest";
import Footer from "@/components/Footer";

const HearingTestPage = () => {
  return <>
    <HearingTest onBackToIntro={() => (window.location.href = "/")} />
    <Footer />
  </>;
};

export default HearingTestPage; 