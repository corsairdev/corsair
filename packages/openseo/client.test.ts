import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	callOpenseoTool,
	OPENSEO_API_BASE,
	OPENSEO_MCP_PATH,
	OpenseoAPIError,
	tryGetStoredKey,
} from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

// `unknown` is necessary because the mocked transport returns whatever the test sets as the reply body.
function reply(result: unknown) {
	return (
		mockRequest as unknown as jest.Mock<Promise<unknown>>
	).mockImplementation(async (_config, options) => ({
		jsonrpc: '2.0',
		id: (options as { body: { id: number } }).body.id,
		...(result as object),
	}));
}

beforeEach(() => {
	mockRequest.mockReset();
});

describe('callOpenseoTool', () => {
	it('posts one JSON-RPC tools/call with the bearer key and MCP headers', async () => {
		reply({ result: { structuredContent: { projects: [] }, content: [] } });

		const result = await callOpenseoTool('list_projects', {}, 'oseo_test');

		expect(result).toEqual({ projects: [] });
		expect(mockRequest).toHaveBeenCalledTimes(1);
		const [config, options] = mockRequest.mock.calls[0] ?? [];
		expect(config).toMatchObject({
			BASE: OPENSEO_API_BASE,
			TIMEOUT: 120_000,
			HEADERS: {
				Accept: 'application/json, text/event-stream',
				Authorization: 'Bearer oseo_test',
				'MCP-Protocol-Version': '2025-06-18',
			},
		});
		expect(options).toMatchObject({
			method: 'POST',
			url: OPENSEO_MCP_PATH,
			mediaType: 'application/json',
			body: {
				jsonrpc: '2.0',
				method: 'tools/call',
				params: { name: 'list_projects', arguments: {} },
			},
		});
	});

	it('reads a reply sent as an SSE stream', async () => {
		(mockRequest as unknown as jest.Mock<Promise<unknown>>).mockImplementation(
			async (_config, options) => {
				const id = (options as { body: { id: number } }).body.id;
				return `: ping\n\nevent: message\ndata: ${JSON.stringify({ jsonrpc: '2.0', id, result: { structuredContent: { ok: true } } })}\n\n`;
			},
		);
		await expect(callOpenseoTool('whoami', {}, 'oseo_test')).resolves.toEqual({
			ok: true,
		});
	});

	it('throws OpenseoAPIError with the code for an isError result', async () => {
		reply({
			result: { isError: true, content: [{ type: 'text', text: 'NOT_FOUND' }] },
		});
		const error = await callOpenseoTool(
			'get_project_context',
			{ projectId: 'x' },
			'oseo_test',
		).catch((e: unknown) => e);
		expect(error).toBeInstanceOf(OpenseoAPIError);
		expect((error as OpenseoAPIError).message).toBe('NOT_FOUND');
		expect((error as OpenseoAPIError).code).toBe('NOT_FOUND');
	});

	it('keeps a sentence error without a code', async () => {
		reply({
			result: {
				isError: true,
				content: [
					{
						type: 'text',
						text: 'Input validation error: projectId: Invalid input',
					},
				],
			},
		});
		const error = (await callOpenseoTool(
			'get_project_context',
			{},
			'oseo_test',
		).catch((e: unknown) => e)) as OpenseoAPIError;
		expect(error.message).toBe(
			'Input validation error: projectId: Invalid input',
		);
		expect(error.code).toBeUndefined();
	});

	it('throws OpenseoAPIError for a JSON-RPC error', async () => {
		reply({ error: { code: -32602, message: 'Tool nope not found' } });
		const error = (await callOpenseoTool('nope', {}, 'oseo_test').catch(
			(e: unknown) => e,
		)) as OpenseoAPIError;
		expect(error).toBeInstanceOf(OpenseoAPIError);
		expect(error.message).toBe('Tool nope not found');
		expect(error.code).toBe('-32602');
	});

	it('fails a success without structuredContent instead of inventing one', async () => {
		reply({ result: { content: [{ type: 'text', text: '{}' }] } });
		await expect(callOpenseoTool('whoami', {}, 'oseo_test')).rejects.toThrow(
			'OpenSEO returned no structured result',
		);
	});

	it('fails an unreadable body', async () => {
		mockRequest.mockResolvedValue('not sse' as never);
		await expect(callOpenseoTool('whoami', {}, 'oseo_test')).rejects.toThrow(
			'OpenSEO returned an unreadable MCP response',
		);
	});

	it('rethrows an HTTP ApiError with its status but without the tool arguments', async () => {
		mockRequest.mockRejectedValue(
			new ApiError(
				{
					method: 'POST',
					url: '/mcp',
					body: { params: { arguments: { keywords: ['secret'] } } },
				},
				{
					url: 'https://app.openseo.so/mcp',
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					body: { error: 'rate_limited' },
				},
				'Too Many Requests',
				{ retryAfter: 2000 },
			),
		);
		const error = (await callOpenseoTool(
			'get_keyword_metrics',
			{ keywords: ['secret'] },
			'oseo_test',
		).catch((e: unknown) => e)) as ApiError;
		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(2000);
		expect(error.request.body).toBe('[REDACTED]');
		expect(JSON.stringify(error.request)).not.toContain('secret');
	});

	it('refuses an empty key with AuthMissingError and sends nothing', async () => {
		await expect(callOpenseoTool('whoami', {}, '')).rejects.toBeInstanceOf(
			AuthMissingError,
		);
		expect(mockRequest).not.toHaveBeenCalled();
	});
});

describe('tryGetStoredKey', () => {
	it('returns the stored key or undefined', async () => {
		await expect(tryGetStoredKey(async () => 'oseo_x')).resolves.toBe('oseo_x');
		await expect(tryGetStoredKey(async () => null)).resolves.toBeUndefined();
	});

	it('treats a missing DEK as no key and rethrows other failures', async () => {
		await expect(
			tryGetStoredKey(async () => {
				throw new Error('No DEK found for account (tenant: "t")');
			}),
		).resolves.toBeUndefined();
		await expect(
			tryGetStoredKey(async () => {
				throw new Error('decryption failed');
			}),
		).rejects.toThrow('decryption failed');
	});
});
