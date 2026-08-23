import { createPublicKey, generateKeyPairSync, verify } from 'node:crypto';
import {
	authenticateZoominfo,
	buildZoominfoClientAssertion,
	isTokenUsable,
	ZoominfoAPIError,
} from './client';
import { selectZoominfoCredentials } from './index';

const NOW = 1_700_000_000_000;
const HOUR = 60 * 60 * 1000;

describe('token reuse', () => {
	// ZoomInfo asks callers to refresh at 55 minutes rather than mint a JWT per
	// request, so a token is treated as spent once it is within 5 of expiring.
	it('reuses a token that still has more than five minutes left', () => {
		expect(isTokenUsable('jwt', NOW + 6 * 60 * 1000, NOW)).toBe(true);
	});

	it('refreshes a token inside the last five minutes', () => {
		expect(isTokenUsable('jwt', NOW + 4 * 60 * 1000, NOW)).toBe(false);
	});

	it('refreshes an already expired token', () => {
		expect(isTokenUsable('jwt', NOW - 1, NOW)).toBe(false);
	});

	it('accepts the epoch millis it stored as a string', () => {
		expect(isTokenUsable('jwt', String(NOW + HOUR), NOW)).toBe(true);
	});

	it('refreshes when there is no token or no expiry', () => {
		expect(isTokenUsable(null, NOW + HOUR, NOW)).toBe(false);
		expect(isTokenUsable('jwt', null, NOW)).toBe(false);
		expect(isTokenUsable('jwt', 'not-a-number', NOW)).toBe(false);
	});
});

describe('credential selection', () => {
	const username = 'user@example.com';

	it('prefers PKI when a client id and private key are present', () => {
		expect(
			selectZoominfoCredentials({
				zoominfo_username: username,
				zoominfo_password: 'pw',
				zoominfo_client_id: 'client',
				zoominfo_private_key: 'key',
			}),
		).toEqual({
			kind: 'pki',
			username,
			clientId: 'client',
			privateKey: 'key',
		});
	});

	it('falls back to username and password', () => {
		expect(
			selectZoominfoCredentials({
				zoominfo_username: username,
				zoominfo_password: 'pw',
			}),
		).toEqual({ kind: 'basic', username, password: 'pw' });
	});

	it('returns null when a half-configured PKI pair has no password', () => {
		expect(
			selectZoominfoCredentials({
				zoominfo_username: username,
				zoominfo_client_id: 'client',
			}),
		).toBeNull();
	});

	it('returns null without a username', () => {
		expect(selectZoominfoCredentials({ zoominfo_password: 'pw' })).toBeNull();
	});
});

describe('PKI client assertion', () => {
	const { privateKey, publicKey } = generateKeyPairSync('rsa', {
		modulusLength: 2048,
		privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
		publicKeyEncoding: { type: 'spki', format: 'pem' },
	});

	const assertion = buildZoominfoClientAssertion({
		username: 'user@example.com',
		clientId: 'client-id',
		privateKey,
		now: NOW,
	});

	const segments = assertion.split('.');
	const [header = '', payload = '', signature = ''] = segments;
	const decode = (segment: string) =>
		JSON.parse(Buffer.from(segment, 'base64url').toString());

	it('is a three-segment JWT', () => {
		expect(segments).toHaveLength(3);
	});

	it('signs with RS256', () => {
		expect(decode(header)).toEqual({ typ: 'JWT', alg: 'RS256' });
	});

	it('carries the claims ZoomInfo expects', () => {
		expect(decode(payload)).toEqual({
			aud: 'enterprise_api',
			iss: 'zoominfo-api-auth-client-nodejs',
			username: 'user@example.com',
			client_id: 'client-id',
			iat: NOW / 1000 - 60,
			exp: NOW / 1000 + 5 * 60 - 60,
		});
	});

	it('produces a signature the matching public key verifies', () => {
		const verified = verify(
			'RSA-SHA256',
			Buffer.from(`${header}.${payload}`),
			createPublicKey(publicKey),
			Buffer.from(signature, 'base64url'),
		);

		expect(verified).toBe(true);
	});
});

