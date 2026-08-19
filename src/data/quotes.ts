export type Language = 'id' | 'en';

export interface QuoteItem {
  id: string;
  text: string;
  author: string;
  category: 'zen' | 'stoic' | 'nature' | 'indonesia' | 'code' | 'literary' | 'mindset';
  language: Language;
}

export const ZEN_QUOTES: QuoteItem[] = [
  // --- BAHASA INDONESIA ---
  {
    id: 'id-1',
    text: 'Tetesan air pelan-pelan mampu melubangi batu karang. Ketenangan pikiran adalah awal dari setiap karya agung.',
    author: 'Pepatah Bijak Nusantara',
    category: 'indonesia',
    language: 'id',
  },
  {
    id: 'id-2',
    text: 'Alon-alon waton kelakon. Langkah yang tenang dan mantap akan mengantarkan pada ketelitian yang sempurna.',
    author: 'Falsafah Jawa',
    category: 'indonesia',
    language: 'id',
  },
  {
    id: 'id-3',
    text: 'Urip iku urup. Hidup hendaknya senantiasa menyalakan kebaikan, ketenangan, dan inspirasi bagi sesama.',
    author: 'Falsafah Jawa',
    category: 'indonesia',
    language: 'id',
  },
  {
    id: 'id-4',
    text: 'Hening bukan berarti kosong. Dalam keheningan, kita mendengar suara nurani yang selama ini tertutup bisingnya dunia.',
    author: 'Renungan Zen Nusantara',
    category: 'zen',
    language: 'id',
  },
  {
    id: 'id-5',
    text: 'Pohon yang kokoh tidak tumbuh dalam semalam. Akarnya merayap dalam senyap, menembus tanah tanpa banyak bicara.',
    author: 'Pramoedya Ananta Toer',
    category: 'literary',
    language: 'id',
  },
  {
    id: 'id-6',
    text: 'Jangan berjalan seperti terburu-buru mengejar bayangan. Melangkahlah selaras dengan napasmu di bumi yang damai ini.',
    author: 'Thich Nhat Hanh (Terjemahan)',
    category: 'zen',
    language: 'id',
  },
  {
    id: 'id-7',
    text: 'Air sungai mengalir mengitari batu tanpa pernah marah. Mengalirlah dengan luwes menghadapi setiap rintangan hari ini.',
    author: 'Kearifan Alam',
    category: 'nature',
    language: 'id',
  },
  {
    id: 'id-8',
    text: 'Kuasai pikiranmu sebelum keadaan luar menguasaimu. Ketenangan adalah benteng terkuat yang bisa dibangun seorang manusia.',
    author: 'Meditasi Stoikisme',
    category: 'stoic',
    language: 'id',
  },
  {
    id: 'id-9',
    text: 'Kode yang indah lahir dari pikiran yang tertata rapi. Sederhanakan logikamu, bernapaslah, dan ketik setiap baris dengan presisi.',
    author: 'Prinsip Programmer Zen',
    category: 'code',
    language: 'id',
  },
  {
    id: 'id-10',
    text: 'Pagi hari membawa secangkir teh hangat dan aroma embun segar. Tak ada yang perlu dirisaukan, saat ini adalah segalanya.',
    author: 'Puisi Fajar',
    category: 'nature',
    language: 'id',
  },
  {
    id: 'id-11',
    text: 'Keberanian terbesar bukan terletak pada suara yang lantang, melainkan pada ketenangan hati untuk mencoba lagi esok hari.',
    author: 'Mary Anne Radmacher',
    category: 'mindset',
    language: 'id',
  },
  {
    id: 'id-12',
    text: 'Bagaikan teratai yang mekar anggun di atas air keruh, jiwa yang damai tetap bersinar di tengah hiruk pikuk kehidupan.',
    author: 'Alegori Teratai',
    category: 'zen',
    language: 'id',
  },
  {
    id: 'id-13',
    text: 'Kesabaran bukanlah kemampuan untuk menunggu, tetapi bagaimana kita menjaga sikap yang tenang saat proses berlangsung.',
    author: 'Joyce Meyer',
    category: 'mindset',
    language: 'id',
  },
  {
    id: 'id-14',
    text: 'Di puncak bukit yang sunyi, angin berbisik lembut menyapa dedaunan cemara. Pikiran kembali jernih laksana kaca danau.',
    author: 'Sketsa Senja',
    category: 'nature',
    language: 'id',
  },
  {
    id: 'id-15',
    text: 'Fokuslah pada satu ketukan pada satu waktu. Jangan cemaskan kata di akhir paragraf sebelum menyelesaikan huruf di depan matamu.',
    author: 'Filosofi Mengetik Zen',
    category: 'zen',
    language: 'id',
  },
  {
    id: 'id-16',
    text: 'Belajarlah dari padi yang makin berisi makin merunduk. Kerendahan hati membuka pintu bagi pemahaman yang lebih dalam.',
    author: 'Pepatah Tradisional',
    category: 'indonesia',
    language: 'id',
  },
  {
    id: 'id-17',
    text: 'Hapus keraguan seperti menghapus baris kode yang tak terpakai. Bangun fondasi yang kokoh dengan ketenangan dan ketekunan.',
    author: 'Refleksi Rekayasa',
    category: 'code',
    language: 'id',
  },
  {
    id: 'id-18',
    text: 'Bila hatimu damai, seisi dunia terasa ramah. Ketenangan batin adalah permata yang tak ternilai harganya.',
    author: 'Syair Sufi',
    category: 'zen',
    language: 'id',
  },
  {
    id: 'id-19',
    text: 'Satu jam yang penuh konsentrasi dan keheningan lebih berharga daripada sepuluh jam yang diisi dengan kegelisahan.',
    author: 'Seni Bekerja Jernih',
    category: 'mindset',
    language: 'id',
  },
  {
    id: 'id-20',
    text: 'Suara gemercik air hujan membasahi genting tanah liat. Menghangatkan ruangan dengan kedamaian yang sederhana namun mendalam.',
    author: 'Lantunan Hujan Sore',
    category: 'nature',
    language: 'id',
  },

  // --- ENGLISH ---
  {
    id: 'en-1',
    text: 'Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.',
    author: 'Buddha',
    category: 'zen',
    language: 'en',
  },
  {
    id: 'en-2',
    text: 'Muddy water is best cleared by leaving it alone. In stillness, the entire universe becomes crystal clear.',
    author: 'Alan Watts',
    category: 'zen',
    language: 'en',
  },
  {
    id: 'en-3',
    text: 'Nature does not hurry, yet everything is accomplished. Flow like water around every stubborn stone.',
    author: 'Lao Tzu',
    category: 'zen',
    language: 'en',
  },
  {
    id: 'en-4',
    text: 'Silence is not empty; it is full of answers. Breathe deeply and let your fingers follow the natural rhythm.',
    author: 'Zen Proverb',
    category: 'zen',
    language: 'en',
  },
  {
    id: 'en-5',
    text: 'You have power over your mind, not outside events. Realize this, and you will discover immense inner strength.',
    author: 'Marcus Aurelius',
    category: 'stoic',
    language: 'en',
  },
  {
    id: 'en-6',
    text: 'Simplicity is the ultimate sophistication. Clean strokes lead to a tranquil state of mind and effortless execution.',
    author: 'Leonardo da Vinci',
    category: 'stoic',
    language: 'en',
  },
  {
    id: 'en-7',
    text: 'The quieter you become, the more you are able to hear. Each keypress is a single step on a serene winding path.',
    author: 'Rumi',
    category: 'zen',
    language: 'en',
  },
  {
    id: 'en-8',
    text: 'First solve the problem, then write the code. Breathe, focus on elegance, and let simplicity guide the logic.',
    author: 'John Johnson',
    category: 'code',
    language: 'en',
  },
  {
    id: 'en-9',
    text: 'Any fool can write code that a computer can understand. Good programmers write code that humans can feel and maintain.',
    author: 'Martin Fowler',
    category: 'code',
    language: 'en',
  },
  {
    id: 'en-10',
    text: 'Gentle morning rain whispers against the bamboo roof. The tea is warm, the mind is clear, and the world is soft.',
    author: 'Zen Nature Lore',
    category: 'nature',
    language: 'en',
  },
  {
    id: 'en-11',
    text: 'Autumn leaves fall without regret. The wind carries them gently to rest upon the calm surface of the pond.',
    author: 'Haiku Tradition',
    category: 'nature',
    language: 'en',
  },
  {
    id: 'en-12',
    text: 'Flow is the state of mind where effort dissolves into grace. Time slows down and every action feels inevitable.',
    author: 'Mihaly Csikszentmihalyi',
    category: 'mindset',
    language: 'en',
  },
  {
    id: 'en-13',
    text: 'In the depth of winter, I finally learned that within me there lay an invincible and radiant summer.',
    author: 'Albert Camus',
    category: 'literary',
    language: 'en',
  },
  {
    id: 'en-14',
    text: 'We suffer more often in imagination than in reality. Keep your attention anchored here in the physical present.',
    author: 'Seneca',
    category: 'stoic',
    language: 'en',
  },
  {
    id: 'en-15',
    text: 'A mechanical keyboard speaks in rhythms and clicks. Let each sound be a reminder of deliberate focus and presence.',
    author: 'Craftsman Code',
    category: 'code',
    language: 'en',
  },
  {
    id: 'en-16',
    text: 'The pine tree teaches us endurance through snow. The bamboo teaches us flexibility before the fierce mountain gales.',
    author: 'Eastern Lore',
    category: 'nature',
    language: 'en',
  },
  {
    id: 'en-17',
    text: 'Precision beats power, and timing beats speed. Focus on accuracy first, and velocity will naturally follow.',
    author: 'Martial Zen Principle',
    category: 'mindset',
    language: 'en',
  },
  {
    id: 'en-18',
    text: 'The soul becomes dyed with the color of its thoughts. Fill your mind with serenity, gratitude, and clear purpose.',
    author: 'Marcus Aurelius',
    category: 'stoic',
    language: 'en',
  },
  {
    id: 'en-19',
    text: 'A journey of a thousand miles begins with a single step. Do not look at the summit, just take the next mindful step.',
    author: 'Lao Tzu',
    category: 'zen',
    language: 'en',
  },
  {
    id: 'en-20',
    text: 'Breathe in light and calm. Breathe out tension and hurry. The current moment is the only true home you possess.',
    author: 'Mindfulness Practice',
    category: 'zen',
    language: 'en',
  },
];

