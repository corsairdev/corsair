import { z } from 'zod';

/** Recursive JSON accepted by Browser Run's caller-defined option objects. */
export type JsonValue =
	| string
	| number
	| boolean
	| null
	| JsonValue[]
	| { [key: string]: JsonValue };

export const JsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
	z.union([
		z.string(),
		z.number(),
		z.boolean(),
		z.null(),
		z.array(JsonValueSchema),
		z.record(z.string(), JsonValueSchema),
	]),
);

export const JsonObjectSchema = z.record(z.string(), JsonValueSchema);

const ResourceTypeSchema = z.enum([
	'document',
	'stylesheet',
	'image',
	'media',
	'font',
	'script',
	'texttrack',
	'xhr',
	'fetch',
	'prefetch',
	'eventsource',
	'websocket',
	'manifest',
	'signedexchange',
	'ping',
	'cspviolationreport',
	'preflight',
	'other',
]);

const WaitUntilSchema = z.enum([
	'load',
	'domcontentloaded',
	'networkidle0',
	'networkidle2',
]);

const BrowserRunCommonOptionsShape = {
	actionTimeout: z.number().max(120_000).optional(),
	addScriptTag: z
		.array(
			z.object({
				id: z.string().optional(),
				content: z.string().optional(),
				type: z.string().optional(),
				url: z.string().optional(),
			}),
		)
		.optional(),
	addStyleTag: z
		.array(
			z.object({
				content: z.string().optional(),
				url: z.string().optional(),
			}),
		)
		.optional(),
	allowRequestPattern: z.array(z.string()).optional(),
	allowResourceTypes: z.array(ResourceTypeSchema).optional(),
	authenticate: z
		.object({
			password: z.string().min(1),
			username: z.string().min(1),
		})
		.optional(),
	bestAttempt: z.boolean().optional(),
	cookies: z
		.array(
			z.object({
				name: z.string(),
				value: z.string(),
				domain: z.string().optional(),
				expires: z.number().optional(),
				httpOnly: z.boolean().optional(),
				partitionKey: z.string().optional(),
				path: z.string().optional(),
				priority: z.enum(['Low', 'Medium', 'High']).optional(),
				sameParty: z.boolean().optional(),
				sameSite: z.enum(['Strict', 'Lax', 'None']).optional(),
				secure: z.boolean().optional(),
				sourcePort: z.number().optional(),
				sourceScheme: z.enum(['Unset', 'NonSecure', 'Secure']).optional(),
				url: z.string().optional(),
			}),
		)
		.optional(),
	emulateMediaType: z.string().optional(),
	gotoOptions: z
		.object({
			referer: z.string().optional(),
			referrerPolicy: z.string().optional(),
			timeout: z.number().max(60_000).optional(),
			waitUntil: z
				.union([WaitUntilSchema, z.array(WaitUntilSchema)])
				.optional(),
		})
		.optional(),
	rejectRequestPattern: z.array(z.string()).optional(),
	rejectResourceTypes: z.array(ResourceTypeSchema).optional(),
	setExtraHTTPHeaders: z.record(z.string(), z.string()).optional(),
	setJavaScriptEnabled: z.boolean().optional(),
	viewport: z
		.object({
			height: z.number(),
			width: z.number(),
			deviceScaleFactor: z.number().optional(),
			hasTouch: z.boolean().optional(),
			isLandscape: z.boolean().optional(),
			isMobile: z.boolean().optional(),
		})
		.optional(),
	waitForSelector: z
		.object({
			selector: z.string(),
			hidden: z.literal(true).optional(),
			timeout: z.number().max(120_000).optional(),
			visible: z.literal(true).optional(),
		})
		.optional(),
	waitForTimeout: z.number().max(120_000).optional(),
};

const hasExactlyOneSource = (source: { html?: string; url?: string }) =>
	(source.url !== undefined) !== (source.html !== undefined);

