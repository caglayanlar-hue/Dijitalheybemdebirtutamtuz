/**
 * Educational Data & Folklore Metadata for Tuz Escape Room
 * Focused on: Dede Korkut, Oguz Customs, Tales, Legends, Proverbs, Idioms, Folk Beliefs
 */

export interface EscapeRoomLevel {
  id: number;
  name: string;
  roomTitle: string;
  culturalCode: string;
  primaryObject: string;
  sourceContext: string;
  semanticMeaning: string;
  sealName: string;
  description: string;
  culturalBackground: string;
  pedagogicalGoal: string;
  clues: string[];
}

export const ROOMS_DATA: EscapeRoomLevel[] = [
  {
    id: 1,
    name: 'Oğuz Töresi ve Ahde Vefa',
    roomTitle: 'Dede Korkut Odası',
    culturalCode: 'Oğuz Töresi, Ahde Vefa ve Beye Sadakat',
    primaryObject: "Dede Korkut'un Kopuzu ve Göktürk Yazıtı",
    sourceContext: 'Dede Korkut Kitabı & Oğuz Boyları Destanı',
    semanticMeaning: 'Sadakat, Epik Bağlılık ve Töre',
    sealName: 'Töre ve Sadakat Mührü',
    description: "Dede Korkut'un kutlu otağında, sedef kakmalı kopuzun üzerindeki Göktürk runik şifresini çözerek Oğuz yiğitlerinin sadakat sırrına ulaşın.",
    culturalBackground: "Dede Korkut boylarında hanların toy (ziyafet) vermesi ve 'tuz ekmek' paylaşılması, obaya ve beye bağlılık yeminidir. Oğuz töresinde tuz ve ekmeği paylaşılan yere asla ihanet edilmez; tuz ekmek hakkını çiğnemek töreye göre en büyük nankörlük ve lekedir.",
    pedagogicalGoal: "Oğuz destanlarında tuz ve ekmeğin, yiğitler arasındaki sadakat yemini ve misafirperverlik andı olduğunu kavratmak.",
    clues: [
      "Kopuzun sapındaki Göktürk runik harflerini alfabe anahtarından eşleştirin.",
      "Soru: 'Oğuz elinde bir yiğidin sadakati ne ile mühürlenir?'",
      "Kilit şifresi iki kelimeden oluşur: 'TUZ EKMEK'"
    ]
  },
  {
    id: 2,
    name: 'Masallar ve Efsaneler',
    roomTitle: 'Masal ve Efsane Odası',
    culturalCode: 'Halk Masalları, Tuz Efsanesi ve Sevgi Değeri',
    primaryObject: 'Padişahın Sofrası ve Tuz Gölü Sandığı',
    sourceContext: 'Türk Masal Külliyatı & Tuz Gölü Efsaneleri',
    semanticMeaning: 'Öz Değer, Sevgi ve Bereket',
    sealName: 'Sevgi ve Hikmet Mührü',
    description: "'Seni tuz kadar seviyorum' diyen kızın masalındaki hikmeti ve Tuz Gölü'nün kadim efsanesini çözerek tuzu sofranın başına taşıyın.",
    culturalBackground: "Meşhur Türk masalında padişah kızlarına kendisini ne kadar sevdiklerini sorar. En küçük kızı 'Babacığım, seni tuz kadar seviyorum' deyince padişah öfkelenir. Ancak sarayda tuzsuz pişen tatsız yemekleri yiyemeyince tuzun altından ve zümrütten daha kıymetli olduğunu anlar. Efsanelerde ise tuz esirgenemez bir haktır; Tuz Gölü efsanesinde bir salkım üzüm esirgeyen bağ sahibinin arazisi tuz gölüne dönüşmüştür.",
    pedagogicalGoal: "Tuzun hayatın vazgeçilmez özü olduğunu masal ve efsanelerin sembolik dili üzerinden kavratmak.",
    clues: [
      "Padişah kızına 'Altın kadar, elmas kadar sevilmek varken neden bu madde?' diye sormuştu.",
      "Altın ve zümrüt yenmez; sofranın ve canın asıl lezzeti tuzdur.",
      "Padişahın sofrasına eksik olan 'Tuzluk' nesnesini koyarak masalın düğümünü çözün."
    ]
  },
  {
    id: 3,
    name: 'Şifa ve Arınma',
    roomTitle: 'Anadolu İnanışları Odası',
    culturalCode: 'Halk Hekimliği, Korunma ve Mistik Arınma',
    primaryObject: 'Ak Tuz Kesesi ve Ocak Ateşi',
    sourceContext: 'Anadolu Etnografyası & Türk Mitolojisi',
    semanticMeaning: 'Şifa, Arınma ve Nazardan Korunma',
    sealName: 'Şifa ve Arınma Mührü',
    description: "Karanlık odada fenerinizi gezdirerek saklanan 'Nazar', 'Kötü Koku' ve 'Zayıflık' gölgelerini ak tuz taneleriyle arındırın.",
    culturalBackground: "Anadolu'da yeni doğan bebeklerin derisinin pişmesi, terinin kokmaması ve hastalıklardan korunması için 'tuzlama' geleneği uygulanır. Ayrıca ateşe tuz atıldığında çıtırdayarak patlaması, kem gözün ve nazarın çatladığına inanılan 'tuz bakısı' ve 'tuz çevirme' ritüelidir.",
    pedagogicalGoal: "Tuzun halk hekimliğinde ve inanışlarında koruyucu, arındırıcı ve sağlık verici gücünü uygulamalı olarak göstermek.",
    clues: [
      "Mavi fener ışığını odada gezdirerek 3 gölgeyi bulun.",
      "Envanterdeki 'Ak Tuz Kesesi'ne tıklayarak elinize alın.",
      "Tuz kesesi ile gölgelere dokunarak ocak ateşinde nazarı çatlatın."
    ]
  },
  {
    id: 4,
    name: 'Sözdeki Tuz',
    roomTitle: 'Deyimler, Atasözleri ve Maniler Odası',
    culturalCode: 'Türkçenin Söz Varlığı ve Sözlü Edebiyat',
    primaryObject: 'Deyim Çarkı ve Mani Sandığı',
    sourceContext: 'Türkçe Deyimler, Atasözleri ve Maniler Külliyatı',
    semanticMeaning: 'Sözün Tadı, Akıl ve Kültürel Zenginlik',
    sealName: 'Söz ve İrfan Mührü',
    description: "Türkçemize yerleşen 'tuz ekmek hakkı', 'tuzu kuru' ve 'yaraya tuz basmak' gibi köklü deyim ile atasözlerini doğru anlamlarıyla eşleştirin.",
    culturalBackground: "Türkçede tuz kelimesi soyut birçok duyguyu ifade etmek için kullanılmıştır: 'Aşa tuz gerek, söze us (akıl) gerek' atasözü aklı tuza benzetir. 'Tuzu kuru' olmak dertsizliği, 'tuz buz olmak' paramparça olmayı, 'yaraya tuz basmak' ise acıya katlanmayı anlatır. Manilerde ise vefasızlığa karşı tuz en büyük şahittir.",
    pedagogicalGoal: "Tuz kavramının Türkçenin deyim, atasözü ve mani dağarcığına nasıl zengin semantik katmanlar kazandırdığını öğretmek.",
    clues: [
      "'Aşa tuz gerek...' sözünü akıl manasına gelen kadim 'us' kelimesiyle tamamlayın.",
      "Dertsiz ve rahat kişilere halk dilinde 'tuzu kuru' denir.",
      "Paylaşılan sofrayı unutmamak 'Tuz ekmek hakkı bilmek' deyimidir."
    ]
  }
];

