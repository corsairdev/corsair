import { ServicenowSchema } from './schema';

describe('ServiceNow schema', () => {
	it('declares a semver version', () => {
		expect(ServicenowSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no stored entities: records stay in the instance', () => {
		// A sync would copy table rows whose columns vary per instance, and the
		// plugin writes through on every call, so entities stay empty.
		expect(Array.isArray(ServicenowSchema.entities)).toBe(false);
		expect(Object.keys(ServicenowSchema.entities)).toHaveLength(0);
	});
});
