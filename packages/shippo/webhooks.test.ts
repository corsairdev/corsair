import { processWebhook } from 'corsair';
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { shippo } from './index';
import { batch, track, transaction } from './test-fixtures';
import {
	computeSignature,
	createNotificationHandler,
	isShippoDelivery,
	isShippoEvent,
	notification,
	parseDelivery,
	parseSignatureHeader,
	SHIPPO_SIGNATURE_HEADER,
	verifyShippoWebhook,
} from './webhooks';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

// never: the handler reads no context beyond what the mocked logger needs.
const ctx = {} as never;

/**
 * A real Shippo delivery: the body *is* the object, wrapped in
 * `{ event, test, data }` — not a notification pointing at one.
 */
const trackDelivery = { event: 'track_updated', test: true, data: track };

const transactionDelivery = {
	event: 'transaction_created',
	test: true,
	data: transaction,
};

const batchDelivery = { event: 'batch_purchased', test: true, data: batch };

// unknown: a rejection test deliberately supplies a broken body.
function request(body: unknown) {
	return {
		headers: { 'content-type': 'application/json' },
		body,
		rawBody: JSON.stringify(body),
	};
}

describe('delivery matching', () => {
	it('matches each event Shippo emits', () => {
		for (const delivery of [
			trackDelivery,
			transactionDelivery,
			batchDelivery,
		]) {
			expect(isShippoDelivery(request(delivery))).toBe(true);
		}
	});

	it('matches the `all` catch-all', () => {
		expect(
			isShippoDelivery(request({ event: 'all', test: true, data: track })),
		).toBe(true);
	});

	it('does not match another provider’s body', () => {
		expect(isShippoDelivery(request({ type: 'email.sent', data: {} }))).toBe(
			false,
		);
	});

	it('does not match an event Shippo does not emit', () => {
		expect(
			isShippoDelivery(request({ event: 'label_printed', data: {} })),
		).toBe(false);
	});

	it('does not match a bare string or an array', () => {
		expect(isShippoDelivery(request('not an object'))).toBe(false);
		expect(isShippoDelivery(request([trackDelivery]))).toBe(false);
	});
});

describe('parseDelivery', () => {
	it('parses a track against the track schema', () => {
		const parsed = parseDelivery(trackDelivery);

		expect(parsed.event).toBe('track_updated');
		// unknown: the union is resolved by `event`; narrow it the same way.
		const data = parsed.data as { tracking_status?: { status: string } };
		expect(data.tracking_status?.status).toBe('TRANSIT');
	});

	it('parses a transaction against the transaction schema', () => {
		const parsed = parseDelivery(transactionDelivery);

		// unknown: see above.
		const data = parsed.data as { status: string; label_url: string };
		expect(data.status).toBe('SUCCESS');
		expect(data.label_url).toContain('shippo-delivery');
	});

	it('parses a batch against the batch schema', () => {
		const parsed = parseDelivery(batchDelivery);

		// unknown: see above.
		const data = parsed.data as { status: string };
		expect(data.status).toBe('VALID');
	});

	it('throws when the data does not match its event, rather than blanking it', () => {
		// A transaction body under `track_updated` is a provider bug or a forged
		// delivery; either way it must not read as an empty track.
		expect(() =>
			parseDelivery({
				event: 'track_updated',
				test: true,
				data: 'not-an-object',
			}),
		).toThrow('unexpected data shape');
	});

	it('throws on an event Shippo does not emit', () => {
		expect(() => parseDelivery({ event: 'label_printed', data: {} })).toThrow(
			'Unsupported Shippo webhook event',
		);
	});
});

