import type { ZohoDeskRegion } from './client';
import {
	downloadZohoDeskFile,
	isExpiredTokenError,
	makeZohoDeskRequest,
	regionFromApiDomain,
	regionFromTokenData,
	resolveOrgId,
	resolveZohoDeskRegion,
	soleOrganizationId,
	withZohoDeskAuth,
	ZohoDeskAPIError,
	zohoDeskApiBase,
	zohoDeskOAuthAuthUrl,
	zohoDeskOAuthTokenUrl,
} from './client';
import { errorBody, ORG_ID, organization } from './test-fixtures';

const TOKEN = '1000.secret-access-token';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		}),
	);
}

function sentUrl(call = 0) {
	return String(fetchMock.mock.calls[call]?.[0]);
}

function sentHeaders(call = 0) {
	return new Headers(fetchMock.mock.calls[call]?.[1]?.headers);
}

function fakeCtx(stored: string | null = null, options = {}) {
	return {
		key: TOKEN,
		options,
		tenantId: 'default',
		keys: {
			get_tenant_external_id: jest.fn().mockResolvedValue(stored),
			set_tenant_external_id: jest.fn().mockResolvedValue(undefined),
		},
	};
}

// unknown: the transport's answer, which these tests expect never arrives.
function failure(promise: Promise<unknown>): Promise<ZohoDeskAPIError> {
	return promise.then(
		() => {
			throw new Error('Expected the request to fail');
		},
		(error) => error,
	);
}

// The fake context only carries what these functions read.
function resolve(ctx: ReturnType<typeof fakeCtx>, token = TOKEN) {
	return resolveOrgId(ctx as never, token);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	jest.restoreAllMocks();
});

const dataCenters: [ZohoDeskRegion, string, string][] = [
	['us', 'https://desk.zoho.com', 'https://accounts.zoho.com'],
	['eu', 'https://desk.zoho.eu', 'https://accounts.zoho.eu'],
	['in', 'https://desk.zoho.in', 'https://accounts.zoho.in'],
	['au', 'https://desk.zoho.com.au', 'https://accounts.zoho.com.au'],
	['jp', 'https://desk.zoho.jp', 'https://accounts.zoho.jp'],
	['cn', 'https://desk.zoho.com.cn', 'https://accounts.zoho.com.cn'],
	['ca', 'https://desk.zohocloud.ca', 'https://accounts.zohocloud.ca'],
	['sa', 'https://desk.zoho.sa', 'https://accounts.zoho.sa'],
	['sg', 'https://desk.zoho.sg', 'https://accounts.zoho.sg'],
	['ae', 'https://desk.zoho.ae', 'https://accounts.zoho.ae'],
];

describe('Zoho Desk data centers', () => {
	it.each(dataCenters)('%s uses its own hosts', (region, desk, accounts) => {
		expect(zohoDeskApiBase(region)).toBe(`${desk}/api/v1`);
		expect(zohoDeskOAuthAuthUrl(region)).toBe(`${accounts}/oauth/v2/auth`);
		expect(zohoDeskOAuthTokenUrl(region)).toBe(`${accounts}/oauth/v2/token`);
	});

	it('defaults to the US data center', () => {
		expect(zohoDeskApiBase()).toBe('https://desk.zoho.com/api/v1');
		expect(resolveZohoDeskRegion({})).toBe('us');
	});

	it.each([
		['https://desk.zoho.eu', 'eu'],
		['desk.zoho.eu', 'eu'],
		['https://DESK.ZOHO.EU/', 'eu'],
		// The forms Zoho's own OAuth docs show for api_domain.
		['https://api.zoho.eu', 'eu'],
		['https://api.zoho.com', 'us'],
		['https://www.zohoapis.in', 'in'],
		['https://www.zohoapis.com.au', 'au'],
		['https://www.zohoapis.ca', 'ca'],
		['https://desk.zohocloud.ca', 'ca'],
		['  https://www.zohoapis.sa  ', 'sa'],
	])('reads %s as the %s data center', (domain, region) => {
		expect(regionFromApiDomain(domain)).toBe(region);
	});

	it.each([
		'http://desk.zoho.eu',
		'https://desk.zoho.eu.attacker.example',
		'https://attacker.example/desk.zoho.eu',
		'https://desk.zoho.uk',
		'not a url',
		'',
	])('does not treat %s as a Zoho data center', (domain) => {
		expect(regionFromApiDomain(domain)).toBeUndefined();
	});

	it('gives apiDomain precedence over region', () => {
		expect(
			resolveZohoDeskRegion({
				region: 'eu',
				apiDomain: 'https://www.zohoapis.in',
			}),
		).toBe('in');
	});

	it('refuses an unknown apiDomain rather than sending the token anywhere', () => {
		expect(() =>
			resolveZohoDeskRegion({ apiDomain: 'https://attacker.example' }),
		).toThrow('[zohodesk] apiDomain');
	});

	it('refuses an unknown region', () => {
		expect(() =>
			resolveZohoDeskRegion({ region: 'mars' as ZohoDeskRegion }),
		).toThrow("unknown region 'mars'");
	});

	it('does not mistake an inherited property for a region', () => {
		expect(() =>
			resolveZohoDeskRegion({ region: 'toString' as ZohoDeskRegion }),
		).toThrow('unknown region');
	});

	it('finds the data center in token data, preferring api_domain', () => {
		expect(regionFromTokenData({ api_domain: 'https://www.zohoapis.jp' })).toBe(
			'jp',
		);
		expect(regionFromTokenData({ location: 'sg' })).toBe('sg');
		expect(
			regionFromTokenData({
				api_domain: 'https://www.zohoapis.eu',
				location: 'us',
			}),
		).toBe('eu');
		expect(regionFromTokenData({ location: 'uk' })).toBeUndefined();
		expect(regionFromTokenData({})).toBeUndefined();
	});
});

