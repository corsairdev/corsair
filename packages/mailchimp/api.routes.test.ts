import { getMailchimpAccountId, makeMailchimpRequest } from './client';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		getMailchimpAccountId: jest.fn().mockResolvedValue('account-1'),
		makeMailchimpRequest: jest.fn(),
	};
});

const mockRequest = jest.mocked(makeMailchimpRequest);
const mockGetAccountId = jest.mocked(getMailchimpAccountId);

import {
	AccountEndpoints,
	CampaignsEndpoints,
	InterestCategoriesEndpoints,
	InterestsEndpoints,
	ListsEndpoints,
	MembersEndpoints,
	MergeFieldsEndpoints,
	SegmentsEndpoints,
	WebhooksEndpoints,
} from './endpoints';

type AnyEndpoint = (ctx: unknown, input: unknown) => Promise<unknown>;

function createContext() {
	const entityClient = () => ({
		upsertByEntityId: jest.fn().mockResolvedValue({ id: 'internal-1' }),
		deleteByEntityId: jest.fn().mockResolvedValue(undefined),
		existsByEntityId: jest.fn().mockResolvedValue(false),
		findIdByEntityId: jest.fn().mockResolvedValue(null),
	});
	return {
		key: 'test-us1',
		endpoints: {},
		options: { webhookSecret: 'secret-1' },
		keys: {
			get_webhook_signature: jest.fn().mockResolvedValue('secret-1'),
		},
		db: {
			lists: entityClient(),
			members: entityClient(),
			campaigns: entityClient(),
		},
	};
}

type Case = {
	name: string;
	fn: AnyEndpoint;
	input: Record<string, unknown>;
	path: string;
	method: string;
};

