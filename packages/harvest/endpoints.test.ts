/**
 * Exercises all 57 endpoint wrappers: the HTTP method and path each one builds,
 * the cache writes they perform, and what reaches the event log. Network access
 * is mocked, so this runs in CI.
 */
import { logEventFromContext } from 'corsair/core';
import {
	Clients,
	Company,
	Contacts,
	Estimates,
	Expenses,
	Invoices,
	Projects,
	Tasks,
	TimeEntries,
	Users,
} from './endpoints';
import { isNonIdempotent } from './error-handlers';
import { harvestEndpointMeta } from './index';

// The event-log payload is asserted directly further down: it is the one place
// caller-supplied text could leak into durable storage, so it needs to be
// inspected rather than inferred.
jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

type Store = { upsertByEntityId: jest.Mock; deleteByEntityId: jest.Mock };

function makeStore(): Store {
	return {
		upsertByEntityId: jest.fn(async () => undefined),
		deleteByEntityId: jest.fn(async () => true),
	};
}

type Ctx = Parameters<typeof Clients.list>[0];

function makeCtx() {
	const db = {
		clients: makeStore(),
		contacts: makeStore(),
		projects: makeStore(),
		tasks: makeStore(),
		users: makeStore(),
		invoices: makeStore(),
		estimates: makeStore(),
		expenseCategories: makeStore(),
		invoiceItemCategories: makeStore(),
		company: makeStore(),
	};
	const ctx = {
		key: 'test-harvest-token',
		options: { accountId: '1234567' },
		db,
		database: undefined,
		$getAccountId: async () => 'test-account',
	} as unknown as Ctx;
	return { ctx, db };
}

let lastUrl = '';
let lastMethod = '';
let lastBody: string | undefined;

/**
 * A response carrying every collection key the list operations read, plus an
 * `id` for the create operations. One body serves every operation, so the table
 * below stays about routing rather than fixtures.
 */
const RESPONSE_BODY = {
	id: 42,
	full_domain: 'example.harvestapp.com',
	clients: [],
	contacts: [],
	projects: [],
	tasks: [],
	users: [],
	invoices: [],
	estimates: [],
	time_entries: [],
	expense_categories: [],
	invoice_item_categories: [],
	invoice_messages: [],
	invoice_payments: [],
	estimate_messages: [],
};

beforeEach(() => {
	mockLogEvent.mockClear();
	lastUrl = '';
	lastMethod = '';
	lastBody = undefined;
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		lastUrl = String(url);
		lastMethod = init?.method ?? 'GET';
		lastBody = typeof init?.body === 'string' ? init.body : undefined;
		return {
			ok: true,
			status: 200,
			statusText: 'OK',
			url: String(url),
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => RESPONSE_BODY,
			text: async () => JSON.stringify(RESPONSE_BODY),
		};
	}) as unknown as typeof global.fetch;
});