const BrowserPageBodyFieldsSchema = z
	.object({
		...BrowserRunCommonOptionsShape,
		html: z.string().optional(),
		url: z.string().url().optional(),
		userAgent: z.string().optional(),
	})
	.strict();

const BrowserPageBodySchema = BrowserPageBodyFieldsSchema.refine(
	hasExactlyOneSource,
	'Provide exactly one of url or html',
);

const AccountInputShape = {
	accountId: z.string().min(1),
};

const ContentFetchInputSchema = z.object({
	...AccountInputShape,
	body: BrowserPageBodySchema,
});

const MarkdownConvertInputSchema = z.object({
	...AccountInputShape,
	body: BrowserPageBodySchema,
});

const SnapshotFormatsSchema = z.array(
	z.enum(['content', 'screenshot', 'markdown', 'accessibilityTree']),
);

const ScreenshotOptionsSchema = z
	.object({
		captureBeyondViewport: z.boolean().optional(),
		clip: z
			.object({
				height: z.number(),
				width: z.number(),
				x: z.number(),
				y: z.number(),
				scale: z.number().optional(),
			})
			.strict()
			.optional(),
		encoding: z.enum(['binary', 'base64']).optional(),
		fromSurface: z.boolean().optional(),
		fullPage: z.boolean().optional(),
		omitBackground: z.boolean().optional(),
		optimizeForSpeed: z.boolean().optional(),
		quality: z.number().optional(),
		type: z.enum(['png', 'jpeg', 'webp']).optional(),
	})
	.strict();

const SnapshotBodySchema = BrowserPageBodyFieldsSchema.extend({
	formats: SnapshotFormatsSchema.min(2).optional(),
	screenshotOptions: ScreenshotOptionsSchema.omit({
		encoding: true,
	}).optional(),
}).refine(hasExactlyOneSource, 'Provide exactly one of url or html');

const SnapshotCaptureInputSchema = z.object({
	...AccountInputShape,
	body: SnapshotBodySchema,
});

const AccessibilityTreeBodySchema = BrowserPageBodyFieldsSchema.extend({
	interestingOnly: z.boolean().optional(),
	root: z.string().optional(),
}).refine(hasExactlyOneSource, 'Provide exactly one of url or html');

const AccessibilityTreeCaptureInputSchema = z.object({
	...AccountInputShape,
	body: AccessibilityTreeBodySchema,
});

const ScrapeBodySchema = BrowserPageBodyFieldsSchema.extend({
	elements: z.array(z.object({ selector: z.string().min(1) }).strict()).min(1),
}).refine(hasExactlyOneSource, 'Provide exactly one of url or html');

const ScrapeExtractInputSchema = z.object({
	...AccountInputShape,
	body: ScrapeBodySchema,
});

const ResponseFormatSchema = z
	.object({
		type: z.literal('json_schema'),
		json_schema: JsonObjectSchema,
	})
	.strict();

const CustomAiModelSchema = z
	.object({
		authorization: z.string().min(1).optional(),
		model: z.string().min(1),
	})
	.refine(
		(model) =>
			model.model.startsWith('workers-ai/') ||
			model.authorization !== undefined,
		{
			message:
				'Provide authorization for custom AI models other than Workers AI',
			path: ['authorization'],
		},
	);

const JsonExtractBodySchema = BrowserPageBodyFieldsSchema.extend({
	custom_ai: z.array(CustomAiModelSchema).optional(),
	prompt: z.string().optional(),
	response_format: ResponseFormatSchema.optional(),
})
	.refine(hasExactlyOneSource, 'Provide exactly one of url or html')
	.refine(
		(body) => body.prompt !== undefined || body.response_format !== undefined,
		'Provide prompt or response_format',
	);

const JsonExtractInputSchema = z.object({
	...AccountInputShape,
	body: JsonExtractBodySchema,
});

const LinksBodySchema = BrowserPageBodyFieldsSchema.extend({
	excludeExternalLinks: z.boolean().optional(),
	visibleLinksOnly: z.boolean().optional(),
}).refine(hasExactlyOneSource, 'Provide exactly one of url or html');

