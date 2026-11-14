import fs from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { folkEndpointSchemas } from './index';

type OperationKey = keyof typeof folkEndpointSchemas;
type DocsFile = {
	// unknown: overview example args are free-form YAML until the schema checks them.
	examples?: Record<string, { path: string; args?: unknown }>;
	apiExamples?: Record<string, { call: string }>;
};

const docs = parseYaml(
	fs.readFileSync(path.join(__dirname, 'plugin-docs.yaml'), 'utf8'),
) as DocsFile;

describe('plugin-docs.yaml examples', () => {
	const apiExamples = Object.entries(docs.apiExamples ?? {});

	it('has an API example for every operation', () => {
		expect(apiExamples.map(([key]) => key).sort()).toEqual(
			Object.keys(folkEndpointSchemas).sort(),
		);
	});

	it.each(apiExamples)('%s example passes its input schema', (key, example) => {
		// The examples are object literals as they appear in the docs. They are
		// parsed as YAML flow mappings (unquoted keys, quoted strings, arrays),
		// never executed.
		// unknown: the parsed literal is checked by the schema below.
		const input: unknown = parseYaml(example.call);
		expect(typeof input === 'object' && input !== null).toBe(true);
		const result =
			folkEndpointSchemas[key as OperationKey].input.safeParse(input);
		expect(result.success ? 'ok' : result.error.issues).toBe('ok');
	});

	it.each(Object.entries(docs.examples ?? {}))(
		'overview example %s passes its input schema',
		(_name, example) => {
			const result = folkEndpointSchemas[
				example.path as OperationKey
			].input.safeParse(example.args ?? {});
			expect(result.success ? 'ok' : result.error.issues).toBe('ok');
		},
	);
});
