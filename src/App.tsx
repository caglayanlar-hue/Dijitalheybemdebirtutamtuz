/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Dijital Heybemde Bir Tutam Tuz: Anlam Matrisinden Yapay Zeka Asistanına Kültürel Kodlar
 * Açık Gri ve Sarı Tonlarında Folklor ve Kültürel Kodlar Platformu
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Key, 
  Shield, 
  BookOpen, 
  Globe, 
  MapPin, 
  CheckCircle, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Info, 
  Award, 
  Volume2, 
  VolumeX, 
  Bot, 
  Coffee, 
  HelpCircle, 
  X,
  Compass,
  PenTool,
  Bookmark,
  Printer,
  Trash2,
  Share2,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';

// 29-harfli Türk Alfabesi (Kesinlikle Q, W, X yoktur)
const TURKISH_ALPHABET = [
  'A', 'B', 'C', 'Ç', 'D', 'E', 'F', 'G', 'Ğ', 'H',
  'I', 'İ', 'J', 'K', 'L', 'M', 'N', 'O', 'Ö', 'P',
  'R', 'S', 'Ş', 'T', 'U', 'Ü', 'V', 'Y', 'Z'
];

export interface StoryBookItem {
  id: string;
  title: string;
  idiom: string;
  author: string;
  date: string;
  genre: string;
  story: string;
  moral: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'welcome' | 'crypto' | 'healing' | 'tales' | 'world' | 'map' | 'wheel'>('welcome');
  const [studentName, setStudentName] = useState<string>('Genç Bilge');
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Görev Başarı Rozetleri
  const [badges, setBadges] = useState<Record<string, boolean>>({
    missingWord: false,
    caesarCipher: false,
    healingCards: false,
    talesRead: false,
    worldTour: false,
    mapExplored: false,
    storyWritten: false
  });

  // 1. Kriptografi State (Cevaplar asla ekranda söylenmez!)
  const [missingWordInput, setMissingWordInput] = useState<string>('');
  const [missingWordSolved, setMissingWordSolved] = useState<boolean>(false);
  const [missingWordError, setMissingWordError] = useState<string | null>(null);

  // Sezar Şifrelemesi (Şifreli metin: VYCOY, Kaydırma: 3 -> Çözüm: TUZLU)
  const [caesarShift, setCaesarShift] = useState<number>(3);
  const [caesarUserInput, setCaesarUserInput] = useState<string>('');
  const [caesarSolved, setCaesarSolved] = useState<boolean>(false);
  const [caesarError, setCaesarError] = useState<string | null>(null);

  // TDK Sözlük Arama / Filtreleme
  const [tdkSearch, setTdkSearch] = useState<string>('');

  // 2. Anadolu Şifa & İnanç Kartları (Flip State)
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({
    tuzlama: false,
    tuzCevirme: false,
    alKarisi: false,
    tuzluKahve: false
  });

  // 3. Masallar ve Efsaneler - Doğal Türkçe Seslendirme Motoru
  const [currentNarratingKey, setCurrentNarratingKey] = useState<string | null>(null);
  const [openAccordion, setOpenAccordion] = useState<string | null>('tuzkadarsevmek');
  const [speechSpeed, setSpeechSpeed] = useState<number>(0.88); // Masalcı anlatım temposu
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');
  const [detectedVoiceName, setDetectedVoiceName] = useState<string>('');
  const speechQueueRef = useRef<string[]>([]);
  const isSpeakingRef = useRef<boolean>(false);

  // 4. Dünya Turu Slider
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  // 5. Türkiye Tuz Kaynakları Keşif Merkezi & İnteraktif Bilgi Yarışması State
  const [sourceSubTab, setSourceSubTab] = useState<'vitrin' | 'quiz' | 'matris' | 'rehber'>('vitrin');
  const [mapCategoryFilter, setMapCategoryFilter] = useState<string>('all');
  const [sourceSearch, setSourceSearch] = useState<string>('');
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

  // 6. Deyim ve Atasözü Çarkı & Hikaye Kitabı Atölyesi State
  const [wheelRotation, setWheelRotation] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [selectedWheelItem, setSelectedWheelItem] = useState<{
    term: string;
    type: string;
    meaning: string;
    origin: string;
    promptIdea: string;
    color: string;
  } | null>(null);

  // Hikaye Yazma Form State
  const [storyTitle, setStoryTitle] = useState<string>('');
  const [storyGenre, setStoryGenre] = useState<string>('Geleneksel Masal');
  const [storyContent, setStoryContent] = useState<string>('');
  const [storyMoral, setStoryMoral] = useState<string>('');
  const [activeBookStoryId, setActiveBookStoryId] = useState<string | null>(null);
  const [storyBookTab, setStoryBookTab] = useState<'yaz' | 'kitap'>('yaz');

  // Hikaye Kitabı Koleksiyonu (Öğrenci masalları ve başlangıç külliyatı)
  const [storyBook, setStoryBook] = useState<StoryBookItem[]>(() => {
    try {
      const saved = localStorage.getItem('tuz_hikaye_kitabi');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return [
      {
        id: 'story-demo-1',
        title: 'Tuz Ekmek ve Ak Saçlı Dede',
        idiom: 'Tuz ekmek hakkı bilmek (Deyim)',
        author: 'Genç Bilge',
        date: '2026',
        genre: 'Geleneksel Masal',
        story: 'Kaf Dağı’nın ardındaki ulu bir vadide fırtınaya yakalanan genç bir yolcu, dağ başında tek göz bir kulübeye sığındı. İhtiyar bir derviş, heybesindeki son somunu bölüp bir avuç kaya tuzuyla sofrasını yolcuyla paylaştı. Yıllar geçti, yolcu büyük bir kervanbaşı oldu. Günün birinde dervişin memleketine vardığında, ona en değerli kumaşlar yerine bir çuval beyaz cevher tuz hediye etti ve dedi ki: "Paylaştığımız bir lokma ekmek ve bir tutam tuzun hakkı, dünyadaki bütün hazinelerden daha kutsaldır."',
        moral: 'Paylaşılan sofranın vefası ömür boyu unutulmaz; tuz ekmek hakkı insanı insan yapan en yüce bağdır.'
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('tuz_hikaye_kitabi', JSON.stringify(storyBook));
    } catch {
      // ignore
    }
  }, [storyBook]);

  // Canvas Tuz Kristalleri Arka Plan Efekti (Açık sarı ve beyaz parıltılar)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles = Array.from({ length: 45 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.8 + 1,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: Math.random() * 0.7 + 0.3,
      opacity: Math.random() * 0.5 + 0.2
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y > height) {
          p.y = -8;
          p.x = Math.random() * width;
        }
        ctx.fillStyle = `rgba(245, 158, 11, ${p.opacity * 0.7})`;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Web Audio Basit Ses Efektleri
  const playSound = (freq = 580) => {
    if (isMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {
      // ignore
    }
  };

  // Sezar Çözücü Fonksiyonu (SADECE 29 Harfli Türk Alfabesi)
  const decryptTurkishCaesar = (ciphertext: string, shift: number): string => {
    return ciphertext
      .split('')
      .map((char) => {
        const index = TURKISH_ALPHABET.indexOf(char);
        if (index === -1) return char;
        const newIndex = (index - shift + 29) % 29;
        return TURKISH_ALPHABET[newIndex];
      })
      .join('');
  };

  // Doğal Türkçe Ses Motoru Seçicisi
  const getNaturalTurkishVoice = (): SpeechSynthesisVoice | null => {
    if (!('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    const trVoices = voices.filter((v) => v.lang.toLowerCase().startsWith('tr'));
    if (trVoices.length === 0) return null;

    if (selectedVoiceName) {
      const custom = trVoices.find((v) => v.name === selectedVoiceName);
      if (custom) return custom;
    }

    // Doğal, Online veya Premium sesleri öne al (Google Türkçe, Microsoft Tolga/Emel, Yelda)
    const natural = trVoices.find((v) => {
      const n = v.name.toLowerCase();
      return (
        n.includes('natural') ||
        n.includes('online') ||
        n.includes('neural') ||
        n.includes('google') ||
        n.includes('yelda') ||
        n.includes('tolga') ||
        n.includes('emel') ||
        n.includes('cem')
      );
    });
    return natural || trVoices[0];
  };

  useEffect(() => {
    const updateVoiceList = () => {
      if ('speechSynthesis' in window) {
        const v = getNaturalTurkishVoice();
        if (v) {
          setDetectedVoiceName(v.name);
        }
      }
    };
    updateVoiceList();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoiceList;
    }
  }, [selectedVoiceName]);

  const stopSpeaking = () => {
    isSpeakingRef.current = false;
    speechQueueRef.current = [];
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setCurrentNarratingKey(null);
  };

  // Doğal Türkçe Masalcı Seslendirme Motoru (Cümle cümle nefes aralıklı ve akıcı)
  const speakText = (textKey: string, textToSpeak: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Tarayıcınız sesli okuma özelliğini desteklemiyor.');
      return;
    }

    if (currentNarratingKey === textKey) {
      stopSpeaking();
      return;
    }

    stopSpeaking();
    setCurrentNarratingKey(textKey);

    // Metni doğal masal anlatımı için cümlelere ayır
    const cleaned = textToSpeak
      .replace(/[*#_~"]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const sentences = cleaned
      .split(/(?<=[.!?…])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (sentences.length === 0) {
      setCurrentNarratingKey(null);
      return;
    }

    speechQueueRef.current = [...sentences];
    isSpeakingRef.current = true;

    const voice = getNaturalTurkishVoice();
    if (voice) {
      setDetectedVoiceName(voice.name);
    }

    const playNextSentence = () => {
      if (!isSpeakingRef.current || speechQueueRef.current.length === 0) {
        setCurrentNarratingKey(null);
        isSpeakingRef.current = false;
        return;
      }

      const sentence = speechQueueRef.current.shift();
      if (!sentence) {
        setCurrentNarratingKey(null);
        isSpeakingRef.current = false;
        return;
      }

      const utter = new SpeechSynthesisUtterance(sentence);
      utter.lang = 'tr-TR';
      utter.rate = speechSpeed; // Masalcı anlatım hızı (0.88x)
      utter.pitch = 1.0;
      if (voice) utter.voice = voice;

      utter.onend = () => {
        // İki cümle arasında doğal insan nefesi ve masal duraklaması (160ms)
        if (isSpeakingRef.current) {
          setTimeout(playNextSentence, 160);
        }
      };

      utter.onerror = () => {
        if (isSpeakingRef.current && speechQueueRef.current.length > 0) {
          setTimeout(playNextSentence, 100);
        } else {
          setCurrentNarratingKey(null);
          isSpeakingRef.current = false;
        }
      };

      window.speechSynthesis.speak(utter);
    };

    playNextSentence();
  };

  // Şifre Kontrolleri (Önceden cevabı ifşa etmez!)
  const handleSolveMissingWord = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = missingWordInput.trim().toLocaleUpperCase('tr-TR');
    if (clean === 'TUZ EKMEK HAKKI') {
      playSound(880);
      setMissingWordSolved(true);
      setMissingWordError(null);
      setBadges((prev) => ({ ...prev, missingWord: true }));
      triggerConfetti();
    } else {
      playSound(220);
      setMissingWordError('Girdiğiniz ifade şifreyle uyuşmadı! Sofranın kutsallığını ve paylaşılan ekmeğin vefasını düşünün.');
    }
  };

  const handleSolveCaesar = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = caesarUserInput.trim().toLocaleUpperCase('tr-TR');
    if (clean === 'TUZLU') {
      playSound(880);
      setCaesarSolved(true);
      setCaesarError(null);
      setBadges((prev) => ({ ...prev, caesarCipher: true }));
      triggerConfetti();
    } else {
      playSound(220);
      setCaesarError('Girilen kelime doğru değil! Şifreli metindeki her harfi Türk alfabesinde 3 adım geriye doğru sayarak çözün.');
    }
  };

  const triggerConfetti = () => {
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch {
      // ignore
    }
  };

  const toggleFlipCard = (cardKey: string) => {
    playSound(600);
    setFlippedCards((prev) => {
      const updated = { ...prev, [cardKey]: !prev[cardKey] };
      if (Object.values(updated).some(Boolean)) {
        setBadges((b) => ({ ...b, healingCards: true }));
      }
      return updated;
    });
  };

  // Tuz Kâşifi İnteraktif Bilgi Yarışması Soruları
  const saltSourcesQuiz = [
    {
      id: 1,
      question: "Türkiye'nin yıllık sofra ve sanayi tuzu ihtiyacının %60'ından fazlasını tek başına karşılayan devasa tektonik havzamız hangisidir?",
      options: [
        "İzmir Çamaltı Lagünü",
        "Tuz Gölü (Şereflikoçhisar)",
        "Van Gölü Havzası",
        "Eğirdir Gölü Çanağı"
      ],
      correct: 1,
      explanation: "Tuz Gölü; tektonik çöküntü havzası ve yaz aylarında buharlaşarak tabanında 10 ila 30 cm saf tuz bırakan kristal yapısıyla Türkiye'nin ana tuz ambarıdır."
    },
    {
      id: 2,
      question: "Hititler döneminden (yaklaşık 5.000 yıl önce) beri işletilen, 20-30 milyon yıllık antik Tetis Denizi fosil çökellerinden oluşan devasa kaya tuzu mağarası hangi ilimizdedir?",
      options: [
        "Çankırı",
        "Kırşehir",
        "Nevşehir",
        "Konya"
      ],
      correct: 0,
      explanation: "Çankırı Kaya Tuzu Mağarası; 1 milyar tonluk devasa rezervi ve solunum yollarına şifa olan haloterapi galerileriyle Hititlerden miras bir doğa harikasıdır."
    },
    {
      id: 3,
      question: "Gediz Deltası Kuş Cenneti kıyısında, Ege güneşi ve meltemiyle buharlaştırılan Türkiye'nin en büyük deniz tuzlası hangisidir?",
      options: [
        "Ayvalık Kıyı Tuzlası",
        "Çamaltı Tuzlası (İzmir / Çiğli)",
        "Antalya Körfezi",
        "Çanakkale Boğazı"
      ],
      correct: 1,
      explanation: "Çamaltı Tuzlası; yıllık yaklaşık 500.000 tonluk üretimiyle Türkiye deniz tuzu üretiminin neredeyse tamamını tek başına sağlar."
    },
    {
      id: 4,
      question: "Ermenistan sınırında bulunan, 55 dönümlük yer altı tünelleri ve negatif tuz iyonlarıyla astım/bronşit hastaları için doğal şifa merkezine dönüştürülen tuz galerileri neresidir?",
      options: [
        "Erzincan Kemah",
        "Iğdır Tuzluca Kaya Tuzu Galerileri",
        "Kars Kağızman",
        "Ağrı Doğubayazıt"
      ],
      correct: 1,
      explanation: "Iğdır Tuzluca; Aras Nehri vadisindeki devasa tuz dağları ve tünelleriyle Doğu Anadolu'nun hem en büyük kaya tuzu ocağı hem de doğal sağlık turizmi merkezidir."
    },
    {
      id: 5,
      question: "Yerin yüzlerce metre derinliğindeki kaya tuzu damarlarından süzülerek çıkan ve meşhur Erzincan tulum peynirine lezzetini veren katkısız kaynak tuzu hangisidir?",
      options: [
        "Kemah Doğal Kaynak Tuzu",
        "Çankırı Kaya Tuzu",
        "Çamaltı Deniz Tuzu",
        "Tuz Gölü Tuzu"
      ],
      correct: 0,
      explanation: "Kemah Doğal Kaynak Tuzu; Fırat Karasu havzasındaki dağ sularından dinlendirilerek üretilir ve peyniri diri tutan zengin doğal minerallere sahiptir."
    }
  ];

  const handleSelectQuizOption = (optionIndex: number) => {
    if (quizAnswered) return;
    setSelectedQuizOption(optionIndex);
    setQuizAnswered(true);

    const isCorrect = optionIndex === saltSourcesQuiz[quizIndex].correct;
    if (isCorrect) {
      playSound(880);
      setQuizScore((prev) => prev + 20);
    } else {
      playSound(220);
    }
  };

  const handleNextQuizQuestion = () => {
    if (quizIndex < saltSourcesQuiz.length - 1) {
      setQuizIndex((prev) => prev + 1);
      setSelectedQuizOption(null);
      setQuizAnswered(false);
      playSound(650);
    } else {
      setQuizCompleted(true);
      playSound(900);
      setBadges((b) => ({ ...b, mapExplored: true }));
      triggerConfetti();
    }
  };

  const handleRestartQuiz = () => {
    setQuizIndex(0);
    setSelectedQuizOption(null);
    setQuizScore(0);
    setQuizAnswered(false);
    setQuizCompleted(false);
    playSound(650);
  };

  // 🎡 Çark Dilimleri Veritabanı: Bölüm 2 "Dilimizdeki Tuz" (TDK Külliyatı) Deyimleri ve Atasözleri
  const wheelSlices = [
    {
      term: 'Tuz ekmek hakkı bilmek',
      type: 'Deyim',
      meaning: 'Birlikte yemek yenilen, sofrası paylaşılan kişiye karşı minnet duymak; yapılan iyiliği unutmayıp asla hıyanet etmemek.',
      origin: 'Kutadgu Bilig ve Dede Korkut boylarından beri süregelen en kadim vefa kuralıdır.',
      promptIdea: 'Zor zamanında bir dervişin bir tutam tuzunu paylaşan bir kahramanın yıllar sonraki vefa yolculuğunu anlat.',
      color: '#F59E0B' // Amber
    },
    {
      term: 'Çorbada tuzu olmak',
      type: 'Deyim',
      meaning: 'Birlikte yürütülen hayırlı, büyük veya ortak bir işte az da olsa bir katkısı, emeği, gayreti ve hissesi bulunmak.',
      origin: 'İmece usulü büyük köy meydanında kaynayan ortak kazana her hanenin bir tutam tuz katarak aşa ortak olması geleneğidir.',
      promptIdea: 'Bir köyün yıkılan taş köprüsünü el birliğiyle yeniden inşa ederken küçük çırağın getirdiği harç tuzu.',
      color: '#3B82F6' // Mavi
    },
    {
      term: 'Aşa tuz gerek, söze us gerek',
      type: 'Atasözü',
      meaning: 'Yemeğin tadı tuz ile geldiği gibi, sözün de kıymeti, ağırlığı ve değeri akıl (us) iledir.',
      origin: 'Eski Türkçede akıl manasına gelen "us" sözü ile tuz arasındaki lezzet ve hikmet dengesidir.',
      promptIdea: 'Gereksiz konuşan bir vezir ile az ama akıllıca konuşarak obayı felaketten kurtaran bilge çobanın kıssası.',
      color: '#8B5CF6' // Mor
    },
    {
      term: 'Tuzu biberi olmak',
      type: 'Deyim',
      meaning: 'Bir olaya, meclise, sohbete veya yaşantıya hoş bir tat, renk, tatlı bir heyecan ve çekici bir canlılık katmak; onu tamamlamak.',
      origin: 'Yemeğin lezzetini doruğa çıkaran tuz ve karabiber ikilisinin hayattaki tatlandırıcı rollere benzetilmesidir.',
      promptIdea: 'Sessiz ve neşesiz kalmış bir kasabayı anlattığı eğlenceli masallarla şenlendiren güleç yüzlü bir ozan.',
      color: '#F97316' // Turuncu
    },
    {
      term: 'Tuzu kuru olmak',
      type: 'Deyim',
      meaning: 'Maddi kaygısı veya geçim derdi bulunmamak; hali vakti yerinde ve rahatı eksiksiz olmak.',
      origin: 'Tuzun rutubet alıp erime tehlikesi olmadan kuru saklanabilmesi zenginlik ve emniyet göstergesiydi.',
      promptIdea: 'Kuru tuz ambarına sahip varlıklı bir beyin, çetin kış gününde darda kalan köylülerle ambarını paylaşmayı öğrenişi.',
      color: '#06B6D4' // Camgöbeği
    },
    {
      term: 'Tuz buz etmek',
      type: 'Deyim',
      meaning: 'Bir şeyi şiddetli bir vuruşla veya çarpmayla kırıp paramparça etmek; un ufak hale getirip dağıtmak.',
      origin: 'Kaya tuzu ve sert buz kalıplarının çekiç veya darbeyle ufalanıp toz tanelerine ayrılmasından türemiştir.',
      promptIdea: 'Karanlık bir engeli aşmak için tuz mağarasındaki kibir aynasını kırarak obayı aydınlığa kavuşturan bir kahraman.',
      color: '#EC4899' // Pembe
    },
    {
      term: 'Tuz biber ekmek',
      type: 'Deyim',
      meaning: 'Mevcut bir üzüntünün, sıkıntının veya öfkenin etkisini daha da artıracak, ateşe körükle gidecek söz söylemek veya davranışta bulunmak.',
      origin: 'Açık ve sızlayan bir yaraya tuz ve yakıcı karabiber dökülmesinin verdiği tarifsiz acıdan kinayedir.',
      promptIdea: 'İki komşunun yanlış anlaşılmasını tatlıya bağlamak yerine yangına körükle giden bir dedikoducunun aldığı ders.',
      color: '#EF4444' // Kırmızı
    },
    {
      term: 'Tuz koktu',
      type: 'Deyim / Atasözü',
      meaning: '"Et kokarsa tuz basarlar, tuz kokarsa ne yaparlar?" sözünden kinaye; toplumda en güvenilir adalet ve ahlakın bozulması hali.',
      origin: 'Bozulmayı önleyen son çare tuz iken, tuzun da kokması ve bozulması halindeki mutlak çaresizliğe dikkat çeker.',
      promptIdea: 'Kadim Tuz Gölü kıyısındaki adalet terazisini korumak için mücadele eden dürüst kâtibin macerası.',
      color: '#10B981' // Zümrüt Yeşil
    },
    {
      term: 'Yaraya tuz basmak',
      type: 'Deyim',
      meaning: 'Bir kimsenin acısını veya kederini daha da artırmak; ya da katlanılması çok güç bir ızdıraba fedakarca dayanmak.',
      origin: 'Geleneksel tıpta kanamayı durdurmak ve mikrobu kırmak için yaraya tuz basılması büyük bir acı verirdi.',
      promptIdea: 'Dağ başında yaralanan yoldaşını şifalı tuzla tedavi eden ve ona sabrın değerini anlatan hekimin serüveni.',
      color: '#E11D48' // Gül Kırmızı
    },
    {
      term: 'Tuzsuz aş, akılsız baş',
      type: 'Atasözü',
      meaning: 'Tuzu olmayan bir yemek nasıl lezzetsiz ve zevksiz ise, aklı başında olmayan insan da çevresine öyle faydasızdır.',
      origin: 'Halk felsefesinde tuz ve aklın hayatın iki temel direği sayılması.',
      promptIdea: 'Aklı ve tedbiri elden bırakıp fırtınaya hazırlıksız yakalanan bir kervancının tuzdan aldığı derin hikmet.',
      color: '#6366F1' // İndigo
    }
  ];

  // Çarkı Çevirme Fonksiyonu
  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSelectedWheelItem(null);
    playSound(440);

    // Rastgele dönüş açısı (en az 5 tam tur + rastgele dilim)
    const totalSlices = wheelSlices.length;
    const randomIndex = Math.floor(Math.random() * totalSlices);
    const sliceAngle = 360 / totalSlices;
    
    // İşaretçi üstte (90 derece) veya sağda durur; hedeflenen dilimi tepeye getirmek için açı hesaplama
    const extraRotations = (5 + Math.floor(Math.random() * 4)) * 360;
    const targetAngle = extraRotations + (360 - (randomIndex * sliceAngle) - (sliceAngle / 2));
    
    // Ses efekti aralığı
    const soundInterval = setInterval(() => {
      playSound(300 + Math.random() * 200);
    }, 120);

    setWheelRotation((prev) => prev + targetAngle);

    setTimeout(() => {
      clearInterval(soundInterval);
      setIsSpinning(false);
      const chosen = wheelSlices[randomIndex];
      setSelectedWheelItem(chosen);
      setStoryTitle(chosen.term + ' Hikayesi');
      setStoryContent(''); // Öğrencilerin doldurması için metin boş başlar
      playSound(880);
      triggerConfetti();
    }, 4000);
  };

  // Yeni Hikaye Kaydetme Fonksiyonu
  const handleSaveStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyTitle.trim() || !storyContent.trim()) {
      alert('Lütfen hikaye başlığı ve hikaye metnini doldurun.');
      return;
    }

    const newStory: StoryBookItem = {
      id: 'story-' + Date.now(),
      title: storyTitle.trim(),
      idiom: selectedWheelItem ? `${selectedWheelItem.term} (${selectedWheelItem.type})` : 'Geleneksel Tuz Deyimi / Atasözü',
      author: studentName.trim() || 'Genç Yazar',
      date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
      genre: storyGenre,
      story: storyContent.trim(),
      moral: storyMoral.trim() || 'Bu hikayeden çıkarılan ders: Tuzun ve vefanın kıymeti bilinmelidir.'
    };

    setStoryBook((prev) => [newStory, ...prev]);
    setActiveBookStoryId(newStory.id);
    setStoryBookTab('kitap');
    setBadges((b) => ({ ...b, storyWritten: true }));
    // Yeni hikaye yazmak için form alanlarını sıfırla
    setStoryTitle('');
    setStoryContent('');
    setStoryMoral('');
    playSound(950);
    triggerConfetti();
  };

