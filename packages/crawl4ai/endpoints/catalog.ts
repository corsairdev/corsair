// Generated with endpoints/operation-types.ts from the server image unclecode/crawl4ai 0.9.6 and crawl4ai.com/llms.txt:
// one entry per operation in crawl4ai-manifest.json. Risk levels follow
// .github/PLUGIN_PR_RULES.md (R8).
import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { crawl4aiSchemaEntry } from './openapi-schema';
import { createCrawl4aiOperation as op } from './operations';

export const crawl4aiEndpointsNested = {
	cloud: {
		answer: op('cloud.answer'),
		batch: op('cloud.batch'),
		billing: {
			balance: op('cloud.billing.balance'),
			subscribe: op('cloud.billing.subscribe'),
			topup: op('cloud.billing.topup'),
			topups: op('cloud.billing.topups'),
		},
		extract: op('cloud.extract'),
		jobs: {
			cancel: op('cloud.jobs.cancel'),
			get: op('cloud.jobs.get'),
			results: op('cloud.jobs.results'),
			retry: op('cloud.jobs.retry'),
		},
		lead: op('cloud.lead'),
		monitors: {
			changes: op('cloud.monitors.changes'),
			delete: op('cloud.monitors.delete'),
			events: op('cloud.monitors.events'),
			get: op('cloud.monitors.get'),
			list: op('cloud.monitors.list'),
			update: op('cloud.monitors.update'),
		},
		price: op('cloud.price'),
		priceHistory: op('cloud.priceHistory'),
		prices: op('cloud.prices'),
		report: op('cloud.report'),
		scan: op('cloud.scan'),
		scrape: op('cloud.scrape'),
		search: op('cloud.search'),
		serp: op('cloud.serp'),
		site: op('cloud.site'),
		tools: {
			estimate: op('cloud.tools.estimate'),
			get: op('cloud.tools.get'),
			list: op('cloud.tools.list'),
			run: op('cloud.tools.run'),
			status: op('cloud.tools.status'),
		},
		verify: op('cloud.verify'),
		watch: op('cloud.watch'),
	},
	server: {
		artifacts: {
			get: op('server.artifacts.get'),
		},
		ask: op('server.ask'),
		configDump: op('server.configDump'),
		crawl: op('server.crawl'),
		crawlJobs: {
			create: op('server.crawlJobs.create'),
			get: op('server.crawlJobs.get'),
		},
		crawlStream: op('server.crawlStream'),
		executeJs: op('server.executeJs'),
		health: op('server.health'),
		hooks: op('server.hooks'),
		html: op('server.html'),
		llm: op('server.llm'),
		llmJobs: {
			create: op('server.llmJobs.create'),
			get: op('server.llmJobs.get'),
		},
		markdown: op('server.markdown'),
		mcpSchema: op('server.mcpSchema'),
		metrics: op('server.metrics'),
		monitor: {
			browsers: op('server.monitor.browsers'),
			cleanup: op('server.monitor.cleanup'),
			endpointStats: op('server.monitor.endpointStats'),
			errorLog: op('server.monitor.errorLog'),
			health: op('server.monitor.health'),
			janitorLog: op('server.monitor.janitorLog'),
			killBrowser: op('server.monitor.killBrowser'),
			requests: op('server.monitor.requests'),
			resetStats: op('server.monitor.resetStats'),
			restartBrowser: op('server.monitor.restartBrowser'),
			timeline: op('server.monitor.timeline'),
		},
		pdf: op('server.pdf'),
		schema: op('server.schema'),
		screenshot: op('server.screenshot'),
		token: op('server.token'),
	},
} as const;

