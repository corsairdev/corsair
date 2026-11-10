import { request } from 'corsair/http';
import { gong, gongEndpointSchemas } from './index';

jest.mock('corsair/http', () => ({
	ApiError: class ApiError extends Error {},
	request: jest.fn(),
}));

const mockedRequest = jest.mocked(request);
const endpoints = gong().endpoints;
if (!endpoints) throw new Error('Gong endpoint tree is required');
const ctx = {
	key: 'key',
	options: {
		authType: 'api_key' as const,
		accessKey: 'key',
		accessKeySecret: 'secret',
	},
	$getAccountId: async () => 'account',
} as never;

// Responses as Gong's API reference documents them (schema plus its example
// values, https://gong.app.gong.io/settings/api/documentation). Each of these
// was rejected by the output schema, so the call threw after Gong had answered.
const documented = {
	'accountsEnrich.getResults': {
		requestId: '4al018gzaztcr8nbukw',
		accounts: [
			{
				id: 'account-1',
				matched: true,
				dataCategories: [
					{
						dataCategory: 'accountData',
						status: 'Success',
						enriched: true,
						data: { name: 'Acme', employees: 120 },
					},
				],
			},
		],
		summary: { totalAccounts: 1, matchedAccounts: 1, unmatchedAccounts: 0 },
	},
	'contactsEnrich.getResults': {
		requestId: '4al018gzaztcr8nbukw',
		contacts: [
			{
				id: 'contact-1',
				matched: true,
				dataCategories: [
					{ dataCategory: 'contactData', status: 'Success', enriched: true },
					{
						dataCategory: 'enrichEmails',
						status: 'No Result',
						enriched: false,
					},
				],
			},
		],
		summary: { totalContacts: 1, matchedContacts: 1, unmatchedContacts: 0 },
	},
	'entities.ask': {
		requestId: '4al018gzaztcr8nbukw',
		numOfCallsSearched: 25,
		numOfEmailsSearched: 252,
		answer: [
			{
				answerItems: ['Acme has questions about compliance.'],
				emailFindings: [
					{ emails: [{ id: '5gfz1gfshfhqdfgsaghhjvcah', title: 'Needs' }] },
				],
				callFindings: [
					{ call: { id: '123454809855576620', title: 'Bi-Weekly' } },
				],
			},
		],
	},
	'permissions.getCallUsers': {
		requestId: '4al018gzaztcr8nbukw',
		callAccessList: [
			{
				callId: '7782342274025937895',
				users: [{ userId: '234599484848423' }],
			},
		],
	},
	'crm.getObjects': {
		requestId: '4al018gzaztcr8nbukw',
		crmObjectsMap: {
			'1234': { name: 'Acme renewal', amount: 12000, isClosed: false },
			'8765': null,
		},
	},
	'engageFlows.folders': {
		requestId: '4al018gzaztcr8nbukw',
		records: { totalRecords: 1, currentPageSize: 1, currentPageNumber: 0 },
		flows: [{ id: '1234361284629351', name: 'Outbound' }],
	},
	'library.folderContent': {
		requestId: '4al018gzaztcr8nbukw',
		id: '3843152912968920037',
		name: 'Sales Onboarding',
		createdBy: '234599484848423',
		updated: '2020-03-14T13:30:00Z',
		calls: [
			{
				id: '7782342274025937895',
				title: 'Example call',
				note: 'sample note',
				addedBy: '234599484848423',
				created: '2020-01-12T22:30:00Z',
				url: 'https://app.gong.io/call?id=7782342274025937895',
				snippet: { fromSec: 21, toSec: 132 },
			},
		],
	},
	'workspaces.list': {
		requestId: '4al018gzaztcr8nbukw',
		workspaces: [
			{ id: '623457276584334', name: 'Sales' },
			{ id: '623457276584335', name: 'Support', description: null },
		],
	},
} as const;

describe('Gong documented responses', () => {
	beforeEach(() => mockedRequest.mockReset());

	it.each(Object.entries(documented))(
		'%s returns the documented response unchanged',
		(path, response) => {
			const schema =
				gongEndpointSchemas[path as keyof typeof gongEndpointSchemas].output;
			expect(schema.parse(response)).toEqual(response);
		},
	);

	it('returns the users with access to a call through the plugin', async () => {
		mockedRequest.mockResolvedValue(documented['permissions.getCallUsers']);
		await expect(
			endpoints.permissions.getCallUsers(ctx, {
				filter: { callIds: ['7782342274025937895'] },
			}),
		).resolves.toEqual(documented['permissions.getCallUsers']);
	});

	it('returns an entity answer through the plugin', async () => {
		mockedRequest.mockResolvedValue(documented['entities.ask']);
		const result = await endpoints.entities.ask(ctx, {
			workspaceId: 623457276584334,
			crmEntityType: 'ACCOUNT',
			crmEntityId: '125260001VdfoWBAR',
			timePeriod: 'LAST_30DAYS',
			question: 'What was the last activity on that account?',
		});
		expect(result.answer[0]?.answerItems).toEqual([
			'Acme has questions about compliance.',
		]);
	});

	it.each([
		[
			'tasks.list',
			{
				requestId: 'r',
				tasks: [{ id: 1, status: 'SNOOZED', type: 'AUTO', actions: ['EMAIL'] }],
				crmType: 'ZOHO',
			},
		],
		['crm.getRequestStatus', { requestId: 'r', status: 'CANCELLED' }],
		[
			'crm.listSchemaFields',
			{
				requestId: 'r',
				objectTypeToSelectedFields: {
					DEAL: [{ uniqueName: 'geo', label: 'Geo', type: 'GEOLOCATION' }],
				},
			},
		],
		[
			'engageFlows.getBulkAssignment',
			{
				requestId: 'r',
				id: 'job-1',
				status: 'CANCELLED',
				totalCount: 1,
				processedCount: 1,
				successCount: 0,
				failedCount: 1,
				results: [{ status: 'SKIPPED', crmObjectType: 'ACCOUNT' }],
			},
		],
		[
			'engageFlows.assignedProspects',
			{
				requestId: 'r',
				prospectsAssigned: [{ flowInstanceStatus: 'Stopped' }],
			},
		],
		['engageFlows.list', { requestId: 'r', flows: [{ visibility: 'Team' }] }],
		[
			'targets.listDefinitions',
			{
				requestId: 'r',
				targets: [{ type: 'PERCENT', hierarchyType: 'REGION' }],
			},
		],
	])('%s accepts a value Gong adds later', (path, response) => {
		const schema =
			gongEndpointSchemas[path as keyof typeof gongEndpointSchemas].output;
		expect(schema.safeParse(response).success).toBe(true);
	});

	it('keeps input enums strict', () => {
		expect(
			gongEndpointSchemas['crm.uploadSchemaFields'].input.safeParse({
				integrationId: 1,
				objectType: 'DEAL',
				fields: [{ uniqueName: 'geo', label: 'Geo', type: 'GEOLOCATION' }],
			}).success,
		).toBe(false);
		expect(
			gongEndpointSchemas['tasks.updateReminder'].input.safeParse({
				taskId: '1',
				userId: '2',
				status: 'SNOOZED',
			}).success,
		).toBe(false);
	});
});
