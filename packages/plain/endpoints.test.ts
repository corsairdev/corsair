import { AuthMissingError } from 'corsair/core';
import { makePlainRequest, PlainAPIError } from './client';
import { plain, plainEndpointSchemas } from './index';
import type { PlainContext } from './index';

jest.mock('./client', () => ({
	...jest.requireActual('./client'),
	makePlainRequest: jest.fn(),
}));

const mockMakePlainRequest = jest.mocked(makePlainRequest);

// JUSTIFY(as never, test-only): endpoint handlers only read `ctx.key` (plus
// `$getAccountId` via the real `logEventFromContext`, which tolerates an
// absent database). Building a full `PlainContext` (bound endpoint tree, key
// manager, entity services) is out of scope for unit tests, so the minimal
// fixture is asserted once here. Production code contains no `as`.
function mockCtx(key: string | undefined): PlainContext {
	return {
		key,
		$getAccountId: async () => 'acct_plain_test',
		database: undefined,
	} as never;
}

function mockKeyCtx(
	getApiKey: () => Promise<string | null>,
	// JUSTIFY(never, test-only): the plugin `keyBuilder` parameter resolves to
	// `never` in the corsair core types, so only a `never`-typed fixture is
	// accepted. The fixture itself only carries `authType`/`keys`, which is
	// all the key builder reads. Production code contains no `as`.
): never {
	return {
		authType: 'api_key',
		keys: { get_api_key: getApiKey },
	} as never;
}

function getEndpoints() {
	const plugin = plain();
	const endpoints = plugin.endpoints;
	if (endpoints === undefined) {
		throw new Error('plain plugin must expose endpoints');
	}
	return { plugin, endpoints };
}

const pageInfo = {
	hasNextPage: false,
	hasPreviousPage: false,
	startCursor: null,
	endCursor: null,
};

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

const sampleUser = {
	id: 'usr_1',
	fullName: 'Grace Hopper',
	publicName: 'Grace',
	email: 'grace@example.com',
	isDeleted: false,
};

const sampleCompany = {
	id: 'co_1',
	name: 'Plain Inc',
	domainName: 'plain.com',
	contractValue: 250000,
};

const sampleTier = {
	id: 'tier_1',
	name: 'Enterprise',
	externalId: 'tier_ext_1',
	color: '#FABADA',
	isDefault: false,
};

