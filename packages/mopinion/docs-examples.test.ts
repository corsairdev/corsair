import { MopinionEndpointInputSchemas } from './endpoints/types';
import { mopinionEndpointSchemas } from './index';

// jest-yaml-transform turns the yaml into a plain object.
const docs = require('./plugin-docs.yaml') as {
	domain: string;
	// `unknown` because an example is `{}` or `{ call: "<JS object literal>" }`.
	apiExamples: Record<string, { call?: string } | Record<string, unknown>>;
};

/** The examples are JS object literals with single quotes and bare keys. */
// unknown: the parsed example is checked by the operation's input schema.
function parseCall(call: string): unknown {
	const json = call
		.replace(/'/g, '"')
		.replace(/([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:/g, '$1"$2":');
	return JSON.parse(json);
}

describe('plugin-docs.yaml', () => {
	it('names the vendor domain for the catalog icon', () => {
		expect(docs.domain).toBe('mopinion.com');
	});

	it('has one example per operation', () => {
		expect(Object.keys(docs.apiExamples).sort()).toEqual(
			Object.keys(mopinionEndpointSchemas).sort(),
		);
	});

	it('gives examples their input schema accepts', () => {
		const failed: string[] = [];
		for (const [id, example] of Object.entries(docs.apiExamples)) {
			const args =
				typeof example.call === 'string' ? parseCall(example.call) : {};
			const schema =
				mopinionEndpointSchemas[id as keyof typeof mopinionEndpointSchemas]
					.input;
			if (!schema.safeParse(args).success) failed.push(id);
		}
		expect(failed).toEqual([]);
		expect(MopinionEndpointInputSchemas.accountGet).toBeDefined();
	});
});
