# F1 bits

An independent Formula 1 blog built with Astro, TypeScript, Markdown, and MDX.
The first articles are explicitly retrospective, with reporting cutoffs rather
than claims of current driver-market or circuit news.

## Development

Requires Node.js 22.12 or later (CI uses Node 24).

```sh
npm ci
npm run dev -- --background
npm run astro -- dev status
npm run astro -- dev logs
npm run astro -- dev stop
```

The default port is 4321. Add `--port 4322` if it is occupied.

## Checks

```sh
npm run check
npm run lint
npm run test:unit -- --run
npm run build
npx playwright install chromium
npm run test:e2e
```

The browser suite builds production output and uses its own strict-port server
on 4497. It covers desktop/mobile accessibility, responsive layouts, navigation,
article images, metadata, feeds, and redirects. Screenshots and traces live in
the ignored test-results/ directory. The CI workflow runs the same checks.

## Publishing

Add a Markdown or MDX file under src/content/blog/. Its filename becomes its
article slug. Required editorial categories are `Driver Market`, `Race Analysis`,
and `Circuits`. Draft posts are excluded from public pages, routes, and RSS.

```yaml
---
title: 'A clearly sourced headline'
description: 'A short summary for readers and search engines.'
pubDate: '2026-10-21'
category: 'Race Analysis'
articleType: 'Analysis'
author: 'robertbord'
draft: true
featured: false
tags: ['Strategy']
---
```

Article types are `Analysis`, `Reported rumour`, and `Explainer`. Reported
rumours require a `reportingCutoff` date. Add `updatedDate` for a substantive
update and explain corrections in the article. A heroImage must have heroAlt,
imageCredit, and an HTTPS imageSource. Use a relative source image path, such as
`../../assets/example.jpg`, only after checking reuse rights. Source claims with
links, distinguish reporting from opinion, and retain image licence attribution.
Images are optional; never use an unverified photo just to fill a layout.

Author profiles live in src/content/authors/. Avatar images are optional;
the publication icon is used instead of inventing a contributor portrait.

## Deployment

Set the GitHub repository Actions variable `SITE_URL` to the actual HTTPS site
origin before deployment. The existing AWS CDK workflow passes it to Astro:

```sh
SITE_URL=https://your-actual-site.example npm run build
```

Without that variable, local builds retain the old example.com origin, which
must not be used for a public launch. Links assume deployment at the origin root.
Infrastructure under cdk/ is unchanged. Starter URLs redirect to the archive
using static HTML meta refresh; configure host-level redirects separately if
HTTP 301 responses are required.

## Brand And Editorial Notes

Run `npm run brand:assets` to regenerate the sharing PNG and favicon exports
from the original SVG sources. See [brand guidelines](docs/brand.md),
[image attribution](docs/image-credits.md), and [launch verification](docs/launch.md).

F1 bits is not affiliated with Formula 1, the FIA, or any team. This project
started from Astro's blog starter; the original baseline stylesheet derives
from Bear Blog, as attributed in src/styles/global.css.