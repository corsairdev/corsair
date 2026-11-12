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
});
