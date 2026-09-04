import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import { BrevoAPIError } from './client';
import { Account, Contacts, EmailCampaigns } from './endpoints';
import {
	BrevoEndpointInputSchemas,
	BrevoEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import type { BrevoContext } from './index';
import { brevo } from './index';

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makeBrevoRequest: jest.fn(),
	};
});

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn(),
	};
});

describe('Brevo Plugin & Client Tests', () => {
	const mockMakeBrevoRequest = client.makeBrevoRequest as jest.MockedFunction<
		typeof client.makeBrevoRequest
	>;
	const mockLogEventFromContext = logEventFromContext as jest.MockedFunction<
		typeof logEventFromContext
	>;

	const mockDbContacts = {
		upsertByEntityId: jest.fn(),
		deleteByEntityId: jest.fn(),
	};

	const mockDbCampaigns = {
		upsertByEntityId: jest.fn(),
		deleteByEntityId: jest.fn(),
	};

	const createMockContext = (key = 'test-api-key'): BrevoContext =>
		({
			key,
			db: {
				contacts: mockDbContacts,
				campaigns: mockDbCampaigns,
			},
			$getAccountId: async () => 'test-account-id',
		}) as unknown as BrevoContext;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Plugin initialization and configuration', () => {
		it('instantiates the plugin correctly', () => {
			const plugin = brevo({ key: 'test-api-key' });
			expect(plugin.id).toBe('brevo');
			expect(plugin.options?.key).toBe('test-api-key');
			expect(plugin.authConfig).toEqual({ api_key: { account: [] } });
			expect(plugin.endpointMeta?.['emailCampaigns.sendNow']?.riskLevel).toBe(
				'destructive',
			);
			expect(plugin.endpoints?.account.get).toBeDefined();
			expect(plugin.endpoints?.contacts.list).toBeDefined();
			expect(plugin.endpoints?.emailCampaigns.list).toBeDefined();
		});

		it('keyBuilder returns the provided key for endpoint source', async () => {
			const plugin = brevo({ key: 'static-key' });
			const key = await (plugin.keyBuilder as any)?.(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => 'stored-key' },
				},
				'endpoint',
			);
			expect(key).toBe('static-key');
		});

		it('keyBuilder retrieves API key from context when option key is omitted', async () => {
			const plugin = brevo();
			const key = await (plugin.keyBuilder as any)?.(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => 'stored-key' },
				},
				'endpoint',
			);
			expect(key).toBe('stored-key');
		});
	});

	describe('Account Endpoints', () => {
		it('account.get retrieves account information and logs event', async () => {
			const ctx = createMockContext();
			const accountData = {
				email: 'owner@example.com',
				firstName: 'Jane',
				lastName: 'Doe',
				companyName: 'Acme Corp',
				address: {
					street: '123 Main St',
					city: 'San Francisco',
					zipCode: '94105',
					country: 'USA',
				},
				plan: [
					{
						type: 'free',
						credits: 300,
						creditsType: 'sendLimit',
					},
				],
				relay: {
					enabled: true,
					data: {
						userName: 'owner@example.com',
						relay: 'smtp-relay.brevo.com',
						port: 587,
					},
				},
			};

			mockMakeBrevoRequest.mockResolvedValueOnce(accountData);

			const result = await Account.get(ctx, {});
			expect(result).toEqual(accountData);
			expect(mockMakeBrevoRequest).toHaveBeenCalledWith(
				'account',
				'test-api-key',
				expect.objectContaining({ method: 'GET' }),
			);
			expect(mockLogEventFromContext).toHaveBeenCalledWith(
				ctx,
				'brevo.account.get',
				{ email: 'owner@example.com' },
				'completed',
			);
			expect(() =>
				BrevoEndpointOutputSchemas.accountGet.parse(result),
			).not.toThrow();
		});
	});

	describe('Contacts Endpoints', () => {
		it('contacts.list retrieves contacts list and caches to database', async () => {
			const ctx = createMockContext();
			const contactsListResponse = {
				contacts: [
					{
						id: 1,
						email: 'user1@example.com',
						emailBlacklisted: false,
						smsBlacklisted: false,
						createdAt: '2026-01-01T00:00:00.000Z',
						modifiedAt: '2026-01-02T00:00:00.000Z',
						attributes: { FIRSTNAME: 'John' },
					},
				],
				count: 1,
			};

			mockMakeBrevoRequest.mockResolvedValueOnce(contactsListResponse);

			const result = await Contacts.list(ctx, { limit: 10, offset: 0 });
			expect(result).toEqual(contactsListResponse);
			expect(mockMakeBrevoRequest).toHaveBeenCalledWith(
				'contacts',
				'test-api-key',
				expect.objectContaining({
					method: 'GET',
					query: { limit: 10, offset: 0 },
				}),
			);
			expect(mockDbContacts.upsertByEntityId).toHaveBeenCalledWith('1', {
				id: 1,
				email: 'user1@example.com',
				emailBlacklisted: false,
				smsBlacklisted: false,
				createdAt: '2026-01-01T00:00:00.000Z',
				modifiedAt: '2026-01-02T00:00:00.000Z',
				attributes: { FIRSTNAME: 'John' },
			});
			expect(mockLogEventFromContext).toHaveBeenCalledWith(
				ctx,
				'brevo.contacts.list',
				{ count: 1 },
				'completed',
			);
		});

		it('contacts.get retrieves a single contact and caches to database', async () => {
			const ctx = createMockContext();
			const contact = {
				id: 42,
				email: 'alice@example.com',
				emailBlacklisted: false,
				smsBlacklisted: false,
				createdAt: '2026-01-01T00:00:00.000Z',
				modifiedAt: '2026-01-02T00:00:00.000Z',
				attributes: { FIRSTNAME: 'Alice' },
			};

			mockMakeBrevoRequest.mockResolvedValueOnce(contact);

			const result = await Contacts.get(ctx, {
				identifier: 'alice@example.com',
			});
			expect(result).toEqual(contact);
			expect(mockMakeBrevoRequest).toHaveBeenCalledWith(
				'contacts/alice%40example.com',
				'test-api-key',
				{ method: 'GET' },
			);
			expect(mockDbContacts.upsertByEntityId).toHaveBeenCalledWith('42', {
				id: 42,
				email: 'alice@example.com',
				emailBlacklisted: false,
				smsBlacklisted: false,
				createdAt: '2026-01-01T00:00:00.000Z',
				modifiedAt: '2026-01-02T00:00:00.000Z',
				attributes: { FIRSTNAME: 'Alice' },
			});
		});

		it('contacts.get ignores an attributes filter that Brevo does not support', async () => {
			const parsed = BrevoEndpointInputSchemas.contactsGet.parse({
				identifier: 'alice@example.com',
				attributes: ['FIRSTNAME'],
			});
			expect(parsed).toEqual({ identifier: 'alice@example.com' });
		});

		it('contacts.create creates a contact and returns ID', async () => {
			const ctx = createMockContext();
			mockMakeBrevoRequest.mockResolvedValueOnce({ id: 101 });

			const input = {
				email: 'newuser@example.com',
				attributes: { FIRSTNAME: 'New', LASTNAME: 'User' },
				listIds: [2],
			};

			const result = await Contacts.create(ctx, input);
			expect(result).toEqual({ id: 101 });
			expect(mockMakeBrevoRequest).toHaveBeenCalledWith(
				'contacts',
				'test-api-key',
				expect.objectContaining({
					method: 'POST',
					body: expect.objectContaining({
						email: 'newuser@example.com',
					}),
				}),
			);
			expect(mockDbContacts.upsertByEntityId).toHaveBeenCalledWith(
				'101',
				expect.objectContaining({
					id: 101,
					email: 'newuser@example.com',
				}),
			);
		});

		it('contacts.update sends PUT request', async () => {
			const ctx = createMockContext();
			mockMakeBrevoRequest
				.mockResolvedValueOnce(undefined)
				.mockResolvedValueOnce({
					id: 101,
					email: 'newuser@example.com',
					attributes: { FIRSTNAME: 'Updated' },
				});

			const result = await Contacts.update(ctx, {
				identifier: 101,
				attributes: { FIRSTNAME: 'Updated' },
			});
			expect(result).toEqual({ success: true });
			expect(mockMakeBrevoRequest).toHaveBeenCalledWith(
				'contacts/101',
				'test-api-key',
				expect.objectContaining({
					method: 'PUT',
					body: { attributes: { FIRSTNAME: 'Updated' } },
				}),
			);
			expect(mockDbContacts.upsertByEntityId).toHaveBeenCalledWith(
				'101',
				expect.objectContaining({
					id: 101,
					email: 'newuser@example.com',
					attributes: { FIRSTNAME: 'Updated' },
				}),
			);
		});

		it('contacts.delete sends DELETE request and removes from database', async () => {
			const ctx = createMockContext();
			mockMakeBrevoRequest.mockResolvedValueOnce(undefined);

			const result = await Contacts.deleteContact(ctx, {
				identifier: 101,
			});
			expect(result).toEqual({ success: true });
			expect(mockMakeBrevoRequest).toHaveBeenCalledWith(
				'contacts/101',
				'test-api-key',
				expect.objectContaining({ method: 'DELETE' }),
			);
			expect(mockDbContacts.deleteByEntityId).toHaveBeenCalledWith('101');
		});

		it('contacts.delete by email removes the numeric cached id', async () => {
			const ctx = createMockContext();
			mockMakeBrevoRequest
				.mockResolvedValueOnce({
					id: 42,
					email: 'alice@example.com',
				})
				.mockResolvedValueOnce(undefined);

			await Contacts.deleteContact(ctx, {
				identifier: 'alice@example.com',
			});

			expect(mockMakeBrevoRequest).toHaveBeenNthCalledWith(
				1,
				'contacts/alice%40example.com',
				'test-api-key',
				expect.objectContaining({ method: 'GET' }),
			);
			expect(mockMakeBrevoRequest).toHaveBeenNthCalledWith(
				2,
				'contacts/alice%40example.com',
				'test-api-key',
				expect.objectContaining({ method: 'DELETE' }),
			);
			expect(mockDbContacts.deleteByEntityId).toHaveBeenCalledWith('42');
		});

		it('contacts.create rejects an invalid email before calling the API', async () => {
			const ctx = createMockContext();
			await expect(
				Contacts.create(ctx, { email: 'not-an-email' } as never),
			).rejects.toThrow();
			expect(mockMakeBrevoRequest).not.toHaveBeenCalled();
		});

		it('contacts.create rejects a contact with no identity', async () => {
			const ctx = createMockContext();
			await expect(
				Contacts.create(ctx, { attributes: { FIRSTNAME: 'Ada' } } as never),
			).rejects.toThrow();
			expect(mockMakeBrevoRequest).not.toHaveBeenCalled();
		});

		it('contacts.create accepts an ext_id-only contact', async () => {
			const ctx = createMockContext();
			mockMakeBrevoRequest.mockResolvedValueOnce({ id: 202 });

			const result = await Contacts.create(ctx, { ext_id: 'crm-202' });
			expect(result).toEqual({ id: 202 });
			expect(mockMakeBrevoRequest).toHaveBeenCalledWith(
				'contacts',
				'test-api-key',
				expect.objectContaining({
					method: 'POST',
					body: { ext_id: 'crm-202' },
				}),
			);
		});

		it('contacts.create accepts an SMS-only contact', async () => {
			const ctx = createMockContext();
			mockMakeBrevoRequest.mockResolvedValueOnce({ id: 203 });

			const result = await Contacts.create(ctx, {
				attributes: { SMS: '+33123456789' },
			});
			expect(result).toEqual({ id: 203 });
			expect(mockMakeBrevoRequest).toHaveBeenCalledWith(
				'contacts',
				'test-api-key',
				expect.objectContaining({
					method: 'POST',
					body: { attributes: { SMS: '+33123456789' } },
				}),
			);
		});
	});

	describe('Email Campaigns Endpoints', () => {
		it('emailCampaigns.list lists campaigns and caches to database', async () => {
			const ctx = createMockContext();
			const campaignsResponse = {
				campaigns: [
					{
						id: 50,
						name: 'Weekly Promo',
						subject: 'Special discounts',
						type: 'classic',
						status: 'sent',
						scheduledAt: '2026-02-01T10:00:00.000Z',
						createdAt: '2026-01-30T10:00:00.000Z',
						modifiedAt: '2026-02-01T10:00:00.000Z',
					},
				],
				count: 1,
			};

			mockMakeBrevoRequest.mockResolvedValueOnce(campaignsResponse);

			const result = await EmailCampaigns.list(ctx, {
				type: 'classic',
				status: 'sent',
			});
			expect(result).toEqual(campaignsResponse);
			expect(mockMakeBrevoRequest).toHaveBeenCalledWith(
				'emailCampaigns',
				'test-api-key',
				expect.objectContaining({
					method: 'GET',
					query: { type: 'classic', status: 'sent' },
				}),
			);
			expect(mockDbCampaigns.upsertByEntityId).toHaveBeenCalledWith(
				'50',
				expect.objectContaining({
					id: 50,
					name: 'Weekly Promo',
					status: 'sent',
				}),
			);
		});

		it('emailCampaigns.get gets a single campaign', async () => {
			const ctx = createMockContext();
			const campaign = {
				id: 50,
				name: 'Weekly Promo',
				subject: 'Special discounts',
				type: 'classic',
				status: 'sent',
				htmlContent: '<html><body>Hello</body></html>',
				createdAt: '2026-01-30T10:00:00.000Z',
				modifiedAt: '2026-02-01T10:00:00.000Z',
				sender: { name: 'Acme', email: 'news@acme.com' },
			};

			mockMakeBrevoRequest.mockResolvedValueOnce(campaign);

			const result = await EmailCampaigns.get(ctx, { campaignId: 50 });
			expect(result).toEqual(campaign);
			expect(mockMakeBrevoRequest).toHaveBeenCalledWith(
				'emailCampaigns/50',
				'test-api-key',
				expect.objectContaining({ method: 'GET' }),
			);
			expect(mockDbCampaigns.upsertByEntityId).toHaveBeenCalledWith(
				'50',
				expect.objectContaining({
					id: 50,
					name: 'Weekly Promo',
				}),
			);
		});

		it('emailCampaigns.create rejects a campaign missing sender or content', async () => {
			const ctx = createMockContext();
			await expect(
				EmailCampaigns.create(ctx, { name: 'New Product Launch' } as never),
			).rejects.toThrow();
			expect(mockMakeBrevoRequest).not.toHaveBeenCalled();
		});

		it('emailCampaigns.create creates a campaign', async () => {
			const ctx = createMockContext();
			mockMakeBrevoRequest.mockResolvedValueOnce({ id: 99 });

			const input = {
				name: 'New Product Launch',
				subject: 'Introducing Our New Product',
				sender: { name: 'Acme', email: 'news@acme.com' },
				htmlContent: '<p>Launch details</p>',
			};

			const result = await EmailCampaigns.create(ctx, input);
			expect(result).toEqual({ id: 99 });
			expect(mockMakeBrevoRequest).toHaveBeenCalledWith(
				'emailCampaigns',
				'test-api-key',
				expect.objectContaining({
					method: 'POST',
					body: input,
				}),
			);
		});

		it('emailCampaigns.update updates campaign details', async () => {
			const ctx = createMockContext();
			mockMakeBrevoRequest
				.mockResolvedValueOnce(undefined)
				.mockResolvedValueOnce({
					id: 99,
					name: 'Updated Product Launch',
					subject: 'Introducing Our New Product',
					status: 'draft',
				});

			const result = await EmailCampaigns.update(ctx, {
				campaignId: 99,
				name: 'Updated Product Launch',
			});
			expect(result).toEqual({ success: true });
			expect(mockMakeBrevoRequest).toHaveBeenNthCalledWith(
				1,
				'emailCampaigns/99',
				'test-api-key',
				expect.objectContaining({
					method: 'PUT',
					body: { name: 'Updated Product Launch' },
				}),
			);
			expect(mockMakeBrevoRequest).toHaveBeenNthCalledWith(
				2,
				'emailCampaigns/99',
				'test-api-key',
				expect.objectContaining({ method: 'GET' }),
			);
			expect(mockDbCampaigns.upsertByEntityId).toHaveBeenCalledWith(
				'99',
				expect.objectContaining({
					id: 99,
					name: 'Updated Product Launch',
				}),
			);
		});

		it('emailCampaigns.delete deletes a campaign', async () => {
			const ctx = createMockContext();
			mockMakeBrevoRequest.mockResolvedValueOnce(undefined);

			const result = await EmailCampaigns.deleteCampaign(ctx, {
				campaignId: 99,
			});
			expect(result).toEqual({ success: true });
			expect(mockMakeBrevoRequest).toHaveBeenCalledWith(
				'emailCampaigns/99',
				'test-api-key',
				expect.objectContaining({ method: 'DELETE' }),
			);
			expect(mockDbCampaigns.deleteByEntityId).toHaveBeenCalledWith('99');
		});

		it('emailCampaigns.sendNow triggers immediate campaign delivery', async () => {
			const ctx = createMockContext();
			mockMakeBrevoRequest.mockResolvedValueOnce(undefined);

			const result = await EmailCampaigns.sendNow(ctx, {
				campaignId: 99,
			});
			expect(result).toEqual({ success: true });
			expect(mockMakeBrevoRequest).toHaveBeenCalledWith(
				'emailCampaigns/99/sendNow',
				'test-api-key',
				expect.objectContaining({ method: 'POST' }),
			);
		});

		it('emailCampaigns.sendTest rejects an empty recipient list before calling the API', async () => {
			const ctx = createMockContext();
			await expect(
				EmailCampaigns.sendTest(ctx, {
					campaignId: 99,
					emailTo: [],
				}),
			).rejects.toThrow();
			expect(mockMakeBrevoRequest).not.toHaveBeenCalled();
		});

		it('emailCampaigns.sendTest rejects invalid emails before calling the API', async () => {
			const ctx = createMockContext();
			await expect(
				EmailCampaigns.sendTest(ctx, {
					campaignId: 99,
					emailTo: ['not-an-email'],
				}),
			).rejects.toThrow();
			expect(mockMakeBrevoRequest).not.toHaveBeenCalled();
		});

		it('emailCampaigns.sendTest sends a test email', async () => {
			const ctx = createMockContext();
			mockMakeBrevoRequest.mockResolvedValueOnce(undefined);

			const result = await EmailCampaigns.sendTest(ctx, {
				campaignId: 99,
				emailTo: ['tester@example.com'],
			});
			expect(result).toEqual({ success: true });
			expect(mockMakeBrevoRequest).toHaveBeenCalledWith(
				'emailCampaigns/99/sendTest',
				'test-api-key',
				expect.objectContaining({
					method: 'POST',
					body: { emailTo: ['tester@example.com'] },
				}),
			);
			expect(mockLogEventFromContext).toHaveBeenCalledWith(
				ctx,
				'brevo.emailCampaigns.sendTest',
				{ campaignId: 99, recipientCount: 1 },
				'completed',
			);
		});
	});

	describe('Error Handlers', () => {
		it('RATE_LIMIT_ERROR matches 429 status and returns backoff', async () => {
			const err = new BrevoAPIError('Too many requests', '429', {
				status: 429,
				retryAfter: 5000,
			});
			expect(errorHandlers.RATE_LIMIT_ERROR.match(err as any)).toBe(true);

			const res = await errorHandlers.RATE_LIMIT_ERROR.handler(err as any);
			expect(res.maxRetries).toBe(3);
			expect(res.headersRetryAfterMs).toBe(5000);
			expect(res).not.toHaveProperty('backoffMs');
		});

		it('QUOTA_ERROR matches 402 and does not retry', async () => {
			const err = new BrevoAPIError('Payment required', '402', {
				status: 402,
			});
			expect(errorHandlers.QUOTA_ERROR.match(err as any)).toBe(true);
			const res = await errorHandlers.QUOTA_ERROR.handler();
			expect(res.maxRetries).toBe(0);
		});

		it('AUTH_ERROR matches 401 status and sets maxRetries 0', async () => {
			const err = new BrevoAPIError('Invalid API key', 'unauthorized', {
				status: 401,
			});
			expect(errorHandlers.AUTH_ERROR.match(err as any)).toBe(true);

			const res = await errorHandlers.AUTH_ERROR.handler();
			expect(res.maxRetries).toBe(0);
		});

		it('PERMISSION_ERROR matches 403 status', async () => {
			const err = new BrevoAPIError('Access denied', 'forbidden', {
				status: 403,
			});
			expect(errorHandlers.PERMISSION_ERROR.match(err as any)).toBe(true);
		});

		it('NOT_FOUND_ERROR matches 404 and document_not_found code', async () => {
			const err = new BrevoAPIError('Contact not found', 'document_not_found', {
				status: 404,
			});
			expect(errorHandlers.NOT_FOUND_ERROR.match(err as any)).toBe(true);
		});

		it('BAD_REQUEST_ERROR matches invalid_parameter code', async () => {
			const err = new BrevoAPIError(
				'Invalid parameter email',
				'invalid_parameter',
				{ status: 400 },
			);
			expect(errorHandlers.BAD_REQUEST_ERROR.match(err as any)).toBe(true);
		});

		it('SERVER_ERROR matches 500 status and sets retry backoff', async () => {
			const err = new BrevoAPIError('Internal server error', '500', {
				status: 500,
			});
			expect(errorHandlers.SERVER_ERROR.match(err as any)).toBe(true);

			const res = await errorHandlers.SERVER_ERROR.handler();
			expect(res.maxRetries).toBe(2);
			expect(res.retryStrategy).toBe('exponential_backoff');
			expect(res).not.toHaveProperty('backoffMs');
		});
	});
});
