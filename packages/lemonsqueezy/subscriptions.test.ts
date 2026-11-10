import { Subscriptions } from './endpoints';
import { emptyList, generatedInvoice } from './test-fixtures';
import {
	calls,
	expectAuthenticated,
	invoke,
	lastRequest,
	respond,
	setUp,
	tearDown,
} from './test-harness';

beforeEach(setUp);
afterEach(tearDown);

const subscription = {
	data: {
		type: 'subscriptions',
		id: '2',
		attributes: {
			status: 'active',
			status_formatted: 'Active',
			cancelled: false,
			renews_at: '2026-12-10T00:00:00.000000Z',
		},
	},
};

describe('subscriptions.list', () => {
	it('sends every documented filter', async () => {
		respond(emptyList);

		await invoke(Subscriptions.subscriptionsList, {
			storeId: 520119,
			orderId: 1,
			orderItemId: 2,
			productId: 3,
			variantId: 4,
			userEmail: 'buyer@example.com',
			status: 'active',
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/v1/subscriptions',
			query: {
				'filter[store_id]': '520119',
				'filter[order_id]': '1',
				'filter[order_item_id]': '2',
				'filter[product_id]': '3',
				'filter[variant_id]': '4',
				'filter[user_email]': 'buyer@example.com',
				'filter[status]': 'active',
			},
		});
	});

	it('rejects a status the API does not define', async () => {
		await expect(
			invoke(Subscriptions.subscriptionsList, { status: 'paused_forever' }),
		).rejects.toThrow();
		expect(calls()).toBe(0);
	});
});

describe('subscriptions.get', () => {
	it('GETs one subscription', async () => {
		respond(subscription);

		const result = (await invoke(Subscriptions.subscriptionsGet, {
			subscriptionId: '2',
		})) as typeof subscription;

		expectAuthenticated();
		expect(lastRequest().path).toBe('/v1/subscriptions/2');
		expect(result.data.attributes.status).toBe('active');
	});
});

describe('subscriptions.update', () => {
	it('PATCHes a variant change with the proration flags', async () => {
		respond(subscription);

		await invoke(Subscriptions.subscriptionsUpdate, {
			subscriptionId: '2',
			variantId: 9,
			invoiceImmediately: true,
		});

		const sent = lastRequest();
		expect(sent.method).toBe('PATCH');
		expect(sent.path).toBe('/v1/subscriptions/2');
		expect(sent.body?.data).toEqual({
			type: 'subscriptions',
			id: '2',
			attributes: {
				variant_id: 9,
				invoice_immediately: true,
			},
		});
	});

	it('nests a pause and leaves unpause out', async () => {
		respond(subscription);

		await invoke(Subscriptions.subscriptionsUpdate, {
			subscriptionId: '2',
			pause: { mode: 'void' },
		});

		expect(lastRequest().body?.data.attributes).toEqual({
			pause: { mode: 'void' },
		});
	});

	it('unpauses by sending a null pause, which is how the API resumes collection', async () => {
		respond(subscription);

		await invoke(Subscriptions.subscriptionsUpdate, {
			subscriptionId: '2',
			unpause: true,
		});

		expect(lastRequest().body?.data.attributes).toEqual({ pause: null });
	});

	it('moves the billing anchor', async () => {
		respond(subscription);

		await invoke(Subscriptions.subscriptionsUpdate, {
			subscriptionId: '2',
			billingAnchor: 15,
		});

		expect(lastRequest().body?.data.attributes).toEqual({ billing_anchor: 15 });
	});

	it('rejects an update that changes nothing', async () => {
		await expect(
			invoke(Subscriptions.subscriptionsUpdate, { subscriptionId: '2' }),
		).rejects.toThrow(/changes nothing/);
	});

	it('rejects pause and unpause together', async () => {
		await expect(
			invoke(Subscriptions.subscriptionsUpdate, {
				subscriptionId: '2',
				pause: { mode: 'free' },
				unpause: true,
			}),
		).rejects.toThrow(/opposite actions/);
	});

	it('rejects invoiceImmediately without a variant change', async () => {
		await expect(
			invoke(Subscriptions.subscriptionsUpdate, {
				subscriptionId: '2',
				billingAnchor: 3,
				invoiceImmediately: true,
			}),
		).rejects.toThrow(/only applies to a variant change/);
	});

	it('rejects a billing anchor outside 1 to 31', async () => {
		await expect(
			invoke(Subscriptions.subscriptionsUpdate, {
				subscriptionId: '2',
				billingAnchor: 32,
			}),
		).rejects.toThrow();
	});
});

