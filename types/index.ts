export interface PricingTier {
  plan: string;
  price: string;
  bestFor: string;
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
  images?: string[];
  youtubeTitle?: string;
  expertQuote?: string;
  faqItems?: { question: string; answer: string }[];
  alternatives?: { name: string; reason: string }[];
  lastTestedVersion?: string;
}
