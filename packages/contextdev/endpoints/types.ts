import { z } from 'zod';

// Schemas follow the Context.dev OpenAPI description:
// https://docs.context.dev/openapi.json
// z.unknown() appears only where the caller defines the shape (a JSON Schema
// for extraction) or the page does (JSON-LD blocks).

const Tags = z.array(z.string().min(1).max(50)).max(20);

const Zdr = z.enum(['enabled', 'disabled']);

const Timeout = z.object({
	milliseconds: z.number().int().min(1000).max(300000),
	behavior: z.enum(['fail', 'return-partial']).optional(),
});

const ScrapeTimeout = Timeout.extend({
	milliseconds: z.number().int().min(1).max(300000),
});

const MaxAgeMs = z.number().int().min(0).nullable();

const KeyMetadata = z.object({
	credits_consumed: z.number(),
	credits_remaining: z.number(),
});

const CacheMetadata = z.object({
	status: z.enum(['hit', 'miss', 'zdr']),
	age_ms: z.number(),
});

const Billing = {
	key_metadata: KeyMetadata.optional(),
	request_id: z.string(),
};

const DomOrUrl = {
	domain: z.string().min(3).optional(),
	directUrl: z.url().optional(),
};

const domainXorUrl = (input: { domain?: string; directUrl?: string }) =>
	(input.domain === undefined) !== (input.directUrl === undefined);

const domainXorUrlMessage = { message: 'Provide either domain or directUrl' };

const PdfOptions = z.object({
	shouldParse: z.boolean().optional(),
	start: z.number().int().min(1).optional(),
	end: z.number().int().min(1).optional(),
});

const CountryCode = z
	.string()
	.regex(/^[A-Za-z]{2}$/, 'Expected an ISO 3166-1 alpha-2 code');

// Brand

const BrandLookupOptions = {
	force_language: z.string().min(1).nullable().optional(),
	maxSpeed: z.boolean().optional(),
	maxAgeMs: z.number().int().min(0).optional(),
	timeoutOpts: Timeout.optional(),
	tags: Tags.optional(),
};

const BrandRetrieveInputSchema = z.discriminatedUnion('type', [
	z.object({
		type: z.literal('by_domain'),
		domain: z.string().min(3),
		...BrandLookupOptions,
	}),
	z.object({
		type: z.literal('by_name'),
		name: z.string().min(3).max(30),
		country_gl: z.string().length(2).optional(),
		...BrandLookupOptions,
	}),
	z.object({
		type: z.literal('by_email'),
		email: z.string().min(1),
		...BrandLookupOptions,
	}),
	z.object({
		type: z.literal('by_ticker'),
		ticker: z.string().min(1).max(15),
		ticker_exchange: z.string().optional(),
		...BrandLookupOptions,
	}),
	z.object({
		type: z.literal('by_direct_url'),
		direct_url: z.url(),
		timeoutOpts: Timeout.optional(),
		tags: Tags.optional(),
	}),
	z.object({
		type: z.literal('by_transaction'),
		transaction_info: z.string().min(3).max(500),
		country_gl: z.string().length(2).optional(),
		city: z.string().optional(),
		mcc: z.union([z.string(), z.number()]).optional(),
		phone: z.union([z.string(), z.number()]).optional(),
		high_confidence_only: z.boolean().optional(),
		...BrandLookupOptions,
	}),
]);

const ColorRef = z.object({
	hex: z.string().optional(),
	name: z.string().optional(),
});

const Resolution = z.object({
	width: z.number().optional(),
	height: z.number().optional(),
	aspect_ratio: z.number().optional(),
});

export const BrandSchema = z.object({
	domain: z.string().optional(),
	title: z.string().optional(),
	description: z.string().optional(),
	slogan: z.string().optional(),
	colors: z
		.array(ColorRef.extend({ source: z.enum(['site', 'logo']).optional() }))
		.optional(),
	logos: z
		.array(
			z.object({
				url: z.string().optional(),
				mode: z.enum(['light', 'dark', 'has_opaque_background']).optional(),
				colors: z.array(ColorRef).optional(),
				resolution: Resolution.optional(),
				type: z.enum(['icon', 'logo']).optional(),
			}),
		)
		.optional(),
	backdrops: z
		.array(
			z.object({
				url: z.string().optional(),
				colors: z.array(ColorRef).optional(),
				resolution: Resolution.optional(),
			}),
		)
		.optional(),
	socials: z
		.array(
			z.object({ type: z.string().optional(), url: z.string().optional() }),
		)
		.optional(),
	address: z
		.object({
			street: z.string().optional(),
			city: z.string().optional(),
			country: z.string().optional(),
			country_code: z.string().optional(),
			state_province: z.string().optional(),
			state_code: z.string().optional(),
			postal_code: z.string().optional(),
		})
		.optional(),
	stock: z
		.object({ ticker: z.string().optional(), exchange: z.string().optional() })
		.optional(),
	employees: z
		.object({ range: z.string().optional(), exact: z.number().optional() })
		.optional(),
	is_nsfw: z.boolean().optional(),
	email: z.string().optional(),
	phone: z.string().optional(),
	industries: z
		.object({
			eic: z
				.array(z.object({ industry: z.string(), subindustry: z.string() }))
				.optional(),
		})
		.optional(),
	links: z
		.object({
			careers: z.string().nullable().optional(),
			privacy: z.string().nullable().optional(),
			terms: z.string().nullable().optional(),
			contact: z.string().nullable().optional(),
			blog: z.string().nullable().optional(),
			pricing: z.string().nullable().optional(),
		})
		.optional(),
	primary_language: z.string().nullable().optional(),
});

