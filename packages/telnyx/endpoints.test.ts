import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { telnyxErrorDetails } from './client';
import { Calls, Messages, MessagingProfiles, PhoneNumbers } from './endpoints';
import {
	availablePhoneNumbersList,
	callActionResult,
	callControlApplicationResponse,
	callControlApplicationsList,
	callResponse,
	insufficientBalanceResponse,
	messageResponse,
	messagingProfileResponse,
	messagingProfilesList,
	notFoundResponse,
	phoneNumberResponse,
	phoneNumbersList,
	unauthorizedResponse,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'telnyx-test-key';

// The fake context only carries what the endpoints read (ctx.key). Typing the
// endpoint generically keeps each call's own output type.
function invoke<E extends (ctx: never, input: never) => Promise<unknown>>(
	endpoint: E,
	// unknown: negative cases pass values no schema accepts.
	input: unknown,
): ReturnType<E> {
	return endpoint({ key: API_KEY } as never, input as never) as ReturnType<E>;
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
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.telnyx.com');
	// Telnyx reads the key from a bearer header.
	expect(sent.headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
}

/**
 * Resolves to the rejection reason, narrowed to core's ApiError.
 * A promise can reject with any value, so this is the one place the reason is
 * treated as untyped before it is narrowed.
 */
async function rejection(promise: Promise<unknown>): Promise<ApiError> {
	const caught = await promise.then(
		() => undefined,
		// unknown: a rejection reason has no static type.
		(caught: unknown) => caught,
	);
	expect(caught).toBeInstanceOf(ApiError);
	return caught as ApiError;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('messages.send', () => {
	it('POSTs /v2/messages and parses the data envelope', async () => {
		respond(messageResponse);

		const result = await invoke(Messages.messagesSend, {
			to: '+13125550002',
			from: '+13125550001',
			text: 'Hello from Telnyx',
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/v2/messages',
			method: 'POST',
		});
		expect(lastRequest().body).toEqual({
			to: '+13125550002',
			from: '+13125550001',
			text: 'Hello from Telnyx',
		});
		expect(result.data.id).toBe('40385f64-5717-4562-b3fc-2c963f66afa6');
		expect(result.data.parts).toBe(1);
	});

	it('sends media URLs for an MMS', async () => {
		respond(messageResponse);

		await invoke(Messages.messagesSend, {
			to: '+13125550002',
			from: '+13125550001',
			text: 'See attached',
			media_urls: ['https://example.com/a.png'],
			type: 'MMS',
		});

		expect(lastRequest().body).toMatchObject({
			media_urls: ['https://example.com/a.png'],
			type: 'MMS',
		});
	});

	it('rejects a message with neither text nor media', async () => {
		await expect(
			invoke(Messages.messagesSend, {
				to: '+13125550002',
				from: '+13125550001',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a message with no destination', async () => {
		await expect(
			invoke(Messages.messagesSend, {
				from: '+13125550001',
				text: 'Hello',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('accepts a send with a profile and no from, since the pool picks the sender', async () => {
		respond(messageResponse);

		await invoke(Messages.messagesSend, {
			to: '+13125550002',
			text: 'Hello',
			messaging_profile_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
		});

		expect(lastRequest().body).toMatchObject({
			to: '+13125550002',
			messaging_profile_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
		});
	});

	it('rejects a message with neither from nor a messaging profile', async () => {
		await expect(
			invoke(Messages.messagesSend, {
				to: '+13125550002',
				text: 'Hello',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('messages.get and messages.delete', () => {
	it('GETs one message by id', async () => {
		respond(messageResponse);

		const result = await invoke(Messages.messagesGet, {
			messageId: '40385f64-5717-4562-b3fc-2c963f66afa6',
		});

		expect(lastRequest()).toMatchObject({
			path: '/v2/messages/40385f64-5717-4562-b3fc-2c963f66afa6',
			method: 'GET',
		});
		expect(result.data.direction).toBe('outbound');
	});

	it('DELETEs a message and parses the removed record', async () => {
		respond(messageResponse);

		const result = await invoke(Messages.messagesRemove, {
			messageId: '40385f64-5717-4562-b3fc-2c963f66afa6',
		});

		expect(lastRequest()).toMatchObject({ method: 'DELETE' });
		expect(result.data.text).toBe('Hello from Telnyx');
	});
});

describe('messagingProfiles', () => {
	it('lists profiles with bracketed paging keys', async () => {
		respond(messagingProfilesList);

		const result = await invoke(MessagingProfiles.list, {
			pageNumber: 1,
			pageSize: 20,
		});

		expect(lastRequest()).toMatchObject({
			path: '/v2/messaging_profiles',
			method: 'GET',
		});
		// Telnyx pages with page[size] and page[number].
		expect(lastRequest().query).toEqual({
			'page[number]': '1',
			'page[size]': '20',
		});
		expect(result.data).toHaveLength(1);
		expect(result.meta?.total_results).toBe(30);
	});

	it('gets, creates, updates and deletes a profile', async () => {
		respond(messagingProfileResponse);
		await invoke(MessagingProfiles.get, {
			profileId: messagingProfileResponse.data.id,
		});
		expect(lastRequest().path).toBe(
			'/v2/messaging_profiles/3fa85f64-5717-4562-b3fc-2c963f66afa6',
		);

		respond(messagingProfileResponse);
		await invoke(MessagingProfiles.create, {
			name: 'Primary profile',
			webhook_url: 'https://example.com/webhooks/telnyx',
		});
		expect(lastRequest()).toMatchObject({
			path: '/v2/messaging_profiles',
			method: 'POST',
		});

		respond(messagingProfileResponse);
		await invoke(MessagingProfiles.update, {
			profileId: messagingProfileResponse.data.id,
			name: 'Renamed profile',
		});
		expect(lastRequest()).toMatchObject({ method: 'PATCH' });
		expect(lastRequest().body).toEqual({ name: 'Renamed profile' });

		respond(messagingProfileResponse);
		await invoke(MessagingProfiles.remove, {
			profileId: messagingProfileResponse.data.id,
		});
		expect(lastRequest()).toMatchObject({ method: 'DELETE' });
	});

	it('rejects a profile with no name', async () => {
		await expect(invoke(MessagingProfiles.create, {})).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('phoneNumbers', () => {
	it('lists numbers with paging and sort', async () => {
		respond(phoneNumbersList);

		const result = await invoke(PhoneNumbers.list, {
			pageSize: 25,
			sort: 'purchased_at',
		});

		expect(lastRequest()).toMatchObject({
			path: '/v2/phone_numbers',
			method: 'GET',
		});
		expect(lastRequest().query).toEqual({
			'page[size]': '25',
			sort: 'purchased_at',
		});
		expect(result.data[0]?.phone_number).toBe('+13125550001');
	});

	it('gets and updates a number', async () => {
		respond(phoneNumberResponse);
		await invoke(PhoneNumbers.get, { phoneNumberId: '1293384261075731499' });
		expect(lastRequest().path).toBe('/v2/phone_numbers/1293384261075731499');

		respond(phoneNumberResponse);
		await invoke(PhoneNumbers.update, {
			phoneNumberId: '1293384261075731499',
			messaging_profile_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
		});
		expect(lastRequest()).toMatchObject({ method: 'PATCH' });
		expect(lastRequest().body).toEqual({
			messaging_profile_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
		});
	});

	it('rejects an update that changes nothing', async () => {
		await expect(
			invoke(PhoneNumbers.update, { phoneNumberId: '123' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('deletes a number', async () => {
		respond(phoneNumberResponse);

		await invoke(PhoneNumbers.remove, { phoneNumberId: '1293384261075731499' });

		expect(lastRequest()).toMatchObject({ method: 'DELETE' });
	});
});

describe('availablePhoneNumbers.list', () => {
	it('sends every filter under the filter[..] prefix, limit included', async () => {
		respond(availablePhoneNumbersList);

		const result = await invoke(PhoneNumbers.availableList, {
			countryCode: 'US',
			locality: 'Chicago',
			administrativeArea: 'IL',
			nationalDestinationCode: '312',
			phoneNumberType: 'local',
			limit: 10,
		});

		expect(lastRequest()).toMatchObject({
			path: '/v2/available_phone_numbers',
			method: 'GET',
		});
		expect(lastRequest().query).toEqual({
			'filter[country_code]': 'US',
			'filter[locality]': 'Chicago',
			'filter[administrative_area]': 'IL',
			'filter[national_destination_code]': '312',
			'filter[phone_number_type]': 'local',
			'filter[limit]': '10',
		});
		expect(result.data[0]?.cost_information?.monthly_cost).toBe('1.00');
	});

	it('rejects a country code that is not two letters', async () => {
		await expect(
			invoke(PhoneNumbers.availableList, { countryCode: 'USA' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an unknown number type', async () => {
		await expect(
			invoke(PhoneNumbers.availableList, {
				countryCode: 'US',
				phoneNumberType: 'pager',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('calls', () => {
	it('POSTs /v2/calls with the connection, from and to', async () => {
		respond(callResponse);

		const result = await invoke(Calls.callsCreate, {
			connection_id: '1293384261075731500',
			to: '+13125550002',
			from: '+13125550001',
		});

		expect(lastRequest()).toMatchObject({
			path: '/v2/calls',
			method: 'POST',
		});
		expect(lastRequest().body).toEqual({
			connection_id: '1293384261075731500',
			to: '+13125550002',
			from: '+13125550001',
		});
		expect(result.data.call_control_id).toBe('v3:abc123');
	});

	it('rejects a call with no connection', async () => {
		await expect(
			invoke(Calls.callsCreate, {
				to: '+13125550002',
				from: '+13125550001',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('gets a call, hangs it up and speaks on it', async () => {
		respond(callResponse);
		await invoke(Calls.callsGet, { callControlId: 'v3:abc123' });
		expect(lastRequest().path).toBe('/v2/calls/v3:abc123');

		respond(callActionResult);
		const hungUp = await invoke(Calls.callsHangup, {
			callControlId: 'v3:abc123',
		});
		expect(lastRequest()).toMatchObject({
			path: '/v2/calls/v3:abc123/actions/hangup',
			method: 'POST',
		});
		expect(hungUp.data?.result).toBe('ok');

		respond(callActionResult);
		await invoke(Calls.callsSpeak, {
			callControlId: 'v3:abc123',
			payload: 'Hello, this is a test',
			voice: 'female',
			language: 'en-US',
		});
		expect(lastRequest()).toMatchObject({
			path: '/v2/calls/v3:abc123/actions/speak',
			method: 'POST',
		});
		// The call id belongs in the path, not the body.
		expect(lastRequest().body).toEqual({
			payload: 'Hello, this is a test',
			voice: 'female',
			language: 'en-US',
		});
	});

	it('rejects a speak with an empty payload', async () => {
		await expect(
			invoke(Calls.callsSpeak, { callControlId: 'v3:abc123', payload: '' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('callControlApplications', () => {
	it('lists applications with paging', async () => {
		respond(callControlApplicationsList);

		const result = await invoke(Calls.applicationsList, {
			pageNumber: 2,
			pageSize: 10,
		});

		expect(lastRequest()).toMatchObject({
			path: '/v2/call_control_applications',
			method: 'GET',
		});
		expect(lastRequest().query).toEqual({
			'page[number]': '2',
			'page[size]': '10',
		});
		expect(result.data[0]?.application_name).toBe('Voice app');
	});

	it('creates an application with its webhook URL', async () => {
		respond(callControlApplicationResponse);

		await invoke(Calls.applicationsCreate, {
			application_name: 'Voice app',
			webhook_event_url: 'https://example.com/webhooks/calls',
		});

		expect(lastRequest()).toMatchObject({
			path: '/v2/call_control_applications',
			method: 'POST',
		});
		expect(lastRequest().body).toEqual({
			application_name: 'Voice app',
			webhook_event_url: 'https://example.com/webhooks/calls',
		});
	});

	it('rejects an application with no webhook URL', async () => {
		await expect(
			invoke(Calls.applicationsCreate, { application_name: 'Voice app' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('gets, updates and deletes an application', async () => {
		respond(callControlApplicationResponse);
		await invoke(Calls.applicationsGet, {
			applicationId: '1293384261075731500',
		});
		expect(lastRequest().path).toBe(
			'/v2/call_control_applications/1293384261075731500',
		);

		respond(callControlApplicationResponse);
		await invoke(Calls.applicationsUpdate, {
			applicationId: '1293384261075731500',
			active: false,
		});
		expect(lastRequest().body).toEqual({ active: false });

		respond(callControlApplicationResponse);
		await invoke(Calls.applicationsRemove, {
			applicationId: '1293384261075731500',
		});
		expect(lastRequest()).toMatchObject({ method: 'DELETE' });
	});
});

describe('path IDs', () => {
	it('encodes an ID into a single path segment', async () => {
		respond(phoneNumberResponse);

		await invoke(PhoneNumbers.get, {
			phoneNumberId: '../call_control_applications/1293384261075731499',
		});

		expect(lastRequest().path).toBe(
			'/v2/phone_numbers/..%2Fcall_control_applications%2F1293384261075731499',
		);
	});

	it('refuses a dot-only ID before any request', async () => {
		for (const phoneNumberId of ['.', '..']) {
			await expect(
				invoke(PhoneNumbers.remove, { phoneNumberId }),
			).rejects.toThrow();
		}
		await expect(
			invoke(Calls.applicationsRemove, { applicationId: '..' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('error handling', () => {
	it('parses the errors array for a refused key', async () => {
		respond(unauthorizedResponse, 401);

		const error = await rejection(
			invoke(Messages.messagesGet, { messageId: 'x' }),
		);

		expect(error.status).toBe(401);
		expect(telnyxErrorDetails(error)?.errors[0]?.code).toBe('10009');
		expect(telnyxErrorDetails(error)?.errors[0]?.title).toContain(
			'Authentication failed',
		);
	});

	it('keeps every error entry', async () => {
		respond(
			{
				errors: [
					{ code: '10005', title: 'First', detail: 'a' },
					{ code: '10006', title: 'Second', detail: 'b' },
				],
			},
			422,
		);

		const error = await rejection(
			invoke(Messages.messagesGet, { messageId: 'x' }),
		);

		expect(telnyxErrorDetails(error)?.errors).toHaveLength(2);
		expect(telnyxErrorDetails(error)?.errors[1]?.title).toBe('Second');
	});

	it('reads the insufficient-funds code', async () => {
		respond(insufficientBalanceResponse, 403);

		const error = await rejection(
			invoke(Messages.messagesSend, {
				to: '+13125550002',
				from: '+13125550001',
				text: 'Hi',
			}),
		);

		expect(telnyxErrorDetails(error)?.errors[0]?.code).toBe('20100');
		// The phone numbers and text in the send body stay off the error.
		expect(error.request.body).toBeUndefined();
		expect(JSON.stringify(error)).not.toContain('+13125550002');
	});

	it('parses a 404 for an unknown resource', async () => {
		respond(notFoundResponse, 404);

		const error = await rejection(
			invoke(Messages.messagesGet, { messageId: 'x' }),
		);

		expect(error.status).toBe(404);
		expect(telnyxErrorDetails(error)?.errors[0]?.code).toBe('10005');
	});

	it('never leaks the key through the error', async () => {
		respond(unauthorizedResponse, 401);

		const error = await rejection(
			invoke(Messages.messagesGet, { messageId: 'x' }),
		);

		expect(error.message).not.toContain(API_KEY);
		expect(JSON.stringify(error)).not.toContain(API_KEY);
		expect(require('node:util').inspect(error)).not.toContain(API_KEY);
	});

	it('fails loudly when the data key is missing', async () => {
		respond({ record: { id: 'x' } });

		await expect(
			invoke(Messages.messagesGet, { messageId: 'x' }),
		).rejects.toThrow();
	});
});

describe('logging', () => {
	it('logs the operation without the input', async () => {
		respond(messageResponse);

		await invoke(Messages.messagesGet, { messageId: 'x' });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'telnyx.messages.get',
			{},
			'completed',
		);
	});
});
