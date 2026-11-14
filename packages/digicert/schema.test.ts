import type { endpoints } from './endpoints';
import {
	generatedDocEndpointCount,
	generatedDocEndpointMeta,
	generatedDocEndpointSchemas,
	generatedDocEndpoints,
} from './endpoints/generated-docs';
import {
	generatedOpenApiEndpointCount,
	generatedOpenApiEndpointMeta,
	generatedOpenApiEndpointSchemas,
	generatedOpenApiEndpoints,
} from './endpoints/generated-openapi';
import {
	DigicertEndpointInputSchemas,
	DigicertEndpointOutputSchemas,
} from './endpoints/types';

function collectEndpointPaths(tree: object, prefix = ''): string[] {
	return Object.entries(tree).flatMap(([name, value]) => {
		const path = prefix ? prefix + '.' + name : name;
		return typeof value === 'function'
			? [path]
			: typeof value === 'object' && value !== null
				? collectEndpointPaths(value, path)
				: [];
	});
}

const userRecord = {
	id: 1,
	username: 'jane.doe',
	account_id: 8,
	first_name: 'Jane',
	last_name: 'Doe',
	email: 'jane.doe@example.test',
	status: 'active',
	access_roles: [{ id: 1, name: 'Administrator' }],
	type: 'user',
	has_container_assignments: true,
};

const orderRecord = {
	id: 123,
	status: 'issued',
	certificate: { id: 456, common_name: 'example.test' },
	organization: [],
	container: { id: 8, name: 'Example Inc' },
	product: { name_id: 'ssl_plus', name: 'Secure Site', type: 'ssl' },
};

const organizationRecord = {
	id: 8,
	status: 'active',
	name: 'Example Inc',
	is_active: true,
};

const intermediateRecord = {
	id: '1001',
	subject_common_name: 'Example Intermediate CA',
	subject_org_name: 'Example Inc',
	valid_from: '2021-01-01 00:00:00',
	issuer_common_name: 'Example Root CA',
	status: 'valid',
	valid_to: '2031-01-01',
	serial_number: '01ab',
	thumbprint: 'ff01',
	signature_hash: 'sha256',
	is_private: 'false',
	is_root: 'false',
	pem: '-----BEGIN CERTIFICATE-----',
};

const reportTypeRecord = {
	report_type: 'orders',
	display_name: 'Orders',
	supported_formats: ['CSV', 'JSON'],
	custom_fields_enabled: true,
	sub_account_enabled: true,
	division_enabled: false,
	report_description: 'Certificate order details',
	status: true,
};

const reportHistoryRecord = {
	report_display_name: 'Orders',
	report_identifier: '00000000-0000-4000-8000-000000000001',
	created_by_user_id: 1,
	created_by_user_name: 'jane.doe',
	created_date: '2026-01-01 00:00:00',
	report_type: 'orders',
	report_type_display_name: 'Orders',
	status: 'READY',
};

