import jakartaSkylineImg from '../assets/images/editorial_jakarta_skyline_1791366230881.jpg';
import techDatacenterImg from '../assets/images/editorial_tech_datacenter_1791366250707.jpg';
import archipelagoTradeImg from '../assets/images/editorial_archipelago_trade_1791366274515.jpg';
import renewableEnergyImg from '../assets/images/editorial_renewable_energy_1791366289147.jpg';

export type RubricKey =
  | 'semua'
  | 'nasional'
  | 'ekonomi'
  | 'teknologi'
  | 'internasional'
  | 'olahraga'
  | 'gaya-hidup';

export interface RubricOption {
  id: RubricKey;
  label: string;
  endpoint: string;
  description: string;
}

export const RUBRIC_OPTIONS: RubricOption[] = [
  {
    id: 'semua',
    label: 'Utama',
    endpoint: 'https://berita-indo-api-next.vercel.app/api/cnn-news',
    description: 'Laporan utama dan berita terhangat hari ini dari meja redaksi CNN Indonesia.',
  },
  {
    id: 'nasional',
    label: 'Nasional',
    endpoint: 'https://berita-indo-api-next.vercel.app/api/cnn-news/nasional',
    description: 'Kebijakan publik, dinamika politik, hukum, dan peristiwa lintas provinsi Nusantara.',
  },
  {
    id: 'ekonomi',
    label: 'Ekonomi',
    endpoint: 'https://berita-indo-api-next.vercel.app/api/cnn-news/ekonomi',
    description: 'Analisis makroekonomi, pasar modal, perdagangan maritim, dan kebijakan fiskal.',
  },
  {
    id: 'teknologi',
    label: 'Teknologi',
    endpoint: 'https://berita-indo-api-next.vercel.app/api/cnn-news/teknologi',
    description: 'Infrastruktur digital, pusat data nasional, riset sains, dan inovasi industri.',
  },
  {
    id: 'internasional',
    label: 'Internasional',
    endpoint: 'https://berita-indo-api-next.vercel.app/api/cnn-news/internasional',
    description: 'Geopolitik kawasan Indo-Pasifik, diplomasi bilateral, dan perkembangan dunia.',
  },
  {
    id: 'olahraga',
    label: 'Olahraga',
    endpoint: 'https://berita-indo-api-next.vercel.app/api/cnn-news/olahraga',
    description: 'Kiprah atlet nasional, liga sepak bola, bulu tangkis, dan kompetisi dunia.',
  },
  {
    id: 'gaya-hidup',
    label: 'Gaya Hidup',
    endpoint: 'https://berita-indo-api-next.vercel.app/api/cnn-news/gaya-hidup',
    description: 'Kesehatan, seni budaya, arsitektur perkotaan, dan kuliner Nusantara.',
  },
];

export interface NewsArticle {
  id: string;
  title: string;
  link: string;
  contentSnippet: string;
  isoDate: string;
  formattedDate: string;
  relativeTime: string;
  imageSmall: string;
  imageLarge: string;
  fallbackImage: string;
  category: RubricKey;
  categoryLabel: string;
  readTimeMinutes: number;
  author: string;
  figureCaption: string;
  pullQuote: string;
  fullBodyParagraphs: string[];
  isFromLiveApi?: boolean;
}

export const FALLBACK_IMAGES = [
  jakartaSkylineImg,
  techDatacenterImg,
  archipelagoTradeImg,
  renewableEnergyImg,
];

