import {
	FlexisignEndpointInputSchemas,
	FlexisignEndpointOutputSchemas,
} from './endpoints/types';

describe('Flexisign Endpoint Schemas', () => {
	it('validates ListTemplates input schema', () => {
		const input = { id: 'test-id' };
		const parsed = FlexisignEndpointInputSchemas.ListTemplates.parse(input);
		expect(parsed).toEqual(input);
	});

	it('validates ListTemplates output schema', () => {
		const output = { id: 'test-id' };
		const parsed = FlexisignEndpointOutputSchemas.ListTemplates.parse(output);
		expect(parsed).toEqual(output);
	});
});
