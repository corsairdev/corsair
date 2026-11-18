import { z } from 'zod';

// Inputs use CustomJS's own field names; outputs match the live responses field
// for field rather than the docs, which disagree in several places. Every output
// is `.loose()` and its optional fields nullish, so a field CustomJS adds or
// omits cannot fail a call that has already happened.
// Reference: https://www.customjs.space/integration/native-api/documentation/

// ── shared ────────────────────────────────────────────────────────────────

/**
 * The render routes answer with the bytes of a file, so the caller gets them
 * base64 encoded with the type CustomJS declared.
 */
const CustomjsFileSchema = z
	.object({
		base64: z.string().describe('The file bytes, base64 encoded.'),
		contentType: z
			.string()
			.describe('The `content-type` CustomJS answered with.'),
		byteLength: z.number().int().nonnegative().describe('Size in bytes.'),
	})
	.loose();

export type CustomjsFile = z.output<typeof CustomjsFileSchema>;

// ── auth.check ────────────────────────────────────────────────────────────

const AuthCheckInputSchema = z.object({});

export type AuthCheckInput = z.input<typeof AuthCheckInputSchema>;

/**
 * The live answer also carries `apiKey`, `apiKeyData` and a full `jwt`, which
 * are dropped deliberately: this operation is `read`, and a read that hands back
 * a credential lets a read-only caller mint one.
 *
 * This is the one output that is not `.loose()`, because `.loose()` would pass
 * those fields straight through. Unknown keys are stripped, and `schema.test.ts`
 * pins that.
 */
const AuthCheckResponseSchema = z.object({
	workspaceId: z.string().describe('The workspace the key belongs to.'),
	name: z.string().describe('The workspace name.'),
	maxRequestCount: z
		.number()
		.nullish()
		.describe('Requests allowed in one rate-limit window.'),
	inActive: z
		.boolean()
		.nullish()
		.describe('True when the workspace is suspended.'),
	createdAt: z
		.number()
		.nullish()
		.describe('Workspace creation time, milliseconds since the epoch.'),
	utmSource: z
		.string()
		.nullish()
		.describe('How the account found CustomJS, when it was recorded.'),
});

export type AuthCheckResponse = z.output<typeof AuthCheckResponseSchema>;

// ── pdf ───────────────────────────────────────────────────────────────────

const PdfPageConfigSchema = z
	.object({
		pdfWidthMm: z
			.number()
			.positive()
			.optional()
			.describe('Page width in millimetres. A4 is 210, which is the default.'),
		pdfHeightMm: z
			.number()
			.positive()
			.optional()
			.describe('Page height in millimetres. A4 is 297, which is the default.'),
	})
	.loose();

const PdfFromHtmlInputSchema = z.object({
	html: z
		.string()
		.min(1)
		.describe(
			'HTML document, optionally with Nunjucks placeholders such as `{{ name }}`.',
		),
	data: z
		.record(z.string(), z.json())
		.optional()
		.describe(
			'Values for the Nunjucks placeholders. Supplying any renders the HTML as a template first.',
		),
	config: PdfPageConfigSchema.optional().describe('Page size.'),
});

export type PdfFromHtmlInput = z.input<typeof PdfFromHtmlInputSchema>;

const PdfFromHtmlResponseSchema = CustomjsFileSchema;

export type PdfFromHtmlResponse = z.output<typeof PdfFromHtmlResponseSchema>;

const PdfFromMarkdownInputSchema = z.object({
	markdown: z.string().min(1).describe('Markdown text to render.'),
});

export type PdfFromMarkdownInput = z.input<typeof PdfFromMarkdownInputSchema>;

const PdfFromMarkdownResponseSchema = CustomjsFileSchema;

export type PdfFromMarkdownResponse = z.output<
	typeof PdfFromMarkdownResponseSchema
>;

// ── screenshot ────────────────────────────────────────────────────────────

