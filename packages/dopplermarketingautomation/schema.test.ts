import { DopplerMarketingAutomationSchema } from './schema';

describe('DopplerMarketingAutomation schema', () => {
	it('declares a semver version', () => {
		expect(DopplerMarketingAutomationSchema.version).toBeDefined();
		expect(DopplerMarketingAutomationSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof DopplerMarketingAutomationSchema.entities).toBe('object');
		expect(DopplerMarketingAutomationSchema.entities).not.toBeNull();
		expect(
			Array.isArray(Object.keys(DopplerMarketingAutomationSchema.entities)),
		).toBe(true);
		for (const entity of Object.values(
			DopplerMarketingAutomationSchema.entities,
		)) {
			expect(entity).toBeDefined();
		}
	});
});
