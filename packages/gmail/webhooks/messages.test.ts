import { logEventFromContext } from 'corsair/core';
import { makeGmailRequest } from '../client';
import { messageChanged } from './messages';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../client', () => ({
	makeGmailRequest: jest.fn(),
}));

const mockMakeGmailRequest = jest.mocked(makeGmailRequest);
const mockLogEventFromContext = jest.mocked(logEventFromContext);

function encodePushNotification(emailAddress: string, historyId: string) {
	return Buffer.from(JSON.stringify({ emailAddress, historyId })).toString(
		'base64',
	);
}

function createWebhookRequest(historyId: string) {
	return {
		payload: {
			message: {
				data: encodePushNotification('user@example.com', historyId),
			},
		},
		headers: {},
	} as Parameters<typeof messageChanged.handler>[1];
}

function createHandlerContext(
	webhookEvents?: Array<
		'messageReceived' | 'messageDeleted' | 'messageLabelChanged'
	>,
): Parameters<typeof messageChanged.handler>[0] {
	return {
		key: 'test-token',
		options: webhookEvents ? { webhookEvents } : {},
		endpoints: {} as Parameters<typeof messageChanged.handler>[0]['endpoints'],
		db: {
			messages: {
				existsByEntityId: jest.fn().mockResolvedValue(false),
				findIdByEntityId: jest.fn().mockResolvedValue('internal-id-1'),
				upsertByEntityId: jest.fn().mockResolvedValue({ id: 'internal-id-1' }),
				deleteByEntityId: jest.fn().mockResolvedValue(undefined),
			},
		},
	} as unknown as Parameters<typeof messageChanged.handler>[0];
}

function mockHistoryResponse(
	history: Array<{
		messagesAdded?: Array<{ message?: { id?: string } }>;
		messagesDeleted?: Array<{ message?: { id?: string } }>;
		labelsAdded?: Array<{ message?: { id?: string } }>;
	}>,
) {
	mockMakeGmailRequest.mockImplementation(
		async (path, _credentials, options) => {
			if (path.includes('/history')) {
				return { history };
			}

			if (path.endsWith('/messages') && options?.method === 'GET') {
				return {
					messages: [{ id: 'fallback-msg-1' }],
				};
			}

			if (path.includes('/messages/fallback-msg-1')) {
				return { id: 'fallback-msg-1', historyId: '1000' };
			}

			if (path.includes('/messages/deleted-msg-1')) {
				return { id: 'deleted-msg-1', historyId: '1000' };
			}

			return {};
		},
	);
}