export type Brand = z.infer<typeof BrandSchema>;

const BrandRetrieveResponseSchema = z.object({
	partial: z.boolean().optional(),
	status: z.string(),
	brand: BrandSchema,
	code: z.number(),
	cache_metadata: CacheMetadata,
	...Billing,
});

const BrandSearchInputSchema = z.object({
	query: z.string().min(1).max(100),
	autocomplete: z.boolean().optional(),
	queryBy: z
		.array(z.enum(['name', 'domain']))
		.min(1)
		.optional(),
	typoTolerance: z.number().int().min(0).max(2).optional(),
	tags: Tags.optional(),
});

const BrandSearchResponseSchema = z.object({
	results: z
		.array(z.object({ domain: z.string(), name: z.string(), logo: z.string() }))
		.max(10),
	...Billing,
});

const Typography = z.object({
	fontFamily: z.string(),
	fontFallbacks: z.array(z.string()),
	fontSize: z.string(),
	fontWeight: z.number(),
	lineHeight: z.string(),
	letterSpacing: z.string(),
});

const ButtonStyle = z.object({
	backgroundColor: z.string(),
	color: z.string(),
	borderColor: z.string(),
	borderRadius: z.string(),
	borderWidth: z.string(),
	borderStyle: z.string(),
	padding: z.string(),
	minWidth: z.string(),
	minHeight: z.string(),
	fontSize: z.string(),
	fontWeight: z.number(),
	fontFamily: z.string().optional(),
	fontFallbacks: z.array(z.string()).optional(),
	textDecoration: z.string(),
	textDecorationColor: z.string().optional(),
	boxShadow: z.string(),
	css: z.string(),
});

const FontLinks = z.record(
	z.string(),
	z.object({
		type: z.enum(['google', 'custom']),
		files: z.record(z.string(), z.string()),
		category: z.string().optional(),
		displayName: z.string().optional(),
	}),
);

const FinalDomState = z.enum(['loaded', 'still-loading']);

const StyleguideInputSchema = z
	.object({
		...DomOrUrl,
		maxAgeMs: MaxAgeMs.optional(),
		timeoutOpts: ScrapeTimeout.optional(),
		colorScheme: z.enum(['light', 'dark']).optional(),
		zdr: Zdr.optional(),
		tags: Tags.optional(),
	})
	.refine(domainXorUrl, domainXorUrlMessage);

const StyleguideResponseSchema = z.object({
	finalDOMState: FinalDomState.optional(),
	status: z.string().optional(),
	domain: z.string().optional(),
	styleguide: z
		.object({
			mode: z.enum(['light', 'dark']),
			colors: z.object({
				accent: z.string(),
				background: z.string(),
				text: z.string(),
			}),
			typography: z.object({
				headings: z.object({
					h1: Typography.optional(),
					h2: Typography.optional(),
					h3: Typography.optional(),
					h4: Typography.optional(),
				}),
				p: Typography.optional(),
			}),
			elementSpacing: z.object({
				xs: z.string(),
				sm: z.string(),
				md: z.string(),
				lg: z.string(),
				xl: z.string(),
			}),
			shadows: z.object({
				sm: z.string(),
				md: z.string(),
				lg: z.string(),
				xl: z.string(),
				inner: z.string(),
			}),
			fontLinks: FontLinks,
			components: z.object({
				button: z.object({
					primary: ButtonStyle.optional(),
					secondary: ButtonStyle.optional(),
					link: ButtonStyle.optional(),
				}),
				card: z
					.object({
						backgroundColor: z.string(),
						borderColor: z.string(),
						borderRadius: z.string(),
						borderWidth: z.string(),
						borderStyle: z.string(),
						padding: z.string(),
						boxShadow: z.string(),
						textColor: z.string(),
						css: z.string(),
					})
					.optional(),
			}),
		})
		.optional(),
	code: z.number().optional(),
	cache_metadata: CacheMetadata,
	...Billing,
});

const FontsInputSchema = z
	.object({
		...DomOrUrl,
		maxAgeMs: MaxAgeMs.optional(),
		timeoutOpts: ScrapeTimeout.optional(),
		tags: Tags.optional(),
	})
	.refine(domainXorUrl, domainXorUrlMessage);

