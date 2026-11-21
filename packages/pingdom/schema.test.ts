// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test; this one pins the schema contract.
import { pingdomEndpointMeta, pingdomEndpointSchemas } from './index';
import { PingdomSchema } from './schema';

describe('PingdomSchema', () => {
	it('declares a semver version', () => {
		expect(PingdomSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because check state is read live from the API', () => {
		expect(Array.isArray(PingdomSchema.entities)).toBe(false);
		expect(PingdomSchema.entities).toEqual({});
	});
});

describe('plugin registration', () => {
	it('declares schemas for every implemented endpoint', () => {
		const keys = Object.keys(pingdomEndpointSchemas);
		expect(keys).toHaveLength(40);
		expect(keys).toContain('checks.list');
		expect(keys).toContain('checks.deleteMulti');
		expect(keys).toContain('results.list');
		expect(keys).toContain('summaries.performance');
		expect(keys).toContain('tools.getCredits');
		expect(keys).toContain('maintenance.create');
		expect(keys).toContain('occurrences.update');
		expect(keys).toContain('alerting.contacts.update');
	});

	it('declares meta for every schema key', () => {
		expect(Object.keys(pingdomEndpointMeta).sort()).toEqual(
			Object.keys(pingdomEndpointSchemas).sort(),
		);
	});

	it('marks deletions and the one-off check as destructive or write', () => {
		const meta = pingdomEndpointMeta as Record<string, { riskLevel: string }>;
		const destructive = Object.entries(meta)
			.filter(([key, m]) => m.riskLevel === 'destructive')
			.map(([key]) => key);
		expect(destructive.sort()).toEqual([
			'alerting.contacts.delete',
			'alerting.teams.delete',
			'checks.delete',
			'checks.deleteMulti',
			'maintenance.delete',
			'maintenance.deleteMulti',
			'occurrences.delete',
		]);
		expect(meta['tools.runSingle']?.riskLevel).toBe('write');
	});
});
