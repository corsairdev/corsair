# @corsair-dev/scrapingant

ScrapingAnt plugin for Corsair: scrape pages as HTML, Markdown or structured AI-extracted JSON, read extended page data, and check credit usage.

## Install

```bash
pnpm add @corsair-dev/scrapingant
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.usage` | `scrapingant.api.account.usage` | `read` | Read the active plan, its period and the credits left in it; costs nothing |
| `extract.data` | `scrapingant.api.extract.data` | `read` | Fetch a page and have an AI model extract the requested properties as a JSON object; spends the scrape cost plus 1 credit per 30 characters of page and output text |
| `scrape.extended` | `scrapingant.api.scrape.extended` | `read` | Fetch a page and return HTML, text, cookies, headers, status code, XHRs and iframes as JSON; spends 1 to 125 credits |
| `scrape.html` | `scrapingant.api.scrape.html` | `read` | Fetch a page and return its HTML, with the target page status and credit cost; spends 1 to 125 credits depending on browser and proxy |
| `scrape.markdown` | `scrapingant.api.scrape.markdown` | `read` | Fetch a page and return the whole thing as Markdown, ready for an LLM; spends 1 to 125 credits |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/scrapingant

## License

Apache-2.0