const ScreenshotCommandSchema = z.discriminatedUnion('action', [
	z.object({
		action: z.literal('click'),
		selector: z
			.string()
			.min(1)
			.describe('A CSS selector, or the visible text of the element.'),
	}),
	z.object({
		action: z.literal('type'),
		selector: z.string().min(1).describe('The input to type into.'),
		value: z.string().describe('Text to type.'),
	}),
	z.object({
		action: z.literal('wait'),
		value: z.number().int().nonnegative().describe('Milliseconds to wait.'),
	}),
	z.object({
		action: z.literal('scroll'),
		value: z.number().int().describe('Pixels to scroll down.'),
	}),
]);

const ScreenshotBoxSchema = z
	.object({
		x: z.number().describe('Left edge in pixels.'),
		y: z.number().describe('Top edge in pixels.'),
		width: z.number().positive().describe('Capture width in pixels.'),
		height: z.number().positive().describe('Capture height in pixels.'),
	})
	.loose();

const ScreenshotCaptureInputSchema = z.object({
	url: z.url().describe('The page to capture.'),
	commands: z
		.array(ScreenshotCommandSchema)
		.optional()
		.describe('Browser actions to run in order before the capture.'),
	box: ScreenshotBoxSchema.optional().describe(
		'Capture only this region. CustomJS applies it only when both `width` and `height` are greater than 0.',
	),
});

export type ScreenshotCaptureInput = z.input<
	typeof ScreenshotCaptureInputSchema
>;

const ScreenshotCaptureResponseSchema = CustomjsFileSchema;

export type ScreenshotCaptureResponse = z.output<
	typeof ScreenshotCaptureResponseSchema
>;

// ── javascript ────────────────────────────────────────────────────────────

const JavascriptBase = {
	code: z
		.string()
		.min(1)
		.describe(
			'JavaScript run as the body of a function. `input` holds the request value, and `return` sends the result back.',
		),
	input: z
		.json()
		.optional()
		.describe(
			'Either a JSON value or a JSON string; CustomJS hands back whatever it is given.',
		),
};

const JavascriptRunInputSchema = z.object(JavascriptBase);

export type JavascriptRunInput = z.input<typeof JavascriptRunInputSchema>;

/**
 * Inline execution always answers `text/plain`, whatever the script returns: an
 * object arrives JSON encoded, `null` arrives as `null`, and a script with no
 * `return` answer an empty body, which is an empty string here.
 */
const JavascriptRunResponseSchema = z
	.object({
		output: z
			.string()
			.describe('The script return value as text, or an empty string.'),
	})
	.loose();

export type JavascriptRunResponse = z.output<
	typeof JavascriptRunResponseSchema
>;

const JavascriptRunBinaryInputSchema = z.object({
	...JavascriptBase,
	code: z
		.string()
		.min(1)
		.describe(
			'JavaScript whose return value is a file, usually a Buffer from `HTML2PDF` or `SCREENSHOT`.',
		),
});

export type JavascriptRunBinaryInput = z.input<
	typeof JavascriptRunBinaryInputSchema
>;

const JavascriptRunBinaryResponseSchema = CustomjsFileSchema;

export type JavascriptRunBinaryResponse = z.output<
	typeof JavascriptRunBinaryResponseSchema
>;

// ── scrape ────────────────────────────────────────────────────────────────

/**
 * Step fields differ from the screenshot route on purpose: a wait here takes
 * `ms`, while a screenshot wait takes `value`. The names below are the ones the
 * AI scraper accepts.
 */