export const crawl4aiEndpointSchemas = {
	'cloud.answer': crawl4aiSchemaEntry('cloud.answer'),
	'cloud.batch': crawl4aiSchemaEntry('cloud.batch'),
	'cloud.billing.balance': crawl4aiSchemaEntry('cloud.billing.balance'),
	'cloud.billing.subscribe': crawl4aiSchemaEntry('cloud.billing.subscribe'),
	'cloud.billing.topup': crawl4aiSchemaEntry('cloud.billing.topup'),
	'cloud.billing.topups': crawl4aiSchemaEntry('cloud.billing.topups'),
	'cloud.extract': crawl4aiSchemaEntry('cloud.extract'),
	'cloud.jobs.cancel': crawl4aiSchemaEntry('cloud.jobs.cancel'),
	'cloud.jobs.get': crawl4aiSchemaEntry('cloud.jobs.get'),
	'cloud.jobs.results': crawl4aiSchemaEntry('cloud.jobs.results'),
	'cloud.jobs.retry': crawl4aiSchemaEntry('cloud.jobs.retry'),
	'cloud.lead': crawl4aiSchemaEntry('cloud.lead'),
	'cloud.monitors.changes': crawl4aiSchemaEntry('cloud.monitors.changes'),
	'cloud.monitors.delete': crawl4aiSchemaEntry('cloud.monitors.delete'),
	'cloud.monitors.events': crawl4aiSchemaEntry('cloud.monitors.events'),
	'cloud.monitors.get': crawl4aiSchemaEntry('cloud.monitors.get'),
	'cloud.monitors.list': crawl4aiSchemaEntry('cloud.monitors.list'),
	'cloud.monitors.update': crawl4aiSchemaEntry('cloud.monitors.update'),
	'cloud.price': crawl4aiSchemaEntry('cloud.price'),
	'cloud.priceHistory': crawl4aiSchemaEntry('cloud.priceHistory'),
	'cloud.prices': crawl4aiSchemaEntry('cloud.prices'),
	'cloud.report': crawl4aiSchemaEntry('cloud.report'),
	'cloud.scan': crawl4aiSchemaEntry('cloud.scan'),
	'cloud.scrape': crawl4aiSchemaEntry('cloud.scrape'),
	'cloud.search': crawl4aiSchemaEntry('cloud.search'),
	'cloud.serp': crawl4aiSchemaEntry('cloud.serp'),
	'cloud.site': crawl4aiSchemaEntry('cloud.site'),
	'cloud.tools.estimate': crawl4aiSchemaEntry('cloud.tools.estimate'),
	'cloud.tools.get': crawl4aiSchemaEntry('cloud.tools.get'),
	'cloud.tools.list': crawl4aiSchemaEntry('cloud.tools.list'),
	'cloud.tools.run': crawl4aiSchemaEntry('cloud.tools.run'),
	'cloud.tools.status': crawl4aiSchemaEntry('cloud.tools.status'),
	'cloud.verify': crawl4aiSchemaEntry('cloud.verify'),
	'cloud.watch': crawl4aiSchemaEntry('cloud.watch'),
	'server.artifacts.get': crawl4aiSchemaEntry('server.artifacts.get'),
	'server.ask': crawl4aiSchemaEntry('server.ask'),
	'server.configDump': crawl4aiSchemaEntry('server.configDump'),
	'server.crawl': crawl4aiSchemaEntry('server.crawl'),
	'server.crawlJobs.create': crawl4aiSchemaEntry('server.crawlJobs.create'),
	'server.crawlJobs.get': crawl4aiSchemaEntry('server.crawlJobs.get'),
	'server.crawlStream': crawl4aiSchemaEntry('server.crawlStream'),
	'server.executeJs': crawl4aiSchemaEntry('server.executeJs'),
	'server.health': crawl4aiSchemaEntry('server.health'),
	'server.hooks': crawl4aiSchemaEntry('server.hooks'),
	'server.html': crawl4aiSchemaEntry('server.html'),
	'server.llm': crawl4aiSchemaEntry('server.llm'),
	'server.llmJobs.create': crawl4aiSchemaEntry('server.llmJobs.create'),
	'server.llmJobs.get': crawl4aiSchemaEntry('server.llmJobs.get'),
	'server.markdown': crawl4aiSchemaEntry('server.markdown'),
	'server.mcpSchema': crawl4aiSchemaEntry('server.mcpSchema'),
	'server.metrics': crawl4aiSchemaEntry('server.metrics'),
	'server.monitor.browsers': crawl4aiSchemaEntry('server.monitor.browsers'),
	'server.monitor.cleanup': crawl4aiSchemaEntry('server.monitor.cleanup'),
	'server.monitor.endpointStats': crawl4aiSchemaEntry(
		'server.monitor.endpointStats',
	),
	'server.monitor.errorLog': crawl4aiSchemaEntry('server.monitor.errorLog'),
	'server.monitor.health': crawl4aiSchemaEntry('server.monitor.health'),
	'server.monitor.janitorLog': crawl4aiSchemaEntry('server.monitor.janitorLog'),
	'server.monitor.killBrowser': crawl4aiSchemaEntry(
		'server.monitor.killBrowser',
	),
	'server.monitor.requests': crawl4aiSchemaEntry('server.monitor.requests'),
	'server.monitor.resetStats': crawl4aiSchemaEntry('server.monitor.resetStats'),
	'server.monitor.restartBrowser': crawl4aiSchemaEntry(
		'server.monitor.restartBrowser',
	),
	'server.monitor.timeline': crawl4aiSchemaEntry('server.monitor.timeline'),
	'server.pdf': crawl4aiSchemaEntry('server.pdf'),
	'server.schema': crawl4aiSchemaEntry('server.schema'),
	'server.screenshot': crawl4aiSchemaEntry('server.screenshot'),
	'server.token': crawl4aiSchemaEntry('server.token'),
} satisfies RequiredPluginEndpointSchemas<typeof crawl4aiEndpointsNested>;

