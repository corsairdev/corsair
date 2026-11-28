import { RagieSchema } from './schema';

describe('ragie schema', () => {
	it('stays at version 1.0.0', () => {
		expect(RagieSchema.version).toBe('1.0.0');
	});

	it('syncs no entities, because Ragie documents and connections are read back through the API and webhooks cover status changes', () => {
		expect(Array.isArray(RagieSchema.entities)).toBe(false);
		expect(RagieSchema.entities).toEqual({});
	});
});
