import { makeShipEngineRequest } from './client';
import { shipEngineEndpointMeta } from './endpoints/config';
import { SHIPENGINE_OPERATIONS } from './endpoints/operations';
import {
	ShipEngineEndpointInputSchemas,
	ShipEngineEndpointOutputSchemas,
} from './endpoints/types';

// Trimmed from ShipEngine sandbox responses recorded on 2026-11-15; ids and account values replaced.
const liveCarriers = {
	carriers: [
		{
			carrier_id: 'se-100001',
			carrier_code: 'stamps_com',
			account_number: 'test_account',
			requires_funded_amount: true,
			balance: 100,
			nickname: 'Test Account',
			friendly_name: 'Stamps.com',
			primary: false,
			has_multi_package_supporting_services: false,
			allows_returns: true,
			supports_prepaid_duties_taxes: false,
			supported_duties_and_taxes_payments: ['carrier_billed'],
			supports_label_messages: true,
			disabled_by_billing_plan: false,
			services: [
				{
					carrier_id: 'se-100001',
					carrier_code: 'stamps_com',
					service_code: 'usps_priority_mail',
					name: 'USPS Priority Mail',
					domestic: true,
					international: false,
					is_multi_package_supported: false,
					is_return_supported: true,
					is_prepaid_duties_taxes_supported: false,
					supported_duties_and_taxes_payments: [],
					send_rates: true,
					display_schemes: ['label', 'paperless'],
				},
			],
			packages: [
				{
					package_id: null,
					package_code: 'flat_rate_envelope',
					name: 'Flat Rate Envelope',
					dimensions: { unit: 'inch', length: 12.5, width: 9.5, height: 0.25 },
					description: 'USPS flat rate envelope.',
				},
			],
			options: [
				{ name: 'non_machinable', default_value: 'false', description: '' },
				{
					name: 'canada_delivered_duty',
					default_value: null,
					description: 'x',
				},
			],
			funding_source_id: null,
			supports_user_managed_rates: false,
			send_rates: true,
		},
	],
	total: 1,
	page: 1,
	page_size: 1,
	pages: 1,
	links: {
		first: { href: 'https://api.shipengine.com/v1/carriers?page=1' },
		last: { href: 'https://api.shipengine.com/v1/carriers?page=1' },
		prev: {},
		next: {},
	},
	request_id: '4efc9447-c34a-4b12-8b31-6ebc175daae2',
	errors: [],
};

const liveBatch = {
	label_layout: null,
	label_format: 'pdf',
	batch_id: 'se-200001',
	batch_number: '1',
	external_batch_id: '1daa0c22-0519-46d0-8653-9f3dc62e7d2c',
	batch_notes: 'corsair-plugin-test',
	created_at: '2026-11-15T01:40:00.000Z',
	processed_at: null,
	errors: 0,
	process_errors: null,
	warnings: 0,
	completed: 0,
	forms: 0,
	count: 1,
	batch_shipments_url: {
		href: 'https://api.shipengine.com/v1/shipments?batch_id=se-200001',
	},
	batch_labels_url: {
		href: 'https://api.shipengine.com/v1/labels?batch_id=se-200001',
	},
	batch_errors_url: {
		href: 'https://api.shipengine.com/v1/batches/se-200001/errors',
	},
	label_download: { href: 'https://api.shipengine.com/v1/downloads/x.pdf' },
	form_download: { href: 'https://api.shipengine.com/v1/downloads/y.pdf' },
	packing_slip_download: null,
	assigned_user: null,
	status: 'open',
};

const liveShipmentRates = [
	{
		rates: [],
		invalid_rates: [],
		rate_request_id: 'se-300001',
		shipment_id: 'se-400001',
		created_at: '2026-11-15T01:41:00.000Z',
		status: 'completed',
		errors: [],
	},
];

function mockJson(value: unknown) {
	// `unknown` because each fixture is serialized as a raw provider response.
	return jest.spyOn(globalThis, 'fetch').mockResolvedValue(
		new Response(JSON.stringify(value), {
			status: 200,
			headers: { 'content-type': 'application/json' },
		}),
	);
}

