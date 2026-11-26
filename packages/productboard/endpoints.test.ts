import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import type {
	ProductboardOperation,
	ProductboardOperationName,
} from './endpoints/operations';
import {
	createProductboardEndpoint,
	ProductboardOperations,
} from './endpoints/operations';
import type {
	ProductboardJsonObject,
	ProductboardOperationInput,
	ProductboardOutput,
} from './endpoints/types';
import type { ProductboardContext, ProductboardEndpoints } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makeProductboardRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makeProductboardRequest);
const mockedLogEvent = jest.mocked(logEventFromContext);
const README_ROUTE_ROWS = readFileSync(
	join(__dirname, 'README.md'),
	'utf8',
).split(/\r?\n/);

// Literal method/path expectations are maintained independently of the
// operation registry and cross-checked against the official route pages:
// https://developer.productboard.com/reference/.
const EXPECTED_PRODUCTBOARD_ROUTES = [
	['notes.list', 'GET', '/notes'],
	['notes.search', 'POST', '/notes/search'],
	['notes.create', 'POST', '/notes'],
	['notes.get', 'GET', '/notes/{id}'],
	['notes.update', 'PATCH', '/notes/{id}'],
	['notes.delete', 'DELETE', '/notes/{id}'],
	['notes.configurations.list', 'GET', '/notes/configurations'],
	['notes.configurations.get', 'GET', '/notes/configurations/{type}'],
	['notes.relationships.list', 'GET', '/notes/{id}/relationships'],
	['notes.relationships.create', 'POST', '/notes/{id}/relationships'],
	[
		'notes.relationships.setCustomer',
		'PUT',
		'/notes/{id}/relationships/customer',
	],
	[
		'notes.relationships.delete',
		'DELETE',
		'/notes/{id}/relationships/{targetType}/{targetId}',
	],
	['entities.list', 'GET', '/entities'],
	['entities.search', 'POST', '/entities/search'],
	['entities.create', 'POST', '/entities'],
	['entities.get', 'GET', '/entities/{id}'],
	['entities.update', 'PATCH', '/entities/{id}'],
	['entities.delete', 'DELETE', '/entities/{id}'],
	['entities.configurations.list', 'GET', '/entities/configurations'],
	['entities.configurations.get', 'GET', '/entities/configurations/{type}'],
	['entities.relationships.list', 'GET', '/entities/{id}/relationships'],
	['entities.relationships.create', 'POST', '/entities/{id}/relationships'],
	[
		'entities.relationships.setParent',
		'PUT',
		'/entities/{id}/relationships/parent',
	],
	[
		'entities.relationships.delete',
		'DELETE',
		'/entities/{id}/relationships/{type}/{targetId}',
	],
	['entities.fieldValues.list', 'GET', '/entities/fields/{fieldId}/values'],
	['entities.fieldValues.create', 'POST', '/entities/fields/{fieldId}/values'],
	[
		'entities.fieldValues.update',
		'PATCH',
		'/entities/fields/{fieldId}/values/{valueId}',
	],
	[
		'entities.fieldValues.delete',
		'DELETE',
		'/entities/fields/{fieldId}/values/{valueId}',
	],
	['entities.customerScore', 'GET', '/entities/{id}/score'],
	['analytics.memberActivities', 'GET', '/analytics/member-activities'],
	['members.list', 'GET', '/members'],
	['members.search', 'POST', '/members/search'],
	['members.get', 'GET', '/members/{id}'],
	['teams.list', 'GET', '/teams'],
	['teams.search', 'POST', '/teams/search'],
	['teams.create', 'POST', '/teams'],
	['teams.get', 'GET', '/teams/{id}'],
	['teams.update', 'PATCH', '/teams/{id}'],
	['teams.delete', 'DELETE', '/teams/{id}'],
	['teams.members', 'GET', '/teams/{id}/members'],
	['jiraIntegrations.list', 'GET', '/jira-integrations'],
	['jiraIntegrations.get', 'GET', '/jira-integrations/{id}'],
	[
		'jiraIntegrations.connections',
		'GET',
		'/jira-integrations/{integrationId}/connections',
	],
	[
		'jiraIntegrations.connection',
		'GET',
		'/jira-integrations/{integrationId}/connections/{entityId}',
	],
	['pluginIntegrations.list', 'GET', '/plugin-integrations'],
	['pluginIntegrations.create', 'POST', '/plugin-integrations'],
	['pluginIntegrations.get', 'GET', '/plugin-integrations/{integrationId}'],
	[
		'pluginIntegrations.update',
		'PATCH',
		'/plugin-integrations/{integrationId}',
	],
	[
		'pluginIntegrations.delete',
		'DELETE',
		'/plugin-integrations/{integrationId}',
	],
	[
		'pluginIntegrations.connections.list',
		'GET',
		'/plugin-integrations/{integrationId}/connections',
	],
	[
		'pluginIntegrations.connections.search',
		'POST',
		'/plugin-integrations/{integrationId}/connections/search',
	],
	[
		'pluginIntegrations.connections.get',
		'GET',
		'/plugin-integrations/{integrationId}/connections/{entityId}',
	],
	[
		'pluginIntegrations.connections.update',
		'PUT',
		'/plugin-integrations/{integrationId}/connections/{entityId}',
	],
	[
		'pluginIntegrations.connections.delete',
		'DELETE',
		'/plugin-integrations/{integrationId}/connections/{entityId}',
	],
	['webhooks.list', 'GET', '/webhooks'],
	['webhooks.create', 'POST', '/webhooks'],
	['webhooks.get', 'GET', '/webhooks/{webhookId}'],
	['webhooks.delete', 'DELETE', '/webhooks/{webhookId}'],
] as const satisfies readonly (readonly [
	ProductboardOperationName,
	ProductboardOperation['method'],
	string,
])[];

