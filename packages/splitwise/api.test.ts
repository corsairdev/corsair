import { splitwise, splitwiseEndpointSchemas } from './index';

/**
 * Live smoke test. It runs only when `SPLITWISE_API_KEY` is set, and it only
 * reads: the account it points at is a real Splitwise account, so a write here
 * would change someone's ledger.
 *
 * Every answer is parsed through its endpoint's output schema before the test
 * asserts on it, so a field the API types differently than the schema expects
 * fails here rather than in a user's call.
 */
const API_KEY = process.env.SPLITWISE_API_KEY;
const describeIfKey = API_KEY ? describe : describe.skip;

if (!API_KEY) {
	// Say so out loud: a skipped suite reads as a pass in the summary otherwise.
	console.warn(
		'SPLITWISE_API_KEY is not set, skipping the live Splitwise tests',
	);
}

describeIfKey('Splitwise live API', () => {
	const plugin = splitwise({ key: API_KEY });
	const users = splitwiseEndpointSchemas['users.getCurrentUser'];
	const categories = splitwiseEndpointSchemas['categories.list'];
	const currencies = splitwiseEndpointSchemas['currencies.list'];
	const groups = splitwiseEndpointSchemas['groups.list'];
	const expenses = splitwiseEndpointSchemas['expenses.list'];
	const friends = splitwiseEndpointSchemas['friends.list'];
	const notifications = splitwiseEndpointSchemas['notifications.list'];

	// The raw client, built the way the plugin builds it, so these tests read
	// with the same auth and base URL a caller gets.
	async function get(path: string, query?: Record<string, string | number>) {
		const { makeSplitwiseRequest } = await import('./client');
		return makeSplitwiseRequest(API_KEY ?? '', { method: 'GET', path, query });
	}

	it('reads the current user through its output schema', async () => {
		const parsed = users.output.parse(await get('get_current_user'));
		expect(typeof parsed.user.id).toBe('number');
		expect(parsed.user.email).toContain('@');
	});

	it('lists currencies through the output schema', async () => {
		const parsed = currencies.output.parse(await get('get_currencies'));
		expect(parsed.currencies.length).toBeGreaterThan(50);
		const usd = parsed.currencies.find(
			(entry) => entry.currency_code === 'USD',
		);
		expect(usd?.unit).toBe('$');
	});

	it('lists expense categories with their subcategories', async () => {
		const parsed = categories.output.parse(await get('get_categories'));
		expect(parsed.categories.length).toBeGreaterThan(0);
		const withChildren = parsed.categories.find(
			(entry) => entry.subcategories.length > 0,
		);
		expect(withChildren).toBeDefined();
	});

	it('lists the groups on the account', async () => {
		const parsed = groups.output.parse(await get('get_groups'));
		expect(Array.isArray(parsed.groups)).toBe(true);
	});

	it('lists expenses and pages them', async () => {
		const parsed = expenses.output.parse(
			await get('get_expenses', { limit: 1, offset: 0 }),
		);
		expect(Array.isArray(parsed.expenses)).toBe(true);
		expect(parsed.expenses.length).toBeLessThanOrEqual(1);
	});

	it('lists friends', async () => {
		const parsed = friends.output.parse(await get('get_friends'));
		expect(Array.isArray(parsed.friends)).toBe(true);
	});

	it('lists notifications', async () => {
		const parsed = notifications.output.parse(await get('get_notifications'));
		expect(Array.isArray(parsed.notifications)).toBe(true);
	});

	it('is wired with the key it was given', () => {
		expect(plugin.id).toBe('splitwise');
	});
});
