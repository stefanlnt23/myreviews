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