const LinksListInputSchema = z.object({
	...AccountInputShape,
	body: LinksBodySchema,
});

const ScreenshotBodySchema = BrowserPageBodyFieldsSchema.extend({
	// The plugin always returns base64 itself; encoding "base64" makes Cloudflare
	// answer with a text data URL that would be encoded a second time.
	screenshotOptions: ScreenshotOptionsSchema.omit({
		encoding: true,
	}).optional(),
	scrollPage: z.boolean().optional(),
	selector: z.string().optional(),
}).refine(hasExactlyOneSource, 'Provide exactly one of url or html');

const BinaryActionQueryShape = {
	browser: z.literal('kitesurf').optional(),
	cacheTTL: z.number().min(0).max(86_400).optional(),
};

const ScreenshotCaptureInputSchema = z.object({
	...AccountInputShape,
	...BinaryActionQueryShape,
	body: ScreenshotBodySchema,
});

const PdfOptionsSchema = z
	.object({
		displayHeaderFooter: z.boolean().optional(),
		footerTemplate: z.string().optional(),
		format: z
			.enum([
				'letter',
				'legal',
				'tabloid',
				'ledger',
				'a0',
				'a1',
				'a2',
				'a3',
				'a4',
				'a5',
				'a6',
			])
			.optional(),
		headerTemplate: z.string().optional(),
		height: z.union([z.string(), z.number()]).optional(),
		landscape: z.boolean().optional(),
		margin: z
			.object({
				bottom: z.union([z.string(), z.number()]).optional(),
				left: z.union([z.string(), z.number()]).optional(),
				right: z.union([z.string(), z.number()]).optional(),
				top: z.union([z.string(), z.number()]).optional(),
			})
			.strict()
			.optional(),
		omitBackground: z.boolean().optional(),
		outline: z.boolean().optional(),
		pageRanges: z.string().optional(),
		preferCSSPageSize: z.boolean().optional(),
		printBackground: z.boolean().optional(),
		scale: z.number().min(0.1).max(2).optional(),
		tagged: z.boolean().optional(),
		timeout: z.number().optional(),
		width: z.union([z.string(), z.number()]).optional(),
	})
	.strict();

const PdfRenderInputSchema = z.object({
	...AccountInputShape,
	...BinaryActionQueryShape,
	body: BrowserPageBodyFieldsSchema.extend({
		pdfOptions: PdfOptionsSchema.optional(),
	}).refine(hasExactlyOneSource, 'Provide exactly one of url or html'),
});

const CrawlSourceSchema = z.enum(['all', 'sitemaps', 'links']);
const CrawlFormatSchema = z.enum(['html', 'markdown', 'json']);

const CrawlOptionsSchema = z
	.object({
		includeExternalLinks: z.boolean().optional(),
		includePatterns: z.array(z.string()).optional(),
		excludePatterns: z.array(z.string()).optional(),
		includeSubdomains: z.boolean().optional(),
	})
	.strict();

const CrawlJsonOptionsSchema = z
	.object({
		custom_ai: z.array(CustomAiModelSchema).optional(),
		prompt: z.string().optional(),
		response_format: ResponseFormatSchema.optional(),
	})
	.strict();

const CrawlCreateBodySchema = z
	.object({
		...BrowserRunCommonOptionsShape,
		url: z.string().url(),
		browser: z.literal('kitesurf').optional(),
		depth: z.number().int().min(0).max(100_000).optional(),
		formats: z.array(CrawlFormatSchema).optional(),
		crawlPurposes: z
			.array(z.enum(['search', 'ai-input', 'ai-train']))
			.optional(),
		contentUse: z.enum(['reference', 'full']).optional(),
		jsonOptions: CrawlJsonOptionsSchema.optional(),
		limit: z.number().int().positive().max(100_000).optional(),
		maxAge: z.number().min(0).max(604_800).optional(),
		modifiedSince: z.number().optional(),
		options: CrawlOptionsSchema.optional(),
		render: z.boolean().optional(),
		source: CrawlSourceSchema.optional(),
	})
	.strict()
	.refine(
		(body) =>
			!body.formats?.includes('json') ||
			(body.jsonOptions !== undefined &&
				(body.jsonOptions.prompt !== undefined ||
					body.jsonOptions.response_format !== undefined)),
		'Provide jsonOptions with prompt or response_format when formats includes json',
	);

