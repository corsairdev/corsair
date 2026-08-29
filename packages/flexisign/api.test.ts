import {
	FlexisignEndpointInputSchemas,
	FlexisignEndpointOutputSchemas,
} from './endpoints/types';

describe('Flexisign Endpoint Schemas', () => {
	it('validates ListTemplates input schema', () => {
		const input = {};

		const parsed = FlexisignEndpointInputSchemas.ListTemplates.parse(input);

		expect(parsed).toEqual(input);
	});

	it('validates ListTemplates output schema', () => {
		const output = {
			status: 'success',
			code: 200,
			data: {
				list: [
					{
						_id: '6a927012137aed058249a39b',
						name: 'corsair Flexisign API Test',
					},
				],
				meta: {
					total: 1,
					limit: 10,
					page: 1,
					pages: 1,
					previousPage: null,
					nextPage: null,
				},
			},
			message: 'Data Sent Sucessfully',
		};

		const parsed = FlexisignEndpointOutputSchemas.ListTemplates.parse(output);

		expect(parsed).toEqual(output);
	});
});
