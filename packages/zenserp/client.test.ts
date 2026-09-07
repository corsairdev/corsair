// Mocked transport coverage intentionally runs in Corsair's normal CI lane.
import { getStatus } from './endpoints/account';
import { list as listBatches } from './endpoints/batches';
import {
	listCountries,
	listLanguages,
	listLocations,
	listSearchEngines,
} from './endpoints/metadata';
import { bing, google, reverseImage, yandex } from './endpoints/search';
import { getProduct } from './endpoints/shopping';
import { get as getTrends } from './endpoints/trends';

const fetchMock = jest.spyOn(globalThis, 'fetch');
const ctx = {
	key: 'zenserp-test-key',
	options: {},
	$getAccountId: async () => 'test-account',
} as never;

function json(body: unknown): Response {
	return new Response(JSON.stringify(body), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
}

describe('Zenserp API operations', () => {
	beforeEach(() => {
		fetchMock.mockReset();
		fetchMock.mockImplementation(async (input) => {
			const url = String(input);
			if (url.includes('/status')) return json({ remaining_requests: 1499 });
			if (url.includes('/shopping'))
				return json({ product: { product_id: 'p1', title: 'Keyboard' } });
			if (url.includes('/trends'))
				return json({ data: [{ keyword: 'corsair' }] });
			if (url.includes('/batches')) return json({ data: [{ id: 'batch-1' }] });
			if (url.includes('/gl'))
				return json([{ name: 'United States', value: 'us' }]);
			if (url.includes('/locations'))
				return json([{ name: 'New York', country_code: 'us' }]);
			if (url.includes('/search_engines'))
				return json([{ name: 'Google', domain: 'google.com' }]);
			if (url.includes('/hl')) return json([{ name: 'English', value: 'en' }]);
			return json({
				query: { q: 'corsair' },
				organic: [{ title: 'Corsair' }],
				number_of_results: 1,
			});
		});
	});

	afterAll(() => fetchMock.mockRestore());

	it('calls and validates every catalog operation', async () => {
		await google(ctx, { q: 'corsair' });
		await bing(ctx, { q: 'corsair' });
		await yandex(ctx, { q: 'corsair' });
		await reverseImage(ctx, { imageUrl: 'https://example.com/image.png' });
		await getProduct(ctx, { productId: 'p1' });
		await getTrends(ctx, { keywords: ['corsair', 'agents'] });
		const status = await getStatus(ctx, {});
		await listBatches(ctx, { page: 1 });
		await listCountries(ctx, {});
		await listLocations(ctx, { q: 'New York' });
		await listSearchEngines(ctx, {});
		await listLanguages(ctx, {});

		expect(fetchMock).toHaveBeenCalledTimes(12);
		expect(status.remaining_requests).toBe(1499);
		const calls = fetchMock.mock.calls.map(([input]) => String(input));
		expect(calls[0]).toContain('/api/v2/search?q=corsair');
		expect(calls[1]).toContain('search_engine=bing.com');
		expect(calls[2]).toContain('search_engine=yandex.com');
		expect(calls[3]).toContain(
			'image_url=https%3A%2F%2Fexample.com%2Fimage.png',
		);
		expect(calls[4]).toContain('/api/v1/shopping?product_id=p1');
		expect(calls[5]).toContain('keyword%5B%5D=corsair');
		expect(calls[6]).toContain('/api/v2/status');
		expect(calls[7]).toContain('/api/v1/batches?page=1');
		expect(calls[8]).toContain('/api/v2/gl');
		expect(calls[9]).toContain('/api/v2/locations?q=New%20York');
		expect(calls[10]).toContain('/api/v2/search_engines');
		expect(calls[11]).toContain('/api/v2/hl');
		for (const [, init] of fetchMock.mock.calls) {
			expect(new Headers(init?.headers).get('apikey')).toBe('zenserp-test-key');
		}
	});
});
