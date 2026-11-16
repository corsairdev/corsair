# @corsair-dev/adyntel

Adyntel plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/adyntel
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `google.ads` | `adyntel.api.google.ads` | `read` | List a company's Google ads from Google's Ad Transparency report by domain, filtered by media type and country, with a continuation token per page |
| `google.shopping` | `adyntel.api.google.shopping` | `read` | Start a Google Shopping ad lookup for a domain: synchronous ads when `shopping` is true, otherwise a task ID to poll with `google.shoppingStatus` |
| `google.shoppingStatus` | `adyntel.api.google.shoppingStatus` | `read` | Read the ads of a Google Shopping lookup started by `google.shopping`; free, and the only way to collect an async task |
| `keywords.paidVsOrganic` | `adyntel.api.keywords.paidVsOrganic` | `read` | Read paid and organic keyword counts for a domain, with position breakdowns, estimated traffic, ad budget and average CPC |
| `linkedin.ads` | `adyntel.api.linkedin.ads` | `read` | List a company's LinkedIn ads by domain or page ID, with optional date filtering, EU impression data and creative text extraction, each of which costs an extra credit |
| `linkedin.keywordSearch` | `adyntel.api.linkedin.keywordSearch` | `read` | Search the LinkedIn Ad Library for a keyword, filtered by country and date range, with a continuation token per page |
| `meta.ads` | `adyntel.api.meta.ads` | `read` | List a company's Facebook and Instagram ads from Meta's Ad Library, by Facebook page or domain, with country, language, media-type and ad-category filters and a continuation token per page |
| `meta.adSearch` | `adyntel.api.meta.adSearch` | `read` | Search the whole Meta ad library for a keyword, optionally limited to one country, with a continuation token per page |
| `tiktok.adDetails` | `adyntel.api.tiktok.adDetails` | `read` | Read one TikTok ad in full, including its advertiser and its targeting, from an ad ID returned by `tiktok.keywordSearch` |
| `tiktok.ads` | `adyntel.api.tiktok.ads` | `read` | List a company's TikTok ads by domain, optionally including the influencers posting sponsored content for the brand, with continuation tokens |
| `tiktok.keywordSearch` | `adyntel.api.tiktok.keywordSearch` | `read` | Search the TikTok ad library for a keyword, limited to European countries or worldwide, with a search ID for the next page |

## Auth

Auth: API key plus the account email. Both go in the JSON body of every call, and a key without its matching email is a 401. A call made without either throws `AuthMissingError`.

```ts
import { adyntel } from '@corsair-dev/adyntel';

const plugin = adyntel({
	key: process.env.ADYNTEL_API_KEY,
	email: process.env.ADYNTEL_EMAIL,
});
```

Copy the key from your Adyntel profile under Integrations.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/adyntel

## License

Apache-2.0
