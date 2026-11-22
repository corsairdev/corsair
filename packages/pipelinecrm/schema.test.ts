// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test; this one pins the schema contract.
import { pipelinecrmEndpointMeta, pipelinecrmEndpointSchemas } from './index';
import { PipelinecrmSchema } from './schema';

describe('PipelinecrmSchema', () => {
	it('declares a semver version', () => {
		expect(PipelinecrmSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because CRM records are read live from the API', () => {
		expect(Array.isArray(PipelinecrmSchema.entities)).toBe(false);
		expect(PipelinecrmSchema.entities).toEqual({});
	});
});

describe('plugin registration', () => {
	it('declares schemas for every implemented endpoint', () => {
		const keys = Object.keys(pipelinecrmEndpointSchemas);
		expect(keys).toHaveLength(29);
		expect(keys).toContain('deals.list');
		expect(keys).toContain('deals.totalsByStage');
		expect(keys).toContain('people.autocomplete');
		expect(keys).toContain('companies.listPeople');
		expect(keys).toContain('notes.list');
		expect(keys).toContain('users.get');
	});

	it('declares meta for every schema key', () => {
		expect(Object.keys(pipelinecrmEndpointMeta).sort()).toEqual(
			Object.keys(pipelinecrmEndpointSchemas).sort(),
		);
	});

	it('marks only record deletions as destructive', () => {
		const destructive = Object.entries(
			pipelinecrmEndpointMeta as Record<string, { riskLevel: string }>,
		)
			.filter(([key, m]) => m.riskLevel === 'destructive')
			.map(([key]) => key);
		expect(destructive.sort()).toEqual([
			'companies.delete',
			'deals.delete',
			'notes.delete',
			'people.delete',
		]);
	});
});
