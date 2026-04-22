import { z } from 'zod';
import {
	FirecrawlCrawlPageDocument,
	FirecrawlMapLink,
	FirecrawlScrapeActionResults,
	FirecrawlScrapeChangeTracking,
	FirecrawlScrapeMetadata,
	FirecrawlSearchImageItem,
	FirecrawlSearchNewsItem,
	FirecrawlSearchWebItem,
} from '../schema/database';

// ─────────────────────────────────────────────────────────────────────────────
// Input schemas
// ─────────────────────────────────────────────────────────────────────────────

const LocationSchema = z
	.object({
		country: z
			.string()
			.regex(/^[A-Z]{2}$/)
			.optional(),
		languages: z.array(z.string()).optional(),
	})
	.passthrough();

const ViewportSchema = z.object({
	width: z.number().int(),
	height: z.number().int(),
});

const FormatSchema = z.union([
	z.literal('markdown'),
	z.literal('summary'),
	z.literal('html'),
	z.literal('rawHtml'),
	z.literal('links'),
	z.literal('images'),
	z.literal('audio'),
	z.object({
		type: z.literal('markdown'),
	}),
	z.object({
		type: z.literal('summary'),
	}),
	z.object({
		type: z.literal('html'),
	}),
	z.object({
		type: z.literal('rawHtml'),
	}),
	z.object({
		type: z.literal('links'),
	}),
	z.object({
		type: z.literal('images'),
	}),
	z.object({
		type: z.literal('audio'),
	}),
	z.object({
		type: z.literal('screenshot'),
		fullPage: z.boolean().optional(),
		quality: z.number().int().min(1).max(100).optional(),
		viewport: ViewportSchema.optional(),
	}),
	z.object({
		type: z.literal('json'),
		schema: z.record(z.unknown()).optional(),
		prompt: z.string().optional(),
	}),
	z.object({
		type: z.literal('changeTracking'),
		modes: z.array(z.enum(['git-diff', 'json'])).optional(),
		schema: z.record(z.unknown()).optional(),
		prompt: z.string().optional(),
		tag: z.string().nullable().optional(),
	}),
	z.object({
		type: z.literal('branding'),
	}),
]);

const ScrapeParserSchema = z.object({
	type: z.literal('pdf'),
	mode: z.enum(['fast', 'auto', 'ocr']).optional(),
	maxPages: z.number().int().min(1).max(10000).optional(),
});

const ActionSchema = z.union([
	z.object({
		type: z.literal('wait'),
		milliseconds: z.number().int().min(1),
	}),
	z.object({
		type: z.literal('wait'),
		selector: z.string(),
	}),
	z.object({
		type: z.literal('screenshot'),
		fullPage: z.boolean().optional(),
		quality: z.number().int().min(1).max(100).optional(),
		viewport: ViewportSchema.optional(),
	}),
	z.object({
		type: z.literal('click'),
		selector: z.string(),
		all: z.boolean().optional(),
	}),
	z.object({
		type: z.literal('write'),
		text: z.string(),
	}),
	z.object({
		type: z.literal('press'),
		key: z.string(),
	}),
	z.object({
		type: z.literal('scroll'),
		direction: z.enum(['up', 'down']).optional(),
		selector: z.string().optional(),
	}),
	z.object({
		type: z.literal('scrape'),
	}),
	z.object({
		type: z.literal('executeJavascript'),
		script: z.string(),
	}),
	z.object({
		type: z.literal('pdf'),
		format: z
			.enum([
				'A0',
				'A1',
				'A2',
				'A3',
				'A4',
				'A5',
				'A6',
				'Letter',
				'Legal',
				'Tabloid',
				'Ledger',
			])
			.optional(),
		landscape: z.boolean().optional(),
		scale: z.number().optional(),
	}),
]);

const ScrapeOptionsSchema = z
	.object({
		formats: z.array(FormatSchema).optional(),
		onlyMainContent: z.boolean().optional(),
		includeTags: z.array(z.string()).optional(),
		excludeTags: z.array(z.string()).optional(),
		maxAge: z.number().int().optional(),
		minAge: z.number().int().optional(),
		headers: z.record(z.string()).optional(),
		waitFor: z.number().int().optional(),
		mobile: z.boolean().optional(),
		skipTlsVerification: z.boolean().optional(),
		timeout: z.number().int().min(1000).max(300000).optional(),
		parsers: z.array(ScrapeParserSchema).optional(),
		actions: z.array(ActionSchema).optional(),
		location: LocationSchema.optional(),
		removeBase64Images: z.boolean().optional(),
		blockAds: z.boolean().optional(),
		proxy: z.enum(['basic', 'enhanced', 'auto']).optional(),
		storeInCache: z.boolean().optional(),
		profile: z
			.object({
				name: z.string().min(1).max(128),
				saveChanges: z.boolean().optional(),
			})
			.optional(),
	})
	.passthrough();

