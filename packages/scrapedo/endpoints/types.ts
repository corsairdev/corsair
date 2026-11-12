import { z } from 'zod';

/**
 * Request and response shapes for Scrape.do.
 *
 * The scrape surface is one endpoint whose options select what comes back
 * (raw HTML, Markdown, a screenshot, a network log), so the operations here are
 * the shapes the provider documents rather than invented routes. Every option
 * name is the provider's, from the parameter table at
 * https://scrape.do/documentation/#api-parameters-overview, and the async
 * shapes are from live jobs rather than the doc's examples.
 */

// Zod still runs this refinement after `z.url()` has rejected the value, so a
// malformed URL reaches `new URL()` here; the catch keeps that a validation
// issue instead of a TypeError thrown out of `safeParse`.
const HttpUrl = z.url().refine((value) => {
	try {
		const protocol = new URL(value).protocol;
		return protocol === 'http:' || protocol === 'https:';
	} catch {
		return false;
	}
}, 'The URL scheme must be http:// or https://');

// ── shared scrape options ─────────────────────────────────────────────────

export const SCRAPEDO_DEVICES = ['desktop', 'mobile', 'tablet'] as const;
export const SCRAPEDO_OUTPUTS = ['raw', 'markdown'] as const;
/** When the browser considers the page loaded (https://scrape.do/documentation/headless-browser/wait). */
export const SCRAPEDO_WAIT_UNTIL = [
	'load',
	'domcontentloaded',
	'networkidle',
	'networkidle0',
	'networkidle2',
	'commit',
] as const;

const TimeoutSchema = z
	.number()
	.int()
	.min(5000)
	.max(120_000)
	.optional()
	.describe(
		'Milliseconds Scrape.do may spend on the request, from 5000 to 120000. Defaults to 60000. The API answers `400` naming the bounds for a value outside them.',
	);

/**
 * Options shared by both scrape operations. The provider's defaults are named in
 * each description rather than applied with `.default()`, so the type a caller
 * sees matches what the reference documents.
 */
const ScrapeOptions = {
	super: z
		.boolean()
		.optional()
		.describe(
			'Use the residential and mobile proxy pool instead of datacenter. Defaults to false; costs more credits and raises the success rate on sites that block datacenter IPs.',
		),
	geoCode: z
		.string()
		.regex(/^[A-Za-z]{2}$/, 'Use a two-letter country code such as US or DE')
		.optional()
		.describe(
			'Two-letter code of the proxy country, as the provider documents it: us, de and so on. Sent unchanged.',
		),
	regionalGeoCode: z
		.string()
		.min(2)
		.optional()
		.describe(
			'Continent to route through, for a country the provider does not offer: europe, asia, north-america and so on.',
		),
	sessionId: z
		.number()
		.int()
		.optional()
		.describe(
			'A number that pins every request carrying it to the same proxy IP, which is how a multi-step flow keeps one session.',
		),
	setCookies: z
		.string()
		.optional()
		.describe('Cookies for the target, in `name=value; name2=value2` form.'),
	disableRedirection: z
		.boolean()
		.optional()
		.describe(
			'Return the redirect response itself instead of following it. Defaults to false.',
		),
	timeout: TimeoutSchema,
	disableRetry: z
		.boolean()
		.optional()
		.describe(
			"Turn off Scrape.do's own retry mechanism, which otherwise resends through a new IP before answering. Defaults to false.",
		),
	render: z
		.boolean()
		.optional()
		.describe(
			'Use the managed headless browser to run JavaScript and wait for the page. Defaults to false; costs more credits.',
		),
	device: z
		.enum(SCRAPEDO_DEVICES)
		.optional()
		.describe('Emulated device. Defaults to desktop.'),
	width: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Browser viewport width in pixels. Defaults to 1920.'),
	height: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Browser viewport height in pixels. Defaults to 1080.'),
	blockResources: z
		.boolean()
		.optional()
		.describe(
			'Skip CSS, images and fonts in the browser. Defaults to true; set false only when the page needs them.',
		),
	transparentResponse: z
		.boolean()
		.optional()
		.describe(
			"Return the target's own status code and body untouched instead of Scrape.do's processed answer. With this on, a target 404 arrives as a 404 rather than as the page content.",
		),
	// The browser wait options apply to every scrape route, not only the HTML
	// one: the provider documents them against the browser, and the Markdown and
	// JSON routes drive the same browser.
	waitUntil: z
		.enum(SCRAPEDO_WAIT_UNTIL)
		.optional()
		.describe(
			'When the browser stops waiting. Defaults to domcontentloaded. Needs `render`.',
		),
	customWait: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe(
			'Milliseconds to wait after the page loads. Defaults to 0. Needs `render`.',
		),
	waitSelector: z
		.string()
		.min(1)
		.optional()
		.describe('CSS selector to wait for before answering. Needs `render`.'),
};

