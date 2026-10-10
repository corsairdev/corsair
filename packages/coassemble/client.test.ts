import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';
import { COASSEMBLE_API_BASE, makeCoassembleRequest } from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = request as jest.MockedFunction<typeof request>;

function lastCall(): [OpenAPIConfig, ApiRequestOptions] {
	const call = mockRequest.mock.calls.at(-1);
	if (!call) throw new Error('request() was never called');
	return call as unknown as [OpenAPIConfig, ApiRequestOptions];
}

beforeEach(() => {
	mockRequest.mockReset();
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
		const error = Object.assign(new Error('Too Many Requests'), {
			status: 429,
			retryAfter: 2000,
		});
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