const FontsResponseSchema = z.object({
	finalDOMState: FinalDomState.optional(),
	status: z.string(),
	domain: z.string(),
	fonts: z.array(
		z.object({
			font: z.string(),
			uses: z.array(z.string()),
			fallbacks: z.array(z.string()),
			num_elements: z.number(),
			num_words: z.number(),
			percent_words: z.number(),
			percent_elements: z.number(),
		}),
	),
	fontLinks: FontLinks.optional(),
	code: z.number(),
	cache_metadata: CacheMetadata,
	...Billing,
});

const ClassifyInput = {
	input: z
		.string()
		.min(4)
		.describe('Brand domain, title, or a description of the business'),
	minResults: z.number().int().min(1).max(10).optional(),
	maxResults: z.number().int().min(1).max(10).optional(),
	timeoutOpts: Timeout.optional(),
	zdr: Zdr.optional(),
	tags: Tags.optional(),
};

const Confidence = z.enum(['high', 'medium', 'low']);

const ClassifyResponse = {
	partial: z.boolean().optional(),
	status: z.string().optional(),
	domain: z.string().optional(),
	type: z.string().optional(),
	...Billing,
};

const NaicsInputSchema = z.object(ClassifyInput);

const NaicsResponseSchema = z.object({
	...ClassifyResponse,
	codes: z
		.array(
			z.object({ code: z.string(), name: z.string(), confidence: Confidence }),
		)
		.optional(),
});

const SicType = z.enum(['original_sic', 'latest_sec']);

const SicInputSchema = z.object({ ...ClassifyInput, type: SicType.optional() });

const SicResponseSchema = z.object({
	...ClassifyResponse,
	classification: SicType.optional(),
	codes: z
		.array(
			z.object({
				code: z.string(),
				name: z.string(),
				confidence: Confidence,
				majorGroup: z.string().optional(),
				majorGroupName: z.string().optional(),
				office: z.string().optional(),
			}),
		)
		.optional(),
});

const PrefetchInputSchema = z.object({
	type: z.enum(['brand', 'styleguide']),
	identifier: z.union([
		z.object({ domain: z.string().min(3) }),
		z.object({ email: z.string().min(1) }),
	]),
	timeoutOpts: Timeout.extend({
		behavior: z.literal('fail').optional(),
	}).optional(),
	tags: Tags.optional(),
});

const PrefetchResponseSchema = z.object({
	status: z.string().optional(),
	message: z.string().optional(),
	type: z.enum(['brand', 'styleguide']).optional(),
	domain: z.string().optional(),
	...Billing,
});

// Web

const PageMetadataValue = z.union([z.string(), z.array(z.string())]);

const PageMetadata = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
	language: z.string().optional(),
	keywords: z.array(z.string()).optional(),
	canonicalUrl: z.string().optional(),
	author: z.string().optional(),
	siteName: z.string().optional(),
	image: z.string().optional(),
	favicon: z.string().optional(),
	publishedTime: z.string().optional(),
	modifiedTime: z.string().optional(),
	robots: z.string().optional(),
	openGraph: z.record(z.string(), PageMetadataValue).optional(),
	twitter: z.record(z.string(), PageMetadataValue).optional(),
	alternates: z
		.array(
			z.object({
				href: z.string(),
				hreflang: z.string().optional(),
				type: z.string().optional(),
				title: z.string().optional(),
			}),
		)
		.optional(),
	headings: z
		.array(
			z.object({ level: z.number().int().min(1).max(6), text: z.string() }),
		)
		.optional(),
	// unknown: JSON-LD blocks are whatever structured data the page publishes.
	jsonLd: z.array(z.record(z.string(), z.unknown())).optional(),
	additionalMeta: z.record(z.string(), PageMetadataValue).optional(),
});

const ScrapeAction = z.discriminatedUnion('type', [
	z.object({ type: z.literal('perform'), action: z.string().min(1).max(500) }),
	z.object({
		type: z.literal('scroll'),
		direction: z.enum(['down', 'up', 'left', 'right']).optional(),
		amount: z
			.union([z.number().int().min(1).max(100000), z.enum(['viewport', 'max'])])
			.optional(),
		selector: z.string().max(2000).optional(),
		maxScrolls: z.number().int().min(1).max(50).optional(),
	}),
	z.object({
		type: z.literal('wait'),
		milliseconds: z.number().int().min(0).max(30000),
	}),
	z.object({ type: z.literal('waitFor'), selector: z.string().max(2048) }),
]);

const Selectors = z.array(z.string().max(2048)).min(1).max(50);

const ScrapeFormats = z
	.object({
		html: z.boolean().optional(),
		markdown: z.boolean().optional(),
		screenshot: z.boolean().optional(),
		images: z.boolean().optional(),
		highlights: z.boolean().optional(),
		json: z.boolean().optional(),
	})
	.refine((formats) => Object.values(formats).some(Boolean), {
		message: 'Enable at least one format',
	});

