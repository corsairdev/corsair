import { withoutAccountSecrets } from './endpoints/account';
import { tomba, tombaEndpointSchemas } from './index';

/**
 * Live smoke test. It runs only when both `TOMBA_API_KEY` and
 * `TOMBA_SECRET_KEY` are set, under the variable names Tomba's own examples use.
 *
 * It only reads, and it makes one billed-adjacent call per test at most: the
 * free plan allows 25 search credits every 30 days and 1 request a second, so a
 * long chain of lookups would exhaust the balance or trip the limit.
 *
 * Every answer is parsed through its output schema before asserting.
 */
const API_KEY = process.env.TOMBA_API_KEY;
const API_SECRET = process.env.TOMBA_SECRET_KEY;

const missing = [
	!API_KEY && 'TOMBA_API_KEY',
	!API_SECRET && 'TOMBA_SECRET_KEY',
].filter(Boolean);

const describeIfKeys = API_KEY && API_SECRET ? describe : describe.skip;

if (missing.length > 0) {
	// Say so out loud: a skipped suite reads as a pass in the summary otherwise.
	console.warn(
		`Skipping the live Tomba tests; missing ${missing.join(' and ')}`,
	);
}

describeIfKeys('Tomba live API', () => {
	const account = tombaEndpointSchemas['account.get'];
	const rateLimits = tombaEndpointSchemas['account.rateLimits'];

	// The raw client, built the way the plugin builds it.
	async function get(
		path: string,
		query?: Record<string, string | number | boolean>,
	) {
		const { makeTombaRequest } = await import('./client');
		return makeTombaRequest(
			{ apiKey: API_KEY ?? '', apiSecret: API_SECRET ?? '' },
			{ method: 'GET', path, query },
		);
	}

	it('reads the account through the output schema', async () => {
		const parsed = account.output.parse(withoutAccountSecrets(await get('me')));
		expect(parsed.data).toBeDefined();
		// The account body carries secret_token; the endpoint drops it.
		expect(parsed.data).not.toHaveProperty('secret_token');
	});

	it('reads the rate limits through the output schema', async () => {
		const parsed = rateLimits.output.parse(await get('rate-limits'));
		expect(Array.isArray(parsed.data)).toBe(true);
	});

	it('is wired with both credentials it was given', () => {
		expect(tomba({ key: API_KEY, apiSecret: API_SECRET }).id).toBe('tomba');
	});
});
