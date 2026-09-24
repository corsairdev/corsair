import { makeDaffyRequest } from './client';

const TEST_KEY = 'test-key-not-a-credential';
let calls: { url: string; init: RequestInit }[] = [];
const realFetch = global.fetch;

function mockFetch(): void {
	global.fetch = (async (url: string, init: RequestInit) => {
		calls.push({ url, init });
		return {
			ok: true,
			status: 200,
			statusText: 'OK',
			url,
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => ({}),
			text: async () => '{}',
		};
	}) as unknown as typeof global.fetch;
}

beforeEach(() => {
	calls = [];
	mockFetch();
});
afterEach(() => {
	global.fetch = realFetch;
});

describe('Daffy client', () => {
	it.each([
		[
			'/users/me/balance',
			undefined,
			'https://public.daffy.org/v1/users/me/balance',
		],
		[
			'/contributions',
			{ page: 2 },
			'https://public.daffy.org/v1/contributions?page=2',
		],
		['/donations', { page: 3 }, 'https://public.daffy.org/v1/donations?page=3'],
		['/gifts', { page: 4 }, 'https://public.daffy.org/v1/gifts?page=4'],
		[
			'/gifts/gift-code',
			undefined,
			'https://public.daffy.org/v1/gifts/gift-code',
		],
		[
			'/non_profits/261544963',
			undefined,
			'https://public.daffy.org/v1/non_profits/261544963',
		],
		[
			'/non_profits',
			{ cause_id: 1, query: 'education' },
			'https://public.daffy.org/v1/non_profits?cause_id=1&query=education',
		],
		[
			'/users/1/causes',
			undefined,
			'https://public.daffy.org/v1/users/1/causes',
		],
		[
			'/users/1/donations',
			{ page: 2 },
			'https://public.daffy.org/v1/users/1/donations?page=2',
		],
		['/users/me', undefined, 'https://public.daffy.org/v1/users/me'],
		[
			'/users/api-user',
			undefined,
			'https://public.daffy.org/v1/users/api-user',
		],
	] as const)(
		'routes %s through the public API',
		async (path, query, expected) => {
			await makeDaffyRequest(path, TEST_KEY, { query });
			expect(calls[0]?.url).toBe(expected);
			expect(new Headers(calls[0]?.init.headers).get('X-Api-Key')).toBe(
				TEST_KEY,
			);
		},
	);

	it('sends gift creation as a JSON POST without putting the key in the URL', async () => {
		await makeDaffyRequest('/gifts', TEST_KEY, {
			method: 'POST',
			body: { name: 'Jamie', amount: 18 },
		});
		const call = calls[0];
		expect(call?.init.method).toBe('POST');
		expect(call?.init.body).toBe(JSON.stringify({ name: 'Jamie', amount: 18 }));
		expect(call?.url).not.toContain(TEST_KEY);
	});
});
