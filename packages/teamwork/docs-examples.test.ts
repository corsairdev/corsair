import { getTeamworkInputSchema } from './endpoints/openapi-schema';
import { teamworkOperations } from './endpoints/types';

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
			teamworkOperations.map((operation) => operation.id).sort(),
		);
	});

	it.each(Object.entries(docs.apiExamples ?? {}))(
		'%s apiExample passes its input schema',
		(id, entry) => {
			const result = getTeamworkInputSchema(id).safeParse(entry.args ?? {});
			expect(result.error?.issues ?? []).toEqual([]);
		},
	);

	it.each(
		teamworkOperations.filter((operation) => operation.body !== undefined),
	)(
		'$id apiExample sends a body, so the example does something',
		(operation) => {
			expect(docs.apiExamples?.[operation.id]?.args?.body).toBeDefined();
		},
	);

	it.each(Object.entries(docs.examples ?? {}))(
		'overview %s example passes its input schema',
		(_, example) => {
			const result = getTeamworkInputSchema(example.path).safeParse(
				example.args ?? {},
			);
			expect(result.error?.issues ?? []).toEqual([]);
		},
	);
});
