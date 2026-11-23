import { logEventFromContext } from 'corsair/core';
import {
	Administrations,
	Contacts,
	Products,
	Projects,
	SalesInvoices,
	TimeEntries,
} from './endpoints';
import type { MoneybirdEndpointOutputSchemas as Outputs } from './endpoints/types';
import {
	administration,
	contact,
	product,
	project,
	salesInvoice,
	timeEntry,
	unauthorized,
	validationErrors,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'mb-token-123';

const ctx = {
	key: API_KEY,
	options: { administrationId: '107693607045039116' },
	keys: { get_administration_id: jest.fn().mockResolvedValue(null) },
};

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type,
// so the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context only carries what the endpoints read.
	return endpoint(ctx as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or an empty delete answer.
function respond(body: unknown, status = 200) {
	const payload = typeof body === 'string' ? body : JSON.stringify(body);
	fetchMock.mockResolvedValueOnce(
		new Response(payload, {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('administrations.list', () => {
	it('GETs above the administration scope and wraps the array', async () => {
		respond([administration]);

		const result = await invoke(Administrations.list, {});

		expect(lastRequest()).toMatchObject({
			origin: 'https://moneybird.com',
			path: '/api/v2/administrations.json',
			method: 'GET',
		});
		expect(new Headers(lastRequest().headers).get('authorization')).toBe(
			`Bearer ${API_KEY}`,
		);
		expect(result).toEqual({ administrations: [administration] });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'moneybird.administrations.list',
			{ administrations: 1 },
			'completed',
		);
	});
});

describe('contacts', () => {
	it('lists with pagination and derives next_page on a full page', async () => {
		respond(Array(50).fill(contact));

		const result = (await invoke(Contacts.list, { page: 2 })) as ReturnType<
			typeof Outputs.contactsList.parse
		>;

		expect(lastRequest().query).toEqual({ page: '2' });
		expect(result).toMatchObject({ next_page: 3 });
		expect(result.items).toHaveLength(50);
	});

	it('derives next_page from per_page when given', async () => {
		respond([contact, { ...contact, id: '387172987357643189' }]);

		const result = (await invoke(Contacts.list, {
			page: 1,
			per_page: 2,
		})) as ReturnType<typeof Outputs.contactsList.parse>;

		expect(lastRequest().query).toEqual({ page: '1', per_page: '2' });
		expect(result).toMatchObject({ next_page: 2 });
	});

	it('creates with the contact wrapper', async () => {
		respond(contact, 201);

		const result = await invoke(Contacts.create, {
			company_name: 'Beachy',
			firstname: 'Jana',
			lastname: 'Berger',
			country: 'NL',
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/api/v2/107693607045039116/contacts.json',
		});
		expect(lastRequest().body).toEqual({
			contact: {
				company_name: 'Beachy',
				firstname: 'Jana',
				lastname: 'Berger',
				country: 'NL',
			},
		});
		expect(result).toEqual(contact);
	});

	it('updates with PATCH and the wrapper', async () => {
		respond(contact);

		await invoke(Contacts.update, {
			id: '387172987357643188',
			city: 'Utrecht',
		});

		expect(lastRequest()).toMatchObject({
			method: 'PATCH',
			path: '/api/v2/107693607045039116/contacts/387172987357643188.json',
		});
		expect(lastRequest().body).toEqual({ contact: { city: 'Utrecht' } });
	});

	it('deletes and accepts the 204 empty body', async () => {
		respond('');

		await expect(
			invoke(Contacts.remove, { id: '387172987357643188' }),
		).resolves.toEqual({ success: true, id: '387172987357643188' });
		expect(lastRequest().method).toBe('DELETE');
	});

	it('rejects a country code that is not two letters', async () => {
		await expect(
			invoke(Contacts.create, { country: 'Netherlands' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('salesInvoices', () => {
	it('lists with the filter passthrough', async () => {
		respond([salesInvoice]);

		const result = await invoke(SalesInvoices.list, {
			filter: 'state:open|paid',
			per_page: 100,
		});

		expect(lastRequest().query).toEqual({
			filter: 'state:open|paid',
			per_page: '100',
		});
		expect(result).toEqual({ items: [salesInvoice], next_page: null });
	});

	it('creates with the sales_invoice wrapper and lines', async () => {
		respond(salesInvoice, 201);

		const result = await invoke(SalesInvoices.create, {
			contact_id: '387172987357643188',
			invoice_date: '2026-04-01',
			details_attributes: [
				{
					description: 'Project management',
					price_per_unit: 1000,
					quantity: 1,
				},
			],
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/api/v2/107693607045039116/sales_invoices.json',
		});
		expect(lastRequest().body).toEqual({
			sales_invoice: {
				contact_id: '387172987357643188',
				invoice_date: '2026-04-01',
				due_date: undefined,
				workflow_id: undefined,
				reference: undefined,
				currency: undefined,
				prices_are_incl_tax: undefined,
				discount: undefined,
				details_attributes: [
					{
						description: 'Project management',
						price_per_unit: 1000,
						quantity: 1,
						tax_rate_id: undefined,
						ledger_account_id: undefined,
						unit: undefined,
					},
				],
			},
		});
		expect(result).toEqual(salesInvoice);
	});

	it('sends with the sales_invoice_sending wrapper', async () => {
		respond({ ...salesInvoice, state: 'sent' });

		const result = (await invoke(SalesInvoices.send, {
			id: '437485325512000001',
			delivery_method: 'Email',
		})) as ReturnType<typeof Outputs.salesInvoicesSend.parse>;

		expect(lastRequest()).toMatchObject({
			method: 'PATCH',
			path: '/api/v2/107693607045039116/sales_invoices/437485325512000001/send_invoice.json',
		});
		expect(lastRequest().body).toEqual({
			sales_invoice_sending: {
				sending_scheduled: undefined,
				invoice_date: undefined,
				delivery_method: 'Email',
				email: undefined,
				message: undefined,
			},
		});
		expect(result.state).toBe('sent');
	});

	it('requires invoice_date when sending is scheduled', async () => {
		await expect(
			invoke(SalesInvoices.send, {
				id: '437485325512000001',
				sending_scheduled: true,
			}),
		).rejects.toThrow('invoice_date is required');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('deletes and accepts the 204 empty body', async () => {
		respond('');

		await expect(
			invoke(SalesInvoices.remove, { id: '437485325512000001' }),
		).resolves.toEqual({ success: true, id: '437485325512000001' });
	});
});

describe('timeEntries', () => {
	it('creates with the time_entry wrapper', async () => {
		respond(timeEntry, 201);

		const result = await invoke(TimeEntries.create, {
			project_id: '1234567890',
			started_at: '2026-04-09T09:00:00.000Z',
			ended_at: '2026-04-09T10:30:00.000Z',
			description: 'Kickoff call',
			billable: true,
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/api/v2/107693607045039116/time_entries.json',
		});
		expect(lastRequest().body).toEqual({
			time_entry: {
				project_id: '1234567890',
				user_id: undefined,
				started_at: '2026-04-09T09:00:00.000Z',
				ended_at: '2026-04-09T10:30:00.000Z',
				description: 'Kickoff call',
				billable: true,
			},
		});
		expect(result).toEqual(timeEntry);
	});

	it('rejects a malformed date filter', async () => {
		// The filter is a passthrough string; the schema accepts it.
		respond([timeEntry]);
		await expect(
			invoke(TimeEntries.list, { filter: 'period:this_year' }),
		).resolves.toBeDefined();
	});
});

describe('products', () => {
	it('creates with the product wrapper', async () => {
		respond(product, 201);

		await invoke(Products.create, {
			description: 'Consulting hour',
			price: 120,
			tax_rate_id: '362485010665400000',
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/api/v2/107693607045039116/products.json',
		});
		expect(lastRequest().body).toEqual({
			product: {
				description: 'Consulting hour',
				title: undefined,
				identifier: undefined,
				price: 120,
				currency: undefined,
				tax_rate_id: '362485010665400000',
				ledger_account_id: undefined,
				frequency: undefined,
				frequency_type: undefined,
			},
		});
	});

	it('rejects an empty description on create', async () => {
		await expect(
			invoke(Products.create, { description: '', price: 10 }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('projects', () => {
	it('creates with the project wrapper and updates', async () => {
		respond(project, 201);

		await invoke(Projects.create, { name: 'Website Relaunch', budget: 50000 });

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/api/v2/107693607045039116/projects.json',
		});
		expect(lastRequest().body).toEqual({
			project: { name: 'Website Relaunch', budget: 50000 },
		});

		respond(project);
		await invoke(Projects.update, { id: '1234567890', budget: 60000 });
		expect(lastRequest()).toMatchObject({
			method: 'PATCH',
			path: '/api/v2/107693607045039116/projects/1234567890.json',
		});
		expect(lastRequest().body).toEqual({ project: { budget: 60000 } });
	});

	it('deletes and accepts the 204 empty body', async () => {
		respond('');

		await expect(
			invoke(Projects.remove, { id: '1234567890' }),
		).resolves.toEqual({ success: true, id: '1234567890' });
	});
});

describe('error handling', () => {
	it('surfaces the 401 error field on the error object', async () => {
		respond(unauthorized, 401);

		const error = await invoke(Contacts.list, {}).catch(
			// unknown: a promise can reject with any value, so the rejection
			// reason has no static type; the assertions narrow it.
			(caught: unknown) => caught,
		);

		expect(error).toMatchObject({ status: 401, code: 'access token invalid' });
		expect((error as { message: string }).message).toContain(
			'access token invalid',
		);
	});

	it('surfaces 422 field errors in the message', async () => {
		respond(validationErrors, 422);

		const error = await invoke(Projects.create, {}).catch(
			// unknown: a promise can reject with any value, so the rejection
			// reason has no static type; the assertions narrow it.
			(caught: unknown) => caught,
		);

		expect(error).toMatchObject({ status: 422 });
		expect((error as { message: string }).message).toContain("can't be blank");
	});

	it('rejects a malformed list body instead of returning an empty page', async () => {
		respond('<html>nope</html>');

		await expect(invoke(Contacts.list, {})).rejects.toThrow('no array');
	});
});