/** Options that only do anything with the headless browser on. */
const RENDER_ONLY_OPTIONS = [
	'waitUntil',
	'customWait',
	'waitSelector',
	'blockResources',
] as const;

/**
 * The provider accepts these with `render: false` and silently ignores them,
 * which reads as a success while the setting never applied. Both scrape
 * operations run this so the request fails here instead.
 */
// unknown: the checked fields hold a string, a number and a boolean depending
// on the key, so the map only needs to know whether one was supplied at all.
function checkRenderOnlyOptions(
	input: { render?: boolean } & Partial<
		Record<(typeof RENDER_ONLY_OPTIONS)[number], unknown>
	>,
	ctx: z.RefinementCtx,
): void {
	if (input.render !== false) return;
	for (const key of RENDER_ONLY_OPTIONS) {
		if (input[key] !== undefined) {
			ctx.addIssue({
				code: 'custom',
				path: [key],
				message: `Only applies with the headless browser; set \`render: true\` or remove \`${key}\`.`,
			});
		}
	}
}

// ── scrape.html ───────────────────────────────────────────────────────────

const ScrapeHtmlInputSchema = z
	.object({
		url: HttpUrl.describe('The page to fetch.'),
		...ScrapeOptions,
		output: z
			.enum(SCRAPEDO_OUTPUTS)
			.optional()
			.describe(
				'Return the page as it is (`raw`, the default) or converted to Markdown (`markdown`).',
			),
	})
	.superRefine(checkRenderOnlyOptions);

export type ScrapeHtmlInput = z.input<typeof ScrapeHtmlInputSchema>;

/**
 * The answer is the target's page, not an envelope. Its status is reported
 * beside the body because Scrape.do consumes a credit for a target 404 that
 * still returns the page.
 */
const ScrapeHtmlResponseSchema = z.object({
	html: z.string().describe('The fetched body: the page, usually HTML.'),
	status_code: z
		.number()
		.int()
		.describe(
			"The target's HTTP status. A 404 or 410 arrives here with the page body and still costs a credit, which is why it is reported rather than thrown.",
		),
	content_type: z
		.string()
		.nullish()
		.describe('The content type Scrape.do returned.'),
});

export type ScrapeHtmlResponse = z.infer<typeof ScrapeHtmlResponseSchema>;

// ── scrape.markdown ───────────────────────────────────────────────────────

const ScrapeMarkdownInputSchema = z
	.object({
		url: HttpUrl.describe('The page to convert.'),
		...ScrapeOptions,
	})
	.superRefine(checkRenderOnlyOptions);

export type ScrapeMarkdownInput = z.input<typeof ScrapeMarkdownInputSchema>;

const ScrapeMarkdownResponseSchema = z.object({
	markdown: z
		.string()
		.describe(
			'The page as Markdown, with its metadata at the top as `- Meta:` and `- Title:` lines followed by the body.',
		),
	status_code: z.number().int().describe("The target's HTTP status."),
});

export type ScrapeMarkdownResponse = z.infer<
	typeof ScrapeMarkdownResponseSchema
>;

// ── scrape.screenshot ─────────────────────────────────────────────────────

const ScreenshotAreaSchema = z
	.object({
		x: z.number().int().nonnegative(),
		y: z.number().int().nonnegative(),
		width: z.number().int().positive(),
		height: z.number().int().positive(),
	})
	.describe(
		'The area to capture, in pixels. `particularScreenShot` takes this as JSON.',
	);

const ScrapeScreenshotInputSchema = z
	.object({
		url: HttpUrl.describe('The page to capture.'),
		...ScrapeOptions,
		// A screenshot cannot be produced without the browser, and the API answers
		// 400 when it is missing, so it is required here rather than defaulted.
		render: z
			.literal(true)
			.describe(
				'Required: the API refuses a screenshot without the headless browser.',
			),
		fullPage: z
			.boolean()
			.optional()
			.describe(
				'Capture the whole scrollable page instead of the viewport. Defaults to false.',
			),
		area: ScreenshotAreaSchema.optional().describe(
			'Capture only this area. Mutually exclusive with `fullPage`.',
		),
	})
	.superRefine((input, ctx) => {
		if (input.fullPage === true && input.area !== undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['area'],
				message:
					'Choose one: `fullPage` captures everything and `area` captures a region.',
			});
		}
	});

