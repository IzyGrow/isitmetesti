import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Volume2, VolumeX, MessageCircle, MapPin, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ContactForm } from "@/components/ContactForm";

interface HearingTestProps {
  onBackToIntro: () => void;
}

interface TestQuestion {
  id: number;
  frequency: string;
  audioLevel: string;
  instruction: string;
  audioSrc: string;
  volume: number;
}

const frequencies = [
  { frequency: "500 Hz", audioSrc: "/500hz.mp3" },
  { frequency: "1000 Hz", audioSrc: "/1000hz.mp3" },
  { frequency: "4000 Hz", audioSrc: "/4000hz.mp3" },
];
// Ses seviyeleri: %80, %40, %20
const volumes = [0.8, 0.4, 0.2];

const testQuestions: TestQuestion[] = frequencies.flatMap((f, i) =>
  volumes.map((v, j) => ({
    id: i * volumes.length + j + 1,
    frequency: f.frequency,
    audioLevel: `${Math.round(v * 100)}% ses seviyesi`,
    instruction: `Bu sesi duyabiliyor musunuz? Duyuyorsanız 'Evet' butonuna basın.`,
    audioSrc: f.audioSrc,
    volume: v,
  }))
);

const surveyQuestions = [
  {
    id: "q1",
    text: "Konuşmaları takip etmek zor olduğu için, sosyal ortamlardan uzaklaşma eğilimindeyim."
  },
  {
    id: "q2",
    text: "Restoran gibi yerlerde ve partilerde konuşmaları işitmekte zorlanıyorum."
  },
  {
    id: "q3",
    text: "İşitme duyumu iyileştirmem benim için önemli"
  }
];
const likertOptions = [
  { value: "1", label: "Hiç katılmıyorum" },
  { value: "2", label: "Katılmıyorum" },
  { value: "3", label: "Kararsızım" },
  { value: "4", label: "Katılıyorum" },
  { value: "5", label: "Tamamen katılıyorum" },
];

const CONTACT_EMAIL = "mert.arslan@izmirses.com.tr";

// Frekans türü ve renk eşlemesi
const frequencyMeta = {
  "500 Hz": { label: "Düşük Frekans", color: "#22c55e" }, // yeşil
  "1000 Hz": { label: "Orta Frekans", color: "#f59e42" }, // turuncu
  "4000 Hz": { label: "Yüksek Frekans", color: "#ef4444" }, // kırmızı
};

// Volume bar bileşeni (Oticon tarzı kutucuklar)
function VolumeBar({ level }: { level: number }) {
  // level: 0.8 -> 4 tık, 0.4 -> 2 tık, 0.2 -> 1 tık
  const ticks = 5;
  const active = Math.round(level * ticks);
  return (
    <div className="flex gap-1 justify-center items-center mt-2">
      {[...Array(ticks)].map((_, i) => (
        <div
          key={i}
          className={`w-4 h-6 rounded-sm border ${i < active ? 'bg-primary border-primary' : 'bg-muted border-border'}`}
        />
      ))}
    </div>
  );
}

// Süre formatlayıcı
function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// Header bar for all pages
const HeaderBar = () => (
  <header className="w-full border-b border-border shadow-sm flex items-center justify-start py-4 px-4 fixed top-0 left-0 z-50" style={{height: '120px', background: 'rgba(247,247,247,1)'}}>
    <a 
      href="https://izmirses.com.tr/" 
      target="_blank" 
      rel="noopener noreferrer"
      className="cursor-pointer hover:opacity-80 transition-opacity"
    >
      <img src="/izmirses-logo.jpeg" alt="İzmirses İşitme Cihazları" className="h-24 object-contain" />
    </a>
  </header>
);


