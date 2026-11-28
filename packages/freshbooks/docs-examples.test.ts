import { freshbooksOperations } from './endpoints/manifest';
import { getFreshBooksInputSchema } from './endpoints/openapi-schema';

// jest-yaml-transform turns the yaml into a plain object.
const docs = require('./plugin-docs.yaml') as {
	domain: string;
	examples: Record<string, { path: string; args: Record<string, unknown> }>;
	// `unknown` because example args are free-form YAML values.
	apiExamples: Record<string, { args: Record<string, unknown> }>;
};

describe('plugin-docs.yaml', () => {
	it('names the vendor domain for the catalog icon', () => {
		expect(docs.domain).toBe('freshbooks.com');
	});

	it('has one example per operation and nothing else', () => {
		expect(Object.keys(docs.apiExamples).sort()).toEqual(
			freshbooksOperations.map((o) => o.id).sort(),
		);
	});

	it('gives examples every input schema accepts', () => {
		const failed: string[] = [];
		for (const [id, example] of Object.entries(docs.apiExamples)) {
			if (!getFreshBooksInputSchema(id).safeParse(example.args).success) {
				failed.push(id);
			}
		}
		for (const example of Object.values(docs.examples)) {
			if (
				!getFreshBooksInputSchema(example.path).safeParse(example.args).success
			) {
				failed.push(example.path);
			}
		}
		expect(failed).toEqual([]);
	});
});
