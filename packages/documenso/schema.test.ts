import {
	DocumensoOperationDefinitions,
	DocumensoOperationNames,
} from './endpoints/definitions';
import {
	DocumensoEndpointInputSchemas,
	DocumensoEndpointOutputSchemas,
} from './endpoints/types';

describe('Documenso v2 operation schemas', () => {
	for (const name of DocumensoOperationNames) {
		const definition = DocumensoOperationDefinitions[name];
		it(`validates the documented input and output for ${definition.method} ${definition.path}`, () => {
			const inputSchema = DocumensoEndpointInputSchemas[name];
			const outputSchema = DocumensoEndpointOutputSchemas[name];
			const input = definition.inputExample;
			const output = definition.outputExample;

			expect(inputSchema.safeParse(input).success).toBe(true);
			expect(outputSchema.safeParse(output).success).toBe(true);
			expect(
				inputSchema.safeParse({ ...input, undocumentedCorsairField: true })
					.success,
			).toBe(false);
			expect(outputSchema.safeParse(null).success).toBe(false);
			if (definition.binaryDownload) {
				expect(
					outputSchema.safeParse({ ...output, base64: 'not-base64' }).success,
				).toBe(false);
				expect(
					outputSchema.safeParse({
						...output,
						contentType: 'application/octet-stream',
					}).success,
				).toBe(false);
			}
		});
	}

	it('validates a large PDF upload without regex backtracking', () => {
		const largePdfBase64 = Buffer.alloc(12 * 1024 * 1024).toString('base64');
		const sample = DocumensoOperationDefinitions.envelopeCreate.inputExample;
		const parsed = DocumensoEndpointInputSchemas.envelopeCreate.parse({
			...sample,
			files: [
				{
					filename: 'large-contract.pdf',
					contentType: 'application/pdf',
					contentBase64: largePdfBase64,
				},
			],
		});
		expect(parsed.files?.[0]?.contentBase64).toBe(largePdfBase64);
	});
});