/** [registry path, invocation, expected method, expected path] */
const OPERATIONS: [string, (ctx: Ctx) => Promise<unknown>, string, string][] = [
	['clients.list', (c) => Clients.list(c, {}), 'GET', '/v2/clients'],
	[
		'clients.get',
		(c) => Clients.get(c, { client_id: 1 }),
		'GET',
		'/v2/clients/1',
	],
	[
		'clients.create',
		(c) => Clients.create(c, { name: 'Acme' }),
		'POST',
		'/v2/clients',
	],
	[
		'clients.update',
		(c) => Clients.update(c, { client_id: 1 }),
		'PATCH',
		'/v2/clients/1',
	],
	[
		'clients.delete',
		(c) => Clients.remove(c, { client_id: 1 }),
		'DELETE',
		'/v2/clients/1',
	],

	['contacts.list', (c) => Contacts.list(c, {}), 'GET', '/v2/contacts'],
	[
		'contacts.create',
		(c) => Contacts.create(c, { client_id: 1, first_name: 'A' }),
		'POST',
		'/v2/contacts',
	],
	[
		'contacts.update',
		(c) => Contacts.update(c, { contact_id: 2 }),
		'PATCH',
		'/v2/contacts/2',
	],
	[
		'contacts.delete',
		(c) => Contacts.remove(c, { contact_id: 2 }),
		'DELETE',
		'/v2/contacts/2',
	],

	['company.get', (c) => Company.get(c, {}), 'GET', '/v2/company'],
	[
		'company.update',
		(c) => Company.update(c, { weekly_capacity: 1 }),
		'PATCH',
		'/v2/company',
	],

	['projects.list', (c) => Projects.list(c, {}), 'GET', '/v2/projects'],
	[
		'projects.get',
		(c) => Projects.get(c, { project_id: 3 }),
		'GET',
		'/v2/projects/3',
	],
	[
		'projects.create',
		(c) =>
			Projects.create(c, {
				client_id: 1,
				name: 'P',
				is_billable: true,
				bill_by: 'Tasks',
				budget_by: 'project',
			}),
		'POST',
		'/v2/projects',
	],
	[
		'projects.update',
		(c) => Projects.update(c, { project_id: 3 }),
		'PATCH',
		'/v2/projects/3',
	],
	[
		'projects.delete',
		(c) => Projects.remove(c, { project_id: 3 }),
		'DELETE',
		'/v2/projects/3',
	],

	['tasks.list', (c) => Tasks.list(c, {}), 'GET', '/v2/tasks'],
	['tasks.get', (c) => Tasks.get(c, { task_id: 4 }), 'GET', '/v2/tasks/4'],
	['tasks.create', (c) => Tasks.create(c, { name: 'T' }), 'POST', '/v2/tasks'],
	[
		'tasks.update',
		(c) => Tasks.update(c, { task_id: 4 }),
		'PATCH',
		'/v2/tasks/4',
	],
	[
		'tasks.delete',
		(c) => Tasks.remove(c, { task_id: 4 }),
		'DELETE',
		'/v2/tasks/4',
	],

	[
		'timeEntries.list',
		(c) => TimeEntries.list(c, {}),
		'GET',
		'/v2/time_entries',
	],
	[
		'timeEntries.get',
		(c) => TimeEntries.get(c, { time_entry_id: 5 }),
		'GET',
		'/v2/time_entries/5',
	],
	[
		'timeEntries.create',
		(c) =>
			TimeEntries.create(c, {
				project_id: 3,
				task_id: 4,
				spent_date: '2026-08-13',
			}),
		'POST',
		'/v2/time_entries',
	],
	[
		'timeEntries.update',
		(c) => TimeEntries.update(c, { time_entry_id: 5 }),
		'PATCH',
		'/v2/time_entries/5',
	],
	[
		'timeEntries.delete',
		(c) => TimeEntries.remove(c, { time_entry_id: 5 }),
		'DELETE',
		'/v2/time_entries/5',
	],

	['users.list', (c) => Users.list(c, {}), 'GET', '/v2/users'],
	['users.get', (c) => Users.get(c, { user_id: 6 }), 'GET', '/v2/users/6'],
	[
		'users.create',
		(c) =>
			Users.create(c, {
				first_name: 'A',
				last_name: 'B',
				email: 'a@example.com',
			}),
		'POST',
		'/v2/users',
	],
	[
		'users.update',
		(c) => Users.update(c, { user_id: 6 }),
		'PATCH',
		'/v2/users/6',
	],
	[
		'users.delete',
		(c) => Users.remove(c, { user_id: 6 }),
		'DELETE',
		'/v2/users/6',
	],

	[
		'expenses.create',
		(c) =>
			Expenses.create(c, {
				project_id: 3,
				expense_category_id: 7,
				spent_date: '2026-08-13',
				total_cost: 1,
			}),
		'POST',
		'/v2/expenses',
	],
	[
		'expenses.update',
		(c) => Expenses.update(c, { expense_id: 8 }),
		'PATCH',
		'/v2/expenses/8',
	],
	[
		'expenses.listCategories',
		(c) => Expenses.listCategories(c, {}),
		'GET',
		'/v2/expense_categories',
	],

	['invoices.list', (c) => Invoices.list(c, {}), 'GET', '/v2/invoices'],
	[
		'invoices.get',
		(c) => Invoices.get(c, { invoice_id: 9 }),
		'GET',
		'/v2/invoices/9',
	],
	[
		'invoices.create',
		(c) => Invoices.create(c, { client_id: 1 }),
		'POST',
		'/v2/invoices',
	],
	[
		'invoices.update',
		(c) => Invoices.update(c, { invoice_id: 9 }),
		'PATCH',
		'/v2/invoices/9',
	],
	[
		'invoices.delete',
		(c) => Invoices.remove(c, { invoice_id: 9 }),
		'DELETE',
		'/v2/invoices/9',
	],
	[
		'invoices.listMessages',
		(c) => Invoices.listMessages(c, { invoice_id: 9 }),
		'GET',
		'/v2/invoices/9/messages',
	],
	[
		'invoices.createMessage',
		(c) => Invoices.createMessage(c, { invoice_id: 9, event_type: 'close' }),
		'POST',
		'/v2/invoices/9/messages',
	],
	[
		'invoices.deleteMessage',
		(c) => Invoices.removeMessage(c, { invoice_id: 9, message_id: 10 }),
		'DELETE',
		'/v2/invoices/9/messages/10',
	],
	[
		'invoices.listPayments',
		(c) => Invoices.listPayments(c, { invoice_id: 9 }),
		'GET',
		'/v2/invoices/9/payments',
	],
	[
		'invoices.createPayment',
		(c) => Invoices.createPayment(c, { invoice_id: 9, amount: 5 }),
		'POST',
		'/v2/invoices/9/payments',
	],
	[
		'invoices.deletePayment',
		(c) => Invoices.removePayment(c, { invoice_id: 9, payment_id: 11 }),
		'DELETE',
		'/v2/invoices/9/payments/11',
	],
	[
		'invoices.listItemCategories',
		(c) => Invoices.listItemCategories(c, {}),
		'GET',
		'/v2/invoice_item_categories',
	],
	[
		'invoices.createItemCategory',
		(c) => Invoices.createItemCategory(c, { name: 'Service' }),
		'POST',
		'/v2/invoice_item_categories',
	],
	[
		'invoices.deleteItemCategory',
		(c) => Invoices.removeItemCategory(c, { invoice_item_category_id: 12 }),
		'DELETE',
		'/v2/invoice_item_categories/12',
	],

	[
		'estimates.get',
		(c) => Estimates.get(c, { estimate_id: 13 }),
		'GET',
		'/v2/estimates/13',
	],
	[
		'estimates.create',
		(c) => Estimates.create(c, { client_id: 1 }),
		'POST',
		'/v2/estimates',
	],
	[
		'estimates.update',
		(c) => Estimates.update(c, { estimate_id: 13 }),
		'PATCH',
		'/v2/estimates/13',
	],
	[
		'estimates.delete',
		(c) => Estimates.remove(c, { estimate_id: 13 }),
		'DELETE',
		'/v2/estimates/13',
	],
	[
		'estimates.listMessages',
		(c) => Estimates.listMessages(c, { estimate_id: 13 }),
		'GET',
		'/v2/estimates/13/messages',
	],
	[
		'estimates.createMessage',
		(c) =>
			Estimates.createMessage(c, { estimate_id: 13, event_type: 'accept' }),
		'POST',
		'/v2/estimates/13/messages',
	],
	[
		'estimates.deleteMessage',
		(c) => Estimates.removeMessage(c, { estimate_id: 13, message_id: 14 }),
		'DELETE',
		'/v2/estimates/13/messages/14',
	],
	[
		'estimates.createItemCategory',
		(c) => Estimates.createItemCategory(c, { name: 'Service' }),
		'POST',
		'/v2/estimate_item_categories',
	],
	[
		'estimates.updateItemCategory',
		(c) =>
			Estimates.updateItemCategory(c, {
				estimate_item_category_id: 15,
				name: 'Renamed',
			}),
		'PATCH',
		'/v2/estimate_item_categories/15',
	],
];

