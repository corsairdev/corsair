import { mongodbatlasOperations } from './endpoints/manifest';
import { getMongoDBAtlasInputSchema } from './endpoints/openapi-schema';

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
		expect(docs.domain).toBe('mongodb.com');
		expect(docs.description).toMatch(/Atlas Administration API/);
	});

	it('has one example per operation and nothing else', () => {
		expect(Object.keys(docs.apiExamples).sort()).toEqual(
			mongodbatlasOperations.map((o) => o.id).sort(),
		);
	});

	it('gives examples every input schema accepts', () => {
		const failed: string[] = [];
		for (const [id, example] of Object.entries(docs.apiExamples)) {
			if (!getMongoDBAtlasInputSchema(id).safeParse(example.args).success) {
				failed.push(id);
			}
		}
		for (const example of Object.values(docs.examples)) {
			if (
				!getMongoDBAtlasInputSchema(example.path).safeParse(example.args)
					.success
			) {
				failed.push(example.path);
			}
		}
		expect(failed).toEqual([]);
	});
});
