import { RemoteRetrievalSchema } from './schema';

describe('Remote Retrieval schema', () => {
	it('declares a semver version', () => {
		expect(RemoteRetrievalSchema.version).toBeDefined();
		expect(RemoteRetrievalSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof RemoteRetrievalSchema.entities).toBe('object');
		expect(RemoteRetrievalSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(RemoteRetrievalSchema.entities))).toBe(
			true,
		);
		for (const entity of Object.values(RemoteRetrievalSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('caches nothing, since a shipment status changes as carriers scan', () => {
		// An order is a live logistics job, so a cached status would show a device in
		// transit long after it arrived.
		expect(Object.keys(RemoteRetrievalSchema.entities)).toHaveLength(0);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
