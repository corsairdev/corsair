import { AuthMissingError } from 'corsair/core';
import { MondayMcpAPIError, makeMondayMcpToolCall } from './client';

const fetchMock = jest.fn<
	Promise<Response>,
	Parameters<typeof globalThis.fetch>
>();

function jsonResponse(
	body: unknown,
	headers: Record<string, string> = {},
	status = 200,
): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'content-type': 'application/json', ...headers },
	});
}

function sseResponse(frames: unknown[], sessionId?: string): Response {
	const body = frames
		.map((frame) => `data: ${JSON.stringify(frame)}\n\n`)
		.join('');
	return new Response(body, {
		status: 200,
		headers: {
			'content-type': 'text/event-stream',
			...(sessionId ? { 'mcp-session-id': sessionId } : {}),
		},
	});
}

beforeEach(() => {
	fetchMock.mockReset();
	globalThis.fetch = fetchMock as typeof globalThis.fetch;
});

describe('makeMondayMcpToolCall', () => {
	it('rejects a missing API key before any request', async () => {
		await expect(makeMondayMcpToolCall('', 'create_board', {})).rejects.toThrow(
			AuthMissingError,
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('parses a tools/call answer delivered as an SSE stream', async () => {
		fetchMock
			.mockImplementationOnce(() =>
				Promise.resolve(
					jsonResponse(
						{
							jsonrpc: '2.0',
							id: 1,
							result: { protocolVersion: '2025-06-18' },
						},
						{ 'mcp-session-id': 'sess-sse' },
					),
				),
			)
			.mockImplementationOnce(() =>
				Promise.resolve(new Response(null, { status: 202 })),
			)
			.mockImplementationOnce(() =>
				Promise.resolve(
					sseResponse(
						[
							{ jsonrpc: '2.0', method: 'notifications/progress' },
							{
								jsonrpc: '2.0',
								id: 2,
								result: { content: [{ type: 'text', text: 'ok' }] },
							},
						],
						'sess-sse',
					),
				),
			);

		const result = await makeMondayMcpToolCall('token', 'list_workspaces', {});

		expect(result).toEqual({ content: [{ type: 'text', text: 'ok' }] });
		const thirdHeaders = fetchMock.mock.calls[2]?.[1]?.headers as Record<
			string,
			string
		>;
		expect(thirdHeaders?.['mcp-session-id']).toBe('sess-sse');
		expect(thirdHeaders?.['mcp-protocol-version']).toBe('2025-06-18');
		expect(thirdHeaders?.Authorization).toBe('Bearer token');
	});

	it('surfaces a JSON-RPC protocol error with its code', async () => {
		fetchMock
			.mockImplementationOnce(() =>
				Promise.resolve(
					jsonResponse(
						{ jsonrpc: '2.0', id: 1, result: {} },
						{ 'mcp-session-id': 's' },
					),
				),
			)
			.mockImplementationOnce(() =>
				Promise.resolve(new Response(null, { status: 202 })),
			)
			.mockImplementationOnce(() =>
				Promise.resolve(
					jsonResponse({
						jsonrpc: '2.0',
						id: 2,
						error: { code: -32602, message: 'Invalid params: boardId' },
					}),
				),
			);

		let caught: unknown;
		try {
			await makeMondayMcpToolCall('token', 'get_board_info', {});
		} catch (error) {
			caught = error;
		}

		expect(caught).toBeInstanceOf(MondayMcpAPIError);
		expect((caught as MondayMcpAPIError).code).toBe('-32602');
		expect((caught as MondayMcpAPIError).message).not.toContain('boardId');
	});

	it('keeps the HTTP status and Retry-After from a transport failure', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(
				new Response('daily limit reached', {
					status: 429,
					headers: { 'retry-after': '30' },
				}),
			),
		);

		let caught: unknown;
		try {
			await makeMondayMcpToolCall('token', 'search', {});
		} catch (error) {
			caught = error;
		}

		expect(caught).toBeInstanceOf(MondayMcpAPIError);
		expect((caught as MondayMcpAPIError).status).toBe(429);
		expect((caught as MondayMcpAPIError).retryAfter).toBe(30_000);
		expect((caught as MondayMcpAPIError).body).toBeUndefined();
		expect((caught as MondayMcpAPIError).message).not.toContain('daily limit');
	});

	it('does not expose network error details', async () => {
		fetchMock.mockRejectedValueOnce(new Error('private customer token'));
		await expect(makeMondayMcpToolCall('token', 'search', {})).rejects.toThrow(
			'Failed to reach the monday MCP server',
		);
	});

	it('does not expose malformed provider response text', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response('private customer text', {
				headers: { 'content-type': 'application/json' },
			}),
		);
		await expect(makeMondayMcpToolCall('token', 'search', {})).rejects.toThrow(
			'Failed to parse the monday MCP response',
		);
	});

	it('does not expose JSON-RPC error data', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({
				jsonrpc: '2.0',
				id: 1,
				error: {
					code: -32602,
					message: 'private message',
					data: 'private data',
				},
			}),
		);
		try {
			await makeMondayMcpToolCall('token', 'search', {});
			throw new Error('expected rejection');
		} catch (error) {
			expect(error).toBeInstanceOf(MondayMcpAPIError);
			expect((error as MondayMcpAPIError).code).toBe('-32602');
			expect(JSON.stringify(error)).not.toContain('private');
			expect((error as Error).message).not.toContain('private');
		}
	});

	it('fails loudly when the server answers with the wrong request id', async () => {
		fetchMock
			.mockImplementationOnce(() =>
				Promise.resolve(
					jsonResponse(
						{ jsonrpc: '2.0', id: 1, result: {} },
						{ 'mcp-session-id': 's' },
					),
				),
			)
			.mockImplementationOnce(() =>
				Promise.resolve(new Response(null, { status: 202 })),
			)
			.mockImplementationOnce(() =>
				Promise.resolve(
					jsonResponse({ jsonrpc: '2.0', id: 99, result: { content: [] } }),
				),
			);

		await expect(makeMondayMcpToolCall('token', 'search', {})).rejects.toThrow(
			/instead of 2/,
		);
	});

	it('resolves from an SSE stream that stays open after the reply', async () => {
		const cancelled: Array<boolean> = [];
		const stream = new ReadableStream<Uint8Array>({
			start(controller) {
				controller.enqueue(
					new TextEncoder().encode(
						'data: ' +
							JSON.stringify({
								jsonrpc: '2.0',
								id: 2,
								result: { content: [{ type: 'text', text: 'early reply' }] },
							}) +
							'\n\n',
					),
				);
				// Never closes: the server keeps the stream open after replying.
			},
			cancel() {
				cancelled.push(true);
			},
		});
		fetchMock
			.mockImplementationOnce(() =>
				Promise.resolve(
					jsonResponse(
						{ jsonrpc: '2.0', id: 1, result: {} },
						{ 'mcp-session-id': 's' },
					),
				),
			)
			.mockImplementationOnce(() =>
				Promise.resolve(new Response(null, { status: 202 })),
			)
			.mockImplementationOnce(() =>
				Promise.resolve(
					new Response(stream, {
						status: 200,
						headers: { 'content-type': 'text/event-stream' },
					}),
				),
			);

		const result = await makeMondayMcpToolCall('token', 'search', {});

		expect(result).toEqual({
			content: [{ type: 'text', text: 'early reply' }],
		});
		expect(cancelled).toEqual([true]);
	});
});
