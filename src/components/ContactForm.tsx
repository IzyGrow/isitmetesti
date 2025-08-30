import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin } from "lucide-react";
import { useState, useEffect } from "react";

interface ContactFormProps {
  testResultsString?: string;
  surveyResultsString?: string;
  onBackToIntro?: () => void;
  showBackButton?: boolean;
  isPopup?: boolean;
  onFormSubmit?: () => void;
}

const dealerInfo = [
  {
    name: "Alsancak Şubesi",
    address: "Şair Eşref Bulv. No:82/1 Şair Apt. K1 D1 Alsancak / İzmir",
    phone: "0 (505) 035 99 90",
    email: "mert.arslan@izmirses.com.tr",
    mapUrl: "https://maps.google.com/?q=Şair+Eşref+Bulv.+No:82/1+Alsancak+İzmir"
  },
  {
    name: "Karşıyaka Şubesi",
    address: "Atatürk Mah. 182 Sok. No:2/A Karşıyaka / İzmir",
    phone: "0 (232) 369 99 90",
    email: "info@izmirses.com.tr",
    mapUrl: "https://maps.google.com/?q=Atatürk+Mah.+182+Sok.+Karşıyaka+İzmir"
  },
  {
    name: "Gaziemir Şubesi",
    address: "Menderes Cad. No:123 Gaziemir / İzmir",
    phone: "0 (232) 251 99 90",
    email: "gaziemir@izmirses.com.tr",
    mapUrl: "https://maps.google.com/?q=Menderes+Cad.+Gaziemir+İzmir"
  },
  {
    name: "Balçova Şubesi",
    address: "Eğitim Mah. 456 Sok. No:5 Balçova / İzmir",
    phone: "0 (232) 278 99 90",
    email: "balcova@izmirses.com.tr",
    mapUrl: "https://maps.google.com/?q=Eğitim+Mah.+456+Sok.+Balçova+İzmir"
  },
  {
    name: "Menderes Şubesi",
    address: "Cumhuriyet Mah. 789 Cad. No:10 Menderes / İzmir",
    phone: "0 (232) 782 99 90",
    email: "menderes@izmirses.com.tr",
    mapUrl: "https://maps.google.com/?q=Cumhuriyet+Mah.+789+Cad.+Menderes+İzmir"
  },
  {
    name: "Yeşilyurt Şubesi",
    address: "Yeşilyurt Mah. 321 Sok. No:15 Yeşilyurt / İzmir",
    phone: "0 (232) 456 99 90",
    email: "yesilyurt@izmirses.com.tr",
    mapUrl: "https://maps.google.com/?q=Yeşilyurt+Mah.+321+Sok.+Yeşilyurt+İzmir"
  }
];

