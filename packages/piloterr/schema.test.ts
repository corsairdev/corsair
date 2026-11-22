// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test; this one pins the schema contract.
import { piloterrEndpointMeta, piloterrEndpointSchemas } from './index';
import { PiloterrSchema } from './schema';

describe('PiloterrSchema', () => {
	it('declares a semver version', () => {
		expect(PiloterrSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because scraped data is read live from the engines', () => {
		expect(Array.isArray(PiloterrSchema.entities)).toBe(false);
		expect(PiloterrSchema.entities).toEqual({});
	});
});

describe('plugin registration', () => {
	it('declares schemas for every implemented endpoint', () => {
		const keys = Object.keys(piloterrEndpointSchemas);
		expect(keys).toHaveLength(19);
		expect(keys).toContain('web.crawler');
		expect(keys).toContain('web.screenshot');
		expect(keys).toContain('google.search');
		expect(keys).toContain('linkedin.companyInfo');
		expect(keys).toContain('email.finder');
		expect(keys).toContain('account.usage');
		expect(keys).toContain('account.getJob');
	});

	it('declares meta for every schema key', () => {
		expect(Object.keys(piloterrEndpointMeta).sort()).toEqual(
			Object.keys(piloterrEndpointSchemas).sort(),
		);
	});

	it('keeps every operation read-only, because Piloterr only scrapes', () => {
		const writeLike = Object.entries(
			piloterrEndpointMeta as Record<string, { riskLevel: string }>,
		)
			.filter(([key, meta]) => meta.riskLevel !== 'read')
			.map(([key]) => key);
		expect(writeLike).toEqual([]);
	});
});
