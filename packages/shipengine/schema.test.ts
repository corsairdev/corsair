import {
	shipEngineEndpointMeta,
	shipEngineEndpointSchemas,
} from './endpoints/config';
import { SHIPENGINE_OPERATION_NAMES } from './endpoints/operations';
import {
	ShipEngineEndpointInputSchemas,
	ShipEngineEndpointOutputSchemas,
} from './endpoints/types';
import { ShipEngineSchema } from './schema';

describe('ShipEngine schemas', () => {
	it('declares an empty persistence schema with a semver version', () => {
		expect(ShipEngineSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(ShipEngineSchema.entities).toEqual({});
	});

	it('registers input/output schemas and metadata for all 92 non-webhook operations', () => {
		expect(Object.keys(ShipEngineEndpointInputSchemas)).toHaveLength(92);
		expect(Object.keys(ShipEngineEndpointOutputSchemas)).toEqual(
			SHIPENGINE_OPERATION_NAMES,
		);
		expect(Object.keys(shipEngineEndpointSchemas)).toEqual(
			SHIPENGINE_OPERATION_NAMES,
		);
		expect(Object.keys(shipEngineEndpointMeta)).toEqual(
			SHIPENGINE_OPERATION_NAMES,
		);
		expect(
			SHIPENGINE_OPERATION_NAMES.some((name) => name.includes('Webhook')),
		).toBe(false);
	});

	it('accepts the documented inputs the generated contract dropped or mislabelled', () => {
		const shipTo = {
			name: 'Test Person',
			phone: '5555555555',
			address_line1: '525 S Winchester Blvd',
			city_locality: 'San Jose',
			state_province: 'CA',
			postal_code: '95128',
			country_code: 'US',
		};
		const createShipments =
			ShipEngineEndpointInputSchemas['shipments.createShipments'];
		// warehouse_id in place of ship_from (accepted by the live API), item
		// descriptions on products and customs items, and one label reference.
		expect(
			createShipments.safeParse({
				body: {
					shipments: [
						{
							carrier_id: 'se-1875518',
							service_code: 'usps_priority_mail',
							warehouse_id: 'se-1265587',
							ship_to: shipTo,
							packages: [
								{
									weight: { value: 1, unit: 'pound' },
									label_messages: { reference1: 'Order 123' },
									products: [{ description: 'T-shirt', quantity: 1 }],
								},
							],
							customs: {
								contents: 'merchandise',
								non_delivery: 'return_to_sender',
								customs_items: [{ description: 'T-shirt', quantity: 1 }],
							},
						},
					],
				},
			}).success,
		).toBe(true);
		const neither = createShipments.safeParse({
			body: { shipments: [{ ship_to: shipTo }] },
		});
		expect(neither.success).toBe(false);
		expect(neither.error?.issues[0]?.message).toBe(
			'Set ship_from or warehouse_id.',
		);
		expect(
			ShipEngineEndpointInputSchemas[
				'packageTypes.createPackageType'
			].safeParse({
				body: {
					package_code: 'laptop_box',
					name: 'Laptop box',
					description: 'Packaging for laptops',
				},
			}).success,
		).toBe(true);
		const connectCarrier =
			ShipEngineEndpointInputSchemas['carrierAccounts.connectCarrier'];
		expect(
			connectCarrier.safeParse({
				path: { carrier_name: 'sendle' },
				body: { nickname: 'n', sendle_id: '123456789', api_key: 'k' },
			}).success,
		).toBe(true);
		expect(
			connectCarrier.safeParse({
				path: { carrier_name: 'firstmile' },
				body: { nickname: 'n', mailer_id: 'FM12345', password: 'p' },
			}).success,
		).toBe(true);
	});

	it('rejects undocumented endpoint input fields before transport', () => {
		for (const operationName of SHIPENGINE_OPERATION_NAMES) {
			expect(
				ShipEngineEndpointInputSchemas[operationName].safeParse({
					undocumented_callback: {},
				}).success,
			).toBe(false);
		}
	});

	it('validates documented enums, field requirements, and response envelopes', () => {
		const listLabels = ShipEngineEndpointInputSchemas['labels.listLabels'];
		expect(
			listLabels.safeParse({ query: { label_status: 'completed' } }).success,
		).toBe(true);
		expect(
			listLabels.safeParse({ query: { label_status: 'shipped' } }).success,
		).toBe(false);
		expect(
			ShipEngineEndpointInputSchemas['addresses.validateAddress'].safeParse({
				body: [
					{
						address_line1: '123 Example St',
						city_locality: 'Example City',
						state_province: 'CA',
						country_code: 'US',
					},
				],
			}).success,
		).toBe(true);
		expect(
			ShipEngineEndpointInputSchemas['addresses.validateAddress'].safeParse({
				body: [
					{
						address_line1: '123 Example St',
						city_locality: 'Example City',
						state_province: 'CA',
						country_code: 'US',
						callback_url: 'https://example.com',
					},
				],
			}).success,
		).toBe(false);
		expect(
			ShipEngineEndpointOutputSchemas['carriers.listCarriers'].safeParse({
				carriers: [],
				request_id: 'aa3d8e8e-462b-4476-9618-72db7f7b7009',
				errors: [],
			}).success,
		).toBe(true);
		expect(
			ShipEngineEndpointOutputSchemas['carriers.listCarriers'].safeParse({})
				.success,
		).toBe(false);
		expect(
			ShipEngineEndpointOutputSchemas['carriers.listCarrierServices'].safeParse(
				{
					services: [
						{
							carrier_id: 'se-123456',
							carrier_code: 'stamps_com',
							service_code: 'usps_first_class_mail',
							name: 'USPS First Class Mail',
						},
					],
				},
			).success,
		).toBe(true);
		expect(
			ShipEngineEndpointOutputSchemas['carriers.listCarrierServices'].safeParse(
				{ services: [{ carrier_code: 'se-123456' }] },
			).success,
		).toBe(false);
		expect(
			ShipEngineEndpointOutputSchemas['downloads.downloadFile'].safeParse({
				kind: 'binary',
				contentType: 'application/pdf',
				base64: 'UERG',
				byteLength: 3,
			}).success,
		).toBe(true);
		expect(
			ShipEngineEndpointOutputSchemas['downloads.downloadFile'].safeParse({
				kind: 'binary',
				contentType: 'text/plain',
				base64: 'UERG',
				byteLength: 3,
			}).success,
		).toBe(false);
		expect(
			ShipEngineEndpointOutputSchemas['batches.processBatch'].safeParse(
				undefined,
			).success,
		).toBe(true);
	});
});
