import { z } from 'zod';
import {
	callDeepwikiMcpTool,
	DeepwikiMcpAPIError,
	makeDeepwikiMcpRequest,
} from './client';

const OutputSchema = z.object({
	content: z.array(
		z.object({
			type: z.string(),
			text: z.string().optional(),
		}),
	),
});

const originalFetch = global.fetch;
let capturedRequest:
	| {
			id: string;
			toolName: string;
			args: unknown;
	  }
	| undefined;

function sseDataEvent(payload: unknown): string {
	return `event: message\ndata: ${JSON.stringify(payload)}\n\n`;
}

// Mocks the transport below corsair/http so the real request pipeline
// (content-type handling, response parsing) is exercised.
function mockFetchResponse(options: {
	status?: number;
	contentType?: string;
	body?: unknown;
	onRequestBody?: (body: string) => void;
}) {
	const status = options.status ?? 200;
	const payload = options.body ?? '';
	global.fetch = (async (_url: unknown, init?: RequestInit) => {
		if (typeof init?.body === 'string') {
			options.onRequestBody?.(init.body);
		}
		return {
			ok: status < 400,
			status,
			statusText: status === 429 ? 'Too Many Requests' : 'OK',
			url: 'https://mcp.deepwiki.com/mcp',
			headers: new Headers({
				'Content-Type':
					options.contentType ?? 'application/json; charset=utf-8',
			}),
			json: async () => payload,
			text: async () =>
				typeof payload === 'string' ? payload : JSON.stringify(payload),
		};
	}) as unknown as typeof global.fetch;
}

const RequestBodySchema = z
	.object({
		id: z.string(),
		method: z.literal('tools/call'),
		params: z.object({
			name: z.string(),
			arguments: z.unknown(),
		}),
	})
	.loose();

afterEach(() => {
	global.fetch = originalFetch;
	capturedRequest = undefined;
});

describe('makeDeepwikiMcpRequest', () => {
	it('parses the tool result from a single SSE data event', async () => {
		mockFetchResponse({
			contentType: 'text/event-stream',
			body: sseDataEvent({
				jsonrpc: '2.0',
				id: 'req-1',
				result: { content: [{ type: 'text', text: 'hi' }] },
			}),
		});

		const result = await makeDeepwikiMcpRequest(
			'mcp',
			'api-key',
			{ requestId: 'req-1' },
			OutputSchema,
		);

		expect(result).toEqual({ content: [{ type: 'text', text: 'hi' }] });
	});

	it('accepts a plain JSON response body', async () => {
		mockFetchResponse({
			body: {
				jsonrpc: '2.0',
				id: 'req-1',
				result: { content: [{ type: 'text', text: 'plain' }] },
			},
		});

		const result = await makeDeepwikiMcpRequest(
			'mcp',
			'api-key',
			{ requestId: 'req-1' },
			OutputSchema,
		);

		expect(result).toEqual({ content: [{ type: 'text', text: 'plain' }] });
	});

	it('skips notifications and unrelated events, picking the response for our request id', async () => {
		mockFetchResponse({
			contentType: 'text/event-stream',
			body: [
				sseDataEvent({
					jsonrpc: '2.0',
					method: 'notifications/message',
					params: { level: 'info' },
				}),
				sseDataEvent({
					jsonrpc: '2.0',
					id: 'some-other-request',
					result: { content: [{ type: 'text', text: 'not ours' }] },
				}),
				sseDataEvent({
					jsonrpc: '2.0',
					id: 'req-1',
					result: { content: [{ type: 'text', text: 'ours' }] },
				}),
			].join(''),
		});

		const result = await makeDeepwikiMcpRequest(
			'mcp',
			'api-key',
			{ requestId: 'req-1' },
			OutputSchema,
		);

		expect(result).toEqual({ content: [{ type: 'text', text: 'ours' }] });
	});

	it('ignores malformed data lines that are not valid JSON', async () => {
		mockFetchResponse({
			contentType: 'text/event-stream',
			body: [
				'data: not-json-at-all\n\n',
				sseDataEvent({
					jsonrpc: '2.0',
					id: 'req-1',
					result: { content: [{ type: 'text', text: 'recovered' }] },
				}),
			].join(''),
		});

		const result = await makeDeepwikiMcpRequest(
			'mcp',
			'api-key',
			{ requestId: 'req-1' },
			OutputSchema,
		);

		expect(result).toEqual({
			content: [{ type: 'text', text: 'recovered' }],
		});
	});
});