type TypeAssert<Value extends true> = Value;
type IsRequired<Input, Key extends keyof Input> = {} extends Pick<Input, Key>
	? false
	: true;
type IsOptional<Input, Key extends keyof Input> = {} extends Pick<Input, Key>
	? true
	: false;

export type ProductboardCallerInputTypeRegression = [
	TypeAssert<
		IsRequired<Parameters<ProductboardEndpoints['notes']['get']>[1], 'id'>
	>,
	TypeAssert<
		IsOptional<Parameters<ProductboardEndpoints['notes']['get']>[1], 'query'>
	>,
	TypeAssert<
		IsRequired<Parameters<ProductboardEndpoints['notes']['create']>[1], 'body'>
	>,
	TypeAssert<
		IsRequired<
			Parameters<
				ProductboardEndpoints['pluginIntegrations']['connections']['update']
			>[1],
			'integrationId'
		>
	>,
	TypeAssert<
		IsRequired<
			Parameters<
				ProductboardEndpoints['pluginIntegrations']['connections']['update']
			>[1],
			'entityId'
		>
	>,
	TypeAssert<
		IsRequired<
			Parameters<
				ProductboardEndpoints['pluginIntegrations']['connections']['update']
			>[1],
			'body'
		>
	>,
];

function buildContext(): ProductboardContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-workspace'),
		key: 'test-productboard-token',
		options: {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('test-productboard-token'),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
}

const ctx = buildContext();

function createTestEndpoint(operation: ProductboardOperation) {
	return createProductboardEndpoint(operation);
}

