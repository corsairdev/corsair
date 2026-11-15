import type { z } from 'zod';
import { commCareEndpointSchemas } from './index';

// jest-yaml-transform turns the yaml into a plain object.
const docs = require('./plugin-docs.yaml') as {
	examples?: Record<
		string,
		// unknown: example args are free-form YAML values.
		{ path: string; args: Record<string, unknown> }
	>;
	apiExamples?: Record<string, { call: string }>;
};

// unknown: each operation has its own input schema; only parsing is needed.
const schemas = commCareEndpointSchemas as Record<
	string,
	{ input: z.ZodType<unknown> }
>;

// `call` entries are object literals the docs print verbatim. They use
// single-quoted strings and bare keys only, so quoting the keys and swapping
// the quotes gives JSON; no code is evaluated.
// unknown: the parsed arguments are free-form JSON.
function parseCall(call: string): unknown {
	const json = call
		.replace(/([{,]\s*)([A-Za-z_]\w*)\s*:/g, '$1"$2":')
		.replace(/'/g, '"');
	return JSON.parse(json);
}

describe('plugin-docs.yaml examples', () => {
	it('gives every operation an apiExample', () => {
		expect(Object.keys(docs.apiExamples ?? {}).sort()).toEqual(
			Object.keys(schemas).sort(),
		);
	});

	it.each(Object.entries(docs.apiExamples ?? {}))(
		'%s apiExample passes its input schema',
		(id, entry) => {
			const schema = schemas[id];
			expect(schema).toBeDefined();
			expect(() => schema!.input.parse(parseCall(entry.call))).not.toThrow();
		},
	);

	it.each(Object.entries(docs.examples ?? {}))(
		'overview %s example passes its input schema',
		(_, example) => {
			const schema = schemas[example.path];
			expect(schema).toBeDefined();
			expect(() => schema!.input.parse(example.args)).not.toThrow();
		},
	);
});