export type ScrapeScreenshotInput = z.input<typeof ScrapeScreenshotInputSchema>;

/**
 * Scrape.do only returns a screenshot inside its JSON answer, and only when
 * `returnJSON` is on; the live API rejects `screenShot` without it with a 400
 * naming the dependency. So this operation always sets both and reads the
 * screenshots array.
 */
// Captured live: `{ type: 'ScreenShot', image: '<base64 PNG>', error: '' }`.
export const RawScreenshotSchema = z
	.object({
		type: z.string().nullish(),
		image: z.string().nullish(),
		error: z.string().nullish(),
	})
	.loose();

const ScrapeScreenshotResponseSchema = z.object({
	screenshots: z
		.array(z.string())
		.describe(
			'Base64-encoded PNG images, one per element the request asked for. Usually a single entry.',
		),
	status_code: z.number().int().describe("The target's HTTP status."),
});

export type ScrapeScreenshotResponse = z.infer<
	typeof ScrapeScreenshotResponseSchema
>;

// ── scrape.json ───────────────────────────────────────────────────────────

const JsonNetworkRequestSchema = z
	.object({
		url: z.string().nullish(),
		status: z.number().nullish(),
		method: z.string().nullish(),
		// unknown: the provider sends headers as a map whose keys are the
		// target's own header names.
		headers: z.record(z.string(), z.unknown()).nullish(),
		body: z.string().nullish(),
	})
	.loose();

const ScrapeJsonInputSchema = z
	.object({
		url: HttpUrl.describe('The page to fetch as a JSON report.'),
		...ScrapeOptions,
		showFrames: z
			.boolean()
			.optional()
			.describe('Include iframe content. Needs `render`.'),
		showWebsocketRequests: z
			.boolean()
			.optional()
			.describe('Include WebSocket traffic. Needs `render`.'),
	})
	.superRefine(checkRenderOnlyOptions);

export type ScrapeJsonInput = z.input<typeof ScrapeJsonInputSchema>;

const ScrapeJsonResponseSchema = z.object({
	status_code: z.number().int().describe("The target's HTTP status."),
	content: z.string().describe('The page body as a string.'),
	network_requests: z
		.array(JsonNetworkRequestSchema)
		.describe(
			'The XHR and fetch calls the page made. Empty without the browser.',
		),
	websocket_requests: z
		.array(z.looseObject({}))
		.nullish()
		.describe('WebSocket traffic, when `showWebsocketRequests` was set.'),
});

export type ScrapeJsonResponse = z.infer<typeof ScrapeJsonResponseSchema>;

// ── account.info ──────────────────────────────────────────────────────────

const AccountInfoInputSchema = z.object({});

export type AccountInfoInput = z.input<typeof AccountInfoInputSchema>;

const AccountInfoResponseSchema = z
	.object({
		is_active: z
			.boolean()
			.describe(
				'False when the token is rejected. The API answers HTTP 200 in that case, so this is the only signal.',
			),
		concurrent_request: z
			.number()
			.int()
			.describe("The plan's concurrency limit."),
		max_monthly_request: z
			.number()
			.int()
			.describe('Requests the plan allows per month.'),
		remaining_concurrent_request: z
			.number()
			.int()
			.describe('Concurrency slots free right now.'),
		remaining_monthly_request: z
			.number()
			.int()
			.describe('Requests left this month.'),
	})
	.loose();

export type AccountInfoResponse = z.infer<typeof AccountInfoResponseSchema>;

/** The raw `/info` answer, before it is checked. */
export const RawAccountInfoSchema = z
	.object({
		IsActive: z.boolean(),
		ConcurrentRequest: z.number(),
		MaxMonthlyRequest: z.number(),
		RemainingConcurrentRequest: z.number(),
		RemainingMonthlyRequest: z.number(),
	})
	.loose();

/**
 * `/info` answers **HTTP 200 with `IsActive: false`** for a bad token — confirmed
 * live, where a bogus token returned `{"IsActive":false,…}` with zeros. A client
 * that only checked the status would report a dead account as healthy, so this
 * turns the false into an auth error.
 *
 * It also rate-limits at 10 requests a minute and answers 429 with a lowercase
 * `message`, which the client surfaces as a concurrency-limit error.
 */
