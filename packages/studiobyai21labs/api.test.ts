import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	makeStudioByAI21LabsRequest,
	STUDIOBYAI21LABS_API_BASE,
} from './client';
import { Chat, Library, Maestro } from './endpoints';
import {
	StudioByAI21LabsEndpointInputSchemas,
	StudioByAI21LabsEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import type { StudioByAI21LabsContext } from './index';
import { studioByAI21LabsEndpointSchemas, studiobyai21labs } from './index';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

jest.mock('corsair/core', () => {
	const original = jest.requireActual('corsair/core');
	return {
		...original,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});

const mockRequest = request as jest.Mock;
const mockLogEvent = logEventFromContext as jest.Mock;

function testCtx(key = 'test-key'): StudioByAI21LabsContext {
	return {
		key,
		$getAccountId: async () => 'test-account-id',
	} as unknown as StudioByAI21LabsContext;
}

function endpointPaths(tree: Record<string, unknown>, prefix = ''): string[] {
	return Object.entries(tree).flatMap(([key, value]) => {
		const path = prefix ? `${prefix}.${key}` : key;
		if (typeof value === 'function') return [path];
		if (value && typeof value === 'object') {
			return endpointPaths(value as Record<string, unknown>, path);
		}
		return [];
	});
}

describe('StudioByAI21Labs plugin shape', () => {
	it('registers the official AI21 Studio operations and no webhooks', () => {
		const plugin = studiobyai21labs();
		const paths = endpointPaths(
			plugin.endpoints as Record<string, unknown>,
		).sort();

		expect(paths).toEqual([
			'chat.completions',
			'library.delete',
			'library.download',
			'library.get',
			'library.list',
			'library.update',
			'library.upload',
			'maestro.createRun',
			'maestro.retrieveRun',
		]);
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(paths);
		expect(Object.keys(studioByAI21LabsEndpointSchemas).sort()).toEqual(paths);
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher?.({ headers: {}, body: '' })).toBe(
			false,
		);
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.schema?.entities).toEqual({});
	});
});

describe('StudioByAI21Labs schemas', () => {
	it('parses chat completions input and response', () => {
		const input =
			StudioByAI21LabsEndpointInputSchemas.chatCompletions.safeParse({
				model: 'jamba-large',
				messages: [{ role: 'user', content: 'Hello' }],
				max_tokens: 1024,
			});
		expect(input.success).toBe(true);

		const output =
			StudioByAI21LabsEndpointOutputSchemas.chatCompletions.safeParse({
				id: 'cmpl-1',
				choices: [
					{
						index: 0,
						message: { role: 'assistant', content: 'Hi' },
						finish_reason: 'stop',
					},
				],
				usage: {
					prompt_tokens: 4,
					completion_tokens: 1,
					total_tokens: 5,
				},
			});
		expect(output.success).toBe(true);
	});

	it('rejects chat completions without messages', () => {
		const invalid =
			StudioByAI21LabsEndpointInputSchemas.chatCompletions.safeParse({
				model: 'jamba-large',
			});
		expect(invalid.success).toBe(false);
	});

	it('rejects chat completions stream field', () => {
		const invalid =
			StudioByAI21LabsEndpointInputSchemas.chatCompletions.safeParse({
				model: 'jamba-large',
				messages: [{ role: 'user', content: 'Hello' }],
				stream: true,
			});
		expect(invalid.success).toBe(false);
	});

	it('parses library list, file, and download schemas', () => {
		expect(
			StudioByAI21LabsEndpointInputSchemas.listLibraryFiles.safeParse({
				status: 'PROCESSED',
				limit: 10,
			}).success,
		).toBe(true);
		expect(
			StudioByAI21LabsEndpointOutputSchemas.listLibraryFiles.safeParse([
				{
					id: 'file-1',
					name: 'notes.txt',
					size: 12,
					created_at: '2025-10-20T14:23:11Z',
					labels: ['invoices'],
				},
			]).success,
		).toBe(true);
		expect(
			StudioByAI21LabsEndpointInputSchemas.uploadWorkspaceFile.safeParse({
				publicUrl: 'https://example.com/file.pdf',
				path: 'docs/file.pdf',
				labels: ['docs'],
			}).success,
		).toBe(true);
		expect(
			StudioByAI21LabsEndpointInputSchemas.uploadWorkspaceFile.safeParse({})
				.success,
		).toBe(false);
		expect(
			StudioByAI21LabsEndpointOutputSchemas.getFileDownloadLink.safeParse(
				'https://storage.ai21.com/files/file_123abc/download?token=xyz',
			).success,
		).toBe(true);
	});

	it('parses maestro create and retrieve schemas', () => {
		expect(
			StudioByAI21LabsEndpointInputSchemas.createMaestroRun.safeParse({
				input: [
					{
						role: 'user',
						content: 'Summarize the market',
					},
				],
				budget: 'low',
				include: ['requirements_result'],
			}).success,
		).toBe(true);
		expect(
			StudioByAI21LabsEndpointInputSchemas.createMaestroRun.safeParse({
				input: 'Summarize the market',
				models: ['jamba-mini'],
			}).success,
		).toBe(true);
		expect(
			StudioByAI21LabsEndpointInputSchemas.createMaestroRun.safeParse({
				input: 'Summarize the market',
				models: 'jamba-mini',
			}).success,
		).toBe(false);
		expect(
			StudioByAI21LabsEndpointOutputSchemas.createMaestroRun.safeParse({
				id: 'run-1',
				status: 'completed',
				result: 'ok',
			}).success,
		).toBe(true);
		expect(
			StudioByAI21LabsEndpointInputSchemas.retrieveMaestroRun.safeParse({
				id: 'run-1',
			}).success,
		).toBe(true);
	});
});

