import { ProductboardOperations } from './endpoints/operations';
import {
	ProductboardConnectionSearchBodySchema,
	ProductboardJsonObjectSchema,
	ProductboardNoteCreateBodySchema,
	ProductboardOperationInputSchema,
	ProductboardOutputSchema,
	ProductboardRequestBodySchema,
	ProductboardTeamSearchBodySchema,
	ProductboardTeamsListOutputSchema,
	ProductboardWebhookCreateBodySchema,
	ProductboardWebhookGetOutputSchema,
} from './endpoints/types';
import { productboard, productboardEndpointSchemas } from './index';
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
		for (const operation of Object.values(ProductboardOperations)) {
			expect(
				('outputSchema' in operation && operation.outputSchema) ||
					('noContent' in operation && operation.noContent) ||
					('outputKind' in operation && operation.outputKind),
			).toBeTruthy();
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
		expect(ProductboardTeamSearchBodySchema.safeParse({}).success).toBe(true);
		expect(
			ProductboardTeamSearchBodySchema.safeParse({ data: {} }).success,
		).toBe(true);
		expect(
			ProductboardTeamSearchBodySchema.safeParse({
				data: { search: 'string instead of object' },
			}).success,
		).toBe(false);
		expect(
			productboardEndpointSchemas['teams.search'].input?.safeParse({
				body: { data: { other: true } },
			}).success,
		).toBe(false);
		expect(
			productboardEndpointSchemas['teams.search'].input?.safeParse({
				body: {},
			}).success,
		).toBe(true);
		expect(
			productboardEndpointSchemas[
				'pluginIntegrations.connections.search'
			].input?.safeParse({
				integrationId: 'integration-id',
				body: { data: { search: {} } },
			}).success,
		).toBe(false);
		expect(
			ProductboardConnectionSearchBodySchema.safeParse({ data: { filter: [] } })
				.success,
		).toBe(false);
		expect(ProductboardConnectionSearchBodySchema.safeParse({}).success).toBe(
			true,
		);
		expect(
			ProductboardConnectionSearchBodySchema.safeParse({
				data: { filter: { state: ['connected'] } },
			}).success,
		).toBe(true);
	});

	it('requires Productboard note creation fields while retaining dynamic field names and types', () => {
		expect(
			ProductboardNoteCreateBodySchema.safeParse({
				data: {
					type: 'textNote',
					fields: {
						name: 'Synthetic note',
						customWorkspaceField: { value: 'kept' },
					},
				},
			}).success,
		).toBe(true);
		expect(
			ProductboardNoteCreateBodySchema.safeParse({
				data: { fields: { name: 'Missing note type' } },
			}).success,
		).toBe(false);
		expect(
			ProductboardNoteCreateBodySchema.safeParse({
				data: { type: 'textNote', fields: { content: 'No name' } },
			}).success,
		).toBe(false);
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
		expect(
			ProductboardWebhookGetOutputSchema.safeParse({
				data: {
					...responseWithUnexpectedSecret.data,
					createdAt: '2024-01-15T11:30:00+01:00',
				},
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
		expect(ProductboardOutputSchema.safeParse(null).success).toBe(false);
		expect(
			ProductboardOutputSchema.safeParse({ links: { next: null } }).success,
		).toBe(false);
		expect(
			ProductboardOutputSchema.safeParse('not-json-envelope').success,
		).toBe(false);
	});

	it('exposes operation-specific response schemas and destructive reset risks', () => {
		expect(
			productboardEndpointSchemas['teams.list'].output?.safeParse({ data: [] })
				.success,
		).toBe(true);
		expect(
			productboardEndpointSchemas['teams.list'].output?.safeParse({
				data: {},
			}).success,
		).toBe(false);
		expect(
			ProductboardTeamsListOutputSchema.safeParse({ data: [null] }).success,
		).toBe(false);
		expect(
			productboardEndpointSchemas['teams.create'].output?.safeParse({
				data: [],
			}).success,
		).toBe(false);
		expect(
			productboardEndpointSchemas['notes.delete'].output?.safeParse(null)
				.success,
		).toBe(true);
		expect(
			productboardEndpointSchemas['notes.delete'].output?.safeParse({
				data: {},
			}).success,
		).toBe(false);
		expect(productboard().endpointMeta).toMatchObject({
			'pluginIntegrations.connections.update': { riskLevel: 'destructive' },
			'pluginIntegrations.connections.delete': { riskLevel: 'destructive' },
		});
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
