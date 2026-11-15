import { ProductboardOperations } from './endpoints/operations';
import {
	ProductboardJsonObjectSchema,
	ProductboardOperationInputSchema,
	ProductboardOutputSchema,
	ProductboardRequestBodySchema,
} from './endpoints/types';
import { productboardEndpointSchemas } from './index';
import { ProductboardSchema } from './schema';

describe('Productboard plugin schema', () => {
	it('declares a semver version and no persisted entities', () => {
		expect(ProductboardSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(ProductboardSchema.entities).toEqual({});
	});

	it('registers input and output schemas for every operation', () => {
		expect(Object.keys(productboardEndpointSchemas).sort()).toEqual(
			Object.keys(ProductboardOperations).sort(),
		);
		for (const schemaPair of Object.values(productboardEndpointSchemas)) {
			expect(schemaPair.input).toBeDefined();
			expect(schemaPair.output).toBeDefined();
		}
	});

	it('uses endpoint-specific strict bodies for request fields', () => {
		expect(
			productboardEndpointSchemas['pluginIntegrations.create'].input?.safeParse(
				{
					body: { data: { callbacks: { action: {} } } },
				},
			).success,
		).toBe(false);
		expect(
			productboardEndpointSchemas[
				'pluginIntegrations.connections.search'
			].input?.safeParse({
				integrationId: 'integration-id',
				body: { data: { filter: { state: ['connected'] } } },
			}).success,
		).toBe(true);
	});

	it('keeps operation inputs strict while accepting documented JSON query/body values', () => {
		expect(
			ProductboardOperationInputSchema.safeParse({ unexpected: true }).success,
		).toBe(false);
		expect(
			ProductboardOperationInputSchema.safeParse({
				id: 'resource-id',
				query: { 'type[]': ['feature', 'initiative'], archived: false },
				body: {
					data: { fields: { name: 'Synthetic record', customField: null } },
				},
			}).success,
		).toBe(true);
		expect(
			ProductboardJsonObjectSchema.safeParse({ callback: () => undefined })
				.success,
		).toBe(false);
		expect(
			ProductboardRequestBodySchema.safeParse({ data: {}, callbacks: {} })
				.success,
		).toBe(false);
	});

	it('validates documented response envelopes and cursor links', () => {
		expect(
			ProductboardOutputSchema.safeParse({
				data: [{ id: 'resource-id', fields: { customField: null } }],
				links: {
					next: 'https://api.productboard.com/v2/notes?pageCursor=opaque',
				},
			}).success,
		).toBe(true);
		expect(
			ProductboardOutputSchema.safeParse({ data: { id: 'resource-id' } })
				.success,
		).toBe(true);
		expect(ProductboardOutputSchema.safeParse(null).success).toBe(true);
		expect(
			ProductboardOutputSchema.safeParse({ links: { next: null } }).success,
		).toBe(false);
		expect(
			ProductboardOutputSchema.safeParse('not-json-envelope').success,
		).toBe(false);
	});

	it('has official v2 source evidence and a method/path for each operation', () => {
		for (const operation of Object.values(ProductboardOperations)) {
			expect(operation.path).toMatch(/^\//);
			expect(operation.doc).toMatch(
				/^https:\/\/developer\.productboard\.com\/reference\//,
			);
			expect(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']).toContain(
				operation.method,
			);
		}
		expect(Object.keys(ProductboardOperations)).toHaveLength(54);
	});
});
