// Response bodies derived from the OpenAPI spec (api.linklyhq.com/api/openapi,
// v1.4) and the examples on linklyhq.com. No key was available at build time,
// so none of these were captured from a live 200.

export const workspace = { id: 42, name: 'Marketing' };

export const workspaces = [workspace, { id: 43, name: 'Field tests' }];

export const webhookUrl =
	'https://hooks.example.com/linkly/catch/123456/abcdef/';

/** A bare Link, the response of links.get, links.create and links.update. */
export const link = {
	id: 41657524,
	url: 'https://www.example.com/summer-sale?ref=newsletter',
	full_url: 'https://l.linklyhq.com/l/2TQ',
	workspace_id: 42,
	name: 'Summer sale newsletter',
	note: null,
	head_tags: null,
	body_tags: null,
	enabled: true,
	deleted: false,
	password: null,
	cloaking: false,
	forward_params: false,
	hide_referrer: false,
	block_bots: false,
	skip_social_crawler_tracking: false,
	public_analytics: false,
	privacy_mode: false,
	sticky_rotator: false,
	domain: null,
	slug: null,
	utm_source: 'newsletter',
	utm_medium: 'email',
	utm_campaign: 'summer_sale',
	utm_term: null,
	utm_content: null,
	og_title: null,
	og_description: null,
	og_image: null,
	fb_pixel_id: null,
	tiktok_pixel_id: null,
	ga4_tag_id: null,
	gtm_id: null,
	expiry_datetime: null,
	expiry_destination: null,
	expiry_clicks: null,
	rules: [],
	webhooks: [webhookUrl],
	notify_user_ids: [],
	notify_slack: false,
	qr_styles: null,
	metadata: { crm_id: 'acme-4711' },
	created_by_user_id: 7,
};

/** A list row: a WorkspaceLink with click statistics and no pixel fields. */
export const workspaceLink = {
	id: 30,
	url: 'https://www.example.com',
	full_url: 'https://go.yourcompany.com/promo',
	workspace_id: 42,
	name: 'Summer promo',
	note: null,
	slug: '/promo',
	domain: 'go.yourcompany.com',
	enabled: true,
	deleted: false,
	cloaking: false,
	forward_params: false,
	hide_referrer: false,
	block_bots: false,
	public_analytics: false,
	head_tags: null,
	body_tags: null,
	linkify_words: null,
	replacements: null,
	utm_source: null,
	utm_medium: null,
	utm_campaign: null,
	utm_term: null,
	utm_content: null,
	og_title: null,
	og_description: null,
	og_image: null,
	fb_pixel_id: null,
	tiktok_pixel_id: null,
	ga4_tag_id: null,
	gtm_id: null,
	rules: [],
	metadata: null,
	clicks_total: 215,
	clicks_today: 3,
	clicks_thirty_days: 64,
	human_clicks_total: 168,
	human_clicks_today: 2,
	human_clicks_thirty_days: 51,
	human_clicks_previous_day: 9,
	sparkline: [0, 2, 5, 1, 8, 3],
};

export const linkList = {
	links: [workspaceLink],
	page_number: 1,
	page_size: 1000,
	total_entries: 1,
	total_pages: 1,
	total_rows: 1,
	workspace_link_count: 1,
};

export const clicksTimeSeries = {
	traffic: [
		{ t: '2026-06-01', y: 12 },
		{ t: '2026-06-02', y: null },
		{ t: '2026-06-03', y: 21 },
	],
};

export const clicksPivot = {
	links: [
		{ id: 123, name: 'My Link', full_url: 'https://linkly.link/abc' },
		{ id: 456, name: 'Other Link', full_url: 'https://linkly.link/xyz' },
	],
	data: [
		{ date: '2025-12-30', clicks: { 123: 45, 456: 12 } },
		{ date: '2025-12-31', clicks: { 123: 52, 456: 8 } },
	],
};

export const clickCounters = {
	total: 215,
	values: [
		{ count: 120, value: 'US' },
		{ count: 64, value: 'GB' },
		{ count: 31, value: null },
	],
};

/** counter=link_id groups by the full Link object. */
export const linkCounters = {
	total: 215,
	values: [
		{ count: 120, value: workspaceLink },
		{ count: 95, value: { ...workspaceLink, id: 31 } },
	],
};

export const topParamsCounters = {
	total: 10,
	values: [{ count: 6, value: 'medium', key: 'utm_medium' }],
};

export const domains = {
	domains: [{ name: 'go.yourcompany.com' }, { name: null }],
};

export const webhookSubscriptions = [{ id: webhookUrl }];

export const subscribeResponse = { id: webhookUrl };

export const restoreResponse = {
	restored: 2,
	conflicts: [{ id: 31, domain: 'go.yourcompany.com', slug: '/promo' }],
};

/** The error envelope: `{ error, code }`. */
export function linklyError(error: string, code: string) {
	return { error, code };
}

export const unauthorized = linklyError('Not authorized', 'unauthorized');

export const forbidden = linklyError(
	'Your plan does not include custom domains',
	'forbidden',
);

export const notFound = linklyError('Link not found', 'not_found');

/** The 429 body adds usage fields to the envelope. */
export const rateLimited = {
	error: 'Rate limit exceeded',
	code: 'rate_limit_exceeded',
	current_usage: 51,
	limit: 50,
	message: 'Analytics API limit is 50 requests per hour per workspace.',
};

/** A 400 validation failure is field-keyed and carries no envelope. */
export const validationError = { slug: ['is invalid'] };

/** The spec documents some 401s as plain text rather than the envelope. */
export const textUnauthorized = 'Not authorized';

/** What DELETE answers: a bare JSON string. */
export const deleteAcknowledgement = 'Link deleted.';
