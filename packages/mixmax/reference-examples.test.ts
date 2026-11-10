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