export const ContactForm = ({ 
  testResultsString, 
  surveyResultsString, 
  onBackToIntro, 
  showBackButton = true,
  isPopup = false,
  onFormSubmit
}: ContactFormProps) => {
  const [showContactThanks, setShowContactThanks] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    comment: ''
  });
  const [isFormValid, setIsFormValid] = useState(false);

  // Form validasyonu
  useEffect(() => {
    const isValid = formData.name.trim() !== '' && formData.phone.trim() !== '';
    setIsFormValid(isValid);
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) return;

    // Form verilerini hazırla
    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('email', formData.email);
    submitData.append('phone', formData.phone);
    submitData.append('comment', formData.comment);
    
    if (testResultsString) {
      submitData.append('test_sonuclari', testResultsString);
    }
    if (surveyResultsString) {
      submitData.append('anket_sonuclari', surveyResultsString);
    }

    // Form gönder
    const newForm = document.createElement('form');
    newForm.action = "https://formsubmit.co/mert.arslan@izmirses.com.tr";
    newForm.method = "POST";
    newForm.target = "_blank";
    
    for (const [key, value] of submitData.entries()) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = String(value);
      newForm.appendChild(input);
    }
    
    document.body.appendChild(newForm);
    newForm.submit();
    document.body.removeChild(newForm);
    
    setShowContactThanks(true);
    setFormData({ name: '', email: '', phone: '', comment: '' });
    
    if (onFormSubmit) {
      onFormSubmit();
    }
  };

  // Popup için form içeriği
  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 font-medium text-foreground">Ad Soyad *</label>
          <Input 
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Adınız Soyadınız" 
            required 
            className="h-12"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium text-foreground">E-posta</label>
          <Input 
            name="email"
            type="email" 
            value={formData.email}
            onChange={handleInputChange}
            placeholder="ornek@email.com" 
            className="h-12"
          />
        </div>
      </div>
      <div>
        <label className="block mb-2 font-medium text-foreground">Telefon *</label>
        <Input 
          name="phone"
          type="tel" 
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="0555 123 45 67" 
          required
          className="h-12"
        />
      </div>
      <div>
        <label className="block mb-2 font-medium text-foreground">Mesajınız</label>
        <Textarea 
          name="comment"
          value={formData.comment}
          onChange={handleInputChange}
          placeholder="Test sonuçlarım hakkında bilgi almak istiyorum..." 
          rows={4}
        />
      </div>
      <button 
        type="submit" 
        disabled={!isFormValid}
        className={`w-full h-12 text-lg font-semibold shadow-medium rounded-lg transition-all ${
          isFormValid 
            ? 'bg-primary text-white hover:bg-primary/90' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Formu Gönder
      </button>
    </form>
  );

  // Popup modunda ise sadece popup göster
  if (isPopup) {
    return (
      <>
        {/* Teşekkür popup overlay */}
        {showContactThanks && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center shadow-2xl">
              <h3 className="text-3xl font-bold mb-4">Teşekkürler!</h3>
              <p className="text-lg text-muted-foreground mb-6">İletişim formunuz başarıyla gönderildi. En kısa sürede sizinle iletişime geçilecektir.</p>
              <Button onClick={() => setShowContactThanks(false)} variant="oticon" className="w-full h-12 text-lg font-semibold shadow-medium">Kapat</Button>
            </div>
          </div>
        )}

        {/* Ana popup - kapatılamaz */}
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-primary bg-clip-text text-transparent">İletişim Formu</h2>
            <p className="text-sm text-muted-foreground mb-6 text-center">
              Test sonucunu size gönderebilmemiz için lütfen aşağıdaki formu doldurun.
            </p>
            {formContent}
          </div>
        </div>
      </>
    );
  }

  // Normal modda eski görünümü koru
  return (
    <>
      {/* Teşekkür popup overlay */}
      {showContactThanks && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center shadow-2xl">
            <h3 className="text-3xl font-bold mb-4">Teşekkürler!</h3>
            <p className="text-lg text-muted-foreground mb-6">İletişim formunuz başarıyla gönderildi. En kısa sürede sizinle iletişime geçilecektir.</p>
            <Button onClick={() => setShowContactThanks(false)} variant="oticon" className="w-full h-12 text-lg font-semibold shadow-medium">Kapat</Button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">İletişim</h1>
            <p className="text-lg text-muted-foreground">Test sonucunu size gönderebilmemiz için lütfen aşağıdaki formu doldurun. Sonucunuzu hemen iletelim.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Sol taraf - İletişim Formu */}
            <Card className="bg-gradient-card shadow-strong border border-border p-8">
              <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-primary bg-clip-text text-transparent">İletişim Formu</h2>
              {formContent}
            </Card>

            {/* Sağ taraf - İletişim Seçenekleri */}
            <div className="space-y-6">
              {/* WhatsApp Butonu */}
              <Card className="bg-gradient-card shadow-strong border border-border p-6 hover:shadow-medium transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-soft">
                    <img src="/whatsapp_logo.png" alt="WhatsApp" className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">WhatsApp ile Ulaşın</h3>
                    <p className="text-muted-foreground">Anında destek alın</p>
                  </div>
                </div>
                <Button 
                  variant="default" 
                  className="w-full h-12 bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => window.open("https://wa.me/905444020605", "_blank")}
                >
                  <img src="/whatsapp_logo.png" alt="WhatsApp" className="w-5 h-5 mr-2" />
                  WhatsApp ile Mesaj Gönder
                </Button>
              </Card>

              {/* Şubeler Butonu */}
              <Card className="bg-gradient-card shadow-strong border border-border p-6 hover:shadow-medium transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center shadow-soft">
                    <MapPin className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Şubelerimiz</h3>
                    <p className="text-muted-foreground">Size en yakın şubeyi bulun</p>
                  </div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="oticon" className="w-full h-12">
                      <MapPin className="w-5 h-5 mr-2" />
                      Şube Bilgilerini Görüntüle
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold">Şubelerimiz</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-6 mt-6">
                      {dealerInfo.map((dealer, index) => (
                        <Card key={index} className="p-6 border border-border bg-gradient-card shadow-soft hover:shadow-medium transition-all duration-300">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0 shadow-soft">
                              <MapPin className="w-5 h-5 text-primary-foreground" />
                            </div>
                             <div className="flex-1">
                               <h3 className="text-lg font-bold text-foreground mb-2">
                                 {dealer.name}
                               </h3>
                               <div className="space-y-2 text-sm">
                                 <div className="flex items-center justify-between">
                                   <p className="text-muted-foreground">
                                     <strong>Adres:</strong> {dealer.address}
                                   </p>
                                   <Button
                                     variant="outline"
                                     size="sm"
                                     onClick={() => window.open(dealer.mapUrl, "_blank")}
                                     className="ml-2 h-8 px-3"
                                   >
                                     <MapPin className="w-4 h-4 mr-1" />
                                     Yol Tarifi
                                   </Button>
                                 </div>
                                 <p className="text-muted-foreground">
                                   <strong>Telefon:</strong> 
                                   <a href={`tel:${dealer.phone}`} className="text-primary hover:underline ml-1">
                                     {dealer.phone}
                                   </a>
                                 </p>
                                 <p className="text-muted-foreground">
                                   <strong>E-posta:</strong> 
                                   <a href={`mailto:${dealer.email}`} className="text-primary hover:underline ml-1">
                                     {dealer.email}
                                   </a>
                                 </p>
                               </div>
                             </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </Card>

              {/* Geri dön butonu */}
              {showBackButton && onBackToIntro && (
                <div className="text-center">
                  <Button onClick={onBackToIntro} variant="ghost" className="text-muted-foreground hover:text-foreground">
                    ← Ana sayfaya dön
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
