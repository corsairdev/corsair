import { LinklySchema } from './schema';

describe('Linkly schema', () => {
	it('declares a semver version', () => {
		expect(LinklySchema.version).toBeDefined();
		expect(LinklySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	// A value assertion, not Object.keys: Linkly stores no mirrors of its own
	// data here. Every operation is a direct API call and nothing needs a
	// local entity, so entities must be the empty object and stay an object.
	it('declares entities as an empty object', () => {
		expect(typeof LinklySchema.entities).toBe('object');
		expect(LinklySchema.entities).not.toBeNull();
		expect(Array.isArray(LinklySchema.entities)).toBe(false);
		expect(LinklySchema.entities).toEqual({});
	});
});
