import { PlainSchema } from './schema';
import {
	PlainEndpointInputSchemas,
	PlainEndpointOutputSchemas,
} from './endpoints/types';

describe('Plain schema', () => {
	it('declares a semver version', () => {
		expect(PlainSchema.version).toBeDefined();
		expect(PlainSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof PlainSchema.entities).toBe('object');
		expect(PlainSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(PlainSchema.entities))).toBe(true);
		for (const entity of Object.values(PlainSchema.entities)) {
			expect(entity).toBeDefined();
		}
		expect(Object.keys(PlainSchema.entities)).toEqual([
			'customers',
			'threads',
			'companies',
			'tiers',
			'customer_groups',
		]);
	});
});

describe('Plain identifier inputs', () => {
	it('requires exactly one customer identifier', () => {
		expect(
			PlainEndpointInputSchemas.getCustomerById.safeParse({
				customerId: 'cus_123',
			}).success,
		).toBe(true);
		expect(
			PlainEndpointInputSchemas.upsertCustomer.safeParse({
				identifier: { emailAddress: 'a@b.co' },
				onCreate: {
					fullName: 'A B',
					email: { email: 'a@b.co', isVerified: false },
				},
				onUpdate: {},
			}).success,
		).toBe(true);
		expect(
			PlainEndpointInputSchemas.upsertCustomer.safeParse({
				identifier: {},
				onCreate: {
					fullName: 'A B',
					email: { email: 'a@b.co', isVerified: false },
				},
				onUpdate: {},
			}).success,
		).toBe(false);
		expect(
			PlainEndpointInputSchemas.upsertCustomer.safeParse({
				identifier: { emailAddress: 'a@b.co', customerId: 'cus_1' },
				onCreate: {
					fullName: 'A B',
					email: { email: 'a@b.co', isVerified: false },
				},
				onUpdate: {},
			}).success,
		).toBe(false);
	});

	it('requires onCreate.email per input UpsertCustomerOnCreateInput', () => {
		expect(
			PlainEndpointInputSchemas.upsertCustomer.safeParse({
				identifier: { externalId: 'ext_1' },
				onCreate: { fullName: 'A B' },
				onUpdate: {},
			}).success,
		).toBe(false);
	});

	it('requires exactly one company and customer-group identifier', () => {
		expect(
			PlainEndpointInputSchemas.updateCompany.safeParse({
				identifier: {},
				name: 'Acme',
				domainName: 'acme.com',
			}).success,
		).toBe(false);
		expect(
			PlainEndpointInputSchemas.addCustomerToGroup.safeParse({
				customerId: 'cus_1',
				customerGroupIdentifiers: [{}],
			}).success,
		).toBe(false);
		expect(
			PlainEndpointInputSchemas.addCustomerToGroup.safeParse({
				customerId: 'cus_1',
				customerGroupIdentifiers: [{ customerGroupKey: 'enterprise' }],
			}).success,
		).toBe(true);
	});

	it('validates email format for email lookups', () => {
		expect(
			PlainEndpointInputSchemas.getCustomerByEmail.safeParse({
				email: 'not-an-email',
			}).success,
		).toBe(false);
		expect(
			PlainEndpointInputSchemas.getCustomerByEmail.safeParse({
				email: 'ada@example.com',
			}).success,
		).toBe(true);
	});
});

describe('Plain pagination inputs', () => {
	it('rejects mixed forward and reverse controls', () => {
		expect(
			PlainEndpointInputSchemas.getCustomers.safeParse({
				first: 10,
				before: 'c1',
			}).success,
		).toBe(false);
		expect(
			PlainEndpointInputSchemas.queryThreads.safeParse({
				after: 'c2',
				last: 5,
			}).success,
		).toBe(false);
		expect(
			PlainEndpointInputSchemas.listTiers.safeParse({ first: 10, last: 5 })
				.success,
		).toBe(false);
		expect(
			PlainEndpointInputSchemas.listCustomerGroups.safeParse({
				after: 'c4',
				before: 'c5',
			}).success,
		).toBe(false);
		expect(
			PlainEndpointInputSchemas.fetchIssues.safeParse({
				customerId: 'cus_1',
				threadFirst: 10,
				threadBefore: 'c3',
			}).success,
		).toBe(false);
	});

	it('accepts forward-only and reverse-only pagination', () => {
		expect(
			PlainEndpointInputSchemas.getCustomers.safeParse({ first: 10 }).success,
		).toBe(true);
		expect(
			PlainEndpointInputSchemas.getCustomers.safeParse({
				last: 5,
				before: 'c1',
			}).success,
		).toBe(true);
	});

	it('caps page sizes at 100', () => {
		expect(
			PlainEndpointInputSchemas.getCustomers.safeParse({ first: 101 }).success,
		).toBe(false);
	});
});

