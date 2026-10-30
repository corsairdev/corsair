import type { WebhookRequest } from 'corsair/core';
import crypto from 'crypto';
import { abyssale } from './index';
import {
	matchAbyssalePluginWebhook,
	NewBannerBatchEventSchema,
	NewBannerEventSchema,
	NewExportEventSchema,
	TemplateStatusEventSchema,
	verifyAbyssaleWebhookSignature,
} from './webhooks';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const SECRET = crypto.randomBytes(32).toString('hex');
const WRONG_SECRET = crypto.randomBytes(32).toString('hex');
const ROTATED_SECRET = crypto.randomBytes(32).toString('hex');
const OTHER_SECRET = crypto.randomBytes(32).toString('hex');
const OPTIONS_SECRET = crypto.randomBytes(32).toString('hex');
const STORED_SECRET = crypto.randomBytes(32).toString('hex');

function sign(
	body: string,
	secret: string,
	timestamp = Math.floor(Date.now() / 1000),
): string {
	const digest = crypto
		.createHmac('sha256', secret)
		.update(`v1:webhook:${timestamp}.${body}`)
		.digest('hex');
	return `t=${timestamp},v1=${digest}`;
}

function signedRequest(
	eventType: string,
	extra: Record<string, unknown>,
	options: {
		secret?: string;
		timestamp?: number;
		header?: string | null;
	} = {},
): WebhookRequest<unknown> {
	const rawBody = JSON.stringify({ event_type: eventType, ...extra });
	const headers: Record<string, string> = {};
	const header =
		options.header === null
			? undefined
			: (options.header ??
				sign(rawBody, options.secret ?? SECRET, options.timestamp));
	if (header) headers['x-abyssale-signature'] = header;

	return {
		payload: JSON.parse(rawBody),
		headers,
		rawBody,
	};
}

const BANNER_ID = 'ec3a9fcd-f209-4077-b5ea-037d4bdfa9f2';
const DESIGN_ID = '873608a1-e498-47dd-a36d-bd065e3e2b8e';
const REQUEST_ID = 'c18c3cec-14c2-4539-99d4-92623b6a4aef';
const EXPORT_ID = '54e62358-2656-455c-afd7-66d5ed3dd581';

