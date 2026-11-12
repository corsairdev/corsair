import {
	DigicertEndpointInputSchemas,
	DigicertEndpointOutputSchemas,
} from './endpoints/types';

describe('DigiCert endpoint schemas', () => {
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
			{ users: [], page: { total: 0, limit: 1000, offset: 0 } },
			{},
		],
		[
			'ordersList',
			{ orders: [], page: { total: 0, limit: 1000, offset: 0 } },
			{},
		],
		[
			'organizationsList',
			{ organizations: [], page: { total: 0, limit: 1000, offset: 0 } },
			{},
		],
		['intermediatesList', { intermediates: [] }, {}],
		['accountManagerLocales', [{ code: 'en_US', language: 'English' }], {}],
		['privateCAHelper', { version: '1.2.3' }, {}],
		['certificateTags', undefined, {}],
		['verifyTemplate', undefined, {}],
		['reportNames', { report_names: ['Quarterly'] }, {}],
		['reportTypes', { report_types: [] }, {}],
		[
			'reportHistory',
			{ page: { total: 0, limit: 100, offset: 0 }, report_history: [] },
			{},
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
});