const ScrapeCommandSchema = z.discriminatedUnion('action', [
	z.object({
		action: z.literal('navigate'),
		url: z.url().describe('The page to open.'),
	}),
	z.object({
		action: z.literal('click'),
		selector: z
			.string()
			.min(1)
			.describe('A CSS selector, or the visible text of the element.'),
	}),
	z.object({
		action: z.literal('type'),
		selector: z.string().min(1).describe('The input to type into.'),
		value: z.string().describe('Text to type.'),
	}),
	z.object({
		action: z.literal('wait'),
		ms: z.number().int().nonnegative().describe('Milliseconds to wait.'),
	}),
	z.object({
		action: z.literal('extract'),
		selector: z.string().min(1).describe('CSS selector to read.'),
		multiple: z
			.boolean()
			.optional()
			.describe('Collect every match instead of the first.'),
		attribute: z
			.string()
			.optional()
			.describe('Read this attribute instead of the element text.'),
		as: z
			.string()
			.min(1)
			.optional()
			.describe('Key this result is stored under in `extractions`.'),
	}),
	z.object({
		action: z.literal('screenshot'),
		as: z
			.string()
			.min(1)
			.optional()
			.describe(
				'Key this result is stored under in `extractions`. The value is an S3 URL kept for 30 days.',
			),
	}),
	z.object({
		action: z.literal('scroll'),
		direction: z.enum(['up', 'down']).optional().describe('Defaults to down.'),
		amount: z.number().int().positive().optional().describe('Pixels.'),
	}),
	z.object({
		action: z.literal('evaluate'),
		expression: z
			.string()
			.min(1)
			.describe('JavaScript run in the page context.'),
		as: z
			.string()
			.min(1)
			.optional()
			.describe('Key this result is stored under in `extractions`.'),
	}),
]);

const ScrapeEventSchema = z
	.object({
		step: z.number().describe('Which step this event belongs to, from 1.'),
		type: z
			.string()
			.describe('`action` for command mode, `decision` for agentic.'),
		action: z.string().nullish().describe('The action that ran.'),
		url: z.string().nullish().describe('The URL the action opened.'),
		selector: z.string().nullish().describe('The selector the action used.'),
		success: z.boolean().nullish().describe('Whether the action succeeded.'),
	})
	.loose();

const ScrapeScreenshotSchema = z
	.object({
		step: z.number().describe('The step that took the screenshot.'),
		url: z.string().describe('S3 URL, kept for 30 days.'),
	})
	.loose();

const ScrapePageInputSchema = z.object({
	url: z.url().optional().describe('The page the first step opens.'),
	commands: z
		.array(ScrapeCommandSchema)
		.min(1)
		.describe(
			'Exact browser steps to run. Command mode costs no model tokens per step.',
		),
	returnType: z
		.enum(['json', 'text', 'html', 'markdown', 'screenshot'])
		.optional()
		.describe(
			'`json` returns every `extract` result as an object. `text`, `html` and `markdown` return the final page. `screenshot` returns the S3 URL of the last screenshot. Defaults to `json`.',
		),
});

export type ScrapePageInput = z.input<typeof ScrapePageInputSchema>;

const ScrapePageResponseSchema = z
	.object({
		status: z.string().describe('`success` when the run finished.'),
		steps: z.number().nullish().describe('Steps that ran.'),
		extractions: z
			.record(z.string(), z.json())
			.nullish()
			.describe(
				'One entry per command with an `as` key: extract results, screenshot URLs, and evaluate output.',
			),
		events: z
			.array(ScrapeEventSchema)
			.nullish()
			.describe('Per-step log of what ran.'),
		returnType: z
			.string()
			.nullish()
			.describe('The `returnType` that was used.'),
		screenshots: z
			.array(ScrapeScreenshotSchema)
			.nullish()
			.describe('Screenshots taken during the run.'),
		sessionUrl: z
			.string()
			.nullish()
			.describe('S3 URL of the full session log, kept for 30 days.'),
	})
	.loose();

export type ScrapePageResponse = z.output<typeof ScrapePageResponseSchema>;

const ScrapeAgentInputSchema = z.object({
	goal: z
		.string()
		.min(1)
		.describe(
			'The task in plain language. Include the URL here, for example "Go to shop.example.com and list every product name and price".',
		),
	url: z
		.url()
		.optional()
		.describe('Starting page, when it is not written into the goal.'),
	maxSteps: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Browser actions the agent may take. Defaults to 10.'),
	output: z
		.enum(['ai_extract', 'text', 'html', 'markdown', 'screenshot'])
		.optional()
		.describe('What the agent returns. Defaults to `ai_extract`.'),
	credentials: z
		.record(z.string(), z.string())
		.optional()
		.describe(
			'Login field values. The agent fills the matching fields automatically, so this is a secret and is never logged.',
		),
});