describe('authenticate', () => {
	const fetchMock = jest.fn();
	const originalFetch = global.fetch;

	beforeAll(() => {
		global.fetch = fetchMock as unknown as typeof fetch;
	});
	afterAll(() => {
		global.fetch = originalFetch;
	});
	beforeEach(() => fetchMock.mockReset());

	const respond = (ok: boolean, body: string) =>
		fetchMock.mockResolvedValue({
			ok,
			statusText: 'Unauthorized',
			text: async () => body,
		});

	it('returns the jwt field and an expiry one hour out', async () => {
		respond(true, JSON.stringify({ jwt: 'the-token' }));

		const token = await authenticateZoominfo(
			{ kind: 'basic', username: 'u', password: 'p' },
			{ now: NOW },
		);

		expect(token).toEqual({ accessToken: 'the-token', expiresAt: NOW + HOUR });
	});

	it('sends the credentials as a json body', async () => {
		respond(true, JSON.stringify({ jwt: 'the-token' }));

		await authenticateZoominfo({
			kind: 'basic',
			username: 'u',
			password: 'p',
		});

		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe('https://api.zoominfo.com/authenticate');
		expect(JSON.parse(init.body)).toEqual({ username: 'u', password: 'p' });
	});

	it('presents the PKI assertion as a bearer token with an empty body', async () => {
		respond(true, JSON.stringify({ jwt: 'the-token' }));
		const { privateKey } = generateKeyPairSync('rsa', {
			modulusLength: 2048,
			privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
			publicKeyEncoding: { type: 'spki', format: 'pem' },
		});

		await authenticateZoominfo({
			kind: 'pki',
			username: 'u',
			clientId: 'c',
			privateKey,
		});

		const [, init] = fetchMock.mock.calls[0];
		expect(init.headers.Authorization).toMatch(
			/^Bearer [\w-]+\.[\w-]+\.[\w-]+$/,
		);
		expect(init.body).toBe('{}');
	});

	it('surfaces the server message when authentication is refused', async () => {
		respond(false, 'Invalid username and/or password - please try again.');

		await expect(
			authenticateZoominfo({ kind: 'basic', username: 'u', password: 'bad' }),
		).rejects.toThrow(/Invalid username and\/or password/);
	});

	it('rejects a 200 that carries no jwt', async () => {
		respond(true, JSON.stringify({ message: 'Authentication Failed' }));

		await expect(
			authenticateZoominfo({ kind: 'basic', username: 'u', password: 'p' }),
		).rejects.toThrow(ZoominfoAPIError);
	});
});

describe('trailing-slash trim', () => {
	const fetchMock = jest.fn();
	const originalFetch = global.fetch;

	beforeAll(() => {
		global.fetch = fetchMock as unknown as typeof fetch;
	});
	afterAll(() => {
		global.fetch = originalFetch;
	});

	it('strips trailing slashes without quadratic backtracking', async () => {
		fetchMock.mockReset().mockResolvedValue({
			ok: true,
			statusText: 'OK',
			text: async () => JSON.stringify({ jwt: 'the-token' }),
		});

		// The slow input for `/\/+$/` is a long run of slashes followed by a
		// non-slash: the engine consumes them all, fails `$`, then backs off one
		// at a time. A run that ends the string matches immediately and is fast,
		// so it would not exercise the bug at all.
		const baseUrl = `https://api.zoominfo.com${'/'.repeat(100_000)}x`;
		const started = Date.now();

		await authenticateZoominfo(
			{ kind: 'basic', username: 'u', password: 'p' },
			{ baseUrl },
		);

		expect(Date.now() - started).toBeLessThan(1000);
	});

	it('still trims the trailing slashes it is meant to trim', async () => {
		fetchMock.mockReset().mockResolvedValue({
			ok: true,
			statusText: 'OK',
			text: async () => JSON.stringify({ jwt: 'the-token' }),
		});

		await authenticateZoominfo(
			{ kind: 'basic', username: 'u', password: 'p' },
			{ baseUrl: 'https://api.zoominfo.com///' },
		);

		expect(fetchMock.mock.calls[0][0]).toBe(
			'https://api.zoominfo.com/authenticate',
		);
	});
});
