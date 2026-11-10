import {
	LemonSqueezyEndpointInputSchemas,
	LemonSqueezyEndpointOutputSchemas,
} from './endpoints/types';
import {
	bareNotFound,
	customer,
	customerList,
	discount,
	emptyList,
	invalidPageSize,
	store,
	storeDetail,
	storeList,
	taxedOrder,
	unauthorized,
	usagePrice,
	user,
	webhook,
	webhookMissingSecret,
} from './test-fixtures';

describe('output schemas parse live answers', () => {
	it('users.get reads the account with its camelCase timestamps', () => {
		const output = LemonSqueezyEndpointOutputSchemas.usersGet.parse(user);
		expect(output.data.attributes.email).toBe('corsairtest00@gmail.com');
		// The live answer spells these differently from every other resource.
		expect(output.data.attributes.createdAt).toBeDefined();
	});

	it('stores.get reads one store', () => {
		const output =
			LemonSqueezyEndpointOutputSchemas.storesGet.parse(storeDetail);
		expect(output.data.attributes.currency).toBe('INR');
		expect(output.data.attributes.plan).toBe('free');
	});

	it('stores.list reads the page block beside the rows', () => {
		const output =
			LemonSqueezyEndpointOutputSchemas.storesList.parse(storeList);
		expect(output.data).toHaveLength(1);
		expect(output.meta.page.total).toBe(1);
		expect(output.meta.page.lastPage).toBe(1);
	});

	it('reads an empty list, where from and to are null', () => {
		const output =
			LemonSqueezyEndpointOutputSchemas.customersList.parse(emptyList);
		expect(output.data).toEqual([]);
		expect(output.meta.page.from).toBeNull();
		expect(output.meta.page.total).toBe(0);
	});

	it('customers.list reads a customer with its null fields', () => {
		const output =
			LemonSqueezyEndpointOutputSchemas.customersList.parse(customerList);
		const attributes = output.data[0]?.attributes;
		expect(attributes?.city).toBeNull();
		expect(attributes?.total_revenue_currency).toBe(0);
		expect(attributes?.urls?.customer_portal).toBeNull();
	});

	it('customers.create reads the created customer', () => {
		const output =
			LemonSqueezyEndpointOutputSchemas.customersCreate.parse(customer);
		expect(output.data.id).toBe('10361540');
		expect(output.data.attributes.status).toBe('subscribed');
	});

	it('discounts.create reads a percent discount', () => {
		const output =
			LemonSqueezyEndpointOutputSchemas.discountsCreate.parse(discount);
		expect(output.data.attributes.amount).toBe(10);
		expect(output.data.attributes.amount_type).toBe('percent');
		expect(output.data.attributes.max_redemptions).toBe(0);
	});

	it('webhooks.create reads a webhook without a secret field', () => {
		const output =
			LemonSqueezyEndpointOutputSchemas.webhooksCreate.parse(webhook);
		expect(output.data.attributes.events).toEqual(['order_created']);
		// Lemon Squeezy never echoes the secret back.
		expect(output.data.attributes).not.toHaveProperty('secret');
	});

	it('orders.get reads a taxed order, where tax_rate is a string', () => {
		const output =
			LemonSqueezyEndpointOutputSchemas.ordersGet.parse(taxedOrder);
		// Strings: tax_rate and currency_rate. Numbers: every money total.
		expect(output.data.attributes.tax_rate).toBe('20.00');
		expect(output.data.attributes.currency_rate).toBe('1.0000');
		expect(output.data.attributes.total).toBe(1199);
		expect(output.data.attributes.tax_name).toBe('VAT');
	});

	it('prices.get reads a usage-based price, where unit_price_decimal is a number', () => {
		const output =
			LemonSqueezyEndpointOutputSchemas.pricesGet.parse(usagePrice);
		expect(output.data.attributes.unit_price).toBeNull();
		expect(output.data.attributes.unit_price_decimal).toBe(5000);
		expect(
			LemonSqueezyEndpointOutputSchemas.pricesList.parse({
				...storeList,
				data: [usagePrice.data],
			}).data[0]?.attributes.usage_aggregation,
		).toBe('sum');
	});

	it('a delete reports what it removed', () => {
		expect(
			LemonSqueezyEndpointOutputSchemas.discountsDelete.parse({
				deleted: true,
				discountId: '1248442',
			}),
		).toEqual({ deleted: true, discountId: '1248442' });
	});
});

describe('output schemas reject the wrong shape', () => {
	it('rejects a list whose rows are strings', () => {
		expect(() =>
			LemonSqueezyEndpointOutputSchemas.storesList.parse({
				data: ['not-a-resource'],
				meta: { page: { currentPage: 1, lastPage: 1, perPage: 10 } },
			}),
		).toThrow();
	});

	it('rejects a list with no page block, rather than inventing one', () => {
		expect(() =>
			LemonSqueezyEndpointOutputSchemas.customersList.parse({ data: [] }),
		).toThrow();
	});

	it('rejects a resource with no id', () => {
		expect(() =>
			LemonSqueezyEndpointOutputSchemas.storesGet.parse({
				data: { type: 'stores', attributes: {} },
			}),
		).toThrow();
	});

	it('rejects an attribute whose type changed', () => {
		expect(() =>
			LemonSqueezyEndpointOutputSchemas.customersCreate.parse({
				...customer,
				data: {
					...customer.data,
					attributes: { ...customer.data.attributes, mrr: 'much' },
				},
			}),
		).toThrow();
	});

	it('rejects an order whose total is a string', () => {
		expect(() =>
			LemonSqueezyEndpointOutputSchemas.ordersGet.parse({
				data: {
					type: 'orders',
					id: '1',
					attributes: { total: '1000' },
				},
			}),
		).toThrow();
	});

	it('still accepts a resource with fields the schema does not name', () => {
		// A field Lemon Squeezy adds later must not fail a call that happened.
		const output = LemonSqueezyEndpointOutputSchemas.storesGet.parse({
			...storeDetail,
			data: {
				...store,
				attributes: { ...store.attributes, brand_new_field: 'x' },
			},
		});
		expect(output.data.id).toBe('520119');
	});
});

describe('input schemas pin the provider rules', () => {
	it('rejects a page size over 100, which the API answers 400 for', () => {
		expect(() =>
			LemonSqueezyEndpointOutputSchemas.customersList.parse({ data: [] }),
		).toThrow();
		// The live 400 names the parameter, which is why the cap is enforced here.
		expect(invalidPageSize.errors[0]?.source?.parameter).toBe('page.size');
	});

	it('rejects an empty include list', () => {
		// `include: []` would send `include=` and the API reads that as no
		// include, so an empty list is refused rather than quietly dropped.
		expect(
			LemonSqueezyEndpointInputSchemas.storesList.safeParse({ include: [] })
				.success,
		).toBe(false);
		expect(
			LemonSqueezyEndpointInputSchemas.storesList.safeParse({
				include: ['products'],
			}).success,
		).toBe(true);
	});
});

describe('error bodies parse', () => {
	it('reads each documented error shape', () => {
		expect(webhookMissingSecret.errors[0]?.source?.pointer).toBe(
			'/data/attributes/secret',
		);
		expect(invalidPageSize.errors[0]?.source?.parameter).toBe('page.size');
		expect(bareNotFound.errors[0]?.status).toBe('404');
		expect(unauthorized.errors[0]?.detail).toBe('Unauthenticated.');
	});
});
