// Generated from the server image unclecode/crawl4ai 0.9.6 and crawl4ai.com/llms.txt
// (fetched 2026-11-27); crawl4ai-manifest.json is the same contract as JSON.
// Inputs are the parameters and body fields in one object. Outputs
// make every field optional and nullable and keep unknown fields, matching how
// the zod output schemas parse. Regenerate rather than edit.

import type { FileOutput } from 'corsair/http';

export type Crawl4aiJsonValue =
	| null
	| boolean
	| number
	| string
	| Crawl4aiJsonValue[]
	| { [key: string]: Crawl4aiJsonValue | undefined };

export const CRAWL4AI_OPERATION_IDS = [
	'cloud.answer',
	'cloud.batch',
	'cloud.billing.balance',
	'cloud.billing.subscribe',
	'cloud.billing.topup',
	'cloud.billing.topups',
	'cloud.extract',
	'cloud.jobs.cancel',
	'cloud.jobs.get',
	'cloud.jobs.results',
	'cloud.jobs.retry',
	'cloud.lead',
	'cloud.monitors.changes',
	'cloud.monitors.delete',
	'cloud.monitors.events',
	'cloud.monitors.get',
	'cloud.monitors.list',
	'cloud.monitors.update',
	'cloud.price',
	'cloud.priceHistory',
	'cloud.prices',
	'cloud.report',
	'cloud.scan',
	'cloud.scrape',
	'cloud.search',
	'cloud.serp',
	'cloud.site',
	'cloud.tools.estimate',
	'cloud.tools.get',
	'cloud.tools.list',
	'cloud.tools.run',
	'cloud.tools.status',
	'cloud.verify',
	'cloud.watch',
	'server.artifacts.get',
	'server.ask',
	'server.configDump',
	'server.crawl',
	'server.crawlJobs.create',
	'server.crawlJobs.get',
	'server.crawlStream',
	'server.executeJs',
	'server.health',
	'server.hooks',
	'server.html',
	'server.llm',
	'server.llmJobs.create',
	'server.llmJobs.get',
	'server.markdown',
	'server.mcpSchema',
	'server.metrics',
	'server.monitor.browsers',
	'server.monitor.cleanup',
	'server.monitor.endpointStats',
	'server.monitor.errorLog',
	'server.monitor.health',
	'server.monitor.janitorLog',
	'server.monitor.killBrowser',
	'server.monitor.requests',
	'server.monitor.resetStats',
	'server.monitor.restartBrowser',
	'server.monitor.timeline',
	'server.pdf',
	'server.schema',
	'server.screenshot',
	'server.token',
] as const;

export type Crawl4aiOperationId = (typeof CRAWL4AI_OPERATION_IDS)[number];

export type Crawl4aiWebhookPayloads = {
	jobFinished: {
		task_id?: string | null;
		/** crawl or llm_extraction. */
		task_type?: string | null;
		/** completed or failed. */
		status?: string | null;
		timestamp?: string | null;
		urls?: Array<string> | null;
		/** Why it failed. */
		error?: string | null;
		/** The results, when webhook_data_in_payload was true. */
		data?: Crawl4aiJsonValue | null;
		[key: string]: unknown;
	};
};