export type ScrapeAgentInput = z.input<typeof ScrapeAgentInputSchema>;

const ScrapeAgentResultSchema = z
	.object({
		data: z
			.json()
			.describe(
				'The answer, as text or structured data depending on `output`.',
			),
		format: z.string().nullish().describe('The `output` used to produce it.'),
	})
	.loose();

const ScrapeAgentUsageSchema = z
	.object({
		promptTokens: z.number().nullish(),
		completionTokens: z.number().nullish(),
		totalTokens: z.number().nullish(),
		estimatedCostUsd: z.number().nullish().describe('Cost of this run.'),
	})
	.loose();

const ScrapeAgentResponseSchema = z
	.object({
		status: z.string().describe('`success` when the run finished.'),
		steps: z.number().nullish().describe('Steps that ran.'),
		events: z.array(ScrapeEventSchema).nullish().describe('Per-step log.'),
		result: ScrapeAgentResultSchema.nullish().describe('What the agent found.'),
		usage: ScrapeAgentUsageSchema.nullish().describe('Model tokens used.'),
		screenshots: z
			.array(ScrapeScreenshotSchema)
			.nullish()
			.describe('Screenshots taken while it worked.'),
		sessionUrl: z
			.string()
			.nullish()
			.describe('S3 URL of the full session log, kept for 30 days.'),
	})
	.loose();

export type ScrapeAgentResponse = z.output<typeof ScrapeAgentResponseSchema>;

// ── pages ─────────────────────────────────────────────────────────────────

const PagesListInputSchema = z.object({});

export type PagesListInput = z.input<typeof PagesListInputSchema>;

const HostedPageSchema = z
	.object({
		pageId: z.string().describe('The ID used to update or delete the page.'),
		name: z.string().describe('The name the page was created with.'),
		htmlFileUrl: z.string().describe('The URL the page is served from.'),
		type: z.string().nullish().describe('`HTML` for pages this API creates.'),
		workspaceId: z.string().nullish(),
		origin: z
			.string()
			.nullish()
			.describe('The `customjs-origin` sent with the request that created it.'),
		timestamp: z.number().nullish().describe('Milliseconds since the epoch.'),
		createdAt: z.number().nullish().describe('Milliseconds since the epoch.'),
		updatedAt: z.number().nullish().describe('Milliseconds since the epoch.'),
	})
	.loose();

const PagesListResponseSchema = z
	.object({
		pages: z.array(HostedPageSchema).describe('Every page in the workspace.'),
	})
	.loose();

export type PagesListResponse = z.output<typeof PagesListResponseSchema>;

const PagesCreateInputSchema = z.object({
	name: z
		.string()
		.min(1)
		.describe('A label for the page. CustomJS does not enforce uniqueness.'),
	htmlContent: z.string().min(1).describe('The full HTML document to host.'),
	slug: z
		.string()
		.min(1)
		.optional()
		.describe('A custom slug for the page URL.'),
});

export type PagesCreateInput = z.input<typeof PagesCreateInputSchema>;

/** The live create answer is a 201 carrying `shortId`; the docs' `name` is not sent. */
const PagesCreateResponseSchema = z
	.object({
		pageId: z.string().describe('The ID used to update or delete the page.'),
		shortId: z
			.string()
			.nullish()
			.describe('The generated path segment in `htmlFileUrl`.'),
		htmlFileUrl: z.string().describe('The live URL of the page.'),
		message: z.string().nullish().describe('CustomJS status text.'),
	})
	.loose();

export type PagesCreateResponse = z.output<typeof PagesCreateResponseSchema>;

const PagesUpdateInputSchema = z.object({
	pageId: z.string().min(1).describe('The page to replace, from `pages.list`.'),
	htmlContent: z.string().min(1).describe('The new HTML document.'),
	name: z.string().min(1).optional().describe('A new name for the page.'),
});