const ScrapeRunInputSchema = z
	.object({
		url: z.string(),
		formats: ScrapeOptionsSchema.shape.formats,
		onlyMainContent: ScrapeOptionsSchema.shape.onlyMainContent,
		includeTags: ScrapeOptionsSchema.shape.includeTags,
		excludeTags: ScrapeOptionsSchema.shape.excludeTags,
		maxAge: ScrapeOptionsSchema.shape.maxAge,
		minAge: ScrapeOptionsSchema.shape.minAge,
		headers: ScrapeOptionsSchema.shape.headers,
		waitFor: ScrapeOptionsSchema.shape.waitFor,
		mobile: ScrapeOptionsSchema.shape.mobile,
		skipTlsVerification: ScrapeOptionsSchema.shape.skipTlsVerification,
		timeout: ScrapeOptionsSchema.shape.timeout,
		parsers: ScrapeOptionsSchema.shape.parsers,
		actions: ScrapeOptionsSchema.shape.actions,
		location: ScrapeOptionsSchema.shape.location,
		removeBase64Images: ScrapeOptionsSchema.shape.removeBase64Images,
		blockAds: ScrapeOptionsSchema.shape.blockAds,
		proxy: ScrapeOptionsSchema.shape.proxy,
		storeInCache: ScrapeOptionsSchema.shape.storeInCache,
		profile: ScrapeOptionsSchema.shape.profile,
		zeroDataRetention: z.boolean().optional(),
	})
	.passthrough();

const MapRunInputSchema = z
	.object({
		url: z.string(),
		search: z.string().optional(),
		sitemap: z.enum(['skip', 'include', 'only']).optional(),
		includeSubdomains: z.boolean().optional(),
		ignoreQueryParameters: z.boolean().optional(),
		ignoreCache: z.boolean().optional(),
		limit: z.number().int().max(100000).optional(),
		timeout: z.number().int().optional(),
		location: LocationSchema.optional(),
	})
	.passthrough();

const SearchRunInputSchema = z
	.object({
		query: z.string(),
		limit: z.number().int().min(1).max(100).optional(),
		sources: z
			.array(
				z.union([
					z.object({
						type: z.literal('web'),
						tbs: z.string().optional(),
						location: z.string().optional(),
					}),
					z.object({ type: z.literal('images') }),
					z.object({ type: z.literal('news') }),
				]),
			)
			.optional(),
		categories: z
			.array(
				z.union([
					z.object({ type: z.literal('github') }),
					z.object({ type: z.literal('research') }),
					z.object({ type: z.literal('pdf') }),
				]),
			)
			.optional(),
		tbs: z.string().optional(),
		location: z.string().optional(),
		country: z.string().optional(),
		timeout: z.number().int().optional(),
		ignoreInvalidURLs: z.boolean().optional(),
		enterprise: z.array(z.enum(['anon', 'zdr'])).optional(),
		scrapeOptions: ScrapeOptionsSchema.optional(),
	})
	.passthrough();

const WebhookSchema = z
	.object({
		url: z.string(),
		headers: z.record(z.string()).optional(),
		metadata: z.record(z.unknown()).optional(),
		events: z
			.array(z.enum(['completed', 'page', 'failed', 'started']))
			.optional(),
	})
	.passthrough();

const CrawlStartInputSchema = z
	.object({
		url: z.string(),
		prompt: z.string().optional(),
		excludePaths: z.array(z.string()).optional(),
		includePaths: z.array(z.string()).optional(),
		maxDiscoveryDepth: z.number().optional(),
		sitemap: z.enum(['skip', 'include', 'only']).optional(),
		ignoreQueryParameters: z.boolean().optional(),
		regexOnFullURL: z.boolean().optional(),
		limit: z.number().optional(),
		crawlEntireDomain: z.boolean().optional(),
		allowExternalLinks: z.boolean().optional(),
		allowSubdomains: z.boolean().optional(),
		delay: z.number().optional(),
		maxConcurrency: z.number().optional(),
		webhook: WebhookSchema.optional(),
		scrapeOptions: ScrapeOptionsSchema.optional(),
		zeroDataRetention: z.boolean().optional(),
	})
	.passthrough();

const JobIdInputSchema = z.object({
	id: z.string(),
});

const AgentStartInputSchema = z
	.object({
		prompt: z.string(),
		urls: z.array(z.string()).optional(),
		schema: z.record(z.unknown()).optional(),
		maxCredits: z.number().optional(),
		strictConstrainToURLs: z.boolean().optional(),
		model: z.enum(['spark-1-mini', 'spark-1-pro']).optional(),
	})
	.passthrough();

export const FirecrawlEndpointInputSchemas = {
	scrapeRun: ScrapeRunInputSchema,
	mapRun: MapRunInputSchema,
	searchRun: SearchRunInputSchema,
	crawlStart: CrawlStartInputSchema,
	crawlGet: JobIdInputSchema,
	crawlCancel: JobIdInputSchema,
	agentStart: AgentStartInputSchema,
	agentGet: JobIdInputSchema,
	agentCancel: JobIdInputSchema,
} as const;