export interface GokturkRune {
  letter: string;
  rune: string;
  description: string;
}

export const GOKTURK_RUNES: GokturkRune[] = [
  { letter: 'T', rune: '𐱃', description: 'Kalın T / Ta' },
  { letter: 'U', rune: '𐰆', description: 'U / O sesi' },
  { letter: 'Z', rune: '𐰕', description: 'Z sesi' },
  { letter: 'E', rune: '𐰝', description: 'İnce E / K' },
  { letter: 'K', rune: '𐰚', description: 'İnce K sesi' },
  { letter: 'M', rune: '𐰢', description: 'M sesi' },
];

export interface IdiomItem {
  id: string;
  phrase: string;
  category: 'Deyim' | 'Atasözü' | 'Mani';
  meaning: string;
  targetSlot: string;
  options: string[];
  explanation: string;
}

export const FOLKLORE_ITEMS: IdiomItem[] = [
  {
    id: 'idiom1',
    phrase: 'Tuz ekmek hakkı ...',
    category: 'Deyim',
    meaning: 'Birlikte paylaşılan sofrayı, yapılan iyiliği ve dostluğu asla unutmamak, vefalı olmak.',
    targetSlot: 'bilmek',
    options: ['bilmek', 'satmak', 'dökmek', 'yemek'],
    explanation: 'Dede Korkut töresinden beri birinin ekmeğini yiyen kimse ona hıyanet etmez; bu vefa borcuna tuz ekmek hakkı denir.'
  },
  {
    id: 'idiom2',
    phrase: 'Aşa tuz gerek, söze ... gerek.',
    category: 'Atasözü',
    meaning: 'Yemeğin lezzeti tuzla olduğu gibi, sözün de değeri ve güzelliği akıl (us) iledir.',
    targetSlot: 'us',
    options: ['us', 'ses', 'bal', 'pul'],
    explanation: 'Eski Türkçede "us" akıl demektir. Tuz aşın tadıysa, akıl da sözün özüdür.'
  },
  {
    id: 'idiom3',
    phrase: 'Tuzu ... olmak',
    category: 'Deyim',
    meaning: 'Maddi sıkıntısı, kaygısı ve derdi bulunmamak; hali vakti yerinde ve rahat olmak.',
    targetSlot: 'kuru',
    options: ['kuru', 'yaş', 'bol', 'az'],
    explanation: 'Tuzun ıslanıp erime tehlikesi olmayan, tuzu kuru saklanan kimsenin tuzu gibi geçimi de güvendedir.'
  },
  {
    id: 'idiom4',
    phrase: 'Çorbada tuzu ...',
    category: 'Deyim',
    meaning: 'Birlikte yürütülen hayırlı ve büyük bir işte küçük de olsa bir katkısı, emeği ve hissesi bulunmak.',
    targetSlot: 'olmak',
    options: ['olmak', 'kaçmak', 'donmak', 'taşmak'],
    explanation: 'Köy meydanında imeceyle pişen ortak aşa bir tutam tuz atarak katkı sağlama geleneğidir.'
  },
  {
    id: 'idiom5',
    phrase: 'Tuz buz ...',
    category: 'Deyim',
    meaning: 'Bir şeyi şiddetli bir vuruşla kırıp un ufak etmek, paramparça hale getirmek.',
    targetSlot: 'etmek',
    options: ['etmek', 'kalmak', 'akmak', 'kaçmak'],
    explanation: 'Kaya tuzu ve buz kalıplarının çekiçle kırılıp tanelerine ayrılması gibi paramparça etmektir.'
  },
  {
    id: 'idiom6',
    phrase: 'Tuz biber ...',
    category: 'Deyim',
    meaning: 'Bir üzüntünün veya öfkenin etkisini daha da artıracak davranışta bulunmak.',
    targetSlot: 'ekmek',
    options: ['ekmek', 'biçmek', 'tatmak', 'satmak'],
    explanation: 'Açık yaraya tuz ve biber dökmenin verdiği şiddetli yanma hissiyle ateşe körükle gitmeyi anlatır.'
  },
  {
    id: 'mani1',
    phrase: 'Tuz koydum kasesine / Kulak ver neşesine / Vefasız olan varmaz / Yiğidin ...',
    category: 'Mani',
    meaning: 'Oğuz meclislerinde ancak sözünü tutan, tuz ekmek hakkını bilen yiğitler yer bulabilir.',
    targetSlot: 'meclisine',
    options: ['meclisine', 'hanesine', 'yaylasına', 'yurduna'],
    explanation: 'Halk manilerinde tuz, dostluk meclisinin ve mertliğin turnusol kağıdıdır.'
  }
];

