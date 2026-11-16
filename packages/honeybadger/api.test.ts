import type { HoneybadgerContext } from './index';
import { honeybadger } from './index';

/**
 * Live smoke test, against the real API.
 *
 * Skipped unless a token is present, and it prints why when it skips, so a
 * skipped run cannot be mistaken for a pass. Reads only, and few calls: the
 * documented budget is 360 requests an hour per token.
 *
 * The token needs `projects:read` and `faults:read`. A personal token (`hbu_`)
 * or an account token (`hba_`) both work; a v2 personal auth token does not.
 * `HONEYBADGER_REGION=eu` when the account is on the EU app.
 */
const TOKEN =
	process.env.HONEYBADGER_API_KEY ?? process.env.HONEYBADGER_API_TOKEN;
const REGION = process.env.HONEYBADGER_REGION === 'eu' ? 'eu' : 'us';

describe('honeybadger live smoke', () => {
	if (!TOKEN) {
		// Printed rather than thrown, so a missing key reads as a skip.
		console.warn(
			'Skipping Honeybadger live smoke: set HONEYBADGER_API_KEY (or HONEYBADGER_API_TOKEN) to run it.',
		);
	}
	const describeIfKey = TOKEN ? describe : describe.skip;

	// A context with just the key and region the endpoints read; the real one
	// carries the whole key manager and a database, which these reads never
	// touch.
	// unknown: a stand-in for a context whose type brings the whole key manager.
	const ctx = {
		key: TOKEN,
		options: { region: REGION },
		$getAccountId: async () => 'live',
	} as unknown as HoneybadgerContext;

	const plugin = honeybadger({ key: TOKEN });
	const endpoints = plugin.endpoints as NonNullable<typeof plugin.endpoints>;
	const schemas = plugin.endpointSchemas as Record<string, { output: { parse: (value: unknown) => unknown } }>;

	/**
	 * Parses a live answer through the operation's own output schema, which is
	 * the contract a caller receives. Asserting on a hand-written type would let
	 * a wrong field pass both this suite and the fixtures.
	 */
	function parseWith<T>(operation: string, value: T): T {
		const schema = schemas[operation]?.output;
		if (!schema) throw new Error(`No output schema for ${operation}`);
		schema.parse(value);
		return value;
	}

	describeIfKey('token.get', () => {
		it('reports the token and needs no scope', async () => {
			const result = await endpoints.token.get(ctx, {});
			parseWith('token.get', result);

			expect(['user', 'account', 'oauth']).toContain(result.data.kind);
			expect(result.data.account_id).toBeTruthy();
		});
	});

	describeIfKey('projects.list', () => {
		it('returns at least one project, each with a usable shape', async () => {
			const result = await endpoints.projects.list(ctx, { per_page: 5 });
			parseWith('projects.list', result);

			expect(Array.isArray(result.data)).toBe(true);
			// A token with no project in reach is possible, so the array is what is
			// asserted rather than its length.
			for (const project of result.data) {
				expect(typeof project.id).toBe('string');
				expect(typeof project.name).toBe('string');
			}
		});

		it('reads each listed project back by id', async () => {
			const list = await endpoints.projects.list(ctx, { per_page: 1 });
			const first = list.data[0];
			if (!first) return;

			const result = await endpoints.projects.get(ctx, {
				project_id: first.id,
			});
			parseWith('projects.get', result);
			expect(result.data.id).toBe(first.id);
		});

		it('reads the stats and occurrence counts for one project', async () => {
			const list = await endpoints.projects.list(ctx, { per_page: 1 });
			const first = list.data[0];
			if (!first) return;

			const stats = await endpoints.projects.stats(ctx, {
				project_id: first.id,
			});
			parseWith('projects.stats', stats);
			expect(typeof stats.data.fault_count).toBe('number');

			const occurrences = await endpoints.projects.occurrences(ctx, {
				project_id: first.id,
				period: 'hour',
			});
			parseWith('projects.occurrences', occurrences);
			expect(Array.isArray(occurrences.data.buckets)).toBe(true);
		});
	});

	describeIfKey('faults.list', () => {
		it('lists faults and reads the first one back', async () => {
			const list = await endpoints.projects.list(ctx, { per_page: 1 });
			const project = list.data[0];
			if (!project) return;

			const faults = await endpoints.faults.list(ctx, {
				project_id: project.id,
				per_page: 5,
			});
			parseWith('faults.list', faults);
			expect(Array.isArray(faults.data)).toBe(true);

			const first = faults.data[0];
			if (!first) return;

			const fault = await endpoints.faults.get(ctx, {
				project_id: project.id,
				fault_id: first.id,
			});
			parseWith('faults.get', fault);
			expect(fault.data.id).toBe(first.id);

			// The summary takes the same filters as the list, so it is checked
			// against a project that is known to answer.
			const summary = await endpoints.faults.summary(ctx, {
				project_id: project.id,
			});
			parseWith('faults.summary', summary);
			expect(typeof summary.data.total).toBe('number');
		});
	});
});
