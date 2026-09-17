import { makeHookdeckRequest } from '../client';
import {
	connectionsCreate,
	connectionsDelete,
	connectionsGet,
	connectionsList,
	connectionsUpdate,
} from './connections';

jest.mock('../client', () => ({
	makeHookdeckRequest: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn(),
}));

const mockedRequest = makeHookdeckRequest as jest.Mock;

const mockCtx = {
	key: 'test-api-key',
} as any;

const makeConnection = (overrides: Record<string, unknown> = {}) => ({
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

		const result = await connectionsList(mockCtx, input as any);

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

		const result = await connectionsCreate(mockCtx, input as any);

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

		const result = await connectionsGet(mockCtx, input as any);

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

		const result = await connectionsUpdate(mockCtx, input as any);

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
		const mockResponse = { id: 'conn_1', deleted: true };
		mockedRequest.mockResolvedValueOnce(mockResponse);

		const result = await connectionsDelete(mockCtx, input as any);

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
});