const CrawlStartInputSchema = z.object({
	...AccountInputShape,
	body: CrawlCreateBodySchema,
});

const CrawlStatusFilterSchema = z.enum([
	'queued',
	'completed',
	'disallowed',
	'skipped',
	'errored',
	'cancelled',
]);

const CrawlGetInputSchema = z.object({
	...AccountInputShape,
	jobId: z.string().min(1),
	cursor: z.union([z.string(), z.number()]).optional(),
	limit: z.number().int().positive().optional(),
	status: CrawlStatusFilterSchema.optional(),
});

const CrawlCancelInputSchema = z.object({
	...AccountInputShape,
	jobId: z.string().min(1),
});

const SessionIdInputShape = {
	...AccountInputShape,
	sessionId: z.string().uuid(),
};

const SessionListInputSchema = z.object({
	...AccountInputShape,
	limit: z.number().min(1).max(200).optional(),
	offset: z.number().min(0).optional(),
});

const SessionGetInputSchema = z.object(SessionIdInputShape);

const BrowserCreateInputSchema = z.object({
	...AccountInputShape,
	keepAlive: z.number().min(10_000).max(1_200_000).optional(),
	lab: z.boolean().optional(),
	liveViewUrlExpiresInMs: z.number().min(60_000).max(3_600_000).optional(),
	recording: z.boolean().optional(),
	targets: z.boolean().optional(),
	guardrails: z
		.object({
			allowedDomains: z.array(z.string()).max(50).optional(),
			allowedDomainSets: z.array(z.string()).max(4).optional(),
		})
		.strict()
		.optional(),
});

const BrowserCloseInputSchema = z.object(SessionIdInputShape);
const BrowserVersionInputSchema = z.object(SessionIdInputShape);
const BrowserProtocolInputSchema = z.object(SessionIdInputShape);

const LiveViewCreateInputSchema = z.object({
	...SessionIdInputShape,
	expiresInMs: z.number().min(60_000).max(3_600_000).optional(),
	guardrails: z
		.object({ mode: z.literal('readonly') })
		.strict()
		.optional(),
	mode: z.enum(['devtools', 'tab', 'full']).optional(),
	targetId: z.string().optional(),
});

const TargetCreateInputSchema = z.object({
	...SessionIdInputShape,
	liveViewUrlExpiresInMs: z.number().min(60_000).max(3_600_000).optional(),
	url: z.string().url().optional(),
});

const TargetListInputSchema = z.object({
	...SessionIdInputShape,
	liveViewUrlExpiresInMs: z.number().min(60_000).max(3_600_000).optional(),
});

const TargetIdInputShape = {
	...SessionIdInputShape,
	targetId: z.string().min(1),
};

const TargetGetInputSchema = z.object(TargetIdInputShape);
const TargetActivateInputSchema = z.object(TargetIdInputShape);
const TargetCloseInputSchema = z.object(TargetIdInputShape);

const ContentFetchOutputSchema = z.string();
const MarkdownConvertOutputSchema = z.string();

const BinaryActionOutputSchema = z
	.object({
		contentType: z.string(),
		byteLength: z.number().int().min(0),
		// Character-class check plus length, not a quantified group: the group
		// form overflowed V8's stack on base64 of a 4 MiB screenshot.
		data: z
			.string()
			.regex(/^[A-Za-z0-9+/]*={0,2}$/)
			.refine((value) => value.length % 4 === 0, {
				message: 'Base64 length must be a multiple of 4',
			}),
	})
	.strict();

