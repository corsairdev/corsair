import { logEventFromContext } from 'corsair/core';
import { makeGosquaredRequest } from './client';
import {
	Account,
	Auth,
	Chat,
	Now,
	People,
	Tracking,
	Trends,
} from './endpoints';
import type { GosquaredContext } from './index';

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makeGosquaredRequest: jest.fn(),
	};
});

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn(),
	};
});

const mockMakeRequest = jest.mocked(makeGosquaredRequest);
const mockLogEvent = jest.mocked(logEventFromContext);

type Ctx = Parameters<typeof Account.getSites>[0];

function buildCtx(options: { siteToken?: string } = {}): Ctx {
	const ctx: GosquaredContext = {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'test-api-key',
		options: {
			siteToken: options.siteToken ?? 'GSN-DEFAULT-SITE',
		},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('test-api-key'),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
	return ctx;
}

const mockCtx = buildCtx();

beforeEach(() => {
	mockMakeRequest.mockReset();
	mockLogEvent.mockReset();
});

describe('GoSquared endpoints test suite', () => {
	describe('Account endpoints', () => {
		it('account.getSites calls GET /account/v1/sites with presenter and logs event', async () => {
			mockMakeRequest.mockResolvedValue([{ site_token: 'GSN-111' }]);

			const res = await Account.getSites(mockCtx, { presenter: 'flat' });
			expect(res).toEqual([{ site_token: 'GSN-111' }]);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/account/v1/sites',
				'test-api-key',
				{
					method: 'GET',
					query: { presenter: 'flat' },
					siteToken: 'GSN-DEFAULT-SITE',
				},
			);
			expect(mockLogEvent).toHaveBeenCalledWith(
				mockCtx,
				'gosquared.account.getSites',
				{ count: 1 },
				'completed',
			);
		});

		it('account.createSite calls POST /account/v1/sites with body', async () => {
			mockMakeRequest.mockResolvedValue({
				site_token: 'GSN-222',
				domain_name: 'test.com',
			});

			const res = await Account.createSite(mockCtx, {
				domain_name: 'test.com',
				name: 'Test',
			});
			expect(res).toEqual({
				site_token: 'GSN-222',
				domain_name: 'test.com',
			});
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/account/v1/sites',
				'test-api-key',
				{
					method: 'POST',
					body: { domain_name: 'test.com', name: 'Test' },
					siteToken: 'GSN-DEFAULT-SITE',
				},
			);
			expect(mockLogEvent).toHaveBeenCalledWith(
				mockCtx,
				'gosquared.account.createSite',
				{ siteToken: 'GSN-222' },
				'completed',
			);
		});

		it('account.getSite calls GET /account/v1/sites/{site_token}', async () => {
			mockMakeRequest.mockResolvedValue({ site_token: 'GSN-333' });

			const res = await Account.getSite(mockCtx, { site_token: 'GSN-333' });
			expect(res).toEqual({ site_token: 'GSN-333' });
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/account/v1/sites/GSN-333',
				'test-api-key',
				{
					method: 'GET',
					siteToken: 'GSN-DEFAULT-SITE',
				},
			);
		});

		it('account.getSharedUsers calls GET /account/v1/sharedUsers', async () => {
			mockMakeRequest.mockResolvedValue([
				{ email: 'member@test.com', role: 'admin' },
			]);

			const res = await Account.getSharedUsers(mockCtx, {});
			expect(res).toEqual([{ email: 'member@test.com', role: 'admin' }]);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/account/v1/sharedUsers',
				'test-api-key',
				{
					method: 'GET',
					query: { site_token: 'GSN-DEFAULT-SITE' },
					siteToken: 'GSN-DEFAULT-SITE',
				},
			);
		});

		it('account.getBlocked calls GET /account/v1/blocked with presenter', async () => {
			mockMakeRequest.mockResolvedValue(['1.2.3.4']);

			const res = await Account.getBlocked(mockCtx, { presenter: 'plain' });
			expect(res).toEqual(['1.2.3.4']);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/account/v1/blocked',
				'test-api-key',
				{
					method: 'GET',
					query: {
						site_token: 'GSN-DEFAULT-SITE',
						presenter: 'plain',
					},
					siteToken: 'GSN-DEFAULT-SITE',
				},
			);
		});
	});

	describe('Now endpoints', () => {
		it('now.getOverview calls GET /now/v3/overview', async () => {
			mockMakeRequest.mockResolvedValue({ visitors: 10, pageviews: 50 });

			const res = await Now.getOverview(mockCtx, { minimal: true });
			expect(res).toEqual({ visitors: 10, pageviews: 50 });
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/now/v3/overview',
				'test-api-key',
				{
					method: 'GET',
					query: {
						site_token: 'GSN-DEFAULT-SITE',
						minimal: true,
					},
					siteToken: 'GSN-DEFAULT-SITE',
				},
			);
		});

		it('now.getConcurrents calls GET /now/v3/concurrents', async () => {
			mockMakeRequest.mockResolvedValue({ concurrents: 7 });

			const res = await Now.getConcurrents(mockCtx, {});
			expect(res).toEqual({ concurrents: 7 });
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/now/v3/concurrents',
				'test-api-key',
				{
					method: 'GET',
					query: { site_token: 'GSN-DEFAULT-SITE' },
					siteToken: 'GSN-DEFAULT-SITE',
				},
			);
		});

		it('now.getPages calls GET /now/v3/pages', async () => {
			mockMakeRequest.mockResolvedValue({ '/': 5 });
			await Now.getPages(mockCtx, { limit: 10 });
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/now/v3/pages',
				'test-api-key',
				{
					method: 'GET',
					query: { site_token: 'GSN-DEFAULT-SITE', limit: 10 },
					siteToken: 'GSN-DEFAULT-SITE',
				},
			);
		});

		it('now.getSources calls GET /now/v3/sources', async () => {
			mockMakeRequest.mockResolvedValue({ google: 3 });
			await Now.getSources(mockCtx, {});
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/now/v3/sources',
				'test-api-key',
				{
					method: 'GET',
					query: { site_token: 'GSN-DEFAULT-SITE' },
					siteToken: 'GSN-DEFAULT-SITE',
				},
			);
		});

		it('now.getTimeSeries calls GET /now/v3/timeSeries', async () => {
			mockMakeRequest.mockResolvedValue({});
			await Now.getTimeSeries(mockCtx, {});
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/now/v3/timeSeries',
				'test-api-key',
				{
					method: 'GET',
					query: { site_token: 'GSN-DEFAULT-SITE' },
					siteToken: 'GSN-DEFAULT-SITE',
				},
			);
		});

		it('now.getBrowsers calls GET /now/v3/browsers', async () => {
			mockMakeRequest.mockResolvedValue({});
			await Now.getBrowsers(mockCtx, {});
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/now/v3/browsers',
				'test-api-key',
				{
					method: 'GET',
					query: { site_token: 'GSN-DEFAULT-SITE' },
					siteToken: 'GSN-DEFAULT-SITE',
				},
			);
		});

		it('now.getCountries calls GET /now/v3/countries', async () => {
			mockMakeRequest.mockResolvedValue({});
			await Now.getCountries(mockCtx, {});
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/now/v3/countries',
				'test-api-key',
				{
					method: 'GET',
					query: { site_token: 'GSN-DEFAULT-SITE' },
					siteToken: 'GSN-DEFAULT-SITE',
				},
			);
		});

		it('now.getPlatforms calls GET /now/v3/platforms', async () => {
			mockMakeRequest.mockResolvedValue({});
			await Now.getPlatforms(mockCtx, {});
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/now/v3/platforms',
				'test-api-key',
				{
					method: 'GET',
					query: { site_token: 'GSN-DEFAULT-SITE' },
					siteToken: 'GSN-DEFAULT-SITE',
				},
			);
		});

		it('now.getVisitors calls GET /now/v3/visitors', async () => {
			mockMakeRequest.mockResolvedValue({});
			await Now.getVisitors(mockCtx, {});
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/now/v3/visitors',
				'test-api-key',
				{
					method: 'GET',
					query: { site_token: 'GSN-DEFAULT-SITE' },
					siteToken: 'GSN-DEFAULT-SITE',
				},
			);
		});

		it('now.getGeo calls GET /now/v3/geo', async () => {
			mockMakeRequest.mockResolvedValue({});
			await Now.getGeo(mockCtx, {});
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/now/v3/geo',
				'test-api-key',
				{
					method: 'GET',
					query: { site_token: 'GSN-DEFAULT-SITE' },
					siteToken: 'GSN-DEFAULT-SITE',
				},
			);
		});

		it('now.getCampaigns calls GET /now/v3/campaigns', async () => {
			mockMakeRequest.mockResolvedValue({});
			await Now.getCampaigns(mockCtx, {});
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/now/v3/campaigns',
				'test-api-key',
				{
					method: 'GET',
					query: { site_token: 'GSN-DEFAULT-SITE' },
					siteToken: 'GSN-DEFAULT-SITE',
				},
			);
		});
	});

	describe('Trends endpoints', () => {
		const trendsQuery = { from: '2026-01-01', to: '2026-01-07' };

		it('trends.getAggregate calls GET /trends/v2/aggregate', async () => {
			mockMakeRequest.mockResolvedValue({ total: 100 });
			const res = await Trends.getAggregate(mockCtx, trendsQuery);
			expect(res).toEqual({ total: 100 });
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/trends/v2/aggregate',
				'test-api-key',
				{
					method: 'GET',
					query: {
						from: '2026-01-01',
						to: '2026-01-07',
						site_token: 'GSN-DEFAULT-SITE',
					},
					siteToken: 'GSN-DEFAULT-SITE',
				},
			);
		});

		it('trends.getBrowser calls GET /trends/v2/browser', async () => {
			mockMakeRequest.mockResolvedValue({});
			await Trends.getBrowser(mockCtx, trendsQuery);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/trends/v2/browser',
				'test-api-key',
				expect.anything(),
			);
		});

		it('trends.getCountry calls GET /trends/v2/country', async () => {
			mockMakeRequest.mockResolvedValue({});
			await Trends.getCountry(mockCtx, trendsQuery);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/trends/v2/country',
				'test-api-key',
				expect.anything(),
			);
		});

		it('trends.getEvent calls GET /trends/v2/event', async () => {
			mockMakeRequest.mockResolvedValue({});
			await Trends.getEvent(mockCtx, trendsQuery);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/trends/v2/event',
				'test-api-key',
				expect.anything(),
			);
		});

		it('trends.getLanguage calls GET /trends/v2/language', async () => {
			mockMakeRequest.mockResolvedValue({});
			await Trends.getLanguage(mockCtx, trendsQuery);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/trends/v2/language',
				'test-api-key',
				expect.anything(),
			);
		});

		it('trends.getOrganisation calls GET /trends/v2/organisation', async () => {
			mockMakeRequest.mockResolvedValue({});
			await Trends.getOrganisation(mockCtx, trendsQuery);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/trends/v2/organisation',
				'test-api-key',
				expect.anything(),
			);
		});

		it('trends.getOs calls GET /trends/v2/os', async () => {
			mockMakeRequest.mockResolvedValue({});
			await Trends.getOs(mockCtx, trendsQuery);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/trends/v2/os',
				'test-api-key',
				expect.anything(),
			);
		});

		it('trends.getPage calls GET /trends/v2/page', async () => {
			mockMakeRequest.mockResolvedValue({});
			await Trends.getPage(mockCtx, trendsQuery);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/trends/v2/page',
				'test-api-key',
				expect.anything(),
			);
		});

		it('trends.getPath1 calls GET /trends/v2/path1', async () => {
			mockMakeRequest.mockResolvedValue({});
			await Trends.getPath1(mockCtx, trendsQuery);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/trends/v2/path1',
				'test-api-key',
				expect.anything(),
			);
		});

		it('trends.getScreenDimensions calls GET /trends/v2/screenDimensions', async () => {
			mockMakeRequest.mockResolvedValue({});
			await Trends.getScreenDimensions(mockCtx, trendsQuery);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/trends/v2/screenDimensions',
				'test-api-key',
				expect.anything(),
			);
		});

		it('trends.getSources calls GET /trends/v2/sources', async () => {
			mockMakeRequest.mockResolvedValue({});
			await Trends.getSources(mockCtx, trendsQuery);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/trends/v2/sources',
				'test-api-key',
				expect.anything(),
			);
		});
	});

	describe('People endpoints', () => {
		it('people.getPeople calls GET /people/v1/people with sort & limit', async () => {
			mockMakeRequest.mockResolvedValue([{ id: 'person_1' }]);
			const res = await People.getPeople(mockCtx, {
				sort: 'created_at',
				order: 'asc',
				limit: 25,
			});
			expect(res).toEqual([{ id: 'person_1' }]);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/people/v1/people',
				'test-api-key',
				{
					method: 'GET',
					query: {
						sort: 'created_at',
						order: 'asc',
						limit: 25,
						site_token: 'GSN-DEFAULT-SITE',
					},
					siteToken: 'GSN-DEFAULT-SITE',
				},
			);
		});

		it('people.getPerson calls GET /people/v1/people/{person_id} with encoded ID', async () => {
			mockMakeRequest.mockResolvedValue({ id: 'user@example.com' });
			await People.getPerson(mockCtx, { person_id: 'user@example.com' });
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/people/v1/people/user%40example.com',
				'test-api-key',
				{
					method: 'GET',
					siteToken: 'GSN-DEFAULT-SITE',
				},
			);
		});

		it('people.getPersonFeed calls GET /people/v1/people/{person_id}/feed', async () => {
			mockMakeRequest.mockResolvedValue([]);
			await People.getPersonFeed(mockCtx, { person_id: 'p1', limit: 10 });
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/people/v1/people/p1/feed',
				'test-api-key',
				{
					method: 'GET',
					query: { limit: 10, site_token: 'GSN-DEFAULT-SITE' },
					siteToken: 'GSN-DEFAULT-SITE',
				},
			);
		});

		it('people.getPersonDevices calls GET /people/v1/people/{person_id}/devices', async () => {
			mockMakeRequest.mockResolvedValue([]);
			await People.getPersonDevices(mockCtx, { person_id: 'p1' });
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/people/v1/people/p1/devices',
				'test-api-key',
				{
					method: 'GET',
					query: { site_token: 'GSN-DEFAULT-SITE' },
					siteToken: 'GSN-DEFAULT-SITE',
				},
			);
		});

		it('people.getSmartGroups calls GET /people/v1/smartgroups', async () => {
			mockMakeRequest.mockResolvedValue([]);
			await People.getSmartGroups(mockCtx, {});
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/people/v1/smartgroups',
				'test-api-key',
				{
					method: 'GET',
					query: { site_token: 'GSN-DEFAULT-SITE' },
					siteToken: 'GSN-DEFAULT-SITE',
				},
			);
		});

		it('people.getDevices calls GET /people/v1/devices', async () => {
			mockMakeRequest.mockResolvedValue([]);
			await People.getDevices(mockCtx, {});
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/people/v1/devices',
				'test-api-key',
				{
					method: 'GET',
					query: { site_token: 'GSN-DEFAULT-SITE' },
					siteToken: 'GSN-DEFAULT-SITE',
				},
			);
		});

		it('people.getDevice calls GET /people/v1/devices/{device_id}', async () => {
			mockMakeRequest.mockResolvedValue({ id: 'dev1' });
			await People.getDevice(mockCtx, { device_id: 'dev1' });
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/people/v1/devices/dev1',
				'test-api-key',
				{
					method: 'GET',
					siteToken: 'GSN-DEFAULT-SITE',
				},
			);
		});

		it('people.getEventTypes calls GET /people/v1/eventTypes', async () => {
			mockMakeRequest.mockResolvedValue(['Signup', 'Purchase']);
			await People.getEventTypes(mockCtx, {});
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/people/v1/eventTypes',
				'test-api-key',
				{
					method: 'GET',
					query: { site_token: 'GSN-DEFAULT-SITE' },
					siteToken: 'GSN-DEFAULT-SITE',
				},
			);
		});

		it('people.getPropertyTypes calls GET /people/v1/propertyTypes', async () => {
			mockMakeRequest.mockResolvedValue(['plan', 'role']);
			await People.getPropertyTypes(mockCtx, {});
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/people/v1/propertyTypes',
				'test-api-key',
				{
					method: 'GET',
					query: { site_token: 'GSN-DEFAULT-SITE' },
					siteToken: 'GSN-DEFAULT-SITE',
				},
			);
		});
	});

	describe('Tracking endpoints', () => {
		it('tracking.trackEvent calls POST /tracking/v1/event', async () => {
			mockMakeRequest.mockResolvedValue({ success: true });
			await Tracking.trackEvent(mockCtx, {
				event: { name: 'Signed Up', data: { plan: 'growth' } },
				person_id: 'p1',
			});

			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/tracking/v1/event',
				'test-api-key',
				{
					method: 'POST',
					body: {
						event: { name: 'Signed Up', data: { plan: 'growth' } },
						person_id: 'p1',
					},
					siteToken: 'GSN-DEFAULT-SITE',
				},
			);
		});

		it('tracking.identify calls POST /tracking/v1/properties', async () => {
			mockMakeRequest.mockResolvedValue({ success: true });
			await Tracking.identify(mockCtx, {
				person_id: 'p1',
				properties: { email: 'user@example.com' },
			});

			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/tracking/v1/properties',
				'test-api-key',
				{
					method: 'POST',
					body: {
						person_id: 'p1',
						properties: { email: 'user@example.com' },
					},
					siteToken: 'GSN-DEFAULT-SITE',
				},
			);
		});

		it('tracking.trackTransaction calls POST /tracking/v1/transaction', async () => {
			mockMakeRequest.mockResolvedValue({ success: true });
			await Tracking.trackTransaction(mockCtx, {
				transaction: { id: 'tx_123', revenue: 50 },
			});

			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/tracking/v1/transaction',
				'test-api-key',
				{
					method: 'POST',
					body: {
						transaction: { id: 'tx_123', revenue: 50 },
					},
					siteToken: 'GSN-DEFAULT-SITE',
				},
			);
		});

		it('tracking.trackPageview calls POST /tracking/v1/pageview', async () => {
			mockMakeRequest.mockResolvedValue({ success: true });
			await Tracking.trackPageview(mockCtx, {
				page: { url: 'https://example.com', title: 'Home' },
			});

			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/tracking/v1/pageview',
				'test-api-key',
				{
					method: 'POST',
					body: {
						page: { url: 'https://example.com', title: 'Home' },
					},
					siteToken: 'GSN-DEFAULT-SITE',
				},
			);
		});
	});

	describe('Chat endpoints', () => {
		it('chat.getChats calls GET /chat/v1/chats', async () => {
			mockMakeRequest.mockResolvedValue([]);
			await Chat.getChats(mockCtx, { limit: 10 });
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/chat/v1/chats',
				'test-api-key',
				{
					method: 'GET',
					query: { limit: 10, site_token: 'GSN-DEFAULT-SITE' },
					siteToken: 'GSN-DEFAULT-SITE',
				},
			);
		});

		it('chat.getChat calls GET /chat/v1/chats/{chat_id}', async () => {
			mockMakeRequest.mockResolvedValue({ id: 'chat_1' });
			await Chat.getChat(mockCtx, { chat_id: 'chat_1' });
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/chat/v1/chats/chat_1',
				'test-api-key',
				{
					method: 'GET',
					siteToken: 'GSN-DEFAULT-SITE',
				},
			);
		});

		it('chat.getChatFeed calls GET /chat/v1/chats/{chat_id}/feed', async () => {
			mockMakeRequest.mockResolvedValue([]);
			await Chat.getChatFeed(mockCtx, { chat_id: 'chat_1', limit: 5 });
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/chat/v1/chats/chat_1/feed',
				'test-api-key',
				{
					method: 'GET',
					query: { limit: 5, site_token: 'GSN-DEFAULT-SITE' },
					siteToken: 'GSN-DEFAULT-SITE',
				},
			);
		});

		it('chat.archiveChat calls POST /chat/v1/chats/{chat_id}/archive', async () => {
			mockMakeRequest.mockResolvedValue({ success: true });
			await Chat.archiveChat(mockCtx, { chat_id: 'chat_1' });
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/chat/v1/chats/chat_1/archive',
				'test-api-key',
				{
					method: 'POST',
					siteToken: 'GSN-DEFAULT-SITE',
				},
			);
		});

		it('chat.unarchiveChat calls POST /chat/v1/chats/{chat_id}/unarchive', async () => {
			mockMakeRequest.mockResolvedValue({ success: true });
			await Chat.unarchiveChat(mockCtx, { chat_id: 'chat_1' });
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/chat/v1/chats/chat_1/unarchive',
				'test-api-key',
				{
					method: 'POST',
					siteToken: 'GSN-DEFAULT-SITE',
				},
			);
		});

		it('chat.sendMessage calls POST /chat/v1/chats/{chat_id}/messages', async () => {
			mockMakeRequest.mockResolvedValue({
				success: true,
				message_id: 'msg_1',
			});
			await Chat.sendMessage(mockCtx, {
				chat_id: 'chat_1',
				content: 'Hello customer!',
				from: 'agent',
			});
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/chat/v1/chats/chat_1/messages',
				'test-api-key',
				{
					method: 'POST',
					body: { content: 'Hello customer!', from: 'agent' },
					query: {},
					siteToken: 'GSN-DEFAULT-SITE',
				},
			);
		});
	});

	describe('Auth endpoint', () => {
		it('auth.getTokenInfo calls GET /auth/v1/tokeninfo', async () => {
			mockMakeRequest.mockResolvedValue({
				scopes: ['read_account'],
				user_id: 1,
			});
			const res = await Auth.getTokenInfo(mockCtx, {});
			expect(res).toEqual({
				scopes: ['read_account'],
				user_id: 1,
			});
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/auth/v1/tokeninfo',
				'test-api-key',
				{ method: 'GET' },
			);
		});
	});

	describe('Input validation safeguards', () => {
		it('rejects invalid input before making network request', async () => {
			// `unknown` because catch variable from rejected promise is untyped.
			const err = await Account.createSite(mockCtx, {
				domain_name: '',
			}).catch((e: unknown) => e);

			expect(err).toBeDefined();
			expect(mockMakeRequest).not.toHaveBeenCalled();
		});
	});
});