const ScrapeInputSchema = z
	.object({
		url: z.url(),
		formats: ScrapeFormats,
		markdownParams: z
			.object({
				includeLinks: z.boolean().optional(),
				includeImages: z.boolean().optional(),
				inlineImages: z.enum(['placeholder', 'preserve']).optional(),
			})
			.optional(),
		screenshotParams: z
			.object({
				area: z
					.union([
						z.enum(['viewport', 'fullPage']),
						z.object({ selector: z.string().min(1).max(2048) }),
						z.object({
							x: z.number().int().min(0).max(100000),
							y: z.number().int().min(0).max(100000),
							width: z.number().int().min(1).max(7680),
							height: z.number().int().min(1).max(100000),
						}),
					])
					.optional(),
				format: z.enum(['png', 'jpeg', 'webp']).optional(),
			})
			.optional(),
		imageParams: z
			.object({
				enrich: z
					.array(z.enum(['dimensions', 'classification', 'file']))
					.min(1)
					.max(3)
					.optional(),
				dedupe: z.enum(['none', 'visual']).optional(),
			})
			.optional(),
		highlightsParams: z
			.object({
				query: z.string().min(1).max(2000),
				maxCharacters: z.number().int().min(100).max(20000).optional(),
			})
			.optional(),
		jsonParams: z
			.object({
				// unknown: a JSON Schema the caller writes for the fields to extract.
				schema: z.record(z.string(), z.unknown()),
				instructions: z.string().max(2000).optional(),
			})
			.optional(),
		sharedParams: z
			.object({
				country: CountryCode.optional(),
				headers: z.record(z.string(), z.string().max(8192)).optional(),
				viewport: z
					.object({
						width: z.number().int().min(240).max(7680).optional(),
						height: z.number().int().min(240).max(4320).optional(),
					})
					.optional(),
				theme: z.enum(['light', 'dark']).optional(),
				dismissCookies: z.boolean().optional(),
				dismissPopups: z.boolean().optional(),
				actions: z.array(ScrapeAction).min(1).max(5).optional(),
				waitFor: z
					.union([z.number().int().min(0).max(30000), z.string().max(2048)])
					.optional(),
				settleAnimations: z.boolean().optional(),
				mainContentOnly: z.boolean().optional(),
				includeSelectors: Selectors.optional(),
				excludeSelectors: Selectors.optional(),
				includeFrames: z.boolean().optional(),
			})
			.optional(),
		maxAgeMs: z.number().int().min(0).max(31536000000).optional(),
		timeoutOpts: ScrapeTimeout.optional(),
		zdr: Zdr.optional(),
		tags: Tags.optional(),
	})
	.refine((input) => !input.markdownParams || input.formats.markdown, {
		message: 'markdownParams requires formats.markdown',
	})
	.refine((input) => !input.screenshotParams || input.formats.screenshot, {
		message: 'screenshotParams requires formats.screenshot',
	})
	.refine((input) => !input.imageParams || input.formats.images, {
		message: 'imageParams requires formats.images',
	})
	.refine((input) => !input.formats.highlights || input.highlightsParams, {
		message: 'formats.highlights requires highlightsParams',
	})
	.refine((input) => !input.formats.json || input.jsonParams, {
		message: 'formats.json requires jsonParams',
	});

function scrapeOutput<T extends z.ZodType>(data: T) {
	return z.object({
		requested: z.boolean(),
		success: z.boolean().nullable(),
		data: data.nullable(),
		error_code: z.string().optional(),
		message: z.string().optional(),
	});
}

const ScrapeImage = z.object({
	url: z.string(),
	alt: z.string().nullable(),
	width: z.number().optional(),
	height: z.number().optional(),
	classification: z
		.enum([
			'photography',
			'illustration',
			'logo',
			'wordmark',
			'icon',
			'pattern',
			'graphic',
			'other',
		])
		.optional(),
	fileUrl: z.string().optional(),
});

const ScrapeResponseSchema = z.object({
	url: z.string(),
	html: scrapeOutput(z.string()),
	markdown: scrapeOutput(z.string()),
	screenshot: scrapeOutput(z.string()),
	images: scrapeOutput(z.array(ScrapeImage)),
	highlights: scrapeOutput(z.array(z.string())),
	// unknown: the object follows the JSON Schema sent in jsonParams.
	json: scrapeOutput(z.record(z.string(), z.unknown())).extend({
		isTruncated: z.literal(true).optional(),
	}),
	isPartial: z.literal(true).optional(),
	metadata: PageMetadata,
	cache_metadata: CacheMetadata,
	...Billing,
});

const UrlsInputSchema = z.object({
	domain: z.string().min(3),
	includeSubdomains: z.boolean().optional(),
	maxLinks: z.number().int().min(1).max(100000).optional(),
	sitemapUrl: z.url().optional(),
	urlRegex: z.string().max(256).optional(),
	search: z.string().min(2).max(200).optional(),
	timeoutOpts: ScrapeTimeout.optional(),
	zdr: Zdr.optional(),
	tags: Tags.optional(),
});

