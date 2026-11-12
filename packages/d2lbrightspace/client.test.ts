import { createHmac } from 'node:crypto';
import { AuthMissingError } from 'corsair/core';
import {
	D2lBrightspaceAPIError,
	makeD2lBrightspaceRequest,
	normalizeD2lBrightspaceUrl,
} from './client';
import type { D2lJsonValue } from './endpoints/types';
import type {
	D2lBrightspaceKeyBuilderContext,
	D2lBrightspacePluginOptions,
} from './index';
import { d2lBrightspace } from './index';
import { D2L_ROUTES } from './route-definitions';

function findRoute(routePath: string) {
	const route = D2L_ROUTES.find((entry) => entry.path === routePath);
	if (!route) throw new Error(`Missing official route ${routePath}`);
	return route;
}

function findRouteById(routeId: string) {
	const route = D2L_ROUTES.find((entry) => entry.routeId === routeId);
	if (!route) throw new Error(`Missing official route ${routeId}`);
	return route;
}

function jsonResponse(
	data: D2lJsonValue,
	status = 200,
	headers: Record<string, string> = {},
): Response {
	return new Response(JSON.stringify(data), {
		status,
		headers: { 'Content-Type': 'application/json', ...headers },
	});
}

function makeLegacyKeyContext(
	meteredOperationId: string,
): Extract<D2lBrightspaceKeyBuilderContext, { authType: 'api_key' }> {
	const missingField = jest.fn(async () => null);
	return {
		authType: 'api_key',
		options: { authType: 'api_key', baseUrl: 'https://tenant.test' },
		tenantId: 'tenant',
		meteredOperationId,
		keys: {
			get_dek: async () => 'dek',
			issue_new_dek: async () => 'dek',
			get_api_key: missingField,
			set_api_key: async () => {},
			get_webhook_signature: missingField,
			set_webhook_signature: async () => {},
			get_application_id: missingField,
			set_application_id: async () => {},
			get_user_id: missingField,
			set_user_id: async () => {},
			get_user_key: missingField,
			set_user_key: async () => {},
			get_brightspace_url: missingField,
			set_brightspace_url: async () => {},
		},
	};
}