describe('makeZohoDeskRequest', () => {
	it('sends the Zoho token scheme and the data center host', async () => {
		respond({ ok: true });

		await makeZohoDeskRequest(TOKEN, 'eu', { path: '/tickets' }, ORG_ID);

		expect(sentUrl()).toBe('https://desk.zoho.eu/api/v1/tickets');
		expect(sentHeaders().get('authorization')).toBe(`Zoho-oauthtoken ${TOKEN}`);
		expect(sentHeaders().get('orgId')).toBe(ORG_ID);
	});

	it('leaves out the orgId header when there is no org', async () => {
		respond({ ok: true });

		await makeZohoDeskRequest(TOKEN, 'us', { path: '/tickets' });

		expect(sentHeaders().has('orgId')).toBe(false);
	});

	it('drops undefined query values', async () => {
		respond({ ok: true });

		await makeZohoDeskRequest(TOKEN, 'us', {
			path: '/tickets',
			query: { limit: 5, from: undefined },
		});

		expect(sentUrl()).toBe('https://desk.zoho.com/api/v1/tickets?limit=5');
	});

	it('returns undefined for a 204', async () => {
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));

		await expect(
			makeZohoDeskRequest(TOKEN, 'us', { path: '/tickets' }),
		).resolves.toBeUndefined();
	});

	it('does not sleep or retry on a 429, leaving that to the error handlers', async () => {
		const timer = jest.spyOn(globalThis, 'setTimeout');
		respond(errorBody('THRESHOLD_EXCEEDED', 'Too many'), 429, {
			'Retry-After': '86400',
			'X-Rate-Limit-Remaining-v3': '0',
		});

		const error = await failure(
			makeZohoDeskRequest(TOKEN, 'us', { path: '/tickets' }),
		);

		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(timer.mock.calls.filter(([, ms]) => ms === 86_400_000)).toEqual([]);
		expect(error).toBeInstanceOf(ZohoDeskAPIError);
		expect(error).toMatchObject({
			status: 429,
			code: 'THRESHOLD_EXCEEDED',
			retryAfter: 86_400_000,
			creditsRemaining: 0,
		});
	});

	it('wraps a concurrency 429, which has no Retry-After', async () => {
		respond(
			errorBody(
				'TOO_MANY_REQUESTS',
				'The maximum number of Concurrent API Calls that can be made has been exceeded.',
			),
			429,
		);

		await expect(
			makeZohoDeskRequest(TOKEN, 'us', { path: '/tickets' }),
		).rejects.toMatchObject({
			status: 429,
			code: 'TOO_MANY_REQUESTS',
			retryAfter: undefined,
		});
	});

	it("puts Zoho's errorCode and message in the error", async () => {
		respond(errorBody('INVALID_OAUTH', 'The OauthToken has expired.'), 401);

		const error = await failure(
			makeZohoDeskRequest(TOKEN, 'us', { path: '/tickets' }),
		);

		expect(error.message).toBe(
			'Zoho Desk 401 INVALID_OAUTH: The OauthToken has expired.',
		);
		expect(error.message).not.toContain(TOKEN);
		expect(error.body).toEqual(
			errorBody('INVALID_OAUTH', 'The OauthToken has expired.'),
		);
	});

	it('survives an error body that is not JSON', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response('<html>Bad gateway</html>', {
				status: 502,
				headers: { 'Content-Type': 'text/html' },
			}),
		);

		await expect(
			makeZohoDeskRequest(TOKEN, 'us', { path: '/tickets' }),
		).rejects.toMatchObject({ status: 502, code: undefined });
	});

	it('names a failure that carries no message', async () => {
		fetchMock.mockRejectedValueOnce('socket closed');

		const error = await failure(
			makeZohoDeskRequest(TOKEN, 'us', { path: '/tickets' }),
		);

		expect(error).toBeInstanceOf(ZohoDeskAPIError);
		expect(error.message).toBe('Unknown Zoho Desk error');
	});

	it('wraps a network failure', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await failure(
			makeZohoDeskRequest(TOKEN, 'us', { path: '/tickets' }),
		);

		expect(error).toBeInstanceOf(ZohoDeskAPIError);
		expect(error.message).toBe('fetch failed');
		expect(error.status).toBeUndefined();
	});
});

