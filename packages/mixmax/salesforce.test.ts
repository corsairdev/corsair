import type { MixmaxContext } from './index';
import { mixmax } from './index';

jest.mock('./client', () => ({
	...jest.requireActual('./client'),
	makeMixmaxRequest: jest.fn(),
}));

import { makeMixmaxRequest } from './client';

const request = jest.mocked(makeMixmaxRequest);

// The handlers under test read only `key` from the runtime context and log
// through logEventFromContext, which needs $getAccountId; every other
// context service is untouched by these code paths.
const ctx = {
	key: 'mixmax_test_key',
	$getAccountId: async () => 'account-1',
} as unknown as MixmaxContext;

// The factory always builds the validated endpoint tree, so the endpoints
// accessor is defined on every plugin instance.
const endpoints = mixmax({ key: 'mixmax_test_key' }).endpoints!;

const ACCOUNT = {
	Id: '0011I000003h7gdQAA',
	Name: 'Burlington Textiles Corp of America',
	salesforceURL: 'https://na73.salesforce.com/0011I000003h7gdQAA',
};

const CONTACT = {
	Id: '0031I000003Dn8OQAS',
	Name: 'Ada Lovelace',
	Email: 'ada@example.com',
	salesforceURL: 'https://na73.salesforce.com/0031I000003Dn8OQAS',
};

const PAGE = {
	results: [ACCOUNT],
	next: 'WyIwMDExSTAwMDAwM2g3Z2RRQUEiXQ',
	hasNext: true,
	previous: 'WyIwMDExSTAwMDAwM2g3Z2RRQUEiXQ',
	hasPrevious: false,
};

const RESULT = { id: '0011I000005RU6eQAG', success: true, errors: [] };

const IMPLICIT_ACCOUNT = {
	account: {
		Id: '0011I000003h7gdQAA',
		Name: 'Mixmax',
		Website: 'mixmax.com',
		salesforceURL: 'https://na73.salesforce.com/0011I000003h7gdQAA',
	},
};

const SYNCED_FIELDS = {
	Account: [
		{
			fieldName: 'Id',
			fieldLabel: 'Account ID',
			objectName: 'Account',
			fieldType: 'text',
			required: false,
			createable: false,
			isDefault: false,
			picklistValues: [],
		},
		{
			fieldName: 'AccountSource',
			fieldLabel: 'Account Source',
			objectName: 'Account',
			fieldType: 'picklist',
			required: false,
			createable: true,
			isDefault: false,
			picklistValues: [
				{ label: 'Web', value: 'Web', active: true, defaultValue: false },
			],
		},
	],
};