function inputFor(
	operation: ProductboardOperation,
): ProductboardOperationInput {
	let input: ProductboardOperationInput = {};
	if ('pathFields' in operation) {
		for (const field of operation.pathFields ?? []) {
			if (field === 'type') input = { ...input, type: 'textNote' };
			if (field === 'targetType') input = { ...input, targetType: 'link' };
			if (field === 'targetId') input = { ...input, targetId: 'target-id' };
			if (field === 'fieldId') input = { ...input, fieldId: 'name' };
			if (field === 'valueId') input = { ...input, valueId: 'value-id' };
			if (field === 'integrationId')
				input = { ...input, integrationId: 'integration-id' };
			if (field === 'entityId') input = { ...input, entityId: 'entity-id' };
			if (field === 'id') input = { ...input, id: 'resource-id' };
			if (field === 'webhookId') input = { ...input, webhookId: 'webhook-id' };
		}
	}
	if ('query' in operation && operation.query)
		input = { ...input, query: { pageCursor: 'opaque-cursor' } };
	if ('body' in operation && operation.body) {
		let data: ProductboardJsonObject = {
			fields: { name: 'Synthetic test record' },
		};
		if (operation.name === 'notes.search')
			data = { search: { query: 'synthetic' } };
		if (operation.name === 'notes.create')
			data = {
				type: 'textNote',
				fields: { name: 'Synthetic note' },
				relationships: [
					{
						type: 'customer',
						target: {
							id: '123e4567-e89b-12d3-a456-426614174000',
							type: 'user',
						},
					},
				],
			};
		if (operation.name === 'notes.update')
			data = { fields: { name: 'Updated synthetic note' } };
		if (operation.name === 'notes.relationships.create')
			data = { type: 'link', target: { id: 'target-id', type: 'link' } };
		if (operation.name === 'notes.relationships.setCustomer')
			data = { target: { id: 'target-id', type: 'user' } };
		if (operation.name === 'entities.search')
			data = { filter: { type: ['feature'] } };
		if (operation.name === 'entities.create')
			data = { type: 'feature', fields: { name: 'Synthetic entity' } };
		if (operation.name === 'entities.update')
			data = { fields: { name: 'Updated synthetic entity' } };
		if (operation.name === 'entities.relationships.create')
			data = { type: 'link', target: { id: 'target-id' } };
		if (operation.name === 'entities.relationships.setParent')
			data = { target: { id: 'parent-id' } };
		if (
			operation.name === 'members.search' ||
			operation.name === 'teams.search'
		)
			data = { search: { query: 'synthetic' } };
		if (operation.name === 'teams.create')
			data = { fields: { name: 'Synthetic Team', handle: 'syntheticteam' } };
		if (operation.name === 'teams.update')
			data = { fields: { name: 'Updated Synthetic Team' } };
		if (operation.name === 'pluginIntegrations.create')
			data = {
				fields: {
					type: 'com.example.test',
					name: 'Synthetic integration',
					initialState: { label: 'Push' },
					action: {
						url: 'https://receiver.example/action',
						version: 1,
					},
				},
			};
		if (operation.name === 'pluginIntegrations.update')
			data = { fields: { integrationStatus: 'disabled' } };
		if (operation.name === 'pluginIntegrations.connections.search')
			data = { filter: { state: ['connected'] } };
		if (operation.name === 'pluginIntegrations.connections.update')
			data = { fields: { connection: { state: 'initial' } } };
		if (operation.name === 'webhooks.create')
			data = {
				fields: {
					name: 'Synthetic webhook',
					events: [{ eventType: 'feature.updated' }],
					notification: {
						url: 'https://receiver.example/productboard',
						version: 1,
						headers: { authorization: 'Bearer synthetic-webhook-secret' },
					},
				},
			};
		input = {
			...input,
			body: { data },
		};
	}
	return input;
}

function expectedResponseFor(
	operation: ProductboardOperation,
): ProductboardOutput {
	const webhookSelfUrl =
		'https://api.productboard.com/v2/webhooks/550e8400-e29b-41d4-a716-446655440000';
	if (operation.name === 'webhooks.list')
		return { data: [], links: { next: null } };
	if (operation.name === 'webhooks.create')
		return {
			data: {
				id: '550e8400-e29b-41d4-a716-446655440000',
				type: 'webhook',
				links: { self: webhookSelfUrl },
			},
		};
	if (operation.name === 'webhooks.get')
		return {
			data: {
				id: '550e8400-e29b-41d4-a716-446655440000',
				type: 'webhook',
				createdAt: '2024-01-15T10:30:00.000Z',
				fields: {
					name: 'Synthetic webhook',
					events: [{ eventType: 'feature.updated' }],
					notification: {
						url: 'https://receiver.example/productboard',
						version: 1,
					},
				},
				links: { self: webhookSelfUrl },
			},
		};
	if (operation.noContent) return null;
	if (operation.outputKind === 'list' || operation.name === 'teams.search')
		return { data: [], links: { next: null } };
	if (operation.name === 'teams.list')
		return { data: [], links: { next: null } };
	return { data: { id: 'resource-id' } };
}

