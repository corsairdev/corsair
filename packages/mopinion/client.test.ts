import {
	describeMopinionError,
	MopinionAPIError,
	makeMopinionRequest,
	mopinionAuthToken,
	resolveSigningCredentials,
} from './client';
import { invalidCredentialsProblem, validationProblem } from './test-fixtures';

const callContext = (
	overrides: Partial<Parameters<typeof makeMopinionRequest>[0]> = {},
) => ({
	key: 'pk:st',
	options: { publicKey: 'pk', signatureToken: 'st' },
	keys: {
		get_public_key: jest.fn().mockResolvedValue('stored-public'),
		get_signature_token: jest.fn().mockResolvedValue('stored-signature'),
	},
	...overrides,
});

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(
	body: unknown,
	status = 200,
	contentType = 'application/json',
) {
	const payload = typeof body === 'string' ? body : JSON.stringify(body);
	fetchMock.mockResolvedValueOnce(
		new Response(payload, { status, headers: { 'Content-Type': contentType } }),
	);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('mopinionAuthToken', () => {
	// The worked example from https://developer.mopinion.com (Authentication):
	// public key 123abc, signature token $1gn47ur3T0k3n, POST /reports with
	// that exact JSON body.
	it('reproduces the docs worked example byte for byte', () => {
		const token = mopinionAuthToken(
			'123abc',
			'$1gn47ur3T0k3n',
			'/reports',
			'{"name":"My new report","language":"en"}',
		);
		expect(token).toBe(
			'MTIzYWJjOjhkMGQ2OTNmMzRjNThjNjBmYzQ2Y2YzYTcyNTY0MmRjNWE0MzU5NGJjYzhiZTI1MzdlODFjOTA0ZWU0ZGMyYzE=',
		);
	});

	it('signs an empty body for GET requests', () => {
		const token = mopinionAuthToken('pk', 'st', '/account', '');
		const decoded = Buffer.from(token, 'base64').toString('utf-8');
		expect(decoded).toMatch(/^pk:[0-9a-f]{64}$/);
	});
});

describe('resolveSigningCredentials', () => {
	it('prefers the inline options without touching the stored fields', async () => {
		const ctx = callContext({
			key: '',
			options: {
				publicKey: 'inline-public',
				signatureToken: 'inline-signature',
			},
		});
		const resolved = await resolveSigningCredentials(ctx);
		expect(resolved).toEqual({
			publicKey: 'inline-public',
			signatureToken: 'inline-signature',
		});
		expect(ctx.keys.get_public_key).not.toHaveBeenCalled();
		expect(ctx.keys.get_signature_token).not.toHaveBeenCalled();
	});

	it('reads the stored account fields when the options are empty', async () => {
		const ctx = callContext({ options: {} });
		const resolved = await resolveSigningCredentials(ctx);
		expect(resolved).toEqual({
			publicKey: 'stored-public',
			signatureToken: 'stored-signature',
		});
	});

	it('throws when a credential is missing', async () => {
		const ctx = callContext({
			key: '',
			options: { publicKey: 'inline-public' },
			keys: {
				get_public_key: jest.fn().mockResolvedValue('stored-public'),
				get_signature_token: jest.fn().mockResolvedValue(null),
			},
		});
		await expect(resolveSigningCredentials(ctx)).rejects.toThrow(
			'public_key and signature_token are both required',
		);
	});
});

describe('makeMopinionRequest', () => {
	it('sends the signed token and the version header', async () => {
		respond({ _meta: { code: 200 } });

		await makeMopinionRequest(callContext({ key: 'pk:st' }), {
			method: 'GET',
			path: '/account',
			query: { page: 2 },
			replayable: true,
		});

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://api.mopinion.com/account?page=2');
		const headers = new Headers(init.headers);
		// The signature covers the path without the query.
		expect(headers.get('x-auth-token')).toBe(
			mopinionAuthToken('pk', 'st', '/account', ''),
		);
		expect(headers.get('version')).toBe('3.0.0');
	});

	it('signs a POST body exactly as serialized', async () => {
		respond({ _meta: { code: 201 } });

		await makeMopinionRequest(callContext({ key: 'pk:st' }), {
			method: 'POST',
			path: '/reports',
			body: { name: 'My new report', language: 'en' },
		});

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(init.body).toBe('{"name":"My new report","language":"en"}');
		expect(new Headers(init.headers).get('x-auth-token')).toBe(
			mopinionAuthToken(
				'pk',
				'st',
				'/reports',
				'{"name":"My new report","language":"en"}',
			),
		);
	});

	it('wraps an RFC 7807 401 with its error_code and type', async () => {
		respond(invalidCredentialsProblem, 401, 'application/problem+json');

		const error = await makeMopinionRequest(callContext(), {
			method: 'GET',
			path: '/account',
			replayable: true,
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(MopinionAPIError);
		expect(error).toMatchObject({
			status: 401,
			errorCode: 18,
			replayable: true,
		});
		expect((error as MopinionAPIError).message).toContain(
			'The credentials you provided are not valid',
		);
	});

	it('carries 422 details on the error', async () => {
		respond(validationProblem, 422, 'application/problem+json');

		const error = await makeMopinionRequest(callContext(), {
			method: 'GET',
			path: '/reports/1/feedback',
		}).catch((caught: unknown) => caught);

		expect(error).toMatchObject({ status: 422, errorCode: 30 });
		expect((error as MopinionAPIError).details).toBeDefined();
	});

	it('never prints a credential in the error message or JSON', async () => {
		respond(invalidCredentialsProblem, 401, 'application/problem+json');

		const error = await makeMopinionRequest(
			callContext({ key: 'topsecret:signature' }),
			{ method: 'GET', path: '/account' },
		).catch((caught: unknown) => caught);

		const printed = `${(error as Error).message} ${JSON.stringify(error)}`;
		expect(printed).not.toContain('topsecret');
		expect(printed).not.toContain('signature');
	});

	it('wraps a transport failure with the replay flag', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await makeMopinionRequest(callContext(), {
			method: 'GET',
			path: '/deployments',
			replayable: true,
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(MopinionAPIError);
		expect(error).toMatchObject({ replayable: true, status: undefined });
	});
});

describe('describeMopinionError', () => {
	it('uses the RFC 7807 title with the status and code', () => {
		expect(
			describeMopinionError(401, invalidCredentialsProblem, 'fallback'),
		).toBe('Mopinion 401 18: The credentials you provided are not valid');
	});

	it('falls back when nothing is readable', () => {
		expect(describeMopinionError(500, { unexpected: true }, 'boom')).toBe(
			'Mopinion 500: boom',
		);
	});
});
