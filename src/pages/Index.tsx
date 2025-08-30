import { HearingTestIntro } from "@/components/HearingTestIntro";
import { ContactForm } from "@/components/ContactForm";
import { useState, useEffect } from "react";

const Index = () => {
  const [showContactPopup, setShowContactPopup] = useState(false);

  // Sayfa yüklendiğinde popup'ı göster
  useEffect(() => {
    // Kısa bir gecikme ile popup'ı göster
    const timer = setTimeout(() => {
      setShowContactPopup(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleFormSubmit = () => {
    setShowContactPopup(false);
  };

  return (
    <>
      <HearingTestIntro />
      
      {/* İletişim formu popup'ı */}
      {showContactPopup && (
        <ContactForm 
          isPopup={true}
          onFormSubmit={handleFormSubmit}
        />
      )}
    </>
  );
};

export default Index;
