import { createHmac } from 'node:crypto';
import { AuthMissingError } from 'corsair/core';
import {
	checkSegmentStoredPairing,
	normalizeSegmentRegion,
	resolveSegmentTarget,
} from './auth';
import {
	segmentEndpointMeta,
	segmentEndpointsNested,
} from './endpoints/catalog';
import { segmentOperations } from './endpoints/manifest';
import type { SegmentContext } from './index';
import { segment } from './index';
import {
	matchSegmentWebhook,
	segmentWebhooksNested,
	verifySegmentSignature,
} from './webhooks';

// Segment specifics on top of the generic suites: the API version each route
// is pinned to (sent as Accept), dot-style paging, the Tracking API on its own
// host with a write key, EU hosts, and webhooks signed with HMAC-SHA1.

type Captured = {
	url: string;
	method: string;
	headers: Headers;
	body: unknown;
};
let calls: Captured[] = [];

function reply(status: number, body: unknown) {
	jest.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
		calls.push({
			url: String(input),
			method: init?.method ?? 'GET',
			headers: new Headers(init?.headers),
			body: init?.body,
		});
		return new Response(JSON.stringify(body), {
			status,
			headers: { 'content-type': 'application/json' },
		});
	});
}

const TOKEN = 'sgp_live_like_token';
const WRITE_KEY = 'wk1234567890abcdefWRITEKEY';

function ctx(
	options: Record<string, string> = {},
	stored: Record<string, string | null> = {},
	key = TOKEN,
): SegmentContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key,
		options,
		keys: {
			get_api_key: () => Promise.resolve(key),
			get_region: () => Promise.resolve(stored.region ?? null),
			get_write_key: () => Promise.resolve(stored.write_key ?? null),
		},
		db: {},
		// `unknown` because a test context fills only the fields the endpoints read.
	} as unknown as SegmentContext;
}

const basic = (key: string) =>
	`Basic ${Buffer.from(`${key}:`).toString('base64')}`;

beforeEach(() => {
	calls = [];
});
afterEach(() => {
	jest.restoreAllMocks();
});

describe('API versions', () => {
	it('pins every Public API route to one Segment media type, sent as Accept', () => {
		for (const operation of segmentOperations) {
			if (operation.host) continue;
			expect([operation.id, operation.accept]).toEqual([
				operation.id,
				expect.stringMatching(
					/^application\/vnd\.segment\.v(1|2|1beta|1alpha)\+json$/,
				),
			]);
		}
	});

	it('asks for v1 on sources, v2 on warehouses and alpha where that is all there is', async () => {
		reply(200, { data: { sources: [], pagination: {} } });
		await segmentEndpointsNested.sources.list(ctx(), {});
		reply(200, { data: { warehouses: [], pagination: {} } });
		await segmentEndpointsNested.warehouses.list(ctx(), {});
		reply(200, { data: { spaces: [] } });
		await segmentEndpointsNested.spaces.list(ctx(), {});
		expect(calls.map((c) => c.headers.get('accept'))).toEqual([
			'application/vnd.segment.v1+json',
			'application/vnd.segment.v2+json',
			'application/vnd.segment.v1alpha+json',
		]);
		expect(calls[0]?.headers.get('authorization')).toBe(`Bearer ${TOKEN}`);
	});

	it('sends a body in the same version it asks for', async () => {
		reply(200, { data: { source: { id: 'src1' } } });
		await segmentEndpointsNested.sources.create(ctx(), {
			slug: 'my-http-source',
			enabled: true,
			metadataId: 'xRxTnDHSqG',
		});
		const call = calls[0] as Captured;
		expect(call.url).toBe('https://api.segmentapis.com/sources');
		expect(call.method).toBe('POST');
		expect(call.headers.get('content-type')).toBe(
			'application/vnd.segment.v1+json',
		);
		expect(JSON.parse(String(call.body))).toEqual({
			slug: 'my-http-source',
			enabled: true,
			metadataId: 'xRxTnDHSqG',
		});
	});
});

describe('paging', () => {
	it('sends pagination.count and pagination.cursor as dot-style query values', async () => {
		reply(200, { data: { sources: [], pagination: {} } });
		await segmentEndpointsNested.sources.list(ctx(), {
			pagination: { count: 5, cursor: 'MA==' },
		});
		const url = new URL(String(calls[0]?.url));
		expect(url.searchParams.get('pagination.count')).toBe('5');
		expect(url.searchParams.get('pagination.cursor')).toBe('MA==');
		expect([...url.searchParams.keys()].some((k) => k.includes('['))).toBe(
			false,
		);
	});

	it('sends a page size when the caller passes none (Segment requires one)', async () => {
		reply(200, { data: { sources: [], pagination: {} } });
		await segmentEndpointsNested.sources.list(ctx(), {});
		reply(200, { data: { filters: [], pagination: {} } });
		await segmentEndpointsNested.filters.list(ctx(), { integrationId: 'int1' });
		const urls = calls.map((c) => new URL(c.url));
		expect(urls[0]?.searchParams.get('pagination.count')).toBe('200');
		expect(urls[1]?.searchParams.get('pagination.count')).toBe('10');
	});

	it('sends other object query values (filters) the same way', async () => {
		reply(200, { data: {} });
		await segmentEndpointsNested.deliveryOverview.getFailedDelivery(ctx(), {
			sourceId: 'src1',
			destinationConfigId: 'dest1',
			startTime: '2026-11-01T00:00:00Z',
			endTime: '2026-11-02T00:00:00Z',
			granularity: 'DAY',
			filter: { discardReason: ['a', 'b'] },
		});
		const url = new URL(String(calls[0]?.url));
		expect(url.searchParams.getAll('filter.discardReason')).toEqual(['a', 'b']);
	});
});