// Indonesian Word Pool
export const INDONESIAN_WORDS: string[] = [
  'tenang', 'damai', 'alir', 'napas', 'sungai', 'hutan', 'hening', 'sejuk', 'zen', 'teratai',
  'bambu', 'air', 'angin', 'harmoni', 'batu', 'iakur', 'fajar', 'lembut', 'jernih', 'pikiran',
  'fokus', 'selaras', 'candi', 'teh', 'senja', 'embun', 'bisik', 'dalam', 'cahaya', 'bayang',
  'taman', 'lumut', 'awan', 'kabut', 'danau', 'musim', 'semilir', 'kehadiran', 'anggun', 'sabar',
  'irama', 'gema', 'sunyi', 'cakrawala', 'meditasi', 'abadi', 'langkah', 'perjalanan', 'batin', 'murni',
  'pagi', 'karya', 'budi', 'nurani', 'syukur', 'hangat', 'jiwa', 'semesta', 'akar', 'mentari'
];

// English Word Pool
export const ENGLISH_WORDS: string[] = [
  'calm', 'peace', 'flow', 'breath', 'stream', 'forest', 'serene', 'still', 'zen', 'lotus',
  'bamboo', 'water', 'wind', 'harmony', 'stone', 'ripple', 'quiet', 'gentle', 'clarity',
  'mind', 'focus', 'balance', 'temple', 'tea', 'dawn', 'dusk', 'whisper', 'soft', 'deep',
  'light', 'shadow', 'garden', 'moss', 'cloud', 'mist', 'river', 'autumn', 'spring',
  'presence', 'grace', 'patience', 'rhythm', 'echo', 'breeze', 'silent', 'horizon', 'meditate',
  'infinite', 'moment', 'journey', 'solitude', 'tranquil', 'pure', 'radiant', 'ember', 'dew'
];

let lastQuoteId: string | null = null;

export function getRandomQuote(language: Language = 'id', category?: string): QuoteItem {
  let pool = ZEN_QUOTES.filter(q => q.language === language);
  
  if (category && category !== 'all') {
    const filtered = pool.filter(q => q.category === category);
    if (filtered.length > 0) pool = filtered;
  }

  // Avoid repeating the same quote immediately
  const available = pool.filter(q => q.id !== lastQuoteId);
  const candidates = available.length > 0 ? available : pool;
  
  const selected = candidates[Math.floor(Math.random() * candidates.length)];
  lastQuoteId = selected.id;
  return selected;
}

export function generateRandomWords(count: number, language: Language = 'id'): string {
  const wordPool = language === 'id' ? INDONESIAN_WORDS : ENGLISH_WORDS;
  const words: string[] = [];
  let prevWord = '';

  for (let i = 0; i < count; i++) {
    let word = wordPool[Math.floor(Math.random() * wordPool.length)];
    // Avoid immediate duplicate word
    while (word === prevWord && wordPool.length > 1) {
      word = wordPool[Math.floor(Math.random() * wordPool.length)];
    }
    words.push(word);
    prevWord = word;
  }
  return words.join(' ');
}
