import { refreshOAuthTokensLocal } from '../core/auth/oauth-refresh-local';

type Captured = { url: string; init: RequestInit };

function stubFetch(response: unknown, status = 200): () => Captured {
	const captured = {} as Captured;
	global.fetch = (async (url: string, init: RequestInit) => {
		captured.url = url;
		captured.init = init;
		return {
			ok: status >= 200 && status < 300,
			status,
			text: async () => JSON.stringify(response),
		} as unknown as Response;
	}) as unknown as typeof fetch;
	return () => captured;
}

describe('refreshOAuthTokensLocal', () => {
	const realFetch = global.fetch;
	afterEach(() => {
		global.fetch = realFetch;
	});

	it('form body: sends client_id + client_secret + refresh_token as urlencoded', async () => {
		const read = stubFetch({ access_token: 'at-1', expires_in: 3600 });
		const result = await refreshOAuthTokensLocal({
			tokenUrl: 'https://oauth2.googleapis.com/token',
			clientId: 'cid',
			clientSecret: 'csecret',
			refreshToken: 'rt',
		});

		const { url, init } = read();
		expect(url).toBe('https://oauth2.googleapis.com/token');
		expect((init.headers as Record<string, string>)['Content-Type']).toBe(
			'application/x-www-form-urlencoded',
		);
		const body = new URLSearchParams(String(init.body));
		expect(Object.fromEntries(body)).toEqual({
			grant_type: 'refresh_token',
			refresh_token: 'rt',
			client_id: 'cid',
			client_secret: 'csecret',
		});
		expect(result).toEqual({ access_token: 'at-1', expires_in: 3600 });
	});

	it('basic: Authorization header base64(client_id:client_secret), creds not in body', async () => {
		const read = stubFetch({ access_token: 'at-2', expires_in: 7200 });
		await refreshOAuthTokensLocal({
			tokenUrl: 'https://bitbucket.org/site/oauth2/access_token',
			clientId: 'bb-id',
			clientSecret: 'bb-secret',
			refreshToken: 'rt',
			tokenAuthMethod: 'basic',
		});

		const { init } = read();
		const auth = (init.headers as Record<string, string>).Authorization;
		expect(auth).toBe(
			`Basic ${Buffer.from('bb-id:bb-secret').toString('base64')}`,
		);
		const body = Object.fromEntries(new URLSearchParams(String(init.body)));
		expect(body).toEqual({ grant_type: 'refresh_token', refresh_token: 'rt' });
	});

	it('basic_secret_only: Authorization base64(secret:) with no client_id (Stripe)', async () => {
		const read = stubFetch({
			access_token: 'at-3',
			refresh_token: 'rt-new',
			expires_in: 3600,
		});
		await refreshOAuthTokensLocal({
			tokenUrl: 'https://api.stripe.com/v1/oauth/token',
			clientSecret: 'sk_secret',
			refreshToken: 'rt',
			tokenAuthMethod: 'basic_secret_only',
		});

		const { init } = read();
		const auth = (init.headers as Record<string, string>).Authorization;
		expect(auth).toBe(`Basic ${Buffer.from('sk_secret:').toString('base64')}`);
		const body = Object.fromEntries(new URLSearchParams(String(init.body)));
		expect(body).toEqual({ grant_type: 'refresh_token', refresh_token: 'rt' });
	});

	it('json body: posts application/json with creds in the JSON (Confluence)', async () => {
		const read = stubFetch({ access_token: 'at-4', expires_in: 3600 });
		await refreshOAuthTokensLocal({
			tokenUrl: 'https://auth.atlassian.com/oauth/token',
			clientId: 'atl-id',
			clientSecret: 'atl-secret',
			refreshToken: 'rt',
			bodyFormat: 'json',
		});

		const { init } = read();
		expect((init.headers as Record<string, string>)['Content-Type']).toBe(
			'application/json',
		);
		expect(JSON.parse(String(init.body))).toEqual({
			grant_type: 'refresh_token',
			client_id: 'atl-id',
			client_secret: 'atl-secret',
			refresh_token: 'rt',
		});
	});

	it('extraParams are merged into the body (GitLab redirect_uri)', async () => {
		const read = stubFetch({ access_token: 'at-5', expires_in: 3600 });
		await refreshOAuthTokensLocal({
			tokenUrl: 'https://gitlab.example.com/oauth/token',
			clientId: 'gl-id',
			clientSecret: 'gl-secret',
			refreshToken: 'rt',
			extraParams: { redirect_uri: 'https://app/cb' },
		});

		const { init } = read();
		const body = Object.fromEntries(new URLSearchParams(String(init.body)));
		expect(body.redirect_uri).toBe('https://app/cb');
	});

	it('returns rotated refresh_token and scope when present', async () => {
		stubFetch({
			access_token: 'at-6',
			refresh_token: 'rt-rotated',
			expires_in: 3600,
			scope: 'a b',
		});
		const result = await refreshOAuthTokensLocal({
			tokenUrl: 'https://api.linear.app/oauth/token',
			clientId: 'lin',
			clientSecret: 'sec',
			refreshToken: 'rt',
		});
		expect(result).toEqual({
			access_token: 'at-6',
			refresh_token: 'rt-rotated',
			expires_in: 3600,
			scope: 'a b',
		});
	});

	it('throws with the provider error text on a non-2xx response', async () => {
		stubFetch({ error: 'invalid_grant' }, 400);
		await expect(
			refreshOAuthTokensLocal({
				tokenUrl: 'https://api.linear.app/oauth/token',
				clientId: 'lin',
				clientSecret: 'sec',
				refreshToken: 'rt',
			}),
		).rejects.toThrow(/invalid_grant/);
	});
});
