/**
 * Fixtures transcribed from live Scrape.do responses, not from the doc examples.
 *
 * The async shapes matter most: the docs give no response body for a job, so
 * every field below was captured by creating a real job and reading it back.
 * The status values are the ones observed: a job is `queued` then `success`,
 * `error` or `canceled`; a task is `rotating` then `success` or `error`.
 */

export const HTML_BODY =
	'<!doctype html><html lang=en><head><meta charset=utf-8><title>Example Domain</title></head><body><p>This domain is for use in documentation examples.</p></body></html>';

export const MARKDOWN_BODY =
	'- Meta: charset: utf-8\n- Meta: name: viewport, content: width=device-width,initial-scale=1\n- Title: Example Domain\n\nThis domain is for use in documentation examples without needing permission.\n';

/** `returnJSON=true` answer, captured live. */
export const JSON_BODY = {
	statusCode: 200,
	networkRequests: [
		{
			url: 'https://example.com/api/items',
			status: 200,
			method: 'GET',
			headers: { 'content-type': 'application/json' },
			body: '{"items":[]}',
		},
	],
	websocketRequests: [],
	actionResults: [],
	content: HTML_BODY,
};

/**
 * `screenShot=true&returnJSON=true` answer, captured live 11-12: each entry is
 * an object with the base64 PNG in `image`, not a bare string.
 */
export const SCREENSHOT_BODY = {
	statusCode: 200,
	networkRequests: [],
	websocketRequests: [],
	actionResults: [],
	content: HTML_BODY,
	screenShots: [
		{
			type: 'ScreenShot',
			image:
				'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFAAH/q842iQAAAABJRU5ErkJggg==',
			error: '',
		},
	],
};

/** `/info` for a live account, captured live. */
export const ACCOUNT_INFO_BODY = {
	IsActive: true,
	ConcurrentRequest: 5,
	MaxMonthlyRequest: 1000,
	RemainingConcurrentRequest: 5,
	RemainingMonthlyRequest: 998,
};

/**
 * `/info` for a **bad token**, which answers **HTTP 200** with these values
 * rather than an error status. Confirmed live; it is why `parseAccountInfo`
 * checks `IsActive`.
 */
export const ACCOUNT_INFO_INACTIVE_BODY = {
	IsActive: false,
	ConcurrentRequest: 0,
	MaxMonthlyRequest: 0,
	RemainingConcurrentRequest: 0,
	RemainingMonthlyRequest: 0,
};

/** `/me` on the async host, captured live. Note `AvaliableCredits`. */
export const ASYNC_ACCOUNT_BODY = {
	TotalConcurrency: 5,
	FreeConcurrency: 2,
	ActiveJobs: 0,
	AvaliableCredits: 991,
};

/** A job creation answer, captured live. */
export const JOB_CREATED_BODY = {
	JobID: 'a7730ad5-f40f-44a5-98ae-80f57620d240',
	Message: 'Job created successfully',
	TaskIDs: ['c5e7eca1-5b18-44d8-8693-e4619c8c9b94'],
};

/** A queued job: the tasks show `rotating`, which is the running state. */
export const JOB_QUEUED_BODY = {
	JobID: 'fd25d2c8-0761-4d36-9ce8-904b6aed98e5',
	TaskIDs: [
		'90708a58-2def-431c-b98a-98346df2dad5',
		'3caf422c-2e7e-472d-b50a-71711f792d02',
	],
	Status: 'queued',
	StartTime: '2026-11-10T19:54:22.187Z',
	EndTime: null,
	AcquiredConcurrency: 0,
	LimitConcurrency: 0,
	Canceled: false,
	Tasks: [
		{
			TaskID: '90708a58-2def-431c-b98a-98346df2dad5',
			URL: 'https://example.com',
			Status: 'rotating',
		},
		{
			TaskID: '3caf422c-2e7e-472d-b50a-71711f792d02',
			URL: 'https://example.org',
			Status: 'rotating',
		},
	],
};

/** A finished job, captured live. */
export const JOB_SUCCESS_BODY = {
	JobID: 'a7730ad5-f40f-44a5-98ae-80f57620d240',
	TaskIDs: ['c5e7eca1-5b18-44d8-8693-e4619c8c9b94'],
	Status: 'success',
	StartTime: '2026-11-10T19:54:05.43Z',
	EndTime: '2026-11-10T19:54:06.604Z',
	AcquiredConcurrency: 0,
	LimitConcurrency: 0,
	Canceled: false,
	Tasks: [
		{
			TaskID: 'c5e7eca1-5b18-44d8-8693-e4619c8c9b94',
			URL: 'https://example.com',
			Status: 'success',
		},
	],
};

