import { RunpodSchema } from './schema';
import {
	RunpodCluster,
	RunpodEndpoint,
	RunpodPod,
	RunpodRegistryAuth,
	RunpodSecret,
	RunpodTemplate,
	RunpodUser,
} from './schema/database';

describe('Runpod schema', () => {
	it('declares a semver version', () => {
		expect(RunpodSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares labeled entities from official docs', () => {
		expect(Object.keys(RunpodSchema.entities)).toEqual([
			'users',
			'pods',
			'clusters',
			'templates',
			'endpoints',
			'registryAuths',
			'secrets',
		]);
		expect(RunpodSchema.entities.users).toBe(RunpodUser);
		expect(RunpodSchema.entities.pods).toBe(RunpodPod);
		expect(RunpodSchema.entities.clusters).toBe(RunpodCluster);
		expect(RunpodSchema.entities.templates).toBe(RunpodTemplate);
		expect(RunpodSchema.entities.endpoints).toBe(RunpodEndpoint);
		expect(RunpodSchema.entities.registryAuths).toBe(RunpodRegistryAuth);
		expect(RunpodSchema.entities.secrets).toBe(RunpodSecret);
	});

	it('coerces string costPerHr from the REST API', () => {
		expect(RunpodPod.parse({ id: 'pod_1', costPerHr: '0.74' }).costPerHr).toBe(
			0.74,
		);
	});
});
