import { ProductboardOperations } from './endpoints/operations';
import {
	ProductboardJsonObjectSchema,
	ProductboardOperationInputSchema,
	ProductboardOutputSchema,
	ProductboardRequestBodySchema,
	ProductboardWebhookCreateBodySchema,
	ProductboardWebhookGetOutputSchema,
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

	it('validates webhook subscriptions against the documented contract', () => {
		const validBody = {
			data: {
				fields: {
					name: 'Feature updates',
					events: [{ eventType: 'feature.updated' }],
					notification: {
						url: 'https://receiver.example/productboard',
						version: 1,
						headers: { authorization: 'Bearer test-secret' },
					},
				},
			},
		};
		expect(
			ProductboardWebhookCreateBodySchema.safeParse(validBody).success,
		).toBe(true);
		expect(
			ProductboardWebhookCreateBodySchema.safeParse({
				...validBody,
				data: {
					fields: {
						...validBody.data.fields,
						events: [
							{ eventType: 'feature.updated' },
							{ eventType: 'feature.updated' },
						],
					},
				},
			}).success,
		).toBe(false);
		expect(
			ProductboardWebhookCreateBodySchema.safeParse({
				...validBody,
				data: {
					fields: {
						...validBody.data.fields,
						notification: {
							url: 'http://receiver.example/productboard',
							version: 1,
						},
					},
				},
			}).success,
		).toBe(false);

		const responseWithUnexpectedSecret =
			ProductboardWebhookGetOutputSchema.parse({
				data: {
					id: '550e8400-e29b-41d4-a716-446655440000',
					type: 'webhook',
					createdAt: '2024-01-15T10:30:00.000Z',
					fields: {
						name: 'Feature updates',
						events: [{ eventType: 'feature.updated' }],
						notification: {
							url: 'https://receiver.example/productboard',
							version: 1,
							headers: { authorization: 'unexpected-secret' },
						},
					},
					links: {
						self: 'https://api.productboard.com/v2/webhooks/550e8400-e29b-41d4-a716-446655440000',
					},
				},
			});
		expect(responseWithUnexpectedSecret.data.fields.notification).toEqual({
			url: 'https://receiver.example/productboard',
			version: 1,
		});
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
		expect(Object.keys(ProductboardOperations)).toHaveLength(58);
	});
});
