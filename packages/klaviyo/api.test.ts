import { KlaviyoAPIError } from './client';
import {
	eventsList,
	listsList,
	metricsList,
	profilesCreate,
	profilesGet,
	profilesList,
	profilesUpdate,
	tagsList,
	webhookTopicsList,
} from './endpoints';
import type { KlaviyoContext } from './index';

/**
 * Live smoke tests against the real API. Gated on `KLAVIYO_API_KEY`.
 *
 * These call the endpoint functions, so the response mapping and every output
 * schema run against a real payload. Most calls are read-only: the list routes
 * and the webhook-topic list.
 *
 * One test writes. It creates a profile and then updates it, and that profile
 * stays on the account afterwards because Klaviyo has no hard delete. Point this
 * at a test account rather than a production one, and note that each run leaves
 * another `corsair-live-<timestamp>@example.com` profile behind.
 *
 * The key must be a private API key with read access and profile write access;
 * without the write scope the create test answers 403 rather than skipping.
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
		// No pageSize: the metrics route rejects page[size].
		const result = await metricsList(ctx, {});
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

	it('lists webhook topics, which needs the Advanced KDP add-on', async () => {
		const result = await webhookTopicsList(ctx, {}).catch(
			// unknown: a rejection can be any value until the assertion narrows it.
			(caught: unknown) => caught,
		);

		// The route answers 403 permission_denied on a plan without the add-on.
		// That is a plan limit, not a defect, so it reports a skip and every other
		// failure still throws.
		if (
			result instanceof KlaviyoAPIError &&
			result.status === 403 &&
			result.code === 'permission_denied'
		) {
			console.warn(
				'webhookTopics.list skipped: this account needs the Advanced KDP add-on for the endpoint (403 permission_denied).',
			);
			return;
		}
		if (result instanceof Error) throw result;

		expect(Array.isArray((result as { data: unknown[] }).data)).toBe(true);
	});

	it('creates, updates and reads back a profile', async () => {
		// A real write: the JSON:API envelope this plugin builds has to be accepted
		// by Klaviyo, which a mocked body cannot prove. The profile is a throwaway
		// address and is left on the account; Klaviyo has no hard delete.
		const email = `corsair-live-${Date.now()}@example.com`;
		const created = (await profilesCreate(ctx, {
			email,
			first_name: 'Corsair',
			properties: { source: 'corsair-live-test' },
		})) as {
			data: { id: string; attributes?: { email?: string | null } | null };
		};

		expect(created.data.id).toBeTruthy();
		expect(created.data.attributes?.email).toBe(email);

		const updated = (await profilesUpdate(ctx, {
			id: created.data.id,
			first_name: 'Corsair Updated',
		})) as { data: { attributes?: { first_name?: string | null } | null } };
		expect(updated.data.attributes?.first_name).toBe('Corsair Updated');

		const read = (await profilesGet(ctx, { id: created.data.id })) as {
			data: { attributes?: { first_name?: string | null } | null };
		};
		expect(read.data.attributes?.first_name).toBe('Corsair Updated');
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
