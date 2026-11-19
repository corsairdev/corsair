import { KeysUsageInputSchema } from './endpoints/keys';
import { litescrapeOperations } from './endpoints/manifest';
import { getLitescrapeInputSchema } from './endpoints/openapi-schema';

// jest-yaml-transform turns the yaml into a plain object.
const docs = require('./plugin-docs.yaml') as {
	examples?: Record<
		string,
		// `unknown` because example args are free-form YAML values.
		{ path: string; args?: Record<string, unknown> }
	>;
	// `unknown` because example args are free-form YAML values.
	apiExamples?: Record<string, { args?: Record<string, unknown> }>;
};

describe('plugin-docs.yaml examples', () => {
	it('gives every operation an apiExample', () => {
		expect(Object.keys(docs.apiExamples ?? {}).sort()).toEqual(
			[
				...litescrapeOperations.map((operation) => operation.id),
				'keys.status',
				'keys.usage',
			].sort(),
		);
	});

	it.each(litescrapeOperations.map((operation) => operation.id))(
		'%s apiExample passes its input schema',
		(id) => {
			const result = getLitescrapeInputSchema(id).safeParse(
				docs.apiExamples?.[id]?.args ?? {},
			);
			expect(result.error?.issues ?? []).toEqual([]);
		},
	);

	it('keys.usage apiExample passes its input schema', () => {
		expect(
			KeysUsageInputSchema.safeParse(docs.apiExamples?.['keys.usage']?.args)
				.success,
		).toBe(true);
	});

	it.each(Object.entries(docs.examples ?? {}))(
		'overview %s example passes its input schema',
		(_, example) => {
			const result = getLitescrapeInputSchema(example.path).safeParse(
				example.args ?? {},
			);
			expect(result.error?.issues ?? []).toEqual([]);
		},
	);
});
