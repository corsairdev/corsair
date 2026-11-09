import { request } from 'corsair/http';
import {
	accountsEnrich,
	addDigitalInteraction,
	askEntity,
	contactsEnrich,
	findAllReferencesToEmailAddress,
	findAllReferencesToPhoneNumber,
	generateBrief,
	getAccountsEnrichResults,
	getContactsEnrichResults,
	listCallOutcomes,
	listCoaching,
	listLogs,
	purgeEmailAddress,
	purgePhoneNumber,
} from './other';
import { GongOtherInputSchemas, GongOtherOutputSchemas } from './other-types';

jest.mock('corsair/http', () => ({
	ApiError: class ApiError extends Error {},
	request: jest.fn(),
}));
const mockedRequest = jest.mocked(request);
const ctx = {
	key: 'key',
	options: {
		authType: 'api_key' as const,
		accessKey: 'key',
		accessKeySecret: 'secret',
		baseUrl: 'https://tenant.api.gong.io',
	},
	$getAccountId: async () => 'account',
};

const ops: Array<
	[
		string,
		(...args: never[]) => Promise<unknown>,
		Record<string, unknown>,
		string,
		string,
		Record<string, unknown> | undefined,
		unknown | undefined,
		unknown,
	]
> = [
	[
		'addDigitalInteraction',
		addDigitalInteraction,
		{
			eventId: 'e1',
			timestamp: '2025-01-01T00:00:00Z',
			eventType: 'EMAIL',
			content: {},
		},
		'POST',
		'/v2/digital-interaction',
		undefined,
		{
			eventId: 'e1',
			timestamp: '2025-01-01T00:00:00Z',
			eventType: 'EMAIL',
			content: {},
		},
		{ requestId: 'r' },
	],
	[
		'purgePhoneNumber',
		purgePhoneNumber,
		{ phoneNumber: '+14255552671' },
		'POST',
		'/v2/data-privacy/erase-data-for-phone-number',
		{ phoneNumber: '+14255552671' },
		undefined,
		{ requestId: 'r' },
	],
	[
		'purgeEmailAddress',
		purgeEmailAddress,
		{ emailAddress: 'a@example.com' },
		'POST',
		'/v2/data-privacy/erase-data-for-email-address',
		{ emailAddress: 'a@example.com' },
		undefined,
		{ requestId: 'r' },
	],
	[
		'findAllReferencesToPhoneNumber',
		findAllReferencesToPhoneNumber,
		{ phoneNumber: '+14255552671' },
		'GET',
		'/v2/data-privacy/data-for-phone-number',
		{ phoneNumber: '+14255552671' },
		undefined,
		{ requestId: 'r' },
	],
	[
		'findAllReferencesToEmailAddress',
		findAllReferencesToEmailAddress,
		{ emailAddress: 'a@example.com' },
		'GET',
		'/v2/data-privacy/data-for-email-address',
		{ emailAddress: 'a@example.com' },
		undefined,
		{ requestId: 'r' },
	],
	[
		'accountsEnrich',
		accountsEnrich,
		{ dataCategories: ['accountData'], accounts: [] },
		'POST',
		'/v2/accounts/enrich',
		{ dataCategories: ['accountData'] },
		{ accounts: [] },
		{ requestId: 'r' },
	],
	[
		'getAccountsEnrichResults',
		getAccountsEnrichResults,
		{ jobId: 'job-1' },
		'GET',
		'/v2/accounts/enrich/job-1/results',
		undefined,
		undefined,
		{ requestId: 'r' },
	],
	[
		'contactsEnrich',
		contactsEnrich,
		{ dataCategories: ['contactData'], contacts: [] },
		'POST',
		'/v2/contacts/enrich',
		{ dataCategories: ['contactData'] },
		{ contacts: [] },
		{ requestId: 'r' },
	],
	[
		'getContactsEnrichResults',
		getContactsEnrichResults,
		{ jobId: 'job-1' },
		'GET',
		'/v2/contacts/enrich/job-1/results',
		undefined,
		undefined,
		{ requestId: 'r' },
	],
	[
		'listLogs',
		listLogs,
		{
			logType: 'USER',
			fromDateTime: '2025-01-01T00:00:00Z',
			toDateTime: '2025-01-02T00:00:00Z',
		},
		'GET',
		'/v2/logs',
		{
			logType: 'USER',
			fromDateTime: '2025-01-01T00:00:00Z',
			toDateTime: '2025-01-02T00:00:00Z',
		},
		undefined,
		{ requestId: 'r' },
	],
	[
		'generateBrief',
		generateBrief,
		{
			workspaceId: 2,
			briefName: 'brief',
			crmEntityType: 'ACCOUNT',
			crmEntityId: 'a',
			timePeriod: 'LAST_30DAYS',
		},
		'GET',
		'/v2/entities/get-brief',
		{
			workspaceId: 2,
			briefName: 'brief',
			crmEntityType: 'ACCOUNT',
			crmEntityId: 'a',
			timePeriod: 'LAST_30DAYS',
		},
		undefined,
		{
			requestId: 'r',
			numOfCallsSearched: 0,
			numOfEmailsSearched: 0,
			briefSections: [],
		},
	],
	[
		'askEntity',
		askEntity,
		{
			workspaceId: 2,
			crmEntityType: 'ACCOUNT',
			crmEntityId: 'a',
			timePeriod: 'LAST_30DAYS',
			question: 'Q?',
		},
		'GET',
		'/v2/entities/ask-entity',
		{
			workspaceId: 2,
			crmEntityType: 'ACCOUNT',
			crmEntityId: 'a',
			timePeriod: 'LAST_30DAYS',
			question: 'Q?',
		},
		undefined,
		{
			requestId: 'r',
			numOfCallsSearched: 0,
			numOfEmailsSearched: 0,
			answer: 'a',
		},
	],
	[
		'listCoaching',
		listCoaching,
		{ 'workspace-id': 'w', from: '2025-01-01' },
		'GET',
		'/v2/coaching',
		{ 'workspace-id': 'w', from: '2025-01-01' },
		undefined,
		{ requestId: 'r' },
	],
	[
		'listCallOutcomes',
		listCallOutcomes,
		{},
		'GET',
		'/v2/call-outcomes',
		{},
		undefined,
		{ requestId: 'r', outcomes: [] },
	],
];

