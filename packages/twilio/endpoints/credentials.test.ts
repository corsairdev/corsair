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

type EndpointCtx = Parameters<typeof Messages.send>[0];

function makeCtx(key: string): EndpointCtx {
	// Narrow stub: only the context fields the credential path touches.
	// The double assertion is confined to this test helper; every input
	// below is fully typed via the endpoint signatures.
	return {
		key,
		options: {},
		keys: {
			get_accountSid: jest.fn().mockResolvedValue(undefined),
		},
		db: {},
	} as unknown as EndpointCtx;
}

const COLON_KEY = 'AC123:my:secret:with:colons';

describe('twilio credential parsing (request level)', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockedRequest.mockResolvedValue({ sid: 'SM123' } as never);
	});

	it('passes the full colon-containing token for messages.send', async () => {
		const input: Parameters<typeof Messages.send>[1] = {
			To: '+1234567890',
			From: '+1098765432',
			Body: 'hi',
		};

		await Messages.send(makeCtx(COLON_KEY), input);

		expect(mockedRequest).toHaveBeenCalledWith(
			'Accounts/AC123/Messages.json',
			'AC123',
			'my:secret:with:colons',
			{ method: 'POST', body: input },
		);
	});

	it('passes the full colon-containing token for messages.get', async () => {
		const input: Parameters<typeof Messages.get>[1] = {
			messageSid: 'SM123',
		};

		await Messages.get(makeCtx(COLON_KEY), input);

		expect(mockedRequest).toHaveBeenCalledWith(
			'Accounts/AC123/Messages/SM123.json',
			'AC123',
			'my:secret:with:colons',
			{ method: 'GET' },
		);
	});

	it('passes the full colon-containing token for messages.list', async () => {
		const input: Parameters<typeof Messages.list>[1] = {};

		await Messages.list(makeCtx(COLON_KEY), input);

		expect(mockedRequest).toHaveBeenCalledWith(
			'Accounts/AC123/Messages.json',
			'AC123',
			'my:secret:with:colons',
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('passes the full colon-containing token for calls.create', async () => {
		const input: Parameters<typeof Calls.create>[1] = {
			To: '+1234567890',
			From: '+1098765432',
			Url: 'https://example.com/voice.xml',
		};

		await Calls.create(makeCtx(COLON_KEY), input);

		expect(mockedRequest).toHaveBeenCalledWith(
			'Accounts/AC123/Calls.json',
			'AC123',
			'my:secret:with:colons',
			{ method: 'POST', body: input },
		);
	});

	it('passes the full colon-containing token for calls.get', async () => {
		const input: Parameters<typeof Calls.get>[1] = {
			callSid: 'CA123',
		};

		await Calls.get(makeCtx(COLON_KEY), input);

		expect(mockedRequest).toHaveBeenCalledWith(
			'Accounts/AC123/Calls/CA123.json',
			'AC123',
			'my:secret:with:colons',
			{ method: 'GET' },
		);
	});

	it('passes the full colon-containing token for calls.list', async () => {
		const input: Parameters<typeof Calls.list>[1] = {};

		await Calls.list(makeCtx(COLON_KEY), input);

		expect(mockedRequest).toHaveBeenCalledWith(
			'Accounts/AC123/Calls.json',
			'AC123',
			'my:secret:with:colons',
			expect.objectContaining({ method: 'GET' }),
		);
	});
});