describe('StudioByAI21Labs client', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ ok: true });
	});

	it('sends bearer auth and forwards query on every method', async () => {
		await makeStudioByAI21LabsRequest('library/files', 'test-key', {
			method: 'GET',
			query: { limit: 5 },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: STUDIOBYAI21LABS_API_BASE,
				TOKEN: 'test-key',
				HEADERS: expect.objectContaining({
					Authorization: 'Bearer test-key',
				}),
			}),
			expect.objectContaining({
				method: 'GET',
				url: 'library/files',
				query: { limit: 5 },
			}),
		);
	});

	it('rethrows ApiError so status is preserved', async () => {
		const apiError = new ApiError(
			{
				method: 'GET',
				url: 'library/files',
			} as never,
			{
				url: 'https://api.ai21.com/studio/v1/library/files',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: { detail: 'rate limited' },
			} as never,
			'rate limited',
		);
		mockRequest.mockRejectedValue(apiError);

		await expect(
			makeStudioByAI21LabsRequest('library/files', 'test-key'),
		).rejects.toBe(apiError);
	});
});

describe('StudioByAI21Labs error handlers', () => {
	it('matches 429 ApiError without treating arbitrary 429 text as a retry', async () => {
		const rateLimited = new ApiError(
			{
				method: 'GET',
				url: 'chat/completions',
			} as never,
			{
				url: 'https://api.ai21.com/studio/v1/chat/completions',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: {},
			} as never,
			'Too Many Requests',
		);

		expect(errorHandlers.RATE_LIMIT_ERROR.match(rateLimited)).toBe(true);
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(new Error('id 4290 failed')),
		).toBe(false);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(rateLimited),
		).resolves.toEqual({ maxRetries: 0, headersRetryAfterMs: undefined });
	});
});

