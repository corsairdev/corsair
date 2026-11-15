import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import {
	Admin,
	Cells,
	Collections,
	DataConnections,
	Embedding,
	Groups,
	Guides,
	ProjectRuns,
	Projects,
	Semantic,
	Suggestions,
	Threads,
	Users,
} from './endpoints';
import { validInputs, validOutputs } from './fixtures';
import type { HexContext } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makeHexRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makeHexRequest);
const mockedLogEvent = jest.mocked(logEventFromContext);

function buildContext(): HexContext {
	const context: HexContext = {
		endpoints: {} as never,
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'test-api-key',
		options: {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('test-api-key'),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
	return context;
}

const ctx = buildContext();

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLogEvent.mockReset();
});

function expectLogged(operation: string) {
	expect(mockedLogEvent).toHaveBeenCalledTimes(1);
	expect(mockedLogEvent).toHaveBeenCalledWith(
		ctx,
		`hex.${operation}`,
		expect.objectContaining({ operation }),
		'completed',
	);
	// Ensure no sensitive API key leaked into log payload
	const loggedPayload = JSON.stringify(mockedLogEvent.mock.calls[0]?.[2]) ?? '';
	expect(loggedPayload).not.toContain('test-api-key');
}

describe('Admin endpoints', () => {
	it('Admin.listAgentUsage executes GET /v1/agent-usage', async () => {
		mockedRequest.mockResolvedValue(validOutputs.adminListAgentUsage);
		const result = await Admin.listAgentUsage(
			ctx,
			validInputs.adminListAgentUsage,
		);
		expect(result).toEqual(validOutputs.adminListAgentUsage);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(new RegExp('^/v1/agent-usage$')),
			'test-api-key',
			expect.objectContaining({ method: 'GET' }),
		);
		expectLogged('admin.listAgentUsage');
	});

	it('Admin.listAgentUsage rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Admin.listAgentUsage as (
			c: unknown,
			i: unknown,
		) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('Admin.listTopics executes GET /v1/context/topics', async () => {
		mockedRequest.mockResolvedValue(validOutputs.adminListTopics);
		const result = await Admin.listTopics(ctx, validInputs.adminListTopics);
		expect(result).toEqual(validOutputs.adminListTopics);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(new RegExp('^/v1/context/topics$')),
			'test-api-key',
			expect.objectContaining({ method: 'GET' }),
		);
		expectLogged('admin.listTopics');
	});

	it('Admin.listTopics rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Admin.listTopics as (c: unknown, i: unknown) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('Admin.listCreditGrants executes GET /v1/credit-grants', async () => {
		mockedRequest.mockResolvedValue(validOutputs.adminListCreditGrants);
		const result = await Admin.listCreditGrants(
			ctx,
			validInputs.adminListCreditGrants,
		);
		expect(result).toEqual(validOutputs.adminListCreditGrants);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(new RegExp('^/v1/credit-grants$')),
			'test-api-key',
			expect.objectContaining({ method: 'GET' }),
		);
		expectLogged('admin.listCreditGrants');
	});

	it('Admin.listCreditGrants rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Admin.listCreditGrants as (
			c: unknown,
			i: unknown,
		) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('Cells endpoints', () => {
	it('Cells.list executes GET /v1/cells', async () => {
		mockedRequest.mockResolvedValue(validOutputs.cellsList);
		const result = await Cells.list(ctx, validInputs.cellsList);
		expect(result).toEqual(validOutputs.cellsList);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(new RegExp('^/v1/cells$')),
			'test-api-key',
			expect.objectContaining({ method: 'GET' }),
		);
		expectLogged('cells.list');
	});

	it('Cells.list rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Cells.list as (c: unknown, i: unknown) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('Cells.create executes POST /v1/cells', async () => {
		mockedRequest.mockResolvedValue(validOutputs.cellsCreate);
		const result = await Cells.create(ctx, validInputs.cellsCreate);
		expect(result).toEqual(validOutputs.cellsCreate);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/cells',
			'test-api-key',
			expect.objectContaining({
				method: 'POST',
				body: expect.objectContaining({
					projectId: '11111111-1111-4111-8111-111111111111',
					cellType: 'CODE',
					contents: { codeCell: { source: "print('hello from Hex')" } },
				}),
			}),
		);
		expectLogged('cells.create');
	});

	it('Cells.create rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Cells.create as (c: unknown, i: unknown) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('Cells.delete executes DELETE /v1/cells/{cellId}', async () => {
		mockedRequest.mockResolvedValue(validOutputs.cellsDelete);
		const result = await Cells.delete(ctx, validInputs.cellsDelete);
		expect(result).toEqual(validOutputs.cellsDelete);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/cells/11111111-1111-4111-8111-111111111111',
			'test-api-key',
			expect.objectContaining({ method: 'DELETE' }),
		);
		expectLogged('cells.delete');
	});

	it('Cells.delete rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Cells.delete as (c: unknown, i: unknown) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('Cells.get executes GET /v1/cells/{cellId}', async () => {
		mockedRequest.mockResolvedValue(validOutputs.cellsGet);
		const result = await Cells.get(ctx, validInputs.cellsGet);
		expect(result).toEqual(validOutputs.cellsGet);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(new RegExp('^/v1/cells/[^/]+$')),
			'test-api-key',
			expect.objectContaining({ method: 'GET' }),
		);
		expectLogged('cells.get');
	});

	it('Cells.get rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Cells.get as (c: unknown, i: unknown) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('Cells.update executes PATCH /v1/cells/{cellId}', async () => {
		mockedRequest.mockResolvedValue(validOutputs.cellsUpdate);
		const result = await Cells.update(ctx, validInputs.cellsUpdate);
		expect(result).toEqual(validOutputs.cellsUpdate);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(new RegExp('^/v1/cells/[^/]+$')),
			'test-api-key',
			expect.objectContaining({ method: 'PATCH' }),
		);
		expectLogged('cells.update');
	});

	it('Cells.update rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Cells.update as (c: unknown, i: unknown) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('Cells.getChartImage executes GET /v1/cells/{cellId}/image', async () => {
		mockedRequest.mockResolvedValue(validOutputs.cellsGetChartImage);
		const result = await Cells.getChartImage(
			ctx,
			validInputs.cellsGetChartImage,
		);
		expect(result).toEqual(validOutputs.cellsGetChartImage);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(new RegExp('^/v1/cells/[^/]+/image$')),
			'test-api-key',
			expect.objectContaining({ method: 'GET' }),
		);
		expectLogged('cells.getChartImage');
	});

	it('Cells.getChartImage rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Cells.getChartImage as (
			c: unknown,
			i: unknown,
		) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('Cells.getOutput executes GET /v1/cells/{cellId}/output', async () => {
		mockedRequest.mockResolvedValue(validOutputs.cellsGetOutput);
		const result = await Cells.getOutput(ctx, validInputs.cellsGetOutput);
		expect(result).toEqual(validOutputs.cellsGetOutput);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(new RegExp('^/v1/cells/[^/]+/output$')),
			'test-api-key',
			expect.objectContaining({ method: 'GET' }),
		);
		expectLogged('cells.getOutput');
	});

	it('Cells.getOutput rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Cells.getOutput as (c: unknown, i: unknown) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('Collections endpoints', () => {
	it('Collections.list executes GET /v1/collections', async () => {
		mockedRequest.mockResolvedValue(validOutputs.collectionsList);
		const result = await Collections.list(ctx, validInputs.collectionsList);
		expect(result).toEqual(validOutputs.collectionsList);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(new RegExp('^/v1/collections$')),
			'test-api-key',
			expect.objectContaining({ method: 'GET' }),
		);
		expectLogged('collections.list');
	});

	it('Collections.list rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Collections.list as (c: unknown, i: unknown) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('Collections.create executes POST /v1/collections', async () => {
		mockedRequest.mockResolvedValue(validOutputs.collectionsCreate);
		const result = await Collections.create(ctx, validInputs.collectionsCreate);
		expect(result).toEqual(validOutputs.collectionsCreate);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(new RegExp('^/v1/collections$')),
			'test-api-key',
			expect.objectContaining({ method: 'POST' }),
		);
		expectLogged('collections.create');
	});

	it('Collections.create rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Collections.create as (
			c: unknown,
			i: unknown,
		) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('Collections.get executes GET /v1/collections/{collectionId}', async () => {
		mockedRequest.mockResolvedValue(validOutputs.collectionsGet);
		const result = await Collections.get(ctx, validInputs.collectionsGet);
		expect(result).toEqual(validOutputs.collectionsGet);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(new RegExp('^/v1/collections/[^/]+$')),
			'test-api-key',
			expect.objectContaining({ method: 'GET' }),
		);
		expectLogged('collections.get');
	});

	it('Collections.get rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Collections.get as (c: unknown, i: unknown) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('Collections.update executes PATCH /v1/collections/{collectionId}', async () => {
		mockedRequest.mockResolvedValue(validOutputs.collectionsUpdate);
		const result = await Collections.update(ctx, validInputs.collectionsUpdate);
		expect(result).toEqual(validOutputs.collectionsUpdate);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(new RegExp('^/v1/collections/[^/]+$')),
			'test-api-key',
			expect.objectContaining({ method: 'PATCH' }),
		);
		expectLogged('collections.update');
	});

	it('Collections.update rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Collections.update as (
			c: unknown,
			i: unknown,
		) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('DataConnections endpoints', () => {
	it('DataConnections.list executes GET /v1/data-connections', async () => {
		mockedRequest.mockResolvedValue(validOutputs.dataConnectionsList);
		const result = await DataConnections.list(
			ctx,
			validInputs.dataConnectionsList,
		);
		expect(result).toEqual(validOutputs.dataConnectionsList);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(new RegExp('^/v1/data-connections$')),
			'test-api-key',
			expect.objectContaining({ method: 'GET' }),
		);
		expectLogged('dataConnections.list');
	});

	it('DataConnections.list rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = DataConnections.list as (
			c: unknown,
			i: unknown,
		) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('DataConnections.create executes POST /v1/data-connections', async () => {
		mockedRequest.mockResolvedValue(validOutputs.dataConnectionsCreate);
		const result = await DataConnections.create(
			ctx,
			validInputs.dataConnectionsCreate,
		);
		expect(result).toEqual(validOutputs.dataConnectionsCreate);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/data-connections',
			'test-api-key',
			expect.objectContaining({
				method: 'POST',
				body: expect.objectContaining({
					name: 'Analytics warehouse',
					type: 'postgres',
					connectionDetails: {
						postgres: expect.objectContaining({
							hostname: 'warehouse.example.com',
							port: 5432,
							database: 'analytics',
						}),
					},
				}),
			}),
		);
		expectLogged('dataConnections.create');
	});

	it('DataConnections.create rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = DataConnections.create as (
			c: unknown,
			i: unknown,
		) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('DataConnections.get executes GET /v1/data-connections/{dataConnectionId}', async () => {
		mockedRequest.mockResolvedValue(validOutputs.dataConnectionsGet);
		const result = await DataConnections.get(
			ctx,
			validInputs.dataConnectionsGet,
		);
		expect(result).toEqual(validOutputs.dataConnectionsGet);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(new RegExp('^/v1/data-connections/[^/]+$')),
			'test-api-key',
			expect.objectContaining({ method: 'GET' }),
		);
		expectLogged('dataConnections.get');
	});

	it('DataConnections.get rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = DataConnections.get as (
			c: unknown,
			i: unknown,
		) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('DataConnections.update executes PATCH /v1/data-connections/{dataConnectionId}', async () => {
		mockedRequest.mockResolvedValue(validOutputs.dataConnectionsUpdate);
		const result = await DataConnections.update(
			ctx,
			validInputs.dataConnectionsUpdate,
		);
		expect(result).toEqual(validOutputs.dataConnectionsUpdate);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(new RegExp('^/v1/data-connections/[^/]+$')),
			'test-api-key',
			expect.objectContaining({ method: 'PATCH' }),
		);
		expectLogged('dataConnections.update');
	});

	it('DataConnections.update rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = DataConnections.update as (
			c: unknown,
			i: unknown,
		) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('DataConnections.updateSchema executes PATCH /v1/data-connections/{dataConnectionId}/schema', async () => {
		mockedRequest.mockResolvedValue(validOutputs.dataConnectionsUpdateSchema);
		const result = await DataConnections.updateSchema(
			ctx,
			validInputs.dataConnectionsUpdateSchema,
		);
		expect(result).toEqual(validOutputs.dataConnectionsUpdateSchema);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(new RegExp('^/v1/data-connections/[^/]+/schema$')),
			'test-api-key',
			expect.objectContaining({ method: 'PATCH' }),
		);
		expectLogged('dataConnections.updateSchema');
	});

	it('DataConnections.updateSchema rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = DataConnections.updateSchema as (
			c: unknown,
			i: unknown,
		) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('Embedding endpoints', () => {
	it('Embedding.createPresignedUrl executes POST /v1/embedding/createPresignedUrl/{projectId}', async () => {
		mockedRequest.mockResolvedValue(validOutputs.embeddingCreatePresignedUrl);
		const result = await Embedding.createPresignedUrl(
			ctx,
			validInputs.embeddingCreatePresignedUrl,
		);
		expect(result).toEqual(validOutputs.embeddingCreatePresignedUrl);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(
				new RegExp('^/v1/embedding/createPresignedUrl/[^/]+$'),
			),
			'test-api-key',
			expect.objectContaining({
				method: 'POST',
				body: expect.objectContaining({
					hexUserAttributes: { customerTier: 'enterprise' },
					inputParameters: {
						region: 'US',
						cohort: ['returning', 'new'],
					},
				}),
			}),
		);
		expectLogged('embedding.createPresignedUrl');
	});

	it('Embedding.createPresignedUrl rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Embedding.createPresignedUrl as (
			c: unknown,
			i: unknown,
		) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('Groups endpoints', () => {
	it('Groups.list executes GET /v1/groups', async () => {
		mockedRequest.mockResolvedValue(validOutputs.groupsList);
		const result = await Groups.list(ctx, validInputs.groupsList);
		expect(result).toEqual(validOutputs.groupsList);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(new RegExp('^/v1/groups$')),
			'test-api-key',
			expect.objectContaining({ method: 'GET' }),
		);
		expectLogged('groups.list');
	});

	it('Groups.list rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Groups.list as (c: unknown, i: unknown) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('Groups.create executes POST /v1/groups', async () => {
		mockedRequest.mockResolvedValue(validOutputs.groupsCreate);
		const result = await Groups.create(ctx, validInputs.groupsCreate);
		expect(result).toEqual(validOutputs.groupsCreate);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(new RegExp('^/v1/groups$')),
			'test-api-key',
			expect.objectContaining({ method: 'POST' }),
		);
		expectLogged('groups.create');
	});

	it('Groups.create rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Groups.create as (c: unknown, i: unknown) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('Groups.delete executes DELETE /v1/groups/{groupId}', async () => {
		mockedRequest.mockResolvedValue(validOutputs.groupsDelete);
		const result = await Groups.delete(ctx, validInputs.groupsDelete);
		expect(result).toEqual(validOutputs.groupsDelete);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(new RegExp('^/v1/groups/[^/]+$')),
			'test-api-key',
			expect.objectContaining({ method: 'DELETE' }),
		);
		expectLogged('groups.delete');
	});

	it('Groups.delete rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Groups.delete as (c: unknown, i: unknown) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('Groups.get executes GET /v1/groups/{groupId}', async () => {
		mockedRequest.mockResolvedValue(validOutputs.groupsGet);
		const result = await Groups.get(ctx, validInputs.groupsGet);
		expect(result).toEqual(validOutputs.groupsGet);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(new RegExp('^/v1/groups/[^/]+$')),
			'test-api-key',
			expect.objectContaining({ method: 'GET' }),
		);
		expectLogged('groups.get');
	});

	it('Groups.get rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Groups.get as (c: unknown, i: unknown) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('Groups.update executes PATCH /v1/groups/{groupId}', async () => {
		mockedRequest.mockResolvedValue(validOutputs.groupsUpdate);
		const result = await Groups.update(ctx, validInputs.groupsUpdate);
		expect(result).toEqual(validOutputs.groupsUpdate);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(new RegExp('^/v1/groups/[^/]+$')),
			'test-api-key',
			expect.objectContaining({ method: 'PATCH' }),
		);
		expectLogged('groups.update');
	});

	it('Groups.update rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Groups.update as (c: unknown, i: unknown) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('Guides endpoints', () => {
	it('Guides.upsertDraft executes PUT /v1/guides/draft', async () => {
		mockedRequest.mockResolvedValue(validOutputs.guidesUpsertDraft);
		const result = await Guides.upsertDraft(ctx, validInputs.guidesUpsertDraft);
		expect(result).toEqual(validOutputs.guidesUpsertDraft);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(new RegExp('^/v1/guides/draft$')),
			'test-api-key',
			expect.objectContaining({ method: 'PUT' }),
		);
		expectLogged('guides.upsertDraft');
	});

	it('Guides.upsertDraft rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Guides.upsertDraft as (
			c: unknown,
			i: unknown,
		) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('Guides.deleteDraft executes DELETE /v1/guides/draft/{orgGuideFileId}', async () => {
		mockedRequest.mockResolvedValue(validOutputs.guidesDeleteDraft);
		const result = await Guides.deleteDraft(ctx, validInputs.guidesDeleteDraft);
		expect(result).toEqual(validOutputs.guidesDeleteDraft);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(new RegExp('^/v1/guides/draft/[^/]+$')),
			'test-api-key',
			expect.objectContaining({ method: 'DELETE' }),
		);
		expectLogged('guides.deleteDraft');
	});

	it('Guides.deleteDraft rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Guides.deleteDraft as (
			c: unknown,
			i: unknown,
		) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('Guides.listDrafts executes GET /v1/guides/draft/list', async () => {
		mockedRequest.mockResolvedValue(validOutputs.guidesListDrafts);
		const result = await Guides.listDrafts(ctx, validInputs.guidesListDrafts);
		expect(result).toEqual(validOutputs.guidesListDrafts);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(new RegExp('^/v1/guides/draft/list$')),
			'test-api-key',
			expect.objectContaining({ method: 'GET' }),
		);
		expectLogged('guides.listDrafts');
	});

	it('Guides.listDrafts rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Guides.listDrafts as (
			c: unknown,
			i: unknown,
		) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('Guides.publish executes POST /v1/guides/publish', async () => {
		mockedRequest.mockResolvedValue(validOutputs.guidesPublish);
		const result = await Guides.publish(ctx, validInputs.guidesPublish);
		expect(result).toEqual(validOutputs.guidesPublish);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(new RegExp('^/v1/guides/publish$')),
			'test-api-key',
			expect.objectContaining({ method: 'POST' }),
		);
		expectLogged('guides.publish');
	});

	it('Guides.publish rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Guides.publish as (c: unknown, i: unknown) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('Projects endpoints', () => {
	it('Projects.list executes GET /v1/projects', async () => {
		mockedRequest.mockResolvedValue(validOutputs.projectsList);
		const result = await Projects.list(ctx, validInputs.projectsList);
		expect(result).toEqual(validOutputs.projectsList);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(new RegExp('^/v1/projects$')),
			'test-api-key',
			expect.objectContaining({
				method: 'GET',
				query: {
					limit: 20,
					after: 'projects-cursor-1',
					sortBy: 'CREATED_AT',
					sortDirection: 'DESC',
				},
			}),
		);
		expectLogged('projects.list');
	});

	it('Projects.list rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Projects.list as (c: unknown, i: unknown) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('Projects.create executes POST /v1/projects', async () => {
		mockedRequest.mockResolvedValue(validOutputs.projectsCreate);
		const result = await Projects.create(ctx, validInputs.projectsCreate);
		expect(result).toEqual(validOutputs.projectsCreate);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(new RegExp('^/v1/projects$')),
			'test-api-key',
			expect.objectContaining({ method: 'POST' }),
		);
		expectLogged('projects.create');
	});

	it('Projects.create rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Projects.create as (c: unknown, i: unknown) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('Projects.get executes GET /v1/projects/{projectId}', async () => {
		mockedRequest.mockResolvedValue(validOutputs.projectsGet);
		const result = await Projects.get(ctx, validInputs.projectsGet);
		expect(result).toEqual(validOutputs.projectsGet);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(new RegExp('^/v1/projects/[^/]+$')),
			'test-api-key',
			expect.objectContaining({ method: 'GET' }),
		);
		expectLogged('projects.get');
	});

	it('Projects.get rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Projects.get as (c: unknown, i: unknown) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('Projects.update executes PATCH /v1/projects/{projectId}', async () => {
		mockedRequest.mockResolvedValue(validOutputs.projectsUpdate);
		const result = await Projects.update(ctx, validInputs.projectsUpdate);
		expect(result).toEqual(validOutputs.projectsUpdate);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(new RegExp('^/v1/projects/[^/]+$')),
			'test-api-key',
			expect.objectContaining({ method: 'PATCH' }),
		);
		expectLogged('projects.update');
	});

	it('Projects.update rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Projects.update as (c: unknown, i: unknown) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('Projects.getQueriedTables executes GET /v1/projects/{projectId}/queriedTables', async () => {
		mockedRequest.mockResolvedValue(validOutputs.projectsGetQueriedTables);
		const result = await Projects.getQueriedTables(
			ctx,
			validInputs.projectsGetQueriedTables,
		);
		expect(result).toEqual(validOutputs.projectsGetQueriedTables);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(new RegExp('^/v1/projects/[^/]+/queriedTables$')),
			'test-api-key',
			expect.objectContaining({ method: 'GET' }),
		);
		expectLogged('projects.getQueriedTables');
	});

	it('Projects.getQueriedTables rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Projects.getQueriedTables as (
			c: unknown,
			i: unknown,
		) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('Projects.editSharingCollections executes PATCH /v1/projects/{projectId}/sharing/collections', async () => {
		mockedRequest.mockResolvedValue(
			validOutputs.projectsEditSharingCollections,
		);
		const result = await Projects.editSharingCollections(
			ctx,
			validInputs.projectsEditSharingCollections,
		);
		expect(result).toEqual(validOutputs.projectsEditSharingCollections);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(
				new RegExp('^/v1/projects/[^/]+/sharing/collections$'),
			),
			'test-api-key',
			expect.objectContaining({ method: 'PATCH' }),
		);
		expectLogged('projects.editSharingCollections');
	});

	it('Projects.editSharingCollections rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Projects.editSharingCollections as (
			c: unknown,
			i: unknown,
		) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('Projects.editSharingGroups executes PATCH /v1/projects/{projectId}/sharing/groups', async () => {
		mockedRequest.mockResolvedValue(validOutputs.projectsEditSharingGroups);
		const result = await Projects.editSharingGroups(
			ctx,
			validInputs.projectsEditSharingGroups,
		);
		expect(result).toEqual(validOutputs.projectsEditSharingGroups);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(new RegExp('^/v1/projects/[^/]+/sharing/groups$')),
			'test-api-key',
			expect.objectContaining({ method: 'PATCH' }),
		);
		expectLogged('projects.editSharingGroups');
	});

	it('Projects.editSharingGroups rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Projects.editSharingGroups as (
			c: unknown,
			i: unknown,
		) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('Projects.editSharingUsers executes PATCH /v1/projects/{projectId}/sharing/users', async () => {
		mockedRequest.mockResolvedValue(validOutputs.projectsEditSharingUsers);
		const result = await Projects.editSharingUsers(
			ctx,
			validInputs.projectsEditSharingUsers,
		);
		expect(result).toEqual(validOutputs.projectsEditSharingUsers);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(new RegExp('^/v1/projects/[^/]+/sharing/users$')),
			'test-api-key',
			expect.objectContaining({ method: 'PATCH' }),
		);
		expectLogged('projects.editSharingUsers');
	});

	it('Projects.editSharingUsers rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Projects.editSharingUsers as (
			c: unknown,
			i: unknown,
		) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('Projects.editSharingOrgAndPublic executes PATCH /v1/projects/{projectId}/sharing/workspaceAndPublic', async () => {
		mockedRequest.mockResolvedValue(
			validOutputs.projectsEditSharingOrgAndPublic,
		);
		const result = await Projects.editSharingOrgAndPublic(
			ctx,
			validInputs.projectsEditSharingOrgAndPublic,
		);
		expect(result).toEqual(validOutputs.projectsEditSharingOrgAndPublic);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(
				new RegExp('^/v1/projects/[^/]+/sharing/workspaceAndPublic$'),
			),
			'test-api-key',
			expect.objectContaining({ method: 'PATCH' }),
		);
		expectLogged('projects.editSharingOrgAndPublic');
	});

	it('Projects.editSharingOrgAndPublic rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Projects.editSharingOrgAndPublic as (
			c: unknown,
			i: unknown,
		) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('Projects.batchUpdateComputeProfile executes POST /v1/projects/compute-profile/batch', async () => {
		mockedRequest.mockResolvedValue(
			validOutputs.projectsBatchUpdateComputeProfile,
		);
		const result = await Projects.batchUpdateComputeProfile(
			ctx,
			validInputs.projectsBatchUpdateComputeProfile,
		);
		expect(result).toEqual(validOutputs.projectsBatchUpdateComputeProfile);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(new RegExp('^/v1/projects/compute-profile/batch$')),
			'test-api-key',
			expect.objectContaining({ method: 'POST' }),
		);
		expectLogged('projects.batchUpdateComputeProfile');
	});

	it('Projects.batchUpdateComputeProfile rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Projects.batchUpdateComputeProfile as (
			c: unknown,
			i: unknown,
		) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('Projects.export executes POST /v1/projects/export', async () => {
		mockedRequest.mockResolvedValue(validOutputs.projectsExport);
		const result = await Projects.export(ctx, validInputs.projectsExport);
		expect(result).toEqual(validOutputs.projectsExport);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(new RegExp('^/v1/projects/export$')),
			'test-api-key',
			expect.objectContaining({ method: 'POST' }),
		);
		expectLogged('projects.export');
	});

	it('Projects.export rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Projects.export as (c: unknown, i: unknown) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('ProjectRuns endpoints', () => {
	it('ProjectRuns.list executes GET /v1/projects/{projectId}/runs', async () => {
		mockedRequest.mockResolvedValue(validOutputs.projectRunsList);
		const result = await ProjectRuns.list(ctx, validInputs.projectRunsList);
		expect(result).toEqual(validOutputs.projectRunsList);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/projects/11111111-1111-4111-8111-111111111111/runs',
			'test-api-key',
			expect.objectContaining({
				method: 'GET',
				query: {
					limit: 7,
					offset: 14,
					statusFilter: 'COMPLETED',
					runTriggerFilter: 'API',
				},
			}),
		);
		expectLogged('projectRuns.list');
	});

	it('ProjectRuns.list rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = ProjectRuns.list as (c: unknown, i: unknown) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('ProjectRuns.run executes POST /v1/projects/{projectId}/runs', async () => {
		mockedRequest.mockResolvedValue(validOutputs.projectRunsRun);
		const result = await ProjectRuns.run(ctx, validInputs.projectRunsRun);
		expect(result).toEqual(validOutputs.projectRunsRun);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/projects/11111111-1111-4111-8111-111111111111/runs',
			'test-api-key',
			expect.objectContaining({
				method: 'POST',
				body: {
					inputParams: { region: 'west', includeArchived: false },
					dryRun: false,
					updateCache: true,
					notifications: expect.arrayContaining([
						expect.objectContaining({
							type: 'SUCCESS',
							includeSuccessScreenshot: false,
							userIds: ['22222222-2222-4222-8222-222222222222'],
						}),
					]),
					updatePublishedResults: true,
					useCachedSqlResults: false,
					viewId: 'view-q3-west',
				},
			}),
		);
		expectLogged('projectRuns.run');
	});

	it('ProjectRuns.run rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = ProjectRuns.run as (c: unknown, i: unknown) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('ProjectRuns.cancel executes DELETE /v1/projects/{projectId}/runs/{runId}', async () => {
		mockedRequest.mockResolvedValue(validOutputs.projectRunsCancel);
		const result = await ProjectRuns.cancel(ctx, validInputs.projectRunsCancel);
		expect(result).toEqual(validOutputs.projectRunsCancel);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(new RegExp('^/v1/projects/[^/]+/runs/[^/]+$')),
			'test-api-key',
			expect.objectContaining({ method: 'DELETE' }),
		);
		expectLogged('projectRuns.cancel');
	});

	it('ProjectRuns.cancel rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = ProjectRuns.cancel as (
			c: unknown,
			i: unknown,
		) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('ProjectRuns.getStatus executes GET /v1/projects/{projectId}/runs/{runId}', async () => {
		mockedRequest.mockResolvedValue(validOutputs.projectRunsGetStatus);
		const result = await ProjectRuns.getStatus(
			ctx,
			validInputs.projectRunsGetStatus,
		);
		expect(result).toEqual(validOutputs.projectRunsGetStatus);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/projects/11111111-1111-4111-8111-111111111111/runs/22222222-2222-4222-8222-222222222222',
			'test-api-key',
			expect.objectContaining({
				method: 'GET',
				headers: { 'enable-expanded-stats': 'true' },
			}),
		);
		expectLogged('projectRuns.getStatus');
	});

	it('ProjectRuns.getStatus rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = ProjectRuns.getStatus as (
			c: unknown,
			i: unknown,
		) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('ProjectRuns.getChartImage executes GET /v1/projects/{projectId}/runs/{runId}/cells/{staticId}/image', async () => {
		mockedRequest.mockResolvedValue(validOutputs.projectRunsGetChartImage);
		const result = await ProjectRuns.getChartImage(
			ctx,
			validInputs.projectRunsGetChartImage,
		);
		expect(result).toEqual(validOutputs.projectRunsGetChartImage);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(
				new RegExp('^/v1/projects/[^/]+/runs/[^/]+/cells/[^/]+/image$'),
			),
			'test-api-key',
			expect.objectContaining({ method: 'GET' }),
		);
		expectLogged('projectRuns.getChartImage');
	});

	it('ProjectRuns.getChartImage rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = ProjectRuns.getChartImage as (
			c: unknown,
			i: unknown,
		) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('Semantic endpoints', () => {
	it('Semantic.update executes PATCH /v1/semantic-(projects|models)/{semanticProjectId}', async () => {
		mockedRequest.mockResolvedValue(validOutputs.semanticUpdate);
		const result = await Semantic.update(ctx, validInputs.semanticUpdate);
		expect(result).toEqual(validOutputs.semanticUpdate);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(
				new RegExp('^/v1/semantic-(projects|models)/[^/]+$'),
			),
			'test-api-key',
			expect.objectContaining({ method: 'PATCH' }),
		);
		expectLogged('semantic.update');
	});

	it('Semantic.update rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Semantic.update as (c: unknown, i: unknown) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('Suggestions endpoints', () => {
	it('Suggestions.list executes GET /v1/suggestions', async () => {
		mockedRequest.mockResolvedValue(validOutputs.suggestionsList);
		const result = await Suggestions.list(ctx, validInputs.suggestionsList);
		expect(result).toEqual(validOutputs.suggestionsList);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(new RegExp('^/v1/suggestions$')),
			'test-api-key',
			expect.objectContaining({ method: 'GET' }),
		);
		expectLogged('suggestions.list');
	});

	it('Suggestions.list rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Suggestions.list as (c: unknown, i: unknown) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('Suggestions.get executes GET /v1/suggestions/{suggestionId}', async () => {
		mockedRequest.mockResolvedValue(validOutputs.suggestionsGet);
		const result = await Suggestions.get(ctx, validInputs.suggestionsGet);
		expect(result).toEqual(validOutputs.suggestionsGet);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(new RegExp('^/v1/suggestions/[^/]+$')),
			'test-api-key',
			expect.objectContaining({ method: 'GET' }),
		);
		expectLogged('suggestions.get');
	});

	it('Suggestions.get rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Suggestions.get as (c: unknown, i: unknown) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('Suggestions.update executes POST /v1/suggestions/{suggestionId}', async () => {
		mockedRequest.mockResolvedValue(validOutputs.suggestionsUpdate);
		const result = await Suggestions.update(ctx, validInputs.suggestionsUpdate);
		expect(result).toEqual(validOutputs.suggestionsUpdate);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(new RegExp('^/v1/suggestions/[^/]+$')),
			'test-api-key',
			expect.objectContaining({ method: 'POST' }),
		);
		expectLogged('suggestions.update');
	});

	it('Suggestions.update rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Suggestions.update as (
			c: unknown,
			i: unknown,
		) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('Suggestions.updateChange executes POST /v1/suggestions/{suggestionId}/changes/{changeId}', async () => {
		mockedRequest.mockResolvedValue(validOutputs.suggestionsUpdateChange);
		const result = await Suggestions.updateChange(
			ctx,
			validInputs.suggestionsUpdateChange,
		);
		expect(result).toEqual(validOutputs.suggestionsUpdateChange);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(
				new RegExp('^/v1/suggestions/[^/]+/changes/[^/]+$'),
			),
			'test-api-key',
			expect.objectContaining({ method: 'POST' }),
		);
		expectLogged('suggestions.updateChange');
	});

	it('Suggestions.updateChange rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Suggestions.updateChange as (
			c: unknown,
			i: unknown,
		) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('Suggestions.triggerReview executes POST /v1/suggestions/{suggestionId}/review', async () => {
		mockedRequest.mockResolvedValue(validOutputs.suggestionsTriggerReview);
		const result = await Suggestions.triggerReview(
			ctx,
			validInputs.suggestionsTriggerReview,
		);
		expect(result).toEqual(validOutputs.suggestionsTriggerReview);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(new RegExp('^/v1/suggestions/[^/]+/review$')),
			'test-api-key',
			expect.objectContaining({ method: 'POST' }),
		);
		expectLogged('suggestions.triggerReview');
	});

	it('Suggestions.triggerReview rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Suggestions.triggerReview as (
			c: unknown,
			i: unknown,
		) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('Suggestions.getV2 executes GET /v2/suggestions/{suggestionId}', async () => {
		mockedRequest.mockResolvedValue(validOutputs.suggestionsGetV2);
		const result = await Suggestions.getV2(ctx, validInputs.suggestionsGetV2);
		expect(result).toEqual(validOutputs.suggestionsGetV2);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(new RegExp('^/v2/suggestions/[^/]+$')),
			'test-api-key',
			expect.objectContaining({ method: 'GET' }),
		);
		expectLogged('suggestions.getV2');
	});

	it('Suggestions.getV2 rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Suggestions.getV2 as (
			c: unknown,
			i: unknown,
		) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('Threads endpoints', () => {
	it('Threads.list executes GET /v1/threads', async () => {
		mockedRequest.mockResolvedValue(validOutputs.threadsList);
		const result = await Threads.list(ctx, validInputs.threadsList);
		expect(result).toEqual(validOutputs.threadsList);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(new RegExp('^/v1/threads$')),
			'test-api-key',
			expect.objectContaining({
				method: 'GET',
				query: {
					after: 'threads-cursor-1',
					limit: 12,
					source: 'PUBLIC_API',
				},
			}),
		);
		expectLogged('threads.list');
	});

	it('Threads.list rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Threads.list as (c: unknown, i: unknown) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('Threads.create executes POST /v1/threads', async () => {
		mockedRequest.mockResolvedValue(validOutputs.threadsCreate);
		const result = await Threads.create(ctx, validInputs.threadsCreate);
		expect(result).toEqual(validOutputs.threadsCreate);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(new RegExp('^/v1/threads$')),
			'test-api-key',
			expect.objectContaining({
				method: 'POST',
				body: expect.objectContaining({
					prompt: 'Summarize monthly revenue by region.',
					projectId: '11111111-1111-4111-8111-111111111111',
					attachments: expect.objectContaining({
						dataConnectionId: '33333333-3333-4333-8333-333333333333',
						tableIds: ['warehouse.public.monthly_revenue'],
						projectIds: ['11111111-1111-4111-8111-111111111111'],
					}),
				}),
			}),
		);
		expectLogged('threads.create');
	});

	it('Threads.create rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Threads.create as (c: unknown, i: unknown) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('Threads.get executes GET /v1/threads/{id}', async () => {
		mockedRequest.mockResolvedValue(validOutputs.threadsGet);
		const result = await Threads.get(ctx, validInputs.threadsGet);
		expect(result).toEqual(validOutputs.threadsGet);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(new RegExp('^/v1/threads/[^/]+$')),
			'test-api-key',
			expect.objectContaining({ method: 'GET' }),
		);
		expectLogged('threads.get');
	});

	it('Threads.get rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Threads.get as (c: unknown, i: unknown) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('Threads.continue executes POST /v1/threads/{id}/followup', async () => {
		mockedRequest.mockResolvedValue(validOutputs.threadsContinue);
		const result = await Threads.continue(ctx, validInputs.threadsContinue);
		expect(result).toEqual(validOutputs.threadsContinue);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/threads/44444444-4444-4444-8444-444444444444/followup',
			'test-api-key',
			expect.objectContaining({
				method: 'POST',
				body: expect.objectContaining({
					prompt: 'Now compare those regions with the previous month.',
					attachments: expect.objectContaining({
						projectIds: ['11111111-1111-4111-8111-111111111111'],
					}),
				}),
			}),
		);
		expectLogged('threads.continue');
	});

	it('Threads.continue rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Threads.continue as (c: unknown, i: unknown) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('Threads.getMessages executes GET /v1/threads/{threadId}/messages', async () => {
		mockedRequest.mockResolvedValue(validOutputs.threadsGetMessages);
		const result = await Threads.getMessages(
			ctx,
			validInputs.threadsGetMessages,
		);
		expect(result).toEqual(validOutputs.threadsGetMessages);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/threads/44444444-4444-4444-8444-444444444444/messages',
			'test-api-key',
			expect.objectContaining({
				method: 'GET',
				query: {
					after: 'messages-cursor-1',
					limit: 20,
					full: true,
				},
			}),
		);
		expectLogged('threads.getMessages');
	});

	it('Threads.getMessages rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Threads.getMessages as (
			c: unknown,
			i: unknown,
		) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('Users endpoints', () => {
	it('Users.list executes GET /v1/users', async () => {
		mockedRequest.mockResolvedValue(validOutputs.usersList);
		const result = await Users.list(ctx, validInputs.usersList);
		expect(result).toEqual(validOutputs.usersList);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(new RegExp('^/v1/users$')),
			'test-api-key',
			expect.objectContaining({ method: 'GET' }),
		);
		expectLogged('users.list');
	});

	it('Users.list rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Users.list as (c: unknown, i: unknown) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('Users.deactivate executes POST /v1/users/{userId}/deactivate', async () => {
		mockedRequest.mockResolvedValue(validOutputs.usersDeactivate);
		const result = await Users.deactivate(ctx, validInputs.usersDeactivate);
		expect(result).toEqual(validOutputs.usersDeactivate);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(new RegExp('^/v1/users/[^/]+/deactivate$')),
			'test-api-key',
			expect.objectContaining({ method: 'POST' }),
		);
		expectLogged('users.deactivate');
	});

	it('Users.deactivate rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Users.deactivate as (c: unknown, i: unknown) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('Users.me executes GET /v1/users/me', async () => {
		mockedRequest.mockResolvedValue(validOutputs.usersMe);
		const result = await Users.me(ctx, validInputs.usersMe);
		expect(result).toEqual(validOutputs.usersMe);
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.stringMatching(new RegExp('^/v1/users/me$')),
			'test-api-key',
			expect.objectContaining({ method: 'GET' }),
		);
		expectLogged('users.me');
	});

	it('Users.me rejects invalid input before network I/O', async () => {
		// unknown because invalid input signature must bypass static typing for runtime test
		const fn = Users.me as (c: unknown, i: unknown) => Promise<unknown>;
		// unknown because a rejection value has no static type; assertions below narrow it.
		const error = await fn(ctx, { __invalid_unexpected_field__: true }).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});
