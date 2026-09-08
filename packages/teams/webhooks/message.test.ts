import { logEventFromContext } from 'corsair/core';
import { makeTeamsRequest } from '../client';
import { channelMessage } from './message';
import type { TeamsChannelMessageEvent } from './types';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn(),
}));

jest.mock('../client', () => ({
	makeTeamsRequest: jest.fn(),
}));

const CLIENT_STATE = 'teams-client-state';

function notification(
	overrides: Partial<TeamsChannelMessageEvent> = {},
): TeamsChannelMessageEvent {
	return {
		subscriptionId: 'sub-1',
		clientState: CLIENT_STATE,
		changeType: 'created',
		resource: "teams('team-1')/channels('channel-1')/messages('message-1')",
		resourceData: {
			'@odata.type': '#Microsoft.Graph.chatMessage',
			id: 'message-1',
		},
		...overrides,
	} as TeamsChannelMessageEvent;
}

describe('channelMessage webhook', () => {
	beforeEach(() => {
		jest.mocked(makeTeamsRequest).mockReset();
		jest.mocked(logEventFromContext).mockResolvedValue(null);
	});

	it('returns the hydrated channel message when fetch succeeds', async () => {
		const fullMessage = {
			id: 'message-1',
			replyToId: null,
			from: { user: { id: 'user-1', displayName: 'Bob' } },
			body: { content: '<p>hello</p>', contentType: 'html' },
		};
		jest.mocked(makeTeamsRequest).mockResolvedValue(fullMessage as never);
		const upsertByEntityId = jest.fn().mockResolvedValue({ id: 'entity-1' });

		const response = await channelMessage.handler(
			{
				key: CLIENT_STATE,
				keys: { get_access_token: async () => 'tok' },
				db: { messages: { upsertByEntityId } },
			} as never,
			{ payload: { value: [notification()] }, headers: {} },
		);

		expect(makeTeamsRequest).toHaveBeenCalledWith(
			'teams/team-1/channels/channel-1/messages/message-1',
			'tok',
		);
		expect(upsertByEntityId).toHaveBeenCalledWith(
			'message-1',
			expect.objectContaining({
				id: 'message-1',
				fromUserId: 'user-1',
				fromUserDisplayName: 'Bob',
				bodyContent: '<p>hello</p>',
				teamId: 'team-1',
				channelId: 'channel-1',
			}),
		);
		expect(response.data).toEqual(
			expect.objectContaining({
				subscriptionId: 'sub-1',
				teamId: 'team-1',
				channelId: 'channel-1',
				message: fullMessage,
			}),
		);
	});
});