describe('Plain thread inputs', () => {
	it('accepts documented ThreadsFilter fields', () => {
		expect(
			PlainEndpointInputSchemas.queryThreads.safeParse({
				filters: {
					statuses: ['TODO', 'DONE'],
					priorities: [0, 1],
					messageSource: ['SLACK'],
					customerIds: ['cus_1'],
					tierIdentifiers: [{ tierId: 'tier_1' }],
				},
				sortBy: { field: 'PRIORITY', direction: 'DESC' },
				first: 10,
			}).success,
		).toBe(true);
	});

	it('rejects undocumented thread status values', () => {
		expect(
			PlainEndpointInputSchemas.queryThreads.safeParse({
				filters: { statuses: ['ARCHIVED'] },
			}).success,
		).toBe(false);
	});

	it('accepts all 8 ThreadChannel values and typed thread fields', () => {
		for (const channel of [
			'API',
			'EMAIL',
			'SLACK',
			'MS_TEAMS',
			'CHAT',
			'INTERNAL',
			'DISCORD',
			'IMPORT',
		]) {
			expect(
				PlainEndpointInputSchemas.createThread.safeParse({
					customerIdentifier: { customerId: 'cus_1' },
					channel,
					threadFields: [{ key: 'plan', type: 'STRING', stringValue: 'pro' }],
				}).success,
			).toBe(true);
		}
		expect(
			PlainEndpointInputSchemas.createThread.safeParse({
				customerIdentifier: { customerId: 'cus_1' },
				channel: 'SMS',
			}).success,
		).toBe(false);
		expect(
			PlainEndpointInputSchemas.createThread.safeParse({
				customerIdentifier: { customerId: 'cus_1' },
				threadFields: [{ custom: 'shape' }],
			}).success,
		).toBe(false);
	});

	it('rejects empty message and title updates', () => {
		expect(
			PlainEndpointInputSchemas.sendMessage.safeParse({
				threadId: 'th_1',
				textContent: '',
			}).success,
		).toBe(false);
		expect(
			PlainEndpointInputSchemas.updateThread.safeParse({
				threadId: 'th_1',
				title: '',
			}).success,
		).toBe(false);
	});
});

describe('Plain group and misc inputs', () => {
	it('bounds group membership lists to 1..25', () => {
		expect(
			PlainEndpointInputSchemas.addCustomerToGroup.safeParse({
				customerId: 'cus_1',
				customerGroupIdentifiers: [],
			}).success,
		).toBe(false);
		expect(
			PlainEndpointInputSchemas.removeCustomerFromGroup.safeParse({
				customerId: 'cus_1',
				customerGroupIdentifiers: Array.from({ length: 26 }, () => ({
					customerGroupKey: 'g',
				})),
			}).success,
		).toBe(false);
	});

	it('rejects empty customer-group names', () => {
		expect(
			PlainEndpointInputSchemas.createCustomerGroup.safeParse({
				name: '',
				key: 'k',
				color: 'blue',
			}).success,
		).toBe(false);
	});

	it('requires a non-empty GraphQL query and JSON variables', () => {
		expect(
			PlainEndpointInputSchemas.runGraphqlQuery.safeParse({ query: '' })
				.success,
		).toBe(false);
		expect(
			PlainEndpointInputSchemas.runGraphqlQuery.safeParse({
				query: 'query { myWorkspace { id } }',
				variables: { first: 5 },
			}).success,
		).toBe(true);
	});
});

describe('Plain outputs', () => {
	const customer = {
		id: 'cus_1',
		fullName: 'Ada Lovelace',
		email: { email: 'ada@example.com', isVerified: true },
	};
	const thread = {
		id: 'th_1',
		ref: 'T-1',
		title: 'Help',
		status: 'TODO',
		priority: 2,
	};

	it('requires customer email and thread ref/status/priority', () => {
		expect(
			PlainEndpointOutputSchemas.getCustomerById.safeParse({
				customer: { id: 'cus_1', fullName: 'Ada' },
			}).success,
		).toBe(false);
		expect(
			PlainEndpointOutputSchemas.getCustomerById.safeParse({ customer })
				.success,
		).toBe(true);
		expect(
			PlainEndpointOutputSchemas.getThreadById.safeParse({
				thread: { id: 'th_1', title: 'Help' },
			}).success,
		).toBe(false);
		expect(
			PlainEndpointOutputSchemas.getThreadById.safeParse({ thread }).success,
		).toBe(true);
	});

	it('accepts tier fields from the schema Tier type', () => {
		expect(
			PlainEndpointOutputSchemas.fetchTier.safeParse({
				tier: {
					id: 'tier_1',
					name: 'Enterprise',
					externalId: 'ext',
					color: '#fff',
					isDefault: true,
				},
			}).success,
		).toBe(true);
		expect(
			PlainEndpointOutputSchemas.fetchTier.safeParse({ tier: null }).success,
		).toBe(true);
	});

	it('accepts success literals and rejects false', () => {
		expect(
			PlainEndpointOutputSchemas.deleteCustomer.safeParse({
				success: true,
			}).success,
		).toBe(true);
		expect(
			PlainEndpointOutputSchemas.deleteCustomer.safeParse({
				success: false,
			}).success,
		).toBe(false);
	});

	it('accepts flattened issue records', () => {
		expect(
			PlainEndpointOutputSchemas.fetchIssues.safeParse({
				issues: [
					{
						threadId: 'th_1',
						threadRef: 'T-1',
						threadTitle: 'Help',
						link: {
							id: 'link_1',
							sourceId: 'ISSUE-1',
							sourceType: 'jira_issue',
							title: 'Bug',
							url: 'https://jira/ISSUE-1',
							status: 'TODO',
							linkType: 'RELATED_TO',
						},
					},
				],
				pageInfo: {
					hasNextPage: false,
					hasPreviousPage: false,
					startCursor: null,
					endCursor: null,
				},
				totalThreads: 1,
			}).success,
		).toBe(true);
	});

	it('wraps arbitrary GraphQL data', () => {
		expect(
			PlainEndpointOutputSchemas.runGraphqlQuery.safeParse({
				myWorkspace: { id: 'ws_1' },
			}),
		).toEqual({ success: true, data: { data: { myWorkspace: { id: 'ws_1' } } } });
	});
});
