import { textItEndpointSchemas } from './index';

describe('TextIt documentation examples', () => {
	it('provides schema-valid arguments for every operation', () => {
		// Jest's YAML transform supplies the plugin documentation without a runtime dependency.
		const docs = require('./plugin-docs.yaml') as {
			apiExamples: Record<string, { args?: object; call?: string }>;
			examples: { write: { path: string; args: object } };
			overviewNote: string;
		};
		expect(docs.overviewNote).toContain('{ failures: [...] }');
		expect(docs.overviewNote).toContain('result.failures');
		for (const [operation, schemas] of Object.entries(textItEndpointSchemas)) {
			const example = docs.apiExamples[operation];
			// Blob cannot be represented as YAML data; the raw documented call constructs one.
			const args =
				operation === 'media.upload'
					? { file: new Blob(['example'], { type: 'text/plain' }) }
					: example?.call
						? JSON.parse(example.call)
						: (example?.args ?? {});
			if (operation === 'media.upload')
				expect(example?.call).toContain('new Blob');
			expect({
				operation,
				valid: schemas.input.safeParse(args).success,
			}).toEqual({ operation, valid: true });
		}
		const write = docs.examples.write;
		expect(
			textItEndpointSchemas[
				write.path as keyof typeof textItEndpointSchemas
			].input.safeParse(write.args).success,
		).toBe(true);
	});
});
