import { Song, Category, Album, Artist, Tag, SiteSettings, UserProfile, SitePanel } from '../types/music';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Navratri & Bhakti Special Dj Songs',
    slug: 'navratri-bhakti-special-dj-songs',
    count: 9,
    description: 'Pachra DJ remix, Devi Geet bass vibration, and festive temple sound systems',
    isNew: true,
    badge: 'NEW',
  },
  {
    id: 'cat-2',
    name: 'Electro House & EDM Festival Edits',
    slug: 'electro-house-edm-festival-edits',
    count: 12,
    description: 'Psytrance drops, festival horn mixers, hardstyle revamps',
    isNew: false,
    badge: 'HOT',
  },
  {
    id: 'cat-3',
    name: 'Trending Ringtones & 30s Audio Cuts',
    slug: 'trending-ringtones-30s-audio-cuts',
    count: 35,
    description: 'High-volume loud ringtones, BGM dialogue beats for Android/iOS',
    isNew: false,
    badge: 'VIRAL',
  },
  {
    id: 'cat-4',
    name: 'Latest Roadshow 2026',
    slug: 'latest-roadshow-2026',
    count: 18,
    description: 'Competition Roadshow DJ Tracks with high sub-bass pressure',
    isNew: true,
    badge: '2026',
  },
  {
    id: 'cat-5',
    name: 'Bhojpuri Club & Hard Bass Remixes',
    slug: 'bhojpuri-club-hard-bass-remixes',
    count: 24,
    description: 'Top trending Bhojpuri dance tracks, competition dholki drops and DJ remixes',
    isNew: false,
  },
  {
    id: 'cat-6',
    name: 'Haryanvi Bass Boosted Dance Mix',
    slug: 'haryanvi-bass-boosted-dance-mix',
    count: 15,
    description: 'Heavy car subwoofer mix, ragni remix, and Desi roadshow anthems',
    isNew: false,
  },
];

export const INITIAL_ALBUMS: Album[] = [
  {
    id: 'alb-1',
    name: 'Ayodhya Sound Lab Vol. 1',
    slug: 'ayodhya-sound-lab-vol-1',
    artist: 'DJ Surendra Ayodhya',
    artistSlug: 'dj-surendra-ayodhya',
    releaseYear: '2026',
    coverArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80',
    songCount: 6,
    description: 'Official studio master audio roadshow and competition vibration compilation.',
  },
  {
    id: 'alb-2',
    name: 'Bhojpuri Roadshow Blast 2026',
    slug: 'bhojpuri-roadshow-blast-2026',
    artist: 'Pawan Singh & DJ Tezz',
    artistSlug: 'pawan-singh',
    releaseYear: '2026',
    coverArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80',
    songCount: 8,
    description: 'Top chartbusters reconstructed with punchy 808 sub-bass kicks.',
  },
  {
    id: 'alb-3',
    name: 'Navratri Bhakti Trance',
    slug: 'navratri-bhakti-trance',
    artist: 'Anu Dubey & DJ Surendra',
    artistSlug: 'anu-dubey',
    releaseYear: '2026',
    coverArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80',
    songCount: 5,
    description: 'Devi Geet, Pachra and spiritual temple dance floor mixes.',
  },
  {
    id: 'alb-4',
    name: 'Desi Subwoofer Competition',
    slug: 'desi-subwoofer-competition',
    artist: 'Sapna Choudhary & DJ Akhil',
    artistSlug: 'sapna-choudhary',
    releaseYear: '2026',
    coverArt: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300&q=80',
    songCount: 7,
    description: 'Car subwoofer tests tuned between 30Hz - 60Hz frequency.',
  },
  {
    id: 'alb-5',
    name: '90s Disco Club Revival',
    slug: '90s-disco-club-revival',
    artist: 'Various Artists',
    artistSlug: 'various-artists',
    releaseYear: '2026',
    coverArt: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=300&q=80',
    songCount: 4,
    description: 'Nostalgic golden melodies with modern analog synth soundscapes.',
  },
  {
    id: 'alb-6',
    name: 'Super Loud Ringtones Vol. 5',
    slug: 'super-loud-ringtones-vol-5',
    artist: 'DJ Surendra Mobile Edit',
    artistSlug: 'dj-surendra-ayodhya',
    releaseYear: '2026',
    coverArt: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&q=80',
    songCount: 12,
    description: '30-second high-gain optimized call tunes for smartphone speakers.',
  },
];

