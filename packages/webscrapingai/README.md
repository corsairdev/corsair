# @corsair-dev/webscrapingai

WebScraping.AI plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/webscrapingai
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.getInfo` | `webscrapingai.api.account.getInfo` | `read` | Return account quota and credit information |
| `ai.askQuestion` | `webscrapingai.api.ai.askQuestion` | `read` | Answer a question using the content of a web page |
| `ai.extractFields` | `webscrapingai.api.ai.extractFields` | `read` | Extract requested fields from a web page as structured JSON |
| `scraping.getHtml` | `webscrapingai.api.scraping.getHtml` | `read` | Return the rendered HTML of a web page |
| `scraping.getSelectedHtml` | `webscrapingai.api.scraping.getSelectedHtml` | `read` | Return HTML matching one CSS selector |
| `scraping.getSelectedMultiple` | `webscrapingai.api.scraping.getSelectedMultiple` | `read` | Return HTML matching multiple CSS selectors |
| `scraping.getText` | `webscrapingai.api.scraping.getText` | `read` | Return clean text or Markdown extracted from a web page |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/webscrapingai

## License

Apache-2.0
