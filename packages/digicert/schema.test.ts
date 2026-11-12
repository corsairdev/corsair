import {
	generatedDocEndpointCount,
	generatedDocEndpointSchemas,
	generatedDocEndpoints,
} from './endpoints/generated-docs';
import {
	generatedOpenApiEndpointCount,
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
		['customReportQuery', { fields: ['id'] }, { fields: [] }],
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
			[{ code: 'xx_XX', language: 'English' }],
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
	] as const)('parses documented %s responses and rejects invalid responses', (name, valid, invalid) => {
		expect(DigicertEndpointOutputSchemas[name].safeParse(valid).success).toBe(
			true,
		);
		expect(DigicertEndpointOutputSchemas[name].safeParse(invalid).success).toBe(
			false,
		);
	});
});
