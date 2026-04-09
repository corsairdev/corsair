import 'dotenv/config';
import { makeTeamsRequest } from './client';
import type {
	ChannelsCreateResponse,
	ChannelsDeleteResponse,
	ChannelsGetResponse,
	ChannelsListResponse,
	ChannelsUpdateResponse,
	ChatsCreateResponse,
	ChatsGetResponse,
	ChatsListMessagesResponse,
	ChatsListResponse,
	ChatsSendMessageResponse,
	MembersAddResponse,
	MembersGetResponse,
	MembersListResponse,
	MembersRemoveResponse,
	MessagesDeleteResponse,
	MessagesGetResponse,
	MessagesListRepliesResponse,
	MessagesListResponse,
	MessagesReplyResponse,
	MessagesSendResponse,
	TeamsCreateResponse,
	TeamsDeleteResponse,
	TeamsGetResponse,
	TeamsListResponse,
	TeamsUpdateResponse,
} from './endpoints/types';
import { TeamsEndpointOutputSchemas } from './endpoints/types';

const ACCESS_TOKEN = process.env.TEAMS_ACCESS_TOKEN!;
const TEST_TEAM_ID = process.env.TEST_TEAMS_TEAM_ID;
const TEST_CHANNEL_ID = process.env.TEST_TEAMS_CHANNEL_ID;
const TEST_USER_ID = process.env.TEST_TEAMS_USER_ID;
const TEST_CHAT_ID = process.env.TEST_TEAMS_CHAT_ID;

