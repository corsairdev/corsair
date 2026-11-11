import {
	Addresses,
	Batches,
	CarrierAccounts,
	Customs,
	Orders,
	Parcels,
	ParcelTemplates,
	Pickups,
	Rates,
	Refunds,
	Shipments,
	Tracks,
	Transactions,
	Webhooks,
} from './endpoints';
import {
	address,
	batch,
	carrierAccount,
	carrierParcelTemplate,
	customsDeclaration,
	customsItem,
	manifest,
	order,
	paged,
	parcel,
	pickup,
	purchasedBatch,
	queuedShipment,
	rate,
	refund,
	shipment,
	track,
	transaction,
	userParcelTemplate,
	webhook,
} from './test-fixtures';
import { createHarness, invoke, mockLog } from './test-helpers';

// Hoisted by ts-jest into this file; a mock declared in test-helpers.ts would
// run after these imports and leave the real logger bound.
jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const ADDRESS_ID = 'd799c2679e644279b59fe661ac8fa488';
const SHIPMENT_ID = 'adcfdddf8ec64b84ad22772bce3ea37a';
const RATE_ID = 'ec9f0d3adc9441449c85d315f0997fd5';
const TRANSACTION_ID = '915d94940ea54c3a80cbfa328722f5a1';
const PICKUP_LOCATION = {
	address: {
		name: 'Shwan Ippotle',
		street1: '215 Clayton St.',
		city: 'San Francisco',
		state: 'CA',
		zip: '94117',
		country: 'US',
	},
	building_location_type: 'Front Door',
	building_type: 'building',
	instructions: 'Behind screen door',
};

const h = createHarness();

