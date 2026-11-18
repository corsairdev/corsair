import type { QuadernoContext } from './index';
import { quaderno } from './index';
import {
	authorizationFixture,
	contactFixture,
	contactsFixture,
	invoiceFixture,
	invoicesFixture,
	jurisdictionsFixture,
	paymentFixture,
	pingFixture,
	productFixture,
	productsFixture,
	taxCodeFixture,
	webhookFixture,
} from './test-fixtures';

const API_KEY = 'sk_live_test';
const ACCOUNT = 'acme-123456';

let fetchMock: jest.SpyInstance;

// unknown: a response body is arbitrary JSON until a schema reads it.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(body === undefined ? null : JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

type Logged = { accountIdRequested: boolean };

function makeContext(logged: Logged) {
	// unknown: the endpoints read `key`, `options` and `keys.get_account_name`,
	// and the log path reads `$getAccountId` and `database`. The log writer
	// tolerates a missing database, so only the account lookup is asserted here.
	const ctx = {
		key: API_KEY,
		options: { account: ACCOUNT },
		keys: { get_account_name: async () => ACCOUNT },
		$getAccountId: jest.fn(async () => {
			logged.accountIdRequested = true;
			return 'account-1';
		}),
	} as const;
	// unknown: the endpoint code reads only `key`, `options` and
	// `keys.get_account_name`, plus the log path's `$getAccountId`. A full
	// CorsairPluginContext also carries db, hooks and the bound endpoints, which
	// these calls never reach; integration.test.ts runs the same endpoints against
	// a real context.
	return ctx as unknown as QuadernoContext;
}

function lastCall() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	return {
		url,
		parsed: new URL(url),
		init,
		headers: new Headers(init.headers),
		body: init.body ? JSON.parse(String(init.body)) : undefined,
	};
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
	jest.restoreAllMocks();
});

const plugin = quaderno({ key: API_KEY, account: ACCOUNT });
// `CorsairPlugin.endpoints` is optional on the type; this plugin always sets it.
const endpoints = plugin.endpoints as NonNullable<typeof plugin.endpoints>;

async function run<In, Out>(
	input: In,
	fn: (ctx: QuadernoContext, input: In) => Promise<Out>,
) {
	const logged: Logged = { accountIdRequested: false };
	const ctx = makeContext(logged);
	const result = await fn(ctx, input);
	return { result, logged };
}

describe('credential and account routes', () => {
	it('ping GETs /ping on the account host', async () => {
		respond(pingFixture);

		const { result, logged } = await run({}, endpoints.ping);

		const { parsed, init, headers } = lastCall();
		expect(init.method).toBe('GET');
		expect(parsed.origin).toBe('https://acme-123456.quadernoapp.com');
		expect(parsed.pathname).toBe('/api/ping');
		expect(headers.get('authorization')).toContain('Basic ');
		expect(result.status).toBe('OK');
		expect(logged.accountIdRequested).toBe(true);
	});

	it('authorization GETs /authorization and reports the account href', async () => {
		respond(authorizationFixture);

		const { result } = await run({}, endpoints.authorization);

		expect(lastCall().parsed.pathname).toBe('/api/authorization');
		expect(result.identity.href).toContain('example-000000');
	});
});

