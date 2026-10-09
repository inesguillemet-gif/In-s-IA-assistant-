export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  badge?: string;
  description: string;
  highlights: string[];
  suggestedPrompt: {
    fr: string;
    en: string;
    ja: string;
  };
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  period: string;
  track?: string;
  details: string[];
}

export interface InesProfile {
  name: string;
  title: string;
  subtitle: string;
  location: string;
  email: string;
  phone: string;
  languages: {
    name: string;
    level: string;
    note: string;
    flag: string;
  }[];
  metrics: {
    label: string;
    value: string;
    context: string;
  }[];
  experiences: Experience[];
  education: EducationItem[];
  competencies: {
    category: string;
    skills: string[];
  }[];
  strategicProjects: {
    title: string;
    category: string;
    description: string;
  }[];
}

export const INES_PROFILE_DATA: InesProfile = {
  name: "Inès Guillemet",
  title: "Luxury Hospitality & Marketing Trainee",
  subtitle: "Master's Candidate in International Business & Luxury Brand Management",
  location: "Paris, France",
  email: "inesguillemet.pro@gmail.com",
  phone: "+33 7 68 46 81 29",
  languages: [
    {
      name: "Français",
      level: "Native",
      note: "Langue maternelle, articulation raffinée",
      flag: "🇫🇷",
    },
    {
      name: "English",
      level: "Fluent C1",
      note: "TOEIC 935/990, British nuance & international poise",
      flag: "🇬🇧",
    },
    {
      name: "Japanese",
      level: "Conversational & Polite",
      note: "Asian track & Japan export strategy, keigo etiquette",
      flag: "🇯🇵",
    },
    {
      name: "Korean",
      level: "A2 Elementary",
      note: "Yonsei University & Chung-Ang summer school",
      flag: "🇰🇷",
    },
  ],
  metrics: [
    {
      label: "Accor Brand Quality Score",
      value: "96.7%",
      context: "Accor Core Standards audit at Sofitel Bali Nusa Dua Resort",
    },
    {
      label: "Sofitel Luxury Standards",
      value: "99.0%",
      context: "Operational compliance and guest experience benchmarks",
    },
    {
      label: "LQA Hotel Score",
      value: "85.3%",
      context: "Leading Quality Assurance international luxury hospitality audit",
    },
    {
      label: "English Proficiency",
      value: "935 / 990",
      context: "TOEIC Official score (C1 level, 100% English Master track)",
    },
  ],
  experiences: [
    {
      id: "lutetia",
      role: "Executive Event & Chef de Rang Banqueting",
      company: "Lutetia Mandarin Oriental",
      location: "Paris, France (Left Bank Palace)",
      period: "Since Oct 2022 — Present (Extra)",
      badge: "Palace Parisian",
      description: "Delivering world-class bespoke service within Paris' renowned Left Bank Palace, coordinating premier private events and VIP client relations.",
      highlights: [
        "Executive coordination of prestigious banquets, summits, gala dinners, and luxury weddings for 100 to 200 distinguished guests.",
        "Discreet, tailored guest relations for international VIPs, dignitaries, and private palace clientele.",
        "Flawless execution of palace-level silver service, upholding Mandarin Oriental and French palace traditions.",
      ],
      suggestedPrompt: {
        fr: "Inès, parlez-moi de votre expérience au palace Le Lutetia Mandarin Oriental.",
        en: "Inès, could you describe your role and VIP guest relations at the Lutetia Palace?",
        ja: "ルテシア・マンダリン・オリエンタルでのVIP接客経験について教えていただけますか？",
      },
    },
    {
      id: "sofitel-bali",
      role: "Management Trainee — Quality & Operations",
      company: "Sofitel Bali Nusa Dua Beach Resort",
      location: "Bali, Indonesia",
      period: "Jul 2024 — Dec 2024",
      badge: "Luxury Resort & Audits",
      description: "6-month immersive operational leadership and brand standards auditing in a flagship 5-star beachfront luxury resort.",
      highlights: [
        "Executed comprehensive brand audits achieving record scores: Sofitel Standards 99.0%, Accor Core Standards 96.7%, and LQA 85.3%.",
        "Conceived and deployed an end-to-end guest experience initiative from ideation, 3D modeling, budget approval to resort rollout (still live today).",
        "Synthesized guest feedback across RPS and online reputation channels (Google, TripAdvisor, Booking.com, TrustYou) to optimize departmental KPIs.",
      ],
      suggestedPrompt: {
        fr: "Quels étaient vos résultats d'audits qualité au Sofitel Bali Nusa Dua ?",
        en: "How did you manage quality audits and achieve 99% Sofitel standards in Bali?",
        ja: "バリ島のソフィテルでの品質監査とプロジェクトについて教えてください。",
      },
    },
    {
      id: "worldwide",
      role: "Newsletter Editor Manager & Corporate Secretary",
      company: "Worldwide Association",
      location: "Paris, France",
      period: "Oct 2023 — Dec 2025",
      badge: "Communications",
      description: "Strategic internal & external editorial management, digital brand voice, and international student integration.",
      highlights: [
        "Managed social media channels and visual editorial calendar for @worldwideasso.",
        "Spearheaded communications and administrative logistics for cultural galas and welcoming cohorts of international exchange students.",
      ],
      suggestedPrompt: {
        fr: "Quel a été votre rôle éditorial et associatif au sein de Worldwide ?",
        en: "What was your contribution as Newsletter Editor Manager for Worldwide?",
        ja: "Worldwideでの広報および編集長としての役割について教えてください。",
      },
    },
    {
      id: "villa-positano",
      role: "Community Manager & Head Waitress",
      company: "Villa Positano",
      location: "Paris, France",
      period: "Feb 2023 — Sep 2024",
      badge: "Hospitality & Social Media",
      description: "Dual leadership encompassing digital storytelling and front-of-house guest satisfaction.",
      highlights: [
        "Created high-engagement visual assets for Instagram and TikTok combining culinary aesthetics and guest storytelling.",
        "Supervised dining floor service as Head Waitress, fostering team cohesion and top ratings.",
      ],
      suggestedPrompt: {
        fr: "Comment combiniez-vous le community management et le service client à la Villa Positano ?",
        en: "How did you combine digital community management with hospitality service at Villa Positano?",
        ja: "ヴィラ・ポジターノでのSNSマーケティングとフロア統括について教えてください。",
      },
    },
    {
      id: "fleur-de-loire",
      role: "Seasonal Fine Dining Service",
      company: "Fleur de Loire by Christophe Hay",
      location: "Blois, France",
      period: "2022",
      badge: "2 Michelin Stars • 5-Star Hotel",
      description: "Immersion in haute gastronomy and Relais & Châteaux luxury hospitality standards.",
      highlights: [
        "Orchestrated refined breakfast and lunch services in a 2-Michelin-star gastronomic restaurant.",
        "Mastered precision timing, gastronomic vocabulary, and high-touch discretion.",
      ],
      suggestedPrompt: {
        fr: "Que retenez-vous de votre passage chez Christophe Hay (2 étoiles Michelin) ?",
        en: "What did you learn in the 2-Michelin-starred restaurant Fleur de Loire?",
        ja: "ミシュラン2つ星レストランでの経験で得たものは何ですか？",
      },
    },
  ],
  education: [
    {
      id: "esce",
      degree: "Master in Marketing & Communication — Luxury & Prestige",
      institution: "ESCE International Business School",
      location: "Paris, France",
      period: "2022 — 2027",
      track: "100% English Program • Grande École",
      details: [
        "Specialization in Luxury Brand Management, Prestige Hospitality, and Strategic PR.",
        "Bachelor in International Business (Asian Track, 100% English).",
        "Strategic projects: Vacheron Constantin × MAD Brand Management, Hermès Crisis Strategy, Maison de Parfum Berry IMC Campaign.",
      ],
    },
    {
      id: "yonsei",
      degree: "Semester Abroad — Business Administration",
      institution: "Yonsei University (연세대학교)",
      location: "Seoul, South Korea",
      period: "2026",
      details: [
        "Global business management and Asian consumer behavior in one of Korea's prestigious SKY universities.",
      ],
    },
    {
      id: "laurea",
      degree: "Exchange Semester — Business Management",
      institution: "LAUREA University of Applied Sciences",
      location: "Helsinki, Finland",
      period: "2024",
      details: [
        "Nordic service design, sustainability management, and international operations.",
      ],
    },
    {
      id: "chung-ang",
      degree: "Summer School — Asian Culture & Global Business",
      institution: "Chung-Ang University (중앙대학교)",
      location: "Seoul, South Korea",
      period: "2023",
      details: [
        "Immersion in Korean business landscape and cross-cultural communication.",
      ],
    },
  ],
  competencies: [
    {
      category: "Hospitality & Operations",
      skills: [
        "Palace Service Standards",
        "Opera PMS System",
        "LQA (Leading Quality Assurance) Audits",
        "Accor Core & Sofitel Standards",
        "VIP & Diplomatic Guest Handling",
        "Event Production (100–200 pax)",
      ],
    },
    {
      category: "Data & Performance",
      skills: [
        "KPI Analysis & Performance Dashboards",
        "RPS (Reputation Performance Score)",
        "TrustYou, TripAdvisor & Booking Analytics",
        "Microsoft Office Suite (Excel, PowerPoint, Word)",
        "Operational Budgeting & Feasibility",
      ],
    },
    {
      category: "Marketing & Creative",
      skills: [
        "Luxury Brand Storytelling",
        "Social Media Production (IG, TikTok)",
        "Photo & Video Editing",
        "Integrated Marketing Communications (IMC)",
        "Crisis Management Strategy",
      ],
    },
    {
      category: "Interpersonal & Mindset",
      skills: [
        "MBTI: ENFJ (Protagonist / Empathetic Leader)",
        "Discreet Luxury Poise",
        "Cross-Cultural Agility (Europe & Asia)",
        "Problem Solving under High Pressure",
      ],
    },
  ],
  strategicProjects: [
    {
      title: "Hermès Crisis Management Strategy",
      category: "Crisis Communications",
      description: "In-depth case analysis developing brand defense protocols, luxury heritage protection, and international media stewardship.",
    },
    {
      title: "Vacheron Constantin × MAD Brand Management",
      category: "Haute Horlogerie & Co-branding",
      description: "Concept study exploring high-watchmaking brand codes, contemporary design fusion, and ultra-high-net-worth engagement.",
    },
    {
      title: "Maison de Parfum Berry IMC Campaign",
      category: "Haute Parfumerie",
      description: "Comprehensive 360-degree marketing campaign structuring olfactory brand positioning, digital press kits, and boutique launch.",
    },
    {
      title: "Japan Export Strategy & SNECI India",
      category: "International Expansion",
      description: "Rigorous market entry feasibility study, regulatory compliance, cultural adaptation, and Asian distribution channels.",
    },
  ],
};
