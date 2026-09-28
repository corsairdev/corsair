import * as client from '../client';
import { Calls, Messages } from './index';

jest.mock('corsair/core', () => {
	const actual =
		jest.requireActual<typeof import('corsair/core')>('corsair/core');

	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(null),
	};
});

jest.mock('../client', () => ({
	...jest.requireActual<typeof import('../client')>('../client'),
	makeTwilioRequest: jest.fn(),
}));

const mockedRequest = client.makeTwilioRequest as jest.MockedFunction<
	typeof client.makeTwilioRequest
>;

const TOKEN_WITH_COLONS = 'tok:en:123';

const ctx = {
	key: `AC123:${TOKEN_WITH_COLONS}`,
	options: {},
	keys: { get_accountSid: jest.fn().mockResolvedValue(null) },
	db: {},
} as any;

const cases: [string, () => Promise<unknown>][] = [
	[
		'messages.send',
		() => Messages.send(ctx, { To: '+1', From: '+2', Body: 'hi' } as any),
	],
	['messages.get', () => Messages.get(ctx, { messageSid: 'SM1' } as any)],
	['messages.list', () => Messages.list(ctx, {} as any)],
	['calls.create', () => Calls.create(ctx, { To: '+1', From: '+2' } as any)],
	['calls.get', () => Calls.get(ctx, { callSid: 'CA1' } as any)],
	['calls.list', () => Calls.list(ctx, {} as any)],
];

describe('Twilio endpoints auth token', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockedRequest.mockResolvedValue({} as never);
	});

	it.each(cases)(
		'%s sends the full token when it contains colons',
		async (_, call) => {
			await call();

			expect(mockedRequest).toHaveBeenCalledTimes(1);
			const [, accountSid, authToken] = mockedRequest.mock.calls[0]!;
			expect(accountSid).toBe('AC123');
			expect(authToken).toBe(TOKEN_WITH_COLONS);
		},
	);
});
