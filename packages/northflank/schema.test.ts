import {
	NorthflankEndpointInputSchemas,
	NorthflankEndpointOutputSchemas,
} from './endpoints/types';
import { NorthflankSchema } from './schema';

describe('Northflank schema and endpoint validation', () => {
	it('declares a semver version and empty entities for a stateless plugin', () => {
		expect(NorthflankSchema.version).toBe('1.0.0');
		expect(NorthflankSchema.entities).toEqual({});
	});

	it('validates projects.list pagination input', () => {
		const schema = NorthflankEndpointInputSchemas['projects.list'];
		expect(schema.safeParse(undefined).success).toBe(true);
		expect(schema.safeParse({ page: 1, per_page: 20 }).success).toBe(true);
		expect(schema.safeParse({ per_page: 200 }).success).toBe(false);
	});

	it('validates projects.get input', () => {
		const schema = NorthflankEndpointInputSchemas['projects.get'];
		expect(schema.safeParse({ projectId: 'p1' }).success).toBe(true);
		expect(schema.safeParse({ projectId: '' }).success).toBe(false);
	});

	it('validates projects.create input with region or clusterId', () => {
		const schema = NorthflankEndpointInputSchemas['projects.create'];
		expect(
			schema.safeParse({ name: 'my-proj', region: 'europe-west' }).success,
		).toBe(true);
		expect(
			schema.safeParse({ name: 'my-proj', clusterId: 'gcp-cluster-1' }).success,
		).toBe(true);
		expect(schema.safeParse({ name: 'my-proj' }).success).toBe(false);
	});

	it('validates projects.createOrUpdate input', () => {
		const schema = NorthflankEndpointInputSchemas['projects.createOrUpdate'];
		expect(
			schema.safeParse({ name: 'my-proj', region: 'europe-west' }).success,
		).toBe(true);
		expect(schema.safeParse({ description: 'no name' }).success).toBe(false);
		expect(schema.safeParse({ name: 'my-proj' }).success).toBe(false);
	});

	it('validates projects.update input without name field', () => {
		const schema = NorthflankEndpointInputSchemas['projects.update'];
		expect(
			schema.safeParse({ projectId: 'p1', description: 'Updated' }).success,
		).toBe(true);
		expect(schema.safeParse({ description: 'Updated' }).success).toBe(false);
	});

	it('validates projects.delete input', () => {
		const schema = NorthflankEndpointInputSchemas['projects.delete'];
		expect(
			schema.safeParse({ projectId: 'p1', delete_child_objects: true }).success,
		).toBe(true);
		expect(schema.safeParse({}).success).toBe(false);
	});

	it('validates services.list input', () => {
		const schema = NorthflankEndpointInputSchemas['services.list'];
		expect(schema.safeParse({ projectId: 'p1' }).success).toBe(true);
		expect(schema.safeParse({}).success).toBe(false);
	});

	it('validates secrets.get input with show filter', () => {
		const schema = NorthflankEndpointInputSchemas['secrets.get'];
		expect(
			schema.safeParse({ projectId: 'p1', secretId: 's1', show: 'all' })
				.success,
		).toBe(true);
		expect(schema.safeParse({ projectId: 'p1', secretId: 's1' }).success).toBe(
			true,
		);
		expect(
			schema.safeParse({ projectId: 'p1', secretId: 's1', show: 'everything' })
				.success,
		).toBe(false);
	});

	it('validates secrets.create input with docs-accurate secretType enum', () => {
		const schema = NorthflankEndpointInputSchemas['secrets.create'];
		expect(
			schema.safeParse({
				projectId: 'p1',
				name: 'API_SECRET',
				secretType: 'environment',
				priority: 10,
				secrets: { variables: { TOKEN: 'xyz' } },
			}).success,
		).toBe(true);
		expect(schema.safeParse({ projectId: 'p1' }).success).toBe(false);
		// Legacy out-of-scope values are rejected
		expect(
			schema.safeParse({
				projectId: 'p1',
				name: 'API_SECRET',
				secretType: 'variable',
				priority: 10,
			}).success,
		).toBe(false);
	});

	it('validates secrets.createOrUpdate input', () => {
		const schema = NorthflankEndpointInputSchemas['secrets.createOrUpdate'];
		expect(
			schema.safeParse({
				projectId: 'p1',
				name: 'API_SECRET',
				secretType: 'environment',
				priority: 5,
			}).success,
		).toBe(true);
		expect(schema.safeParse({ projectId: 'p1' }).success).toBe(false);
	});

	it('validates secrets.patch input with all-optional body', () => {
		const schema = NorthflankEndpointInputSchemas['secrets.patch'];
		expect(
			schema.safeParse({
				projectId: 'p1',
				secretId: 's1',
				description: 'patched',
			}).success,
		).toBe(true);
		expect(schema.safeParse({ projectId: 'p1' }).success).toBe(false);
	});

	it('validates secrets.update input', () => {
		const schema = NorthflankEndpointInputSchemas['secrets.update'];
		expect(
			schema.safeParse({
				projectId: 'p1',
				secretId: 's1',
				priority: 7,
			}).success,
		).toBe(true);
		expect(
			schema.safeParse({ projectId: 'p1', secretId: 's1', priority: 'high' })
				.success,
		).toBe(false);
	});

	it('validates secrets.getDetails input', () => {
		const schema = NorthflankEndpointInputSchemas['secrets.getDetails'];
		expect(schema.safeParse({ projectId: 'p1', secretId: 's1' }).success).toBe(
			true,
		);
		expect(schema.safeParse({ projectId: 'p1' }).success).toBe(false);
	});

	it('validates pipelines.list input', () => {
		const schema = NorthflankEndpointInputSchemas['pipelines.list'];
		expect(schema.safeParse({ projectId: 'p1', page: 2 }).success).toBe(true);
		expect(schema.safeParse({}).success).toBe(false);
	});

	it('validates plans.list input', () => {
		const schema = NorthflankEndpointInputSchemas['plans.list'];
		expect(schema.safeParse(undefined).success).toBe(true);
		expect(schema.safeParse({ page: 2 }).success).toBe(true);
	});

	it('validates regions.list input', () => {
		const schema = NorthflankEndpointInputSchemas['regions.list'];
		expect(schema.safeParse({}).success).toBe(true);
	});

	it('validates addonTypes.list input', () => {
		const schema = NorthflankEndpointInputSchemas['addonTypes.list'];
		expect(schema.safeParse(undefined).success).toBe(true);
		expect(schema.safeParse({ per_page: 50 }).success).toBe(true);
	});

	it('validates cloudProviders.listNodeTypes input with provider filters', () => {
		const schema =
			NorthflankEndpointInputSchemas['cloudProviders.listNodeTypes'];
		expect(schema.safeParse({ provider: 'gcp', hasGpu: true }).success).toBe(
			true,
		);
		expect(schema.safeParse({ maxGenerationAge: 'recent' }).success).toBe(
			false,
		);
	});

	it('validates cloudProviders.listRegions input', () => {
		const schema = NorthflankEndpointInputSchemas['cloudProviders.listRegions'];
		expect(schema.safeParse({}).success).toBe(true);
		expect(schema.safeParse({ provider: 'aws' }).success).toBe(true);
	});

	it('validates misc.getDnsId input', () => {
		const schema = NorthflankEndpointInputSchemas['misc.getDnsId'];
		expect(schema.safeParse({}).success).toBe(true);
		expect(schema.safeParse(undefined).success).toBe(true);
	});

	it('validates projects.list output with top-level pagination', () => {
		const schema = NorthflankEndpointOutputSchemas['projects.list'];
		expect(
			schema.safeParse({
				data: { projects: [{ id: 'p1', name: 'Project 1' }] },
				pagination: { hasNextPage: false, count: 1 },
			}).success,
		).toBe(true);
		expect(schema.safeParse({ unexpected: true }).success).toBe(false);
	});

	it('validates secrets.getDetails output with addon secrets', () => {
		const schema = NorthflankEndpointOutputSchemas['secrets.getDetails'];
		expect(
			schema.safeParse({
				data: {
					id: 'sec1',
					name: 'DB',
					addonSecrets: [
						{
							id: 'addon1',
							name: 'Mongo',
							addonType: 'mongodb',
							version: '4.4.1',
						},
					],
				},
			}).success,
		).toBe(true);
	});

	it('validates misc.getDnsId output', () => {
		const schema = NorthflankEndpointOutputSchemas['misc.getDnsId'];
		expect(schema.safeParse({ data: { dns: 'exam-1234' } }).success).toBe(true);
		expect(schema.safeParse({ data: {} }).success).toBe(false);
	});
});