export const INITIAL_ARTISTS: Artist[] = [
  {
    id: 'art-1',
    name: 'DJ Surendra Ayodhya',
    slug: 'dj-surendra-ayodhya',
    role: 'dj',
    trackCount: 14,
    bio: 'Premier sound engineer & DJ remixer from Ayodhya specializing in 320Kbps competition grade dholki tracks and roadshow bass.',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=200&q=80',
  },
  {
    id: 'art-2',
    name: 'DJ Tezz 2',
    slug: 'dj-tezz-2',
    role: 'dj',
    trackCount: 6,
    bio: 'Electronic dance producer crafting high tempo 140 BPM festival and club anthems.',
    image: 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?w=200&q=80',
  },
  {
    id: 'art-3',
    name: 'Pawan Singh',
    slug: 'pawan-singh',
    role: 'singer',
    trackCount: 8,
    bio: 'Power Star of Bhojpuri music industry with billions of views across YouTube and audio platforms.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
  },
  {
    id: 'art-4',
    name: 'Sapna Choudhary',
    slug: 'sapna-choudhary',
    role: 'singer',
    trackCount: 5,
    bio: 'Queen of Haryanvi folk pop and stage performance sensations.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
  },
  {
    id: 'art-5',
    name: 'Khesari Lal Yadav',
    slug: 'khesari-lal-yadav',
    role: 'singer',
    trackCount: 7,
    bio: 'Hit machine singer & actor renowned for catchy folk songs and festive numbers.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
  },
  {
    id: 'art-6',
    name: 'Shilpi Raj',
    slug: 'shilpi-raj',
    role: 'singer',
    trackCount: 9,
    bio: 'Prolific playback singer behind major dance hits and devotional albums.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
  },
  {
    id: 'art-7',
    name: 'Manoj Tiwari',
    slug: 'manoj-tiwari',
    role: 'singer',
    trackCount: 4,
    bio: 'Legendary singer whose golden classics continue to dominate DJ roadshows.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
  },
  {
    id: 'art-8',
    name: 'Anu Dubey',
    slug: 'anu-dubey',
    role: 'singer',
    trackCount: 3,
    bio: 'Top devotional and bhakti vocal artist famous for Maa Durga Pachra melodies.',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80',
  },
];

export const INITIAL_TAGS: Tag[] = [
  { id: 'tag-1', name: 'dj-remix', slug: 'dj-remix', count: 18 },
  { id: 'tag-2', name: 'hard-bass', slug: 'hard-bass', count: 14 },
  { id: 'tag-3', name: 'bhojpuri', slug: 'bhojpuri', count: 16 },
  { id: 'tag-4', name: 'dholki-mix', slug: 'dholki-mix', count: 11 },
  { id: 'tag-5', name: 'roadshow-2026', slug: 'roadshow-2026', count: 12 },
  { id: 'tag-6', name: 'haryanvi', slug: 'haryanvi', count: 8 },
  { id: 'tag-7', name: 'navratri-special', slug: 'navratri-special', count: 9 },
  { id: 'tag-8', name: 'ringtone-cut', slug: 'ringtone-cut', count: 15 },
  { id: 'tag-9', name: 'car-subwoofer', slug: 'car-subwoofer', count: 7 },
  { id: 'tag-10', name: 'edm-drop', slug: 'edm-drop', count: 9 },
];

export const INITIAL_USER: UserProfile = {
  id: 'usr-1',
  name: 'DJ Music Fan (Satyam)',
  email: 'satyamayodhyasrjbtk@gmail.com',
  role: 'creator',
  joinedDate: '2026-01-15',
  favoritesCount: 2,
  downloadsCount: 14,
  uploadedTracksCount: 3,
};

