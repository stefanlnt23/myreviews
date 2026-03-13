const payload = {
  productName: "FreeAgent",
  slug: "freeagent",
  category: "ACCOUNTING",
  score: 9.1,
  mtdReady: true,
  pros: [
    "Full MTD for Income Tax support",
    "Great for freelancers and contractors",
    "Automatic bank feeds"
  ],
  cons: [
    "Pricier than some competitors",
    "Limited inventory features"
  ],
  summary: "The best all-round accounting tool for UK freelancers who want MTD compliance without the headache.",
  detailedReview: "## FreeAgent Review\n\nFreeAgent is an award-winning online accounting software designed specifically for small businesses and freelancers. It provides a comprehensive suite of tools...\n\n### Key Features\n- **Invoicing:** Create and send professional invoices.\n- **Expenses:** Track your expenses easily by snapping photos of receipts.\n- **Tax:** Automatically calculates your tax liability.",
  affiliateLink: "https://example.com/freeagent-aff",
  affiliateDisclosure: "This is an affiliate link.",
  pricingTable: [
    { plan: "Sole Trader", price: "£9.50/mo", bestFor: "Freelancers" },
    { plan: "Limited Company", price: "£14.50/mo", bestFor: "Ltd Companies" }
  ],
  youtubeEmbed: "https://youtube.com/embed/dQw4w9WgXcQ",
  expertName: "Stefan",
  expertTitle: "UK Business Tools Reviewer",
  verdict: "YES",
  verdictReason: "If you need simple MTD-ready accounting and invoice automation, it's one of the safest picks.",
  reviewSignals: [
    {
      platform: "Trustpilot",
      rating: "4.4/5",
      reviewCount: "1,800+ reviews",
      sentiment: "POSITIVE",
      takeaway: "Most users praise ease of use and support speed; complaints are mainly around premium feature pricing."
    },
    {
      platform: "G2",
      rating: "4.3/5",
      reviewCount: "500+ reviews",
      sentiment: "MIXED",
      takeaway: "SMBs like dashboard clarity; larger teams want deeper custom reporting."
    }
  ],
  userQuotes: [
    {
      platform: "Trustpilot",
      quote: "Great for day-to-day invoicing, but premium add-ons can get expensive.",
      url: "https://www.trustpilot.com/review/example",
      author: "Verified user",
      rating: "4/5",
      date: "2026-03-10",
      topicTag: "pricing"
    },
    {
      platform: "G2",
      quote: "Clean UI and good mobile app, but advanced reporting is limited on lower plans.",
      url: "https://www.g2.com/products/example/reviews",
      author: "Small business owner",
      rating: "4/5",
      date: "2026-03-01",
      topicTag: "reporting"
    }
  ],
  scoreBreakdown: {
    easeOfUse: 8.8,
    valueForMoney: 7.2,
    ukFit: 9.1,
    supportQuality: 8.0,
    featureDepth: 7.7
  },
  whoItsFor: [
    "Freelancers and contractors",
    "Small UK teams that need MTD-ready bookkeeping"
  ],
  notFor: [
    "Large finance teams needing enterprise controls",
    "Complex inventory-heavy operations"
  ],
  sourceAudit: {
    checkedAt: "2026-03-13",
    sourcesCount: 6,
    confidence: "MEDIUM"
  },
  dateUpdated: "2026-03-12",
  images: [
    {
      src: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&q=80",
      alt: "FreeAgent dashboard"
    }
  ]
};

const apiKey = process.env.API_SECRET;
const pushUrl = process.env.PUSH_URL || 'http://localhost:3002/api/push';

if (!apiKey) {
  throw new Error('Missing API_SECRET environment variable');
}

fetch(pushUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
  },
  body: JSON.stringify(payload)
})
  .then(res => res.json())
  .then(data => console.log('Response:', data))
  .catch(err => console.error('Error:', err));