describe('downloadZohoDeskFile', () => {
	const request = {
		path: '/departments/1/logo',
		query: { fileSize: 'ACTUAL' },
	};

	it('sends auth, the org and the query', async () => {
		fetchMock.mockResolvedValueOnce(new Response(Buffer.from([1, 2, 3])));

		await downloadZohoDeskFile(TOKEN, 'au', request, ORG_ID);

		expect(sentUrl()).toBe(
			'https://desk.zoho.com.au/api/v1/departments/1/logo?fileSize=ACTUAL',
		);
		expect(sentHeaders().get('authorization')).toBe(`Zoho-oauthtoken ${TOKEN}`);
		expect(sentHeaders().get('orgId')).toBe(ORG_ID);
	});

	it('falls back to a generic type when Zoho sends none', async () => {
		const response = new Response(Buffer.from([1]));
		response.headers.delete('content-type');
		fetchMock.mockResolvedValueOnce(response);

		await expect(
			downloadZohoDeskFile(TOKEN, 'us', request),
		).resolves.toMatchObject({ contentType: 'application/octet-stream' });
	});

	it('reports an empty answer as an empty file', async () => {
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));

		await expect(
			downloadZohoDeskFile(TOKEN, 'us', request),
		).resolves.toMatchObject({ contentBase64: '', size: 0 });
	});

	it('reads the rate limit headers on a 429', async () => {
		respond(errorBody('THRESHOLD_EXCEEDED'), 429, {
			'Retry-After': '34',
			'X-Rate-Limit-Remaining-v3': '0',
		});

		await expect(
			downloadZohoDeskFile(TOKEN, 'us', request),
		).rejects.toMatchObject({
			status: 429,
			code: 'THRESHOLD_EXCEEDED',
			retryAfter: 34_000,
			creditsRemaining: 0,
		});
	});

	it('wraps a non-JSON failure', async () => {
		fetchMock.mockResolvedValueOnce(new Response('down', { status: 503 }));

		await expect(
			downloadZohoDeskFile(TOKEN, 'us', request),
		).rejects.toMatchObject({ status: 503, body: 'down' });
	});

	it('wraps a timeout', async () => {
		fetchMock.mockRejectedValueOnce(
			new DOMException('The operation timed out', 'TimeoutError'),
		);

		const error = await failure(downloadZohoDeskFile(TOKEN, 'us', request));

		expect(error).toBeInstanceOf(ZohoDeskAPIError);
		expect(error.message).toBe('The operation timed out');
	});
});