const UrlsResponseSchema = z.object({
	success: z.literal(true),
	domain: z.string(),
	urls: z.array(
		z.object({
			url: z.string(),
			title: z.string().optional(),
			description: z.string().optional(),
			keywords: z.array(z.string()).optional(),
			language: z.string().optional(),
		}),
	),
	partial: z.boolean().optional(),
	...Billing,
});

const CrawlScope = {
	maxDepth: z.number().int().min(0).optional(),
	followSubdomains: z.boolean().optional(),
	includeFrames: z.boolean().optional(),
	maxAgeMs: MaxAgeMs.optional(),
	waitForMs: z.number().int().min(0).nullable().optional(),
	settleAnimations: z.boolean().optional(),
	stopAfterMs: z.number().int().min(10000).max(110000).optional(),
	timeoutOpts: Timeout.optional(),
	zdr: Zdr.optional(),
	tags: Tags.optional(),
};

const CrawlInputSchema = z.object({
	url: z.string().min(1),
	maxPages: z.number().int().min(1).max(500).optional(),
	urlRegex: z.string().max(256).optional(),
	includeLinks: z.boolean().optional(),
	includeImages: z.boolean().optional(),
	shortenBase64Images: z.boolean().optional(),
	useMainContentOnly: z.boolean().optional(),
	pdf: PdfOptions.extend({ ocr: z.boolean().optional() }).optional(),
	includeSelectors: Selectors.nullable().optional(),
	excludeSelectors: Selectors.nullable().optional(),
	country: z.string().length(2).optional(),
	...CrawlScope,
});

const CrawlStats = {
	numUrls: z.number(),
	maxCrawlDepth: z.number(),
	numSucceeded: z.number(),
	numFailed: z.number(),
	numSkipped: z.number(),
};

const CrawlResponseSchema = z.object({
	partial: z.boolean().optional(),
	results: z.array(
		z.object({
			markdown: z.string(),
			metadata: PageMetadata.extend({
				sourceUrl: z.string(),
				finalUrl: z.string(),
				url: z.string(),
				title: z.string(),
				crawlDepth: z.number(),
				statusCode: z.number(),
				success: z.boolean(),
			}),
		}),
	),
	metadata: z.object(CrawlStats),
	cache_metadata: CacheMetadata,
	...Billing,
});

const LegacyAction = z.discriminatedUnion('do', [
	z.object({
		do: z.literal('wait'),
		timeMs: z.number().int().min(0).max(30000),
	}),
	z.object({ do: z.literal('perform'), action: z.string().min(1).max(500) }),
	z.object({
		do: z.literal('scroll'),
		direction: z.enum(['up', 'down', 'left', 'right']).optional(),
		amount: z
			.union([z.number().int().min(1).max(100000), z.enum(['viewport', 'max'])])
			.optional(),
		container: z.string().min(1).max(2000).optional(),
		maxScrolls: z.number().int().min(1).max(50).optional(),
	}),
]);

const ExtractInputSchema = z.object({
	url: z.string().min(1),
	// unknown: a JSON Schema the caller writes for the fields to extract.
	schema: z.record(z.string(), z.unknown()),
	instructions: z.string().max(2000).optional(),
	factCheck: z.boolean().optional(),
	maxPages: z.number().int().min(1).max(50).optional(),
	pdf: PdfOptions.optional(),
	actions: z.array(LegacyAction).nullable().optional(),
	...CrawlScope,
});

const ExtractResponseSchema = z.object({
	partial: z.boolean().optional(),
	status: z.string(),
	url: z.string(),
	urls_analyzed: z.array(z.string()),
	// unknown: the object follows the JSON Schema sent in the request.
	data: z.record(z.string(), z.unknown()),
	metadata: z.object({
		...CrawlStats,
		numBlocked: z.number(),
		actionsApplied: z
			.array(
				z.object({
					instruction: z.string(),
					status: z.enum(['applied', 'failed', 'skipped']),
					method: z.string().optional(),
					targetDescription: z.string().optional(),
					completionEvidence: z.string().optional(),
					error: z.string().optional(),
					durationMs: z.number().optional(),
				}),
			)
			.optional(),
	}),
	cache_metadata: CacheMetadata,
	...Billing,
});

const ContentCode = z.enum([
	'SUCCESS',
	'NOT_REQUESTED',
	'TIMEOUT',
	'CONTENT_TOO_LARGE',
	'WEBSITE_ACCESS_ERROR',
	'WEBSITE_BLOCKED',
	'ERROR',
]);

