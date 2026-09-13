import * as core from 'corsair/core';
import * as client from './client';
import { Actions } from './endpoints';
import type { SnapchatContext } from './index';
import { SNAPCHAT_OPERATIONS } from './operations';

jest.mock('./client', () => ({
	executeSnapchatTool: jest.fn(),
}));

jest.mock('corsair/core', () => {
	const actual =
		jest.requireActual<typeof import('corsair/core')>('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(null),
	};
});

const executeMock = client.executeSnapchatTool as jest.MockedFunction<
	typeof client.executeSnapchatTool
>;

const logEventMock = core.logEventFromContext as jest.MockedFunction<
	typeof core.logEventFromContext
>;

const ctx = {
	key: 'snap-token',
	options: {
		composioApiKey: 'composio-key',
		connectedAccountId: 'acct_123',
	},
} as SnapchatContext;

describe('Snapchat actions endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		executeMock.mockResolvedValue({ successful: true, data: { ok: true } });
	});

	it('exposes full operation surface', () => {
		expect(Object.keys(Actions)).toHaveLength(139);
	});

	for (const operation of SNAPCHAT_OPERATIONS) {
		it(`executes ${operation.id}`, async () => {
			const endpoint = Actions[operation.name];
			await endpoint(ctx, {});

			expect(executeMock).toHaveBeenCalledWith(
				operation.id,
				{},
				expect.objectContaining({
					composioApiKey: 'composio-key',
					snapchatAccessToken: 'snap-token',
					connectedAccountId: 'acct_123',
				}),
			);
			expect(logEventMock).toHaveBeenCalledWith(
				ctx,
				`snapchat.actions.${operation.name}`,
				{},
				'completed',
			);
		});
	}
});
