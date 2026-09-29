import { makeHookdeckRequest } from './client';
import {
	connectionsCreate,
	connectionsDelete,
	connectionsGet,
	connectionsList,
	connectionsUpdate,
} from './endpoints/connections';
import type { ConnectionsGetResponse } from './endpoints/types';
import type { HookdeckContext } from './index';

jest.mock('./client', () => ({
	makeHookdeckRequest: jest.fn(),
}));

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn(),
	};
});

// Narrow assertion: safe because jest.mock() replaces the module export at
// runtime; jest's types do not propagate automatically so the mocked-function
// cast is the practical way to access mock APIs.
const mockedRequest = makeHookdeckRequest as jest.MockedFunction<
	typeof makeHookdeckRequest
>;

// Narrow assertion: safe because connection handlers only read ctx.key and
// the full plugin context is built by the runtime; no better type is
// practical for this unit test.
const mockCtx = { key: 'test-api-key' } as HookdeckContext;

const makeConnection = (overrides: Partial<ConnectionsGetResponse> = {}) => ({
	id: 'conn_1',
	team_id: 'team_1',
	name: 'my-connection',
	full_name: 'source -> destination',
	disabled_at: null,
	paused_at: null,
	created_at: '2026-01-01T00:00:00.000Z',
	updated_at: '2026-01-01T00:00:00.000Z',
	...overrides,
});

describe('connections endpoints', () => {
	beforeEach(() => {
		mockedRequest.mockReset();
	});

	it('connectionsList calls GET /connections and returns the response', async () => {
		const mockResponse = {
			models: [makeConnection(), makeConnection({ id: 'conn_2' })],
			count: 2,
		};
		mockedRequest.mockResolvedValueOnce(mockResponse);

		const result = await connectionsList(mockCtx, {});

		expect(mockedRequest).toHaveBeenCalledWith('connections', 'test-api-key', {
			method: 'GET',
			query: {},
		});
		expect(result).toEqual(mockResponse);
	});

	it('connectionsList passes pagination params through as query params', async () => {
		const input = {
			limit: 50,
			next: 'web_abc123',
			order_by: 'created_at',
			dir: 'desc' as const,
		};
		const mockResponse = {
			models: [makeConnection()],
			count: 1,
			pagination: {
				order_by: 'created_at',
				dir: 'desc',
				limit: 50,
				next: 'web_def456',
			},
		};
		mockedRequest.mockResolvedValueOnce(mockResponse);

		const result = await connectionsList(mockCtx, input);

		expect(mockedRequest).toHaveBeenCalledWith('connections', 'test-api-key', {
			method: 'GET',
			query: { ...input },
		});
		expect(result).toEqual(mockResponse);
	});

	it('connectionsCreate calls POST /connections with the input body', async () => {
		const input = {
			name: 'my-connection',
			source_id: 'src_1',
			destination_id: 'dst_1',
		};
		const mockResponse = makeConnection({
			id: 'conn_new',
			name: input.name,
		});
		mockedRequest.mockResolvedValueOnce(mockResponse);

		const result = await connectionsCreate(mockCtx, input);

		expect(mockedRequest).toHaveBeenCalledWith('connections', 'test-api-key', {
			method: 'POST',
			body: { ...input },
		});
		expect(result).toEqual(mockResponse);
	});

	it('connectionsGet calls GET /connections/:id', async () => {
		const input = { id: 'conn_1' };
		const mockResponse = makeConnection();
		mockedRequest.mockResolvedValueOnce(mockResponse);

		const result = await connectionsGet(mockCtx, input);

		expect(mockedRequest).toHaveBeenCalledWith(
			'connections/conn_1',
			'test-api-key',
			{ method: 'GET' },
		);
		expect(result).toEqual(mockResponse);
	});

	it('connectionsUpdate calls PUT /connections/:id with the remaining body (id stripped)', async () => {
		const input = { id: 'conn_1', name: 'renamed-connection' };
		const mockResponse = makeConnection({ name: 'renamed-connection' });
		mockedRequest.mockResolvedValueOnce(mockResponse);

		const result = await connectionsUpdate(mockCtx, input);

		expect(mockedRequest).toHaveBeenCalledWith(
			'connections/conn_1',
			'test-api-key',
			{
				method: 'PUT',
				body: { name: 'renamed-connection' },
			},
		);
		expect(result).toEqual(mockResponse);
	});

	it('connectionsDelete calls DELETE /connections/:id', async () => {
		const input = { id: 'conn_1' };
		// Matches the real DELETE /connections/{id} response shape ({ id }).
		const mockResponse = { id: 'conn_1' };
		mockedRequest.mockResolvedValueOnce(mockResponse);

		const result = await connectionsDelete(mockCtx, input);

		expect(mockedRequest).toHaveBeenCalledWith(
			'connections/conn_1',
			'test-api-key',
			{ method: 'DELETE' },
		);
		expect(result).toEqual({ id: 'conn_1' });
	});

	it('propagates errors from makeHookdeckRequest', async () => {
		mockedRequest.mockRejectedValueOnce(new Error('API request failed'));

		await expect(connectionsList(mockCtx, {})).rejects.toThrow(
			'API request failed',
		);
	});

	it('rejects invalid list input before any HTTP call', async () => {
		await expect(connectionsList(mockCtx, { limit: 251 })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects invalid create input before any HTTP call', async () => {
		// Narrow assertion: safe because this is a negative test deliberately
		// passing invalid input to prove zod rejects it before any HTTP call.
		await expect(
			connectionsCreate(mockCtx, { name: undefined as never }),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});
