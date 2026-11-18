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

const endpoints = mixmax({ key: 'mixmax_test_key' }).endpoints!;

// Every response below is the example body published on the operation's page
// at developer.mixmax.com/reference. Each one carries `null` in fields the
// provider documents as nullable; the validated endpoint tree parses the
// response, so a schema that only allows a missing field throws on all of them.
describe('Mixmax responses from the reference examples', () => {
	beforeEach(() => {
		request.mockReset();
	});

	it('livefeed.list returns a page whose message has null name fields', async () => {
		const page = {
			results: [
				{
					_id: 'PiGSnTREQb4UINMO4',
					userId: '5f1d7c3e9b8a4d2c1e0f3a4b',
					recipients: [{ name: null, email: 'bob@example.com' }],
					fromEmail: 'you@example.com',
					fromName: 'Your Name',
					delegatorEmail: null,
					delegatorName: null,
					subject: 'Following up',
					sent: 1788533675000,
					service: 'gmail',
					wasSentViaMixmax: 1,
					wasBounced: 1,
					lastEventType: 'bounced',
					lastEventAt: 1788533676000,
					lastEventByEmail: 'bob@example.com',
					lastEventByName: null,
				},
			],
			hasNext: true,
			hasPrevious: false,
			next: 'Mg',
		};
		request.mockResolvedValue(page);

		await expect(endpoints.livefeed.list(ctx, {})).resolves.toEqual(page);
	});

	it('livefeed.list accepts null for every field the reference marks nullable', async () => {
		const page = {
			results: [
				{
					_id: 'PiGSnTREQb4UINMO4',
					fromName: null,
					delegatorEmail: null,
					delegatorName: null,
					lastEventByEmail: null,
					lastEventByName: null,
					recipients: [{ email: 'bob@example.com', name: null }],
				},
			],
		};
		request.mockResolvedValue(page);

		await expect(endpoints.livefeed.list(ctx, {})).resolves.toEqual(page);
	});

	it('livefeed.events returns a bounce event whose location, device and link fields are null', async () => {
		const page = {
			results: [
				{
					_id: '6a9adbce8208ae53905c66d6',
					type: 'bounced',
					timestamp: 1788533676000,
					recipientEmail: 'bob@example.com',
					recipientName: null,
					subject: 'Following up',
					serviceThreadId: '1a06cea01b19bba4',
					country: null,
					region: null,
					city: null,
					os: null,
					program: null,
					isMobile: null,
					linkUrl: null,
					linkText: null,
					fileName: null,
					activityType: 'bounced',
					location: { country: null, region: null, city: null },
					device: { os: null, program: null, isMobile: null },
					metadata: { linkUrl: null, linkText: null, fileName: null },
				},
				{
					type: 'sent',
					timestamp: 1788533675677,
					recipientEmail: 'you@example.com',
					recipientName: 'Your Name',
				},
			],
			// The last page carries `next: null`, not a missing key.
			next: null,
			hasNext: false,
		};
		request.mockResolvedValue(page);

		await expect(
			endpoints.livefeed.events(ctx, { messageId: 'PiGSnTREQb4UINMO4' }),
		).resolves.toEqual(page);
	});

	it('sequences.search returns a finished recipient with no next stage', async () => {
		const result = {
			sequences: { total: 0, results: [] },
			recipients: {
				total: 1,
				results: [
					{
						_id: '65f388038faa94f832d0d6b4',
						sequenceId: '65f38771f2dbdd5965a8154e',
						email: 'ada@example.com',
						name: 'Ada',
						state: 'completed',
						completedReason: 'exhausted',
						completedAt: 1710513561,
						lastStageProcessedAt: 1710513560,
						lastStageSentAt: 1710513561,
						nextStageScheduledAt: null,
						to: { email: 'ada@example.com', name: 'Ada' },
					},
				],
			},
		};
		request.mockResolvedValue(result);

		await expect(
			endpoints.sequences.search(ctx, { query: 'ada@example.com' }),
		).resolves.toEqual(result);
	});

	it('sequences.search returns an active recipient whose completion fields are still null', async () => {
		const result = {
			sequences: { total: 0, results: [] },
			recipients: {
				total: 1,
				results: [
					{
						_id: '65f388038faa94f832d0d6b4',
						email: 'ada@example.com',
						name: null,
						state: 'active',
						completedReason: null,
						completedAt: null,
						lastStageProcessedAt: null,
						lastStageSentAt: null,
						nextStageScheduledAt: 1710513561,
						to: { email: 'ada@example.com', name: null },
					},
				],
			},
		};
		request.mockResolvedValue(result);

		await expect(
			endpoints.sequences.search(ctx, { query: 'ada@example.com' }),
		).resolves.toEqual(result);
	});

	it('sequences.recipients.list returns a recipient added without a name', async () => {
		const recipients = [
			{
				_id: '6a8dd0fd5cfdf377c1b3c541',
				state: 'completed',
				completedReason: 'exhausted',
				userId: '6392065b944b186e1b84a82c',
				lastStageSentOrdinal: 1,
				createdAt: 1787678973,
				to: { email: 'ada@example.com', name: null },
				sequence: { _id: '6a8dcf1aa254dca5f516195c' },
				sequenceId: '6a8dcf1aa254dca5f516195c',
				analytics: { events: { opens: 2, clicks: 0, downloads: 0 } },
			},
			{
				_id: '6a8dd0fd5cfdf377c1b3c542',
				state: 'active',
				completedReason: null,
				to: { email: 'grace@example.com', name: 'Grace Hopper' },
			},
		];
		request.mockResolvedValue(recipients);

		await expect(
			endpoints.sequences.recipients.list(ctx, {
				id: '6a8dcf1aa254dca5f516195c',
			}),
		).resolves.toEqual(recipients);
	});
});