describe('Gong additional operation contracts', () => {
	beforeEach(() => mockedRequest.mockReset());
	it('validates representative input and output boundaries', () => {
		expect(
			GongOtherInputSchemas.purgeEmailAddress.safeParse({ emailAddress: 'bad' })
				.success,
		).toBe(false);
		expect(
			GongOtherInputSchemas.getAccountsEnrichResults.safeParse({
				jobId: '../x',
			}).success,
		).toBe(true);
		expect(
			GongOtherInputSchemas.accountsEnrich.safeParse({
				dataCategories: ['accountData'],
				accounts: [{ id: 'a', accountSearchCriteria: {} }],
			}).success,
		).toBe(true);
		expect(
			GongOtherOutputSchemas.listLogs.safeParse({
				requestId: 'r',
				records: {},
				logEntries: [],
			}).success,
		).toBe(true);
	});
	it.each(ops)(
		'%s uses the documented route and request placement',
		async (_name, endpoint, input, method, url, query, body, output) => {
			mockedRequest.mockResolvedValue(output);
			await Reflect.apply(endpoint, undefined, [ctx, input]);
			expect(mockedRequest).toHaveBeenCalledWith(
				expect.any(Object),
				expect.objectContaining({ method, url, query, body }),
			);
		},
	);
	it.each(['../x', 'a/b', 'a\\b', ''])(
		'rejects unsafe enrichment job id %s',
		async (jobId) => {
			await expect(
				Promise.resolve().then(() => getAccountsEnrichResults(ctx, { jobId })),
			).rejects.toThrow('Unsafe Gong');
			await expect(
				Promise.resolve().then(() => getContactsEnrichResults(ctx, { jobId })),
			).rejects.toThrow('Unsafe Gong');
		},
	);
});