export type Crawl4aiOperationInputs = {
	'cloud.answer': {
		/** The question or a whole prompt (max 4,000 characters). */
		q: string;
		/** A JSON Schema the answer must match. */
		schema?: Record<string, Crawl4aiJsonValue>;
		/** Read a couple of pages when needed (default true); false = only a readily available answer. */
		deep?: boolean;
	};
	'cloud.batch': {
		/** The tool id, e.g. scrape. */
		tool: string;
		/** One input per page; the first one's options apply to all. */
		inputs: Array<Record<string, Crawl4aiJsonValue>>;
		/** Answer in the call, one result per line (up to 50). */
		stream?: boolean;
		/** Send the same key again on a retry to get the first job back, billed once. */
		idempotency_key?: string;
	};
	'cloud.billing.balance': Record<string, never>;
	'cloud.billing.subscribe': {
		/** The plan id: starter, builder or scale. */
		plan: string;
	};
	'cloud.billing.topup': {
		/** Dollars, 10 to 1000. */
		amount: number;
	};
	'cloud.billing.topups': {
		/** Payments a page. */
		limit?: number;
		/** next_cursor from the last page. */
		cursor?: string;
	};
	'cloud.extract': {
		/** The page to read. */
		url?: string;
		/** Your own text, Markdown or HTML instead of a URL. */
		content?: string;
		/** What to pull out, in plain English. */
		instruction?: string;
		/** JSON Schema each record must match. */
		schema?: Record<string, Crawl4aiJsonValue>;
		/** A sample of the shape you want. */
		example?: Record<string, Crawl4aiJsonValue>;
	};
	'cloud.jobs.cancel': {
		/** The job id. */
		job_id: string;
	};
	'cloud.jobs.get': {
		/** The job id. */
		job_id: string;
		/** 1 for per-URL detail. */
		full?: 1;
	};
	'cloud.jobs.results': {
		/** The job id. */
		job_id: string;
		/** Rows already read (the last seq + 1). */
		after?: number;
		/** Rows a page (1 to 500). */
		limit?: number;
	};
	'cloud.jobs.retry': {
		/** The job id. */
		job_id: string;
	};
	'cloud.lead': {
		/** What to find: people, companies, industries, enrich, email, phone, company. */
		find?: string;
		/** Filters, e.g. { company: { industry, country } }. */
		where?: Record<string, Crawl4aiJsonValue>;
	};
	'cloud.monitors.changes': Record<string, never>;
	'cloud.monitors.delete': {
		/** The watch id. */
		id: string;
	};
	'cloud.monitors.events': {
		/** The watch id. */
		id: string;
	};
	'cloud.monitors.get': {
		/** The watch id. */
		id: string;
	};
	'cloud.monitors.list': Record<string, never>;
	'cloud.monitors.update': {
		/** The watch id. */
		id: string;
		/** The fields to change, as cloud.watch takes them, e.g. { every, paused, notify }. */
		fields?: Record<string, Crawl4aiJsonValue>;
	};
	'cloud.price': {
		/** Domains (hubspot.com) or pricing page URLs; at most 20. */
		sites: Array<string>;
		/** Two-letter country, or a list of up to 5 (sites x countries at most 20). */
		country?: Crawl4aiJsonValue;
	};
	'cloud.priceHistory': {
		/** The site: hubspot.com. */
		domain: string;
		/** Two-letter country. */
		country?: string;
	};
	'cloud.prices': Record<string, never>;
	'cloud.report': {
		/** agent */
		kind?: 'agent';
		/** failed, slow, wrong, could-be-better or ux. */
		category: 'failed' | 'slow' | 'wrong' | 'could-be-better' | 'ux';
		/** One line. */
		title: string;
		/** What you tried, what came back, what you expected. */
		note?: string;
		/** { receipt: <request_id> } */
		context?: Record<string, Crawl4aiJsonValue>;
	};
	'cloud.scan': {
		/** The site's host: docs.crawl4ai.com. */
		domain: string;
		/** Also ask Common Crawl and the Wayback Machine (20 s or more longer). */
		extended?: boolean;
		/** Most URLs returned (default 5000, max 50000). */
		max_urls?: number;
		/** Keep only matching URLs: a path prefix (/docs) or a glob (*\/blog/*). */
		include?: string;
		/** Also list subdomains. */
		include_subdomains?: boolean;
		/** Scan again even when cached (7 days). */
		bypass_cache?: boolean;
	};
	'cloud.scrape': {
		/** A public http(s) URL. */
		url: string;
		/** both (default), md or html. */
		format?: 'both' | 'md' | 'html';
		/** standard (default) or extra: rented residential addresses when ours are refused; a page served that way costs 4x. */
		proxy?: 'standard' | 'extra';
		/** Two-letter country to fetch from, e.g. us, gb. */
		country?: string;
		/** Also return page structure: true, a list (links, media, metadata, tables) or an object. */
		parse?: Crawl4aiJsonValue;
		/** auto (default), browser-light or browser. */
		engine?: 'auto' | 'browser-light' | 'browser';
		/** Fetch fresh, never from the cache. */
		bypass_cache?: boolean;
		/** Answer within this many seconds (5 to 120); set it a little below your client timeout. */
		timeout?: number;
		/** Skip the cache and fetch fresh (the Crawl4AI-Fresh header). */
		fresh?: boolean;
	};
	'cloud.search': {
		/** The query (max 512 characters). */
		q: string;
		/** Also return follow-up questions, related queries, an entity card, videos and news. */
		rich?: boolean;
		/** Also read the top 10 result pages into each result's markdown (0.1 credit a page). */
		deep?: boolean;
	};
	'cloud.serp': {
		/** The query (max 512 characters). */
		q: string;
		/** Two letters, default us. */
		country?: string;
		/** Google language code, default en. */
		language?: string;
		/** A city or region: "Austin, TX". */
		location?: string;
		/** Results asked: a multiple of 10 up to 100 (10 per Google page, 1 credit each). */
		num?: number;
		/** Page over num (1 to 30). */
		page?: number;
		/** Google's time filter. */
		time?: 'hour' | 'day' | 'week' | 'month' | 'year';
		/** Skip the cache. */
		fresh?: boolean;
	};
	'cloud.site': {
		/** The start page. */
		url: string;
		/** Levels of links below the start page (default 2, max 5). */
		depth?: number;
		/** Most pages fetched (default 100, max 500). */
		max_pages?: number;
		/** Follow only matching URLs. */
		include?: string;
		/** Never follow matching URLs. */
		exclude?: string;
		/** Also follow subdomains. */
		include_subdomains?: boolean;
		/** md (default), html or none. */
		content?: 'md' | 'html' | 'none';
	};
	'cloud.tools.estimate': {
		/** The tool id. */
		id: string;
		/** The tool's inputs. */
		input?: Record<string, Crawl4aiJsonValue>;
	};
	'cloud.tools.get': {
		/** The tool id, e.g. scrape, youtube-captions. */
		id: string;
	};
	'cloud.tools.list': {
		/** Words or a sentence: "video transcript", "amazon reviews". */
		q?: string;
		/** A category id: video, jobs, shopping, social, people-companies ... */
		category?: string;
		/** A site id: youtube, amazon, linkedin, google-maps, x ... */
		source?: string;
		/** pages, search, people or sites. */
		kind?: 'pages' | 'search' | 'people' | 'sites';
		/** verified, beta or failing. */
		status?: 'verified' | 'beta' | 'failing';
		/** Only the 11 essentials. */
		essential?: boolean;
		/** Tools a page (default 50, at most 200). */
		limit?: number;
		/** next_cursor from the last page. */
		cursor?: string;
	};
	'cloud.tools.run': {
		/** The tool id. */
		id: string;
		/** The tool's inputs, as cloud.tools.get lists them. */
		input?: Record<string, Crawl4aiJsonValue>;
		/** Skip the cache and fetch fresh (the Crawl4AI-Fresh header). */
		fresh?: boolean;
	};
	'cloud.tools.status': {
		/** The tool id. */
		id: string;
	};
	'cloud.verify': {
		/** email (default), list or domain. */
		check?: 'email' | 'list' | 'domain';
		/** One address (check email). */
		email?: string;
		/** Up to 1,000 addresses (check list). */
		emails?: Array<string>;
		/** A domain (check domain). */
		domain?: string;
	};
	'cloud.watch': {
		/** The page to watch. */
		url: string;
		/** The change you care about, in plain words. */
		watch?: string;
		/** How often to check (default auto). */
		every?: string;
		/** Email to tell. */
		email?: string;
		/** URL to POST changes to. */
		webhook?: string;
		/** Signs the webhook. */
		secret?: string;
		/** When to tell. */
		trigger?: Crawl4aiJsonValue;
		/** Where to check from. */
		region?: string;
		/** A name for the watch. */
		name?: string;
	};
	'server.artifacts.get': {
		artifact_id: string;
	};
	'server.ask': {
		context_type?: string;
		/** search query to filter chunks */
		query?: string | null;
		/** min score as fraction of max_score */
		score_ratio?: number;
		/** absolute cap on returned chunks */
		max_results?: number;
	};
	'server.configDump': {
		/** Which config. */
		type: 'CrawlerRunConfig' | 'BrowserConfig';
		/** The config fields, e.g. { word_count_threshold: 10 }. */
		params?: Record<string, Crawl4aiJsonValue>;
	};
	'server.crawl': {
		urls: Array<string>;
		browser_config?: Record<string, Crawl4aiJsonValue> | null;
		crawler_config?: Record<string, Crawl4aiJsonValue> | null;
		/** List of per-URL CrawlerRunConfig dicts for arun_many(). When provided, each config can include a 'url_matcher' pattern to match against specific URLs. Takes precedence over crawler_config. */
		crawler_configs?: Array<Record<string, Crawl4aiJsonValue>> | null;
		/** Optional user-provided hook functions */
		hooks?: {
			/** Declarative hook specs (action + params), max 10 */
			hooks?: Array<{
				/** One of the registered hook actions */
				action: string;
				/** Action parameters */
				params?: Record<string, Crawl4aiJsonValue>;
			}>;
			/** Timeout in seconds for each hook execution */
			timeout?: number;
			/** REMOVED in 0.9.0: inline hook code is accepted for compatibility but never executed */
			code?: Crawl4aiJsonValue | null;
		} | null;
	};
	'server.crawlJobs.create': {
		urls: Array<string>;
		browser_config?: Record<string, Crawl4aiJsonValue>;
		crawler_config?: Record<string, Crawl4aiJsonValue>;
		/** Configuration for webhook notifications. */
		webhook_config?: {
			webhook_url: string;
			webhook_data_in_payload?: boolean;
			webhook_headers?: Record<string, string> | null;
		} | null;
	};
	'server.crawlJobs.get': {
		task_id: string;
	};
	'server.crawlStream': {
		urls: Array<string>;
		browser_config?: Record<string, Crawl4aiJsonValue> | null;
		crawler_config?: Record<string, Crawl4aiJsonValue> | null;
		/** List of per-URL CrawlerRunConfig dicts for arun_many(). When provided, each config can include a 'url_matcher' pattern to match against specific URLs. Takes precedence over crawler_config. */
		crawler_configs?: Array<Record<string, Crawl4aiJsonValue>> | null;
		/** Optional user-provided hook functions */
		hooks?: {
			/** Declarative hook specs (action + params), max 10 */
			hooks?: Array<{
				/** One of the registered hook actions */
				action: string;
				/** Action parameters */
				params?: Record<string, Crawl4aiJsonValue>;
			}>;
			/** Timeout in seconds for each hook execution */
			timeout?: number;
			/** REMOVED in 0.9.0: inline hook code is accepted for compatibility but never executed */
			code?: Crawl4aiJsonValue | null;
		} | null;
	};
	'server.executeJs': {
		url: string;
		/** List of separated JavaScript snippets to execute */
		scripts: Array<string>;
	};
	'server.health': Record<string, never>;
	'server.hooks': Record<string, never>;
	'server.html': {
		url: string;
	};
	'server.llm': {
		/** The page URL (https://...). */
		url: string;
		q: string;
		/** LLM provider override, e.g. 'openai/gpt-6-luna' */
		provider?: string | null;
		/** LLM temperature override */
		temperature?: number | null;
	};
	'server.llmJobs.create': {
		url: string;
		q: string;
		schema?: string | null;
		cache?: boolean;
		provider?: string | null;
		/** Configuration for webhook notifications. */
		webhook_config?: {
			webhook_url: string;
			webhook_data_in_payload?: boolean;
			webhook_headers?: Record<string, string> | null;
		} | null;
		temperature?: number | null;
	};
	'server.llmJobs.get': {
		task_id: string;
	};
	'server.markdown': {
		/** Absolute http/https URL to fetch */
		url: string;
		f?: 'raw' | 'fit' | 'bm25' | 'llm';
		/** Query string used by BM25/LLM filters */
		q?: string | null;
		/** Cache‑bust / revision counter */
		c?: string | null;
		/** LLM provider override (e.g., 'anthropic/claude-3-opus') */
		provider?: string | null;
		/** LLM temperature override (0.0-2.0) */
		temperature?: number | null;
	};
	'server.mcpSchema': Record<string, never>;
	'server.metrics': Record<string, never>;
	'server.monitor.browsers': Record<string, never>;
	'server.monitor.cleanup': Record<string, never>;
	'server.monitor.endpointStats': Record<string, never>;
	'server.monitor.errorLog': {
		limit?: number;
	};
	'server.monitor.health': Record<string, never>;
	'server.monitor.janitorLog': {
		limit?: number;
	};
	'server.monitor.killBrowser': {
		sig: string;
	};
	'server.monitor.requests': {
		status?: string;
		limit?: number;
	};
	'server.monitor.resetStats': Record<string, never>;
	'server.monitor.restartBrowser': {
		sig: string;
	};
	'server.monitor.timeline': {
		metric?: string;
		window?: string;
	};
	'server.pdf': {
		url: string;
		/** REMOVED in 0.9.0 and ignored - no file is written. Results are stored server-side; fetch via GET /artifacts/{artifact_id}. */
		output_path?: string | null;
	};
	'server.schema': Record<string, never>;
	'server.screenshot': {
		url: string;
		screenshot_wait_for?: number | null;
		wait_for_images?: boolean | null;
		/** REMOVED in 0.9.0 and ignored - no file is written. Results are stored server-side; fetch via GET /artifacts/{artifact_id}. */
		output_path?: string | null;
	};
	'server.token': {
		email: string;
		api_token?: string | null;
	};
};

