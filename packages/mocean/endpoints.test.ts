import { logEventFromContext } from 'corsair/core';
import { Account, Lookup, Sms, Verify } from './endpoints';
import type { MoceanEndpointOutputSchemas as Outputs } from './endpoints/types';
import {
	balance,
	lookupAsync,
	lookupSync,
	messageStatus,
	pricing,
	smsPartiallyFailed,
	smsSent,
	verifyChecked,
	verifyRequested,
	verifyResent,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'token-123';

const ctx = { key: API_KEY, options: {}, keys: {} };

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type,
// so the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context only carries what the endpoints read (ctx.key).
	return endpoint(ctx as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		form: init.body ? new URLSearchParams(String(init.body)) : undefined,
	};
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('sms.send', () => {
	const baseInput = {
		mocean_from: 'MOC',
		mocean_to: '60123456789',
		mocean_text: 'Hello World',
	};

	it('POSTs the form with json format and returns per-receiver results', async () => {
		respond(smsSent, 202);

		const result = await invoke(Sms.send, baseInput);

		const sent = lastRequest();
		expect(sent).toMatchObject({
			origin: 'https://rest.moceanapi.com',
			method: 'POST',
			path: '/rest/2/sms',
		});
		expect(new Headers(sent.headers).get('authorization')).toBe(
			`Bearer ${API_KEY}`,
		);
		expect(sent.form?.get('mocean-from')).toBe('MOC');
		expect(sent.form?.get('mocean-to')).toBe('60123456789');
		expect(sent.form?.get('mocean-text')).toBe('Hello World');
		expect(sent.form?.get('mocean-resp-format')).toBe('json');
		expect(result).toEqual(smsSent);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'mocean.sms.send',
			{ receivers: 2, failed: 0 },
			'completed',
		);
	});

	it('counts a failed receiver without throwing', async () => {
		respond(smsPartiallyFailed, 202);

		const result = (await invoke(Sms.send, baseInput)) as ReturnType<
			typeof Outputs.smsSend.parse
		>;

		expect(result.messages[1]).toMatchObject({ status: 28 });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'mocean.sms.send',
			{ receivers: 2, failed: 1 },
			'completed',
		);
	});

	it('sends optional fields when given', async () => {
		respond(smsSent, 202);

		await invoke(Sms.send, {
			...baseInput,
			mocean_coding: 3,
			mocean_dlr_mask: 1,
			mocean_dlr_url: 'https://example.com/dlr',
			mocean_validity: 300,
		});

		expect(lastRequest().form?.get('mocean-coding')).toBe('3');
		expect(lastRequest().form?.get('mocean-dlr-mask')).toBe('1');
		expect(lastRequest().form?.get('mocean-dlr-url')).toBe(
			'https://example.com/dlr',
		);
	});

	it.each([
		[
			'a delivery-report request without a URL',
			{
				...baseInput,
				mocean_dlr_mask: 1,
			},
		],
		[
			'more than 500 receivers',
			{
				...baseInput,
				mocean_to: Array(501).fill('60123456789').join(','),
			},
		],
		['an out-of-range coding', { ...baseInput, mocean_coding: 7 }],
		['an empty text', { ...baseInput, mocean_text: '' }],
	])('rejects %s before sending', async (_name, input) => {
		await expect(invoke(Sms.send, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('sms.status', () => {
	it('GETs the report with the msgid', async () => {
		respond(messageStatus);

		const result = await invoke(Sms.status, {
			mocean_msgid: 'cust20013050311050614001',
		});

		expect(lastRequest()).toMatchObject({
			origin: 'https://rest.moceanapi.com',
			method: 'GET',
			path: '/rest/2/report/message',
			query: {
				'mocean-msgid': 'cust20013050311050614001',
				'mocean-resp-format': 'json',
			},
		});
		expect(result).toEqual(messageStatus);
	});

	it('requires the msgid', async () => {
		await expect(invoke(Sms.status, {})).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('account.balance', () => {
	it('GETs the balance', async () => {
		respond(balance);

		const result = await invoke(Account.balance, {});

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/rest/2/account/balance',
			query: { 'mocean-resp-format': 'json' },
		});
		expect(result).toEqual(balance);
	});
});

describe('account.pricing', () => {
	it('GETs pricing with the mcc/mnc and type filters', async () => {
		respond(pricing);

		const result = await invoke(Account.pricing, {
			mocean_mcc: '502',
			mocean_mnc: '13',
			mocean_type: 'sms',
		});

		expect(lastRequest().query).toEqual({
			'mocean-mcc': '502',
			'mocean-mnc': '13',
			'mocean-type': 'sms',
			'mocean-resp-format': 'json',
		});
		expect(result).toEqual(pricing);
	});

	it('rejects an mnc without an mcc and an unknown type', async () => {
		await expect(invoke(Account.pricing, { mocean_mnc: '13' })).rejects.toThrow(
			'mocean_mnc needs mocean_mcc',
		);
		await expect(
			invoke(Account.pricing, { mocean_type: 'voice' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('verify.request', () => {
	it('POSTs the verify request and returns the reqid', async () => {
		respond(verifyRequested);

		const result = await invoke(Verify.request, {
			mocean_to: '60123456789',
			mocean_brand: 'Acme',
			mocean_code_length: 6,
			mocean_pin_validity: 300,
		});

		const sent = lastRequest();
		expect(sent).toMatchObject({
			method: 'POST',
			path: '/rest/2/verify/req/sms',
		});
		expect(sent.form?.get('mocean-brand')).toBe('Acme');
		expect(sent.form?.get('mocean-code-length')).toBe('6');
		expect(result).toEqual(verifyRequested);
	});

	it.each([
		[
			'a code length the API does not offer',
			{
				mocean_to: '60123456789',
				mocean_brand: 'Acme',
				mocean_code_length: 5,
			},
		],
		[
			'a pin validity below 60 seconds',
			{
				mocean_to: '60123456789',
				mocean_brand: 'Acme',
				mocean_pin_validity: 30,
			},
		],
		[
			'a pin validity above 3600 seconds',
			{
				mocean_to: '60123456789',
				mocean_brand: 'Acme',
				mocean_pin_validity: 7200,
			},
		],
	])('rejects %s before sending', async (_name, input) => {
		await expect(invoke(Verify.request, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('verify.resend', () => {
	it('POSTs the reqid', async () => {
		respond(verifyResent);

		const result = await invoke(Verify.resend, {
			mocean_reqid: 'moceanq5672285037',
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/rest/2/verify/resend/sms',
		});
		expect(lastRequest().form?.get('mocean-reqid')).toBe('moceanq5672285037');
		expect(result).toEqual(verifyResent);
	});
});

describe('verify.check', () => {
	it('POSTs the reqid and the user code', async () => {
		respond(verifyChecked);

		const result = await invoke(Verify.check, {
			mocean_reqid: 'moceanq5672285037',
			mocean_code: '123456',
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/rest/2/verify/check',
		});
		expect(lastRequest().form?.get('mocean-code')).toBe('123456');
		expect(result).toEqual(verifyChecked);
	});
});

describe('lookup.request', () => {
	it('returns the synchronous carrier result', async () => {
		respond(lookupSync);

		const result = await invoke(Lookup.request, { mocean_to: '60123456789' });

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/rest/2/nl',
		});
		expect(lastRequest().form?.get('mocean-nl-url')).toBeNull();
		expect(result).toEqual(lookupSync);
	});

	it('keeps the async answer when a callback URL is given', async () => {
		respond(lookupAsync);

		const result = await invoke(Lookup.request, {
			mocean_to: '60123456789',
			mocean_nl_url: 'https://example.com/nl',
		});

		expect(lastRequest().form?.get('mocean-nl-url')).toBe(
			'https://example.com/nl',
		);
		expect(result).toEqual(lookupAsync);
	});
});
