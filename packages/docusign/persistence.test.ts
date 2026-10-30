import { DocusignClient } from './client';
import * as endpoints from './endpoints';
import { DocusignSchema } from './schema';
import { mockFetchJson } from './test-fetch';

type Upsert = [string, object];

function makeDb() {
	const calls: Record<string, Upsert[]> = {};
	const db: Record<string, { upsertByEntityId: jest.Mock }> = {};
	for (const name of Object.keys(DocusignSchema.entities)) {
		calls[name] = [];
		db[name] = {
			upsertByEntityId: jest.fn(async (id: string, data: object) => {
				calls[name]?.push([id, data]);
				return data;
			}),
		};
	}
	return { db, calls };
}

const client = new DocusignClient({
	accessToken: 'tok',
	accountId: '12345',
	baseUri: 'https://demo.docusign.net/restapi/v2.1',
});

describe('DocuSign entity persistence', () => {
	it('persists a fetched envelope', async () => {
		const { db, calls } = makeDb();
		mockFetchJson({
			envelopeId: 'e1',
			status: 'sent',
			emailSubject: 'Sign',
			sender: { userName: 'Jane' },
		});
		await endpoints.getEnvelope({ client, db }, { envelopeId: 'e1' });
		expect(calls.envelopes).toEqual([
			[
				'e1',
				{
					envelopeId: 'e1',
					status: 'sent',
					emailSubject: 'Sign',
					sender: { userName: 'Jane' },
				},
			],
		]);
	});

	it('persists a created envelope summary', async () => {
		const { db, calls } = makeDb();
		mockFetchJson({
			envelopeId: 'e2',
			status: 'sent',
			uri: '/envelopes/e2',
			statusDateTime: '2026-01-01T00:00:00Z',
		});
		await endpoints.createEnvelope(
			{ client, db },
			{ emailSubject: 'Hi', status: 'sent' },
		);
		expect(calls.envelopes).toEqual([
			[
				'e2',
				{
					envelopeId: 'e2',
					status: 'sent',
					uri: '/envelopes/e2',
					statusDateTime: '2026-01-01T00:00:00Z',
				},
			],
		]);
	});

	it('persists every template of a list', async () => {
		const { db, calls } = makeDb();
		mockFetchJson({
			envelopeTemplates: [
				{ templateId: 't1', name: 'NDA', pageCount: 2 },
				{ templateId: 't2', name: 'MSA' },
			],
		});
		await endpoints.listTemplates({ client, db }, {});
		expect(calls.templates).toEqual([
			['t1', { templateId: 't1', name: 'NDA', pageCount: 2 }],
			['t2', { templateId: 't2', name: 'MSA' }],
		]);
	});

	it('persists a fetched template', async () => {
		const { db, calls } = makeDb();
		mockFetchJson({ templateId: 't9', name: 'Offer' });
		await endpoints.getTemplate({ client, db }, { templateId: 't9' });
		expect(calls.templates).toEqual([
			['t9', { templateId: 't9', name: 'Offer' }],
		]);
	});

	it('persists recipients under a composite id with their type', async () => {
		const { db, calls } = makeDb();
		mockFetchJson({
			signers: [
				{ recipientId: '1', email: 'a@b.c', name: 'A', status: 'sent' },
			],
			carbonCopies: [{ recipientId: '2', email: 'cc@b.c' }],
			recipientCount: '2',
		});
		await endpoints.fetchRecipientNamesForEmail(
			{ client, db },
			{ envelopeId: 'e1', email: 'a@b.c' },
		);
		expect(calls.recipients).toEqual([
			[
				'e1:1',
				{
					envelopeId: 'e1',
					recipientId: '1',
					recipientType: 'signers',
					email: 'a@b.c',
					name: 'A',
					status: 'sent',
				},
			],
			[
				'e1:2',
				{
					envelopeId: 'e1',
					recipientId: '2',
					recipientType: 'carbonCopies',
					email: 'cc@b.c',
				},
			],
		]);
	});

	it('persists envelope documents under a composite id', async () => {
		const { db, calls } = makeDb();
		mockFetchJson({
			envelopeId: 'e1',
			envelopeDocuments: [
				{ documentId: '1', name: 'Contract', type: 'content' },
			],
		});
		await endpoints.retrieveEnvelopeDocuments(
			{ client, db },
			{ envelopeId: 'e1' },
		);
		expect(calls.documents).toEqual([
			[
				'e1:1',
				{
					envelopeId: 'e1',
					documentId: '1',
					name: 'Contract',
					type: 'content',
				},
			],
		]);
	});

	it.each([
		{
			label: 'users from a list',
			run: () => endpoints.listUsersForAccount({ client, db: current.db }, {}),
			body: { users: [{ userId: 'u1', email: 'u@x.y', userName: 'U' }] },
			entity: 'users',
			expected: [['u1', { userId: 'u1', email: 'u@x.y', userName: 'U' }]],
		},
		{
			label: 'a single user',
			run: () =>
				endpoints.getUserInformationById(
					{ client, db: current.db },
					{ userId: 'u2' },
				),
			body: { userId: 'u2', firstName: 'Ann' },
			entity: 'users',
			expected: [['u2', { userId: 'u2', firstName: 'Ann' }]],
		},
		{
			label: 'groups',
			run: () =>
				endpoints.getGroupsInformationForAccount(
					{ client, db: current.db },
					{},
				),
			body: {
				groups: [{ groupId: 'g1', groupName: 'Sales', usersCount: '3' }],
			},
			entity: 'groups',
			expected: [
				['g1', { groupId: 'g1', groupName: 'Sales', usersCount: '3' }],
			],
		},
		{
			label: 'signing groups',
			run: () =>
				endpoints.retrieveAccountSigningGroups({ client, db: current.db }, {}),
			body: { groups: [{ signingGroupId: 's1', groupName: 'Legal' }] },
			entity: 'signingGroups',
			expected: [['s1', { signingGroupId: 's1', groupName: 'Legal' }]],
		},
		{
			label: 'brands',
			run: () => endpoints.listBrandsForAccount({ client, db: current.db }, {}),
			body: { brands: [{ brandId: 'b1', brandName: 'Acme' }] },
			entity: 'brands',
			expected: [['b1', { brandId: 'b1', brandName: 'Acme' }]],
		},
		{
			label: 'an account',
			run: () =>
				endpoints.retrieveAccountInformationForSpecifiedAccount(
					{ client, db: current.db },
					{},
				),
			body: {
				accountIdGuid: 'acc-1',
				accountName: 'Acme Inc',
				planName: 'Pro',
			},
			entity: 'accounts',
			expected: [
				[
					'acc-1',
					{ accountIdGuid: 'acc-1', accountName: 'Acme Inc', planName: 'Pro' },
				],
			],
		},
		{
			label: 'permission profiles',
			run: () =>
				endpoints.getListOfAccountPermissionProfiles(
					{ client, db: current.db },
					{},
				),
			body: {
				permissionProfiles: [
					{ permissionProfileId: 'p1', permissionProfileName: 'Admin' },
				],
			},
			entity: 'permissionProfiles',
			expected: [
				['p1', { permissionProfileId: 'p1', permissionProfileName: 'Admin' }],
			],
		},
		{
			label: 'workspaces',
			run: () => endpoints.listWorkspaces({ client, db: current.db }, {}),
			body: { workspaces: [{ workspaceId: 'w1', workspaceName: 'Deal room' }] },
			entity: 'workspaces',
			expected: [['w1', { workspaceId: 'w1', workspaceName: 'Deal room' }]],
		},
		{
			label: 'bulk send lists',
			run: () =>
				endpoints.getBulkSendListsInformation({ client, db: current.db }, {}),
			body: { bulkListSummaries: [{ listId: 'l1', name: 'Q1' }] },
			entity: 'bulkSendLists',
			expected: [['l1', { listId: 'l1', name: 'Q1' }]],
		},
		{
			label: 'connect configurations',
			run: () =>
				endpoints.retrieveConnectConfigurations({ client, db: current.db }, {}),
			body: {
				configurations: [
					{ connectId: 'c1', name: 'Hook', urlToPublishTo: 'https://x.y/h' },
				],
			},
			entity: 'connectConfigurations',
			expected: [
				[
					'c1',
					{ connectId: 'c1', name: 'Hook', urlToPublishTo: 'https://x.y/h' },
				],
			],
		},
		{
			label: 'custom tabs',
			run: () =>
				endpoints.retrieveAllAccountTabs({ client, db: current.db }, {}),
			body: { tabs: [{ customTabId: 'ct1', tabLabel: 'Initials' }] },
			entity: 'customTabs',
			expected: [['ct1', { customTabId: 'ct1', tabLabel: 'Initials' }]],
		},
		{
			label: 'contacts',
			run: () =>
				endpoints.getDocusignAccountContacts(
					{ client, db: current.db },
					{ contactId: 'k1' },
				),
			body: { contacts: [{ contactId: 'k1', name: 'Kay', emails: ['k@x.y'] }] },
			entity: 'contacts',
			expected: [['k1', { contactId: 'k1', name: 'Kay', emails: ['k@x.y'] }]],
		},
	])('persists $label', async ({ run, body, entity, expected }) => {
		current = makeDb();
		mockFetchJson(body);
		await run();
		expect(current.calls[entity]).toEqual(expected);
	});

	it('does not fail the call when no db is attached', async () => {
		mockFetchJson({ envelopeId: 'e1', status: 'sent' });
		const res = await endpoints.getEnvelope({ client }, { envelopeId: 'e1' });
		expect(res).toEqual({ envelopeId: 'e1', status: 'sent' });
	});

	it('skips rows that lack their id field', async () => {
		const { db, calls } = makeDb();
		mockFetchJson({ users: [{ email: 'no-id@x.y' }] });
		await endpoints.listUsersForAccount({ client, db }, {});
		expect(calls.users).toEqual([]);
	});

	it('returns the response even when the db write fails', async () => {
		const { db } = makeDb();
		db.envelopes?.upsertByEntityId.mockRejectedValueOnce(new Error('db down'));
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
		mockFetchJson({ envelopeId: 'e1', status: 'sent' });
		const res = await endpoints.getEnvelope(
			{ client, db },
			{ envelopeId: 'e1' },
		);
		expect(res).toEqual({ envelopeId: 'e1', status: 'sent' });
		expect(warn).toHaveBeenCalled();
		warn.mockRestore();
	});
});

let current = makeDb();