export function parseAccountInfo(raw: z.infer<typeof RawAccountInfoSchema>) {
	if (!raw.IsActive) {
		throw new Error(
			'Scrape.do rejected this token: /info answered IsActive false. Check the token in the dashboard at https://dashboard.scrape.do',
		);
	}
	return {
		is_active: raw.IsActive,
		concurrent_request: raw.ConcurrentRequest,
		max_monthly_request: raw.MaxMonthlyRequest,
		remaining_concurrent_request: raw.RemainingConcurrentRequest,
		remaining_monthly_request: raw.RemainingMonthlyRequest,
	};
}

// ── jobs.start ────────────────────────────────────────────────────────────

const JobTargetsSchema = z
	.array(HttpUrl)
	.min(1)
	.max(100)
	.describe(
		'The URLs to fetch. Scrape.do documents a batch per job; each becomes one task.',
	);

const JobsStartInputSchema = z.object({
	targets: JobTargetsSchema,
	super: z
		.boolean()
		.optional()
		.describe('Use the residential and mobile proxy pool for every target.'),
	geoCode: z
		.string()
		.regex(/^[A-Za-z]{2}$/)
		.optional()
		.describe('Two-letter proxy country code for every target.'),
	render: z
		.boolean()
		.optional()
		.describe('Render every target in the headless browser.'),
	webhookUrl: z
		.url()
		.optional()
		.describe(
			'Where Scrape.do should POST the results when the job finishes, instead of polling.',
		),
});

export type JobsStartInput = z.input<typeof JobsStartInputSchema>;

const JobsStartResponseSchema = z.object({
	job_id: z.string().describe('Pass this to `jobs.get` to read the job back.'),
	task_ids: z
		.array(z.string())
		.describe('One task per target, in request order.'),
	message: z.string().nullish(),
});

export type JobsStartResponse = z.infer<typeof JobsStartResponseSchema>;

// ── jobs.get ──────────────────────────────────────────────────────────────

const JobsGetInputSchema = z.object({
	jobId: z.string().min(1).describe('The `job_id` from `jobs.start`.'),
});

export type JobsGetInput = z.input<typeof JobsGetInputSchema>;

const JobTaskSchema = z
	.object({
		task_id: z.string(),
		url: z.string().nullish(),
		// Live values, all observed: `pending` before the pool picks the task up,
		// `rotating` while it runs, then `success` or `error`.
		status: z
			.string()
			.describe('pending, rotating while running, then success or error.'),
	})
	.loose();

const JobSchema = z
	.object({
		job_id: z.string(),
		// The docs list queuing, queued, pending and rotating before the terminal
		// success, error and canceled.
		status: z
			.string()
			.describe(
				'queuing, queued, pending or rotating while the job runs, then success, error or canceled.',
			),
		start_time: z.string().nullish(),
		end_time: z.string().nullish(),
		canceled: z.boolean().nullish(),
		tasks: z.array(JobTaskSchema).describe('One entry per target.'),
	})
	.loose();

const JobsGetResponseSchema = z.object({
	job_id: z.string(),
	status: z
		.string()
		.describe(
			'Poll until the status is success, error or canceled; queuing, queued, pending and rotating all mean the job is still running.',
		),
	tasks: z.array(JobTaskSchema),
	job: JobSchema.describe('The job as sent, with its timing and tasks.'),
});

export type JobsGetResponse = z.infer<typeof JobsGetResponseSchema>;

// ── jobs.result ───────────────────────────────────────────────────────────

const JobsResultInputSchema = z.object({
	jobId: z.string().min(1).describe('The job the task belongs to.'),
	taskId: z
		.string()
		.min(1)
		.describe('The task id from `jobs.get`, one per target.'),
});

export type JobsResultInput = z.input<typeof JobsResultInputSchema>;

const JobsResultResponseSchema = z
	.object({
		task_id: z.string(),
		job_id: z.string(),
		url: z.string().nullish(),
		status: z.string().describe('success or error.'),
		status_code: z
			.number()
			.int()
			.nullish()
			.describe("The target's HTTP status."),
		content: z
			.string()
			.nullish()
			.describe(
				'The page body. Absent on a failed task, and base64-encoded when `base64_encoded` is true.',
			),
		base64_encoded: z
			.boolean()
			.nullish()
			.describe('True when `content` is base64 rather than text.'),
		error_message: z
			.string()
			.nullish()
			.describe('Why the task failed, when it did.'),
		expires_at: z
			.string()
			.nullish()
			.describe('When Scrape.do drops this result, so read it before then.'),
	})
	.loose();