const address = {
	name: 'Test',
	phone: '512-555-0100',
	address_line1: '1 Example St',
	city_locality: 'Austin',
	state_province: 'TX',
	postal_code: '78756',
	country_code: 'US',
};

describe('ShipEngine live response shapes', () => {
	afterEach(() => jest.restoreAllMocks());

	it('reads carriers that carry nulls and fields the contract does not list', async () => {
		expect(
			ShipEngineEndpointOutputSchemas['carriers.listCarriers'].safeParse(
				liveCarriers,
			).success,
		).toBe(false);
		mockJson(liveCarriers);
		const response = await makeShipEngineRequest(
			'carriers.listCarriers',
			'test-api-key',
			{},
		);
		const carrier = response.carriers?.[0];
		expect(carrier?.carrier_code).toBe('stamps_com');
		expect(carrier?.packages?.[0]?.package_id).toBeNull();
		expect(carrier?.packages?.[0]?.description).toBe(
			'USPS flat rate envelope.',
		);
		expect(carrier?.services?.[0]?.send_rates).toBe(true);
	});

	it('creates a batch with the caller’s own UUID external_batch_id and an unprocessed label_layout', async () => {
		const fetchMock = mockJson(liveBatch);
		const response = await makeShipEngineRequest(
			'batches.createBatch',
			'test-api-key',
			{
				body: {
					external_batch_id: '1daa0c22-0519-46d0-8653-9f3dc62e7d2c',
					batch_notes: 'corsair-plugin-test',
					shipment_ids: ['se-400001'],
				},
			},
		);
		expect(response.batch_id).toBe('se-200001');
		expect(response.label_layout).toBeNull();
		expect(JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))).toEqual({
			external_batch_id: '1daa0c22-0519-46d0-8653-9f3dc62e7d2c',
			batch_notes: 'corsair-plugin-test',
			shipment_ids: ['se-400001'],
		});
	});

	it('returns the array of rate responses that GET /v1/shipments/{id}/rates sends', async () => {
		mockJson(liveShipmentRates);
		const response = await makeShipEngineRequest(
			'shipments.listShipmentRates',
			'test-api-key',
			{ path: { shipment_id: 'se-400001' } },
		);
		expect(Array.isArray(response)).toBe(true);
		expect(response[0]?.rate_request_id).toBe('se-300001');
	});

	it('accepts rate shopping with an inline shipment and no service selected', () => {
		const input = {
			body: {
				rate_options: { carrier_ids: ['se-100001'] },
				shipment: {
					ship_from: address,
					ship_to: address,
					packages: [{ weight: { value: 20, unit: 'ounce' } }],
				},
			},
		};
		expect(
			ShipEngineEndpointInputSchemas['rates.calculateRates'].safeParse(input)
				.success,
		).toBe(true);
		expect(
			ShipEngineEndpointInputSchemas['rates.compareBulkRates'].safeParse({
				body: {
					rate_options: input.body.rate_options,
					shipments: [input.body.shipment],
				},
			}).success,
		).toBe(true);
	});

	it('names the operation and field paths, never response values, when a response has the wrong type', async () => {
		mockJson({ carriers: '1 Private Road, Example City' });
		await expect(
			makeShipEngineRequest('carriers.listCarriers', 'test-api-key', {}),
		).rejects.toThrow(
			'ShipEngine returned an unexpected response for carriers.listCarriers at carriers',
		);
		mockJson({ carriers: '1 Private Road, Example City' });
		await expect(
			makeShipEngineRequest('carriers.listCarriers', 'test-api-key', {}),
		).rejects.not.toThrow('Private Road');
	});

	it('marks manifest creation destructive because manifested labels may not be voidable', () => {
		expect(SHIPENGINE_OPERATIONS['manifests.createManifest'].risk).toBe(
			'destructive',
		);
		expect(shipEngineEndpointMeta['manifests.createManifest'].riskLevel).toBe(
			'destructive',
		);
	});

	it('marks label voiding destructive because a voided label cannot be unvoided', () => {
		expect(SHIPENGINE_OPERATIONS['labels.voidLabel'].risk).toBe('destructive');
		expect(shipEngineEndpointMeta['labels.voidLabel'].riskLevel).toBe(
			'destructive',
		);
	});
});