// Output enums must not throw on a value the provider adds later: the
// validated tree parses every response, so one unknown value in one row
// would otherwise fail the whole call.
describe('Mixmax responses with values the reference does not list yet', () => {
	beforeEach(() => {
		request.mockReset();
	});

	it('rules.list returns a rule whose trigger kind is not one of the four documented ones', async () => {
		const page = {
			results: [
				{
					_id: 'rule-1',
					name: 'Known trigger',
					trigger: { type: 'event', eventName: 'message:sent' },
				},
				{
					_id: 'rule-2',
					name: 'New trigger kind',
					trigger: { type: 'calendarEvent', calendarId: 'primary' },
				},
				// An app-built recurring rule without the `rrule` the reference
				// marks required.
				{ _id: 'rule-3', trigger: { type: 'recurring', subtype: 'interval' } },
				{ _id: 'rule-4', trigger: null },
			],
			hasNext: false,
		};
		request.mockResolvedValue(page);

		await expect(endpoints.rules.list(ctx, {})).resolves.toEqual(page);
	});

	it('rules.events.list returns a run with a new status', async () => {
		const page = {
			records: [{ _id: 'event-1', type: 'rules', status: 'retrying' }],
		};
		request.mockResolvedValue(page);

		await expect(endpoints.rules.events.list(ctx, {})).resolves.toEqual(page);
	});

	it('tasks.list returns a task with a new type', async () => {
		const page = {
			results: [{ _id: 'task-1', type: 'sms', status: 'Open' }],
			total: 1,
			next: null,
			previous: null,
			hasNext: false,
			hasPrevious: false,
		};
		request.mockResolvedValue(page);

		await expect(endpoints.tasks.list(ctx, {})).resolves.toEqual(page);
	});

	it('teams.members.list returns a member with a new role', async () => {
		const page = {
			results: [
				{
					memberId: 'member-1',
					role: 'owner',
					invitedAt: '2026-01-02T03:04:05.000Z',
				},
			],
		};
		request.mockResolvedValue(page);

		await expect(
			endpoints.teams.members.list(ctx, { id: 'team-1' }),
		).resolves.toEqual(page);
	});

	it('meetingTypes.list returns a meeting template with a new type', async () => {
		const page = {
			results: [{ _id: 'type-1', name: 'Intro call', type: 'Collective' }],
		};
		request.mockResolvedValue(page);

		await expect(endpoints.meetingTypes.list(ctx, {})).resolves.toEqual(page);
	});

	it('meetingTypes.create still rejects a type the reference does not accept', async () => {
		await expect(
			endpoints.meetingTypes.create(ctx, {
				name: 'Intro call',
				type: 'Collective',
			} as never),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});

	it('meetings.searchSummaries returns a summary with a new ownership level and status', async () => {
		const response = {
			meetings: [
				{
					id: '64f1c2a9e4b0a1b2c3d4e5f6/abc-defg-hij/2025-01-15T10:00:00.000Z',
					calendarId: null,
					title: 'Weekly Team Standup',
					startTime: '1/15/2025, 10:00 AM UTC',
					endTime: '1/15/2025, 10:30 AM UTC',
					actionItemsCount: 2,
					participants: [],
					ownershipLevel: 'delegate',
					isExternalMeeting: false,
					meetingCreatedAt: '2025-01-15T10:00:00.000Z',
					sharedWithCount: 0,
					status: 'failed',
				},
			],
			total: 1,
			hasMore: false,
		};
		request.mockResolvedValue(response);

		await expect(endpoints.meetings.searchSummaries(ctx, {})).resolves.toEqual(
			response,
		);
	});
});
