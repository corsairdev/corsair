import { amikaOperations } from './endpoints/manifest';
import { getAmikaInputSchema } from './endpoints/openapi-schema';

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
		expect(docs.displayName).toBe('Amika');
		expect(docs.description).toMatch(/98 operations/);
	});

	it('gives every operation an apiExample', () => {
		expect(Object.keys(docs.apiExamples ?? {}).sort()).toEqual(
			amikaOperations.map((operation) => operation.id).sort(),
		);
	});

	it.each(amikaOperations.map((operation) => operation.id))(
		'%s apiExample passes its input schema',
		(id) => {
			const result = getAmikaInputSchema(id).safeParse(
				docs.apiExamples?.[id]?.args ?? {},
			);
			expect(result.error?.issues ?? []).toEqual([]);
		},
	);

	it.each(amikaOperations.map((operation) => operation.id))(
		'%s apiExample uses only fields the operation takes',
		(id) => {
			// Input schemas keep unknown body keys (Amika may add fields first),
			// so a misspelt example would still parse: check the names here.
			const operation = amikaOperations.find((o) => o.id === id);
			const known = Object.keys(
				(operation?.input.properties as Record<string, unknown>) ?? {},
			);
			const unknown = Object.keys(docs.apiExamples?.[id]?.args ?? {}).filter(
				(name) => !known.includes(name),
			);
			expect(unknown).toEqual([]);
		},
	);

	it.each(Object.entries(docs.examples ?? {}))(
		'overview %s example passes its input schema',
		(_, example) => {
			const result = getAmikaInputSchema(example.path).safeParse(
				example.args ?? {},
			);
			expect(result.error?.issues ?? []).toEqual([]);
		},
	);
});