describe('contacts', () => {
	it('contacts.list GETs /contacts with search and paging', async () => {
		respond(contactsFixture);

		const { result } = await run(
			{ q: 'corsair', limit: 10, created_before: 50 },
			endpoints.contacts.list,
		);

		const { parsed, init } = lastCall();
		expect(init.method).toBe('GET');
		expect(parsed.pathname).toBe('/api/contacts');
		expect(parsed.searchParams.get('q')).toBe('corsair');
		expect(parsed.searchParams.get('limit')).toBe('10');
		expect(parsed.searchParams.get('created_before')).toBe('50');
		expect(result.contacts).toHaveLength(1);
	});

	it('contacts.list derives no cursor from a short page', async () => {
		respond(contactsFixture);

		const { result } = await run({ limit: 25 }, endpoints.contacts.list);

		// One row for a page of 25 means it is the last page.
		expect(result.next_created_before).toBeNull();
	});

	it('contacts.create POSTs a JSON body and wraps the row', async () => {
		respond(contactFixture, 201);

		const { result } = await run(
			{ email: 'probe@example.com', first_name: 'Corsair', country: 'US' },
			endpoints.contacts.create,
		);

		const { parsed, init, body } = lastCall();
		expect(init.method).toBe('POST');
		expect(parsed.pathname).toBe('/api/contacts');
		expect(body.email).toBe('probe@example.com');
		expect(result.contact.id).toBe(78395726);
	});

	it('contacts.get GETs one contact by id', async () => {
		respond(contactFixture);

		const { result } = await run({ id: 78395726 }, endpoints.contacts.get);

		expect(lastCall().parsed.pathname).toBe('/api/contacts/78395726');
		expect(result.contact.full_name).toBe('Corsair Probe');
	});

	it('contacts.update PUTs the fields without the id in the body', async () => {
		respond(contactFixture);

		await run(
			{ id: 78395726, first_name: 'Renamed' },
			endpoints.contacts.update,
		);

		const { parsed, init, body } = lastCall();
		expect(init.method).toBe('PUT');
		expect(parsed.pathname).toBe('/api/contacts/78395726');
		expect(body.first_name).toBe('Renamed');
		expect(body).not.toHaveProperty('id');
	});

	it('contacts.delete sends a bodyless DELETE and reports success', async () => {
		respond(undefined, 204);

		const { result } = await run({ id: 78395726 }, endpoints.contacts.delete);

		const { init, body } = lastCall();
		expect(init.method).toBe('DELETE');
		expect(body).toBeUndefined();
		expect(result.deleted).toBe(true);
	});
});

describe('products', () => {
	it('products.list GETs the /items route', async () => {
		respond(productsFixture);

		const { result } = await run({ limit: 5 }, endpoints.products.list);

		expect(lastCall().parsed.pathname).toBe('/api/items');
		expect(result.products).toHaveLength(1);
	});

	it('products.create POSTs to /items with the required fields', async () => {
		respond(productFixture, 201);

		const { result } = await run(
			{
				name: 'Corsair Probe Item',
				code: 'PROBE-1',
				unit_cost: '10.00',
				product_type: 'service',
				kind: 'one_off',
			},
			endpoints.products.create,
		);

		const { parsed, init, body } = lastCall();
		expect(init.method).toBe('POST');
		expect(parsed.pathname).toBe('/api/items');
		expect(body.unit_cost).toBe('10.00');
		expect(result.product.id).toBe(321034);
	});

	it('products.get GETs one item', async () => {
		respond(productFixture);

		await run({ id: 321034 }, endpoints.products.get);

		expect(lastCall().parsed.pathname).toBe('/api/items/321034');
	});

	it('products.update PUTs without the id in the body', async () => {
		respond(productFixture);

		await run(
			{ id: 321034, name: 'Renamed', code: 'X', unit_cost: '5' },
			endpoints.products.update,
		);

		const { init, body } = lastCall();
		expect(init.method).toBe('PUT');
		expect(body).not.toHaveProperty('id');
	});

	it('products.delete sends a bodyless DELETE', async () => {
		respond(undefined, 204);

		const { result } = await run({ id: 321034 }, endpoints.products.delete);

		expect(lastCall().init.method).toBe('DELETE');
		expect(result.deleted).toBe(true);
	});
});