const WebSearchInputSchema = z.object({
	query: z.string().min(1).max(500),
	numResults: z.number().int().min(1).max(100).optional(),
	includeDomains: z.array(z.string().min(3)).max(100).optional(),
	excludeDomains: z.array(z.string().min(3)).max(100).optional(),
	freshness: z
		.enum(['last_24_hours', 'last_week', 'last_month', 'last_year'])
		.optional(),
	country: z.string().length(2).optional(),
	queryFanout: z.boolean().optional(),
	markdownOptions: z
		.object({
			enabled: z.boolean().optional(),
			includeLinks: z.boolean().optional(),
			includeImages: z.boolean().optional(),
			shortenBase64Images: z.boolean().optional(),
			useMainContentOnly: z.boolean().optional(),
			pdf: PdfOptions.optional(),
			includeFrames: z.boolean().optional(),
			maxAgeMs: MaxAgeMs.optional(),
			waitForMs: z.number().int().min(0).nullable().optional(),
			timeoutOpts: ScrapeTimeout.optional(),
		})
		.nullable()
		.optional(),
	highlightsOptions: z
		.object({
			enabled: z.boolean().optional(),
			maxCharacters: z.number().int().min(100).max(20000).optional(),
		})
		.nullable()
		.optional(),
	descriptionMaxCharacters: z.number().int().min(1).nullable().optional(),
	timeoutOpts: Timeout.optional(),
	zdr: Zdr.optional(),
	tags: Tags.optional(),
});

const WebSearchResponseSchema = z.object({
	partial: z.boolean().optional(),
	query: z.string(),
	results: z.array(
		z.object({
			url: z.string(),
			title: z.string(),
			description: z.string(),
			relevance: Confidence,
			markdown: z.object({
				finalDOMState: FinalDomState.optional(),
				markdown: z.string().nullable(),
				code: ContentCode,
			}),
			highlights: z.object({
				highlights: z.array(z.string()).nullable(),
				code: ContentCode,
			}),
		}),
	),
	cache_metadata: CacheMetadata,
	...Billing,
});

const AnswersInputSchema = z.object({
	task: z.string().min(1).max(2000),
	mode: z.enum(['fast', 'ultra']).optional(),
	// unknown: an example JSON object describing the answer shape the caller wants.
	json_format: z.record(z.string(), z.unknown()).optional(),
	timeoutOpts: Timeout.optional(),
	zdr: Zdr.optional(),
	tags: Tags.optional(),
});

const AnswersResponseSchema = z.object({
	partial: z.boolean().optional(),
	// unknown: the answer follows the caller's json_format.
	json_content: z.record(z.string(), z.unknown()),
	sources: z.array(z.string()),
	key_metadata: KeyMetadata.optional(),
});

// News

const NewsEntity = z.discriminatedUnion('type', [
	z.object({ type: z.literal('name'), name: z.string().min(2).max(200) }),
	z.object({ type: z.literal('domain'), domain: z.string().min(1).max(253) }),
	z.object({
		type: z.literal('ticker'),
		ticker: z.string().min(1).max(20),
		exchange: z.string().optional(),
	}),
	z.object({ type: z.literal('isin'), isin: z.string().length(12) }),
]);

const NewsArticleType = z.enum([
	'editorial',
	'press_release',
	'regulatory_filing',
	'advisory',
]);

const NewsSearchInputSchema = z.object({
	searchBy: z.object({ type: z.literal('entity'), entity: NewsEntity }),
	filterBy: z
		.object({
			sourceDomain: z
				.array(z.string().min(1).max(253))
				.min(1)
				.max(3)
				.optional(),
			sourceCountry: z.array(z.string().length(2)).min(1).max(3).optional(),
			articleLanguage: z.array(z.string().length(2)).min(1).max(3).optional(),
			articleType: z.array(NewsArticleType).min(1).max(3).optional(),
			date: z
				.object({
					from: z.number().int().optional(),
					to: z.number().int().optional(),
				})
				.optional(),
		})
		.refine(
			(filter) =>
				[
					filter.sourceDomain,
					filter.sourceCountry,
					filter.articleLanguage,
					filter.articleType,
				].filter(Boolean).length <= 1,
			{
				message:
					'Use at most one of sourceDomain, sourceCountry, articleLanguage, or articleType',
			},
		)
		.optional(),
	sortBy: z.object({ type: z.enum(['relevance', 'newest']) }).optional(),
	limit: z.number().int().min(1).max(100).optional(),
	cursor: z.string().nullable().optional(),
	tags: Tags.optional(),
});

export const NewsArticleSchema = z.object({
	id: z.string(),
	story_id: z.string(),
	url: z.string(),
	title: z.string(),
	description: z.string().nullable(),
	language: z.string().nullable(),
	authors: z.array(z.string()),
	image_url: z.string().nullable(),
	published_at: z.string().nullable(),
	type: NewsArticleType,
	source: z.object({
		name: z.string(),
		domain: z.string(),
		direct: z.boolean(),
	}),
	match: z.object({
		level: z.enum(['primary', 'secondary']),
		confidence: z.number().nullable(),
	}),
});

