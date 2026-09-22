import { makeRetellRequest } from './client';
import { Calls, Chats } from './endpoints';
import {
	RetellEndpointInputSchemas,
	RetellEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import type { RetellContext } from './index';
import { retellai } from './index';

jest.mock('./client', () => ({
	makeRetellRequest: jest.fn(),
}));

const request = makeRetellRequest as jest.MockedFunction<
	typeof makeRetellRequest
>;
const ctx = {
	key: 'retell_test_key',
	$getAccountId: async () => 'test-account',
} as RetellContext;

describe('Retell schemas', () => {
	it('requires a positive list limit when supplied', () => {
		expect(
			RetellEndpointInputSchemas.callsList.safeParse({ limit: 0 }).success,
		).toBe(false);
		expect(
			RetellEndpointInputSchemas.callsList.safeParse({ limit: 20 }).success,
		).toBe(true);
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

	it('validates call list responses before returning them', async () => {
		request.mockResolvedValue({ items: [{ call_id: 42 }] });
		await expect(Calls.list(ctx, {})).rejects.toThrow();
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
});

describe('Retell plugin', () => {
	it('exposes the read-only conversation surface and no webhook matcher', () => {
		const plugin = retellai({});
		expect(plugin.id).toBe('retellai');
		expect(plugin.endpoints?.calls.list).toBeDefined();
		expect(plugin.endpoints?.chats.get).toBeDefined();
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: '' } as never),
		).toBe(false);
	});

	it('stops retries for authentication failures', async () => {
		const result = await errorHandlers.AUTH_ERROR.handler();
		expect(result.maxRetries).toBe(0);
	});
});