export const TALE_SEGMENTS = [
  {
    id: 'tale_part1',
    title: 'Padişahın Üç Kızı',
    text: "Bir vakitler bir padişah üç kızını yanına çağırıp 'Beni ne kadar seversiniz?' diye sormuş. Büyük kız 'Altın kadar', ortanca kız 'Zümrüt kadar' demiş. En küçük kız ise tebessümle: 'Babacığım, ben seni tuz kadar severim' demiş.",
    highlight: 'Tuz kadar sevmek'
  },
  {
    id: 'tale_part2',
    title: 'Öfke ve Kovulma',
    text: "Padişah tuzun değersiz olduğunu düşünüp öfkelenmiş; 'Kıymetimi sıradan bir tuza mı denk gördün!' diyerek küçük kızını saraydan uzaklaştırmış.",
    highlight: 'Tuzun zahiri sadeliği'
  },
  {
    id: 'tale_part3',
    title: 'Tuzsuz Ziyafet ve İdrak',
    text: "Yıllar sonra padişah bir ziyafete konuk olmuş. Sofradaki tüm nefis etler, börekler ve tatlılar hiç tuz konmadan pişirilmiş. Padişah hiçbir yemeği yiyememiş, boğazından lokma geçmemiş. O an anlamış ki altın ve zümrüt yenmez; hayatı ve sofrayı yaşatan tuzdur!",
    highlight: 'Altından kıymetli olan tuz'
  }
];

export const LEGEND_SALT_LAKE = {
  title: 'Tuz Gölü Efsanesi (İç Anadolu)',
  text: "Efsaneye göre vaktiyle Tuz Gölü'nün olduğu yer yemyeşil, ulu bir üzüm bağıymış. Yoldan geçen yaşlı bir derviş çok susamış ve bağ sahibesi kadından bir salkım üzüm istemiş. Kadın ise cimrilik edip 'Bağımda üzüm kalmadı, hepsi kurudu' diye yalan söylemiş. Derviş 'Taş olasın, tuz olasın; hakkı esirgeyen bu bağ tuz gölüne dönsün' demiş. O günden sonra bağ bembeyaz bir tuz gölüne dönüşmüş. Anadolu'da bu efsane, tuzun ve nimetin esirgenemez bir hak olduğunu öğretir.",
  lesson: 'Tuz ve nimet esirgenemez; misafirperverlik kutsaldır.'
};
