import { NtfySchema } from './schema';

describe('Ntfy schema', () => {
	it('declares a semver version', () => {
		expect(NtfySchema.version).toBeDefined();
		expect(NtfySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores no entities, because ntfy is a pub/sub notification service with no storable remote resources: messages live in the server-side topic cache and are read by polling, so there is nothing to sync', () => {
		expect(typeof NtfySchema.entities).toBe('object');
		expect(NtfySchema.entities).not.toBeNull();
		expect(Array.isArray(NtfySchema.entities)).toBe(false);
		expect(Object.keys(NtfySchema.entities)).toEqual([]);
	});
});
