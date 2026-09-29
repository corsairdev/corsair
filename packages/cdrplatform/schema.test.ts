import { CdrPlatformSchema } from './schema';

describe('CdrPlatform schema', () => {
	it('declares a semver version', () => {
		expect(CdrPlatformSchema.version).toBeDefined();
		expect(CdrPlatformSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares official API entities', () => {
		expect(Object.keys(CdrPlatformSchema.entities).sort()).toEqual([
			'certificates',
			'priceQuotes',
			'removalRequests',
		]);
	});
});
