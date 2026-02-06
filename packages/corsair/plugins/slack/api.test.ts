import dotenv from 'dotenv';
import { makeSlackRequest } from './client';
import type {
	ChatDeleteResponse,
	ChatGetPermalinkResponse,
	ChatPostMessageResponse,
	ChatUpdateResponse,
	ConversationsCreateResponse,
	ConversationsHistoryResponse,
	ConversationsInfoResponse,
	ConversationsListResponse,
	ConversationsMembersResponse,
	FilesInfoResponse,
	FilesListResponse,
	ReactionsAddResponse,
	ReactionsGetResponse,
	ReactionsRemoveResponse,
	StarsAddResponse,
	StarsListResponse,
	StarsRemoveResponse,
	UsergroupsCreateResponse,
	UsergroupsListResponse,
	UsergroupsUpdateResponse,
	UsersGetPresenceResponse,
	UsersInfoResponse,
	UsersListResponse,
	UsersProfileGetResponse,
} from './endpoints/types';
import { SlackEndpointOutputSchemas } from './endpoints/types';

dotenv.config();

const TEST_TOKEN = process.env.SLACK_BOT_TOKEN!;
const TEST_CHANNEL = process.env.TEST_SLACK_CHANNEL;

describe('Slack API Type Tests', () => {
	describe('channels', () => {
		it('channelsList returns correct type', async () => {
			const response = await makeSlackRequest<ConversationsListResponse>(
				'conversations.list',
				TEST_TOKEN,
				{ query: { limit: 10 } },
			);
			const result = response;

			SlackEndpointOutputSchemas.channelsList.parse(result);
		});

		it('channelsGet returns correct type', async () => {
			if (!TEST_CHANNEL) {
				const channelsListResponse =
					await makeSlackRequest<ConversationsListResponse>(
						'conversations.list',
						TEST_TOKEN,
						{ query: { limit: 1 } },
					);
				const channelId = channelsListResponse.channels?.[0]?.id;
				if (!channelId) {
					throw new Error('No channels found');
				}

				const response = await makeSlackRequest<ConversationsInfoResponse>(
					'conversations.info',
					TEST_TOKEN,
					{ query: { channel: channelId } },
				);
				const result = response;

				SlackEndpointOutputSchemas.channelsGet.parse(result);
			} else {
				const response = await makeSlackRequest<ConversationsInfoResponse>(
					'conversations.info',
					TEST_TOKEN,
					{ query: { channel: TEST_CHANNEL } },
				);
				const result = response;

				SlackEndpointOutputSchemas.channelsGet.parse(result);
			}
		});

		it('channelsCreate returns correct type', async () => {
			const channelName = `test-channel-${Date.now()}`;
			const response = await makeSlackRequest<ConversationsCreateResponse>(
				'conversations.create',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						name: channelName,
						is_private: false,
					},
				},
			);
			const result = response;

			SlackEndpointOutputSchemas.channelsCreate.parse(result);
		});

		it('channelsGetHistory returns correct type', async () => {
			if (!TEST_CHANNEL) {
				const channelsListResponse =
					await makeSlackRequest<ConversationsListResponse>(
						'conversations.list',
						TEST_TOKEN,
						{ query: { limit: 1 } },
					);
				const channelId = channelsListResponse.channels?.[0]?.id;
				if (!channelId) {
					throw new Error('No channels found');
				}

				const response = await makeSlackRequest<ConversationsHistoryResponse>(
					'conversations.history',
					TEST_TOKEN,
					{ query: { channel: channelId, limit: 10 } },
				);
				const result = response;

				SlackEndpointOutputSchemas.channelsGetHistory.parse(result);
			} else {
				const response = await makeSlackRequest<ConversationsHistoryResponse>(
					'conversations.history',
					TEST_TOKEN,
					{ query: { channel: TEST_CHANNEL, limit: 10 } },
				);
				const result = response;

				SlackEndpointOutputSchemas.channelsGetHistory.parse(result);
			}
		});

		it('channelsGetMembers returns correct type', async () => {
			if (!TEST_CHANNEL) {
				const channelsListResponse =
					await makeSlackRequest<ConversationsListResponse>(
						'conversations.list',
						TEST_TOKEN,
						{ query: { limit: 1 } },
					);
				const channelId = channelsListResponse.channels?.[0]?.id;
				if (!channelId) {
					throw new Error('No channels found');
				}

				const response = await makeSlackRequest<ConversationsMembersResponse>(
					'conversations.members',
					TEST_TOKEN,
					{ query: { channel: channelId, limit: 10 } },
				);
				const result = response;

				SlackEndpointOutputSchemas.channelsGetMembers.parse(result);
			} else {
				const response = await makeSlackRequest<ConversationsMembersResponse>(
					'conversations.members',
					TEST_TOKEN,
					{ query: { channel: TEST_CHANNEL, limit: 10 } },
				);
				const result = response;

				SlackEndpointOutputSchemas.channelsGetMembers.parse(result);
			}
		});
	});

	describe('users', () => {
		it('usersList returns correct type', async () => {
			const response = await makeSlackRequest<UsersListResponse>(
				'users.list',
				TEST_TOKEN,
				{ query: { limit: 10 } },
			);
			const result = response;

			SlackEndpointOutputSchemas.usersList.parse(result);
		});

		it('usersGet returns correct type', async () => {
			const usersListResponse = await makeSlackRequest<UsersListResponse>(
				'users.list',
				TEST_TOKEN,
				{ query: { limit: 1 } },
			);
			const userId = usersListResponse.members?.[0]?.id;
			if (!userId) {
				throw new Error('No users found');
			}

			const response = await makeSlackRequest<UsersInfoResponse>(
				'users.info',
				TEST_TOKEN,
				{ query: { user: userId } },
			);
			const result = response;

			SlackEndpointOutputSchemas.usersGet.parse(result);
		});

		it('usersGetProfile returns correct type', async () => {
			const usersListResponse = await makeSlackRequest<UsersListResponse>(
				'users.list',
				TEST_TOKEN,
				{ query: { limit: 1 } },
			);
			const userId = usersListResponse.members?.[0]?.id;
			if (!userId) {
				throw new Error('No users found');
			}

			const response = await makeSlackRequest<UsersProfileGetResponse>(
				'users.profile.get',
				TEST_TOKEN,
				{ query: { user: userId } },
			);
			const result = response;

			SlackEndpointOutputSchemas.usersGetProfile.parse(result);
		});

		it('usersGetPresence returns correct type', async () => {
			const usersListResponse = await makeSlackRequest<UsersListResponse>(
				'users.list',
				TEST_TOKEN,
				{ query: { limit: 1 } },
			);
			const userId = usersListResponse.members?.[0]?.id;
			if (!userId) {
				throw new Error('No users found');
			}

			const response = await makeSlackRequest<UsersGetPresenceResponse>(
				'users.getPresence',
				TEST_TOKEN,
				{ query: { user: userId } },
			);
			const result = response;

			SlackEndpointOutputSchemas.usersGetPresence.parse(result);
		});
	});

	describe('messages', () => {
		let testMessageTs: string | undefined;
		let testChannelId: string;

		beforeAll(async () => {
			if (TEST_CHANNEL) {
				testChannelId = TEST_CHANNEL;
			} else {
				const channelsListResponse =
					await makeSlackRequest<ConversationsListResponse>(
						'conversations.list',
						TEST_TOKEN,
						{ query: { limit: 1 } },
					);
				const channelId = channelsListResponse.channels?.[0]?.id;
				if (!channelId) {
					throw new Error('No channels found');
				}
				testChannelId = channelId;
			}
		});

		it('postMessage returns correct type', async () => {
			const response = await makeSlackRequest<ChatPostMessageResponse>(
				'chat.postMessage',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						channel: testChannelId,
						text: 'Test message from API test',
					},
				},
			);
			const result = response;

			if (result.ok && result.ts) {
				testMessageTs = result.ts;
			}

			SlackEndpointOutputSchemas.postMessage.parse(result);
		});

		it('messagesUpdate returns correct type', async () => {
			if (!testMessageTs) {
				const postResponse = await makeSlackRequest<ChatPostMessageResponse>(
					'chat.postMessage',
					TEST_TOKEN,
					{
						method: 'POST',
						body: {
							channel: testChannelId,
							text: 'Test message for update',
						},
					},
				);
				if (!postResponse.ok || !postResponse.ts) {
					throw new Error('Failed to create test message');
				}
				testMessageTs = postResponse.ts;
			}

			const response = await makeSlackRequest<ChatUpdateResponse>(
				'chat.update',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						channel: testChannelId,
						ts: testMessageTs,
						text: 'Updated message from API test',
					},
				},
			);
			const result = response;

			SlackEndpointOutputSchemas.messagesUpdate.parse(result);
		});

		it('messagesGetPermalink returns correct type', async () => {
			if (!testMessageTs) {
				const postResponse = await makeSlackRequest<ChatPostMessageResponse>(
					'chat.postMessage',
					TEST_TOKEN,
					{
						method: 'POST',
						body: {
							channel: testChannelId,
							text: 'Test message for permalink',
						},
					},
				);
				if (!postResponse.ok || !postResponse.ts) {
					throw new Error('Failed to create test message');
				}
				testMessageTs = postResponse.ts;
			}

			const response = await makeSlackRequest<ChatGetPermalinkResponse>(
				'chat.getPermalink',
				TEST_TOKEN,
				{ query: { channel: testChannelId, message_ts: testMessageTs } },
			);
			const result = response;

			SlackEndpointOutputSchemas.messagesGetPermalink.parse(result);
		});

		it('messagesDelete returns correct type', async () => {
			if (!testMessageTs) {
				const postResponse = await makeSlackRequest<ChatPostMessageResponse>(
					'chat.postMessage',
					TEST_TOKEN,
					{
						method: 'POST',
						body: {
							channel: testChannelId,
							text: 'Test message for delete',
						},
					},
				);
				if (!postResponse.ok || !postResponse.ts) {
					throw new Error('Failed to create test message');
				}
				testMessageTs = postResponse.ts;
			}

			const response = await makeSlackRequest<ChatDeleteResponse>(
				'chat.delete',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						channel: testChannelId,
						ts: testMessageTs,
					},
				},
			);
			const result = response;

			SlackEndpointOutputSchemas.messagesDelete.parse(result);
		});
	});

	describe('files', () => {
		it('filesList returns correct type', async () => {
			const response = await makeSlackRequest<FilesListResponse>(
				'files.list',
				TEST_TOKEN,
				{ query: { count: 10 } },
			);
			const result = response;

			SlackEndpointOutputSchemas.filesList.parse(result);
		});

		it('filesGet returns correct type', async () => {
			const filesListResponse = await makeSlackRequest<FilesListResponse>(
				'files.list',
				TEST_TOKEN,
				{ query: { count: 1 } },
			);
			const fileId = filesListResponse.files?.[0]?.id;
			if (!fileId) {
				throw new Error('No files found');
			}

			const response = await makeSlackRequest<FilesInfoResponse>(
				'files.info',
				TEST_TOKEN,
				{ query: { file: fileId } },
			);
			const result = response;

			SlackEndpointOutputSchemas.filesGet.parse(result);
		});
	});

	describe('reactions', () => {
		let testChannelId: string;
		let testMessageTs: string | undefined;

		beforeAll(async () => {
			if (TEST_CHANNEL) {
				testChannelId = TEST_CHANNEL;
			} else {
				const channelsListResponse =
					await makeSlackRequest<ConversationsListResponse>(
						'conversations.list',
						TEST_TOKEN,
						{ query: { limit: 1 } },
					);
				const channelId = channelsListResponse.channels?.[0]?.id;
				if (!channelId) {
					throw new Error('No channels found');
				}
				testChannelId = channelId;
			}

			const postResponse = await makeSlackRequest<ChatPostMessageResponse>(
				'chat.postMessage',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						channel: testChannelId,
						text: 'Test message for reactions',
					},
				},
			);
			if (postResponse.ok && postResponse.ts) {
				testMessageTs = postResponse.ts;
			}
		});

		it('reactionsAdd returns correct type', async () => {
			if (!testMessageTs) {
				const postResponse = await makeSlackRequest<ChatPostMessageResponse>(
					'chat.postMessage',
					TEST_TOKEN,
					{
						method: 'POST',
						body: {
							channel: testChannelId,
							text: 'Test message for adding reaction',
						},
					},
				);
				if (!postResponse.ok || !postResponse.ts) {
					throw new Error('Failed to create test message');
				}
				testMessageTs = postResponse.ts;
			}

			const reactionsGetResponse = await makeSlackRequest<ReactionsGetResponse>(
				'reactions.get',
				TEST_TOKEN,
				{ query: { channel: testChannelId, timestamp: testMessageTs } },
			);

			if (
				reactionsGetResponse.ok &&
				reactionsGetResponse.message?.reactions?.some(
					(r) => r.name === 'thumbsup',
				)
			) {
				await makeSlackRequest<ReactionsRemoveResponse>(
					'reactions.remove',
					TEST_TOKEN,
					{
						method: 'POST',
						body: {
							channel: testChannelId,
							timestamp: testMessageTs,
							name: 'thumbsup',
						},
					},
				);
			}

			const response = await makeSlackRequest<ReactionsAddResponse>(
				'reactions.add',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						channel: testChannelId,
						timestamp: testMessageTs,
						name: 'thumbsup',
					},
				},
			);
			const result = response;

			SlackEndpointOutputSchemas.reactionsAdd.parse(result);
		});

		it('reactionsGet returns correct type', async () => {
			if (!testMessageTs) {
				const postResponse = await makeSlackRequest<ChatPostMessageResponse>(
					'chat.postMessage',
					TEST_TOKEN,
					{
						method: 'POST',
						body: {
							channel: testChannelId,
							text: 'Test message for getting reactions',
						},
					},
				);
				if (!postResponse.ok || !postResponse.ts) {
					throw new Error('Failed to create test message');
				}
				testMessageTs = postResponse.ts;
			}

			const response = await makeSlackRequest<ReactionsGetResponse>(
				'reactions.get',
				TEST_TOKEN,
				{ query: { channel: testChannelId, timestamp: testMessageTs } },
			);
			const result = response;

			SlackEndpointOutputSchemas.reactionsGet.parse(result);
		});

		it('reactionsRemove returns correct type', async () => {
			if (!testMessageTs) {
				try {
					const postResponse = await makeSlackRequest<ChatPostMessageResponse>(
						'chat.postMessage',
						TEST_TOKEN,
						{
							method: 'POST',
							body: {
								channel: testChannelId,
								text: 'Test message for removing reaction',
							},
						},
					);
					if (!postResponse.ok || !postResponse.ts) {
						throw new Error('Failed to create test message');
					}
					testMessageTs = postResponse.ts;
				} catch (err) {
					console.log(err, 'error');
				}
			}

			const reactionsGetResponse = await makeSlackRequest<ReactionsGetResponse>(
				'reactions.get',
				TEST_TOKEN,
				{ query: { channel: testChannelId, timestamp: testMessageTs } },
			);

			if (
				!reactionsGetResponse.ok ||
				!reactionsGetResponse.message?.reactions?.some(
					(r) => r.name === 'thumbsup',
				)
			) {
				try {
					await makeSlackRequest<ReactionsAddResponse>(
						'reactions.add',
						TEST_TOKEN,
						{
							method: 'POST',
							body: {
								channel: testChannelId,
								timestamp: testMessageTs,
								name: 'thumbsup',
							},
						},
					);
				} catch (err) {
					console.log(err, 'error');
				}
			}

			const response = await makeSlackRequest<ReactionsRemoveResponse>(
				'reactions.remove',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						channel: testChannelId,
						timestamp: testMessageTs,
						name: 'thumbsup',
					},
				},
			);
			const result = response;

			SlackEndpointOutputSchemas.reactionsRemove.parse(result);
		});
	});

	describe('stars', () => {
		let testChannelId: string;
		let testMessageTs: string | undefined;

		beforeAll(async () => {
			if (TEST_CHANNEL) {
				testChannelId = TEST_CHANNEL;
			} else {
				const channelsListResponse =
					await makeSlackRequest<ConversationsListResponse>(
						'conversations.list',
						TEST_TOKEN,
						{ query: { limit: 1 } },
					);
				const channelId = channelsListResponse.channels?.[0]?.id;
				if (!channelId) {
					throw new Error('No channels found');
				}
				testChannelId = channelId;
			}

			const postResponse = await makeSlackRequest<ChatPostMessageResponse>(
				'chat.postMessage',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						channel: testChannelId,
						text: 'Test message for stars',
					},
				},
			);
			if (postResponse.ok && postResponse.ts) {
				testMessageTs = postResponse.ts;
			}
		});

		it('starsAdd returns correct type', async () => {
			if (!testMessageTs) {
				const postResponse = await makeSlackRequest<ChatPostMessageResponse>(
					'chat.postMessage',
					TEST_TOKEN,
					{
						method: 'POST',
						body: {
							channel: testChannelId,
							text: 'Test message for adding star',
						},
					},
				);
				if (!postResponse.ok || !postResponse.ts) {
					throw new Error('Failed to create test message');
				}
				testMessageTs = postResponse.ts;
			}

			const response = await makeSlackRequest<StarsAddResponse>(
				'stars.add',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						channel: testChannelId,
						timestamp: testMessageTs,
					},
				},
			);
			const result = response;

			SlackEndpointOutputSchemas.starsAdd.parse(result);
		});

		it('starsList returns correct type', async () => {
			const response = await makeSlackRequest<StarsListResponse>(
				'stars.list',
				TEST_TOKEN,
				{ query: { count: 10 } },
			);
			const result = response;

			SlackEndpointOutputSchemas.starsList.parse(result);
		});

		it('starsRemove returns correct type', async () => {
			if (!testMessageTs) {
				const postResponse = await makeSlackRequest<ChatPostMessageResponse>(
					'chat.postMessage',
					TEST_TOKEN,
					{
						method: 'POST',
						body: {
							channel: testChannelId,
							text: 'Test message for removing star',
						},
					},
				);
				if (!postResponse.ok || !postResponse.ts) {
					throw new Error('Failed to create test message');
				}
				testMessageTs = postResponse.ts;
			}

			await makeSlackRequest<StarsAddResponse>('stars.add', TEST_TOKEN, {
				method: 'POST',
				body: {
					channel: testChannelId,
					timestamp: testMessageTs,
				},
			});

			const response = await makeSlackRequest<StarsRemoveResponse>(
				'stars.remove',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						channel: testChannelId,
						timestamp: testMessageTs,
					},
				},
			);
			const result = response;

			SlackEndpointOutputSchemas.starsRemove.parse(result);
		});
	});

	describe('userGroups', () => {
		let testUserGroupId: string | undefined;

		it('userGroupsList returns correct type', async () => {
			const response = await makeSlackRequest<UsergroupsListResponse>(
				'usergroups.list',
				TEST_TOKEN,
			);
			const result = response;
			console.log(result, 'result');

			if (
				result.ok &&
				result.userGroups &&
				result.userGroups.length > 0 &&
				result.userGroups[0]?.id
			) {
				testUserGroupId = result.userGroups[0].id;
			}

			SlackEndpointOutputSchemas.userGroupsList.parse(result);
		});

		it('userGroupsCreate returns correct type', async () => {
			const userGroupName = `test-usergroup-${Date.now()}`;
			const response = await makeSlackRequest<UsergroupsCreateResponse>(
				'usergroups.create',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						name: userGroupName,
					},
				},
			);
			const result = response;

			if (result.ok && result.usergroup) {
				testUserGroupId = result.usergroup.id;
			}

			SlackEndpointOutputSchemas.userGroupsCreate.parse(result);
		});

		it('userGroupsUpdate returns correct type', async () => {
			if (!testUserGroupId) {
				const createResponse = await makeSlackRequest<UsergroupsCreateResponse>(
					'usergroups.create',
					TEST_TOKEN,
					{
						method: 'POST',
						body: {
							name: `test-usergroup-update-${Date.now()}`,
						},
					},
				);
				if (!createResponse.ok || !createResponse.usergroup) {
					throw new Error('Failed to create test user group');
				}
				testUserGroupId = createResponse.usergroup.id;
			}

			if (!testUserGroupId) {
				throw new Error('No user group ID available for update test');
			}

			const response = await makeSlackRequest<UsergroupsUpdateResponse>(
				'usergroups.update',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						usergroup: testUserGroupId,
						description: 'Updated description from API test',
					},
				},
			);
			const result = response;

			SlackEndpointOutputSchemas.userGroupsUpdate.parse(result);
		});
	});
});
