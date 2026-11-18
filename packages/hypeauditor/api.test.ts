import type { z } from 'zod';
import type { JsonObject } from './client';
import type { HypeAuditorContext } from './index';
import { hypeauditor } from './index';
import { rejection } from './test-helpers';

/**
 * Live smoke test, against the real API.
 *
 * Skipped unless both credentials are present, and it prints what is missing
 * when it skips, so a skipped run cannot be mistaken for a pass.
 *
 * Every call here is free. A report read spends a credit the first time, and a
 * discovery page spends a discovery call, so those are not in this suite. What
 * is exercised instead:
 *
 * - `ping`-equivalent reads that cost nothing: the lists, the plan info, the
 *   taxonomy and the suggester.
 * - The documented free report, `nasa`, which the docs name as free per
 *   network. It still writes a log line to the account, so it runs once and the
 *   assertions are about the envelope, not about the credit.
 * - Discovery through the sandbox action, which validates the request and
 *   returns a sample without spending a call.
 */
const CLIENT_ID = process.env.HYPEAUDITOR_CLIENT_ID;
const TOKEN = process.env.HYPEAUDITOR_API_TOKEN;
const HAVE_CREDENTIALS = Boolean(CLIENT_ID && TOKEN);

describe('hypeauditor live smoke', () => {
	if (!HAVE_CREDENTIALS) {
		const missing = [
			CLIENT_ID ? undefined : 'HYPEAUDITOR_CLIENT_ID',
			TOKEN ? undefined : 'HYPEAUDITOR_API_TOKEN',
		].filter((name): name is string => name !== undefined);
		console.warn(
			`Skipping HypeAuditor live smoke: set ${missing.join(' and ')} to run it.`,
		);
	}
	const describeIfKey = HAVE_CREDENTIALS ? describe : describe.skip;

	// unknown: a stand-in for a context whose type brings the whole key manager.
	const ctx = {
		authType: 'api_key',
		// The key builder's output: the pair packed as `<clientId>:<token>`.
		key: `${CLIENT_ID}:${TOKEN}`,
		keys: {
			get_client_id: async () => CLIENT_ID,
			get_api_key: async () => TOKEN,
		},
		$getAccountId: async () => 'live',
	} as unknown as HypeAuditorContext; // unknown: fixture, see above

	const plugin = hypeauditor();
	const endpoints = plugin.endpoints as NonNullable<typeof plugin.endpoints>;
	// The output schemas are read through zod's own type here, because the
	// parsed value is the operation's output type, which differs per operation.
	const schemas = plugin.endpointSchemas as Record<
		string,
		{ output: z.ZodType }
	>;

	/**
	 * Parses a live answer through the operation's own output schema, which is
	 * the contract a caller receives. Asserting on a hand-written type would let
	 * a wrong field pass both this suite and the fixtures.
	 */
	function parseWith<T extends object>(operation: string, value: T): T {
		const schema = schemas[operation]?.output;
		if (!schema) throw new Error(`No output schema for ${operation}`);
		schema.parse(value);
		return value;
	}

	describeIfKey('lists.list', () => {
		it('returns the saved lists, including the default Recent searches list', async () => {
			const result = await endpoints.lists.list(ctx, {});
			parseWith('lists.list', result);

			expect(Array.isArray(result.result)).toBe(true);
			// Every account has the default list at id 0, per the docs.
			const recent = result.result.find((entry) => entry.id === 0);
			expect(recent?.name).toBe('Recent searches');
		});

		it('reads the reports in the default list', async () => {
			const result = await endpoints.lists.items(ctx, { id: 0, limit: 5 });
			parseWith('lists.items', result);
			// The shape is a list of report items, or an object when the list is
			// empty, so the envelope is what is asserted.
			expect(result.result).toBeDefined();
		});
	});

	describeIfKey('account.planInfo', () => {
		it('reports the credits and calls left', async () => {
			const result = await endpoints.account.planInfo(ctx, {});
			parseWith('account.planInfo', result);
			expect(result.result).toBeDefined();
		});
	});

	describeIfKey('taxonomy.get', () => {
		it('returns the category ids the discovery filters take', async () => {
			const result = await endpoints.taxonomy.get(ctx, {});
			parseWith('taxonomy.get', result);
			expect(result.result).toBeDefined();
		});
	});

	describeIfKey('suggester.get', () => {
		it('suggests from a partial name', async () => {
			const result = await endpoints.suggester.get(ctx, { search: 'nas' });
			parseWith('suggester.get', result);
			expect(result.result).toBeDefined();
		});
	});

	describeIfKey('discovery.search', () => {
		it('validates a request in the sandbox without spending a call', async () => {
			const result = await endpoints.discovery.search(ctx, {
				social_network: 'instagram',
				filters: { search: ['nasa'] },
				sandbox: true,
			});
			parseWith('discovery.search', result);
			expect(result.result).toBeDefined();
		});
	});

	describeIfKey('reports.youtube', () => {
		it('reads the documented free YouTube report', async () => {
			// The docs name this channel as free on every network, so it is the one
			// report read that does not spend a credit.
			const result = await endpoints.reports.youtube(ctx, {
				channel: 'UCLA_DiR1FfKNvjuUpBHmylQ',
			});
			parseWith('reports.youtube', result);

			expect(result.result).toBeDefined();
			// Either the report is ready, or it is being built and carries the
			// seconds to wait. Both are documented success answers.
			const inner = result.result as JsonObject;
			const pending = typeof inner.retryTtl === 'number';
			expect(pending || inner.report_state !== undefined).toBe(true);
		});
	});

	describeIfKey('error envelope', () => {
		it('reports a request the account cannot make by its provider code', async () => {
			// A report for an account that does not exist answers one of the
			// documented error codes rather than a made-up success. The point is
			// that the numeric code survives to the caller.
			const error = (await rejection(
				endpoints.reports.snapchat(ctx, {
					channel: 'this-channel-does-not-exist-9f3a2b',
				}),
			)) as Error & { code?: number; status?: number };

			expect(typeof error.status).toBe('number');
			// Every documented failure on a report read carries a body code, so a
			// response without one means the envelope changed.
			expect(typeof error.code).toBe('number');
		});
	});
});
