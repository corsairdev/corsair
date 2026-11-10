import * as Catalog from './endpoints/catalog';
import * as Customers from './endpoints/customers';
import * as Tickets from './endpoints/tickets';
import {
	CONTACT_PAGE,
	CUSTOMER,
	CUSTOMER_ID,
	CUSTOMER_PAGE,
	CUSTOMER_PAGE_MORE,
	INVOICE,
	INVOICE_ID,
	INVOICE_PAGE,
	PRODUCT,
	PRODUCT_ID,
	PRODUCT_PAGE,
	TICKET,
	TICKET_ID,
	TICKET_PAGE,
	VENDOR_PAGE,
} from './test-fixtures';
import { invoke, lastRequest, respond, spyOnFetch } from './test-support';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = spyOnFetch();
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('the account host', () => {
	it('sends every call to the account subdomain', async () => {
		respond(fetchMock, CUSTOMER_PAGE);

		await invoke(Customers.list, {}, 'northwind');

		const request = lastRequest(fetchMock);
		expect(request.origin).toBe('https://northwind.repairshopr.com');
		expect(request.path).toBe('/api/v1/customers');
	});

	it('reads the stored subdomain when the plugin was given none', async () => {
		respond(fetchMock, CUSTOMER_PAGE);

		// The fixture's key manager returns the same value, so this exercises the
		// fallback path rather than the inline option.
		await invoke(Customers.list, {}, 'stored-tenant');

		expect(lastRequest(fetchMock).origin).toBe(
			'https://stored-tenant.repairshopr.com',
		);
	});

	it('fails before sending when the subdomain is missing', async () => {
		const error = await invoke(Customers.list, {}, '').catch(
			(caught: Error) => caught,
		);

		expect(error).toBeInstanceOf(Error);
		expect((error as Error).message).toContain('auth-missing:repairshopr');
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('customers.list', () => {
	it('sends the filters and derives the next page', async () => {
		respond(fetchMock, CUSTOMER_PAGE);

		const result = (await invoke(Customers.list, {
			page: 1,
			query: 'walkin',
			business_name: 'Acme',
			include_disabled: false,
			sort: '-created_at',
		})) as Awaited<ReturnType<typeof Customers.list>>;

		const request = lastRequest(fetchMock);
		expect(request.query).toEqual({
			page: '1',
			query: 'walkin',
			business_name: 'Acme',
			include_disabled: 'false',
			sort: '-created_at',
			api_key: 'repairshopr-test-key',
		});
		expect(result.customers[0]?.fullname).toBe('Walkin Customer');
		expect(result.next_page).toBeNull();
	});

	it('offers the next page while more remain', async () => {
		respond(fetchMock, CUSTOMER_PAGE_MORE);

		const result = (await invoke(Customers.list, {
			page: 1,
		})) as Awaited<ReturnType<typeof Customers.list>>;

		expect(result.next_page).toBe(2);
		expect(result.total_pages).toBe(3);
		expect(result.total_entries).toBe(3);
	});

	it('stops paging on the last page', async () => {
		respond(fetchMock, CUSTOMER_PAGE_MORE);

		const result = (await invoke(Customers.list, {
			page: 3,
		})) as Awaited<ReturnType<typeof Customers.list>>;

		expect(result.next_page).toBeNull();
	});
});

describe('customers.get', () => {
	it('reads one customer by id', async () => {
		respond(fetchMock, CUSTOMER);

		const result = (await invoke(Customers.get, {
			customer_id: CUSTOMER_ID,
		})) as Awaited<ReturnType<typeof Customers.get>>;

		expect(lastRequest(fetchMock).path).toBe(
			`/api/v1/customers/${CUSTOMER_ID}`,
		);
		expect(result.customer.email).toBe('walkin@example.com');
		expect(result.customer.properties).toEqual({ loyalty_tier: 'gold' });
	});

	it('rejects a non-positive id', async () => {
		await expect(invoke(Customers.get, { customer_id: 0 })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('customers.create', () => {
	it('sends the customer fields', async () => {
		respond(fetchMock, { customer: CUSTOMER });

		await invoke(Customers.create, {
			firstname: 'Walkin',
			lastname: 'Customer',
			email: 'walkin@example.com',
			business_name: 'Acme',
		});

		expect(lastRequest(fetchMock).json()).toEqual({
			firstname: 'Walkin',
			lastname: 'Customer',
			email: 'walkin@example.com',
			business_name: 'Acme',
		});
	});
});

describe('customers.update and delete', () => {
	it('puts the id in the path and not the body', async () => {
		respond(fetchMock, { customer: CUSTOMER });

		await invoke(Customers.update, {
			customer_id: CUSTOMER_ID,
			business_name: 'Acme B.V.',
		});

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('PUT');
		expect(request.path).toBe(`/api/v1/customers/${CUSTOMER_ID}`);
		expect(request.json()).toEqual({ business_name: 'Acme B.V.' });
	});

	it('deletes a customer and reports the id', async () => {
		respond(fetchMock, { id: CUSTOMER_ID, fullname: 'Walkin Customer' });

		const result = (await invoke(Customers.remove, {
			customer_id: CUSTOMER_ID,
		})) as Awaited<ReturnType<typeof Customers.remove>>;

		expect(lastRequest(fetchMock).method).toBe('DELETE');
		expect(result.success).toBe(true);
		expect(result.customer_id).toBe(CUSTOMER_ID);
	});
});

describe('tickets', () => {
	it('lists tickets for a customer', async () => {
		respond(fetchMock, TICKET_PAGE);

		const result = (await invoke(Tickets.list, {
			customer_id: CUSTOMER_ID,
			status: 'New',
		})) as Awaited<ReturnType<typeof Tickets.list>>;

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/api/v1/tickets');
		expect(request.query.customer_id).toBe(String(CUSTOMER_ID));
		expect(request.query.status).toBe('New');
		expect(result.tickets[0]?.subject).toBe('Laptop will not boot');
	});

	it('reads one ticket by id', async () => {
		respond(fetchMock, TICKET);

		const result = (await invoke(Tickets.get, {
			ticket_id: TICKET_ID,
		})) as Awaited<ReturnType<typeof Tickets.get>>;

		expect(result.ticket.ticket_type_name).toBe('Repair');
		expect(result.ticket.priority).toBe('High');
	});

	it('creates a ticket for a customer', async () => {
		respond(fetchMock, { ticket: TICKET });

		await invoke(Tickets.create, {
			customer_id: CUSTOMER_ID,
			subject: 'Laptop will not boot',
			status: 'New',
			priority: 'High',
		});

		expect(lastRequest(fetchMock).json()).toEqual({
			customer_id: CUSTOMER_ID,
			subject: 'Laptop will not boot',
			status: 'New',
			priority: 'High',
		});
	});

	it('rejects a ticket with no customer', async () => {
		await expect(
			invoke(Tickets.create, { subject: 'No customer' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an empty subject', async () => {
		await expect(
			invoke(Tickets.create, { customer_id: CUSTOMER_ID, subject: '' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a priority RepairShopr does not define', async () => {
		await expect(
			invoke(Tickets.create, {
				customer_id: CUSTOMER_ID,
				subject: 'x',
				priority: 'Critical',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('updates a ticket status', async () => {
		respond(fetchMock, { ticket: { ...TICKET, status: 'Resolved' } });

		await invoke(Tickets.update, {
			ticket_id: TICKET_ID,
			status: 'Resolved',
		});

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('PUT');
		expect(request.path).toBe(`/api/v1/tickets/${TICKET_ID}`);
		expect(request.json()).toEqual({ status: 'Resolved' });
	});

	it('deletes a ticket', async () => {
		respond(fetchMock, { id: TICKET_ID });

		const result = (await invoke(Tickets.remove, {
			ticket_id: TICKET_ID,
		})) as Awaited<ReturnType<typeof Tickets.remove>>;

		expect(result).toEqual({ success: true, ticket_id: TICKET_ID });
	});
});

describe('invoices', () => {
	it('lists unpaid invoices with per_page', async () => {
		respond(fetchMock, INVOICE_PAGE);

		const result = (await invoke(Catalog.invoicesList, {
			unpaid: true,
			per_page: 25,
		})) as Awaited<ReturnType<typeof Catalog.invoicesList>>;

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/api/v1/invoices');
		expect(request.query.unpaid).toBe('true');
		expect(request.query.per_page).toBe('25');
		// RepairShopr returns money as strings on this resource.
		expect(result.invoices[0]?.total).toBe('181.50');
	});

	it('reads one invoice by id', async () => {
		respond(fetchMock, INVOICE);

		const result = (await invoke(Catalog.invoicesGet, {
			invoice_id: INVOICE_ID,
		})) as Awaited<ReturnType<typeof Catalog.invoicesGet>>;

		expect(result.invoice.is_paid).toBe(false);
		expect(result.invoice.ticket_id).toBe(TICKET_ID);
	});
});

describe('products', () => {
	it('lists products with a sku filter', async () => {
		respond(fetchMock, PRODUCT_PAGE);

		const result = (await invoke(Catalog.productsList, {
			sku: 'SSD-1TB',
		})) as Awaited<ReturnType<typeof Catalog.productsList>>;

		expect(lastRequest(fetchMock).query.sku).toBe('SSD-1TB');
		expect(result.products[0]?.name).toBe('SSD 1TB');
		// This collection carries no meta, so there is no page to offer.
		expect(result.next_page).toBeNull();
	});

	it('reads one product by id', async () => {
		respond(fetchMock, PRODUCT);

		const result = (await invoke(Catalog.productsGet, {
			product_id: PRODUCT_ID,
		})) as Awaited<ReturnType<typeof Catalog.productsGet>>;

		expect(result.product.price_retail).toBe(150);
		expect(result.product.quantity).toBe(12);
	});

	it('creates a product with its name and description', async () => {
		respond(fetchMock, { product: PRODUCT });

		await invoke(Catalog.productsCreate, {
			name: 'SSD 1TB',
			description: 'Samsung 980 Pro',
			price_retail: 150,
			quantity: 12,
		});

		expect(lastRequest(fetchMock).json()).toEqual({
			name: 'SSD 1TB',
			description: 'Samsung 980 Pro',
			price_retail: 150,
			quantity: 12,
		});
	});

	it('rejects a product with no description, which RepairShopr requires', async () => {
		await expect(
			invoke(Catalog.productsCreate, { name: 'SSD 1TB' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('updates a product price', async () => {
		respond(fetchMock, { product: PRODUCT });

		await invoke(Catalog.productsUpdate, {
			product_id: PRODUCT_ID,
			price_retail: 165,
		});

		const request = lastRequest(fetchMock);
		expect(request.path).toBe(`/api/v1/products/${PRODUCT_ID}`);
		expect(request.json()).toEqual({ price_retail: 165 });
	});
});

describe('contacts and vendors', () => {
	it('lists contact people for a customer', async () => {
		respond(fetchMock, CONTACT_PAGE);

		const result = (await invoke(Catalog.contactsList, {
			customer_id: CUSTOMER_ID,
		})) as Awaited<ReturnType<typeof Catalog.contactsList>>;

		expect(lastRequest(fetchMock).query.customer_id).toBe(String(CUSTOMER_ID));
		expect(result.contacts[0]?.name).toBe('Jordan Lee');
		// A contact spells its street `address1`, not `address`.
		expect(result.contacts[0]?.address1).toBe('1 Market St');
	});

	it('lists vendors', async () => {
		respond(fetchMock, VENDOR_PAGE);

		const result = (await invoke(Catalog.vendorsList, {})) as Awaited<
			ReturnType<typeof Catalog.vendorsList>
		>;

		expect(result.vendors[0]?.rep_first_name).toBe('Alex');
	});
});

describe('page envelope', () => {
	it('fails rather than inventing an empty page when the key is missing', async () => {
		respond(fetchMock, { meta: { total_pages: 1 } });

		await expect(invoke(Customers.list, {})).rejects.toThrow();
	});
});
