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

jest.mock('../client', () => {
	const actual = jest.requireActual<typeof import('../client')>('../client');

	return {
		...actual,
		makeTwilioRequest: jest.fn(),
	};
});

const mockedRequest = client.makeTwilioRequest as jest.MockedFunction<
	typeof client.makeTwilioRequest
>;

function makeCtx(key: string) {
	return {
		key,
		options: {},
		keys: {
			get_accountSid: jest.fn().mockResolvedValue(undefined),
		},
		db: {},
	} as any;
}

describe('twilio credential parsing (request level)', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockedRequest.mockResolvedValue({ sid: 'SM123' } as never);
	});

	it('passes the full colon-containing token for messages.send', async () => {
		const input = { To: '+1234567890', From: '+1098765432', Body: 'hi' };

		await Messages.send(makeCtx('AC123:my:secret:with:colons'), input as any);

		expect(mockedRequest).toHaveBeenCalledWith(
			'Accounts/AC123/Messages.json',
			'AC123',
			'my:secret:with:colons',
			{ method: 'POST', body: input },
		);
	});

	it('passes the full colon-containing token for calls.create', async () => {
		const input = {
			To: '+1234567890',
			From: '+1098765432',
			Url: 'https://example.com/voice.xml',
		};

		await Calls.create(makeCtx('AC123:part1:part2'), input as any);

		expect(mockedRequest).toHaveBeenCalledWith(
			'Accounts/AC123/Calls.json',
			'AC123',
			'part1:part2',
			{ method: 'POST', body: input },
		);
	});
});
