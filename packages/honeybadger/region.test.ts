import type { HoneybadgerContext } from './index';
import { honeybadger } from './index';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(
		async () =>
			new Response(JSON.stringify({ data: [], links: {}, meta: {} }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}),
	);
	jest.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

function context(region: string | null, optionRegion?: 'us' | 'eu') {
	const ctx = {
		key: 'hbu_test_token',
		options: optionRegion ? { region: optionRegion } : {},
		keys: { get_region: jest.fn(async () => region) },
		$getAccountId: jest.fn(async () => 'account-1'),
	};
	// unknown: a stand-in for a context whose type brings the whole key manager.
	return ctx as unknown as HoneybadgerContext;
}

async function hostFor(ctx: HoneybadgerContext): Promise<string> {
	const endpoints = honeybadger().endpoints!;
	// Only the request matters here, not whether the stub body parses.
	await endpoints.projects.list(ctx, {}).catch(() => undefined);
	const [url] = fetchMock.mock.calls.at(-1) as [string];
	return new URL(url).host;
}

describe('region', () => {
	it("uses the tenant's stored region field", async () => {
		expect(await hostFor(context('eu'))).toBe('eu-app.honeybadger.io');
		expect(await hostFor(context(' EU '))).toBe('eu-app.honeybadger.io');
	});

	it('falls back to the US app when nothing is stored or the value is unknown', async () => {
		expect(await hostFor(context(null))).toBe('app.honeybadger.io');
		expect(await hostFor(context('mars'))).toBe('app.honeybadger.io');
	});

	it('falls back to the US app when the account has nothing stored to read', async () => {
		const ctx = context(null);
		(
			ctx.keys as unknown as { get_region: jest.Mock }
		).get_region.mockRejectedValue(new Error('No DEK found for account'));
		expect(await hostFor(ctx)).toBe('app.honeybadger.io');
	});

	it('lets the plugin option override the stored field', async () => {
		expect(await hostFor(context('eu', 'us'))).toBe('app.honeybadger.io');
	});
});
