import {
	DialpadOperationDefinitions,
	DialpadOperationKeys,
} from './endpoints/definitions';
import {
	DialpadEndpointInputSchemas,
	DialpadEndpointOutputSchemas,
} from './endpoints/types';
import { dialpadEndpointMeta, dialpadEndpointSchemas } from './index';
import { DialpadOperationFixtures } from './operation-fixtures';

describe('operation schema registry', () => {
	it('marks bulk call-content deletion destructive for cautious-mode approval', () => {
		expect(dialpadEndpointMeta['anonymization.callcontent'].riskLevel).toBe(
			'destructive',
		);
	});

	it('keeps endpoint definitions, schemas, and metadata in sync', () => {
		const expected = [...DialpadOperationKeys].sort();

		expect(Object.keys(DialpadOperationDefinitions).sort()).toEqual(expected);
		expect(Object.keys(DialpadEndpointInputSchemas).sort()).toEqual(expected);
		expect(Object.keys(DialpadEndpointOutputSchemas).sort()).toEqual(expected);
		expect(Object.keys(dialpadEndpointSchemas).sort()).toEqual(expected);
		expect(Object.keys(dialpadEndpointMeta).sort()).toEqual(expected);
	});

	for (const key of DialpadOperationKeys) {
		it(`validates the documented input and output for ${key}`, () => {
			const fixture = DialpadOperationFixtures[key];
			expect(
				DialpadEndpointInputSchemas[key].safeParse(fixture.input).success,
			).toBe(true);
			const output = 'output' in fixture ? fixture.output : undefined;
			expect(DialpadEndpointOutputSchemas[key].safeParse(output).success).toBe(
				true,
			);
		});

		it(`rejects undocumented input fields for ${key}`, () => {
			const fixture = DialpadOperationFixtures[key];
			const invalidInput = {
				...fixture.input,
				undocumentedField: 'not in Dialpad OpenAPI',
			};

			expect(
				DialpadEndpointInputSchemas[key].safeParse(invalidInput).success,
			).toBe(false);
		});

		it(`rejects invalid response values for ${key} when the provider shape is closed`, () => {
			const fixture = DialpadOperationFixtures[key];
			const output = 'output' in fixture ? fixture.output : undefined;
			const schema = DialpadEndpointOutputSchemas[key];
			if (schema.safeParse({ undocumentedResponseField: true }).success) {
				return;
			}
			expect(
				schema.safeParse({ undocumentedResponseField: true }).success,
			).toBe(false);
			expect(schema.safeParse(output).success).toBe(true);
		});
	}
});
