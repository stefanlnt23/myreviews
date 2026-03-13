# n8n + Website Review (Recommended Improvements)

## High-priority fixes

1. **Remove hardcoded API key from workflow**
   - Current `Push Review` node embeds a raw key in `x-api-key`.
   - Move this to an n8n credential or environment variable expression (for example `={{ $env.REVIEWS_API_KEY }}`) and rotate the existing key.

2. **Add error handling branches for HTTP fetch nodes**
   - `Fetch Homepage` and `Fetch Pricing` should enable `continueOnFail` and route failures to a fallback branch.
   - Right now either request failure can break the whole run or produce invalid merged input.

3. **Guard against empty queue item**
   - If `Get Next Product` returns zero rows, downstream nodes should stop cleanly.
   - Add an `IF` node after `Take 1 Only` to check `id` exists before `Mark Processing`.

4. **Avoid stuck `processing` rows**
   - Add a recovery workflow that resets stale rows (`status=processing` and `claimedAt` older than threshold) back to `pending`.

## Quality improvements

1. **Add JSON schema validation in n8n before push**
   - You already do strong validation in `Validate Review`.
   - Add one more check for `slug` format and URL validity for `affiliateLink` and `images`.

2. **Retry strategy for API push**
   - Configure retries on `Push Review` with exponential backoff for transient `5xx`/timeouts.

3. **Improve model output consistency**
   - In `Stefan's Brain`, ask for a strict min/max word count and disallow Markdown in `summary`.
   - Keep `Return ONLY raw JSON`, which is good.

4. **Persist model raw output for debugging**
   - Store raw model text in a debug field/log before parsing so failed runs are easier to triage.

## Website/API hardening updates made in this repo

- Added stricter payload validation in `POST /api/push`.
- Added normalization for `images` so API accepts both string URLs and `{ src, alt, caption }` objects.
- Updated review page image rendering to support both legacy image strings and object-based images.
- Updated local n8n test script to use environment variables instead of hardcoded secrets.

## New content structure for better readability

To make each review easier to scan and more trustworthy, include these optional fields in the payload sent to `/api/push`:

- `verdict`: `YES` | `MAYBE` | `NO`
- `verdictReason`: 1 concise paragraph explaining the recommendation
- `reviewSignals`: array of source snapshots from platforms like Trustpilot, G2, Capterra, Reddit
  - `platform` (required)
  - `rating` (optional string, e.g. `4.2/5`)
  - `reviewCount` (optional string, e.g. `5,000+ reviews`)
  - `sentiment` (optional: `POSITIVE` | `MIXED` | `NEGATIVE`)
  - `takeaway` (required)

## Full payload field contract (for n8n)

### Core required fields

- `productName` (string)
- `slug` (string)
- `category` (`ACCOUNTING`, `INVOICING`, `WEBSITE BUILDER`, `PAYMENTS`, `JOB MANAGEMENT`, `INSURANCE`)
- `score` (number 0–10)
- `pros` (string[])
- `cons` (string[])
- `summary` (string)
- `detailedReview` (string)
- `affiliateLink` (string URL)

### Optional structured UX fields (recommended)

- `verdict`: `YES` | `MAYBE` | `NO`
- `verdictReason`: concise decision explanation
- `reviewSignals`: summarized source-level sentiment cards
- `userQuotes`: direct quote cards with source links
- `scoreBreakdown`: objective sub-scores for digestibility
- `whoItsFor`: quick audience chips
- `notFor`: quick avoid-if chips
- `sourceAudit`: source freshness + confidence metadata

### `userQuotes` shape

```json
[
  {
    "platform": "Trustpilot",
    "quote": "Checkout works well but support can be slow when accounts are flagged.",
    "url": "https://www.trustpilot.com/review/example",
    "author": "Verified user",
    "rating": "4/5",
    "date": "2026-03-12",
    "topicTag": "support"
  }
]
```

### `scoreBreakdown` shape

```json
{
  "easeOfUse": 8.4,
  "valueForMoney": 7.2,
  "ukFit": 5.1,
  "supportQuality": 6.2,
  "featureDepth": 8.9
}
```

### `sourceAudit` shape

```json
{
  "checkedAt": "2026-03-13",
  "sourcesCount": 6,
  "confidence": "MEDIUM"
}
```

## Example complete payload

```json
{
  "productName": "Stripe",
  "slug": "stripe",
  "category": "PAYMENTS",
  "score": 7.5,
  "mtdReady": false,
  "summary": "Excellent payment rails, but not a UK bookkeeping replacement.",
  "detailedReview": "...",
  "pros": ["Fast payouts", "Strong APIs", "No monthly fee"],
  "cons": ["Support complaints", "No native CIS/MTD filing"],
  "affiliateLink": "https://stripe.com/gb",
  "verdict": "MAYBE",
  "verdictReason": "Use it for card processing, not as your accounting backbone.",
  "reviewSignals": [
    {
      "platform": "Trustpilot",
      "rating": "4.2/5",
      "reviewCount": "5,000+ reviews",
      "sentiment": "MIXED",
      "takeaway": "Great product reliability, but repeated support and account hold complaints."
    }
  ],
  "userQuotes": [
    {
      "platform": "G2",
      "quote": "Developer integration is brilliant, non-tech setup is harder.",
      "url": "https://www.g2.com/products/stripe/reviews",
      "author": "SMB owner",
      "rating": "4/5",
      "date": "2026-02-21",
      "topicTag": "setup"
    }
  ],
  "scoreBreakdown": {
    "easeOfUse": 8.1,
    "valueForMoney": 6.8,
    "ukFit": 5.0,
    "supportQuality": 5.9,
    "featureDepth": 9.0
  },
  "whoItsFor": ["SMBs taking card payments", "Teams with technical support"],
  "notFor": ["CIS-heavy contractors", "Businesses needing direct HMRC filing"],
  "sourceAudit": {
    "checkedAt": "2026-03-13",
    "sourcesCount": 7,
    "confidence": "MEDIUM"
  }
}
```

## n8n prompt add-on (drop into your writer prompt)

> Also include these fields in the JSON output when evidence exists:
> - `verdict` (`YES`/`MAYBE`/`NO`)
> - `verdictReason`
> - `reviewSignals` (source-level summary from Trustpilot/G2/Capterra/Reddit)
> - `userQuotes` (1–4 short quotes with platform + URL)
> - `scoreBreakdown` (five numeric fields: easeOfUse, valueForMoney, ukFit, supportQuality, featureDepth)
> - `whoItsFor` and `notFor` arrays
> - `sourceAudit` with checkedAt, sourcesCount, confidence
