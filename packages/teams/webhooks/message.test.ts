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

	it('hydrates the response even when message persistence is disabled', async () => {
		const fullMessage = {
			id: 'message-1',
			replyToId: null,
			from: { user: { id: 'user-1', displayName: 'Bob' } },
			body: { content: '<p>hello</p>', contentType: 'html' },
		};
		jest.mocked(makeTeamsRequest).mockResolvedValue(fullMessage as never);

		const response = await channelMessage.handler(
			{
				key: CLIENT_STATE,
				keys: { get_access_token: async () => 'tok' },
			} as never,
			{ payload: { value: [notification()] }, headers: {} },
		);

		expect(makeTeamsRequest).toHaveBeenCalledWith(
			'teams/team-1/channels/channel-1/messages/message-1',
			'tok',
		);
		expect(response.data).toEqual(
			expect.objectContaining({
				teamId: 'team-1',
				channelId: 'channel-1',
				message: fullMessage,
			}),
		);
	});

	it('continues processing after a single notification fails', async () => {
		const fullMessage = {
			id: 'message-2',
			replyToId: null,
			from: { user: { id: 'user-1', displayName: 'Bob' } },
			body: { content: '<p>hello</p>', contentType: 'html' },
		};
		jest
			.mocked(makeTeamsRequest)
			.mockRejectedValueOnce(new Error('graph down'))
			.mockResolvedValueOnce(fullMessage as never);
		const upsertByEntityId = jest.fn().mockResolvedValue({ id: 'entity-2' });

		const response = await channelMessage.handler(
			{
				key: CLIENT_STATE,
				keys: { get_access_token: async () => 'tok' },
				db: { messages: { upsertByEntityId } },
			} as never,
			{
				payload: {
					value: [
						notification({
							resource:
								"teams('team-1')/channels('channel-1')/messages('message-1')",
							resourceData: {
								'@odata.type': '#Microsoft.Graph.chatMessage',
								id: 'message-1',
							},
						}),
						notification({
							resource:
								"teams('team-1')/channels('channel-1')/messages('message-2')",
							resourceData: {
								'@odata.type': '#Microsoft.Graph.chatMessage',
								id: 'message-2',
							},
						}),
					],
				},
				headers: {},
			},
		);

		expect(makeTeamsRequest).toHaveBeenCalledTimes(2);
		expect(upsertByEntityId).toHaveBeenCalledTimes(1);
		expect(upsertByEntityId).toHaveBeenCalledWith(
			'message-2',
			expect.objectContaining({ id: 'message-2' }),
		);
		expect(response.success).toBe(true);
	});

	it('keeps corsairEntityId aligned with the first notification', async () => {
		const firstMessage = {
			id: 'message-1',
			replyToId: null,
			from: { user: { id: 'user-1', displayName: 'Alice' } },
			body: { content: '<p>first</p>', contentType: 'html' },
		};
		const secondMessage = {
			id: 'message-2',
			replyToId: null,
			from: { user: { id: 'user-2', displayName: 'Bob' } },
			body: { content: '<p>second</p>', contentType: 'html' },
		};
		jest
			.mocked(makeTeamsRequest)
			.mockResolvedValueOnce(firstMessage as never)
			.mockResolvedValueOnce(secondMessage as never);
		const upsertByEntityId = jest
			.fn()
			.mockResolvedValueOnce({ id: 'entity-1' })
			.mockResolvedValueOnce({ id: 'entity-2' });

		const response = await channelMessage.handler(
			{
				key: CLIENT_STATE,
				keys: { get_access_token: async () => 'tok' },
				db: { messages: { upsertByEntityId } },
			} as never,
			{
				payload: {
					value: [
						notification({
							resource:
								"teams('team-1')/channels('channel-1')/messages('message-1')",
							resourceData: {
								'@odata.type': '#Microsoft.Graph.chatMessage',
								id: 'message-1',
							},
						}),
						notification({
							resource:
								"teams('team-1')/channels('channel-1')/messages('message-2')",
							resourceData: {
								'@odata.type': '#Microsoft.Graph.chatMessage',
								id: 'message-2',
							},
						}),
					],
				},
				headers: {},
			},
		);

		expect(response.corsairEntityId).toBe('entity-1');
		expect(response.data).toEqual(
			expect.objectContaining({
				resourceData: expect.objectContaining({ id: 'message-1' }),
				message: firstMessage,
			}),
		);
	});

	it('deletes stored messages even when access token is missing', async () => {
		const deleteByEntityId = jest.fn().mockResolvedValue(undefined);

		await channelMessage.handler(
			{
				key: CLIENT_STATE,
				keys: { get_access_token: async () => null },
				db: { messages: { deleteByEntityId } },
			} as never,
			{
				payload: {
					value: [notification({ changeType: 'deleted' })],
				},
				headers: {},
			},
		);

		expect(deleteByEntityId).toHaveBeenCalledWith('message-1');
		expect(makeTeamsRequest).not.toHaveBeenCalled();
	});
});
