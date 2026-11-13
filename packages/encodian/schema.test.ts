import { readFileSync } from 'node:fs';
import {
	EncodianEndpointInputSchemas,
	EncodianEndpointOutputSchemas,
	EncodianOperationIds,
} from './endpoints/generated';
import { EncodianEndpointMeta } from './endpoints/plugin-registration';
import {
	EncodianInputFixtures,
	EncodianOutputFixtures,
} from './endpoints/test-fixtures';

// `unknown` is narrowed to a plain object before accessing parsed YAML or JSON values.
function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

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

	it.each(EncodianOperationIds)(
		'%s keeps parsing when Encodian adds a response field',
		(operationId) => {
			const fixture = EncodianOutputFixtures[operationId];
			expect(
				EncodianEndpointOutputSchemas[operationId].safeParse({
					...fixture,
					fieldAddedLater: 'x',
				}).success,
			).toBe(true);
		},
	);

	it('accepts response enum values Encodian adds later and nested result fields', () => {
		expect(
			EncodianEndpointOutputSchemas[
				'barcodes.readSwissQrCodeFromImage'
			].safeParse({
				currency: 'USD',
				creditorCountryCode: 'NewCountry',
			}).success,
		).toBe(true);
		expect(
			EncodianEndpointOutputSchemas['pdf.extractAttachmentsFromPdf'].safeParse({
				documents: [{ fileName: 'a.pdf', fileContent: 'AA==', size: 1 }],
			}).success,
		).toBe(true);
		expect(
			EncodianEndpointOutputSchemas['sign.recipientListAll'].safeParse({
				recipients: [{ emailAddress: 'x', id: 'added-later' }],
			}).success,
		).toBe(true);
	});

	it('keeps buying credits at write risk, like other purchases', () => {
		expect(EncodianEndpointMeta['general.buyAdditionalCredits'].riskLevel).toBe(
			'write',
		);
	});

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

	it('validates the documented HTML, text, and RSA examples against their schemas', () => {
		const docs = readFileSync('plugin-docs.yaml', 'utf8');
		for (const [operationId, field] of [
			['barcodes.aiBarcodeRead', 'FileContent'],
			['conversion.htmlToPdf', 'htmlData'],
			['conversion.textToPdf', 'textData'],
			['utilities.createRsaKeyPair', 'keySize'],
		] as const) {
			const sectionStart = docs.indexOf(`  '${operationId}':`);
			if (sectionStart < 0) {
				throw new Error(`Missing ${operationId} documentation example`);
			}
			const callLine = docs
				.slice(sectionStart)
				.split(/\r?\n/)
				.find((line) => line.startsWith('    call: '));
			if (!callLine?.endsWith("'")) {
				throw new Error(`Invalid ${operationId} documentation example`);
			}
			// `unknown` because JSON.parse returns untrusted documentation example data.
			const input: unknown = JSON.parse(
				callLine.slice("    call: '".length, -1),
			);
			expect(
				EncodianEndpointInputSchemas[operationId].safeParse(input).success,
			).toBe(true);
			if (!isRecord(input) || !isRecord(input.body) || !(field in input.body)) {
				throw new Error(`Missing ${field} in ${operationId} example`);
			}
			if (operationId === 'utilities.createRsaKeyPair') {
				expect(input.body.keySize).toBe('Size2048');
			} else {
				expect(input.body[field]).toEqual(expect.any(String));
			}
		}
	});
});
