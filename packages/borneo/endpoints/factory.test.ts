import { logEventFromContext } from 'corsair/core';
import * as client from '../client';
import { createBorneoEndpoint } from './factory';

jest.mock('corsair/core', () => {
	const actual =
		jest.requireActual<typeof import('corsair/core')>('corsair/core');

	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(null),
	};
});

jest.mock('../client', () => ({
	executeBorneoTool: jest.fn(),
}));

const executeMock = client.executeBorneoTool as jest.MockedFunction<
	typeof client.executeBorneoTool
>;

const logEventMock = jest.mocked(logEventFromContext);

const ctx = {
	key: 'provider-key',
	options: {
		composioApiKey: 'composio-project-key',
		credentialHeaderName: 'X-Provider-Key',
	},
	db: {},
} as any;

const createNewAsset = createBorneoEndpoint(
	'createNewAsset',
	'BORNEO_CREATE_NEW_ASSET',
	'borneo.assets.createNewAsset',
);

const input = {
	name: 'CRM',
	type: 'applications',
} as const;

const expectedEvent = expect.objectContaining({
	provider: 'composio',
	tool: 'BORNEO_CREATE_NEW_ASSET',
});

describe('Borneo endpoint factory', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		executeMock.mockResolvedValue({
			successful: true,
			data: {},
		});
	});

	it('logs completed after a successful execution', async () => {
		await createNewAsset(ctx, input);

		expect(logEventMock).toHaveBeenCalledTimes(1);
		expect(logEventMock).toHaveBeenCalledWith(
			ctx,
			'borneo.assets.createNewAsset',
			expectedEvent,
			'completed',
		);
	});

	it('logs failed instead of completed when the execution throws', async () => {
		executeMock.mockRejectedValue(
			new Error('Borneo tool execution failed: Asset name already exists'),
		);

		await expect(createNewAsset(ctx, input)).rejects.toThrow(
			'Asset name already exists',
		);

		expect(logEventMock).toHaveBeenCalledWith(
			ctx,
			'borneo.assets.createNewAsset',
			expectedEvent,
			'failed',
		);

		expect(logEventMock).not.toHaveBeenCalledWith(
			ctx,
			'borneo.assets.createNewAsset',
			expectedEvent,
			'completed',
		);
	});

	it('keeps the completed status when output parsing fails after a successful execution', async () => {
		executeMock.mockResolvedValue({
			successful: false,
			error: 'Asset name already exists',
			data: null,
		});

		await expect(createNewAsset(ctx, input)).rejects.toThrow();

		expect(logEventMock).toHaveBeenCalledWith(
			ctx,
			'borneo.assets.createNewAsset',
			expectedEvent,
			'completed',
		);

		expect(logEventMock).not.toHaveBeenCalledWith(
			ctx,
			'borneo.assets.createNewAsset',
			expectedEvent,
			'failed',
		);
	});

	it('forwards the caller timeout to the transport', async () => {
		await createNewAsset(
			{ ...ctx, options: { ...ctx.options, timeoutMs: 5000 } },
			input,
		);

		expect(executeMock).toHaveBeenCalledWith(
			'BORNEO_CREATE_NEW_ASSET',
			input,
			expect.objectContaining({ timeoutMs: 5000 }),
		);
	});
});
