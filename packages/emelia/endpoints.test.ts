import { request } from 'corsair/http';
import type { EmeliaContext } from './index';
import { emelia, emeliaEndpointSchemas } from './index';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

const mockCtx = {
	key: 'emelia-test-key',
	$getAccountId: () => 'test-account-id',
	options: {},
	keys: {
		get_api_key: jest.fn().mockResolvedValue('emelia-test-key'),
	},
	logEvent: jest.fn(),
	database: {
		insertInto: jest.fn().mockReturnValue({
			values: jest.fn().mockReturnValue({
				execute: jest.fn().mockResolvedValue(undefined),
			}),
		}),
	},
} as unknown as EmeliaContext;

describe('Emelia Plugin Structure', () => {
	it('exposes all configured endpoints and schema registrations', () => {
		const plugin = emelia({ key: 'emelia-test-key' });
		expect(plugin.id).toBe('emelia');
		expect(plugin.schema).toBeDefined();
		expect(plugin.endpoints).toBeDefined();

		const endpoints = plugin.endpoints!;
		expect(typeof endpoints.account.me).toBe('function');
		expect(typeof endpoints.campaigns.list).toBe('function');
		expect(typeof endpoints.campaigns.addContact).toBe('function');
		expect(typeof endpoints.campaigns.removeContact).toBe('function');
		expect(typeof endpoints.contacts.listLists).toBe('function');
		expect(typeof endpoints.contacts.addToList).toBe('function');
		expect(typeof endpoints.restCampaigns.create).toBe('function');
		expect(typeof endpoints.restCampaigns.list).toBe('function');
		expect(typeof endpoints.restCampaigns.getActivities).toBe('function');
		expect(typeof endpoints.emailCampaigns.addContact).toBe('function');
		expect(typeof endpoints.emailCampaigns.listContacts).toBe('function');
		expect(typeof endpoints.emailCampaigns.deleteContact).toBe('function');
		expect(typeof endpoints.blacklist.add).toBe('function');
		expect(typeof endpoints.blacklist.remove).toBe('function');
		expect(typeof endpoints.linkedin.createCampaign).toBe('function');
		expect(typeof endpoints.linkedin.listCampaigns).toBe('function');
		expect(typeof endpoints.linkedin.deleteContact).toBe('function');
		expect(typeof endpoints.linkedin.getActivities).toBe('function');
		expect(typeof endpoints.tools.findEmailSingle).toBe('function');
		expect(typeof endpoints.tools.getFindEmailResult).toBe('function');
		expect(typeof endpoints.tools.findPhoneSingle).toBe('function');
		expect(typeof endpoints.tools.getFindPhoneResult).toBe('function');
		expect(typeof endpoints.tools.verifyEmailSingle).toBe('function');
		expect(typeof endpoints.tools.getVerifyEmailResult).toBe('function');
		expect(typeof endpoints.providers.list).toBe('function');
		expect(typeof endpoints.webhooks.list).toBe('function');
		expect(typeof endpoints.webhooks.create).toBe('function');
		expect(typeof endpoints.webhooks.remove).toBe('function');

		const expectedEndpoints = [
			'account.me',
			'campaigns.list',
			'campaigns.addContact',
			'campaigns.removeContact',
			'contacts.listLists',
			'contacts.addToList',
			'restCampaigns.create',
			'restCampaigns.list',
			'restCampaigns.getActivities',
			'emailCampaigns.addContact',
			'emailCampaigns.listContacts',
			'emailCampaigns.deleteContact',
			'blacklist.add',
			'blacklist.remove',
			'linkedin.createCampaign',
			'linkedin.listCampaigns',
			'linkedin.deleteContact',
			'linkedin.getActivities',
			'tools.findEmailSingle',
			'tools.getFindEmailResult',
			'tools.findPhoneSingle',
			'tools.getFindPhoneResult',
			'tools.verifyEmailSingle',
			'tools.getVerifyEmailResult',
			'providers.list',
			'webhooks.list',
			'webhooks.create',
			'webhooks.remove',
		];

		expect([...Object.keys(emeliaEndpointSchemas)].sort()).toEqual(
			[...expectedEndpoints].sort(),
		);
		expect([...Object.keys(plugin.endpointMeta ?? {})].sort()).toEqual(
			[...expectedEndpoints].sort(),
		);
	});
});