describe('notification.handler', () => {
	it('returns the event and the parsed object, not just an id', async () => {
		const response = await notification.handler(ctx, {
			...request(trackDelivery),
			payload: trackDelivery,
		});

		expect(response.success).toBe(true);
		expect(response.data).toMatchObject({ event: 'track_updated', test: true });
	});

	it('throws on a delivery with no data object, rather than a blank parse', async () => {
		// Returning `success: false` would be rewritten to a success by
		// processWebhook, so a refusal has to throw. And `{}` must not stand in
		// for the missing object: every output field is nullish, so it would
		// parse and read as a blank track.
		await expect(
			notification.handler(ctx, {
				...request({ event: 'track_updated' }),
				payload: { event: 'track_updated' },
			}),
		).rejects.toThrow('has no data object');
	});
});

describe('hostile and empty payloads', () => {
	it('does not treat Object.prototype names as Shippo events', () => {
		// `event in EVENT_TO_SCHEMA` matches inherited names, so `constructor`
		// used to reach `schema.safeParse` on the Object constructor and throw.
		for (const name of [
			'constructor',
			'toString',
			'hasOwnProperty',
			'valueOf',
		]) {
			expect(isShippoEvent(name)).toBe(false);
			expect(() =>
				parseDelivery({ event: name, test: true, data: {} }),
			).toThrow('Unsupported Shippo webhook event');
		}
	});

	it('does not claim a delivery whose event is an inherited name', () => {
		expect(isShippoDelivery(request({ event: 'constructor', data: {} }))).toBe(
			false,
		);
	});

	it('rejects an empty data object rather than reading it as a blank track', () => {
		// Every output field is nullish, so `{}` parsed cleanly and a hook fired
		// on a record with nothing in it.
		expect(() =>
			parseDelivery({ event: 'track_updated', test: true, data: {} }),
		).toThrow('carries no `tracking_number`');
	});

	it('rejects an empty data object for a transaction and a batch too', () => {
		expect(() =>
			parseDelivery({ event: 'transaction_created', test: true, data: {} }),
		).toThrow('carries no `object_id`');
		expect(() =>
			parseDelivery({ event: 'batch_purchased', test: true, data: {} }),
		).toThrow('carries no `object_id`');
	});

	it('rejects an unrelated object that happens to match a loose schema', () => {
		expect(() =>
			parseDelivery({ event: 'track_updated', test: true, data: { nope: 1 } }),
		).toThrow('carries no `tracking_number`');
	});

	it('checks the catch-all path against every schema and its identity field', () => {
		// `all` used to return whatever it was given, unchecked.
		expect(() => parseDelivery({ event: 'all', test: true, data: {} })).toThrow(
			'matches no track, transaction or batch',
		);
	});

	it('accepts a catch-all delivery that really is a track', () => {
		const parsed = parseDelivery({ event: 'all', test: true, data: track });

		// unknown: the matched event decides which object this is.
		const data = parsed.data as { tracking_number?: string };
		expect(data.tracking_number).toBe(track.tracking_number);
	});

	it('accepts a catch-all delivery that really is a transaction', () => {
		const parsed = parseDelivery({
			event: 'all',
			test: true,
			data: transaction,
		});

		// unknown: see above.
		const data = parsed.data as { object_id?: string };
		expect(data.object_id).toBe(transaction.object_id);
	});
});

