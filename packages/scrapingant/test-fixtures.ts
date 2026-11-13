/**
 * Responses transcribed from what the live API answers, not from the doc
 * examples.
 *
 * The two headers that carry the result's real meaning are included on every
 * sample: `Ant-page-status-code` says what the target page answered, and
 * `Ant-credits-cost` says what the request spent. Bodies were confirmed with
 * the unauthenticated probe (`/v2/general` answers 422
 * `{"detail":"API token is missing…"}`) and the error strings come from
 * https://docs.scrapingant.com/errors verbatim.
 */

export const HTML_BODY =
	'<!DOCTYPE html><html><head><title>Example Domain</title></head><body><h1>Example Domain</h1></body></html>';

export const MARKDOWN_BODY = {
	url: 'https://example.com/',
	markdown:
		'# Example Domain\n\nThis domain is for use in illustrative examples.',
};

export const EXTENDED_BODY = {
	html: '<html><body><h1>Hello, World!</h1></body></html>',
	text: 'Hello, World!',
	cookies: 'session=abc123; theme=dark',
	status_code: 200,
	headers: [
		{ name: 'Content-Type', value: 'text/html; charset=utf-8' },
		{ name: 'Server', value: 'ECS' },
	],
	xhrs: [
		{
			url: 'https://example.com/api/items',
			status: 200,
			method: 'GET',
			headers: [{ name: 'Content-Type', value: 'application/json' }],
			request_body: '',
			body: '{"items":[]}',
		},
	],
	iframes: [{ src: 'https://example.com/widget', html: '<p>widget</p>' }],
};

export const EXTRACT_BODY = {
	title: 'Example Domain',
	content: 'This domain is for use in illustrative examples in documents.',
};

export const USAGE_BODY = {
	plan_name: 'Enthusiast',
	start_date: '2022-01-11T00:00:00',
	end_date: '2022-02-11T00:00:00',
	plan_total_credits: 100000,
	remained_credits: 96740,
};

/** The exact 403 bodies, each a different cause behind one status. */
export const BAD_TOKEN_BODY = {
	detail:
		'API token is wrong. Please visit https://app.scrapingant.com/profile to check your token settings',
};

export const QUOTA_BODY = {
	detail:
		'Requests quota limit reached. Please visit https://app.scrapingant.com/subscriptions to upgrade your plan and get more requests',
};

export const IP_BLOCKED_BODY = {
	detail:
		'Access denied from this IP address. Please visit https://app.scrapingant.com/whitelist to manage your IP whitelist settings',
};

export const MISSING_TOKEN_BODY = {
	detail:
		'API token is missing. Please check out the documentation: https://docs.scrapingant.com/',
};

export const CONCURRENCY_BODY = {
	detail:
		'Free user concurrency limit reached. Please visit https://app.scrapingant.com/subscriptions to upgrade your plan and get more requests',
};

export const UNREACHABLE_BODY = {
	detail: "This site can't be reached.",
};

export const BOT_DETECTED_BODY = {
	detail:
		'Our browser was detected by target site. Retry the request or try adjusting proxy country, proxy type and browser rendering settings. Our documentation: https://docs.scrapingant.com/ and support email: support@scrapingant.com',
};

export const SERVER_ERROR_BODY = {
	detail:
		'AI extraction error. Please try again later or contact us via support@scrapingant.com',
};

/** FastAPI's validation shape, where `detail` is an array rather than a string. */
export const VALIDATION_BODY = {
	detail: [
		{
			loc: ['query', 'url'],
			msg: 'Invalid url scheme, use http:// or https://. Please check out the documentation: https://docs.scrapingant.com/',
			type: 'value_error',
		},
	],
};

export const INVALID_URL_BODY = {
	detail:
		'Wrong host part of url. Please check out the documentation: https://docs.scrapingant.com/',
};