describe('operation routing', () => {
	for (const [path, invoke, method, expectedPath] of OPERATIONS) {
		it(`${path} issues ${method} ${expectedPath}`, async () => {
			const { ctx } = makeCtx();
			await invoke(ctx);

			expect(lastMethod).toBe(method);
			// The query string is not asserted here; only that the operation is
			// routed to the right resource.
			expect(new URL(lastUrl).pathname).toBe(expectedPath);
		});
	}
});

describe('operation coverage', () => {
	it('exercises every operation the plugin registers', () => {
		const registered = Object.keys(harvestEndpointMeta).sort();
		const exercised = OPERATIONS.map(([path]) => path).sort();

		expect(exercised).toEqual(registered);
		expect(registered).toHaveLength(57);
	});

	it('marks every delete operation destructive', () => {
		const deletes = Object.entries(harvestEndpointMeta).filter(([path]) =>
			path.toLowerCase().includes('delete'),
		);

		// Without this the loop below passes by matching nothing.
		expect(deletes.length).toBe(12);

		for (const [, meta] of deletes) {
			expect(meta.riskLevel).toBe('destructive');
		}
	});

	it('treats exactly the POST operations as non-idempotent', () => {
		// `error-handlers.ts` decides whether a network failure may be retried by
		// matching `create` in the operation name. That is only safe while the
		// POST operations are exactly the ones so named, which is what this
		// asserts against the routing table above.
		const posts = OPERATIONS.filter(([, , method]) => method === 'POST')
			.map(([path]) => path)
			.sort();
		const nonIdempotent = OPERATIONS.map(([path]) => path)
			.filter(isNonIdempotent)
			.sort();

		expect(nonIdempotent).toEqual(posts);
		expect(posts).toHaveLength(14);
	});
});

