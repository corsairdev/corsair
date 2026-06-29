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