function expectedPath(
	operation: ProductboardOperation,
	input: ProductboardOperationInput,
): string {
	let path = operation.path;
	if ('pathFields' in operation) {
		for (const field of operation.pathFields ?? []) {
			const value = input[field];
			if (typeof value !== 'string')
				throw new Error(`Missing path field: ${field}`);
			path = path.replace(`{${field}}`, encodeURIComponent(value));
		}
	}
	return path;
}

beforeEach(() => {
	mockedRequest.mockReset();
	mockedRequest.mockResolvedValue({ data: [] });
	mockedLogEvent.mockReset();
});

describe('Productboard operations', () => {
	it('matches independent official method and path expectations for all 58 routes', () => {
		expect(EXPECTED_PRODUCTBOARD_ROUTES.map(([name]) => name).sort()).toEqual(
			Object.keys(ProductboardOperations).sort(),
		);

		for (const [name, method, path] of EXPECTED_PRODUCTBOARD_ROUTES) {
			expect(ProductboardOperations[name].method).toBe(method);
			expect(ProductboardOperations[name].path).toBe(path);
		}
	});

	it('documents every implemented route with its official source URL', () => {
		for (const [name, method, path] of EXPECTED_PRODUCTBOARD_ROUTES) {
			const row = README_ROUTE_ROWS.find((line) =>
				line.startsWith(`| \`${name}\` |`),
			);
			expect(row).toContain(`\`${method} ${path}\``);
			expect(row).toContain(`(${ProductboardOperations[name].doc})`);
		}
	});

	for (const operation of Object.values(ProductboardOperations)) {
		it(`${operation.name} sends the documented method, path, query, and body`, async () => {
			const endpoint = createTestEndpoint(operation);
			const input = inputFor(operation);
			const response = expectedResponseFor(operation);
			mockedRequest.mockResolvedValueOnce(response);
			const result = await endpoint(ctx, input);

			expect(result).toEqual(response);
			expect(mockedRequest).toHaveBeenCalledWith(
				expectedPath(operation, input),
				'test-productboard-token',
				{
					method: operation.method,
					query:
						'query' in operation && operation.query ? input.query : undefined,
					body: 'body' in operation && operation.body ? input.body : undefined,
				},
			);
			expect(mockedLogEvent).toHaveBeenCalledWith(
				ctx,
				`productboard.${operation.name}`,
				{ operation: operation.name },
				'completed',
			);
		});

		it(`${operation.name} rejects missing required inputs before network I/O`, async () => {
			const endpoint = createTestEndpoint(operation);
			const invalidInput =
				('pathFields' in operation && operation.pathFields.length > 0) ||
				('body' in operation && operation.body)
					? {}
					: { body: { data: {} } };
			await expect(endpoint(ctx, invalidInput)).rejects.toThrow();
			expect(mockedRequest).not.toHaveBeenCalled();
			expect(mockedLogEvent).not.toHaveBeenCalled();
		});
	}

	it('rejects undocumented top-level inputs before making a request', async () => {
		const endpoint = createTestEndpoint(ProductboardOperations['notes.list']);
		await expect(endpoint(ctx, { body: { data: {} } })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects callback fields on plugin-integration REST operations', async () => {
		const endpoint = createTestEndpoint(
			ProductboardOperations['pluginIntegrations.create'],
		);
		await expect(
			endpoint(ctx, { body: { data: { callbacks: { action: {} } } } }),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('sends documented empty bodies for team and connection searches', async () => {
		const listResponse = { data: [], links: { next: null } };
		mockedRequest
			.mockResolvedValueOnce(listResponse)
			.mockResolvedValueOnce(listResponse);

		await expect(
			createTestEndpoint(ProductboardOperations['teams.search'])(ctx, {
				body: {},
			}),
		).resolves.toEqual(listResponse);
		await expect(
			createTestEndpoint(
				ProductboardOperations['pluginIntegrations.connections.search'],
			)(ctx, { integrationId: 'integration-id', body: {} }),
		).resolves.toEqual(listResponse);

		expect(mockedRequest).toHaveBeenNthCalledWith(
			1,
			'/teams/search',
			'test-productboard-token',
			expect.objectContaining({ method: 'POST', body: {} }),
		);
		expect(mockedRequest).toHaveBeenNthCalledWith(
			2,
			'/plugin-integrations/integration-id/connections/search',
			'test-productboard-token',
			expect.objectContaining({ method: 'POST', body: {} }),
		);
	});

	it('logs operation names only, not note text or member details', async () => {
		const endpoint = createProductboardEndpoint(
			ProductboardOperations['notes.create'],
		);
		mockedRequest.mockResolvedValueOnce({ data: { id: 'synthetic-note-id' } });
		await endpoint(ctx, {
			body: {
				data: {
					type: 'textNote',
					fields: {
						name: 'Private customer record',
						content: 'Private feedback body',
						owner: { email: 'person@example.com' },
					},
				},
			},
		});
		const loggedPayload = mockedLogEvent.mock.calls[0]?.[2];
		expect(loggedPayload).toEqual({ operation: 'notes.create' });
		expect(JSON.stringify(loggedPayload)).not.toContain(
			'Private feedback body',
		);
		expect(JSON.stringify(loggedPayload)).not.toContain('person@example.com');
	});

	it('rejects a malformed provider response', async () => {
		mockedRequest.mockResolvedValue('not-an-envelope');
		const endpoint = createProductboardEndpoint(
			ProductboardOperations['notes.list'],
		);
		await expect(endpoint(ctx, { query: {} })).rejects.toThrow();
		expect(mockedLogEvent).not.toHaveBeenCalled();
	});

	it('maps an empty transport response to null only for documented 204 operations', async () => {
		for (const operation of Object.values(ProductboardOperations)) {
			mockedRequest.mockResolvedValueOnce(undefined);
			const endpoint = createTestEndpoint(operation);
			const result = endpoint(ctx, inputFor(operation));
			if ('noContent' in operation && operation.noContent) {
				await expect(result).resolves.toBeNull();
			} else {
				await expect(result).rejects.toThrow();
			}
		}
	});

	it('rejects malformed list, resource, and no-content response shapes', async () => {
		mockedRequest.mockResolvedValueOnce({ data: {} });
		await expect(
			createTestEndpoint(ProductboardOperations['teams.list'])(ctx, {
				query: {},
			}),
		).rejects.toThrow();

		mockedRequest.mockResolvedValueOnce({ data: [] });
		await expect(
			createTestEndpoint(ProductboardOperations['teams.create'])(ctx, {
				body: {
					data: {
						fields: { name: 'Synthetic Team', handle: 'syntheticteam' },
					},
				},
			}),
		).rejects.toThrow();

		mockedRequest.mockResolvedValueOnce({ data: {} });
		await expect(
			createTestEndpoint(ProductboardOperations['teams.create'])(ctx, {
				body: {
					data: {
						fields: { name: 'Synthetic Team', handle: 'syntheticteam' },
					},
				},
			}),
		).rejects.toThrow();

		mockedRequest.mockResolvedValueOnce({ data: { id: 'unexpected' } });
		await expect(
			createTestEndpoint(ProductboardOperations['notes.delete'])(ctx, {
				id: 'note-id',
			}),
		).rejects.toThrow();
	});
});