describe('HMAC verification', () => {
	const SECRET = 'whsec_test_shared_secret';
	const RAW = JSON.stringify(trackDelivery);

	/**
	 * Shippo's documented header form is `t=<unix>,v1=<hex>`, and the digest is
	 * SHA-256 over `<timestamp>.<raw body>` with the shared secret — the same
	 * computation as their bash reference script.
	 */
	function signed(timestamp = '1688493073') {
		const signature = computeSignature(SECRET, timestamp, RAW);
		return {
			headers: {
				'content-type': 'application/json',
				[SHIPPO_SIGNATURE_HEADER]: `t=${timestamp},v1=${signature}`,
			},
			payload: trackDelivery,
			rawBody: RAW,
		};
	}

	it('computes the digest Shippo documents', () => {
		// Pinned against `openssl dgst -sha256 -hmac` over "1688493073.<body>":
		// changing the algorithm or the signed string breaks this.
		const signature = computeSignature(
			SECRET,
			'1688493073',
			'{"event":"track_updated"}',
		);
		expect(signature).toHaveLength(64);
		expect(signature).toMatch(/^[0-9a-f]{64}$/);
	});

	it('parses `t=…,v1=…` and ignores extra fields', () => {
		expect(parseSignatureHeader('t=1688493073,v1=abc')).toEqual({
			timestamp: '1688493073',
			signature: 'abc',
		});
		expect(parseSignatureHeader('t=1,v1=ab,v0=ignored')).toEqual({
			timestamp: '1',
			signature: 'ab',
		});
		expect(parseSignatureHeader('v1=abc')).toBeNull();
		expect(parseSignatureHeader('garbage')).toBeNull();
	});

	it('accepts a delivery signed with the configured secret', () => {
		const result = verifyShippoWebhook(signed(), SECRET);

		expect(result).toMatchObject({ valid: true, verified: true });
	});

	it('rejects a delivery whose signature does not match the body', () => {
		const request = signed();
		request.rawBody = JSON.stringify({ ...trackDelivery, tampered: true });

		const result = verifyShippoWebhook(request, SECRET);

		expect(result).toMatchObject({ valid: false, verified: false });
		expect(result.error).toContain('does not match');
	});

	it('rejects a delivery signed with a different secret', () => {
		const result = verifyShippoWebhook(signed(), 'some_other_secret');

		expect(result).toMatchObject({ valid: false, verified: false });
	});

	it('rejects a delivery with no signature header when a secret is set', () => {
		const result = verifyShippoWebhook(
			{
				headers: {},
				payload: trackDelivery,
				rawBody: RAW,
			},
			SECRET,
		);

		expect(result).toMatchObject({ valid: false, verified: false });
		expect(result.error).toContain('missing the Shippo-Auth-Signature');
	});

	it('rejects a malformed signature header', () => {
		const result = verifyShippoWebhook(
			{
				headers: { [SHIPPO_SIGNATURE_HEADER]: 'not-a-signature' },
				payload: trackDelivery,
				rawBody: RAW,
			},
			SECRET,
		);

		expect(result).toMatchObject({ valid: false, verified: false });
		expect(result.error).toContain('expected `t=<unix>,v1=<hex>`');
	});

	it('refuses to verify without the raw body, rather than trusting parsed JSON', () => {
		// Re-serializing parsed JSON changes the bytes, so the digest could never
		// match; guessing would be worse than failing.
		const request = signed();
		const result = verifyShippoWebhook(
			{ headers: request.headers, payload: trackDelivery },
			SECRET,
		);

		expect(result).toMatchObject({ valid: false, verified: false });
		expect(result.error).toContain('needs the raw request body');
	});

	it('accepts unsigned deliveries when no secret is configured, and says so', () => {
		const result = verifyShippoWebhook(
			{ headers: {}, payload: trackDelivery, rawBody: RAW },
			undefined,
		);

		// Nothing was checked, so this is not a verified delivery.
		expect(result).toMatchObject({ valid: true, verified: false });
	});

	it('trusts the Hub when it already verified the signature', () => {
		const result = verifyShippoWebhook(
			{ headers: {}, payload: trackDelivery, hubVerified: true },
			undefined,
		);

		expect(result).toMatchObject({ valid: true, verified: true });
	});

	it('throws from the handler on a bad signature, so the delivery is refused', async () => {
		const handler = createNotificationHandler(SECRET);

		await expect(handler.handler(ctx, signed())).resolves.toMatchObject({
			success: true,
		});

		await expect(
			handler.handler(ctx, {
				headers: {},
				payload: trackDelivery,
				rawBody: RAW,
			}),
		).rejects.toThrow('Shippo webhook rejected');
	});

	it('reports signatureVerified in the handler output', async () => {
		const signedHandler = createNotificationHandler(SECRET);
		const unsignedHandler = createNotificationHandler(undefined);

		const verified = await signedHandler.handler(ctx, signed());
		expect(verified.data?.signatureVerified).toBe(true);

		const unverified = await unsignedHandler.handler(ctx, {
			headers: {},
			payload: trackDelivery,
			rawBody: RAW,
		});
		expect(unverified.data?.signatureVerified).toBe(false);
	});
});