export const HearingTest = ({ onBackToIntro }: HearingTestProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0); // 0-100
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [testCompleted, setTestCompleted] = useState(false);
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioDuration, setAudioDuration] = useState(0);
  const [surveySent, setSurveySent] = useState(false);
  const { register, handleSubmit, reset, formState } = useForm();
  const [sending, setSending] = useState(false);
  // Anket stepper state
  const [surveyStep, setSurveyStep] = useState(0); // 0,1,2 sorular, 3 teşekkür, 4 iletişim
  const [surveyAnswers, setSurveyAnswers] = useState<{ [k: string]: string }>({});
  const [showContact, setShowContact] = useState(false);
  const [showDealers, setShowDealers] = useState(false);
  const [showContactThanks, setShowContactThanks] = useState(false);

  const progress = ((currentQuestion + 1) / testQuestions.length) * 100;

  // Otomatik ses oynatma ve progress bar güncelleme
  useEffect(() => {
    if (testCompleted) return;
    const audio = new Audio(testQuestions[currentQuestion].audioSrc);
    audio.volume = testQuestions[currentQuestion].volume;
    audioRef.current = audio;
    setIsPlaying(true);
    audio.onloadedmetadata = () => {
      setAudioDuration(audio.duration - 10 > 0 ? audio.duration - 10 : audio.duration);
      audio.currentTime = 10; // 10. saniyeden başlat
      audio.play();
    };
    audio.ontimeupdate = () => {
      if (audio.duration > 0) {
        setAudioProgress(((audio.currentTime - 10 > 0 ? audio.currentTime - 10 : 0) / (audio.duration - 10 > 0 ? audio.duration - 10 : audio.duration)) * 100);
      }
    };
    audio.onended = () => {
      setIsPlaying(false);
      setAudioProgress(100);
    };
    toast({
      title: "Ses çalıyor",
      description: `${testQuestions[currentQuestion].frequency} - ${testQuestions[currentQuestion].audioLevel} frekansta test sesi`,
      duration: 3000,
    });
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion]);

  const handleAnswer = (canHear: boolean) => {
    // Always stop audio immediately
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = ""; // force unload
    }
    setIsPlaying(false);
    setAudioProgress(0);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = canHear;
    setAnswers(newAnswers);
    if (currentQuestion < testQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setTestCompleted(true);
      showResults(newAnswers);
    }
  };

  const showResults = (testAnswers: boolean[]) => {
    const heardCount = testAnswers.filter(answer => answer).length;
    const percentage = (heardCount / testAnswers.length) * 100;
    
    let resultMessage = "";
    if (percentage >= 80) {
      resultMessage = "İşitmeniz normal görünüyor.";
    } else if (percentage >= 50) {
      resultMessage = "Hafif bir işitme kaybı olabilir.";
    } else {
      resultMessage = "Bir uzmanla görüşmenizi öneririz.";
    }

    toast({
      title: "Test tamamlandı!",
      description: `${heardCount}/3 sesi duydunuz. ${resultMessage}`,
      duration: 5000,
    });
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setTestCompleted(false);
    setIsPlaying(false);
  };

  const onSubmitForm = async (data: any) => {
    setSending(true);
    // Test ve anket sonuçlarını hazırla
    const answersSummary = answers
      .map((ans, i) => `${testQuestions[i].frequency} - ${testQuestions[i].audioLevel}: ${ans ? "Evet" : "Hayır"}`)
      .join("\n");
    const surveyData = Object.entries(surveyAnswers)
      .map(([k, v]) => {
        const q = surveyQuestions.find(q => q.id === k);
        const opt = likertOptions.find(o => o.value === v);
        return `${q?.text}: ${opt?.label}`;
      })
      .join("\n");

    const payload = {
      answers: answersSummary,
      survey: surveyData,
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      comment: data.comment || '',
    };

    try {
      // Örnek: /api/send-results endpointine POST
      await fetch("/api/send-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setSurveySent(true);
      reset();
      toast({
        title: "Teşekkürler!",
        description: "Sonuçlarınız başarıyla gönderildi.",
        duration: 5000,
      });
    } catch (e) {
      toast({
        title: "Hata",
        description: "Sonuçlar gönderilemedi. Lütfen tekrar deneyin.",
        duration: 5000,
      });
    } finally {
      setSending(false);
    }
  };

  if (testCompleted && !showContact && !showDealers) {
    // Stepper: sırayla 3 soru, sonra teşekkür, sonra iletişim
    if (surveyStep < surveyQuestions.length) {
      const q = surveyQuestions[surveyStep];
      return (
        <>
          <HeaderBar />
          <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center p-4" style={{paddingTop: '140px'}}>
            <Card className="bg-gradient-card shadow-strong border border-border p-0 md:p-0 overflow-hidden rounded-2xl max-w-xl w-full hover:shadow-medium transition-all duration-300">
              {/* Header */}
              <div className="w-full bg-gradient-primary py-6 px-8 flex flex-col items-center justify-center">
                <span className="inline-flex items-center gap-2 bg-accent px-6 py-3 rounded-full mb-2">
                  <span className="text-2xl font-extrabold text-[#232323] tracking-tight">Kısa Anket</span>
                </span>
                <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-0">İşitme Testi Anketi</h2>
              </div>
              <form className="p-8 md:p-12" onSubmit={e => { e.preventDefault(); if (surveyAnswers[q.id]) setSurveyStep(surveyStep + 1); }}>
                <div className="mb-8">
                  <label className="block mb-6 font-semibold text-xl text-foreground text-center">{q.text}</label>
                  <RadioGroup className="grid grid-cols-2 md:grid-cols-5 gap-4 justify-center" value={surveyAnswers[q.id] || ""} onValueChange={v => setSurveyAnswers(a => ({ ...a, [q.id]: v }))}>
                    {likertOptions.map(opt => (
                      <label key={opt.value} className="flex flex-col items-center gap-2 bg-accent/60 rounded-xl p-4 cursor-pointer shadow-soft hover:shadow-medium transition-all duration-200 border border-border">
                        <RadioGroupItem value={opt.value} />
                        <span className="text-sm font-medium text-accent-foreground">{opt.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>
                <Button type="submit" variant="oticon" className="w-full h-12 text-lg font-semibold shadow-medium" disabled={!surveyAnswers[q.id]}>Sonraki</Button>
              </form>
            </Card>
          </div>
        </>
      );
    }
    if (surveyStep === surveyQuestions.length) {
      return (
        <>
          <HeaderBar />
          <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center p-4" style={{paddingTop: '140px'}}>
            <Card className="bg-gradient-card shadow-strong border border-border p-0 md:p-0 overflow-hidden rounded-2xl max-w-xl w-full hover:shadow-medium transition-all duration-300 text-center">
              <div className="w-full bg-gradient-primary py-8 px-8 flex flex-col items-center justify-center">
                <h2 className="text-5xl font-extrabold text-white mb-0">Teşekkürler!</h2>
              </div>
              <div className="p-8 md:p-12">
                <p className="text-lg text-muted-foreground mb-8">Yanıtlarınız başarıyla kaydedildi.</p>
                <Button onClick={() => setShowContact(true)} variant="oticon" className="w-full h-12 text-lg font-semibold shadow-medium">Test Sonucu İçin Devam Edin</Button>
              </div>
            </Card>
          </div>
        </>
      );
    }
  }



  // Final sayfası - test ve anket tamamlandıktan sonra
  if (testCompleted && showContact && !showDealers) {
    // Test ve anket sonuçlarını string olarak hazırla
    const testResultsString = answers
      .map((ans, i) => `${testQuestions[i].frequency}-${testQuestions[i].audioLevel}:${ans ? "Duydu" : "Duymadı"}`)
      .join("; ");
    const surveyResultsString = Object.entries(surveyAnswers)
      .map(([k, v]) => {
        const q = surveyQuestions.find(q => q.id === k);
        const opt = likertOptions.find(o => o.value === v);
        return `${q?.text}:${opt?.label}`;
      })
      .join("; ");

    // İletişim formunun olduğu ekranda, teşekkür mesajını popup/overlay olarak göster:
    // 1. Mesaj sayfanın üzerinde floating olarak gösterilsin
    // 2. Otomatik kaybolma olmasın, sadece kapat butonuna tıklayınca kaybolsun
    // 3. Mesaj ayrı sayfa taklidi yapmasın, sadece popup gibi görünsün

    // Form submit fonksiyonunda setTimeout kaldırılacak:
    // setShowContactThanks(true);
    // form.reset();
    // setTimeout(() => {
    //   setShowContactThanks(false);
    // }, 3500); // Bu satır kaldırılacak

    // Teşekkür mesajı popup olarak gösterilecek:
    if (showContactThanks) {
      return (
        <>
          <HeaderBar />
          <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center p-4" style={{paddingTop: '140px'}}>
            <Card className="bg-gradient-card shadow-strong border border-border p-0 md:p-0 overflow-hidden rounded-2xl max-w-xl w-full hover:shadow-medium transition-all duration-300 text-center">
              <div className="w-full bg-gradient-primary py-8 px-8 flex flex-col items-center justify-center">
                <h2 className="text-5xl font-extrabold text-white mb-0">Teşekkürler!</h2>
              </div>
              <div className="p-8 md:p-12">
                <p className="text-lg text-muted-foreground mb-8">Test sonucunu size gönderebilmemiz için lütfen aşağıdaki formu doldurun. Sonucunuzu hemen iletelim.</p>
                <Button onClick={() => setShowContactThanks(false)} variant="oticon" className="w-full h-12 text-lg font-semibold shadow-medium">Kapat</Button>
              </div>
            </Card>
          </div>
        </>
      );
    }

    return (
      <>
        <HeaderBar />
        <div className="min-h-screen bg-gradient-subtle" style={{paddingTop: '140px'}}>
          <ContactForm 
            testResultsString={testResultsString}
            surveyResultsString={surveyResultsString}
            onBackToIntro={onBackToIntro}
            showBackButton={true}
          />
        </div>
      </>
    );
  }

  // Her adım tam ekran kart olarak, otomatik ses ve progress bar ile
  return (
    <>
      <HeaderBar />
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4" style={{paddingTop: '140px', paddingBottom: '60px'}}>
        <div className="w-full max-w-2xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                Soru {currentQuestion + 1} / {testQuestions.length}
              </span>
              <span className="text-sm text-muted-foreground">
                %{Math.round(progress)} tamamlandı
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          {/* Test Card */}
          <Card className="bg-gradient-card shadow-strong border border-border p-0 md:p-0 overflow-hidden rounded-2xl max-w-xl mx-auto hover:shadow-medium transition-all duration-300">
            {/* Renkli üst şerit */}
            <div style={{ background: frequencyMeta[testQuestions[currentQuestion].frequency].color, height: 12 }} />
            <div className="p-8 md:p-12 flex flex-col gap-8">
              <div className="flex flex-col items-center gap-3">
                <div className="inline-flex items-center gap-2 bg-accent px-4 py-2 rounded-full">
                  <Volume2 className="w-5 h-5 text-accent-foreground" />
                  <span className="text-base font-medium text-accent-foreground">
                    {testQuestions[currentQuestion].frequency} - {testQuestions[currentQuestion].audioLevel}
                  </span>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full mt-1" style={{ background: frequencyMeta[testQuestions[currentQuestion].frequency].color, color: testQuestions[currentQuestion].frequency === '1000 Hz' ? '#333' : '#fff' }}>
                  {frequencyMeta[testQuestions[currentQuestion].frequency].label}
                </span>
                <VolumeBar level={testQuestions[currentQuestion].volume} />
              </div>
              <h2 className="text-2xl font-bold text-foreground text-center">İşitme Testi</h2>
              <p className="text-muted-foreground max-w-md mx-auto text-center text-lg">
                {testQuestions[currentQuestion].instruction}
              </p>
              {/* Audio Progress Bar & Controls */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-full max-w-xs">
                  <Progress value={audioProgress} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{formatTime(audioRef.current?.currentTime ? Math.max(audioRef.current.currentTime - 10, 0) : 0)}</span>
                    <span>{formatTime(audioDuration)}</span>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    if (audioRef.current) {
                      if (isPlaying) {
                        audioRef.current.pause();
                        setIsPlaying(false);
                      } else {
                        audioRef.current.currentTime = 10;
                        audioRef.current.play();
                        setIsPlaying(true);
                      }
                    }
                  }}
                  variant="oticon"
                  className="w-40 h-14 rounded-full text-lg shadow-medium mt-2"
                >
                  {isPlaying ? (
                    <VolumeX className="w-8 h-8" />
                  ) : (
                    <Volume2 className="w-8 h-8" />
                  )}
                  {isPlaying ? " Durdur" : " Tekrar Çal"}
                </Button>
              </div>
              {/* Answer Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 max-w-md mx-auto">
                <Button
                  onClick={() => handleAnswer(true)}
                  variant="oticon"
                  size="lg"
                  className="flex-1 h-14 text-lg font-semibold"
                >
                  Evet, Duyuyorum
                </Button>
                <Button
                  onClick={() => handleAnswer(false)}
                  variant="outline"
                  size="lg"
                  className="flex-1 h-14 text-lg font-semibold"
                >
                  Hayır, Duymuyorum
                </Button>
              </div>
              {/* Back Button */}
              <div className="pt-4 text-center">
                <Button onClick={onBackToIntro} variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  ← Ana sayfaya dön
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
    </>
  );
};

