import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import * as client from './client';
import { CollectionPermissions, Collections } from './endpoints';
import { MetabaseOpenApiTestCases } from './endpoints/openapi-endpoints';
import type { MetabaseContext } from './index';
import { metabase, metabaseEndpointSchemas } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makeMetabaseRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makeMetabaseRequest);
const mockedLogEvent = jest.mocked(logEventFromContext);
type EndpointContext = Parameters<typeof Collections.list>[0];

function addUndocumentedInputField(
	input: (typeof MetabaseOpenApiTestCases)[number]['input'],
): (typeof MetabaseOpenApiTestCases)[number]['input'] {
	if (
		input === null ||
		typeof input !== 'object' ||
		Array.isArray(input) ||
		input instanceof Blob
	) {
		return { undocumented: true };
	}
	return { ...input, undocumented: true };
}

function buildContext(): EndpointContext {
	const context: MetabaseContext = {
		endpoints: {},
		$getAccountId: () => Promise.resolve('account-1'),
		key: 'metabase-test-key',
		options: { baseUrl: 'https://metabase.test' },
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('metabase-test-key'),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
	return context;
}

const context = buildContext();
const collection = { id: 8, name: 'Finance' };
const candidate = {
	description: null,
	id: 15,
	name: 'Monthly revenue',
	sole_dashboard_info: { id: 6, name: 'Revenue dashboard', description: null },
};
const graph = { groups: { '2': { '8': 'read' } }, revision: 3 };
const moved = { moved: [15] };
const item = { id: 8, name: 'Finance', model: 'collection' };

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLogEvent.mockReset();
});