export const INITIAL_SONGS: Song[] = [
  {
    id: 'song-1',
    slug: 'bhojpuri-dj-remix-hard-bass-kick-2026',
    title: 'Bhojpuri DJ Remix (Hard Bass Kick 2026)',
    remixer: 'DJ Tezz 2',
    remixerSlug: 'dj-tezz-2',
    singer: 'Various Artists',
    singerSlug: 'various-artists',
    category: 'Bhojpuri Club & Hard Bass Remixes',
    categorySlug: 'bhojpuri-club-hard-bass-remixes',
    album: 'Bhojpuri Roadshow Blast 2026',
    albumSlug: 'bhojpuri-roadshow-blast-2026',
    bitrate: '320 Kbps',
    fileSize: '8.1 MB',
    duration: '4:05',
    durationSec: 245,
    hits: 89450,
    releaseYear: '2026',
    releaseDate: '2026-10-12',
    tempo: '140 BPM (Heavy Dance Drop)',
    tags: ['bhojpuri', 'dj-remix', 'hard-bass', 'dholki-mix'],
    keywords: ['bhojpuri dj remix 2026', 'dj tezz song download', 'hard bass kick mp3', '320kbps bhojpuri'],
    description: 'Official Club Master Audio mix by DJ Tezz 2 featuring punchy 808 kick, rolling dholki bass and crystalline vocals.',
    lyrics: `[Intro - DJ Tezz 2 Official Beat Check]
(Bass in the house! Ayodhya roadshow beat drop!)
(Ek do teen chaar... hard dholki bass vibration!)

[Verse 1]
हो... अखिया मिलावे जबसे, दिलवा में बाजे घंटी
कमरिया डोले ऐसे, लागे जइसे आंधी-तूफान री!
अरे अखिया मिलावे जबसे, दिलवा में बाजे घंटी
कमरिया डोले ऐसे, लागे जइसे आंधी-तूफान री!

[Chorus]
कमरिया करे लपा लप, लॉलीपॉप लागेलु!
ए गोरी कमरिया करे लपा लप, लॉलीपॉप लागेलु!
(DJ Tezz 2 - Hard Bass Kick Drop!)
(Rolling dholak and sub-bass vibration!)

[Verse 2]
जिला टॉप लागेलु, हो तू जिला टॉप लागेलु!
सभवा में जब तू नाचे लू, धड़कन सबकर थामे लू,
नैनन से चलावे गोली, राजा जी के मारे लू!
कमरिया करे लपा लप, लॉलीपॉप लागेलु!

[Outro]
कमरिया करे लपा लप... 
(Official 320 Kbps Roadshow Master Mix 2026)`,
    isHot: true,
    isTrending: true,
  },
  {
    id: 'song-2',
    slug: 'bhojpuri-dj-remix-navratri-blast',
    title: 'Bhojpuri DJ Remix (Navratri Blast)',
    remixer: 'DJ Tezz',
    remixerSlug: 'dj-tezz-2',
    singer: 'Shilpi Raj',
    singerSlug: 'shilpi-raj',
    category: 'Navratri & Bhakti Special Dj Songs',
    categorySlug: 'navratri-bhakti-special-dj-songs',
    album: 'Navratri Bhakti Trance',
    albumSlug: 'navratri-bhakti-trance',
    bitrate: '320 Kbps',
    fileSize: '8.1 MB',
    duration: '4:05',
    durationSec: 245,
    hits: 74210,
    releaseYear: '2026',
    releaseDate: '2026-10-09',
    tempo: '136 BPM (Festival Dholak)',
    tags: ['navratri-special', 'dj-remix', 'dholki-mix'],
    keywords: ['navratri dj song', 'dj tezz bhakti remix', 'bhojpuri navratri blast 2026', 'free mp3 download'],
    description: 'Special Navratri festive dance edit with power sub drops and crystal-clear dholki frequency.',
    lyrics: `[Intro - Shlok & Dholak Beats]
सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके।
शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते॥
(DJ Tezz 2026 Special Navratri Blast - Shilpi Raj!)

[Verse 1]
निबिया के डार मइया, झुलेली झुलनवा हो की,
झुली झुली ना...
मइया गावेली गितिया, हो की झुली झुली ना!
माई के चुनरिया सोहे लाल,
सजावल बाटे माई के दरबार!

[Chorus]
जय जय माँ दुर्गे, जय जय माँ काली!
भक्तन के विपदा सब हरने वाली!
आ गइली मोरी मैया हो, अंगनवा बाजे बजना!
जय माता दी बोल, सब मिलकर झूमो!

[Breakdrop - Dholki Trance Drop]
(Bhakti Bass Boosted - 136 BPM)
बोलो सांचे दरबार की जय!`,
    isHot: true,
    isTrending: false,
  },
  {
    id: 'song-3',
    slug: 'kali-mai-bichar-karhe-navratri-dj-remix',
    title: 'Kali Mai Bichar Karhe (Navratri DJ Remix)',
    remixer: 'DJ Surendra Ayodhya',
    remixerSlug: 'dj-surendra-ayodhya',
    singer: 'Anu Dubey & Manoj Tiwari',
    singerSlug: 'anu-dubey',
    category: 'Navratri & Bhakti Special Dj Songs',
    categorySlug: 'navratri-bhakti-special-dj-songs',
    album: 'Navratri Bhakti Trance',
    albumSlug: 'navratri-bhakti-trance',
    bitrate: '320 Kbps',
    fileSize: '9.8 MB',
    duration: '4:15',
    durationSec: 255,
    hits: 68410,
    releaseYear: '2026',
    releaseDate: '2026-10-05',
    tempo: '135 BPM (Trance Bhakti Beat)',
    tags: ['navratri-special', 'dj-remix', 'bhojpuri'],
    keywords: ['kali mai bichar karhe dj remix', 'anu dubey dj song', 'dj surendra ayodhya remix', 'navratri mp3 download'],
    description: 'Sacred energy meets thunderous festival bassline. Remixed by Ayodhya’s premier producer DJ Surendra.',
    lyrics: `[Intro - Shankh Naad & Trance Sub-Bass]
(DJ Surendra Ayodhya Official Sound Lab!)
(ॐ जयंती मंगला काली भद्रकाली कपालिनी)

[Verse 1]
काली माई विचार करहे, कवन विधि पूजन करीं हो!
माथा पर कलशा धईके, तोहरी शरण में पड़ीं हो!
काली माई विचार करहे, कवन विधि पूजन करीं हो!

[Chorus]
मइया हो मइया, तोहरी दुआरिया हम अइलीं,
लाल चुनरिया अड़हुल के फुलवा चढ़वलीं!
करिह कल्याण माई, भरिह अँचरवा,
तोहरे ही नाम से बा जग में उजियरवा!

[Outro Drop]
जय जय भवानी, जय महाकाली!
(DJ Surendra Ayodhya Sub-Bass Master Audio)`,
    isHot: true,
    isTrending: true,
  },
  {
    id: 'song-4',
    slug: 'kamariya-kare-lapa-lap-hard-dholki-bass-mix',
    title: 'Kamariya Kare Lapa Lap (Hard Dholki Bass Mix)',
    remixer: 'DJ Surendra Ayodhya',
    remixerSlug: 'dj-surendra-ayodhya',
    singer: 'Manoj Tiwari',
    singerSlug: 'manoj-tiwari',
    category: 'Bhojpuri Club & Hard Bass Remixes',
    categorySlug: 'bhojpuri-club-hard-bass-remixes',
    album: 'Ayodhya Sound Lab Vol. 1',
    albumSlug: 'ayodhya-sound-lab-vol-1',
    bitrate: '320 Kbps',
    fileSize: '9.4 MB',
    duration: '4:05',
    durationSec: 245,
    hits: 95610,
    releaseYear: '2026',
    releaseDate: '2026-09-28',
    tempo: '142 BPM (Competition Vibration)',
    tags: ['kamariya', 'bhojpuri', 'hard-bass', 'dholki-mix'],
    keywords: ['kamariya kare lapa lap dj song', 'manoj tiwari old bhojpuri dj remix', 'hard dholki bass mix download'],
    description: 'The golden timeless melody reborn with tight punchy dholki kicks and deep sub-woofers for stage shows.',
    lyrics: `[Intro - Ayodhya Sound Lab Intro]
(DJ Surendra Ayodhya! Competition Dholki Beat!)
(हवा में उड़े लाल चुनरिया...)

[Verse 1]
गोर देहिया पर चमकेला रूप तोहार,
देखी के मनवा में बाजे गिटार!
जब-जब लचकेला कमरिया तोहार,
हो जाला यूपी बिहार में बवाल!

[Chorus]
कमरिया करे लपा लप, लॉलीपॉप लागेलु!
कमरिया करे लपा लप, लॉलीपॉप लागेलु!
(Fast Dholki Roll & Sub Drop - 142 BPM)

[Verse 2]
गली-गली हल्ला बा तोहरे ही नाम के,
तोहके बनाइब दुल्हनिया हम शाम के!
नखरा ई छोड़ गोरी, दिल से लगा ले,
हमरे ही बाहों में दुनिया बसा ले!

[Chorus]
कमरिया करे लपा लप, लॉलीपॉप लागेलु!`,
    isHot: false,
    isTrending: true,
  },
  {
    id: 'song-5',
    slug: 'lal-ghaghra-competition-vibration-mix',
    title: 'Lal Ghaghra - Competition Vibration Mix',
    remixer: 'DJ Surendra Ayodhya',
    remixerSlug: 'dj-surendra-ayodhya',
    singer: 'Pawan Singh & Shilpi Raj',
    singerSlug: 'pawan-singh',
    category: 'Latest Roadshow 2026',
    categorySlug: 'latest-roadshow-2026',
    album: 'Bhojpuri Roadshow Blast 2026',
    albumSlug: 'bhojpuri-roadshow-blast-2026',
    bitrate: '320 Kbps',
    fileSize: '8.7 MB',
    duration: '3:58',
    durationSec: 238,
    hits: 121700,
    releaseYear: '2026',
    releaseDate: '2026-10-01',
    tempo: '138 BPM (Roadshow Bass)',
    tags: ['roadshow-2026', 'bhojpuri', 'hard-bass', 'dj-remix'],
    keywords: ['lal ghaghra dj remix', 'pawan singh lal ghaghra dj', 'competition vibration roadshow 2026'],
    description: 'Massive competition speaker test track! Heavy vibrations crafted exclusively for outdoor roadshows.',
    lyrics: `[Intro - Pawan Singh Power Dialogue]
(का हो गोरी! लाल घाघरा पहन के मेला घूमे लू?)
(DJ Surendra Ayodhya - 2026 Hard Vibration Mix!)

[Verse 1 - Shilpi Raj]
मेला में घूमे अइलीं, सहेलिया के साथे,
काहे ताके ला तू अंखिया गड़ाई के?
चोली में से झांके रूपवा हमार,
काहे मरे ला तू जानवा गँवाई के!

[Chorus - Pawan Singh]
कमर में दरद बा त गोली खा ला,
लाल घाघरा उठा के तू नाची ला!
लाल घाघरा... हो लाल घाघरा!
लाल घाघरा उठा के तू नाची ला!
(808 Roadshow Competition Drop!)

[Verse 2]
पवन के गाना जब बाजे ला कान में,
जोश भर जाला सबके इ जान में!
डीजे पे थिरके ला बूढ़ा जवान,
हिला देहब पूरा हिन्दुस्तान!

[Chorus]
लाल घाघरा उठा के तू नाची ला!`,
    isHot: true,
    isTrending: true,
  },
  {
    id: 'song-6',
    slug: 'chura-ke-dil-mera-90s-retro-disco-re-work',
    title: 'Chura Ke Dil Mera (90s Retro Disco Re-Work)',
    remixer: 'DJ Surendra Ayodhya',
    remixerSlug: 'dj-surendra-ayodhya',
    singer: 'Kumar Sanu & Alka Yagnik',
    singerSlug: 'kumar-sanu',
    category: 'Electro House & EDM Festival Edits',
    categorySlug: 'electro-house-edm-festival-edits',
    album: '90s Disco Club Revival',
    albumSlug: '90s-disco-club-revival',
    bitrate: '320 Kbps',
    fileSize: '11.1 MB',
    duration: '4:42',
    durationSec: 282,
    hits: 79650,
    releaseYear: '2026',
    releaseDate: '2026-09-15',
    tempo: '128 BPM (Nu-Disco House)',
    tags: ['edm-drop', 'dj-remix'],
    keywords: ['chura ke dil mera dj remix', '90s bollywood retro edm', 'kumar sanu disco remix download'],
    description: 'Nostalgic 90s classic re-imagined with modern analog bass synths and retro club groove.',
    lyrics: `[Intro - 90s Retro Synth Chords]
(Chura ke dil mera goriya chali...)
(Nu-Disco 128 BPM Club Edit)

[Verse 1 - Kumar Sanu]
चुरा के दिल मेरा गोरिया चली,
उड़ा के निंदिया कहाँ तू चली?
पागल हुआ, दीवाना हुआ,
कैसी ये दिल में हलचल मची?

[Chorus - Alka Yagnik]
चुरा के दिल तेरा चली मैं चली,
मुझे क्या पता कहाँ मैं चली!
ये हुस्न है जादू, ये रूप है शोला,
तेरी ही गली में महफ़िल सजी!

[Club Drop]
(Analog Bass Groove & Disco Percussion)`,
    isHot: false,
    isTrending: false,
  },
  {
    id: 'song-7',
    slug: 'teri-aakhya-ka-yo-kajal-heavy-car-subwoofer-mix',
    title: 'Teri Aakhya Ka Yo Kajal (Heavy Car Subwoofer Mix)',
    remixer: 'DJ Surendra Ayodhya',
    remixerSlug: 'dj-surendra-ayodhya',
    singer: 'Sapna Choudhary',
    singerSlug: 'sapna-choudhary',
    category: 'Haryanvi Bass Boosted Dance Mix',
    categorySlug: 'haryanvi-bass-boosted-dance-mix',
    album: 'Desi Subwoofer Competition',
    albumSlug: 'desi-subwoofer-competition',
    bitrate: '320 Kbps',
    fileSize: '7.6 MB',
    duration: '3:15',
    durationSec: 195,
    hits: 41200,
    releaseYear: '2026',
    releaseDate: '2026-10-02',
    tempo: '138 BPM (Heavy Dance Drop)',
    tags: ['haryanvi', 'car-subwoofer', 'hard-bass', 'dj-remix'],
    keywords: ['teri aakhya ka yo kajal dj mix', 'sapna choudhary car bass mix', 'haryanvi subwoofer song download'],
    description: 'Ultra high definition 320 Kbps car audio special. Tuned specifically for subwoofers between 32Hz-55Hz.',
    lyrics: `[Intro - Car Audio Subwoofer Bass Sweep]
(35Hz Sub Bass Kick - DJ Surendra Ayodhya)
(सपना चौधरी का देशी धमाका!)

[Chorus]
तेरी आंख्या का यो काजल,
मने करे से गोरी घायल!
तेरी आंख्या का यो काजल,
मने करे से गोरी घायल!
तू सहज सहज पाँव धर ले,
मेरा दिल धड़कावे पायल!

[Sub Drop - 138 BPM Heavy Vibration]
(Bass in the Trunk - Max Volume Test!)

[Verse 1]
सूट पटियाला तेरा जूती सितारों वाली,
चाले जब तू मटक के, लगे बड़ी निराली!
सारे हरियाणा में तेरी ही धूम मची,
देख के तेरी अदा सारी दुनिया झुकी!

[Chorus]
तेरी आंख्या का यो काजल, मने करे से गोरी घायल!`,
    isHot: true,
    isTrending: true,
  },
  {
    id: 'song-8',
    slug: 'mundian-to-bach-ke-electro-bhangra-drop-2026',
    title: 'Mundian To Bach Ke (Electro Bhangra Drop 2026)',
    remixer: 'DJ Surendra Ayodhya',
    remixerSlug: 'dj-surendra-ayodhya',
    singer: 'Panjabi MC',
    singerSlug: 'panjabi-mc',
    category: 'Electro House & EDM Festival Edits',
    categorySlug: 'electro-house-edm-festival-edits',
    album: '90s Disco Club Revival',
    albumSlug: '90s-disco-club-revival',
    bitrate: '320 Kbps',
    fileSize: '9.1 MB',
    duration: '3:57',
    durationSec: 237,
    hits: 53760,
    releaseYear: '2026',
    releaseDate: '2026-08-30',
    tempo: '132 BPM (Electro Bhangra)',
    tags: ['edm-drop', 'dj-remix'],
    keywords: ['mundian to bach ke 2026 remix', 'panjabi mc electro drop', 'bhangra club edit mp3'],
    description: 'The global Punjabi anthem boosted with modern EDM festival drops, horn stabs, and crisp tumbi chords.',
    isHot: false,
    isTrending: true,
  },
  {
    id: 'song-9',
    slug: 'raja-ji-ke-dilwa-super-loud-call-ringtone-cut',
    title: 'Raja Ji Ke Dilwa (Super Loud Call Ringtone Cut)',
    remixer: 'DJ Surendra Mobile Edit',
    remixerSlug: 'dj-surendra-ayodhya',
    singer: 'Khesari Lal Yadav',
    singerSlug: 'khesari-lal-yadav',
    category: 'Trending Ringtones & 30s Audio Cuts',
    categorySlug: 'trending-ringtones-30s-audio-cuts',
    album: 'Super Loud Ringtones Vol. 5',
    albumSlug: 'super-loud-ringtones-vol-5',
    bitrate: '320 Kbps',
    fileSize: '1.2 MB',
    duration: '0:30',
    durationSec: 30,
    hits: 81650,
    releaseYear: '2026',
    releaseDate: '2026-10-11',
    tempo: '144 BPM (Loud Acoustic Preamp)',
    tags: ['ringtone-cut', 'bhojpuri'],
    keywords: ['raja ji ke dilwa ringtone', 'khesari lal ringtone download', 'bhojpuri loud call tune 2026'],
    description: 'Super compressed and maximized 30-second mobile ringtone for loud phone speakers.',
    isHot: true,
    isTrending: true,
  },
  {
    id: 'song-10',
    slug: 'lollypop-lagelu-competition-hard-bass-mix',
    title: 'Lollypop Lagelu (Competition Hard Bass Mix)',
    remixer: 'DJ Surendra Ayodhya',
    remixerSlug: 'dj-surendra-ayodhya',
    singer: 'Pawan Singh',
    singerSlug: 'pawan-singh',
    category: 'Bhojpuri Club & Hard Bass Remixes',
    categorySlug: 'bhojpuri-club-hard-bass-remixes',
    album: 'Ayodhya Sound Lab Vol. 1',
    albumSlug: 'ayodhya-sound-lab-vol-1',
    bitrate: '320 Kbps',
    fileSize: '8.4 MB',
    duration: '3:44',
    durationSec: 224,
    hits: 145200,
    releaseYear: '2026',
    releaseDate: '2026-08-19',
    tempo: '144 BPM (Hardcore Dholki)',
    tags: ['bhojpuri', 'hard-bass', 'dholki-mix', 'roadshow-2026'],
    keywords: ['lollypop lagelu dj song', 'pawan singh old dj mix', 'kamariya lollypop lagelu download'],
    description: 'The worldwide Bhojpuri pop anthem boosted with aggressive competition level kicks.',
    isHot: true,
    isTrending: true,
  },
  {
    id: 'song-11',
    slug: 'pudina-ae-hasina-vibration-remix',
    title: 'Pudina Ae Hasina (Vibration Remix)',
    remixer: 'DJ Surendra Ayodhya',
    remixerSlug: 'dj-surendra-ayodhya',
    singer: 'Pawan Singh & Shilpi Raj',
    singerSlug: 'pawan-singh',
    category: 'Latest Roadshow 2026',
    categorySlug: 'latest-roadshow-2026',
    album: 'Bhojpuri Roadshow Blast 2026',
    albumSlug: 'bhojpuri-roadshow-blast-2026',
    bitrate: '320 Kbps',
    fileSize: '8.8 MB',
    duration: '3:44',
    durationSec: 224,
    hits: 111300,
    releaseYear: '2026',
    releaseDate: '2026-09-12',
    tempo: '140 BPM (Sub Vibration)',
    tags: ['roadshow-2026', 'bhojpuri', 'hard-bass'],
    keywords: ['pudina ae hasina dj song', 'pawan singh pudina remix', 'vibration remix free download'],
    description: 'Iconic street melody with vibrating 808 frequency and crystal treble response.',
    isHot: false,
    isTrending: true,
  },
  {
    id: 'song-12',
    slug: '52-gaj-ka-daman-desi-roadshow-club-mix',
    title: '52 Gaj Ka Daman (Desi Roadshow Club Mix)',
    remixer: 'DJ Surendra Heavy Sound',
    remixerSlug: 'dj-surendra-ayodhya',
    singer: 'Renuka Panwar',
    singerSlug: 'renuka-panwar',
    category: 'Haryanvi Bass Boosted Dance Mix',
    categorySlug: 'haryanvi-bass-boosted-dance-mix',
    album: 'Desi Subwoofer Competition',
    albumSlug: 'desi-subwoofer-competition',
    bitrate: '320 Kbps',
    fileSize: '8.7 MB',
    duration: '3:40',
    durationSec: 220,
    hits: 97800,
    releaseYear: '2026',
    releaseDate: '2026-09-02',
    tempo: '136 BPM (Roadshow Bassline)',
    tags: ['haryanvi', 'roadshow-2026', 'hard-bass'],
    keywords: ['52 gaj ka daman dj song', 'renuka panwar roadshow remix', 'haryanvi 52 gaj dj download'],
    description: 'Record-breaking folk pop anthem remastered with earth-shattering roadshow bass drops.',
    isHot: true,
    isTrending: true,
  },
];