const SessionOutputSchema = z
	.object({
		sessionId: z.string().uuid(),
		closeReason: z.number().optional(),
		closeReasonText: z.string().optional(),
		connectionEndTime: z.number().optional(),
		connectionId: z.string().optional(),
		connectionStartTime: z.number().optional(),
		devtoolsFrontendUrl: z.string().optional(),
		endTime: z.number().optional(),
		lastUpdated: z.number().optional(),
		startTime: z.number().optional(),
		webSocketDebuggerUrl: z.string().optional(),
	})
	.passthrough();

const SessionListOutputSchema = z.array(SessionOutputSchema);

const BrowserCreateOutputSchema = z
	.object({
		sessionId: z.string(),
		webSocketDebuggerUrl: z.string().optional(),
	})
	.passthrough();

const BrowserCloseOutputSchema = z
	.object({
		// Documented: closing | closed; a new status must not fail the call.
		status: z.string(),
	})
	.passthrough();

const BrowserVersionOutputSchema = z
	.object({
		Browser: z.string(),
		'Protocol-Version': z.string(),
		'User-Agent': z.string(),
		'V8-Version': z.string(),
		'WebKit-Version': z.string(),
		webSocketDebuggerUrl: z.string(),
	})
	.passthrough();

// CDP protocol declarations vary with the browser build; preserve their recursive JSON shape.
const ProtocolDeclarationSchema = JsonObjectSchema;
const BrowserProtocolOutputSchema = z
	.object({
		domains: z.array(
			z
				.object({
					domain: z.string(),
					commands: z.array(ProtocolDeclarationSchema).optional(),
					dependencies: z.array(z.string()).optional(),
					events: z.array(ProtocolDeclarationSchema).optional(),
					experimental: z.boolean().optional(),
					types: z.array(ProtocolDeclarationSchema).optional(),
				})
				.catchall(JsonValueSchema),
		),
		version: z
			.object({ major: z.string(), minor: z.string() })
			.passthrough()
			.optional(),
	})
	.passthrough();

const LiveViewCreateOutputSchema = z
	.object({
		id: z.string(),
		devtoolsFrontendUrl: z.string().url(),
		options: z
			.object({
				// Documented: devtools | tab | full.
				mode: z.string(),
				guardrails: z.object({ mode: z.string() }).passthrough().optional(),
			})
			.passthrough(),
		webSocketDebuggerUrl: z.string().url(),
	})
	.passthrough();

const TargetOutputSchema = z
	.object({
		id: z.string(),
		type: z.string(),
		url: z.string(),
		description: z.string().optional(),
		devtoolsFrontendUrl: z.string().optional(),
		title: z.string().optional(),
		webSocketDebuggerUrl: z.string().optional(),
	})
	.passthrough();

const TargetListOutputSchema = z.array(TargetOutputSchema);
const TargetActivateOutputSchema = z
	.object({ message: z.string() })
	.passthrough();
const TargetCloseOutputSchema = z.object({ message: z.string() }).passthrough();

const AccessibilityTreeNodeSchema = z
	.object({ role: z.string() })
	.catchall(JsonValueSchema);

const AccessibilityTreeOutputSchema = z.object({
	accessibilityTree: AccessibilityTreeNodeSchema.nullable(),
});

const SnapshotCaptureOutputSchema = z.object({
	accessibilityTree: AccessibilityTreeNodeSchema.optional(),
	content: z.string().optional(),
	markdown: z.string().optional(),
	screenshot: z.string().optional(),
});

const ScrapeElementResultSchema = z
	.object({
		attributes: z.array(z.object({ name: z.string(), value: z.string() })),
		height: z.number(),
		html: z.string(),
		left: z.number(),
		text: z.string(),
		top: z.number(),
		width: z.number(),
	})
	.catchall(JsonValueSchema);

const ScrapeExtractOutputSchema = z.array(
	z.object({
		results: z.array(ScrapeElementResultSchema),
		selector: z.string(),
	}),
);

