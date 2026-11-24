import { spondyr, spondyrEndpointSchemas } from './index';

/**
 * Live smoke test. It runs only when both `SPONDYR_API_KEY` and
 * `SPONDYR_APPLICATION_TOKEN` are set.
 *
 * It only reads: `correspondence.send` would generate and possibly deliver a
 * real document, so nothing here writes. Every answer is parsed through its
 * endpoint's output schema first, so a field the API types differently than the
 * schema expects fails here rather than in a user's call.
 */
const API_KEY = process.env.SPONDYR_API_KEY;
const APPLICATION_TOKEN = process.env.SPONDYR_APPLICATION_TOKEN;

const missing = [
	!API_KEY && 'SPONDYR_API_KEY',
	!APPLICATION_TOKEN && 'SPONDYR_APPLICATION_TOKEN',
].filter(Boolean);

const describeIfKeys = API_KEY && APPLICATION_TOKEN ? describe : describe.skip;

if (missing.length > 0) {
	// Say so out loud: a skipped suite reads as a pass in the summary otherwise.
	console.warn(
		`Skipping the live Spondyr tests; missing ${missing.join(' and ')}`,
	);
}

describeIfKeys('Spondyr live API', () => {
	const plugin = spondyr({
		key: API_KEY,
		applicationToken: APPLICATION_TOKEN,
	});

	const transactionTypes = spondyrEndpointSchemas['transactionTypes.list'];
	const templates = spondyrEndpointSchemas['templates.list'];

	// The raw client, built the way the plugin builds it, so these tests read
	// with the same credentials and base URL a caller gets.
	async function get(path: string, query?: Record<string, string>) {
		const { makeSpondyrRequest } = await import('./client');
		return makeSpondyrRequest(
			{
				apiKey: API_KEY ?? '',
				applicationToken: APPLICATION_TOKEN ?? '',
			},
			{ method: 'GET', path, query },
		);
	}

	it('lists Transaction Types through the output schema', async () => {
		const parsed = transactionTypes.output.parse(await get('TransactionTypes'));
		expect(Array.isArray(parsed.Data)).toBe(true);
	});

	it('is wired with both credentials it was given', () => {
		expect(plugin.id).toBe('spondyr');
		expect(plugin.authConfig?.api_key?.account).toEqual(['application_token']);
	});

	it('lists templates when the account has a Transaction Type', async () => {
		const listed = transactionTypes.output.parse(await get('TransactionTypes'));
		const first = listed.Data[0];
		if (!first) {
			// A fresh subscription has no Transaction Type yet, and the list route
			// is the only thing to verify.
			console.warn(
				'No Transaction Type on this subscription; skipping templates',
			);
			return;
		}
		const parsed = templates.output.parse(
			await get('Templates', { TransactionType: first.Name }),
		);
		expect(Array.isArray(parsed.Data)).toBe(true);
	});
});
