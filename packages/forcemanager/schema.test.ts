import {
	operationDefinitions,
	operationTestInputs,
	operationTestOutputs,
} from './endpoints/definitions';
import { forceManagerRoutes } from './endpoints/routes';
import { ForceManagerSchema } from './schema';

describe('ForceManager operation schemas', () => {
	it('declares a semver schema version and no persisted entities', () => {
		expect(ForceManagerSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(ForceManagerSchema.entities).toEqual({});
	});

	for (const route of forceManagerRoutes) {
		it(`${route.name} validates documented input and output fixtures`, () => {
			const definition = operationDefinitions[route.name];
			const input = operationTestInputs[route.name];
			const output = operationTestOutputs[route.name];

			expect(definition.input.safeParse(input).success).toBe(true);
			expect(definition.output.safeParse(output).success).toBe(true);
			expect(
				definition.input.safeParse({ ...input, undocumented: true }).success,
			).toBe(false);
			expect(definition.output.safeParse(undefined).success).toBe(false);
		});
	}

	for (const route of forceManagerRoutes) {
		it(`${route.name} rejects undocumented request body fields`, () => {
			const definition = operationDefinitions[route.name];
			const input = operationTestInputs[route.name];

			expect(
				definition.input.safeParse({
					...input,
					body: { undocumented: 'field' },
				}).success,
			).toBe(false);
		});
	}
});