describe('invoices', () => {
	it('invoices.list GETs /invoices with the documented filters', async () => {
		respond(invoicesFixture);

		await run(
			{ state: 'outstanding', contact: 7, limit: 10 },
			endpoints.invoices.list,
		);

		const { parsed } = lastCall();
		expect(parsed.pathname).toBe('/api/invoices');
		expect(parsed.searchParams.get('state')).toBe('outstanding');
		expect(parsed.searchParams.get('contact')).toBe('7');
	});

	it('invoices.create POSTs the contact, lines and payment method', async () => {
		respond(invoiceFixture, 201);

		const { result } = await run(
			{
				contact: { id: 78395726 },
				currency: 'USD',
				items: [{ description: 'Probe item', quantity: 1, unit_price: 10 }],
				payment_method: 'cash',
			},
			endpoints.invoices.create,
		);

		const { parsed, init, body } = lastCall();
		expect(init.method).toBe('POST');
		expect(parsed.pathname).toBe('/api/invoices');
		expect(body.contact).toEqual({ id: 78395726 });
		expect(body.items).toHaveLength(1);
		expect(body.payment_method).toBe('cash');
		expect(result.invoice.number).toBe('I2026-00001');
	});

	it('invoices.get GETs one invoice', async () => {
		respond(invoiceFixture);

		await run({ id: 181235103 }, endpoints.invoices.get);

		expect(lastCall().parsed.pathname).toBe('/api/invoices/181235103');
	});

	/**
	 * Voiding is the only way to reverse an invoice: Quaderno refuses DELETE
	 * outright because tax law requires keeping the record.
	 */
	it('invoices.void PUTs the required reason', async () => {
		respond({ ...invoiceFixture, state: 'paid' });

		await run(
			{ id: 181235103, void_reason: 'Probe cleanup' },
			endpoints.invoices.void,
		);

		const { parsed, init, body } = lastCall();
		expect(init.method).toBe('PUT');
		expect(parsed.pathname).toBe('/api/invoices/181235103/void');
		expect(body.void_reason).toBe('Probe cleanup');
	});

	it('invoices.markUncollectible PUTs the action route', async () => {
		respond(invoiceFixture);

		await run({ id: 181235103 }, endpoints.invoices.markUncollectible);

		expect(lastCall().parsed.pathname).toBe(
			'/api/invoices/181235103/mark_uncollectible',
		);
	});

	it('invoices.recordPayment POSTs and returns the payment it created', async () => {
		respond(paymentFixture, 201);

		const { result } = await run(
			{
				id: 181235103,
				date: '2026-11-10',
				amount: 10,
				payment_method: 'cash',
			},
			endpoints.invoices.recordPayment,
		);

		const { parsed, init, body } = lastCall();
		expect(init.method).toBe('POST');
		expect(parsed.pathname).toBe('/api/invoices/181235103/payments');
		expect(body.amount).toBe(10);
		// The route answers the payment, not the invoice.
		expect(result.payment.id).toBe(171741922);
		expect(result.payment.payment_method).toBe('cash');
	});

	it('invoices.update PUTs without the id in the body', async () => {
		respond(invoiceFixture);

		await run(
			{
				id: 181235103,
				contact: { id: 78395726 },
				items: [{ description: 'Probe item', unit_price: 10 }],
			},
			endpoints.invoices.update,
		);

		const { parsed, init, body } = lastCall();
		expect(init.method).toBe('PUT');
		expect(parsed.pathname).toBe('/api/invoices/181235103');
		expect(body).not.toHaveProperty('id');
		expect(body.contact).toEqual({ id: 78395726 });
	});

	it('invoices.deliver sends a GET, with no body and no query', async () => {
		// The reference documents a 200 with no content for every deliver route.
		respond(undefined);

		const { result } = await run({ id: 181235103 }, endpoints.invoices.deliver);

		const { parsed, init, body } = lastCall();
		// A GET that sends email, which is why it is a write in the metadata.
		expect(init.method).toBe('GET');
		expect(parsed.pathname).toBe('/api/invoices/181235103/deliver');
		expect(parsed.search).toBe('');
		expect(body).toBeUndefined();
		// The email has gone by now, so an empty answer must not be an error: a
		// throw here would make the caller deliver a second time.
		expect(result).toEqual({ delivered: true });
	});
});

