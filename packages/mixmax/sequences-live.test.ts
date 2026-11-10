import type { MixmaxContext } from './index';
import { mixmax } from './index';

jest.mock('./client', () => ({
	...jest.requireActual('./client'),
	makeMixmaxRequest: jest.fn(),
}));

import { makeMixmaxRequest } from './client';

const request = jest.mocked(makeMixmaxRequest);

// A partial runtime context, cast through `unknown` because MixmaxContext
// also requires the database, key store and event services that these
// handlers never touch: they read only `key`, and the request is mocked.
// Building the full context would mean standing up core's runtime here.
const ctx = {
	key: 'mixmax_test_key',
	$getAccountId: async () => 'account-1',
} as unknown as MixmaxContext;

const endpoints = mixmax({ key: 'mixmax_test_key' }).endpoints!;

// Recorded on a live trial account (11-10) for a recipient who was added
// with a send time a year out and cancelled before anything was sent.
// Addresses and names are replaced; everything else is as Mixmax sent it.
const LIVE_RECIPIENTS_LIST = [
	{
		_id: '6af31ce1a41ff57e88606ce3',
		state: 'completed',
		completedReason: 'manuallyCancelled',
		userId: '6af31a06998bdd5cfacd69f7',
		rstFailed: 0,
		lastStageSentOrdinal: null,
		createdAt: 1794317537,
		to: {
			email: 'recipient@example.com',
			name: null,
		},
		sequence: {
			_id: '6af31c55777c8bfec4677144',
		},
		sequenceId: '6af31c55777c8bfec4677144',
		analytics: {
			events: {
				opens: 0,
				clicks: 0,
				downloads: 0,
			},
		},
		stages: [
			{
				ordinal: 1,
				trigger: null,
				state: 'cancelled',
				failedError: null,
				sendingError: null,
				type: 'message',
				taskId: null,
				taskAssignee: null,
				taskStatus: null,
				taskMessageStatus: null,
				variantId: null,
				stageId: '6af31c55777c8bfec4677146',
				schedule: null,
				scheduleBetween: {
					timezone: 'UTC',
					start: 8,
					end: 20,
				},
				scheduledAt: null,
				initialScheduledAt: null,
				processedAt: null,
				reschedulingReason: null,
				sentAt: null,
				from: {
					email: 'recipient@example.com',
					name: 'Test Sender',
				},
				opens: 0,
				clicks: 0,
				downloads: 0,
				replied: 0,
				senderReplied: 0,
				accepted: 0,
				declined: 0,
				tentative: 0,
				bounced: 0,
				hasOpens: 0,
				hasLinks: 0,
				hasFiles: 0,
				taskCreatedAt: null,
				messageId: null,
			},
		],
		skipHolidays: null,
		entryStageId: '6af31c55777c8bfec4677146',
		entryStageOrdinal: 1,
		enteredAt: null,
		enteredLate: false,
	},
];

const LIVE_SEQUENCE_SEARCH = {
	sequences: {
		total: 0,
		results: [],
	},
	recipients: {
		results: [
			{
				userId: '6af31a06998bdd5cfacd69f7',
				sequenceId: '6af31c55777c8bfec4677144',
				completedReason: 'manuallyCancelled',
				recipientId: '6af31ce1a41ff57e88606ce3',
				email: 'recipient@example.com',
				domain: 'example.com',
				name: null,
				createdAt: 1794317537,
				completedAt: 1794317546,
				state: 'completed',
				isActive: 0,
				isPaused: 0,
				isCompleted: 1,
				lastStageProcessedAt: null,
				lastStageSentAt: null,
				lastStageSentOrdinal: null,
				nextStageScheduledAt: null,
				rstFailed: 0,
				wasSent: 0,
				wasDelivered: 0,
				wasDeliveredWithTrackedOpens: 0,
				wasDeliveredWithTrackedLinks: 0,
				wasDeliveredWithTrackedFiles: 0,
				wasDeliveredWithTrackedInvites: 0,
				wasOpened: 0,
				wasClicked: 0,
				wasDownloaded: 0,
				wasReplied: 0,
				wasSenderReplied: 0,
				wasAccepted: 0,
				wasDeclined: 0,
				wasTentative: 0,
				wasBounced: 0,
				numOpens: 0,
				numClicks: 0,
				numDownloads: 0,
				numDelivered: 0,
				includeInTeamLiveFeed: 0,
				stages: [
					{
						id: '6af31c55777c8bfec4677146',
						ordinal: 0,
						type: 'message',
						userId: '6af31a06998bdd5cfacd69f7',
						scheduledAt: 1794317547000,
						initialScheduledAt: null,
						processedAt: 0,
						sentAt: 0,
						messageId: null,
						failedError: null,
						sendingError: null,
						reschedulingReason: null,
						taskId: null,
						taskCreatedAt: 0,
						taskStatus: null,
						taskAssigneeId: null,
						taskAssignee: null,
						taskMessageStatus: null,
						taskType: null,
						trigger: null,
						fromEmail: null,
						fromName: null,
						delegatorName: null,
						delegatorEmail: null,
						includeInTeamLiveFeed: 0,
						state: 'cancelled',
						isActive: 0,
						isPaused: 0,
						isCompleted: 1,
						isScheduled: 0,
						isNextStage: 0,
						isLastProcessedStage: 0,
						wasProcessed: 0,
						wasProcessedOrIsScheduled: 0,
						didExitFrom: 0,
						didUnsubscribeFrom: 0,
						wasSent: 0,
						wasDelivered: 0,
						wasDeliveredWithTrackedOpens: 0,
						wasDeliveredWithTrackedLinks: 0,
						wasDeliveredWithTrackedFiles: 0,
						wasDeliveredWithTrackedInvites: 0,
						wasOpened: 0,
						wasClicked: 0,
						wasDownloaded: 0,
						wasReplied: 0,
						wasSenderReplied: 0,
						wasAccepted: 0,
						wasDeclined: 0,
						wasTentative: 0,
						wasBounced: 0,
						wasTaskCreated: 0,
						wasTaskDeleted: 0,
						numOpens: 0,
						numClicks: 0,
						numDownloads: 0,
						wasSkipped: null,
						salesforceTaskId: null,
						salesforceTaskCreatedAt: null,
						salesforceTaskAssignee: null,
						salesforceTaskStatus: null,
					},
				],
				_id: '6af31ce1a41ff57e88606ce3',
				to: {
					email: 'recipient@example.com',
					name: null,
				},
				lastStageSent: {
					ordinal: -1,
					processedAt: 0,
				},
				sequence: {
					_id: '6af31c55777c8bfec4677144',
					name: 'corsair-plugin-test',
				},
				user: {
					email: 'recipient@example.com',
					name: 'Test Sender',
				},
			},
		],
		total: 1,
	},
};

describe('Mixmax sequence responses recorded live', () => {
	beforeEach(() => {
		request.mockReset();
	});

	it('sequences.recipients.list accepts a recipient no stage has been sent to', async () => {
		request.mockResolvedValueOnce(LIVE_RECIPIENTS_LIST);

		const recipients = await endpoints.sequences.recipients.list(ctx, {
			id: '6af31c55777c8bfec4677144',
		});
		expect(recipients[0]?.lastStageSentOrdinal).toBeNull();
	});

	it('sequences.search accepts a recipient no stage has been sent to', async () => {
		request.mockResolvedValueOnce(LIVE_SEQUENCE_SEARCH);

		const page = await endpoints.sequences.search(ctx, {
			recipients: 'recipient@example.com',
		});
		expect(page.recipients?.results?.[0]?.lastStageSentOrdinal).toBeNull();
	});
});
