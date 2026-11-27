import { makeNtfyRequest, parseNtfyNdjson } from './client';
import { ntfyEndpointSchemas } from './index';

/**
 * Live smoke test. It runs only when `NTFY_API_KEY` is set to an access
 * token from https://ntfy.sh/account (Manage access tokens).
 *
 * Read-only operations only. ntfy.sh caps visitors at 250 messages a day and
 * every publish pushes to real subscribers, so the suite never sends.
 */
const API_KEY = process.env.NTFY_API_KEY;
const describeIfKey = API_KEY ? describe : describe.skip;

if (!API_KEY) {
	// Say so out loud: a skipped suite reads as a pass in the summary otherwise.
	console.warn('NTFY_API_KEY is not set, skipping the live ntfy tests');
}

describeIfKey('ntfy live API', () => {
	const schemas = ntfyEndpointSchemas;

	async function get(path: string, query?: Record<string, string | number>) {
		return makeNtfyRequest(API_KEY ?? '', { method: 'GET', path, query });
	}

	it('polls an unlikely topic to an empty answer through the output schema', async () => {
		const raw = await get(
			`/corsair-smoke-${Math.random().toString(36).slice(2, 10)}/json`,
			{ poll: 1 },
		);
		const parsed = schemas['messages.poll'].output.parse({
			messages: parseNtfyNdjson(raw),
		});
		expect(parsed.messages).toEqual([]);
	});

	it('reads server health through the output schema', async () => {
		const parsed = schemas['server.health'].output.parse(
			await get('/v1/health'),
		);
		expect(typeof parsed.healthy).toBe('boolean');
	});

	it('reads server stats through the output schema', async () => {
		const parsed = schemas['server.stats'].output.parse(await get('/v1/stats'));
		expect(parsed.messages).toBeGreaterThan(0);
	});

	it('reads the account view through the output schema', async () => {
		const parsed = schemas['account.usage'].output.parse(
			await get('/v1/account'),
		);
		expect(parsed.limits.messages).toBeGreaterThan(0);
	});
});
