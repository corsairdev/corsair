import { AimlApiSchema } from './schema';

describe('AimlApiSchema', () => {
	it('declares an entities map', () => {
		expect(AimlApiSchema.entities).toBeDefined();
		expect(AimlApiSchema.entities.models).toBeDefined();
		expect(AimlApiSchema.entities.assistants).toBeDefined();
		expect(AimlApiSchema.entities.threads).toBeDefined();
		expect(AimlApiSchema.entities.batches).toBeDefined();
	});

	it('requires an ID for every entity', () => {
		for (const entity of Object.values(AimlApiSchema.entities)) {
			expect(entity.safeParse({ id: 'test-id' }).success).toBe(true);
			expect(entity.safeParse({}).success).toBe(false);
		}
	});
});