export type PagesUpdateInput = z.input<typeof PagesUpdateInputSchema>;

const PagesUpdateResponseSchema = z
	.object({
		pageId: z.string(),
		htmlFileUrl: z.string().describe('Unchanged by an update.'),
		name: z.string().nullish(),
		message: z.string().nullish(),
	})
	.loose();

export type PagesUpdateResponse = z.output<typeof PagesUpdateResponseSchema>;

const PagesDeleteInputSchema = z.object({
	pageId: z.string().min(1).describe('The page to delete.'),
});

export type PagesDeleteInput = z.input<typeof PagesDeleteInputSchema>;

const PagesDeleteResponseSchema = z
	.object({
		success: z
			.literal(true)
			.describe(
				'CustomJS deleted the page. An unknown page ID fails with a 404 instead.',
			),
		pageId: z.string(),
	})
	.loose();

export type PagesDeleteResponse = z.output<typeof PagesDeleteResponseSchema>;

// ── registry ──────────────────────────────────────────────────────────────

export type CustomjsEndpointInputs = {
	authCheck: AuthCheckInput;
	pdfFromHtml: PdfFromHtmlInput;
	pdfFromMarkdown: PdfFromMarkdownInput;
	screenshotCapture: ScreenshotCaptureInput;
	javascriptRun: JavascriptRunInput;
	javascriptRunBinary: JavascriptRunBinaryInput;
	scrapePage: ScrapePageInput;
	scrapeAgent: ScrapeAgentInput;
	pagesList: PagesListInput;
	pagesCreate: PagesCreateInput;
	pagesUpdate: PagesUpdateInput;
	pagesDelete: PagesDeleteInput;
};

export type CustomjsEndpointOutputs = {
	authCheck: AuthCheckResponse;
	pdfFromHtml: PdfFromHtmlResponse;
	pdfFromMarkdown: PdfFromMarkdownResponse;
	screenshotCapture: ScreenshotCaptureResponse;
	javascriptRun: JavascriptRunResponse;
	javascriptRunBinary: JavascriptRunBinaryResponse;
	scrapePage: ScrapePageResponse;
	scrapeAgent: ScrapeAgentResponse;
	pagesList: PagesListResponse;
	pagesCreate: PagesCreateResponse;
	pagesUpdate: PagesUpdateResponse;
	pagesDelete: PagesDeleteResponse;
};

export const CustomjsEndpointInputSchemas = {
	authCheck: AuthCheckInputSchema,
	pdfFromHtml: PdfFromHtmlInputSchema,
	pdfFromMarkdown: PdfFromMarkdownInputSchema,
	screenshotCapture: ScreenshotCaptureInputSchema,
	javascriptRun: JavascriptRunInputSchema,
	javascriptRunBinary: JavascriptRunBinaryInputSchema,
	scrapePage: ScrapePageInputSchema,
	scrapeAgent: ScrapeAgentInputSchema,
	pagesList: PagesListInputSchema,
	pagesCreate: PagesCreateInputSchema,
	pagesUpdate: PagesUpdateInputSchema,
	pagesDelete: PagesDeleteInputSchema,
} as const;

export const CustomjsEndpointOutputSchemas = {
	authCheck: AuthCheckResponseSchema,
	pdfFromHtml: PdfFromHtmlResponseSchema,
	pdfFromMarkdown: PdfFromMarkdownResponseSchema,
	screenshotCapture: ScreenshotCaptureResponseSchema,
	javascriptRun: JavascriptRunResponseSchema,
	javascriptRunBinary: JavascriptRunBinaryResponseSchema,
	scrapePage: ScrapePageResponseSchema,
	scrapeAgent: ScrapeAgentResponseSchema,
	pagesList: PagesListResponseSchema,
	pagesCreate: PagesCreateResponseSchema,
	pagesUpdate: PagesUpdateResponseSchema,
	pagesDelete: PagesDeleteResponseSchema,
} as const;
