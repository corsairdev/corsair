import { ChatworkSchema } from './schema';

describe('Chatwork schema', () => {
	it('declares a semver version', () => {
		expect(ChatworkSchema.version).toBeDefined();
		expect(ChatworkSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('registers an entity for every persisted Chatwork object', () => {
		expect(Object.keys(ChatworkSchema.entities).sort()).toEqual([
			'accounts',
			'files',
			'incomingRequests',
			'members',
			'messages',
			'rooms',
			'tasks',
		]);
	});

	it('declares an entities map', () => {
		expect(typeof ChatworkSchema.entities).toBe('object');
		expect(ChatworkSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ChatworkSchema.entities))).toBe(true);
		for (const entity of Object.values(ChatworkSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