describe('Emelia Endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('account.me retrieves profile details', async () => {
		mockRequest.mockResolvedValueOnce({
			data: {
				me: {
					uid: 'usr_123',
					name: 'Jane Doe',
					email: 'jane@example.com',
					showMailbox: true,
					due_invoice: false,
				},
			},
		});

		const plugin = emelia();
		const result = await plugin.endpoints!.account.me(mockCtx, {});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(result.me?.uid).toBe('usr_123');
		expect(result.me?.email).toBe('jane@example.com');
	});

	it('campaigns.list returns all cold outreach campaigns', async () => {
		mockRequest.mockResolvedValueOnce({
			data: {
				all_campaigns: [
					{
						_id: 'cmp_1',
						name: 'SaaS Founders',
						status: 'RUNNING',
						createdAt: '2026-01-01',
					},
					{
						_id: 'cmp_2',
						name: 'Agencies',
						status: 'FINISHED',
						createdAt: '2026-01-02',
					},
				],
			},
		});

		const plugin = emelia();
		const result = await plugin.endpoints!.campaigns.list(mockCtx, {});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(result.all_campaigns).toHaveLength(2);
		expect(result.all_campaigns?.[0]?._id).toBe('cmp_1');
		expect(result.all_campaigns?.[0]?.name).toBe('SaaS Founders');
	});

	it('campaigns.addContact adds a contact to campaign', async () => {
		mockRequest.mockResolvedValueOnce({
			data: {
				addContactToCampaignHook: true,
			},
		});

		const plugin = emelia();
		const result = await plugin.endpoints!.campaigns.addContact(mockCtx, {
			id: 'cmp_1',
			contact: { email: 'lead@example.com', firstName: 'Alex' },
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(result.addContactToCampaignHook).toBe(true);
	});

	it('campaigns.removeContact deletes a contact from campaign', async () => {
		mockRequest.mockResolvedValueOnce({
			data: {
				removeOneContactFromCampaign: true,
			},
		});

		const plugin = emelia();
		const result = await plugin.endpoints!.campaigns.removeContact(mockCtx, {
			id: 'cmp_1',
			email: 'unsub@example.com',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(result.removeOneContactFromCampaign).toBe(true);
	});

	it('contacts.listLists lists all contact lists', async () => {
		mockRequest.mockResolvedValueOnce({
			data: {
				contact_lists: [
					{
						_id: 'lst_1',
						name: 'Outbound Q1',
						contactCount: 150,
						fields: ['email', 'company'],
						usedInCampaign: true,
					},
				],
			},
		});

		const plugin = emelia();
		const result = await plugin.endpoints!.contacts.listLists(mockCtx, {});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(result.contact_lists).toHaveLength(1);
		expect(result.contact_lists?.[0]?._id).toBe('lst_1');
		expect(result.contact_lists?.[0]?.name).toBe('Outbound Q1');
	});

	it('contacts.addToList adds a new contact to list', async () => {
		mockRequest.mockResolvedValueOnce({
			data: {
				addContactsToListHook: true,
			},
		});

		const plugin = emelia();
		const result = await plugin.endpoints!.contacts.addToList(mockCtx, {
			id: 'lst_1',
			contact: { email: 'newcontact@example.com' },
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(result.addContactsToListHook).toBe(true);
	});
});

describe('Emelia REST Endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	function lastCall() {
		return mockRequest.mock.calls[0][1];
	}

	it('restCampaigns.create creates an email campaign', async () => {
		mockRequest.mockResolvedValueOnce({
			message: 'created',
			campaignId: 'cmp_9',
		});

		const plugin = emelia();
		const result = await plugin.endpoints!.restCampaigns.create(mockCtx, {
			name: 'Q3 Outbound',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(lastCall().url).toBe('/advanced/campaigns');
		expect(lastCall().method).toBe('POST');
		expect(result.campaignId).toBe('cmp_9');
	});

	it('restCampaigns.list returns email campaigns', async () => {
		mockRequest.mockResolvedValueOnce([
			{ id: 'c1', name: 'A', status: 'RUNNING' },
		]);

		const plugin = emelia();
		const result = await plugin.endpoints!.restCampaigns.list(mockCtx, {
			page: 1,
			limit: 20,
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(lastCall().url).toBe('/advanced/campaigns');
		expect(lastCall().method).toBe('GET');
		expect(result).toHaveLength(1);
	});

	it('restCampaigns.getActivities returns campaign activities', async () => {
		mockRequest.mockResolvedValueOnce({ activities: [{ type: 'open' }] });

		const plugin = emelia();
		const result = await plugin.endpoints!.restCampaigns.getActivities(
			mockCtx,
			{ campaignId: 'cmp_1' },
		);

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(lastCall().url).toBe('/advanced/campaigns/cmp_1/activities');
		if (Array.isArray(result)) {
			throw new Error('expected activities envelope');
		}
		expect(result.activities).toHaveLength(1);
	});

	it('emailCampaigns.addContact adds a contact to an email campaign', async () => {
		mockRequest.mockResolvedValueOnce({ success: true });

		const plugin = emelia();
		const result = await plugin.endpoints!.emailCampaigns.addContact(mockCtx, {
			campaignId: 'cmp_1',
			contact: { email: 'lead@example.com' },
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(lastCall().url).toBe('/emails/campaign/contacts');
		expect(lastCall().method).toBe('POST');
		expect(result.success).toBe(true);
	});

	it('emailCampaigns.listContacts lists campaign contacts', async () => {
		mockRequest.mockResolvedValueOnce([{ email: 'a@example.com' }]);

		const plugin = emelia();
		const result = await plugin.endpoints!.emailCampaigns.listContacts(
			mockCtx,
			{ campaignId: 'cmp_1' },
		);

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(lastCall().url).toBe('/emails/campaign/contacts');
		expect(result).toHaveLength(1);
	});

	it('emailCampaigns.deleteContact removes a contact', async () => {
		mockRequest.mockResolvedValueOnce({ success: true });

		const plugin = emelia();
		const result = await plugin.endpoints!.emailCampaigns.deleteContact(
			mockCtx,
			{ campaignId: 'cmp_1', email: 'gone@example.com' },
		);

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(lastCall().method).toBe('DELETE');
		expect(result.success).toBe(true);
	});

	it('blacklist.add adds a contact to the blacklist', async () => {
		mockRequest.mockResolvedValueOnce({ message: 'added' });

		const plugin = emelia();
		const result = await plugin.endpoints!.blacklist.add(mockCtx, {
			email: 'blocked@example.com',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(lastCall().url).toBe('/emails/blacklists/contact');
		expect(lastCall().method).toBe('POST');
		expect(result.message).toBe('added');
	});

	it('blacklist.remove removes a contact from the blacklist', async () => {
		mockRequest.mockResolvedValueOnce({ success: true });

		const plugin = emelia();
		const result = await plugin.endpoints!.blacklist.remove(mockCtx, {
			email: 'blocked@example.com',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(lastCall().method).toBe('DELETE');
		expect(result.success).toBe(true);
	});

	it('linkedin.createCampaign creates a LinkedIn campaign', async () => {
		mockRequest.mockResolvedValueOnce({ campaignId: 'li_9' });

		const plugin = emelia();
		const result = await plugin.endpoints!.linkedin.createCampaign(mockCtx, {
			name: 'LI Sequence',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(lastCall().url).toBe('/linkedin/campaigns');
		expect(lastCall().method).toBe('POST');
		expect(result.campaignId).toBe('li_9');
	});

	it('linkedin.listCampaigns returns LinkedIn campaigns', async () => {
		mockRequest.mockResolvedValueOnce([{ id: 'li_1' }]);

		const plugin = emelia();
		const result = await plugin.endpoints!.linkedin.listCampaigns(mockCtx, {});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(lastCall().url).toBe('/linkedin/campaigns');
		expect(result).toHaveLength(1);
	});

	it('linkedin.deleteContact deletes a LinkedIn campaign contact', async () => {
		mockRequest.mockResolvedValueOnce({ success: true });

		const plugin = emelia();
		const result = await plugin.endpoints!.linkedin.deleteContact(mockCtx, {
			campaignId: 'li_1',
			contactUrl: 'https://linkedin.com/in/alex',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(lastCall().url).toBe('/linkedin/campaign/contacts');
		expect(lastCall().method).toBe('DELETE');
		expect(result.success).toBe(true);
	});

	it('linkedin.getActivities returns LinkedIn campaign activities', async () => {
		mockRequest.mockResolvedValueOnce({ activities: [] });

		const plugin = emelia();
		const result = await plugin.endpoints!.linkedin.getActivities(mockCtx, {
			campaignId: 'li_1',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(lastCall().url).toBe('/linkedin/campaigns/li_1/activities');
		if (Array.isArray(result)) {
			throw new Error('expected activities envelope');
		}
		expect(result.activities).toEqual([]);
	});

	it('tools.findEmailSingle initiates a find-email job', async () => {
		mockRequest.mockResolvedValueOnce({ success: true, jobId: 'job_1' });

		const plugin = emelia();
		const result = await plugin.endpoints!.tools.findEmailSingle(mockCtx, {
			fullname: 'Alex Rao',
			companyName: 'Acme',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(lastCall().url).toBe('/tools/find/email');
		expect(result.jobId).toBe('job_1');
	});

	it('tools.getFindEmailResult returns a find-email result', async () => {
		mockRequest.mockResolvedValueOnce({
			success: true,
			data: { email: 'alex@acme.com', status: 'done' },
		});

		const plugin = emelia();
		const result = await plugin.endpoints!.tools.getFindEmailResult(mockCtx, {
			jobId: 'job_1',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(lastCall().url).toBe('/tools/find/email/job_1');
		expect(result.data.email).toBe('alex@acme.com');
	});

	it('tools.findPhoneSingle initiates a phone-find job', async () => {
		mockRequest.mockResolvedValueOnce({ success: true, jobId: 'job_2' });

		const plugin = emelia();
		const result = await plugin.endpoints!.tools.findPhoneSingle(mockCtx, {
			linkedinUrl: 'https://linkedin.com/in/alex',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(lastCall().url).toBe('/tools/find/phone');
		expect(result.jobId).toBe('job_2');
	});

	it('tools.getFindPhoneResult returns a phone-find result', async () => {
		mockRequest.mockResolvedValueOnce({
			success: true,
			data: { linkedinUrl: 'https://linkedin.com/in/alex', status: 'done' },
		});

		const plugin = emelia();
		const result = await plugin.endpoints!.tools.getFindPhoneResult(mockCtx, {
			jobId: 'job_2',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(lastCall().url).toBe('/tools/find/phone/job_2');
		expect(result.data.status).toBe('done');
	});

	it('tools.verifyEmailSingle initiates an email verification job', async () => {
		mockRequest.mockResolvedValueOnce({ success: true, jobId: 'job_3' });

		const plugin = emelia();
		const result = await plugin.endpoints!.tools.verifyEmailSingle(mockCtx, {
			email: 'alex@acme.com',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(lastCall().url).toBe('/tools/verify/email');
		expect(result.jobId).toBe('job_3');
	});

	it('tools.getVerifyEmailResult returns a verification result', async () => {
		mockRequest.mockResolvedValueOnce({
			success: true,
			data: { email: 'alex@acme.com', qualification: 'valid' },
		});

		const plugin = emelia();
		const result = await plugin.endpoints!.tools.getVerifyEmailResult(mockCtx, {
			jobId: 'job_3',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(lastCall().url).toBe('/tools/verify/email/job_3');
		expect(result.data.qualification).toBe('valid');
	});

	it('providers.list returns email providers', async () => {
		mockRequest.mockResolvedValueOnce([{ name: 'SMTP' }]);

		const plugin = emelia();
		const result = await plugin.endpoints!.providers.list(mockCtx, {});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(lastCall().url).toBe('/email-providers');
		expect(result).toHaveLength(1);
	});

	it('webhooks.list returns webhooks', async () => {
		mockRequest.mockResolvedValueOnce({
			webhooks: [{ url: 'https://example.com/hook' }],
		});

		const plugin = emelia();
		const result = await plugin.endpoints!.webhooks.list(mockCtx, {});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(lastCall().url).toBe('/webhook');
		if (Array.isArray(result)) {
			throw new Error('expected webhooks envelope');
		}
		expect(result.webhooks).toHaveLength(1);
	});

	it('webhooks.create creates a webhook', async () => {
		mockRequest.mockResolvedValueOnce({
			id: 'wh_1',
			url: 'https://example.com/hook',
		});

		const plugin = emelia();
		const result = await plugin.endpoints!.webhooks.create(mockCtx, {
			campaignId: 'cmp_1',
			url: 'https://example.com/hook',
			events: ['FINISHED'],
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(lastCall().url).toBe('/webhook');
		expect(lastCall().method).toBe('POST');
		expect(result.id).toBe('wh_1');
	});

	it('webhooks.remove deletes a webhook', async () => {
		mockRequest.mockResolvedValueOnce({ success: true });

		const plugin = emelia();
		const result = await plugin.endpoints!.webhooks.remove(mockCtx, {
			url: 'https://example.com/hook',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(lastCall().method).toBe('DELETE');
		expect(result.success).toBe(true);
	});
});