describe('DigiCert endpoint schemas', () => {
	it('registers input/output schemas for every generated OpenAPI endpoint', () => {
		const endpointPaths = collectEndpointPaths(
			generatedOpenApiEndpoints,
		).sort();
		const schemaPaths = Object.keys(generatedOpenApiEndpointSchemas).sort();
		expect(endpointPaths).toEqual(schemaPaths);
		expect(endpointPaths).toHaveLength(generatedOpenApiEndpointCount);
		expect(generatedOpenApiEndpointCount + generatedDocEndpointCount).toBe(646);
		for (const schemas of Object.values(generatedOpenApiEndpointSchemas)) {
			expect(schemas).toMatchObject({
				// Jest's expect.any is a matcher, not a TypeScript any.
				input: expect.any(Object),
				output: expect.any(Object),
			});
		}
	});

	it('registers input/output schemas for every sitemap-generated route', () => {
		const endpointPaths = collectEndpointPaths(generatedDocEndpoints).sort();
		const schemaPaths = Object.keys(generatedDocEndpointSchemas).sort();
		expect(endpointPaths).toEqual(schemaPaths);
		expect(endpointPaths).toHaveLength(generatedDocEndpointCount);
	});

	it('registers matching input and output schemas for every endpoint', () => {
		expect(Object.keys(DigicertEndpointInputSchemas).sort()).toEqual(
			Object.keys(DigicertEndpointOutputSchemas).sort(),
		);
	});

	it.each([
		['usersList', { limit: 1000, offset: 0 }, { limit: -1 }],
		[
			'ordersList',
			{ filters: { status: 'issued' }, limit: 5000 },
			{ filters: { status: 'made-up' } },
		],
		[
			'organizationsList',
			{ include_validation: true, limit: 1000 },
			{ limit: 1001 },
		],
		['intermediatesList', {}, { undocumented: true }],
		['accountManagerLocales', {}, { undocumented: true }],
		['privateCAHelper', {}, { undocumented: true }],
		[
			'certificateTags',
			{ certificateId: 'cert-123', tags: ['reviewed'] },
			{ certificateId: '', tags: [] },
		],
		['verifyTemplate', { template: '{"name":"TLS"}' }, { template: '' }],
		[
			'reportNames',
			{ report_display_name: 'Quarterly' },
			{ unsupported: true },
		],
		['reportTypes', { language_id: 1 }, { language_id: -1 }],
		['reportHistory', { limit: 50, status: 'READY' }, { limit: 0 }],
		[
			'reportDetails',
			{ reportIdentifier: '00000000-0000-4000-8000-000000000001' },
			{ reportIdentifier: 'invalid' },
		],
		[
			'customReportQuery',
			{
				fields: ['id'],
				container_id: '123',
				organization_id: '112233',
				user_id: 'user-123',
			},
			{ fields: [] },
		],
		[
			'customReportById',
			{ id: 123, fields: ['id'] },
			{ id: 0, fields: ['id'] },
		],
		['trustLifecycleVersion', {}, { undocumented: true }],
		['contentTrustInfoV0', { lang: 'en-US' }, { lang: '' }],
		['contentTrustInfoV1', { lang: 'en-US' }, { lang: '' }],
	] as const)('validates %s inputs', (name, valid, invalid) => {
		expect(DigicertEndpointInputSchemas[name].safeParse(valid).success).toBe(
			true,
		);
		expect(DigicertEndpointInputSchemas[name].safeParse(invalid).success).toBe(
			false,
		);
	});

	it.each([
		[
			'usersList',
			{
				users: [userRecord],
				page: { total: 1, limit: 1000, offset: 0 },
			},
			{ users: [{ id: 1 }], page: { total: 1, limit: 1000, offset: 0 } },
		],
		[
			'ordersList',
			{
				orders: [orderRecord],
				page: { total: 1, limit: 1000, offset: 0 },
			},
			{ orders: [{ id: 123 }], page: { total: 1, limit: 1000, offset: 0 } },
		],
		[
			'organizationsList',
			{
				organizations: [organizationRecord],
				page: { total: 1, limit: 1000, offset: 0 },
			},
			{
				organizations: [{ ...organizationRecord, is_active: 'yes' }],
				page: { total: 1, limit: 1000, offset: 0 },
			},
		],
		[
			'intermediatesList',
			{ intermediates: [intermediateRecord] },
			{ intermediates: [{ id: '1001' }] },
		],
		[
			'accountManagerLocales',
			[{ code: 'en_US', language: 'English' }],
			[{ code: 5, language: 'English' }],
		],
		['privateCAHelper', { version: '1.2.3' }, {}],
		['certificateTags', undefined, {}],
		['verifyTemplate', undefined, {}],
		['reportNames', { report_names: ['Quarterly'] }, {}],
		[
			'reportTypes',
			{ report_types: [reportTypeRecord] },
			{ report_types: [{ report_type: 'orders' }] },
		],
		[
			'reportHistory',
			{
				page: { total: 1, limit: 100, offset: 0 },
				report_history: [reportHistoryRecord],
			},
			{
				page: { total: 1, limit: 100, offset: 0 },
				report_history: [{ report_display_name: 'Orders' }],
			},
		],
		[
			'reportDetails',
			{
				report: {
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
				},
			},
			{},
		],
		[
			'customReportQuery',
			{ data: { order_details: [{ id: '123', status: 'issued' }] } },
			{},
		],
		[
			'customReportById',
			{ data: { order_details_by_id: { id: '123', status: null } } },
			{},
		],
		['trustLifecycleVersion', { version: '1.0.0' }, {}],
		[
			'contentTrustInfoV0',
			{ lang: 'en-US', methods: [], authType: [] },
			{ methods: 'not-an-array' },
		],
		[
			'contentTrustInfoV1',
			{ lang: 'en-US', methods: [], authType: [] },
			{ methods: 'not-an-array' },
		],
	] as const)(
		'parses documented %s responses and rejects invalid responses',
		(name, valid, invalid) => {
			expect(DigicertEndpointOutputSchemas[name].safeParse(valid).success).toBe(
				true,
			);
			expect(
				DigicertEndpointOutputSchemas[name].safeParse(invalid).success,
			).toBe(false);
		},
	);

	it('parses paginated list responses that contain an items array', () => {
		const listSchemas = [
			generatedOpenApiEndpointSchemas[
				'privateCAApi.getGetAllCaCertificateAiaIssuerFiles'
			].output,
			generatedOpenApiEndpointSchemas['privateCAApi.getGetAllCrlInfos'].output,
			generatedOpenApiEndpointSchemas['privateCAApi.getGetAllCertificates']
				.output,
		];
		for (const schema of listSchemas) {
			expect(
				schema.parse({ items: [], limit: 1, offset: 0, total: 0 }),
			).toMatchObject({
				items: [],
			});
			expect(schema.safeParse({ items: { id: 'not-a-list' } }).success).toBe(
				false,
			);
		}
		expect(
			generatedOpenApiEndpointSchemas[
				'privateCAApi.getGetAllCaCertificateAiaIssuerFiles'
			].output.parse({
				items: [{ id: 'file-1', file_name: 'aia.cer' }],
			}),
		).toMatchObject({ items: [{ id: 'file-1' }] });
	});

	it('accepts documented Custom Reports string ID filters', () => {
		const schema = DigicertEndpointInputSchemas.customReportQuery;
		expect(
			schema.safeParse({
				fields: ['id'],
				container_id: '8',
				organization_id: '112233',
				user_id: 'user-123',
			}).success,
		).toBe(true);
		expect(
			schema.safeParse({ fields: ['id'], organization_id: 112233 }).success,
		).toBe(false);
	});

	it('requires generated path parameters and validates report download bytes', () => {
		const moveOrders = generatedDocEndpointSchemas['certcentralApi.moveOrders'];
		expect(
			moveOrders.input.safeParse({
				query: { target_account_id: 1 },
				body: { order_ids: '123' },
			}).success,
		).toBe(false);
		expect(
			moveOrders.input.safeParse({
				path: { target_account_id: 1 },
				query: {},
				body: { order_ids: '123' },
			}).success,
		).toBe(true);

		const startReportRun =
			generatedDocEndpointSchemas['reportLibraryApi.startReportRun'].input;
		expect(startReportRun.safeParse({ path: {}, query: {} }).success).toBe(
			false,
		);
		expect(
			startReportRun.safeParse({
				path: { report_identifier: '00000000-0000-4000-8000-000000000001' },
				query: {},
			}).success,
		).toBe(true);

		const download =
			generatedDocEndpointSchemas['reportLibraryApi.downloadReport'].output;
		expect(download.parse([0, 0x50, 0xff])).toEqual([0, 0x50, 0xff]);
		expect(download.safeParse([256]).success).toBe(false);
	});

	it('keeps report create and edit bodies nested', () => {
		const nestedReport = {
			display_name: 'Example report',
			schedule: {
				frequency: 'MONTHLY',
				repeat_every: 3,
				repeat_on: 'DATE_OF_THE_MONTH',
				repeat_on_date: { date: 5, last_day_of_the_month: false },
			},
			format: ['CSV'],
			report_metadata: {
				report_type: 'orders',
				columns: [{ identifier: 'order_id' }],
			},
		};
		const create =
			generatedDocEndpointSchemas['reportLibraryApi.createReport'].input;
		const edit =
			generatedDocEndpointSchemas['reportLibraryApi.editReport'].input;
		expect(create.parse({ body: nestedReport })).toMatchObject({
			body: nestedReport,
		});
		expect(
			edit.parse({
				path: { report_identifier: '00000000-0000-4000-8000-000000000001' },
				body: nestedReport,
			}),
		).toMatchObject({ body: nestedReport });
		expect(
			create.safeParse({
				body: {
					display_name: 'Example report',
					schedule: { frequency: 'ON_DEMAND' },
					frequency: 'ON_DEMAND',
					format: ['CSV'],
					user_id: 1,
					first_name: 'Jane',
					last_name: 'Doe',
					email: 'jane.doe@example.com',
					report_metadata: { report_type: 'orders' },
					report_type: 'orders',
				},
			}).success,
		).toBe(false);
		expect(
			create.safeParse({
				body: {
					...nestedReport,
					notification_emails: [{ user_id: 1 }],
				},
			}).success,
		).toBe(false);
		expect(
			create.parse({
				body: {
					...nestedReport,
					notification_emails: [
						{
							user_id: 1234567,
							first_name: 'Jane',
							last_name: 'Doe',
							email: 'jane.doe@example.com',
						},
					],
				},
			}),
		).toMatchObject({
			body: {
				notification_emails: [{ email: 'jane.doe@example.com' }],
			},
		});
	});

	it('classifies certificate revocation as destructive by effect', () => {
		expect(
			generatedOpenApiEndpointMeta['privateCAApi.putRevokeCertificate']
				.riskLevel,
		).toBe('destructive');
		expect(
			generatedOpenApiEndpointMeta['privateCAApi.postApproveCaRevokeRequest']
				.riskLevel,
		).toBe('destructive');
		expect(
			generatedOpenApiEndpointMeta['trustLifecycleApi.certRevokeBySerial']
				.riskLevel,
		).toBe('destructive');
		expect(
			generatedOpenApiEndpointMeta['contentTrustApi.revokeCredentials']
				.riskLevel,
		).toBe('destructive');
		expect(
			generatedOpenApiEndpointMeta['contentTrustApi.revokeToken'].riskLevel,
		).toBe('destructive');
		expect(
			generatedDocEndpointMeta['certcentralApi.revokeCertificate'].riskLevel,
		).toBe('destructive');
		expect(
			generatedDocEndpointMeta['certcentralApi.revokeOrderCertificates']
				.riskLevel,
		).toBe('destructive');
		expect(
			generatedOpenApiEndpointMeta['privateCAApi.postCreateCaRevokeRequest']
				.riskLevel,
		).toBe('write');
		expect(
			generatedOpenApiEndpointMeta['privateCAApi.getGetCaRevokeRequest']
				.riskLevel,
		).toBe('read');
	});

	it('classifies POST deletes and bulk tag replacement as destructive', () => {
		for (const id of [
			'trustLifecycleApi.deleteScanUsingPost',
			'trustLifecycleApi.deletePastSystemScanUsingPostpublic',
			'trustLifecycleApi.postBulkReplaceTags',
		] as const) {
			expect(generatedOpenApiEndpointMeta[id].riskLevel).toBe('destructive');
		}
		expect(
			generatedOpenApiEndpointMeta[
				'trustLifecycleApi.getCertificateCountsBySourceTypes'
			].riskLevel,
		).toBe('read');
	});

	it('accepts the live Account Manager locale list, including locales the reference omits', () => {
		// Trimmed from GET /account/api/v1/locales on one.digicert.com (11-13).
		const live = [
			{ code: 'de_DE', language: 'Deutsch' },
			{ code: 'en_US', language: 'English' },
			{ code: 'nl_NL', language: 'Nederlands' },
		];
		expect(
			DigicertEndpointOutputSchemas.accountManagerLocales.parse(live),
		).toEqual(live);
	});

	it('accepts response fields and enum values DigiCert adds later', () => {
		const accounts = [
			{
				id: 'a1',
				type: 'enterprise',
				sign_in_methods: [{ signInMethod: 'passkey', status: 'pending' }],
			},
		];
		expect(
			generatedOpenApiEndpointSchemas[
				'accountManagerApi.listAccounts'
			].output.parse(accounts),
		).toEqual(accounts);
		const version = { version: '1.6522.0', build: 'abc' };
		expect(
			DigicertEndpointOutputSchemas.trustLifecycleVersion.parse(version),
		).toEqual(version);
	});

	it('infers required arguments and result fields from operation schemas', () => {
		type CreateAccountArgs = Parameters<
			typeof endpoints.accountManagerApi.createAccount
		>[1];
		type CreateAccountResult = Awaited<
			ReturnType<typeof endpoints.accountManagerApi.createAccount>
		>;
		type DownloadResult = Awaited<
			ReturnType<typeof endpoints.privateCAApi.getDownloadACa>
		>;
		type Assert<T extends true> = T;
		type Checks = [
			Assert<Record<string, never> extends CreateAccountArgs ? false : true>,
			Assert<CreateAccountResult extends { id?: string } ? true : false>,
			Assert<DownloadResult extends number[] ? true : false>,
		];
		const checks: Checks = [true, true, true];
		expect(checks).toEqual([true, true, true]);
	});
});
