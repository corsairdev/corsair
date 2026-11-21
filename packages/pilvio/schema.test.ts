// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test; this one pins the schema contract.
import { pilvioEndpointMeta, pilvioEndpointSchemas } from './index';
import { PilvioSchema } from './schema';

describe('PilvioSchema', () => {
	it('declares a semver version', () => {
		expect(PilvioSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because infrastructure state is read live from the API', () => {
		expect(Array.isArray(PilvioSchema.entities)).toBe(false);
		expect(PilvioSchema.entities).toEqual({});
	});
});

describe('plugin registration', () => {
	it('declares schemas for every implemented endpoint', () => {
		const keys = Object.keys(pilvioEndpointSchemas);
		expect(keys).toHaveLength(41);
		expect(keys).toContain('account.getUser');
		expect(keys).toContain('account.sshKeys.delete');
		expect(keys).toContain('config.listLocations');
		expect(keys).toContain('vm.create');
		expect(keys).toContain('storage.disks.create');
		expect(keys).toContain('storage.buckets.get');
		expect(keys).toContain('network.networks.create');
		expect(keys).toContain('network.firewalls.delete');
	});

	it('declares meta for every schema key', () => {
		expect(Object.keys(pilvioEndpointMeta).sort()).toEqual(
			Object.keys(pilvioEndpointSchemas).sort(),
		);
	});

	it('marks only deletions and reinstalls as destructive', () => {
		const destructive = Object.entries(
			pilvioEndpointMeta as Record<string, { riskLevel: string }>,
		)
			.filter(([key, meta]) => meta.riskLevel === 'destructive')
			.map(([key]) => key);
		expect(destructive.sort()).toEqual([
			'account.sshKeys.delete',
			'account.tokens.delete',
			'network.firewalls.delete',
			'network.networks.delete',
			'storage.buckets.delete',
			'storage.disks.delete',
			'vm.delete',
			'vm.reinstall',
		]);
	});
});
