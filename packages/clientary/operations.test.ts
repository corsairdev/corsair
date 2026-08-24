import { logEventFromContext } from 'corsair/core';
import { getClientaryCredentials, makeClientaryRequest } from './client';
import {
	Clients,
	Contacts,
	Estimates,
	Expenses,
	Hours,
	Invoices,
	Leads,
	PaymentProfiles,
	Payments,
	Projects,
	Recurring,
	Staff,
	Tasks,
} from './endpoints';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn(),
}));

jest.mock('./client', () => ({
	getClientaryCredentials: jest.fn(),
	makeClientaryRequest: jest.fn(),
}));

const mockLog = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;
const mockCreds = getClientaryCredentials as jest.MockedFunction<
	typeof getClientaryCredentials
>;
const mockRequest = makeClientaryRequest as jest.MockedFunction<
	typeof makeClientaryRequest
>;

function makeCtx() {
	return { key: 'token', options: { domain: 'acme' }, db: {} } as never;
}

const client = { id: 1, name: 'Acme' };
const contact = {
	id: 2,
	name: 'Ada Lovelace',
	email: 'ada@example.com',
	client_id: 1,
};
const estimate = {
	id: 3,
	date: '2026-01-15',
	status: 0,
	currency_code: 'USD',
	subtotal: 100,
	total_cost: 107,
	tax: 7,
	tax2: 0,
	tax3: 0,
	compound_tax: false,
	client_id: 1,
};
const expense = {
	id: 4,
	amount: 12,
	incurred_on: '2026-01-15',
	client_id: 1,
};
const hour = {
	id: 5,
	project_id: 7,
	title: 'Work',
	date: '2026-01-15',
	hours: 8,
};
const invoice = {
	id: 6,
	date: '2026-02-01',
	status: 0,
	currency_code: 'USD',
	subtotal: 100,
	total_cost: 100,
	balance: 100,
	total_payments: 0,
	tax: 0,
	tax2: 0,
	tax3: 0,
	compound_tax: false,
	client_id: 1,
};
const payment = {
	id: 8,
	invoice_id: 6,
	amount: 50,
	received_on: '2026-02-02',
};
const profile = {
	id: 9,
	client_id: 1,
	name: 'Visa',
	gateway: 'stripe',
};
const project = {
	id: 7,
	name: 'Site',
	status: 0,
	budget_type: 0,
	project_type: 0,
	client_id: 1,
};
const recurring = {
	id: 10,
	client_id: 1,
	title: 'Monthly',
	status: 0,
	action: 0,
	time_interval: 3,
	due_period: 15,
	next_date: '2026-03-01',
	currency_code: 'USD',
	unlimited: true,
	subtotal: 100,
	total_cost: 100,
	tax: 0,
	tax2: 0,
	tax3: 0,
	compound_tax: false,
};
const staff = { id: 11, name: 'Sam' };
const task = {
	id: 12,
	title: 'Ship it',
	complete: false,
	created_at: '2026-01-01T00:00:00Z',
	updated_at: '2026-01-01T00:00:00Z',
	client_id: 1,
	project_id: 7,
};

function paged(key: string, rows: unknown[]) {
	return {
		page_count: 1,
		page_size: 25,
		total_count: rows.length,
		[key]: rows,
	};
}

const unpaged = { page: undefined, page_size: undefined };
const expensesRange = {
	total_count: 1,
	from_date: '2026-01-01',
	to_date: '2026-01-31',
	expenses: [expense],
};

beforeEach(() => {
	mockLog.mockReset().mockResolvedValue(null);
	mockCreds.mockReset().mockResolvedValue({ apiKey: 'token', domain: 'acme' });
	mockRequest.mockReset();
});

type Op = {
	name: string;
	run: () => Promise<unknown>;
	path: string;
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
	body?: unknown;
	query?: unknown;
	response: unknown;
};

