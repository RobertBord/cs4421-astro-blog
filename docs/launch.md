# F1 bits launch verification

Implemented on branch `feat/f1-bits-launch` in dependency order:
#34 identity, #35 metadata, #36 header, #37 footer, #39 schema/archive,
#38 homepage, #40 articles, #41 About/authors, #42 F2, #43 Madrid, #44 QA.
Work is recorded in one local commit per ticket. Tickets remain open pending
merge; the branch has not been pushed, merged, or deployed.

## Verification

- `npm run check`: Astro/TypeScript diagnostics.
- `npm run lint`: ESLint.
- `npm run test:unit -- --run`: dates, publication selection, editorial schema.
- `npm run build`: static routes, MDX, image optimisation, RSS, sitemap.
- `npm run test:e2e`: production-build browser checks in Chromium at desktop
  and iPhone-size viewports, including axe WCAG A/AA scans, overflow, images,
  keyboard navigation, category/reset navigation with JavaScript disabled,
  rumour disclosure, related articles, RSS, sitemap, previews, and redirects.
- Browser screenshots and failure traces are written to ignored test-results/.
- Brand text contrast against white: red 6.61:1, teal 6.71:1, ink 17.17:1.

## Deployment settings

Set repository Actions variable `SITE_URL` to the real HTTPS origin (CloudFront
or custom domain), with no path prefix. The deployment workflow passes it to
Astro. Local builds retain the repository's example.com fallback, so canonical
URLs, feed links, sitemap URLs, and sharing image URLs are not production-ready
until the real origin is configured. No production domain was discoverable in
repository metadata. Root-relative links assume deployment at the origin root.

The five former starter article URLs redirect to /blog/. Astro static output
uses HTML meta-refresh redirects, not HTTP 301 responses. Host-level HTTP
redirects can be added separately if required; the existing CDN setup is not
changed here. Redirect pages do not appear in the sitemap.

## Editorial decisions

Both launch stories are explicitly retrospective: the F2 article's reporting
cutoff is 31 May 2024, Madrid's is 31 January 2024. Neither claims current 2026
reporting. Madrid uses the evidence-supported question "Can Madrid deliver on
its F1 promise?" rather than asserting an unverified failure. It is text-led;
no Madrid photo was used because the candidate's licence could not be verified.
The Bearman photograph has a verified CC BY-SA 4.0 attribution and licence.
See image-credits.md. Review editorial copy before deployment.

## Residual risks

Dependency audit at implementation reported 11 total advisories and 6 with
`--omit=dev` (5 high, 1 moderate), including Sharp and transitive packages.
These were not remediated by unrelated dependency upgrades in this rebrand.
Static output does not run those libraries in a production request server,
but build/development exposure still warrants a separate dependency review.
Automated accessibility checks do not replace a full screen-reader audit.