describe('subscriptions.cancel', () => {
	it('DELETEs the subscription and returns its cancelled state', async () => {
		respond({
			data: {
				type: 'subscriptions',
				id: '2',
				attributes: { status: 'cancelled', cancelled: true },
			},
		});

		const result = (await invoke(Subscriptions.subscriptionsCancel, {
			subscriptionId: '2',
		})) as { data: { attributes: { status?: string } } };

		const sent = lastRequest();
		expect(sent.method).toBe('DELETE');
		expect(sent.path).toBe('/v1/subscriptions/2');
		expect(result.data.attributes.status).toBe('cancelled');
	});
});

describe('subscriptionItems', () => {
	it('subscriptionItems.list filters by subscription and price', async () => {
		respond(emptyList);

		await invoke(Subscriptions.subscriptionItemsList, {
			subscriptionId: 2,
			priceId: 3,
		});

		expect(lastRequest()).toMatchObject({
			path: '/v1/subscription-items',
			query: { 'filter[subscription_id]': '2', 'filter[price_id]': '3' },
		});
	});

	it('subscriptionItems.get reads one', async () => {
		respond({ data: { type: 'subscription-items', id: '4', attributes: {} } });

		await invoke(Subscriptions.subscriptionItemsGet, {
			subscriptionItemId: '4',
		});

		expect(lastRequest().path).toBe('/v1/subscription-items/4');
	});

	it('subscriptionItems.usage reads the usage block, which has no data member', async () => {
		const answer = {
			jsonapi: { version: '1.0' },
			meta: {
				period_start: '2023-08-10T13:08:16+00:00',
				period_end: '2023-09-10T13:03:16+00:00',
				quantity: 5,
				interval_unit: 'month',
				interval_quantity: 1,
			},
		};
		respond(answer);

		const result = (await invoke(Subscriptions.subscriptionItemsUsage, {
			subscriptionItemId: '4',
		})) as typeof answer;

		expect(lastRequest().path).toBe('/v1/subscription-items/4/current-usage');
		expect(result.meta).toEqual(answer.meta);
	});

	it('subscriptionItems.update PATCHes the quantity', async () => {
		respond({ data: { type: 'subscription-items', id: '4', attributes: {} } });

		await invoke(Subscriptions.subscriptionItemsUpdate, {
			subscriptionItemId: '4',
			quantity: 7,
		});

		const sent = lastRequest();
		expect(sent.method).toBe('PATCH');
		expect(sent.body?.data).toEqual({
			type: 'subscription-items',
			id: '4',
			attributes: { quantity: 7 },
		});
	});

	it('rejects a quantity below one', async () => {
		await expect(
			invoke(Subscriptions.subscriptionItemsUpdate, {
				subscriptionItemId: '4',
				quantity: 0,
			}),
		).rejects.toThrow();
	});
});

