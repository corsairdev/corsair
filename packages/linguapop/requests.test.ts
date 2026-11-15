import { linguapop } from './index';
import {
	invitationRequestFixture,
	invitationResponseFixture,
	languagesFixture,
} from './test-fixtures';
import {
	blockFetch,
	jsonResponse,
	lastCall,
	makeContext,
} from './test-helpers';

const API_KEY = 'lp-secret-test-key';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = blockFetch();
});

afterEach(() => {
	fetchMock.mockRestore();
	jest.restoreAllMocks();
});

const plugin = linguapop({ key: API_KEY });
// `CorsairPlugin.endpoints` is optional on the type; this plugin always sets it.
const endpoints = plugin.endpoints as NonNullable<typeof plugin.endpoints>;

describe('languages.list request', () => {
	it('GETs /api/actions/getLanguages with no body and no key', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(languagesFixture));
		const ctx = makeContext(API_KEY);

		const result = await endpoints.languages.list(ctx, {});

		const call = lastCall(fetchMock);
		expect(call.method).toBe('GET');
		expect(call.url).toBe('https://app.linguapop.eu/api/actions/getLanguages');
		expect(call.parsed.search).toBe('');
		expect(call.rawBody).toBeUndefined();
		expect(call.headers.get('content-type')).toBeNull();
		expect(JSON.stringify([...call.headers.entries()])).not.toContain(API_KEY);
		expect(call.url).not.toContain(API_KEY);
		expect(result).toEqual(languagesFixture);
		expect(ctx.$getAccountId).toHaveBeenCalled();
	});
});

describe('invitations.create request', () => {
	it('POSTs JSON to /api/actions/sendInvitation with apiKey in the BODY', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(invitationResponseFixture));

		const result = await endpoints.invitations.create(
			makeContext(API_KEY),
			invitationRequestFixture,
		);

		const call = lastCall(fetchMock);
		expect(call.method).toBe('POST');
		expect(call.url).toBe(
			'https://app.linguapop.eu/api/actions/sendInvitation',
		);
		expect(call.headers.get('content-type')).toBe('application/json');
		// The one that matters: the key is a body field, never a header or query.
		expect(call.body).toEqual({ ...invitationRequestFixture, apiKey: API_KEY });
		expect(call.parsed.search).toBe('');
		expect(call.headers.get('authorization')).toBeNull();
		expect(call.headers.get('x-api-key')).toBeNull();
		expect(call.headers.get('apikey')).toBeNull();
		expect(JSON.stringify([...call.headers.entries()])).not.toContain(API_KEY);
		expect(call.url).not.toContain(API_KEY);
		expect(result.invitationId).toBe(1);
		expect(result.url).toBe(invitationResponseFixture.url);
	});

	it('sends only the fields the caller set, plus apiKey', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(invitationResponseFixture));

		await endpoints.invitations.create(makeContext(API_KEY), {
			email: 'candidate@example.com',
			languageCode: 'eng',
			sendEmail: false,
		});

		expect(lastCall(fetchMock).body).toEqual({
			email: 'candidate@example.com',
			languageCode: 'eng',
			sendEmail: false,
			apiKey: API_KEY,
		});
	});

	it('sends false flags rather than dropping them', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(invitationResponseFixture));

		await endpoints.invitations.create(makeContext(API_KEY), {
			email: 'candidate@example.com',
			languageCode: 'eng',
			sendEmail: false,
			testReading: false,
			testListening: false,
			generateKioskCode: false,
		});

		expect(lastCall(fetchMock).body).toMatchObject({
			sendEmail: false,
			testReading: false,
			testListening: false,
			generateKioskCode: false,
		});
	});

	it('rejects an apiKey in the input before any request, so it cannot override the account key', async () => {
		// Assigned first so the literal skips the excess-property check: apiKey
		// is not part of the input type, which is the point of the test.
		const withKey = { ...invitationRequestFixture, apiKey: 'attacker-key' };

		await expect(
			endpoints.invitations.create(makeContext(API_KEY), withKey),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