describe('isExpiredTokenError', () => {
	const failure = (status: number, code: string) =>
		new ZohoDeskAPIError('failed', { status, body: errorBody(code) });

	it('accepts a 401 for a bad token', () => {
		expect(isExpiredTokenError(failure(401, 'INVALID_OAUTH'))).toBe(true);
		expect(isExpiredTokenError(failure(401, 'UNAUTHORIZED'))).toBe(true);
	});

	it.each(['SCOPE_MISMATCH', 'OAUTH_ORG_MISMATCH'])(
		'refuses a 401 %s, which a new token cannot fix',
		(code) => {
			expect(isExpiredTokenError(failure(401, code))).toBe(false);
		},
	);

	it('refuses other failures', () => {
		expect(isExpiredTokenError(failure(403, 'FORBIDDEN'))).toBe(false);
		expect(isExpiredTokenError(new Error('401'))).toBe(false);
	});
});

describe('soleOrganizationId', () => {
	it('returns the only org, as a string', () => {
		expect(soleOrganizationId({ data: [organization] })).toBe(ORG_ID);
		expect(soleOrganizationId({ data: [{ id: 42 }] })).toBe('42');
	});

	it('does not choose between several orgs, not even the default one', () => {
		expect(
			soleOrganizationId({
				data: [
					{ id: '1', isDefault: true },
					{ id: '2', isDefault: false },
				],
			}),
		).toBeUndefined();
	});

	it.each([[{ data: [] }], [undefined], ['text'], [{ data: 'no' }]])(
		'finds nothing in %j',
		(body) => {
			expect(soleOrganizationId(body)).toBeUndefined();
		},
	);
});

