import { EcologiSchema } from './schema';
import { EcologiImpactEntity, EcologiTotalEntity } from './schema/database';

describe('Ecologi schema', () => {
	it('declares the reporting entities', () => {
		expect(EcologiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(Object.keys(EcologiSchema.entities).sort()).toEqual([
			'carbonOffsets',
			'carbonRemovals',
			'habitats',
			'impacts',
			'trees',
		]);
	});

	it('rejects a total with no id', () => {
		expect(EcologiTotalEntity.safeParse({ total: 1, pending: 0 }).success).toBe(
			false,
		);
		expect(
			EcologiImpactEntity.parse({
				id: 'acme',
				trees: 1,
				carbonOffset: 2,
				carbonRemoval: 3,
				habitatRestoration: 4,
				pendingTrees: 0,
				pendingCarbonOffset: 0,
				pendingCarbonRemoval: 0,
				pendingHabitatRestoration: 0,
			}).trees,
		).toBe(1);
	});
});
