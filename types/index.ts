export interface PricingTier {
  plan: string;
  price: string;
  bestFor: string;
}

export interface ReviewImage {
  src: string;
  alt?: string;
  caption?: string;
}

export interface ReviewSignal {
  platform: string;
  rating?: string;
  reviewCount?: string;
  sentiment?: 'POSITIVE' | 'MIXED' | 'NEGATIVE' | 'NEUTRAL';
  takeaway: string;
}

export interface UserQuote {
  platform: string;
  quote: string;
  url?: string;
  author?: string;
  rating?: string;
  date?: string;
  topicTag?: string;
}

export interface ScoreBreakdown {
  easeOfUse: number;
  valueForMoney: number;
  ukFit: number;
  supportQuality: number;
  featureDepth: number;
}

export interface SourceAudit {
  checkedAt: string;
  sourcesCount: number;
  confidence?: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface Review {
  productName: string;
  slug: string;
  category: "ACCOUNTING" | "INVOICING" | "WEBSITE BUILDER" | "PAYMENTS" | "JOB MANAGEMENT" | "INSURANCE";
  score: number;
  mtdReady?: boolean;
  pros: string[];
  cons: string[];
  summary: string;
  detailedReview: string;
  affiliateLink: string;
  affiliateDisclosure?: string;
  pricingTable?: PricingTier[];
  youtubeEmbed?: string;
  expertName?: string;
  expertTitle?: string;
  dateUpdated?: string;
  images?: (string | ReviewImage)[];
  youtubeTitle?: string;
  expertQuote?: string;
  verdict?: "YES" | "NO" | "MAYBE";
  verdictReason?: string;
  reviewSignals?: ReviewSignal[];
  userQuotes?: UserQuote[];
  scoreBreakdown?: ScoreBreakdown;
  whoItsFor?: string[];
  notFor?: string[];
  sourceAudit?: SourceAudit;
  faqItems?: { question: string; answer: string }[];
  alternatives?: { name: string; reason: string }[];
  lastTestedVersion?: string;
  tagline?: string;
  badge?: string;
  isNew?: boolean;
}