describe('Plain endpoint surface', () => {
	it('exposes all 23 operations with schemas, meta, api_key auth, no webhooks', () => {
		const { plugin, endpoints } = getEndpoints();

		expect(typeof endpoints.customers.getById).toBe('function');
		expect(typeof endpoints.customers.getByEmail).toBe('function');
		expect(typeof endpoints.customers.list).toBe('function');
		expect(typeof endpoints.customers.upsert).toBe('function');
		expect(typeof endpoints.customers.delete).toBe('function');
		expect(typeof endpoints.threads.create).toBe('function');
		expect(typeof endpoints.threads.getById).toBe('function');
		expect(typeof endpoints.threads.query).toBe('function');
		expect(typeof endpoints.threads.listDeprecated).toBe('function');
		expect(typeof endpoints.threads.fetchIssues).toBe('function');
		expect(typeof endpoints.threads.sendMessage).toBe('function');
		expect(typeof endpoints.threads.update).toBe('function');
		expect(typeof endpoints.users.getById).toBe('function');
		expect(typeof endpoints.users.delete).toBe('function');
		expect(typeof endpoints.companies.fetch).toBe('function');
		expect(typeof endpoints.companies.update).toBe('function');
		expect(typeof endpoints.tiers.fetch).toBe('function');
		expect(typeof endpoints.tiers.list).toBe('function');
		expect(typeof endpoints.customerGroups.create).toBe('function');
		expect(typeof endpoints.customerGroups.list).toBe('function');
		expect(typeof endpoints.customerGroups.addCustomer).toBe('function');
		expect(typeof endpoints.customerGroups.removeCustomer).toBe('function');
		expect(typeof endpoints.graphql.run).toBe('function');

		expect(Object.keys(plainEndpointSchemas).sort()).toEqual([
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
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(
			Object.keys(plainEndpointSchemas).sort(),
		);
		expect(plugin.endpointMeta?.['graphql.run']?.riskLevel).toBe('write');
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher).toBeUndefined();
	});

	it('uses api_key auth and resolves keys', async () => {
		const plugin = plain({ key: 'plainApiKey_option' });
		expect(plugin.authConfig).toEqual({ api_key: {} });

		const explicitAuth = plain({ authType: 'api_key', key: 'k' });
		const explicitOptions = explicitAuth.options;
		if (explicitOptions === undefined) {
			throw new Error('plain plugin must expose options');
		}
		expect(explicitOptions.authType).toBe('api_key');

		await expect(
			plugin.keyBuilder?.(mockKeyCtx(async () => null), 'endpoint'),
		).resolves.toBe('plainApiKey_option');

		const pluginWithoutOption = plain();
		await expect(
			pluginWithoutOption.keyBuilder?.(
				mockKeyCtx(async () => null),
				'endpoint',
			),
		).rejects.toThrow(AuthMissingError);
		await expect(
			pluginWithoutOption.keyBuilder?.(
				mockKeyCtx(async () => 'plainApiKey_stored'),
				'endpoint',
			),
		).resolves.toBe('plainApiKey_stored');
	});
});

describe('Plain customer endpoints', () => {
	beforeEach(() => {
		mockMakePlainRequest.mockReset();
	});

	it('gets a customer by id', async () => {
		mockMakePlainRequest.mockResolvedValue({ customer: sampleCustomer });
		const { endpoints } = getEndpoints();
		const result = await endpoints.customers.getById(mockCtx('k'), {
			customerId: 'cus_123',
		});

		expect(result.customer?.id).toBe('cus_123');
		expect(mockMakePlainRequest).toHaveBeenCalledWith(
			expect.stringContaining('query GetCustomerById'),
			'k',
			{ customerId: 'cus_123' },
			'GetCustomerById',
		);
	});

	it('gets a customer by email', async () => {
		mockMakePlainRequest.mockResolvedValue({ customer: sampleCustomer });
		const { endpoints } = getEndpoints();
		const result = await endpoints.customers.getByEmail(mockCtx('k'), {
			email: 'ada@example.com',
		});

		expect(result.customer?.email.email).toBe('ada@example.com');
		expect(mockMakePlainRequest).toHaveBeenCalledWith(
			expect.stringContaining('query GetCustomerByEmail'),
			'k',
			{ email: 'ada@example.com' },
			'GetCustomerByEmail',
		);
	});

	it('lists customers with pagination', async () => {
		mockMakePlainRequest.mockResolvedValue({
			customers: {
				totalCount: 1,
				pageInfo,
				edges: [{ node: sampleCustomer }],
			},
		});
		const { endpoints } = getEndpoints();
		const result = await endpoints.customers.list(mockCtx('k'), {
			first: 10,
		});

		expect(result.totalCount).toBe(1);
		expect(result.customers[0]?.id).toBe('cus_123');
		expect(result.pageInfo.hasNextPage).toBe(false);
	});

	it('upserts a customer', async () => {
		mockMakePlainRequest.mockResolvedValue({
			upsertCustomer: {
				result: 'UPDATED',
				customer: sampleCustomer,
			},
		});
		const { endpoints } = getEndpoints();
		const result = await endpoints.customers.upsert(mockCtx('k'), {
			identifier: { emailAddress: 'ada@example.com' },
			onCreate: {
				fullName: 'Ada Lovelace',
				email: { email: 'ada@example.com', isVerified: false },
			},
			onUpdate: { fullName: { value: 'Ada Lovelace' } },
		});

		expect(result.result).toBe('UPDATED');
		expect(result.customer?.id).toBe('cus_123');
		expect(mockMakePlainRequest).toHaveBeenCalledWith(
			expect.stringContaining('mutation UpsertCustomer'),
			'k',
			expect.objectContaining({ input: expect.objectContaining({}) }),
			'UpsertCustomer',
		);
	});

	it('deletes a customer', async () => {
		mockMakePlainRequest.mockResolvedValue({ deleteCustomer: {} });
		const { endpoints } = getEndpoints();
		const result = await endpoints.customers.delete(mockCtx('k'), {
			customerId: 'cus_123',
		});

		expect(result.success).toBe(true);
	});
});

describe('Plain thread endpoints', () => {
	beforeEach(() => {
		mockMakePlainRequest.mockReset();
	});

	it('creates a thread', async () => {
		mockMakePlainRequest.mockResolvedValue({
			createThread: { thread: sampleThread },
		});
		const { endpoints } = getEndpoints();
		const result = await endpoints.threads.create(mockCtx('k'), {
			customerIdentifier: { customerId: 'cus_123' },
			title: 'Need help with billing',
		});

		expect(result.thread?.ref).toBe('T-123');
	});

	it('gets a thread by id', async () => {
		mockMakePlainRequest.mockResolvedValue({ thread: sampleThread });
		const { endpoints } = getEndpoints();
		const result = await endpoints.threads.getById(mockCtx('k'), {
			threadId: 'th_123',
		});

		expect(result.thread?.id).toBe('th_123');
	});

	it('queries threads and serves the deprecated list operation', async () => {
		mockMakePlainRequest.mockResolvedValue({
			threads: {
				totalCount: 1,
				pageInfo,
				edges: [{ node: sampleThread }],
			},
		});
		const { endpoints } = getEndpoints();

		const queryResult = await endpoints.threads.query(mockCtx('k'), {
			first: 5,
		});
		const listResult = await endpoints.threads.listDeprecated(mockCtx('k'), {
			first: 5,
		});

		expect(queryResult.threads[0]?.id).toBe('th_123');
		expect(queryResult.totalCount).toBe(1);
		expect(listResult.threads[0]?.id).toBe('th_123');
	});

	it('fetches issues and flattens thread links', async () => {
		mockMakePlainRequest.mockResolvedValue({
			customer: {
				threads: {
					totalCount: 1,
					pageInfo,
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
		const { endpoints } = getEndpoints();
		const result = await endpoints.threads.fetchIssues(mockCtx('k'), {
			customerId: 'cus_123',
		});

		expect(result.totalThreads).toBe(1);
		expect(result.issues[0]?.threadId).toBe('th_123');
		expect(result.issues[0]?.threadRef).toBe('T-123');
		expect(result.issues[0]?.link.sourceType).toBe('linear_issue');
	});

	it('returns an empty issue list when the customer has no record', async () => {
		mockMakePlainRequest.mockResolvedValue({ customer: null });
		const { endpoints } = getEndpoints();
		const result = await endpoints.threads.fetchIssues(mockCtx('k'), {
			customerId: 'cus_missing',
		});

		expect(result.issues).toEqual([]);
		expect(result.totalThreads).toBe(0);
	});

	it('sends a message', async () => {
		mockMakePlainRequest.mockResolvedValue({ replyToThread: {} });
		const { endpoints } = getEndpoints();
		const result = await endpoints.threads.sendMessage(mockCtx('k'), {
			threadId: 'th_123',
			textContent: 'Thanks for the update',
		});

		expect(result.success).toBe(true);
	});

	it('updates a thread title', async () => {
		mockMakePlainRequest.mockResolvedValue({
			updateThreadTitle: {
				thread: { ...sampleThread, title: 'Updated title' },
			},
		});
		const { endpoints } = getEndpoints();
		const result = await endpoints.threads.update(mockCtx('k'), {
			threadId: 'th_123',
			title: 'Updated title',
		});

		expect(result.thread?.title).toBe('Updated title');
	});
});

describe('Plain user endpoints', () => {
	beforeEach(() => {
		mockMakePlainRequest.mockReset();
	});

	it('gets a user by id', async () => {
		mockMakePlainRequest.mockResolvedValue({ user: sampleUser });
		const { endpoints } = getEndpoints();
		const result = await endpoints.users.getById(mockCtx('k'), {
			userId: 'usr_1',
		});

		expect(result.user?.id).toBe('usr_1');
		expect(result.user?.publicName).toBe('Grace');
	});

	it('deletes a user', async () => {
		mockMakePlainRequest.mockResolvedValue({ deleteUser: {} });
		const { endpoints } = getEndpoints();
		const result = await endpoints.users.delete(mockCtx('k'), {
			userId: 'usr_1',
		});

		expect(result.success).toBe(true);
	});
});

describe('Plain company endpoints', () => {
	beforeEach(() => {
		mockMakePlainRequest.mockReset();
	});

	it('fetches a company', async () => {
		mockMakePlainRequest.mockResolvedValue({ company: sampleCompany });
		const { endpoints } = getEndpoints();
		const result = await endpoints.companies.fetch(mockCtx('k'), {
			companyId: 'co_1',
		});

		expect(result.company?.id).toBe('co_1');
		expect(result.company?.domainName).toBe('plain.com');
	});

	it('updates a company', async () => {
		mockMakePlainRequest.mockResolvedValue({
			upsertCompany: {
				result: 'UPDATED',
				company: { ...sampleCompany, contractValue: 300000 },
			},
		});
		const { endpoints } = getEndpoints();
		const result = await endpoints.companies.update(mockCtx('k'), {
			identifier: { companyId: 'co_1' },
			name: 'Plain Inc',
			domainName: 'plain.com',
			contractValue: 300000,
		});

		expect(result.result).toBe('UPDATED');
		expect(result.company?.contractValue).toBe(300000);
	});
});

describe('Plain tier endpoints', () => {
	beforeEach(() => {
		mockMakePlainRequest.mockReset();
	});

	it('fetches a tier', async () => {
		mockMakePlainRequest.mockResolvedValue({ tier: sampleTier });
		const { endpoints } = getEndpoints();
		const result = await endpoints.tiers.fetch(mockCtx('k'), {
			tierId: 'tier_1',
		});

		expect(result.tier?.name).toBe('Enterprise');
		expect(result.tier?.isDefault).toBe(false);
	});

	it('lists tiers', async () => {
		mockMakePlainRequest.mockResolvedValue({
			tiers: {
				pageInfo,
				edges: [{ node: sampleTier }],
			},
		});
		const { endpoints } = getEndpoints();
		const result = await endpoints.tiers.list(mockCtx('k'), { first: 10 });

		expect(result.tiers.length).toBe(1);
		expect(result.tiers[0]?.id).toBe('tier_1');
	});
});

describe('Plain customer group endpoints', () => {
	beforeEach(() => {
		mockMakePlainRequest.mockReset();
	});

	it('creates a customer group', async () => {
		mockMakePlainRequest.mockResolvedValue({
			createCustomerGroup: { customerGroup: sampleCustomerGroup },
		});
		const { endpoints } = getEndpoints();
		const result = await endpoints.customerGroups.create(mockCtx('k'), {
			name: 'Enterprise',
			key: 'enterprise',
			color: 'blue',
		});

		expect(result.customerGroup.key).toBe('enterprise');
	});

	it('lists customer groups', async () => {
		mockMakePlainRequest.mockResolvedValue({
			customerGroups: {
				pageInfo,
				edges: [{ node: sampleCustomerGroup }],
			},
		});
		const { endpoints } = getEndpoints();
		const result = await endpoints.customerGroups.list(mockCtx('k'), {});

		expect(result.customerGroups[0]?.id).toBe('cg_123');
	});

	it('adds a customer to groups', async () => {
		mockMakePlainRequest.mockResolvedValue({
			addCustomerToCustomerGroups: {
				customerGroupMemberships: [
					{ customerId: 'cus_123', customerGroup: sampleCustomerGroup },
				],
			},
		});
		const { endpoints } = getEndpoints();
		const result = await endpoints.customerGroups.addCustomer(mockCtx('k'), {
			customerId: 'cus_123',
			customerGroupIdentifiers: [{ customerGroupKey: 'enterprise' }],
		});

		expect(result.customerGroupMemberships[0]?.customerId).toBe('cus_123');
	});

	it('removes a customer from groups', async () => {
		mockMakePlainRequest.mockResolvedValue({
			removeCustomerFromCustomerGroups: {},
		});
		const { endpoints } = getEndpoints();
		const result = await endpoints.customerGroups.removeCustomer(
			mockCtx('k'),
			{
				customerId: 'cus_123',
				customerGroupIdentifiers: [{ customerGroupKey: 'enterprise' }],
			},
		);

		expect(result.success).toBe(true);
	});
});

describe('Plain graphql.run endpoint', () => {
	beforeEach(() => {
		mockMakePlainRequest.mockReset();
	});

	it('runs an arbitrary query and returns the data envelope', async () => {
		mockMakePlainRequest.mockResolvedValue({
			myWorkspace: { id: 'ws_123', name: 'Plain Workspace' },
		});
		const { endpoints } = getEndpoints();
		const result = await endpoints.graphql.run(mockCtx('k'), {
			query: 'query { myWorkspace { id name } }',
		});

		expect(result.data).toEqual({
			myWorkspace: { id: 'ws_123', name: 'Plain Workspace' },
		});
		expect(mockMakePlainRequest).toHaveBeenCalledWith(
			'query { myWorkspace { id name } }',
			'k',
			undefined,
			undefined,
		);
	});
});

describe('Plain mutation payload errors', () => {
	beforeEach(() => {
		mockMakePlainRequest.mockReset();
	});

	it('throws PlainAPIError when upsert payload contains an error', async () => {
		mockMakePlainRequest.mockResolvedValue({
			upsertCustomer: {
				result: null,
				customer: null,
				error: {
					message: 'Customer identifier is invalid',
					code: 'BAD_INPUT',
				},
			},
		});

		const { endpoints } = getEndpoints();
		await expect(
			endpoints.customers.upsert(mockCtx('k'), {
				identifier: { emailAddress: 'ada@example.com' },
				onCreate: {
					fullName: 'Ada Lovelace',
					email: { email: 'ada@example.com', isVerified: false },
				},
				onUpdate: {},
			}),
		).rejects.toMatchObject({
			name: 'PlainAPIError',
			code: 'BAD_INPUT',
			message: 'UpsertCustomer: Customer identifier is invalid',
		});
	});

	it('throws when the upsert payload is missing entirely', async () => {
		mockMakePlainRequest.mockResolvedValue({});
		const { endpoints } = getEndpoints();
		await expect(
			endpoints.customers.upsert(mockCtx('k'), {
				identifier: { emailAddress: 'ada@example.com' },
				onCreate: {
					fullName: 'Ada Lovelace',
					email: { email: 'ada@example.com', isVerified: false },
				},
				onUpdate: {},
			}),
		).rejects.toBeInstanceOf(PlainAPIError);
	});

	it('does not return success when delete payload includes an error', async () => {
		mockMakePlainRequest.mockResolvedValue({
			deleteCustomer: {
				error: {
					message: 'Cannot delete linked customer',
					code: 'CONFLICT',
				},
			},
		});

		const { endpoints } = getEndpoints();
		await expect(
			endpoints.customers.delete(mockCtx('k'), {
				customerId: 'cus_123',
			}),
		).rejects.toBeInstanceOf(PlainAPIError);
	});

	it('does not return success when thread reply payload includes an error', async () => {
		mockMakePlainRequest.mockResolvedValue({
			replyToThread: {
				error: {
					message: 'Thread is closed',
					code: 'THREAD_CLOSED',
				},
			},
		});

		const { endpoints } = getEndpoints();
		await expect(
			endpoints.threads.sendMessage(mockCtx('k'), {
				threadId: 'th_123',
				textContent: 'Thanks for the update',
			}),
		).rejects.toMatchObject({ code: 'THREAD_CLOSED' });
	});

	it('does not return success when remove-from-group payload includes an error', async () => {
		mockMakePlainRequest.mockResolvedValue({
			removeCustomerFromCustomerGroups: {
				error: {
					message: 'Customer is not in group',
					code: 'NOT_FOUND',
				},
			},
		});

		const { endpoints } = getEndpoints();
		await expect(
			endpoints.customerGroups.removeCustomer(mockCtx('k'), {
				customerId: 'cus_123',
				customerGroupIdentifiers: [{ customerGroupKey: 'enterprise' }],
			}),
		).rejects.toMatchObject({ code: 'NOT_FOUND' });
	});
});

describe('Plain pagination guards and auth', () => {
	beforeEach(() => {
		mockMakePlainRequest.mockReset();
	});

	it('rejects mixed forward and reverse pagination controls', async () => {
		const { endpoints } = getEndpoints();

		await expect(
			endpoints.customers.list(mockCtx('k'), {
				first: 10,
				before: 'cursor_1',
			}),
		).rejects.toThrow(
			'Cannot mix forward (first/after) and reverse (last/before) pagination controls',
		);

		await expect(
			endpoints.threads.query(mockCtx('k'), {
				after: 'cursor_2',
				last: 5,
			}),
		).rejects.toThrow(
			'Cannot mix forward (first/after) and reverse (last/before) pagination controls',
		);

		await expect(
			endpoints.threads.fetchIssues(mockCtx('k'), {
				customerId: 'cus_123',
				threadFirst: 10,
				threadBefore: 'cursor_3',
			}),
		).rejects.toThrow(
			'Cannot mix forward (threadFirst/threadAfter) and reverse (threadLast/threadBefore) thread pagination controls',
		);

		await expect(
			endpoints.tiers.list(mockCtx('k'), {
				first: 10,
				last: 5,
			}),
		).rejects.toThrow(
			'Cannot mix forward (first/after) and reverse (last/before) pagination controls',
		);

		await expect(
			endpoints.customerGroups.list(mockCtx('k'), {
				after: 'cursor_4',
				before: 'cursor_5',
			}),
		).rejects.toThrow(
			'Cannot mix forward (first/after) and reverse (last/before) pagination controls',
		);

		expect(mockMakePlainRequest).not.toHaveBeenCalled();
	});

	it('throws AuthMissingError when the context key is absent', async () => {
		const { endpoints } = getEndpoints();
		await expect(
			endpoints.customers.getById(mockCtx(undefined), {
				customerId: 'cus_123',
			}),
		).rejects.toThrow(AuthMissingError);
		expect(mockMakePlainRequest).not.toHaveBeenCalled();
	});
});