// One row per implemented endpoint (R2: every endpoint has a test that asserts
// the path + method handed to makeMailchimpRequest).
const cases: Case[] = [
	{
		name: 'account.ping',
		fn: AccountEndpoints.ping as AnyEndpoint,
		input: {},
		path: '/ping',
		method: 'GET',
	},
	{
		name: 'account.root',
		fn: AccountEndpoints.root as AnyEndpoint,
		input: {},
		path: '/',
		method: 'GET',
	},
	{
		name: 'lists.list',
		fn: ListsEndpoints.list as AnyEndpoint,
		input: {},
		path: '/lists',
		method: 'GET',
	},
	{
		name: 'lists.get',
		fn: ListsEndpoints.get as AnyEndpoint,
		input: { list_id: 'L1', fields: [], exclude_fields: [] },
		path: '/lists/L1',
		method: 'GET',
	},
	{
		name: 'lists.create',
		fn: ListsEndpoints.create as AnyEndpoint,
		input: {
			name: 'L',
			contact: {},
			permission_reminder: 'r',
			campaign_defaults: {},
		},
		path: '/lists',
		method: 'POST',
	},
	{
		name: 'lists.update',
		fn: ListsEndpoints.update as AnyEndpoint,
		input: { list_id: 'L1', name: 'L2' },
		path: '/lists/L1',
		method: 'PATCH',
	},
	{
		name: 'lists.remove',
		fn: ListsEndpoints.remove as AnyEndpoint,
		input: { list_id: 'L1' },
		path: '/lists/L1',
		method: 'DELETE',
	},
	{
		name: 'campaigns.list',
		fn: CampaignsEndpoints.list as AnyEndpoint,
		input: {},
		path: '/campaigns',
		method: 'GET',
	},
	{
		name: 'campaigns.get',
		fn: CampaignsEndpoints.get as AnyEndpoint,
		input: { campaign_id: 'C1' },
		path: '/campaigns/C1',
		method: 'GET',
	},
	{
		name: 'campaigns.create',
		fn: CampaignsEndpoints.create as AnyEndpoint,
		input: { type: 'regular', settings: {} },
		path: '/campaigns',
		method: 'POST',
	},
	{
		name: 'campaigns.update',
		fn: CampaignsEndpoints.update as AnyEndpoint,
		input: { campaign_id: 'C1', settings: {} },
		path: '/campaigns/C1',
		method: 'PATCH',
	},
	{
		name: 'campaigns.remove',
		fn: CampaignsEndpoints.remove as AnyEndpoint,
		input: { campaign_id: 'C1' },
		path: '/campaigns/C1',
		method: 'DELETE',
	},
	{
		name: 'campaigns.getContent',
		fn: CampaignsEndpoints.getContent as AnyEndpoint,
		input: { campaign_id: 'C1' },
		path: '/campaigns/C1/content',
		method: 'GET',
	},
	{
		name: 'campaigns.setContent',
		fn: CampaignsEndpoints.setContent as AnyEndpoint,
		input: { campaign_id: 'C1', html: '<p/>' },
		path: '/campaigns/C1/content',
		method: 'PUT',
	},
	{
		name: 'campaigns.sendTest',
		fn: CampaignsEndpoints.sendTest as AnyEndpoint,
		input: { campaign_id: 'C1', test_emails: ['a@b'], send_type: 'html' },
		path: '/campaigns/C1/actions/test',
		method: 'POST',
	},
	{
		name: 'campaigns.schedule',
		fn: CampaignsEndpoints.schedule as AnyEndpoint,
		input: { campaign_id: 'C1', schedule_time: '2026-01-01T00:00:00Z' },
		path: '/campaigns/C1/actions/schedule',
		method: 'POST',
	},
	{
		name: 'campaigns.unschedule',
		fn: CampaignsEndpoints.unschedule as AnyEndpoint,
		input: { campaign_id: 'C1' },
		path: '/campaigns/C1/actions/unschedule',
		method: 'POST',
	},
	{
		name: 'campaigns.send',
		fn: CampaignsEndpoints.send as AnyEndpoint,
		input: { campaign_id: 'C1' },
		path: '/campaigns/C1/actions/send',
		method: 'POST',
	},
	{
		name: 'interestCategories.list',
		fn: InterestCategoriesEndpoints.list as AnyEndpoint,
		input: { list_id: 'L1' },
		path: '/lists/L1/interest-categories',
		method: 'GET',
	},
	{
		name: 'interestCategories.get',
		fn: InterestCategoriesEndpoints.get as AnyEndpoint,
		input: { list_id: 'L1', interest_category_id: 'IC1' },
		path: '/lists/L1/interest-categories/IC1',
		method: 'GET',
	},
	{
		name: 'interestCategories.create',
		fn: InterestCategoriesEndpoints.create as AnyEndpoint,
		input: { list_id: 'L1', title: 'T', type: 'checkboxes' },
		path: '/lists/L1/interest-categories',
		method: 'POST',
	},
	{
		name: 'interestCategories.update',
		fn: InterestCategoriesEndpoints.update as AnyEndpoint,
		input: { list_id: 'L1', interest_category_id: 'IC1', title: 'T2' },
		path: '/lists/L1/interest-categories/IC1',
		method: 'PATCH',
	},
	{
		name: 'interestCategories.remove',
		fn: InterestCategoriesEndpoints.remove as AnyEndpoint,
		input: { list_id: 'L1', interest_category_id: 'IC1' },
		path: '/lists/L1/interest-categories/IC1',
		method: 'DELETE',
	},
	{
		name: 'interests.list',
		fn: InterestsEndpoints.list as AnyEndpoint,
		input: { list_id: 'L1', interest_category_id: 'IC1' },
		path: '/lists/L1/interest-categories/IC1/interests',
		method: 'GET',
	},
	{
		name: 'interests.get',
		fn: InterestsEndpoints.get as AnyEndpoint,
		input: { list_id: 'L1', interest_category_id: 'IC1', interest_id: 'I1' },
		path: '/lists/L1/interest-categories/IC1/interests/I1',
		method: 'GET',
	},
	{
		name: 'interests.create',
		fn: InterestsEndpoints.create as AnyEndpoint,
		input: { list_id: 'L1', interest_category_id: 'IC1', name: 'N' },
		path: '/lists/L1/interest-categories/IC1/interests',
		method: 'POST',
	},
	{
		name: 'interests.update',
		fn: InterestsEndpoints.update as AnyEndpoint,
		input: {
			list_id: 'L1',
			interest_category_id: 'IC1',
			interest_id: 'I1',
			name: 'N2',
		},
		path: '/lists/L1/interest-categories/IC1/interests/I1',
		method: 'PATCH',
	},
	{
		name: 'interests.remove',
		fn: InterestsEndpoints.remove as AnyEndpoint,
		input: { list_id: 'L1', interest_category_id: 'IC1', interest_id: 'I1' },
		path: '/lists/L1/interest-categories/IC1/interests/I1',
		method: 'DELETE',
	},
	{
		name: 'members.list',
		fn: MembersEndpoints.list as AnyEndpoint,
		input: { list_id: 'L1' },
		path: '/lists/L1/members',
		method: 'GET',
	},
	{
		name: 'members.get',
		fn: MembersEndpoints.get as AnyEndpoint,
		input: { list_id: 'L1', email: 'a@b.com' },
		path: '/lists/L1/members/H1',
		method: 'GET',
	},
	{
		name: 'members.upsert',
		fn: MembersEndpoints.upsert as AnyEndpoint,
		input: { list_id: 'L1', email: 'a@b.com', email_type: 'html' },
		path: '/lists/L1/members/H1',
		method: 'PUT',
	},
	{
		name: 'members.add',
		fn: MembersEndpoints.add as AnyEndpoint,
		input: { list_id: 'L1', email_address: 'a@b.com', status: 'subscribed' },
		path: '/lists/L1/members',
		method: 'POST',
	},
	{
		name: 'members.update',
		fn: MembersEndpoints.update as AnyEndpoint,
		input: { list_id: 'L1', email: 'a@b.com', merge_fields: {} },
		path: '/lists/L1/members/H1',
		method: 'PATCH',
	},
	{
		name: 'members.archive',
		fn: MembersEndpoints.archive as AnyEndpoint,
		input: { list_id: 'L1', email: 'a@b.com' },
		path: '/lists/L1/members/H1',
		method: 'DELETE',
	},
	{
		name: 'members.remove',
		fn: MembersEndpoints.remove as AnyEndpoint,
		input: { list_id: 'L1', email: 'a@b.com' },
		path: '/lists/L1/members/H1/actions/delete-permanent',
		method: 'POST',
	},
	{
		name: 'members.search',
		fn: MembersEndpoints.search as AnyEndpoint,
		input: { query: 'a@b.com' },
		path: '/search-members',
		method: 'GET',
	},
	{
		name: 'members.listTags',
		fn: MembersEndpoints.listTags as AnyEndpoint,
		input: { list_id: 'L1', email: 'a@b.com' },
		path: '/lists/L1/members/H1/tags',
		method: 'GET',
	},
	{
		name: 'members.updateTags',
		fn: MembersEndpoints.updateTags as AnyEndpoint,
		input: { list_id: 'L1', email: 'a@b.com', tags: [] },
		path: '/lists/L1/members/H1/tags',
		method: 'POST',
	},
	{
		name: 'mergeFields.list',
		fn: MergeFieldsEndpoints.list as AnyEndpoint,
		input: { list_id: 'L1' },
		path: '/lists/L1/merge-fields',
		method: 'GET',
	},
	{
		name: 'mergeFields.get',
		fn: MergeFieldsEndpoints.get as AnyEndpoint,
		input: { list_id: 'L1', merge_id: 'M1' },
		path: '/lists/L1/merge-fields/M1',
		method: 'GET',
	},
	{
		name: 'mergeFields.create',
		fn: MergeFieldsEndpoints.create as AnyEndpoint,
		input: { list_id: 'L1', tag: 'T', name: 'N', type: 'text' },
		path: '/lists/L1/merge-fields',
		method: 'POST',
	},
	{
		name: 'mergeFields.update',
		fn: MergeFieldsEndpoints.update as AnyEndpoint,
		input: { list_id: 'L1', merge_id: 'M1', name: 'N2' },
		path: '/lists/L1/merge-fields/M1',
		method: 'PATCH',
	},
	{
		name: 'mergeFields.remove',
		fn: MergeFieldsEndpoints.remove as AnyEndpoint,
		input: { list_id: 'L1', merge_id: 'M1' },
		path: '/lists/L1/merge-fields/M1',
		method: 'DELETE',
	},
	{
		name: 'segments.list',
		fn: SegmentsEndpoints.list as AnyEndpoint,
		input: { list_id: 'L1' },
		path: '/lists/L1/segments',
		method: 'GET',
	},
	{
		name: 'segments.get',
		fn: SegmentsEndpoints.get as AnyEndpoint,
		input: { list_id: 'L1', segment_id: 'S1' },
		path: '/lists/L1/segments/S1',
		method: 'GET',
	},
	{
		name: 'segments.create',
		fn: SegmentsEndpoints.create as AnyEndpoint,
		input: { list_id: 'L1', name: 'N' },
		path: '/lists/L1/segments',
		method: 'POST',
	},
	{
		name: 'segments.update',
		fn: SegmentsEndpoints.update as AnyEndpoint,
		input: { list_id: 'L1', segment_id: 'S1', name: 'N2' },
		path: '/lists/L1/segments/S1',
		method: 'PATCH',
	},
	{
		name: 'segments.remove',
		fn: SegmentsEndpoints.remove as AnyEndpoint,
		input: { list_id: 'L1', segment_id: 'S1' },
		path: '/lists/L1/segments/S1',
		method: 'DELETE',
	},
	{
		name: 'segments.listMembers',
		fn: SegmentsEndpoints.listMembers as AnyEndpoint,
		input: { list_id: 'L1', segment_id: 'S1' },
		path: '/lists/L1/segments/S1/members',
		method: 'GET',
	},
	{
		name: 'segments.addMember',
		fn: SegmentsEndpoints.addMember as AnyEndpoint,
		input: { list_id: 'L1', segment_id: 'S1', email: 'a@b.com' },
		path: '/lists/L1/segments/S1/members',
		method: 'POST',
	},
	{
		name: 'segments.removeMember',
		fn: SegmentsEndpoints.removeMember as AnyEndpoint,
		input: { list_id: 'L1', segment_id: 'S1', email: 'a@b.com' },
		path: '/lists/L1/segments/S1/members/H1',
		method: 'DELETE',
	},
	{
		name: 'webhooks.list',
		fn: WebhooksEndpoints.list as AnyEndpoint,
		input: { list_id: 'L1' },
		path: '/lists/L1/webhooks',
		method: 'GET',
	},
	{
		name: 'webhooks.get',
		fn: WebhooksEndpoints.get as AnyEndpoint,
		input: { list_id: 'L1', webhook_id: 'W1' },
		path: '/lists/L1/webhooks/W1',
		method: 'GET',
	},
	{
		name: 'webhooks.create',
		fn: WebhooksEndpoints.create as AnyEndpoint,
		input: { list_id: 'L1', url: 'https://example.com' },
		path: '/lists/L1/webhooks',
		method: 'POST',
	},
	{
		name: 'webhooks.update',
		fn: WebhooksEndpoints.update as AnyEndpoint,
		input: { list_id: 'L1', webhook_id: 'W1', url: 'https://example.com' },
		path: '/lists/L1/webhooks/W1',
		method: 'PATCH',
	},
	{
		name: 'webhooks.remove',
		fn: WebhooksEndpoints.remove as AnyEndpoint,
		input: { list_id: 'L1', webhook_id: 'W1' },
		path: '/lists/L1/webhooks/W1',
		method: 'DELETE',
	},
];

