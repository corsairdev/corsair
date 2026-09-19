import { ApipieSchema } from './schema';

describe('ApipieSchema', () => {
	it('declares an entities map', () => {
		expect(ApipieSchema.entities).toBeDefined();
		expect(ApipieSchema.entities.models).toBeDefined();
		expect(ApipieSchema.entities.images).toBeDefined();
	});

	it('requires an ID for every entity', () => {
		for (const entity of Object.values(ApipieSchema.entities)) {
			expect(entity.safeParse({ id: 'test-id' }).success).toBe(true);
			expect(entity.safeParse({}).success).toBe(false);
		}
	});
});
