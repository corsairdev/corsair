// Installs the corsair/core logger mock before the endpoints load and bind it.
import './test-harness';
import { Billing, Catalog } from './endpoints';
import { captureError } from './test-errors';
import {
	bareNotFound,
	customer,
	customerList,
	discount,
	emptyList,
	generatedInvoice,
	store,
	storeList,
	user,
	webhook,
} from './test-fixtures';
import {
	calls,
	expectAuthenticated,
	invoke,
	lastRequest,
	mockLog,
	respond,
	respondEmpty,
	setUp,
	tearDown,
} from './test-harness';

beforeEach(setUp);
afterEach(tearDown);

describe('the fetch mock', () => {
	it('refuses a request no test queued an answer for', async () => {
		const error = await captureError(invoke(Catalog.usersGet));

		expect(calls()).toBe(1);
		expect((error as Error).message).toMatch(/unmocked fetch/);
	});
});

// One test per operation: the URL, the method, where the key went, and every
// query or body field sent. A shared client means a wrong selector is a silent
// wrong result rather than an error, so each route is pinned here.

describe('users.get', () => {
	it('GETs /v1/users/me', async () => {
		respond(user);

		const result = (await invoke(Catalog.usersGet)) as typeof user;

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/users/me',
		});
		expect(result.data.attributes.email).toBe('corsairtest00@gmail.com');
	});
});

describe('stores', () => {
	it('stores.list sends paging and include', async () => {
		respond(storeList);

		await invoke(Catalog.storesList, {
			pageNumber: 2,
			pageSize: 5,
			sort: '-name',
			include: ['products'],
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/stores',
			query: {
				'page[number]': '2',
				'page[size]': '5',
				sort: '-name',
				include: 'products',
			},
		});
	});

	it('stores.get encodes the id', async () => {
		respond({ data: store });

		await invoke(Catalog.storesGet, { storeId: '520119' });

		expectAuthenticated();
		expect(lastRequest().path).toBe('/v1/stores/520119');
	});

	it('rejects a page size over the documented cap', async () => {
		await expect(
			invoke(Catalog.storesList, { pageSize: 101 }),
		).rejects.toThrow();
		expect(calls()).toBe(0);
	});
});

describe('products', () => {
	it('products.list filters by store', async () => {
		respond(emptyList);

		await invoke(Catalog.productsList, { storeId: 520119 });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/v1/products',
			query: { 'filter[store_id]': '520119' },
		});
	});

	it('products.get reads one', async () => {
		respond({
			data: { type: 'products', id: '1', attributes: { name: 'Lemonade' } },
		});

		await invoke(Catalog.productsGet, { productId: '1' });

		expect(lastRequest().path).toBe('/v1/products/1');
	});
});

describe('variants', () => {
	it('variants.list filters by product and status', async () => {
		respond(emptyList);

		await invoke(Catalog.variantsList, { productId: 10, status: 'published' });

		expect(lastRequest()).toMatchObject({
			path: '/v1/variants',
			query: { 'filter[product_id]': '10', 'filter[status]': 'published' },
		});
	});

	it('rejects a status the API does not define', async () => {
		await expect(
			invoke(Catalog.variantsList, { status: 'archived' }),
		).rejects.toThrow();
	});

	it('variants.get reads one', async () => {
		respond({ data: { type: 'variants', id: '7', attributes: {} } });

		await invoke(Catalog.variantsGet, { variantId: '7' });

		expect(lastRequest().path).toBe('/v1/variants/7');
	});
});

describe('prices', () => {
	it('prices.list filters by variant', async () => {
		respond(emptyList);

		await invoke(Catalog.pricesList, { variantId: 7 });

		expect(lastRequest()).toMatchObject({
			path: '/v1/prices',
			query: { 'filter[variant_id]': '7' },
		});
	});

	it('prices.get reads one', async () => {
		respond({ data: { type: 'prices', id: '3', attributes: {} } });

		await invoke(Catalog.pricesGet, { priceId: '3' });

		expect(lastRequest().path).toBe('/v1/prices/3');
	});
});