export const CURATED_FALLBACK_ARTICLES: NewsArticle[] = [
  {
    id: 'curated-1',
    title: 'Transformasi Koridor Ekonomi Jakarta dan Integrasi Transportasi Publik Berbasis Rel Menuju 2030',
    link: 'https://www.cnnindonesia.com/ekonomi',
    contentSnippet:
      'Pembangunan fase lanjutan jaringan kereta perkotaan terpadu mendorong efisiensi mobilitas komuter hingga 38 persen sekaligus menata ulang kawasan berorientasi transit di jantung ibu kota.',
    isoDate: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    formattedDate: '7 Oktober 2026',
    relativeTime: '25 menit lalu',
    imageSmall: jakartaSkylineImg,
    imageLarge: jakartaSkylineImg,
    fallbackImage: jakartaSkylineImg,
    category: 'ekonomi',
    categoryLabel: 'Ekonomi & Kota',
    readTimeMinutes: 5,
    author: 'Tim Riset & Desk Ekonomi',
    figureCaption: 'Fig. 1 — Lanskap distrik finansial Sudirman–Thamrin saat senja memperlihatkan integrasi jalur komuter dan gedung perkantoran hemat energi.',
    pullQuote: 'Integrasi antarmoda bukan sekadar proyek infrastruktur fisik, melainkan fondasi produktivitas ekonomi perkotaan jangka panjang.',
    fullBodyParagraphs: [
      'Memasuki kuartal keempat tahun ini, akselerasi pembangunan koridor transportasi berorientasi transit (Transit-Oriented Development) di kawasan pusat bisnis Jakarta menunjukkan dampak nyata terhadap pergerakan ekonomi harian. Data terbaru mencatat lonjakan jumlah penumpang harian transportasi publik berbasis rel yang menembus angka tertinggi dalam lima tahun terakhir.',
      'Sejumlah pengamat tata kota dan ekonom menilai bahwa konektivitas fisik antara simpul kereta komuter, MRT, dan LRT secara langsung memangkas biaya logistik maupun waktu tempuh pekerja sektor jasa. Hal ini turut mendorong pergeseran pola investasi properti komersial ke titik-titik simpul transit utama.',
      'Di sisi lain, pemerintah daerah bersama pemangku kepentingan terkait terus memperluas ruang terbuka hijau serta jalur pejalan kaki yang terhubung langsung dengan pintu stasiun. Langkah kuratorial tata ruang ini diharapkan menjadi cetak biru bagi pengembangan kawasan metropolitan lainnya di Indonesia.',
    ],
    isFromLiveApi: false,
  },
  {
    id: 'curated-2',
    title: 'Kedaulatan Infrastruktur Digital: Pusat Data Nasional Perkuat Ekosistem Semikonduktor dan Komputasi Awan',
    link: 'https://www.cnnindonesia.com/teknologi',
    contentSnippet:
      'Fasilitas pusat data berstandar Tier-IV mulai beroperasi penuh guna menopang keamanan siber, layanan publik terintegrasi, serta kolaborasi riset teknologi tinggi di Asia Tenggara.',
    isoDate: new Date(Date.now() - 65 * 60 * 1000).toISOString(),
    formattedDate: '7 Oktober 2026',
    relativeTime: '1 jam lalu',
    imageSmall: techDatacenterImg,
    imageLarge: techDatacenterImg,
    fallbackImage: techDatacenterImg,
    category: 'teknologi',
    categoryLabel: 'Teknologi & Sains',
    readTimeMinutes: 4,
    author: 'Redaksi Teknologi Nusantara',
    figureCaption: 'Fig. 2 — Insinyur jaringan melakukan kalibrasi serat optik berkecepatan tinggi pada ruang server utama berpendingin ramah lingkungan.',
    pullQuote: 'Kemandirian penyimpanan dan pengolahan data domestik menjadi syarat mutlak bagi ketahanan ekonomi digital nasional.',
    fullBodyParagraphs: [
      'Pengembangan pusat data berkapasitas tinggi di koridor industri Jawa Barat dan Kepulauan Riau menandai babak baru dalam arsitektur kedaulatan digital Indonesia. Dengan mengadopsi sistem pendinginan efisien dan pasokan listrik terbarukan, fasilitas ini dirancang untuk melayani trafik data lintas sektoral tanpa henti.',
      'Para peneliti dan pelaku industri teknologi menyambut positif ketersediaan infrastruktur lokal yang memangkas latensi jaringan secara signifikan. Selain mempercepat layanan administrasi publik, ketersediaan komputasi berkinerja tinggi di dalam negeri membuka peluang riset desain semikonduktor bagi universitas nasional.',
      'Regulasi perlindungan data pribadi yang semakin matang turut memberikan kepastian hukum bagi institusi keuangan dan kesehatan untuk memigrasikan sistem inti mereka ke infrastruktur domestik.',
    ],
    isFromLiveApi: false,
  },
  {
    id: 'curated-3',
    title: 'Modernisasi Pelabuhan Hub Nusantara Pangkas Waktu Bongkar Muat Logistik Antarpulau hingga 32 Persen',
    link: 'https://www.cnnindonesia.com/nasional',
    contentSnippet:
      'Otomatisasi derek peti kemas dan digitalisasi dokumen kepabeanan di lima pelabuhan utama mempercepat arus distribusi pangan serta komoditas ekspor unggulan.',
    isoDate: new Date(Date.now() - 130 * 60 * 1000).toISOString(),
    formattedDate: '7 Oktober 2026',
    relativeTime: '2 jam lalu',
    imageSmall: archipelagoTradeImg,
    imageLarge: archipelagoTradeImg,
    fallbackImage: archipelagoTradeImg,
    category: 'nasional',
    categoryLabel: 'Nasional & Maritim',
    readTimeMinutes: 6,
    author: 'Desk Maritim & Nasional',
    figureCaption: 'Fig. 3 — Aktivitas bongkar muat kapal kargo di pelabuhan hub utama saat matahari terbit dengan sistem penjadwalan terpadu.',
    pullQuote: 'Efisiensi rantai pasok maritim adalah kunci pemerataan harga kebutuhan pokok dari barat hingga timur kepulauan Indonesia.',
    fullBodyParagraphs: [
      'Sebagai negara kepulauan terbesar di dunia, efisiensi konektivitas laut memegang peranan sentral dalam menjaga stabilitas harga komoditas antarwilayah. Sepanjang semester kedua tahun ini, penerapan sistem manajemen pelabuhan pintar terbukti memangkas waktu tunggu kapal (dwelling time) secara konsisten.',
      'Integrasi satu pintu antara operator pelabuhan, armada pelayaran, dan otoritas bea cukai memungkinkan pelacakan posisi kontainer secara real-time. Para pelaku usaha logistik melaporkan penurunan biaya operasional yang berdampak langsung pada kelancaran distribusi bahan baku industri.',
      'Ke depan, perluasan jalur tol laut yang dipadukan dengan kawasan industri pesisir ditargetkan mampu meningkatkan daya saing produk manufaktur Indonesia di pasar global.',
    ],
    isFromLiveApi: false,
  },
  {
    id: 'curated-4',
    title: 'Akselerasi Transisi Energi Bersih: Pembangkit Panas Bumi dan Surya Dataran Tinggi Capai Target Kapasitas Baru',
    link: 'https://www.cnnindonesia.com/internasional',
    contentSnippet:
      'Kolaborasi pendanaan iklim internasional mendukung perluasan jaringan listrik ramah lingkungan yang memanfaatkan potensi vulkanik dan radiasi surya tropis.',
    isoDate: new Date(Date.now() - 210 * 60 * 1000).toISOString(),
    formattedDate: '7 Oktober 2026',
    relativeTime: '3 jam lalu',
    imageSmall: renewableEnergyImg,
    imageLarge: renewableEnergyImg,
    fallbackImage: renewableEnergyImg,
    category: 'internasional',
    categoryLabel: 'Transisi Energi',
    readTimeMinutes: 5,
    author: 'Desk Lingkungan & Global',
    figureCaption: 'Fig. 4 — Hamparan panel fotovoltaik dan instalasi panas bumi di kawasan pegunungan vulkanik yang menyuplai jaringan listrik utama.',
    pullQuote: 'Kombinasi energi panas bumi sebagai beban dasar dan tenaga surya di siang hari menciptakan bauran energi bersih yang stabil.',
    fullBodyParagraphs: [
      'Upaya dekarbonisasi sektor ketenagalistrikan mencatat capaian penting melalui pengoperasian sejumlah unit pembangkit energi baru terbarukan di kawasan dataran tinggi. Potensi panas bumi Indonesia yang melimpah kini dipadukan dengan ladang panel surya berskala utilitas.',
      'Dalam forum kerja sama regional pekan ini, skema pembiayaan hijau transisi energi mendapat dukungan luas dari lembaga keuangan multilateral. Fokus utama diarahkan pada pembangunan jaringan transmisi pintar (smart grid) yang menghubungkan sumber energi terpencil ke pusat beban industri.',
      'Selain menekan emisi karbon tahunan, proyek-proyek energi bersih ini juga melibatkan masyarakat lokal melalui program konservasi daerah aliran sungai dan pertanian berkelanjutan di sekitar wilayah kerja pembangkit.',
    ],
    isFromLiveApi: false,
  },
  {
    id: 'curated-5',
    title: 'Tim Nasional Bulu Tangkis dan Sepak Bola Matangkan Strategi Jelang Turnamen Kualifikasi Tingkat Asia',
    link: 'https://www.cnnindonesia.com/olahraga',
    contentSnippet:
      'Pemusatan latihan terpadu mengedepankan analisis biomekanika olahraga dan pemulihan fisik berbasis sains untuk menjaga konsistensi performa atlet.',
    isoDate: new Date(Date.now() - 280 * 60 * 1000).toISOString(),
    formattedDate: '7 Oktober 2026',
    relativeTime: '4 jam lalu',
    imageSmall: jakartaSkylineImg,
    imageLarge: jakartaSkylineImg,
    fallbackImage: jakartaSkylineImg,
    category: 'olahraga',
    categoryLabel: 'Olahraga',
    readTimeMinutes: 3,
    author: 'Desk Olahraga',
    figureCaption: 'Fig. 5 — Kompleks olahraga nasional di Jakarta yang menjadi pusat persiapan kontingen menuju agenda kompetisi internasional.',
    pullQuote: 'Pendekatan sport science modern memberi keunggulan presisi dalam menjaga kebugaran atlet di tengah jadwal turnamen yang padat.',
    fullBodyParagraphs: [
      'Persiapan intensif terus dilakukan oleh jajaran pelatih dan atlet nasional menjelang rangkaian kejuaraan tingkat Asia bulan depan. Penerapan teknologi pemantauan beban latihan berbasis sensor kini menjadi standar harian di pemusatan latihan nasional.',
      'Tim pelatih menekankan pentingnya keseimbangan antara ketajaman taktik di lapangan dan ketahanan mental saat menghadapi laga-laga krusial. Uji tanding internal menunjukkan peningkatan akurasi serta kecepatan transisi permainan.',
      'Dukungan publik yang begitu besar di setiap pertandingan kandang menjadi motivasi tambahan bagi para pemain muda untuk mencetak prestasi terbaik.',
    ],
    isFromLiveApi: false,
  },
  {
    id: 'curated-6',
    title: 'Revitalisasi Bangunan Cagar Budaya Menjadi Ruang Publik Kreatif dan Perpustakaan Komunitas di Berbagai Kota',
    link: 'https://www.cnnindonesia.com/gaya-hidup',
    contentSnippet:
      'Arsitek muda Indonesia mengadaptasi gedung-gedung bersejarah era kolonial dan pasca-kemerdekaan menjadi ruang baca terbuka, galeri seni, serta pusat diskusi warga.',
    isoDate: new Date(Date.now() - 340 * 60 * 1000).toISOString(),
    formattedDate: '7 Oktober 2026',
    relativeTime: '5 jam lalu',
    imageSmall: archipelagoTradeImg,
    imageLarge: archipelagoTradeImg,
    fallbackImage: archipelagoTradeImg,
    category: 'gaya-hidup',
    categoryLabel: 'Budaya & Arsitektur',
    readTimeMinutes: 4,
    author: 'Desk Seni & Budaya',
    figureCaption: 'Fig. 6 — Kawasan kota tua dan pelabuhan bersejarah yang ditata ulang menjadi ruang interaksi budaya dan literasi publik.',
    pullQuote: 'Merawat warisan arsitektur paling efektif dilakukan dengan memberinya fungsi sosial baru yang relevan bagi generasi masa kini.',
    fullBodyParagraphs: [
      'Gerakan pelestarian arsitektur melalui pendekatan adaptive reuse semakin berkembang di kota-kota seperti Jakarta, Semarang, Surabaya, hingga Medan. Gedung-gedung tua yang sebelumnya terbengkalai kini bertransformasi menjadi ruang ketiga yang inklusif bagi warga kota.',
      'Dengan mempertahankan struktur asli bangunan serta ventilasi silang tropis, para arsitek berhasil menghadirkan ruang baca dan galeri pameran yang nyaman tanpa bergantung berlebihan pada pendingin ruangan buatan.',
      'Kehadiran perpustakaan komunitas dan ruang diskusi di dalam bangunan bersejarah terbukti menghidupkan kembali ekonomi kreatif lokal sekaligus memperkuat identitas sejarah kawasan.',
    ],
    isFromLiveApi: false,
  },
];

