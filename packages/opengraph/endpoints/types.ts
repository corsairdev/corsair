import { z } from 'zod';

// Inputs use OpenGraph.io's own parameter names. Outputs are `.loose()` and
// their documented fields nullish, so a field OpenGraph.io adds, omits or
// nulls cannot fail a call that has already happened. Field reference:
// https://www.opengraph.io/docs/api

const UrlInput = z
	.string()
	.min(1)
	.describe('The target URL. It is percent-encoded into the request path.');

const CacheOkInput = z
	.boolean()
	.optional()
	.describe('Allow a cached result. OpenGraph.io defaults this to true.');

// ── shared output pieces ───────────────────────────────────────────────────

const RequestInfoSchema = z
	.object({
		redirects: z.number().nullish(),
		host: z.string().nullish(),
		responseCode: z.number().nullish(),
		responseContentType: z.string().nullish(),
	})
	.loose();

const ImageSchema = z.union([
	z.string(),
	z
		.object({
			url: z.string().nullish(),
			width: z.number().nullish(),
			height: z.number().nullish(),
		})
		.loose(),
]);

const AiSafetySchema = z
	.object({
		risk_score: z.number().nullish(),
		risk_level: z.string().nullish(),
		action_taken: z.string().nullish(),
		signals: z.array(z.string()).nullish(),
		recommendation: z.string().nullish(),
	})
	.loose();

// ── site.get ───────────────────────────────────────────────────────────────

const SiteGetInputSchema = z.object({
	url: UrlInput,
	cache_ok: CacheOkInput,
	max_cache_age: z
		.number()
		.int()
		.positive()
		.optional()
		.describe(
			'Maximum age of an acceptable cached result, in seconds. Default 432000 (5 days).',
		),
	full_render: z
		.boolean()
		.optional()
		.describe('Render the page in a headless browser before reading tags.'),
	use_proxy: z
		.boolean()
		.optional()
		.describe('Fetch through the standard datacenter proxy (10 credits).'),
	use_premium: z
		.boolean()
		.optional()
		.describe('Fetch through the residential proxy (20 credits).'),
	use_superior: z
		.boolean()
		.optional()
		.describe(
			'Fetch through the mobile proxy for heavily protected sites (30 credits).',
		),
	use_ai: z
		.boolean()
		.optional()
		.describe('Let AI improve the extracted metadata when tags are missing.'),
	accept_lang: z
		.string()
		.min(1)
		.optional()
		.describe('Accept-Language header sent to the page, e.g. en-US.'),
	proxy_country: z
		.string()
		.min(2)
		.max(2)
		.optional()
		.describe('Two-letter country code to fetch from, e.g. US.'),
	auto_proxy: z
		.boolean()
		.optional()
		.describe(
			'Let OpenGraph.io pick the proxy for the domain. v3.0 default: true.',
		),
	auto_render: z
		.boolean()
		.optional()
		.describe(
			'Let OpenGraph.io render JavaScript when the page needs it. v3.0 default: true.',
		),
	retry: z
		.boolean()
		.optional()
		.describe(
			'Retry a failed fetch with a stronger proxy tier. v3.0 default: true.',
		),
});

export type SiteGetInput = z.input<typeof SiteGetInputSchema>;

const HybridGraphSchema = z
	.object({
		title: z.string().nullish(),
		description: z.string().nullish(),
		image: ImageSchema.nullish(),
		url: z.string().nullish(),
		site_name: z.string().nullish(),
		type: z.string().nullish(),
		favicon: z.string().nullish(),
	})
	.loose();

const OpenGraphTagsSchema = z
	.object({
		title: z.string().nullish(),
		description: z.string().nullish(),
		type: z.string().nullish(),
		url: z.string().nullish(),
		site_name: z.string().nullish(),
		image: ImageSchema.nullish(),
	})
	.loose();

const TwitterCardSchema = z
	.object({
		card: z.string().nullish(),
		site: z.string().nullish(),
		title: z.string().nullish(),
		description: z.string().nullish(),
		image: ImageSchema.nullish(),
	})
	.loose();

