import dotenv from 'dotenv';
import { makeTeamsRequest } from './client';
import type {
	TeamsListResponse,
	TeamsGetResponse,
	TeamsCreateResponse,
	ChannelsListResponse,
	ChannelsGetResponse,
	ChannelsCreateResponse,
	MessagesListResponse,
	MessagesGetResponse,
	MessagesSendResponse,
	MessagesReplyResponse,
	MessagesListRepliesResponse,
	MembersListResponse,
	MembersGetResponse,
	MembersAddResponse,
	ChatsListResponse,
	ChatsGetResponse,
	ChatsCreateResponse,
	ChatsListMessagesResponse,
	ChatsSendMessageResponse,
} from './endpoints/types';
import { TeamsEndpointOutputSchemas } from './endpoints/types';

dotenv.config();

const ACCESS_TOKEN = process.env.TEAMS_ACCESS_TOKEN!;
const TEST_TEAM_ID = process.env.TEST_TEAMS_TEAM_ID;
const TEST_CHANNEL_ID = process.env.TEST_TEAMS_CHANNEL_ID;
const TEST_USER_ID = process.env.TEST_TEAMS_USER_ID;
const TEST_CHAT_ID = process.env.TEST_TEAMS_CHAT_ID;

describe('Teams API Type Tests', () => {
	describe('teams', () => {
		it('teamsList returns correct type', async () => {
			const result = await makeTeamsRequest<TeamsListResponse>('teams', ACCESS_TOKEN, {
				method: 'GET',
				query: { '$top': 5 },
			});

			TeamsEndpointOutputSchemas.teamsList.parse(result);
		});

		it('teamsGet returns correct type', async () => {
			let teamId = TEST_TEAM_ID;
			if (!teamId) {
				const listResult = await makeTeamsRequest<TeamsListResponse>('teams', ACCESS_TOKEN, {
					method: 'GET',
					query: { '$top': 1 },
				});
				teamId = listResult.value?.[0]?.id;
				if (!teamId) {
					throw new Error('No teams found');
				}
			}

			const result = await makeTeamsRequest<TeamsGetResponse>(`teams/${teamId}`, ACCESS_TOKEN);

			TeamsEndpointOutputSchemas.teamsGet.parse(result);
		});

		it('teamsCreate returns correct type', async () => {
			const result = await makeTeamsRequest<TeamsCreateResponse>('teams', ACCESS_TOKEN, {
				method: 'POST',
				body: {
					displayName: `Test Team ${Date.now()}`,
					description: 'Created by API test',
					visibility: 'private',
				},
			});

			TeamsEndpointOutputSchemas.teamsCreate.parse(result);
		});
	});

	describe('channels', () => {
		let teamId: string;

		beforeAll(async () => {
			if (TEST_TEAM_ID) {
				teamId = TEST_TEAM_ID;
			} else {
				const listResult = await makeTeamsRequest<TeamsListResponse>('teams', ACCESS_TOKEN, {
					method: 'GET',
					query: { '$top': 1 },
				});
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
				const teamsResult = await makeTeamsRequest<TeamsListResponse>('teams', ACCESS_TOKEN, {
					method: 'GET',
					query: { '$top': 1 },
				});
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
						body: { content: 'Test message for API tests', contentType: 'text' },
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
				{ query: { '$top': 5 } },
			);

			TeamsEndpointOutputSchemas.messagesList.parse(result);
		});

		it('messagesGet returns correct type', async () => {
			if (!testMessageId) {
				const listResult = await makeTeamsRequest<MessagesListResponse>(
					`teams/${teamId}/channels/${channelId}/messages`,
					ACCESS_TOKEN,
					{ query: { '$top': 1 } },
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
						body: { content: 'Test message from API test', contentType: 'text' },
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
						body: { body: { content: 'Test message for reply', contentType: 'text' } },
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
	});

	describe('members', () => {
		let teamId: string;

		beforeAll(async () => {
			if (TEST_TEAM_ID) {
				teamId = TEST_TEAM_ID;
			} else {
				const teamsResult = await makeTeamsRequest<TeamsListResponse>('teams', ACCESS_TOKEN, {
					method: 'GET',
					query: { '$top': 1 },
				});
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
			const userId = TEST_USER_ID;
			if (!userId) {
				throw new Error('TEST_TEAMS_USER_ID env var required for membersAdd test');
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
	});

	describe('chats', () => {
		let testChatId: string;

		beforeAll(async () => {
			if (TEST_CHAT_ID) {
				testChatId = TEST_CHAT_ID;
				return;
			}
			const listResult = await makeTeamsRequest<ChatsListResponse>('chats', ACCESS_TOKEN, {
				method: 'GET',
				query: { '$top': 1 },
			});
			const id = listResult.value?.[0]?.id;
			if (id) {
				testChatId = id;
			}
		});

		it('chatsList returns correct type', async () => {
			const result = await makeTeamsRequest<ChatsListResponse>('chats', ACCESS_TOKEN, {
				method: 'GET',
				query: { '$top': 5 },
			});

			TeamsEndpointOutputSchemas.chatsList.parse(result);
		});

		it('chatsGet returns correct type', async () => {
			if (!testChatId) {
				throw new Error('No chat available — set TEST_TEAMS_CHAT_ID or ensure chatsList returns results');
			}

			const result = await makeTeamsRequest<ChatsGetResponse>(
				`chats/${testChatId}`,
				ACCESS_TOKEN,
			);

			TeamsEndpointOutputSchemas.chatsGet.parse(result);
		});

		it('chatsCreate returns correct type', async () => {
			const userId = TEST_USER_ID;
			if (!userId) {
				throw new Error('TEST_TEAMS_USER_ID env var required for chatsCreate test');
			}

			const result = await makeTeamsRequest<ChatsCreateResponse>('chats', ACCESS_TOKEN, {
				method: 'POST',
				body: {
					chatType: 'oneOnOne',
					members: [
						{
							'@odata.type': '#microsoft.graph.aadUserConversationMember',
							roles: ['owner'],
							'user@odata.bind': `https://graph.microsoft.com/v1.0/users('${userId}')`,
						},
					],
				},
			});

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
				{ query: { '$top': 5 } },
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
						body: { content: 'Test message from API test', contentType: 'text' },
					},
				},
			);

			TeamsEndpointOutputSchemas.chatsSendMessage.parse(result);
		});
	});
});