export const INITIAL_SETTINGS: SiteSettings = {
  siteName: 'DjSongsHub.In All In One',
  siteSubtitle: 'All In One DJ Remix & High Speed MP3 Portal',
  siteUrl: 'https://djsongshub.in',
  adminEmail: 'satyamayodhyasrjbtk@gmail.com',
  adsenseEnabled: true,
  adsensePublisherId: 'pub-9482710398402819',
  metaKeywords: 'djsongshub, djsongshub.in, all in one dj remix songs download, 320kbps mp3, bhojpuri dj songs, haryanvi subwoofer remix, dholki mix, latest roadshow 2026, navratri dj song',
  metaDescription: 'DjSongsHub.In All In One Official 320Kbps HQ MP3 Portal - Download Free High Quality DJ Remix Songs, Roadshow Bass Mix, Dholki Tracks & Ringtones.',
  noticeBanner: 'UPDATES: DjSongsHub.In All In One Official 320Kbps HQ MP3 Portal - All DJ Remixes, Dholki Mix & Hard Bass Available - Fast Cloud CDN Active',
};

export const INITIAL_PANELS: SitePanel[] = [
  {
    id: 'panel-notice-1',
    title: '📢 DjSongsHub.In Official Updates & Telegram VIP',
    subtitle: 'High Speed 320Kbps Cloud CDN • Direct One-Click Downloads • Daily New DJ Tracks',
    type: 'notice',
    placement: 'home_top',
    order: 1,
    isActive: true,
    theme: 'emerald',
    badge: 'OFFICIAL',
    icon: 'bell',
    customHtml: 'Welcome to DjSongsHub.In All In One Official Portal! All Roadshow Hard Bass, Dholki Mix, and Festive DJ Songs are updated in 320Kbps Studio Master Quality with zero buffering.',
    actionUrl: 'https://t.me/djsongshub',
    actionText: '⚡ Join Telegram Channel (Instant Updates)',
    createdAt: '2026-03-01',
  },
  {
    id: 'panel-songs-trending',
    title: '🔥 Top 2026 Roadshow & Competition Tracks',
    subtitle: 'Most Played & High Demand Subwoofer Blasters',
    type: 'songs',
    placement: 'home_middle',
    order: 2,
    isActive: true,
    theme: 'crimson',
    badge: 'VIRAL',
    icon: 'flame',
    songsSort: 'trending',
    itemLimit: 4,
    createdAt: '2026-03-05',
  },
  {
    id: 'panel-djs-showcase',
    title: '🎧 Featured DJ Remixers & Producers',
    subtitle: 'Official Verified Audio Mixers of Ayodhya & India',
    type: 'artists',
    placement: 'home_middle',
    order: 3,
    isActive: true,
    theme: 'slate',
    badge: 'VERIFIED',
    icon: 'disc',
    itemLimit: 4,
    createdAt: '2026-03-10',
  },
  {
    id: 'panel-vip-banner',
    title: '🚀 DjSongsHub Fast Download Pass & WhatsApp Group',
    subtitle: 'Get unlimited direct download links without waiting • Share your remix tracks with 50K+ listeners',
    type: 'banner',
    placement: 'home_bottom',
    order: 4,
    isActive: true,
    theme: 'neon',
    badge: 'VIP PASS',
    icon: 'zap',
    customHtml: 'Are you a DJ Remixer or Music Producer? Upload your tracks on DjSongsHub and get featured on Homepage Panels with your DJ name and phone number!',
    actionUrl: 'https://wa.me/?text=Hello%20DjSongsHub%20I%20want%20to%20submit%20my%20DJ%20Song',
    actionText: '📲 Connect on WhatsApp for DJ Upload',
    createdAt: '2026-03-12',
  },
];