describe('Metabase collection operations', () => {
	const operations = [
		{
			name: 'collections.list',
			run: () => Collections.list(context, { query: { archived: true } }),
			path: '/api/collection',
			request: { method: 'GET', query: { archived: true } },
			response: [collection],
		},
		{
			name: 'collections.create',
			run: () =>
				Collections.create(context, {
					body: { name: 'Finance', description: 'Revenue reporting' },
				}),
			path: '/api/collection',
			request: {
				method: 'POST',
				body: { name: 'Finance', description: 'Revenue reporting' },
			},
			response: collection,
		},
		{
			name: 'collections.get',
			run: () => Collections.get(context, { path: { id: 8 } }),
			path: '/api/collection/8',
			request: { method: 'GET' },
			response: collection,
		},
		{
			name: 'collections.update',
			run: () =>
				Collections.update(context, {
					path: { id: 8 },
					body: { name: 'Finance reports' },
				}),
			path: '/api/collection/8',
			request: { method: 'PUT', body: { name: 'Finance reports' } },
			response: { id: 8, name: 'Finance reports' },
		},
		{
			name: 'collections.delete',
			run: () => Collections.delete(context, { path: { id: 8 } }),
			path: '/api/collection/8',
			request: { method: 'DELETE' },
			response: 1,
		},
		{
			name: 'collectionPermissions.graph.get',
			run: () =>
				CollectionPermissions.graph.get(context, {
					query: { namespace: 'analytics' },
				}),
			path: '/api/collection/graph',
			request: { method: 'GET', query: { namespace: 'analytics' } },
			response: graph,
		},
		{
			name: 'collectionPermissions.graph.update',
			run: () =>
				CollectionPermissions.graph.update(context, {
					query: { force: false, 'skip-graph': true },
					body: { groups: { '2': { '8': 'write' } }, revision: 3 },
				}),
			path: '/api/collection/graph',
			request: {
				method: 'PUT',
				query: { force: false, 'skip-graph': true },
				body: { groups: { '2': { '8': 'write' } }, revision: 3 },
			},
			response: { revision: 4 },
		},
		{
			name: 'collections.root.get',
			run: () => Collections.root.get(context, {}),
			path: '/api/collection/root',
			request: { method: 'GET', query: undefined },
			response: { id: 'root', name: 'Root' },
		},
		{
			name: 'collections.root.items.list',
			run: () =>
				Collections.root.items.list(context, {
					query: { models: ['dashboard', 'collection'], q: 'Revenue' },
				}),
			path: '/api/collection/root/items',
			request: {
				method: 'GET',
				query: { models: ['dashboard', 'collection'], q: 'Revenue' },
			},
			response: { total: 1, data: [item], models: ['dashboard'] },
		},
		{
			name: 'collections.root.items.metadata',
			run: () =>
				Collections.root.items.metadata(context, {
					query: { models: ['dashboard'], archived: false },
				}),
			path: '/api/collection/root/items/metadata',
			request: {
				method: 'GET',
				query: { models: ['dashboard'], archived: false },
			},
			response: { available_models: ['dashboard'], total_items: 1 },
		},
		{
			name: 'collections.root.candidates.list',
			run: () => Collections.root.candidates.list(context, {}),
			path: '/api/collection/root/dashboard-question-candidates',
			request: { method: 'GET' },
			response: { data: [candidate], total: 1 },
		},
		{
			name: 'collections.root.candidates.move',
			run: () =>
				Collections.root.candidates.move(context, {
					body: { card_ids: [15] },
				}),
			path: '/api/collection/root/move-dashboard-question-candidates',
			request: { method: 'POST', body: { card_ids: [15] } },
			response: moved,
		},
		{
			name: 'collections.trash.get',
			run: () => Collections.trash.get(context, {}),
			path: '/api/collection/trash',
			request: { method: 'GET' },
			response: { id: 'trash', name: 'Trash' },
		},
		{
			name: 'collections.tree',
			run: () => Collections.tree(context, { query: { shallow: true } }),
			path: '/api/collection/tree',
			request: { method: 'GET', query: { shallow: true } },
			response: [{ id: 8, name: 'Finance', children: true }],
		},
		{
			name: 'collections.candidates.list',
			run: () => Collections.candidates.list(context, { path: { id: 8 } }),
			path: '/api/collection/8/dashboard-question-candidates',
			request: { method: 'GET' },
			response: { data: [candidate], total: 1 },
		},
		{
			name: 'collections.candidates.move',
			run: () =>
				Collections.candidates.move(context, {
					path: { id: 8 },
					body: { card_ids: [15] },
				}),
			path: '/api/collection/8/move-dashboard-question-candidates',
			request: { method: 'POST', body: { card_ids: [15] } },
			response: moved,
		},
		{
			name: 'collections.items.list',
			run: () =>
				Collections.items.list(context, {
					path: { id: 8 },
					query: { 'pinned-state': 'is_pinned' },
				}),
			path: '/api/collection/8/items',
			request: { method: 'GET', query: { 'pinned-state': 'is_pinned' } },
			response: { total: 1, data: [item], models: ['collection'] },
		},
		{
			name: 'collections.items.metadata',
			run: () =>
				Collections.items.metadata(context, {
					path: { id: 8 },
					query: { archived: false },
				}),
			path: '/api/collection/8/items/metadata',
			request: { method: 'GET', query: { archived: false } },
			response: { available_models: ['collection'], total_items: 1 },
		},
	];

	for (const operation of operations) {
		it(`sends the documented request and validates ${operation.name}`, async () => {
			mockedRequest.mockResolvedValue(z.json().parse(operation.response));

			const result = await operation.run();

			expect(result).toEqual(operation.response);
			expect(mockedRequest).toHaveBeenCalledWith(
				operation.path,
				'metabase-test-key',
				'https://metabase.test',
				operation.request,
			);
			expect(mockedLogEvent).toHaveBeenCalledTimes(1);
		});
	}

	it('rejects undocumented request keys before network I/O', async () => {
		const query = { archived: true, surprise: 'not documented' };
		await expect(Collections.list(context, { query })).rejects.toThrow(
			'Metabase request input failed validation',
		);
		expect(mockedRequest).not.toHaveBeenCalled();
		expect(mockedLogEvent).not.toHaveBeenCalled();
	});

	it('encodes a documented NanoID path segment without changing its host', async () => {
		mockedRequest.mockResolvedValue(collection);
		await Collections.get(context, { path: { id: 'A1b2C3d4E5f6G7h8I9j0K' } });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/collection/A1b2C3d4E5f6G7h8I9j0K',
			'metabase-test-key',
			'https://metabase.test',
			{ method: 'GET' },
		);
	});

	it('keeps queries and collection names out of event payloads', async () => {
		mockedRequest.mockResolvedValue({
			total: 1,
			data: [collection],
			models: [],
		});
		await Collections.root.items.list(context, {
			query: { q: 'private client query' },
		});

		const eventPayload = mockedLogEvent.mock.calls[0]?.[2];
		expect(eventPayload).toEqual({});
		expect(mockedLogEvent.mock.calls[0]?.[1]).toBe(
			'metabase.collections.listRootItems',
		);
		expect(JSON.stringify(eventPayload)).not.toContain('private client query');
		expect(JSON.stringify(eventPayload)).not.toContain('Finance');
		expect(JSON.stringify(eventPayload)).not.toContain('metabase-test-key');
	});

	it('rejects malformed provider responses before logging completion', async () => {
		mockedRequest.mockResolvedValue({
			items: [],
			name: 'sensitive server value',
		});
		await expect(Collections.list(context, {})).rejects.toThrow(
			'Metabase response failed validation',
		);
		expect(mockedLogEvent).not.toHaveBeenCalled();
	});

	it('registers matching schemas and declares no webhooks', () => {
		const plugin = metabase({ baseUrl: 'https://metabase.test' });
		expect(Object.keys(metabaseEndpointSchemas)).toHaveLength(309);
		expect(plugin.endpoints?.collections.list).toBeDefined();
		expect(plugin.endpoints?.collectionPermissions.graph.update).toBeDefined();
		expect(plugin.webhooks).toEqual({});
	});

	describe('OpenAPI-declared operations', () => {
		it('sends and validates a documented request for every generated route', async () => {
			expect(MetabaseOpenApiTestCases).toHaveLength(291);
			for (const route of MetabaseOpenApiTestCases) {
				mockedRequest.mockReset();
				mockedLogEvent.mockReset();
				mockedRequest.mockResolvedValue(route.output);

				const result = await route.invoke(context, route.input).catch(() => {
					throw new Error(
						`Generated response fixture failed for ${route.shortPath}`,
					);
				});

				expect(result).toEqual(route.output);
				expect(mockedRequest).toHaveBeenCalledTimes(1);
				const call = mockedRequest.mock.calls[0];
				expect(call?.[0]).toBe(route.path);
				expect(call?.[1]).toBe('metabase-test-key');
				expect(call?.[2]).toBe('https://metabase.test');
				expect(call?.[3]?.method).toBe(route.method);
				if (route.multipart) {
					expect(call?.[3]).toMatchObject(route.expectedOptions);
					const formData = call?.[3]?.formData;
					expect(formData).toBeInstanceOf(FormData);
					const file = formData?.get('file');
					expect(file).toBeInstanceOf(Blob);
				} else {
					expect(call?.[3]).toEqual(route.expectedOptions);
				}
				expect(mockedLogEvent).toHaveBeenCalledWith(
					context,
					`metabase.${route.shortPath}`,
					{},
					'completed',
				);
			}
		});

		it('rejects unknown top-level arguments before network I/O for every route', async () => {
			for (const route of MetabaseOpenApiTestCases) {
				mockedRequest.mockReset();
				mockedLogEvent.mockReset();
				await expect(
					route.invoke(context, addUndocumentedInputField(route.input)),
				).rejects.toThrow();
				expect(mockedRequest).not.toHaveBeenCalled();
				expect(mockedLogEvent).not.toHaveBeenCalled();
			}
		});

		it('rejects malformed generated responses before logging completion', async () => {
			const route = MetabaseOpenApiTestCases.find(
				(candidateRoute) =>
					candidateRoute.shortPath === 'apiKey.putByIdRegenerate',
			);
			if (!route) throw new Error('API-key regeneration is not registered');
			mockedRequest.mockResolvedValue({});

			await expect(route.invoke(context, route.input)).rejects.toThrow(
				'Metabase response failed validation',
			);
			expect(mockedRequest).toHaveBeenCalledTimes(1);
			expect(mockedLogEvent).not.toHaveBeenCalled();
		});

		it('returns binary output for documented CSV exploration queries', async () => {
			const route = MetabaseOpenApiTestCases.find(
				(candidateRoute) =>
					candidateRoute.shortPath === 'exploration.getQueryById',
			);
			if (!route)
				throw new Error('Exploration query operation is not registered');
			const artifact = {
				kind: 'binary' as const,
				contentType: 'text/csv',
				base64: 'YSxiCg==',
				size: 4,
				headers: {},
			};
			mockedRequest.mockResolvedValue(artifact);

			const result = await route.invoke(context, {
				path: { id: 8 },
				query: { format: 'csv' },
			});

			expect(result).toEqual(artifact);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/api/exploration/query/8',
				'metabase-test-key',
				'https://metabase.test',
				{
					method: 'GET',
					query: { format: 'csv' },
					responseType: 'binary',
					requestTimeoutMs: 120000,
				},
			);
		});
	});
});