const HtmlInferredSchema = z
	.object({
		title: z.string().nullish(),
		description: z.string().nullish(),
		favicon: z.string().nullish(),
	})
	.loose();

const SiteGetResponseSchema = z
	.object({
		hybridGraph: HybridGraphSchema.nullish(),
		openGraph: OpenGraphTagsSchema.nullish(),
		twitterCard: TwitterCardSchema.nullish(),
		htmlInferred: HtmlInferredSchema.nullish(),
		requestInfo: RequestInfoSchema.nullish(),
		// unknown: attempt details vary by proxy tier tried.
		retryInfo: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export type SiteGetResponse = z.infer<typeof SiteGetResponseSchema>;

// ── scrape.fetch ───────────────────────────────────────────────────────────

const ScrapeFetchInputSchema = z.object({
	url: UrlInput,
	full_render: z
		.boolean()
		.optional()
		.describe(
			'Render the page in a headless browser, required for JavaScript apps.',
		),
	cache_ok: CacheOkInput,
	use_proxy: z
		.boolean()
		.optional()
		.describe('Fetch through the standard datacenter proxy (10 credits).'),
	use_premium: z
		.boolean()
		.optional()
		.describe('Fetch through the residential proxy (20 credits).'),
	use_superior: z
		.boolean()
		.optional()
		.describe(
			'Fetch through the mobile proxy for heavily protected sites (30 credits).',
		),
	accept_lang: z
		.string()
		.min(1)
		.optional()
		.describe('Accept-Language header sent to the page, e.g. en-US.'),
	auto_proxy: z
		.boolean()
		.optional()
		.describe(
			'Let OpenGraph.io pick the proxy for the domain. v3.0 default: true.',
		),
	auto_render: z
		.boolean()
		.optional()
		.describe(
			'Let OpenGraph.io render JavaScript when the page needs it. v3.0 default: true.',
		),
	retry: z
		.boolean()
		.optional()
		.describe(
			'Retry a failed fetch with a stronger proxy tier. v3.0 default: true.',
		),
});

export type ScrapeFetchInput = z.input<typeof ScrapeFetchInputSchema>;

const ScrapeFetchResponseSchema = z
	.object({
		htmlContent: z.string().nullish(),
		requestInfo: RequestInfoSchema.nullish(),
	})
	.loose();

export type ScrapeFetchResponse = z.infer<typeof ScrapeFetchResponseSchema>;

// ── screenshot.capture ─────────────────────────────────────────────────────

const ScreenshotCaptureInputSchema = z.object({
	url: UrlInput,
	format: z
		.enum(['jpeg', 'png', 'webp'])
		.optional()
		.describe('Image format. Default jpeg.'),
	quality: z
		.number()
		.int()
		.min(10)
		.max(80)
		.optional()
		.describe('Image quality, rounded to the nearest 10. Default 80.'),
	full_page: z
		.boolean()
		.optional()
		.describe('Capture the entire scrollable page instead of the viewport.'),
	dimensions: z
		.enum(['xs', 'sm', 'md', 'lg'])
		.optional()
		.describe(
			'Viewport size: xs 375x812, sm 1024x768, md 1366x768 (default), lg 1920x1080.',
		),
	selector: z
		.string()
		.min(1)
		.optional()
		.describe('CSS selector to capture only that element.'),
	exclude_selectors: z
		.string()
		.min(1)
		.optional()
		.describe('Comma-separated CSS selectors to hide, e.g. .header,.footer.'),
	block_cookie_banner: z
		.boolean()
		.optional()
		.describe('Auto-block known cookie consent banners. Default true.'),
	dark_mode: z
		.boolean()
		.optional()
		.describe('Set the browser preference to dark mode.'),
	cache_ok: CacheOkInput,
	use_proxy: z
		.boolean()
		.optional()
		.describe(
			'Fetch through a proxy for protected sites (20 credits for a screenshot).',
		),
	capture_delay: z
		.number()
		.int()
		.min(0)
		.max(10000)
		.optional()
		.describe('Milliseconds to wait before the capture.'),
	navigationTimeout: z
		.number()
		.int()
		.min(1000)
		.max(60000)
		.optional()
		.describe('Navigation timeout in milliseconds. Default 30000.'),
});

export type ScreenshotCaptureInput = z.input<
	typeof ScreenshotCaptureInputSchema
>;

const ScreenshotCaptureResponseSchema = z
	.object({
		screenshotUrl: z.string().nullish(),
		dimensions: z
			.object({
				width: z.number().nullish(),
				height: z.number().nullish(),
			})
			.loose()
			.nullish(),
		requestInfo: RequestInfoSchema.nullish(),
	})
	.loose();

export type ScreenshotCaptureResponse = z.infer<
	typeof ScreenshotCaptureResponseSchema
>;

// ── extract.run ────────────────────────────────────────────────────────────

const ExtractSelectorSchema = z.object({
	selector: z.string().min(1).describe('Any valid CSS selector.'),
	multiple: z
		.boolean()
		.optional()
		.describe('Return every match as an array instead of the first match.'),
	type: z
		.enum(['text', 'attr'])
		.optional()
		.describe('Extract inner text or an attribute value. Default text.'),
	attr: z
		.string()
		.min(1)
		.optional()
		.describe('The attribute to read, required when type is attr.'),
});

const ExtractRunInputSchema = z.object({
	site: z.string().min(1).describe('The URL to extract from.'),
	// unknown: keyed by the caller's own selector names.
	selectors: z
		.record(z.string(), ExtractSelectorSchema)
		.optional()
		.describe(
			'CSS selectors to pull as structured data, keyed by your own names.',
		),
	html_elements: z
		.string()
		.min(1)
		.optional()
		.describe(
			'Comma-separated tags behind concatenatedText. Default title,h1,h2,h3,h4,h5,p.',
		),
	wait_for_selector: z
		.string()
		.min(1)
		.optional()
		.describe(
			'Wait for this CSS selector before capturing. Enables JavaScript rendering.',
		),
	scroll_to_bottom: z
		.boolean()
		.optional()
		.describe(
			'Scroll the page to trigger lazy-loaded content. Enables JavaScript rendering.',
		),
	load_more_selector: z
		.string()
		.min(1)
		.optional()
		.describe(
			'A load-more button to click before capturing. Enables JavaScript rendering.',
		),
	load_more_clicks: z
		.number()
		.int()
		.min(1)
		.max(10)
		.optional()
		.describe('How many times to click the load-more button. Default 3.'),
	load_more_wait: z
		.number()
		.int()
		.min(0)
		.max(5000)
		.optional()
		.describe('Milliseconds to wait after each click. Default 1500.'),
	cache_ok: CacheOkInput,
	max_cache_age: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Maximum age of an acceptable cached result, in seconds.'),
	full_render: z
		.boolean()
		.optional()
		.describe('Render the page in a headless browser before extracting.'),
	use_proxy: z
		.boolean()
		.optional()
		.describe('Fetch through the standard datacenter proxy (10 credits).'),
	use_premium: z
		.boolean()
		.optional()
		.describe('Fetch through the residential proxy (20 credits).'),
	use_superior: z
		.boolean()
		.optional()
		.describe(
			'Fetch through the mobile proxy for heavily protected sites (30 credits).',
		),
	auto_proxy: z
		.boolean()
		.optional()
		.describe(
			'Let OpenGraph.io pick the proxy for the domain. v3.0 default: true.',
		),
	auto_render: z
		.boolean()
		.optional()
		.describe(
			'Let OpenGraph.io render JavaScript when the page needs it. v3.0 default: true.',
		),
	retry: z
		.boolean()
		.optional()
		.describe(
			'Retry a failed fetch with a stronger proxy tier. v3.0 default: true.',
		),
	ai_sanitize: z
		.boolean()
		.optional()
		.describe('Scan the extracted text for prompt injection (1 extra credit).'),
	ai_sanitize_mode: z
		.enum(['sanitize', 'warn', 'block'])
		.optional()
		.describe('What to do on detected injection risk. Default sanitize.'),
});

export type ExtractRunInput = z.input<typeof ExtractRunInputSchema>;

const ExtractRunResponseSchema = z
	.object({
		url: z.string().nullish(),
		concatenatedText: z.string().nullish(),
		// unknown: keyed by the caller's selector names, values are text or attrs.
		data: z.record(z.string(), z.unknown()).nullish(),
		ai_safety: AiSafetySchema.nullish(),
	})
	.loose();

export type ExtractRunResponse = z.infer<typeof ExtractRunResponseSchema>;

// ── query.run ──────────────────────────────────────────────────────────────

const QueryRunInputSchema = z.object({
	url: UrlInput,
	query: z.string().min(1).describe('The question to answer from the page.'),
	// unknown: a JSON-schema-like shape of strings, numbers and booleans.
	responseStructure: z
		.record(z.string(), z.unknown())
		.optional()
		.describe('Shape the answer should take, e.g. { products: ["string"] }.'),
	modelSize: z
		.enum(['nano', 'mini'])
		.optional()
		.describe(
			'AI model size. nano (default) costs 100 credits, mini 200; a cached answer costs 1.',
		),
	cache_ok: CacheOkInput,
	full_render: z
		.boolean()
		.optional()
		.describe('Render the page in a headless browser before answering.'),
	use_proxy: z
		.boolean()
		.optional()
		.describe('Fetch through the standard datacenter proxy (10 credits).'),
	use_premium: z
		.boolean()
		.optional()
		.describe('Fetch through the residential proxy (20 credits).'),
	use_superior: z
		.boolean()
		.optional()
		.describe(
			'Fetch through the mobile proxy for heavily protected sites (30 credits).',
		),
	auto_proxy: z
		.boolean()
		.optional()
		.describe(
			'Let OpenGraph.io pick the proxy for the domain. v3.0 default: true.',
		),
	auto_render: z
		.boolean()
		.optional()
		.describe(
			'Let OpenGraph.io render JavaScript when the page needs it. v3.0 default: true.',
		),
	retry: z
		.boolean()
		.optional()
		.describe(
			'Retry a failed fetch with a stronger proxy tier. v3.0 default: true.',
		),
});

export type QueryRunInput = z.input<typeof QueryRunInputSchema>;

const QueryRunResponseSchema = z
	.object({
		// unknown: the answer follows the caller's responseStructure.
		answer: z.record(z.string(), z.unknown()).nullish(),
		requestInfo: RequestInfoSchema.nullish(),
	})
	.loose();

export type QueryRunResponse = z.infer<typeof QueryRunResponseSchema>;

// ── oembed.get ─────────────────────────────────────────────────────────────

const OembedGetInputSchema = z.object({
	url: UrlInput,
	orientation: z
		.enum(['vertical', 'horizontal'])
		.optional()
		.describe(
			'Fallback frame orientation: vertical 800x600 (default) or horizontal 400x150.',
		),
	always_og_frame: z
		.boolean()
		.optional()
		.describe(
			'Force a hosted OpenGraph.io card even when a native embed exists.',
		),
	maxwidth: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Maximum embed width in pixels.'),
	maxheight: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Maximum embed height in pixels.'),
	theme: z
		.enum(['light', 'dark', 'auto'])
		.optional()
		.describe('Color scheme for hosted fallback cards. Default auto.'),
	template: z
		.enum(['default', 'compact', 'horizontal'])
		.optional()
		.describe(
			'Layout preset for fallback cards; overrides orientation when set.',
		),
	cache_ok: z
		.boolean()
		.optional()
		.describe('Allow cached page metadata for fallback cards. Default true.'),
	max_cache_age: z
		.number()
		.int()
		.positive()
		.optional()
		.describe(
			'Maximum age of acceptable cached metadata, in milliseconds. Default 432000000.',
		),
	full_render: z
		.boolean()
		.optional()
		.describe(
			'Render the target page before reading metadata for a fallback card.',
		),
	use_proxy: z
		.boolean()
		.optional()
		.describe('Fetch through the standard datacenter proxy (10 credits).'),
	use_premium: z
		.boolean()
		.optional()
		.describe('Fetch through the residential proxy (20 credits).'),
	use_superior: z
		.boolean()
		.optional()
		.describe(
			'Fetch through the mobile proxy for heavily protected sites (30 credits).',
		),
	proxy_country: z
		.string()
		.min(2)
		.max(2)
		.optional()
		.describe('Two-letter country code to fetch from, e.g. US.'),
	auto_proxy: z
		.boolean()
		.optional()
		.describe(
			'Let OpenGraph.io pick the proxy for the domain. v3.0 default: true.',
		),
	auto_render: z
		.boolean()
		.optional()
		.describe(
			'Let OpenGraph.io render JavaScript when the page needs it. v3.0 default: true.',
		),
	retry: z
		.boolean()
		.optional()
		.describe(
			'Retry a failed fetch with a stronger proxy tier. v3.0 default: true.',
		),
});

export type OembedGetInput = z.input<typeof OembedGetInputSchema>;

const OembedGetResponseSchema = z
	.object({
		type: z.string().nullish(),
		version: z.string().nullish(),
		provider_name: z.string().nullish(),
		width: z.number().nullish(),
		height: z.number().nullish(),
		// native, discovery or og_frame; kept a string so a new tier cannot fail a read.
		source: z.string().nullish(),
		embed_id: z.string().nullish(),
		frame_url: z.string().nullish(),
		html: z.string().nullish(),
	})
	.loose();

export type OembedGetResponse = z.infer<typeof OembedGetResponseSchema>;

// ── markdown.get ───────────────────────────────────────────────────────────

const MarkdownGetInputSchema = z.object({
	url: UrlInput,
	only_main_content: z
		.boolean()
		.optional()
		.describe('Strip navigation, sidebars and footers. Default true.'),
	include_tags: z
		.string()
		.min(1)
		.optional()
		.describe('Comma-separated CSS selectors to keep, e.g. article,main.'),
	exclude_tags: z
		.string()
		.min(1)
		.optional()
		.describe(
			'Comma-separated CSS selectors to drop, e.g. nav,.sidebar,footer.',
		),
	max_chars: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Cap the Markdown at this many characters.'),
	chunking: z
		.boolean()
		.optional()
		.describe(
			'Split the document into chunks sized for embedding. Default false.',
		),
	chunk_size: z
		.number()
		.int()
		.min(200)
		.max(20000)
		.optional()
		.describe('Target chunk size in characters. Default 2000.'),
	chunk_overlap: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe(
			'Characters repeated from the end of the previous chunk. Default 0.',
		),
	heading_aware: z
		.boolean()
		.optional()
		.describe('Start a new chunk at each section heading. Default true.'),
	heading_aware_level: z
		.number()
		.int()
		.min(1)
		.max(6)
		.optional()
		.describe('Which heading level starts a new chunk. Default 2.'),
	max_chunks: z
		.number()
		.int()
		.min(1)
		.max(2000)
		.optional()
		.describe('Most chunks to return. Default 500.'),
	query: z
		.string()
		.min(1)
		.max(512)
		.optional()
		.describe(
			'Return only passages matching these keywords, with relevance scores. Implies chunking.',
		),
	query_top_k: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('How many matching passages to return. Default 5.'),
	include_markdown: z
		.boolean()
		.optional()
		.describe('Include the document itself. Default true.'),
	include_metadata: z
		.boolean()
		.optional()
		.describe('Include the page metadata block. Default true.'),
	include_chunks: z
		.boolean()
		.optional()
		.describe('Include the chunk texts. Default true.'),
	include_headings: z
		.boolean()
		.optional()
		.describe(
			'Return the heading outline and table and code block counts. Default false.',
		),
	include_links: z
		.boolean()
		.optional()
		.describe(
			'Return every link from the main content as an absolute URL. Default false.',
		),
	include_images: z
		.boolean()
		.optional()
		.describe(
			'Return every image with its source and alt text. Default false.',
		),
	ai_sanitize: z
		.boolean()
		.optional()
		.describe('Scan the page for prompt injection (1 extra credit).'),
	ai_sanitize_mode: z
		.enum(['sanitize', 'warn', 'block'])
		.optional()
		.describe('What to do on detected injection risk. Default sanitize.'),
	cache_ok: CacheOkInput,
	max_cache_age: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Maximum age of an acceptable cached result, in milliseconds.'),
	full_render: z
		.boolean()
		.optional()
		.describe(
			'Always render in a browser first. Adds 5-10 seconds and is billed.',
		),
	wait_for_selector: z
		.string()
		.min(1)
		.optional()
		.describe('Wait for this CSS selector before reading. Enables rendering.'),
	scroll_to_bottom: z
		.boolean()
		.optional()
		.describe(
			'Scroll the page to trigger lazy-loaded content. Enables rendering.',
		),
	load_more_selector: z
		.string()
		.min(1)
		.optional()
		.describe('A load-more button to click before reading. Enables rendering.'),
	use_proxy: z
		.boolean()
		.optional()
		.describe('Fetch through the standard datacenter proxy (10 credits).'),
	use_premium: z
		.boolean()
		.optional()
		.describe('Fetch through the residential proxy (20 credits).'),
	use_superior: z
		.boolean()
		.optional()
		.describe(
			'Fetch through the mobile proxy for heavily protected sites (30 credits).',
		),
	proxy_country: z
		.string()
		.min(2)
		.max(2)
		.optional()
		.describe('Two-letter country code to fetch from, e.g. US.'),
	accept_lang: z
		.string()
		.min(1)
		.optional()
		.describe('Accept-Language header sent to the page, e.g. en-US.'),
	auto_render: z
		.boolean()
		.optional()
		.describe(
			'Let OpenGraph.io render JavaScript when the page needs it. v3.0 default: true.',
		),
	auto_proxy: z
		.boolean()
		.optional()
		.describe(
			'Let OpenGraph.io pick the proxy for the domain. v3.0 default: true.',
		),
	retry: z
		.boolean()
		.optional()
		.describe(
			'Retry a failed fetch with a stronger proxy tier. v3.0 default: true.',
		),
});

export type MarkdownGetInput = z.input<typeof MarkdownGetInputSchema>;

const MarkdownMetadataSchema = z
	.object({
		title: z.string().nullish(),
		description: z.string().nullish(),
		canonical_url: z.string().nullish(),
		site_name: z.string().nullish(),
		image: z.string().nullish(),
		language: z.string().nullish(),
		final_url: z.string().nullish(),
	})
	.loose();

const MarkdownUsageSchema = z
	.object({
		character_count: z.number().nullish(),
		estimated_token_count: z.number().nullish(),
		truncated: z.boolean().nullish(),
		truncation_reason: z.string().nullish(),
		max_chars: z.number().nullish(),
		chunk_count: z.number().nullish(),
		chunks_truncated: z.boolean().nullish(),
		chunk_error: z.string().nullish(),
		structure_error: z.string().nullish(),
		headings_truncated: z.boolean().nullish(),
		links_truncated: z.boolean().nullish(),
		images_truncated: z.boolean().nullish(),
	})
	.loose();

const MarkdownDebugSchema = z
	.object({
		full_render_used: z.boolean().nullish(),
		auto_render_triggered: z.boolean().nullish(),
		proxy_used: z.string().nullish(),
		retry_used: z.boolean().nullish(),
		retry_attempts: z.number().nullish(),
		final_status_code: z.number().nullish(),
	})
	.loose();

const ChunkSchema = z
	.object({
		index: z.number().nullish(),
		text: z.string().nullish(),
		heading_path: z.array(z.string()).nullish(),
		character_count: z.number().nullish(),
		estimated_token_count: z.number().nullish(),
		start_offset: z.number().nullish(),
		end_offset: z.number().nullish(),
		overlap_character_count: z.number().nullish(),
		split_mid_block: z.boolean().nullish(),
		relevance_score: z.number().nullish(),
	})
	.loose();

const HeadingSchema = z
	.object({
		level: z.number().nullish(),
		text: z.string().nullish(),
	})
	.loose();

const MarkdownLinkSchema = z
	.object({
		url: z.string().nullish(),
		text: z.string().nullish(),
		rel: z.string().nullish(),
		internal: z.boolean().nullish(),
	})
	.loose();

const MarkdownImageSchema = z
	.object({
		url: z.string().nullish(),
		alt: z.string().nullish(),
	})
	.loose();

const MarkdownGetResponseSchema = z
	.object({
		markdown: z.string().nullish(),
		metadata: MarkdownMetadataSchema.nullish(),
		usage: MarkdownUsageSchema.nullish(),
		debug: MarkdownDebugSchema.nullish(),
		request_id: z.string().nullish(),
		chunks: z.array(ChunkSchema).nullish(),
		headings: z.array(HeadingSchema).nullish(),
		links: z.array(MarkdownLinkSchema).nullish(),
		images: z.array(MarkdownImageSchema).nullish(),
		tables_detected: z.number().nullish(),
		code_blocks_detected: z.number().nullish(),
		ai_safety: AiSafetySchema.nullish(),
	})
	.loose();

export type MarkdownGetResponse = z.infer<typeof MarkdownGetResponseSchema>;

// ── brand.analyze ──────────────────────────────────────────────────────────

const BrandQuestionSchema = z.object({
	key: z
		.string()
		.min(1)
		.max(64)
		.regex(/^[A-Za-z0-9_]+$/)
		.describe('The answer is returned under this key.'),
	question: z.string().min(1).max(500).describe('The question to answer.'),
	type: z
		.enum(['string', 'boolean', 'number', 'string[]', 'object'])
		.optional()
		.describe('The expected answer type. Default string.'),
});

const BrandAnalyzeInputSchema = z.object({
	url: UrlInput,
	// unknown: boolean flags keyed by section name.
	sections: z
		.record(z.string(), z.boolean())
		.optional()
		.describe('Set a section to false to skip it, e.g. { visual: false }.'),
	questions: z
		.array(BrandQuestionSchema)
		.max(3)
		.optional()
		.describe(
			'Up to 3 custom questions; answers come back under custom.<key>.',
		),
	include_meta: z
		.boolean()
		.optional()
		.describe('Add a _meta object with the source pages behind each field.'),
	cache_ok: z
		.boolean()
		.optional()
		.describe('Reuse a cached analysis up to 7 days old. Default true.'),
});

export type BrandAnalyzeInput = z.input<typeof BrandAnalyzeInputSchema>;

const BrandSectionSchema = z
	.object({
		domain: z.string().nullish(),
		name: z.string().nullish(),
		description: z.string().nullish(),
		tagline: z.string().nullish(),
		category: z.string().nullish(),
	})
	.loose();

const LogoSchema = z
	.object({
		url: z.string().nullish(),
		type: z.string().nullish(),
		theme: z.string().nullish(),
		format: z.string().nullish(),
	})
	.loose();

const IdentitySectionSchema = z
	.object({
		logos: z.array(LogoSchema).nullish(),
		logo_svg: z
			.object({
				svg: z.string().nullish(),
				type: z.string().nullish(),
				theme: z.string().nullish(),
			})
			.loose()
			.nullish(),
		icon: z
			.object({
				url: z.string().nullish(),
				format: z.string().nullish(),
			})
			.loose()
			.nullish(),
		colors: z
			.array(
				z
					.object({
						hex: z.string().nullish(),
						role: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		fonts: z
			.array(
				z
					.object({
						family: z.string().nullish(),
						role: z.string().nullish(),
						weights: z.array(z.number()).nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

const PositioningSectionSchema = z
	.object({
		value_proposition: z.string().nullish(),
		market_position: z.string().nullish(),
		differentiators: z.array(z.string()).nullish(),
	})
	.loose();

const MessagingSectionSchema = z
	.object({
		key_messages: z.array(z.string()).nullish(),
		themes: z.array(z.string()).nullish(),
		claims: z.array(z.string()).nullish(),
		common_phrases: z.array(z.string()).nullish(),
	})
	.loose();

const VoiceSectionSchema = z
	.object({
		traits: z.array(z.string()).nullish(),
		description: z.string().nullish(),
		formality: z.number().nullish(),
		technicality: z.number().nullish(),
		energy: z.number().nullish(),
		do: z.array(z.string()).nullish(),
		avoid: z.array(z.string()).nullish(),
	})
	.loose();

const VisualSectionSchema = z
	.object({
		style: z.string().nullish(),
		imagery: z.string().nullish(),
		ui_style: z.string().nullish(),
	})
	.loose();

const LinksSectionSchema = z
	.object({
		website: z.string().nullish(),
		about: z.string().nullish(),
		socials: z.record(z.string(), z.string()).nullish(),
		brand_assets: z.union([z.string(), z.array(z.string())]).nullish(),
		pricing: z.string().nullish(),
	})
	.loose();

const BrandAnalyzeResponseSchema = z
	.object({
		brand: BrandSectionSchema.nullish(),
		identity: IdentitySectionSchema.nullish(),
		products: z
			.array(
				z
					.object({
						name: z.string().nullish(),
						description: z.string().nullish(),
						url: z.string().nullish(),
						category: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		audiences: z
			.array(
				z
					.object({
						name: z.string().nullish(),
						description: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		positioning: PositioningSectionSchema.nullish(),
		messaging: MessagingSectionSchema.nullish(),
		voice: VoiceSectionSchema.nullish(),
		visual: VisualSectionSchema.nullish(),
		links: LinksSectionSchema.nullish(),
		// unknown: keyed by the caller's question keys.
		custom: z.record(z.string(), z.unknown()).nullish(),
		// unknown: provenance entries vary by field path.
		_meta: z.record(z.string(), z.unknown()).nullish(),
		is_cache: z.boolean().nullish(),
	})
	.loose();

export type BrandAnalyzeResponse = z.infer<typeof BrandAnalyzeResponseSchema>;

// ── registry ───────────────────────────────────────────────────────────────

export type OpengraphEndpointInputs = {
	siteGet: SiteGetInput;
	scrapeFetch: ScrapeFetchInput;
	screenshotCapture: ScreenshotCaptureInput;
	extractRun: ExtractRunInput;
	queryRun: QueryRunInput;
	oembedGet: OembedGetInput;
	markdownGet: MarkdownGetInput;
	brandAnalyze: BrandAnalyzeInput;
};

export type OpengraphEndpointOutputs = {
	siteGet: SiteGetResponse;
	scrapeFetch: ScrapeFetchResponse;
	screenshotCapture: ScreenshotCaptureResponse;
	extractRun: ExtractRunResponse;
	queryRun: QueryRunResponse;
	oembedGet: OembedGetResponse;
	markdownGet: MarkdownGetResponse;
	brandAnalyze: BrandAnalyzeResponse;
};

export const OpengraphEndpointInputSchemas = {
	siteGet: SiteGetInputSchema,
	scrapeFetch: ScrapeFetchInputSchema,
	screenshotCapture: ScreenshotCaptureInputSchema,
	extractRun: ExtractRunInputSchema,
	queryRun: QueryRunInputSchema,
	oembedGet: OembedGetInputSchema,
	markdownGet: MarkdownGetInputSchema,
	brandAnalyze: BrandAnalyzeInputSchema,
} as const;

export const OpengraphEndpointOutputSchemas = {
	siteGet: SiteGetResponseSchema,
	scrapeFetch: ScrapeFetchResponseSchema,
	screenshotCapture: ScreenshotCaptureResponseSchema,
	extractRun: ExtractRunResponseSchema,
	queryRun: QueryRunResponseSchema,
	oembedGet: OembedGetResponseSchema,
	markdownGet: MarkdownGetResponseSchema,
	brandAnalyze: BrandAnalyzeResponseSchema,
} as const;
