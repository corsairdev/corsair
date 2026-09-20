import { CodySchema } from './schema';

describe('Cody schema', () => {
	it('declares a semver version', () => {
		expect(CodySchema.version).toBeDefined();
		expect(CodySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map with all labeled database models', () => {
		expect(typeof CodySchema.entities).toBe('object');
		expect(CodySchema.entities).not.toBeNull();
		expect(Object.keys(CodySchema.entities).sort()).toEqual([
			'bots',
			'conversations',
			'documents',
			'folders',
			'messages',
			'usage',
		]);
		for (const entity of Object.values(CodySchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});
