import {
	NorthflankEndpointInputSchemas,
	NorthflankEndpointOutputSchemas,
} from './endpoints/types';
import { NorthflankSchema } from './schema';

describe('Northflank schema and endpoint validation', () => {
	it('declares a semver version and empty entities for stateless plugin', () => {
		expect(NorthflankSchema.version).toBe('1.0.0');
		expect(NorthflankSchema.entities).toEqual({});
	});

	describe('Input and Output Schemas', () => {
		it('validates ProjectsListInputSchema', () => {
			const schema = NorthflankEndpointInputSchemas['projects.list'];
			expect(schema.safeParse(undefined).success).toBe(true);
			expect(schema.safeParse({ page: 1, per_page: 20 }).success).toBe(true);
			expect(schema.safeParse({ per_page: 200 }).success).toBe(false);
		});

		it('validates ProjectsGetInputSchema', () => {
			const schema = NorthflankEndpointInputSchemas['projects.get'];
			expect(schema.safeParse({ projectId: 'p1' }).success).toBe(true);
			expect(schema.safeParse({ projectId: '' }).success).toBe(false);
		});

		it('validates ProjectsCreateInputSchema', () => {
			const schema = NorthflankEndpointInputSchemas['projects.create'];
			expect(
				schema.safeParse({ name: 'my-proj', region: 'europe-west' }).success,
			).toBe(true);
			expect(schema.safeParse({ name: 'my-proj' }).success).toBe(false);
		});

		it('validates ServicesCreateCombinedInputSchema', () => {
			const schema = NorthflankEndpointInputSchemas['services.createCombined'];
			expect(
				schema.safeParse({
					projectId: 'p1',
					name: 'api-service',
					deployment: { instances: 1 },
				}).success,
			).toBe(true);
			expect(schema.safeParse({ name: 'api-service' }).success).toBe(false);
		});

		it('validates EnvironmentsListPreviewsInputSchema', () => {
			const schema =
				NorthflankEndpointInputSchemas['environments.listPreviews'];
			expect(
				schema.safeParse({
					projectId: 'p1',
					previewBlueprintId: 'bp1',
				}).success,
			).toBe(true);
			expect(schema.safeParse({ projectId: 'p1' }).success).toBe(false);
		});

		it('validates SecretsCreateInputSchema', () => {
			const schema = NorthflankEndpointInputSchemas['secrets.create'];
			expect(
				schema.safeParse({
					projectId: 'p1',
					name: 'API_SECRET',
					secretType: 'secret',
					data: { TOKEN: 'xyz' },
				}).success,
			).toBe(true);
			expect(schema.safeParse({ projectId: 'p1' }).success).toBe(false);
		});

		it('validates PlansListInputSchema', () => {
			const schema = NorthflankEndpointInputSchemas['plans.list'];
			expect(schema.safeParse(undefined).success).toBe(true);
			expect(schema.safeParse({ page: 2 }).success).toBe(true);
		});

		it('validates RegionsListInputSchema', () => {
			const schema = NorthflankEndpointInputSchemas['regions.list'];
			expect(schema.safeParse({}).success).toBe(true);
		});

		it('validates ProjectsListOutputSchema', () => {
			const schema = NorthflankEndpointOutputSchemas['projects.list'];
			expect(
				schema.safeParse({
					data: {
						projects: [{ id: 'p1', name: 'Project 1' }],
					},
				}).success,
			).toBe(true);
		});
	});
});