  // TDK Deyimler ve Atasözleri Veritabanı (Zenginleştirilmiş Külliyat)
  const tdkDictionary = [
    {
      term: 'Tuz ekmek hakkı bilmek',
      type: 'Deyim',
      meaning: 'Birlikte yemek yenilen, sofrası paylaşılan kimseye karşı minnet duymak; yapılan iyiliği unutmayıp asla hıyanet etmemek.',
      origin: 'Kutadgu Bilig ve Dede Korkut boylarından beri süregelen en kadim vefa kuralıdır.'
    },
    {
      term: 'Tuz buz etmek (Tuz buz ekmek)',
      type: 'Deyim',
      meaning: 'Bir şeyi şiddetli bir vuruşla veya çarpmayla kırıp paramparça etmek; un ufak hale getirip dağıtmak.',
      origin: 'Kaya tuzu ve sert buz kalıplarının çekiç veya darbeyle ufalanıp toz tanelerine ayrılmasından türemiştir.'
    },
    {
      term: 'Tuz buz olmak',
      type: 'Deyim',
      meaning: 'Şiddetli bir darbe veya düşme sonucu un ufak dağılmak, paramparça hale gelmek; mecazen umutların, hayallerin tamamen yıkılması.',
      origin: 'Sert tuz kristallerinin yere çarpmasıyla zerrelerine ayrılması gibi darmadağın olmayı ifade eder.'
    },
    {
      term: 'Tuz biber ekmek (Tuz biber serpmek)',
      type: 'Deyim',
      meaning: 'Mevcut bir üzüntünün, sıkıntının, öfkenin veya kötü durumun etkisini daha da artıracak, ateşe körükle gidecek söz söylemek veya davranışta bulunmak.',
      origin: 'Açık ve sızlayan bir yaraya tuz ve yakıcı karabiber dökülmesinin verdiği tarifsiz acıdan kinayedir.'
    },
    {
      term: 'Tuz koktu (Tuz kokmak)',
      type: 'Deyim / Atasözü Kalıbı',
      meaning: '"Et kokarsa tuz basarlar, tuz kokarsa ne yaparlar?" sözünden kinaye; toplumda adaletin, ahlakın veya en güvenilir makamların yozlaştığı, artık hiçbir çarenin kalmadığı durumu anlatır.',
      origin: 'Bozulmayı önleyen son çare tuz iken, tuzun da kokması ve bozulması halindeki mutlak çaresizliğe dikkat çeker.'
    },
    {
      term: 'Tuzu biberi olmak',
      type: 'Deyim',
      meaning: 'Bir olaya, meclise, sohbete veya yaşantıya hoş bir tat, renk, tatlı bir heyecan ve çekici bir canlılık katmak; onu tamamlamak.',
      origin: 'Yemeğin lezzetini doruğa çıkaran tuz ve karabiber ikilisinin hayattaki tatlandırıcı rollere benzetilmesidir.'
    },
    {
      term: 'Çorbada tuzu olmak',
      type: 'Deyim',
      meaning: 'Birlikte yürütülen hayırlı, büyük veya ortak bir işte az da olsa bir katkısı, emeği, gayreti ve hissesi bulunmak.',
      origin: 'İmece usulü büyük köy meydanında kaynayan ortak kazana her hanenin bir tutam tuz katarak aşa ortak olması geleneğidir.'
    },
    {
      term: 'Tuzu kuru olmak',
      type: 'Deyim',
      meaning: 'Maddi kaygısı veya geçim derdi bulunmamak; hali vakti yerinde ve rahatı eksiksiz olmak.',
      origin: 'Tuzun rutubet alıp erime tehlikesi olmadan kuru saklanabilmesi zenginlik ve emniyet göstergesiydi.'
    },
    {
      term: 'Aşa tuz gerek, söze us gerek',
      type: 'Atasözü',
      meaning: 'Yemeğin tadı tuz ile geldiği gibi, sözün de kıymeti, ağırlığı ve değeri akıl (us) iledir.',
      origin: 'Eski Türkçede akıl manasına gelen "us" sözü ile tuz arasındaki lezzet ve hikmet dengesidir.'
    },
    {
      term: 'Yaraya tuz basmak',
      type: 'Deyim',
      meaning: 'Bir kimsenin acısını veya kederini daha da artırmak; ya da katlanılması çok güç bir ızdıraba fedakarca dayanmak.',
      origin: 'Geleneksel tıpta kanamayı durdurmak ve mikrobu kırmak için yaraya tuz basılması büyük bir acı verirdi.'
    },
    {
      term: 'Tuzlayayım da kokma',
      type: 'Deyim',
      meaning: 'Gereksiz yere akıl vermeye kalkan, bayat veya faydasız fikirler öne süren kimseyle alay etmek.',
      origin: 'Etin ve gıdaların bozulup kokmaması için tuzlanması kuralına atıf yapan nükte.'
    },
    {
      term: 'Tuzsuz aş, akılsız baş',
      type: 'Atasözü',
      meaning: 'Tuzu olmayan bir yemek nasıl lezzetsiz ve zevksiz ise, aklı başında olmayan insan da çevresine öyle faydasızdır.',
      origin: 'Halk felsefesinde tuz ve aklın hayatın iki temel direği sayılması.'
    },
    {
      term: 'Tuz ekmek düşmanı olmak',
      type: 'Deyim',
      meaning: 'Kendisine ikramda bulunan, ekmeğini paylaştığı kişiye karşı nankörlük etmek ve kötülük düşünmek.',
      origin: 'Oğuz töresinde en ağır ahlaki kusur ve lanet sayılan nankörlük durumu.'
    },
    {
      term: 'Kokarsa tuz kokar, ona ne yapsın sakar',
      type: 'Atasözü',
      meaning: 'Bozulan maddeleri tuz korur; ancak koruyucu olan tuzun kendisi bozulursa artık onu düzeltecek hiçbir çare kalmaz.',
      origin: 'Toplumda adalet, ahlak veya temel kanunlar yozlaşırsa felaketin kaçınılmaz olduğunu anlatır.'
    }
  ];