beforeEach(() => {
	h.mockFetch();
	mockLog.mockClear();
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('addresses', () => {
	it('lists with paging', async () => {
		h.respond(paged([address]));

		const result = await invoke(Addresses.list, { page: 2, results: 10 });

		h.expectAuthenticated();
		expect(h.lastRequest()).toMatchObject({
			method: 'GET',
			path: '/addresses',
		});
		expect(h.lastRequest().query).toEqual({ page: '2', results: '10' });
		expect(result.results).toHaveLength(1);
	});

	it('rejects results above the documented maximum of 100', async () => {
		const error = await h.failure<Error>(
			invoke(Addresses.list, { results: 101 }),
		);

		expect(error.name).toBe('ZodError');
		expect(h.fetchMock).not.toHaveBeenCalled();
	});

	it('gets one address', async () => {
		h.respond(address);

		await invoke(Addresses.get, { address_id: ADDRESS_ID });

		expect(h.lastRequest()).toMatchObject({
			method: 'GET',
			path: `/addresses/${ADDRESS_ID}`,
		});
	});

	it('creates an address, sending the body flat with no wrapper', async () => {
		h.respond(address);

		await invoke(Addresses.create, {
			name: 'Shawn Ippotle',
			street1: '215 Clayton St.',
			city: 'San Francisco',
			state: 'CA',
			zip: '94117',
			country: 'US',
			validate: true,
		});

		h.expectAuthenticated();
		expect(h.lastRequest()).toMatchObject({
			method: 'POST',
			path: '/addresses',
		});
		expect(h.lastRequest().body).toEqual({
			name: 'Shawn Ippotle',
			street1: '215 Clayton St.',
			city: 'San Francisco',
			state: 'CA',
			zip: '94117',
			country: 'US',
			validate: true,
		});
		// The log names the country and the verdict, never the street line.
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'shippo.addresses.create',
			{ addressId: ADDRESS_ID, country: 'US', isComplete: true },
			'completed',
		);
	});

	it('rejects a country that is not two letters', async () => {
		const error = await h.failure<Error>(
			invoke(Addresses.create, { country: 'USA' }),
		);

		expect(error.name).toBe('ZodError');
		expect(h.fetchMock).not.toHaveBeenCalled();
	});

	it('validates a stored address', async () => {
		h.respond(address);

		await invoke(Addresses.validate, { address_id: ADDRESS_ID });

		expect(h.lastRequest()).toMatchObject({
			method: 'GET',
			path: `/addresses/${ADDRESS_ID}/validate`,
		});
	});
});

describe('parcels', () => {
	it('lists parcels', async () => {
		h.respond(paged([parcel]));

		await invoke(Parcels.list, {});

		expect(h.lastRequest()).toMatchObject({ method: 'GET', path: '/parcels' });
	});

	it('gets one parcel', async () => {
		h.respond(parcel);

		await invoke(Parcels.get, { parcel_id: parcel.object_id });

		expect(h.lastRequest().path).toBe(`/parcels/${parcel.object_id}`);
	});

	it('reads a parcel whose insurer or COD method is one Shippo added later', async () => {
		h.respond({
			...parcel,
			extra: {
				insurance: { amount: '50', currency: 'USD', provider: 'DHL' },
				COD: { amount: '5', currency: 'USD', payment_method: 'CHECK' },
			},
		});

		const result = await invoke(Parcels.get, { parcel_id: parcel.object_id });

		expect(result.extra?.insurance?.provider).toBe('DHL');
		expect(result.extra?.COD?.payment_method).toBe('CHECK');
	});

	it('creates a parcel sending weight and dimensions as strings', async () => {
		h.respond(parcel);

		await invoke(Parcels.create, {
			length: '5',
			width: '5',
			height: '5',
			distance_unit: 'in',
			weight: '12',
			mass_unit: 'lb',
		});

		expect(h.lastRequest()).toMatchObject({ method: 'POST', path: '/parcels' });
		// Strings on the wire, not numbers.
		expect(h.lastRequest().body).toEqual({
			length: '5',
			width: '5',
			height: '5',
			distance_unit: 'in',
			weight: '12',
			mass_unit: 'lb',
		});
	});

	it('rejects a numeric weight, which the API does not accept', async () => {
		const error = await h.failure<Error>(
			invoke(Parcels.create, {
				length: '5',
				width: '5',
				height: '5',
				distance_unit: 'in',
				weight: 12,
				mass_unit: 'lb',
			}),
		);

		expect(error.name).toBe('ZodError');
		expect(h.fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an unknown unit', async () => {
		const error = await h.failure<Error>(
			invoke(Parcels.create, {
				length: '5',
				width: '5',
				height: '5',
				distance_unit: 'furlong',
				weight: '12',
				mass_unit: 'lb',
			}),
		);

		expect(error.name).toBe('ZodError');
	});
});

describe('shipments', () => {
	it('lists shipments with a creation-date window', async () => {
		h.respond(paged([shipment]));

		await invoke(Shipments.list, {
			object_created_gte: '2026-01-01T00:00:00Z',
			object_created_lt: '2026-02-01T00:00:00Z',
		});

		expect(h.lastRequest().query).toEqual({
			object_created_gte: '2026-01-01T00:00:00Z',
			object_created_lt: '2026-02-01T00:00:00Z',
		});
	});

	it('gets one shipment', async () => {
		h.respond(shipment);

		await invoke(Shipments.get, { shipment_id: SHIPMENT_ID });

		expect(h.lastRequest().path).toBe(`/shipments/${SHIPMENT_ID}`);
	});

	it('creates a shipment from inline objects', async () => {
		h.respond(queuedShipment);

		await invoke(Shipments.create, {
			address_from: { name: 'Sender', street1: '1 A St', country: 'US' },
			address_to: { name: 'Recipient', street1: '2 B St', country: 'US' },
			parcels: [
				{
					length: '5',
					width: '5',
					height: '5',
					distance_unit: 'in',
					weight: '12',
					mass_unit: 'lb',
				},
			],
		});

		expect(h.lastRequest()).toMatchObject({
			method: 'POST',
			path: '/shipments',
		});
		expect(h.lastRequest().body).toMatchObject({
			address_from: { street1: '1 A St' },
			parcels: [{ weight: '12' }],
		});
	});

	it('accepts an existing address id in place of an inline address', async () => {
		h.respond(queuedShipment);

		await invoke(Shipments.create, {
			address_from: ADDRESS_ID,
			address_to: 'another-address-id',
			parcels: [parcel.object_id],
		});

		expect(h.lastRequest().body).toEqual({
			address_from: ADDRESS_ID,
			address_to: 'another-address-id',
			parcels: [parcel.object_id],
		});
	});

	it('accepts certified signature confirmation, which the spec lists', async () => {
		h.respond(shipment);
		await invoke(Shipments.create, {
			address_from: ADDRESS_ID,
			address_to: ADDRESS_ID,
			parcels: ['parcel-id'],
			extra: { signature_confirmation: 'CERTIFIED' },
		});

		expect(h.lastRequest().body).toMatchObject({
			extra: { signature_confirmation: 'CERTIFIED' },
		});
	});

	it('rejects a shipment with no parcels', async () => {
		const error = await h.failure<Error>(
			invoke(Shipments.create, {
				address_from: 'a',
				address_to: 'b',
				parcels: [],
			}),
		);

		expect(error.name).toBe('ZodError');
		expect(h.fetchMock).not.toHaveBeenCalled();
	});

	it('documents async as defaulting to true', async () => {
		h.respond(queuedShipment);

		await invoke(Shipments.create, {
			address_from: 'a',
			address_to: 'b',
			parcels: ['p'],
		});

		// The plugin does not send `async`, so Shippo applies its own default.
		expect(h.lastRequest().body).not.toHaveProperty('async');
	});

	it('lists the rates computed for a shipment', async () => {
		h.respond(paged([rate]));

		const result = await invoke(Shipments.rates, {
			shipment_id: SHIPMENT_ID,
		});

		expect(h.lastRequest().path).toBe(`/shipments/${SHIPMENT_ID}/rates`);
		expect(result.results[0]?.amount).toBe('5.93');
	});

	it('lists rates in a chosen currency', async () => {
		h.respond(paged([rate]));

		await invoke(Shipments.ratesInCurrency, {
			shipment_id: SHIPMENT_ID,
			currency_code: 'EUR',
		});

		expect(h.lastRequest().path).toBe(`/shipments/${SHIPMENT_ID}/rates/EUR`);
	});

	it('pages a shipment’s rates, in either currency form', async () => {
		h.respond(paged([rate]));
		await invoke(Shipments.rates, {
			shipment_id: SHIPMENT_ID,
			page: 2,
			results: 100,
		});
		expect(h.lastRequest().query).toEqual({ page: '2', results: '100' });

		h.respond(paged([rate]));
		await invoke(Shipments.ratesInCurrency, {
			shipment_id: SHIPMENT_ID,
			currency_code: 'EUR',
			page: 3,
		});
		expect(h.lastRequest().query).toEqual({ page: '3' });
	});

	it('rejects a currency code that is not three letters', async () => {
		const error = await h.failure<Error>(
			invoke(Shipments.ratesInCurrency, {
				shipment_id: SHIPMENT_ID,
				currency_code: 'EURO',
			}),
		);

		expect(error.name).toBe('ZodError');
	});
});

describe('rates', () => {
	it('gets one rate, logging provider and amount but not the id alone', async () => {
		h.respond(rate);

		await invoke(Rates.get, { rate_id: RATE_ID });

		expect(h.lastRequest().path).toBe(`/rates/${RATE_ID}`);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'shippo.rates.get',
			{ rateId: RATE_ID, provider: 'USPS', amount: '5.93' },
			'completed',
		);
	});
});

describe('transactions', () => {
	it('lists labels filterable by status', async () => {
		h.respond(paged([transaction]));

		await invoke(Transactions.list, {
			object_status: 'SUCCESS',
			tracking_status: 'TRANSIT',
		});

		expect(h.lastRequest().query).toEqual({
			object_status: 'SUCCESS',
			tracking_status: 'TRANSIT',
		});
	});

	it('gets one label', async () => {
		h.respond(transaction);

		const result = await invoke(Transactions.get, {
			transaction_id: TRANSACTION_ID,
		});

		expect(h.lastRequest().path).toBe(`/transactions/${TRANSACTION_ID}`);
		expect(result.label_url).toContain('shippo-delivery');
	});

	it('buys a label from a rate', async () => {
		h.respond(transaction);

		await invoke(Transactions.create, {
			rate: RATE_ID,
			label_file_type: 'PDF_4x6',
			async: false,
			metadata: 'Order ID #12345',
		});

		h.expectAuthenticated();
		expect(h.lastRequest()).toMatchObject({
			method: 'POST',
			path: '/transactions',
		});
		expect(h.lastRequest().body).toEqual({
			rate: RATE_ID,
			label_file_type: 'PDF_4x6',
			async: false,
			metadata: 'Order ID #12345',
		});
	});

	it('reads a label whose rate is the nested object an instant purchase returns', async () => {
		const nestedRate = {
			object_id: RATE_ID,
			amount: '5.50',
			currency: 'USD',
			provider: 'USPS',
			servicelevel_token: 'usps_priority',
		};
		h.respond(paged([{ ...transaction, rate: nestedRate }]));

		// A label bought from `shipment` + `carrier_account` + servicelevel
		// (in the dashboard or another client) carries the rate inline, and it
		// must not fail the whole list.
		const result = await invoke(Transactions.list, {});

		expect(result.results[0]?.rate).toMatchObject({ object_id: RATE_ID });
	});

	it('rejects a buy with no rate, which is the one required field', async () => {
		const error = await h.failure<Error>(
			invoke(Transactions.create, { label_file_type: 'PDF' }),
		);

		expect(error.name).toBe('ZodError');
		expect(h.fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an unknown label file type', async () => {
		const error = await h.failure<Error>(
			invoke(Transactions.create, {
				rate: RATE_ID,
				label_file_type: 'PDF_9x9',
			}),
		);

		expect(error.name).toBe('ZodError');
	});
});

describe('refunds', () => {
	it('lists with the trailing slash this route requires', async () => {
		h.respond(paged([refund]));

		await invoke(Refunds.list, {});

		// `/refunds` without the slash 404s.
		expect(h.lastRequest().path).toBe('/refunds/');
	});

	it('forwards paging, which this route honours despite the spec omitting it', async () => {
		h.respond(
			paged([refund], 'https://api.goshippo.com/refunds/?page=3&results=1'),
		);

		const result = await invoke(Refunds.list, { page: 2, results: 1 });

		expect(h.lastRequest().query).toEqual({ page: '2', results: '1' });
		// The next-page URL is exposed as sent, so a caller can read its page.
		expect(result.next).toContain('page=3');
	});

	it('gets one refund', async () => {
		h.respond(refund);

		await invoke(Refunds.get, { refund_id: refund.object_id });

		expect(h.lastRequest().path).toBe(`/refunds/${refund.object_id}`);
	});

	it('creates a refund for a transaction', async () => {
		h.respond(refund);

		await invoke(Refunds.create, {
			transaction: TRANSACTION_ID,
			async: false,
		});

		expect(h.lastRequest()).toMatchObject({
			method: 'POST',
			path: '/refunds',
		});
		expect(h.lastRequest().body).toEqual({
			transaction: TRANSACTION_ID,
			async: false,
		});
	});
});

describe('tracks', () => {
	it('gets a tracking status by carrier and number', async () => {
		h.respond(track);

		const result = await invoke(Tracks.get, {
			carrier: 'usps',
			tracking_number: '9205590164917312751089',
		});

		expect(h.lastRequest().path).toBe('/tracks/usps/9205590164917312751089');
		expect(result.tracking_status?.status).toBe('TRANSIT');
	});

	it('encodes a tracking number that contains a slash', async () => {
		h.respond(track);

		await invoke(Tracks.get, {
			carrier: 'dhl_express',
			tracking_number: 'JD014600003889/12/34',
		});

		expect(h.lastRequest().path).toBe(
			'/tracks/dhl_express/JD014600003889%2F12%2F34',
		);
	});

	it('registers a tracking number', async () => {
		h.respond(track);

		await invoke(Tracks.register, {
			carrier: 'usps',
			tracking_number: '9205590164917312751089',
			metadata: 'Order 000123',
		});

		expect(h.lastRequest()).toMatchObject({ method: 'POST', path: '/tracks' });
		expect(h.lastRequest().body).toEqual({
			carrier: 'usps',
			tracking_number: '9205590164917312751089',
			metadata: 'Order 000123',
		});
	});
});

describe('customs', () => {
	it('lists and gets customs items', async () => {
		h.respond(paged([customsItem]));
		await invoke(Customs.listItems, {});
		expect(h.lastRequest().path).toBe('/customs/items');

		h.respond(customsItem);
		await invoke(Customs.getItem, { customs_item_id: customsItem.object_id });
		expect(h.lastRequest().path).toBe(
			`/customs/items/${customsItem.object_id}`,
		);
	});

	it('creates a customs item', async () => {
		h.respond(customsItem);

		await invoke(Customs.createItem, {
			description: 'T-Shirt',
			quantity: 2,
			net_weight: '400',
			mass_unit: 'g',
			value_amount: '20',
			value_currency: 'USD',
			origin_country: 'US',
		});

		expect(h.lastRequest()).toMatchObject({
			method: 'POST',
			path: '/customs/items',
		});
	});

	it('lists and gets declarations', async () => {
		h.respond(paged([customsDeclaration]));
		await invoke(Customs.listDeclarations, {});
		expect(h.lastRequest().path).toBe('/customs/declarations');

		h.respond(customsDeclaration);
		await invoke(Customs.getDeclaration, {
			customs_declaration_id: customsDeclaration.object_id,
		});
		expect(h.lastRequest().path).toBe(
			`/customs/declarations/${customsDeclaration.object_id}`,
		);
	});

	it('creates a declaration and requires certify to be true', async () => {
		h.respond(customsDeclaration);

		await invoke(Customs.createDeclaration, {
			contents_type: 'MERCHANDISE',
			non_delivery_option: 'RETURN',
			certify: true,
			certify_signer: 'Shawn Ippotle',
			items: [customsItem.object_id],
		});

		expect(h.lastRequest()).toMatchObject({
			method: 'POST',
			path: '/customs/declarations',
		});

		const error = await h.failure<Error>(
			invoke(Customs.createDeclaration, {
				contents_type: 'MERCHANDISE',
				non_delivery_option: 'RETURN',
				certify: false,
				certify_signer: 'Shawn Ippotle',
				items: [customsItem.object_id],
			}),
		);
		// A declaration the signer did not certify is not a declaration.
		expect(error.name).toBe('ZodError');
	});

	it('reads a declaration whose items are ids, as the spec returns them', async () => {
		h.respond({ ...customsDeclaration, items: [customsItem.object_id] });

		const result = await invoke(Customs.getDeclaration, {
			customs_declaration_id: customsDeclaration.object_id,
		});

		expect(result.items).toEqual([customsItem.object_id]);
	});

	it('accepts every incoterm and exemption code the spec lists', async () => {
		for (const [incoterm, eel_pfc] of [
			['FCA', 'NOEEI_30_37_h'],
			['DAP', 'NOEEI_30_37_f'],
			['eDAP', 'AES_ITN'],
		]) {
			h.respond(customsDeclaration);
			await invoke(Customs.createDeclaration, {
				contents_type: 'MERCHANDISE',
				non_delivery_option: 'RETURN',
				certify: true,
				certify_signer: 'Shawn Ippotle',
				items: [customsItem.object_id],
				incoterm,
				eel_pfc,
			});
			expect(h.lastRequest().body).toMatchObject({ incoterm, eel_pfc });
		}
	});

	it('sends the importer address as the object the spec documents', async () => {
		h.respond(customsDeclaration);
		await invoke(Customs.createDeclaration, {
			contents_type: 'MERCHANDISE',
			non_delivery_option: 'RETURN',
			certify: true,
			certify_signer: 'Shawn Ippotle',
			items: [customsItem.object_id],
			address_importer: { name: 'Mr Hippo', city: 'München', country: 'DE' },
		});

		expect(h.lastRequest().body).toMatchObject({
			address_importer: { name: 'Mr Hippo', city: 'München', country: 'DE' },
		});
	});

	it('rejects an unknown contents type', async () => {
		const error = await h.failure<Error>(
			invoke(Customs.createDeclaration, {
				contents_type: 'PRESENTS',
				non_delivery_option: 'RETURN',
				certify: true,
				certify_signer: 'X',
				items: ['i'],
			}),
		);

		expect(error.name).toBe('ZodError');
	});
});

describe('batches', () => {
	it('creates a batch with per-shipment carrier and servicelevel', async () => {
		h.respond(batch);

		await invoke(Batches.create, {
			batch_shipments: [
				{ shipment: SHIPMENT_ID, servicelevel_token: 'usps_priority' },
			],
			default_carrier_account: carrierAccount.object_id,
		});

		expect(h.lastRequest()).toMatchObject({
			method: 'POST',
			path: '/batches',
		});
	});

	it('rejects a batch where no carrier can be resolved', async () => {
		const error = await h.failure<Error>(
			invoke(Batches.create, {
				batch_shipments: [{ shipment: SHIPMENT_ID }],
			}),
		);

		expect(error.name).toBe('ZodError');
		expect(h.fetchMock).not.toHaveBeenCalled();
	});

	it('accepts a batch that sets both defaults on the batch itself', async () => {
		h.respond(batch);

		await invoke(Batches.create, {
			default_carrier_account: carrierAccount.object_id,
			default_servicelevel_token: 'usps_priority',
			batch_shipments: [{ shipment: SHIPMENT_ID }],
		});

		expect(h.lastRequest().method).toBe('POST');
	});

	it('gets, adds to, removes from and purchases a batch', async () => {
		h.respond(batch);
		await invoke(Batches.get, { batch_id: batch.object_id });
		expect(h.lastRequest().path).toBe(`/batches/${batch.object_id}`);

		h.respond(batch);
		await invoke(Batches.addShipments, {
			batch_id: batch.object_id,
			shipments: [{ shipment: 'another-shipment' }],
		});
		expect(h.lastRequest().path).toBe(
			`/batches/${batch.object_id}/add_shipments`,
		);
		// The spec's request body is a bare array of batch shipments, not an
		// object wrapping one.
		expect(h.lastRequest().body).toEqual([{ shipment: 'another-shipment' }]);

		h.respond(batch);
		await invoke(Batches.removeShipments, {
			batch_id: batch.object_id,
			shipments: ['another-shipment'],
		});
		expect(h.lastRequest().path).toBe(
			`/batches/${batch.object_id}/remove_shipments`,
		);
		// Likewise a bare array of shipment ids.
		expect(h.lastRequest().body).toEqual(['another-shipment']);

		h.respond(purchasedBatch);
		const purchased = await invoke(Batches.purchase, {
			batch_id: batch.object_id,
		});
		expect(h.lastRequest().path).toBe(`/batches/${batch.object_id}/purchase`);
		expect(purchased.label_url).toHaveLength(1);
	});
});

describe('batch paging and nested shipments', () => {
	it('pages the shipments inside a batch', async () => {
		h.respond(batch);
		await invoke(Batches.get, {
			batch_id: batch.object_id,
			page: 2,
			results: 50,
		});

		// A batch holds its shipments as a paged list, so without these a
		// caller only ever sees the first page of per-shipment results.
		expect(h.lastRequest().query).toEqual({ page: '2', results: '50' });
	});

	it('accepts a nested shipment as well as a shipment id', async () => {
		h.respond(batch);
		await invoke(Batches.create, {
			default_carrier_account: '078870331023437cb917f5187429b093',
			default_servicelevel_token: 'usps_priority',
			batch_shipments: [
				{
					shipment: {
						address_from: ADDRESS_ID,
						address_to: { country: 'US', name: 'Mr Hippo', street1: '1 Main' },
						parcels: ['parcel-id'],
					},
				},
			],
		});

		expect(h.lastRequest().body).toMatchObject({
			batch_shipments: [
				{ shipment: { address_from: ADDRESS_ID, parcels: ['parcel-id'] } },
			],
		});
	});
});

describe('orders', () => {
	it('lists orders with the bracket-notation status filter', async () => {
		h.respond(paged([order]));

		await invoke(Orders.list, {
			order_status: ['PAID', 'SHIPPED'],
			start_date: '2026-01-01T00:00:00Z',
			end_date: '2026-02-01T00:00:00Z',
		});

		// An array query parameter with no `style` is form-exploded in OpenAPI:
		// one `order_status[]=` per value, not a comma-joined list.
		const [url] = h.fetchMock.mock.calls.at(-1) as [string];
		expect(new URL(url).searchParams.getAll('order_status[]')).toEqual([
			'PAID',
			'SHIPPED',
		]);
		expect(url).toContain('order_status%5B%5D=PAID&order_status%5B%5D=SHIPPED');
		expect(h.lastRequest().query).toMatchObject({
			// `start_date`/`end_date`, the API's own names. Shippo ignores an
			// unknown query parameter and answers 200, so inventing
			// `placed_at_gte` would filter nothing and look like it worked.
			start_date: '2026-01-01T00:00:00Z',
			end_date: '2026-02-01T00:00:00Z',
		});
	});

	it('gets one order, logging the id and status only', async () => {
		h.respond(order);

		await invoke(Orders.get, { order_id: order.object_id });

		expect(h.lastRequest().path).toBe(`/orders/${order.object_id}`);
		// The order carries a buyer name and address; neither is logged.
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'shippo.orders.get',
			{ orderId: order.object_id, status: 'PAID' },
			'completed',
		);
	});

	it('creates an order with line items', async () => {
		h.respond(order);

		await invoke(Orders.create, {
			order_number: '#1068',
			placed_at: '2026-01-01T00:00:00Z',
			currency: 'USD',
			to_address: { name: 'Recipient', country: 'US' },
			line_items: [
				{
					title: 'T-Shirt',
					quantity: 2,
					total_price: '12.50',
					currency: 'USD',
				},
			],
		});

		expect(h.lastRequest()).toMatchObject({
			method: 'POST',
			path: '/orders',
		});
	});

	it('rejects an order with no line items', async () => {
		const error = await h.failure<Error>(
			invoke(Orders.create, {
				order_number: '#1',
				placed_at: '2026-01-01T00:00:00Z',
				currency: 'USD',
				to_address: 'addr',
				line_items: [],
			}),
		);

		expect(error.name).toBe('ZodError');
	});
});

describe('pickups and manifests', () => {
	it('creates a pickup and rejects a window that ends before it starts', async () => {
		h.respond(pickup);

		const result = await invoke(Pickups.create, {
			carrier_account: carrierAccount.object_id,
			location: PICKUP_LOCATION,
			transactions: [TRANSACTION_ID],
			requested_start_time: '2026-07-21T12:00:00Z',
			requested_end_time: '2026-07-21T18:00:00Z',
		});

		expect(h.lastRequest()).toMatchObject({
			method: 'POST',
			path: '/pickups',
		});
		// The spec's `Location`: a full address plus where on the premises to
		// collect. An address id is not a field of it, and neither is a
		// timezone on the request.
		expect(h.lastRequest().body).toEqual({
			carrier_account: carrierAccount.object_id,
			location: PICKUP_LOCATION,
			transactions: [TRANSACTION_ID],
			requested_start_time: '2026-07-21T12:00:00Z',
			requested_end_time: '2026-07-21T18:00:00Z',
		});
		// `messages` is an array of strings in the spec.
		expect(result.messages).toEqual(['Pickup confirmed']);

		const error = await h.failure<Error>(
			invoke(Pickups.create, {
				carrier_account: carrierAccount.object_id,
				location: PICKUP_LOCATION,
				transactions: [TRANSACTION_ID],
				requested_start_time: '2026-07-21T18:00:00Z',
				requested_end_time: '2026-07-21T12:00:00Z',
			}),
		);
		expect(error.name).toBe('ZodError');
	});

	it('rejects a pickup location with no address or door', async () => {
		const noAddress = await h.failure<Error>(
			invoke(Pickups.create, {
				carrier_account: carrierAccount.object_id,
				location: { building_location_type: 'Front Door' },
				transactions: [TRANSACTION_ID],
				requested_start_time: '2026-07-21T12:00:00Z',
				requested_end_time: '2026-07-21T18:00:00Z',
			}),
		);
		expect(noAddress.name).toBe('ZodError');

		const noDoor = await h.failure<Error>(
			invoke(Pickups.create, {
				carrier_account: carrierAccount.object_id,
				location: { address: PICKUP_LOCATION.address },
				transactions: [TRANSACTION_ID],
				requested_start_time: '2026-07-21T12:00:00Z',
				requested_end_time: '2026-07-21T18:00:00Z',
			}),
		);
		expect(noDoor.name).toBe('ZodError');
		expect(h.fetchMock).not.toHaveBeenCalled();
	});

	it('lists, gets and creates manifests', async () => {
		h.respond(paged([manifest]));
		await invoke(Pickups.listManifests, {});
		expect(h.lastRequest().path).toBe('/manifests');

		h.respond(manifest);
		await invoke(Pickups.getManifest, { manifest_id: manifest.object_id });
		expect(h.lastRequest().path).toBe(`/manifests/${manifest.object_id}`);

		// `errors` is an array of strings in the spec.
		h.respond({ ...manifest, status: 'ERROR', errors: ['Invalid shipment'] });
		const failed = await invoke(Pickups.getManifest, {
			manifest_id: manifest.object_id,
		});
		expect(failed.errors).toEqual(['Invalid shipment']);

		h.respond(manifest);
		await invoke(Pickups.createManifest, {
			carrier_account: carrierAccount.object_id,
			shipment_date: '2026-07-21T12:00:00Z',
			transactions: [TRANSACTION_ID],
			address_from: ADDRESS_ID,
		});
		expect(h.lastRequest()).toMatchObject({
			method: 'POST',
			path: '/manifests',
		});
	});
});

describe('carrier accounts', () => {
	it('lists and gets carrier accounts', async () => {
		h.respond(paged([carrierAccount]));
		await invoke(CarrierAccounts.list, {});
		expect(h.lastRequest().path).toBe('/carrier_accounts');

		h.respond(carrierAccount);
		await invoke(CarrierAccounts.get, {
			carrier_account_id: carrierAccount.object_id,
		});
		expect(h.lastRequest().path).toBe(
			`/carrier_accounts/${carrierAccount.object_id}`,
		);
	});

	it('creates and updates with PUT', async () => {
		h.respond(carrierAccount);
		await invoke(CarrierAccounts.create, {
			carrier: 'fedex',
			account_id: '321123',
			parameters: { first_name: 'Shwan' },
		});
		expect(h.lastRequest()).toMatchObject({
			method: 'POST',
			path: '/carrier_accounts',
		});
		// `account_id` is one of the three fields the spec requires.
		expect(h.lastRequest().body).toEqual({
			carrier: 'fedex',
			account_id: '321123',
			parameters: { first_name: 'Shwan' },
		});

		h.respond(carrierAccount);
		await invoke(CarrierAccounts.update, {
			carrier_account_id: carrierAccount.object_id,
			account_id: '321123',
			carrier: 'fedex',
			active: false,
		});
		expect(h.lastRequest()).toMatchObject({
			method: 'PUT',
			path: `/carrier_accounts/${carrierAccount.object_id}`,
		});
		// The spec lists `account_id` and `carrier` as required on the PUT, so
		// a caller must be able to send them.
		expect(h.lastRequest().body).toEqual({
			account_id: '321123',
			carrier: 'fedex',
			active: false,
		});
	});

	it('rejects a new carrier account with no account_id', async () => {
		const error = await h.failure<Error>(
			invoke(CarrierAccounts.create, {
				carrier: 'fedex',
				parameters: { first_name: 'Shwan' },
			}),
		);

		expect(error.name).toBe('ZodError');
		expect(h.fetchMock).not.toHaveBeenCalled();
	});

	it('pages the carrier account list', async () => {
		h.respond(paged([carrierAccount]));
		await invoke(CarrierAccounts.list, { page: 2, results: 50 });

		expect(h.lastRequest().query).toEqual({ page: '2', results: '50' });
	});

	it('registers a Shippo-supplied carrier and reads its status', async () => {
		h.respond(carrierAccount);
		await invoke(CarrierAccounts.register, {
			carrier: 'usps',
			parameters: { account_number: '1234567890' },
		});
		expect(h.lastRequest().path).toBe('/carrier_accounts/register/new');

		// The spec's field is `status`.
		h.respond({
			carrier_account: carrierAccount.object_id,
			status: 'PENDING_TERMS',
		});
		await invoke(CarrierAccounts.registrationStatus, { carrier: 'usps' });
		expect(h.lastRequest().path).toBe('/carrier_accounts/reg-status');
		expect(h.lastRequest().query).toEqual({ carrier: 'usps' });
		expect(mockLog).toHaveBeenLastCalledWith(
			expect.anything(),
			'shippo.carrierAccounts.registrationStatus',
			{ carrier: 'usps', status: 'PENDING_TERMS' },
			'completed',
		);
	});
});

describe('parcel templates', () => {
	it('lists and gets carrier templates', async () => {
		h.respond({ results: [carrierParcelTemplate] });
		await invoke(ParcelTemplates.listCarrierTemplates, {});
		expect(h.lastRequest().path).toBe('/parcel-templates');

		h.respond(carrierParcelTemplate);
		await invoke(ParcelTemplates.getCarrierTemplate, {
			carrier_parcel_template_token: 'USPS_FlatRateGiftBox',
		});
		expect(h.lastRequest().path).toBe('/parcel-templates/USPS_FlatRateGiftBox');
	});

	it('deletes a user template that answers 204 with no body', async () => {
		// Shippo's deletes send no payload, so a schema requiring an object threw
		// on every successful delete.
		h.fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));

		const result = await invoke(ParcelTemplates.remove, {
			user_parcel_template_id: userParcelTemplate.object_id,
		});

		expect(result).toEqual({ deleted: true, object_id: undefined });
	});

	it('lists, creates, updates and deletes user templates', async () => {
		h.respond(paged([userParcelTemplate]));
		await invoke(ParcelTemplates.list, {});
		expect(h.lastRequest().path).toBe('/user-parcel-templates');

		h.respond(userParcelTemplate);
		await invoke(ParcelTemplates.create, {
			name: 'My 5x5x5 box',
			length: '5',
			width: '5',
			height: '5',
			distance_unit: 'in',
			weight: '12',
			weight_unit: 'lb',
		});
		expect(h.lastRequest().method).toBe('POST');

		h.respond(userParcelTemplate);
		await invoke(ParcelTemplates.update, {
			user_parcel_template_id: userParcelTemplate.object_id,
			name: 'Renamed',
		});
		expect(h.lastRequest()).toMatchObject({
			method: 'PUT',
			path: `/user-parcel-templates/${userParcelTemplate.object_id}`,
		});

		h.fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));
		await invoke(ParcelTemplates.remove, {
			user_parcel_template_id: userParcelTemplate.object_id,
		});
		expect(h.lastRequest()).toMatchObject({
			method: 'DELETE',
			path: `/user-parcel-templates/${userParcelTemplate.object_id}`,
		});
	});
});

