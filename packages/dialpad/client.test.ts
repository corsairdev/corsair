import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	createDialpadConfig,
	DIALPAD_REPORT_MAX_BYTES,
	DIALPAD_REPORT_TIMEOUT_MS,
	makeDialpadRequest,
} from './client';
import { DialpadOperationDefinitions } from './endpoints/definitions';
import { dialpad } from './index';

const apiKeyTestPlugin = dialpad({ authType: 'api_key' });
const oauthTestPlugin = dialpad({
	authType: 'oauth_2',
	environment: 'sandbox',
});
type ApiKeyBuilderContext = Parameters<
	NonNullable<typeof apiKeyTestPlugin.keyBuilder>
>[0];
type OAuthBuilderContext = Parameters<
	NonNullable<typeof oauthTestPlugin.keyBuilder>
>[0];

function getApiKeyBuilder() {
	const builder = apiKeyTestPlugin.keyBuilder;
	if (!builder) throw new Error('Expected the Dialpad key builder');
	return builder;
}

function getOAuthKeyBuilder() {
	const builder = oauthTestPlugin.keyBuilder;
	if (!builder) throw new Error('Expected the Dialpad key builder');
	return builder;
}

function buildOAuthContext(values: {
	accessToken: string | null;
	expiresAt: string | null;
	refreshToken: string | null;
}): OAuthBuilderContext {
	return {
		authType: 'oauth_2',
		tenantId: 'test-company',
		options: { authType: 'oauth_2', environment: 'sandbox' },
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_access_token: () => Promise.resolve(values.accessToken),
			set_access_token: async () => {},
			get_refresh_token: () => Promise.resolve(values.refreshToken),
			set_refresh_token: async () => {},
			get_expires_at: () => Promise.resolve(values.expiresAt),
			set_expires_at: async () => {},
			get_scope: () => Promise.resolve(null),
			set_scope: async () => {},
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: async () => {},
			get_integration_credentials: () =>
				Promise.resolve({
					client_id: 'test-client-id',
					client_secret: 'test-client-secret',
					redirect_url: 'https://corsair.dev/oauth/callback',
				}),
		},
	};
}

describe('Dialpad authentication paths', () => {
	it('loads a company API key from the API-key account fields', async () => {
		const context: ApiKeyBuilderContext = {
			authType: 'api_key',
			tenantId: 'test-company',
			options: { authType: 'api_key' },
			keys: {
				get_dek: () => Promise.resolve('test-dek'),
				issue_new_dek: () => Promise.resolve('test-dek'),
				get_api_key: () => Promise.resolve('test-company-key'),
				set_api_key: async () => {},
				get_webhook_signature: () => Promise.resolve(null),
				set_webhook_signature: async () => {},
			},
		};

		expect(await getApiKeyBuilder()(context, 'endpoint')).toBe(
			'test-company-key',
		);
	});

	it('fails with AuthMissingError when no company API key is stored', async () => {
		const context: ApiKeyBuilderContext = {
			authType: 'api_key',
			tenantId: 'test-company',
			options: { authType: 'api_key' },
			keys: {
				get_dek: () => Promise.resolve('test-dek'),
				issue_new_dek: () => Promise.resolve('test-dek'),
				get_api_key: () => Promise.resolve(null),
				set_api_key: async () => {},
				get_webhook_signature: () => Promise.resolve(null),
				set_webhook_signature: async () => {},
			},
		};

		await expect(getApiKeyBuilder()(context, 'endpoint')).rejects.toThrow(
			AuthMissingError,
		);
	});

	it('uses a fresh OAuth access token without treating the app client secret as an API key', async () => {
		const expiry = String(Math.floor(Date.now() / 1000) + 3600);
		const context = buildOAuthContext({
			accessToken: 'fresh-oauth-access-token',
			expiresAt: expiry,
			refreshToken: 'refresh-token',
		});

		expect(await getOAuthKeyBuilder()(context, 'endpoint')).toBe(
			'fresh-oauth-access-token',
		);
	});

	it('refreshes an expired OAuth token through Dialpad’s official token endpoint', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(
				JSON.stringify({
					access_token: 'fresh-access-token',
					refresh_token: 'rotated-refresh-token',
					expires_in: 3600,
				}),
				{
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				},
			),
		);
		const context = buildOAuthContext({
			accessToken: 'expired-access-token',
			expiresAt: '1',
			refreshToken: 'existing-refresh-token',
		});

		try {
			expect(await getOAuthKeyBuilder()(context, 'endpoint')).toBe(
				'fresh-access-token',
			);
			expect(fetchMock).toHaveBeenCalledWith(
				'https://sandbox.dialpad.com/oauth2/token',
				expect.objectContaining({
					method: 'POST',
					headers: expect.objectContaining({
						'Content-Type': 'application/x-www-form-urlencoded',
					}),
				}),
			);
			const requestInit = fetchMock.mock.calls[0]?.[1];
			if (!requestInit || !requestInit.body) {
				throw new Error('Expected the OAuth refresh form body');
			}
			const refreshBodyText =
				typeof requestInit.body === 'string'
					? requestInit.body
					: requestInit.body instanceof URLSearchParams
						? requestInit.body.toString()
						: '';
			if (!refreshBodyText)
				throw new Error('Expected URL-encoded OAuth fields');
			const refreshBody = new URLSearchParams(refreshBodyText);
			expect(refreshBody.get('grant_type')).toBe('refresh_token');
			expect(refreshBody.get('refresh_token')).toBe('existing-refresh-token');
			expect(refreshBody.get('client_id')).toBe('test-client-id');
			expect(refreshBody.get('client_secret')).toBe('test-client-secret');
		} finally {
			fetchMock.mockRestore();
		}
	});

	it('redacts OAuth client secrets from token-refresh errors', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(
				JSON.stringify({ error_description: 'Rejected test-client-secret' }),
				{
					status: 400,
					headers: { 'Content-Type': 'application/json' },
				},
			),
		);
		const context = buildOAuthContext({
			accessToken: 'expired-access-token',
			expiresAt: '1',
			refreshToken: 'existing-refresh-token',
		});

		try {
			// `unknown` because a rejected auth helper may throw any value.
			const error = await Promise.resolve(
				getOAuthKeyBuilder()(context, 'endpoint'),
			).catch((caught: unknown) => caught);
			expect(error).toBeInstanceOf(Error);
			if (!(error instanceof Error)) {
				throw new Error('Expected an OAuth refresh error');
			}
			expect(error.message).not.toContain('test-client-secret');
		} finally {
			fetchMock.mockRestore();
		}
	});
});