describe('files', () => {
	it('files.list filters by variant', async () => {
		respond(emptyList);

		await invoke(Catalog.filesList, { variantId: 7 });

		expect(lastRequest()).toMatchObject({
			path: '/v1/files',
			query: { 'filter[variant_id]': '7' },
		});
	});

	it('files.get reads one', async () => {
		respond({ data: { type: 'files', id: '9', attributes: {} } });

		await invoke(Catalog.filesGet, { fileId: '9' });

		expect(lastRequest().path).toBe('/v1/files/9');
	});
});

describe('orders', () => {
	it('orders.list sends all three filters', async () => {
		respond(emptyList);

		await invoke(Catalog.ordersList, {
			storeId: 520119,
			userEmail: 'buyer@example.com',
			orderNumber: 1042,
		});

		expect(lastRequest()).toMatchObject({
			path: '/v1/orders',
			query: {
				'filter[store_id]': '520119',
				'filter[user_email]': 'buyer@example.com',
				'filter[order_number]': '1042',
			},
		});
	});

	it('drops a provider-style filter name, so the list is unfiltered', async () => {
		// The overview tells callers to use the camelCase fields for this reason.
		respond(emptyList);

		await invoke(Catalog.ordersList, { store_id: 520119 });

		expect(lastRequest().query).toEqual({});
	});

	it('rejects an email that is not an address', async () => {
		await expect(
			invoke(Catalog.ordersList, { userEmail: 'not-an-email' }),
		).rejects.toThrow();
	});

	it('orders.get reads one', async () => {
		respond({ data: { type: 'orders', id: '1', attributes: {} } });

		await invoke(Catalog.ordersGet, { orderId: '1' });

		expect(lastRequest().path).toBe('/v1/orders/1');
	});

	it('orders.generateInvoice sends the billing details as query parameters and returns the download link', async () => {
		respond(generatedInvoice);

		const result = (await invoke(Catalog.ordersGenerateInvoice, {
			orderId: '1',
			name: 'Acme Ltd',
			address: '123 Main St',
			city: 'Anytown',
			state: 'CA',
			zipCode: '12345',
			country: 'US',
			notes: 'Thank you',
			locale: 'en',
		})) as typeof generatedInvoice;

		expectAuthenticated();
		const sent = lastRequest();
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/v1/orders/1/generate-invoice');
		expect(sent.query).toEqual({
			name: 'Acme Ltd',
			address: '123 Main St',
			city: 'Anytown',
			state: 'CA',
			zip_code: '12345',
			country: 'US',
			notes: 'Thank you',
			locale: 'en',
		});
		expect(sent.body).toBeUndefined();
		expect(result.meta.urls.download_invoice).toBe(
			generatedInvoice.meta.urls.download_invoice,
		);
		// The billing details are personal data and stay out of the event log.
		expect(mockLog).toHaveBeenCalledTimes(1);
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain('Main St');
	});

	it('orders.generateInvoice needs a state for a US or Canadian address', async () => {
		await expect(
			invoke(Catalog.ordersGenerateInvoice, {
				orderId: '1',
				name: 'Acme Ltd',
				address: '123 Main St',
				city: 'Anytown',
				zipCode: '12345',
				country: 'US',
			}),
		).rejects.toThrow(/state/);
		expect(calls()).toBe(0);
	});

	it('orders.refund sends the amount in a JSON:API envelope', async () => {
		respond({
			data: { type: 'orders', id: '1', attributes: { refunded: true } },
		});

		await invoke(Catalog.ordersRefund, { orderId: '1', amount: 500 });

		const sent = lastRequest();
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/v1/orders/1/refund');
		expect(sent.body).toEqual({
			data: { type: 'orders', id: '1', attributes: { amount: 500 } },
		});
	});

	it('orders.refund omits the amount for a full refund', async () => {
		respond({
			data: { type: 'orders', id: '1', attributes: { refunded: true } },
		});

		await invoke(Catalog.ordersRefund, { orderId: '1' });

		// An empty attributes object is a full refund; `amount: undefined` would
		// serialise away and read the same, so the shape is pinned.
		expect(lastRequest().body).toEqual({
			data: { type: 'orders', id: '1', attributes: {} },
		});
	});

	it('rejects a refund of zero or a negative amount', async () => {
		await expect(
			invoke(Catalog.ordersRefund, { orderId: '1', amount: 0 }),
		).rejects.toThrow();
		await expect(
			invoke(Catalog.ordersRefund, { orderId: '1', amount: -100 }),
		).rejects.toThrow();
	});
});