const ops: Op[] = [
	{
		name: 'clients.list',
		run: () => Clients.list(makeCtx(), { page: 1, page_size: 25 }),
		path: 'clients',
		query: {
			page: 1,
			page_size: 25,
			updated_since: undefined,
			sort: undefined,
		},
		response: paged('clients', [client]),
	},
	{
		name: 'clients.get',
		run: () => Clients.get(makeCtx(), { id: 1 }),
		path: 'clients/1',
		response: client,
	},
	{
		name: 'clients.create',
		run: () => Clients.create(makeCtx(), { name: 'Acme' }),
		path: 'clients',
		method: 'POST',
		body: { client: { name: 'Acme' } },
		response: client,
	},
	{
		name: 'clients.update',
		run: () => Clients.update(makeCtx(), { id: 1, name: 'Acme Inc' }),
		path: 'clients/1',
		method: 'PUT',
		body: { client: { name: 'Acme Inc' } },
		response: client,
	},
	{
		name: 'clients.delete',
		run: () => Clients.delete(makeCtx(), { id: 1 }),
		path: 'clients/1',
		method: 'DELETE',
		response: {},
	},
	{
		name: 'contacts.list',
		run: () => Contacts.list(makeCtx(), { page: 1, page_size: 10 }),
		path: 'contacts',
		query: { page: 1, page_size: 10 },
		response: paged('contacts', [contact]),
	},
	{
		name: 'contacts.listForClient',
		run: () => Contacts.listForClient(makeCtx(), { client_id: 1, page: 1 }),
		path: 'clients/1/contacts',
		query: { page: 1, page_size: undefined },
		response: paged('contacts', [contact]),
	},
	{
		name: 'contacts.get',
		run: () => Contacts.get(makeCtx(), { id: 2 }),
		path: 'contacts/2',
		response: contact,
	},
	{
		name: 'contacts.create',
		run: () =>
			Contacts.create(makeCtx(), {
				client_id: 1,
				name: 'Ada Lovelace',
				email: 'ada@example.com',
			}),
		path: 'clients/1/contacts',
		method: 'POST',
		body: {
			client_user: { name: 'Ada Lovelace', email: 'ada@example.com' },
		},
		response: contact,
	},
	{
		name: 'contacts.update',
		run: () => Contacts.update(makeCtx(), { id: 2, title: 'Eng' }),
		path: 'contacts/2',
		method: 'PUT',
		body: { contact: { title: 'Eng' } },
		response: contact,
	},
	{
		name: 'contacts.delete',
		run: () => Contacts.delete(makeCtx(), { id: 2 }),
		path: 'contacts/2',
		method: 'DELETE',
		response: {},
	},
	{
		name: 'estimates.list',
		run: () => Estimates.list(makeCtx(), { page: 2 }),
		path: 'estimates',
		query: { page: 2 },
		response: paged('estimates', [estimate]),
	},
	{
		name: 'estimates.listForClient',
		run: () => Estimates.listForClient(makeCtx(), { client_id: 1 }),
		path: 'clients/1/estimates',
		query: unpaged,
		response: paged('estimates', [estimate]),
	},
	{
		name: 'estimates.listForProject',
		run: () => Estimates.listForProject(makeCtx(), { project_id: 7 }),
		path: 'projects/7/estimates',
		query: unpaged,
		response: paged('estimates', [estimate]),
	},
	{
		name: 'estimates.get',
		run: () => Estimates.get(makeCtx(), { id: 3 }),
		path: 'estimates/3',
		response: estimate,
	},
	{
		name: 'estimates.create',
		run: () =>
			Estimates.create(makeCtx(), {
				date: '2026-01-15',
				currency_code: 'USD',
			}),
		path: 'estimates',
		method: 'POST',
		body: { estimate: { date: '2026-01-15', currency_code: 'USD' } },
		response: estimate,
	},
	{
		name: 'estimates.update',
		run: () => Estimates.update(makeCtx(), { id: 3, title: 'Rev' }),
		path: 'estimates/3',
		method: 'PUT',
		body: { estimate: { title: 'Rev' } },
		response: estimate,
	},
	{
		name: 'estimates.delete',
		run: () => Estimates.delete(makeCtx(), { id: 3 }),
		path: 'estimates/3',
		method: 'DELETE',
		response: {},
	},
	{
		name: 'estimates.send',
		run: () =>
			Estimates.send(makeCtx(), {
				id: 3,
				recipients: ['billing@example.com'],
			}),
		path: 'estimates/3/messages',
		method: 'POST',
		body: { recipients: ['billing@example.com'] },
		response: {},
	},
	{
		name: 'expenses.list',
		run: () => Expenses.list(makeCtx(), { from_date: '2026-01-01' }),
		path: 'expenses',
		query: { from_date: '2026-01-01', to_date: undefined },
		response: expensesRange,
	},
	{
		name: 'expenses.listForClient',
		run: () => Expenses.listForClient(makeCtx(), { client_id: 1 }),
		path: 'clients/1/expenses',
		query: unpaged,
		response: expensesRange,
	},
	{
		name: 'expenses.listForProject',
		run: () => Expenses.listForProject(makeCtx(), { project_id: 7 }),
		path: 'projects/7/expenses',
		query: unpaged,
		response: expensesRange,
	},
	{
		name: 'expenses.get',
		run: () => Expenses.get(makeCtx(), { id: 4 }),
		path: 'expenses/4',
		response: expense,
	},
	{
		name: 'expenses.create',
		run: () => Expenses.create(makeCtx(), { amount: 12 }),
		path: 'expenses',
		method: 'POST',
		body: { expense: { amount: 12 } },
		response: expense,
	},
	{
		name: 'expenses.update',
		run: () => Expenses.update(makeCtx(), { id: 4, amount: 15 }),
		path: 'expenses/4',
		method: 'PUT',
		body: { expense: { amount: 15 } },
		response: expense,
	},
	{
		name: 'expenses.delete',
		run: () => Expenses.delete(makeCtx(), { id: 4 }),
		path: 'expenses/4',
		method: 'DELETE',
		response: {},
	},
	{
		name: 'hours.listForProject',
		run: () => Hours.listForProject(makeCtx(), { project_id: 7, page: 1 }),
		path: 'projects/7/hours',
		query: { page: 1, page_size: undefined, filter: undefined },
		response: { hours: [hour] },
	},
	{
		name: 'hours.get',
		run: () => Hours.get(makeCtx(), { id: 5 }),
		path: 'hours/5',
		response: hour,
	},
	{
		name: 'hours.create',
		run: () =>
			Hours.create(makeCtx(), { project_id: 7, hours: 8, title: 'Work' }),
		path: 'projects/7/hours',
		method: 'POST',
		body: { hour: { hours: 8, title: 'Work' } },
		response: hour,
	},
	{
		name: 'hours.update',
		run: () => Hours.update(makeCtx(), { id: 5, hours: 9 }),
		path: 'hours/5',
		method: 'PUT',
		body: { hour: { hours: 9 } },
		response: hour,
	},
	{
		name: 'hours.delete',
		run: () => Hours.delete(makeCtx(), { id: 5 }),
		path: 'hours/5',
		method: 'DELETE',
		response: {},
	},
	{
		name: 'invoices.list',
		run: () => Invoices.list(makeCtx(), { page: 1, page_size: 25 }),
		path: 'invoices',
		query: {
			page: 1,
			page_size: 25,
			updated_since: undefined,
		},
		response: paged('invoices', [invoice]),
	},
	{
		name: 'invoices.listForClient',
		run: () => Invoices.listForClient(makeCtx(), { client_id: 1 }),
		path: 'clients/1/invoices',
		query: unpaged,
		response: paged('invoices', [invoice]),
	},
	{
		name: 'invoices.listForProject',
		run: () => Invoices.listForProject(makeCtx(), { project_id: 7 }),
		path: 'projects/7/invoices',
		query: unpaged,
		response: paged('invoices', [invoice]),
	},
	{
		name: 'invoices.listForRecurring',
		run: () => Invoices.listForRecurring(makeCtx(), { recurring_id: 10 }),
		path: 'recurring/10/invoices',
		query: unpaged,
		response: paged('invoices', [invoice]),
	},
	{
		name: 'invoices.get',
		run: () => Invoices.get(makeCtx(), { id: 6 }),
		path: 'invoices/6',
		response: invoice,
	},
	{
		name: 'invoices.create',
		run: () =>
			Invoices.create(makeCtx(), {
				date: '2026-02-01',
				due_date: '2026-02-15',
				currency_code: 'USD',
			}),
		path: 'invoices',
		method: 'POST',
		body: {
			invoice: {
				date: '2026-02-01',
				due_date: '2026-02-15',
				currency_code: 'USD',
			},
		},
		response: invoice,
	},
	{
		name: 'invoices.update',
		run: () => Invoices.update(makeCtx(), { id: 6, note: 'updated' }),
		path: 'invoice/6',
		method: 'PUT',
		body: { invoice: { note: 'updated' } },
		response: invoice,
	},
	{
		name: 'invoices.delete',
		run: () => Invoices.delete(makeCtx(), { id: 6 }),
		path: 'invoices/6',
		method: 'DELETE',
		response: {},
	},
	{
		name: 'invoices.send',
		run: () =>
			Invoices.send(makeCtx(), {
				id: 6,
				recipients: ['billing@example.com'],
			}),
		path: 'invoices/6/messages',
		method: 'POST',
		body: { recipients: ['billing@example.com'] },
		response: {},
	},
	{
		name: 'leads.list',
		run: () => Leads.list(makeCtx(), { page: 1 }),
		path: 'leads',
		query: { page: 1, page_size: undefined, sort: undefined },
		response: paged('leads', [client]),
	},
	{
		name: 'leads.get',
		run: () => Leads.get(makeCtx(), { id: 1 }),
		path: 'leads/1',
		response: client,
	},
	{
		name: 'leads.create',
		run: () => Leads.create(makeCtx(), { name: 'Prospect' }),
		path: 'leads',
		method: 'POST',
		body: { lead: { name: 'Prospect' } },
		response: client,
	},
	{
		name: 'leads.update',
		run: () => Leads.update(makeCtx(), { id: 1, name: 'Prospect Inc' }),
		path: 'leads/1',
		method: 'PUT',
		body: { lead: { name: 'Prospect Inc' } },
		response: client,
	},
	{
		name: 'leads.delete',
		run: () => Leads.delete(makeCtx(), { id: 1 }),
		path: 'leads/1',
		method: 'DELETE',
		response: {},
	},
	{
		name: 'payments.list',
		run: () => Payments.list(makeCtx(), { page: 1, page_size: 5 }),
		path: 'payments',
		query: { page: 1, page_size: 5, sort: undefined },
		response: paged('payments', [payment]),
	},
	{
		name: 'payments.create',
		run: () => Payments.create(makeCtx(), { invoice_id: 6, amount: 50 }),
		path: 'invoices/6/payments',
		method: 'POST',
		body: { payment: { amount: 50 } },
		response: payment,
	},
	{
		name: 'payments.delete',
		run: () => Payments.delete(makeCtx(), { invoice_id: 6, id: 8 }),
		path: 'invoices/6/payments/8',
		method: 'DELETE',
		response: {},
	},
	{
		name: 'paymentProfiles.listForClient',
		run: () => PaymentProfiles.listForClient(makeCtx(), { client_id: 1 }),
		path: 'clients/1/payment_profiles',
		query: unpaged,
		response: paged('payment_profiles', [profile]),
	},
	{
		name: 'paymentProfiles.create',
		run: () =>
			PaymentProfiles.create(makeCtx(), {
				client_id: 1,
				stripe_customer_id: 'cus_1',
				stripe_source_id: 'src_1',
				last_four_digits: '4242',
				name: 'Ada',
				expiration_date: '2028-01-01',
			}),
		path: 'clients/1/payment_profiles',
		method: 'POST',
		body: {
			payment_profile: {
				stripe_customer_id: 'cus_1',
				stripe_source_id: 'src_1',
				last_four_digits: '4242',
				name: 'Ada',
				expiration_date: '2028-01-01',
			},
		},
		response: profile,
	},
	{
		name: 'paymentProfiles.delete',
		run: () => PaymentProfiles.delete(makeCtx(), { client_id: 1, id: 9 }),
		path: 'clients/1/payment_profiles/9',
		method: 'DELETE',
		response: {},
	},
	{
		name: 'projects.list',
		run: () => Projects.list(makeCtx(), { page: 1 }),
		path: 'projects',
		query: { page: 1, page_size: undefined, filter: undefined },
		response: paged('projects', [project]),
	},
	{
		name: 'projects.listForClient',
		run: () => Projects.listForClient(makeCtx(), { client_id: 1 }),
		path: 'clients/1/projects',
		query: unpaged,
		response: paged('projects', [project]),
	},
	{
		name: 'projects.get',
		run: () => Projects.get(makeCtx(), { id: 7 }),
		path: 'projects/7',
		response: project,
	},
	{
		name: 'projects.create',
		run: () => Projects.create(makeCtx(), { name: 'Site', rate: 150 }),
		path: 'projects',
		method: 'POST',
		body: { project: { name: 'Site', rate: 150 } },
		response: project,
	},
	{
		name: 'projects.update',
		run: () => Projects.update(makeCtx(), { id: 7, name: 'Site v2' }),
		path: 'projects/7',
		method: 'PUT',
		body: { project: { name: 'Site v2' } },
		response: project,
	},
	{
		name: 'projects.delete',
		run: () => Projects.delete(makeCtx(), { id: 7 }),
		path: 'projects/7',
		method: 'DELETE',
		response: {},
	},
	{
		name: 'recurring.list',
		run: () => Recurring.list(makeCtx(), { page: 1 }),
		path: 'recurring',
		query: { page: 1 },
		response: {
			page_size: 25,
			page_count: 1,
			total_count: 1,
			recurring: [recurring],
		},
	},
	{
		name: 'recurring.get',
		run: () => Recurring.get(makeCtx(), { id: 10 }),
		path: 'recurring/10',
		response: recurring,
	},
	{
		name: 'recurring.create',
		run: () =>
			Recurring.create(makeCtx(), {
				next_date: '2026-03-01',
				due_period: 15,
				currency_code: 'USD',
				time_interval: 3,
				client_id: 1,
			}),
		path: 'recurring',
		method: 'POST',
		body: {
			recurring_schedule: {
				next_date: '2026-03-01',
				due_period: 15,
				currency_code: 'USD',
				time_interval: 3,
				client_id: 1,
			},
		},
		response: recurring,
	},
	{
		name: 'recurring.update',
		run: () => Recurring.update(makeCtx(), { id: 10, title: 'Q' }),
		path: 'recurring/10',
		method: 'PUT',
		body: { recurring_schedule: { title: 'Q' } },
		response: recurring,
	},
	{
		name: 'recurring.delete',
		run: () => Recurring.delete(makeCtx(), { id: 10 }),
		path: 'recurring/10',
		method: 'DELETE',
		response: {},
	},
	{
		name: 'staff.list',
		run: () => Staff.list(makeCtx(), {}),
		path: 'staff',
		response: { staff: [staff] },
	},
	{
		name: 'staff.get',
		run: () => Staff.get(makeCtx(), { id: 11 }),
		path: 'staff/11',
		response: staff,
	},
	{
		name: 'tasks.list',
		run: () => Tasks.list(makeCtx(), { page: 1, page_size: 25 }),
		path: 'tasks',
		query: { page: 1, page_size: 25 },
		response: paged('tasks', [task]),
	},
	{
		name: 'tasks.listForProject',
		run: () => Tasks.listForProject(makeCtx(), { project_id: 7 }),
		path: 'projects/7/tasks',
		query: unpaged,
		response: paged('tasks', [task]),
	},
	{
		name: 'tasks.get',
		run: () => Tasks.get(makeCtx(), { id: 12 }),
		path: 'tasks/12',
		response: task,
	},
	{
		name: 'tasks.create',
		run: () => Tasks.create(makeCtx(), { title: 'Ship it' }),
		path: 'task',
		method: 'POST',
		body: { task: { title: 'Ship it' } },
		response: task,
	},
	{
		name: 'tasks.update',
		run: () => Tasks.update(makeCtx(), { id: 12, complete: true }),
		path: 'tasks/12',
		method: 'PUT',
		body: { task: { complete: true } },
		response: { ...task, complete: true },
	},
	{
		name: 'tasks.delete',
		run: () => Tasks.delete(makeCtx(), { id: 12 }),
		path: 'tasks/12',
		method: 'DELETE',
		response: {},
	},
];

const registeredEndpointCount = [
	Clients,
	Contacts,
	Estimates,
	Expenses,
	Hours,
	Invoices,
	Leads,
	Payments,
	PaymentProfiles,
	Projects,
	Recurring,
	Staff,
	Tasks,
].reduce((count, group) => count + Object.keys(group).length, 0);

describe('Clientary endpoint operations', () => {
	it('covers every registered endpoint', () => {
		expect(ops).toHaveLength(registeredEndpointCount);
	});

	it.each(ops)('$name hits $path', async (op) => {
		mockRequest.mockResolvedValueOnce(op.response);
		await op.run();

		const extra: Record<string, unknown> = {};
		if (op.method) extra.method = op.method;
		if (op.body !== undefined) extra.body = op.body;
		if (op.query !== undefined) extra.query = op.query;

		if (Object.keys(extra).length === 0) {
			expect(mockRequest).toHaveBeenCalledWith(op.path, 'token', 'acme');
			return;
		}

		expect(mockRequest).toHaveBeenCalledWith(
			op.path,
			'token',
			'acme',
			expect.objectContaining(extra),
		);
	});
});