describe('D2L Brightspace transport and authentication', () => {
	afterEach(() => jest.restoreAllMocks());

	it('uses a Bearer token for the documented OAuth 2 auth-code scheme', async () => {
		const route = findRoute('/d2l/api/lp/(version)/users/whoami');
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(jsonResponse({ Identifier: '1' }));
		await makeD2lBrightspaceRequest(
			route,
			{ pathParams: { version: '1.49' } },
			'https://lms.test',
			{ kind: 'oauth_2', accessToken: 'oauth-secret-test-value' },
		);
		const requestInit = fetchMock.mock.calls[0]?.[1];
		const headers = new Headers(requestInit?.headers);
		expect(headers.get('authorization')).toBe('Bearer oauth-secret-test-value');
		expect(headers.get('accept')).toBe('application/json');
	});

	it('creates the documented legacy ID-Key HMAC signatures without sending key material', async () => {
		const route = findRoute('/d2l/api/lp/(version)/users/whoami');
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(jsonResponse({ Identifier: '1' }));
		const nowSeconds = Math.floor(Date.now() / 1000);
		await makeD2lBrightspaceRequest(
			route,
			{ pathParams: { version: '1.49' } },
			'https://lms.test',
			{
				kind: 'api_key',
				applicationId: 'application-id',
				applicationKey: 'application-secret',
				userId: 'user-id',
				userKey: 'user-secret',
			},
		);
		const requestUrl = new URL(String(fetchMock.mock.calls[0]?.[0]));
		const baseString = `GET&/d2l/api/lp/1.49/users/whoami&${nowSeconds}`;
		const expectedAppSig = createHmac('sha256', 'application-secret')
			.update(baseString, 'utf8')
			.digest('base64url');
		const expectedUserSig = createHmac('sha256', 'user-secret')
			.update(baseString, 'utf8')
			.digest('base64url');
		expect(requestUrl.searchParams.get('x_a')).toBe('application-id');
		expect(requestUrl.searchParams.get('x_b')).toBe('user-id');
		expect(requestUrl.searchParams.get('x_c')).toBe(expectedAppSig);
		expect(requestUrl.searchParams.get('x_d')).toBe(expectedUserSig);
		expect(requestUrl.searchParams.get('x_t')).toBe(String(nowSeconds));
		expect(requestUrl.searchParams.has('application-secret')).toBe(false);
		expect(requestUrl.searchParams.has('user-secret')).toBe(false);
	});

	it('leaves documented public version routes keyless', async () => {
		const route = findRoute('/d2l/api/versions/');
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(jsonResponse([]));
		await makeD2lBrightspaceRequest(
			route,
			{ pathParams: {} },
			'https://lms.test',
			{ kind: 'public' },
		);
		const requestInit = fetchMock.mock.calls[0]?.[1];
		const requestUrl = new URL(String(fetchMock.mock.calls[0]?.[0]));
		expect(requestInit?.headers).not.toHaveProperty('Authorization');
		expect(requestUrl.search).toBe('');
	});

	it('throws Corsair AuthMissingError for incomplete legacy ID-Key credentials', async () => {
		const options: D2lBrightspacePluginOptions = {
			authType: 'api_key',
			baseUrl: 'https://tenant.test',
		};
		const plugin = d2lBrightspace(options);
		if (!plugin.keyBuilder)
			throw new Error('D2L keyBuilder was not configured.');
		await expect(
			plugin.keyBuilder(
				makeLegacyKeyContext('learningPlatform.getUsers'),
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('resolves public version routes before reading authentication fields', async () => {
		const options: D2lBrightspacePluginOptions = {
			authType: 'api_key',
			baseUrl: 'https://tenant.test',
		};
		const plugin = d2lBrightspace(options);
		if (!plugin.keyBuilder)
			throw new Error('D2L keyBuilder was not configured.');
		const context = makeLegacyKeyContext('apiProperties.getVersions');
		await expect(plugin.keyBuilder(context, 'endpoint')).resolves.toBe('');
		expect(context.keys.get_brightspace_url).not.toHaveBeenCalled();
		expect(context.keys.get_api_key).not.toHaveBeenCalled();
	});

	it.each([
		'http://lms.test',
		'https://user:password@lms.test',
		'https://lms.test/d2l',
		'https://lms.test?token=secret',
	])('rejects unsafe or non-origin Brightspace URL %s', (url) => {
		expect(() => normalizeD2lBrightspaceUrl(url)).toThrow();
	});

	it('preserves Retry-After milliseconds and sanitizes the propagated error', async () => {
		const route = findRoute('/d2l/api/lp/(version)/users/whoami');
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response('secret echo', {
				status: 429,
				headers: { 'Retry-After': '4' },
			}),
		);
		const error = await makeD2lBrightspaceRequest(
			route,
			{ pathParams: { version: '1.49' } },
			'https://lms.test',
			{ kind: 'oauth_2', accessToken: 'token-not-for-logs' },
		).catch((caught: unknown) => {
			// `unknown` because a rejected request can throw any JavaScript value.
			return caught;
		});
		expect(error).toBeInstanceOf(D2lBrightspaceAPIError);
		if (error instanceof Error) {
			expect(error.message).not.toContain('secret echo');
		}
		if (error instanceof D2lBrightspaceAPIError) {
			expect(error.retryAfter).toBe(4_000);
		}
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('uses the bounded timeout on requests', async () => {
		const route = findRoute('/d2l/api/lp/(version)/users/whoami');
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(jsonResponse({ Identifier: '1' }));
		await makeD2lBrightspaceRequest(
			route,
			{ pathParams: { version: '1.49' } },
			'https://lms.test',
			{ kind: 'oauth_2', accessToken: 'token' },
			3_000,
		);
		expect(fetchMock.mock.calls[0]?.[1]?.signal).toBeDefined();
	});

	it('returns bounded, byte-safe base64 for documented binary responses', async () => {
		const route = findRouteById('d2l0018');
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(new Uint8Array([0, 255, 1]), {
				status: 200,
				headers: { 'Content-Type': 'application/pdf' },
			}),
		);
		const result = await makeD2lBrightspaceRequest(
			route,
			{ pathParams: { version: '1.4', issuedId: '1' } },
			'https://lms.test',
			{ kind: 'oauth_2', accessToken: 'token' },
		);
		expect(result).toEqual({
			kind: 'binary',
			contentType: 'application/pdf',
			base64: 'AP8B',
			sizeBytes: 3,
		});
		expect(fetchMock.mock.calls[0]?.[1]?.redirect).toBe('manual');
	});

	it('follows same-origin binary redirects while refusing cross-origin redirects', async () => {
		const route = findRouteById('d2l0018');
		const sameOriginFetch = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(
				new Response('', {
					status: 302,
					headers: { Location: '/download/certificate.pdf' },
				}),
			)
			.mockResolvedValueOnce(
				new Response(new Uint8Array([1]), {
					status: 200,
					headers: { 'Content-Type': 'application/pdf' },
				}),
			);
		await makeD2lBrightspaceRequest(
			route,
			{ pathParams: { version: '1.4', issuedId: '1' } },
			'https://lms.test',
			{ kind: 'oauth_2', accessToken: 'token' },
		);
		expect(sameOriginFetch).toHaveBeenCalledTimes(2);
		expect(
			new Headers(sameOriginFetch.mock.calls[1]?.[1]?.headers).get(
				'authorization',
			),
		).toBe('Bearer token');

		const crossOriginFetch = sameOriginFetch.mockReset().mockResolvedValue(
			new Response('', {
				status: 302,
				headers: { Location: 'https://files.other.test/file.pdf' },
			}),
		);
		await expect(
			makeD2lBrightspaceRequest(
				route,
				{ pathParams: { version: '1.4', issuedId: '1' } },
				'https://lms.test',
				{ kind: 'oauth_2', accessToken: 'token' },
			),
		).rejects.toThrow('cross-origin file redirect');
		expect(crossOriginFetch).toHaveBeenCalledTimes(1);
	});

	it('rejects binary bodies over the documented package safety cap', async () => {
		const route = findRouteById('d2l0018');
		jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(new Uint8Array([1]), {
				status: 200,
				headers: { 'Content-Length': String(26 * 1024 * 1024) },
			}),
		);
		await expect(
			makeD2lBrightspaceRequest(
				route,
				{ pathParams: { version: '1.4', issuedId: '1' } },
				'https://lms.test',
				{ kind: 'oauth_2', accessToken: 'token' },
			),
		).rejects.toThrow('safety limit');
	});

	it('parses documented mixed folder-or-file locker responses as JSON when appropriate', async () => {
		const route = findRouteById('d2l0374');
		jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(jsonResponse({ Name: 'folder', IsFolder: true }));
		const result = await makeD2lBrightspaceRequest(
			route,
			{
				pathParams: {
					version: '1.0',
					orgUnitId: '1',
					groupId: '1',
					path: 'folder/',
				},
			},
			'https://lms.test',
			{ kind: 'oauth_2', accessToken: 'token' },
		);
		expect(result).toEqual({ Name: 'folder', IsFolder: true });
	});

	it('completes documented resumable upload stages and exposes file keys for attach routes', async () => {
		const routes = D2L_ROUTES.filter(
			(route) => route.requestMode === 'resumable',
		);
		expect(routes).toHaveLength(5);
		for (const route of routes) {
			let callIndex = 0;
			const fetchMock = jest
				.spyOn(globalThis, 'fetch')
				.mockImplementation(async (input, init) => {
					const url = new URL(String(input));
					callIndex += 1;
					if (callIndex === 1) {
						const headers = new Headers(init?.headers);
						expect(headers.get('x-upload-content-type')).toBe(
							'application/zip',
						);
						expect(headers.get('x-upload-content-length')).toBe('7');
						return new Response('', {
							status: 308,
							headers: { Location: '/d2l/upload/file-key' },
						});
					}
					if (url.pathname === '/d2l/upload/file-key') {
						expect(new Headers(init?.headers).get('content-range')).toBe(
							'bytes 0-6/7',
						);
						return new Response('', { status: 200 });
					}
					return jsonResponse({ ObjectId: 7, UploadKey: 'file-key' });
				});
			const input = {
				pathParams: Object.fromEntries(
					route.pathParams.map((name) => [name, '1']),
				),
				...(route.jsonParams.length > 0
					? { body: { ObjectId: 0, FileName: 'fixture.zip' } }
					: {}),
				upload: {
					filename: 'fixture.zip',
					contentType: 'application/zip',
					base64: 'Zml4dHVyZQ==',
				},
			};
			const result = await makeD2lBrightspaceRequest(
				route,
				input,
				'https://lms.test',
				{ kind: 'oauth_2', accessToken: 'upload-token' },
			);
			if (route.routeId === 'd2l0056') {
				expect(result).toEqual({ ObjectId: 7, UploadKey: 'file-key' });
				expect(fetchMock).toHaveBeenCalledTimes(3);
				expect(fetchMock.mock.calls[2]?.[1]?.body).toBe(
					JSON.stringify({
						ObjectId: 0,
						FileName: 'fixture.zip',
						UploadKey: 'file-key',
					}),
				);
			} else {
				expect(result).toEqual({
					kind: 'upload_session',
					fileKey: 'file-key',
					uploadedBytes: 7,
				});
				expect(fetchMock).toHaveBeenCalledTimes(2);
			}
			fetchMock.mockRestore();
		}
	});
});