describe('orderItems', () => {
	it('orderItems.list sends all three filters', async () => {
		respond(emptyList);

		await invoke(Catalog.orderItemsList, {
			orderId: 1,
			productId: 2,
			variantId: 3,
		});

		expect(lastRequest()).toMatchObject({
			path: '/v1/order-items',
			query: {
				'filter[order_id]': '1',
				'filter[product_id]': '2',
				'filter[variant_id]': '3',
			},
		});
	});

	it('orderItems.get reads one', async () => {
		respond({ data: { type: 'order-items', id: '4', attributes: {} } });

		await invoke(Catalog.orderItemsGet, { orderItemId: '4' });

		expect(lastRequest().path).toBe('/v1/order-items/4');
	});
});

describe('affiliates', () => {
	it('affiliates.list filters by store and email', async () => {
		respond(emptyList);

		await invoke(Catalog.affiliatesList, {
			storeId: 520119,
			userEmail: 'affiliate@example.com',
		});

		expect(lastRequest()).toMatchObject({
			path: '/v1/affiliates',
			query: {
				'filter[store_id]': '520119',
				'filter[user_email]': 'affiliate@example.com',
			},
		});
	});

	it('affiliates.get reads one', async () => {
		respond({ data: { type: 'affiliates', id: '5', attributes: {} } });

		await invoke(Catalog.affiliatesGet, { affiliateId: '5' });

		expect(lastRequest().path).toBe('/v1/affiliates/5');
	});
});

describe('customers', () => {
	it('customers.list filters by store and email', async () => {
		respond(customerList);

		const result = (await invoke(Billing.customersList, {
			storeId: 520119,
			email: 'probe@example.com',
		})) as typeof customerList;

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/v1/customers',
			query: {
				'filter[store_id]': '520119',
				'filter[email]': 'probe@example.com',
			},
		});
		expect(result.data).toHaveLength(1);
	});

	it('customers.get reads one', async () => {
		respond(customer);

		await invoke(Billing.customersGet, { customerId: '10361540' });

		expect(lastRequest().path).toBe('/v1/customers/10361540');
	});

	it('customers.create POSTs attributes and the store relationship', async () => {
		respond(customer, 201);

		const result = (await invoke(Billing.customersCreate, {
			storeId: 520119,
			name: 'Corsair Probe',
			email: 'probe@example.com',
		})) as typeof customer;

		const sent = lastRequest();
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/v1/customers');
		expect(sent.body).toEqual({
			data: {
				type: 'customers',
				attributes: { name: 'Corsair Probe', email: 'probe@example.com' },
				relationships: {
					store: { data: { type: 'stores', id: '520119' } },
				},
			},
		});
		expect(result.data.id).toBe('10361540');
	});

	it('customers.update PATCHes the changed fields', async () => {
		respond(customer);

		await invoke(Billing.customersUpdate, {
			customerId: '10361540',
			name: 'Renamed',
		});

		const sent = lastRequest();
		expect(sent.method).toBe('PATCH');
		expect(sent.path).toBe('/v1/customers/10361540');
		expect(sent.body?.data).toEqual({
			type: 'customers',
			id: '10361540',
			attributes: { name: 'Renamed' },
		});
	});

	it('rejects an update that changes nothing', async () => {
		await expect(
			invoke(Billing.customersUpdate, { customerId: '1' }),
		).rejects.toThrow(/changes nothing/);
	});
});

