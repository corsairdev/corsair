import type { TransformationCreateInput } from './endpoints/types';
import { RudderStackTransformationEndpointInputSchemas as Inputs } from './endpoints/types';

describe('event JSON', () => {
	it('limits nested event values to JSON at compile time and runtime', () => {
		const input: TransformationCreateInput = {
			name: 'corsair-plugin-test',
			language: 'javascript',
			events: [
				{
					// @ts-expect-error Functions cannot be sent as JSON event values.
					properties: { invalid: () => 'lost in serialization' },
				},
			],
		};
		expect(Inputs.transformationsCreate.safeParse(input).success).toBe(false);
	});

	it('accepts nested objects, arrays and JSON scalar values', () => {
		expect(
			Inputs.transformationsCreate.safeParse({
				name: 'corsair-plugin-test',
				language: 'javascript',
				events: [
					{ properties: { values: [null, true, 1, 'text', { nested: [] }] } },
				],
			}).success,
		).toBe(true);
	});
});