describe('Mixmax salesforce endpoints', () => {
	beforeEach(() => {
		request.mockReset();
		request.mockResolvedValue(undefined);
	});

	it('salesforce.listAccounts sends GET /v1/salesforce/account with documented query params', async () => {
		request.mockResolvedValue(PAGE);
		const result = await endpoints.salesforce.listAccounts(ctx, {
			fields: 'Id,Name',
			next: 'WyIwMDExSTAwMDAwM2g3Z2RRQUEiXQ',
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/salesforce/account', {
			method: 'GET',
			query: {
				fields: 'Id,Name',
				next: 'WyIwMDExSTAwMDAwM2g3Z2RRQUEiXQ',
				previous: undefined,
			},
		});
		expect(result).toEqual(PAGE);
	});

	it('salesforce.createAccount posts the documented body', async () => {
		request.mockResolvedValue(RESULT);
		const body = { Name: 'Analytical Engines', OwnerId: 'myself' };
		const result = await endpoints.salesforce.createAccount(ctx, body);

		expect(request).toHaveBeenCalledWith(ctx, '/v1/salesforce/account', {
			method: 'POST',
			body,
		});
		expect(result).toEqual(RESULT);
	});

	it('salesforce.getAccountImplicit sends GET /v1/salesforce/account/implicit with the email domain', async () => {
		request.mockResolvedValue(IMPLICIT_ACCOUNT);
		const result = await endpoints.salesforce.getAccountImplicit(ctx, {
			emailDomain: 'mixmax.com',
		});

		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/salesforce/account/implicit',
			{
				method: 'GET',
				query: {
					emailDomain: 'mixmax.com',
				},
			},
		);
		expect(result).toEqual(IMPLICIT_ACCOUNT);
	});

	it('salesforce.getAccount sends GET /v1/salesforce/account/:id with the fields param', async () => {
		request.mockResolvedValue(ACCOUNT);
		const result = await endpoints.salesforce.getAccount(ctx, {
			id: '0011I000003h7gdQAA',
			fields: 'Id,Name',
		});

		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/salesforce/account/0011I000003h7gdQAA',
			{
				method: 'GET',
				query: {
					fields: 'Id,Name',
				},
			},
		);
		expect(result).toEqual(ACCOUNT);
	});

	it('salesforce.updateAccount puts /v1/salesforce/account/:id with the required Id in the body', async () => {
		request.mockResolvedValue(RESULT);
		const result = await endpoints.salesforce.updateAccount(ctx, {
			id: '0011I000003h7gdQAA',
			Id: '0011I000003h7gdQAA',
			Website: 'https://example.com',
		});

		// The path `id` is guarded and stripped from the body; the provider
		// requires the record's `Id` inside the body itself.
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/salesforce/account/0011I000003h7gdQAA',
			{
				method: 'PUT',
				body: {
					Id: '0011I000003h7gdQAA',
					Website: 'https://example.com',
				},
			},
		);
		expect(result).toEqual(RESULT);
	});

	it('salesforce.createContact posts the documented body', async () => {
		request.mockResolvedValue(RESULT);
		const body = { LastName: 'Lovelace', Email: 'ada@example.com' };
		const result = await endpoints.salesforce.createContact(ctx, body);

		expect(request).toHaveBeenCalledWith(ctx, '/v1/salesforce/contact', {
			method: 'POST',
			body,
		});
		expect(result).toEqual(RESULT);
	});

	it('salesforce.getContact sends GET /v1/salesforce/contact/:id with the fields param', async () => {
		request.mockResolvedValue(CONTACT);
		const result = await endpoints.salesforce.getContact(ctx, {
			id: '0031I000003Dn8OQAS',
			fields: 'Id,Name,Email',
		});

		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/salesforce/contact/0031I000003Dn8OQAS',
			{
				method: 'GET',
				query: {
					fields: 'Id,Name,Email',
				},
			},
		);
		expect(result).toEqual(CONTACT);
	});

	it('salesforce.updateContact puts /v1/salesforce/contact/:id with the required Id in the body', async () => {
		request.mockResolvedValue(RESULT);
		const result = await endpoints.salesforce.updateContact(ctx, {
			id: '0031I000003Dn8OQAS',
			Id: '0031I000003Dn8OQAS',
			Title: 'VP Engineering',
		});

		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/salesforce/contact/0031I000003Dn8OQAS',
			{
				method: 'PUT',
				body: {
					Id: '0031I000003Dn8OQAS',
					Title: 'VP Engineering',
				},
			},
		);
		expect(result).toEqual(RESULT);
	});

	it('salesforce.listContactTasks sends GET /v1/salesforce/contact/:id/tasks with documented query params', async () => {
		request.mockResolvedValue(PAGE);
		const result = await endpoints.salesforce.listContactTasks(ctx, {
			id: '0031I000003Dn8OQAS',
			fields: 'Id,Subject,Priority',
		});

		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/salesforce/contact/0031I000003Dn8OQAS/tasks',
			{
				method: 'GET',
				query: {
					fields: 'Id,Subject,Priority',
					next: undefined,
					previous: undefined,
				},
			},
		);
		expect(result).toEqual(PAGE);
	});

	it('salesforce.getContactOrLead sends GET /v1/salesforce/contactOrLead with documented query params', async () => {
		request.mockResolvedValue({ contact: CONTACT });
		const result = await endpoints.salesforce.getContactOrLead(ctx, {
			email: 'ada@example.com',
			withRelatedObjects: 'true',
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/salesforce/contactOrLead', {
			method: 'GET',
			query: {
				email: 'ada@example.com',
				withRelatedObjects: 'true',
				fetch: undefined,
			},
		});
		expect(result).toEqual({ contact: CONTACT });
	});

	it('salesforce.createLead posts the documented body', async () => {
		request.mockResolvedValue(RESULT);
		const body = { LastName: 'Lovelace', Company: 'Analytical Engines' };
		const result = await endpoints.salesforce.createLead(ctx, body);

		expect(request).toHaveBeenCalledWith(ctx, '/v1/salesforce/lead', {
			method: 'POST',
			body,
		});
		expect(result).toEqual(RESULT);
	});

	it('salesforce.getLead sends GET /v1/salesforce/lead/:id with the fields param', async () => {
		request.mockResolvedValue({
			Id: '00Q1I000003Xyz9UAC',
			LastName: 'Lovelace',
			Company: 'Analytical Engines',
			salesforceURL: 'https://na73.salesforce.com/00Q1I000003Xyz9UAC',
		});
		const result = await endpoints.salesforce.getLead(ctx, {
			id: '00Q1I000003Xyz9UAC',
			fields: 'Id,LastName,Company',
		});

		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/salesforce/lead/00Q1I000003Xyz9UAC',
			{
				method: 'GET',
				query: {
					fields: 'Id,LastName,Company',
				},
			},
		);
		expect(result).toEqual({
			Id: '00Q1I000003Xyz9UAC',
			LastName: 'Lovelace',
			Company: 'Analytical Engines',
			salesforceURL: 'https://na73.salesforce.com/00Q1I000003Xyz9UAC',
		});
	});

	it('salesforce.updateLead puts /v1/salesforce/lead/:id with the required Id in the body', async () => {
		request.mockResolvedValue(RESULT);
		const result = await endpoints.salesforce.updateLead(ctx, {
			id: '00Q1I000003Xyz9UAC',
			Id: '00Q1I000003Xyz9UAC',
			Status: 'Working - Contacted',
		});

		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/salesforce/lead/00Q1I000003Xyz9UAC',
			{
				method: 'PUT',
				body: {
					Id: '00Q1I000003Xyz9UAC',
					Status: 'Working - Contacted',
				},
			},
		);
		expect(result).toEqual(RESULT);
	});

	it('salesforce.listLeadTasks sends GET /v1/salesforce/lead/:id/tasks with documented query params', async () => {
		request.mockResolvedValue(PAGE);
		const result = await endpoints.salesforce.listLeadTasks(ctx, {
			id: '00Q1I000003Xyz9UAC',
			fields: 'Id,Subject,Priority',
			previous: 'WyIwMFQxSTAwMDAwNHJjaTlVQUEiXQ',
		});

		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/salesforce/lead/00Q1I000003Xyz9UAC/tasks',
			{
				method: 'GET',
				query: {
					fields: 'Id,Subject,Priority',
					next: undefined,
					previous: 'WyIwMFQxSTAwMDAwNHJjaTlVQUEiXQ',
				},
			},
		);
		expect(result).toEqual(PAGE);
	});

	it('salesforce.createOpportunity posts the documented body', async () => {
		request.mockResolvedValue(RESULT);
		const body = {
			ContactId: '0031I000003Dn8OQAS',
			Name: 'Analytical Engines renewal',
			StageName: 'Prospecting',
			CloseDate: '2026-12-31',
			mm_IsPrimaryContactRole: true,
		};
		const result = await endpoints.salesforce.createOpportunity(ctx, body);

		expect(request).toHaveBeenCalledWith(ctx, '/v1/salesforce/opportunity', {
			method: 'POST',
			body,
		});
		expect(result).toEqual(RESULT);
	});

	it('salesforce.getOpportunity sends GET /v1/salesforce/opportunity/:id with the fields param', async () => {
		request.mockResolvedValue({
			Id: '0061I000001fbSjQAI',
			StageName: 'Qualification',
			Amount: 100,
			CloseDate: '2026-12-31',
			salesforceURL: 'https://na73.salesforce.com/0061I000001fbSjQAI',
		});
		const result = await endpoints.salesforce.getOpportunity(ctx, {
			id: '0061I000001fbSjQAI',
			fields: 'Id,StageName,Amount,CloseDate',
		});

		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/salesforce/opportunity/0061I000001fbSjQAI',
			{
				method: 'GET',
				query: {
					fields: 'Id,StageName,Amount,CloseDate',
				},
			},
		);
		expect(result).toEqual({
			Id: '0061I000001fbSjQAI',
			StageName: 'Qualification',
			Amount: 100,
			CloseDate: '2026-12-31',
			salesforceURL: 'https://na73.salesforce.com/0061I000001fbSjQAI',
		});
	});

	it('salesforce.updateOpportunity puts /v1/salesforce/opportunity/:id with the required Id and CloseDate', async () => {
		request.mockResolvedValue(RESULT);
		const result = await endpoints.salesforce.updateOpportunity(ctx, {
			id: '0061I000001fbSjQAI',
			Id: '0061I000001fbSjQAI',
			CloseDate: '2026-12-31',
			StageName: 'Negotiation/Review',
		});

		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/salesforce/opportunity/0061I000001fbSjQAI',
			{
				method: 'PUT',
				body: {
					Id: '0061I000001fbSjQAI',
					CloseDate: '2026-12-31',
					StageName: 'Negotiation/Review',
				},
			},
		);
		expect(result).toEqual(RESULT);
	});

	it('salesforce.deleteOpportunity sends DELETE /v1/salesforce/opportunity/:id', async () => {
		const result = await endpoints.salesforce.deleteOpportunity(ctx, {
			id: '0061I000001fbSjQAI',
		});

		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/salesforce/opportunity/0061I000001fbSjQAI',
			{
				method: 'DELETE',
			},
		);
		// 200 with no body.
		expect(result).toBeUndefined();
	});

	it('salesforce.search sends GET /v1/salesforce/search with documented query params', async () => {
		request.mockResolvedValue(PAGE);
		const result = await endpoints.salesforce.search(ctx, {
			type: 'Account',
			q: 'burl',
			fields: 'Id,Name',
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/salesforce/search', {
			method: 'GET',
			query: {
				type: 'Account',
				q: 'burl',
				fields: 'Id,Name',
				next: undefined,
				previous: undefined,
			},
		});
		expect(result).toEqual(PAGE);
	});

	it('salesforce.syncedFields sends GET /v1/salesforce/syncedFields with documented query params', async () => {
		request.mockResolvedValue(SYNCED_FIELDS);
		const result = await endpoints.salesforce.syncedFields(ctx, {
			fields: 'Account,Contact',
			useSyncUser: 'true',
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/salesforce/syncedFields', {
			method: 'GET',
			query: {
				fields: 'Account,Contact',
				useSyncUser: 'true',
			},
		});
		expect(result).toEqual(SYNCED_FIELDS);
	});

	it('salesforce.createTask posts the documented body', async () => {
		request.mockResolvedValue(RESULT);
		const body = {
			Subject: 'Follow up about the renewal',
			WhoId: '0031I000003Dn8OQAS',
			ActivityDate: '2026-11-02',
			Status: 'Not Started',
		};
		const result = await endpoints.salesforce.createTask(ctx, body);

		expect(request).toHaveBeenCalledWith(ctx, '/v1/salesforce/task', {
			method: 'POST',
			body,
		});
		expect(result).toEqual(RESULT);
	});

	it('salesforce.getTask sends GET /v1/salesforce/task/:id with the fields param', async () => {
		request.mockResolvedValue({
			Id: '00T1I000004rci9UAA',
			Subject: 'Follow up about the renewal',
			Priority: 'Normal',
			salesforceURL: 'https://na73.salesforce.com/00T1I000004rci9UAA',
		});
		const result = await endpoints.salesforce.getTask(ctx, {
			id: '00T1I000004rci9UAA',
			fields: 'Id,Subject,Priority',
		});

		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/salesforce/task/00T1I000004rci9UAA',
			{
				method: 'GET',
				query: {
					fields: 'Id,Subject,Priority',
				},
			},
		);
		expect(result).toEqual({
			Id: '00T1I000004rci9UAA',
			Subject: 'Follow up about the renewal',
			Priority: 'Normal',
			salesforceURL: 'https://na73.salesforce.com/00T1I000004rci9UAA',
		});
	});

	it('salesforce.updateTask puts /v1/salesforce/task/:id with the required Id in the body', async () => {
		request.mockResolvedValue(RESULT);
		const result = await endpoints.salesforce.updateTask(ctx, {
			id: '00T1I000004rci9UAA',
			Id: '00T1I000004rci9UAA',
			Status: 'Completed',
		});

		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/salesforce/task/00T1I000004rci9UAA',
			{
				method: 'PUT',
				body: {
					Id: '00T1I000004rci9UAA',
					Status: 'Completed',
				},
			},
		);
		expect(result).toEqual(RESULT);
	});

	it('salesforce.deleteTask sends DELETE /v1/salesforce/task/:id and returns the result', async () => {
		request.mockResolvedValue(RESULT);
		const result = await endpoints.salesforce.deleteTask(ctx, {
			id: '00T1I000004rci9UAA',
		});

		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/salesforce/task/00T1I000004rci9UAA',
			{
				method: 'DELETE',
			},
		);
		// 200 with the Salesforce write result, unlike the opportunity delete.
		expect(result).toEqual(RESULT);
	});

	it('salesforce.getWhat sends GET /v1/salesforce/what/:id with the fields param', async () => {
		request.mockResolvedValue({ ...ACCOUNT, type: 'Account' });
		const result = await endpoints.salesforce.getWhat(ctx, {
			id: '0011I000003h7gdQAA',
			fields: 'Id,Name,type',
		});

		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/salesforce/what/0011I000003h7gdQAA',
			{
				method: 'GET',
				query: {
					fields: 'Id,Name,type',
				},
			},
		);
		expect(result).toEqual({ ...ACCOUNT, type: 'Account' });
	});

	it('salesforce.getWho sends GET /v1/salesforce/who/:id with the fields param', async () => {
		request.mockResolvedValue({ ...CONTACT, type: 'Contact' });
		const result = await endpoints.salesforce.getWho(ctx, {
			id: '0031I000003Dn8OQAS',
			fields: 'Id,Name,type',
		});

		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/salesforce/who/0031I000003Dn8OQAS',
			{
				method: 'GET',
				query: {
					fields: 'Id,Name,type',
				},
			},
		);
		expect(result).toEqual({ ...CONTACT, type: 'Contact' });
	});

	it('rejects missing ids before any request', async () => {
		await expect(
			// unknown: deliberately invalid input shape to prove the schema
			// boundary rejects it before transport.
			endpoints.salesforce.getAccount(ctx, {} as never),
		).rejects.toThrow();
		await expect(
			endpoints.salesforce.updateAccount(ctx, {} as never),
		).rejects.toThrow();
		await expect(
			endpoints.salesforce.getContact(ctx, {} as never),
		).rejects.toThrow();
		await expect(
			endpoints.salesforce.updateContact(ctx, {} as never),
		).rejects.toThrow();
		await expect(
			endpoints.salesforce.listContactTasks(ctx, {} as never),
		).rejects.toThrow();
		await expect(
			endpoints.salesforce.getLead(ctx, {} as never),
		).rejects.toThrow();
		await expect(
			endpoints.salesforce.updateLead(ctx, {} as never),
		).rejects.toThrow();
		await expect(
			endpoints.salesforce.listLeadTasks(ctx, {} as never),
		).rejects.toThrow();
		await expect(
			endpoints.salesforce.getOpportunity(ctx, {} as never),
		).rejects.toThrow();
		await expect(
			endpoints.salesforce.updateOpportunity(ctx, {} as never),
		).rejects.toThrow();
		await expect(
			endpoints.salesforce.deleteOpportunity(ctx, {} as never),
		).rejects.toThrow();
		await expect(
			endpoints.salesforce.getTask(ctx, {} as never),
		).rejects.toThrow();
		await expect(
			endpoints.salesforce.updateTask(ctx, {} as never),
		).rejects.toThrow();
		await expect(
			endpoints.salesforce.deleteTask(ctx, {} as never),
		).rejects.toThrow();
		await expect(
			endpoints.salesforce.getWhat(ctx, {} as never),
		).rejects.toThrow();
		await expect(
			endpoints.salesforce.getWho(ctx, {} as never),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});

	it('rejects unsafe record ids before any request', async () => {
		await expect(
			endpoints.salesforce.getAccount(ctx, {
				id: '../admin',
				fields: 'Id,Name',
			}),
		).rejects.toThrow('Invalid Mixmax id');
		await expect(
			endpoints.salesforce.deleteTask(ctx, { id: '../admin' }),
		).rejects.toThrow('Invalid Mixmax id');
		expect(request).not.toHaveBeenCalled();
	});

	it('rejects missing required query params before any request', async () => {
		await expect(
			endpoints.salesforce.listAccounts(ctx, {} as never),
		).rejects.toThrow();
		await expect(
			endpoints.salesforce.getAccountImplicit(ctx, {} as never),
		).rejects.toThrow();
		await expect(
			endpoints.salesforce.getContactOrLead(ctx, {} as never),
		).rejects.toThrow();
		await expect(
			endpoints.salesforce.search(ctx, {} as never),
		).rejects.toThrow();
		await expect(
			endpoints.salesforce.syncedFields(ctx, {} as never),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});

	it('rejects create bodies missing provider-required fields before any request', async () => {
		// Only these two creates have provider-required body fields
		// (`LastName`/`Company` for leads, `ContactId` for opportunities). The
		// account, contact and task creates accept an empty body per the
		// official SalesforceWriteBody schema; Salesforce enforces its own
		// required fields at write time.
		await expect(
			endpoints.salesforce.createLead(ctx, {} as never),
		).rejects.toThrow();
		await expect(
			endpoints.salesforce.createOpportunity(ctx, {} as never),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});
});