  const filteredTdk = tdkDictionary.filter(
    (item) => item.term.toLocaleLowerCase('tr-TR').includes(tdkSearch.toLocaleLowerCase('tr-TR')) ||
              item.meaning.toLocaleLowerCase('tr-TR').includes(tdkSearch.toLocaleLowerCase('tr-TR'))
  );

  // Masallar ve Efsaneler Metinleri (Uzun ve Orijinal Halleriyle)
  const talesData = [
    {
      id: 'tuzkadarsevmek',
      title: 'Tuz Kadar Sevmek (Seni Tuz Kadar Seviyorum)',
      category: 'Türk Halk Masalı',
      icon: '👑',
      content: `Bir varmış, bir yokmuş; evvel zaman içinde, kalbur saman içinde, develer tellal iken, pireler berber iken memleketin birinde adil fakat gururlu bir padişah yaşarmış. Bu padişahın canından çok sevdiği üç tane dünya güzeli kızı varmış. Günlerden bir gün padişah tahtına oturup kızlarını huzuruna çağırmış ve onların sevgisini tartmak istemiş:

"Ey benim gözümün nuru kızlarım! Söyleyin bakalım, beni ne kadar seversiniz?" diye sual eylemiş.

Büyük kız derhal öne atılarak göz kamaştıran bir edayla:
"Babacığım, ben seni dünyadaki tüm hazineler, dağlar dolusu sarı altınlar kadar çok severim!" demiş. Padişahın pek hoşuna gitmiş, göğsü kabarmış.

Sıra ortanca kıza gelmiş. Ortanca kız boynunu bükerek:
"Babacığım, ben seni yerin altından çıkarılan paha biçilmez zümrütler, yakutlar ve elmaslar kadar severim!" demiş. Padişah gururla gülümsemiş, ona da iltifatlar yağdırmış.

Sıra en küçük kıza gelince, küçük kız sevgi dolu gözlerle babasının yüzüne bakmış ve gayet sakin bir sesle:
"Babacığım, ben seni yemekteki tuz kadar severim!" deyivermiş.

Padişah bu cevabı duyunca bir anda küplere binmiş. Gözlerinden şimşekler çakmış, kaşları çatılmış:
"Bre nankör kız! Ablaların beni altınlara, yakutlara layık görürken sen beni değersiz, alelade bir tuza mı layık gördün? Tuz dediğin nedir ki sokakta toz gibi savrulur!" diyerek gazaba gelmiş. Küçük kızını saraydan kovmuş, ülkenin en ücra köşesine sürgüne göndermiş.

Küçük kız bir dağ köyünde kendi halinde, mütevazı bir yaşam kurmuş. Aradan uzun yıllar geçmiş. Padişah ihtiyarlamış ve sarayında cümle vezirlerin, beylerin ve elçilerin katıldığı kırk gün kırk gece sürecek devasa bir ziyafet vermiş. Küçük kız gizlice sarayın aşçıbaşına haber salmış ve yüklü bir bahşiş vererek sofradaki bütün nefis etlerin, dolmaların, böreklerin ve çorbaların tek bir zerre dahi tuz konmadan pişirilmesini rica etmiş.

Büyük ziyafet günü gelmiş çatmış. Sofralar altın tabaklarla, gümüş kadehlerle donatılmış. Padişah iştahla kızarmış kuzu etinden bir lokma almış; fakat alır almaz yüzünü buruşturup tükürmüş. Çorbadan bir kaşık tatmış, boğazından geçmemiş. Börekten ısırmış, saman gibi gelmiş. Ne yediğinden lezzet alabilmiş ne de ağzına bir lokma koyabilmiş. Öfkeyle kükremiş:
"Aşçıbaşı tez buraya gelsin! Bu yemeklerin hali nedir? Sofrada bir dirhem lezzet yok!"

O sırada ziyafet salonuna giren küçük kızı peçesini aralayarak babasının önüne bir tuzluk koymuş ve şöyle demiş:
"Babacığım, gördün mü? Altın tabaklar, elmas kadehler karnını doyuramadı. İnsanın boğazından geçen lokmaya can veren, yemeği tatlandıran altından da zümrütten de kıymetli olan tuzdur. Ben seni tuz kadar severim derken, varlığının benim için hayat kadar vazgeçilmez olduğunu anlatmak istemiştim."

Padişah hatasını anlamış, gözyaşları içinde kızına sarılmış. O günden sonra sarayda tuz, altından daha kıymetli sayılmış.`
    },
    {
      id: 'tuzbaba',
      title: 'Tuz Baba Efsanesi',
      category: 'Tarihi Menkıbe · İstanbul',
      icon: '⚔️',
      content: `1453 yılının kutlu baharında, Sultan II. Mehmet Han ordusuyla Konstantiniyye surlarının önüne dayanmıştı. Muhasara günlerce sürmüş; top sesleri yeri göğü inletirken, ordugâhta yüz binlerce gazinin, leventlerin ve yeniçerilerin iaşesi büyük kazanlarda kaynamaktaydı.

Fakat kuşatmanın en çetin haftalarında ordugâhta beklenmedik bir darlık yaşandı: Askerin tuz stoku tükendi! Tuzsuz pişen bulgurlar, etler ve ekmekler askere tatsız gelmeye, neferler takatten düşmeye başladı. Aşçılar telaş içinde durumu vezirlere bildirdi; çünkü o devirde tuzu denizden taşımak veya uzak kaya ocaklarından getirmek günler alacaktı.

Tam bu kederli anda, Beşiktaş bağlarının yamaçlarında inzivada yaşayan, aksakallı, nurani yüzlü bir derviş ordugâhın mutfak çadırına çıkageldi. Sırtında eski, mütevazı bir yün heybe asılıydı. Derviş tebessümle aşçıbaşına yaklaştı:
"Aşçıbaşı kardeş, gazilerin aşına tuz gerekmiş, heybemizden kabul buyurursunuz mu?" dedi.

Aşçıbaşı çaresizlikle heybeye baktı; altı üstü bir avuçluk küçücük bir torbaydı. Yüz bin askerin kazanına nasıl yetecekti? Fakat erenlerin haline hürmeten:
"Getir derviş baba, ne varsa koyuver kazanlara," dedi.

İşte o an bir hikmet tecelli etti! Derviş heybesine elini daldırdı; avuç avuç, öbek öbek bembeyaz, billur gibi parlayan kaya tuzunu kazanlara boca etmeye başladı. Birinci kazana, onuncu kazana, yüzüncü kazana... Günler boyunca heybeden tuz döküldü fakat o küçücük torbadaki tuz bir zerre dahi eksilmedi! Kazanlar kaynadı, gaziler şifa buldu, güçlerine güç katıldı.

Askerler bu mübarek zata "Tuz Baba" adını verdiler. Fetihten sonra da Tuz Baba o tepede yaşamaya devam etti ve Hakk'a yürüdüğünde oraya defnedildi. Türk'ün fethinde tuz; yalnızca yemeğin tadı değil, velilerin bereketi ve askerin manevi azığı olarak tarihe kazındı.`
    },
    {
      id: 'tuzgolu',
      title: 'Tuz Gölü Efsanesi (Bağ Sahibesi Kadının Bedduası)',
      category: 'Anadolu Efsanesi · İç Anadolu',
      icon: '🌾',
      content: `Çok eski zamanlarda, henüz İç Anadolu'nun ortasındaki o uçsuz bucaksız beyaz çöl yokken, Tuz Gölü'nün bulunduğu yer yemyeşil bir cennet bahçesiymiş. Her tarafı salkım salkım üzümlerle dolu, bal damlayan bağlar; etrafında çağıldayan pınarlar ve serin gölgelikler kaplarmış. Bu bereketli toprakların en büyük bağı da dünya malına tamah eden, eli sıkı, cimri bir ihtiyar kadına aitmiş.

Sıcak bir yaz günü, kavurucu güneşin altında uzun yollardan gelen, üstü başı toz içinde kalmış ak sakallı bir derviş bu bağın yanından geçmiş. Dervişin susuzluktan dudakları çatlamış, açlıktan mecali kalmamış. Bağın çitine yaslanıp çıkrık başında yün eğiren kadına seslenmiş:

"Selamünaleyküm ey hatun! Allah rızası için, şu ulu bağından bana bir salkımcık üzüm lütfetmez misin? Ağzım kurudu, canım darda..." demiş.

Bağ sahibesi kadın, dervişin perişan haline aldırmamış. Gözünü hırs bürümüş kadın, binlerce asmanın üzerindeki bal gibi üzümleri saklamak için yalan söylemiş:
"Yok derviş baba, görmez misin bağım kurudu, asmalarım çürüdü! Bu yıl bir tek tane bile üzüm vermedi!" diyerek dervişi azarlamış ve kovmuş.

Derviş hüzünle boynunu bükmüş. Kadının göz göre göre Allah'ın nimetini esirgediğini ve misafire bir lokmayı çok gördüğünü anlayınca ellerini göğe kaldırmış ve şöyle dua eylemiş:

"Madem öyle ey hatun;
Taş olasın, tuz olasın!
Hakkı esirgeyen bağın,
Bembeyaz bir tuz çölü kalsın!"

Derviş oradan uzaklaşır uzaklaşmaz gök gürlemiş, yer sarsılmış. O yemyeşil asmalar, bal damlayan salkımlar bir anda kristalleşip bembeyaz tuza dönüşmüş. Kadın da elindeki çıkrığıyla taş kesilmiş. Bağın bulunduğu koca vadi saniyeler içinde bembeyaz, kıraç bir tuz gölüne dönmüş.

Anadolu insanı asırlardır bu efsaneyi anlatır ve çocuklarına şu dersi verir: "Tuz ve ekmek esirgenmez; misafirden nimet saklanmaz. Nimetin şükrü paylaşmaktır."`
    }
  ];

  // Dünya Turu Slider Verileri
  const worldSlides = [
    {
      id: 'english',
      country: 'İngiliz Kültürü & Anglo-Sakson Dünyası',
      title: 'The Salt of the Earth: "Dünyanın Tuzu" ve İyiliğin Özü',
      badge: 'İngiliz Dili ve Kültürü',
      icon: '👑',
      desc: '"The salt of the earth": "Dünyanın tuzu" anlamına gelen ve çok dürüst, güvenilir, asil ve iyi kalpli insanlar için kullanılan yaygın bir İngilizce deyimdir. Nasıl ki tuz yeryüzünün en saf cevheri olarak bozulmayı önler ve hayata lezzet katarsa; toplumun vicdanını, dürüstlüğünü ve adaletini ayakta tutan asil ruhlu kimseler de "dünyanın tuzu" olarak nitelendirilir. İngiliz edebiyatında ve gündelik hayatta bir kimseye yapılabilecek en yüksek ahlaki övgüdür.'
    },
    {
      id: 'rome',
      country: 'Antik Roma İmparatorluğu',
      title: 'Asker Maaşı Olarak Tuz: "Salarium" ve Via Salaria',
      badge: 'Antik Akdeniz & Hukuk',
      icon: '🏛️',
      desc: 'Roma lejyonerlerine zorlu seferlerde hizmetleri karşılığında bir miktar tuz veya tuz satın almaları için özel bir altın ödenek verilirdi. Latince tuz anlamına gelen "sal" kökünden türeyen "salarium", bugün modern Batı dillerinde maaş anlamına gelen "salary" kelimesinin doğuş kaynağıdır. Ayrıca Roma\'nın en eski ticaret yollarından biri olan "Via Salaria" (Tuz Yolu), Adriyatik Denizi\'nden başkente tuz taşımak için inşa edilmiştir.'
    },
    {
      id: 'china',
      country: 'Antik ve Orta Çağ Çin İmparatorluğu',
      title: 'Guanzi Doktrini, Devlet Tekeli ve Çin Seddi',
      badge: 'Doğu Asya & Maliye Tarihi',
      icon: '🏯',
      desc: 'M.Ö. 7. yüzyılda devlet adamı Guan Zhong tarafından yazılan "Guanzi" adlı eserde tuzun vergilendirilmesi ilk kez teorileştirilmiştir. Çin hanedanlıklarında tuz üretimi imparatorluk tekeline alınmış; tuzdan elde edilen devasa gelirler orduyu, Çin Seddi\'nin tahkimatını ve Sarı Nehir ile Yangtze\'yi birbirine bağlayan tarihi Büyük Çin Kanalı\'nın (Grand Canal) inşasını finanse etmiştir.'
    },
    {
      id: 'slav',
      country: 'Slav Kültürü & Doğu Avrupa',
      title: 'Kutsal Karşılama Töreni: "Hleb i Sol" (Ekmek ve Tuz)',
      badge: 'Doğu Avrupa & Diplomasi',
      icon: '🌾',
      desc: 'Slav halklarında devlet başkanları veya en aziz misafirler geleneksel işlemeli havlular ("rushnyk") üzerinde sunulan yuvarlak bir köy ekmeği ve ortasındaki tuzlukla karşılanır. Konuk ekmekten bir parça koparıp tuza banarak yer. Ekmek toprağın bereketini, tuz ise bozulmayan ebedi dostluğu simgeler. Rusça "hlebososolny" (cömert, konuksever) kelimesi doğrudan bu gelenekten türemiştir.'
    },
    {
      id: 'egypt',
      country: 'Antik Mısır',
      title: 'Ölümsüzlük Tuzu: Natron ve Mumyalama',
      badge: 'Nil Havzası & Tıp Tarihi',
      icon: '🏺',
      desc: 'Antik Mısırlılar Nil Deltası yakınındaki göllerden elde edilen ve doğal sodyum bileşiklerinden oluşan "Natron" tuzunu kutsal sayarlardı. Natron, bedenlerin çürümeden ölümsüzlüğe geçmesini sağlayan mumyalama ritüelinin temel taşıydı. Aynı zamanda balık tuzlama endüstrisi firavunların en büyük vergi kaynaklarından biriydi.'
    },
    {
      id: 'africa',
      country: 'Sahra Çölü & Batı Afrika',
      title: 'Tuzun Altınla Gram Gram Takas Edildiği Azalai Kervanları',
      badge: 'Sahra & Kervan Ticareti',
      icon: '🐪',
      desc: 'Orta Çağ\'da Sahra Çölü\'nün tuz madenlerinden (Taghaza ve Taoudenni) çıkarılan tuz blokları, binlerce deveden oluşan "Azalai" kervanlarıyla Timbuktu\'ya taşınırdı. Tuz o kadar kıymetliydi ki çölün güneyindeki ormanlık bölgelerde bir gram kaya tuzu bir gram saf altın tozu ile birebir takas edilirdi.'
    }
  ];

