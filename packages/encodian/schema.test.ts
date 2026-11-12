import {
	EncodianEndpointInputSchemas,
	EncodianEndpointOutputSchemas,
	EncodianOperationIds,
} from './endpoints/generated';
import {
	EncodianInputFixtures,
	EncodianOutputFixtures,
} from './endpoints/test-fixtures';

describe('Encodian operation schemas', () => {
	it('keeps schemas and generated fixtures aligned for every operation', () => {
		expect(Object.keys(EncodianEndpointInputSchemas).sort()).toEqual(
			[...EncodianOperationIds].sort(),
		);
		expect(Object.keys(EncodianEndpointOutputSchemas).sort()).toEqual(
			[...EncodianOperationIds].sort(),
		);
		expect(Object.keys(EncodianInputFixtures).sort()).toEqual(
			[...EncodianOperationIds].sort(),
		);
		expect(Object.keys(EncodianOutputFixtures).sort()).toEqual(
			[...EncodianOperationIds].sort(),
		);
	});

	it.each(EncodianOperationIds)(
		'%s accepts a minimal Swagger-derived input',
		(operationId) => {
			// `unknown` because the fixture object is runtime test data validated by its operation schema.
			const input: unknown = EncodianInputFixtures[operationId];
			expect(
				EncodianEndpointInputSchemas[operationId].safeParse(input).success,
			).toBe(true);
		},
	);

	it.each(EncodianOperationIds)(
		'%s accepts a minimal Swagger-derived output',
		(operationId) => {
			// `unknown` because provider response fixtures are untrusted data until the output schema validates them.
			const output: unknown = EncodianOutputFixtures[operationId];
			expect(
				EncodianEndpointOutputSchemas[operationId].safeParse(output).success,
			).toBe(true);
		},
	);

	it.each(EncodianOperationIds)(
		'%s rejects null input and output',
		(operationId) => {
			expect(
				EncodianEndpointInputSchemas[operationId].safeParse(null).success,
			).toBe(false);
			expect(
				EncodianEndpointOutputSchemas[operationId].safeParse(null).success,
			).toBe(false);
		},
	);

	it('rejects undocumented request properties at both operation and DTO levels', () => {
		expect(
			EncodianEndpointInputSchemas['barcodes.readBarcodeFromImage'].safeParse({
				body: {
					fileContent: 'AA==',
					barcodeImageFormat: 'PNG',
					callbackUrl: 'https://invalid.invalid',
				},
			}).success,
		).toBe(false);
		expect(
			EncodianEndpointInputSchemas['barcodes.readBarcodeFromImage'].safeParse({
				body: { fileContent: 'AA==', barcodeImageFormat: 'PNG' },
				undocumented: true,
			}).success,
		).toBe(false);
	});
});
