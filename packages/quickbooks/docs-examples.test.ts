import { requestSchema } from './endpoints/schema-mode';
import { quickbooksEndpointSchemas } from './index';

// jest-yaml-transform turns the yaml into a plain object.
const docs = require('./plugin-docs.yaml') as {
	apiExamples?: Record<string, { call: string }>;
};

describe('plugin-docs.yaml API examples', () => {
	it('gives every operation an example', () => {
		expect(Object.keys(docs.apiExamples ?? {}).sort()).toEqual(
			Object.keys(quickbooksEndpointSchemas).sort(),
		);
	});

	it.each(
		Object.entries(docs.apiExamples ?? {}).filter(
			// Batch items are checked by envelope at runtime; its example is covered in samples.test.ts.
			([id]) => id !== 'batch.execute',
		),
	)('%s example passes the input check the operation runs', (id, entry) => {
		const schemas = quickbooksEndpointSchemas[id];
		expect(schemas).toBeDefined();
		// unknown because the parsed example JSON is untrusted until the operation's input schema checks it.
		const args: unknown = JSON.parse(entry.call);
		const result = requestSchema(schemas!.input).safeParse(args);
		expect(result.error?.issues ?? []).toEqual([]);
	});
});
