import { TisaneSchema } from './schema';

describe('Tisane schema', () => {
	it('declares a semver version', () => {
		expect(TisaneSchema.version).toBeDefined();
		expect(TisaneSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map with valid Zod schemas', () => {
		expect(typeof TisaneSchema.entities).toBe('object');
		expect(TisaneSchema.entities).not.toBeNull();
		expect(Object.keys(TisaneSchema.entities).length).toBeGreaterThan(0);
		for (const entity of Object.values(TisaneSchema.entities)) {
			expect(entity).toBeDefined();
			expect(typeof entity.parse).toBe('function');
		}
	});

	it('validates parseResult schema correctly', () => {
		const sampleData = {
			text: 'Great product!',
			language: 'en',
			sentiment: [{ aspect: 'product', polarity: 'positive', score: 0.9 }],
			abuse: [],
			entities: [{ name: 'Tisane', type: 'Organization', score: 0.95 }],
			topics: [{ topic: 'technology', score: 0.88 }],
		};
		const parsed = TisaneSchema.entities.parseResult.parse(sampleData);
		expect(parsed.text).toBe('Great product!');
		expect(parsed.sentiment?.[0]?.aspect).toBe('product');
	});
});