function inferCategoryFromText(title: string, snippet: string, activeRubric: RubricKey): { key: RubricKey; label: string } {
  if (activeRubric !== 'semua') {
    const found = RUBRIC_OPTIONS.find((r) => r.id === activeRubric);
    return { key: activeRubric, label: found ? found.label : 'Nasional' };
  }
  const combined = `${title} ${snippet}`.toLowerCase();
  if (/rupiah|ihsg|ekonomi|bank|pajak|inflasi|saham|ekspor|impor|bisnis|pasar|investasi|harga/.test(combined)) {
    return { key: 'ekonomi', label: 'Ekonomi' };
  }
  if (/ai|teknologi|digital|siber|aplikasi|internet|data|chip|inovasi|sains|ponsel|gadget/.test(combined)) {
    return { key: 'teknologi', label: 'Teknologi' };
  }
  if (/timnas|liga|atlet|skor|pertandingan|olahraga|juara|pelatih|sepak bola|badminton|motogp/.test(combined)) {
    return { key: 'olahraga', label: 'Olahraga' };
  }
  if (/dunia|as|china|eropa|pbb|diplomasi|global|internasional|perang|asean/.test(combined)) {
    return { key: 'internasional', label: 'Internasional' };
  }
  if (/wisata|kuliner|kesehatan|seni|film|musik|budaya|gaya hidup|arsitektur/.test(combined)) {
    return { key: 'gaya-hidup', label: 'Gaya Hidup' };
  }
  return { key: 'nasional', label: 'Nasional' };
}