describe('webhooks', () => {
	it('forwards paging, which this route honours despite the spec omitting it', async () => {
		h.respond(
			paged([webhook], 'https://api.goshippo.com/webhooks?page=2&results=2'),
		);

		await invoke(Webhooks.list, { page: 1, results: 2 });

		expect(h.lastRequest().query).toEqual({ page: '1', results: '2' });
	});

	it('lists, gets and creates subscriptions', async () => {
		h.respond(paged([webhook]));
		await invoke(Webhooks.list, {});
		expect(h.lastRequest().path).toBe('/webhooks');

		h.respond(webhook);
		await invoke(Webhooks.get, { webhook_id: webhook.object_id });
		expect(h.lastRequest().path).toBe(`/webhooks/${webhook.object_id}`);

		h.respond(webhook);
		await invoke(Webhooks.create, {
			url: 'https://myapp.com/webhooks/shippo',
			event: 'track_updated',
		});
		expect(h.lastRequest()).toMatchObject({
			method: 'POST',
			path: '/webhooks',
		});
		expect(h.lastRequest().body).toEqual({
			url: 'https://myapp.com/webhooks/shippo',
			event: 'track_updated',
		});
	});

	it('rejects an event Shippo does not emit', async () => {
		const error = await h.failure<Error>(
			invoke(Webhooks.create, {
				url: 'https://myapp.com/hook',
				event: 'label_printed',
			}),
		);

		expect(error.name).toBe('ZodError');
		expect(h.fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a URL that is not http(s)', async () => {
		const error = await h.failure<Error>(
			invoke(Webhooks.create, {
				url: 'ftp://myapp.com/hook',
				event: 'track_updated',
			}),
		);

		expect(error.name).toBe('ZodError');
	});

	it('updates with PUT and deletes', async () => {
		h.respond({ ...webhook, active: false });
		const updated = await invoke(Webhooks.update, {
			webhook_id: webhook.object_id,
			active: false,
		});
		expect(h.lastRequest()).toMatchObject({
			method: 'PUT',
			path: `/webhooks/${webhook.object_id}`,
		});
		expect(updated.active).toBe(false);

		// 204, no body: the old schema threw on this.
		h.fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));
		const deleted = await invoke(Webhooks.remove, {
			webhook_id: webhook.object_id,
		});
		expect(h.lastRequest().method).toBe('DELETE');
		expect(deleted).toEqual({ deleted: true, object_id: undefined });
	});
});

describe('managed accounts', () => {
	it('sends SHIPPO-ACCOUNT-ID when an operation names one', async () => {
		h.respond(paged([address]));

		await invoke(Addresses.list, {
			shippo_account_id: 'managed-account-id',
		});

		expect(h.lastRequest().headers.get('shippo-account-id')).toBe(
			'managed-account-id',
		);
	});

	it('omits the header when none is named', async () => {
		h.respond(paged([address]));

		await invoke(Addresses.list, {});

		expect(h.lastRequest().headers.get('shippo-account-id')).toBeNull();
	});
});
