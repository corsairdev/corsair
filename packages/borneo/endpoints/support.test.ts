import * as client from '../client';
import { Support } from './index';

jest.mock('corsair/core', () => {
	const actual =
		jest.requireActual<typeof import('corsair/core')>('corsair/core');

	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(null),
	};
});

jest.mock('../client', () => ({
	makeBorneoRequest: jest.fn(),
}));

const mockedRequest = client.makeBorneoRequest as jest.MockedFunction<
	typeof client.makeBorneoRequest
>;

const ctx = {
	key: 'test-key',
	options: { baseUrl: 'https://dashboard.example.test' },
	db: {},
} as any;

describe('Borneo support endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockedRequest.mockResolvedValue({ answer: 'ok' });
	});

	it('posts a support chat query', async () => {
		await Support.postSupportChatQuery(ctx, {
			query: 'How do I review a scan?',
		});

		expect(mockedRequest).toHaveBeenCalledWith('/support/chat', ctx.key, {
			method: 'POST',
			body: { query: 'How do I review a scan?' },
			baseUrl: ctx.options.baseUrl,
		});
	});

	it('rejects an empty support query', async () => {
		await expect(
			Support.postSupportChatQuery(ctx, { query: '' }),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});