  // Türkiye'nin Tuz Kaynakları (Gerçek Coğrafi Koordinat ve Detay Veritabanı)
  const turkeySaltSources: Record<string, {
    name: string;
    province: string;
    type: string;
    category: 'lake' | 'sea' | 'rock' | 'spring';
    svgX: number; // 1150x540 SVG koordinatı
    svgY: number;
    icon: string;
    geology: string;
    details: string;
    capacity: string;
  }> = {
    tuzgolu: {
      name: 'Tuz Gölü',
      province: 'Şereflikoçhisar (Ankara) - Aksaray - Konya',
      type: 'Göl Tuzu (Güneşte Buharlaşma)',
      category: 'lake',
      svgX: 520,
      svgY: 300,
      icon: '🪞',
      geology: 'İç Anadolu tektonik çöküntü havzası; Türkiye\'nin en sığ ve tuz oranı en yüksek (%32.9) doğal gölüdür.',
      details: 'Türkiye\'nin sofra ve sanayi tuzu ihtiyacının %60\'ından fazlasını tek başına karşılar. Yaz aylarında şiddetli buharlaşma sonucu suları çekilir ve tabanda 10 ila 30 cm kalınlığında kar beyazı kristal tuz tabakası oluşur. Mekanik yöntemlerle hasat edilir.',
      capacity: 'Yılda 1.5 - 2 milyon ton rekor üretim.'
    },
    camalti: {
      name: 'Çamaltı Tuzlası (Gediz Deltası)',
      province: 'İzmir (Çiğli / Menemen)',
      type: 'Deniz Tuzu',
      category: 'sea',
      svgX: 205,
      svgY: 335,
      icon: '🌊',
      geology: 'Gediz Nehri Deltası kıyı lagünleri ve sığ deniz buharlaştırma tavaları.',
      details: 'Türkiye\'nin en köklü ve en büyük deniz tuzu sahasıdır. Ege\'nin güçlü güneşi ve meltem rüzgarıyla deniz suyunun sığ tavalarda kademeli yoğunlaştırılmasıyla üretilir. Kuş Cenneti ile iç içe eşsiz bir ekosisteme sahiptir.',
      capacity: 'Yılda yaklaşık 500.000 ton (Türkiye deniz tuzu üretiminin neredeyse tamamı).'
    },
    cankiri: {
      name: 'Çankırı Kaya Tuzu Mağarası',
      province: 'Çankırı (İç Anadolu)',
      type: 'Kaya Tuzu (Fosil Deniz Çökeli)',
      category: 'rock',
      svgX: 485,
      svgY: 178,
      icon: '⛏️',
      geology: 'Tersiyer dönemine ait (yaklaşık 20-30 milyon yıllık) antik Tetis Denizi çökelleri.',
      details: 'Hititler döneminden (yaklaşık 5.000 yıl önce) beri işletilen tarihi devasa yer altı galerileridir. İçine kamyonların rahatça girdiği geniş tünelleri ve saf mineral yapısıyla astım/KOAH hastaları için doğal bir "haloterapi" (tuzla şifa) merkezidir.',
      capacity: 'Türkiye\'nin en büyük yer altı kaya tuzu rezervlerinden biri (1 milyar ton tahmini rezerv).'
    },
    kirsehir: {
      name: 'Tepesidelik Tuzlası',
      province: 'Kırşehir (Kaman / Merkez)',
      type: 'Kaya Tuzu & Kaynak Tuzu',
      category: 'spring',
      svgX: 555,
      svgY: 275,
      icon: '🧂',
      geology: 'Kırşehir masifine bağlı yer altı tuz kubbeleri ve tuzlu artezyen pınarları.',
      details: 'Hem yer altı kaya tuzu olarak hem de yer altından çıkan yoğun tuzlu kaynak sularının yüzey tavalarında buharlaştırılmasıyla elde edilen geleneksel İç Anadolu tuzlasıdır.',
      capacity: 'Bölgesel sofra, peynir ve hayvancılık tuzu üretimi.'
    },
    tuzluca: {
      name: 'Tuzluca Kaya Tuzu Galerileri',
      province: 'Iğdır (Doğu Anadolu)',
      type: 'Kaya Tuzu (Sağlık & Turizm)',
      category: 'rock',
      svgX: 1045,
      svgY: 275,
      icon: '🏔️',
      geology: 'Aras Nehri vadisindeki devasa dağlık tuz kütlesi.',
      details: 'Ermenistan sınırında bulunan Tuzluca, 55 dönümlük devasa yer altı tuz tünellerine sahiptir. Havasındaki yüksek negatif tuz iyonları sayesinde solunum yolu hastalıkları için doğal bir şifa ve nefes merkezine dönüştürülmüştür.',
      capacity: 'Doğu Anadolu\'nun en büyük kaya tuzu kaynağı.'
    },
    ayvalik: {
      name: 'Ayvalık Deniz Tuzlası',
      province: 'Balıkesir (Kuzey Ege)',
      type: 'Deniz Tuzu',
      category: 'sea',
      svgX: 175,
      svgY: 295,
      icon: '⛵',
      geology: 'Edremit Körfezi kıyı lagünleri ve sığ tuz tavaları.',
      details: 'Kuzey Ege\'nin poyraz rüzgarları ve güçlü güneşiyle deniz suyunun buharlaştırıldığı tarihi kıyı tuzlasıdır. Zeytincilik ve balık salamurasında kullanılan geleneksel deniz tuzudur.',
      capacity: 'Zeytincilik, balıkçılık ve gurme mutfak tuzu.'
    },
    kemah: {
      name: 'Kemah Doğal Kaynak Tuzu',
      province: 'Erzincan (Doğu Anadolu)',
      type: 'Doğal Kaynak Suyu Tuzu',
      category: 'spring',
      svgX: 810,
      svgY: 250,
      icon: '💧',
      geology: 'Yukarı Fırat (Karasu) havzası dağ derinliklerinden çıkan doğal tuzlu kaynak suları.',
      details: 'Yerin yüzlerce metre derinliğindeki kaya tuzu damarlarından süzülerek yeryüzüne çıkan berrak kaynak sularının güneş havuzlarında kurutulmasıyla elde edilir. Katkısız, kimyasalsız ve zengin minerallidir.',
      capacity: 'Erzincan tulum peynirinin vazgeçilmez geleneksel tuzu.'
    },
    sivas: {
      name: 'Zara ve Hafik Tuzlaları',
      province: 'Sivas (İç Doğu Anadolu)',
      type: 'Kaynak Tuzu',
      category: 'spring',
      svgX: 735,
      svgY: 232,
      icon: '🏞️',
      geology: 'Kızılırmak üst havzası jipsli ve tuzlu formasyon kaynakları.',
      details: 'Evliya Çelebi\'nin Seyahatnamesi\'nde övgüyle bahsettiği kadim kaynak tuzlalarıdır. Osmanlı saray mutfağına gönderilen şifalı tuzlar arasında yer almıştır.',
      capacity: 'Geleneksel organik kaynak tuzu üretimi.'
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-200 text-slate-800 flex flex-col font-sans overflow-x-hidden selection:bg-amber-400 selection:text-slate-950">
      {/* Arka Plan Tuz Kristali Parçacık Animasyonu (Canvas) */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

      {/* Üst Bilgi Başlığı (Header) - Canlı, Enerjik Sarı & Altın Vurgulu Görkemli Tasarım */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 border-b-4 border-amber-500 shadow-lg px-4 lg:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 md:w-16 md:h-16 rounded-2xl bg-slate-950 text-amber-300 flex items-center justify-center shadow-xl font-black text-3xl md:text-4xl ring-3 ring-white/80 shrink-0">
              🧂
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-cinzel font-black text-slate-950 tracking-wide uppercase leading-tight drop-shadow-sm">
                DİJİTAL HEYBEMDE BİR TUTAM TUZ
              </h1>
              <div className="text-[11px] sm:text-xs md:text-sm text-amber-950 font-mono font-black uppercase tracking-widest flex items-center gap-2 mt-0.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-950 animate-ping"></span>
                <span>ANLAM MATRİSİNDEN YAPAY ZEKA ASİSTANINA KÜLTÜREL KODLAR</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Toplanan Rozet Sayacı */}
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 bg-slate-950 text-amber-300 border-2 border-amber-400 rounded-2xl text-xs font-mono font-black shadow-md tracking-wider">
              <Award className="w-4 h-4 text-amber-400" />
              <span>HEYBE: {Object.values(badges).filter(Boolean).length} / 7</span>
            </div>

            <button
              onClick={() => {
                stopSpeaking();
                setIsMuted(!isMuted);
              }}
              className="p-2.5 rounded-2xl bg-white/90 text-slate-950 hover:bg-slate-950 hover:text-amber-300 transition-all border-2 border-amber-500 shadow-md cursor-pointer"
              title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Sekmeler / Menü Navigasyonu - BÜYÜK HARFLERLE, BELİRGİN, CANLI VE RENKLİ */}
        <div className="max-w-7xl mx-auto mt-3 overflow-x-auto pb-1.5 flex items-center gap-2.5 scrollbar-thin scrollbar-thumb-amber-600">
          {[
            { id: 'welcome', label: '1. ASİSTAN KARŞILAMA', icon: Bot, badgeColor: 'bg-indigo-600' },
            { id: 'crypto', label: '2. DİLİMİZDE TUZ (KRİPTO & TDK)', icon: Key, badgeColor: 'bg-emerald-600' },
            { id: 'healing', label: '3. ANADOLU İNANIŞLARI & TUZLU KAHVE', icon: Shield, badgeColor: 'bg-rose-600' },
            { id: 'tales', label: '4. MASALLAR & EFSANELER (SESLİ)', icon: BookOpen, badgeColor: 'bg-purple-600' },
            { id: 'world', label: '5. FARKLI KÜLTÜRLERDE TUZ', icon: Globe, badgeColor: 'bg-sky-600' },
            { id: 'map', label: '6. TÜRKİYE TUZ KAYNAKLARI KEŞİF MERKEZİ', icon: Sparkles, badgeColor: 'bg-teal-600' },
            { id: 'wheel', label: '7. DEYİM VE ATASÖZÜ ÇARKI & HİKAYE KİTABI', icon: Compass, badgeColor: 'bg-red-600' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  stopSpeaking();
                  playSound(650);
                  setActiveTab(tab.id as typeof activeTab);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-black tracking-wider uppercase whitespace-nowrap transition-all duration-200 cursor-pointer shadow-sm ${
                  isActive
                    ? 'bg-slate-950 text-amber-300 ring-2 ring-white border-2 border-slate-950 scale-105 shadow-md'
                    : 'bg-white/95 text-slate-900 hover:bg-slate-950 hover:text-amber-300 hover:border-slate-950 border border-amber-200/80 font-extrabold'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-800'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Ana İçerik Alanı */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 lg:p-8">
        
        {/* ========================================================= */}
        {/* BÖLÜM 1: KARŞILAMA VE YAPAY ZEKA ASİSTANI EKRANI */}
        {/* ========================================================= */}
        {activeTab === 'welcome' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white border-2 border-amber-300 rounded-3xl p-6 md:p-10 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider mb-2">
                <Bot className="w-4 h-4 text-amber-600 animate-bounce" />
                <span>Yapay Zeka Folklor Asistanı Çevrim İçi</span>
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl md:text-4xl font-cinzel font-black text-slate-900">
                  Hoş Geldin, Sevgili Kültür Kâşifi!
                </h2>
                <div className="p-5 bg-amber-50/80 border-l-4 border-amber-500 rounded-r-2xl text-slate-700 text-sm md:text-base leading-relaxed font-sans shadow-xs">
                  <p className="font-semibold text-amber-900 mb-1">
                    Folklor Asistanı Diyor ki:
                  </p>
                  &quot;Merhaba! Ben senin dijital folklor rehberinim.
                  <strong> Türk&apos;ün bin yıllık kadim kültür havzasındaki tuzlu sırları çözmek ve mirasımızı keşfetmek için bölümlerdeki şifreleri bulmalısın!</strong> 
                  Unutma; tuz yalnızca yemeğe atılan bir tatlandırıcı değil; Türk&apos;ün andında vefa, ocağında şifa, kız isteme töresinde sabır ve dilinde hikmettir.
                  Şimdi heybene ilk bilgileri koymaya hazır mısın?&quot;
                </div>
              </div>

              {/* Araştırmacı Adı ve Başlangıç Butonu */}
              <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="w-full sm:w-auto">
                  <label htmlFor="studentInput" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Kâşif / Öğrenci Adı:
                  </label>
                  <input
                    id="studentInput"
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="px-4 py-2 bg-slate-50 border-2 border-amber-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-amber-500 font-cinzel w-full sm:w-64 font-bold"
                  />
                </div>

                <button
                  onClick={() => {
                    playSound(700);
                    setActiveTab('crypto');
                  }}
                  className="w-full sm:w-auto px-7 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-cinzel font-bold text-sm rounded-xl shadow-md border-2 border-amber-500 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <span>Maceraya Başla & Şifreleri Çöz</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bölüm Rehberi Önizleme Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1.5 shadow-xs">
                <div className="text-amber-800 font-cinzel font-bold text-sm flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-600" />
                  <span>Kriptografi & TDK</span>
                </div>
                <p className="text-xs text-slate-600">
                  29 harfli Türk alfabesinde Sezar şifresi ve TDK sözlüğündeki deyimleri keşfet.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1.5 shadow-xs">
                <div className="text-amber-800 font-cinzel font-bold text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-600" />
                  <span>Şifa & Tuzlu Kahve</span>
                </div>
                <p className="text-xs text-slate-600">
                  Bebek tuzlama, tuz çevirme, Al karısı inancı ve tuzlu kahve geleneğini çevirip öğren.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1.5 shadow-xs">
                <div className="text-amber-800 font-cinzel font-bold text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Tuz Kaynakları Atlası</span>
                </div>
                <p className="text-xs text-slate-600">
                  Türkiye&apos;nin göl, deniz, kaya ve kaynak tuzu madenlerini interaktif galeride keşfet.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* BÖLÜM 2: DİLİMİZDE TUZ (KRİPTOGRAFİ VE ŞİFRE ÇÖZME ODASI + TDK) */}
        {/* ========================================================= */}
        {activeTab === 'crypto' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
              <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider mb-1">
                <Key className="w-4 h-4" />
                <span>Bölüm 2 · Kriptografi ve Anlam Matrisi</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-cinzel font-bold text-slate-900">
                Dilimizde Tuz: Şifre Çözme Odası
              </h2>
              <p className="text-xs md:text-sm text-slate-600 mt-1">
                Şifreleri çözerken cevabı kendiniz bulmalısınız! Aşağıdaki ipuçlarını ve Türk alfabesi çarkını kullanın.
              </p>
            </div>

            {/* Mekanik 1: Eksik Harf Bulmacası (Cevap asla yazılmaz!) */}
            <div className="bg-white border-2 border-amber-300 rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-cinzel font-bold text-lg text-slate-900">
                  Mekanik 1: Eksik Harfli Vefa Şifresi
                </h3>
                <span className="text-xs bg-amber-100 text-amber-900 px-3 py-1 rounded-full font-mono font-bold">
                  Sözlü Töre Kalıbı
                </span>
              </div>

              <div className="text-center py-5 bg-slate-50 border-2 border-dashed border-amber-300 rounded-2xl">
                <div className="text-xs text-amber-800 font-mono font-bold uppercase tracking-widest mb-2">
                  ŞİFRELİ METİN KALIBI:
                </div>
                <div className="text-2xl md:text-4xl font-mono font-black tracking-widest text-slate-900">
                  T _ Z &nbsp; E _ M _ K &nbsp; H _ K _ I
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  (İpucu: Türk&apos;ün sofrasını paylaşanların birbirine duyduğu ebedi minnet ve sadakat borcu)
                </div>
              </div>

              <form onSubmit={handleSolveMissingWord} className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  placeholder="Çözdüğünüz üç kelimelik ifadeyi buraya yazınız..."
                  value={missingWordInput}
                  onChange={(e) => setMissingWordInput(e.target.value)}
                  disabled={missingWordSolved}
                  className="flex-1 px-4 py-2.5 bg-white border-2 border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 font-cinzel uppercase focus:outline-none focus:border-amber-500 w-full font-bold"
                />
                {!missingWordSolved ? (
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-cinzel font-bold text-xs md:text-sm rounded-xl border border-amber-500 shadow-sm transition-all cursor-pointer w-full sm:w-auto"
                  >
                    Şifreyi Sına
                  </button>
                ) : (
                  <div className="px-4 py-2 bg-emerald-100 border border-emerald-400 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Şifre Başarıyla Çözüldü</span>
                  </div>
                )}
              </form>

              {missingWordError && (
                <div className="text-xs text-red-700 bg-red-50 border border-red-300 p-2.5 rounded-xl font-medium">
                  {missingWordError}
                </div>
              )}

              {/* Çözüldükten sonra açılan kültürel anlam kartı */}
              {missingWordSolved && (
                <div className="p-4 bg-amber-50 border-2 border-amber-400 rounded-2xl space-y-2 text-xs md:text-sm text-slate-800 animate-fadeIn">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    Kültürel Kod: Ahde Vefa ve Sofranın Kutsallığı
                  </div>
                  <p>
                    <strong>TUZ EKMEK HAKKI:</strong> Kutadgu Bilig&apos;den Dede Korkut boylarına kadar Türk&apos;ün ahlak felsefesinde
                    aynı sofrayı paylaştığın insana asla hıyanet etmeme yeminidir. Tuz ekmek hakkını çiğneyen kimse törede en büyük nankör sayılır.
                  </p>
                </div>
              )}
            </div>

            {/* Mekanik 2: Sezar Şifrelemesi (SADECE 29 Harfli Türk Alfabesi - Cevap kesinlikle verilmez!) */}
            <div className="bg-white border-2 border-amber-300 rounded-3xl p-6 md:p-8 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-cinzel font-bold text-lg text-slate-900">
                  Mekanik 2: 29 Harfli Türk Sezar Şifresi
                </h3>
                <span className="text-xs bg-amber-100 text-amber-900 px-3 py-1 rounded-full font-mono font-bold">
                  Tam Türk Alfabesi (Q, W, X Yok)
                </span>
              </div>

              {/* 29 Harfli Türk Alfabesi Göstergesi */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
                <div className="font-bold text-amber-800">29 Harfli Türk Alfabesi Sıralaması:</div>
                <div className="font-mono text-[11px] text-slate-700 flex flex-wrap gap-1.5 leading-relaxed">
                  {TURKISH_ALPHABET.map((letter, i) => (
                    <span key={letter} className="px-1.5 py-0.5 bg-white border border-slate-300 rounded shadow-2xs font-semibold">
                      {letter}<sub className="text-amber-700 font-bold ml-0.5">{i}</sub>
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 pt-1">
                  Kural: Şifreleme 29 harfe göre yapılmıştır. İngilizce alfabe formülleri bu şifreyi çözemez!
                </p>
              </div>

              <div className="text-center py-5 bg-slate-50 border-2 border-dashed border-amber-300 rounded-2xl">
                <div className="text-xs text-amber-800 font-mono font-bold uppercase tracking-widest mb-1">
                  DEŞİFRE EDİLECEK 5 HARFLİ ŞİFRELİ METİN:
                </div>
                <div className="text-3xl md:text-5xl font-mono font-black tracking-widest text-slate-900 my-2">
                  V &nbsp; Y &nbsp; C &nbsp; O &nbsp; Y
                </div>
                <div className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  (Her harf 29 harfli Türk alfabesinde <strong>3 adım</strong> ileri kaydırılmıştır. Çözmek için yukarıdaki alfabeyi kullanarak harfleri geriye doğru adımlayın!)
                </div>
              </div>

              {/* İsteğe Bağlı Tek Harf Test Aracı (Cevap kesinlikle verilmez, öğrenci tek harfin nasıl kaydığını anlar) */}
              <div className="p-4 bg-amber-50/60 border border-amber-300 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700">Örnek Harf Kaydırma İpucu Aracı:</span>
                  <span className="text-slate-500">(Alfabede geriye doğru sayma mantığı)</span>
                </div>
                <div className="font-mono text-amber-950 font-bold bg-white px-3 py-1 rounded-xl border border-amber-300">
                  Örnek: Ç (-3) = A &nbsp;|&nbsp; D (-3) = B &nbsp;|&nbsp; E (-3) = C
                </div>
              </div>

              <form onSubmit={handleSolveCaesar} className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  placeholder="Çözdüğünüz 5 harfli gizli kelimeyi buraya yazınız..."
                  value={caesarUserInput}
                  onChange={(e) => setCaesarUserInput(e.target.value)}
                  disabled={caesarSolved}
                  className="flex-1 px-4 py-2.5 bg-white border-2 border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 font-cinzel uppercase focus:outline-none focus:border-amber-500 w-full font-bold"
                />
                {!caesarSolved ? (
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-cinzel font-bold text-xs md:text-sm rounded-xl border border-amber-500 shadow-sm transition-all cursor-pointer w-full sm:w-auto"
                  >
                    Şifreyi Sına
                  </button>
                ) : (
                  <div className="px-4 py-2 bg-emerald-100 border border-emerald-400 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Şifre Başarıyla Çözüldü</span>
                  </div>
                )}
              </form>

              {caesarError && (
                <div className="text-xs text-red-700 bg-red-50 border border-red-300 p-2.5 rounded-xl font-medium">
                  {caesarError}
                </div>
              )}

              {caesarSolved && (
                <div className="p-4 bg-amber-50 border-2 border-amber-400 rounded-2xl space-y-2 text-xs md:text-sm text-slate-800 animate-fadeIn">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    Tebrikler! 5 Harfli Şifreli Kelimeyi Başarıyla Çözdünüz!
                  </div>
                  <p>
                    29 harfli Türk alfabesinde her harfi 3 adım geriye kaydırarak şifreyi çözdünüz:<br />
                    V (-3) = T &nbsp;|&nbsp; Y (-3) = U &nbsp;|&nbsp; C (-3) = Z &nbsp;|&nbsp; O (-3) = L &nbsp;|&nbsp; Y (-3) = U <br />
                    Tuzun yemeğe verdiği lezzeti ve tadı nitelediği gibi mecazen maliyetli veya değeri yüksek durumları anlatan kadim sözümüz mühürlendi.
                  </p>
                </div>
              )}
            </div>

            {/* TDK Deyimler ve Atasözleri Genişletilmiş Kütüphanesi */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-cinzel font-bold text-lg text-slate-900">
                    TDK Sözlüğü: Tuz ile İlgili Deyim ve Atasözleri Külliyatı
                  </h3>
                  <p className="text-xs text-slate-500">
                    Türk Dil Kurumu sözlüğünde yer alan zengin semantik mirasımızı arayın ve inceleyin.
                  </p>
                </div>
                <input
                  type="text"
                  placeholder="Deyim veya anlam ara..."
                  value={tdkSearch}
                  onChange={(e) => setTdkSearch(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 w-full sm:w-48"
                />
              </div>

              {/* Hızlı Filtre Butonları */}
              <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 mr-1">Öne Çıkanlar:</span>
                <button
                  type="button"
                  onClick={() => setTdkSearch('')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    tdkSearch === '' ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Tümü ({tdkDictionary.length})
                </button>
                {[
                  'Tuz buz etmek',
                  'Tuz biber ekmek',
                  'Tuz koktu',
                  'Tuzu biberi olmak',
                  'Çorbada tuzu olmak',
                  'Tuz ekmek hakkı',
                  'Tuzu kuru',
                  'Yaraya tuz basmak'
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setTdkSearch(chip)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      tdkSearch === chip ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
                    }`}
                  >
                    {chip}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                {filteredTdk.map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1 hover:border-amber-400 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-cinzel font-bold text-xs md:text-sm text-slate-900">
                        {item.term}
                      </span>
                      <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-mono font-bold">
                        {item.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-sans">
                      <strong>Anlamı:</strong> {item.meaning}
                    </p>
                    <p className="text-[11px] text-amber-800 italic pt-1 border-t border-slate-200/60 font-sans">
                      💡 {item.origin}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* BÖLÜM 3: ANADOLU İNANIŞLARI VE ŞİFA (TUZLU KAHVE DAHİL) */}
        {/* ========================================================= */}
        {activeTab === 'healing' && (
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
              <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider mb-1">
                <Shield className="w-4 h-4" />
                <span>Bölüm 3 · Halk Hekimliği, Korunma ve Evlilik Töresi</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-cinzel font-bold text-slate-900">
                Anadolu İnanışları, Şifa ve Tuzlu Kahve
              </h2>
              <p className="text-xs md:text-sm text-slate-600 mt-1">
                Kartlara tıklayarak 3D animasyonla çevirin (flip); bebek tuzlamadan kız istemedeki tuzlu kahve sınavına kadar ritüellerin derin anlamlarını öğrenin.
              </p>
            </div>

            {/* 4 Adet 3D Flip Kart (Tuzlu Kahve Eklenmiş) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Kart 1: Tuzlama Geleneği */}
              <div
                onClick={() => toggleFlipCard('tuzlama')}
                className="h-88 cursor-pointer [perspective:1000px] select-none"
              >
                <div
                  className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] rounded-3xl border-2 border-amber-300 shadow-sm ${
                    flippedCards.tuzlama ? '[transform:rotateY(180deg)]' : ''
                  }`}
                >
                  <div className="absolute inset-0 [backface-visibility:hidden] bg-white rounded-3xl p-5 flex flex-col items-center justify-between text-center">
                    <span className="text-[10px] font-mono text-amber-700 font-bold uppercase tracking-widest">
                      1. Ritüel · Bebek Kültürü
                    </span>
                    <div className="space-y-2">
                      <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-2xl mx-auto border border-amber-300">
                        👶
                      </div>
                      <h3 className="text-base font-cinzel font-bold text-slate-900">
                        Bebek Tuzlama Geleneği
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Yeni doğan bebeğin 3., 7. veya kırkında tuzlu suyla yıkanması töresi.
                      </p>
                    </div>
                    <div className="text-[11px] text-amber-800 font-bold flex items-center gap-1">
                      <span>Bilgiyi Çevir</span>
                      <RotateCcw className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-amber-500 text-slate-950 rounded-3xl p-5 flex flex-col justify-between text-left">
                    <div>
                      <span className="text-[10px] font-mono text-amber-950 font-bold uppercase tracking-widest">
                        Şifa & Pişirme Sırrı
                      </span>
                      <h4 className="text-sm font-cinzel font-bold text-slate-950 mt-1 mb-2">
                        Deri Pişirme ve Ter Kokusunu Önleme
                      </h4>
                      <p className="text-xs leading-relaxed font-sans font-medium text-slate-900">
                        Anadolu halk hekimliğinde tuz, bebeğin narin cildini sertleştirip &quot;pişirir&quot;, pişiğe ve mikroba karşı zırh oluşturur.
                        İnanışa göre tuzlanan çocuğun ömür boyu teni kokmaz. Ayrıca çocuğun kötü nefes ve nazardan arınmasını sağlayan ilk kalkan kabul edilir.
                      </p>
                    </div>
                    <div className="text-[10px] font-mono font-bold text-amber-950 pt-2 border-t border-amber-600">
                      ✦ Koruyucu Halk Tıbbı
                    </div>
                  </div>
                </div>
              </div>

              {/* Kart 2: Tuz Çevirme */}
              <div
                onClick={() => toggleFlipCard('tuzCevirme')}
                className="h-88 cursor-pointer [perspective:1000px] select-none"
              >
                <div
                  className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] rounded-3xl border-2 border-amber-300 shadow-sm ${
                    flippedCards.tuzCevirme ? '[transform:rotateY(180deg)]' : ''
                  }`}
                >
                  <div className="absolute inset-0 [backface-visibility:hidden] bg-white rounded-3xl p-5 flex flex-col items-center justify-between text-center">
                    <span className="text-[10px] font-mono text-amber-700 font-bold uppercase tracking-widest">
                      2. Ritüel · Nazar Kalkanı
                    </span>
                    <div className="space-y-2">
                      <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-2xl mx-auto border border-amber-300">
                        🔥
                      </div>
                      <h3 className="text-base font-cinzel font-bold text-slate-900">
                        Tuz Çevirme & Tuz Bakısı
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Nazar değdiğine inanılan kişinin başında tuz çevrilip ocağa atılması.
                      </p>
                    </div>
                    <div className="text-[11px] text-amber-800 font-bold flex items-center gap-1">
                      <span>Bilgiyi Çevir</span>
                      <RotateCcw className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-amber-500 text-slate-950 rounded-3xl p-5 flex flex-col justify-between text-left">
                    <div>
                      <span className="text-[10px] font-mono text-amber-950 font-bold uppercase tracking-widest">
                        Kem Gözün Çatlaması
                      </span>
                      <h4 className="text-sm font-cinzel font-bold text-slate-950 mt-1 mb-2">
                        Ocakta Çıtırdayan Kem Göz
                      </h4>
                      <p className="text-xs leading-relaxed font-sans font-medium text-slate-900">
                        Bir tutam iri tuz hastanın başı çevresinde 3 veya 7 kez döndürülerek ocağın kor ateşine savrulur.
                        Tuz taneleri ateşte çatırdadıkça: <em>&quot;Kem gözler, haset yürekler işte böyle çatlasın!&quot;</em> denir.
                        Tuzun negatif enerjiyi emdiğine inanılır.
                      </p>
                    </div>
                    <div className="text-[10px] font-mono font-bold text-amber-950 pt-2 border-t border-amber-600">
                      ✦ Mistik Arınma Tılsımı
                    </div>
                  </div>
                </div>
              </div>

              {/* Kart 3: Al Karısı ve Tuz */}
              <div
                onClick={() => toggleFlipCard('alKarisi')}
                className="h-88 cursor-pointer [perspective:1000px] select-none"
              >
                <div
                  className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] rounded-3xl border-2 border-amber-300 shadow-sm ${
                    flippedCards.alKarisi ? '[transform:rotateY(180deg)]' : ''
                  }`}
                >
                  <div className="absolute inset-0 [backface-visibility:hidden] bg-white rounded-3xl p-5 flex flex-col items-center justify-between text-center">
                    <span className="text-[10px] font-mono text-amber-700 font-bold uppercase tracking-widest">
                      3. Ritüel · Lohusa İnancı
                    </span>
                    <div className="space-y-2">
                      <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-2xl mx-auto border border-amber-300">
                        🧿
                      </div>
                      <h3 className="text-base font-cinzel font-bold text-slate-900">
                        Al Karısı ve Ak Tuz
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Lohusa kadın ve bebeğini karanlık Al Basması varlığından koruma inancı.
                      </p>
                    </div>
                    <div className="text-[11px] text-amber-800 font-bold flex items-center gap-1">
                      <span>Bilgiyi Çevir</span>
                      <RotateCcw className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-amber-500 text-slate-950 rounded-3xl p-5 flex flex-col justify-between text-left">
                    <div>
                      <span className="text-[10px] font-mono text-amber-950 font-bold uppercase tracking-widest">
                        Mitolojik Kalkan
                      </span>
                      <h4 className="text-sm font-cinzel font-bold text-slate-950 mt-1 mb-2">
                        Demir Çivi, Ekmek ve Tuz
                      </h4>
                      <p className="text-xs leading-relaxed font-sans font-medium text-slate-900">
                        Eski Türk mitolojisindeki Al Karısı&apos;na karşı lohusanın yastığı altına <strong>demir çivi, bir parça ekmek ve bir avuç kaya tuzu</strong> konur.
                        Tuz safiyet ve çürümezliği simgelediği için karanlık ruhların odaya girmesini engeller.
                      </p>
                    </div>
                    <div className="text-[10px] font-mono font-bold text-amber-950 pt-2 border-t border-amber-600">
                      ✦ Mitolojik Korunma
                    </div>
                  </div>
                </div>
              </div>

              {/* Kart 4: Tuzlu Kahve Geleneği (YENİ EKLENEN) */}
              <div
                onClick={() => toggleFlipCard('tuzluKahve')}
                className="h-88 cursor-pointer [perspective:1000px] select-none"
              >
                <div
                  className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] rounded-3xl border-2 border-amber-400 shadow-sm ${
                    flippedCards.tuzluKahve ? '[transform:rotateY(180deg)]' : ''
                  }`}
                >
                  <div className="absolute inset-0 [backface-visibility:hidden] bg-white rounded-3xl p-5 flex flex-col items-center justify-between text-center">
                    <span className="text-[10px] font-mono text-amber-700 font-bold uppercase tracking-widest">
                      4. Ritüel · Evlilik Töresi
                    </span>
                    <div className="space-y-2">
                      <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-2xl mx-auto border border-amber-400">
                        ☕
                      </div>
                      <h3 className="text-base font-cinzel font-bold text-slate-900">
                        Tuzlu Kahve Geleneği
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Kız isteme merasiminde damat adayının kahvesine tuz konulması töresi.
                      </p>
                    </div>
                    <div className="text-[11px] text-amber-800 font-bold flex items-center gap-1">
                      <span>Bilgiyi Çevir</span>
                      <RotateCcw className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-amber-500 text-slate-950 rounded-3xl p-5 flex flex-col justify-between text-left">
                    <div>
                      <span className="text-[10px] font-mono text-amber-950 font-bold uppercase tracking-widest">
                        Sabır & Tahammül İmtihanı
                      </span>
                      <h4 className="text-sm font-cinzel font-bold text-slate-950 mt-1 mb-2">
                        &quot;Kahrını da Lütfunu da Çekerim&quot;
                      </h4>
                      <p className="text-xs leading-relaxed font-sans font-medium text-slate-900">
                        Eski devirlerde gelin adayının gönlünün olup olmadığını ima etme yoluyken; günümüzde damadın sabrını ve kıza olan bağlılığını sınar.
                        Damat yüzünü buruşturmadan tuzlu kahveyi içerse: <em>&quot;Senin elinden zehir gelse içerim, evlilikteki her acıya ve zorluğa seninle katlanırım&quot;</em> mesajını verir.
                      </p>
                    </div>
                    <div className="text-[10px] font-mono font-bold text-amber-950 pt-2 border-t border-amber-600">
                      ✦ Sevgi ve Sabır Ahdi
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* BÖLÜM 4: TUZLU MASALLAR VE EFSANELER (UZUN VE SESLENDİRMELİ) */}
        {/* ========================================================= */}
        {activeTab === 'tales' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                <span>Bölüm 4 · Masal ve Efsaneler</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-cinzel font-bold text-slate-900">
                Tuzlu Masallar, Efsaneler ve Maniler
              </h2>
              <p className="text-xs md:text-sm text-slate-600 font-medium">
                Masal ve efsaneler okuyabilir ve dinleyebilirsiniz
              </p>
            </div>

            {/* Akordeon Menü - Uzun Metinler & TTS Butonları */}
            <div className="space-y-4">
              {talesData.map((tale) => {
                const isOpen = openAccordion === tale.id;
                const isNarrating = currentNarratingKey === tale.id;

                return (
                  <div key={tale.id} className="bg-white border-2 border-amber-300 rounded-2xl overflow-hidden shadow-xs">
                    <div
                      onClick={() => {
                        playSound(600);
                        setOpenAccordion(isOpen ? null : tale.id);
                        setBadges((b) => ({ ...b, talesRead: true }));
                      }}
                      className="p-5 flex items-center justify-between cursor-pointer bg-slate-50 hover:bg-amber-50/60 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{tale.icon}</span>
                        <div>
                          <div className="text-xs font-mono text-amber-800 font-bold uppercase tracking-widest">
                            {tale.category}
                          </div>
                          <h3 className="text-base md:text-lg font-cinzel font-bold text-slate-900">
                            {tale.title}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            speakText(tale.id, tale.content);
                          }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                            isNarrating
                              ? 'bg-red-500 text-white animate-pulse'
                              : 'bg-amber-400 hover:bg-amber-300 text-slate-950 border border-amber-500'
                          }`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>{isNarrating ? 'Durdur' : 'Sesli Dinle'}</span>
                        </button>
                        <ChevronRight className={`w-5 h-5 text-amber-700 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
                      </div>
                    </div>

                    {isOpen && (
                      <div className="p-6 bg-white border-t border-slate-200 text-xs md:text-sm text-slate-700 leading-relaxed font-sans whitespace-pre-line space-y-4">
                        {isNarrating && (
                          <div className="p-2.5 bg-amber-50 border border-amber-400 rounded-xl text-xs text-amber-900 font-bold flex items-center gap-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                            <span>Şu anda sesli anlatım çalıyor...</span>
                          </div>
                        )}
                        <p>{tale.content}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* BÖLÜM 5: FARKLI KÜLTÜRLERDE TUZ (DÜNYA TURU SLIDER'I) */}
        {/* ========================================================= */}
        {activeTab === 'world' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
              <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider mb-1">
                <Globe className="w-4 h-4" />
                <span>Bölüm 5 · Medeniyetler Tarihi ve Küresel İktisat</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-cinzel font-bold text-slate-900">
                Farklı Kültürlerde Tuz: Dünya Turu
              </h2>
              <p className="text-xs md:text-sm text-slate-600 mt-1">
                Tuzun Roma maaşlarından Çin Seddi finansmanına, Sahra altın ticaretinden Slav diplomasi törelerine küresel etkilerini sağa-sola kaydırarak inceleyin.
              </p>
            </div>

            {/* Slider / Carousel Yapısı */}
            <div className="relative bg-white border-2 border-amber-300 rounded-3xl p-6 md:p-10 shadow-xs overflow-hidden">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 rounded-3xl bg-amber-100 border-2 border-amber-400 flex items-center justify-center text-5xl shrink-0 shadow-inner">
                  {worldSlides[currentSlide].icon}
                </div>

                <div className="space-y-3 flex-1 text-center md:text-left">
                  <div className="inline-block px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-mono font-bold">
                    {worldSlides[currentSlide].badge} · {worldSlides[currentSlide].country}
                  </div>
                  <h3 className="text-xl md:text-2xl font-cinzel font-bold text-slate-900">
                    {worldSlides[currentSlide].title}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-sans">
                    {worldSlides[currentSlide].desc}
                  </p>
                </div>
              </div>

              {/* Slider Okları ve Göstergeleri */}
              <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
                <button
                  onClick={() => {
                    playSound(550);
                    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : worldSlides.length - 1));
                    setBadges((b) => ({ ...b, worldTour: true }));
                  }}
                  className="p-2.5 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 hover:bg-amber-200 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2">
                  {worldSlides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        playSound(550);
                        setCurrentSlide(idx);
                        setBadges((b) => ({ ...b, worldTour: true }));
                      }}
                      className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                        currentSlide === idx ? 'bg-amber-500 w-6' : 'bg-slate-300 hover:bg-slate-400'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => {
                    playSound(550);
                    setCurrentSlide((prev) => (prev < worldSlides.length - 1 ? prev + 1 : 0));
                    setBadges((b) => ({ ...b, worldTour: true }));
                  }}
                  className="p-2.5 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 hover:bg-amber-200 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* BÖLÜM 6: TÜRKİYE'NİN TUZ KAYNAKLARI (KEŞİF MERKEZİ & İNTERAKTİF LABORATUVAR) */}
        {/* ========================================================= */}
        {activeTab === 'map' && (
          <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
            {/* Üst Başlık & Mod Seçici */}
            <div className="bg-white border-2 border-amber-300 rounded-3xl p-6 md:p-8 shadow-xs space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider font-mono">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Bölüm 6 · Türkiye&apos;nin Tuz Kaynakları Keşif Merkezi</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-amber-100 text-amber-900 px-3 py-1 rounded-full font-bold">
                    8 Büyük Havza & Doğal Rezerv
                  </span>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-cinzel font-bold text-slate-900">
                    Türkiye&apos;nin Tuz Kaynakları Keşif Merkezi
                  </h2>
                  <p className="text-xs md:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                    Türkiye; tektonik göllerden kıyı lagünlerine, 20-30 milyon yıllık fosil kaya tuzu mağaralarından şifalı dağ pınarlarına kadar dünyanın en zengin tuz ekosistemlerine sahiptir.
                  </p>
                </div>

                {/* Alt Mod Butonları (Vitrini, Bilgi Yarışması, Matris, Rehber) */}
                <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-300 text-xs">
                  {[
                    { id: 'vitrin', label: '🏢 Havzalar Vitrini (8)', icon: '🏛️' },
                    { id: 'quiz', label: '🎯 Tuz Kâşifi Sınavı', icon: '❓' },
                    { id: 'matris', label: '📊 Karşılaştırma Matrisi', icon: '📋' },
                    { id: 'rehber', label: '🧂 Gastronomi & Şifa', icon: '✨' },
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => {
                        playSound(650);
                        setSourceSubTab(sub.id as typeof sourceSubTab);
                      }}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                        sourceSubTab === sub.id
                          ? 'bg-amber-400 text-slate-950 shadow-xs border border-amber-500 scale-[1.02]'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                      }`}
                    >
                      <span>{sub.icon}</span>
                      <span>{sub.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4 Büyük İstatistik & Öne Çıkanlar Şeridi */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
                <div className="p-3.5 bg-amber-50/70 border border-amber-300 rounded-2xl text-center space-y-1">
                  <div className="text-2xl">🪞</div>
                  <div className="text-base md:text-lg font-cinzel font-bold text-amber-950">%60+ Pay</div>
                  <div className="text-[11px] text-amber-900/80 font-medium">Tuz Gölü (Türkiye İhtiyacı)</div>
                </div>

                <div className="p-3.5 bg-sky-50/70 border border-sky-300 rounded-2xl text-center space-y-1">
                  <div className="text-2xl">🌊</div>
                  <div className="text-base md:text-lg font-cinzel font-bold text-sky-950">500.000 Ton</div>
                  <div className="text-[11px] text-sky-900/80 font-medium">Çamaltı Deniz Tuzlası</div>
                </div>

                <div className="p-3.5 bg-purple-50/70 border border-purple-300 rounded-2xl text-center space-y-1">
                  <div className="text-2xl">⛏️</div>
                  <div className="text-base md:text-lg font-cinzel font-bold text-purple-950">1 Milyar Ton</div>
                  <div className="text-[11px] text-purple-900/80 font-medium">Çankırı Hitit Mağarası Rezervi</div>
                </div>

                <div className="p-3.5 bg-emerald-50/70 border border-emerald-300 rounded-2xl text-center space-y-1">
                  <div className="text-2xl">🏔️</div>
                  <div className="text-base md:text-lg font-cinzel font-bold text-emerald-950">55 Dönüm</div>
                  <div className="text-[11px] text-emerald-900/80 font-medium">Tuzluca Şifa Galerisi (Iğdır)</div>
                </div>
              </div>
            </div>

            {/* MOD 1: TUZ HAVZALARI VİTRİNİ & KARTLARI */}
            {sourceSubTab === 'vitrin' && (
              <div className="space-y-6">
                {/* Arama ve Kategori Filtreleri */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Şehir veya kaynak ara (Örn: Çankırı, Tuz Gölü, Kemah, Ayvalık)..."
                      value={sourceSearch}
                      onChange={(e) => setSourceSearch(e.target.value)}
                      className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs md:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white"
                    />
                    {sourceSearch && (
                      <button
                        type="button"
                        onClick={() => setSourceSearch('')}
                        className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    {[
                      { id: 'all', label: 'Tüm Türler' },
                      { id: 'lake', label: '🪞 Göl Tuzu' },
                      { id: 'sea', label: '🌊 Deniz Tuzu' },
                      { id: 'rock', label: '⛏️ Kaya Tuzu' },
                      { id: 'spring', label: '💧 Kaynak Tuzu' }
                    ].map((filter) => (
                      <button
                        key={filter.id}
                        type="button"
                        onClick={() => {
                          playSound(650);
                          setMapCategoryFilter(filter.id);
                        }}
                        className={`px-3 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                          mapCategoryFilter === filter.id
                            ? 'bg-amber-400 text-slate-950 shadow-xs border border-amber-500'
                            : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 border border-slate-200'
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Zengin İnteraktif Tuz Kaynakları Kartları */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {Object.entries(turkeySaltSources)
                    .filter(([_, item]) => {
                      const matchesCategory = mapCategoryFilter === 'all' || item.category === mapCategoryFilter;
                      const q = sourceSearch.toLowerCase().trim();
                      const matchesSearch =
                        !q ||
                        item.name.toLowerCase().includes(q) ||
                        item.province.toLowerCase().includes(q) ||
                        item.type.toLowerCase().includes(q) ||
                        item.geology.toLowerCase().includes(q);
                      return matchesCategory && matchesSearch;
                    })
                    .map(([key, item]) => {
                      const isNarrating = currentNarratingKey === `source_${key}`;

                      return (
                        <div
                          key={key}
                          className="bg-white border-2 border-slate-200 hover:border-amber-400 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all space-y-4 relative overflow-hidden group flex flex-col justify-between"
                        >
                          <div className="space-y-4">
                            {/* Üst Başlık & Tür Rozeti */}
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform shadow-inner">
                                  {item.icon}
                                </div>
                                <div>
                                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">
                                    📍 {item.province}
                                  </span>
                                  <h3 className="text-lg md:text-xl font-cinzel font-bold text-slate-900 leading-tight mt-0.5">
                                    {item.name}
                                  </h3>
                                </div>
                              </div>

                              <span
                                className={`px-3 py-1 rounded-full text-[11px] font-bold shrink-0 border ${
                                  item.category === 'lake'
                                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                                    : item.category === 'sea'
                                    ? 'bg-sky-100 text-sky-900 border-sky-300'
                                    : item.category === 'rock'
                                    ? 'bg-purple-100 text-purple-900 border-purple-300'
                                    : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                }`}
                              >
                                {item.type.split(' ')[0]} {item.type.split(' ')[1] || ''}
                              </span>
                            </div>

                            {/* Üretim Kapasitesi Göstergesi */}
                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1">
                              <div className="flex items-center justify-between text-slate-700 font-semibold">
                                <span>Üretim & Kapasite Durumu:</span>
                                <span className="font-mono text-amber-900 font-bold">{item.capacity.split('(')[0]}</span>
                              </div>
                              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-1000 ${
                                    item.category === 'lake'
                                      ? 'bg-amber-500 w-[92%]'
                                      : item.category === 'sea'
                                      ? 'bg-sky-500 w-[78%]'
                                      : item.category === 'rock'
                                      ? 'bg-purple-500 w-[85%]'
                                      : 'bg-emerald-500 w-[65%]'
                                  }`}
                                />
                              </div>
                            </div>

                            {/* Jeoloji ve Havza Oluşumu */}
                            <div className="text-xs text-slate-700 space-y-1 font-sans">
                              <strong className="text-amber-950 font-cinzel block text-[11px] uppercase tracking-wider">
                                Jeolojik Oluşum:
                              </strong>
                              <p className="leading-relaxed bg-amber-50/40 p-2.5 rounded-xl border border-amber-200/60">
                                {item.geology}
                              </p>
                            </div>

                            {/* Tarihsel ve Ekonomik Önemi */}
                            <div className="text-xs text-slate-700 space-y-1 font-sans">
                              <strong className="text-amber-950 font-cinzel block text-[11px] uppercase tracking-wider">
                                Tarihsel, Mutfak ve Sağlık Önemi:
                              </strong>
                              <p className="leading-relaxed text-slate-600">
                                {item.details}
                              </p>
                            </div>
                          </div>

                          {/* Sesli Dinleme Butonu */}
                          <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                speakText(
                                  `source_${key}`,
                                  `${item.name}. Bulunduğu yer: ${item.province}. ${item.geology} ${item.details} Yıllık kapasitesi: ${item.capacity}`
                                );
                                setBadges((b) => ({ ...b, mapExplored: true }));
                              }}
                              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                                isNarrating
                                  ? 'bg-red-500 text-white animate-pulse'
                                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950 border border-amber-500'
                              }`}
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>{isNarrating ? 'Anlatımı Durdur' : 'Doğal Sesle Dinle'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* MOD 2: TUZ KÂŞİFİ İNTERAKTİF BİLGİ YARIŞMASI */}
            {sourceSubTab === 'quiz' && (
              <div className="bg-white border-2 border-amber-300 rounded-3xl p-6 md:p-10 shadow-xs space-y-6">
                {!quizCompleted ? (
                  <>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4 flex-wrap gap-2">
                      <div>
                        <span className="text-xs font-mono font-bold text-amber-700 uppercase tracking-widest block">
                          Tuz Kâşifi Bilgi Yarışması
                        </span>
                        <h3 className="text-xl md:text-2xl font-cinzel font-bold text-slate-900 mt-0.5">
                          Soru {quizIndex + 1} / {saltSourcesQuiz.length}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-300">
                        <span className="text-xs font-bold text-amber-900 font-mono">Puanınız:</span>
                        <span className="text-lg font-black text-amber-600 font-mono">{quizScore} / 100</span>
                      </div>
                    </div>

                    {/* İlerleme Çubuğu */}
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 transition-all duration-300"
                        style={{ width: `${((quizIndex + 1) / saltSourcesQuiz.length) * 100}%` }}
                      />
                    </div>

                    {/* Soru Metni */}
                    <div className="py-2">
                      <h4 className="text-base md:text-lg font-semibold text-slate-900 leading-relaxed">
                        {saltSourcesQuiz[quizIndex].question}
                      </h4>
                    </div>

                    {/* Seçenekler */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {saltSourcesQuiz[quizIndex].options.map((opt, optIdx) => {
                        const isSelected = selectedQuizOption === optIdx;
                        const isCorrect = optIdx === saltSourcesQuiz[quizIndex].correct;

                        let btnStyle = 'bg-slate-50 hover:bg-amber-50/70 border-slate-200 text-slate-800';
                        if (quizAnswered) {
                          if (isCorrect) {
                            btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                          } else if (isSelected && !isCorrect) {
                            btnStyle = 'bg-red-100 border-red-500 text-red-950';
                          } else {
                            btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleSelectQuizOption(optIdx)}
                            disabled={quizAnswered}
                            className={`p-4 rounded-2xl border-2 text-left text-xs md:text-sm transition-all flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
                          >
                            <span className="font-medium">{opt}</span>
                            {quizAnswered && isCorrect && <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Açıklama ve Sonraki Soru Butonu */}
                    {quizAnswered && (
                      <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl space-y-3 animate-fadeIn">
                        <div className="text-xs text-slate-800 leading-relaxed">
                          <strong className="text-amber-900 font-bold block mb-1">
                            {selectedQuizOption === saltSourcesQuiz[quizIndex].correct
                              ? '👏 Doğru Cevap!'
                              : '💡 Bilgi Notu:'}
                          </strong>
                          {saltSourcesQuiz[quizIndex].explanation}
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={handleNextQuizQuestion}
                            className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs md:text-sm rounded-xl border border-amber-500 shadow-xs transition-all cursor-pointer flex items-center gap-2"
                          >
                            <span>{quizIndex < saltSourcesQuiz.length - 1 ? 'Sonraki Soru' : 'Sonucu Gör'}</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  /* Sınav Tamamlama Ekranı */
                  <div className="text-center py-8 space-y-4 animate-fadeIn">
                    <div className="w-16 h-16 bg-amber-100 border-2 border-amber-400 rounded-3xl mx-auto flex items-center justify-center text-3xl shadow-md">
                      🏆
                    </div>
                    <h3 className="text-2xl font-cinzel font-bold text-slate-900">
                      Tebrikler! Tuz Kâşifi Sınavını Tamamladınız!
                    </h3>
                    <p className="text-sm text-slate-600 max-w-md mx-auto">
                      Türkiye&apos;nin 4 ana tuz türü, havzaları ve kadim tuz ocakları hakkındaki bilginizi kanıtladınız.
                    </p>
                    <div className="inline-block p-4 bg-amber-50 border-2 border-amber-400 rounded-2xl font-mono text-2xl font-black text-amber-900">
                      Skorunuz: {quizScore} / 100
                    </div>
                    <div className="pt-4 flex justify-center gap-3">
                      <button
                        type="button"
                        onClick={handleRestartQuiz}
                        className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs md:text-sm rounded-xl border border-amber-500 shadow-xs transition-all cursor-pointer"
                      >
                        Yeniden Başla
                      </button>
                      <button
                        type="button"
                        onClick={() => setSourceSubTab('vitrin')}
                        className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs md:text-sm rounded-xl border border-slate-300 transition-all cursor-pointer"
                      >
                        Havzaları İncele
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MOD 3: PEDAGOJİK KARŞILAŞTIRMA MATRİSİ */}
            {sourceSubTab === 'matris' && (
              <div className="bg-white border-2 border-amber-300 rounded-3xl p-6 md:p-8 shadow-xs space-y-4 overflow-hidden">
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-xs font-mono font-bold text-amber-700 uppercase tracking-widest">
                    Pedagojik Karşılaştırma Matrisi
                  </span>
                  <h3 className="text-xl md:text-2xl font-cinzel font-bold text-slate-900 mt-0.5">
                    Türkiye&apos;deki Tuz Türleri Arasındaki Jeolojik Farklar
                  </h3>
                  <p className="text-xs text-slate-500">
                    Farklı jeolojik havzalardan elde edilen 4 ana tuz türünün oluşum, üretim ve saflık nitelikleri.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-amber-50 border-b-2 border-amber-300 text-amber-950 font-cinzel font-bold">
                        <th className="p-3">Tuz Türü</th>
                        <th className="p-3">Nasıl Oluşur?</th>
                        <th className="p-3">Üretim / Hasat Şekli</th>
                        <th className="p-3">Mineral & Saflık</th>
                        <th className="p-3">Türkiye&apos;deki Merkezleri</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-sans">
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-bold text-amber-900">🪞 Göl Tuzu</td>
                        <td className="p-3 text-slate-700">Tektonik kapalı havzalara akan yer altı sularının yazın buharlaşmasıyla</td>
                        <td className="p-3 text-slate-700">Yaz sonunda çekilen göl tabanından mekanik kazıyıcılarla kristal hasadı</td>
                        <td className="p-3 text-slate-700">%98+ Sodyum Klorür; sofralık ve ağır sanayi için ideal saflık</td>
                        <td className="p-3 font-semibold text-slate-900">Şereflikoçhisar Tuz Gölü (Ankara-Konya-Aksaray)</td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-bold text-sky-900">🌊 Deniz Tuzu</td>
                        <td className="p-3 text-slate-700">Deniz suyunun sığ kıyı lagünlerinde ve tavalarda güneşte toplanmasıyla</td>
                        <td className="p-3 text-slate-700">Güneş ve rüzgar enerjisiyle buharlaştırılan sığ kristalizasyon tavaları</td>
                        <td className="p-3 text-slate-700">Zengin magnezyum ve deniz mineralleri; salamura ve balıkçılık tuzu</td>
                        <td className="p-3 font-semibold text-slate-900">İzmir Çamaltı Tuzlası, Ayvalık Tuzlası</td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-bold text-purple-900">⛏️ Kaya Tuzu</td>
                        <td className="p-3 text-slate-700">20-30 milyon yıl önceki Tetis Denizi&apos;nin kurumasıyla yer altında fosilleşen tabakalar</td>
                        <td className="p-3 text-slate-700">Yer altında oda-topuk yöntemiyle açılan devasa tünellerden kırma/patlatma</td>
                        <td className="p-3 text-slate-700">Katıksız, çevre kirliliğinden uzak kristal yapı; 84 mineral ve haloterapi şifası</td>
                        <td className="p-3 font-semibold text-slate-900">Çankırı Kaya Tuzu Mağarası, Iğdır Tuzluca</td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-bold text-emerald-900">💧 Kaynak Tuzu</td>
                        <td className="p-3 text-slate-700">Derin dağ çatlaklarındaki kaya tuzu damarlarından süzülüp fışkıran tuzlu su pınarları</td>
                        <td className="p-3 text-slate-700">Ahşap oluk ve taş havuzlarda doğal dağ güneşi altında dinlendirip kurutma</td>
                        <td className="p-3 text-slate-700">Kimyasal işlem görmemiş berrak kaynak kristalleri; gurme lezzet</td>
                        <td className="p-3 font-semibold text-slate-900">Erzincan Kemah, Sivas Zara, Kırşehir Kaman</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* MOD 4: KÜLTÜREL VE GASTRONOMİK KULLANIM REHBERİ */}
            {sourceSubTab === 'rehber' && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50/50 border-2 border-amber-300 rounded-3xl p-6 md:p-8 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-widest font-mono">
                  <span>✦ Halk Bilgeliği ve Gastronomi Rehberi</span>
                </div>
                <h3 className="text-xl md:text-2xl font-cinzel font-bold text-slate-900">
                  Hangi Tuz Nerede Kullanılır?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs space-y-1.5">
                    <div className="text-xl">🥗</div>
                    <strong className="text-slate-900 font-bold block">Sofra & Mutfak Yemekleri</strong>
                    <p className="text-slate-600 leading-relaxed">
                      Tuz Gölü ve Çamaltı tuzu; dengeli çözünürlüğü ve saflığıyla günlük yemeklerin tadı ve tuzudur.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs space-y-1.5">
                    <div className="text-xl">🫒</div>
                    <strong className="text-slate-900 font-bold block">Salamura, Zeytin & Peynir</strong>
                    <p className="text-slate-600 leading-relaxed">
                      Kemah ve Ayvalık tuzu; gıdaları yumuşatmadan sert ve diri tuttuğu için tulum peyniri ve zeytinde vazgeçilmezdir.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs space-y-1.5">
                    <div className="text-xl">🫁</div>
                    <strong className="text-slate-900 font-bold block">Haloterapi & Solunum Şifası</strong>
                    <p className="text-slate-600 leading-relaxed">
                      Çankırı ve Tuzluca kaya tuzu; yaydığı negatif iyonlarla astım, bronşit ve nefes darlığına iyi gelir.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs space-y-1.5">
                    <div className="text-xl">🏭</div>
                    <strong className="text-slate-900 font-bold block">Sanayi & Kışla Mücadele</strong>
                    <p className="text-slate-600 leading-relaxed">
                      Kaya tuzu ve ham göl tuzu; kışın yollardaki buzları eritmede, dericilikte ve kimya sanayisinde kullanılır.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* BÖLÜM 7: DEYİM VE ATASÖZÜ ÇARKI & HİKAYE KİTABI ATÖLYESİ */}
        {/* ========================================================= */}
        {activeTab === 'wheel' && (
          <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
            {/* Üst Karşılama Kartı */}
            <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 border-4 border-amber-600 rounded-3xl p-6 md:p-8 shadow-xl text-slate-950 relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-2 bg-slate-950 text-amber-300 px-3 py-1 rounded-full text-xs font-mono font-black uppercase tracking-wider">
                    <Compass className="w-3.5 h-3.5 animate-spin" />
                    <span>Bölüm 7 · Deyim ve Atasözü Çarkı & Edebi Üretim Atölyesi</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-cinzel font-black uppercase tracking-wide">
                    Tuz Deyimleri ve Atasözleri Çarkı & Hikaye Kitabı
                  </h2>
                  <p className="text-xs md:text-sm font-semibold text-slate-900 leading-relaxed">
                    Çarkı çevir, Türk kültürünün kadim tuz deyimlerinden veya atasözlerinden birini yakala! 
                    Çıkan kültürel kodla kendi özgün masal veya hikayeni yaz, sınıfının ve dijital heybenin <strong>&quot;Tuzlu Hikayeler Kitabı&quot;</strong>na ekle!
                  </p>
                </div>

                {/* Alt Mod Değiştirici Butonlar */}
                <div className="flex bg-slate-950 p-1.5 rounded-2xl border-2 border-white shadow-lg gap-1 self-stretch md:self-auto justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setStoryBookTab('yaz');
                      playSound(600);
                    }}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${
                      storyBookTab === 'yaz'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'text-amber-200 hover:text-white'
                    }`}
                  >
                    <PenTool className="w-4 h-4" />
                    <span>Çark & Yaz Atölyesi</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStoryBookTab('kitap');
                      playSound(600);
                    }}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${
                      storyBookTab === 'kitap'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'text-amber-200 hover:text-white'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Hikaye Kitabı ({storyBook.length})</span>
                  </button>
                </div>
              </div>
            </div>

            {/* MOD 1: ÇARK VE HİKAYE YAZMA ALANI */}
            {storyBookTab === 'yaz' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* SOL SÜTUN: ETKİLEŞİMLİ DEYİM VE ATASÖZÜ ÇARKI (5 Kolon) */}
                <div className="lg:col-span-5 bg-white border-2 border-amber-300 rounded-3xl p-6 shadow-md flex flex-col items-center text-center space-y-6">
                  <div>
                    <h3 className="text-xl font-cinzel font-bold text-slate-900 mt-1">
                      Deyim ve Atasözü Çarkı
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Çarkı çevirerek ilham alacağın tuz deyimini veya atasözünü keşfet.
                    </p>
                  </div>

                  {/* SVG Deyim ve Atasözü Çarkı */}
                  <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center">
                    {/* Üstteki Sabit İbre / Ok */}
                    <div className="absolute -top-3 z-30 flex flex-col items-center">
                      <div className="w-6 h-8 bg-red-600 shadow-xl clip-triangle border-2 border-white rounded-t-sm animate-pulse"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-950 -mt-1 shadow-md"></div>
                    </div>

                    {/* Dönen Çark Gövdesi */}
                    <div
                      className="w-full h-full rounded-full border-8 border-amber-400 shadow-2xl relative overflow-hidden transition-transform duration-[4000ms] ease-out select-none bg-slate-900"
                      style={{
                        transform: `rotate(${wheelRotation}deg)`
                      }}
                    >
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        {wheelSlices.map((slice, index) => {
                          const count = wheelSlices.length;
                          const sliceAngle = 360 / count;
                          const startAngle = index * sliceAngle;
                          const endAngle = startAngle + sliceAngle;
                          
                          // Dilim pasta koordinatları
                          const startRad = (startAngle - 90) * (Math.PI / 180);
                          const endRad = (endAngle - 90) * (Math.PI / 180);
                          const x1 = 50 + 50 * Math.cos(startRad);
                          const y1 = 50 + 50 * Math.sin(startRad);
                          const x2 = 50 + 50 * Math.cos(endRad);
                          const y2 = 50 + 50 * Math.sin(endRad);
                          
                          const textAngle = startAngle + sliceAngle / 2;
                          const textRad = (textAngle - 90) * (Math.PI / 180);
                          const tx = 50 + 31 * Math.cos(textRad);
                          const ty = 50 + 31 * Math.sin(textRad);

                          return (
                            <g key={slice.term}>
                              <path
                                d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                                fill={slice.color}
                                stroke="#ffffff"
                                strokeWidth="0.8"
                              />
                              <text
                                x={tx}
                                y={ty}
                                fill="#ffffff"
                                fontSize="2.7"
                                fontWeight="bold"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                transform={`rotate(${textAngle + 90}, ${tx}, ${ty})`}
                                className="drop-shadow-sm select-none"
                              >
                                {slice.term.length > 17 ? slice.term.slice(0, 16) + '..' : slice.term}
                              </text>
                            </g>
                          );
                        })}
                      </svg>

                      {/* Çarkın Tam Ortasındaki Göbek Düğmesi */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-14 h-14 rounded-full bg-slate-950 border-4 border-amber-400 text-amber-300 flex flex-col items-center justify-center shadow-lg text-center font-bold text-[10px] leading-tight">
                          <span className="text-base">🧂</span>
                          <span>TUZ</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Çevir Butonu */}
                  <button
                    type="button"
                    onClick={handleSpinWheel}
                    disabled={isSpinning}
                    className={`w-full py-3.5 px-6 rounded-2xl text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                      isSpinning
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 border-2 border-amber-600 hover:scale-[1.02] active:scale-95'
                    }`}
                  >
                    <Compass className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
                    <span>{isSpinning ? 'Çark Dönüyor...' : 'ÇARK-I TUZU ÇEVİR!'}</span>
                  </button>

                  {/* Çark Sonucu Bilgi Kutusu */}
                  {selectedWheelItem && (
                    <div className="w-full text-left bg-amber-50 border-2 border-amber-400 rounded-2xl p-4 space-y-2 animate-fadeIn shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase font-mono ${
                          selectedWheelItem.type === 'Atasözü' 
                            ? 'bg-purple-200 text-purple-950' 
                            : 'bg-amber-200 text-amber-950'
                        }`}>
                          {selectedWheelItem.type}
                        </span>
                        <span className="text-xs text-amber-700 font-bold">Tebrikler! 🎉</span>
                      </div>
                      <h4 className="font-cinzel font-black text-slate-900 text-base">
                        &quot;{selectedWheelItem.term}&quot;
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        <strong>TDK Anlamı:</strong> {selectedWheelItem.meaning}
                      </p>
                      <p className="text-xs text-amber-950 bg-white/80 p-2.5 rounded-xl border border-amber-200 leading-relaxed">
                        💡 <strong>Hikaye İlhamı:</strong> {selectedWheelItem.promptIdea}
                      </p>
                      <div className="pt-1 text-[11px] text-amber-800 font-semibold italic">
                        Şimdi sağdaki yazma alanından bu deyim veya atasözünün hikayesini kurgulayabilirsin!
                      </div>
                    </div>
                  )}
                </div>

                {/* SAĞ SÜTUN: HİKAYE YAZMA VE KİTABA EKLEME ATÖLYESİ (7 Kolon) */}
                <div className="lg:col-span-7 bg-white border-2 border-amber-300 rounded-3xl p-6 md:p-8 shadow-md space-y-6">
                  <div className="border-b border-slate-100 pb-4 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-mono font-bold text-amber-700 uppercase tracking-widest block">
                        ✦ Genç Yazarlar Edebi Kürsüsü
                      </span>
                      <h3 className="text-xl md:text-2xl font-cinzel font-bold text-slate-900">
                        Hikaye Yaz ve Kitap Oluştur
                      </h3>
                    </div>
                    <div className="text-right hidden sm:block">
                      <span className="text-xs font-mono font-bold text-slate-500 block">Kitaptaki Eserler</span>
                      <span className="text-lg font-black text-amber-600 font-mono">{storyBook.length} Masal</span>
                    </div>
                  </div>

                  <form onSubmit={handleSaveStory} className="space-y-4">
                    {/* Seçilen Deyim / Atasözü Vurgusu */}
                    <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Bookmark className="w-4 h-4 text-amber-600" />
                        <span className="text-xs font-bold text-slate-700">İlham Alınan Deyim/Atasözü:</span>
                      </div>
                      <span className="font-bold text-xs md:text-sm text-amber-900 bg-amber-100 px-3 py-1 rounded-xl border border-amber-300">
                        {selectedWheelItem ? `${selectedWheelItem.term} (${selectedWheelItem.type})` : 'Çarkı çevirerek seçin (veya serbest yazın)'}
                      </span>
                    </div>

                    {/* Hikaye Başlığı ve Tür */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-xs font-bold text-slate-700">Hikaye / Masal Başlığı *</label>
                        <input
                          type="text"
                          value={storyTitle}
                          onChange={(e) => setStoryTitle(e.target.value)}
                          placeholder="Örn: Bir Tutam Tuz ve Bilge Çoban"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs md:text-sm font-semibold focus:outline-hidden focus:border-amber-500 focus:bg-white"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Edebi Tür</label>
                        <select
                          value={storyGenre}
                          onChange={(e) => setStoryGenre(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs md:text-sm font-semibold focus:outline-hidden focus:border-amber-500 focus:bg-white"
                        >
                          <option value="Geleneksel Masal">Geleneksel Masal</option>
                          <option value="Tarihi Efsane">Tarihi Efsane</option>
                          <option value="Halk Hikayesi">Halk Hikayesi</option>
                          <option value="Köy Kıssası">Köy Kıssası</option>
                          <option value="Fabl (Hayvan Masalı)">Fabl</option>
                        </select>
                      </div>
                    </div>

                    {/* Yazar Adı */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Yazar (Kâşif Öğrenci)</label>
                      <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="Adınızı yazın"
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-amber-500 focus:bg-white"
                      />
                    </div>

                    {/* Hikaye Metni */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700">Hikaye Metni (Öğrenci Yazım Alanı) *</label>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {storyContent.length} karakter
                        </span>
                      </div>
                      <textarea
                        rows={8}
                        value={storyContent}
                        onChange={(e) => setStoryContent(e.target.value)}
                        placeholder="Öğrenciler kendi özgün hikaye ve masal metinlerini buraya yazar..."
                        className="w-full p-4 bg-slate-50 border border-slate-300 rounded-2xl text-xs md:text-sm leading-relaxed focus:outline-hidden focus:border-amber-500 focus:bg-white"
                        required
                      ></textarea>
                    </div>

                    {/* Ana Fikir / Kıssadan Hisse */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Kıssadan Hisse / Çıkarılan Ders</label>
                      <input
                        type="text"
                        value={storyMoral}
                        onChange={(e) => setStoryMoral(e.target.value)}
                        placeholder="Örn: Bu hikaye bize vefanın tuz gibi bozulmaz bir kıymet olduğunu öğütler."
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs md:text-sm focus:outline-hidden focus:border-amber-500 focus:bg-white"
                      />
                    </div>

                    {/* Gönder ve Kitaba Ekle Butonları */}
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <p className="text-xs text-amber-900 font-medium">
                        ✨ Öğrenciler hikaye metnini yukarıya yazar; yazılan hikayeler kitaba eklenir ve hemen kütüphanede listelenir.
                      </p>

                      <button
                        type="submit"
                        className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs md:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer border border-amber-600 whitespace-nowrap"
                      >
                        <PenTool className="w-4 h-4" />
                        <span>HİKAYEYİ KİTABA EKLE & YAYINLA</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* MOD 2: OLUŞTURULAN HİKAYE KİTABI (KÜLLİYAT KİTAPLIĞI) */}
            {storyBookTab === 'kitap' && (
              <div className="bg-white border-2 border-amber-300 rounded-3xl p-6 md:p-8 shadow-md space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-amber-700 uppercase tracking-widest block">
                      ✦ Ortaklaşa Folklor Külliyatı
                    </span>
                    <h3 className="text-2xl font-cinzel font-black text-slate-900">
                      Tuzlu Deyimler ve Masallar Kitabımız
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Öğrencilerin çarktan ilham alarak yazdığı özgün tuz masalları derlemesi ({storyBook.length} Eser).
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-300"
                      title="Kitap Sayfasını Yazdır / PDF Kaydet"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Kitabı Yazdır / PDF</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setStoryBookTab('yaz');
                        playSound(650);
                      }}
                      className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl text-xs font-black uppercase flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <PenTool className="w-3.5 h-3.5" />
                      <span>+ Yeni Hikaye Yaz</span>
                    </button>
                  </div>
                </div>

                {/* Kitap Rafı ve Hikaye Listesi */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Sol Liste: Eser Başlıkları */}
                  <div className="md:col-span-4 space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
                    {storyBook.map((item) => {
                      const isSelected = activeBookStoryId === item.id || (!activeBookStoryId && item.id === storyBook[0]?.id);
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            setActiveBookStoryId(item.id);
                            playSound(600);
                          }}
                          className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                            isSelected
                              ? 'bg-amber-100/90 border-amber-500 shadow-sm'
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-amber-800 mb-1">
                            <span>{item.genre}</span>
                            <span>{item.date}</span>
                          </div>
                          <h4 className="font-cinzel font-bold text-slate-900 text-sm leading-tight">
                            {item.title}
                          </h4>
                          <div className="text-[11px] text-slate-600 truncate mt-1">
                            🌿 {item.idiom}
                          </div>
                          <div className="text-[10px] font-mono text-slate-500 mt-1">
                            Yazar: {item.author}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Sağ Okuma Alanı: Kitap Sayfası Görünümü */}
                  <div className="md:col-span-8 bg-amber-50/50 border-2 border-amber-300 rounded-3xl p-6 md:p-8 relative min-h-[420px] flex flex-col justify-between shadow-inner">
                    {(() => {
                      const activeItem = storyBook.find((s) => s.id === activeBookStoryId) || storyBook[0];
                      if (!activeItem) return null;
                      const isReading = currentNarratingKey === ('storybook-' + activeItem.id);

                      return (
                        <div className="space-y-5">
                          {/* Kitap Sayfa Üst Bilgisi */}
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200 pb-3 text-xs">
                            <span className="font-mono font-black text-amber-900 uppercase tracking-widest">
                              📖 Tuz Masalları Külliyatı · Eser #{storyBook.findIndex(s => s.id === activeItem.id) + 1}
                            </span>
                            <div className="flex items-center gap-2">
                              {/* Doğal Sesle Dinleme Butonu */}
                              <button
                                type="button"
                                onClick={() => speakText('storybook-' + activeItem.id, `${activeItem.title}. Yazar: ${activeItem.author}. Deyim: ${activeItem.idiom}. Hikaye: ${activeItem.story}. Kıssadan Hisse: ${activeItem.moral}`)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all ${
                                  isReading
                                    ? 'bg-rose-600 text-white animate-pulse'
                                    : 'bg-white text-slate-900 border border-amber-300 hover:bg-amber-100'
                                }`}
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                                <span>{isReading ? 'Durdur' : 'Masalı Sesle Dinle'}</span>
                              </button>

                              {storyBook.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm('Bu hikayeyi kitaptan çıkarmak istiyor musunuz?')) {
                                      setStoryBook((prev) => prev.filter((s) => s.id !== activeItem.id));
                                      setActiveBookStoryId(null);
                                      playSound(300);
                                    }
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-white"
                                  title="Hikayeyi Sil"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Başlık ve Künye */}
                          <div className="space-y-1">
                            <div className="inline-block px-2.5 py-0.5 rounded-md bg-amber-200 text-amber-950 font-bold text-[10px] uppercase font-mono mb-1">
                              {activeItem.genre}
                            </div>
                            <h3 className="text-xl md:text-2xl font-cinzel font-black text-slate-950">
                              {activeItem.title}
                            </h3>
                            <div className="text-xs text-amber-800 font-medium">
                              Yazar: <strong>{activeItem.author}</strong> · Tarih: {activeItem.date}
                            </div>
                            <div className="text-xs bg-white/80 p-2.5 rounded-xl border border-amber-200 font-semibold text-slate-800">
                              🌱 <strong>İlham Kaynağı Tuz Deyimi:</strong> &quot;{activeItem.idiom}&quot;
                            </div>
                          </div>

                          {/* Hikaye Paragrafları */}
                          <div className="text-xs md:text-sm text-slate-800 font-serif leading-relaxed whitespace-pre-line bg-white/90 p-5 rounded-2xl border border-amber-200/80 shadow-2xs">
                            {activeItem.story}
                          </div>

                          {/* Kıssadan Hisse */}
                          <div className="bg-gradient-to-r from-amber-200/70 to-yellow-100 p-4 rounded-2xl border border-amber-300 text-xs text-amber-950">
                            <strong>✦ Kıssadan Hisse & Ahlaki Öğüt:</strong>
                            <p className="mt-0.5 italic leading-relaxed font-sans font-medium">
                              {activeItem.moral}
                            </p>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Kitap Alt İmzası */}
                    <div className="pt-4 mt-6 border-t border-amber-200/80 flex items-center justify-between text-[11px] font-mono text-amber-900">
                      <span>Dijital Heybe Edebi Üretim Kulübü</span>
                      <span>Sayfa Mührü: 🧂 Tuz ve İrfan</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Alt Bilgi (Footer) - Açık Gri & Sarı Uyumlu */}
      <footer className="relative z-10 border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500 font-mono shadow-inner">
        <div>Dijital Heybemde Bir Tutam Tuz · Kültürel Kodlar ve Folklor Platformu</div>
        <div className="text-[11px] text-amber-800 font-bold mt-0.5">
          Kâşif: {studentName} · Türk&apos;ün Kültürel Kodları Açık Gri & Sarı Tasarımı
        </div>
      </footer>
    </div>
  );
}
