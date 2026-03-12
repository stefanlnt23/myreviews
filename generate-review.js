// generate-review.js
// Run this with: node generate-review.js
const https = require('http'); // using http since local server is HTTP

const reviewPayload = {
  // --- CORE FIELDS ---
  slug: "xero", // MUST BE UNIQUE
  productName: "Xero",
  category: "ACCOUNTING", // ACCOUNTING, INVOICING, WEBSITE BUILDER, PAYMENTS, JOB MANAGEMENT, INSURANCE
  score: 8.8, // 1-10
  mtdReady: true,

  // --- SUMMARIES ---
  summary: "A beautifully designed cloud accounting beast that scales natively as your business grows.",
  expertVerdict: "**Xero** is a powerhouse. While initially tailored for slightly larger SMEs, their recent updates to the starter plan make it a fantastic choice for ambitious sole traders who anticipate growing into a limited company. The bank reconciliation is unmatched.",
  
  // --- PROS & CONS ---
  pros: [
    "Incredible UI and smooth bank reconciliation",
    "Massive ecosystem of third-party app integrations",
    "Scales easily if you incorporate later"
  ],
  cons: [
    "Starter plan limits you to only 20 invoices per month",
    "Customer support is email-only (no phone)",
    "Significant price jumps on higher tiers"
  ],

  // --- PRICING ---
  pricingTable: {
    title: "Xero Pricing (Ex. VAT)",
    tiers: [
      { name: "Ignite", price: "£16/mo", features: ["20 invoices/bills", "Hubdoc included", "MTD ready"] },
      { name: "Grow", price: "£33/mo", features: ["Unlimited invoices", "Bulk reconcile", "Short-term cash flow"] },
      { name: "Comprehensive", price: "£42/mo", features: ["Multiple currencies", "Analytics plus", "Employee expenses"] }
    ]
  },

  // --- AFFILIATE LINKS ---
  affiliateLink: "https://xero.com",
  youtubeEmbed: "https://www.youtube.com/embed/8rYQ-ZJ1tXo", // Optional

  // --- DETAILED TEXT (Markdown supported) ---
  detailedReview: `
## Xero for Sole Traders: Overkill or Future-Proof?

Xero has built a reputation as the darling of modern accountants. It’s slick, cloud-native, and has an app store that puts competitors to shame. But is it right for a one-person business?

### The Good

The absolute standout feature of Xero is its bank reconciliation. It learns as you go, suggesting matches and making what is usually the most tedious part of bookkeeping entirely painless. The dashboard is clean, and the mobile app is surprisingly robust, allowing you to quote and invoice from the van.

### The Bad

The "Ignite" plan limits you to creating just 20 invoices and entering 5 bills a month. If you are a tradesperson doing multiple small jobs a week, you will blow through this limit instantly and be forced onto the £33/mo "Grow" plan, making it significantly more expensive than FreeAgent or QuickBooks Self-Employed.

### Final Verdict

If you sell low-volume, high-value services (e.g., a web designer taking on 3 clients a month), the starter plan is perfect. If you are a high-volume business, you'll need the more expensive tiers, but you get what you pay for in terms of quality.
  `
};

const data = JSON.stringify(reviewPayload);

const options = {
  hostname: 'localhost',
  port: 3002,
  path: '/api/push',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'StefanReviewHub2026!',
    'Content-Length': Buffer.byteLength(data)
  }
};

console.log(`Sending payload for ${reviewPayload.productName}...`);

const req = https.request(options, (res) => {
  let responseBody = '';

  res.on('data', (chunk) => {
    responseBody += chunk;
  });

  res.on('end', () => {
    console.log(`Status Code: ${res.statusCode}`);
    console.log(`Response: ${responseBody}`);
  });
});

req.on('error', (error) => {
  console.error('Error sending request:', error.message);
});

req.write(data);
req.end();