/**
 * The tests above call the handler directly, which is the gap that once let a
 * keyBuilder rejecting `source === 'webhook'` ship. These go through
 * `processWebhook` and a real bound client instead.
 */
describe('a delivery through processWebhook', () => {
	async function createClient(withKey: boolean) {
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'shippo', 'default');
		const corsair = createCorsair({
			plugins: [shippo(withKey ? { key: 'shippo_test_delivery' } : {})],
			database: testDb.db,
			kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
		});
		if (withKey) await corsair.shippo.keys.issue_new_dek();
		return { corsair, testDb };
	}

	it('reaches the handler with no key configured at all', async () => {
		const { corsair, testDb } = await createClient(false);
		try {
			const result = await processWebhook(
				corsair,
				{ 'content-type': 'application/json' },
				trackDelivery,
			);

			expect(result.plugin).toBe('shippo');
			expect(result.action).toBe('notifications.delivery');
			// The hook ran, so nothing threw while resolving a key.
			expect(result.response).toMatchObject({ success: true });
		} finally {
			testDb.cleanup();
		}
	});

	it('reaches the handler with a stored key', async () => {
		const { corsair, testDb } = await createClient(true);
		try {
			await corsair.shippo.keys.set_api_key('shippo_test_stored');

			const result = await processWebhook(
				corsair,
				{ 'content-type': 'application/json' },
				transactionDelivery,
			);

			expect(result.plugin).toBe('shippo');
			expect(result.response).toMatchObject({ success: true });
		} finally {
			testDb.cleanup();
		}
	});

	it('refuses an unsigned delivery when a secret is configured', async () => {
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'shippo', 'default');
		const corsair = createCorsair({
			plugins: [shippo({ webhookSecret: 'whsec_configured' })],
			database: testDb.db,
			kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
		});
		try {
			const raw = JSON.stringify(trackDelivery);
			const result = await processWebhook(
				corsair,
				{ 'content-type': 'application/json' },
				raw,
			);

			// No signature header, so the handler throws and processWebhook
			// reports a failure rather than running hooks on an untrusted body.
			expect(result.plugin).toBe('shippo');
			expect(result.response).toMatchObject({ success: false });
		} finally {
			testDb.cleanup();
		}
	});

	it('accepts a correctly signed delivery when a secret is configured', async () => {
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'shippo', 'default');
		const corsair = createCorsair({
			plugins: [shippo({ webhookSecret: 'whsec_configured' })],
			database: testDb.db,
			kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
		});
		try {
			const raw = JSON.stringify(trackDelivery);
			const signature = computeSignature('whsec_configured', '1688493073', raw);

			const result = await processWebhook(
				corsair,
				{
					'content-type': 'application/json',
					[SHIPPO_SIGNATURE_HEADER]: `t=1688493073,v1=${signature}`,
				},
				raw,
			);

			expect(result.plugin).toBe('shippo');
			expect(result.response).toMatchObject({ success: true });
		} finally {
			testDb.cleanup();
		}
	});

	it('reports a delivery it cannot parse as a failure', async () => {
		const { corsair, testDb } = await createClient(false);
		try {
			const result = await processWebhook(
				corsair,
				{ 'content-type': 'application/json' },
				{ event: 'track_updated', test: true, data: 'broken' },
			);

			// The matcher accepts the envelope, so the plugin claims it and the
			// handler throws, which processWebhook turns into success: false.
			expect(result.plugin).toBe('shippo');
			expect(result.response).toMatchObject({ success: false });
		} finally {
			testDb.cleanup();
		}
	});
});