export type NewsArticle = z.infer<typeof NewsArticleSchema>;

const NewsSearchResponseSchema = z.object({
	data: z.array(NewsArticleSchema),
	has_more: z.boolean(),
	next_cursor: z.string().nullable(),
	meta: z.object({ count: z.number() }),
	...Billing,
});

// People

const NamedEntity = z.object({
	name: z.string().min(1).max(200).optional(),
	domain: z.string().min(1).max(253).optional(),
});

const PeopleEnrichInputSchema = z
	.object({
		social_urls: z.array(z.url()).min(1).max(20).optional(),
		name: z
			.object({
				first: z.string().min(1).max(100).optional(),
				last: z.string().min(1).max(100).optional(),
			})
			.optional(),
		email: z.string().max(320).optional(),
		company: NamedEntity.optional(),
		education: z
			.array(
				z.object({
					institution: NamedEntity.optional(),
					degree: z.string().min(1).max(200).optional(),
					field_of_study: z.string().min(1).max(200).optional(),
					graduation_year: z.number().int().min(1900).max(2200).optional(),
				}),
			)
			.min(1)
			.max(10)
			.optional(),
		location: z
			.object({
				city: z.string().min(1).max(200).optional(),
				region: z.string().min(1).max(200).optional(),
				country: z.string().min(1).max(200).optional(),
			})
			.optional(),
		timeoutOpts: Timeout.optional(),
		zdr: Zdr.optional(),
		tags: Tags.optional(),
	})
	.refine(
		(input) =>
			input.email !== undefined ||
			input.social_urls !== undefined ||
			input.name !== undefined,
		{ message: 'Provide an email, social_urls, or a name' },
	);

const PartialDate = z.object({
	year: z.number().int(),
	month: z.number().int().min(1).max(12).optional(),
	day: z.number().int().min(1).max(31).optional(),
});

const Role = z.object({
	title: z.string(),
	organization: z.object({ name: z.string(), domain: z.string().optional() }),
	location: z.string().optional(),
	description: z.string().optional(),
	start_date: PartialDate.optional(),
	end_date: PartialDate.optional(),
	is_current: z.boolean().optional(),
});

export const PersonSchema = z.object({
	name: z
		.object({
			full: z.string().optional(),
			first: z.string().optional(),
			last: z.string().optional(),
		})
		.optional(),
	email: z.string().optional(),
	avatar_url: z.string().optional(),
	bio: z.string().optional(),
	location: z
		.object({
			display: z.string().optional(),
			city: z.string().optional(),
			region: z.string().optional(),
			country: z.string().optional(),
			country_code: z.string().optional(),
		})
		.optional(),
	social_urls: z.array(z.string()),
	website_urls: z.array(z.string()),
	current_role: Role.optional(),
	current_role_status: z.enum(['present', 'none', 'unknown']),
	experience: z.array(Role),
	education: z.array(
		z.object({
			institution: z.object({
				name: z.string(),
				domain: z.string().optional(),
			}),
			degree: z.string().optional(),
			field_of_study: z.string().optional(),
			description: z.string().optional(),
			start_date: PartialDate.optional(),
			end_date: PartialDate.optional(),
		}),
	),
	skills: z.array(z.string()),
	last_updated: z.string().optional(),
	checked_at: z.string().optional(),
});

export type Person = z.infer<typeof PersonSchema>;

const PeopleEnrichResponseSchema = z.object({
	partial: z.boolean().optional(),
	match: z.discriminatedUnion('status', [
		z.object({
			status: z.literal('candidate'),
			score: z.number().int().min(0).max(100),
			person: PersonSchema,
		}),
		z.object({
			status: z.literal('not_found'),
			score: z.null(),
			person: z.null(),
		}),
	]),
	...Billing,
});

// Account

const UsageInputSchema = z.object({});

const UsageResponseSchema = z.object({
	credits_remaining: z.number(),
	period: z.object({ start: z.string(), credits_used: z.number() }).nullable(),
	next_refill: z.object({ at: z.string(), credits: z.number() }).nullable(),
	auto_topup: z.object({
		enabled: z.boolean(),
		credits_used_this_period: z.number(),
		monthly_budget_credits: z.number().nullable(),
	}),
	...Billing,
});

