import { makeGmailRequest } from '../client';
import { messageChanged } from './messages';

jest.mock('../client', () => ({
	makeGmailRequest: jest.fn(),
}));
jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockedMakeGmailRequest = jest.mocked(makeGmailRequest);

function pubSubPayload(data: Record<string, unknown>) {
	return {
		message: {
			data: Buffer.from(JSON.stringify(data)).toString('base64'),
		},
	};
}

function testMessage(id: string, historyId = '300') {
	return {
		id,
		threadId: `thread-${id}`,
		historyId,
		snippet: `snippet-${id}`,
		payload: {
			headers: [
				{ name: 'Subject', value: `Subject ${id}` },
				{ name: 'From', value: 'from@example.com' },
				{ name: 'To', value: 'to@example.com' },
			],
		},
	};
}

function createCtx(overrides: Record<string, unknown> = {}) {
	return {
		key: 'token',
		options: {},
		keys: {
			get_history_id: jest.fn().mockResolvedValue('100'),
			set_history_id: jest.fn().mockResolvedValue(undefined),
		},
		db: {
			messages: {
				upsertByEntityId: jest
					.fn()
					.mockImplementation((id: string) =>
						Promise.resolve({ id: `db-${id}` }),
					),
				findIdByEntityId: jest.fn(),
				deleteByEntityId: jest.fn(),
			},
		},
		$getAccountId: jest.fn().mockResolvedValue('account-1'),
		...overrides,
	} as any;
}

describe('Gmail messageChanged webhook cursors', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		jest.spyOn(console, 'error').mockImplementation(() => {});
		jest.spyOn(console, 'warn').mockImplementation(() => {});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('processes every history page before persisting the returned mailbox history id', async () => {
		const ctx = createCtx();
		mockedMakeGmailRequest
			.mockResolvedValueOnce({
				history: [{ messagesAdded: [{ message: { id: 'm1' } }] }],
				nextPageToken: 'page-2',
			})
			.mockResolvedValueOnce({
				history: [{ messagesAdded: [{ message: { id: 'm2' } }] }],
				historyId: '350',
			})
			.mockResolvedValueOnce(testMessage('m1'))
			.mockResolvedValueOnce(testMessage('m2'));

		const result = await messageChanged.handler(ctx, {
			payload: pubSubPayload({
				emailAddress: 'me@example.com',
				historyId: '300',
			}),
		} as any);

		expect(result.success).toBe(true);
		expect(ctx.db.messages.upsertByEntityId).toHaveBeenCalledTimes(2);
		expect(ctx.keys.set_history_id).toHaveBeenCalledWith('350');
		expect(mockedMakeGmailRequest).toHaveBeenNthCalledWith(
			2,
			'/users/me@example.com/history',
			'token',
			expect.objectContaining({
				query: expect.objectContaining({ pageToken: 'page-2' }),
			}),
		);
	});

	it('does not advance history_id when processing fails', async () => {
		const ctx = createCtx();
		ctx.db.messages.upsertByEntityId.mockRejectedValueOnce(
			new Error('db down'),
		);
		mockedMakeGmailRequest
			.mockResolvedValueOnce({
				history: [{ messagesAdded: [{ message: { id: 'm1' } }] }],
				historyId: '350',
			})
			.mockResolvedValueOnce(testMessage('m1'));

		const result = await messageChanged.handler(ctx, {
			payload: pubSubPayload({
				emailAddress: 'me@example.com',
				historyId: '300',
			}),
		} as any);

		expect(result.success).toBe(false);
		expect(ctx.keys.set_history_id).not.toHaveBeenCalled();
	});
});
