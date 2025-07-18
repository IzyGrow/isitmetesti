import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Volume2, Headphones, VolumeOff, Clock, Users, CheckCircle } from "lucide-react";

export const HearingTestIntro = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Fixed Header with izmirses logo */}
      <header className="w-full border-b border-border shadow-sm flex items-center justify-start py-4 px-4 fixed top-0 left-0 z-50" style={{height: '120px', background: 'rgba(247,247,247,1)'}}>
        <img src="/izmirses-logo.jpeg" alt="İzmirses İşitme Cihazları" className="h-24 object-contain" />
      </header>
      <div style={{paddingTop: '80px'}}>
        {/* Hero Section */}
        <div className="flex items-center justify-center px-4 pt-4 pb-16">
          <div className="w-full max-w-5xl mx-auto">
            
            {/* Main Hero Card */}
            <Card className="bg-gradient-card shadow-strong border border-border p-8 md:p-12 mb-8 rounded-2xl">
              <div className="text-center space-y-8">
                {/* Enhanced Title */}
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 bg-accent px-4 py-2 rounded-full">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium text-accent-foreground">Güvenilir Test</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground bg-gradient-primary bg-clip-text text-transparent">
                    Çevrimiçi İşitme Testi
                  </h1>
                  <div className="space-y-3 max-w-2xl mx-auto">
                    <p className="text-xl text-muted-foreground">
                      Gelişmiş ses teknolojisi ile işitme sağlığınızı değerlendirin
                    </p>
                    <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>3 dakika</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        <span>3 kolay soru</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-primary" />
                        <span>Ses analizi</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Instructions Grid */}
                <div className="grid md:grid-cols-3 gap-8 my-16">
                  {/* Quiet Place */}
                  <div className="group">
                    <Card className="p-6 h-full bg-background shadow-soft border border-border hover:shadow-medium transition-all duration-300 hover:scale-105">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <VolumeOff className="w-10 h-10 text-primary-foreground" />
                        </div>
                        <h3 className="font-semibold text-foreground">Sessiz Ortam</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Dikkat dağıtıcı olmayan sessiz bir yerde olduğunuzdan emin olun. Arka plan gürültüsü test sonuçlarını etkileyebilir.
                        </p>
                      </div>
                    </Card>
                  </div>

                  {/* Volume */}
                  <div className="group">
                    <Card className="p-6 h-full bg-background shadow-soft border border-border hover:shadow-medium transition-all duration-300 hover:scale-105">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Volume2 className="w-10 h-10 text-primary-foreground" />
                        </div>
                        <h3 className="font-semibold text-foreground">Ses Ayarı</h3>
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Cihazınızda ses seviyesini %50'ye ayarlayın.
                          </p>
                          <button className="text-xs text-primary hover:text-primary-dark transition-colors underline font-medium">
                            📱 Ses seviyesini nasıl ayarlarım?
                          </button>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Headphones */}
                  <div className="group">
                    <Card className="p-6 h-full bg-background shadow-soft border border-border hover:shadow-medium transition-all duration-300 hover:scale-105">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Headphones className="w-10 h-10 text-primary-foreground" />
                        </div>
                        <h3 className="font-semibold text-foreground">Kulaklık</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Kaliteli kulaklık kullanın. Gürültü önleme özelliği varsa lütfen kapatın.
                        </p>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Enhanced CTA Section */}
                <div className="pt-8 space-y-6">
                  {/* Start Test Button */}
                  <div className="space-y-4">
                    <Button
                      onClick={() => window.location.href = "/test"}
                      variant="oticon"
                      size="lg"
                      className="w-full max-w-md h-16 text-xl font-bold shadow-strong hover:shadow-medium transition-all duration-300"
                    >
                      <Volume2 className="w-6 h-6 mr-3" />
                      Testi Başlat
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Test başladığında sesler otomatik olarak çalacaktır
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="w-full bg-muted/30 border-t border-border py-4 px-4 text-center">
        <p className="text-sm text-muted-foreground">© 2025. İzmir Ses İşitme Cihazları. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
};