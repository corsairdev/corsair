# @corsair-dev/parsera

Parsera is an AI web scraper: this plugin extracts structured data from pages or raw content with prompts or attribute lists, manages reusable extractor and agentic scrapers, and runs them synchronously or as pollable async jobs.

## Install

```bash
pnpm add @corsair-dev/parsera
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `agent.createScraper` | `parsera.api.agent.createScraper` | `write` | Create an empty agentic scraper |
| `agent.deleteScraper` | `parsera.api.agent.deleteScraper` | `destructive` | Delete an agentic scraper |
| `agent.extract` | `parsera.api.agent.extract` | `write` | Start a one-shot agentic extraction; answers a task_id to poll, stop or wait on |
| `agent.generateScraper` | `parsera.api.agent.generateScraper` | `write` | Build or regenerate an agentic scraper from a page and an instruction |
| `agent.getScraper` | `parsera.api.agent.getScraper` | `read` | Read one agentic scraper with its build status and parameters schema |
| `agent.getTask` | `parsera.api.agent.getTask` | `read` | Read one agentic extraction task with its status and results |
| `agent.stopTask` | `parsera.api.agent.stopTask` | `write` | Cancel a running agentic extraction |
| `extractor.createScraper` | `parsera.api.extractor.createScraper` | `write` | Create an empty extractor scraper |
| `extractor.deleteScraper` | `parsera.api.extractor.deleteScraper` | `destructive` | Delete an extractor scraper |
| `extractor.extract` | `parsera.api.extractor.extract` | `write` | Extract structured data from a URL with the LLM extractor; each call charges credits |
| `extractor.getScraper` | `parsera.api.extractor.getScraper` | `read` | Read one extractor scraper |
| `extractor.parse` | `parsera.api.extractor.parse` | `write` | Parse data from HTML or text content you already have; each call charges credits |
| `scrapers.getRun` | `parsera.api.scrapers.getRun` | `read` | Read one async scraper run with its progress and results |
| `scrapers.run` | `parsera.api.scrapers.run` | `write` | Run a scraper and wait for results; the API defers past five minutes to a pollable run |
| `scrapers.runAsync` | `parsera.api.scrapers.runAsync` | `write` | Run a scraper asynchronously; answers a run_id to poll |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/parsera

## License

Apache-2.0
