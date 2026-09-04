import { AuthMissingError } from 'corsair/core';
import { makePlainRequest } from './client';
import { plain, plainEndpointSchemas } from './index';

jest.mock('./client', () => ({
	...jest.requireActual('./client'),
	makePlainRequest: jest.fn(),
}));

const mockMakePlainRequest = jest.mocked(makePlainRequest);

function endpointPaths(tree: Record<string, unknown>, prefix = ''): string[] {
	return Object.entries(tree).flatMap(([key, value]) => {
		const path = prefix ? `${prefix}.${key}` : key;
		if (typeof value === 'function') return [path];
		if (value && typeof value === 'object') {
			return endpointPaths(value as Record<string, unknown>, path);
		}
		return [];
	});
}

const mockCtx = {
	key: 'plainApiKey_test',
	$getAccountId: () => 'acct_plain_test',
	options: {},
	keys: {
		get_api_key: jest.fn().mockResolvedValue('plainApiKey_stored'),
	},
	logEvent: jest.fn(),
	database: {},
} as never;

const sampleCustomer = {
	id: 'cus_123',
	externalId: 'ext_123',
	fullName: 'Ada Lovelace',
	shortName: 'Ada',
	email: {
		email: 'ada@example.com',
		isVerified: true,
	},
};

const sampleThread = {
	id: 'th_123',
	ref: 'T-123',
	title: 'Need help with billing',
	status: 'TODO',
	priority: 1,
};

const sampleCustomerGroup = {
	id: 'cg_123',
	name: 'Enterprise',
	key: 'enterprise',
	color: 'blue',
	externalId: 'group_ext_1',
};

