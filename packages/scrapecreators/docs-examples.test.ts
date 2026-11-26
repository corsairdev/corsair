import { scrapeCreatorsOperations } from './endpoints/manifest';
import { getScrapeCreatorsInputSchema } from './endpoints/schemas';

// jest-yaml-transform turns the yaml into a plain object.
const docs = require('./plugin-docs.yaml') as {
	examples?: Record<
		string,
		// `unknown` because example args are free-form YAML values.
		{ path: string; args?: Record<string, unknown> }
	>;
	// `unknown` because example args are free-form YAML values.
	apiExamples?: Record<string, { args?: Record<string, unknown> }>;
	domain?: string;
};

describe('plugin-docs.yaml examples', () => {
	it('sets the vendor domain for the icon', () => {
		expect(docs.domain).toBe('scrapecreators.com');
	});

	it('gives every operation an apiExample', () => {
		expect(Object.keys(docs.apiExamples ?? {}).sort()).toEqual(
			scrapeCreatorsOperations.map((operation) => operation.id).sort(),
		);
	});

	it.each(scrapeCreatorsOperations.map((operation) => operation.id))(
		'%s apiExample passes its input schema',
		(id) => {
			const result = getScrapeCreatorsInputSchema(id).safeParse(
				docs.apiExamples?.[id]?.args ?? {},
			);
			expect(result.error?.issues ?? []).toEqual([]);
		},
	);

	it.each(Object.entries(docs.examples ?? {}))(
		'overview %s example passes its input schema',
		(_, example) => {
			const result = getScrapeCreatorsInputSchema(example.path).safeParse(
				example.args ?? {},
			);
			expect(result.error?.issues ?? []).toEqual([]);
		},
	);
});