describe('Tracking API', () => {
	it('sends tracking calls to api.segment.io/v1 with the write key as the Basic username', async () => {
		reply(200, { success: true });
		const result = await segmentEndpointsNested.tracking.track(
			ctx({ writeKey: WRITE_KEY }),
			{
				userId: 'user-1',
				event: 'Order Completed',
				properties: { revenue: 4 },
			},
		);
		expect(result).toEqual({ success: true });
		const call = calls[0] as Captured;
		expect(call.url).toBe('https://api.segment.io/v1/track');
		expect(call.headers.get('authorization')).toBe(basic(WRITE_KEY));
		expect(call.headers.get('content-type')).toBe('application/json');
		expect(JSON.parse(String(call.body))).toEqual({
			userId: 'user-1',
			event: 'Order Completed',
			properties: { revenue: 4 },
		});
	});

	it('reads the stored write_key, and never sends the Public API token there', async () => {
		reply(200, { success: true });
		await segmentEndpointsNested.tracking.identify(
			ctx({}, { write_key: WRITE_KEY }),
			{ userId: 'user-1', traits: { plan: 'pro' } },
		);
		expect(calls[0]?.headers.get('authorization')).toBe(basic(WRITE_KEY));
		await expect(
			segmentEndpointsNested.tracking.identify(ctx(), { userId: 'user-1' }),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(calls).toHaveLength(1);
	});

	it('uses a write key connected as the key itself (the Free plan has no Public API)', async () => {
		reply(200, { success: true });
		await segmentEndpointsNested.tracking.page(ctx({}, {}, WRITE_KEY), {
			anonymousId: 'anon-1',
			name: 'Home',
		});
		expect(calls[0]?.headers.get('authorization')).toBe(basic(WRITE_KEY));
	});

	it('sends a batch as one body', async () => {
		reply(200, { success: true });
		await segmentEndpointsNested.tracking.batch(ctx({ writeKey: WRITE_KEY }), {
			batch: [
				{ type: 'identify', userId: 'u1', traits: { name: 'Ada' } },
				{ type: 'track', userId: 'u1', event: 'Signed Up' },
			],
		});
		const call = calls[0] as Captured;
		expect(call.url).toBe('https://api.segment.io/v1/batch');
		expect(JSON.parse(String(call.body)).batch).toHaveLength(2);
	});

	it('requires the fields each call needs before sending', async () => {
		reply(200, { success: true });
		await expect(
			segmentEndpointsNested.tracking.track(ctx({ writeKey: WRITE_KEY }), {
				userId: 'u1',
			} as never),
		).rejects.toThrow(/event/);
		await expect(
			segmentEndpointsNested.tracking.alias(ctx({ writeKey: WRITE_KEY }), {
				userId: 'u1',
			} as never),
		).rejects.toThrow(/previousId/);
		expect(calls).toHaveLength(0);
	});

	it('keeps the write key out of errors', async () => {
		// The body Segment sent live (11-28) for a call over 32 KB, plus an echo of the key.
		reply(400, {
			success: false,
			message: `Exceed payload limit (${WRITE_KEY})`,
			code: 'invalid_request',
		});
		const error = await segmentEndpointsNested.tracking
			.track(ctx({ writeKey: WRITE_KEY }), { userId: 'u1', event: 'X' })
			.catch((e: unknown) => e as Error);
		expect(String(error)).toMatch(/Segment 400: Exceed payload limit/);
		expect(JSON.stringify(error)).not.toContain(WRITE_KEY);
		expect(String(error)).not.toContain(WRITE_KEY);
	});
});

describe('regions', () => {
	it('reads us and eu in their common spellings', () => {
		expect(normalizeSegmentRegion(undefined)).toBe('us');
		expect(normalizeSegmentRegion('EU1')).toBe('eu');
		expect(normalizeSegmentRegion('eu-west-1')).toBe('eu');
		expect(() => normalizeSegmentRegion('apac')).toThrow(/us or eu/);
	});

	it('sends an EU workspace to the EU hosts', async () => {
		reply(200, { data: { workspace: { id: 'w1' } } });
		await segmentEndpointsNested.workspaces.get(ctx({}, { region: 'eu' }), {});
		reply(200, { success: true });
		await segmentEndpointsNested.tracking.track(
			ctx({ region: 'eu', writeKey: WRITE_KEY }),
			{ userId: 'u1', event: 'X' },
		);
		expect(calls.map((c) => c.url)).toEqual([
			'https://eu1.api.segmentapis.com/',
			'https://events.eu1.segmentapis.com/v1/track',
		]);
	});

	it('takes another https base only with a key passed in options', async () => {
		await expect(
			resolveSegmentTarget({
				key: TOKEN,
				options: { baseUrl: 'http://proxy.example.com' },
			}),
		).rejects.toThrow(/https/);
		await expect(
			checkSegmentStoredPairing({ baseUrl: 'https://proxy.example.com' }, {}),
		).rejects.toBeInstanceOf(AuthMissingError);
		await expect(
			checkSegmentStoredPairing(
				{ baseUrl: 'https://api.segmentapis.com/' },
				{},
			),
		).resolves.toBeUndefined();
		const keyBuilder = segment({
			baseUrl: 'https://proxy.example.com',
		}).keyBuilder;
		if (!keyBuilder) throw new Error('no key builder');
		await expect(
			keyBuilder(
				// `unknown` because the key-builder context is only partly filled.
				{
					keys: { get_api_key: () => Promise.resolve(TOKEN) },
				} as unknown as Parameters<typeof keyBuilder>[0],
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});

describe('errors', () => {
	it("reads Segment's { errors: [{ type, message }] } body", async () => {
		// The envelope the Public API sent live (11-28) for a token it refused (403).
		reply(404, {
			errors: [{ type: 'not-found', message: 'Resource not found' }],
		});
		const error = await segmentEndpointsNested.sources
			.get(ctx(), { sourceId: 'missing' })
			.then(
				() => new Error('no error') as Error & { status?: number },
				(e: unknown) => e as Error & { status?: number },
			);
		expect(error.status).toBe(404);
		expect(error.message).toBe('Segment 404: Resource not found');
		expect(error.message).not.toContain(TOKEN);
	});
});

describe('risk levels', () => {
	it('marks deletions, credentials, invites, deploys and syncs destructive', () => {
		for (const id of [
			'regulations.create',
			'sources.delete',
			'sources.createWriteKey',
			'sources.removeWriteKey',
			'invites.create',
			'functions.deploy',
			'reverseEtl.syncs.create',
			'users.delete',
		]) {
			expect([
				id,
				segmentEndpointMeta[id as keyof typeof segmentEndpointMeta]?.riskLevel,
			]).toEqual([id, 'destructive']);
		}
		expect(segmentEndpointMeta['sources.list'].riskLevel).toBe('read');
		expect(segmentEndpointMeta['warehouses.validate'].riskLevel).toBe('read');
		expect(segmentEndpointMeta['tracking.track'].riskLevel).toBe('write');
		expect(segmentEndpointMeta['sources.update'].riskLevel).toBe('write');
	});
});

describe('webhooks', () => {
	const SECRET = 'shared-secret-from-the-destination';
	const event = {
		type: 'track',
		event: 'Order Completed',
		userId: 'user-1',
		messageId: 'ajs-123',
		properties: { revenue: 4 },
		timestamp: '2026-11-28T10:00:00.000Z',
	};
	const rawBody = JSON.stringify(event);
	const sign = (body: string, secret = SECRET) =>
		createHmac('sha1', secret).update(body).digest('hex');
	const request = (body = rawBody, signature = sign(body)) => ({
		headers: {
			'user-agent': 'Segment.io/1.0',
			'content-type': 'application/json',
			'x-signature': signature,
		},
		body,
		rawBody: body,
		payload: JSON.parse(body),
	});
	const webhookCtx = {
		...ctx(),
		key: SECRET,
	} as unknown as SegmentContext;

	it('verifies the HMAC-SHA1 signature and refuses a changed body or wrong secret', () => {
		expect(verifySegmentSignature(request(), SECRET)).toBe(true);
		expect(verifySegmentSignature(request(), 'wrong')).toBe(false);
		expect(
			verifySegmentSignature(
				request(rawBody.replace('Order', 'Orders'), sign(rawBody)),
				SECRET,
			),
		).toBe(false);
		expect(verifySegmentSignature(request(rawBody, 'not-hex'), SECRET)).toBe(
			false,
		);
	});

	it('matches Segment requests by their event type only', () => {
		expect(matchSegmentWebhook(request())).toBe(true);
		expect(
			matchSegmentWebhook({
				headers: { 'user-agent': 'curl/8' },
				body: rawBody,
			}),
		).toBe(false);
		expect(
			matchSegmentWebhook(request(JSON.stringify({ ...event, type: 'other' }))),
		).toBe(false);
		expect(segmentWebhooksNested.events.track.match(request())).toBe(true);
		expect(segmentWebhooksNested.events.identify.match(request())).toBe(false);
	});

	it('hands over a verified event and refuses an unsigned one', async () => {
		const ok = await segmentWebhooksNested.events.track.handler(
			webhookCtx,
			request(),
		);
		expect(ok).toMatchObject({ success: true, data: event });
		const bad = await segmentWebhooksNested.events.track.handler(
			webhookCtx,
			request(rawBody, sign(rawBody, 'other')),
		);
		expect(bad).toMatchObject({ success: false, statusCode: 401 });
	});
});