describe('verifyAbyssaleWebhookSignature', () => {
	it('accepts a correctly signed delivery', () => {
		const request = signedRequest('NEW_BANNER', { id: BANNER_ID });
		expect(verifyAbyssaleWebhookSignature(request, SECRET)).toEqual({
			valid: true,
		});
	});

	it('rejects a tampered body', () => {
		const request = signedRequest('NEW_BANNER', { id: BANNER_ID });
		request.rawBody = `${request.rawBody} `;
		expect(verifyAbyssaleWebhookSignature(request, SECRET)).toEqual({
			valid: false,
			error: 'Invalid signature',
		});
	});

	it('rejects a signature made with a different secret', () => {
		const request = signedRequest(
			'NEW_BANNER',
			{ id: BANNER_ID },
			{
				secret: WRONG_SECRET,
			},
		);
		expect(verifyAbyssaleWebhookSignature(request, SECRET)).toEqual({
			valid: false,
			error: 'Invalid signature',
		});
	});

	it('rejects a delivery older than the tolerance window', () => {
		const stale = Math.floor(Date.now() / 1000) - 301;
		const request = signedRequest(
			'NEW_BANNER',
			{ id: BANNER_ID },
			{ timestamp: stale },
		);
		expect(verifyAbyssaleWebhookSignature(request, SECRET)).toEqual({
			valid: false,
			error: 'Signature timestamp outside tolerance',
		});
	});

	it('checks every v1 during a rotation', () => {
		const rawBody = JSON.stringify({ event_type: 'NEW_BANNER', id: BANNER_ID });
		const rotatedSecret = ROTATED_SECRET;
		// Read the clock once so both v1 hashes sign the same timestamp even if
		// the wall clock crosses a second boundary mid-test.
		const timestamp = Math.floor(Date.now() / 1000);
		const header =
			`${sign(rawBody, SECRET, timestamp)},v1=` +
			crypto
				.createHmac('sha256', rotatedSecret)
				.update(`v1:webhook:${timestamp}.${rawBody}`)
				.digest('hex');

		// The first v1 was minted with the old secret and must verify too.
		const request: WebhookRequest<unknown> = {
			payload: JSON.parse(rawBody),
			headers: { 'x-abyssale-signature': header },
			rawBody,
		};
		expect(verifyAbyssaleWebhookSignature(request, SECRET)).toEqual({
			valid: true,
		});
		expect(verifyAbyssaleWebhookSignature(request, rotatedSecret)).toEqual({
			valid: true,
		});
	});

	it.each([
		['garbage', 'Malformed signature timestamp'],
		['t=not-a-number,v1=abc', 'Malformed signature timestamp'],
		[
			`t=${Math.floor(Date.now() / 1000)}`,
			'Malformed signature header: no v1 value',
		],
	])('returns invalid instead of throwing on header %j', (header, error) => {
		const request: WebhookRequest<unknown> = {
			payload: {},
			headers: { 'x-abyssale-signature': header },
			rawBody: '{}',
		};
		expect(verifyAbyssaleWebhookSignature(request, SECRET)).toEqual({
			valid: false,
			error,
		});
	});

	it('rejects a signed delivery whose raw body is unavailable', () => {
		const request = signedRequest('NEW_BANNER', { id: BANNER_ID });
		request.rawBody = undefined;
		expect(verifyAbyssaleWebhookSignature(request, SECRET)).toEqual({
			valid: false,
			error: 'Missing raw body for signature verification',
		});
	});

	it('skips verification when the Hub already verified the delivery', () => {
		const request: WebhookRequest<unknown> = {
			payload: {},
			headers: {},
			rawBody: '{}',
			hubVerified: true,
		};
		expect(verifyAbyssaleWebhookSignature(request, undefined)).toEqual({
			valid: true,
		});
	});

	it('rejects an unsigned delivery whether or not a secret is configured', () => {
		const request = signedRequest(
			'NEW_BANNER',
			{ id: BANNER_ID },
			{ header: null },
		);
		const unconfigured = verifyAbyssaleWebhookSignature(request, undefined);
		expect(unconfigured.valid).toBe(false);
		expect(unconfigured.error).toContain('no webhook secret is configured');
		expect(verifyAbyssaleWebhookSignature(request, SECRET).valid).toBe(false);
	});

	it('rejects a signed delivery when no secret is configured', () => {
		const request = signedRequest('NEW_BANNER', { id: BANNER_ID });
		const result = verifyAbyssaleWebhookSignature(request, undefined);
		expect(result.valid).toBe(false);
		expect(result.error).toContain('no webhook secret is configured');
	});
});

describe('event schemas', () => {
	it('parses a documented NEW_BANNER payload', () => {
		const parsed = NewBannerEventSchema.safeParse({
			event_type: 'NEW_BANNER',
			id: BANNER_ID,
			version: 1,
			sharing_id: '5fcec999-2bfb-4dd7-ba38-2d9e16c49149',
			file: {
				type: 'jpeg',
				url: 'url/name.jpeg',
				cdn_url: 'cdn/name.jpeg',
				filename: 'name.jpeg',
			},
			format: { id: '300x250-medium-rectangle', width: 300, height: 250 },
			template: {
				id: DESIGN_ID,
				name: 'Template name',
				created_at: 1623229458,
				updated_at: 1649942114,
			},
		});
		expect(parsed.success).toBe(true);
	});

	it('parses NEW_BANNER items that omit version, sharing_id and format.id', () => {
		const parsed = NewBannerBatchEventSchema.safeParse({
			event_type: 'NEW_BANNER_BATCH',
			generation_request_id: REQUEST_ID,
			banners: [
				{
					id: BANNER_ID,
					file: { type: 'zip', url: 'url/name.zip' },
					format: { width: 1200, height: 628 },
				},
			],
			errors: [
				{
					template_format_name: 'some-format',
					reason: 'The text cannot fit within the defined space.',
				},
			],
		});
		expect(parsed.success).toBe(true);
	});

	it('parses a successful NEW_BANNER_BATCH that omits errors', () => {
		const parsed = NewBannerBatchEventSchema.safeParse({
			event_type: 'NEW_BANNER_BATCH',
			generation_request_id: REQUEST_ID,
			banners: [{ id: BANNER_ID }],
		});
		expect(parsed.success).toBe(true);
		if (parsed.success) {
			expect(parsed.data.errors).toEqual([]);
		}
	});

	it('parses NEW_EXPORT and TEMPLATE_STATUS payloads', () => {
		expect(
			NewExportEventSchema.safeParse({
				event_type: 'NEW_EXPORT',
				export_id: EXPORT_ID,
				archive_url: 'https://example.com/export.zip',
				requested_at: 1649838051,
				generated_at: 1649838135,
			}).success,
		).toBe(true);
		expect(
			TemplateStatusEventSchema.safeParse({
				event_type: 'TEMPLATE_STATUS',
				id: DESIGN_ID,
				name: 'Template name',
				status: 'APPROVED',
				created_at: 1623229458,
				updated_at: 1649837900,
				status_updated_at: 1649837939,
			}).success,
		).toBe(true);
	});

	it('rejects a banner payload with an unknown event_type', () => {
		expect(
			NewBannerEventSchema.safeParse({
				event_type: 'SOMETHING_ELSE',
				id: BANNER_ID,
			}).success,
		).toBe(false);
	});
});

