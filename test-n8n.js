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
  detailedReview: "## FreeAgent Review\\n\\nFreeAgent is an award-winning online accounting software designed specifically for small businesses and freelancers. It provides a comprehensive suite of tools...\\n\\n### Key Features\\n- **Invoicing:** Create and send professional invoices.\\n- **Expenses:** Track your expenses easily by snapping photos of receipts.\\n- **Tax:** Automatically calculates your tax liability.",
  affiliateLink: "https://example.com/freeagent-aff",
  affiliateDisclosure: "This is an affiliate link.",
  pricingTable: [
    { plan: "Sole Trader", price: "£9.50/mo", bestFor: "Freelancers" },
    { plan: "Limited Company", price: "£14.50/mo", bestFor: "Ltd Companies" }
  ],
  youtubeEmbed: "https://youtube.com/embed/dQw4w9WgXcQ",
  expertName: "Stefan",
  expertTitle: "UK Business Tools Reviewer",
  dateUpdated: "2026-03-12"
};

fetch('http://localhost:3002/api/push', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'StefanReviewHub2026!'
  },
  body: JSON.stringify(payload)
})
.then(res => res.json())
.then(data => console.log('Response:', data))
.catch(err => console.error('Error:', err));