const JsonExtractOutputSchema = JsonObjectSchema;
const LinksListOutputSchema = z.array(z.string());

const CrawlStartOutputSchema = z.string();

const CrawlRecordSchema = z
	.object({
		status: z.string(),
		url: z.string(),
		html: z.string().optional(),
		json: JsonObjectSchema.optional(),
		markdown: z.string().optional(),
		metadata: z
			.object({
				status: z.number(),
				url: z.string(),
				lastModified: z.string().optional(),
				title: z.string().optional(),
			})
			.catchall(JsonValueSchema)
			.optional(),
		outcome: z.string().optional(),
	})
	.catchall(JsonValueSchema);

const CrawlGetOutputSchema = z
	.object({
		browserSecondsUsed: z.number(),
		finished: z.number(),
		id: z.string(),
		records: z.array(CrawlRecordSchema),
		robots: z
			.array(
				z.object({
					origin: z.string(),
					// Documented: available | absent | fetch_failed.
					state: z.string(),
					status: z.number().optional(),
				}),
			)
			.optional(),
		skipped: z.number().optional(),
		status: z.string(),
		total: z.number(),
		cursor: z.union([z.string(), z.number()]).optional(),
	})
	.catchall(JsonValueSchema);

const CrawlCancelOutputSchema = z.object({
	job_id: z.string(),
	message: z.string(),
});

export type CloudflareBrowserRenderingEndpointInputs = {
	contentFetch: z.infer<typeof ContentFetchInputSchema>;
	markdownConvert: z.infer<typeof MarkdownConvertInputSchema>;
	snapshotCapture: z.infer<typeof SnapshotCaptureInputSchema>;
	accessibilityTreeCapture: z.infer<typeof AccessibilityTreeCaptureInputSchema>;
	scrapeExtract: z.infer<typeof ScrapeExtractInputSchema>;
	jsonExtract: z.infer<typeof JsonExtractInputSchema>;
	linksList: z.infer<typeof LinksListInputSchema>;
	screenshotCapture: z.infer<typeof ScreenshotCaptureInputSchema>;
	pdfRender: z.infer<typeof PdfRenderInputSchema>;
	crawlStart: z.infer<typeof CrawlStartInputSchema>;
	crawlGet: z.infer<typeof CrawlGetInputSchema>;
	crawlCancel: z.infer<typeof CrawlCancelInputSchema>;
	sessionsList: z.infer<typeof SessionListInputSchema>;
	sessionsGet: z.infer<typeof SessionGetInputSchema>;
	browserCreate: z.infer<typeof BrowserCreateInputSchema>;
	browserClose: z.infer<typeof BrowserCloseInputSchema>;
	browserVersion: z.infer<typeof BrowserVersionInputSchema>;
	browserProtocol: z.infer<typeof BrowserProtocolInputSchema>;
	liveViewCreate: z.infer<typeof LiveViewCreateInputSchema>;
	targetsCreate: z.infer<typeof TargetCreateInputSchema>;
	targetsList: z.infer<typeof TargetListInputSchema>;
	targetsGet: z.infer<typeof TargetGetInputSchema>;
	targetsActivate: z.infer<typeof TargetActivateInputSchema>;
	targetsClose: z.infer<typeof TargetCloseInputSchema>;
};

