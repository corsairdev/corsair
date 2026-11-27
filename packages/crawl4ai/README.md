# @corsair-dev/crawl4ai

Crawl4AI integration for Corsair: web crawling, both ways: a self-hosted Crawl4AI server (crawl to Markdown, HTML, screenshots and PDFs, JavaScript runs, crawl and LLM jobs, browser pool monitoring) and Crawl4AI Cloud (scrape, search, answer, Google SERP, extract, site scans and crawls, pricing pages, email verification, leads, page watches, 98 site tools, batch jobs, billing), plus job webhooks (66 operations).

## Install

```bash
pnpm add @corsair-dev/crawl4ai
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `cloud.answer` | `crawl4ai.api.cloud.answer` | `read` | Answer a question directly from the web (optionally as JSON matching a schema), with the sources it drew on; experimental |
| `cloud.batch` | `crawl4ai.api.cloud.batch` | `read` | Run one tool over many inputs: as a job (up to 10,000; follow with cloud.jobs.*) or streamed in the call (stream true, up to 50, returned as a list) |
| `cloud.billing.balance` | `crawl4ai.api.cloud.billing.balance` | `read` | Your account's credit balance and this month's plan allowance |
| `cloud.billing.subscribe` | `crawl4ai.api.cloud.billing.subscribe` | `destructive` | Start a monthly plan: returns a Stripe checkout page made for this account (a person pays there) |
| `cloud.billing.topup` | `crawl4ai.api.cloud.billing.topup` | `destructive` | Buy extra credits on a plan, charged to the account's saved card (10 to 1,000 dollars) |
| `cloud.billing.topups` | `crawl4ai.api.cloud.billing.topups` | `read` | Your payments, newest first: top-ups, auto recharges and plan charges, with receipts |
| `cloud.extract` | `crawl4ai.api.cloud.extract` | `read` | Extract typed records from a page (or your own content) by a plain-English instruction and/or a JSON schema |
| `cloud.jobs.cancel` | `crawl4ai.api.cloud.jobs.cancel` | `destructive` | Stop a job; it ends as paused and keeps what it fetched |
| `cloud.jobs.get` | `crawl4ai.api.cloud.jobs.get` | `read` | Get a job's state (pending, running, done, paused), counts and cost; free |
| `cloud.jobs.results` | `crawl4ai.api.cloud.jobs.results` | `read` | Read a job's rows (500 a page, each with seq); page with after = the last seq + 1; free |
| `cloud.jobs.retry` | `crawl4ai.api.cloud.jobs.retry` | `read` | Run a job's failed pages again (billed like the first run) |
| `cloud.lead` | `crawl4ai.api.cloud.lead` | `read` | Find people, companies or industries by filters, or enrich a person or company (email, phone) |
| `cloud.monitors.changes` | `crawl4ai.api.cloud.monitors.changes` | `read` | The feed of new matched changes across your watches |
| `cloud.monitors.delete` | `crawl4ai.api.cloud.monitors.delete` | `destructive` | Stop and delete a page watch |
| `cloud.monitors.events` | `crawl4ai.api.cloud.monitors.events` | `read` | List a watch's checks and matched changes |
| `cloud.monitors.get` | `crawl4ai.api.cloud.monitors.get` | `read` | Get one page watch |
| `cloud.monitors.list` | `crawl4ai.api.cloud.monitors.list` | `read` | List your page watches |
| `cloud.monitors.update` | `crawl4ai.api.cloud.monitors.update` | `write` | Change a page watch (what to watch, how often, who to tell) or pause and resume it |
| `cloud.price` | `crawl4ai.api.cloud.price` | `read` | Read websites' pricing pages: every plan, tier, billing period, add-on, trial and discount, per country, each with the page text it came from |
| `cloud.priceHistory` | `crawl4ai.api.cloud.priceHistory` | `read` | Every price read on a site, newest first (one point per change), up to 1,000; 1 credit |
| `cloud.prices` | `crawl4ai.api.cloud.prices` | `read` | The public price table: credits per tool, the free grants, the plans and their limits |
| `cloud.report` | `crawl4ai.api.cloud.report` | `write` | Send Crawl4AI's team a report about a failed, slow or wrong call (never include keys or personal data); at most 5 an hour |
| `cloud.scan` | `crawl4ai.api.cloud.scan` | `read` | List every URL of a site from its sitemaps and home page links (optionally Common Crawl and the Wayback Machine), without crawling |
| `cloud.scrape` | `crawl4ai.api.cloud.scrape` | `read` | Fetch one page as clean Markdown and/or HTML (cache, then HTTP, then a browser), with optional links, media, metadata and tables |
| `cloud.search` | `crawl4ai.api.cloud.search` | `read` | Web search: ranked results (title, url, snippet), with rich blocks (follow-ups, entity card, news) or the top pages read in full (deep) |
| `cloud.serp` | `crawl4ai.api.cloud.serp` | `read` | Google's results page as data: organic ranks plus every block (AI overview, people also ask, local pack, ads ...), localised to a country or city; beta |
| `cloud.site` | `crawl4ai.api.cloud.site` | `read` | Crawl a site level by level from a start URL into Markdown or HTML, as a job (follow it with cloud.jobs.get and cloud.jobs.results) |
| `cloud.tools.estimate` | `crawl4ai.api.cloud.tools.estimate` | `read` | Price a run before it runs, with the same inputs; free |
| `cloud.tools.get` | `crawl4ai.api.cloud.tools.get` | `read` | Get one tool's full definition: inputs, output columns, cost, examples and status; free |
| `cloud.tools.list` | `crawl4ai.api.cloud.tools.list` | `read` | Find tools in the catalog (11 essentials for any site and site tools for named sites): search with q, or filter by category, source (site), kind, status or essential; free, no credits |
| `cloud.tools.run` | `crawl4ai.api.cloud.tools.run` | `read` | Run any tool by id with its inputs (site tools such as amazon-reviews, youtube-captions, linkedin-profile; read the inputs with cloud.tools.get first); costs credits |
| `cloud.tools.status` | `crawl4ai.api.cloud.tools.status` | `read` | Get a tool's status from its daily check (verified, beta, failing); free |
| `cloud.verify` | `crawl4ai.api.cloud.verify` | `read` | Check whether an email address can receive mail (no mail is sent), a list of up to 1,000, or a domain's mail setup |
| `cloud.watch` | `crawl4ai.api.cloud.watch` | `write` | Watch a page and get told (email, webhook or the changes feed) when the change you describe happens; each check costs credits |
| `server.artifacts.get` | `crawl4ai.api.server.artifacts.get` | `read` | Download an artifact a crawl stored (a screenshot, PDF or MHTML), as a file |
| `server.ask` | `crawl4ai.api.server.ask` | `read` | Search Crawl4AI's own library documentation and code context (for agents writing Crawl4AI code) |
| `server.configDump` | `crawl4ai.api.server.configDump` | `read` | Check a config in its JSON form ({ type: CrawlerRunConfig or BrowserConfig, params }) and get it back with every default the server fills in |
| `server.crawl` | `crawl4ai.api.server.crawl` | `read` | Crawl one or more URLs and wait for the results: Markdown, HTML, links, media, tables, metadata, extracted content, with browser and crawler configs |
| `server.crawlJobs.create` | `crawl4ai.api.server.crawlJobs.create` | `read` | Queue a crawl of one or more URLs with browser and crawler configs; poll server.crawlJobs.get or pass webhook_config |
| `server.crawlJobs.get` | `crawl4ai.api.server.crawlJobs.get` | `read` | Get the state and, once completed, the results of a crawl job |
| `server.crawlStream` | `crawl4ai.api.server.crawlStream` | `read` | Crawl URLs and collect each result as the server streams it (NDJSON, returned as a list) |
| `server.executeJs` | `crawl4ai.api.server.executeJs` | `write` | Run JavaScript snippets in a page (they can click, type and submit) and return the crawl result with each snippet's return value |
| `server.health` | `crawl4ai.api.server.health` | `read` | Check the server is up and get its version |
| `server.hooks` | `crawl4ai.api.server.hooks` | `read` | List the declarative hook actions the server allows, with their parameters |
| `server.html` | `crawl4ai.api.server.html` | `read` | Fetch a page as preprocessed HTML (scripts and styles removed), for schema building |
| `server.llm` | `crawl4ai.api.server.llm` | `read` | Answer a question about a page with the server's configured LLM |
| `server.llmJobs.create` | `crawl4ai.api.server.llmJobs.create` | `read` | Queue an LLM extraction of a page: a question or instruction `q` (and optional JSON schema) answered from the page by the server's configured LLM; poll server.llmJobs.get or pass webhook_config |
| `server.llmJobs.get` | `crawl4ai.api.server.llmJobs.get` | `read` | Get the state and, once completed, the result of an LLM extraction job |
| `server.markdown` | `crawl4ai.api.server.markdown` | `read` | Fetch a page as Markdown, raw or filtered (fit, bm25 with a query, llm with an instruction) |
| `server.mcpSchema` | `crawl4ai.api.server.mcpSchema` | `read` | Get the server's MCP tools and resources as JSON |
| `server.metrics` | `crawl4ai.api.server.metrics` | `read` | Prometheus metrics of the server (returned as text) |
| `server.monitor.browsers` | `crawl4ai.api.server.monitor.browsers` | `read` | List the browsers in the pool (hot, cold, permanent) with their age and use |
| `server.monitor.cleanup` | `crawl4ai.api.server.monitor.cleanup` | `write` | Close idle browsers and free memory now |
| `server.monitor.endpointStats` | `crawl4ai.api.server.monitor.endpointStats` | `read` | Get request counts, latency and errors per endpoint |
| `server.monitor.errorLog` | `crawl4ai.api.server.monitor.errorLog` | `read` | Read the server error log |
| `server.monitor.health` | `crawl4ai.api.server.monitor.health` | `read` | Get the server health: memory, CPU, uptime and the browser pool |
| `server.monitor.janitorLog` | `crawl4ai.api.server.monitor.janitorLog` | `read` | Read the browser-pool janitor log |
| `server.monitor.killBrowser` | `crawl4ai.api.server.monitor.killBrowser` | `destructive` | Kill one browser of the pool by its signature (crawls running in it fail) |
| `server.monitor.requests` | `crawl4ai.api.server.monitor.requests` | `read` | List recent requests to the server, filtered by status |
| `server.monitor.resetStats` | `crawl4ai.api.server.monitor.resetStats` | `destructive` | Reset the server's request statistics (they can't be restored) |
| `server.monitor.restartBrowser` | `crawl4ai.api.server.monitor.restartBrowser` | `write` | Restart one browser of the pool by its signature |
| `server.monitor.timeline` | `crawl4ai.api.server.monitor.timeline` | `read` | Get a metric (memory, requests, browsers) over a time window |
| `server.pdf` | `crawl4ai.api.server.pdf` | `read` | Render a page as a PDF (returned as a file) |
| `server.schema` | `crawl4ai.api.server.schema` | `read` | Get the default BrowserConfig and CrawlerRunConfig as JSON, to start a config from |
| `server.screenshot` | `crawl4ai.api.server.screenshot` | `read` | Take a full-page screenshot of a page (returned as a PNG file) |
| `server.token` | `crawl4ai.api.server.token` | `write` | Get a JWT for an email address (servers with JWT auth on; api_token is the server secret when one is set) |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 1 webhook event. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/crawl4ai

## License

Apache-2.0
