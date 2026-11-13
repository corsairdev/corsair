import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	FiberyAPIError,
	makeFiberyBinaryRequest,
	makeFiberyCommand,
	makeFiberyRequest,
} from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);
const workspaceUrl = 'https://acme.fibery.io';

beforeEach(() => mockRequest.mockReset());

describe('Fibery HTTP client', () => {
	it('uses Token auth and the configured tenant origin', async () => {
		mockRequest.mockResolvedValue({ success: true, result: [] });
		await makeFiberyRequest('/api/commands', 'api-secret', {
			workspaceUrl,
			method: 'POST',
			body: { command: 'fibery.schema/query', args: {} },
		});
		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: workspaceUrl,
			HEADERS: {
				Authorization: 'Token api-secret',
				'Content-Type': 'application/json',
			},
		});
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'POST',
			url: '/api/commands',
			body: { command: 'fibery.schema/query', args: {} },
		});
	});

	it('uses Bearer auth for OAuth access tokens', async () => {
		mockRequest.mockResolvedValue({ success: true, result: {} });
		await makeFiberyRequest('/api/commands', 'oauth-secret', {
			workspaceUrl,
			authType: 'oauth_2',
			method: 'POST',
			body: { command: 'fibery.schema/query', args: {} },
		});
		expect(mockRequest.mock.calls[0]?.[0]?.HEADERS).toMatchObject({
			Authorization: 'Bearer oauth-secret',
		});
	});

	it('rejects empty credentials and unsafe workspace URLs before network I/O', async () => {
		await expect(
			makeFiberyRequest('/api/commands', '', { workspaceUrl }),
		).rejects.toThrow(AuthMissingError);
		await expect(
			makeFiberyRequest('/api/commands', 'token', {
				workspaceUrl: 'http://acme.fibery.io',
			}),
		).rejects.toThrow('HTTPS');
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('requires a workspace origin and rejects paths or embedded credentials', async () => {
		await expect(makeFiberyRequest('/api/commands', 'token')).rejects.toThrow(
			'workspaceUrl',
		);
		await expect(
			makeFiberyRequest('/api/commands', 'token', {
				workspaceUrl: 'https://user:pass@acme.fibery.io/path',
			}),
		).rejects.toThrow('origin');
	});

	it('keeps transport retry ownership disabled while extracting Retry-After', async () => {
		mockRequest.mockResolvedValue({ success: true, result: {} });
		await makeFiberyRequest('/api/commands', 'token', {
			workspaceUrl,
			method: 'POST',
			body: {},
		});
		expect(mockRequest.mock.calls[0]?.[2]).toMatchObject({
			rateLimitConfig: {
				enabled: true,
				maxRetries: 0,
				headerNames: { retryAfter: 'retry-after' },
			},
		});
	});

	it('extracts a real Retry-After response without retrying the request', async () => {
		const realHttp =
			jest.requireActual<typeof import('corsair/http')>('corsair/http');
		const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response('Too Many Requests', {
				status: 429,
				headers: { 'retry-after': '4' },
			}),
		);
		mockRequest.mockImplementation(realHttp.request);

		const failure = await makeFiberyRequest('/api/commands', 'api-secret', {
			workspaceUrl,
			method: 'POST',
			body: { command: 'fibery.schema/query', args: {} },
		}).catch((caught: unknown) => caught);
		// `unknown` because a rejected promise has no static error type; the assertion narrows it.
		if (!(failure instanceof FiberyAPIError))
			throw new Error('Expected FiberyAPIError.');
		expect(failure.status).toBe(429);
		expect(failure.retryAfter).toBe(4000);
		expect(fetchSpy).toHaveBeenCalledTimes(1);
		fetchSpy.mockRestore();
	});

	it('preserves arbitrary binary file bytes as base64', async () => {
		const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(new Uint8Array([0, 255, 1]), {
				headers: { 'content-type': 'application/octet-stream' },
			}),
		);
		await expect(
			makeFiberyBinaryRequest(
				'/api/files/019dcf9a-c5ab-7292-9bdb-8956eea1b532',
				'api-secret',
				{
					workspaceUrl,
					method: 'GET',
				},
			),
		).resolves.toEqual({
			contentType: 'application/octet-stream',
			base64: 'AP8B',
		});
		fetchSpy.mockRestore();
	});

	it('unwraps command results and sanitizes provider errors without leaking credentials', async () => {
		mockRequest.mockResolvedValue({ success: true, result: { ok: true } });
		await expect(
			makeFiberyCommand('fibery.schema/query', {}, 'token', { workspaceUrl }),
		).resolves.toEqual({ ok: true });

		const transportError = new ApiError(
			{ method: 'POST', url: '/api/commands' },
			{
				url: `${workspaceUrl}/api/commands`,
				ok: false,
				status: 401,
				statusText: 'Unauthorized token',
				body: { token: 'token' },
			},
			'Unauthorized token',
		);
		mockRequest.mockRejectedValue(transportError);
		const error = await makeFiberyRequest('/api/commands', 'token', {
			workspaceUrl,
		}).catch((caught: unknown) => caught);
		// `unknown` because a rejected promise has no static error type; the assertion narrows it.
		if (!(error instanceof Error))
			throw new Error('Expected a sanitized Error.');
		expect(error).toMatchObject({ status: 401 });
		expect(error.message).not.toContain('token');
	});
});