describe('caching', () => {
	it('mirrors a fetched client under its id', async () => {
		const { ctx, db } = makeCtx();
		await Clients.get(ctx, { client_id: 42 });

		expect(db.clients.upsertByEntityId).toHaveBeenCalledWith(
			'42',
			expect.objectContaining({ id: 42 }),
		);
	});

	it('keys company settings on full_domain, which has no id', async () => {
		const { ctx, db } = makeCtx();
		await Company.get(ctx, {});

		expect(db.company.upsertByEntityId).toHaveBeenCalledWith(
			'example.harvestapp.com',
			expect.objectContaining({ full_domain: 'example.harvestapp.com' }),
		);
	});

	it('does not cache transactional records', async () => {
		const { ctx, db } = makeCtx();
		await TimeEntries.get(ctx, { time_entry_id: 42 });
		await Expenses.update(ctx, { expense_id: 42 });

		for (const store of Object.values(db)) {
			expect(store.upsertByEntityId).not.toHaveBeenCalled();
		}
	});

	it('evicts a deleted record so the mirror cannot outlive it', async () => {
		const { ctx, db } = makeCtx();
		await Clients.remove(ctx, { client_id: 42 });

		expect(db.clients.deleteByEntityId).toHaveBeenCalledWith('42');
	});

	it('evicts on every delete that has a mirrored entity', async () => {
		const { ctx, db } = makeCtx();

		await Clients.remove(ctx, { client_id: 1 });
		await Contacts.remove(ctx, { contact_id: 2 });
		await Projects.remove(ctx, { project_id: 3 });
		await Tasks.remove(ctx, { task_id: 4 });
		await Users.remove(ctx, { user_id: 5 });
		await Invoices.remove(ctx, { invoice_id: 6 });
		await Invoices.removeItemCategory(ctx, { invoice_item_category_id: 7 });
		await Estimates.remove(ctx, { estimate_id: 8 });

		expect(db.clients.deleteByEntityId).toHaveBeenCalledWith('1');
		expect(db.contacts.deleteByEntityId).toHaveBeenCalledWith('2');
		expect(db.projects.deleteByEntityId).toHaveBeenCalledWith('3');
		expect(db.tasks.deleteByEntityId).toHaveBeenCalledWith('4');
		expect(db.users.deleteByEntityId).toHaveBeenCalledWith('5');
		expect(db.invoices.deleteByEntityId).toHaveBeenCalledWith('6');
		expect(db.invoiceItemCategories.deleteByEntityId).toHaveBeenCalledWith('7');
		expect(db.estimates.deleteByEntityId).toHaveBeenCalledWith('8');
	});

	it('does not evict for deletes of records that are never mirrored', async () => {
		const { ctx, db } = makeCtx();

		await TimeEntries.remove(ctx, { time_entry_id: 1 });
		await Invoices.removeMessage(ctx, { invoice_id: 2, message_id: 3 });
		await Invoices.removePayment(ctx, { invoice_id: 2, payment_id: 4 });
		await Estimates.removeMessage(ctx, { estimate_id: 5, message_id: 6 });

		for (const store of Object.values(db)) {
			expect(store.deleteByEntityId).not.toHaveBeenCalled();
		}
	});
});

