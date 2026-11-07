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

// The factory always builds the validated endpoint tree, so the endpoints
// accessor is defined on every plugin instance.
const endpoints = mixmax({ key: 'mixmax_test_key' }).endpoints!;

const MEETING_SUMMARY = {
	id: '64f1c2a9e4b0a1b2c3d4e5f6/abc-defg-hij/2025-01-15T10:00:00.000Z',
	calendarId: '7k2l9m3n4p5q6r7s8t9u0v1w2x',
	title: 'Weekly Team Standup',
	startTime: '1/15/2025, 10:00 AM UTC',
	endTime: '1/15/2025, 10:30 AM UTC',
	actionItemsCount: 2,
	participants: [
		{ email: 'john@example.com', name: 'John Smith' },
		{ email: 'jane@example.com', name: null },
	],
	llmParticipants: [
		{
			fullName: 'John Smith',
			displayName: 'John',
			company: 'Example Inc',
			role: null,
		},
	],
	calendarAttendees: [
		{
			email: 'john@example.com',
			name: 'John Smith',
			responseStatus: 'accepted',
		},
	],
	ownershipLevel: 'owner',
	isExternalMeeting: false,
	meetingCreatedAt: '2025-01-15T10:00:00.000Z',
	sharedWithCount: 0,
	status: 'completed',
};

const TRANSCRIPT = {
	id: '64f1c2a9e4b0a1b2c3d4e5f6/abc-defg-hij/2025-01-15T10:00:00.000Z',
	userId: '64f1c2a9e4b0a1b2c3d4e5f6',
	meetingId: 'abc-defg-hij',
	transcript: [
		{
			name: 'John Smith',
			message: 'Good morning everyone. Let us get started.',
			timestamp: 1736935200000,
		},
		{
			name: 'Jane Doe',
			message: 'Thanks John. I will start with my update.',
			timestamp: 1736935208000,
			relativeTimestamp: 8000,
		},
	],
	cleanedTranscript: [
		{
			name: 'John Smith',
			message: 'Good morning, everyone. Let us get started.',
			timestamp: 1736935200000,
		},
	],
	participantNames: ['John Smith', 'Jane Doe'],
	actualParticipantNames: ['John Smith', 'Jane Doe'],
	deletedAt: null,
};

describe('Mixmax meetings endpoints', () => {
	beforeEach(() => {
		request.mockReset();
		request.mockResolvedValue(undefined);
	});

	it('meetings.searchSummaries sends GET /v1/meetings/summaries/search with documented query params', async () => {
		const response = {
			meetings: [MEETING_SUMMARY],
			total: 1,
			hasMore: false,
		};
		request.mockResolvedValue(response);
		const result = await endpoints.meetings.searchSummaries(ctx, {
			isExternal: true,
			from: '2025-01-01T00:00:00Z',
			to: '2025-01-31T23:59:59Z',
			attendee: 'john@example.com',
			title: 'standup',
			skip: 10,
			limit: 50,
			owner: 'me',
		});

		expect(request).toHaveBeenCalledWith(ctx, '/v1/meetings/summaries/search', {
			method: 'GET',
			query: {
				isExternal: true,
				from: '2025-01-01T00:00:00Z',
				to: '2025-01-31T23:59:59Z',
				attendee: 'john@example.com',
				title: 'standup',
				skip: 10,
				limit: 50,
				owner: 'me',
			},
		});
		expect(result).toEqual(response);
	});

	it('meetings.getTranscript sends GET /v1/meetings/transcripts/:id', async () => {
		request.mockResolvedValue(TRANSCRIPT);
		const result = await endpoints.meetings.getTranscript(ctx, {
			id: '64f1c2a9e4b0a1b2c3d4e5f6/abc-defg-hij/2025-01-15T10:00:00.000Z',
		});

		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/meetings/transcripts/64f1c2a9e4b0a1b2c3d4e5f6/abc-defg-hij/2025-01-15T10%3A00%3A00.000Z',
			{
				method: 'GET',
			},
		);
		expect(result).toEqual(TRANSCRIPT);
	});

	it('meetings.getTranscript rejects a dot-segment id before any request', async () => {
		await expect(
			endpoints.meetings.getTranscript(ctx, {
				id: '../../admin/transcripts/x',
			}),
		).rejects.toThrow('Invalid Mixmax id');
		expect(request).not.toHaveBeenCalled();
	});

	it('meetings.getTranscript rejects a missing id before any request', async () => {
		await expect(
			// unknown: deliberately invalid input shape to prove the schema
			// boundary rejects it before transport.
			endpoints.meetings.getTranscript(ctx, {} as never),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});
});
