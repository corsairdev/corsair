import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import type { ProductboardOperation } from './endpoints/operations';
import {
	createProductboardEndpoint,
	ProductboardOperations,
} from './endpoints/operations';
import type {
	ProductboardJsonObject,
	ProductboardOperationInput,
} from './endpoints/types';
import type { ProductboardContext } from './index';

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

function inputFor(
	operation: ProductboardOperation,
): ProductboardOperationInput {
	let input: ProductboardOperationInput = {};
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
	}
	if (operation.query)
		input = { ...input, query: { pageCursor: 'opaque-cursor' } };
	if (operation.body) {
		let data: ProductboardJsonObject = {
			fields: { name: 'Synthetic test record' },
		};
		if (operation.name === 'notes.search')
			data = { search: { query: 'synthetic' } };
		if (operation.name === 'notes.create')
			data = { type: 'textNote', fields: { name: 'Synthetic note' } };
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
		input = {
			...input,
			body: { data },
		};
	}
	return input;
}

function expectedPath(
	operation: ProductboardOperation,
	input: ProductboardOperationInput,
): string {
	let path = operation.path;
	for (const field of operation.pathFields ?? []) {
		const value = input[field];
		if (typeof value !== 'string')
			throw new Error(`Missing path field: ${field}`);
		path = path.replace(`{${field}}`, encodeURIComponent(value));
	}
	return path;
}

beforeEach(() => {
	mockedRequest.mockReset();
	mockedRequest.mockResolvedValue({ data: [] });
	mockedLogEvent.mockReset();
});

describe('Productboard operations', () => {
	for (const operation of Object.values(ProductboardOperations)) {
		it(`${operation.name} sends the documented method, path, query, and body`, async () => {
			const endpoint = createProductboardEndpoint(operation);
			const input = inputFor(operation);
			const result = await endpoint(ctx, input);

			expect(result).toEqual({ data: [] });
			expect(mockedRequest).toHaveBeenCalledWith(
				expectedPath(operation, input),
				'test-productboard-token',
				{
					method: operation.method,
					query: operation.query ? input.query : undefined,
					body: operation.body ? input.body : undefined,
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
			const endpoint = createProductboardEndpoint(operation);
			const invalidInput =
				(operation.pathFields?.length ?? 0) > 0 || operation.body
					? {}
					: { body: { data: {} } };
			await expect(endpoint(ctx, invalidInput)).rejects.toThrow();
			expect(mockedRequest).not.toHaveBeenCalled();
			expect(mockedLogEvent).not.toHaveBeenCalled();
		});
	}

	it('rejects undocumented top-level inputs before making a request', async () => {
		const endpoint = createProductboardEndpoint(
			ProductboardOperations['notes.list'],
		);
		await expect(endpoint(ctx, { body: { data: {} } })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects callback fields on plugin-integration REST operations', async () => {
		const endpoint = createProductboardEndpoint(
			ProductboardOperations['pluginIntegrations.create'],
		);
		await expect(
			endpoint(ctx, { body: { data: { callbacks: { action: {} } } } }),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('logs operation names only, not note text or member details', async () => {
		const endpoint = createProductboardEndpoint(
			ProductboardOperations['notes.create'],
		);
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
});