export type BrandRetrieveInput = z.infer<typeof BrandRetrieveInputSchema>;
export type BrandRetrieveResponse = z.infer<typeof BrandRetrieveResponseSchema>;
export type BrandSearchInput = z.infer<typeof BrandSearchInputSchema>;
export type BrandSearchResponse = z.infer<typeof BrandSearchResponseSchema>;
export type StyleguideInput = z.infer<typeof StyleguideInputSchema>;
export type StyleguideResponse = z.infer<typeof StyleguideResponseSchema>;
export type FontsInput = z.infer<typeof FontsInputSchema>;
export type FontsResponse = z.infer<typeof FontsResponseSchema>;
export type NaicsInput = z.infer<typeof NaicsInputSchema>;
export type NaicsResponse = z.infer<typeof NaicsResponseSchema>;
export type SicInput = z.infer<typeof SicInputSchema>;
export type SicResponse = z.infer<typeof SicResponseSchema>;
export type PrefetchInput = z.infer<typeof PrefetchInputSchema>;
export type PrefetchResponse = z.infer<typeof PrefetchResponseSchema>;
export type ScrapeInput = z.infer<typeof ScrapeInputSchema>;
export type ScrapeResponse = z.infer<typeof ScrapeResponseSchema>;
export type UrlsInput = z.infer<typeof UrlsInputSchema>;
export type UrlsResponse = z.infer<typeof UrlsResponseSchema>;
export type CrawlInput = z.infer<typeof CrawlInputSchema>;
export type CrawlResponse = z.infer<typeof CrawlResponseSchema>;
export type ExtractInput = z.infer<typeof ExtractInputSchema>;
export type ExtractResponse = z.infer<typeof ExtractResponseSchema>;
export type WebSearchInput = z.infer<typeof WebSearchInputSchema>;
export type WebSearchResponse = z.infer<typeof WebSearchResponseSchema>;
export type AnswersInput = z.infer<typeof AnswersInputSchema>;
export type AnswersResponse = z.infer<typeof AnswersResponseSchema>;
export type NewsSearchInput = z.infer<typeof NewsSearchInputSchema>;
export type NewsSearchResponse = z.infer<typeof NewsSearchResponseSchema>;
export type PeopleEnrichInput = z.infer<typeof PeopleEnrichInputSchema>;
export type PeopleEnrichResponse = z.infer<typeof PeopleEnrichResponseSchema>;
export type UsageInput = z.infer<typeof UsageInputSchema>;
export type UsageResponse = z.infer<typeof UsageResponseSchema>;

export type ContextDevEndpointInputs = {
	brandRetrieve: BrandRetrieveInput;
	brandSearch: BrandSearchInput;
	brandStyleguide: StyleguideInput;
	brandFonts: FontsInput;
	brandNaics: NaicsInput;
	brandSic: SicInput;
	brandPrefetch: PrefetchInput;
	webScrape: ScrapeInput;
	webUrls: UrlsInput;
	webCrawl: CrawlInput;
	webExtract: ExtractInput;
	webSearch: WebSearchInput;
	webAnswers: AnswersInput;
	newsSearch: NewsSearchInput;
	peopleEnrich: PeopleEnrichInput;
	accountUsage: UsageInput;
};

export type ContextDevEndpointOutputs = {
	brandRetrieve: BrandRetrieveResponse;
	brandSearch: BrandSearchResponse;
	brandStyleguide: StyleguideResponse;
	brandFonts: FontsResponse;
	brandNaics: NaicsResponse;
	brandSic: SicResponse;
	brandPrefetch: PrefetchResponse;
	webScrape: ScrapeResponse;
	webUrls: UrlsResponse;
	webCrawl: CrawlResponse;
	webExtract: ExtractResponse;
	webSearch: WebSearchResponse;
	webAnswers: AnswersResponse;
	newsSearch: NewsSearchResponse;
	peopleEnrich: PeopleEnrichResponse;
	accountUsage: UsageResponse;
};

export const ContextDevEndpointInputSchemas = {
	brandRetrieve: BrandRetrieveInputSchema,
	brandSearch: BrandSearchInputSchema,
	brandStyleguide: StyleguideInputSchema,
	brandFonts: FontsInputSchema,
	brandNaics: NaicsInputSchema,
	brandSic: SicInputSchema,
	brandPrefetch: PrefetchInputSchema,
	webScrape: ScrapeInputSchema,
	webUrls: UrlsInputSchema,
	webCrawl: CrawlInputSchema,
	webExtract: ExtractInputSchema,
	webSearch: WebSearchInputSchema,
	webAnswers: AnswersInputSchema,
	newsSearch: NewsSearchInputSchema,
	peopleEnrich: PeopleEnrichInputSchema,
	accountUsage: UsageInputSchema,
} as const;

export const ContextDevEndpointOutputSchemas = {
	brandRetrieve: BrandRetrieveResponseSchema,
	brandSearch: BrandSearchResponseSchema,
	brandStyleguide: StyleguideResponseSchema,
	brandFonts: FontsResponseSchema,
	brandNaics: NaicsResponseSchema,
	brandSic: SicResponseSchema,
	brandPrefetch: PrefetchResponseSchema,
	webScrape: ScrapeResponseSchema,
	webUrls: UrlsResponseSchema,
	webCrawl: CrawlResponseSchema,
	webExtract: ExtractResponseSchema,
	webSearch: WebSearchResponseSchema,
	webAnswers: AnswersResponseSchema,
	newsSearch: NewsSearchResponseSchema,
	peopleEnrich: PeopleEnrichResponseSchema,
	accountUsage: UsageResponseSchema,
} as const;
