import {
	ClientaryEndpointInputSchemas,
	ClientaryEndpointOutputSchemas,
} from './types';

// Endpoints call these schemas on the raw provider response at runtime (see
// the `.parse(response)` calls in each endpoints/<resource>.ts file). This
// proves that call has real teeth: a shape Clientary's API never returns
// gets rejected instead of silently trusted.
describe('runtime output validation rejects malformed provider responses', () => {
	it('accepts a well-formed clients list envelope', () => {
		const response = {
			page_count: 1,
			page_size: 25,
			total_count: 2,
			clients: [
				{ id: 1, name: 'Acme', number: 'C-001' },
				{ id: 2, name: 'Globex', city: 'Springfield' },
			],
		};
		expect(() =>
			ClientaryEndpointOutputSchemas.clientsList.parse(response),
		).not.toThrow();
	});

	it('rejects a clients list missing the clients array', () => {
		expect(() =>
			ClientaryEndpointOutputSchemas.clientsList.parse({
				page_count: 1,
				page_size: 25,
				total_count: 0,
			}),
		).toThrow();
	});

	it('rejects a client record without an id', () => {
		expect(() =>
			ClientaryEndpointOutputSchemas.clientsGet.parse({ name: 'No ID' }),
		).toThrow();
	});

	it('accepts extra unknown fields on a client record (loose parsing)', () => {
		expect(() =>
			ClientaryEndpointOutputSchemas.clientsGet.parse({
				id: 5,
				name: 'Acme',
				future_field: { nested: true },
			}),
		).not.toThrow();
	});

	it('accepts string-typed prices on estimate items (FlexNumber)', () => {
		expect(() =>
			ClientaryEndpointOutputSchemas.estimatesGet.parse({
				id: 10,
				date: '2026-01-15',
				status: 1,
				currency_code: 'USD',
				subtotal: 100,
				total_cost: 107,
				tax: 7,
				tax2: 0,
				tax3: 0,
				compound_tax: false,
				estimate_items: [{ id: 1, title: 'Design', price: '50', quantity: 1 }],
			}),
		).not.toThrow();
	});

	it('rejects an estimate missing required totals', () => {
		expect(() =>
			ClientaryEndpointOutputSchemas.estimatesGet.parse({
				id: 10,
				date: '2026-01-15',
			}),
		).toThrow();
	});

	it('accepts an invoice with payments and recurring_schedules', () => {
		expect(() =>
			ClientaryEndpointOutputSchemas.invoicesGet.parse({
				id: 20,
				date: '2026-02-01',
				status: 0,
				currency_code: 'USD',
				subtotal: 100,
				total_cost: 107,
				balance: 0,
				total_payments: 107,
				tax: 7,
				tax2: 0,
				tax3: 0,
				compound_tax: false,
				payments: [{ id: 1, amount: 107, received_on: '2026-02-02' }],
				recurring_schedules: [{ id: 3 }],
			}),
		).not.toThrow();
	});

	it('rejects a task response missing complete', () => {
		expect(() =>
			ClientaryEndpointOutputSchemas.tasksGet.parse({
				id: 30,
				title: 'Ship feature',
				created_at: '2026-01-01T00:00:00Z',
				updated_at: '2026-01-02T00:00:00Z',
			}),
		).toThrow();
	});

	it('accepts a delete response synthesized by the plugin', () => {
		expect(() =>
			ClientaryEndpointOutputSchemas.clientsDelete.parse({
				success: true,
				id: 7,
			}),
		).not.toThrow();
	});

	it('rejects a delete response that did not succeed', () => {
		expect(() =>
			ClientaryEndpointOutputSchemas.clientsDelete.parse({
				success: false,
				id: 7,
			}),
		).toThrow();
	});

	it('accepts a send response synthesized by the plugin', () => {
		expect(() =>
			ClientaryEndpointOutputSchemas.invoicesSend.parse({
				sent: true,
				id: 9,
			}),
		).not.toThrow();
	});
});

describe('input validation rejects malformed agent inputs', () => {
	it('requires a name when creating a client', () => {
		expect(() =>
			ClientaryEndpointInputSchemas.clientsCreate.parse({}),
		).toThrow();
		expect(() =>
			ClientaryEndpointInputSchemas.clientsCreate.parse({ name: 'Acme' }),
		).not.toThrow();
	});

	it('clamps page_size to a max of 100', () => {
		expect(() =>
			ClientaryEndpointInputSchemas.clientsList.parse({ page_size: 500 }),
		).toThrow();
	});

	it('accepts page and page_size on scoped list inputs', () => {
		expect(() =>
			ClientaryEndpointInputSchemas.contactsListForClient.parse({
				client_id: 3,
				page: 2,
				page_size: 10,
			}),
		).not.toThrow();
		expect(() =>
			ClientaryEndpointInputSchemas.tasksList.parse({
				page: 1,
				page_size: 25,
			}),
		).not.toThrow();
	});

	it('clamps page_size on scoped lists to a max of 100', () => {
		expect(() =>
			ClientaryEndpointInputSchemas.contactsListForClient.parse({
				client_id: 3,
				page_size: 500,
			}),
		).toThrow();
		expect(() =>
			ClientaryEndpointInputSchemas.tasksList.parse({ page_size: 500 }),
		).toThrow();
	});

	it('requires positive integer ids for get operations', () => {
		expect(() =>
			ClientaryEndpointInputSchemas.clientsGet.parse({ id: 0 }),
		).toThrow();
		expect(() =>
			ClientaryEndpointInputSchemas.clientsGet.parse({ id: 12 }),
		).not.toThrow();
	});

	it('requires at least one recipient to send an estimate', () => {
		expect(() =>
			ClientaryEndpointInputSchemas.estimatesSend.parse({
				id: 1,
				recipients: [],
			}),
		).toThrow();
		expect(() =>
			ClientaryEndpointInputSchemas.estimatesSend.parse({
				id: 1,
				recipients: ['billing@acme.com'],
			}),
		).not.toThrow();
	});

	it('rejects unknown fields when updating a task (strict schema)', () => {
		expect(() =>
			ClientaryEndpointInputSchemas.tasksUpdate.parse({
				id: 1,
				mystery_field: 'nope',
			}),
		).toThrow();
		expect(() =>
			ClientaryEndpointInputSchemas.tasksUpdate.parse({
				id: 1,
				complete: true,
			}),
		).not.toThrow();
	});

	it('requires a project_id and title when creating an hours entry', () => {
		expect(() =>
			ClientaryEndpointInputSchemas.hoursCreate.parse({ hours: 8 }),
		).toThrow();
		expect(() =>
			ClientaryEndpointInputSchemas.hoursCreate.parse({
				project_id: 1,
				hours: 8,
				title: 'Work',
			}),
		).not.toThrow();
	});
});