function formatIndonesianDate(isoString?: string): { formattedDate: string; relativeTime: string } {
  if (!isoString) {
    return { formattedDate: 'Hari Ini', relativeTime: 'Baru saja' };
  }
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return { formattedDate: 'Hari Ini', relativeTime: 'Baru saja' };
    }
    const formattedDate = new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);

    const diffMs = Date.now() - date.getTime();
    const diffMinutes = Math.max(1, Math.floor(diffMs / 60000));
    let relativeTime = '';
    if (diffMinutes < 60) {
      relativeTime = `${diffMinutes} menit lalu`;
    } else if (diffMinutes < 1440) {
      relativeTime = `${Math.floor(diffMinutes / 60)} jam lalu`;
    } else {
      relativeTime = `${Math.floor(diffMinutes / 1440)} hari lalu`;
    }
    return { formattedDate, relativeTime };
  } catch {
    return { formattedDate: 'Hari Ini', relativeTime: 'Baru saja' };
  }
}

export async function fetchCnnIndonesiaNews(rubric: RubricKey = 'semua'): Promise<{
  articles: NewsArticle[];
  isLive: boolean;
  sourceUrl: string;
}> {
  const rubricConfig = RUBRIC_OPTIONS.find((r) => r.id === rubric) || RUBRIC_OPTIONS[0];
  const url = rubricConfig.endpoint;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6500);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP status ${response.status}`);
    }

    const tempat = await response.json();
    const rawList: Array<{
      title?: string;
      link?: string;
      contentSnippet?: string;
      isoDate?: string;
      image?: { small?: string; large?: string };
    }> = Array.isArray(tempat?.data) ? tempat.data : [];

    if (rawList.length === 0) {
      throw new Error('Empty news array');
    }

    const mapped: NewsArticle[] = rawList.slice(0, 24).map((item, idx) => {
      const title = (item.title || 'Laporan Berita Terkini CNN Indonesia').trim();
      const snippet = (
        item.contentSnippet ||
        'Simak laporan selengkapnya mengenai perkembangan peristiwa terkini dari meja redaksi CNN Indonesia.'
      ).trim();
      const { key: catKey, label: catLabel } = inferCategoryFromText(title, snippet, rubric);
      const { formattedDate, relativeTime } = formatIndonesianDate(item.isoDate);
      const fallbackImg = FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length];
      const smallImg = item.image?.small || item.image?.large || fallbackImg;
      const largeImg = item.image?.large || item.image?.small || fallbackImg;
      const wordCount = snippet.split(/\s+/).length;
      const readTimeMinutes = Math.max(3, Math.min(7, Math.ceil(wordCount / 8) + (idx % 3)));

      return {
        id: `cnn-${rubric}-${idx}-${ encodeURIComponent(title.slice(0, 24)) }`,
        title,
        link: item.link || 'https://www.cnnindonesia.com',
        contentSnippet: snippet,
        isoDate: item.isoDate || new Date().toISOString(),
        formattedDate,
        relativeTime,
        imageSmall: smallImg,
        imageLarge: largeImg,
        fallbackImage: fallbackImg,
        category: catKey,
        categoryLabel: catLabel,
        readTimeMinutes,
        author: 'Redaksi CNN Indonesia',
        figureCaption: `Fig. ${idx + 1} — Dokumentasi visual laporan "${title.slice(0, 68)}${title.length > 68 ? '...' : ''}".`,
        pullQuote: snippet.length > 40
          ? snippet
          : 'Verifikasi fakta di lapangan dan kecepatan pelaporan menjadi pijakan utama jurnalisme publik.',
        fullBodyParagraphs: [
          snippet,
          `Laporan ini dihimpun langsung dari kanal resmi CNN Indonesia pada rubrik ${catLabel}. Perkembangan situasi di lapangan terus dipantau oleh tim koresponden untuk memastikan akurasi informasi serta dampak kebijakan bagi masyarakat luas.`,
          `Pembaca dapat menelusuri kronologi lengkap, pernyataan resmi narasumber terkait, serta data pendukung melalui tautan sumber asli CNN Indonesia yang tertera di bagian bawah ruang baca ini.`,
        ],
        isFromLiveApi: true,
      };
    });

    return {
      articles: mapped,
      isLive: true,
      sourceUrl: url,
    };
  } catch {
    // Graceful fallback to curated articles filtered by rubric (or all if none match)
    const filtered =
      rubric === 'semua'
        ? CURATED_FALLBACK_ARTICLES
        : CURATED_FALLBACK_ARTICLES.filter((a) => a.category === rubric);

    return {
      articles: filtered.length > 0 ? filtered : CURATED_FALLBACK_ARTICLES,
      isLive: false,
      sourceUrl: url,
    };
  }
}
