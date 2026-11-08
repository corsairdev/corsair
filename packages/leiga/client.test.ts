import {
	clearLeigaTokenCache,
	LeigaAPIError,
	requestLeigaToken,
	resolveLeigaToken,
	unwrapEnvelope,
} from './client';
import { authErrorResponse, tokenResponse } from './test-fixtures';
import {
	installFetchMock,
	jsonResponse,
	mockFetch,
	restoreFetchMock,
} from './test-helpers';

beforeEach(() => {
	installFetchMock();
	clearLeigaTokenCache();
});
afterEach(restoreFetchMock);

describe('Leiga envelope', () => {
	it('returns data on code "0"', () => {
		expect(unwrapEnvelope({ code: '0', data: { id: 7 } }, 'op')).toEqual({
			id: 7,
		});
	});

	it('accepts a numeric 0 as success too', () => {
		// Leiga sends a string, but a number is the same meaning.
		expect(unwrapEnvelope({ code: 0, data: [1] }, 'op')).toEqual([1]);
	});

	it('throws with the code and message on a non-zero code', () => {
		try {
			unwrapEnvelope(authErrorResponse, 'projects.list');
			throw new Error('expected a throw');
		} catch (error) {
			expect(error).toBeInstanceOf(LeigaAPIError);
			const apiError = error as LeigaAPIError;
			expect(apiError.code).toBe('15');
			expect(apiError.message).toContain('accessToken error');
			expect(apiError.message).toContain('projects.list');
		}
	});

	it('throws when the body has no code', () => {
		expect(() => unwrapEnvelope({ data: [] }, 'op')).toThrow(/no code/);
	});

	it('throws when the body is not an object', () => {
		expect(() => unwrapEnvelope('plain text', 'op')).toThrow(/non-object/);
	});

	it('treats code 15 and 18 as auth errors', () => {
		expect(new LeigaAPIError('x', { code: '15' }).isAuthError).toBe(true);
		expect(new LeigaAPIError('x', { code: '18' }).isAuthError).toBe(true);
		// 5 is "object not exist", which is not an auth problem.
		expect(new LeigaAPIError('x', { code: '5' }).isAuthError).toBe(false);
	});
});

describe('Leiga token exchange', () => {
	it('exchanges the client pair and reads expireIn in seconds', async () => {
		mockFetch(jsonResponse(tokenResponse));

		const token = await requestLeigaToken('cid', 'secret', 1_000);

		expect(token.accessToken).toBe('test-access-token');
		// 604800 seconds is 7 days, which is what the live API answers.
		expect(token.expiresAt).toBe(1_000 + 604_800_000);
	});

	it('posts the pair as clientId and secretKey', async () => {
		mockFetch(jsonResponse(tokenResponse));

		await requestLeigaToken('cid', 'secret');

		const [url, init] = jest.mocked(globalThis.fetch).mock.calls[0]!;
		expect(String(url)).toBe(
			'https://app.leiga.com/openapi/api/authorize/access-token',
		);
		expect(JSON.parse(String(init?.body))).toEqual({
			clientId: 'cid',
			secretKey: 'secret',
		});
	});

	it('throws on code 18 rather than returning an empty token', async () => {
		mockFetch(jsonResponse({ msg: 'client_id error', code: '18' }));

		await expect(requestLeigaToken('bad', 'bad')).rejects.toThrow(
			/client_id error/,
		);
	});

	it('throws when the envelope carries no accessToken', async () => {
		mockFetch(jsonResponse({ code: '0', data: { expireIn: 604800 } }));

		await expect(requestLeigaToken('cid', 'secret')).rejects.toThrow(
			/no accessToken/,
		);
	});

	it('reuses a cached token instead of exchanging twice', async () => {
		mockFetch(jsonResponse(tokenResponse));

		const first = await resolveLeigaToken('cid', 'secret', 1_000);
		const second = await resolveLeigaToken('cid', 'secret', 1_100);

		expect(second).toBe(first);
		expect(jest.mocked(globalThis.fetch)).toHaveBeenCalledTimes(1);
	});

	it('re-exchanges once the token is inside the expiry skew', async () => {
		mockFetch(jsonResponse(tokenResponse));
		mockFetch(
			jsonResponse({
				code: '0',
				data: { expireIn: 604800, accessToken: 'second-token' },
			}),
		);

		await resolveLeigaToken('cid', 'secret', 1_000);
		// 30 seconds before expiry: inside the 60 second skew.
		const later = await resolveLeigaToken(
			'cid',
			'secret',
			1_000 + 604_800_000 - 30_000,
		);

		expect(later).toBe('second-token');
		expect(jest.mocked(globalThis.fetch)).toHaveBeenCalledTimes(2);
	});

	it('keys the cache by credentials, so another pair exchanges', async () => {
		mockFetch(jsonResponse(tokenResponse));
		mockFetch(
			jsonResponse({
				code: '0',
				data: { expireIn: 604800, accessToken: 'other-token' },
			}),
		);

		await resolveLeigaToken('cid', 'secret', 1_000);
		const other = await resolveLeigaToken('other', 'secret', 1_100);

		expect(other).toBe('other-token');
	});
});
