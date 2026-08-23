import { ChatbotkitSchema } from './schema';

describe('Chatbotkit schema', () => {
	it('declares a semver version', () => {
		expect(ChatbotkitSchema.version).toBeDefined();
		expect(ChatbotkitSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares all required database entities', () => {
		expect(typeof ChatbotkitSchema.entities).toBe('object');
		expect(ChatbotkitSchema.entities).not.toBeNull();
		const entityKeys = Object.keys(ChatbotkitSchema.entities);
		expect(entityKeys).toContain('bots');
		expect(entityKeys).toContain('datasets');
		expect(entityKeys).toContain('skillsets');
		expect(entityKeys).toContain('blueprints');
		expect(entityKeys).toContain('secrets');
		expect(entityKeys).toContain('conversations');
		expect(entityKeys).toContain('files');
		expect(entityKeys).toContain('tasks');
		for (const entity of Object.values(ChatbotkitSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('schema version is 1.0.0', () => {
		expect(ChatbotkitSchema.version).toBe('1.0.0');
	});
});
