import type { DopplerMarketingAutomationContext } from './index';
import { dopplermarketingautomation } from './index';

const context = { key: 'test-key' } as DopplerMarketingAutomationContext;
const endpoints = dopplermarketingautomation().endpoints!.lists;

describe('Doppler lists public endpoint seam', () => {
	const fetchMock = jest.spyOn(globalThis, 'fetch');
	afterEach(() => fetchMock.mockReset());
	afterAll(() => fetchMock.mockRestore());

	it('forwards pagination and parses nullable list fields', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(
				JSON.stringify({
					items: [{ name: 'Members', hasFormsAssociated: null }],
					currentPage: 2,
				}),
				{ headers: { 'Content-Type': 'application/json' } },
			),
		);
		const result = await endpoints.list(context, {
			accountName: 'team@example.com',
			page: 2,
			per_page: 20,
		});
		expect(result.items[0]?.hasFormsAssociated).toBeNull();
		const [url, init] = fetchMock.mock.calls[0]!;
		expect(String(url)).toBe(
			'https://restapi.fromdoppler.com/accounts/team%40example.com/lists?page=2&per_page=20',
		);
		expect(new Headers(init?.headers).get('Authorization')).toBe(
			'token test-key',
		);
	});

	it.each([
		[
			'create',
			'POST',
			{
				accountName: 'team',
				list: { name: 'Members' },
				'X-Doppler-List-Origin': 'test',
			},
			'/accounts/team/lists',
			{ message: 'created', createdResourceId: '1' },
		],
		[
			'get',
			'GET',
			{ accountName: 'team', listId: 1 },
			'/accounts/team/lists/1',
			{ name: 'Members' },
		],
		[
			'update',
			'PUT',
			{ accountName: 'team', listId: 1, list: { name: 'Updated' } },
			'/accounts/team/lists/1',
			{ message: 'updated' },
		],
		[
			'delete',
			'DELETE',
			{ accountName: 'team', listId: 1 },
			'/accounts/team/lists/1',
			{ message: 'deleted' },
		],
	] as const)(
		'%s sends its documented request',
		async (operation, method, input, path, body) => {
			fetchMock.mockResolvedValueOnce(
				new Response(JSON.stringify(body), {
					headers: { 'Content-Type': 'application/json' },
				}),
			);
			const call = endpoints[operation] as (
				ctx: DopplerMarketingAutomationContext,
				value: typeof input,
			) => Promise<unknown>;
			expect(await call(context, input)).toMatchObject(body);
			const [url, init] = fetchMock.mock.calls[0]!;
			expect(String(url)).toBe(`https://restapi.fromdoppler.com${path}`);
			expect(init?.method).toBe(method);
			if ('list' in input)
				expect(JSON.parse(String(init?.body))).toEqual(input.list);
			else expect(init?.body).toBeUndefined();
			if (operation === 'create')
				expect(new Headers(init?.headers).get('X-Doppler-List-Origin')).toBe(
					'test',
				);
		},
	);

	it.each(['', '.', '..', 'team/name', 'team\\name', 'team"name'])(
		'rejects unsafe account path %s',
		async (accountName) => {
			await expect(endpoints.list(context, { accountName })).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);

	it('does not retry a rate-limited write', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response('{"message":"slow down"}', {
				status: 429,
				headers: { 'Content-Type': 'application/json', 'Retry-After': '3' },
			}),
		);
		await expect(
			endpoints.create(context, {
				accountName: 'team',
				list: { name: 'Members' },
			}),
		).rejects.toMatchObject({ status: 429, retryAfter: 3000 });
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('preserves HTTP-date Retry-After and provider errors', async () => {
		const now = jest
			.spyOn(Date, 'now')
			.mockReturnValue(Date.parse('2024-01-01T00:00:00Z'));
		try {
			fetchMock.mockResolvedValueOnce(
				new Response('{"message":"slow down"}', {
					status: 429,
					headers: { 'Retry-After': 'Mon, 01 Jan 2024 00:00:05 GMT' },
				}),
			);
			await expect(
				endpoints.list(context, { accountName: 'team' }),
			).rejects.toMatchObject({
				status: 429,
				retryAfter: 5000,
				body: { message: 'slow down' },
			});
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			now.mockRestore();
		}
	});

	it('rejects missing credentials before sending a request', async () => {
		await expect(
			endpoints.list({ key: '' } as DopplerMarketingAutomationContext, {
				accountName: 'team',
			}),
		).rejects.toMatchObject({ name: 'AuthMissingError' });
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
