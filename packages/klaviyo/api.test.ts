import { KlaviyoAPIError } from './client';
import {
	eventsList,
	listsList,
	metricsList,
	profilesList,
	tagsList,
	webhookTopicsList,
} from './endpoints';
import type { KlaviyoContext } from './index';

/**
 * Live smoke tests against the real API. Gated on `KLAVIYO_API_KEY`.
 *
 * These call the endpoint functions, so the response mapping and every output
 * schema run against a real payload. Every call is read-only: list routes and
 * the webhook-topic list. Nothing is created or deleted.
 *
 * The key must be a private API key with read access. A key created with a
 * restricted scope answers 403 on the routes it does not cover, which this
 * suite would report as a failure rather than a skip.
 *
 * CI ignores this file by name (`api.test.ts`), so it only runs through
 * `pnpm --filter @corsair-dev/klaviyo test:live`.
 */
const API_KEY = process.env.KLAVIYO_API_KEY;

const describeIfKey = API_KEY ? describe : describe.skip;

if (!API_KEY) {
	// Say so out loud: a skipped run must not read as a green one.
	console.warn(
		'KLAVIYO_API_KEY is not set, so the Klaviyo live smoke tests are skipped. Create a private key at klaviyo.com under Settings, API keys, and export it to run them.',
	);
}

// Safe: the endpoints read only ctx.key and log through ctx.
const ctx = { key: API_KEY, database: undefined } as unknown as KlaviyoContext; // unknown: only ctx.key is read.

describeIfKey('Klaviyo live API', () => {
	it('lists profiles through the endpoint and its output schema', async () => {
		const result = await profilesList(ctx, { pageSize: 5 });

		expect(Array.isArray(result.data)).toBe(true);
		expect(result.data.length).toBeLessThanOrEqual(5);
	});

	it('lists lists through the endpoint and its output schema', async () => {
		const result = await listsList(ctx, { pageSize: 5 });
		expect(Array.isArray(result.data)).toBe(true);
	});

	it('lists metrics through the endpoint and its output schema', async () => {
		const result = await metricsList(ctx, { pageSize: 5 });
		expect(Array.isArray(result.data)).toBe(true);
	});

	it('lists events through the endpoint and its output schema', async () => {
		const result = await eventsList(ctx, { pageSize: 5 });
		expect(Array.isArray(result.data)).toBe(true);
	});

	it('lists tags through the endpoint and its output schema', async () => {
		const result = await tagsList(ctx, { pageSize: 5 });
		expect(Array.isArray(result.data)).toBe(true);
	});

	it('lists webhook topics', async () => {
		const result = await webhookTopicsList(ctx, {});
		expect(Array.isArray(result.data)).toBe(true);
	});

	it('answers 401 with its own envelope for a bad key', async () => {
		// unknown: only ctx.key is read, as above.
		const badCtx = {
			key: 'pk_definitely_not_valid',
		} as unknown as KlaviyoContext; // unknown: only ctx.key is read.

		const failure = await profilesList(badCtx, { pageSize: 1 }).catch(
			// unknown: a rejection can be any value until the assertion narrows it.
			(caught: unknown) => caught,
		);

		expect(failure).toBeInstanceOf(KlaviyoAPIError);
		expect((failure as KlaviyoAPIError).status).toBe(401);
		expect((failure as KlaviyoAPIError).code).toBe('authentication_failed');
	});
});
