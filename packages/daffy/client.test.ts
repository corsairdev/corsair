import * as http from 'corsair/http';
import { makeDaffyRequest } from './client';

const TEST_KEY = 'test-key-not-a-credential';
let calls: { url: string; init: RequestInit }[] = [];
const realFetch = global.fetch;

function mockFetch(): void {
	// No type assertions: serve a real Response so the stub already satisfies
	// fetch's type instead of casting a partial object.
	const stub: typeof global.fetch = async (input, init) => {
		calls.push({ url: String(input), init: init ?? {} });
		return new Response('{}', {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	};
	global.fetch = stub;
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
		[
			'/users/1/donations/2',
			undefined,
			'https://public.daffy.org/v1/users/1/donations/2',
		],
		[
			'/donations/1234',
			undefined,
			'https://public.daffy.org/v1/donations/1234',
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

	it('disables transport retries for donation creation POSTs', async () => {
		const requestSpy = jest.spyOn(http, 'request').mockResolvedValue({});
		await makeDaffyRequest('/donations', TEST_KEY, {
			method: 'POST',
			body: { amount: 25, ein: '941156258', note: 'love what they do!' },
		});
		expect(requestSpy).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ method: 'POST', url: '/donations' }),
			expect.objectContaining({
				rateLimitConfig: expect.objectContaining({
					enabled: false,
					maxRetries: 0,
				}),
			}),
		);
		requestSpy.mockRestore();
	});

	it('disables transport retries for donation cancel DELETEs', async () => {
		const requestSpy = jest.spyOn(http, 'request').mockResolvedValue({});
		await makeDaffyRequest('/donations/1234', TEST_KEY, {
			method: 'DELETE',
		});
		expect(requestSpy).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ method: 'DELETE', url: '/donations/1234' }),
			expect.objectContaining({
				rateLimitConfig: expect.objectContaining({
					enabled: false,
					maxRetries: 0,
				}),
			}),
		);
		requestSpy.mockRestore();
	});

	it('disables transport retries for gift creation POSTs', async () => {
		const requestSpy = jest.spyOn(http, 'request').mockResolvedValue({});
		await makeDaffyRequest('/gifts', TEST_KEY, {
			method: 'POST',
			body: { name: 'Jamie', amount: 18 },
		});
		expect(requestSpy).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ method: 'POST', url: '/gifts' }),
			expect.objectContaining({
				rateLimitConfig: expect.objectContaining({
					enabled: false,
					maxRetries: 0,
				}),
			}),
		);
		requestSpy.mockRestore();
	});

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
