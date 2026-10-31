import { AuthMissingError } from 'corsair/core';
import { basicToken, isWholeCredential, makeDataForSeoRequest } from './client';
import { dataforseo } from './index';
import { envelope, results } from './test-samples';

const LOGIN = 'seo@example.com';
const PASSWORD = 'p4ss:w0rd';
const WHOLE = `${LOGIN}:${PASSWORD}`;
const ENCODED = Buffer.from(WHOLE).toString('base64');

type KeyBuilder = (ctx: unknown, source: string) => Promise<string>;

function keyBuilder(): KeyBuilder {
	const plugin = dataforseo();
	if (typeof plugin.keyBuilder !== 'function') {
		throw new Error('keyBuilder is not registered');
	}
	return plugin.keyBuilder as KeyBuilder;
}

function stored(apiKey: string | null, apiSecret: string | null) {
	return {
		authType: 'api_key',
		keys: {
			get_api_key: async () => apiKey,
			get_api_secret: async () => apiSecret,
		},
	};
}

describe('keyBuilder', () => {
	it('packs a login and password stored in their own fields', async () => {
		await expect(
			keyBuilder()(stored(LOGIN, PASSWORD), 'endpoint'),
		).resolves.toBe(WHOLE);
	});

	it('takes login:password from the key field when no password is stored', async () => {
		await expect(keyBuilder()(stored(WHOLE, null), 'endpoint')).resolves.toBe(
			WHOLE,
		);
	});

	it("takes the dashboard's base64 credential from the key field", async () => {
		await expect(keyBuilder()(stored(ENCODED, null), 'endpoint')).resolves.toBe(
			ENCODED,
		);
	});

	it.each([
		['a login with no password', LOGIN],
		['an empty login', `:${PASSWORD}`],
		['an empty password', `${LOGIN}:`],
	])('refuses %s', async (_name, apiKey) => {
		await expect(
			keyBuilder()(stored(apiKey, null), 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('refuses when nothing is stored', async () => {
		await expect(
			keyBuilder()(stored(null, null), 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});

describe('basicToken', () => {
	it('encodes login:password', () => {
		expect(basicToken(WHOLE)).toBe(ENCODED);
	});

	it('sends an already-encoded credential as it is', () => {
		expect(basicToken(ENCODED)).toBe(ENCODED);
	});

	it('encodes a word that only looks like base64', () => {
		// "abcd" decodes to bytes that are not "login:password".
		expect(basicToken('abcd')).toBe(Buffer.from('abcd').toString('base64'));
		expect(isWholeCredential('abcd')).toBe(false);
	});
});

describe('Authorization header', () => {
	const fetchMock = jest.fn<Promise<Response>, [string, RequestInit]>();

	beforeAll(() => {
		// unknown: the jest mock lacks fetch's static members, so it needs a two-step cast.
		global.fetch = fetchMock as unknown as typeof fetch;
	});

	beforeEach(() => {
		fetchMock.mockReset();
		fetchMock.mockImplementation(
			async () =>
				new Response(
					JSON.stringify(
						envelope('/v3/appendix/user_data', [results.accountUserData], 0),
					),
					{ status: 200, headers: { 'Content-Type': 'application/json' } },
				),
		);
	});

	it.each([
		['login:password', WHOLE],
		['the base64 credential', ENCODED],
	])('is Basic <base64 of login:password> for %s', async (_name, key) => {
		await makeDataForSeoRequest('/v3/appendix/user_data', key);

		const [, init] = fetchMock.mock.calls[0]!;
		expect(new Headers(init.headers).get('Authorization')).toBe(
			`Basic ${ENCODED}`,
		);
	});
});
