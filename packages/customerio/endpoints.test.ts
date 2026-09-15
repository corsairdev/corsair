import { logEventFromContext } from 'corsair/core';
import { makeAppRequest, makeCdpRequest, makeTrackRequest } from './client';
import {
	Broadcasts,
	Cdp,
	Collections,
	Groups,
	Info,
	Messages,
	Newsletters,
	Profiles,
	ReportingWebhooks,
	Segments,
	Snippets,
	Transactional,
} from './endpoints';
import type { CustomerioEndpointInputs } from './endpoints/types';
import type { CustomerioContext } from './index';

jest.mock('./client', () => ({
	...jest.requireActual('./client'),
	makeAppRequest: jest.fn(),
	makeTrackRequest: jest.fn(),
	makeCdpRequest: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockApp = jest.mocked(makeAppRequest);
const mockTrack = jest.mocked(makeTrackRequest);
const mockCdp = jest.mocked(makeCdpRequest);
const mockLogEvent = jest.mocked(logEventFromContext);

// Justification for this single assertion (same pattern as the merged campayn
// plugin): endpoint handlers only read ctx.key at runtime; the full
// CustomerioContext is assembled by the Corsair runtime and cannot be built
// by hand without stubbing the entire framework.
const ctx = { key: 'customerio-test-key' } as CustomerioContext;

beforeEach(() => {
	mockApp.mockReset();
	mockTrack.mockReset();
	mockCdp.mockReset();
	mockLogEvent.mockClear();
});

describe('broadcast endpoints', () => {
	it('triggerBroadcast posts personalization and audience to the trigger path', async () => {
		mockApp.mockResolvedValue({ id: 11 });
		const result = await Broadcasts.triggerBroadcast(ctx, {
			broadcast_id: 5,
			data: { plan: 'pro' },
			emails: ['a@example.com'],
		});
		expect(mockApp).toHaveBeenCalledWith(
			'/v1/campaigns/5/triggers',
			'customerio-test-key',
			{
				method: 'POST',
				body: { data: { plan: 'pro' }, emails: ['a@example.com'] },
			},
		);
		expect(result.id).toBe(11);
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'customerio.broadcasts.trigger',
			{ broadcast_id: 5, data: { plan: 'pro' }, emails: ['a@example.com'] },
			'completed',
		);
	});

	it('getTriggers lists trigger executions for a broadcast', async () => {
		mockApp.mockResolvedValue({ triggers: [] });
		await Broadcasts.getTriggers(ctx, { broadcast_id: 5 });
		expect(mockApp).toHaveBeenCalledWith(
			'/v1/broadcasts/5/triggers',
			'customerio-test-key',
			{ method: 'GET' },
		);
	});

	it('getTrigger reads a single trigger instance', async () => {
		mockApp.mockResolvedValue({ id: 11 });
		await Broadcasts.getTrigger(ctx, { broadcast_id: 5, trigger_id: 11 });
		expect(mockApp).toHaveBeenCalledWith(
			'/v1/campaigns/5/triggers/11',
			'customerio-test-key',
			{ method: 'GET' },
		);
	});
});

describe('segment and message endpoints', () => {
	it('getSegments lists workspace segments', async () => {
		mockApp.mockResolvedValue({ segments: [] });
		await Segments.getSegments(ctx, {});
		expect(mockApp).toHaveBeenCalledWith(
			'/v1/segments',
			'customerio-test-key',
			{
				method: 'GET',
			},
		);
	});

	it('getSegmentDetails reads one segment', async () => {
		mockApp.mockResolvedValue({ segment: { id: 3 } });
		const result = await Segments.getSegmentDetails(ctx, { segment_id: 3 });
		expect(mockApp).toHaveBeenCalledWith(
			'/v1/segments/3',
			'customerio-test-key',
			{
				method: 'GET',
			},
		);
		expect(result.segment.id).toBe(3);
	});

	it('getSegmentMembership forwards pagination query', async () => {
		mockApp.mockResolvedValue({ ids: [] });
		await Segments.getSegmentMembership(ctx, { segment_id: 3, limit: 25 });
		expect(mockApp).toHaveBeenCalledWith(
			'/v1/segments/3/membership',
			'customerio-test-key',
			{ method: 'GET', query: { limit: 25, start: undefined } },
		);
	});

	it('getMessages forwards delivery filters', async () => {
		mockApp.mockResolvedValue({ messages: [] });
		await Messages.getMessages(ctx, { limit: 5, type: 'email' });
		expect(mockApp).toHaveBeenCalledWith(
			'/v1/messages',
			'customerio-test-key',
			{
				method: 'GET',
				query: {
					limit: 5,
					start: undefined,
					drafts: undefined,
					type: 'email',
					campaign_id: undefined,
					newsletter_id: undefined,
					action_id: undefined,
				},
			},
		);
	});
});

describe('profile endpoints', () => {
	it('identifyPerson merges traits into the Track body', async () => {
		mockTrack.mockResolvedValue({});
		await Profiles.identifyPerson(ctx, {
			identifier: 'user@example.com',
			email: 'user@example.com',
			attributes: { plan: 'pro' },
		});
		expect(mockTrack).toHaveBeenCalledWith(
			'/api/v1/customers/user%40example.com',
			'customerio-test-key',
			{
				method: 'PUT',
				body: { plan: 'pro', email: 'user@example.com' },
			},
		);
	});

	it('createAlias merges the secondary profile into the primary', async () => {
		mockTrack.mockResolvedValue({});
		await Profiles.createAlias(ctx, {
			primary: { id: 'u_1' },
			secondary: { email: 'old@example.com' },
		});
		expect(mockTrack).toHaveBeenCalledWith(
			'/api/v1/merge_customers',
			'customerio-test-key',
			{
				method: 'POST',
				body: {
					primary: { id: 'u_1' },
					secondary: { email: 'old@example.com' },
				},
			},
		);
	});

	it('suppressPerson posts to the suppress path', async () => {
		mockTrack.mockResolvedValue({});
		await Profiles.suppressPerson(ctx, { identifier: 'u_1' });
		expect(mockTrack).toHaveBeenCalledWith(
			'/api/v1/customers/u_1/suppress',
			'customerio-test-key',
			{ method: 'POST', body: {} },
		);
	});

	it('trackEvent records a named event with data', async () => {
		mockTrack.mockResolvedValue({});
		await Profiles.trackEvent(ctx, {
			identifier: 'u_1',
			name: 'purchased',
			data: { total: 99 },
		});
		expect(mockTrack).toHaveBeenCalledWith(
			'/api/v1/customers/u_1/events',
			'customerio-test-key',
			{ method: 'POST', body: { name: 'purchased', data: { total: 99 } } },
		);
	});

	it('unsubscribeDelivery posts to the host-root unsubscribe path', async () => {
		mockTrack.mockResolvedValue({});
		await Profiles.unsubscribeDelivery(ctx, { delivery_id: 'd_1' });
		expect(mockTrack).toHaveBeenCalledWith(
			'/unsubscribe/d_1',
			'customerio-test-key',
			{ method: 'POST', body: {} },
		);
	});

	it('reportPushEvents uses the metrics endpoint with metric fallback', async () => {
		mockTrack.mockResolvedValue({});
		await Profiles.reportPushEvents(ctx, {
			delivery_id: 'd_1',
			metric: 'opened',
			href: 'https://example.com/offer',
		});
		expect(mockTrack).toHaveBeenCalledWith(
			'/api/v1/metrics',
			'customerio-test-key',
			{
				method: 'POST',
				body: {
					delivery_id: 'd_1',
					metric: 'opened',
					href: 'https://example.com/offer',
				},
			},
		);

		mockTrack.mockClear();
		await Profiles.reportPushEvents(ctx, {
			delivery_id: 'd_1',
			event: 'clicked',
		});
		expect(mockTrack).toHaveBeenCalledWith(
			'/api/v1/metrics',
			'customerio-test-key',
			{
				method: 'POST',
				body: { delivery_id: 'd_1', metric: 'clicked' },
			},
		);
	});
});

describe('catalog endpoints', () => {
	it('addPersonToGroup posts user and group ids to the CDP group call', async () => {
		mockCdp.mockResolvedValue({});
		await Groups.addPersonToGroup(ctx, {
			userId: 'u_1',
			groupId: 'acme',
			traits: { plan: 'team' },
		});
		expect(mockCdp).toHaveBeenCalledWith('/v1/group', 'customerio-test-key', {
			method: 'POST',
			body: { userId: 'u_1', groupId: 'acme', traits: { plan: 'team' } },
		});
	});

	it('listCollections reads collection metadata', async () => {
		mockApp.mockResolvedValue({ collections: [] });
		await Collections.listCollections(ctx, {});
		expect(mockApp).toHaveBeenCalledWith(
			'/v1/collections',
			'customerio-test-key',
			{
				method: 'GET',
			},
		);
	});

	it('listIpAddresses reads the allowlist', async () => {
		mockApp.mockResolvedValue({ ip_addresses: [] });
		const result = await Info.listIpAddresses(ctx, {});
		expect(mockApp).toHaveBeenCalledWith(
			'/v1/info/ip_addresses',
			'customerio-test-key',
			{ method: 'GET' },
		);
		expect(result.ip_addresses).toEqual([]);
	});

	it('listNewsletters forwards pagination and sort', async () => {
		mockApp.mockResolvedValue({ newsletters: [] });
		await Newsletters.listNewsletters(ctx, { limit: 10, sort: 'desc' });
		expect(mockApp).toHaveBeenCalledWith(
			'/v1/newsletters',
			'customerio-test-key',
			{
				method: 'GET',
				query: { limit: 10, start: undefined, sort: 'desc' },
			},
		);
	});

	it('listSnippets reads reusable content', async () => {
		mockApp.mockResolvedValue({ snippets: [] });
		await Snippets.listSnippets(ctx, {});
		expect(mockApp).toHaveBeenCalledWith(
			'/v1/snippets',
			'customerio-test-key',
			{
				method: 'GET',
			},
		);
	});

	it('listTransactionalMessages reads template ids and names', async () => {
		mockApp.mockResolvedValue({ messages: [] });
		const result = await Transactional.listTransactionalMessages(ctx, {});
		expect(mockApp).toHaveBeenCalledWith(
			'/v1/transactional',
			'customerio-test-key',
			{
				method: 'GET',
			},
		);
		expect(result.messages).toEqual([]);
	});

	it('getWebhooks lists reporting webhook configs', async () => {
		mockApp.mockResolvedValue({ reporting_webhooks: [] });
		await ReportingWebhooks.getWebhooks(ctx, {});
		expect(mockApp).toHaveBeenCalledWith(
			'/v1/reporting_webhooks',
			'customerio-test-key',
			{ method: 'GET' },
		);
	});
});

describe('cdp endpoints', () => {
	it('sendBatch posts the discriminated batch array', async () => {
		mockCdp.mockResolvedValue({});
		const batch: CustomerioEndpointInputs['sendBatch']['batch'] = [
			{ type: 'identify', userId: 'u_1' },
			{ type: 'track', userId: 'u_1', event: 'signed_up' },
		];
		await Cdp.sendBatch(ctx, { batch });
		expect(mockCdp).toHaveBeenCalledWith('/v1/batch', 'customerio-test-key', {
			method: 'POST',
			body: { batch },
		});
	});

	it('trackPage posts page views with identity', async () => {
		mockCdp.mockResolvedValue({});
		await Cdp.trackPage(ctx, {
			anonymousId: 'a_1',
			name: 'Pricing',
			properties: { url: 'https://example.com/pricing' },
		});
		expect(mockCdp).toHaveBeenCalledWith('/v1/page', 'customerio-test-key', {
			method: 'POST',
			body: {
				anonymousId: 'a_1',
				name: 'Pricing',
				properties: { url: 'https://example.com/pricing' },
			},
		});
	});

	it('trackScreen requires a screen name and posts it', async () => {
		mockCdp.mockResolvedValue({});
		await Cdp.trackScreen(ctx, { userId: 'u_1', name: 'Home' });
		expect(mockCdp).toHaveBeenCalledWith('/v1/screen', 'customerio-test-key', {
			method: 'POST',
			body: { name: 'Home', userId: 'u_1' },
		});
	});
});
