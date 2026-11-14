import { logEventFromContext } from 'corsair/core';
import { makeDigicertRequest } from './client';
import { endpoints } from './endpoints';
import {
	generatedDocEndpoints,
	generatedDocTestCases,
} from './endpoints/generated-docs';
import {
	generatedOpenApiOAuthOperationIds,
	generatedOpenApiTestCases,
} from './endpoints/generated-openapi';
import type {
	DigicertContext,
	DigicertKeyBuilderContext,
	DigicertPluginOptions,
} from './index';
import { digicert } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});
jest.mock('./client', () => ({
	...jest.requireActual('./client'),
	makeDigicertRequest: jest.fn(),
}));

const call = jest.mocked(makeDigicertRequest);
const log = jest.mocked(logEventFromContext);

type EndpointContext = Parameters<typeof endpoints.usersList>[0];

function buildCtx(): EndpointContext {
	const ctx: DigicertContext = {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'test-key',
		options: { certCentralRegion: 'us' },
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_expires_at: () => Promise.resolve(null),
			set_expires_at: () => Promise.resolve(),
			get_access_token: () => Promise.resolve('test-oauth-token'),
			set_access_token: () => Promise.resolve(),
			get_refresh_token: () => Promise.resolve(null),
			set_refresh_token: () => Promise.resolve(),
			get_scope: () => Promise.resolve(null),
			set_scope: () => Promise.resolve(),
			get_integration_credentials: () =>
				Promise.resolve({
					client_id: 'client-id',
					client_secret: 'client-secret',
					redirect_url: 'https://example.test/callback',
				}),
			get_api_key: () => Promise.resolve('test-key'),
			set_api_key: () => Promise.resolve(),
			get_digicert_one_api_key: () => Promise.resolve('test-one-key'),
			set_digicert_one_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
	return ctx;
}

beforeEach(() => {
	call.mockReset();
	log.mockReset();
});

describe('DigiCert endpoint requests', () => {
	const ctx = buildCtx();
	it('dispatches every generated OpenAPI route with its documented shape', async () => {
		for (const testCase of generatedOpenApiTestCases) {
			call.mockResolvedValueOnce(testCase.outputExample);
			const result = await testCase.endpoint(ctx, testCase.input);
			expect(result).toEqual(testCase.outputExample);
			expect(call).toHaveBeenLastCalledWith(
				testCase.expected.family,
				testCase.expected.path,
				testCase.expected.public ? undefined : 'test-key',
				expect.objectContaining({
					method: testCase.expected.method,
					path: testCase.input.path,
					query: testCase.input.query,
					public: testCase.expected.public,
				}),
			);
		}
	});

	it('dispatches every sitemap-generated CertCentral and Report Library route', async () => {
		for (const testCase of generatedDocTestCases) {
			call.mockResolvedValueOnce(testCase.outputExample);
			const result = await testCase.endpoint(ctx, testCase.input);
			expect(result).toEqual(testCase.outputExample);
			expect(call).toHaveBeenLastCalledWith(
				testCase.expected.family,
				testCase.expected.path,
				'test-key',
				expect.objectContaining({
					method: testCase.expected.method,
					path: testCase.input.path,
					query: testCase.input.query,
				}),
			);
		}
	});

	it('calls CertCentral user, order, and organization list routes with documented paging queries', async () => {
		call.mockResolvedValueOnce({
			users: [],
			page: { total: 0, limit: 30, offset: 0 },
		});
		await endpoints.usersList(ctx, {
			container_id: 8,
			limit: 30,
			filters: { status: 'active' },
		});
		expect(call.mock.calls[0]).toEqual([
			'certcentral',
			'/user',
			'test-key',
			expect.objectContaining({
				method: 'GET',
				query: { container_id: 8, limit: 30, 'filters[status]': 'active' },
			}),
		]);

		call.mockResolvedValueOnce({
			orders: [],
			page: { total: 0, limit: 25, offset: 0 },
		});
		await endpoints.ordersList(ctx, {
			limit: 25,
			filters: { status: 'issued' },
		});
		expect(call.mock.calls[1]).toEqual([
			'certcentral',
			'/order/certificate',
			'test-key',
			expect.objectContaining({
				method: 'GET',
				query: { limit: 25, 'filters[status]': 'issued' },
			}),
		]);

		call.mockResolvedValueOnce({
			organizations: [],
			page: { total: 0, limit: 25, offset: 0 },
		});
		await endpoints.organizationsList(ctx, {
			include_validation: true,
			limit: 25,
		});
		expect(call.mock.calls[2]).toEqual([
			'certcentral',
			'/organization',
			'test-key',
			expect.objectContaining({
				method: 'GET',
				query: { include_validation: true, limit: 25 },
			}),
		]);
	});

	it('lists intermediates from the CertCentral certificate route', async () => {
		call.mockResolvedValue({ intermediates: [] });
		await expect(endpoints.intermediatesList(ctx, {})).resolves.toEqual({
			intermediates: [],
		});
		expect(call).toHaveBeenCalledWith(
			'certcentral',
			'/certificate/intermediates',
			'test-key',
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('calls Account Manager locales with the separate DigiCert ONE credential', async () => {
		const locales = [{ code: 'en_US', language: 'English' }];
		call.mockResolvedValue(locales);
		await expect(endpoints.accountManagerLocales(ctx, {})).resolves.toEqual(
			locales,
		);
		expect(call).toHaveBeenCalledWith(
			'accountManager',
			'/account/api/v1/locales',
			'test-key',
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('calls the Private CA helper with the separate DigiCert ONE credential', async () => {
		call.mockResolvedValue({ version: '1.2.3' });
		await expect(endpoints.privateCAHelper(ctx, {})).resolves.toEqual({
			version: '1.2.3',
		});
		expect(call).toHaveBeenCalledWith(
			'privateCA',
			'/certificate-authority/api/v1/helper',
			'test-key',
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('adds certificate tags using the TLM service-user credential', async () => {
		call.mockResolvedValue(undefined);
		await expect(
			endpoints.certificateTags(ctx, {
				certificateId: 'cert-123',
				tags: ['reviewed'],
			}),
		).resolves.toBeUndefined();
		expect(call).toHaveBeenCalledWith(
			'trustLifecycle',
			'/mpki/api/v1/certificate/cert-123/tag',
			'test-key',
			expect.objectContaining({ method: 'POST', body: { tags: ['reviewed'] } }),
		);
	});

	it('verifies a Private CA template using the DigiCert ONE credential', async () => {
		call.mockResolvedValue(undefined);
		const template = '{"name":"TLS"}';
		await expect(
			endpoints.verifyTemplate(ctx, { template }),
		).resolves.toBeUndefined();
		expect(call).toHaveBeenCalledWith(
			'privateCA',
			'/certificate-authority/api/v1/template/verify',
			'test-key',
			expect.objectContaining({ method: 'POST', body: { template } }),
		);
	});

	it('uses Report Library paths and parameters for names, types, history, and details', async () => {
		call.mockResolvedValueOnce({ report_names: ['Quarterly'] });
		await endpoints.reportNames(ctx, { report_display_name: 'Quarter' });
		expect(call.mock.calls[0]).toEqual([
			'reportLibrary',
			'/report/names',
			'test-key',
			expect.objectContaining({
				method: 'GET',
				query: { report_display_name: 'Quarter' },
			}),
		]);

		call.mockResolvedValueOnce({ report_types: [] });
		await endpoints.reportTypes(ctx, { language_id: 1 });
		expect(call.mock.calls[1]?.[1]).toBe('/report/types');

		call.mockResolvedValueOnce({
			page: { total: 0, limit: 100, offset: 0 },
			report_history: [],
		});
		await endpoints.reportHistory(ctx, { limit: 100, status: 'READY' });
		expect(call.mock.calls[2]?.[1]).toBe('/report/history');

		const report = {
			report_display_name: 'Quarterly',
			report_identifier: '00000000-0000-4000-8000-000000000001',
			created_by_user_id: 1,
			created_by_user_name: 'user',
			created_date: '2026-01-01 00:00:00',
			report_metadata: {
				report_type: 'orders',
				columns: [{ identifier: 'order_id' }],
			},
			schedule: { frequency: 'ON_DEMAND' },
			format: ['CSV'],
			status: 'ACTIVE',
		};
		call.mockResolvedValueOnce({ report });
		await endpoints.reportDetails(ctx, {
			reportIdentifier: report.report_identifier,
		});
		expect(call.mock.calls[3]?.[1]).toBe(`/report/${report.report_identifier}`);
	});

	it('routes an OpenAPI-generated Account Manager operation through its family host', async () => {
		call.mockResolvedValueOnce([{ id: 'api-token-1', name: 'automation' }]);
		await endpoints.accountManagerApi.listApiTokens(ctx, {
			query: { user_id: 'user-123' },
		});
		expect(call).toHaveBeenCalledWith(
			'accountManager',
			'/account/api/v1/api-access-token',
			'test-key',
			expect.objectContaining({
				method: 'GET',
				query: { user_id: 'user-123' },
			}),
		);
	});

	it('encodes both documented Custom Reports GraphQL query modes on the same route', async () => {
		call.mockResolvedValue({
			data: { order_details: [{ id: '123', status: 'issued' }] },
		});
		await endpoints.customReportOrders(ctx, {
			fields: ['id', 'status'],
			status: 'issued',
			container_id: '8',
			organization_id: '112233',
			user_id: 'user-123',
			limit: 5,
		});
		expect(call.mock.calls[0]).toEqual([
			'certcentral',
			'/reports/query',
			'test-key',
			expect.objectContaining({
				method: 'POST',
				body: {
					query:
						'{order_details(status:"issued",container_id:"8",organization_id:"112233",user_id:"user-123",limit:5){id status}}',
				},
			}),
		]);
		call.mockResolvedValue({
			data: { order_details_by_id: { id: '123', status: 'issued' } },
		});
		await endpoints.customReportOrderById(ctx, {
			id: 123,
			fields: ['id', 'status'],
		});
		expect(call.mock.calls[1]?.[1]).toBe('/reports/query');
		expect(call.mock.calls[1]?.[3]).toMatchObject({
			body: { query: '{order_details_by_id(id:123){id status}}' },
		});
	});

	it('calls the public TLM version route without a credential', async () => {
		call.mockResolvedValue({ version: '1.2893.0' });
		await endpoints.trustLifecycleVersion(ctx, {});
		expect(call).toHaveBeenCalledWith(
			'trustLifecycle',
			'/mpki/api/v1/version',
			undefined,
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('calls public CSC v0 and v1 info routes without credentials', async () => {
		call.mockResolvedValue({
			lang: 'en-US',
			name: 'CSC service',
			methods: [],
			authType: [],
		});
		await endpoints.contentTrustInfoV0(ctx, { lang: 'en-US' });
		await endpoints.contentTrustInfoV1(ctx, { lang: 'en-US' });
		expect(call.mock.calls[0]).toEqual([
			'contentTrust',
			'/csc/v0/info',
			undefined,
			expect.objectContaining({ method: 'POST', body: { lang: 'en-US' } }),
		]);
		expect(call.mock.calls[1]).toEqual([
			'contentTrust',
			'/csc/v1/info',
			undefined,
			expect.objectContaining({ method: 'POST', body: { lang: 'en-US' } }),
		]);
	});

	it('resolves CertCentral and DigiCert ONE credentials separately', async () => {
		const plugin = digicert();
		const base = {
			authType: 'api_key' as const,
			options: {},
			tenantId: 'tenant',
			keys: {
				get_dek: () => Promise.resolve('dek'),
				issue_new_dek: () => Promise.resolve('dek'),
				get_expires_at: () => Promise.resolve(null),
				set_expires_at: () => Promise.resolve(),
				get_access_token: () => Promise.resolve('test-oauth-token'),
				set_access_token: () => Promise.resolve(),
				get_refresh_token: () => Promise.resolve(null),
				set_refresh_token: () => Promise.resolve(),
				get_scope: () => Promise.resolve(null),
				set_scope: () => Promise.resolve(),
				get_integration_credentials: () =>
					Promise.resolve({
						client_id: 'client-id',
						client_secret: 'client-secret',
						redirect_url: 'https://example.test/callback',
					}),
				get_api_key: () => Promise.resolve('certcentral-key'),
				set_api_key: () => Promise.resolve(),
				get_digicert_one_api_key: () => Promise.resolve('one-token'),
				set_digicert_one_api_key: () => Promise.resolve(),
				get_webhook_signature: () => Promise.resolve(null),
				set_webhook_signature: () => Promise.resolve(),
			},
		} satisfies Omit<DigicertKeyBuilderContext, 'meteredOperationId'>;
		const certCentralContext: DigicertKeyBuilderContext = {
			...base,
			meteredOperationId: 'users.list',
		};
		const oneContext: DigicertKeyBuilderContext = {
			...base,
			meteredOperationId: 'accountManager.locales',
		};
		const generatedOneContext: DigicertKeyBuilderContext = {
			...base,
			meteredOperationId: 'accountManagerApi.listApiTokens',
		};
		const oauthContext: DigicertKeyBuilderContext = {
			...base,
			authType: 'oauth_2',
			meteredOperationId: generatedOpenApiOAuthOperationIds[1],
		};
		const keyBuilder = plugin.keyBuilder;
		if (!keyBuilder) throw new Error('DigiCert key builder missing');
		expect(plugin.oauthConfig).toMatchObject({
			authUrl: 'https://one.digicert.com/imauth/oauth2/authorize',
			tokenUrl: 'https://one.digicert.com/imauth/oauth2/token',
			scopes: ['service'],
		});
		expect(await keyBuilder(certCentralContext, 'endpoint')).toBe(
			'certcentral-key',
		);
		expect(await keyBuilder(oneContext, 'endpoint')).toBe('one-token');
		expect(await keyBuilder(generatedOneContext, 'endpoint')).toBe('one-token');
		expect(await keyBuilder(oauthContext, 'endpoint')).toBe('test-oauth-token');
	});

	it('refreshes an expired Content Trust access token before using it', async () => {
		const setAccessToken = jest.fn(() => Promise.resolve());
		const keys = {
			get_dek: () => Promise.resolve('dek'),
			issue_new_dek: () => Promise.resolve('dek'),
			get_expires_at: () => Promise.resolve('1'),
			set_expires_at: () => Promise.resolve(),
			get_access_token: () => Promise.resolve('expired-access-token'),
			set_access_token: setAccessToken,
			get_refresh_token: () => Promise.resolve('refresh-token'),
			set_refresh_token: () => Promise.resolve(),
			get_scope: () => Promise.resolve(null),
			set_scope: () => Promise.resolve(),
			get_integration_credentials: () =>
				Promise.resolve({
					client_id: 'client-id',
					client_secret: 'client-secret',
					redirect_url: 'https://example.test/callback',
				}),
			get_api_key: () => Promise.resolve('certcentral-key'),
			set_api_key: () => Promise.resolve(),
			get_digicert_one_api_key: () => Promise.resolve('one-token'),
			set_digicert_one_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		};
		const originalFetch = global.fetch;
		global.fetch = jest.fn(
			async () =>
				new Response(
					JSON.stringify({
						access_token: 'refreshed-access-token',
						expires_in: 3600,
						refresh_token: 'rotated-refresh-token',
					}),
					{
						status: 200,
						headers: { 'Content-Type': 'application/json' },
					},
				),
		) as typeof fetch;
		try {
			const plugin = digicert();
			const keyBuilder = plugin.keyBuilder;
			if (!keyBuilder) throw new Error('DigiCert key builder missing');
			await expect(
				keyBuilder(
					{
						authType: 'oauth_2',
						options: {},
						tenantId: 'tenant-refresh',
						meteredOperationId: generatedOpenApiOAuthOperationIds[1],
						keys,
					},
					'endpoint',
				),
			).resolves.toBe('refreshed-access-token');
			expect(global.fetch).toHaveBeenCalledWith(
				'https://one.digicert.com/imauth/oauth2/token',
				expect.objectContaining({ method: 'POST' }),
			);
			expect(setAccessToken).toHaveBeenCalledWith('refreshed-access-token');
		} finally {
			global.fetch = originalFetch;
		}
	});

	it('requests the token from the configured DigiCert ONE region', async () => {
		const setAccessToken = jest.fn(() => Promise.resolve());
		const keys = {
			get_dek: () => Promise.resolve('dek'),
			issue_new_dek: () => Promise.resolve('dek'),
			get_expires_at: () => Promise.resolve('1'),
			set_expires_at: () => Promise.resolve(),
			get_access_token: () => Promise.resolve('expired-access-token'),
			set_access_token: setAccessToken,
			get_refresh_token: () => Promise.resolve('refresh-token'),
			set_refresh_token: () => Promise.resolve(),
			get_scope: () => Promise.resolve(null),
			set_scope: () => Promise.resolve(),
			get_integration_credentials: () =>
				Promise.resolve({
					client_id: 'client-id',
					client_secret: 'client-secret',
					redirect_url: 'https://example.test/callback',
				}),
			get_api_key: () => Promise.resolve('certcentral-key'),
			set_api_key: () => Promise.resolve(),
			get_digicert_one_api_key: () => Promise.resolve('one-token'),
			set_digicert_one_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		};
		const originalFetch = global.fetch;
		global.fetch = jest.fn(
			async () =>
				new Response(
					JSON.stringify({
						access_token: 'refreshed-access-token',
						expires_in: 3600,
						refresh_token: 'rotated-refresh-token',
					}),
					{
						status: 200,
						headers: { 'Content-Type': 'application/json' },
					},
				),
		) as typeof fetch;
		try {
			const regionOptions: DigicertPluginOptions = { digicertOneRegion: 'nl' };
			const plugin = digicert(regionOptions);
			expect(plugin.oauthConfig).toMatchObject({
				authUrl: 'https://one.nl.digicert.com/imauth/oauth2/authorize',
				tokenUrl: 'https://one.nl.digicert.com/imauth/oauth2/token',
			});
			const keyBuilder = plugin.keyBuilder;
			if (!keyBuilder) throw new Error('DigiCert key builder missing');
			await expect(
				keyBuilder(
					{
						authType: 'oauth_2',
						options: {},
						tenantId: 'tenant-region',
						meteredOperationId: generatedOpenApiOAuthOperationIds[1],
						keys,
					},
					'endpoint',
				),
			).resolves.toBe('refreshed-access-token');
			expect(global.fetch).toHaveBeenCalledWith(
				'https://one.nl.digicert.com/imauth/oauth2/token',
				expect.objectContaining({ method: 'POST' }),
			);
			expect(setAccessToken).toHaveBeenCalledWith('refreshed-access-token');
		} finally {
			global.fetch = originalFetch;
		}
	});

	it('downloads a private CA certificate as a byte array', async () => {
		const bytes = [0x30, 0x82, 0x01, 0xff, 0x00];
		call.mockResolvedValueOnce(bytes);
		await expect(
			endpoints.privateCAApi.getDownloadACa(ctx, { path: { id: 'ca-1' } }),
		).resolves.toEqual(bytes);
		expect(call).toHaveBeenCalledWith(
			'privateCA',
			'/certificate-authority/api/v1/ca/{id}/download',
			'test-key',
			expect.objectContaining({
				method: 'GET',
				binary: true,
				path: { id: 'ca-1' },
			}),
		);
	});

	// SCEP carries a binary PKCS#7 message both ways, so the request goes out as
	// application/x-pki-message bytes and the reply comes back as bytes.
	it('sends a SCEP PKI operation as x-pki-message bytes and reads bytes back', async () => {
		const reply = [0x30, 0x80, 0x06, 0x09];
		call.mockResolvedValueOnce(reply);
		await expect(
			endpoints.privateCAApi.postHandleScepPkiOperation(ctx, {
				path: { profileID: 'profile-1' },
				body: [0x30, 0x82, 0x01],
			}),
		).resolves.toEqual(reply);
		expect(call).toHaveBeenLastCalledWith(
			'privateCA',
			'/certificate-authority/api/v1/scep/{profileID}',
			'test-key',
			expect.objectContaining({
				mediaType: 'application/x-pki-message',
				binary: true,
				body: expect.any(Blob),
			}),
		);
	});

	// EST (RFC 7030) answers with a PKCS#7 certificate payload, and enrollment
	// sends a PKCS#10 request.
	it.each([
		['handleGetCaCertsOperationUsingGet', undefined],
		['handleSimpleEnrollOperationUsingPost', 'application/pkcs10'],
		['handleSimpleReEnrollOperationUsingPost', 'application/pkcs10'],
	] as const)(
		'returns the EST %s certificate payload as bytes',
		async (operation, mediaType) => {
			const reply = [0x4d, 0x49, 0x49];
			call.mockResolvedValueOnce(reply);
			const input =
				mediaType === undefined
					? { path: { profileId: 'profile-1' } }
					: { path: { profileId: 'profile-1' }, body: 'MIIBCSR' };
			await expect(
				endpoints.trustLifecycleApi[operation](ctx, input),
			).resolves.toEqual(reply);
			expect(call).toHaveBeenLastCalledWith(
				'trustLifecycle',
				expect.stringContaining('/.well-known/est/'),
				'test-key',
				expect.objectContaining({ binary: true, mediaType }),
			);
		},
	);

	// Top-level fields DigiCert's own examples always send stay required, so a
	// call without them fails before it reaches DigiCert.
	it.each(['sendInvite', 'addUserAddUser', 'changeDcvMethod'] as const)(
		'rejects %s without its required fields',
		async (operation) => {
			await expect(
				generatedDocEndpoints.certcentralApi[operation](
					ctx,
					// @ts-expect-error the required body fields are left out on purpose
					{ body: {} },
				),
			).rejects.toThrow();
			expect(call).not.toHaveBeenCalled();
		},
	);

	// DigiCert's Swiss order examples send `requester` as an object (name, email,
	// telephone, job title, type), even though the parameter table says string.
	it.each([
		'orderSwissQualifiedCertificateForIndividualInOrganisation',
		'orderSwissQualifiedCertificateForIndividual',
		'orderSwissRegulatedCertificateForIndividualInOrganisation',
		'orderSwissRegulatedCertificateForIndividual',
		'orderSwissRegulatedCertificateForOrganisation',
	] as const)('accepts an object requester on %s', async (operation) => {
		call.mockResolvedValueOnce({ id: 1 });
		await expect(
			generatedDocEndpoints.certcentralApi[operation](ctx, {
				body: {
					requester: {
						first_name: 'Valentina',
						last_name: 'Franklin',
						email: 'requester@example.com',
						telephone: '+41 848 888 888',
						job_title: 'Certificate Requester',
						type: 'existing_contact',
					},
				},
			}),
		).resolves.toEqual({ id: 1 });
	});

	// The reference tables list child fields (credit card, certificate, address)
	// next to their parents. A correctly nested order without a card must pass.
	it('accepts a nested CertCentral order without a credit card', async () => {
		call.mockResolvedValueOnce({ id: 1 });
		await expect(
			generatedDocEndpoints.certcentralApi.orderBasicOv(ctx, {
				body: {
					certificate: {
						common_name: 'example.com',
						csr: '-----BEGIN CERTIFICATE REQUEST-----',
						signature_hash: 'sha256',
					},
					organization: { id: 1 },
					order_validity: { years: 1 },
					payment_method: 'balance',
				},
			}),
		).resolves.toEqual({ id: 1 });
	});

	it('downloads Report Library files through the binary response path', async () => {
		const bytes = [0x50, 0x4b, 0x03, 0x04, 0xff];
		call.mockResolvedValueOnce(bytes);
		const reportIdentifier = '00000000-0000-4000-8000-000000000001';
		const reportRunIdentifier = '00000000-0000-4000-8000-000000000002';
		await expect(
			generatedDocEndpoints.reportLibraryApi.downloadReport(ctx, {
				path: {
					report_identifier: reportIdentifier,
					report_run_identifier: reportRunIdentifier,
				},
				query: { report_format: 'EXCEL' },
			}),
		).resolves.toEqual(bytes);
		expect(call).toHaveBeenCalledWith(
			'reportLibrary',
			'/report/{report_identifier}/{report_run_identifier}/download',
			'test-key',
			expect.objectContaining({
				method: 'GET',
				binary: true,
				path: {
					report_identifier: reportIdentifier,
					report_run_identifier: reportRunIdentifier,
				},
				query: { report_format: 'EXCEL' },
			}),
		);
	});

	it('uses a Bearer access token for CSC routes that document OAuth2', async () => {
		const testCase = generatedOpenApiTestCases.find(
			(entry) => entry.id === generatedOpenApiOAuthOperationIds[1],
		);
		if (!testCase) throw new Error('CSC OAuth operation test case missing');
		call.mockResolvedValueOnce(testCase.outputExample);
		const oauthCtx: DigicertContext = {
			...ctx,
			key: 'test-oauth-token',
			options: { authType: 'oauth_2' },
		};
		await testCase.endpoint(oauthCtx, testCase.input);
		expect(call).toHaveBeenLastCalledWith(
			'contentTrust',
			testCase.expected.path,
			'test-oauth-token',
			expect.objectContaining({ authScheme: 'oauth_2' }),
		);
	});

	it('rejects invalid requests before network or event logging', async () => {
		await expect(endpoints.usersList(ctx, { limit: -1 })).rejects.toThrow();
		const invalidOrderInput = {
			filters: { status: 'issued' as const },
			undocumented: true,
		};
		await expect(
			endpoints.ordersList(ctx, invalidOrderInput),
		).rejects.toThrow();
		await expect(
			endpoints.organizationsList(ctx, { limit: 1001 }),
		).rejects.toThrow();
		await expect(
			endpoints.contentTrustInfoV0(ctx, { lang: '' }),
		).rejects.toThrow();
		await expect(
			endpoints.contentTrustInfoV1(ctx, { lang: '' }),
		).rejects.toThrow();
		expect(call).not.toHaveBeenCalled();
		expect(log).not.toHaveBeenCalled();
	});

	it('logs only safe list counts, never request filters', async () => {
		call.mockResolvedValue({
			users: [],
			page: { total: 0, limit: 10, offset: 0 },
		});
		await endpoints.usersList(ctx, {
			filters: { search: 'sensitive-domain.test' },
		});
		expect(log).toHaveBeenCalledWith(
			ctx,
			'digicert.users.list',
			{ count: 0 },
			'completed',
		);
		expect(JSON.stringify(log.mock.calls[0]?.[2])).not.toContain(
			'sensitive-domain.test',
		);
	});

	it('sends CertCentral ids as path parameters instead of the reference example ids', async () => {
		const literalRoutes = generatedDocTestCases
			.map((testCase) => testCase.expected.path)
			.filter((path) => /\/\d{3,}(\/|$)|[<>]/.test(path));
		expect(literalRoutes).toEqual([]);

		call.mockResolvedValueOnce(undefined);
		await generatedDocEndpoints.certcentralApi.cancelUnitOrder(ctx, {
			path: { order_id: '987' },
		});
		expect(call).toHaveBeenLastCalledWith(
			'certcentral',
			'/units/order/{order_id}/cancel',
			'test-key',
			expect.objectContaining({ method: 'PUT', path: { order_id: '987' } }),
		);

		call.mockResolvedValueOnce(undefined);
		await generatedDocEndpoints.certcentralApi.deleteVerifiedContactDelegation(
			ctx,
			{ path: { delegation_id: '55' } },
		);
		expect(call).toHaveBeenLastCalledWith(
			'certcentral',
			'/user/delegation/{delegation_id}',
			'test-key',
			expect.objectContaining({
				method: 'DELETE',
				path: { delegation_id: '55' },
			}),
		);
	});

	it('deletes an order on the order route, not the note route', async () => {
		call.mockResolvedValueOnce(undefined);
		await generatedDocEndpoints.certcentralApi.deleteOrderDeleteOrder(ctx, {
			path: { order_id: '42' },
			query: { revoke: true },
		});
		expect(call).toHaveBeenLastCalledWith(
			'certcentral',
			'/order/certificate/{order_id}',
			'test-key',
			expect.objectContaining({
				method: 'DELETE',
				path: { order_id: '42' },
				query: { revoke: true },
			}),
		);
	});
});
