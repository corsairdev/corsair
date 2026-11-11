import {
	Activities,
	Contacts,
	ContactTags,
	Funds,
	HouseholdContacts,
	Households,
	Messages,
	Payouts,
	Plans,
	Pledges,
	Transactions,
	WebhookActivities,
	Webhooks,
} from './endpoints';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

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
const resource = { id: 'resource_1' };

let fetchMock: jest.SpyInstance;

// Test responses remain arbitrary JSON so public endpoint schemas validate the boundary.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(body === undefined ? null : JSON.stringify(body), {
			status,
			headers:
				body === undefined ? undefined : { 'Content-Type': 'application/json' },
		}),
	);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch');
	});
});

it('forwards Givebutter’s documented household page query', async () => {
	respond([]);
	await Households.list(ctx as never, { page: 2 });
	const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
	expect(url).toBe('https://api.givebutter.com/v1/households?page=2');
	expect(init.method).toBe('GET');
});
afterEach(() => fetchMock.mockRestore());

describe('Givebutter CRM and financial operation seams', () => {
	const operations: Array<{
		name: string;
		call: () => Promise<unknown>;
		result: unknown;
		method: string;
		path: string;
	}> = [
		{
			name: 'contacts.list',
			call: () => Contacts.list(ctx as never, { email: 'a@example.com' }),
			result: page,
			method: 'GET',
			path: '/v1/contacts?email=a%40example.com',
		},
		{
			name: 'contacts.create',
			call: () => Contacts.create(ctx as never, { first_name: 'Ada' }),
			result: resource,
			method: 'POST',
			path: '/v1/contacts',
		},
		{
			name: 'contacts.get',
			call: () => Contacts.get(ctx as never, { contact: 1 }),
			result: resource,
			method: 'GET',
			path: '/v1/contacts/1',
		},
		{
			name: 'contacts.update',
			call: () =>
				Contacts.update(ctx as never, { contact: 1, first_name: 'Ada' }),
			result: resource,
			method: 'PUT',
			path: '/v1/contacts/1',
		},
		{
			name: 'contacts.delete',
			call: () => Contacts.delete(ctx as never, { contact: 1 }),
			result: undefined,
			method: 'DELETE',
			path: '/v1/contacts/1',
		},
		{
			name: 'contacts.restore',
			call: () => Contacts.restore(ctx as never, { contact: 1 }),
			result: resource,
			method: 'POST',
			path: '/v1/contacts/1/restore',
		},
		{
			name: 'activities.list',
			call: () => Activities.list(ctx as never, { contact: 1, type: 'note' }),
			result: page,
			method: 'GET',
			path: '/v1/contacts/1/activities?type=note',
		},
		{
			name: 'activities.create',
			call: () => Activities.create(ctx as never, { contact: 1, type: 'note' }),
			result: resource,
			method: 'POST',
			path: '/v1/contacts/1/activities',
		},
		{
			name: 'activities.get',
			call: () => Activities.get(ctx as never, { contact: 1, activity: 2 }),
			result: resource,
			method: 'GET',
			path: '/v1/contacts/1/activities/2',
		},
		{
			name: 'activities.update',
			call: () => Activities.update(ctx as never, { contact: 1, activity: 2 }),
			result: resource,
			method: 'PUT',
			path: '/v1/contacts/1/activities/2',
		},
		{
			name: 'activities.delete',
			call: () => Activities.delete(ctx as never, { contact: 1, activity: 2 }),
			result: undefined,
			method: 'DELETE',
			path: '/v1/contacts/1/activities/2',
		},
		...(['add', 'remove', 'sync'] as const).map((action) => ({
			name: `contactTags.${action}`,
			call: () =>
				ContactTags[action](ctx as never, { contact: 1, tags: ['donor'] }),
			result: resource,
			method: 'POST',
			path: `/v1/contacts/1/tags/${action}`,
		})),
		...(['list', 'create', 'get', 'update', 'delete'] as const).map(
			(action) => ({
				name: `funds.${action}`,
				call: () =>
					action === 'list'
						? Funds.list(ctx as never, {})
						: action === 'create'
							? Funds.create(ctx as never, { name: 'General' })
							: action === 'get'
								? Funds.get(ctx as never, { fund: 'general' })
								: action === 'update'
									? Funds.update(ctx as never, {
											fund: 'general',
											name: 'Updated',
										})
									: Funds.delete(ctx as never, { fund: 'general' }),
				result:
					action === 'list' ? page : action === 'delete' ? undefined : resource,
				method:
					action === 'list' || action === 'get'
						? 'GET'
						: action === 'delete'
							? 'DELETE'
							: action === 'update'
								? 'PUT'
								: 'POST',
				path:
					action === 'list' || action === 'create'
						? '/v1/funds'
						: '/v1/funds/general',
			}),
		),
		...(['list', 'create', 'get', 'update', 'delete'] as const).map(
			(action) => ({
				name: `households.${action}`,
				call: () =>
					action === 'list'
						? Households.list(ctx as never, {})
						: action === 'create'
							? Households.create(ctx as never, { name: 'Home' })
							: action === 'get'
								? Households.get(ctx as never, { household: 1 })
								: action === 'update'
									? Households.update(ctx as never, {
											household: 1,
											name: 'Home',
										})
									: Households.delete(ctx as never, { household: 1 }),
				result:
					action === 'list' ? [] : action === 'delete' ? undefined : resource,
				method:
					action === 'list' || action === 'get'
						? 'GET'
						: action === 'delete'
							? 'DELETE'
							: action === 'update'
								? 'PUT'
								: 'POST',
				path:
					action === 'list' || action === 'create'
						? '/v1/households'
						: '/v1/households/1',
			}),
		),
		{
			name: 'householdContacts.list',
			call: () => HouseholdContacts.list(ctx as never, { household: 1 }),
			result: page,
			method: 'GET',
			path: '/v1/households/1/contacts',
		},
		{
			name: 'householdContacts.add',
			call: () =>
				HouseholdContacts.add(ctx as never, { household: 1, contact_id: 2 }),
			result: resource,
			method: 'POST',
			path: '/v1/households/1/contacts',
		},
		{
			name: 'householdContacts.get',
			call: () =>
				HouseholdContacts.get(ctx as never, { household: 1, contact: 2 }),
			result: resource,
			method: 'GET',
			path: '/v1/households/1/contacts/2',
		},
		{
			name: 'householdContacts.remove',
			call: () =>
				HouseholdContacts.remove(ctx as never, { household: 1, contact: 2 }),
			result: resource,
			method: 'DELETE',
			path: '/v1/households/1/contacts/2',
		},
		...(
			[
				{ name: 'messages', group: Messages },
				{ name: 'payouts', group: Payouts },
				{ name: 'pledges', group: Pledges },
			] as const
		).flatMap(({ name, group }) => [
			{
				name: `${name}.list`,
				call: () => group.list(ctx as never, {}),
				result: page,
				method: 'GET',
				path: `/v1/${name}`,
			},
			{
				name: `${name}.get`,
				call: () =>
					group.get(ctx as never, { [name.slice(0, -1)]: '1' } as never),
				result: resource,
				method: 'GET',
				path: `/v1/${name}/1`,
			},
		]),
		{
			name: 'plans.list',
			call: () => Plans.list(ctx as never, { contacts: '1,2' }),
			result: page,
			method: 'GET',
			path: '/v1/plans?contacts=1%2C2',
		},
		{
			name: 'plans.get',
			call: () => Plans.get(ctx as never, { plan: 'plan_1' }),
			result: resource,
			method: 'GET',
			path: '/v1/plans/plan_1',
		},
		{
			name: 'transactions.list',
			call: () => Transactions.list(ctx as never, { scope: 'all' }),
			result: { ...page, meta: { ...page.meta, unfiltered_total: 0 } },
			method: 'GET',
			path: '/v1/transactions?scope=all',
		},
		{
			name: 'transactions.create',
			call: () =>
				Transactions.create(ctx as never, {
					method: 'cash',
					transacted_at: '2026-01-01',
					amount: '10.00',
				}),
			result: resource,
			method: 'POST',
			path: '/v1/transactions',
		},
		{
			name: 'transactions.get',
			call: () => Transactions.get(ctx as never, { transaction: 'txn_1' }),
			result: resource,
			method: 'GET',
			path: '/v1/transactions/txn_1',
		},
		{
			name: 'transactions.update',
			call: () => Transactions.update(ctx as never, { transaction: 'txn_1' }),
			result: resource,
			method: 'PUT',
			path: '/v1/transactions/txn_1',
		},
		{
			name: 'webhooks.list',
			call: () => Webhooks.list(ctx as never, {}),
			result: page,
			method: 'GET',
			path: '/v1/webhooks',
		},
		{
			name: 'webhooks.create',
			call: () =>
				Webhooks.create(ctx as never, { url: 'https://example.com/hook' }),
			result: resource,
			method: 'POST',
			path: '/v1/webhooks',
		},
		{
			name: 'webhooks.get',
			call: () => Webhooks.get(ctx as never, { webhook: 'hook_1' }),
			result: resource,
			method: 'GET',
			path: '/v1/webhooks/hook_1',
		},
		{
			name: 'webhooks.update',
			call: () =>
				Webhooks.update(ctx as never, {
					webhook: 'hook_1',
					url: 'https://example.com/hook',
					events: ['contact.created'],
				}),
			result: resource,
			method: 'PUT',
			path: '/v1/webhooks/hook_1',
		},
		{
			name: 'webhooks.delete',
			call: () => Webhooks.delete(ctx as never, { webhook: 'hook_1' }),
			result: undefined,
			method: 'DELETE',
			path: '/v1/webhooks/hook_1',
		},
		{
			name: 'webhooks.activities.list',
			call: () => WebhookActivities.list(ctx as never, { webhook: 'hook_1' }),
			result: page,
			method: 'GET',
			path: '/v1/webhooks/hook_1/activities',
		},
		{
			name: 'webhooks.activities.get',
			call: () =>
				WebhookActivities.get(ctx as never, {
					webhook: 'hook_1',
					activity: 'event_1',
				}),
			result: resource,
			method: 'GET',
			path: '/v1/webhooks/hook_1/activities/event_1',
		},
	];

	it.each(operations)(
		'$name sends its documented method and path',
		async ({ call, result, method, path }) => {
			respond(result, result === undefined ? 204 : 200);
			await expect(call()).resolves.toEqual(
				result === undefined ? undefined : expect.anything(),
			);
			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe(`https://api.givebutter.com${path}`);
			expect(init.method).toBe(method);
			expect(new Headers(init.headers).get('authorization')).toBe(
				'Bearer givebutter-test-key',
			);
		},
	);
});