export type CloudflareBrowserRenderingEndpointOutputs = {
	contentFetch: z.infer<typeof ContentFetchOutputSchema>;
	markdownConvert: z.infer<typeof MarkdownConvertOutputSchema>;
	snapshotCapture: z.infer<typeof SnapshotCaptureOutputSchema>;
	accessibilityTreeCapture: z.infer<typeof AccessibilityTreeOutputSchema>;
	scrapeExtract: z.infer<typeof ScrapeExtractOutputSchema>;
	jsonExtract: z.infer<typeof JsonExtractOutputSchema>;
	linksList: z.infer<typeof LinksListOutputSchema>;
	screenshotCapture: z.infer<typeof BinaryActionOutputSchema>;
	pdfRender: z.infer<typeof BinaryActionOutputSchema>;
	crawlStart: z.infer<typeof CrawlStartOutputSchema>;
	crawlGet: z.infer<typeof CrawlGetOutputSchema>;
	crawlCancel: z.infer<typeof CrawlCancelOutputSchema>;
	sessionsList: z.infer<typeof SessionListOutputSchema>;
	sessionsGet: z.infer<typeof SessionOutputSchema>;
	browserCreate: z.infer<typeof BrowserCreateOutputSchema>;
	browserClose: z.infer<typeof BrowserCloseOutputSchema>;
	browserVersion: z.infer<typeof BrowserVersionOutputSchema>;
	browserProtocol: z.infer<typeof BrowserProtocolOutputSchema>;
	liveViewCreate: z.infer<typeof LiveViewCreateOutputSchema>;
	targetsCreate: z.infer<typeof TargetOutputSchema>;
	targetsList: z.infer<typeof TargetListOutputSchema>;
	targetsGet: z.infer<typeof TargetOutputSchema>;
	targetsActivate: z.infer<typeof TargetActivateOutputSchema>;
	targetsClose: z.infer<typeof TargetCloseOutputSchema>;
};

export const CloudflareBrowserRenderingEndpointInputSchemas = {
	contentFetch: ContentFetchInputSchema,
	markdownConvert: MarkdownConvertInputSchema,
	snapshotCapture: SnapshotCaptureInputSchema,
	accessibilityTreeCapture: AccessibilityTreeCaptureInputSchema,
	scrapeExtract: ScrapeExtractInputSchema,
	jsonExtract: JsonExtractInputSchema,
	linksList: LinksListInputSchema,
	screenshotCapture: ScreenshotCaptureInputSchema,
	pdfRender: PdfRenderInputSchema,
	crawlStart: CrawlStartInputSchema,
	crawlGet: CrawlGetInputSchema,
	crawlCancel: CrawlCancelInputSchema,
	sessionsList: SessionListInputSchema,
	sessionsGet: SessionGetInputSchema,
	browserCreate: BrowserCreateInputSchema,
	browserClose: BrowserCloseInputSchema,
	browserVersion: BrowserVersionInputSchema,
	browserProtocol: BrowserProtocolInputSchema,
	liveViewCreate: LiveViewCreateInputSchema,
	targetsCreate: TargetCreateInputSchema,
	targetsList: TargetListInputSchema,
	targetsGet: TargetGetInputSchema,
	targetsActivate: TargetActivateInputSchema,
	targetsClose: TargetCloseInputSchema,
} as const;

export const CloudflareBrowserRenderingEndpointOutputSchemas = {
	contentFetch: ContentFetchOutputSchema,
	markdownConvert: MarkdownConvertOutputSchema,
	snapshotCapture: SnapshotCaptureOutputSchema,
	accessibilityTreeCapture: AccessibilityTreeOutputSchema,
	scrapeExtract: ScrapeExtractOutputSchema,
	jsonExtract: JsonExtractOutputSchema,
	linksList: LinksListOutputSchema,
	screenshotCapture: BinaryActionOutputSchema,
	pdfRender: BinaryActionOutputSchema,
	crawlStart: CrawlStartOutputSchema,
	crawlGet: CrawlGetOutputSchema,
	crawlCancel: CrawlCancelOutputSchema,
	sessionsList: SessionListOutputSchema,
	sessionsGet: SessionOutputSchema,
	browserCreate: BrowserCreateOutputSchema,
	browserClose: BrowserCloseOutputSchema,
	browserVersion: BrowserVersionOutputSchema,
	browserProtocol: BrowserProtocolOutputSchema,
	liveViewCreate: LiveViewCreateOutputSchema,
	targetsCreate: TargetOutputSchema,
	targetsList: TargetListOutputSchema,
	targetsGet: TargetOutputSchema,
	targetsActivate: TargetActivateOutputSchema,
	targetsClose: TargetCloseOutputSchema,
} as const;