describe('Mailchimp endpoint routing', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockRequest.mockResolvedValue({} as never);
	});

	it.each(cases)(
		'$name calls $method $path',
		async ({ fn, input, path, method }) => {
			// subscriberHash normalizes any 32-char hex string. Tests pass an
			// email-shaped string ('a@b.com') so the hash differs per test;
			// standardize on 'H1' so the asserted path is deterministic.
			jest.spyOn(require('./utils'), 'subscriberHash').mockReturnValue('H1');

			await fn(createContext(), input);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			const [requestPath, , options] = mockRequest.mock.calls[0]!;
			expect(requestPath).toBe(path);
			expect(options?.method).toBe(method);
		},
	);

	it.each([
		{
			name: 'lists.remove',
			fn: ListsEndpoints.remove as AnyEndpoint,
			input: { list_id: 'L1' },
			entity: 'lists' as const,
			entityId: 'L1',
		},
		{
			name: 'campaigns.remove',
			fn: CampaignsEndpoints.remove as AnyEndpoint,
			input: { campaign_id: 'C1' },
			entity: 'campaigns' as const,
			entityId: 'C1',
		},
		{
			name: 'members.archive',
			fn: MembersEndpoints.archive as AnyEndpoint,
			input: { list_id: 'L1', subscriber_hash: 'member@example.com' },
			entity: 'members' as const,
			entityId: 'H1',
		},
		{
			name: 'members.remove',
			fn: MembersEndpoints.remove as AnyEndpoint,
			input: { list_id: 'L1', subscriber_hash: 'member@example.com' },
			entity: 'members' as const,
			entityId: 'H1',
		},
	])('$name removes the deleted entity from the local DB', async (testCase) => {
		jest.spyOn(require('./utils'), 'subscriberHash').mockReturnValue('H1');
		const ctx = createContext();

		await testCase.fn(ctx, testCase.input);

		expect(ctx.db[testCase.entity].deleteByEntityId).toHaveBeenCalledWith(
			testCase.entityId,
		);
	});

	it.each([
		{
			name: 'webhooks.create',
			fn: WebhooksEndpoints.create as AnyEndpoint,
			input: { list_id: 'L1', url: 'https://example.com/hook' },
		},
		{
			name: 'webhooks.update',
			fn: WebhooksEndpoints.update as AnyEndpoint,
			input: {
				list_id: 'L1',
				webhook_id: 'W1',
				url: 'https://example.com/hook',
			},
		},
	])(
		'$name embeds account routing and webhook secret',
		async ({ fn, input }) => {
			const ctx = createContext();

			await fn(ctx, input);

			const [, , options] = mockRequest.mock.calls.at(-1)!;
			const url = new URL(String(options?.body?.url));
			expect(url.searchParams.get('aid')).toBe('account-1');
			expect(url.searchParams.get('secret')).toBe('secret-1');
			expect(mockGetAccountId).toHaveBeenCalledWith('test-us1');
		},
	);

	it.each([
		{
			name: 'lists.remove',
			fn: ListsEndpoints.remove as AnyEndpoint,
			input: { list_id: 'L1' },
			entity: 'lists' as const,
		},
		{
			name: 'campaigns.remove',
			fn: CampaignsEndpoints.remove as AnyEndpoint,
			input: { campaign_id: 'C1' },
			entity: 'campaigns' as const,
		},
		{
			name: 'members.archive',
			fn: MembersEndpoints.archive as AnyEndpoint,
			input: { list_id: 'L1', subscriber_hash: 'member@example.com' },
			entity: 'members' as const,
		},
		{
			name: 'members.remove',
			fn: MembersEndpoints.remove as AnyEndpoint,
			input: { list_id: 'L1', subscriber_hash: 'member@example.com' },
			entity: 'members' as const,
		},
	])(
		'$name keeps the local entity when the remote request fails',
		async (testCase) => {
			jest.spyOn(require('./utils'), 'subscriberHash').mockReturnValue('H1');
			const ctx = createContext();
			mockRequest.mockRejectedValueOnce(new Error('Mailchimp unavailable'));

			await expect(testCase.fn(ctx, testCase.input)).rejects.toThrow(
				'Mailchimp unavailable',
			);
			expect(ctx.db[testCase.entity].deleteByEntityId).not.toHaveBeenCalled();
		},
	);

	it('keeps successful remote deletion best-effort when local cleanup fails', async () => {
		const ctx = createContext();
		ctx.db.lists.deleteByEntityId.mockRejectedValueOnce(
			new Error('DB unavailable'),
		);

		await expect(
			ListsEndpoints.remove(ctx as never, { list_id: 'L1' }),
		).resolves.toEqual({});
	});

	it('falls back to the stored webhook secret when the option is empty', async () => {
		const ctx = createContext();
		ctx.options.webhookSecret = '';
		ctx.keys.get_webhook_signature.mockResolvedValueOnce('stored-secret');

		await WebhooksEndpoints.create(ctx as never, {
			list_id: 'L1',
			url: 'https://example.com/hook',
		});

		const [, , options] = mockRequest.mock.calls.at(-1)!;
		const url = new URL(String(options?.body?.url));
		expect(url.searchParams.get('secret')).toBe('stored-secret');
	});

	it('does not create a webhook without an account routing ID', async () => {
		const ctx = createContext();
		mockGetAccountId.mockResolvedValueOnce(undefined);

		await expect(
			WebhooksEndpoints.create(ctx as never, {
				list_id: 'L1',
				url: 'https://example.com/hook',
			}),
		).rejects.toThrow(/account id/i);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('does not swallow account routing lookup failures', async () => {
		const ctx = createContext();
		mockGetAccountId.mockRejectedValueOnce(new Error('metadata unavailable'));

		await expect(
			WebhooksEndpoints.create(ctx as never, {
				list_id: 'L1',
				url: 'https://example.com/hook',
			}),
		).rejects.toThrow('metadata unavailable');
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('does not create a webhook without a configured or stored secret', async () => {
		const ctx = createContext();
		ctx.options.webhookSecret = '';
		ctx.keys.get_webhook_signature.mockResolvedValueOnce(undefined);

		await expect(
			WebhooksEndpoints.create(ctx as never, {
				list_id: 'L1',
				url: 'https://example.com/hook',
			}),
		).rejects.toThrow(/webhook secret/i);
		expect(mockRequest).not.toHaveBeenCalled();
	});
});
