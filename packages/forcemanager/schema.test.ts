import {
	operationDefinitions,
	operationTestInputs,
	operationTestOutputs,
	representativeResponseFixtures,
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

	it('validates populated nested responses and documented nullable fields', () => {
		expect(
			operationDefinitions.listAccountAddresses.output.safeParse(
				representativeResponseFixtures.listAccountAddresses,
			).success,
		).toBe(true);
		expect(
			operationDefinitions.getAccount.output.safeParse(
				representativeResponseFixtures.getAccount,
			).success,
		).toBe(true);
		expect(
			operationDefinitions.getActivity.output.safeParse(
				representativeResponseFixtures.getActivity,
			).success,
		).toBe(true);
	});

	it('rejects invalid types in known response fields and nested records', () => {
		const address = representativeResponseFixtures.listAccountAddresses[0];
		if (!address) throw new Error('Expected the address response fixture');
		expect(
			operationDefinitions.listAccountAddresses.output.safeParse([
				{ ...address, id: 'invalid' },
			]).success,
		).toBe(false);
		expect(
			operationDefinitions.listAccountAddresses.output.safeParse([
				{ ...address, address2: 42 },
			]).success,
		).toBe(false);
		expect(
			operationDefinitions.getAccount.output.safeParse({
				...representativeResponseFixtures.getAccount,
				name: 42,
			}).success,
		).toBe(false);
		expect(
			operationDefinitions.getAccount.output.safeParse({
				...representativeResponseFixtures.getAccount,
				branchId: { id: 'invalid', value: 'Headquarter' },
			}).success,
		).toBe(false);
		expect(
			operationDefinitions.getActivity.output.safeParse({
				...representativeResponseFixtures.getActivity,
				geocoded: 'true',
			}).success,
		).toBe(false);
	});

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