export type FirecrawlEndpointInputs = {
	[K in keyof typeof FirecrawlEndpointInputSchemas]: z.infer<
		(typeof FirecrawlEndpointInputSchemas)[K]
	>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Output schemas
// ─────────────────────────────────────────────────────────────────────────────

const ScrapeDataSchema = z
	.object({
		markdown: z.string().optional(),
		summary: z.string().nullable().optional(),
		html: z.string().nullable().optional(),
		rawHtml: z.string().nullable().optional(),
		screenshot: z.string().nullable().optional(),
		audio: z.string().nullable().optional(),
		links: z.array(z.string()).optional(),
		actions: FirecrawlScrapeActionResults.nullable().optional(),
		metadata: FirecrawlScrapeMetadata.optional(),
		warning: z.string().nullable().optional(),
		changeTracking: FirecrawlScrapeChangeTracking.nullable().optional(),
		branding: z.record(z.unknown()).nullable().optional(),
		json: z.unknown().optional(),
		images: z.array(z.record(z.unknown())).optional(),
	})
	.passthrough();

const ScrapeRunOutputSchema = z
	.object({
		success: z.boolean(),
		data: ScrapeDataSchema.optional(),
	})
	.passthrough();

const MapRunOutputSchema = z
	.object({
		success: z.boolean(),
		links: z.array(FirecrawlMapLink).optional(),
	})
	.passthrough();

const SearchDataSchema = z
	.object({
		web: z.array(FirecrawlSearchWebItem).optional(),
		images: z.array(FirecrawlSearchImageItem).optional(),
		news: z.array(FirecrawlSearchNewsItem).optional(),
	})
	.passthrough();

const SearchRunOutputSchema = z
	.object({
		success: z.boolean(),
		data: SearchDataSchema.optional(),
		warning: z.string().nullable().optional(),
		id: z.string().optional(),
		creditsUsed: z.number().optional(),
	})
	.passthrough();

const CrawlStartOutputSchema = z
	.object({
		success: z.boolean(),
		id: z.string().optional(),
		url: z.string().optional(),
	})
	.passthrough();

const CrawlGetOutputSchema = z
	.object({
		success: z.boolean(),
		status: z.string().optional(),
		total: z.number().optional(),
		completed: z.number().optional(),
		creditsUsed: z.number().optional(),
		expiresAt: z.string().optional(),
		next: z.string().nullable().optional(),
		data: z.array(FirecrawlCrawlPageDocument).optional(),
	})
	.passthrough();

const CrawlCancelOutputSchema = z
	.object({
		success: z.boolean().optional(),
		status: z.literal('cancelled').optional(),
	})
	.passthrough();

const AgentStartOutputSchema = z
	.object({
		success: z.boolean(),
		id: z.string().optional(),
	})
	.passthrough();

const AgentGetOutputSchema = z
	.object({
		success: z.boolean(),
		status: z.enum(['processing', 'completed', 'failed']).optional(),
		data: z.record(z.unknown()).optional(),
		model: z.enum(['spark-1-pro', 'spark-1-mini']).optional(),
		error: z.string().optional(),
		expiresAt: z.string().optional(),
		creditsUsed: z.number().optional(),
	})
	.passthrough();

const AgentCancelOutputSchema = z
	.object({
		success: z.boolean(),
	})
	.passthrough();

export const FirecrawlEndpointOutputSchemas = {
	scrapeRun: ScrapeRunOutputSchema,
	mapRun: MapRunOutputSchema,
	searchRun: SearchRunOutputSchema,
	crawlStart: CrawlStartOutputSchema,
	crawlGet: CrawlGetOutputSchema,
	crawlCancel: CrawlCancelOutputSchema,
	agentStart: AgentStartOutputSchema,
	agentGet: AgentGetOutputSchema,
	agentCancel: AgentCancelOutputSchema,
} as const;

export type FirecrawlEndpointOutputs = {
	[K in keyof typeof FirecrawlEndpointOutputSchemas]: z.infer<
		(typeof FirecrawlEndpointOutputSchemas)[K]
	>;
};

export type ScrapeRunResponse = z.infer<typeof ScrapeRunOutputSchema>;
export type MapRunResponse = z.infer<typeof MapRunOutputSchema>;
export type SearchRunResponse = z.infer<typeof SearchRunOutputSchema>;
export type CrawlStartResponse = z.infer<typeof CrawlStartOutputSchema>;
export type CrawlGetResponse = z.infer<typeof CrawlGetOutputSchema>;
export type CrawlCancelResponse = z.infer<typeof CrawlCancelOutputSchema>;
export type AgentStartResponse = z.infer<typeof AgentStartOutputSchema>;
export type AgentGetResponse = z.infer<typeof AgentGetOutputSchema>;
export type AgentCancelResponse = z.infer<typeof AgentCancelOutputSchema>;
