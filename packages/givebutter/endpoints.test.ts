import { logEventFromContext } from 'corsair/core';
import {
	Campaigns,
	DiscountCodes,
	Members,
	Sso,
	Teams,
	TicketItems,
	Tickets,
} from './endpoints';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const ctx = { key: 'givebutter-test-key' };

const page = {
	data: [],
	links: { first: null, last: null, prev: null, next: null },
	meta: {
		current_page: 1,
		from: null,
		last_page: 1,
		links: [],
		path: null,
		per_page: 15,
		to: null,
		total: 0,
	},
};
const campaignPage = { ...page, meta: { ...page.meta, unfiltered_total: '0' } };

let fetchMock: jest.SpyInstance;

// Test responses intentionally accept arbitrary JSON so cases can exercise documented
// malformed/no-content transport behavior before endpoint output parsing.
function response(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(body === undefined ? null : JSON.stringify(body), {
			status,
			headers:
				body === undefined ? undefined : { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	return {
		url,
		method: init.method,
		headers: new Headers(init.headers),
		body: init.body ? JSON.parse(String(init.body)) : undefined,
	};
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch');
	});
	mockLog.mockClear();
});
afterEach(() => fetchMock.mockRestore());

describe('Givebutter campaign and catalog routes', () => {
	it('sends a bearer-authenticated campaign list request and preserves scope', async () => {
		response(campaignPage);
		await Campaigns.list(ctx as never, { scope: 'all' });
		const request = lastRequest();
		expect(request.url).toBe(
			'https://api.givebutter.com/v1/campaigns?scope=all',
		);
		expect(request.method).toBe('GET');
		expect(request.headers.get('authorization')).toBe(
			'Bearer givebutter-test-key',
		);
		expect(mockLog).toHaveBeenCalled();
	});

	it('forwards the requested campaign page', async () => {
		response(campaignPage);
		await Campaigns.list(ctx as never, { page: 2 });
		expect(lastRequest().url).toBe(
			'https://api.givebutter.com/v1/campaigns?page=2',
		);
	});

	it('accepts documented cleared campaign resource fields', async () => {
		response({
			id: 'campaign_1',
			subtitle: null,
			description: null,
			timezone: null,
			end_at: null,
			settings: null,
		});
		await expect(
			Campaigns.get(ctx as never, { campaign: 1 }),
		).resolves.toMatchObject({
			id: 'campaign_1',
			subtitle: null,
			description: null,
			timezone: null,
			end_at: null,
			settings: null,
		});
	});

	it('keeps campaign path identifiers out of write bodies', async () => {
		response({ id: '12' });
		await Campaigns.update(ctx as never, { campaign: 12, title: 'Updated' });
		expect(lastRequest()).toMatchObject({
			url: 'https://api.givebutter.com/v1/campaigns/12',
			method: 'PUT',
			body: { title: 'Updated' },
		});
	});

	it('returns void for documented empty deletes', async () => {
		response(undefined, 204);
		await expect(
			DiscountCodes.delete(ctx as never, { campaign: 12, discountCode: 4 }),
		).resolves.toBeUndefined();
		expect(lastRequest()).toMatchObject({
			url: 'https://api.givebutter.com/v1/campaigns/12/discount-codes/4',
			method: 'DELETE',
		});
	});

	it('rejects unsafe path values before making a request', async () => {
		await expect(
			Campaigns.get(ctx as never, { campaign: '/' }),
		).rejects.toThrow(/safe path segments/);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('every implemented Givebutter campaign/catalog operation', () => {
	const cases: Array<{
		name: string;
		invoke: () => Promise<unknown>;
		// Each fixture is intentionally untyped JSON because the public endpoint parses it.
		body: unknown;
		method: string;
		path: string;
		requestBody?: unknown;
	}> = [
		{
			name: 'campaigns.create',
			invoke: () =>
				Campaigns.create(ctx as never, {
					type: 'general',
					title: 'Spring fund',
				}),
			body: { id: 'campaign_1' },
			method: 'POST',
			path: '/v1/campaigns',
			requestBody: { type: 'general', title: 'Spring fund' },
		},
		{
			name: 'campaigns.get',
			invoke: () => Campaigns.get(ctx as never, { campaign: 1 }),
			body: { id: 'campaign_1' },
			method: 'GET',
			path: '/v1/campaigns/1',
		},
		{
			name: 'campaigns.delete',
			invoke: () => Campaigns.delete(ctx as never, { campaign: 1 }),
			body: undefined,
			method: 'DELETE',
			path: '/v1/campaigns/1',
		},
		{
			name: 'discountCodes.list',
			invoke: () => DiscountCodes.list(ctx as never, { campaign: 1 }),
			body: page,
			method: 'GET',
			path: '/v1/campaigns/1/discount-codes',
		},
		{
			name: 'discountCodes.create',
			invoke: () =>
				DiscountCodes.create(ctx as never, {
					campaign: 1,
					type: 'fixed',
					active: true,
					amount: 5,
					code: 'SAVE',
				}),
			body: {},
			method: 'POST',
			path: '/v1/campaigns/1/discount-codes',
			requestBody: { type: 'fixed', active: true, amount: 5, code: 'SAVE' },
		},
		{
			name: 'discountCodes.get',
			invoke: () =>
				DiscountCodes.get(ctx as never, { campaign: 1, discountCode: 2 }),
			body: {},
			method: 'GET',
			path: '/v1/campaigns/1/discount-codes/2',
		},
		{
			name: 'discountCodes.update',
			invoke: () =>
				DiscountCodes.update(ctx as never, {
					campaign: 1,
					discountCode: 2,
					amount: 6,
				}),
			body: {},
			method: 'PUT',
			path: '/v1/campaigns/1/discount-codes/2',
			requestBody: { amount: 6 },
		},
		{
			name: 'members.list',
			invoke: () => Members.list(ctx as never, { campaign: 1 }),
			body: page,
			method: 'GET',
			path: '/v1/campaigns/1/members',
		},
		{
			name: 'members.get',
			invoke: () => Members.get(ctx as never, { campaign: 1, member: 2 }),
			body: {},
			method: 'GET',
			path: '/v1/campaigns/1/members/2',
		},
		{
			name: 'members.delete',
			invoke: () => Members.delete(ctx as never, { campaign: 1, member: 2 }),
			body: undefined,
			method: 'DELETE',
			path: '/v1/campaigns/1/members/2',
		},
		{
			name: 'teams.list',
			invoke: () => Teams.list(ctx as never, { campaign: 1 }),
			body: page,
			method: 'GET',
			path: '/v1/campaigns/1/teams',
		},
		{
			name: 'teams.get',
			invoke: () => Teams.get(ctx as never, { campaign: 1, team: 2 }),
			body: {},
			method: 'GET',
			path: '/v1/campaigns/1/teams/2',
		},
		{
			name: 'teams.delete',
			invoke: () => Teams.delete(ctx as never, { campaign: 1, team: 2 }),
			body: undefined,
			method: 'DELETE',
			path: '/v1/campaigns/1/teams/2',
		},
		{
			name: 'ticketItems.list',
			invoke: () => TicketItems.list(ctx as never, { campaign: 1 }),
			body: page,
			method: 'GET',
			path: '/v1/campaigns/1/items/tickets',
		},
		{
			name: 'ticketItems.create',
			invoke: () =>
				TicketItems.create(ctx as never, {
					campaign: 1,
					name: 'Entry',
					price: 20,
				}),
			body: {},
			method: 'POST',
			path: '/v1/campaigns/1/items/tickets',
			requestBody: { name: 'Entry', price: 20 },
		},
		{
			name: 'ticketItems.get',
			invoke: () => TicketItems.get(ctx as never, { campaign: 1, ticketId: 2 }),
			body: {},
			method: 'GET',
			path: '/v1/campaigns/1/items/tickets/2',
		},
		{
			name: 'tickets.list',
			invoke: () => Tickets.list(ctx as never, {}),
			body: page,
			method: 'GET',
			path: '/v1/tickets',
		},
		{
			name: 'tickets.get',
			invoke: () => Tickets.get(ctx as never, { ticket: 'ticket_1' }),
			body: {},
			method: 'GET',
			path: '/v1/tickets/ticket_1',
		},
		{
			name: 'sso.account',
			invoke: () => Sso.account(ctx as never, {}),
			body: {},
			method: 'GET',
			path: '/sso/v1/account',
		},
		{
			name: 'sso.campaign',
			invoke: () => Sso.campaign(ctx as never, { campaign: 1 }),
			body: {},
			method: 'GET',
			path: '/sso/v1/campaigns/1',
		},
	];

	it.each(cases)(
		'$name reaches the documented HTTP seam',
		async ({ invoke, body, method, path, requestBody }) => {
			response(body, body === undefined ? 204 : 200);
			await expect(invoke()).resolves.toEqual(
				body === undefined ? undefined : expect.anything(),
			);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			const request = lastRequest();
			expect(request.url).toBe(`https://api.givebutter.com${path}`);
			expect(request.method).toBe(method);
			expect(request.body).toEqual(requestBody);
		},
	);
});