describe('discounts', () => {
	it('discounts.list filters by store', async () => {
		respond(emptyList);

		await invoke(Billing.discountsList, { storeId: 520119 });

		expect(lastRequest()).toMatchObject({
			path: '/v1/discounts',
			query: { 'filter[store_id]': '520119' },
		});
	});

	it('discounts.get reads one', async () => {
		respond(discount);

		await invoke(Billing.discountsGet, { discountId: '1248442' });

		expect(lastRequest().path).toBe('/v1/discounts/1248442');
	});

	it('discounts.create POSTs the attributes and store relationship', async () => {
		respond(discount, 201);

		await invoke(Billing.discountsCreate, {
			storeId: 520119,
			name: 'Probe',
			code: 'PROBE10',
			amount: 10,
			amountType: 'percent',
			duration: 'once',
		});

		const sent = lastRequest();
		expect(sent.method).toBe('POST');
		expect(sent.body).toEqual({
			data: {
				type: 'discounts',
				attributes: {
					name: 'Probe',
					code: 'PROBE10',
					amount: 10,
					amount_type: 'percent',
					duration: 'once',
				},
				relationships: {
					store: { data: { type: 'stores', id: '520119' } },
				},
			},
		});
	});

	it('rejects a percent discount over 100', async () => {
		await expect(
			invoke(Billing.discountsCreate, {
				storeId: 1,
				name: 'Bad',
				code: 'BAD',
				amount: 150,
				amountType: 'percent',
				duration: 'once',
			}),
		).rejects.toThrow(/cannot exceed 100/);
	});

	it('rejects a repeating discount with no month count', async () => {
		await expect(
			invoke(Billing.discountsCreate, {
				storeId: 1,
				name: 'Bad',
				code: 'BAD',
				amount: 10,
				amountType: 'percent',
				duration: 'repeating',
			}),
		).rejects.toThrow(/needs durationInMonths/);
	});

	it('rejects a redemption cap the API would ignore', async () => {
		await expect(
			invoke(Billing.discountsCreate, {
				storeId: 1,
				name: 'Bad',
				code: 'BAD',
				amount: 10,
				amountType: 'percent',
				duration: 'once',
				maxRedemptions: 5,
			}),
		).rejects.toThrow(/only read when isLimitedRedemptions/);
	});

	it('discounts.delete DELETEs and reports the deletion', async () => {
		respondEmpty(204);

		const result = (await invoke(Billing.discountsDelete, {
			discountId: '1248442',
		})) as { deleted: boolean; discountId: string };

		const sent = lastRequest();
		expect(sent.method).toBe('DELETE');
		expect(sent.path).toBe('/v1/discounts/1248442');
		expect(result).toEqual({ deleted: true, discountId: '1248442' });
	});
});

describe('discountRedemptions', () => {
	it('discountRedemptions.list filters by discount and order', async () => {
		respond(emptyList);

		await invoke(Billing.discountRedemptionsList, {
			discountId: 10,
			orderId: 20,
		});

		expect(lastRequest()).toMatchObject({
			path: '/v1/discount-redemptions',
			query: { 'filter[discount_id]': '10', 'filter[order_id]': '20' },
		});
	});

	it('discountRedemptions.get reads one', async () => {
		respond({
			data: { type: 'discount-redemptions', id: '6', attributes: {} },
		});

		await invoke(Billing.discountRedemptionsGet, { discountRedemptionId: '6' });

		expect(lastRequest().path).toBe('/v1/discount-redemptions/6');
	});
});

