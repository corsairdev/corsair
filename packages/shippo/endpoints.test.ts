import {
	Addresses,
	Batches,
	Shipments,
	Tracks,
	Transactions,
} from './endpoints';
import {
	address,
	errorTransaction,
	incompleteAddress,
	paged,
	queuedShipment,
	queuedTransaction,
	shipment,
	track,
	transaction,
} from './test-fixtures';
import { createHarness, invoke } from './test-helpers';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const h = createHarness();

beforeEach(() => {
	h.mockFetch();
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('output parsing', () => {
	it('keeps weights and dimensions as the strings the API sends', async () => {
		h.respond(shipment);

		const result = await invoke(Shipments.get, { shipment_id: '1' });

		const parcel = result.parcels?.[0];
		expect(parcel?.weight).toBe('12');
		expect(parcel?.length).toBe('5');
		// A schema that coerced these to numbers would change what a caller sends back.
		expect(typeof parcel?.weight).toBe('string');
	});

	it('reads a rate amount as a string, not a float', async () => {
		h.respond(shipment);

		const result = await invoke(Shipments.get, { shipment_id: '1' });

		const rate = result.rates?.[0];
		expect(rate?.amount).toBe('5.93');
		expect(rate?.servicelevel?.token).toBe('usps_priority');
	});

	it('parses an async shipment that has no rates yet', async () => {
		h.respond(queuedShipment);

		const result = await invoke(Shipments.get, { shipment_id: '1' });

		expect(result.status).toBe('QUEUED');
		expect(result.rates).toEqual([]);
	});

	it('parses a bought label with its tracking status', async () => {
		h.respond(transaction);

		const result = await invoke(Transactions.get, { transaction_id: '1' });

		expect(result.status).toBe('SUCCESS');
		expect(result.tracking_status?.status).toBe('DELIVERED');
		expect(result.label_file_type).toBe('PDF_4x6');
	});

	it('parses a label still being bought, which has no label_url', async () => {
		h.respond(queuedTransaction);

		const result = await invoke(Transactions.get, { transaction_id: '1' });

		expect(result.status).toBe('QUEUED');
		expect(result.label_url).toBeNull();
	});

	it('parses a failed label and keeps the carrier’s reason', async () => {
		h.respond(errorTransaction);

		const result = await invoke(Transactions.get, { transaction_id: '1' });

		expect(result.status).toBe('ERROR');
		expect(result.messages?.[0]?.text).toContain('not valid');
	});

	it('reads an address that failed validation without failing the parse', async () => {
		h.respond(incompleteAddress);

		const result = await invoke(Addresses.get, { address_id: '1' });

		expect(result.is_complete).toBe(false);
		expect(result.validation_results?.is_valid).toBe(false);
		expect(result.validation_results?.messages?.[0]?.type).toBe(
			'address_error',
		);
	});

	it('keeps a warning message on an address that is valid', async () => {
		h.respond(address);

		const result = await invoke(Addresses.get, { address_id: '1' });

		expect(result.validation_results?.is_valid).toBe(true);
		expect(result.validation_results?.messages?.[0]?.code).toBe(
			'Default Match',
		);
	});

	it('maps the track history in order', async () => {
		h.respond(track);

		const result = await invoke(Tracks.get, {
			carrier: 'usps',
			tracking_number: '1',
		});

		expect(result.tracking_status?.status).toBe('TRANSIT');
		expect(result.tracking_history).toHaveLength(1);
		expect(result.tracking_history?.[0]?.status).toBe('PRE_TRANSIT');
	});

	it('keeps unknown fields, so a field Shippo adds still arrives', async () => {
		h.respond({ ...shipment, a_field_added_later: 'kept' });

		const result = await invoke(Shipments.get, { shipment_id: '1' });

		// unknown: the field is not in the schema, which is the point.
		expect((result as Record<string, string>).a_field_added_later).toBe('kept');
	});

	it('fails a list whose `results` is not an array', async () => {
		// A body without `results` must not be read as an empty page.
		h.respond({ next: null, previous: null });

		const error = await h.failure<Error>(invoke(Addresses.list, {}));

		expect(error.name).toBe('ZodError');
	});

	it('fails a list element that is a bare string', async () => {
		h.respond({ next: null, previous: null, results: ['not-an-address'] });

		const error = await h.failure<Error>(invoke(Addresses.list, {}));

		expect(error.name).toBe('ZodError');
	});

	it('fails a known field with the wrong type', async () => {
		h.respond({ ...address, is_complete: 'yes' });

		const error = await h.failure<Error>(
			invoke(Addresses.get, { address_id: '1' }),
		);

		expect(error.name).toBe('ZodError');
	});

	it('fails a track status outside the documented enum', async () => {
		h.respond({
			...track,
			tracking_status: { ...track.tracking_status, status: 7 },
		});

		const error = await h.failure<Error>(
			invoke(Tracks.get, { carrier: 'usps', tracking_number: '1' }),
		);

		expect(error.name).toBe('ZodError');
	});

	it('accepts an empty page as a real empty page', async () => {
		h.respond(paged([]));

		const result = await invoke(Addresses.list, {});

		expect(result.results).toEqual([]);
		expect(result.next).toBeNull();
	});

	it('exposes the next-page URL as sent, not a rewritten cursor', async () => {
		h.respond(
			paged([address], 'https://api.goshippo.com/addresses?page=3&results=5'),
		);

		const result = await invoke(Addresses.list, {});

		expect(result.next).toBe(
			'https://api.goshippo.com/addresses?page=3&results=5',
		);
	});

	it('parses a batch with its per-shipment results', async () => {
		h.respond({
			object_id: 'batch-id',
			status: 'VALID',
			batch_shipments: {
				next: null,
				previous: null,
				results: [{ object_id: 'bs1', shipment: 's1', status: 'VALID' }],
			},
			object_results: { purchase_failed: 0, purchase_succeeded: 0 },
		});

		const result = await invoke(Batches.get, { batch_id: 'batch-id' });

		expect(result.batch_shipments?.results?.[0]?.status).toBe('VALID');
	});
});