describe('Dialpad client configuration', () => {
	it('uses Dialpad production and sandbox hosts with Bearer credentials', () => {
		const production = createDialpadConfig({ apiKey: 'api-key-value' });
		const sandbox = createDialpadConfig({
			apiKey: 'oauth-access-token',
			environment: 'sandbox',
		});

		expect(production.BASE).toBe('https://dialpad.com');
		expect(production.VERSION).toBe('v2');
		expect(production.TOKEN).toBe('api-key-value');
		expect(sandbox.BASE).toBe('https://sandbox.dialpad.com');
		expect(sandbox.TOKEN).toBe('oauth-access-token');
	});

	it('rejects an explicitly empty API key before network I/O', () => {
		expect(() => createDialpadConfig({ apiKey: '' })).toThrow(AuthMissingError);
	});

	it('uses Corsair’s bounded default timeout when no operation overrides it', () => {
		const config = createDialpadConfig({ apiKey: 'test-key' });

		expect(config.TIMEOUT ?? 20_000).toBe(20_000);
	});
});

describe('Dialpad HTTP request behavior', () => {
	let fetchMock: jest.SpyInstance<
		ReturnType<typeof fetch>,
		Parameters<typeof fetch>
	>;

	beforeEach(() => {
		fetchMock = jest.spyOn(globalThis, 'fetch');
	});

	afterEach(() => {
		fetchMock.mockRestore();
	});

	it('encodes path parameters, sends Bearer auth, and uses the selected host', async () => {
		fetchMock.mockResolvedValue(
			new Response(JSON.stringify({ ok: true }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}),
		);

		await makeDialpadRequest(
			DialpadOperationDefinitions['call.get_call_info'],
			{ path: { id: 'id / 7' } },
			{ apiKey: 'safe-test-token', environment: 'sandbox' },
		);

		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(fetchMock).toHaveBeenCalledWith(
			'https://sandbox.dialpad.com/api/v2/call/id%20%2F%207',
			expect.objectContaining({ method: 'GET' }),
		);
		const init = fetchMock.mock.calls[0]?.[1];
		if (!init) throw new Error('Expected the request init to be provided');
		expect(new Headers(init.headers).get('authorization')).toBe(
			'Bearer safe-test-token',
		);
	});

	it('keeps documented query fields out of a JSON request body', async () => {
		fetchMock.mockResolvedValue(
			new Response('[]', {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}),
		);

		await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.queryLeads'],
			{ query: { count: true, cursor: 'next-page' }, body: null },
			{ apiKey: 'safe-test-token' },
		);

		expect(fetchMock).toHaveBeenCalledWith(
			'https://dialpad.com/api/v2/powerdialer/lead/query?count=true&cursor=next-page',
			expect.objectContaining({ method: 'POST', body: 'null' }),
		);
	});

	it('returns report bytes in a capped, timeout-bound binary envelope', async () => {
		fetchMock.mockResolvedValue(
			new Response(new Blob([new Uint8Array([0, 255, 1])]), {
				status: 200,
				headers: { 'Content-Type': 'text/csv; charset=utf-8' },
			}),
		);

		const result = await makeDialpadRequest(
			DialpadOperationDefinitions['reports.scheduledstats.download'],
			{ query: { t: 'user_voiceline', d: '2024-06-01' } },
			{ apiKey: 'safe-test-token', environment: 'sandbox' },
		);

		expect(result).toEqual({
			kind: 'binary',
			contentType: 'text/csv; charset=utf-8',
			base64: 'AP8B',
			sizeBytes: 3,
		});
		const target = fetchMock.mock.calls[0]?.[0];
		const init = fetchMock.mock.calls[0]?.[1];
		if (!target || !init) throw new Error('Expected the report HTTP request');
		expect(String(target)).toBe(
			'https://sandbox.dialpad.com/dl/stats/scheduledstats?t=user_voiceline&d=2024-06-01',
		);
		expect(new Headers(init.headers).get('authorization')).toBe(
			'Bearer safe-test-token',
		);
		expect(init.signal).toBeInstanceOf(AbortSignal);
		expect(DIALPAD_REPORT_TIMEOUT_MS).toBe(20_000);
		expect(DIALPAD_REPORT_MAX_BYTES).toBe(25 * 1024 * 1024);
	});

	it.each([
		[
			'recordings.call.download',
			{ path: { recording_id: '6086754856781234' } },
			'https://dialpad.com/r/6086754856781234',
		],
		[
			'recordings.voicemail.download',
			{ path: { recording_id: '6086754856787890' } },
			'https://dialpad.com/v/6086754856787890',
		],
		[
			'recordings.admin_call.download',
			{ path: { share_link_id: 'share-link-123' } },
			'https://dialpad.com/recording/admincallrecording/share-link-123',
		],
	] as const)(
		'downloads documented MP3 route %s with Bearer auth',
		async (key, input, url) => {
			fetchMock.mockResolvedValue(
				new Response(new Blob([new Uint8Array([0, 1, 2])]), {
					status: 200,
					headers: { 'Content-Type': 'audio/mpeg' },
				}),
			);

			const result = await makeDialpadRequest(
				DialpadOperationDefinitions[key],
				input,
				{ apiKey: 'safe-test-token' },
			);

			expect(result).toEqual({
				kind: 'binary',
				contentType: 'audio/mpeg',
				base64: 'AAEC',
				sizeBytes: 3,
			});
			const request = fetchMock.mock.calls[0];
			if (!request) throw new Error('Expected the recording download request');
			expect(String(request[0])).toBe(url);
			expect(new Headers(request[1]?.headers).get('authorization')).toBe(
				'Bearer safe-test-token',
			);
		},
	);

	it('treats the login page a refused recording download redirects to as a 401', async () => {
		fetchMock.mockResolvedValue(
			new Response('<html>Sign in</html>', {
				status: 200,
				headers: { 'Content-Type': 'text/html; charset=utf-8' },
			}),
		);

		// `unknown` because a rejected request can contain any thrown value.
		const error = await makeDialpadRequest(
			DialpadOperationDefinitions['recordings.call.download'],
			{ path: { recording_id: '6086754856781234' } },
			{ apiKey: 'safe-test-token' },
		).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) {
			throw new Error('Expected a Dialpad ApiError');
		}
		expect(error.status).toBe(401);
		expect(error.message).not.toContain('safe-test-token');
	});

	it('preserves report download Retry-After metadata without retrying', async () => {
		fetchMock.mockResolvedValue(
			new Response(JSON.stringify({ error_code: 429, message: 'Try later' }), {
				status: 429,
				headers: {
					'Content-Type': 'application/json',
					'Retry-After': '4',
				},
			}),
		);
		// `unknown` because a rejected request can contain any thrown value.
		const error = await makeDialpadRequest(
			DialpadOperationDefinitions['reports.scheduledstats.download'],
			{ query: { t: 'user_voiceline', d: '2024-06-01' } },
			{ apiKey: 'safe-test-token' },
		).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) {
			throw new Error('Expected a Dialpad ApiError');
		}
		expect(error.retryAfter).toBe(4000);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('extracts Retry-After without issuing a duplicate request', async () => {
		fetchMock.mockResolvedValue(
			new Response(JSON.stringify({ message: 'rate limited' }), {
				status: 429,
				headers: {
					'Content-Type': 'application/json',
					'Retry-After': '4',
				},
			}),
		);

		// `unknown` because a rejected request can contain any thrown value.
		const error = await makeDialpadRequest(
			DialpadOperationDefinitions['company.get'],
			{},
			{ apiKey: 'safe-test-token' },
		).catch((caught: unknown) => caught);
		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) {
			throw new Error('Expected a Dialpad ApiError');
		}
		expect(error.retryAfter).toBe(4000);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('redacts short secrets echoed in nested propagated error bodies', async () => {
		fetchMock.mockResolvedValue(
			new Response(
				JSON.stringify({
					password: 'abc',
					message: 'Rejected abc',
					details: ['Provider echoed abc'],
				}),
				{
					status: 400,
					headers: { 'Content-Type': 'application/json' },
				},
			),
		);

		// `unknown` because a rejected request can contain any thrown value.
		const error = await makeDialpadRequest(
			DialpadOperationDefinitions['accesscontrolpolicies.create'],
			{ body: { password: 'abc' } },
			{ apiKey: 'safe-test-token' },
		).catch((caught: unknown) => caught);
		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) {
			throw new Error('Expected a Dialpad ApiError');
		}
		expect(error.body).toEqual({
			password: '[REDACTED]',
			message: 'Rejected [REDACTED]',
			details: ['Provider echoed [REDACTED]'],
		});
		expect(error.request.body).toBeUndefined();
		expect(error.message).not.toContain('abc');
	});

	// A failed users.create carries the new user's email and name in its body, so
	// the propagated error leaves the request body out.
	it('keeps the request body of a failed users.create out of the error', async () => {
		fetchMock.mockResolvedValue(
			new Response(JSON.stringify({ error: { message: 'Bad request' } }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			}),
		);

		const error = await makeDialpadRequest(
			DialpadOperationDefinitions['users.create'],
			{
				body: {
					email: 'jane.customer@example.com',
					first_name: 'Jane',
					last_name: 'Customer',
				},
			},
			{ apiKey: 'safe-test-token' },
			// `unknown` because a rejected request can contain any thrown value.
		).catch((caught: unknown) => caught);
		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) {
			throw new Error('Expected a Dialpad ApiError');
		}
		expect(error.request.body).toBeUndefined();
		expect(JSON.stringify(error)).not.toContain('jane.customer@example.com');
		expect(String(error.stack)).not.toContain('jane.customer@example.com');
	});

	// contacts.search sends the person's email, phone and name as query values, so
	// the propagated error leaves the query and the URL's query string out.
	it('keeps contacts.search query values out of the error', async () => {
		fetchMock.mockResolvedValue(
			new Response(JSON.stringify({ error: { message: 'Bad request' } }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			}),
		);

		const error = await makeDialpadRequest(
			DialpadOperationDefinitions['contacts.search'],
			{
				query: {
					email: 'jane.customer@example.com',
					phone: '+14155550123',
					name: 'Jane Customer',
				},
			},
			{ apiKey: 'safe-test-token' },
			// `unknown` because a rejected request can contain any thrown value.
		).catch((caught: unknown) => caught);
		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) {
			throw new Error('Expected a Dialpad ApiError');
		}
		expect(error.status).toBe(400);
		expect(error.request.query).toBeUndefined();
		const serialized = `${JSON.stringify(error)} ${error.url} ${error.message} ${String(error.stack)}`;
		for (const value of ['jane.customer', '4155550123', 'Jane']) {
			expect(serialized).not.toContain(value);
		}
	});

	// blockednumbers.get puts the phone number in the path, so both error URLs
	// carry the route template and the provider's echo of the number is redacted.
	it('keeps a path phone number out of a failed blockednumbers.get error', async () => {
		fetchMock.mockResolvedValue(
			new Response(
				JSON.stringify({ error: { message: 'Number +14155550123 not found' } }),
				{ status: 404, headers: { 'Content-Type': 'application/json' } },
			),
		);

		const error = await makeDialpadRequest(
			DialpadOperationDefinitions['blockednumbers.get'],
			{ path: { number: '+14155550123' } },
			{ apiKey: 'safe-test-token' },
			// `unknown` because a rejected request can contain any thrown value.
		).catch((caught: unknown) => caught);
		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) {
			throw new Error('Expected a Dialpad ApiError');
		}
		expect(error.status).toBe(404);
		expect(error.url).toBe(
			'https://dialpad.com/api/v2/blockednumbers/{number}',
		);
		expect(error.request.url).toBe('/api/v2/blockednumbers/{number}');
		const serialized = `${JSON.stringify(error)} ${error.url} ${error.request.url} ${error.message} ${String(error.stack)}`;
		expect(serialized).not.toContain('4155550123');
	});
});