/** A job whose target could not be reached, captured live: job error, task error. */
export const JOB_FAILED_BODY = {
	JobID: '1cda4ba2-d8c2-4664-b377-6d2256d2a1a2',
	TaskIDs: ['ea77026f-a21b-45aa-8797-f273638ba5e2'],
	Status: 'success',
	StartTime: '2026-11-10T19:54:13.435Z',
	EndTime: '2026-11-10T19:54:14.89Z',
	AcquiredConcurrency: 0,
	LimitConcurrency: 0,
	Canceled: false,
	Tasks: [
		{
			TaskID: 'ea77026f-a21b-45aa-8797-f273638ba5e2',
			URL: 'https://this-host-does-not-exist-xyz.invalid',
			Status: 'error',
		},
	],
};

export const JOB_CANCELED_BODY = {
	JobID: 'fd25d2c8-0761-4d36-9ce8-904b6aed98e5',
	TaskIDs: ['90708a58-2def-431c-b98a-98346df2dad5'],
	Status: 'canceled',
	StartTime: '2026-11-10T19:54:22.187Z',
	EndTime: '2026-11-10T19:54:24.1Z',
	AcquiredConcurrency: 0,
	LimitConcurrency: 0,
	Canceled: true,
	Tasks: [
		{
			TaskID: '90708a58-2def-431c-b98a-98346df2dad5',
			URL: 'https://example.com',
			Status: 'error',
		},
	],
};

/** A task result with its content, captured live. */
export const TASK_RESULT_BODY = {
	TaskID: 'c5e7eca1-5b18-44d8-8693-e4619c8c9b94',
	JobID: 'a7730ad5-f40f-44a5-98ae-80f57620d240',
	URL: 'https://example.com',
	Status: 'success',
	StartTime: '2026-11-10T19:54:06.122Z',
	EndTime: '2026-11-10T19:54:06.489Z',
	Base64EncodedContent: false,
	StatusCode: 200,
	ResponseHeaders: { 'Content-Type': 'text/html; charset=utf-8' },
	Content: HTML_BODY,
	ErrorMessage: null,
	WebhookStatus: null,
	WebhookRequestTime: null,
	WebhookURL: null,
	TraceID: 'abc123',
};

export const JOBS_LIST_BODY = {
	Jobs: [JOB_SUCCESS_BODY],
	TotalCount: 1,
	PageSize: 10,
	PageNumber: 1,
	TotalPages: 1,
};

export const EMPTY_JOBS_LIST_BODY = {
	Jobs: [],
	TotalCount: 0,
	PageSize: 10,
	PageNumber: 1,
	TotalPages: 0,
};

// ── Error bodies, captured live ───────────────────────────────────────────

/** A 400 with no token: a request Scrape.do refused, no credit consumed. */
export const MISSING_TOKEN_BODY = {
	URL: 'https://example.com',
	StatusCode: 400,
	Message: [
		"'Token' is required!",
		'You can see details following link : https://scrape.do/docs',
	],
	PossibleCauses: ['Please check your request.'],
	Contact: "Please don't hesitate to contact us via support@scrape.do.",
};

/** A 401: the token is inactive. */
export const INACTIVE_TOKEN_BODY = {
	URL: 'https://dashboard.scrape.do',
	StatusCode: 401,
	Message: [
		'Scrape.do API Token is inactive or incorrect. Please check your token. If the issue persists, feel free to contact us via support@scrape.do',
	],
	PossibleCauses: ['Please check your account details in Scrape.do dashboard.'],
	Contact: "Please don't hesitate to contact us via support@scrape.do.",
};

/** A 400 from the target website's point of view; this one does consume a credit. */
export const TARGET_REJECTION_BODY = {
	URL: 'https://example.com',
	StatusCode: 400,
	Message: ['The target website returned a bad request'],
	PossibleCauses: ['The target website rejected the request.'],
	Contact: "Please don't hesitate to contact us via support@scrape.do.",
};

/** The `screenShot` dependency error, captured live. */
export const SCREENSHOT_NEEDS_JSON_BODY = {
	URL: 'https://example.com',
	StatusCode: 400,
	Message: [
		"'Screenshot', 'FullScreenshot' and 'ParticularScreenShot' features cannot be used without 'ReturnJSON' parameter!",
	],
	PossibleCauses: ['Please check your request.'],
	Contact: "Please don't hesitate to contact us via support@scrape.do.",
};

/** `/info` rate limit, which uses a lowercase `message`, unlike the scrape API. */
export const INFO_RATE_LIMIT_BODY = {
	message:
		'You have exceeded your request limit. You can send 10 requests per minute.',
};

/** The async API's error shape. */
export const ASYNC_AUTH_ERROR_BODY = {
	Error: 'Invalid token provided. Please check your token and try again.',
	Code: 401,
};