describe('matchers', () => {
	it.each([
		['NEW_BANNER', 'banners.created'],
		['NEW_BANNER_BATCH', 'banners.batchCompleted'],
		['NEW_EXPORT', 'exports.completed'],
		['TEMPLATE_STATUS', 'designs.statusChanged'],
	] as const)('%s routes to %s and only to it', (eventType, webhookPath) => {
		const plugin = abyssale({ key: 'k' }) as any;
		for (const [path, webhook] of Object.entries(flatten(plugin.webhooks))) {
			const raw = {
				headers: {},
				body: JSON.stringify({ event_type: eventType }),
			};
			expect(webhook.match(raw)).toBe(path === webhookPath);
		}
	});

	it('ignores unknown Abyssale events', () => {
		const plugin = abyssale({ key: 'k' }) as any;
		const raw = {
			headers: {},
			body: JSON.stringify({ event_type: 'NEW_FUTURE_EVENT' }),
		};
		for (const webhook of Object.values(flatten(plugin.webhooks))) {
			expect(webhook.match(raw)).toBe(false);
		}
	});

	it('plugin matcher accepts handled events regardless of signing state', () => {
		expect(
			matchAbyssalePluginWebhook({
				headers: {},
				body: JSON.stringify({ event_type: 'NEW_BANNER' }),
			}),
		).toBe(true);
		expect(matchAbyssalePluginWebhook({ headers: {}, body: 'not json' })).toBe(
			false,
		);
	});
});

function flatten(tree: unknown, prefix = ''): Record<string, any> {
	const flat: Record<string, any> = {};
	for (const [key, value] of Object.entries(tree as Record<string, any>)) {
		const path = prefix ? `${prefix}.${key}` : key;
		if (typeof value?.match === 'function') flat[path] = value;
		else Object.assign(flat, flatten(value, path));
	}
	return flat;
}