describe('Teams API Type Tests', () => {
	describe('teams', () => {
		it('teamsList returns correct type', async () => {
			const result = await makeTeamsRequest<TeamsListResponse>(
				'teams',
				ACCESS_TOKEN,
				{
					method: 'GET',
					query: { $top: 5 },
				},
			);

			TeamsEndpointOutputSchemas.teamsList.parse(result);
		});

		it('teamsGet returns correct type', async () => {
			let teamId = TEST_TEAM_ID;
			if (!teamId) {
				const listResult = await makeTeamsRequest<TeamsListResponse>(
					'teams',
					ACCESS_TOKEN,
					{
						method: 'GET',
						query: { $top: 1 },
					},
				);
				teamId = listResult.value?.[0]?.id;
				if (!teamId) {
					throw new Error('No teams found');
				}
			}

			const result = await makeTeamsRequest<TeamsGetResponse>(
				`teams/${teamId}`,
				ACCESS_TOKEN,
			);

			TeamsEndpointOutputSchemas.teamsGet.parse(result);
		});

		it('teamsCreate returns correct type', async () => {
			const result = await makeTeamsRequest<TeamsCreateResponse>(
				'teams',
				ACCESS_TOKEN,
				{
					method: 'POST',
					body: {
						'template@odata.bind':
							"https://graph.microsoft.com/v1.0/teamsTemplates('standard')",
						displayName: `Test Team ${Date.now()}`,
						description: 'Created by API test',
						visibility: 'private',
					},
				},
			);

			TeamsEndpointOutputSchemas.teamsCreate.parse(result);
		});

		it('teamsUpdate returns correct type', async () => {
			let teamId = TEST_TEAM_ID;
			if (!teamId) {
				const listResult = await makeTeamsRequest<TeamsListResponse>(
					'teams',
					ACCESS_TOKEN,
					{
						method: 'GET',
						query: { $top: 1 },
					},
				);
				teamId = listResult.value?.[0]?.id;
				if (!teamId) throw new Error('No teams found');
			}

			const result = await makeTeamsRequest<TeamsUpdateResponse>(
				`teams/${teamId}`,
				ACCESS_TOKEN,
				{
					method: 'PATCH',
					body: {
						description: `Updated by API test at ${new Date().toISOString()}`,
					},
				},
			);

			TeamsEndpointOutputSchemas.teamsUpdate.parse(result);
		});

		it('teamsDelete returns correct type', async () => {
			if (!TEST_TEAM_ID) {
				console.warn(
					'teamsDelete: set TEST_TEAMS_TEAM_ID to test deletion against a disposable team',
				);
				return;
			}

			const result = await makeTeamsRequest<TeamsDeleteResponse>(
				`teams/${TEST_TEAM_ID}`,
				ACCESS_TOKEN,
				{
					method: 'DELETE',
				},
			);

			TeamsEndpointOutputSchemas.teamsDelete.parse(result);
		});
	});

	describe('channels', () => {
		let teamId: string;

		beforeAll(async () => {
			if (TEST_TEAM_ID) {
				teamId = TEST_TEAM_ID;
			} else {
				const listResult = await makeTeamsRequest<TeamsListResponse>(
					'teams',
					ACCESS_TOKEN,
					{
						method: 'GET',
						query: { $top: 1 },
					},
				);
				const id = listResult.value?.[0]?.id;
				if (!id) {
					throw new Error('No teams found');
				}
				teamId = id;
			}
		});

		it('channelsList returns correct type', async () => {
			const result = await makeTeamsRequest<ChannelsListResponse>(
				`teams/${teamId}/channels`,
				ACCESS_TOKEN,
			);

			TeamsEndpointOutputSchemas.channelsList.parse(result);
		});

		it('channelsGet returns correct type', async () => {
			let channelId = TEST_CHANNEL_ID;
			if (!channelId) {
				const listResult = await makeTeamsRequest<ChannelsListResponse>(
					`teams/${teamId}/channels`,
					ACCESS_TOKEN,
				);
				channelId = listResult.value?.[0]?.id;
				if (!channelId) {
					throw new Error('No channels found');
				}
			}

			const result = await makeTeamsRequest<ChannelsGetResponse>(
				`teams/${teamId}/channels/${channelId}`,
				ACCESS_TOKEN,
			);

			TeamsEndpointOutputSchemas.channelsGet.parse(result);
		});

		it('channelsCreate returns correct type', async () => {
			const result = await makeTeamsRequest<ChannelsCreateResponse>(
				`teams/${teamId}/channels`,
				ACCESS_TOKEN,
				{
					method: 'POST',
					body: {
						displayName: `Test Channel ${Date.now()}`,
						description: 'Created by API test',
						membershipType: 'standard',
					},
				},
			);

			TeamsEndpointOutputSchemas.channelsCreate.parse(result);
		});

		it('channelsUpdate returns correct type', async () => {
			let channelId = TEST_CHANNEL_ID;
			if (!channelId) {
				const listResult = await makeTeamsRequest<ChannelsListResponse>(
					`teams/${teamId}/channels`,
					ACCESS_TOKEN,
				);
				channelId = listResult.value?.[0]?.id;
				if (!channelId) throw new Error('No channels found');
			}

			const result = await makeTeamsRequest<ChannelsUpdateResponse>(
				`teams/${teamId}/channels/${channelId}`,
				ACCESS_TOKEN,
				{
					method: 'PATCH',
					body: {
						description: `Updated by API test at ${new Date().toISOString()}`,
					},
				},
			);

			TeamsEndpointOutputSchemas.channelsUpdate.parse(result);
		});

		it('channelsDelete returns correct type', async () => {
			// Create a disposable channel to delete
			const created = await makeTeamsRequest<ChannelsCreateResponse>(
				`teams/${teamId}/channels`,
				ACCESS_TOKEN,
				{
					method: 'POST',
					body: {
						displayName: `Delete Test ${Date.now()}`,
						description: 'Created for delete test',
						membershipType: 'standard',
					},
				},
			);
			if (!created.id)
				throw new Error('Failed to create channel for delete test');

			const result = await makeTeamsRequest<ChannelsDeleteResponse>(
				`teams/${teamId}/channels/${created.id}`,
				ACCESS_TOKEN,
				{ method: 'DELETE' },
			);

			TeamsEndpointOutputSchemas.channelsDelete.parse(result);
		});
	});

	describe('messages', () => {
		let teamId: string;
		let channelId: string;
		let testMessageId: string | undefined;

		beforeAll(async () => {
			if (TEST_TEAM_ID && TEST_CHANNEL_ID) {
				teamId = TEST_TEAM_ID;
				channelId = TEST_CHANNEL_ID;
			} else {
				const teamsResult = await makeTeamsRequest<TeamsListResponse>(
					'teams',
					ACCESS_TOKEN,
					{
						method: 'GET',
						query: { $top: 1 },
					},
				);
				const tId = teamsResult.value?.[0]?.id;
				if (!tId) {
					throw new Error('No teams found');
				}
				teamId = tId;

				const channelsResult = await makeTeamsRequest<ChannelsListResponse>(
					`teams/${teamId}/channels`,
					ACCESS_TOKEN,
				);
				const cId = channelsResult.value?.[0]?.id;
				if (!cId) {
					throw new Error('No channels found');
				}
				channelId = cId;
			}

			const sendResult = await makeTeamsRequest<MessagesSendResponse>(
				`teams/${teamId}/channels/${channelId}/messages`,
				ACCESS_TOKEN,
				{
					method: 'POST',
					body: {
						body: {
							content: 'Test message for API tests',
							contentType: 'text',
						},
					},
				},
			);
			if (sendResult.id) {
				testMessageId = sendResult.id;
			}
		});

		it('messagesList returns correct type', async () => {
			const result = await makeTeamsRequest<MessagesListResponse>(
				`teams/${teamId}/channels/${channelId}/messages`,
				ACCESS_TOKEN,
				{ query: { $top: 5 } },
			);

			TeamsEndpointOutputSchemas.messagesList.parse(result);
		});

		it('messagesGet returns correct type', async () => {
			if (!testMessageId) {
				const listResult = await makeTeamsRequest<MessagesListResponse>(
					`teams/${teamId}/channels/${channelId}/messages`,
					ACCESS_TOKEN,
					{ query: { $top: 1 } },
				);
				testMessageId = listResult.value?.[0]?.id;
				if (!testMessageId) {
					throw new Error('No messages found');
				}
			}

			const result = await makeTeamsRequest<MessagesGetResponse>(
				`teams/${teamId}/channels/${channelId}/messages/${testMessageId}`,
				ACCESS_TOKEN,
			);

			TeamsEndpointOutputSchemas.messagesGet.parse(result);
		});

		it('messagesSend returns correct type', async () => {
			const result = await makeTeamsRequest<MessagesSendResponse>(
				`teams/${teamId}/channels/${channelId}/messages`,
				ACCESS_TOKEN,
				{
					method: 'POST',
					body: {
						body: {
							content: 'Test message from API test',
							contentType: 'text',
						},
					},
				},
			);

			if (result.id) {
				testMessageId = result.id;
			}

			TeamsEndpointOutputSchemas.messagesSend.parse(result);
		});

		it('messagesReply returns correct type', async () => {
			if (!testMessageId) {
				const sendResult = await makeTeamsRequest<MessagesSendResponse>(
					`teams/${teamId}/channels/${channelId}/messages`,
					ACCESS_TOKEN,
					{
						method: 'POST',
						body: {
							body: { content: 'Test message for reply', contentType: 'text' },
						},
					},
				);
				if (!sendResult.id) {
					throw new Error('Failed to create test message for reply');
				}
				testMessageId = sendResult.id;
			}

			const result = await makeTeamsRequest<MessagesReplyResponse>(
				`teams/${teamId}/channels/${channelId}/messages/${testMessageId}/replies`,
				ACCESS_TOKEN,
				{
					method: 'POST',
					body: {
						body: { content: 'Test reply from API test', contentType: 'text' },
					},
				},
			);

			TeamsEndpointOutputSchemas.messagesReply.parse(result);
		});

		it('messagesListReplies returns correct type', async () => {
			if (!testMessageId) {
				throw new Error('No test message available');
			}

			const result = await makeTeamsRequest<MessagesListRepliesResponse>(
				`teams/${teamId}/channels/${channelId}/messages/${testMessageId}/replies`,
				ACCESS_TOKEN,
			);

			TeamsEndpointOutputSchemas.messagesListReplies.parse(result);
		});

		it('messagesDelete returns correct type', async () => {
			// Create a disposable message to delete
			const created = await makeTeamsRequest<MessagesSendResponse>(
				`teams/${teamId}/channels/${channelId}/messages`,
				ACCESS_TOKEN,
				{
					method: 'POST',
					body: {
						body: { content: 'Test message to delete', contentType: 'text' },
					},
				},
			);
			if (!created.id)
				throw new Error('Failed to create message for delete test');

			const result = await makeTeamsRequest<MessagesDeleteResponse>(
				`teams/${teamId}/channels/${channelId}/messages/${created.id}`,
				ACCESS_TOKEN,
				{ method: 'DELETE' },
			);

			TeamsEndpointOutputSchemas.messagesDelete.parse(result);
		});
	});

	describe('members', () => {
		let teamId: string;

		beforeAll(async () => {
			if (TEST_TEAM_ID) {
				teamId = TEST_TEAM_ID;
			} else {
				const teamsResult = await makeTeamsRequest<TeamsListResponse>(
					'teams',
					ACCESS_TOKEN,
					{
						method: 'GET',
						query: { $top: 1 },
					},
				);
				const id = teamsResult.value?.[0]?.id;
				if (!id) {
					throw new Error('No teams found');
				}
				teamId = id;
			}
		});

		it('membersList returns correct type', async () => {
			const result = await makeTeamsRequest<MembersListResponse>(
				`teams/${teamId}/members`,
				ACCESS_TOKEN,
			);

			TeamsEndpointOutputSchemas.membersList.parse(result);
		});

		it('membersGet returns correct type', async () => {
			const listResult = await makeTeamsRequest<MembersListResponse>(
				`teams/${teamId}/members`,
				ACCESS_TOKEN,
			);
			const membershipId = listResult.value?.[0]?.id;
			if (!membershipId) {
				throw new Error('No members found');
			}

			const result = await makeTeamsRequest<MembersGetResponse>(
				`teams/${teamId}/members/${membershipId}`,
				ACCESS_TOKEN,
			);

			TeamsEndpointOutputSchemas.membersGet.parse(result);
		});

		it('membersAdd returns correct type', async () => {
			let userId = TEST_USER_ID;
			if (!userId) {
				const [orgUsers, existingMembers] = await Promise.all([
					makeTeamsRequest<{ value: Array<{ id: string }> }>(
						'users',
						ACCESS_TOKEN,
						{
							query: { $top: 999, $select: 'id' },
						},
					),
					makeTeamsRequest<MembersListResponse>(
						`teams/${teamId}/members`,
						ACCESS_TOKEN,
					),
				]);
				const memberUserIds = new Set(
					existingMembers.value.map((m) => m.userId).filter(Boolean),
				);
				const candidate = orgUsers.value.find((u) => !memberUserIds.has(u.id));
				if (!candidate) {
					console.warn(
						'membersAdd: all org users are already team members, skipping',
					);
					return;
				}
				userId = candidate.id;
			}

			const result = await makeTeamsRequest<MembersAddResponse>(
				`teams/${teamId}/members`,
				ACCESS_TOKEN,
				{
					method: 'POST',
					body: {
						'@odata.type': '#microsoft.graph.aadUserConversationMember',
						roles: ['member'],
						'user@odata.bind': `https://graph.microsoft.com/v1.0/users('${userId}')`,
					},
				},
			);

			TeamsEndpointOutputSchemas.membersAdd.parse(result);
		});

		it('membersRemove returns correct type', async () => {
			// Find a non-member user to add temporarily, then remove
			const [orgUsers, existingMembers] = await Promise.all([
				makeTeamsRequest<{ value: Array<{ id: string }> }>(
					'users',
					ACCESS_TOKEN,
					{
						query: { $top: 999, $select: 'id' },
					},
				),
				makeTeamsRequest<MembersListResponse>(
					`teams/${teamId}/members`,
					ACCESS_TOKEN,
				),
			]);
			const memberUserIds = new Set(
				existingMembers.value.map((m) => m.userId).filter(Boolean),
			);
			const userId =
				TEST_USER_ID ??
				orgUsers.value.find((u) => !memberUserIds.has(u.id))?.id;
			if (!userId) {
				console.warn('membersRemove: no available non-member users, skipping');
				return;
			}

			const added = await makeTeamsRequest<MembersAddResponse>(
				`teams/${teamId}/members`,
				ACCESS_TOKEN,
				{
					method: 'POST',
					body: {
						'@odata.type': '#microsoft.graph.aadUserConversationMember',
						roles: ['member'],
						'user@odata.bind': `https://graph.microsoft.com/v1.0/users('${userId}')`,
					},
				},
			);
			if (!added.id) throw new Error('Failed to add member for remove test');

			const result = await makeTeamsRequest<MembersRemoveResponse>(
				`teams/${teamId}/members/${added.id}`,
				ACCESS_TOKEN,
				{ method: 'DELETE' },
			);

			TeamsEndpointOutputSchemas.membersRemove.parse(result);
		});
	});

	describe('chats', () => {
		let testChatId: string;

		beforeAll(async () => {
			if (TEST_CHAT_ID) {
				testChatId = TEST_CHAT_ID;
				return;
			}
			const listResult = await makeTeamsRequest<ChatsListResponse>(
				'chats',
				ACCESS_TOKEN,
				{
					method: 'GET',
					query: { $top: 1 },
				},
			);
			const id = listResult.value?.[0]?.id;
			if (id) {
				testChatId = id;
			}
		});

		it('chatsList returns correct type', async () => {
			const result = await makeTeamsRequest<ChatsListResponse>(
				'chats',
				ACCESS_TOKEN,
				{
					method: 'GET',
					query: { $top: 5 },
				},
			);

			TeamsEndpointOutputSchemas.chatsList.parse(result);
		});

		it('chatsGet returns correct type', async () => {
			if (!testChatId) {
				throw new Error(
					'No chat available — set TEST_TEAMS_CHAT_ID or ensure chatsList returns results',
				);
			}

			const result = await makeTeamsRequest<ChatsGetResponse>(
				`chats/${testChatId}`,
				ACCESS_TOKEN,
			);

			TeamsEndpointOutputSchemas.chatsGet.parse(result);
		});

		it('chatsCreate returns correct type', async () => {
			let myId: string;
			let otherUserId = TEST_USER_ID;
			const me = await makeTeamsRequest<{ id: string }>('me', ACCESS_TOKEN);
			myId = me.id;
			if (!otherUserId) {
				const orgUsers = await makeTeamsRequest<{
					value: Array<{ id: string }>;
				}>('users', ACCESS_TOKEN, {
					query: { $top: 5, $select: 'id' },
				});
				const other = orgUsers.value.find((u) => u.id !== myId);
				if (!other) {
					throw new Error('No other user found to create chat with');
				}
				otherUserId = other.id;
			}

			const result = await makeTeamsRequest<ChatsCreateResponse>(
				'chats',
				ACCESS_TOKEN,
				{
					method: 'POST',
					body: {
						chatType: 'oneOnOne',
						members: [
							{
								'@odata.type': '#microsoft.graph.aadUserConversationMember',
								roles: ['owner'],
								'user@odata.bind': `https://graph.microsoft.com/v1.0/users('${myId}')`,
							},
							{
								'@odata.type': '#microsoft.graph.aadUserConversationMember',
								roles: ['owner'],
								'user@odata.bind': `https://graph.microsoft.com/v1.0/users('${otherUserId}')`,
							},
						],
					},
				},
			);

			if (result.id) {
				testChatId = result.id;
			}

			TeamsEndpointOutputSchemas.chatsCreate.parse(result);
		});

		it('chatsListMessages returns correct type', async () => {
			if (!testChatId) {
				throw new Error('No chat available');
			}

			const result = await makeTeamsRequest<ChatsListMessagesResponse>(
				`chats/${testChatId}/messages`,
				ACCESS_TOKEN,
				{ query: { $top: 5 } },
			);

			TeamsEndpointOutputSchemas.chatsListMessages.parse(result);
		});

		it('chatsSendMessage returns correct type', async () => {
			if (!testChatId) {
				throw new Error('No chat available');
			}

			const result = await makeTeamsRequest<ChatsSendMessageResponse>(
				`chats/${testChatId}/messages`,
				ACCESS_TOKEN,
				{
					method: 'POST',
					body: {
						body: {
							content: 'Test message from API test',
							contentType: 'text',
						},
					},
				},
			);

			TeamsEndpointOutputSchemas.chatsSendMessage.parse(result);
		});
	});
});
