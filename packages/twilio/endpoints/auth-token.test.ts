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

/**
 * Minimal endpoint context. The six endpoints under test only read ctx.key,
 * ctx.options, ctx.keys.get_accountSid, and ctx.db, so the stub provides
 * exactly those. The full endpoint context type additionally carries
 * database clients and key managers, hence the any below keeps this
 * token-focused test decoupled from unrelated infrastructure types.
 */
const ctx = {
	key: `AC123:${TOKEN_WITH_COLONS}`,
	options: {},
	keys: { get_accountSid: jest.fn().mockResolvedValue(null) },
	db: {},
} as any;

// Inputs carry only the fields each handler reads. Full zod-valid inputs
// would couple this token test to unrelated endpoint validation, hence any.
// Each case is an opaque invocation thunk: only the arguments it records
// on the mocked request matter, so the resolved payload stays unknown.
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
		// Outputs are irrelevant here: assertions target the request
		// arguments, so the mocked response is an empty payload cast onward.
		mockedRequest.mockResolvedValue({} as never);
	});

	it.each(cases)(
		'%s sends the full token when it contains colons',
		async (_, call) => {
			await call();

			expect(mockedRequest).toHaveBeenCalledTimes(1);
			const recorded = mockedRequest.mock.calls[0];
			if (!recorded) {
				throw new Error('expected makeTwilioRequest to be called once');
			}
			const [, accountSid, authToken] = recorded;
			expect(accountSid).toBe('AC123');
			expect(authToken).toBe(TOKEN_WITH_COLONS);
		},
	);
});