describe('resolveOrgId', () => {
	it('prefers the orgId option and reads nothing else', async () => {
		const ctx = fakeCtx('999', { orgId: ORG_ID });

		await expect(resolve(ctx)).resolves.toBe(ORG_ID);
		expect(ctx.keys.get_tenant_external_id).not.toHaveBeenCalled();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('then uses the org stored after OAuth', async () => {
		await expect(resolve(fakeCtx(ORG_ID))).resolves.toBe(ORG_ID);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('then looks up a sole org once and stores it', async () => {
		const ctx = fakeCtx();
		respond({ data: [organization] });

		await expect(resolve(ctx)).resolves.toBe(ORG_ID);
		await expect(resolve(ctx)).resolves.toBe(ORG_ID);

		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(sentUrl()).toBe('https://desk.zoho.com/api/v1/organizations');
		expect(sentHeaders().has('orgId')).toBe(false);
		expect(ctx.keys.set_tenant_external_id).toHaveBeenCalledWith(ORG_ID);
	});

	it('looks in the configured data center', async () => {
		respond({ data: [organization] });

		await resolve(fakeCtx(null, { region: 'eu' }));

		expect(sentUrl()).toBe('https://desk.zoho.eu/api/v1/organizations');
	});

	it('sends no org when there are several, and asks only once', async () => {
		const ctx = fakeCtx();
		respond({ data: [{ id: '1' }, { id: '2' }] });

		await expect(resolve(ctx)).resolves.toBeUndefined();
		await expect(resolve(ctx)).resolves.toBeUndefined();

		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(ctx.keys.set_tenant_external_id).not.toHaveBeenCalled();
	});

	it('still returns the org when saving it fails', async () => {
		const ctx = fakeCtx();
		ctx.keys.set_tenant_external_id.mockRejectedValueOnce(new Error('disk'));
		respond({ data: [organization] });

		await expect(resolve(ctx)).resolves.toBe(ORG_ID);
	});

	it('keeps tenants apart', async () => {
		respond({ data: [{ id: '1' }] });
		respond({ data: [{ id: '2' }] });

		await expect(resolve(fakeCtx())).resolves.toBe('1');
		await expect(resolve(fakeCtx())).resolves.toBe('2');
	});

	it('works without a key manager, as with a static key', async () => {
		const options = { key: TOKEN };
		const ctx = { key: TOKEN, options };
		respond({ data: [organization] });

		await expect(resolveOrgId(ctx as never, TOKEN)).resolves.toBe(ORG_ID);
		await expect(resolveOrgId(ctx as never, TOKEN)).resolves.toBe(ORG_ID);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('goes on without an org if the lookup fails, and tries again later', async () => {
		const ctx = fakeCtx();
		respond(errorBody('SCOPE_MISMATCH'), 403);
		respond({ data: [organization] });

		await expect(resolve(ctx)).resolves.toBeUndefined();
		await expect(resolve(ctx)).resolves.toBe(ORG_ID);
	});

	it('passes an expired token up so that it can be refreshed', async () => {
		respond(errorBody('INVALID_OAUTH'), 401);

		await expect(resolve(fakeCtx())).rejects.toMatchObject({ status: 401 });
	});
});

describe('withZohoDeskAuth', () => {
	it('sends no org on a route that takes none', async () => {
		const ctx = fakeCtx(ORG_ID);
		const send = jest.fn().mockResolvedValue('ok');

		await withZohoDeskAuth(
			ctx as never,
			{ path: '/organizations', withoutOrg: true },
			send,
		);

		expect(send).toHaveBeenCalledWith(TOKEN, undefined);
		expect(ctx.keys.get_tenant_external_id).not.toHaveBeenCalled();
	});

	it('drops a remembered org that no longer matches, and sends none', async () => {
		const ctx = fakeCtx(ORG_ID);
		const mismatch = new ZohoDeskAPIError('org', {
			status: 401,
			body: errorBody('OAUTH_ORG_MISMATCH'),
		});
		const send = jest
			.fn()
			.mockRejectedValueOnce(mismatch)
			.mockResolvedValueOnce('ok');

		await expect(
			withZohoDeskAuth(ctx as never, { path: '/tickets' }, send),
		).resolves.toBe('ok');

		expect(send).toHaveBeenNthCalledWith(1, TOKEN, ORG_ID);
		expect(send).toHaveBeenNthCalledWith(2, TOKEN, undefined);
		expect(ctx.keys.set_tenant_external_id).toHaveBeenCalledWith('');
	});

	it('still retries when forgetting the org fails to save', async () => {
		const ctx = fakeCtx(ORG_ID);
		ctx.keys.set_tenant_external_id.mockRejectedValueOnce(new Error('disk'));
		const send = jest
			.fn()
			.mockRejectedValueOnce(
				new ZohoDeskAPIError('org', {
					status: 401,
					body: errorBody('OAUTH_ORG_MISMATCH'),
				}),
			)
			.mockResolvedValueOnce('ok');

		await expect(
			withZohoDeskAuth(ctx as never, { path: '/tickets' }, send),
		).resolves.toBe('ok');
	});

	it('surfaces a mismatch on the orgId option, which is a config error', async () => {
		const ctx = fakeCtx(null, { orgId: ORG_ID });
		const mismatch = new ZohoDeskAPIError('org', {
			status: 401,
			body: errorBody('OAUTH_ORG_MISMATCH'),
		});
		const send = jest.fn().mockRejectedValue(mismatch);

		await expect(
			withZohoDeskAuth(ctx as never, { path: '/tickets' }, send),
		).rejects.toBe(mismatch);
		expect(send).toHaveBeenCalledTimes(1);
		expect(ctx.keys.set_tenant_external_id).not.toHaveBeenCalled();
	});

	it('does not loop when a call without an org is also refused', async () => {
		const ctx = fakeCtx(ORG_ID);
		const mismatch = new ZohoDeskAPIError('org', {
			status: 401,
			body: errorBody('OAUTH_ORG_MISMATCH'),
		});
		const send = jest.fn().mockRejectedValue(mismatch);

		await expect(
			withZohoDeskAuth(ctx as never, { path: '/tickets' }, send),
		).rejects.toBe(mismatch);
		expect(send).toHaveBeenCalledTimes(2);
	});

	it('rethrows a 401 when a static key cannot be refreshed', async () => {
		const ctx = fakeCtx(ORG_ID, { key: TOKEN });
		const expired = new ZohoDeskAPIError('expired', {
			status: 401,
			body: errorBody('INVALID_OAUTH'),
		});
		const send = jest.fn().mockRejectedValue(expired);

		await expect(
			withZohoDeskAuth(ctx as never, { path: '/tickets' }, send),
		).rejects.toBe(expired);
		expect(send).toHaveBeenCalledTimes(1);
	});

	it('does not refresh for a missing scope', async () => {
		const ctx = fakeCtx(ORG_ID);
		const mismatch = new ZohoDeskAPIError('scope', {
			status: 401,
			body: errorBody('SCOPE_MISMATCH'),
		});
		const send = jest.fn().mockRejectedValue(mismatch);

		await expect(
			withZohoDeskAuth(ctx as never, { path: '/tickets' }, send),
		).rejects.toBe(mismatch);
		expect(send).toHaveBeenCalledTimes(1);
	});
});