export const crawl4aiEndpointMeta = {
	'cloud.answer': {
		riskLevel: 'read',
		description:
			'Answer a question directly from the web (optionally as JSON matching a schema), with the sources it drew on; experimental',
	},
	'cloud.batch': {
		riskLevel: 'read',
		description:
			'Run one tool over many inputs: as a job (up to 10,000; follow with cloud.jobs.*) or streamed in the call (stream true, up to 50, returned as a list)',
	},
	'cloud.billing.balance': {
		riskLevel: 'read',
		description:
			"Your account's credit balance and this month's plan allowance",
	},
	'cloud.billing.subscribe': {
		riskLevel: 'destructive',
		description:
			'Start a monthly plan: returns a Stripe checkout page made for this account (a person pays there)',
	},
	'cloud.billing.topup': {
		riskLevel: 'destructive',
		description:
			"Buy extra credits on a plan, charged to the account's saved card (10 to 1,000 dollars)",
	},
	'cloud.billing.topups': {
		riskLevel: 'read',
		description:
			'Your payments, newest first: top-ups, auto recharges and plan charges, with receipts',
	},
	'cloud.extract': {
		riskLevel: 'read',
		description:
			'Extract typed records from a page (or your own content) by a plain-English instruction and/or a JSON schema',
	},
	'cloud.jobs.cancel': {
		riskLevel: 'destructive',
		description: 'Stop a job; it ends as paused and keeps what it fetched',
	},
	'cloud.jobs.get': {
		riskLevel: 'read',
		description:
			"Get a job's state (pending, running, done, paused), counts and cost; free",
	},
	'cloud.jobs.results': {
		riskLevel: 'read',
		description:
			"Read a job's rows (500 a page, each with seq); page with after = the last seq + 1; free",
	},
	'cloud.jobs.retry': {
		riskLevel: 'read',
		description: "Run a job's failed pages again (billed like the first run)",
	},
	'cloud.lead': {
		riskLevel: 'read',
		description:
			'Find people, companies or industries by filters, or enrich a person or company (email, phone)',
	},
	'cloud.monitors.changes': {
		riskLevel: 'read',
		description: 'The feed of new matched changes across your watches',
	},
	'cloud.monitors.delete': {
		riskLevel: 'destructive',
		description: 'Stop and delete a page watch',
	},
	'cloud.monitors.events': {
		riskLevel: 'read',
		description: "List a watch's checks and matched changes",
	},
	'cloud.monitors.get': {
		riskLevel: 'read',
		description: 'Get one page watch',
	},
	'cloud.monitors.list': {
		riskLevel: 'read',
		description: 'List your page watches',
	},
	'cloud.monitors.update': {
		riskLevel: 'write',
		description:
			'Change a page watch (what to watch, how often, who to tell) or pause and resume it',
	},
	'cloud.price': {
		riskLevel: 'read',
		description:
			"Read websites' pricing pages: every plan, tier, billing period, add-on, trial and discount, per country, each with the page text it came from",
	},
	'cloud.priceHistory': {
		riskLevel: 'read',
		description:
			'Every price read on a site, newest first (one point per change), up to 1,000; 1 credit',
	},
	'cloud.prices': {
		riskLevel: 'read',
		description:
			'The public price table: credits per tool, the free grants, the plans and their limits',
	},
	'cloud.report': {
		riskLevel: 'write',
		description:
			"Send Crawl4AI's team a report about a failed, slow or wrong call (never include keys or personal data); at most 5 an hour",
	},
	'cloud.scan': {
		riskLevel: 'read',
		description:
			'List every URL of a site from its sitemaps and home page links (optionally Common Crawl and the Wayback Machine), without crawling',
	},
	'cloud.scrape': {
		riskLevel: 'read',
		description:
			'Fetch one page as clean Markdown and/or HTML (cache, then HTTP, then a browser), with optional links, media, metadata and tables',
	},
	'cloud.search': {
		riskLevel: 'read',
		description:
			'Web search: ranked results (title, url, snippet), with rich blocks (follow-ups, entity card, news) or the top pages read in full (deep)',
	},
	'cloud.serp': {
		riskLevel: 'read',
		description:
			"Google's results page as data: organic ranks plus every block (AI overview, people also ask, local pack, ads ...), localised to a country or city; beta",
	},
	'cloud.site': {
		riskLevel: 'read',
		description:
			'Crawl a site level by level from a start URL into Markdown or HTML, as a job (follow it with cloud.jobs.get and cloud.jobs.results)',
	},
	'cloud.tools.estimate': {
		riskLevel: 'read',
		description: 'Price a run before it runs, with the same inputs; free',
	},
	'cloud.tools.get': {
		riskLevel: 'read',
		description:
			"Get one tool's full definition: inputs, output columns, cost, examples and status; free",
	},
	'cloud.tools.list': {
		riskLevel: 'read',
		description:
			'Find tools in the catalog (11 essentials for any site and site tools for named sites): search with q, or filter by category, source (site), kind, status or essential; free, no credits',
	},
	'cloud.tools.run': {
		riskLevel: 'read',
		description:
			'Run any tool by id with its inputs (site tools such as amazon-reviews, youtube-captions, linkedin-profile; read the inputs with cloud.tools.get first); costs credits',
	},
	'cloud.tools.status': {
		riskLevel: 'read',
		description:
			"Get a tool's status from its daily check (verified, beta, failing); free",
	},
	'cloud.verify': {
		riskLevel: 'read',
		description:
			"Check whether an email address can receive mail (no mail is sent), a list of up to 1,000, or a domain's mail setup",
	},
	'cloud.watch': {
		riskLevel: 'write',
		description:
			'Watch a page and get told (email, webhook or the changes feed) when the change you describe happens; each check costs credits',
	},
	'server.artifacts.get': {
		riskLevel: 'read',
		description:
			'Download an artifact a crawl stored (a screenshot, PDF or MHTML), as a file',
	},
	'server.ask': {
		riskLevel: 'read',
		description:
			"Search Crawl4AI's own library documentation and code context (for agents writing Crawl4AI code)",
	},
	'server.configDump': {
		riskLevel: 'read',
		description:
			'Check a config in its JSON form ({ type: CrawlerRunConfig or BrowserConfig, params }) and get it back with every default the server fills in',
	},
	'server.crawl': {
		riskLevel: 'read',
		description:
			'Crawl one or more URLs and wait for the results: Markdown, HTML, links, media, tables, metadata, extracted content, with browser and crawler configs',
	},
	'server.crawlJobs.create': {
		riskLevel: 'read',
		description:
			'Queue a crawl of one or more URLs with browser and crawler configs; poll server.crawlJobs.get or pass webhook_config',
	},
	'server.crawlJobs.get': {
		riskLevel: 'read',
		description:
			'Get the state and, once completed, the results of a crawl job',
	},
	'server.crawlStream': {
		riskLevel: 'read',
		description:
			'Crawl URLs and collect each result as the server streams it (NDJSON, returned as a list)',
	},
	'server.executeJs': {
		riskLevel: 'write',
		description:
			"Run JavaScript snippets in a page (they can click, type and submit) and return the crawl result with each snippet's return value",
	},
	'server.health': {
		riskLevel: 'read',
		description: 'Check the server is up and get its version',
	},
	'server.hooks': {
		riskLevel: 'read',
		description:
			'List the declarative hook actions the server allows, with their parameters',
	},
	'server.html': {
		riskLevel: 'read',
		description:
			'Fetch a page as preprocessed HTML (scripts and styles removed), for schema building',
	},
	'server.llm': {
		riskLevel: 'read',
		description:
			"Answer a question about a page with the server's configured LLM",
	},
	'server.llmJobs.create': {
		riskLevel: 'read',
		description:
			"Queue an LLM extraction of a page: a question or instruction `q` (and optional JSON schema) answered from the page by the server's configured LLM; poll server.llmJobs.get or pass webhook_config",
	},
	'server.llmJobs.get': {
		riskLevel: 'read',
		description:
			'Get the state and, once completed, the result of an LLM extraction job',
	},
	'server.markdown': {
		riskLevel: 'read',
		description:
			'Fetch a page as Markdown, raw or filtered (fit, bm25 with a query, llm with an instruction)',
	},
	'server.mcpSchema': {
		riskLevel: 'read',
		description: "Get the server's MCP tools and resources as JSON",
	},
	'server.metrics': {
		riskLevel: 'read',
		description: 'Prometheus metrics of the server (returned as text)',
	},
	'server.monitor.browsers': {
		riskLevel: 'read',
		description:
			'List the browsers in the pool (hot, cold, permanent) with their age and use',
	},
	'server.monitor.cleanup': {
		riskLevel: 'write',
		description: 'Close idle browsers and free memory now',
	},
	'server.monitor.endpointStats': {
		riskLevel: 'read',
		description: 'Get request counts, latency and errors per endpoint',
	},
	'server.monitor.errorLog': {
		riskLevel: 'read',
		description: 'Read the server error log',
	},
	'server.monitor.health': {
		riskLevel: 'read',
		description:
			'Get the server health: memory, CPU, uptime and the browser pool',
	},
	'server.monitor.janitorLog': {
		riskLevel: 'read',
		description: 'Read the browser-pool janitor log',
	},
	'server.monitor.killBrowser': {
		riskLevel: 'destructive',
		description:
			'Kill one browser of the pool by its signature (crawls running in it fail)',
	},
	'server.monitor.requests': {
		riskLevel: 'read',
		description: 'List recent requests to the server, filtered by status',
	},
	'server.monitor.resetStats': {
		riskLevel: 'destructive',
		description:
			"Reset the server's request statistics (they can't be restored)",
	},
	'server.monitor.restartBrowser': {
		riskLevel: 'write',
		description: 'Restart one browser of the pool by its signature',
	},
	'server.monitor.timeline': {
		riskLevel: 'read',
		description: 'Get a metric (memory, requests, browsers) over a time window',
	},
	'server.pdf': {
		riskLevel: 'read',
		description: 'Render a page as a PDF (returned as a file)',
	},
	'server.schema': {
		riskLevel: 'read',
		description:
			'Get the default BrowserConfig and CrawlerRunConfig as JSON, to start a config from',
	},
	'server.screenshot': {
		riskLevel: 'read',
		description:
			'Take a full-page screenshot of a page (returned as a PNG file)',
	},
	'server.token': {
		riskLevel: 'write',
		description:
			'Get a JWT for an email address (servers with JWT auth on; api_token is the server secret when one is set)',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof crawl4aiEndpointsNested>;