describe('Plain plugin', () => {
	beforeEach(() => {
		mockMakePlainRequest.mockReset();
	});

	it('exposes the full claimed operation surface with schemas and no webhooks', () => {
		const plugin = plain();
		const paths = endpointPaths(
			plugin.endpoints as Record<string, unknown>,
		).sort();

		expect(paths).toEqual([
			'companies.fetch',
			'companies.update',
			'customerGroups.addCustomer',
			'customerGroups.create',
			'customerGroups.list',
			'customerGroups.removeCustomer',
			'customers.delete',
			'customers.getByEmail',
			'customers.getById',
			'customers.list',
			'customers.upsert',
			'graphql.run',
			'threads.create',
			'threads.fetchIssues',
			'threads.getById',
			'threads.listDeprecated',
			'threads.query',
			'threads.sendMessage',
			'threads.update',
			'tiers.fetch',
			'tiers.list',
			'users.delete',
			'users.getById',
		]);
		expect(Object.keys(plainEndpointSchemas).sort()).toEqual(paths);
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(paths);
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher).toBeUndefined();
	});

	it('uses api_key auth and resolves keys', async () => {
		const plugin = plain({ key: 'plainApiKey_option' });
		expect(plugin.authConfig).toEqual({ api_key: {} });
		expect(plugin.options?.authType).toBe('api_key');

		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => null },
				} as never,
				'endpoint',
			),
		).resolves.toBe('plainApiKey_option');

		const pluginWithoutOption = plain();
		await expect(
			pluginWithoutOption.keyBuilder?.(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => null },
				} as never,
				'endpoint',
			),
		).rejects.toThrow(AuthMissingError);
	});

	it('calls get customer by id endpoint', async () => {
		mockMakePlainRequest.mockResolvedValue({ customer: sampleCustomer });
		const plugin = plain();
		const result = await plugin.endpoints.customers.getById(mockCtx, {
			customerId: 'cus_123',
		});

		expect(result.customer?.id).toBe('cus_123');
		expect(mockMakePlainRequest).toHaveBeenCalledWith(
			expect.stringContaining('query GetCustomerById'),
			'plainApiKey_test',
			{ customerId: 'cus_123' },
			'GetCustomerById',
		);
	});

	it('calls get customer by email endpoint', async () => {
		mockMakePlainRequest.mockResolvedValue({ customer: sampleCustomer });
		const plugin = plain();
		const result = await plugin.endpoints.customers.getByEmail(mockCtx, {
			email: 'ada@example.com',
		});

		expect(result.customer?.email?.email).toBe('ada@example.com');
		expect(mockMakePlainRequest).toHaveBeenCalledWith(
			expect.stringContaining('query GetCustomerByEmail'),
			'plainApiKey_test',
			{ email: 'ada@example.com' },
			'GetCustomerByEmail',
		);
	});

	it('calls get customers endpoint with pagination', async () => {
		mockMakePlainRequest.mockResolvedValue({
			customers: {
				totalCount: 1,
				pageInfo: {
					hasNextPage: false,
					hasPreviousPage: false,
					startCursor: null,
					endCursor: null,
				},
				edges: [{ node: sampleCustomer }],
			},
		});
		const plugin = plain();
		const result = await plugin.endpoints.customers.list(mockCtx, {
			first: 10,
		});

		expect(result.totalCount).toBe(1);
		expect(result.customers[0]?.id).toBe('cus_123');
	});

	it('calls upsert customer endpoint', async () => {
		mockMakePlainRequest.mockResolvedValue({
			upsertCustomer: {
				result: 'UPDATED',
				customer: sampleCustomer,
			},
		});
		const plugin = plain();
		const result = await plugin.endpoints.customers.upsert(mockCtx, {
			identifier: { emailAddress: 'ada@example.com' },
			onCreate: { fullName: 'Ada Lovelace' },
			onUpdate: { fullName: { value: 'Ada Lovelace' } },
		});

		expect(result.result).toBe('UPDATED');
		expect(result.customer?.id).toBe('cus_123');
	});

	it('calls delete customer endpoint', async () => {
		mockMakePlainRequest.mockResolvedValue({ deleteCustomer: {} });
		const plugin = plain();
		const result = await plugin.endpoints.customers.delete(mockCtx, {
			customerId: 'cus_123',
		});

		expect(result.success).toBe(true);
	});

	it('calls create thread endpoint', async () => {
		mockMakePlainRequest.mockResolvedValue({
			createThread: { thread: sampleThread },
		});
		const plugin = plain();
		const result = await plugin.endpoints.threads.create(mockCtx, {
			customerIdentifier: { customerId: 'cus_123' },
			title: 'Need help with billing',
		});

		expect(result.thread?.ref).toBe('T-123');
	});

	it('calls get thread by id endpoint', async () => {
		mockMakePlainRequest.mockResolvedValue({ thread: sampleThread });
		const plugin = plain();
		const result = await plugin.endpoints.threads.getById(mockCtx, {
			threadId: 'th_123',
		});

		expect(result.thread?.id).toBe('th_123');
	});

	it('calls query threads and deprecated list threads endpoints', async () => {
		mockMakePlainRequest.mockResolvedValue({
			threads: {
				totalCount: 1,
				pageInfo: {
					hasNextPage: false,
					hasPreviousPage: false,
					startCursor: null,
					endCursor: null,
				},
				edges: [{ node: sampleThread }],
			},
		});
		const plugin = plain();

		const queryResult = await plugin.endpoints.threads.query(mockCtx, {
			first: 5,
		});
		const listResult = await plugin.endpoints.threads.listDeprecated(mockCtx, {
			first: 5,
		});

		expect(queryResult.threads[0]?.id).toBe('th_123');
		expect(listResult.threads[0]?.id).toBe('th_123');
	});

	it('calls fetch issues endpoint and flattens thread links', async () => {
		mockMakePlainRequest.mockResolvedValue({
			customer: {
				threads: {
					totalCount: 1,
					pageInfo: {
						hasNextPage: false,
						hasPreviousPage: false,
						startCursor: null,
						endCursor: null,
					},
					edges: [
						{
							node: {
								id: 'th_123',
								ref: 'T-123',
								title: 'Need help with billing',
								links: {
									edges: [
										{
											node: {
												id: 'link_1',
												sourceId: 'ISSUE-1',
												sourceType: 'linear_issue',
												title: 'Billing bug',
												description: null,
												url: 'https://linear.app/issue/ISSUE-1',
												status: 'OPEN',
												linkType: 'RELATED_TO',
											},
										},
									],
								},
							},
						},
					],
				},
			},
		});
		const plugin = plain();
		const result = await plugin.endpoints.threads.fetchIssues(mockCtx, {
			customerId: 'cus_123',
		});

		expect(result.totalThreads).toBe(1);
		expect(result.issues[0]?.threadId).toBe('th_123');
		expect(result.issues[0]?.link.sourceType).toBe('linear_issue');
	});

	it('calls send message endpoint', async () => {
		mockMakePlainRequest.mockResolvedValue({ replyToThread: {} });
		const plugin = plain();
		const result = await plugin.endpoints.threads.sendMessage(mockCtx, {
			threadId: 'th_123',
			textContent: 'Thanks for the update',
		});

		expect(result.success).toBe(true);
	});

	it('calls update thread endpoint', async () => {
		mockMakePlainRequest.mockResolvedValue({
			updateThreadTitle: {
				thread: { ...sampleThread, title: 'Updated title' },
			},
		});
		const plugin = plain();
		const result = await plugin.endpoints.threads.update(mockCtx, {
			threadId: 'th_123',
			title: 'Updated title',
		});

		expect(result.thread?.title).toBe('Updated title');
	});

	it('calls get user and delete user endpoints', async () => {
		mockMakePlainRequest
			.mockResolvedValueOnce({
				user: {
					id: 'usr_1',
					fullName: 'Grace Hopper',
					publicName: 'Grace',
					email: 'grace@example.com',
					isDeleted: false,
				},
			})
			.mockResolvedValueOnce({ deleteUser: {} });

		const plugin = plain();
		const user = await plugin.endpoints.users.getById(mockCtx, {
			userId: 'usr_1',
		});
		const deleted = await plugin.endpoints.users.delete(mockCtx, {
			userId: 'usr_1',
		});

		expect(user.user?.id).toBe('usr_1');
		expect(deleted.success).toBe(true);
	});

	it('calls fetch company and update company endpoints', async () => {
		mockMakePlainRequest
			.mockResolvedValueOnce({
				company: {
					id: 'co_1',
					name: 'Plain Inc',
					domainName: 'plain.com',
					contractValue: 250000,
				},
			})
			.mockResolvedValueOnce({
				upsertCompany: {
					result: 'UPDATED',
					company: {
						id: 'co_1',
						name: 'Plain Inc',
						domainName: 'plain.com',
						contractValue: 300000,
					},
				},
			});

		const plugin = plain();
		const company = await plugin.endpoints.companies.fetch(mockCtx, {
			companyId: 'co_1',
		});
		const updated = await plugin.endpoints.companies.update(mockCtx, {
			identifier: { companyId: 'co_1' },
			name: 'Plain Inc',
			domainName: 'plain.com',
			contractValue: 300000,
		});

		expect(company.company?.id).toBe('co_1');
		expect(updated.result).toBe('UPDATED');
	});

	it('calls fetch tier and list tiers endpoints', async () => {
		mockMakePlainRequest
			.mockResolvedValueOnce({ tier: { id: 'tier_1', name: 'Enterprise' } })
			.mockResolvedValueOnce({
				tiers: {
					pageInfo: {
						hasNextPage: false,
						hasPreviousPage: false,
						startCursor: null,
						endCursor: null,
					},
					edges: [{ node: { id: 'tier_1', name: 'Enterprise' } }],
				},
			});

		const plugin = plain();
		const tier = await plugin.endpoints.tiers.fetch(mockCtx, {
			tierId: 'tier_1',
		});
		const tiers = await plugin.endpoints.tiers.list(mockCtx, { first: 10 });

		expect(tier.tier?.name).toBe('Enterprise');
		expect(tiers.tiers.length).toBe(1);
	});

	it('calls customer group endpoints', async () => {
		mockMakePlainRequest
			.mockResolvedValueOnce({
				createCustomerGroup: { customerGroup: sampleCustomerGroup },
			})
			.mockResolvedValueOnce({
				customerGroups: {
					pageInfo: {
						hasNextPage: false,
						hasPreviousPage: false,
						startCursor: null,
						endCursor: null,
					},
					edges: [{ node: sampleCustomerGroup }],
				},
			})
			.mockResolvedValueOnce({
				addCustomerToCustomerGroups: {
					customerGroupMemberships: [
						{ customerId: 'cus_123', customerGroup: sampleCustomerGroup },
					],
				},
			})
			.mockResolvedValueOnce({ removeCustomerFromCustomerGroups: {} });

		const plugin = plain();
		const created = await plugin.endpoints.customerGroups.create(mockCtx, {
			name: 'Enterprise',
			key: 'enterprise',
			color: 'blue',
		});
		const listed = await plugin.endpoints.customerGroups.list(mockCtx, {});
		const added = await plugin.endpoints.customerGroups.addCustomer(mockCtx, {
			customerId: 'cus_123',
			customerGroupIdentifiers: [{ customerGroupKey: 'enterprise' }],
		});
		const removed = await plugin.endpoints.customerGroups.removeCustomer(
			mockCtx,
			{
				customerId: 'cus_123',
				customerGroupIdentifiers: [{ customerGroupKey: 'enterprise' }],
			},
		);

		expect(created.customerGroup.key).toBe('enterprise');
		expect(listed.customerGroups[0]?.id).toBe('cg_123');
		expect(added.customerGroupMemberships[0]?.customerId).toBe('cus_123');
		expect(removed.success).toBe(true);
	});

	it('calls run graphql query endpoint', async () => {
		mockMakePlainRequest.mockResolvedValue({
			myWorkspace: { id: 'ws_123', name: 'Plain Workspace' },
		});
		const plugin = plain();
		const result = await plugin.endpoints.graphql.run(mockCtx, {
			query: 'query { myWorkspace { id name } }',
		});

		expect(result.data).toEqual({
			myWorkspace: { id: 'ws_123', name: 'Plain Workspace' },
		});
	});
});
