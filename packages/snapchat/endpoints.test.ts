import * as core from 'corsair/core';
import * as client from './client';
import { Actions } from './endpoints';
import { SNAPCHAT_REQUIRED_INPUT_FIELDS } from './endpoints/types';
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

function buildValidInput(
	operationName: keyof typeof SNAPCHAT_REQUIRED_INPUT_FIELDS,
) {
	const requiredFields = SNAPCHAT_REQUIRED_INPUT_FIELDS[operationName];

	return Object.fromEntries(
		requiredFields.map((field) => [field, `${field}-value`]),
	);
}

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
			const input = buildValidInput(operation.name);
			await endpoint(ctx, input);

			expect(executeMock).toHaveBeenCalledWith(
				operation.id,
				input,
				expect.objectContaining({
					composioApiKey: 'composio-key',
					snapchatAccessToken: 'snap-token',
					connectedAccountId: 'acct_123',
				}),
			);
			expect(logEventMock).toHaveBeenCalledWith(
				ctx,
				`snapchat.actions.${operation.name}`,
				input,
				'completed',
			);
		});
	}

	it('rejects invalid input when required fields are missing', async () => {
		await expect(Actions.addSegmentUsers(ctx, {})).rejects.toThrow();
	});

	it('rejects invalid input when required field is explicitly undefined', async () => {
		await expect(
			Actions.addSegmentUsers(ctx, {
				users: undefined,
				segment_id: 'seg_1',
			} as never),
		).rejects.toThrow();
	});

	it('accepts response when envelope fields are absent', async () => {
		executeMock.mockResolvedValueOnce({ status: 'ok', custom: 123 });
		const result = await Actions.getAdAccount(ctx, { ad_account_id: 'acc_1' });
		expect(result).toEqual({ status: 'ok', custom: 123 });
	});
});