describe('Gmail messageChanged webhook event filtering', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('returns a no-op when history reports deletions but messageDeleted is disabled', async () => {
		mockHistoryResponse([
			{
				messagesDeleted: [{ message: { id: 'deleted-msg-1' } }],
			},
		]);

		const response = await messageChanged.handler(
			createHandlerContext(['messageReceived']),
			createWebhookRequest('1000'),
		);

		expect(response.success).toBe(true);
		expect(response.data).toBeUndefined();
		expect(mockMakeGmailRequest).not.toHaveBeenCalledWith(
			'/users/user@example.com/messages',
			expect.anything(),
			expect.objectContaining({ method: 'GET' }),
		);
		expect(mockLogEventFromContext).not.toHaveBeenCalledWith(
			expect.anything(),
			'gmail.webhook.messageReceived',
			expect.anything(),
			expect.anything(),
		);
	});

	it('returns a no-op when history reports label changes but messageLabelChanged is disabled', async () => {
		mockHistoryResponse([
			{
				labelsAdded: [{ message: { id: 'labeled-msg-1' } }],
			},
		]);

		const response = await messageChanged.handler(
			createHandlerContext(['messageReceived']),
			createWebhookRequest('1000'),
		);

		expect(response.success).toBe(true);
		expect(response.data).toBeUndefined();
		expect(mockMakeGmailRequest).not.toHaveBeenCalledWith(
			'/users/user@example.com/messages',
			expect.anything(),
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('processes deletions when messageDeleted is enabled', async () => {
		mockHistoryResponse([
			{
				messagesDeleted: [{ message: { id: 'deleted-msg-1' } }],
			},
		]);

		const context = createHandlerContext(['messageDeleted']);
		const response = await messageChanged.handler(
			context,
			createWebhookRequest('1000'),
		);

		expect(response.success).toBe(true);
		expect(response.data).toEqual(
			expect.objectContaining({
				type: 'messageDeleted',
				emailAddress: 'user@example.com',
				historyId: '1000',
			}),
		);
		expect(context.db.messages.deleteByEntityId).toHaveBeenCalledWith(
			'deleted-msg-1',
		);
	});

	it('still deletes the local row when a deleted message fetch returns 404', async () => {
		// Gmail returns 404 for messages that are already deleted, which is the
		// common case in this code path. The local row must still be removed.
		mockMakeGmailRequest.mockImplementation(
			async (path, _credentials, options) => {
				if (path.includes('/history')) {
					return {
						history: [
							{
								id: '1000',
								messagesDeleted: [{ message: { id: 'gone-msg-1' } }],
							},
						],
					};
				}
				if (
					path.endsWith('/messages/gone-msg-1') &&
					options?.method === 'GET'
				) {
					throw Object.assign(new Error('Requested entity was not found.'), {
						status: 404,
					});
				}
				return { id: 'gone-msg-1', historyId: '1000' };
			},
		);

		const context = createHandlerContext(['messageDeleted']);
		const response = await messageChanged.handler(
			context,
			createWebhookRequest('1000'),
		);

		expect(response.success).toBe(true);
		expect(context.db.messages.deleteByEntityId).toHaveBeenCalledWith(
			'gone-msg-1',
		);
	});

	it('uses the fallback path when history is empty', async () => {
		mockHistoryResponse([]);
		mockMakeGmailRequest.mockImplementation(
			async (path, _credentials, options) => {
				if (path.includes('/history')) {
					return { history: [] };
				}

				if (path.endsWith('/messages') && options?.method === 'GET') {
					return {
						messages: [{ id: 'fallback-msg-1' }],
					};
				}

				if (path.includes('/messages/fallback-msg-1')) {
					if (options?.query?.format === 'minimal') {
						return { id: 'fallback-msg-1', historyId: '1000' };
					}

					return {
						id: 'fallback-msg-1',
						historyId: '1000',
						payload: {
							headers: [
								{ name: 'Subject', value: 'Hello' },
								{ name: 'From', value: 'sender@example.com' },
								{ name: 'To', value: 'user@example.com' },
							],
						},
					};
				}

				return {};
			},
		);

		const context = createHandlerContext(['messageReceived']);
		const response = await messageChanged.handler(
			context,
			createWebhookRequest('1000'),
		);

		expect(response.success).toBe(true);
		expect(response.data).toEqual(
			expect.objectContaining({
				type: 'messageReceived',
				emailAddress: 'user@example.com',
				historyId: '1000',
			}),
		);
		expect(mockMakeGmailRequest).toHaveBeenCalledWith(
			'/users/user@example.com/messages',
			'test-token',
			expect.objectContaining({ method: 'GET' }),
		);
	});
});

function createHandlerContextWithKeys(
	lastHistoryId: string | null,
	webhookEvents?: Array<
		'messageReceived' | 'messageDeleted' | 'messageLabelChanged'
	>,
) {
	const keys = {
		get_last_history_id: jest.fn().mockResolvedValue(lastHistoryId),
		set_last_history_id: jest.fn().mockResolvedValue(undefined),
	};
	const ctx = createHandlerContext(webhookEvents);
	(ctx as unknown as { keys: typeof keys }).keys = keys;
	return { ctx, keys };
}

describe('Gmail messageChanged webhook history sync', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('syncs new messages when the same batch also contains label changes', async () => {
		mockMakeGmailRequest.mockImplementation(async (path) => {
			if (path.includes('/history')) {
				return {
					history: [
						{
							id: '1001',
							labelsAdded: [{ message: { id: 'labeled-msg-1' } }],
						},
						{
							id: '1002',
							messagesAdded: [{ message: { id: 'new-msg-1' } }],
						},
					],
				};
			}
			if (path.includes('/messages/new-msg-1')) {
				return { id: 'new-msg-1', historyId: '1002' };
			}
			if (path.includes('/messages/labeled-msg-1')) {
				return { id: 'labeled-msg-1', historyId: '1001' };
			}
			return {};
		});

		const context = createHandlerContext();
		const response = await messageChanged.handler(
			context,
			createWebhookRequest('1002'),
		);

		expect(response.success).toBe(true);
		expect(response.data).toEqual(
			expect.objectContaining({ type: 'messageReceived' }),
		);
		expect(context.db.messages.upsertByEntityId).toHaveBeenCalledWith(
			'new-msg-1',
			expect.objectContaining({ id: 'new-msg-1' }),
		);
		expect(context.db.messages.upsertByEntityId).toHaveBeenCalledWith(
			'labeled-msg-1',
			expect.objectContaining({ id: 'labeled-msg-1' }),
		);
	});

	it('handles numeric historyId values from real Pub/Sub payloads', async () => {
		mockMakeGmailRequest.mockImplementation(async (path) => {
			if (path.includes('/history')) {
				return {
					history: [
						{
							id: '585184',
							messagesAdded: [{ message: { id: 'num-msg-1' } }],
						},
					],
				};
			}
			return { id: 'num-msg-1', historyId: '585184' };
		});

		const request = {
			payload: {
				message: {
					data: Buffer.from(
						JSON.stringify({
							emailAddress: 'user@example.com',
							historyId: 585184,
						}),
					).toString('base64'),
				},
			},
			headers: {},
		} as Parameters<typeof messageChanged.handler>[1];

		const context = createHandlerContext();
		const response = await messageChanged.handler(context, request);

		expect(response.success).toBe(true);
		expect(response.data).toEqual(
			expect.objectContaining({
				type: 'messageReceived',
				historyId: '585184',
			}),
		);
	});

	it('scans from the stored history cursor and advances it', async () => {
		mockMakeGmailRequest.mockImplementation(async (path) => {
			if (path.includes('/history')) {
				return {
					history: [
						{
							id: '955',
							messagesAdded: [{ message: { id: 'cursor-msg-1' } }],
						},
					],
				};
			}
			return { id: 'cursor-msg-1', historyId: '955' };
		});

		const { ctx, keys } = createHandlerContextWithKeys('900');
		const response = await messageChanged.handler(
			ctx,
			createWebhookRequest('956'),
		);

		expect(response.success).toBe(true);
		expect(mockMakeGmailRequest).toHaveBeenCalledWith(
			'/users/user@example.com/history',
			'test-token',
			expect.objectContaining({
				query: expect.objectContaining({ startHistoryId: '900' }),
			}),
		);
		expect(keys.set_last_history_id).toHaveBeenCalledWith('955');
	});

	it('skips the recent-messages fallback when a cursor exists', async () => {
		mockMakeGmailRequest.mockImplementation(async (path) => {
			if (path.includes('/history')) {
				return { history: [] };
			}
			return {};
		});

		const { ctx, keys } = createHandlerContextWithKeys('900');
		const response = await messageChanged.handler(
			ctx,
			createWebhookRequest('1000'),
		);

		expect(response.success).toBe(true);
		expect(response.data).toBeUndefined();
		expect(mockMakeGmailRequest).not.toHaveBeenCalledWith(
			'/users/user@example.com/messages',
			expect.anything(),
			expect.anything(),
		);
		// The cursor stays put so a lagging history record is retried next push
		expect(keys.set_last_history_id).not.toHaveBeenCalled();
	});

	it('rescans from the push when the stored cursor has expired', async () => {
		mockMakeGmailRequest.mockImplementation(
			async (path, _credentials, options) => {
				if (path.includes('/history')) {
					if (options?.query?.startHistoryId === '100') {
						throw Object.assign(new Error('Requested entity was not found.'), {
							status: 404,
						});
					}
					return {
						history: [
							{
								id: '1000',
								messagesAdded: [{ message: { id: 'retry-msg-1' } }],
							},
						],
					};
				}
				return { id: 'retry-msg-1', historyId: '1000' };
			},
		);

		const { ctx, keys } = createHandlerContextWithKeys('100');
		const response = await messageChanged.handler(
			ctx,
			createWebhookRequest('1000'),
		);

		expect(response.success).toBe(true);
		expect(response.data).toEqual(
			expect.objectContaining({ type: 'messageReceived' }),
		);
		expect(ctx.db.messages.upsertByEntityId).toHaveBeenCalledWith(
			'retry-msg-1',
			expect.objectContaining({ id: 'retry-msg-1' }),
		);
		expect(keys.set_last_history_id).toHaveBeenCalledWith('1000');
	});

	it('holds the cursor back when a deletion fails to apply', async () => {
		mockMakeGmailRequest.mockImplementation(async (path) => {
			if (path.includes('/history')) {
				return {
					history: [
						{
							id: '950',
							messagesDeleted: [{ message: { id: 'stuck-msg-1' } }],
						},
					],
				};
			}
			return { id: 'stuck-msg-1', historyId: '950' };
		});

		const { ctx, keys } = createHandlerContextWithKeys('900');
		(ctx.db.messages.deleteByEntityId as jest.Mock).mockRejectedValue(
			new Error('db unavailable'),
		);

		const response = await messageChanged.handler(
			ctx,
			createWebhookRequest('951'),
		);

		expect(response.success).toBe(true);
		// The cursor must not move past the failed deletion so the next push
		// re-scans this range and retries it
		expect(keys.set_last_history_id).not.toHaveBeenCalled();
	});

	it('holds the cursor back when an added message fails to sync', async () => {
		mockMakeGmailRequest.mockImplementation(async (path) => {
			if (path.includes('/history')) {
				return {
					history: [
						{
							id: '960',
							messagesAdded: [{ message: { id: 'flaky-msg-1' } }],
						},
					],
				};
			}
			throw Object.assign(new Error('upstream unavailable'), { status: 503 });
		});

		const { ctx, keys } = createHandlerContextWithKeys('900');
		const response = await messageChanged.handler(
			ctx,
			createWebhookRequest('961'),
		);

		expect(response.success).toBe(true);
		expect(keys.set_last_history_id).not.toHaveBeenCalled();
	});

	it('advances the cursor past intentionally filtered categories', async () => {
		mockMakeGmailRequest.mockImplementation(async (path) => {
			if (path.includes('/history')) {
				return {
					history: [
						{
							id: '950',
							messagesDeleted: [{ message: { id: 'ignored-msg-1' } }],
						},
					],
				};
			}
			return {};
		});

		const { ctx, keys } = createHandlerContextWithKeys('900', [
			'messageReceived',
		]);
		const response = await messageChanged.handler(
			ctx,
			createWebhookRequest('951'),
		);

		expect(response.success).toBe(true);
		expect(response.data).toBeUndefined();
		expect(ctx.db.messages.deleteByEntityId).not.toHaveBeenCalled();
		// Filtered categories are skipped by configuration, not failure, so the
		// cursor advances — holding it back would rescan the same records on
		// every future push
		expect(keys.set_last_history_id).toHaveBeenCalledWith('950');
	});

	it('initializes the cursor just before the first push when nothing is visible yet', async () => {
		mockMakeGmailRequest.mockImplementation(async (path) => {
			if (path.includes('/history')) {
				return { history: [] };
			}
			if (path.endsWith('/messages')) {
				return { messages: [] };
			}
			return {};
		});

		const { ctx, keys } = createHandlerContextWithKeys(null);
		const response = await messageChanged.handler(
			ctx,
			createWebhookRequest('585184'),
		);

		expect(response.success).toBe(true);
		expect(response.data).toBeUndefined();
		expect(keys.set_last_history_id).toHaveBeenCalledWith('585183');
	});
});