describe('webhook handlers', () => {
	const upsert = jest.fn();
	const makeCtx = (key?: string) =>
		({
			key,
			options: {},
			db: { banners: { upsertByEntityId: upsert } },
		}) as any;

	beforeEach(() => {
		upsert.mockReset();
		upsert.mockResolvedValue({ id: 'corsair-entity-1' });
	});

	it('newBanner caches the visual and returns its entity id', async () => {
		const plugin = abyssale({ key: 'k', webhookSecret: SECRET }) as any;
		const handler = plugin.webhooks.banners.created.handler;
		const response = await handler(
			makeCtx(SECRET),
			signedRequest('NEW_BANNER', { id: BANNER_ID }),
		);

		expect(response.success).toBe(true);
		expect(response.corsairEntityId).toBe('corsair-entity-1');
		expect(upsert).toHaveBeenCalledWith(
			BANNER_ID,
			expect.objectContaining({ id: BANNER_ID }),
		);
	});

	it('newBannerBatch caches every banner in the batch', async () => {
		const plugin = abyssale({ key: 'k', webhookSecret: SECRET }) as any;
		const handler = plugin.webhooks.banners.batchCompleted.handler;
		const secondId = 'a14e1d26-ff41-47cb-bbf9-8f2d777a5bd7';
		const response = await handler(
			makeCtx(SECRET),
			signedRequest('NEW_BANNER_BATCH', {
				generation_request_id: REQUEST_ID,
				banners: [{ id: BANNER_ID }, { id: secondId }],
				errors: [],
			}),
		);

		expect(response.success).toBe(true);
		expect(upsert).toHaveBeenCalledTimes(2);
		expect(response.corsairEntityId).toBe('corsair-entity-1');
	});

	it('newBannerBatch caches banners when the payload omits errors', async () => {
		const plugin = abyssale({ key: 'k', webhookSecret: SECRET }) as any;
		const handler = plugin.webhooks.banners.batchCompleted.handler;
		const response = await handler(
			makeCtx(SECRET),
			signedRequest('NEW_BANNER_BATCH', {
				generation_request_id: REQUEST_ID,
				banners: [{ id: BANNER_ID }],
			}),
		);

		expect(response.success).toBe(true);
		expect(upsert).toHaveBeenCalledWith(
			BANNER_ID,
			expect.objectContaining({ id: BANNER_ID }),
		);
	});

	it('newBanner omits corsairEntityId when caching is unavailable', async () => {
		upsert.mockResolvedValueOnce(null);
		const plugin = abyssale({ key: 'k', webhookSecret: SECRET }) as any;
		const handler = plugin.webhooks.banners.created.handler;
		const response = await handler(
			makeCtx(SECRET),
			signedRequest('NEW_BANNER', { id: BANNER_ID }),
		);

		expect(response.success).toBe(true);
		expect(response.corsairEntityId).toBeUndefined();
	});

	it('newBannerBatch omits corsairEntityId when no banner was cached', async () => {
		const plugin = abyssale({ key: 'k', webhookSecret: SECRET }) as any;
		const handler = plugin.webhooks.banners.batchCompleted.handler;
		const response = await handler(
			makeCtx(SECRET),
			signedRequest('NEW_BANNER_BATCH', {
				generation_request_id: REQUEST_ID,
				banners: [],
				errors: [],
			}),
		);

		expect(response.success).toBe(true);
		expect(response.corsairEntityId).toBeUndefined();
	});

	it('returns 401 when the signature is invalid', async () => {
		const plugin = abyssale({ key: 'k', webhookSecret: SECRET }) as any;
		const handler = plugin.webhooks.banners.created.handler;
		const response = await handler(
			makeCtx(SECRET),
			signedRequest('NEW_BANNER', { id: BANNER_ID }, { secret: OTHER_SECRET }),
		);

		expect(response.success).toBe(false);
		expect(response.statusCode).toBe(401);
		expect(upsert).not.toHaveBeenCalled();
	});

	it('returns 400 on a payload that breaks the schema', async () => {
		const plugin = abyssale({ key: 'k', webhookSecret: SECRET }) as any;
		const handler = plugin.webhooks.designs.statusChanged.handler;
		const response = await handler(
			makeCtx(SECRET),
			signedRequest('TEMPLATE_STATUS', { id: 'nope' }),
		);

		expect(response.success).toBe(false);
		expect(response.statusCode).toBe(400);
	});

	it('exports.completed succeeds without caching anything', async () => {
		const plugin = abyssale({ key: 'k', webhookSecret: SECRET }) as any;
		const handler = plugin.webhooks.exports.completed.handler;
		const response = await handler(
			makeCtx(SECRET),
			signedRequest('NEW_EXPORT', {
				export_id: EXPORT_ID,
				archive_url: 'https://example.com/export.zip',
			}),
		);

		expect(response.success).toBe(true);
		expect(upsert).not.toHaveBeenCalled();
	});

	it('resolves the webhook secret through keyBuilder', async () => {
		const plugin = abyssale({ webhookSecret: OPTIONS_SECRET }) as any;
		const key = await plugin.keyBuilder(
			{ authType: 'api_key', keys: { get_webhook_signature: jest.fn() } },
			'webhook',
		);
		expect(key).toBe(OPTIONS_SECRET);

		const dynamicPlugin = abyssale({}) as any;
		const dynamicCtx = {
			authType: 'api_key',
			keys: {
				get_webhook_signature: jest.fn().mockResolvedValue(STORED_SECRET),
			},
		};
		await expect(dynamicPlugin.keyBuilder(dynamicCtx, 'webhook')).resolves.toBe(
			STORED_SECRET,
		);
	});
});