describe('licenseKeys', () => {
	it('licenseKeys.list sends every filter', async () => {
		respond(emptyList);

		await invoke(Billing.licenseKeysList, {
			storeId: 520119,
			orderId: 1,
			orderItemId: 2,
			productId: 3,
			status: 'active',
		});

		expect(lastRequest()).toMatchObject({
			path: '/v1/license-keys',
			query: {
				'filter[store_id]': '520119',
				'filter[order_id]': '1',
				'filter[order_item_id]': '2',
				'filter[product_id]': '3',
				'filter[status]': 'active',
			},
		});
	});

	it('licenseKeys.get reads one', async () => {
		respond({ data: { type: 'license-keys', id: '8', attributes: {} } });

		await invoke(Billing.licenseKeysGet, { licenseKeyId: '8' });

		expect(lastRequest().path).toBe('/v1/license-keys/8');
	});

	it('licenseKeys.update PATCHes the changed fields', async () => {
		respond({
			data: {
				type: 'license-keys',
				id: '8',
				attributes: { status: 'disabled' },
			},
		});

		await invoke(Billing.licenseKeysUpdate, {
			licenseKeyId: '8',
			disabled: true,
			activationLimit: 3,
		});

		const sent = lastRequest();
		expect(sent.method).toBe('PATCH');
		expect(sent.path).toBe('/v1/license-keys/8');
		expect(sent.body?.data).toEqual({
			type: 'license-keys',
			id: '8',
			attributes: { disabled: true, activation_limit: 3 },
		});
	});

	it('rejects an update that changes nothing', async () => {
		await expect(
			invoke(Billing.licenseKeysUpdate, { licenseKeyId: '8' }),
		).rejects.toThrow(/changes nothing/);
	});
});

describe('licenseKeyInstances', () => {
	it('licenseKeyInstances.list filters by key id', async () => {
		respond(emptyList);

		await invoke(Billing.licenseKeyInstancesList, { licenseKeyId: 8 });

		expect(lastRequest()).toMatchObject({
			path: '/v1/license-key-instances',
			query: { 'filter[license_key_id]': '8' },
		});
	});

	it('licenseKeyInstances.get reads one', async () => {
		respond({
			data: { type: 'license-key-instances', id: '9', attributes: {} },
		});

		await invoke(Billing.licenseKeyInstancesGet, { licenseKeyInstanceId: '9' });

		expect(lastRequest().path).toBe('/v1/license-key-instances/9');
	});
});

describe('checkouts', () => {
	it('checkouts.list filters by store and variant', async () => {
		respond(emptyList);

		await invoke(Billing.checkoutsList, { storeId: 520119, variantId: 7 });

		expect(lastRequest()).toMatchObject({
			path: '/v1/checkouts',
			query: { 'filter[store_id]': '520119', 'filter[variant_id]': '7' },
		});
	});

	it('checkouts.get reads one', async () => {
		respond({ data: { type: 'checkouts', id: '2', attributes: {} } });

		await invoke(Billing.checkoutsGet, { checkoutId: '2' });

		expect(lastRequest().path).toBe('/v1/checkouts/2');
	});

	it('checkouts.create POSTs the option maps and both relationships', async () => {
		respond(
			{
				data: {
					type: 'checkouts',
					id: '3',
					attributes: { url: 'https://checkout' },
				},
			},
			201,
		);

		const result = (await invoke(Billing.checkoutsCreate, {
			storeId: 520119,
			variantId: 7,
			checkoutData: { email: 'buyer@example.com' },
			checkoutOptions: { embed: true },
			productOptions: { name: 'Custom' },
		})) as { data: { attributes: { url?: string } } };

		const sent = lastRequest();
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/v1/checkouts');
		expect(sent.body).toEqual({
			data: {
				type: 'checkouts',
				attributes: {
					checkout_data: { email: 'buyer@example.com' },
					checkout_options: { embed: true },
					product_options: { name: 'Custom' },
				},
				relationships: {
					store: { data: { type: 'stores', id: '520119' } },
					variant: { data: { type: 'variants', id: '7' } },
				},
			},
		});
		expect(result.data.attributes.url).toBe('https://checkout');
	});
});

