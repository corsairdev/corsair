import { ApiError, request } from 'corsair/http';
import {
	COASSEMBLE_API_BASE,
	makeCoassembleRequest,
	requireWorkspaceId,
	resolveWorkspaceId,
} from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

function lastCall(): Parameters<typeof request> {
	const call = mockRequest.mock.calls.at(-1);
	if (!call) throw new Error('request() was never called');
	return call;
}

beforeEach(() => {
	mockRequest.mockReset();
});

describe('requireWorkspaceId', () => {
	it('returns the workspace ID when present', () => {
		expect(requireWorkspaceId('ws-123')).toBe('ws-123');
	});

	it('throws error when workspace ID is undefined, null, or empty', () => {
		expect(() => requireWorkspaceId(undefined)).toThrow(
			'Coassemble workspace ID is missing',
		);
		expect(() => requireWorkspaceId(null)).toThrow(
			'Coassemble workspace ID is missing',
		);
		expect(() => requireWorkspaceId('')).toThrow(
			'Coassemble workspace ID is missing',
		);
	});
});

describe('resolveWorkspaceId', () => {
	it('skips account storage and returns options.workspaceId when options.key is set', async () => {
		const getWorkspaceIdMock = jest.fn();
		const result = await resolveWorkspaceId({
			options: { key: 'custom-key', workspaceId: 'custom-ws' },
			keys: { get_workspace_id: getWorkspaceIdMock },
		});

		expect(result).toBe('custom-ws');
		expect(getWorkspaceIdMock).not.toHaveBeenCalled();
	});

	it('awaits keys.get_workspace_id when options.key is not set', async () => {
		const getWorkspaceIdMock = jest.fn().mockResolvedValue('stored-ws');
		const result = await resolveWorkspaceId({
			options: {},
			keys: { get_workspace_id: getWorkspaceIdMock },
		});

		expect(result).toBe('stored-ws');
		expect(getWorkspaceIdMock).toHaveBeenCalledTimes(1);
	});

	it('throws when neither options.workspaceId nor stored workspace ID is present', async () => {
		const getWorkspaceIdMock = jest.fn().mockResolvedValue(undefined);
		await expect(
			resolveWorkspaceId({
				options: {},
				keys: { get_workspace_id: getWorkspaceIdMock },
			}),
		).rejects.toThrow('Coassemble workspace ID is missing');
	});
});

describe('makeCoassembleRequest', () => {
	it('sends the workspace ID and API key in the Authorization header', async () => {
		mockRequest.mockResolvedValue({ data: [] });

		await makeCoassembleRequest(
			'/v1/headless/clients',
			'secret-key',
			'workspace-123',
		);

		const [config] = lastCall();

		expect(config.BASE).toBe(COASSEMBLE_API_BASE);
		expect(config.HEADERS).toMatchObject({
			Authorization: 'COASSEMBLE:workspace-123:secret-key',
		});
	});

	it('issues a GET request with the endpoint path', async () => {
		mockRequest.mockResolvedValue({ data: [] });

		await makeCoassembleRequest(
			'/v1/headless/clients',
			'secret-key',
			'workspace-123',
		);

		const [, options] = lastCall();

		expect(options.method).toBe('GET');
		expect(options.url).toBe('/v1/headless/clients');
	});

	it('sends query parameters for GET requests', async () => {
		mockRequest.mockResolvedValue({ data: [] });

		await makeCoassembleRequest(
			'/v1/headless/courses',
			'secret-key',
			'workspace-123',
			{
				query: {
					page: 2,
					length: 25,
					title: 'Test Course',
				},
			},
		);

		const [, options] = lastCall();

		expect(options.query).toEqual({
			page: 2,
			length: 25,
			title: 'Test Course',
		});
	});

	it('returns the response from Coassemble', async () => {
		const response = {
			data: [
				{
					identifier: 'user-123',
					name: 'Test User',
				},
			],
		};

		mockRequest.mockResolvedValue(response);

		const result = await makeCoassembleRequest(
			'/v1/headless/users',
			'secret-key',
			'workspace-123',
		);

		expect(result).toEqual(response);
	});

	it('does not send a body for GET requests', async () => {
		mockRequest.mockResolvedValue({ data: [] });

		await makeCoassembleRequest(
			'/v1/headless/users',
			'secret-key',
			'workspace-123',
		);

		const [, options] = lastCall();

		expect(options.body).toBeUndefined();
	});

	it('rethrows request errors unchanged so error handlers can read status/retryAfter', async () => {
		const error = new ApiError(
			{ method: 'GET', url: '/v1/headless/users' },
			{
				url: '/v1/headless/users',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: {},
			},
			'Too Many Requests',
			{ retryAfter: 2000 },
		);
		mockRequest.mockRejectedValue(error);

		await expect(
			makeCoassembleRequest(
				'/v1/headless/users',
				'secret-key',
				'workspace-123',
			),
		).rejects.toBe(error);
	});

	it('does not wrap non-Error failures', async () => {
		mockRequest.mockRejectedValue('unexpected failure');

		await expect(
			makeCoassembleRequest(
				'/v1/headless/users',
				'secret-key',
				'workspace-123',
			),
		).rejects.toBe('unexpected failure');
	});
});