describe('event log', () => {
	it('records a contact by id without its name, email or phone number', async () => {
		const { ctx } = makeCtx();
		await Contacts.create(ctx, {
			client_id: 1,
			first_name: 'Corsair',
			last_name: 'Fixture',
			email: 'corsair.fixture@example.com',
			phone_mobile: '+15550100',
		});

		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'harvest.contacts.create',
			{ client_id: 1, contact_id: 42 },
			'completed',
		);
	});

	it('records an invoice message by event and recipient count, not addresses', async () => {
		const { ctx } = makeCtx();
		await Invoices.createMessage(ctx, {
			invoice_id: 9,
			event_type: 'send',
			subject: 'Invoice attached',
			body: 'Please find the invoice for July.',
			recipients: [{ email: 'billing@example.com' }],
		});

		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'harvest.invoices.createMessage',
			{ invoice_id: 9, event_type: 'send', recipients: 1 },
			'completed',
		);
	});

	it('records a time entry without its notes', async () => {
		const { ctx } = makeCtx();
		await TimeEntries.create(ctx, {
			project_id: 3,
			task_id: 4,
			spent_date: '2026-08-13',
			notes: 'Client called about the migration plan',
		});

		const payload = mockLogEvent.mock.calls.at(-1)?.[2] as
			| Record<string, unknown>
			| undefined;
		expect(payload).toEqual({
			project_id: 3,
			task_id: 4,
			time_entry_id: 42,
		});
	});

	it('keeps free text out of the payload when auditPayload names the fields', async () => {
		const { ctx } = makeCtx();
		await Clients.update(ctx, { client_id: 1, address: '1 Example Street' });

		const payload = mockLogEvent.mock.calls.at(-1)?.[2] as
			| Record<string, unknown>
			| undefined;
		// `fields` lists which inputs were supplied; the address itself is not
		// among the recorded values.
		expect(payload).toEqual({
			client_id: 1,
			fields: ['client_id', 'address'],
		});
	});
});

describe('request bodies', () => {
	it('omits fields the caller did not supply', async () => {
		const { ctx } = makeCtx();
		await Clients.update(ctx, { client_id: 1, name: 'Renamed' });

		const body = JSON.parse(lastBody ?? '{}');
		expect(body).toEqual({ name: 'Renamed' });
		// Harvest treats an explicit null as "clear this field", so an unset
		// input must not be serialised at all.
		expect(body).not.toHaveProperty('address');
		expect(body).not.toHaveProperty('is_active');
	});

	it('sends no body on a delete', async () => {
		const { ctx } = makeCtx();
		await Clients.remove(ctx, { client_id: 1 });

		expect(lastBody).toBeUndefined();
	});

	it('defaults send_thank_you to false so Harvest does not email the client', async () => {
		const { ctx } = makeCtx();
		await Invoices.createPayment(ctx, { invoice_id: 9, amount: 5 });

		expect(JSON.parse(lastBody ?? '{}')).toEqual({
			amount: 5,
			send_thank_you: false,
		});
	});

	it('forwards invoice_recipient_status on contact create', async () => {
		const { ctx } = makeCtx();
		await Contacts.create(ctx, {
			client_id: 1,
			first_name: 'A',
			invoice_recipient_status: 'cc',
		});

		expect(JSON.parse(lastBody ?? '{}')).toMatchObject({
			invoice_recipient_status: 'cc',
		});
	});
});

describe('delete results', () => {
	it('reports the id it removed rather than an empty object', async () => {
		const { ctx } = makeCtx();

		await expect(Tasks.remove(ctx, { task_id: 4 })).resolves.toEqual({
			success: true,
			id: 4,
		});
		await expect(
			Invoices.removePayment(ctx, { invoice_id: 9, payment_id: 11 }),
		).resolves.toEqual({ success: true, id: 11 });
	});
});
