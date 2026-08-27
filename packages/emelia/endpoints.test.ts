import { request } from 'corsair/http';
import { errorHandlers } from './error-handlers';
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

		const expectedEndpoints = [
			'account.me',
			'campaigns.list',
			'campaigns.addContact',
			'campaigns.removeContact',
			'contacts.listLists',
			'contacts.addToList',
		];

		expect(Object.keys(emeliaEndpointSchemas).sort()).toEqual(
			expectedEndpoints.sort(),
		);
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(
			expectedEndpoints.sort(),
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

describe('Emelia Error Handlers', () => {
	it('handles rate limit errors with retry', async () => {
		const handler = errorHandlers.RATE_LIMIT_ERROR;
		expect(
			handler.match(new Error('Rate_Limited: 429 too many requests')),
		).toBe(true);

		const result = await handler.handler(new Error('Rate limit exceeded'));
		expect(result.maxRetries).toBe(3);
	});

	it('handles auth errors without retrying', async () => {
		const handler = errorHandlers.AUTH_ERROR;
		expect(handler.match(new Error('Unauthorized: Invalid API key'))).toBe(
			true,
		);

		const result = await handler.handler();
		expect(result.maxRetries).toBe(0);
	});
});