describe('receipts, credits and proformas', () => {
	it('receipts.list GETs /receipts', async () => {
		respond([invoiceFixture]);

		await run({ limit: 5 }, endpoints.receipts.list);

		expect(lastCall().parsed.pathname).toBe('/api/receipts');
	});

	it('receipts.create POSTs /receipts with the payment method', async () => {
		respond(invoiceFixture, 201);

		await run(
			{
				contact: { id: 1 },
				items: [{ description: 'x', unit_price: 1 }],
				payment_method: 'cash',
			},
			endpoints.receipts.create,
		);

		const { parsed, init, body } = lastCall();
		expect(init.method).toBe('POST');
		expect(parsed.pathname).toBe('/api/receipts');
		// Required by the API: a receipt records a sale that is already paid.
		expect(body.payment_method).toBe('cash');
	});

	it('receipts.create refuses a receipt with no payment method', async () => {
		await expect(
			run(
				// unknown: a deliberately incomplete input, to reach the schema.
				{
					contact: { id: 1 },
					items: [{ description: 'x', unit_price: 1 }],
				} as unknown as Parameters<typeof endpoints.receipts.create>[1],
				endpoints.receipts.create,
			),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('receipts.get GETs one receipt by id', async () => {
		respond(invoiceFixture);

		const { result } = await run({ id: 181235200 }, endpoints.receipts.get);

		expect(lastCall().parsed.pathname).toBe('/api/receipts/181235200');
		expect(result.receipt.id).toBe(invoiceFixture.id);
	});

	it('receipts.deliver GETs the deliver route and sends no body', async () => {
		respond(undefined);

		const { result } = await run({ id: 181235200 }, endpoints.receipts.deliver);

		const { parsed, init, body } = lastCall();
		expect(init.method).toBe('GET');
		expect(parsed.pathname).toBe('/api/receipts/181235200/deliver');
		expect(parsed.search).toBe('');
		expect(body).toBeUndefined();
		expect(result).toEqual({ delivered: true });
	});

	it('receipts.void PUTs the void route with a reason', async () => {
		respond(invoiceFixture);

		await run({ id: 5, void_reason: 'Probe' }, endpoints.receipts.void);

		const { parsed, body } = lastCall();
		expect(parsed.pathname).toBe('/api/receipts/5/void');
		expect(body.void_reason).toBe('Probe');
	});

	it('credits.list GETs /credits', async () => {
		respond([invoiceFixture]);

		await run({ limit: 5 }, endpoints.credits.list);

		expect(lastCall().parsed.pathname).toBe('/api/credits');
	});

	it('credits.create POSTs the invoice being credited', async () => {
		respond(invoiceFixture, 201);

		await run(
			{ invoice_id: 181235103, payment_method: 'cash', credited_amount: 5.5 },
			endpoints.credits.create,
		);

		const { parsed, init, body } = lastCall();
		expect(init.method).toBe('POST');
		expect(parsed.pathname).toBe('/api/credits');
		// The documented body: a credit note is issued against an invoice, not
		// built from a contact and line items.
		expect(body).toEqual({
			invoice_id: 181235103,
			payment_method: 'cash',
			credited_amount: 5.5,
		});
	});

	it('credits.create needs only the invoice id', async () => {
		respond(invoiceFixture, 201);

		await run({ invoice_id: 181235103 }, endpoints.credits.create);

		expect(lastCall().body).toEqual({ invoice_id: 181235103 });
	});

	it('credits.get GETs one credit note', async () => {
		respond(invoiceFixture);

		await run({ id: 181235112 }, endpoints.credits.get);

		expect(lastCall().parsed.pathname).toBe('/api/credits/181235112');
	});

	it('credits.update PUTs an administrative field on its own', async () => {
		respond(invoiceFixture);

		// A credit note is immutable once issued: only notes, payment details and
		// tags can change, so none of the document fields may be required.
		await run(
			{ id: 181235112, notes: 'Refund agreed by phone' },
			endpoints.credits.update,
		);

		const { parsed, init, body } = lastCall();
		expect(init.method).toBe('PUT');
		expect(parsed.pathname).toBe('/api/credits/181235112');
		expect(body).toEqual({ notes: 'Refund agreed by phone' });
	});

	it('credits.void PUTs the void route with a reason', async () => {
		respond(invoiceFixture);

		await run({ id: 181235112, void_reason: 'Probe' }, endpoints.credits.void);

		const { parsed, body } = lastCall();
		expect(parsed.pathname).toBe('/api/credits/181235112/void');
		expect(body.void_reason).toBe('Probe');
	});

	it('credits.deliver GETs the deliver route', async () => {
		respond(undefined);

		const { result } = await run({ id: 181235112 }, endpoints.credits.deliver);

		const { parsed, init } = lastCall();
		expect(init.method).toBe('GET');
		expect(parsed.pathname).toBe('/api/credits/181235112/deliver');
		expect(result).toEqual({ delivered: true });
	});

	it('proformas.list GETs /proformas', async () => {
		respond([invoiceFixture]);

		await run({ limit: 5 }, endpoints.proformas.list);

		expect(lastCall().parsed.pathname).toBe('/api/proformas');
	});

	it('proformas.create POSTs /proformas', async () => {
		respond(invoiceFixture, 201);

		const { result } = await run(
			{ contact: { id: 1 }, items: [{ description: 'x', unit_price: 1 }] },
			endpoints.proformas.create,
		);

		const { parsed, init } = lastCall();
		expect(init.method).toBe('POST');
		expect(parsed.pathname).toBe('/api/proformas');
		expect(result.proforma.id).toBeDefined();
	});

	it('proformas.get GETs one proforma', async () => {
		respond(invoiceFixture);

		await run({ id: 181235300 }, endpoints.proformas.get);

		expect(lastCall().parsed.pathname).toBe('/api/proformas/181235300');
	});

	it('proformas.update PUTs without the id in the body', async () => {
		respond(invoiceFixture);

		await run(
			{
				id: 181235300,
				contact: { id: 1 },
				items: [{ description: 'x', unit_price: 2 }],
			},
			endpoints.proformas.update,
		);

		const { parsed, init, body } = lastCall();
		expect(init.method).toBe('PUT');
		expect(parsed.pathname).toBe('/api/proformas/181235300');
		expect(body).not.toHaveProperty('id');
	});

	it('proformas action routes PUT the right segment', async () => {
		for (const [fn, action] of [
			[endpoints.proformas.accept, 'accept'],
			[endpoints.proformas.decline, 'decline'],
			[endpoints.proformas.revert, 'revert'],
		] as const) {
			respond(invoiceFixture);
			await run({ id: 9 }, fn);
			const { parsed, init } = lastCall();
			expect(init.method).toBe('PUT');
			expect(parsed.pathname).toBe(`/api/proformas/9/${action}`);
		}
	});

	it('proformas.convert returns the new invoice, not the proforma', async () => {
		// The reference answers 201 with the invoice that was issued.
		respond(invoiceFixture, 201);

		const { result } = await run({ id: 9 }, endpoints.proformas.convert);

		const { parsed, init } = lastCall();
		expect(init.method).toBe('PUT');
		expect(parsed.pathname).toBe('/api/proformas/9/convert');
		expect(result.invoice.id).toBe(invoiceFixture.id);
		expect(result.invoice.number).toBe('I2026-00001');
		expect(result).not.toHaveProperty('proforma');
	});

	it('proformas.update changes one field without resending the lines', async () => {
		respond(invoiceFixture);

		await run(
			{ id: 181235300, notes: 'Valid for 30 days' },
			endpoints.proformas.update,
		);

		expect(lastCall().body).toEqual({ notes: 'Valid for 30 days' });
	});

	it('proformas.deliver GETs the deliver route', async () => {
		respond(undefined);

		const { result } = await run({ id: 9 }, endpoints.proformas.deliver);

		expect(lastCall().init.method).toBe('GET');
		expect(lastCall().parsed.pathname).toBe('/api/proformas/9/deliver');
		expect(result).toEqual({ delivered: true });
	});
});

describe('tax routes', () => {
	it('taxRates.calculate GETs the calculate route with the required pair', async () => {
		respond({ country: 'IN', rate: 0, status: 'non_taxable' });

		await run(
			{ to_country: 'US', tax_code: 'standard', amount: 10 },
			endpoints.taxRates.calculate,
		);

		const { parsed, init } = lastCall();
		expect(init.method).toBe('GET');
		expect(parsed.pathname).toBe('/api/tax_rates/calculate');
		expect(parsed.searchParams.get('to_country')).toBe('US');
		expect(parsed.searchParams.get('tax_code')).toBe('standard');
		expect(parsed.searchParams.get('amount')).toBe('10');
	});

	it('taxIds.validate GETs the validate route', async () => {
		respond({ valid: true });

		await run(
			{ tax_id: 'GB123456789', country: 'GB' },
			endpoints.taxIds.validate,
		);

		const { parsed } = lastCall();
		expect(parsed.pathname).toBe('/api/tax_ids/validate');
		expect(parsed.searchParams.get('tax_id')).toBe('GB123456789');
	});

	it('taxCodes.list GETs /tax_codes', async () => {
		respond([{ id: 'standard', name: 'Generally taxable' }]);

		const { result } = await run({}, endpoints.taxCodes.list);

		expect(lastCall().parsed.pathname).toBe('/api/tax_codes');
		// The id is a slug string, not a number.
		expect(result.tax_codes[0]?.id).toBe('standard');
	});

	it('taxCodes.get accepts a slug id in the path', async () => {
		respond(taxCodeFixture);

		await run({ id: 'standard' }, endpoints.taxCodes.get);

		expect(lastCall().parsed.pathname).toBe('/api/tax_codes/standard');
	});

	it('jurisdictions.list GETs /jurisdictions with no limit offered', async () => {
		respond(jurisdictionsFixture);

		const { result } = await run({}, endpoints.jurisdictions.list);

		const { parsed } = lastCall();
		expect(parsed.pathname).toBe('/api/jurisdictions');
		// This route ignores `limit`, so the input has no such field.
		expect(parsed.searchParams.has('limit')).toBe(false);
		expect(result.jurisdictions).toHaveLength(2);
	});

	it('jurisdictions.get GETs one by id', async () => {
		respond({ jurisdiction: { id: 1, country: 'IN' } });

		await run({ id: 1 }, endpoints.jurisdictions.get);

		expect(lastCall().parsed.pathname).toBe('/api/jurisdictions/1');
	});
});

describe('transactions and webhooks', () => {
	it('transactions.create POSTs the documented transaction body', async () => {
		respond(invoiceFixture, 201);

		await run(
			{
				type: 'sale',
				customer: { id: 1 },
				items: [{ description: 'x', amount: 5 }],
				payment: { method: 'cash' },
				date: '2026-11-10',
				tags: 'probe,live',
			},
			endpoints.transactions.create,
		);

		const { parsed, init, body } = lastCall();
		expect(init.method).toBe('POST');
		expect(parsed.pathname).toBe('/api/transactions');
		// Not an invoice body: the buyer is `customer`, a line carries `amount`,
		// and the payment is a nested, required object.
		expect(body).toEqual({
			type: 'sale',
			customer: { id: 1 },
			items: [{ description: 'x', amount: 5 }],
			payment: { method: 'cash' },
			date: '2026-11-10',
			tags: 'probe,live',
		});
		expect(body).not.toHaveProperty('contact');
		expect(body).not.toHaveProperty('payment_method');
	});

	it('transactions.create refuses a transaction with no payment', async () => {
		await expect(
			run(
				// unknown: a deliberately incomplete input, to reach the schema.
				{
					customer: { id: 1 },
					items: [{ description: 'x', amount: 5 }],
				} as unknown as Parameters<typeof endpoints.transactions.create>[1],
				endpoints.transactions.create,
			),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('webhooks.list GETs /webhooks', async () => {
		respond([]);

		const { result } = await run({}, endpoints.webhooks.list);

		expect(lastCall().parsed.pathname).toBe('/api/webhooks');
		expect(result.webhooks).toEqual([]);
	});

	it('webhooks.list reads a documented row and drops the signing secret', async () => {
		respond([webhookFixture]);

		const { result } = await run({}, endpoints.webhooks.list);

		// `created_at` is a date-time string on this resource, and the events are
		// the array `events_types`.
		expect(result.webhooks).toHaveLength(1);
		expect(result.webhooks[0]?.events_types).toEqual([
			'invoice.created',
			'credit.created',
		]);
		expect(result.webhooks[0]?.created_at).toBe('2026-11-10T09:00:00Z');
		// `auth_key` signs the deliveries: it must not reach the caller.
		expect(JSON.stringify(result)).not.toContain('example-signing-secret');
		expect(result.webhooks[0]).not.toHaveProperty('auth_key');
	});
});