describe('webhooks', () => {
	it('webhooks.list filters by store', async () => {
		respond(emptyList);

		await invoke(Billing.webhooksList, { storeId: 520119 });

		expect(lastRequest()).toMatchObject({
			path: '/v1/webhooks',
			query: { 'filter[store_id]': '520119' },
		});
	});

	it('webhooks.get reads one', async () => {
		respond(webhook);

		await invoke(Billing.webhooksGet, { webhookId: '150379' });

		expect(lastRequest().path).toBe('/v1/webhooks/150379');
	});

	it('webhooks.create POSTs the url, events, secret and store', async () => {
		respond(webhook, 201);

		await invoke(Billing.webhooksCreate, {
			storeId: 520119,
			url: 'https://example.com/ls-probe',
			events: ['order_created'],
			secret: 'probe-secret',
		});

		const sent = lastRequest();
		expect(sent.method).toBe('POST');
		expect(sent.body).toEqual({
			data: {
				type: 'webhooks',
				attributes: {
					url: 'https://example.com/ls-probe',
					events: ['order_created'],
					secret: 'probe-secret',
				},
				relationships: {
					store: { data: { type: 'stores', id: '520119' } },
				},
			},
		});
	});

	it('rejects a plain-http webhook url and an unknown event', async () => {
		await expect(
			invoke(Billing.webhooksCreate, {
				storeId: 1,
				url: 'http://example.com/hook',
				events: ['order_created'],
				secret: 'secret-value',
			}),
		).rejects.toThrow(/https/);
		await expect(
			invoke(Billing.webhooksCreate, {
				storeId: 1,
				url: 'https://example.com/hook',
				events: ['order_created_typo'],
				secret: 'secret-value',
			}),
		).rejects.toThrow();
	});

	it('accepts customer_updated and affiliate_activated, refuses an undocumented event', async () => {
		respond(webhook);
		await invoke(Billing.webhooksCreate, {
			storeId: 1,
			url: 'https://example.com/hook',
			events: ['customer_updated', 'affiliate_activated'],
			secret: 'secret-value',
		});
		expect(lastRequest().body?.data.attributes?.events).toEqual([
			'customer_updated',
			'affiliate_activated',
		]);

		// Not in Lemon Squeezy's event list, so the API would refuse it.
		await expect(
			invoke(Billing.webhooksCreate, {
				storeId: 1,
				url: 'https://example.com/hook',
				events: ['subscription_trial_will_end'],
				secret: 'secret-value',
			}),
		).rejects.toThrow();
	});

	it('webhooks.update PATCHes only what changed', async () => {
		respond(webhook);

		await invoke(Billing.webhooksUpdate, {
			webhookId: '150379',
			events: ['order_created', 'order_refunded'],
		});

		const sent = lastRequest();
		expect(sent.method).toBe('PATCH');
		expect(sent.body?.data.attributes).toEqual({
			events: ['order_created', 'order_refunded'],
		});
	});

	it('rejects an update that changes nothing', async () => {
		await expect(
			invoke(Billing.webhooksUpdate, { webhookId: '1' }),
		).rejects.toThrow(/changes nothing/);
	});

	it('webhooks.delete DELETEs and reports the deletion', async () => {
		respondEmpty(204);

		const result = (await invoke(Billing.webhooksDelete, {
			webhookId: '150379',
		})) as { deleted: boolean; webhookId: string };

		const sent = lastRequest();
		expect(sent.method).toBe('DELETE');
		expect(sent.path).toBe('/v1/webhooks/150379');
		expect(result).toEqual({ deleted: true, webhookId: '150379' });
	});
});

describe('errors reach the caller', () => {
	it('surfaces a 404 message on a missing resource', async () => {
		respond(bareNotFound, 404);

		const error = await captureError(
			invoke(Billing.customersGet, { customerId: '1' }),
		);

		expect((error as Error).message).toContain('404');
	});
});