describe('subscriptionInvoices', () => {
	it('subscriptionInvoices.list sends every filter', async () => {
		respond(emptyList);

		await invoke(Subscriptions.subscriptionInvoicesList, {
			storeId: 520119,
			status: 'paid',
			refunded: false,
			subscriptionId: 2,
		});

		expect(lastRequest()).toMatchObject({
			path: '/v1/subscription-invoices',
			query: {
				'filter[store_id]': '520119',
				'filter[status]': 'paid',
				'filter[refunded]': 'false',
				'filter[subscription_id]': '2',
			},
		});
	});

	it('subscriptionInvoices.get reads one', async () => {
		respond({
			data: { type: 'subscription-invoices', id: '5', attributes: {} },
		});

		await invoke(Subscriptions.subscriptionInvoicesGet, {
			subscriptionInvoiceId: '5',
		});

		expect(lastRequest().path).toBe('/v1/subscription-invoices/5');
	});

	it('subscriptionInvoices.generate sends the billing details as query parameters and returns the download link', async () => {
		respond(generatedInvoice);

		const result = (await invoke(Subscriptions.subscriptionInvoicesGenerate, {
			subscriptionInvoiceId: '5',
			name: 'Acme Ltd',
			address: '1 High St',
			city: 'London',
			zipCode: 'N1 1AA',
			country: 'GB',
		})) as typeof generatedInvoice;

		const sent = lastRequest();
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/v1/subscription-invoices/5/generate-invoice');
		expect(sent.query).toEqual({
			name: 'Acme Ltd',
			address: '1 High St',
			city: 'London',
			zip_code: 'N1 1AA',
			country: 'GB',
		});
		expect(sent.body).toBeUndefined();
		expect(result.meta.urls.download_invoice).toContain('/invoice/download');
	});

	it('subscriptionInvoices.refund POSTs the amount', async () => {
		respond({
			data: { type: 'subscription-invoices', id: '5', attributes: {} },
		});

		await invoke(Subscriptions.subscriptionInvoicesRefund, {
			subscriptionInvoiceId: '5',
			amount: 250,
		});

		const sent = lastRequest();
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/v1/subscription-invoices/5/refund');
		expect(sent.body?.data.attributes).toEqual({ amount: 250 });
	});

	it('subscriptionInvoices.refund omits the amount for a full refund', async () => {
		respond({
			data: { type: 'subscription-invoices', id: '5', attributes: {} },
		});

		await invoke(Subscriptions.subscriptionInvoicesRefund, {
			subscriptionInvoiceId: '5',
		});

		expect(lastRequest().body?.data.attributes).toEqual({});
	});
});

describe('usageRecords', () => {
	it('usageRecords.list filters by subscription item', async () => {
		respond(emptyList);

		await invoke(Subscriptions.usageRecordsList, { subscriptionItemId: 4 });

		expect(lastRequest()).toMatchObject({
			path: '/v1/usage-records',
			query: { 'filter[subscription_item_id]': '4' },
		});
	});

	it('usageRecords.get reads one', async () => {
		respond({ data: { type: 'usage-records', id: '6', attributes: {} } });

		await invoke(Subscriptions.usageRecordsGet, { usageRecordId: '6' });

		expect(lastRequest().path).toBe('/v1/usage-records/6');
	});

	it('usageRecords.create POSTs the quantity and the item relationship', async () => {
		respond(
			{
				data: { type: 'usage-records', id: '6', attributes: { quantity: 5 } },
			},
			201,
		);

		const result = (await invoke(Subscriptions.usageRecordsCreate, {
			subscriptionItemId: 4,
			quantity: 5,
		})) as { data: { attributes: { quantity?: number } } };

		const sent = lastRequest();
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/v1/usage-records');
		expect(sent.body).toEqual({
			data: {
				type: 'usage-records',
				attributes: { quantity: 5 },
				relationships: {
					'subscription-item': {
						data: { type: 'subscription-items', id: '4' },
					},
				},
			},
		});
		expect(result.data.attributes.quantity).toBe(5);
	});

	it('usageRecords.create sends the set action when asked', async () => {
		respond({ data: { type: 'usage-records', id: '6', attributes: {} } }, 201);

		await invoke(Subscriptions.usageRecordsCreate, {
			subscriptionItemId: 4,
			quantity: 50,
			action: 'set',
		});

		expect(lastRequest().body?.data.attributes).toEqual({
			quantity: 50,
			action: 'set',
		});
	});

	it('rejects a quantity below one', async () => {
		await expect(
			invoke(Subscriptions.usageRecordsCreate, {
				subscriptionItemId: 4,
				quantity: 0,
			}),
		).rejects.toThrow();
	});
});
