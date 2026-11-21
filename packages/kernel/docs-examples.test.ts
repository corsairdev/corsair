import { kernelOperations } from './endpoints/manifest';
import { getKernelInputSchema } from './endpoints/openapi-schema';

// jest-yaml-transform turns the yaml into a plain object.
const docs = require('./plugin-docs.yaml') as {
	displayName: string;
	description: string;
	examples?: Record<
		string,
		// `unknown` because example args are free-form YAML values.
		{ path: string; args?: Record<string, unknown> }
	>;
	// `unknown` because example args are free-form YAML values.
	apiExamples?: Record<string, { args?: Record<string, unknown> }>;
};

describe('plugin-docs.yaml', () => {
	it('names the provider and says what the plugin covers', () => {
		expect(docs.displayName).toBe('Kernel');
		expect(docs.description.length).toBeGreaterThan(80);
	});

	it('gives every operation an apiExample', () => {
		expect(Object.keys(docs.apiExamples ?? {}).sort()).toEqual(
			kernelOperations.map((operation) => operation.id).sort(),
		);
	});

	it.each(kernelOperations.map((operation) => operation.id))(
		'%s apiExample passes its input schema',
		(id) => {
			const result = getKernelInputSchema(id).safeParse(
				docs.apiExamples?.[id]?.args ?? {},
			);
			expect(result.error?.issues ?? []).toEqual([]);
		},
	);

	it.each(Object.entries(docs.examples ?? {}))(
		'overview %s example passes its input schema',
		(_, example) => {
			const result = getKernelInputSchema(example.path).safeParse(
				example.args ?? {},
			);
			expect(result.error?.issues ?? []).toEqual([]);
		},
	);
});
