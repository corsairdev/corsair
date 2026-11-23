import type { EventEmitter } from 'node:events';

const mockSent: { body: string; headers: Record<string, string> }[] = [];
jest.mock('node:https', () => ({
	request: (
		options: { headers: Record<string, string> },
		onResponse: (res: EventEmitter & { statusCode: number }) => void,
	) => {
		const { EventEmitter: Emitter } =
			jest.requireActual<typeof import('node:events')>('node:events');
		let body = '';
		const req = Object.assign(new Emitter(), {
			write: (chunk: string) => {
				body += chunk;
			},
			setTimeout: () => req,
			destroy: () => {},
			end: () => {
				mockSent.push({ body, headers: options.headers });
				const res = Object.assign(new Emitter(), { statusCode: 200 });
				onResponse(res);
				res.emit('data', JSON.stringify({ access_token: 'AT' }));
				res.emit('end');
			},
		});
		return req;
	},
}));

import { exchangeCodeForTokens } from '../core/auth/exchange';
import type { OAuthConfig } from '../core/plugins';
import { buildOAuthAuthorizeUrl } from '../oauth/authorize-url';
import {
	localPkceVerifier,
	pkceAuthParams,
	pkceChallenge,
	pkceVerifier,
} from '../oauth/pkce';

const canva = {
	providerName: 'Canva',
	authUrl: 'https://www.canva.com/api/oauth/authorize',
	tokenUrl: 'https://api.canva.com/rest/v1/oauth/token',
	scopes: ['design:meta:read'],
	tokenAuthMethod: 'basic',
	pkce: true,
	authParams: { code_challenge_method: 's256' },
} satisfies OAuthConfig;

describe('PKCE helpers', () => {
	it("matches RFC 7636's S256 example", () => {
		expect(pkceChallenge('dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk')).toBe(
			'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM',
		);
	});

	it('makes the same verifier from the same seed, and only with the KEK', () => {
		const v = pkceVerifier('state-1', 'kek');
		expect(v).toBe(pkceVerifier('state-1', 'kek'));
		expect(v).not.toBe(pkceVerifier('state-2', 'kek'));
		expect(v).not.toBe(pkceVerifier('state-1', 'other-kek'));
		expect(v).toMatch(/^[A-Za-z0-9\-._~]{43,128}$/);
		expect(localPkceVerifier('canva', 'default', 'kek')).toBe(
			pkceVerifier('local:canva:default', 'kek'),
		);
	});

	it('refuses an empty seed or KEK', () => {
		expect(() => pkceVerifier('', 'kek')).toThrow();
		expect(() => pkceVerifier('s', '')).toThrow();
	});

	it("keeps a provider's own spelling of the method", () => {
		expect(pkceAuthParams('v', { code_challenge_method: 's256' })).toEqual({
			code_challenge: pkceChallenge('v'),
			code_challenge_method: 's256',
		});
		expect(pkceAuthParams('v', undefined).code_challenge_method).toBe('S256');
	});
});

describe('buildOAuthAuthorizeUrl with PKCE', () => {
	it('adds the challenge for a pkce provider given a verifier', () => {
		const url = new URL(
			buildOAuthAuthorizeUrl({
				oauthConfig: canva,
				clientId: 'OC-id',
				redirectUri: 'https://app/cb',
				state: 'signed-state',
				codeVerifier: 'verifier-1',
			}),
		);
		expect(url.searchParams.get('code_challenge')).toBe(
			pkceChallenge('verifier-1'),
		);
		expect(url.searchParams.get('code_challenge_method')).toBe('s256');
		expect(url.searchParams.get('state')).toBe('signed-state');
	});

	it('adds nothing for a provider without pkce', () => {
		const url = new URL(
			buildOAuthAuthorizeUrl({
				oauthConfig: { ...canva, pkce: false, authParams: {} },
				clientId: 'id',
				redirectUri: 'https://app/cb',
				state: 's',
				codeVerifier: 'verifier-1',
			}),
		);
		expect(url.searchParams.has('code_challenge')).toBe(false);
	});
});

describe('exchangeCodeForTokens with PKCE', () => {
	function fakeTokenEndpoint() {
		mockSent.length = 0;
		return mockSent;
	}

	afterEach(() => jest.restoreAllMocks());

	it('sends the verifier, with Basic client auth', async () => {
		const sent = fakeTokenEndpoint();
		const tokens = await exchangeCodeForTokens(
			'CODE',
			'OC-id',
			'shh',
			canva,
			'https://app/cb',
			'verifier-1',
		);
		expect(tokens.access_token).toBe('AT');
		const form = new URLSearchParams(sent[0]?.body);
		expect(form.get('code_verifier')).toBe('verifier-1');
		expect(form.has('client_secret')).toBe(false);
		expect(sent[0]?.headers.Authorization).toBe(
			`Basic ${Buffer.from('OC-id:shh').toString('base64')}`,
		);
	});

	it('sends no verifier when none is given', async () => {
		const sent = fakeTokenEndpoint();
		await exchangeCodeForTokens('CODE', 'id', 'shh', canva, 'https://app/cb');
		expect(new URLSearchParams(sent[0]?.body).has('code_verifier')).toBe(false);
	});
});