describe('makeDeepwikiMcpRequest error paths', () => {
	it('throws when no SSE data line carries a JSON-RPC response', async () => {
		mockFetchResponse({
			contentType: 'text/event-stream',
			body: 'event: ping\r\n\r\n',
		});

		await expect(
			makeDeepwikiMcpRequest(
				'mcp',
				'api-key',
				{ requestId: 'req-1' },
				OutputSchema,
			),
		).rejects.toThrow(/SSE data event/);
	});

	it('maps a JSON-RPC error response to DeepwikiMcpAPIError', async () => {
		mockFetchResponse({
			body: {
				jsonrpc: '2.0',
				id: 'req-1',
				error: { code: -32602, message: 'Invalid repoName' },
			},
		});

		await expect(
			makeDeepwikiMcpRequest(
				'mcp',
				'api-key',
				{ requestId: 'req-1' },
				OutputSchema,
			),
		).rejects.toMatchObject({
			name: 'DeepwikiMcpAPIError',
			message: 'Invalid repoName',
			code: '-32602',
		});
	});

	it('throws when the response carries neither a result nor an error', async () => {
		mockFetchResponse({
			body: { jsonrpc: '2.0', id: 'req-1' },
		});

		await expect(
			makeDeepwikiMcpRequest(
				'mcp',
				'api-key',
				{ requestId: 'req-1' },
				OutputSchema,
			),
		).rejects.toThrow(/did not include a result/);
	});

	it('rejects when the result fails the endpoint output schema', async () => {
		mockFetchResponse({
			body: {
				jsonrpc: '2.0',
				id: 'req-1',
				result: { content: 'should-have-been-an-array' },
			},
		});

		await expect(
			makeDeepwikiMcpRequest(
				'mcp',
				'api-key',
				{ requestId: 'req-1' },
				OutputSchema,
			),
		).rejects.toBeInstanceOf(z.ZodError);
	});
});

describe('callDeepwikiMcpTool', () => {
	it('posts a tools/call request whose generated id is echoed by the parser', async () => {
		// A fake server that reads our JSON-RPC request and answers with an
		// SSE stream echoing the same id, exactly like DeepWiki does.
		global.fetch = (async (_url: unknown, init?: RequestInit) => {
			const raw = typeof init?.body === 'string' ? init.body : '';
			const parsed = RequestBodySchema.safeParse(JSON.parse(raw));
			if (!parsed.success) {
				throw new Error(`Unexpected request body: ${raw}`);
			}
			capturedRequest = {
				id: parsed.data.id,
				toolName: parsed.data.params.name,
				args: parsed.data.params.arguments,
			};
			const payload = sseDataEvent({
				jsonrpc: '2.0',
				id: parsed.data.id,
				result: { content: [{ type: 'text', text: 'ok' }] },
			});
			return {
				ok: true,
				status: 200,
				statusText: 'OK',
				url: 'https://mcp.deepwiki.com/mcp',
				headers: new Headers({
					'Content-Type': 'text/event-stream',
				}),
				json: async () => payload,
				text: async () => payload,
			};
		}) as unknown as typeof global.fetch;

		const input = { repoName: 'facebook/react', question: 'What is React?' };
		const result = await callDeepwikiMcpTool(
			'ask_question',
			input,
			'api-key',
			OutputSchema,
		);

		expect(result).toEqual({ content: [{ type: 'text', text: 'ok' }] });
		expect(capturedRequest?.toolName).toBe('ask_question');
		expect(capturedRequest?.args).toEqual(input);
		expect(typeof capturedRequest?.id).toBe('string');
	});
});
