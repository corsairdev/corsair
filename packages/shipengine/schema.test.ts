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
	});
});