export type JobsResultResponse = z.infer<typeof JobsResultResponseSchema>;

// ── jobs.cancel ───────────────────────────────────────────────────────────

const JobsCancelInputSchema = z.object({
	jobId: z.string().min(1).describe('The job to cancel.'),
});

export type JobsCancelInput = z.input<typeof JobsCancelInputSchema>;

const JobsCancelResponseSchema = z.object({
	job_id: z.string(),
	status: z.string().describe('canceled'),
});

export type JobsCancelResponse = z.infer<typeof JobsCancelResponseSchema>;

// ── jobs.list ─────────────────────────────────────────────────────────────

const JobsListInputSchema = z.object({
	pageNumber: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('1-based page. Defaults to 1.'),
	pageSize: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('Jobs per page. Defaults to 10.'),
});

export type JobsListInput = z.input<typeof JobsListInputSchema>;

const JobsListResponseSchema = z.object({
	jobs: z.array(JobSchema),
	total_count: z.number().int(),
	page_size: z.number().int(),
	page_number: z.number().int(),
	total_pages: z.number().int(),
});

export type JobsListResponse = z.infer<typeof JobsListResponseSchema>;

// ── account.async ─────────────────────────────────────────────────────────

const AsyncAccountInputSchema = z.object({});

export type AsyncAccountInput = z.input<typeof AsyncAccountInputSchema>;

const AsyncAccountResponseSchema = z
	.object({
		total_concurrency: z
			.number()
			.int()
			.describe("The plan's concurrency limit."),
		free_concurrency: z
			.number()
			.int()
			.describe('Slots free in the async pool right now.'),
		active_jobs: z.number().int().describe('Jobs running or queued.'),
		available_credits: z
			.number()
			.int()
			.describe(
				'Credits left. The provider spells this `AvaliableCredits` in its answer; the plugin uses the correct spelling.',
			),
	})
	.loose();

export type AsyncAccountResponse = z.infer<typeof AsyncAccountResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type ScrapeDoEndpointInputs = {
	scrapeHtml: ScrapeHtmlInput;
	scrapeMarkdown: ScrapeMarkdownInput;
	scrapeJson: ScrapeJsonInput;
	scrapeScreenshot: ScrapeScreenshotInput;
	accountInfo: AccountInfoInput;
	jobsStart: JobsStartInput;
	jobsGet: JobsGetInput;
	jobsResult: JobsResultInput;
	jobsCancel: JobsCancelInput;
	jobsList: JobsListInput;
	asyncAccount: AsyncAccountInput;
};

export type ScrapeDoEndpointOutputs = {
	scrapeHtml: ScrapeHtmlResponse;
	scrapeMarkdown: ScrapeMarkdownResponse;
	scrapeJson: ScrapeJsonResponse;
	scrapeScreenshot: ScrapeScreenshotResponse;
	accountInfo: AccountInfoResponse;
	jobsStart: JobsStartResponse;
	jobsGet: JobsGetResponse;
	jobsResult: JobsResultResponse;
	jobsCancel: JobsCancelResponse;
	jobsList: JobsListResponse;
	asyncAccount: AsyncAccountResponse;
};

export const ScrapeDoEndpointInputSchemas = {
	scrapeHtml: ScrapeHtmlInputSchema,
	scrapeMarkdown: ScrapeMarkdownInputSchema,
	scrapeJson: ScrapeJsonInputSchema,
	scrapeScreenshot: ScrapeScreenshotInputSchema,
	accountInfo: AccountInfoInputSchema,
	jobsStart: JobsStartInputSchema,
	jobsGet: JobsGetInputSchema,
	jobsResult: JobsResultInputSchema,
	jobsCancel: JobsCancelInputSchema,
	jobsList: JobsListInputSchema,
	asyncAccount: AsyncAccountInputSchema,
} as const;

export const ScrapeDoEndpointOutputSchemas = {
	scrapeHtml: ScrapeHtmlResponseSchema,
	scrapeMarkdown: ScrapeMarkdownResponseSchema,
	scrapeJson: ScrapeJsonResponseSchema,
	scrapeScreenshot: ScrapeScreenshotResponseSchema,
	accountInfo: AccountInfoResponseSchema,
	jobsStart: JobsStartResponseSchema,
	jobsGet: JobsGetResponseSchema,
	jobsResult: JobsResultResponseSchema,
	jobsCancel: JobsCancelResponseSchema,
	jobsList: JobsListResponseSchema,
	asyncAccount: AsyncAccountResponseSchema,
} as const;
