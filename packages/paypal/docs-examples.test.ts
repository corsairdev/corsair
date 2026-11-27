import { paypalOperations } from './endpoints/manifest';
import { getPaypalInputSchema } from './endpoints/openapi-schema';

// jest-yaml-transform turns the yaml into a plain object.
const docs = require('./plugin-docs.yaml') as {
	domain: string;
	description: string;
	examples: Record<string, { path: string; args: Record<string, unknown> }>;
	// `unknown` because example args are free-form YAML values.
	apiExamples: Record<string, { args: Record<string, unknown> }>;
};

describe('plugin-docs.yaml', () => {
	it('names the vendor domain for the catalog icon', () => {
		expect(docs.domain).toBe('paypal.com');
		expect(docs.description).toMatch(/114 operations/);
	});

	it('has one example per operation and nothing else', () => {
		expect(Object.keys(docs.apiExamples).sort()).toEqual(
			paypalOperations.map((o) => o.id).sort(),
		);
	});

	it('gives examples every input schema accepts', () => {
		const failed: string[] = [];
		for (const [id, example] of Object.entries(docs.apiExamples)) {
			if (!getPaypalInputSchema(id).safeParse(example.args).success) {
				failed.push(id);
			}
		}
		for (const example of Object.values(docs.examples)) {
			if (!getPaypalInputSchema(example.path).safeParse(example.args).success) {
				failed.push(example.path);
			}
		}
		expect(failed).toEqual([]);
	});
});