describe('StudioByAI21Labs keyBuilder', () => {
	it('throws AuthMissingError when no key is configured', async () => {
		const plugin = studiobyai21labs();
		const keyBuilder = plugin.keyBuilder;
		if (!keyBuilder) throw new Error('keyBuilder missing');
		await expect(
			keyBuilder(
				{
					authType: 'api_key',
					keys: {
						get_api_key: async () => undefined,
					},
				} as never,
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('returns an explicit plugin key', async () => {
		const plugin = studiobyai21labs({ key: 'explicit-key' });
		const keyBuilder = plugin.keyBuilder;
		if (!keyBuilder) throw new Error('keyBuilder missing');
		await expect(
			keyBuilder({ authType: 'api_key' } as never, 'endpoint'),
		).resolves.toBe('explicit-key');
	});
});

describe('StudioByAI21Labs endpoint handlers', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockLogEvent.mockClear();
	});

	it('chat completions posts to the official path and redacts messages', async () => {
		mockRequest.mockResolvedValue({
			id: 'cmpl-1',
			choices: [{ message: { role: 'assistant', content: 'Hi' } }],
		});

		const messages = [{ role: 'user' as const, content: 'secret prompt' }];
		await Chat.completions(testCtx(), {
			model: 'jamba-large',
			messages,
			max_tokens: 64,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: 'chat/completions',
				body: expect.objectContaining({
					model: 'jamba-large',
					messages,
					max_tokens: 64,
					stream: false,
				}),
			}),
		);
		expect(mockLogEvent).toHaveBeenCalledWith(
			expect.anything(),
			'studiobyai21labs.chat.completions',
			{ model: 'jamba-large', n: undefined },
			'completed',
		);
	});

	it('library list uses query filters', async () => {
		mockRequest.mockResolvedValue([]);
		await Library.list(testCtx(), {
			status: 'PROCESSED',
			label: ['invoices', 'Q3'],
			limit: 10,
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: 'library/files',
				query: expect.objectContaining({
					status: 'PROCESSED',
					label: 'invoices,Q3',
					limit: 10,
				}),
			}),
		);
	});

	it('library upload posts JSON when only a public URL is provided', async () => {
		mockRequest.mockResolvedValue({ id: 'file-1' });
		await Library.upload(testCtx(), {
			publicUrl: 'https://example.com/file.pdf',
			path: 'docs/file.pdf',
			labels: ['docs'],
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: 'library/files',
				body: {
					path: 'docs/file.pdf',
					labels: ['docs'],
					publicUrl: 'https://example.com/file.pdf',
				},
			}),
		);
	});

	it('library upload sends multipart when a file is provided', async () => {
		const fetchMock = jest.fn().mockResolvedValue({
			ok: true,
			json: async () => ({ id: 'file-2' }),
		});
		const originalFetch = globalThis.fetch;
		globalThis.fetch = fetchMock as typeof fetch;

		try {
			await Library.upload(testCtx(), {
				file: 'hello',
				fileName: 'notes.txt',
				path: 'docs/notes.txt',
				labels: ['notes'],
			});
		} finally {
			globalThis.fetch = originalFetch;
		}

		expect(mockRequest).not.toHaveBeenCalled();
		expect(fetchMock).toHaveBeenCalledWith(
			'https://api.ai21.com/studio/v1/library/files',
			expect.objectContaining({
				method: 'POST',
				headers: { Authorization: 'Bearer test-key' },
			}),
		);
		const body = fetchMock.mock.calls[0]?.[1]?.body as FormData;
		expect(body.get('path')).toBe('docs/notes.txt');
		expect(body.get('labels')).toBe(JSON.stringify(['notes']));
	});

	it('library get, update, delete, and download use file id paths', async () => {
		mockRequest.mockResolvedValue({ id: 'file-1', name: 'notes.txt' });
		await Library.get(testCtx(), { file_id: 'file-1' });
		expect(mockRequest.mock.calls.at(-1)?.[1]).toMatchObject({
			method: 'GET',
			url: 'library/files/file-1',
		});

		mockRequest.mockResolvedValue(undefined);
		await Library.update(testCtx(), {
			file_id: 'file-1',
			labels: ['updated'],
		});
		expect(mockRequest.mock.calls.at(-1)?.[1]).toMatchObject({
			method: 'PUT',
			url: 'library/files/file-1',
			body: { labels: ['updated'] },
		});

		await Library.deleteFile(testCtx(), { file_id: 'file-1' });
		expect(mockRequest.mock.calls.at(-1)?.[1]).toMatchObject({
			method: 'DELETE',
			url: 'library/files/file-1',
		});

		mockRequest.mockResolvedValue(
			'https://storage.ai21.com/files/file-1/download?token=xyz',
		);
		const link = await Library.download(testCtx(), { file_id: 'file-1' });
		expect(mockRequest.mock.calls.at(-1)?.[1]).toMatchObject({
			method: 'GET',
			url: 'library/files/file-1/download',
		});
		expect(link).toBe(
			'https://storage.ai21.com/files/file-1/download?token=xyz',
		);
	});

	it('maestro create and retrieve use official run paths', async () => {
		mockRequest.mockResolvedValue({
			id: 'run-1',
			status: 'in_progress',
		});
		await Maestro.createRun(testCtx(), {
			input: [{ role: 'user', content: 'Summarize this' }],
			budget: 'medium',
		});
		expect(mockRequest.mock.calls.at(-1)?.[1]).toMatchObject({
			method: 'POST',
			url: 'maestro/runs',
			body: expect.objectContaining({
				input: [{ role: 'user', content: 'Summarize this' }],
				budget: 'medium',
			}),
		});

		mockRequest.mockResolvedValue({
			id: 'run-1',
			status: 'completed',
			result: 'done',
		});
		await Maestro.retrieveRun(testCtx(), { id: 'run-1' });
		expect(mockRequest.mock.calls.at(-1)?.[1]).toMatchObject({
			method: 'GET',
			url: 'maestro/runs/run-1',
		});
	});
});