export type Crawl4aiOperationOutputs = {
	'cloud.answer': {
		tool?: string | number | null;
		request_id?: string | number | null;
		took_ms?: number | null;
		usage?: {
			/** Credits the run cost. */
			credits?: number | null;
			[key: string]: unknown;
		} | null;
		/** The records: search results, extracted items, URLs, prices, site tool rows. */
		rows?: Array<Record<string, Crawl4aiJsonValue>> | null;
		/** The rest of the answer: scrape markdown, an answer, a job id and poll path, a watch. */
		data?: Record<string, Crawl4aiJsonValue> | null;
		[key: string]: unknown;
	};
	'cloud.batch': Record<string, Crawl4aiJsonValue>;
	'cloud.billing.balance': Record<string, Crawl4aiJsonValue>;
	'cloud.billing.subscribe': Record<string, Crawl4aiJsonValue>;
	'cloud.billing.topup': Record<string, Crawl4aiJsonValue>;
	'cloud.billing.topups': {
		topups?: Array<{
			/** When it was paid. */
			at?: string | number | null;
			/** Dollars paid. */
			usd?: number | null;
			/** Credits it added. */
			credits?: number | null;
			/** topup, auto_recharge or plan. */
			kind?: string | number | null;
			status?: string | number | null;
			/** The Stripe receipt. */
			receipt_url?: string | number | null;
			[key: string]: unknown;
		}> | null;
		/** The cursor for the next page; null on the last page. */
		next_cursor?: string | number | null;
		[key: string]: unknown;
	};
	'cloud.extract': {
		tool?: string | number | null;
		request_id?: string | number | null;
		took_ms?: number | null;
		usage?: {
			/** Credits the run cost. */
			credits?: number | null;
			[key: string]: unknown;
		} | null;
		/** The records: search results, extracted items, URLs, prices, site tool rows. */
		rows?: Array<Record<string, Crawl4aiJsonValue>> | null;
		/** The rest of the answer: scrape markdown, an answer, a job id and poll path, a watch. */
		data?: Record<string, Crawl4aiJsonValue> | null;
		[key: string]: unknown;
	};
	'cloud.jobs.cancel': Record<string, Crawl4aiJsonValue>;
	'cloud.jobs.get': Record<string, Crawl4aiJsonValue>;
	'cloud.jobs.results': {
		/** One entry per NDJSON line, in order. */
		items: Array<Record<string, Crawl4aiJsonValue>>;
	};
	'cloud.jobs.retry': Record<string, Crawl4aiJsonValue>;
	'cloud.lead': {
		tool?: string | number | null;
		request_id?: string | number | null;
		took_ms?: number | null;
		usage?: {
			/** Credits the run cost. */
			credits?: number | null;
			[key: string]: unknown;
		} | null;
		/** The records: search results, extracted items, URLs, prices, site tool rows. */
		rows?: Array<Record<string, Crawl4aiJsonValue>> | null;
		/** The rest of the answer: scrape markdown, an answer, a job id and poll path, a watch. */
		data?: Record<string, Crawl4aiJsonValue> | null;
		[key: string]: unknown;
	};
	'cloud.monitors.changes': Record<string, Crawl4aiJsonValue>;
	'cloud.monitors.delete': Record<string, Crawl4aiJsonValue>;
	'cloud.monitors.events': Record<string, Crawl4aiJsonValue>;
	'cloud.monitors.get': Record<string, Crawl4aiJsonValue>;
	'cloud.monitors.list': Record<string, Crawl4aiJsonValue>;
	'cloud.monitors.update': Record<string, Crawl4aiJsonValue>;
	'cloud.price': {
		tool?: string | number | null;
		request_id?: string | number | null;
		took_ms?: number | null;
		usage?: {
			/** Credits the run cost. */
			credits?: number | null;
			[key: string]: unknown;
		} | null;
		/** The records: search results, extracted items, URLs, prices, site tool rows. */
		rows?: Array<Record<string, Crawl4aiJsonValue>> | null;
		/** The rest of the answer: scrape markdown, an answer, a job id and poll path, a watch. */
		data?: Record<string, Crawl4aiJsonValue> | null;
		[key: string]: unknown;
	};
	'cloud.priceHistory': Record<string, Crawl4aiJsonValue>;
	'cloud.prices': Record<string, Crawl4aiJsonValue>;
	'cloud.report': Record<string, Crawl4aiJsonValue>;
	'cloud.scan': {
		tool?: string | number | null;
		request_id?: string | number | null;
		took_ms?: number | null;
		usage?: {
			/** Credits the run cost. */
			credits?: number | null;
			[key: string]: unknown;
		} | null;
		/** The records: search results, extracted items, URLs, prices, site tool rows. */
		rows?: Array<Record<string, Crawl4aiJsonValue>> | null;
		/** The rest of the answer: scrape markdown, an answer, a job id and poll path, a watch. */
		data?: Record<string, Crawl4aiJsonValue> | null;
		[key: string]: unknown;
	};
	'cloud.scrape': {
		tool?: string | number | null;
		request_id?: string | number | null;
		took_ms?: number | null;
		usage?: {
			/** Credits the run cost. */
			credits?: number | null;
			[key: string]: unknown;
		} | null;
		/** The records: search results, extracted items, URLs, prices, site tool rows. */
		rows?: Array<Record<string, Crawl4aiJsonValue>> | null;
		/** The rest of the answer: scrape markdown, an answer, a job id and poll path, a watch. */
		data?: Record<string, Crawl4aiJsonValue> | null;
		[key: string]: unknown;
	};
	'cloud.search': {
		tool?: string | number | null;
		request_id?: string | number | null;
		took_ms?: number | null;
		usage?: {
			/** Credits the run cost. */
			credits?: number | null;
			[key: string]: unknown;
		} | null;
		/** The records: search results, extracted items, URLs, prices, site tool rows. */
		rows?: Array<Record<string, Crawl4aiJsonValue>> | null;
		/** The rest of the answer: scrape markdown, an answer, a job id and poll path, a watch. */
		data?: Record<string, Crawl4aiJsonValue> | null;
		[key: string]: unknown;
	};
	'cloud.serp': {
		tool?: string | number | null;
		request_id?: string | number | null;
		took_ms?: number | null;
		usage?: {
			/** Credits the run cost. */
			credits?: number | null;
			[key: string]: unknown;
		} | null;
		/** The records: search results, extracted items, URLs, prices, site tool rows. */
		rows?: Array<Record<string, Crawl4aiJsonValue>> | null;
		/** The rest of the answer: scrape markdown, an answer, a job id and poll path, a watch. */
		data?: Record<string, Crawl4aiJsonValue> | null;
		[key: string]: unknown;
	};
	'cloud.site': {
		tool?: string | number | null;
		request_id?: string | number | null;
		took_ms?: number | null;
		usage?: {
			/** Credits the run cost. */
			credits?: number | null;
			[key: string]: unknown;
		} | null;
		/** The records: search results, extracted items, URLs, prices, site tool rows. */
		rows?: Array<Record<string, Crawl4aiJsonValue>> | null;
		/** The rest of the answer: scrape markdown, an answer, a job id and poll path, a watch. */
		data?: Record<string, Crawl4aiJsonValue> | null;
		[key: string]: unknown;
	};
	'cloud.tools.estimate': {
		tool?: string | number | null;
		request_id?: string | number | null;
		took_ms?: number | null;
		usage?: {
			/** Credits the run cost. */
			credits?: number | null;
			[key: string]: unknown;
		} | null;
		/** The records: search results, extracted items, URLs, prices, site tool rows. */
		rows?: Array<Record<string, Crawl4aiJsonValue>> | null;
		/** The rest of the answer: scrape markdown, an answer, a job id and poll path, a watch. */
		data?: Record<string, Crawl4aiJsonValue> | null;
		[key: string]: unknown;
	};
	'cloud.tools.get': Record<string, Crawl4aiJsonValue>;
	'cloud.tools.list': Record<string, Crawl4aiJsonValue>;
	'cloud.tools.run': {
		tool?: string | number | null;
		request_id?: string | number | null;
		took_ms?: number | null;
		usage?: {
			/** Credits the run cost. */
			credits?: number | null;
			[key: string]: unknown;
		} | null;
		/** The records: search results, extracted items, URLs, prices, site tool rows. */
		rows?: Array<Record<string, Crawl4aiJsonValue>> | null;
		/** The rest of the answer: scrape markdown, an answer, a job id and poll path, a watch. */
		data?: Record<string, Crawl4aiJsonValue> | null;
		[key: string]: unknown;
	};
	'cloud.tools.status': Record<string, Crawl4aiJsonValue>;
	'cloud.verify': {
		tool?: string | number | null;
		request_id?: string | number | null;
		took_ms?: number | null;
		usage?: {
			/** Credits the run cost. */
			credits?: number | null;
			[key: string]: unknown;
		} | null;
		/** The records: search results, extracted items, URLs, prices, site tool rows. */
		rows?: Array<Record<string, Crawl4aiJsonValue>> | null;
		/** The rest of the answer: scrape markdown, an answer, a job id and poll path, a watch. */
		data?: Record<string, Crawl4aiJsonValue> | null;
		[key: string]: unknown;
	};
	'cloud.watch': {
		tool?: string | number | null;
		request_id?: string | number | null;
		took_ms?: number | null;
		usage?: {
			/** Credits the run cost. */
			credits?: number | null;
			[key: string]: unknown;
		} | null;
		/** The records: search results, extracted items, URLs, prices, site tool rows. */
		rows?: Array<Record<string, Crawl4aiJsonValue>> | null;
		/** The rest of the answer: scrape markdown, an answer, a job id and poll path, a watch. */
		data?: Record<string, Crawl4aiJsonValue> | null;
		[key: string]: unknown;
	};
	'server.artifacts.get': FileOutput;
	'server.ask': Record<string, Crawl4aiJsonValue>;
	'server.configDump': Record<string, Crawl4aiJsonValue>;
	'server.crawl': {
		success?: boolean | null;
		results?: Array<{
			url?: string | number | null;
			success?: boolean | null;
			status_code?: number | null;
			error_message?: string | number | null;
			html?: string | number | null;
			cleaned_html?: string | number | null;
			fit_html?: string | number | null;
			/** Markdown: raw_markdown, markdown_with_citations, references_markdown, fit_markdown. */
			markdown?: Crawl4aiJsonValue | null;
			links?: Record<string, Crawl4aiJsonValue> | null;
			media?: Record<string, Crawl4aiJsonValue> | null;
			metadata?: Record<string, Crawl4aiJsonValue> | null;
			tables?: Array<Crawl4aiJsonValue> | null;
			extracted_content?: string | number | null;
			/** Base64 PNG when screenshot was on. */
			screenshot?: string | number | null;
			pdf?: string | number | null;
			redirected_url?: string | number | null;
			response_headers?: Record<string, Crawl4aiJsonValue> | null;
			js_execution_result?: Record<string, Crawl4aiJsonValue> | null;
			session_id?: string | number | null;
			[key: string]: unknown;
		}> | null;
		server_processing_time_s?: number | null;
		server_memory_delta_mb?: number | null;
		server_peak_memory_mb?: number | null;
		[key: string]: unknown;
	};
	'server.crawlJobs.create': {
		task_id?: string | number | null;
		[key: string]: unknown;
	};
	'server.crawlJobs.get': {
		task_id?: string | number | null;
		/** processing, completed or failed. */
		status?: string | number | null;
		created_at?: string | number | null;
		url?: string | number | null;
		/** The crawl result once completed. */
		result?: Crawl4aiJsonValue | null;
		error?: string | number | null;
		[key: string]: unknown;
	};
	'server.crawlStream': {
		/** One entry per NDJSON line, in order. */
		items: Array<Record<string, Crawl4aiJsonValue>>;
	};
	'server.executeJs': Record<string, Crawl4aiJsonValue>;
	'server.health': {
		status?: string | number | null;
		timestamp?: number | null;
		version?: string | number | null;
		[key: string]: unknown;
	};
	'server.hooks': Record<string, Crawl4aiJsonValue>;
	'server.html': {
		url?: string | number | null;
		html?: string | number | null;
		success?: boolean | null;
		[key: string]: unknown;
	};
	'server.llm': Record<string, Crawl4aiJsonValue>;
	'server.llmJobs.create': {
		task_id?: string | number | null;
		[key: string]: unknown;
	};
	'server.llmJobs.get': {
		task_id?: string | number | null;
		/** processing, completed or failed. */
		status?: string | number | null;
		created_at?: string | number | null;
		url?: string | number | null;
		/** The extraction once completed. */
		result?: Crawl4aiJsonValue | null;
		error?: string | number | null;
		[key: string]: unknown;
	};
	'server.markdown': {
		url?: string | number | null;
		filter?: string | number | null;
		query?: string | number | null;
		cache?: string | number | null;
		markdown?: string | number | null;
		success?: boolean | null;
		[key: string]: unknown;
	};
	'server.mcpSchema': Record<string, Crawl4aiJsonValue>;
	'server.metrics': {
		/** The body the server answered with. */
		text: string;
	};
	'server.monitor.browsers': Record<string, Crawl4aiJsonValue>;
	'server.monitor.cleanup': Record<string, Crawl4aiJsonValue>;
	'server.monitor.endpointStats': Record<string, Crawl4aiJsonValue>;
	'server.monitor.errorLog': Record<string, Crawl4aiJsonValue>;
	'server.monitor.health': Record<string, Crawl4aiJsonValue>;
	'server.monitor.janitorLog': Record<string, Crawl4aiJsonValue>;
	'server.monitor.killBrowser': Record<string, Crawl4aiJsonValue>;
	'server.monitor.requests': Record<string, Crawl4aiJsonValue>;
	'server.monitor.resetStats': Record<string, Crawl4aiJsonValue>;
	'server.monitor.restartBrowser': Record<string, Crawl4aiJsonValue>;
	'server.monitor.timeline': Record<string, Crawl4aiJsonValue>;
	'server.pdf': FileOutput & {
		/** The id server.artifacts.get reads this file back with, when the server kept it. */
		artifact_id?: string;
	};
	'server.schema': Record<string, Crawl4aiJsonValue>;
	'server.screenshot': FileOutput & {
		/** The id server.artifacts.get reads this file back with, when the server kept it. */
		artifact_id?: string;
	};
	'server.token': Record<string, Crawl4aiJsonValue>;
};
