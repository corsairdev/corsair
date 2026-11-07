import type { MixmaxContext } from './index';
import { mixmax } from './index';

jest.mock('./client', () => ({
	...jest.requireActual('./client'),
	makeMixmaxRequest: jest.fn(),
}));

import { makeMixmaxRequest } from './client';

const request = jest.mocked(makeMixmaxRequest);

// The handlers under test read only `key` from the runtime context and log
// through logEventFromContext, which needs $getAccountId; every other
// context service is untouched by these code paths.
const ctx = {
	key: 'mixmax_test_key',
	$getAccountId: async () => 'account-1',
} as unknown as MixmaxContext;

const MESSAGE = {
	_id: 'msg-1',
	fromEmail: 'you@example.com',
	fromName: 'Your Name',
	subject: 'Following up',
	sent: 1788533675000,
	wasSentViaMixmax: 1,
	numOpens: 3,
	recipients: [{ email: 'bob@example.com', name: 'Bob Example' }],
};

const STATS = {
	sent: 8,
	delivered: 6,
	recipients: 6,
	opened: 1,
	bounced: 2,
	percentages: { opened: 16.67, bounced: 25 },
};

const PAGE = { results: [MESSAGE], hasNext: true, next: 'Mg', stats: STATS };

const EVENTS_PAGE = {
	results: [
		{
			_id: 'event-1',
			type: 'bounced',
			timestamp: 1788533676000,
			recipientEmail: 'bob@example.com',
			activityType: 'bounced',
		},
	],
	hasNext: false,
};

// The factory always builds the validated endpoint tree, so the endpoints
// accessor is defined on every plugin instance.
const endpoints = mixmax({ key: 'mixmax_test_key' }).endpoints!;

describe('Mixmax livefeed endpoints', () => {
	beforeEach(() => {
		request.mockReset();
		request.mockResolvedValue(undefined);
	});

	it('livefeed.list sends GET /v1/livefeed with documented query params', async () => {
		request.mockResolvedValue(PAGE);
		const result = await endpoints.livefeed.list(ctx, {
			query: 'is:opened sent:last30days',
			limit: 20,
			messageIds: ['msg-1'],
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/livefeed', {
			method: 'GET',
			query: {
				query: 'is:opened sent:last30days',
				timezone: undefined,
				limit: 20,
				offset: undefined,
				next: undefined,
				previous: undefined,
				stats: undefined,
				showOnlySyncedToMixmax: undefined,
				messageIds: ['msg-1'],
			},
		});
		expect(result).toEqual(PAGE);
	});

	it('livefeed.list coerces boolean-ish strings for the stats flag', async () => {
		request.mockResolvedValue({ results: [] });
		await endpoints.livefeed.list(
			ctx,
			// unknown: the raw value is a string, but the schema boundary
			// parses only the explicit `true`/`false` strings before the
			// handler sees them.
			{ stats: 'true' } as never,
		);

		expect(request).toHaveBeenCalledWith(ctx, '/v1/livefeed', {
			method: 'GET',
			query: {
				query: undefined,
				timezone: undefined,
				limit: undefined,
				offset: undefined,
				next: undefined,
				previous: undefined,
				stats: true,
				showOnlySyncedToMixmax: undefined,
				messageIds: undefined,
			},
		});
	});

	it('livefeed.list parses an explicit false string as false', async () => {
		// `Boolean('false')` would enable the flag; the boundary must not.
		request.mockResolvedValue({ results: [] });
		await endpoints.livefeed.list(
			ctx,
			// unknown: the raw value is a string, and the boundary must turn
			// the explicit `false` string into the boolean false.
			{ stats: 'false' } as never,
		);

		expect(request).toHaveBeenCalledWith(ctx, '/v1/livefeed', {
			method: 'GET',
			query: {
				query: undefined,
				timezone: undefined,
				limit: undefined,
				offset: undefined,
				next: undefined,
				previous: undefined,
				stats: false,
				showOnlySyncedToMixmax: undefined,
				messageIds: undefined,
			},
		});
	});

	it('livefeed.events sends GET /v1/livefeed/events with documented query params', async () => {
		request.mockResolvedValue(EVENTS_PAGE);
		const result = await endpoints.livefeed.events(ctx, {
			messageId: 'msg-1',
			wasSentViaMixmax: false,
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/livefeed/events', {
			method: 'GET',
			query: {
				messageId: 'msg-1',
				wasSentViaMixmax: false,
				contactEmail: undefined,
				includeGroupMembers: undefined,
				includeTeammates: undefined,
				limit: undefined,
				next: undefined,
			},
		});
		expect(result).toEqual(EVENTS_PAGE);
	});
});
