import type { RawWebhookRequest } from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { makeRetellRequest } from './client';
import { Calls, Chats } from './endpoints';
import {
	RetellEndpointInputSchemas,
	RetellEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import type { RetellContext } from './index';
import { retellai } from './index';
import { RetellSchema } from './schema';

jest.mock('./client', () => ({
	makeRetellRequest: jest.fn(),
}));

const request = makeRetellRequest as jest.MockedFunction<
	typeof makeRetellRequest
>;
const baseContext = {
	key: 'retell_test_key',
	$getAccountId: async () => 'test-account',
};

function createTestContext(
	overrides: Record<string, unknown> = {},
): RetellContext {
	// Endpoint contexts include runtime services unused by these unit tests. The
	// fixture provides every field read by Retell handlers and keeps overrides local.
	return { ...baseContext, ...overrides } as RetellContext;
}

const ctx = createTestContext();

describe('Retell schemas', () => {
	it('requires a positive list limit when supplied', () => {
		expect(
			RetellEndpointInputSchemas.callsList.safeParse({ limit: 0 }).success,
		).toBe(false);
		expect(
			RetellEndpointInputSchemas.callsList.safeParse({ limit: 20 }).success,
		).toBe(true);
	});

	it('accepts list limits up to the documented maximum of 1000', () => {
		expect(
			RetellEndpointInputSchemas.callsList.safeParse({ limit: 1000 }).success,
		).toBe(true);
		expect(
			RetellEndpointInputSchemas.chatsList.safeParse({ limit: 1001 }).success,
		).toBe(false);
	});

	it('accepts transcript and analysis detail fields', () => {
		const result = RetellEndpointOutputSchemas.callsGet.safeParse({
			call_id: 'call-1',
			transcript: 'hello',
			transcript_object: [],
			call_analysis: { user_sentiment: 'Positive' },
			recording_url: 'https://retell.example/audio',
		});
		expect(result.success).toBe(true);
	});
});

describe('Retell endpoints', () => {
	beforeEach(() => request.mockReset());

	it('lists calls with v3 cursor pagination', async () => {
		request.mockResolvedValue({
			items: [],
			has_more: true,
			pagination_key: 'next',
		});
		await Calls.list(ctx, {
			limit: 25,
			paginationKey: 'next',
			filterCriteria: { call_status: { value: 'ended' } },
		});
		expect(request).toHaveBeenCalledWith(
			'/v3/list-calls',
			'retell_test_key',
			expect.objectContaining({
				method: 'POST',
				body: expect.objectContaining({ pagination_key: 'next', limit: 25 }),
			}),
		);
	});

	it('sends include_total and returns the total count', async () => {
		request.mockResolvedValue({ items: [], has_more: false, total: 7 });
		const result = await Calls.list(ctx, { includeTotal: true });
		expect(request).toHaveBeenCalledWith(
			'/v3/list-calls',
			'retell_test_key',
			expect.objectContaining({
				body: expect.objectContaining({ include_total: true }),
			}),
		);
		expect(result.total).toBe(7);

		request.mockResolvedValue({ items: [], has_more: false, total: 3 });
		const chats = await Chats.list(ctx, { includeTotal: true });
		expect(request).toHaveBeenLastCalledWith(
			'/v3/list-chats',
			'retell_test_key',
			expect.objectContaining({
				body: expect.objectContaining({ include_total: true }),
			}),
		);
		expect(chats.total).toBe(3);
	});

	it.each([
		['calls.list', () => Calls.list(ctx, { limit: 0 })],
		['chats.list', () => Chats.list(ctx, { limit: 1001 })],
		['calls.get', () => Calls.get(ctx, { id: '' })],
		['chats.get', () => Chats.get(ctx, { id: '' })],
	])('%s rejects invalid input before any request', async (_path, run) => {
		await expect(run()).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});

	it('validates call list responses before returning them', async () => {
		request.mockResolvedValue({ items: [{ call_id: 42 }] });
		await expect(Calls.list(ctx, {})).rejects.toThrow();
	});

	it('does not overwrite detailed call cache entries with summaries', async () => {
		const upsertByEntityId = jest.fn();
		request.mockResolvedValue({ items: [{ call_id: 'call-1' }] });
		await Calls.list(
			createTestContext({
				db: {
					calls: { upsertByEntityId },
					chats: { upsertByEntityId: jest.fn() },
				},
			}),
			{},
		);
		expect(upsertByEntityId).not.toHaveBeenCalled();
	});

	it('gets a call detail record containing transcription', async () => {
		request.mockResolvedValue({ call_id: 'call-1', transcript: 'hello' });
		const result = await Calls.get(ctx, { id: 'call-1' });
		expect(result.transcript).toBe('hello');
		expect(request).toHaveBeenCalledWith(
			'/v2/get-call/call-1',
			'retell_test_key',
			{ method: 'GET' },
		);
	});

	it('lists chats using the documented v3 endpoint', async () => {
		request.mockResolvedValue({ items: [], has_more: false });
		await Chats.list(ctx, { limit: 10, paginationKey: 'chat-next' });
		expect(request).toHaveBeenCalledWith(
			'/v3/list-chats',
			'retell_test_key',
			expect.objectContaining({
				method: 'POST',
				body: { limit: 10, pagination_key: 'chat-next' },
			}),
		);
	});

	it('validates chat list responses before returning them', async () => {
		request.mockResolvedValue({ items: [{ chat_id: 42 }] });
		await expect(Chats.list(ctx, {})).rejects.toThrow();
	});

	it('accepts and caches an ongoing chat whose end_timestamp is null', async () => {
		const upsertByEntityId = jest.fn();
		const ongoing = {
			chat_id: 'chat-2',
			agent_id: 'agent-1',
			chat_status: 'ongoing',
			start_timestamp: 1700000000000,
			end_timestamp: null,
		};
		request.mockResolvedValue({ items: [ongoing], has_more: false });
		await expect(Chats.list(ctx, {})).resolves.toBeDefined();

		request.mockResolvedValue(ongoing);
		const result = await Chats.get(
			createTestContext({
				db: {
					calls: { upsertByEntityId: jest.fn() },
					chats: { upsertByEntityId },
				},
			}),
			{ id: 'chat-2' },
		);
		expect(result.end_timestamp).toBeNull();
		expect(upsertByEntityId).toHaveBeenCalledWith('chat-2', ongoing);
		// The ORM parses cached data with the entity schema on write.
		expect(RetellSchema.entities.chats.safeParse(ongoing).success).toBe(true);
		expect(
			RetellSchema.entities.calls.safeParse({
				call_id: 'call-2',
				end_timestamp: null,
			}).success,
		).toBe(true);
	});

	it('gets a chat detail record containing analysis', async () => {
		request.mockResolvedValue({
			chat_id: 'chat-1',
			transcript: 'hello',
			chat_analysis: { success: true },
		});
		const result = await Chats.get(ctx, { id: 'chat-1' });
		expect(result.chat_analysis).toEqual({ success: true });
		expect(request).toHaveBeenCalledWith(
			'/get-chat/chat-1',
			'retell_test_key',
			{ method: 'GET' },
		);
	});

	it('types the chat transcript as message_with_tool_calls', async () => {
		const messages = [{ role: 'agent', content: 'Hi there' }];
		request.mockResolvedValue({
			chat_id: 'chat-1',
			message_with_tool_calls: messages,
		});
		const result = await Chats.get(ctx, { id: 'chat-1' });
		expect(result.message_with_tool_calls).toEqual(messages);
		// Declared (not just passed through), so a malformed value is rejected.
		expect(
			RetellEndpointOutputSchemas.chatsGet.safeParse({
				chat_id: 'chat-1',
				message_with_tool_calls: 'not-an-array',
			}).success,
		).toBe(false);
		expect(
			RetellSchema.entities.chats.safeParse({
				chat_id: 'chat-1',
				message_with_tool_calls: messages,
			}).success,
		).toBe(true);
	});
});

describe('Retell plugin', () => {
	it('exposes the read-only conversation surface and no webhook matcher', () => {
		const plugin = retellai({});
		const webhookRequest: RawWebhookRequest = { headers: {}, body: '' };
		expect(plugin.id).toBe('retellai');
		expect(plugin.endpoints?.calls.list).toBeDefined();
		expect(plugin.endpoints?.chats.get).toBeDefined();
		expect(plugin.pluginWebhookMatcher?.(webhookRequest)).toBe(false);
	});

	it('needs only the API key, so a keyed account is not left partial', () => {
		expect(retellai().authConfig?.api_key?.account).toEqual([]);
	});

	it.each([null, undefined, ''])(
		'raises AuthMissingError when the stored key is %p',
		async (empty) => {
			const plugin = retellai();
			await expect(
				plugin.keyBuilder!(
					{
						authType: 'api_key',
						keys: { get_api_key: async () => empty },
					} as never,
					'endpoint',
				),
			).rejects.toBeInstanceOf(AuthMissingError);
		},
	);

	it('returns the stored API key when present', async () => {
		const plugin = retellai();
		await expect(
			plugin.keyBuilder!(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => 'key_test' },
				} as never,
				'endpoint',
			),
		).resolves.toBe('key_test');
	});

	it('stops retries for authentication failures', async () => {
		const result = await errorHandlers.AUTH_ERROR.handler();
		expect(result.maxRetries).toBe(0);
	});
});
