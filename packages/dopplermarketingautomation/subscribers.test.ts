import type { DopplerMarketingAutomationContext } from './index';
import { dopplermarketingautomation } from './index';

const context = { key: 'test-key' } as DopplerMarketingAutomationContext;
const subscribers = dopplermarketingautomation().endpoints!.subscribers;

describe('Doppler subscriber endpoints', () => {
	const fetchMock = jest.spyOn(globalThis, 'fetch');
	afterEach(() => fetchMock.mockReset());
	afterAll(() => fetchMock.mockRestore());

	it.each([
		[
			'list',
			{ accountName: 'team', page: 2, per_page: 3 },
			'GET',
			'/accounts/team/subscribers?page=2&per_page=3',
			{ items: [{ email: 'a@example.com', status: null }] },
		],
		[
			'listForList',
			{ accountName: 'team', listId: 7, page: 2 },
			'GET',
			'/accounts/team/lists/7/subscribers?page=2',
			{ items: [] },
		],
		[
			'get',
			{ accountName: 'team', email: 'a@example.com' },
			'GET',
			'/accounts/team/subscribers/a%40example.com',
			{ email: 'a@example.com', canBeReactivated: null },
		],
		[
			'exists',
			{ accountName: 'team', email: 'a@example.com' },
			'HEAD',
			'/accounts/team/subscribers/a%40example.com',
			undefined,
		],
		[
			'create',
			{ accountName: 'team', subscriber: { email: 'a@example.com' } },
			'POST',
			'/accounts/team/subscribers',
			{ message: 'ok' },
		],
		[
			'associate',
			{
				accountName: 'team',
				listId: 7,
				subscriber: { email: 'a@example.com' },
				allowReSubscription: false,
			},
			'POST',
			'/accounts/team/lists/7/subscribers?allowReSubscription=false',
			{ message: 'ok' },
		],
		[
			'removeFromList',
			{ accountName: 'team', listId: 7, email: 'a@example.com' },
			'DELETE',
			'/accounts/team/lists/7/subscribers/a%40example.com',
			{ message: 'ok' },
		],
		[
			'archive',
			{ accountName: 'team', email: 'a@example.com' },
			'POST',
			'/accounts/team/subscribers/a%40example.com/archive',
			{ message: 'ok' },
		],
		[
			'listUnsubscribed',
			{ accountName: 'team', page: 2 },
			'GET',
			'/accounts/team/unsubscribed?page=2',
			{ items: [] },
		],
		[
			'unsubscribe',
			{ accountName: 'team', subscriber: { email: 'a@example.com' } },
			'POST',
			'/accounts/team/unsubscribed',
			{ message: 'ok' },
		],
		[
			'import',
			{
				accountName: 'team',
				subscribers: { fields: [], items: [{ email: 'a@example.com' }] },
			},
			'POST',
			'/accounts/team/subscribers/import',
			{ message: 'created' },
		],
		[
			'importToList',
			{
				accountName: 'team',
				listId: 7,
				subscribers: { fields: [], items: [{ email: 'a@example.com' }] },
			},
			'POST',
			'/accounts/team/lists/7/subscribers/import',
			{ message: 'created' },
		],
		[
			'importCsv',
			{ accountName: 'team', listId: 7, Body: 'Email\na@example.com' },
			'POST',
			'/accounts/team/lists/7/subscribers/import-csv',
			{ message: 'created' },
		],
		[
			'doubleOptIn',
			{
				accountName: 'team',
				listId: 7,
				templateId: 4,
				subscriber: { email: 'a@example.com' },
			},
			'POST',
			'/accounts/team/lists/7/subscribers/doble-optin/4',
			{ message: 'ok' },
		],
		[
			'listByOrigin',
			{ origin: 'website', page: 2 },
			'GET',
			'/subscribers/website?page=2',
			{ items: [] },
		],
		[
			'permissionsHistory',
			{
				accountName: 'team',
				email: 'a@example.com',
				fieldName: 'permission',
				page: 2,
			},
			'GET',
			'/accounts/team/subscribers/a%40example.com/permissions-history/permission?page=2',
			{ items: [{ value: 'true' }] },
		],
		[
			'deliveries',
			{ accountName: 'team', email: 'a@example.com', page: 2 },
			'GET',
			'/accounts/team/subscribers/a%40example.com/deliveries?page=2',
			{ items: [{ campaignId: 1, deliveryStatus: null }] },
		],
		[
			'importUnsubscribed',
			{
				accountName: 'team',
				subscribers: {
					items: [{ email: 'a@example.com', unsubscriptionComment: null }],
				},
			},
			'POST',
			'/accounts/team/unsubscribed/import',
			{ message: 'ok' },
		],
	] as const)(
		'%s sends and parses the documented request',
		async (operation, input, method, path, response) => {
			fetchMock.mockResolvedValueOnce(
				new Response(response === undefined ? null : JSON.stringify(response), {
					headers: { 'Content-Type': 'application/json' },
				}),
			);
			const call = subscribers[operation] as (
				ctx: DopplerMarketingAutomationContext,
				args: typeof input,
			) => Promise<unknown>;
			const result = await call(context, input);
			if (response === undefined) expect(result).toBeUndefined();
			else expect(result).toMatchObject(response);
			const [url, init] = fetchMock.mock.calls[0]!;
			expect(String(url)).toBe(`https://restapi.fromdoppler.com${path}`);
			expect(init?.method).toBe(method);
			expect(new Headers(init?.headers).get('Authorization')).toBe(
				'token test-key',
			);
			if ('subscriber' in input)
				expect(JSON.parse(String(init?.body))).toEqual(input.subscriber);
			else if ('subscribers' in input)
				expect(JSON.parse(String(init?.body))).toEqual(input.subscribers);
			else if ('Body' in input) {
				expect(init?.body).toBe(input.Body);
				expect(new Headers(init?.headers).get('Content-Type')).toBe('text/csv');
			} else expect(init?.body).toBeUndefined();
		},
	);
});
